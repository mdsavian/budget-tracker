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

const AddTransaction = () => {
  const [accounts, setAccounts] = useState([]);
  const [creditCards, setCreditCards] = useState([]);
  const [categories, setCategories] = useState([]);

  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [account, setAccount] = useState("");
  const [description, setDescription] = useState("");
  const [paid, setPaid] = useState(false);
  const [fixed, setFixed] = useState(false);
  const [creditCard, setCreditCard] = useState("");
  const [parcelas, setParcelas] = useState("");

  const fetchData = async () => {
    const categoriesPromise = axios.get("/category");
    const AccountsPromise = axios.get("/account");
    const creditCardsPromise = axios.get("/creditcard");

    const result = await Promise.all([categoriesPromise, AccountsPromise, creditCardsPromise]);

    setAccounts(result[1].data);
    setCreditCards(result[2].data);
    setCategories(result[0].data);

    console.log(result);
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
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
            <Select value={category} onValueChange={(e) => setCategory(e)}>
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
            <Select value={account} onValueChange={(e) => setAccount(e)}>
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
            <Select value={creditCard} onValueChange={(e) => setCreditCard(e)}>
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
            Parcelas:
            <Input type="number" value={parcelas} onChange={(e) => setParcelas(e.target.value)} />
          </Label>
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
