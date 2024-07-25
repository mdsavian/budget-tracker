import { Breadcrumbs } from '@/components/breadcrumbs';
import { TransactionForm } from '@/components/forms/transaction-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Transaction', link: '/dashboard/transaction' },
  { title: 'Create', link: '/dashboard/transaction/create' }
];
export default function Page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <Breadcrumbs items={breadcrumbItems} />
        <TransactionForm
          categories={[
            { _id: 'shirts', name: 'shirts' },
            { _id: 'pants', name: 'pants' }
          ]}
          initialData={null}
          key={null}
        />
      </div>
    </ScrollArea>
  );
}
