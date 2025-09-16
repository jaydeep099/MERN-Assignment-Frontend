import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import * as Yup from "yup";
import toast from "react-hot-toast";
import BackButton from "../../components/BackButton";
import Navbar from "../../components/Navbar";

const baseUrl = import.meta.env.VITE_BASE_URL;

const ArticleSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(60, "Title must be less than 60 characters")
    .required("Title is required"),
  content: Yup.string()
    .min(10, "Content must be at least 10 characters")
    .required("Content is required"),
});

const ArticleUpdatePage = () => {
  const { id } = useParams();
  const { token, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    articleImage: null,
    content: "",
  });
  const [errors, setErrors] = useState({});

  const fetchArticle = async () => {
    try {
      const response = await axios.get(`${baseUrl}/article/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data.article;

      setFormData({
        title: data.title,
        articleImage: data.articleImage,
        content: data.content,
      });
    } catch (err) {
      if (err.status === 401) {
        logout();
        navigate("/login");
      } else {
        toast.error("Failed to Fetch");
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [isAuthenticated, logout, navigate]);

  useEffect(() => {
    fetchArticle();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, articleImage: e.target.files[0] }));
  };

  const handleSubmit = async (e, status) => {
    e.preventDefault();
    try {
      await ArticleSchema.validate(formData, { abortEarly: false });
      setErrors({});

      const updateData = new FormData();
      updateData.append("title", formData.title);
      updateData.append("content", formData.content);
      updateData.append("articleStatus", status);

      if (formData.articleImage) {
        updateData.append("articleImage", formData.articleImage);
      }

      await axios.put(`${baseUrl}/article/update/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Article updated successfully!");
      navigate("/articles");
    } catch (err) {
      if (err.name === "ValidationError" && err.inner) {
        const formErrors = {};
        err.inner.forEach((error) => {
          formErrors[error.path] = error.message;
        });
        setErrors(formErrors);
      } else {
        console.log("Update Err", err);
        toast.error("Failed to update article");
      }
    }
  };

  return (
    <>
      <Navbar />
      <BackButton />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Update Article
          </h1>

          <form className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none ${
                  errors.title
                    ? "border-red-500"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-400"
                }`}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Update Image</label>
              <input
                type="file"
                accept=".jpeg,.jpg,.png,.webp"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold  file:bg-gray-500 file:text-white hover:file:bg-gray-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Content</label>
              <textarea
                name="content"
                rows="5"
                value={formData.content}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none ${
                  errors.content
                    ? "border-red-500"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-400"
                }`}
              ></textarea>
              {errors.content && (
                <p className="text-sm text-red-500 mt-1">{errors.content}</p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                className="w-full bg-gray-600 text-white font-medium py-2 rounded-lg shadow hover:bg-gray-700 transition"
                onClick={(e) => handleSubmit(e, "draft")}
              >
                Save As Draft
              </button>
              <button
                onClick={(e) => handleSubmit(e, "published")}
                className="w-full bg-green-600 text-white font-medium py-2 rounded-lg shadow hover:bg-green-700 transition"
              >
                Update Article
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ArticleUpdatePage;
