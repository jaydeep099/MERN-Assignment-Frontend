import { useState } from "react";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profileImage: null,
  });

  const allowedExtensions = ["jpg", "jpeg", "png", "webp"];

  const schema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    profileImage: Yup.mixed()
      .required("Profile picture is required")
      .test("fileFormat", "Only jpg, jpeg, png, webp are allowed", (value) => {
        if (!value) return false;
        const ext = value.name.split(".").pop().toLowerCase();
        return allowedExtensions.includes(ext);
      }),
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, profileImage: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      await schema.validate(formData, { abortEarly: false });
      toast.success("You have registered Successfully !");
      toast.success("Check your email for setting up password");
      console.log("Form Data:", formData);
    } catch (err) {
      if (err.inner) {
        err.inner.forEach((error) => {
          toast.error(error.message);
        });
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Toaster />
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
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
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
          </div>

          <button
            type="submit"
            className="w-full bg-violet-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-violet-600 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
