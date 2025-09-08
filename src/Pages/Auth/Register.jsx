import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router";
const baseUrl = import.meta.env.VITE_BASE_URL;

async function register(formData) {
  try {
    const data = new FormData();
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("email", formData.email);
    data.append("profileImage", formData.profileImage);

    const response = await axios.post(`${baseUrl}/auth/register`, data);
    console.log(response, response.data.message);
    return response;
  } catch (err) {
    throw err;
  }
}

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profileImage: null,
  });

  const [fieldError, setFieldError] = useState({ field: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);
  const allowedExtensions = ["jpg", "jpeg", "png", "webp"];

  const schema = Yup.object().shape({
    firstName: Yup.string()
      .required("First Name is required")
      .min(2, "Minimum 2 characters are required"),
    lastName: Yup.string()
      .required("Last Name is required")
      .min(2, "Minimum 2 characters are required"),
    email: Yup.string()
      .required("Email is required")
      .email("must be valid mail")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format"
      ),
    profileImage: Yup.mixed()
      .nullable()
      .test("fileFormat", "Only jpg, jpeg, png, webp are allowed", (value) => {
        if (!value) return true;
        const ext = value.name.split(".").pop().toLowerCase();
        return allowedExtensions.includes(ext);
      }),
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFieldError({ field: "", message: "" });

    if (name === "profileImage") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, profileImage: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldError({ field: "", message: "" });
    setIsLoading(true);

    try {
      await schema.validate(formData, { abortEarly: false });

      const response = await register(formData);

      if (response.status === 201) {
        toast.success(response.data.message);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          profileImage: null,
        });
        setIsLoading(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      if (err.name === "ValidationError" && err.inner) {
        const priority = ["firstName", "lastName", "email", "profileImage"];
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
    <div className="flex justify-center items-center md:m-4">
      <div className="bg-white md:shadow-gray-400 md:shadow-lg md:rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold font-sans tracking-wide text-center text-gray-800 mb-6">
          Register
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {fieldError.field === "firstName" && (
              <p className="text-red-500 text-sm mt-1">{fieldError.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {fieldError.field === "lastName" && (
              <p className="text-red-500 text-sm mt-1">{fieldError.message}</p>
            )}
          </div>

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
            <label className="block text-gray-700 mb-1">Profile Picture</label>
            <input
              type="file"
              name="profileImage"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg bg-white px-3 py-2 cursor-pointer file:mr-4 file:py-2 file:px-4 
               file:rounded-md file:border-0 file:text-sm file:font-semibold 
               file:bg-gray-500 file:text-white hover:file:bg-gray-600"
            />
            {fieldError.field === "profileImage" && (
              <p className="text-red-500 text-sm mt-1">{fieldError.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-violet-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-violet-600 transition flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                Registering <Loader className="animate-spin w-5 h-5" />
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
