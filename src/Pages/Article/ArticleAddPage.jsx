import React, { useState } from "react";
import * as Yup from "yup";
import toast from "react-hot-toast";


const ArticleAddPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    image: null,
    content: "",
  });
  const [errors, setErrors] = useState({});
  

  const ArticleSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters")
    .required("Title is required"),
  content: Yup.string()
    .min(10, "Content must be at least 10 characters")
    .required("Content is required"),
});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ArticleSchema.validate(formData, { abortEarly: false });
      setErrors({});
      console.log(formData);
      toast.success("Article submitted successfully!");
    } catch (err) {
      if (err.inner) {
        const formErrors = {};
        err.inner.forEach((error) => {
          formErrors[error.path] = error.message;
        });
        setErrors(formErrors);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Add New Article
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 g-white  cursor-pointer "
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default ArticleAddPage;
