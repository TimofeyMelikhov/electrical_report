import React from "react";
import "./table.css";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import { columnDef } from "./columns.js";

export const ExcelTable = (props) => {
  const finalData = React.useMemo(() => props.data, [props.data]);
  const finalColumns = React.useMemo(() => columnDef, []);
  const tableInstance = useReactTable({
    columns: finalColumns,
    data: finalData,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
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
  );
};
