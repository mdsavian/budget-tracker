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
import { Account } from '@/types';
import { Control } from 'react-hook-form';
import { TransactionFormValues } from './types';
import axiosInstance from '@/lib/axios';
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const AccountField = ({
  control
}: {
  control: Control<TransactionFormValues>;
}) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchAccounts = async () => {
      try {
        const accountResponse = await axiosInstance.get('/account');
        setAccounts(accountResponse.data);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Error fetching accounts, error: ${error}`
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <FormField
      control={control}
      name="accountId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Account</FormLabel>
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
                  placeholder="Select a account"
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {accounts.map((acc) => (
                <SelectItem key={acc.id} value={acc.id}>
                  {acc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AccountField;
