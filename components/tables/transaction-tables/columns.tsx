'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Checkbox } from '@/components/ui/checkbox';
import { Transaction } from '@/types';
import { CreditCard, Check, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { formatValue } from '@/lib/utils';

type TransactionData = {
  status: JSX.Element;
  creditCard: string | JSX.Element;
  type: string;
  date: string;
  description: string;
  account: string;
  category: string;
  amount: string;
};

export const processData = (transactions: Transaction[]): TransactionData[] => {
  return transactions.map((trans) => ({
    status: trans.paid ? (
      <Check className="text-green-500" />
    ) : (
      <AlertCircle className="text-red-500" />
    ),
    creditCard: trans.creditCardId ? <CreditCard /> : '',
    type: trans.transactionType,
    date: format(new Date(trans.date), 'MM/dd/yyyy'),
    description: trans.description,
    account: trans.account,
    category: trans.category,
    amount: formatValue(trans.amount)
  }));
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
    meta: {
      filterVariant: 'yesNo'
    }
  },
  {
    accessorKey: 'creditCard',
    cell: (info) => info.getValue(),
    header: 'Credit Card',
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
    accessorKey: 'amount',
    header: 'Amount'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
