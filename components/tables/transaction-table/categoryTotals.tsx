import React from 'react';
import { Row } from '@tanstack/react-table';
import { TransactionData } from './types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatValue } from '@/lib/utils';
import { TransactionType } from '@/types';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

type CategoryTotalsProps = {
  filteredRows: Row<TransactionData>[];
};

export function CategoryTotals({ filteredRows }: CategoryTotalsProps) {
  type CategoryTotals = { [category: string]: number };
  type CategoryFormattedTotals = { [category: string]: string };

  let total = 0;
  function calculateAndSortCategoryTotals(
    filteredRows: any[]
  ): { category: string; formattedTotal: string }[] {
    const categoryTotals: CategoryTotals = {};

    // Accumulate totals for each category
    filteredRows.forEach(({ original: { category, amount, type } }) => {
      if (category && amount && type) {
        if (type === TransactionType.Credit) {
          categoryTotals[category] = (categoryTotals[category] || 0) - amount;
        } else {
          categoryTotals[category] = (categoryTotals[category] || 0) + amount;
        }
      }
    });

    // Format totals and sort categories by total in descending order
    const categoryFormattedTotals: CategoryFormattedTotals = Object.keys(
      categoryTotals
    )
      .sort((a, b) => categoryTotals[b] - categoryTotals[a]) // Sort by total in descending order
      .reduce((acc: CategoryFormattedTotals, category) => {
        let value = categoryTotals[category];
        value = value < 0 ? value * -1 : value;
        total += value;

        acc[category] = formatValue(value);
        return acc;
      }, {});

    // Convert to array format
    return Object.entries(categoryFormattedTotals).map(
      ([category, formattedTotal]) => ({
        category,
        formattedTotal
      })
    );
  }
  const sortedCategoryTotals = calculateAndSortCategoryTotals(filteredRows);

  return (
    <ScrollArea className="round-md h-[calc(100vh-240px)] border">
      <CardHeader>
        <CardTitle>Category total {formatValue(total)}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedCategoryTotals.map((row) => (
            <div className="flex items-center" key={row.category}>
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  {row.category.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="mr-3 text-sm font-medium leading-none">
                  {row.category}
                </p>
              </div>
              <div className="ml-auto text-right font-medium">
                {row.formattedTotal}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </ScrollArea>
  );
}
