import "./App.css";
import { Routes, Route } from "react-router";
import Navbar from "./components/Navbar";
import Articles from "./Pages/Articles";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import SetPassword from "./Pages/Auth/setPassword";
import { Toaster } from "react-hot-toast";
import ProtectedPages from "./Pages/ProtectedPages";
function App() {
  return (
    <>
      <Toaster />
      <Navbar />
      <Routes>
        <Route element={<ProtectedPages/>}>
    
        </Route>
        <Route path="/" element={<Articles />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/setPassword/:token" element={<SetPassword />} />
      </Routes>
    </>
  );
}

export default App;
