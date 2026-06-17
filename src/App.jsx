import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          width: "393px",
          height: "852px",
          margin: "0 auto",
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
