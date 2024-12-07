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
// import { CreditCard } from '@/types';
import { Control } from 'react-hook-form';
import { TransactionFormValues } from './types';
import axiosInstance from '@/lib/axios';
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const CreditCardField = ({
  control
}: {
  control: Control<TransactionFormValues>;
}) => {
  const [creditCards, setCreditCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchCreditCards = async () => {
      try {
        const creditCardResponse = await axiosInstance.get('/creditcard');
        setCreditCards(creditCardResponse.data);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Error fetching creditCards, error: ${error}`
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCreditCards();
  }, []);

  return (
    <FormField
      control={control}
      name="creditCardId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Credit Card</FormLabel>
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
                  placeholder="Select a credit card"
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {creditCards.map((card) => (
                <SelectItem key={card.id} value={card.id}>
                  {card.name}
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

export default CreditCardField;
