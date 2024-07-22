import { Breadcrumbs } from '@/components/breadcrumbs';
import { TransactionClient } from '@/components/tables/transaction-tables/client';
import { transactions } from '@/constants/data';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Transaction', link: '/dashboard/transaction' }
];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <TransactionClient data={transactions} />
      </div>
    </>
  );
}
