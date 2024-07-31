'use client';
import { TransactionForm } from '@/components/forms/transaction-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import axiosInstance from '@/lib/axios';
import { Transaction } from '@/types';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';

export default function Page() {
  const params = useParams();
  const { transactionId } = params;

  const [initialData, setInitialData] = React.useState<Transaction | null>(
    null
  );

  useEffect(() => {
    if (transactionId) {
      axiosInstance.get(`/transaction/${transactionId}`).then((res) => {
        setInitialData(res.data);
      });
    }
  }, [transactionId]);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <TransactionForm initialData={initialData} />
      </div>
    </ScrollArea>
  );
}
