import { createColumnHelper } from "@tanstack/react-table";

import type { IReportData } from "@/models/types";

export interface IReportColumnConfig {
  key: keyof IReportData;
  header: string;
}

const columnHelper = createColumnHelper<IReportData>();

export const reportColumnConfig: IReportColumnConfig[] = [
  { key: "fullname", header: "ФИО" },
  { key: "code", header: "Код" },
  { key: "positionParentName", header: "Подразделение" },
  { key: "positionName", header: "Должность" },
  { key: "hireDate", header: "Дата приема" },
  { key: "itemType", header: "Тип" },
  { key: "itemName", header: "Название" },
  { key: "startUsageDate", header: "Дата начала" },
  { key: "lastUsageDate", header: "Дата завершения" },
  { key: "score", header: "Баллы" },
  { key: "stateDescription", header: "Состояние" },
];

export const columnDef = reportColumnConfig.map(
  ({ key, header }) =>
    columnHelper.accessor((row) => row[key], {
      id: key,
      header,
      cell: (info) => info.getValue() ?? "—",
    }),
);
