import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import * as Yup from "yup";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, Lock } from "lucide-react";

const baseUrl = import.meta.env.VITE_BASE_URL;

async function setNewPassword(token, pass) {
  try {
    const response = await axios.post(
      `${baseUrl}/users/setpassword`,
      { password: pass },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (err) {
    console.log("API Error:", err);
    throw err;
  }
}

const SetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const schema = Yup.object().shape({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await schema.validate({ password }, { abortEarly: false });

      const localToken = localStorage.getItem("token");
      if (token !== localToken) {
        throw "User not authorized";
      }
      const response = await setNewPassword(token, password);
      console.log(response);

      if (response.status === 201) {
        toast.success(response.data.message);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      if (err.inner) {
        err.inner.forEach((error) => {
          toast.error(error.message);
        });
      } else if (err.response) {
        const errorMessage = err.response.data?.message;
        toast.error(errorMessage);
      } else {
        toast.error(err);
      }
    }
  };

  return (
    <div className="flex justify-center items-center md:m-15 m-0 bg-gray-50">
      <Toaster />
      <div className="bg-white md:shadow-lg md:rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto bg-violet-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-violet-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Set New Password
          </h1>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition duration-200"
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
          </div>

          <button
            type="submit"
            className={`w-full font-semibold py-3 px-4 rounded-lg transition duration-200 ${
              !token
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-violet-600 text-white hover:bg-violet-700 focus:ring-4 focus:ring-violet-200"
            }`}
          >
            Set Password
          </button>

          {!token && (
            <div className="text-center">
              <p className="text-red-500 text-sm">
                Invalid or missing token. Please check your link.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SetPassword;
