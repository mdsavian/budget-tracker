'use client';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import axiosInstance from '@/lib/axios';
import { DateRange } from 'react-day-picker';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import { Transaction } from '@/types';
import {
  processData,
  TransactionTable
} from '@/components/tables/transaction-table';
import TransactionModal from '@/components/modal/transaction-modal';

const TransactionPage: React.FC = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
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

  const formattedTransactions = processData(transactions);

  return (
    <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
      <div className="flex items-start justify-between">
        <Heading title="Transactions" description="" />
        <Button
          className="text-xs md:text-sm"
          onClick={() => setIsOpenModal(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />

      <TransactionModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
      />
      <CalendarDateRangePicker date={date} setDate={setDate} />
      <TransactionTable data={formattedTransactions} />
    </div>
  );
};

export default TransactionPage;
