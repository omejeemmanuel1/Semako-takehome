/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import DashboardNav from "./DashboardNav";
import DashboardSide from "./DashboardSide";
import { CiCreditCard1 } from "react-icons/ci";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const schemes = [
  "Fixed Deposit Scheme",
  "Monthly Savings Scheme",
  "High-Interest Investment Scheme",
  "Education Fund Scheme",
  "Retirement Savings Scheme",
  "Emergency Fund Scheme",
  "Wealth Building Scheme",
  "Real Estate Investment Scheme",
  "Gold Savings Scheme",
  "Stock Market Investment Scheme",
];

const Dashboard: React.FC = () => {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [selectedScheme, setSelectedScheme] = useState<string>("");

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
  }, [userDetails]);

  const handleEnrollScheme = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token || !selectedScheme) {
        return;
      }

      const response = await axios.post(
        "http://localhost:8999/scheme/enroll",
        { schemeName: selectedScheme },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserDetails(response.data.member);
      console.log(response.data.message);
      toast.success(response.data.message);
    } catch (error: any) {
      console.error("Error enrolling in the scheme:", error);
      toast.error(error.response.data.message || "An error occurred");
    }
  };

  return (
    <div className="flex">
      <div>
        <DashboardSide />
      </div>
      <div className="flex-1">
        <DashboardNav />

        <div>
          <div className="flex justify-between my-5 mx-10 text-center">
            {userDetails && (
              <div className=" bg-gradient-to-r from-yellow-400 to-teal-700 w-[30%] h-[200px] rounded-lg pt-16 font-bold shadow-md">
                <h4 className="text-2xl">Account Balance</h4>
                <p>${userDetails.balance.toFixed(2)}</p>
              </div>
            )}

            <div className="bg-gradient-to-b from-teal-500 to-yellow-500  w-[30%] h-[200px] py-4 rounded-lg shadow-md">
              <h4 className="text-2xl font-bold">Schemes</h4>
              <form className="mx-auto my-4 p-4 rounded-md ">
                <select
                  name="enroll"
                  id="enroll"
                  className="w-full px-3 py-2 border rounded-md"
                  value={selectedScheme}
                  onChange={(e) => setSelectedScheme(e.target.value)}
                >
                  <option value="">Enroll for scheme</option>
                  {schemes.map((scheme, index) => (
                    <option key={index} value={scheme}>
                      {scheme}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="bg-teal-400 text-white px-2 py-2 mt-4 rounded-md hover:bg-teal-900"
                  onClick={handleEnrollScheme}
                >
                  Enroll
                </button>
              </form>
            </div>
            <div className="bg-gradient-to-t from-teal-300 to-yellow-300  w-[30%] py-4 h-[200px] rounded-lg shadow-md">
              <Link
                to="/payment"
                className="flex justify-center items-center bg-gray-600 text-white p-2 mt-[130px] hover:bg-black"
              >
                <p>Make Payment</p>
                <span className="text-[20px]">
                  <CiCreditCard1 />
                </span>
              </Link>
            </div>
          </div>

          <div className="flex justify-between mx-10">
            <div className="bg-gray-100 w-[48%] h-[450px] rounded-lg p-5 shadow-md border">
              <h6 className="font-bold">Account History</h6>
              <hr />
              <ul className="mt-6">
                {userDetails &&
                  userDetails.accountHistory.map(
                    (entry: any, index: number) => (
                      <li key={index}>
                        <strong>
                          {new Date(entry.date).toLocaleDateString()}
                        </strong>
                        : {entry.description} - ${entry.amount}
                      </li>
                    )
                  )}
              </ul>
            </div>
            <div className="bg-gray-100 w-[48%] h-[450px] rounded-lg p-5 shadow-md border">
              <h6 className="font-bold">Active Schemes</h6>
              <hr />
              <ul className="mt-6">
                {userDetails &&
                  userDetails.schemes.map((scheme: any, index: number) => (
                    <li key={index}>
                      <strong>{scheme.name}</strong>:{" "}
                      <span className="italic">
                        Interest Rate - {scheme.interestRate}%
                      </span>{" "}
                      <br />
                      <span className="italic">
                        Maturity Date -{" "}
                        {new Date(scheme.maturityDate).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
