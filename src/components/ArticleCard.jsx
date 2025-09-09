import { Link } from "react-router";

const imagePath = import.meta.env.VITE_IMAGE_PATH
const ArticleCard = ({ article }) => {
  return (
    <Link to={`/article/${article._id}`} className="block h-full">
      <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col h-full">
        <div className="w-full h-48 overflow-hidden rounded-xl">
          <img
            src={`${imagePath}${article.articleImage}`}
            alt="image"
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="text-lg font-semibold text-gray-800 mt-4">
          {article.title}
        </h2>

        <p className="text-gray-600 text-sm leading-relaxed mt-4 flex-grow overflow-clip line-clamp-2">
          {article.content}
        </p>
      </div>
    </Link>
  );
};

export default ArticleCard;
