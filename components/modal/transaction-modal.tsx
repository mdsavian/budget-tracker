import { TransactionForm } from '../forms/TransactionForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

const TransactionModal = ({
  id,
  isOpen,
  onClose
}: {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const title = id ? 'Edit transaction' : 'Create transaction';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[625px]">
        <DialogHeader>
          <DialogTitle> {title}</DialogTitle>
        </DialogHeader>
        <TransactionForm initialData={null} />
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
