import ai from '../config/ai.js';
import parsePDF from '../utils/pdfParser.cjs';

const cleanJson = (text) => {
  if (!text) return '{}';
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const enhanceProfessionalSummary = async (req, res) => {
  const { currentSummary } = req.body;
  if (!currentSummary) return res.status(400).json({ message: 'Content is required' });

  try {
    const completion = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gemini-1.5-flash",
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
    res.status(500).json({ message: 'AI Enhancement failed' });
  }
};

export const enhanceJobDescription = async (req, res) => {
  const { description, role, company } = req.body;
  const inputDesc = Array.isArray(description) ? description.join('\n') : description;

  if (!inputDesc) return res.status(400).json({ message: 'Description is required' });

  try {
    const prompt = `Rewrite the following job description for the role of ${role} at ${company}.
    Focus on achievements and metrics.
    Return the result as a JSON array of strings, where each string is a bullet point.
    Example: ["Increased sales by 20%", "Managed team of 5"]`;

    const completion = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gemini-1.5-flash",
      messages: [
        { role: "system", content: "You are an expert resume writer. Output ONLY JSON." },
        { role: "user", content: `${prompt}\n\n${inputDesc}` }
      ],
    });

    const enhancedContent = JSON.parse(cleanJson(completion.choices[0].message.content));
    res.json({ enhancedContent });
  } catch (error) {
    console.error('Job Enhance Error:', error);
    res.status(500).json({ message: 'AI Enhancement failed' });
  }
};

export const analyzeResume = async (req, res) => {
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
    
    const completion = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gemini-1.5-flash",
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
      
      // Validate the response structure
      if (!analysis.score || !analysis.categories || !analysis.keywords) {
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
    console.error('Analysis Error:', error);
    const msg = error.response ? JSON.stringify(error.response.data) : error.message;
    res.status(500).json({ message: 'Analysis failed: ' + msg });
  }
};