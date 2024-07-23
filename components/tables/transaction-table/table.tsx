'use client';

import {
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
import { Input } from '@/components/ui//input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { TransactionData } from './types';
import { columns } from './columns';

interface DataTableProps {
  data: TransactionData[];
}

export function TransactionTable({ data }: DataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  /* this can be used to get the selectedrows 
  console.log("value", table.getFilteredSelectedRowModel()); */

  return (
    <>
      <div className="flex items-start gap-8">
        <Input
          placeholder={`Search description...`}
          value={
            (table.getColumn('description')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('description')?.setFilterValue(event.target.value)
          }
          className="w-full md:max-w-sm"
        />

        <Input
          placeholder={`Search category...`}
          value={
            (table.getColumn('category')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('category')?.setFilterValue(event.target.value)
          }
          className="w-full md:max-w-sm"
        />
      </div>
      <ScrollArea className="h-[calc(80vh-220px)] rounded-md border">
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
                              {/* <Filter
                                column={header.column}
                                categoryLabels={categoryLabels}
                              /> */}
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
    </>
  );
}
