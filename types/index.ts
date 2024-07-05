export type Transaction = {
  id: string;
  account: string;
  creditCardId: string | null;
  creditCardName: string | null;
  category: string;
  transactionType: "Credit" | "Debit";
  date: string;
  description: string;
  amount: number;
  paid: boolean;
  costOfLiving: boolean;
};

export type Account = {
  name: string;
  id: string;
  balance: number;
};

export type CategoryTotal = {
  name: string;
  total: number;
};
