/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginAccountForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  const handleLoginAccount = async (email: string, pin: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8999/member/login-account",
        {
          email,
          pin,
        }
      );

      toast.success(response.data.message);
      localStorage.setItem("token", response.data.token);

      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response.data.error || "An error occurred");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !pin) {
      alert("Please fill in all fields");
      return;
    }

    handleLoginAccount(email, pin);
  };

  return (
    <>
      <h1 className="m-5 text-2xl font-bold text-teal-900">Semako</h1>

      <div className="flex items-center justify-center">
        <form
          className="w-[25%] mx-auto my-8 p-4 border rounded-md shadow-md"
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl font-semibold mb-4">Login Account</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter email to login"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              PIN
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter 4 digit pin"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={4}
            />
          </div>
          <button
            type="submit"
            className="bg-teal-500 text-white px-2 py-2 rounded-md hover:bg-teal-700"
          >
            Login
          </button>
          <div className="m-2 text-sm text-center">
            <p>
              Don't have an account yet?{" "}
              <span className="text-teal-900">
                <Link to="/create-account">Create account</Link>
              </span>
            </p>
          </div>
          <ToastContainer />
        </form>
      </div>
    </>
  );
};

export default LoginAccountForm;
