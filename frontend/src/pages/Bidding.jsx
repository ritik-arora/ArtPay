import { useParams } from "react-router-dom";
import { useState } from "react";

export default function Bidding() {
  const { id } = useParams();
  const [bids, setBids] = useState([
    { user: "Alice", amount: 3500 },
    { user: "Bob", amount: 4000 },
  ]);
  const [amount, setAmount] = useState("");

  const placeBid = () => {
    if(!amount) return;
    setBids([...bids, { user: "You", amount: Number(amount) }]);
    setAmount("");
  };

  return (
    <div className="page">
      <h2>Bidding for Auction #{id}</h2>
      <ul>
        {bids.map((b, i) => (
          <li key={i}>{b.user}: ₹{b.amount}</li>
        ))}
      </ul>
      <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Your bid" type="number" />
      <button onClick={placeBid}>Place Bid</button>
    </div>
  );
}
