import { useContext, useState } from "react";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import axios from "axios";
import BackButton from "../../components/BackButton";
import Navbar from "../../components/Navbar";

const baseUrl = import.meta.env.VITE_BASE_URL;
const ArticleAddPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    articleImage: null,
    content: "",
  });
  const [errors, setErrors] = useState({});
  const { token, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const ArticleSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, "Title must be at least 3 characters")
      .max(60, "Title must be less than 60 characters")
      .required("Title is required"),
    content: Yup.string()
      .min(10, "Content must be at least 10 characters")
      .required("Content is required"),
  });

  useEffect(() => {
    if (isAuthenticated === false) {
      logout();
      navigate("/login");
    }
  }, [isAuthenticated, logout, navigate]);

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

      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      data.append("articleStatus", status);
      if (formData.articleImage) {
        data.append("articleImage", formData.articleImage);
      }

      const response = await axios.post(`${baseUrl}/article/create`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201 || 200) {
        navigate("/articles");
        toast.success(
          status === "draft"
            ? "Article saved as draft!"
            : "Article published successfully!"
        );
      }
    } catch (err) {
      if (err.inner) {
        const formErrors = {};
        err.inner.forEach((error) => {
          formErrors[error.path] = error.message;
        });
        setErrors(formErrors);
      } else if (err.response?.status === 401) {
        logout();
        navigate("/login");
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <BackButton />
      <div className=" flex items-center justify-center p-2">
        <div className="w-full bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Add New Article
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
              <label className="block text-gray-700 mb-1">Image</label>
              <input
                type="file"
                name="articleImage"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 g-white  cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold  file:bg-gray-500 file:text-white hover:file:bg-gray-600"
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
                className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg shadow hover:bg-blue-700 transition"
                onClick={(e) => handleSubmit(e, "published")}
              >
                Publish
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArticleAddPage;
