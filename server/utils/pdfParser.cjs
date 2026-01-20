const PDFParser = require('pdf2json');

async function parsePDF(buffer) {
  return new Promise((resolve, reject) => {
    try {
      if (!buffer || !Buffer.isBuffer(buffer)) {
        return reject(new Error('Invalid buffer provided to PDF parser'));
      }

      console.log('PDF Parser (pdf2json): Starting parse, buffer size:', buffer.length);

      const pdfParser = new PDFParser(null, 1); // 1 = retain text only (Raw Text)

      pdfParser.on('pdfParser_dataError', (errData) => {
        console.error('PDF Parser Error Event:', errData.parserError);
        reject(new Error(`PDF Parsing failed: ${errData.parserError}`));
      });

      pdfParser.on('pdfParser_dataReady', (pdfData) => {
        try {
          // pdf2json returns text content in a raw format which needs extraction
          // getRawTextContent() is the helper for that
          const rawText = pdfParser.getRawTextContent();
          
          console.log('PDF Parser: Successfully parsed. Text length:', rawText.length);

          resolve({
            text: rawText,
            numpages: pdfData.Pages ? pdfData.Pages.length : 1,
          });
        } catch (error) {
          reject(new Error(`Failed to extract text: ${error.message}`));
        }
      });

      // Parse the buffer
      pdfParser.parseBuffer(buffer);
    } catch (error) {
      console.error('PDF Parser Setup Error:', error);
      reject(new Error(`PDF Parser initialization failed: ${error.message}`));
    }
  });
}

module.exports = parsePDF;