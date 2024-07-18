import Link from "next/link";
import { ArrowDown, ArrowUp, BarChart, CirclePlus, CreditCard, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { Account, CategoryTotal, Transaction } from "../types";
import { formatValue } from "../utils";
import TransactionTable from "../components/TransactionTable";

function CategoryRow({ categoryTotal }: { categoryTotal: CategoryTotal }) {
  return (
    <div className="grid grid-cols-2">
      <div className="text-xl flex items-center"> {categoryTotal.name}</div>
      <div className="text-xl font-bold flex items center justify-end">
        {formatValue(categoryTotal.total || 0)}
      </div>
    </div>
  );
}

function AccountRow({ account }: { account: Account }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className={titleStyles}>{account.name}</div>
      <div className={valueStyles}>{formatValue(account.balance)}</div>
    </div>
  );
}

const titleStyles = "sm:text-xl text-xl md:text-lg lg:text-xl flex items-center";
const valueStyles =
  "sm:text-xl text-xl md:text-lg lg:text-xl font-bold flex items center md:justify-end";
export default function Dashboard() {
  type DashboardData = {
    transactions: Transaction[];
    totalCredit: number;
    totalDebit: number;
    totalCreditCard: number;
    categoryTotals: CategoryTotal[];
    accounts: Account[];
  };
  const [data, setData] = useState<DashboardData>();

  const fetchTransactions = async () => {
    const dashboardData = await axios.get("/dashboard", {
      params: {
        startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
        endDate: dayjs().endOf("month").format("YYYY-MM-DD"),
      },
    });

    setData(dashboardData.data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-8">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center space-y-0 max-h-12 p-2">
              <Users className="h-6 w-6 text-muted-foreground mr-1" />
              <CardTitle className="text-md lg:text-xl">Saldo Atual</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              {data?.accounts.map((account) => {
                return <AccountRow key={account.id} account={account} />;
              })}
            </CardContent>
          </Card>

          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center space-y-0 max-h-12 p-2">
              <ArrowUp className="h-6 w-6 text-muted-foreground mr-1" />
              <CardTitle className="text-md lg:text-xl">Balanço mensal</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className={titleStyles}>Receitas</div>
                <div className={cn(valueStyles, "text-green-600")}>
                  {formatValue(data?.totalCredit || 0)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className={titleStyles}>Despesas</div>
                <div className={cn(valueStyles, "text-red-600")}>
                  {formatValue(data?.totalDebit || 0)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className={titleStyles}>Cartão de crédito</div>
                <div className={cn(valueStyles, "text-red-600")}>
                  {formatValue(data?.totalCreditCard || 0)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
          <Card x-chunk="dashboard-01-chunk-0" className="">
            <CardHeader className="flex flex-row items-center space-y-0 max-h-12 p-2">
              <BarChart className="h-6 w-6 text-muted-foreground mr-2" />
              <CardTitle className="text-md lg:text-xl">Despesa por categoria</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              {data?.categoryTotals
                ?.sort((a, b) => b.total - a.total)
                .map((category, index) => {
                  return <CategoryRow key={`${index}${category.name}`} categoryTotal={category} />;
                })}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2" x-chunk="dashboard-01-chunk-4">
            <CardHeader className="flex flex-row items-center ">
              <Button asChild size="sm" className="mr-auto gap-1">
                <Link href="#">
                  <CirclePlus className="h-6 w-6 mr-1" />
                  Add Transaction
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <TransactionTable
                transactions={data?.transactions}
                categoryLabels={data?.categoryTotals?.map((cat) => cat.name)}
              />
              {/*} <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Situação</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Conta</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.transactions?.map((c) => {
                    return (
                      <TableRow key={c.id}>
                        <TableCell>
                          <div className="flex gap-2">
                            <Badge
                              className={`text-xs ${c.paid ? "bg-green-400" : "bg-red-400"}`}
                              variant="default"
                            >
                              {c.paid ? "Paga" : "Não paga"}
                            </Badge>
                            {c.creditCardId && <CreditCard />}
                          </div>
                        </TableCell>
                        <TableCell>{dayjs(c.date).format("DD/MM/YYYY")}</TableCell>
                        <TableCell>{c.description}</TableCell>
                        <TableCell>{c.category}</TableCell>
                        <TableCell>{c.account}</TableCell>
                        <TableCell>{formatValue(c.amount)}</TableCell>
                        <TableCell className="text-left">Editar, pagar, </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>*/}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
