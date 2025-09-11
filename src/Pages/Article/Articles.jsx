import { useState, useEffect, useContext } from "react";
import axios from "axios";
import ArticleCard from "../../components/ArticleCard";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [status, setStatus] = useState("published");
  const [search, setSearch] = useState("");
  const { logout } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const filteredArticles = articles.filter((article) => {
    if (status === "published") {
      return article.articleStatus === "published";
    } else if (status === "draft") {
      return (
        article.articleStatus === "draft" &&
        article.authorId === currentUser._id
      );
    }
    return false;
  });

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseUrl}/article/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { search, page },
      });

      setArticles(response.data.articles);
      setTotal(response.data.total);
    } catch (err) {
      if (err.status === 401) {
        logout();
        navigate("/login");
      }
      console.error("Error fetching articles:", err);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [search, page]);

  const handlePostClick = () => {
    navigate("/article/add");
  };

  const handleStatus = (e) => {
    setStatus(e.target.value);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-4 md:shadow-gray-400 md:shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Articles</h1>
            <p className="text-lg text-gray-600">
              Discover our latest articles and insights
            </p>
            <div className="flex justify-between relative z-20">
              <select
                value={status}
                onChange={handleStatus}
                className="p-3 rounded-lg font-semibold shadow-sm bg-white cursor-pointer"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>

              <button
                onClick={handlePostClick}
                className="flex items-center gap-0.5 bg-blue-600 text-white p-2 rounded-2xl hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus size={16} className="mt-1" />
                <span className="text-[16px] pr-0.5">Post</span>
              </button>
            </div>

            <div className="w-full max-w-md mt-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>

                <input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search..."
                  className="w-full py-3 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>
            </div>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {status === "draft" ? "No drafts found." : "No articles found."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
              {filteredArticles.map((article) => (
                <ArticleCard
                  key={article._id}
                  article={article}
                  onDeleteSuccess={(id) => {
                    setArticles((prev) => prev.filter((a) => a._id !== id));
                  }}
                />
              ))}
            </div>
          )}
        </div>
        {totalPages >= 1 && status==="published"&& (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg border ${
                page === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Prev
            </button>

            <span className="text-gray-700 font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-lg border ${
                page === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Articles;
