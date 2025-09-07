import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";

const baseUrl = import.meta.env.VITE_BASE_URL;

async function loginFetch(formData) {
  try {
    const response = await axios.post(`${baseUrl}/users/login`, formData);
    return response;
  } catch (error) {
    throw err;
  }
}
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),

    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await schema.validate(formData, { abortEarly: false });
      const response = await loginFetch(formData);
      console.log(response);

      if (response.status === 200) {
        toast.success(response.data.message);
        login(response.data.token, response.data.user);
        navigate("/");
      }
    } catch (err) {
      if (err.inner) {
        err.inner.forEach((error) => {
          toast.error(error.message);
        });
      } else if (err.response) {
        const errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          `Error: ${err.response.status}`;
        toast.error(errorMessage);
        console.log("Backend error:", err.response.data);
      }
    }
  };

  return (
    <div className="flex justify-center items-center md:my-20 my-10 h-full">
      <div className="bg-white md:shadow-gray-400 md:shadow-lg md:rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold font-sans tracking-wide text-center text-gray-800 mb-6">
          Login
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
