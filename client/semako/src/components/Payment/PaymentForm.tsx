import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const PaymentForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState<number>(0);
  const navigate = useNavigate();

  // 4242 4242 4242 4242

  const handlePayment = async () => {
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { token, error } = await stripe.createToken(cardElement!);

    if (error) {
      console.error(error);
      return;
    }

    try {
      const userToken = localStorage.getItem("token");

      if (!userToken) {
        return;
      }

      const response = await axios.post(
        "http://localhost:8999/member/make-payment",
        {
          amount,
          token: token.id,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const result = response.data;
        console.log(result.message);
        toast.success(result.message);
        navigate("/dashboard");
      } else {
        console.error("Payment failed");
        toast.error("Payment failed");
      }
    } catch (error) {
      console.error("Error processing payment on the server:", error);
      toast.error("Error processing payment on the server:");
    }
  };

  return (
    <>
      <h1 className="m-5 text-2xl font-bold text-teal-900">Semako</h1>

      <div className="max-w-md mx-auto my-8 p-4 border rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">Payment Form</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Amount
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={amount.toString()}
            onChange={(e) => {
              const inputValue = e.target.value;
              if (/^\d*$/.test(inputValue)) {
                setAmount(Number(inputValue));
              }
            }}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Card Details
          </label>
          <div className="border p-3 rounded-md">
            <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
          </div>
        </div>
        <button
          className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-700"
          onClick={handlePayment}
        >
          Pay
        </button>
        <ToastContainer />
      </div>
    </>
  );
};

export default PaymentForm;
