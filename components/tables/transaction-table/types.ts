export type TransactionData = {
  id: string;
  fulfilled: boolean;
  creditCard: boolean;
  creditCardId: string;
  type: string;
  date: string;
  description: string;
  account: string;
  category: string;
  amount: number;
  recurringId: string;
};

// TODO change this to english
export type transactionType = 'Credit' | 'Debit';
