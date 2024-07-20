import React from "react";

import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  RowData,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Transaction } from "../types";
import dayjs from "dayjs";
import { formatValue } from "../utils";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "tipo" | "text" | "amount" | "account" | "category" | "yesNo";
  }
}

export default function TransactionTable({
  transactions,
  categoryLabels,
}: {
  transactions?: Transaction[];
  categoryLabels?: string[];
}) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const columns = React.useMemo<ColumnDef<any, any>[]>(
    () => [
      {
        accessorKey: "paid",
        header: "Efetivada",
        cell: (info) => info.getValue(),
        meta: {
          filterVariant: "yesNo",
        },
      },
      {
        accessorKey: "receitaCard",
        cell: (info) => info.getValue(),
        header: "Cartão",
        meta: {
          filterVariant: "yesNo",
        },
      },
      {
        accessorKey: "tipo",
        cell: (info) => info.getValue(),
        header: "Tipo",
        meta: {
          filterVariant: "tipo",
        },
      },
      {
        accessorKey: "date",
        id: "date",
        cell: (info) => info.getValue(),
        header: "Data",
      },
      {
        accessorFn: (row) => row.description,
        id: "description",
        header: "Descrição",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "category",
        header: "Categoria",
        meta: {
          filterVariant: "category",
        },
      },
      {
        accessorKey: "account",
        header: "Conta",
        meta: {
          filterVariant: "account",
        },
      },
      {
        accessorKey: "amount",
        header: "Valor",
        meta: {
          filterVariant: "amount",
        },
      },
    ],
    []
  );

  const formattedData = React.useMemo(
    () =>
      transactions?.map((c) => {
        return {
          ...c,
          paid: c.paid ? "Sim" : "Não",
          tipo: c.transactionType,
          receitaCard: c.creditCardId ? "Sim" : "Não",
          date: dayjs(c.date).format("DD/MM/YYYY"),
          //TODO format amount amount: formatValue(c.amount),
        };
      }),
    [transactions]
  );

  const table = useReactTable({
    data: formattedData || [],
    columns,
    filterFns: {},
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  return (
    <div className="p-2">
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} categoryLabels={categoryLabels} />
                          </div>
                        ) : null}
                      </>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Filter({
  column,
  categoryLabels,
}: {
  categoryLabels?: string[];
  column: Column<any, unknown>;
}) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};

  return filterVariant === "amount" ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) => {
            if (value) {
              column.setFilterValue((old: [number, number]) => [value, old?.[1]]);
            }
          }}
          placeholder="Min"
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) => {
            if (value) {
              column.setFilterValue((old: [number, number]) => [old?.[0], value]);
            }
          }}
          placeholder="Max"
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : filterVariant === "yesNo" ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
    >
      <option value="">All</option>
      <option key="yes" value="Sim">
        Sim
      </option>
      <option key="no" value="Não">
        Não
      </option>
    </select>
  ) : filterVariant === "account" ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
    >
      <option value="">All</option>
      <option key="empresa" value="Empresa">
        Empresa
      </option>
      <option key="bradesco" value="Bradesco">
        Bradesco
      </option>
    </select>
  ) : filterVariant === "category" ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
    >
      <option value="">All</option>
      {categoryLabels?.map((label) => (
        <option key={label} value={label}>
          {label}
        </option>
      ))}
    </select>
  ) : filterVariant === "tipo" ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
    >
      <option value="">All</option>
      <option key="receita" value="receita">
        receita
      </option>
      <option key="despesa" value="despesa">
        despesa
      </option>
    </select>
  ) : (
    <DebouncedInput
      className="w-36 border shadow rounded"
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue ?? "") as string}
    />
    // See faceted column filters example for datalist search suggestions
  );
}

// A typical debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <input {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
}
