import { useState,useEffect } from "react";
import axios from "axios"

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${baseUrl }/api/articles`);
        setArticles(response.data);
      } catch (err) {
        console.error("Error fetching articles:", err);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Articles</h1>
          <p className="text-lg text-gray-600">
            Discover our latest articles and insights
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No articles found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;
