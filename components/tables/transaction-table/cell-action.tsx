'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useState } from 'react';
import { TransactionData } from './types';
import { useToast } from '@/components/ui/use-toast';
import axiosInstance from '@/lib/axios';
import { idIsNull } from '@/lib/utils';
import TransactionModal from '@/components/modal/transaction-modal';

interface CellActionProps {
  data: TransactionData;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { toast } = useToast();

  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [openTransactionModal, setOpenTransactionModal] = useState(false);

  let isRecurring = false;
  let id = data.id;

  if (idIsNull(data.id)) {
    isRecurring = true;
    id = data.recurringId;
  }

  const onConfirm = async () => {
    try {
      await axiosInstance.post('/transaction', {
        transactionId: id,
        isRecurring,
        date: new Date(data.date).toISOString().split('T')[0]
      });
      toast({
        variant: 'default',
        title: 'Success',
        description: 'Transaction deleted successfully'
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Error deleting transaction'
      });
    } finally {
      setOpenAlertModal(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={openAlertModal}
        onClose={() => setOpenAlertModal(false)}
        onConfirm={onConfirm}
      />
      {openTransactionModal && (
        <TransactionModal
          id={id}
          isOpen={openTransactionModal}
          onClose={() => setOpenTransactionModal(false)}
          isRecurring={isRecurring}
          date={data.date}
        />
      )}

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => setOpenTransactionModal(true)}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpenAlertModal(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
