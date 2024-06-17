import { redirect } from "next/navigation";
import { Router, useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
const Login = () => {
  const [email, setEmail] = useState<string>("marlon.savian@gmail.com");
  const [password, setPassword] = useState<string>("123456");
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_BUDGET_TRACKER_API || "";

  const makeLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Fill email and password");
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
        toast.success("Login successfully");
        router.push("/transactions");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error to login, try again.");
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-blue-500">
      <form className="p-6 md:p-12 bg-white rounded-2xl" onSubmit={makeLogin}>
        <div className="flex items-center text-md mb-6 md:mb-8">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="email"
            className="bg-gray-100 rounded-lg pl-3 py-2 focus:outline-none w-full"
            placeholder="Email"
          />
        </div>
        <div className="flex items-center text-md mb-6 md:mb-8">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            className="bg-gray-100 rounded-lg pl-3 py-2 focus:outline-none w-full"
            placeholder="Password"
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-b from-gray-700 to-gray-900 font-medium p-3 text-white uppercase w-full rounded-lg"
        >
          Login
        </button>
      </form>
      <ToastContainer theme="dark" />
    </div>
  );
};

export default Login;
