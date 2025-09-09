import { useState, useEffect } from "react";
import axios from "axios";
import ArticleCard from "../../components/ArticleCard";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseUrl}/article/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setArticles(response.data.articles);
    } catch (err) {
      console.error("Error fetching articles:", err);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);
 
  const handlePostClick = () => {
    navigate('/addarticle')
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:shadow-gray-400 md:shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Articles</h1>
          <p className="text-lg text-gray-600">
            Discover our latest articles and insights
          </p>
          <div className="flex justify-end">
            <button
              onClick={handlePostClick}
              className="flex items-center gap-0.5 bg-blue-600 text-white p-2 rounded-2xl hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus size={16} className="mt-1" />
              <span className="text-[16px] pr-0.5">Post</span>
            </button>
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No articles found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;
