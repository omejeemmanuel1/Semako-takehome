import React from "react";
import { Link } from "react-router-dom";

const ConfirmRegister: React.FC = () => {
  return (
    <div>
      <div className="bg-teal-500 mx-[500px] mt-40 h-[200px] flex justify-center items-center rounded-md shadow-md py-4">
        <div className="text-black">
          <p className="mb-4">
            A 4 digit pin has been sent to your email <br />
            Please check your mail inbox or spam for your pin
          </p>{" "}
          <Link
            to="/"
            className="bg-yellow-600 p-2 rounded-md hover:bg-yellow-500"
          >
            Ok
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRegister;
