import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import axios from "axios";
import dayjs from "dayjs";

const AddTransaction = () => {
  const [accounts, setAccounts] = useState([]);
  const [creditCards, setCreditCards] = useState([]);
  const [categories, setCategories] = useState([]);

  const [date, setDate] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<string>("");
  const [accountId, setAccountId] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [paid, setPaid] = useState<boolean>(false);
  const [fixed, setFixed] = useState<boolean>(false);
  const [creditCardId, setCreditCardId] = useState<string>("");
  const [installments, setInstallments] = useState<number>(0);

  const fetchData = async () => {
    const categoriesPromise = axios.get("/category");
    const AccountsPromise = axios.get("/account");
    const creditCardsPromise = axios.get("/creditcard");

    const result = await Promise.all([categoriesPromise, AccountsPromise, creditCardsPromise]);

    setAccounts(result[1].data);
    setCreditCards(result[2].data);
    setCategories(result[0].data);
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here

    if (!date || !amount || !categoryId || !accountId) {
      //log error (toast)
      return;
    }

    const url = creditCardId ? "/transaction/expense/creditcard" : "/transaction/expense";

    axios.post(url, {
      date: dayjs(date).format("YYYY-MM-DD"),
      amount,
      categoryId,
      accountId,
      description,
      paid,
      fixed,
      creditCardId: creditCardId ? creditCardId : null,
      installments: installments ? installments : 0,
    });
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="w-full h-screen flex items-center justify-center px-4 theme-zinc">
        <form onSubmit={handleSubmit}>
          <Label>
            Date:
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Label>
          <Label>
            Amount:
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </Label>
          <Label>
            Category
            <Select value={categoryId} onValueChange={(e) => setCategoryId(e)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category: string) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Label>
          <Label>
            Account:
            <Select value={accountId} onValueChange={(e) => setAccountId(e)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account: string) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
                {/* Remove the SelectItem with value "light" */}
              </SelectContent>
            </Select>
          </Label>
          <Label>
            Description:
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Label>
          <Label>
            Paid:
            <Input type="checkbox" checked={paid} onChange={(e) => setPaid(e.target.checked)} />
          </Label>
          <Label>
            Fixed:
            <Input type="checkbox" checked={fixed} onChange={(e) => setFixed(e.target.checked)} />
          </Label>
          <Label>
            Credit Card:
            <Select value={creditCardId} onValueChange={(e) => setCreditCardId(e)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Credit Card" />
              </SelectTrigger>
              <SelectContent>
                {creditCards.map((creditCard) => (
                  <SelectItem key={creditCard.id} value={creditCard.id}>
                    {creditCard.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Label>
          <Label>
            Installments:
            <Input
              type="number"
              value={installments}
              onChange={(e) => setInstallments(e.target.value)}
            />
          </Label>
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
