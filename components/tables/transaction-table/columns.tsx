'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Checkbox } from '@/components/ui/checkbox';
import { Transaction } from '@/types';
import { CreditCard, Check, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { formatValue } from '@/lib/utils';
import { TransactionData } from './types';

export const processData = (transactions: Transaction[]): TransactionData[] => {
  return transactions.map((trans) => {
    return {
      paid: trans.paid,
      status: trans.paid ? (
        <Check className="text-green-500" />
      ) : (
        <AlertCircle className="text-red-500" />
      ),
      creditCardId: trans.creditCardId,
      creditCard: trans.creditCardId ? <CreditCard /> : '',
      type: trans.transactionType,
      date: format(new Date(trans.date.replace('Z', '')), 'dd/MM/yyyy'),
      description: trans.description,
      account: trans.account,
      category: trans.category,
      amount: trans.amount,
      amountFormatted: formatValue(trans.amount)
    };
  });
};

export const columns: ColumnDef<TransactionData>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info) => info.getValue(),
    enableSorting: true,
    sortingFn: (a, b) => {
      return a.original.paid === b.original.paid ? 0 : a.original.paid ? -1 : 1;
    }
  },
  {
    accessorKey: 'creditCard',
    cell: (info) => info.getValue(),
    header: 'Credit Card',
    sortingFn: (a, b) => {
      const aValue = a.original.creditCardId === null ? true : false;
      const bValue = b.original.creditCardId === null ? true : false;
      return aValue === bValue ? 0 : aValue ? 1 : -1;
    },
    meta: {
      filterVariant: 'yesNo'
    }
  },
  {
    accessorKey: 'type',
    cell: (info) => info.getValue(),
    header: 'Type',
    meta: {
      filterVariant: 'tipo'
    }
  },
  {
    accessorKey: 'date',
    id: 'date',
    cell: (info) => info.getValue(),
    header: 'Date'
  },
  {
    accessorFn: (row) => row.description,
    id: 'description',
    header: 'Description',
    enableSorting: true,
    cell: (info) => info.getValue()
  },
  {
    accessorKey: 'category',
    header: 'Category',
    meta: {
      filterVariant: 'category'
    }
  },
  {
    accessorKey: 'account',
    header: 'Account',
    meta: {
      filterVariant: 'account'
    }
  },
  {
    accessorKey: 'amountFormatted',
    header: 'Amount',
    sortingFn: (a, b) => {
      return a.original.amount - b.original.amount;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
