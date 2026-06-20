import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VoteResult from "./pages/VoteResult";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import QrCode from "./pages/QrCode";
import QrScan from "./pages/QrScan";
import FriendAccept from "./pages/FriendAccept";
import MyPage from "./pages/MyPage";
import CharacterChange from "./pages/CharacterChange";
import InterestSelect from "./pages/InterestSelect";
import PointPage from "./pages/Point";
import BuyCharacter from "./pages/BuyCharacter";
import AddFriend from "./pages/AddFriend";
import AddFriendUrl from "./pages/AddFriendUrl";
import FriendProfile from "./pages/FriendProfile";
import FriendList from "./pages/FriendList";
import InterestEdit from "./pages/InterestEdit";

function AppContent() {
  const location = useLocation();
  const hideNavPaths = [
    "/",
    "/login",
    "/signup",
    "/qr-code",
    "/qr-scan",
    "/friend-accept",
  ];
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
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 상태바 영역 (시간/배터리 자리, 비워둠) */}
      <div style={{ height: "24px", flexShrink: 0 }} />
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
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
          <Route path="/friend-accept" element={<FriendAccept />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/character-change" element={<CharacterChange />} />
          <Route path="/interest-select" element={<InterestSelect />} />
          <Route path="/point" element={<PointPage />} />
          <Route path="/buy-character" element={<BuyCharacter />} />
          <Route path="/add-friend" element={<AddFriend />} />
          <Route path="/add-friend-url" element={<AddFriendUrl />} />
          <Route path="/friend-profile" element={<FriendProfile />} />
          <Route path="/friend-list" element={<FriendList />} />
          <Route path="/interest-edit" element={<InterestEdit />} />
        </Routes>
      </div>
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
