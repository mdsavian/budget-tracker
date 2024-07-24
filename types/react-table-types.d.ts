import { RowData } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?:
      | 'boolean'
      | 'transactionType'
      | 'text'
      | 'amount'
      | 'account'
      | 'category';
  }
}
