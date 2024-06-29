import { AppProps } from "next/app";
import "../app/globals.css";
import axios from "axios";

const App = ({ Component, pageProps }: AppProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_BUDGET_TRACKER_API || "";
  axios.defaults.baseURL = baseUrl;
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common["Content-Type"] = "application/json";

  return <Component {...pageProps} />;
};

export default App;
