import { useState, useEffect, useContext } from "react";
import axios from "axios";
import ArticleCard from "../../components/ArticleCard";
import { Plus, Search, Check, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const { logout, isAuthenticated } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const limit = 10;
  const totalPages = Math.ceil(total / limit);
  const navigate = useNavigate();

  const statusOptions = [
    { label: "Published", value: "published" },
    { label: "Draft", value: "draft" },
  ];

  const selectedOption =
    statusOptions.find((opt) => opt.value === status) || statusOptions[0];
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const userId = currentUser._id;
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseUrl}/article/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search: search.trim(),
          page,
          status,
          userId,
        },
      });

      setArticles(response.data.articles);
      setTotal(response.data.total);
    } catch (err) {
      if (err.status === 401) {
        logout();
        navigate("/login");
      }
      console.error("Error fetching articles:", err);
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
    const getData = setTimeout(() => {
      fetchArticles();
    }, 1200);
    return () => clearTimeout(getData);
  }, [search, page, status]);

  const handlePostClick = () => {
    navigate("/article/add");
  };

  const handleStatusChange = (selectedValue) => {
    setStatus(selectedValue);
    setPage(1);
    setIsDropdownOpen(false);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
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

            <div className="mt-8 mb-8">
              <div className="flex justify-between items-center mb-4">
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center w-fit gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    {selectedOption.label}
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleStatusChange(option.value)}
                          className={`w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                            status === option.value
                              ? "bg-blue-50 text-blue-900 font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          <span>{option.label}</span>
                          {status === option.value && (
                            <Check className="w-4 h-4 text-blue-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handlePostClick}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Plus size={16} />
                  <span className="text-sm font-medium">New Post</span>
                </button>
              </div>

              <div className="flex justify-start">
                <div className="w-full max-w-md">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={search}
                      onChange={handleSearch}
                      placeholder={`Search ${status} articles...`}
                      className="w-full py-2.5 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-500 text-lg mt-4">Loading...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {search.trim()
                  ? `No ${status} articles found for "${search}"`
                  : status === "draft"
                  ? "No drafts found."
                  : "No published articles found."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
              {articles.map((article) => (
                <ArticleCard
                  key={article._id}
                  article={article}
                  onDeleteSuccess={(id) => {
                    setArticles((prev) => prev.filter((a) => a._id !== id));
                    setTotal((prev) => prev - 1);
                  }}
                />
              ))}
            </div>
          )}
        </div>
        
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8 pb-8">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                page === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200"
                  : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-sm"
              }`}
            >
              Previous
            </button>

            <span className="text-gray-700 font-medium px-4">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                page === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200"
                  : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-sm"
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
