'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Checkbox } from '@/components/ui/checkbox';
import { Transaction } from '@/types';

export const columns: ColumnDef<Transaction>[] = [
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
    accessorKey: 'paid',
    header: 'Efetivada',
    cell: (info) => {
      console.log(info.getValue());
      return info.getValue() ? 'Sim' : 'Não';
    },
    enableSorting: true,
    meta: {
      filterVariant: 'yesNo'
    }
  },
  {
    accessorKey: 'creditCardId',
    cell: (info) => info.getValue(),
    header: 'Cartão',
    meta: {
      filterVariant: 'yesNo'
    }
  },
  {
    accessorKey: 'tipo',
    cell: (info) => info.getValue(),
    header: 'Tipo',
    meta: {
      filterVariant: 'tipo'
    }
  },
  {
    accessorKey: 'date',
    id: 'date',
    cell: (info) => info.getValue(),
    header: 'Data'
  },
  {
    accessorFn: (row) => row.description,
    id: 'description',
    header: 'Descrição',
    cell: (info) => info.getValue()
  },
  {
    accessorKey: 'category',
    header: 'Categoria',
    meta: {
      filterVariant: 'category'
    }
  },
  {
    accessorKey: 'account',
    header: 'Conta',
    meta: {
      filterVariant: 'account'
    }
  },
  {
    accessorKey: 'amount',
    header: 'Valor'
  },
  {
    accessorKey: 'effectuate',
    cell: (info) => info.getValue(),
    header: 'Efetuar'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
