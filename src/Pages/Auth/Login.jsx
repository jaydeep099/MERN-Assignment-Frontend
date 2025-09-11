import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { Eye, EyeOff, Loader } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { login, isAuthenticated } = useContext(AuthContext);
  const [fieldError, setFieldError] = useState({ field: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  async function performLogin(formData) {
    try {
      const response = await axios.post(`${baseUrl}/auth/login`, formData);
      return response;
    } catch (err) {
      throw err;
    }
  }
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/articles");
    }
  }, [isAuthenticated]);

  const schema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("must be valid email")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format"
      ),

    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters long"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldError({ field: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldError({ field: "", message: "" });
    setIsLoading(true);
    try {
      await schema.validate(formData, { abortEarly: false });
      const response = await performLogin(formData);

      if (response.status === 200) {
        toast.success(response.data.message);
        login(response.data.token, response.data.user);
        setIsLoading(false);
        navigate("/articles");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      if (err.name === "ValidationError" && err.inner) {
        const priority = ["email", "password"];
        const errorMap = {};

        err.inner.forEach((error) => {
          if (!errorMap[error.path]) {
            errorMap[error.path] = error.message;
          }
        });

        for (const field of priority) {
          if (errorMap[field]) {
            setFieldError({ field, message: errorMap[field] });
            break;
          }
        }
      } else if (err.response) {
        const errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          `Error: ${err.response.status}`;
        toast.error(errorMessage);
        console.log("Backend error:", err.response.data);
        setIsLoading(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center md:my-20 my-10 h-full bg-white">
      <div className="bg-white md:shadow-gray-400 md:shadow-lg md:rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold font-sans tracking-wide text-center text-gray-800 mb-6">
          Login
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {fieldError.field === "email" && (
              <p className="text-red-500 text-sm mt-1">{fieldError.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition duration-200"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {fieldError.field === "password" && (
              <p className="text-red-500 text-sm mt-1">{fieldError.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                Logging In <Loader className="animate-spin w-5 h-5" />
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <div className="flex justify-end mt-2">
          <p>Does not have an account?</p>
          <Link to="/register" className="text-blue-500 underline ml-1">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
