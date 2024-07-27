import { Icons } from '@/components/icons';

export type Transaction = {
  id: string;
  account: string;
  creditCardId: string;
  creditCard: string;
  category: string;
  transactionType: string;
  date: string;
  description: string;
  amount: number;
  paid: boolean;
};

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
