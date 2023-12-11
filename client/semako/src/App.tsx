import React from "react";
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./pages/PaymentFormPage";
import LoginAccountPage from "./pages/LoginAccountPage";
import CreateAccountPage from "./pages/CreateAccountPage";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import ConfirmRegister from "./components/Member/ConfirmRegister";

const stripePromise = loadStripe(
  "pk_test_51OLSaqFONoYzLVKkdwxwVshtVuputWJjAcSGyGT5yD0I9nq6g2dUGzzhUuHoR2MoOjWiTMz5a2O23tXRhdyOK2Ti0064UCUwwI"
);

const App: React.FC = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/payment"
            element={
              <Elements stripe={stripePromise}>
                <PaymentForm />
              </Elements>
            }
          />
          <Route path="/" element={<LoginAccountPage />} />
          <Route path="/create-account" element={<CreateAccountPage />} />
          <Route path="/confirm" element={<ConfirmRegister />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
