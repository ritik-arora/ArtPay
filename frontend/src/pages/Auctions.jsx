import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Auctions() {
  const [auctions, setAuctions] = useState([
    { id: 1, title: "Abstract Waves", basePrice: 3000, endTime: new Date(Date.now() + 3600 * 1000) },
    { id: 2, title: "Golden Forest", basePrice: 5000, endTime: new Date(Date.now() + 7200 * 1000) },
  ]);

  const [timers, setTimers] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const updates = {};
      auctions.forEach(a => {
        const diff = Math.max(0, a.endTime - new Date());
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        updates[a.id] = `${h}h ${m}m ${s}s`;
      });
      setTimers(updates);
    }, 1000);
    return () => clearInterval(interval);
  }, [auctions]);

  return (
    <div className="page">
      <h2>Auctions</h2>
      <div className="cards">
        {auctions.map(a => (
          <div key={a.id} className="card">
            <h3>{a.title}</h3>
            <p>Base Price: ₹{a.basePrice}</p>
            <p>Ends in: <span className="timer">{timers[a.id]}</span></p>
            <Link to={`/bidding/${a.id}`} className="btn">Go to Bidding</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
