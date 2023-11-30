import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export const parseCSV = (filePath: string): Promise<Papa.ParseResult<any>> => {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(process.cwd(), filePath);
    const fileContent = fs.readFileSync(fullPath, 'utf8');

    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: resolve,
      error: reject,
    });
  });
};
