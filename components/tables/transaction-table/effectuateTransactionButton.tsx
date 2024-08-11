import React from 'react';
import axiosInstance from '@/lib/axios';
import { useToast } from '../../ui/use-toast';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { TransactionData } from './types';

const EffectuateTransactionButton = ({ row }: { row: TransactionData }) => {
  const { toast } = useToast();

  const effectuate = async () => {
    try {
      const splitDate = row.date.split('/');
      const formattedDate = `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`;

      await axiosInstance.post('/transaction/effectuate', {
        transactionId: row.id,
        recurringTransactionId: row.recurringId,
        amount: row.amount,
        date: formattedDate
      });
      toast({
        variant: 'default',
        title: 'Success',
        description: 'Transaction effectuated'
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to effectuate transaction, error: ${err}`
      });
    }
  };

  return (
    <Button onClick={() => effectuate()} size="icon">
      <CheckCircle />
    </Button>
  );
};
export default EffectuateTransactionButton;
