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
import { DateRange } from 'react-day-picker';
import { CalendarDateRangePicker } from '@/components/date-range-picker';

export const TransactionClient: React.FC = () => {
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!date?.from || !date?.to) {
        return;
      }

      const dashboardData = await axiosInstance.get('dashboard/transaction', {
        params: {
          startDate: format(date.from, 'yyyy-MM-dd'),
          endDate: format(date.to, 'yyyy-MM-dd')
        }
      });

      setTransactions(dashboardData.data.transactions);
    };

    fetchTransactions();
  }, [date]);

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
      <CalendarDateRangePicker date={date} setDate={setDate} />
      <DataTable
        searchKey="description"
        columns={columns}
        data={transactions}
      />
    </>
  );
};
