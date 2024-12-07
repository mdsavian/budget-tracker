import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Control } from 'react-hook-form';
import { TransactionFormValues } from './types';

const TransactionTypeField = ({
  loading,
  control
}: {
  loading: boolean;
  control: Control<TransactionFormValues>;
}) => {
  return (
    <FormField
      control={control}
      name="transactionType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Transaction type</FormLabel>
          <Select
            disabled={loading}
            onValueChange={field.onChange}
            value={field.value}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  defaultValue={field.value}
                  placeholder="Transaction type"
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem key="debit" value="Debit">
                Debit
              </SelectItem>
              <SelectItem key="credit" value="Credit">
                Credit
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TransactionTypeField;
