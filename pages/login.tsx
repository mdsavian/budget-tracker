import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useState, FormEvent } from "react";

export default function Component() {
  const [email, setEmail] = useState<string>("marlon.savian@gmail.com");
  const [password, setPassword] = useState<string>("123456");
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_BUDGET_TRACKER_API || "";

  const makeLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    try {
      const responseLogin = await fetch(`${url}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (responseLogin.status === 200) {
        router.push("/transactions");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="w-full h-screen flex items-center justify-center px-4 theme-zinc">
        <form onSubmit={makeLogin}>
          <Card className="mx-auto max-w-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Login</CardTitle>
              <CardDescription>
                Enter your email and password to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    value={email}
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    value={password}
                    id="password"
                    type="password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
