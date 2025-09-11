import { Link, useNavigate } from "react-router";
import { SquarePen, Trash2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const baseUrl = import.meta.env.VITE_BASE_URL;
const imagePath = import.meta.env.VITE_IMAGE_PATH;
const ArticleCard = ({ article, onDeleteSuccess }) => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  const currentUser = JSON.parse(localStorage.getItem('user'))
  const isSameUser = article.authorId === currentUser._id;

  const navigateToUpdate = (id) => {
    navigate(`/article/update/${id}`);
  };

  const handleDeletePost = async (id) => {
    try {
      const response = await axios.delete(`${baseUrl}/article/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        onDeleteSuccess(id);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in deleting");
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col h-full">
        <div className="w-full h-full overflow-hidden rounded-xl">
          <img
            src={`${imagePath}${article.articleImage}`}
            alt="image"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex justify-between items-center gap-3 mt-4">
          <div className="flex items-center gap-3">
            <img
              src={`${imagePath}${article.user.profileImage}`}
              alt={`${article.user.firstName} ${article.user.lastName}`}
              className="w-10 h-10 rounded-full object-cover border"
            />
            <div>
              <p className="text-gray-800 font-medium">
                {article.user.firstName} {article.user.lastName}
              </p>
              <p className="text-gray-500 text-sm">{article.user.email}</p>
            </div>
          </div>

          {isSameUser ? (
            <div className="flex items-center space-x-1">
              <SquarePen
                className="cursor-pointer hover:text-blue-500"
                onClick={() => navigateToUpdate(`${article._id}`)}
              />
              <Trash2
                className="cursor-pointer hover:text-red-600"
                onClick={() => {
                  setDeleteId(article._id);
                  setShowModal(true);
                }}
              />
            </div>
          ) : null}
        </div>
        <Link to={`/article/${article._id}`}>
          <h2 className="text-lg font-semibold text-gray-800 mt-4">
            {article.title}
          </h2>
        </Link>

        <p className="text-gray-600 text-sm leading-relaxed mt-4 flex-grow overflow-clip line-clamp-2">
          {article.content}
        </p>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mt-2">
              Are you sure you want to delete this article?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeletePost(deleteId);
                  setShowModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ArticleCard;
