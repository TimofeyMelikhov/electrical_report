import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type { IReportData } from "@/models/types";
import { exportElectricalReport } from "@/utils/exportElectricalReport";

import { columnDef } from "./columns";
import "./table.css";

interface ExcelTableProps {
  data: IReportData[];
}

export const ExcelTable = ({ data }: ExcelTableProps) => {
  // eslint-disable-next-line react-hooks/incompatible-library
  const tableInstance = useReactTable<IReportData>({
    columns: columnDef,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className="table-card">
      <div className="table-card__toolbar">
        <div>
          <h2 className="table-card__title">Результаты отчета</h2>
          <p className="table-card__meta">Найдено записей: {data.length}</p>
        </div>

        <button
          className="btn btn--secondary"
          type="button"
          onClick={() => exportElectricalReport(data)}
        >
          Экспорт в Excel
        </button>
      </div>

      <div className="table-card__scroll">
        <table className="ExcelTable">
          <thead className="ExcelTable__thead">
            {tableInstance.getHeaderGroups().map((headerGroup) => (
              <tr className="ExcelTable__tr" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className="ExcelTable__th"
                    key={header.id}
                    colSpan={header.colSpan}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="ExcelTable__tbody">
            {tableInstance.getRowModel().rows.map((row) => (
              <tr className="ExcelTable__tr" key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td className="tbody__td" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
