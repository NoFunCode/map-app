import Papa from 'papaparse';

export const parseCSV = async (fileContent: string): Promise<Papa.ParseResult<any>> => {
  return new Promise((resolve, reject) => {
    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        resolve({
          data: result.data,
          errors: result.errors,
          meta: result.meta,
        });
      },
      error: reject,
    });
  });
};
