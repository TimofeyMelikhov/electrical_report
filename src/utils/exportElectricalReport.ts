import * as XLSX from "xlsx";

import { reportColumnConfig } from "@/components/table/columns";
import type { IReportData } from "@/models/types";

const createFileStamp = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");

  return `${year}-${month}-${day}_${hours}-${minutes}`;
};

export const exportElectricalReport = (data: IReportData[]) => {
  const headerRow = reportColumnConfig.map(({ header }) => header);
  const bodyRows = data.map((row) =>
    reportColumnConfig.map(({ key }) => row[key] ?? ""),
  );

  const worksheet = XLSX.utils.aoa_to_sheet([headerRow, ...bodyRows]);
  worksheet["!cols"] = reportColumnConfig.map(({ header }, index) => ({
    wch: Math.max(
      header.length + 2,
      ...bodyRows.map((row) => String(row[index] ?? "").length + 2),
    ),
  }));

  if (worksheet["!ref"]) {
    worksheet["!autofilter"] = { ref: worksheet["!ref"] };
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Отчет");
  XLSX.writeFile(workbook, `electrical-report_${createFileStamp()}.xlsx`);
};
