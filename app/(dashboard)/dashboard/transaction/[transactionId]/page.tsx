'use client';
import { TransactionForm } from '@/components/forms/transaction-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import axiosInstance from '@/lib/axios';
import { Transaction } from '@/types';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { transactionId } = params;
  const isRecurring = searchParams?.get('isRecurring');
  const date = searchParams?.get('date');

  const [initialData, setInitialData] = React.useState<Transaction | null>(
    null
  );

  useEffect(() => {
    if (transactionId) {
      axiosInstance
        .get('/transaction', {
          params: {
            id: transactionId,
            isRecurring: isRecurring ?? false,
            date: date ?? null
          }
        })
        .then((res) => {
          setInitialData(res.data);
        });
    }
  }, [transactionId, isRecurring]);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <TransactionForm initialData={initialData} />
      </div>
    </ScrollArea>
  );
}
