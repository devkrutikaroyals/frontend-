import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const ApproveManufacturer = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const email = searchParams.get("email");

    if (email) {
      axios
        .get(`https://grammerly-backend.onrender.com/api/auth/approve-manufacturer?email=${email}`)
        .then((response) => {
          setMessage(response.data.message);
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        })
        .catch((error) => {
          setError(error.response?.data?.message || "An error occurred.");
        });
    }
  }, [searchParams, navigate]);

  return (
    <div className="approval-page">
      <h2>Manufacturer Approval</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ApproveManufacturer;