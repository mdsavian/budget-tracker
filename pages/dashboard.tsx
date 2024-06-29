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

function CategoryRow() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div className="text-md flex items-center">Conta PF</div>
      <div className="text-lg md:text-xl font-bold flex items center lg:justify-end leading-1">
        R$45,231.89
      </div>
    </div>
  );
}

export default function Dashboard() {
  const array = new Array(10).fill(1);

  const transactions = async () => {
    const x = await axios.get("/dashboard");
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 md:gap-8">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center space-y-0">
              <Users className="h-6 w-6 text-muted-foreground mr-2" />
              <CardTitle className="text-md font-medium">Saldo Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 mt-4">
                <div className="text-md flex items-center">Conta PF</div>
                <div className="text-lg md:text-xl font-bold flex items center lg:justify-end">
                  R$45,231.89
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="text-md flex items-center">Conta PJ</div>
                <div className="text-xl flex items center font-bold lg:justify-end">
                  R$45,231.89
                </div>
              </div>
            </CardContent>
          </Card>

          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center space-y-0">
              <ArrowUp className="h-6 w-6 text-muted-foreground" />
              <CardTitle className="text-md font-medium">Receitas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl lg:text-4xl text-center font-bold">R$23.550,00</div>
            </CardContent>
          </Card>

          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center space-y-0">
              <ArrowDown className="h-6 w-6 text-muted-foreground mr-2" />
              <CardTitle className="text-md font-medium">Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl lg:text-4xl text-center font-bold">R$23.550,00</div>
            </CardContent>
          </Card>

          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center space-y-0">
              <CreditCard className="h-6 w-6 text-muted-foreground mr-2" />
              <CardTitle className="text-md font-medium">Cartão de crédito</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl lg:text-4xl text-center font-bold">R$23.550,00</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 md:gap-8">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center space-y-0">
              <BarChart className="h-6 w-6 text-muted-foreground mr-2" />
              <CardTitle className="text-md font-medium">Despesa por categoria</CardTitle>
            </CardHeader>
            <CardContent>
              {array.map((c) => {
                return <CategoryRow key={c} />;
              })}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:gap-8">
          <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
            <CardHeader className="flex flex-row items-center ">
              <Button asChild size="sm" className="mr-auto gap-1">
                <Link href="#">
                  <CirclePlus className="h-6 w-6 mr-1" />
                  Add Transaction
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
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
                  <TableRow>
                    <TableCell>
                      <Badge className="text-xs" variant="default">
                        Approved
                      </Badge>
                      <CreditCard />
                    </TableCell>
                    <TableCell>01/01/2024</TableCell>
                    <TableCell>Compra semanal</TableCell>
                    <TableCell>Comida casa</TableCell>
                    <TableCell>Conta PF</TableCell>
                    <TableCell>1.234,55</TableCell>
                    <TableCell className="text-left">Editar, pagar, </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
