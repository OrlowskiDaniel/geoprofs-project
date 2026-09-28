import { Routes, Route } from "react-router-dom";
import Profile from "./Profile.jsx";
import Home from "./Home.jsx";
import Login from "./Login.jsx";

export default function App() {
  return (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Home />} />
    </Routes>
  );
}