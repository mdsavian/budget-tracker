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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Category } from '@/types';
import { Control } from 'react-hook-form';
import { TransactionFormValues } from './types';
import axiosInstance from '@/lib/axios';
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const CategoryField = ({
  control
}: {
  control: Control<TransactionFormValues>;
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchCategories = async () => {
      try {
        const accountResponse = await axiosInstance.get('/account');
        setCategories(accountResponse.data);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Error fetching categories, error: ${error}`
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <FormField
      control={control}
      name="accountId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
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
              <SelectGroup className="max-h-[20rem] overflow-y-auto">
                {categories.map((account: Category) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.description}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CategoryField;
