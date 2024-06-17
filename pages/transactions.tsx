import { useEffect, useState } from "react";

const Transactions = () => {
  const [transactions, setTransactions] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const url = process.env.NEXT_PUBLIC_BUDGET_TRACKER_API || "";

  useEffect(() => {
    setLoading(true);
    fetch(`${url}/transaction`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setTransactions(data);
      });
  }, [url]);

  return (
    <>
      {loading && "Loading..."}
      {!loading && !transactions && "not found"}
      {!loading && transactions?.length > 0 && (
        <>
          <table>
            <tbody>
              {transactions?.map((trans: any) => {
                return (
                  <tr key={trans.id}>
                    <td key={trans.id}>{JSON.stringify(trans)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

export default Transactions;
