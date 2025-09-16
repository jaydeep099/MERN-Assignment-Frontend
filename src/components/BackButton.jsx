import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/articles")}
      className="p-2 m-2 w-10 h-10 flex items-center justify-center 
             border border-gray-400 rounded-3xl bg-gray-200 
             hover:bg-gray-300 transition-colors duration-300 ease-in-out cursor-pointer"
    >
      <ArrowLeft className="text-gray-700 transition-transform duration-300 hover:-translate-x-1" />
    </div>
  );
};

export default BackButton;
