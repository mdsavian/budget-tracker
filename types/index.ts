import { Icons } from '@/components/icons';

export type Transaction = {
  id: string;
  accountId: string;
  account: string;
  creditCardId: string;
  creditCard: string;
  categoryId: string;
  category: string;
  recurringTransactionId: string;
  transactionType: string;
  date: string;
  effectuatedDate?: string;
  description: string;
  amount: number;
  fulfilled: boolean;
};

export enum TransactionType {
  Credit = 'Credit',
  Debit = 'Debit'
}

export type DashboardData = {
  transactions: Transaction[];
  totalCredit: number;
  totalDebit: number;
  totalCreditCard: number;
  totalDebitUnpaid: number;
  categoryTotals: CategoryTotal[];
  accounts: Account[];
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

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
