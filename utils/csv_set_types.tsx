import Papa from 'papaparse';
import { AirbnbData } from '@/types/data';


export const inferGraphTypes = (parsedData: Papa.ParseResult<any>): AirbnbData[] => {
  return parsedData.data.map(row => {
    return {
      month: parseInt(row.month, 10),
      price: parseFloat(row.price),
    };
  });
};
