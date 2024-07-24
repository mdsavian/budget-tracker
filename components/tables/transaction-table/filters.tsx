import React from 'react';

import { Column } from '@tanstack/react-table';
import DebouncedInput from '../../debounceInput';
import { TransactionData } from './types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

type FilterProps = {
  labels: {
    categoryLabels?: string[];
    accountLabels?: string[];
  };
  column: Column<TransactionData>;
};

const Filter: React.FC<FilterProps> = ({ column, labels }) => {
  const columnFilterValue = column.getFilterValue();
  // @ts-ignore
  const { filterVariant } = column.columnDef.meta ?? {};

  return filterVariant === 'text' ? (
    <DebouncedInput
      className="w-36 rounded border shadow"
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue ?? '') as string}
    />
  ) : filterVariant === 'amount' ? (
    <div className="flex space-x-2">
      <DebouncedInput
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ''}
        onChange={(value) => {
          if (value) {
            column.setFilterValue((old: [number, number]) => [value, old?.[1]]);
          }
        }}
        placeholder="Min"
        className="w-24 rounded border shadow"
      />
      <DebouncedInput
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ''}
        onChange={(value) => {
          if (value) {
            column.setFilterValue((old: [number, number]) => [old?.[0], value]);
          }
        }}
        placeholder="Max"
        className="w-24 rounded border shadow"
      />
    </div>
  ) : filterVariant === 'boolean' ? (
    <div className="flex space-x-2">
      <Select
        defaultValue="all"
        onValueChange={(value) => {
          if (value === 'all') column.setFilterValue(null);
          if (value === 'true') column.setFilterValue(true);
          if (value === 'false') column.setFilterValue(false);
        }}
        value={columnFilterValue?.toString()}
      >
        <SelectTrigger>
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">True</SelectItem>
            <SelectItem value="false">False</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ) : filterVariant === 'amount' ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={(value) => {
            if (value) {
              column.setFilterValue((old: [number, number]) => [
                value,
                old?.[1]
              ]);
            }
          }}
          placeholder="Min"
          className="w-24 rounded border shadow"
        />
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={(value) => {
            if (value) {
              column.setFilterValue((old: [number, number]) => [
                old?.[0],
                value
              ]);
            }
          }}
          placeholder="Max"
          className="w-24 rounded border shadow"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : filterVariant === 'account' ? (
    <Select
      defaultValue="all"
      onValueChange={(value) => {
        if (value === 'all') {
          column.setFilterValue(null);
        } else {
          column.setFilterValue(value);
        }
      }}
      value={columnFilterValue?.toString()}
    >
      <SelectTrigger>
        <SelectValue placeholder="All" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="all">All</SelectItem>
          {labels.accountLabels?.map((label) => (
            <SelectItem key={label} value={label}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  ) : filterVariant === 'category' ? (
    <Select
      defaultValue="all"
      onValueChange={(value) => {
        if (value === 'all') {
          column.setFilterValue(null);
        } else {
          column.setFilterValue(value);
        }
      }}
      value={columnFilterValue?.toString()}
    >
      <SelectTrigger>
        <SelectValue placeholder="All" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="all">All</SelectItem>
          {labels.categoryLabels?.map((label) => (
            <SelectItem key={label} value={label}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  ) : filterVariant === 'transactionType' ? (
    <div className="flex space-x-2">
      <Select
        defaultValue="all"
        onValueChange={(value) => {
          if (value === 'All') {
            column.setFilterValue(null);
          } else {
            column.setFilterValue(value);
          }
        }}
        value={columnFilterValue?.toString()}
      >
        <SelectTrigger>
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Receita">Receita</SelectItem>
            <SelectItem value="Despesa">Despesa</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ) : null;
};

export default Filter;
