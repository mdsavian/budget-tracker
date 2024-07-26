'use client';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '../ui/use-toast';
import axiosInstance from '@/lib/axios/axios';
import { Switch } from '../ui/switch';

const formSchema = z.object({
  amount: z.coerce
    .number()
    .min(1, { message: 'Amount should be higher than 0' }),
  paid: z.boolean().default(false),
  date: z.string(),
  description: z
    .string()
    .min(3, { message: 'Description must be at least 3 characters' }),
  categoryId: z.string().min(1, { message: 'Please select a category' }),
  accountId: z.string().min(1, { message: 'Please select a account' }),
  creditCardId: z.string()
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData: any | null;
}

export const TransactionForm: React.FC<ProductFormProps> = ({
  initialData
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const title = initialData ? 'Edit transaction' : 'Create transaction';
  const description = initialData
    ? 'Edit a transaction.'
    : 'Add a new transaction';
  const action = initialData ? 'Save changes' : 'Create';

  const [categories, setCategories] = useState<any>([]);
  const [accounts, setAccounts] = useState<any>([]);
  const [cards, setCards] = useState<any>([]);

  useEffect(() => {
    const fetchDatas = async () => {
      const categoryPromise = axiosInstance.get('/category');
      const accountPromise = axiosInstance.get('/account');
      const cardPromise = axiosInstance.get('/creditcard');

      const [categoryRes, accountRes, cardRes] = await Promise.all([
        categoryPromise,
        accountPromise,
        cardPromise
      ]);
      setCategories(categoryRes.data);
      setAccounts(accountRes.data);
      setCards(cardRes.data);
    };

    fetchDatas();
  }, []);

  const defaultValues = initialData
    ? initialData
    : {
        amount: 0,
        description: '',
        price: 0,
        paid: false,
        category: ''
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      console.log('entrei', { data });

      setLoading(true);
      if (initialData) {
        // await axios.post(`/api/transactions/edit-transaction/${initialData._id}`, data);
      } else {
        const res = await axiosInstance.post(`/transaction/expense`, data);
        console.log('transaction', res);
      }
      //   router.refresh();
      //   router.push(`/dashboard/transactions`);
      //   toast({
      //     variant: 'destructive',
      //     title: 'Uh oh! Something went wrong.',
      //     description: 'There was a problem with your request.'
      //   });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      type="number"
                      placeholder="Amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paid"
              render={({ field }) => (
                <FormItem className="space-x-2">
                  <FormLabel>Paid</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={() => field.onChange(!field.value)}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Select a date"
                      type="date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
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
                      {/* @ts-ignore  */}
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
            <FormField
              control={form.control}
              name="categoryId"
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
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* @ts-ignore  */}
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
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
                      {/* @ts-ignore  */}
                      {cards.map((card) => (
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
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
