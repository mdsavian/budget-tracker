import * as z from 'zod';

export const formSchema = z
  .object({
    amount: z.coerce
      .number()
      .min(1, { message: 'Amount should be higher than 0' }),
    fulfilled: z.boolean(),
    fixed: z.boolean(),
    date: z.string(),
    description: z
      .string()
      .min(3, { message: 'Description must be at least 3 characters' }),
    categoryId: z.string().min(1, { message: 'Please select a category' }),
    accountId: z.string().min(1, { message: 'Please select a account' }),
    creditCardId: z.string().optional(),
    installments: z.coerce.number().optional(),
    updateRecurring: z.boolean().optional(),
    transactionType: z
      .string()
      .min(1, { message: 'Please select a transaction type' })
  })
  .refine(
    (schema) => {
      if (schema.fixed && schema.installments && schema.installments > 1) {
        return false;
      }
      return true;
    },
    {
      message: "You can't have fixed and installments at the same time",
      path: ['fixed']
    }
  );
