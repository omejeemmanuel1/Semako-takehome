/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardNav: React.FC = () => {
  const [userDetails, setUserDetails] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          return;
        }

        const response = await axios.get(
          "http://localhost:8999/member/details",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserDetails(response.data.member);
        console.log(response.data.member);
      } catch (error) {
        console.error("Error fetching member details:", error);
      }
    };

    fetchMemberDetails();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <div className="bg-teal-100">
      <div className="flex mx-10 py-5 justify-between">
        {userDetails && <p>{userDetails.name}</p>}
        <p>
          {" "}
          <button
            onClick={handleLogout}
            className="mr-2 cursor-pointer hover:font-bold"
          >
            Logout
          </button>
        </p>
      </div>
    </div>
  );
};

export default DashboardNav;
