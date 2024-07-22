'use client';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './columns';
import { useEffect, useState } from 'react';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { Transaction } from '@/types';
import axiosInstance from '@/lib/axios/axios';

export const TransactionClient: React.FC = () => {
  const router = useRouter();

  const [data, setData] = useState<Transaction[]>([]);
  const [startDate, setStartDate] = useState(
    format(startOfMonth(new Date()), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState(
    format(endOfMonth(new Date()), 'yyyy-MM-dd')
  );

  useEffect(() => {
    const fetchTransactions = async () => {
      const dashboardData = await axiosInstance.get('dashboard/transaction', {
        params: {
          startDate: startDate,
          endDate: endDate
        }
      });
      console.log(dashboardData, dashboardData.data);
      setData(dashboardData.data);
    };

    fetchTransactions();
  }, [startDate, endDate]);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Transactions" description="" />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/dashboard/transacion/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};
