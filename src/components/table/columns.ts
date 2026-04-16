import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();
export const columnDef = [
  {
    accessorKey: "fullname",
    header: "ФИО",
  },
  {
    accessorKey: "code",
    header: "Код",
  },
  {
    accessorKey: "positionParentName",
    header: "Подразделение",
  },
  {
    accessorKey: "positionName",
    header: "Должность",
  },
  {
    accessorKey: "hireDate",
    header: "Дата приема",
  },
  {
    accessorKey: "itemType",
    header: "Тип",
  },
  {
    accessorKey: "itemName",
    header: "Название",
  },
  {
    accessorKey: "startUsageDate",
    header: "Дата начала",
  },
  {
    accessorKey: "lastUsageDate",
    header: "Дата завершения",
  },
  {
    accessorKey: "score",
    header: "Баллы",
  },
  {
    accessorKey: "stateDescription",
    header: "Состояние",
  },
];
