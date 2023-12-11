/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateAccountForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleCreateAccount = async (name: string, email: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8999/member/create-account",
        {
          name,
          email,
        }
      );

      toast.success("Account created successfully");
      localStorage.setItem("token", response.data.token);

      navigate("/confirm");
    } catch (error: any) {
      toast.error(error.response.data.error || "An error occurred");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email) {
      toast.error("Please fill in all fields");
      return;
    }

    handleCreateAccount(name, email);
  };

  return (
    <>
      <h1 className="m-5 text-2xl font-bold text-teal-900">Semako</h1>

      <div className="flex items-center justify-center">
        <form
          className="w-[25%] mx-auto my-8 p-4 border rounded-md shadow-md"
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl font-semibold mb-4">Create Account</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Please enter your full name.."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Please enter your email address.."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-teal-500 text-white px-2 py-2 rounded-md hover:bg-teal-700"
          >
            Create Account
          </button>
          <div className="m-2 text-sm text-center">
            <p>
              Already have an account?{" "}
              <span className="text-teal-900">
                <Link to="/">Login</Link>
              </span>
            </p>
          </div>
        </form>
        <ToastContainer />
      </div>
    </>
  );
};

export default CreateAccountForm;
