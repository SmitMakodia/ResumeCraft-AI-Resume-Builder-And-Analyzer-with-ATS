const PDFParser = require('pdf2json');

// pdf2json signals completion through events. A malformed PDF can emit neither, leaving the
// promise pending and the HTTP request hanging until the client gives up.
const PARSE_TIMEOUT_MS = 20000;

// CommonJS on purpose: pdf2json is a CJS module, and importing it directly from the ESM
// controllers fails. This file is the isolation boundary.
async function parsePDF(buffer) {
  return new Promise((resolveOnce, rejectOnce) => {
    let settled = false;
    const resolve = (value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolveOnce(value);
    };
    const reject = (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      rejectOnce(error);
    };

    const timer = setTimeout(() => {
      reject(new Error(`PDF parsing timed out after ${PARSE_TIMEOUT_MS / 1000}s`));
    }, PARSE_TIMEOUT_MS);

    try {
      if (!buffer || !Buffer.isBuffer(buffer)) {
        return reject(new Error('Invalid buffer provided to PDF parser'));
      }

      console.log('[pdf] Starting parse, buffer size:', buffer.length);

      const pdfParser = new PDFParser(null, 1); // 1 = retain raw text only

      pdfParser.on('pdfParser_dataError', (errData) => {
        console.error('[pdf] Parser error event:', errData.parserError);
        reject(new Error(`PDF parsing failed: ${errData.parserError}`));
      });

      pdfParser.on('pdfParser_dataReady', (pdfData) => {
        try {
          const rawText = pdfParser.getRawTextContent();
          console.log('[pdf] Parsed successfully. Text length:', rawText.length);
          resolve({
            text: rawText,
            numpages: pdfData.Pages ? pdfData.Pages.length : 1
          });
        } catch (error) {
          reject(new Error(`Failed to extract text: ${error.message}`));
        }
      });

      pdfParser.parseBuffer(buffer);
    } catch (error) {
      console.error('[pdf] Setup error:', error);
      reject(new Error(`PDF parser initialization failed: ${error.message}`));
    }
  });
}

module.exports = parsePDF;
