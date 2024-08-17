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
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { TransactionData } from './types';
import { useToast } from '@/components/ui/use-toast';
import axiosInstance from '@/lib/axios';
import { idIsNull } from '@/lib/utils';

interface CellActionProps {
  data: TransactionData;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
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
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() =>
              // TODO this can de do in a different way, context for example, need to be refactored later
              router.push(
                `/dashboard/transaction/${id}?isRecurring=${isRecurring}&date=${data.date}`
              )
            }
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
