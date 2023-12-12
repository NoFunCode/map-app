import Papa from "papaparse";
import { GraphData } from "@/types/data";

export const inferGraphTypes = (
  parsedData: Papa.ParseResult<any>
): GraphData[] => {
  return parsedData.data.map((row) => {
    return {
      month: parseInt(row.month, 10),
      price: parseFloat(row.price),
    };
  });
};
