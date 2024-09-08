'use client';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axiosInstance from '@/lib/axios';
import { cn, formatValue } from '@/lib/utils';
import { DashboardData } from '@/types';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

export default function Page() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  const [dashboardData, setDashboardData] = useState<DashboardData>();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!date?.from || !date?.to) {
        return;
      }

      const dashboardData = await axiosInstance.get('dashboard', {
        params: {
          startDate: format(date.from, 'yyyy-MM-dd'),
          endDate: format(date.to, 'yyyy-MM-dd')
        }
      });

      setDashboardData(dashboardData.data);
    };

    fetchTransactions();
  }, [date]);

  const titleStyles =
    'sm:text-xl text-xl md:text-lg lg:text-xl flex items-center';
  const valueStyles =
    'sm:text-xl text-xl md:text-lg lg:text-xl font-bold flex items center md:justify-end';

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <CalendarDateRangePicker date={date} setDate={setDate} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-md font-medium">
                    Account balances
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  {dashboardData?.accounts?.map((account) => (
                    <div
                      className="grid grid-cols-1 md:grid-cols-2"
                      key={account.id}
                    >
                      <div className={titleStyles}>{account.name}</div>
                      <div className={valueStyles}>
                        {formatValue(account.balance)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Totals</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="mb-3 grid grid-cols-1 md:grid-cols-2">
                    <div className={'flex items-center text-2xl'}>Balance</div>
                    <div
                      className={
                        'items center flex text-2xl font-bold text-green-600 md:justify-end'
                      }
                    >
                      {formatValue(dashboardData?.balance || 0)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className={titleStyles}>Credits</div>
                    <div className={cn(valueStyles, 'text-green-600')}>
                      {formatValue(dashboardData?.totalCredit || 0)}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className={titleStyles}>Credits Upcoming</div>
                    <div className={cn(valueStyles, 'text-green-600')}>
                      {formatValue(dashboardData?.totalCreditUpcoming || 0)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className={titleStyles}>Debits</div>
                    <div className={cn(valueStyles, 'text-red-600')}>
                      {formatValue(dashboardData?.totalDebit || 0)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className={titleStyles}>Debits nao pagas</div>
                    <div className={cn(valueStyles, 'text-red-600')}>
                      {formatValue(dashboardData?.totalDebitUnpaid || 0)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className={titleStyles}>Cartão de crédito</div>
                    <div className={cn(valueStyles, 'text-red-600')}>
                      {formatValue(dashboardData?.totalCreditCard || 0)}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className={titleStyles}>
                      Adiantamento Cartão de crédito
                    </div>
                    <div className={cn(valueStyles, 'text-green-600')}>
                      {formatValue(dashboardData?.totalCreditCardUpcoming || 0)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
