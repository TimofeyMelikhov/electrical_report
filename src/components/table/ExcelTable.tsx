import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type { IReportData } from "@/models/types";
import buttonStyles from "@/styles/Button.module.css";
import { exportElectricalReport } from "@/utils/exportElectricalReport";

import { columnDef } from "./columns";
import styles from "./ExcelTable.module.css";

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
    <section className={styles.tableCard}>
      <div className={styles.toolbar}>
        <div>
          <h2 className={styles.title}>Результаты отчета</h2>
          <p className={styles.meta}>Найдено записей: {data.length}</p>
        </div>

        <button
          className={`${buttonStyles.button} ${buttonStyles.secondary} ${styles.exportButton}`}
          type="button"
          onClick={() => void exportElectricalReport(data)}
        >
          Экспорт в Excel
        </button>
      </div>

      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            {tableInstance.getHeaderGroups().map((headerGroup) => (
              <tr className={styles.row} key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className={styles.headerCell}
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

          <tbody className={styles.tbody}>
            {tableInstance.getRowModel().rows.map((row) => (
              <tr className={styles.row} key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td className={styles.bodyCell} key={cell.id}>
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
