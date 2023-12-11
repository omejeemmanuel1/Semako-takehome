import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const DashboardSide: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <div className="flex flex-col pl-12 bg-teal-700 w-60 h-screen text-white">
      <h1 className="text-3xl font-bold mt-5">Semako</h1>
      <ul>
        <li className="mt-10 cursor-pointer hover:font-bold">
          <Link
            to="/dashboard"
            className={`${
              location.pathname === "/dashboard"
                ? "font-bold bg-yellow-600 rounded-md py-2 px-6"
                : "hover:font-bold"
            }`}
          >
            Dashboard
          </Link>
        </li>
        <li className="mt-5 cursor-pointer hover:font-bold">Account History</li>
      </ul>
      <p className="mt-auto mb-4 hover:font-bold ">
        {" "}
        <button onClick={handleLogout} className="mr-2 pointer">
          Logout
        </button>
      </p>
    </div>
  );
};

export default DashboardSide;
