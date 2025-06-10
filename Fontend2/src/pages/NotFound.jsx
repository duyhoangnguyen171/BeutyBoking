import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="">
      <h2 className=""> Page Not Found</h2>
      <button
        className="bg-amber-600 py-2 px-2 rounded-3xl"
        onClick={() => navigate("/")}
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
