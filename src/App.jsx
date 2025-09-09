import "./App.css";
import { Routes, Route } from "react-router";
import Navbar from "./components/Navbar";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import SetPassword from "./Pages/Auth/SetPassword";
import { Toaster } from "react-hot-toast";
import ProtectedPages from "./Pages/ProtectedPages";
import Articles from "./Pages/Article/Articles";
import ArticlePage from "./Pages/Article/ArticlePage";
import ArticleAddPage from "./Pages/Article/ArticleAddPage";
function App() {
  return (
    <>
      <Toaster />
      <Navbar />
      <Routes>
        <Route element={<ProtectedPages />}>
          <Route path="/" element={<Articles />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/addarticle" element={<ArticleAddPage />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/setPassword/:token" element={<SetPassword />} />
      </Routes>
    </>
  );
}

export default App;
