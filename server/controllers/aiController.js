import getAi from '../config/ai.js';
import parsePDF from '../utils/pdfParser.cjs';

// Single source of truth for the model, overridable per-deployment.
// Was hardcoded as "gemini-1.5-flash" in three places; that model has since been retired and now
// returns 404 "not found for API version v1main", which failed every AI request. Verified
// 2026-07-26: gemini-1.5-flash -> 404, gemini-2.5-flash -> 200.
// ponytail: pinned to a specific version rather than the `gemini-flash-latest` alias, so a
// provider-side model change cannot silently alter output. Bump deliberately.
const MODEL = process.env.OPENAI_MODEL || 'gemini-2.5-flash';

const cleanJson = (text) => {
  if (!text) return '{}';
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

// The model is instructed to return this shape, but it is a language model, not a contract.
// Validate structurally before trusting it. Checks presence and type — an earlier `!analysis.score`
// test rejected a legitimate score of 0 as "invalid structure".
export const isValidAnalysis = (analysis) => {
  if (!analysis || typeof analysis !== 'object') return false;
  if (typeof analysis.score !== 'number' || Number.isNaN(analysis.score)) return false;
  if (analysis.score < 0 || analysis.score > 100) return false;
  if (!analysis.categories || typeof analysis.categories !== 'object') return false;
  if (!analysis.keywords || typeof analysis.keywords !== 'object') return false;
  return ['missing', 'present'].every((k) => Array.isArray(analysis.keywords[k]));
};

export const enhanceProfessionalSummary = async (req, res, next) => {
  const { currentSummary } = req.body;
  if (!currentSummary) return res.status(400).json({ message: 'Content is required' });

  try {
    const completion = await getAi().chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert resume consultant. Rewrite the following professional summary to be more impactful, concise, and ATS-friendly. Return plain text." 
        },
        { role: "user", content: currentSummary }
      ],
    });

    res.json({ enhancedContent: completion.choices[0].message.content });
  } catch (error) {
    console.error('Summary Enhance Error:', error);
    // 503 when the provider is unconfigured, otherwise a generic failure.
    if (error.status === 503) return next(error);
    res.status(502).json({ message: 'AI enhancement is temporarily unavailable.' });
  }
};

export const enhanceJobDescription = async (req, res, next) => {
  const { description, role, company } = req.body;
  const inputDesc = Array.isArray(description) ? description.join('\n') : description;

  if (!inputDesc) return res.status(400).json({ message: 'Description is required' });

  try {
    const prompt = `Rewrite the following job description for the role of ${role} at ${company}.
    Focus on achievements and metrics.
    Return the result as a JSON array of strings, where each string is a bullet point.
    Example: ["Increased sales by 20%", "Managed team of 5"]`;

    const completion = await getAi().chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: "You are an expert resume writer. Output ONLY JSON." },
        { role: "user", content: `${prompt}\n\n${inputDesc}` }
      ],
    });

    const enhancedContent = JSON.parse(cleanJson(completion.choices[0].message.content));
    // The model is told to return a JSON array of bullet strings; the client assigns the result
    // straight into `description`, so reject anything that is not that shape.
    if (!Array.isArray(enhancedContent) || !enhancedContent.every((b) => typeof b === 'string')) {
      return res.status(502).json({ message: 'AI returned an unexpected format. Please try again.' });
    }
    res.json({ enhancedContent });
  } catch (error) {
    console.error('Job Enhance Error:', error);
    if (error.status === 503) return next(error);
    res.status(502).json({ message: 'AI enhancement is temporarily unavailable.' });
  }
};

