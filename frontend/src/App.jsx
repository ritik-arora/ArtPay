import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Auctions from "./pages/Auctions";
import Bidding from "./pages/Bidding";
import Profile from "./pages/Profile";
import "./App.css";

function App() {
  return (
    <Router>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/register">Register</Link>
        <Link to="/auctions">Auctions</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      <div className="content">
        <Routes>
          <Route path="/" element={<h1>Hello Auction</h1>} />
          <Route path="/register" element={<Register />} />
          <Route path="/auctions" element={<Auctions />} />
          <Route path="/bidding/:id" element={<Bidding />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
