'use client';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { useToast } from '../ui/use-toast';
import axiosInstance from '@/lib/axios';
import { Switch } from '../ui/switch';
import { Transaction } from '@/types';

const formSchema = z
  .object({
    amount: z.coerce
      .number()
      .min(1, { message: 'Amount should be higher than 0' }),
    paid: z.boolean(),
    fixed: z.boolean(),
    date: z.string(),
    description: z
      .string()
      .min(3, { message: 'Description must be at least 3 characters' }),
    categoryId: z.string().min(1, { message: 'Please select a category' }),
    accountId: z.string().min(1, { message: 'Please select a account' }),
    creditCardId: z.string().optional(),
    hasInstallments: z.boolean().optional(),
    installments: z.coerce.number().optional(),
    updateRecurring: z.boolean().optional()
  })
  .refine(
    (schema) => {
      if (
        schema.hasInstallments &&
        schema.installments !== undefined &&
        schema.installments < 2
      ) {
        return false;
      }
      return true;
    },
    {
      message: 'Please select the correct number of installments (>=2)',
      path: ['installments']
    }
  )
  .refine(
    (schema) => {
      if (schema.fixed && schema.hasInstallments) {
        return false;
      }
      return true;
    },
    {
      message: "You can't have fixed and installments at the same time",
      path: ['fixed']
    }
  );

type TransactionFormValues = z.infer<typeof formSchema>;

interface TransactionFormProps {
  initialData: Transaction | null;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  initialData
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const title = initialData ? 'Edit transaction' : 'Create transaction';
  const description = initialData
    ? 'Edit a transaction.'
    : 'Add a new transaction';
  const action = initialData ? 'Save changes' : 'Create';
  const toastMessage = initialData
    ? 'Transaction updated.'
    : 'Transaction created.';

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
    ? {
        amount: initialData.amount,
        paid: initialData.paid,
        fixed: initialData.recurringTransactionId != null,
        date: new Date(initialData.date).toISOString().split('T')[0],
        description: initialData.description,
        categoryId: initialData.categoryId,
        accountId: initialData.accountId,
        creditCardId: initialData.creditCardId ? initialData.creditCardId : '',
        updateRecurring: false
      }
    : {
        fixed: false,
        description: '',
        categoryId: '',
        accountId: '',
        creditCardId: '',
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        price: 0,
        paid: false,
        updaterecurring: false,
        category: ''
      };

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    values: defaultValues
  });

  const onSubmit = async (data: TransactionFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await axiosInstance.put('/transaction/update', {
          transactionId: initialData.id,
          accountId: data.accountId,
          creditCardId: data.creditCardId,
          categoryId: data.categoryId,
          recurringTransactionId: initialData.recurringTransactionId,
          date: data.date,
          description: data.description,
          amount: data.amount,
          updateRecurringTransaction: data.updateRecurring ?? false
        });
      } else if (data.creditCardId) {
        await axiosInstance.post(`/transaction/expense/creditcard`, data);
      } else {
        await axiosInstance.post(`/transaction/expense`, data);
      }
      toast({
        variant: 'default',
        title: 'Success',
        description: toastMessage
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
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
              name="updateRecurring"
              render={({ field }) => (
                <FormItem className="space-x-2">
                  <FormLabel>Update Recurring</FormLabel>
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
              name="fixed"
              render={({ field }) => (
                <FormItem className="space-x-2">
                  <FormLabel>Recurring</FormLabel>
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
            <FormField
              control={form.control}
              name="hasInstallments"
              render={({ field }) => (
                <FormItem className="space-x-2">
                  <FormLabel>Installment</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={() => {
                        field.onChange(!field.value);
                        form.setValue('installments', 0);
                      }}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="installments"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={form.getValues().hasInstallments === false}
                      type="number"
                      placeholder="2"
                      {...field}
                    />
                  </FormControl>
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
