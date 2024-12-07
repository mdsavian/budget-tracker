import { z } from 'zod';
import { formSchema } from './schema';
import { Transaction } from '@/types';

export type TransactionFormValues = z.infer<typeof formSchema>;

export type TransactionFormProps = {
  transaction: Transaction | null;
  onConfirm: () => void;
};