export const analyzeResume = async (req, res, next) => {
  try {
    const { jobDescription } = req.body;
    let resumeText = '';

    // Handle PDF Upload
    if (req.file) {
      console.log('Processing PDF file:', req.file.originalname, 'Size:', req.file.size);
      
      try {
        // Validate buffer exists
        if (!req.file.buffer) {
          throw new Error('File buffer is empty');
        }

        // Use the CJS utility
        console.log('Calling parsePDF function...');
        const pdfData = await parsePDF(req.file.buffer);
        resumeText = pdfData.text;
        
        console.log('PDF Text Extracted successfully, length:', resumeText.length);
        
        // Validate extracted text
        if (!resumeText || resumeText.trim().length === 0) {
          throw new Error('No text could be extracted from PDF');
        }
        
      } catch (parseError) {
        console.error('PDF Parse Error:', parseError);
        return res.status(500).json( {
          message: `Failed to read PDF file: ${parseError.message}. Please ensure the PDF contains selectable text.` 
        });
      }
    } else if (req.body.resumeText) {
      resumeText = req.body.resumeText;
      console.log('Using provided resume text, length:', resumeText.length);
    } else {
      return res.status(400).json( {
        message: 'Resume file (PDF) or text is required' 
      });
    }

    if (!jobDescription) {
      return res.status(400).json({ message: 'Job description is required' });
    }

    // Limit text length to avoid token limits
    const truncatedResume = resumeText.slice(0, 15000);
    const truncatedJob = jobDescription.slice(0, 5000);

    const systemPrompt = `You are an advanced ATS (Applicant Tracking System) simulator.
Analyze the provided RESUME against the JOB DESCRIPTION.
Return a detailed JSON object with this EXACT structure:

{
  "score": <number between 0-100>,
  "summary": "<brief overall summary string>",
  "categories": {
    "tone_style": { 
      "score": <number 0-100>, 
      "feedback": ["<positive point 1>", "<improvement 1>"] 
    },
    "content": { 
      "score": <number 0-100>, 
      "feedback": ["<positive point 1>", "<improvement 1>"] 
    },
    "structure": {
      "score": <number 0-100>,
      "feedback": ["<positive point 1>", "<improvement 1>"] 
    },
    "skills": {
      "score": <number 0-100>,
      "feedback": ["<positive point 1>", "<improvement 1>"] 
    }
  },
  "keywords": {
    "missing": ["<keyword1>", "<keyword2>"],
    "present": ["<keyword1>", "<keyword2>"]
  },
  "improvements": [
    "<Critical Fix 1 (e.g. Formatting errors, Major content gaps)>",
    "<Critical Fix 2>"
  ],
  "suggestions": [
    "<Bonus Tip 1 (e.g. How to stand out, Advanced optimization)>",
    "<Bonus Tip 2>"
  ]
}

IMPORTANT: 
1. Use **bold** markdown for key terms in your feedback strings.
2. Be specific and actionable.
3. 'Improvements' are for fixing mistakes. 'Suggestions' are for taking it to the next level.`;

    console.log('Sending to Gemini for ATS analysis...');
    
    const completion = await getAi().chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user", 
          content: `JOB DESCRIPTION:\n${truncatedJob}\n\nRESUME TEXT:\n${truncatedResume}` 
        }
      ],
      temperature: 0.7,
    });

    const responseContent = completion.choices[0].message.content;
    console.log('Gemini Response received, parsing JSON...');

    try {
      const analysis = JSON.parse(cleanJson(responseContent));

      if (!isValidAnalysis(analysis)) {
        throw new Error('Invalid response structure from AI');
      }

      console.log('ATS Analysis completed successfully. Score:', analysis.score);
      res.json(analysis);
      
    } catch (jsonError) {
      console.error('JSON Parse Error:', jsonError);
      console.log('Raw AI Response:', responseContent);
      return res.status(500).json( {
        message: 'Failed to parse AI response. Please try again.',
        debug: process.env.NODE_ENV === 'development' ? responseContent : undefined
      });
    }

  } catch (error) {
    // Was interpolating the raw provider error into the response body, which could surface
    // upstream request details to the client. Log it server-side; hand a clean status outward.
    console.error('Analysis Error:', error);
    next(error);
  }
};