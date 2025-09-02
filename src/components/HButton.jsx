import { Link } from "react-router";

const HButton = ({ name, urls, color }) => {
  const colorClass = {
    blue: "bg-blue-500 hover:bg-blue-600",
    violet: "bg-violet-700 hover:bg-violet-800",
  };

  return (
    <Link
      to={`/${urls}`}
      className={`text-white px-4 py-2 rounded-full transition-all duration-200 shadow-md ${
        colorClass[color] || "bg-gray-500 hover:bg-gray-600"
      }`}
    >
      {name}
    </Link>
  );
};

export default HButton;
