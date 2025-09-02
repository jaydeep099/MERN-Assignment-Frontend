import { Link } from "react-router";
import HButton from "./HButton";

const Navbar = () => {
  return (
    <nav className="sticky top-0 w-full bg-emerald-500 shadow-lg z-50">
      <div className="max-w-full mx-auto flex justify-between items-center h-14 px-4">
        <h1 className="text-white text-2xl font-bold">
          <Link to="/" className="font-serif font-extralight tracking-wider">
            Article
          </Link>
        </h1>
        <div className="flex gap-2">
          <HButton name="Login" urls="login" color="blue" />
          <HButton name="Register" urls="register" color="violet" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
