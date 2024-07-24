export type TransactionData = {
  paid: boolean;
  creditCard: boolean;
  creditCardId: string;
  type: string;
  date: string;
  description: string;
  account: string;
  category: string;
  amount: number;
};

// TODO change this to english
export type transactionType = 'Receita' | 'Despesa';
