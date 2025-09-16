import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Loader } from "lucide-react";
import BackButton from "../../components/BackButton";
import Navbar from "../../components/Navbar";

const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const imagePath = import.meta.env.VITE_IMAGE_PATH;
  const fetchArticle = async () => {
    try {
      const res = await axios.get(`${baseUrl}/article/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setArticle(res.data.article);
    } catch (error) {
      console.error("Failed to fetch article:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isAuthenticated === false) {
      logout();
      navigate("/login");
    }
  }, [isAuthenticated, logout, navigate]);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen flex-col space-y-2">
        <span className="sr-only">Loading…</span>
        <Loader className="animate-spin w-12 h-12 text-blue-500" />
      </div>
    );
  }
  if (!article) return <p>Article not found.</p>;

  return (
    <>
      <Navbar />
      <BackButton />
      <div className="max-w-6xl mx-auto p-6 md:shadow-gray-400 md:shadow-lg md:rounded-2xl my-[6px]">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <div className="w-full h-80 overflow-hidden rounded-xl mb-6">
          <img
            src={`${imagePath}${article.articleImage}`}
            alt={article.title}
            className="w-full h-full object-fill  "
          />
        </div>

        <p className="text-gray-700 leading-relaxed break-words overflow-hidden">
          {article.content}
        </p>
      </div>
    </>
  );
};

export default ArticlePage;
