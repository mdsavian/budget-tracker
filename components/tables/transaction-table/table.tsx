'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { TransactionData } from './types';
import { columns } from './columns';
import Filter from './filters';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryTotals } from './categoryTotals';
import axiosInstance from '@/lib/axios';
import { Account, Category } from '@/types';
interface DataTableProps {
  data: TransactionData[];
}

export function TransactionTable({ data }: DataTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  const filteredRows = table.getFilteredRowModel().rows;

  const [categories, setCategories] = useState<any>([]);
  const [accounts, setAccounts] = useState<any>([]);

  useEffect(() => {
    const fetchDatas = async () => {
      const categoryPromise = axiosInstance.get('/category');
      const accountPromise = axiosInstance.get('/account');

      const [categoryRes, accountRes] = await Promise.all([
        categoryPromise,
        accountPromise
      ]);
      setCategories(categoryRes.data);
      setAccounts(accountRes.data);
    };

    fetchDatas();
  }, []);

  const labels = useMemo(() => {
    const categoryLabels = categories.map(
      (category: Category) => category.description
    );
    const accountLabels = accounts.map((account: Account) => account.name);
    return { categoryLabels, accountLabels };
  }, [categories, accounts]);

  return (
    <div className="column flex gap-8">
      <ScrollArea className="round-md h-[calc(100vh-240px)] border">
        <Table className="relative">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? 'cursor-pointer select-none flex'
                                : '',
                              onClick: header.column.getToggleSortingHandler()
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: (
                                <ArrowUp
                                  className="ml-1 text-white"
                                  size={18}
                                />
                              ),
                              desc: (
                                <ArrowDown
                                  className="ml-1 text-white"
                                  size={18}
                                />
                              )
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                          {header.column.getCanFilter() ? (
                            <div>
                              <Filter column={header.column} labels={labels} />
                            </div>
                          ) : null}
                        </>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <CategoryTotals filteredRows={filteredRows} />
    </div>
  );
}
