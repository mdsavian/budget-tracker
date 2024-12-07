import axiosInstance from '@/lib/axios';
import { TransactionForm } from '../forms/TransactionForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Transaction } from '@/types';
import { useState, useEffect } from 'react';

const TransactionModal = ({
  id,
  isOpen,
  onClose,
  isRecurring,
  date
}: {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  isRecurring?: boolean;
  date?: string;
}) => {
  const title = id ? 'Edit transaction' : 'Create transaction';

  const [transaction, setTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    if (id) {
      axiosInstance
        .get('/transaction', {
          params: {
            id: id,
            isRecurring: isRecurring ?? false,
            date: date ?? null
          }
        })
        .then((res) => {
          setTransaction(res.data);
        });
    }
  }, [id, isRecurring, date]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-3xl"> {title}</DialogTitle>
        </DialogHeader>
        <TransactionForm transaction={transaction} onConfirm={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
