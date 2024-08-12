'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Checkbox } from '@/components/ui/checkbox';
import { Transaction } from '@/types';
import { CreditCard, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { formatValue } from '@/lib/utils';
import { TransactionData } from './types';
import EffectuateTransactionButton from './effectuateTransactionButton';

export const processData = (transactions: Transaction[]): TransactionData[] => {
  return transactions.map((trans) => {
    const transactionDate =
      trans.effectuatedDate != null
        ? format(new Date(trans.effectuatedDate.replace('Z', '')), 'dd/MM/yyyy')
        : format(new Date(trans.date.replace('Z', '')), 'dd/MM/yyyy');

    return {
      id: trans.id,
      fulfilled: trans.fulfilled,
      recurringId: trans.recurringTransactionId,
      recurring: trans.recurringTransactionId !== null,
      creditCardId: trans.creditCardId,
      creditCard: trans.creditCardId !== null,
      type: trans.transactionType,
      date: transactionDate,
      description: trans.description,
      account: trans.account,
      category: trans.category,
      amount: trans.amount
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
    accessorKey: 'fulfilled',
    header: 'Effectuated',
    cell: (info) => {
      return info.getValue() ? (
        <Check className="text-green-500" />
      ) : (
        <AlertCircle className="text-red-500" />
      );
    },
    enableSorting: true,
    sortingFn: (a, b) => {
      return a.original.fulfilled === b.original.fulfilled
        ? 0
        : a.original.fulfilled
        ? -1
        : 1;
    },
    meta: {
      filterVariant: 'boolean'
    }
  },
  {
    accessorKey: 'recurring',
    header: 'Recurring',
    cell: (info) => {
      return info.getValue() ? <RefreshCw /> : null;
    },
    enableSorting: true,
    sortingFn: (a, b) => {
      const aValue = a.original.recurringId === null ? true : false;
      const bValue = b.original.recurringId === null ? true : false;
      return aValue === bValue ? 0 : aValue ? 1 : -1;
    },
    meta: {
      filterVariant: 'boolean'
    }
  },
  {
    accessorKey: 'creditCard',
    cell: (info) => {
      return info.getValue() ? <CreditCard /> : '';
    },
    header: 'Credit Card',
    sortingFn: (a, b) => {
      const aValue = a.original.creditCardId === null ? true : false;
      const bValue = b.original.creditCardId === null ? true : false;
      return aValue === bValue ? 0 : aValue ? 1 : -1;
    },
    meta: {
      filterVariant: 'boolean'
    }
  },
  {
    accessorKey: 'type',
    cell: (info) => info.getValue(),
    header: 'Type',
    meta: {
      filterVariant: 'transactionType'
    }
  },
  {
    accessorKey: 'date',
    id: 'date',
    cell: (info) => info.getValue(),
    header: 'Date',
    meta: {
      filterVariant: 'text'
    }
  },
  {
    accessorFn: (row) => row.description,
    id: 'description',
    header: 'Description',
    enableSorting: true,
    cell: (info) => info.getValue(),
    meta: {
      filterVariant: 'text'
    }
  },
  {
    accessorKey: 'category',
    header: 'Category',
    meta: {
      filterVariant: 'category'
    },
    filterFn: 'equalsString'
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
    header: 'Amount',
    cell: (info) => formatValue(info.getValue() as number),
    sortingFn: (a, b) => {
      return a.original.amount - b.original.amount;
    },
    meta: {
      filterVariant: 'amount'
    }
  },
  {
    id: 'effectuate',
    cell: (cell) => {
      if (!cell.row.original.fulfilled) {
        return <EffectuateTransactionButton row={cell.row.original} />;
      }
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
