'use client';
import React from 'react';
import { useState } from 'react';
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
import { useToast } from '../../ui/use-toast';
import axiosInstance from '@/lib/axios';
import { Switch } from '../../ui/switch';
import { formSchema } from './schema';
import { TransactionFormProps, TransactionFormValues } from './types';
import TransactionTypeField from './TransactionTypeField';
import CategoryField from './CategoryField';
import AccountField from './AccountField';
import CreditCardField from './CreditCardField';

export const TransactionForm: React.FC<TransactionFormProps> = ({
  initialData
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const isUpdating = !!initialData;
  const title = isUpdating ? 'Edit transaction' : 'Create transaction';
  const description = isUpdating
    ? 'Edit a transaction.'
    : 'Add a new transaction';
  const action = isUpdating ? 'Save changes' : 'Create';
  const toastMessage = isUpdating
    ? 'Transaction updated.'
    : 'Transaction created.';

  const defaultValues = React.useMemo(() => {
    if (initialData) {
      const transactionDate = initialData.effectuatedDate || initialData.date;

      return {
        amount: initialData.amount,
        fulfilled: initialData.fulfilled,
        fixed: initialData.recurringTransactionId != null,
        date: new Date(transactionDate).toISOString().split('T')[0],
        description: initialData.description,
        categoryId: initialData.categoryId,
        accountId: initialData.accountId,
        creditCardId: initialData.creditCardId ? initialData.creditCardId : '',
        updateRecurring: false,
        transactionType: initialData.transactionType
      };
    } else {
      return {
        fixed: false,
        description: '',
        categoryId: '',
        accountId: '',
        creditCardId: '',
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        price: 0,
        fulfilled: false,
        updaterecurring: false,
        category: '',
        transactionType: 'Debit'
      };
    }
  }, [initialData]);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    values: defaultValues
  });
  const isDebit = form.getValues().transactionType === 'Debit';
  const isRecurring = form.getValues().fixed;

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
          fulfilled: data.fulfilled,
          updateRecurringTransaction: data.updateRecurring ?? false
        });
      } else if (isDebit) {
        if (data.creditCardId) {
          await axiosInstance.post(`/transaction/debit/creditcard`, data);
        } else {
          await axiosInstance.post(`/transaction/debit`, data);
        }
      } else {
        await axiosInstance.post(`/transaction/credit`, {
          accountId: data.accountId,
          categoryId: data.categoryId,
          date: data.date,
          description: data.description,
          amount: data.amount,
          fulfilled: data.fulfilled
        });
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
          {/* TODO this will be moved for the own page */}
          <TransactionTypeField loading={loading} control={form.control} />

          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="fulfilled"
              render={({ field }) => (
                <FormItem className="space-x-2">
                  <FormLabel>Fulfilled</FormLabel>
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

            {isDebit && (
              <>
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

                {isUpdating && isRecurring && (
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
                )}
              </>
            )}
          </div>

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

            <CategoryField control={form.control} />

            <AccountField control={form.control} />
          </div>

          {isDebit && (
            <div className="grid grid-cols-3 items-center gap-8">
              <CreditCardField control={form.control} />

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
          )}
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
