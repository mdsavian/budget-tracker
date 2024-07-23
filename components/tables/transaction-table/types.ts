export type TransactionData = {
  paid: boolean;
  status: JSX.Element;
  creditCard: string | JSX.Element;
  creditCardId: string;
  type: string;
  date: string;
  description: string;
  account: string;
  category: string;
  amount: number;
  amountFormatted: string;
};
