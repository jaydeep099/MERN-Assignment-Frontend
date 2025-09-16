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
import ArticleUpdatePage from "./Pages/Article/ArticleUpdatePage";
function App() {
  return (
    <div className="bg-gray-50">
      <Toaster />
      <Routes>
        <Route element={<ProtectedPages />}>
          <Route path="/articles" element={<Articles />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/article/add" element={<ArticleAddPage />} />
          <Route path="/article/update/:id" element={<ArticleUpdatePage />} />
        </Route>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/setPassword/:token" element={<SetPassword />} />
      </Routes>
    </div>
  );
}

export default App;
