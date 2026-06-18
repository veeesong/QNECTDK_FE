import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VoteResult from "./pages/VoteResult";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import QrCode from "./pages/QrCode";
import QrScan from "./pages/QrScan";

function AppContent() {
  const location = useLocation();
  const hideNavPaths = ["/", "/login", "/signup", "/qr-code", "/qr-scan"];
  const showNav = !hideNavPaths.includes(location.pathname);

  return (
    <div
      style={{
        width: "393px",
        height: "852px",
        margin: "0 auto",
        boxShadow: "0 0 20px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/vote-result" element={<VoteResult />} />
        <Route path="/home" element={<Home />} />
        <Route path="/qr-code" element={<QrCode />} />
        <Route path="/qr-scan" element={<QrScan />} />
      </Routes>
      {showNav && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
