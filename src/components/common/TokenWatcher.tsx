// src/components/common/TokenWatcher.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { isTokenExpired } from "../../auth";

const TokenWatcher = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      navigate("/signin");
      return;
    }

    // Auto-logout when token expires
    const decoded = JSON.parse(atob(token.split(".")[1]));
    const timeout = decoded.exp * 1000 - Date.now();

    const timer = setTimeout(() => {
      localStorage.removeItem("token");
      navigate("/signin");
    }, timeout);

    return () => clearTimeout(timer);
  }, [navigate]);

  return null;
};

export default TokenWatcher;
