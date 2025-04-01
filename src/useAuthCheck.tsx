import { useEffect } from "react";
import { useNavigate } from "react-router";
import { isTokenExpired } from "./auth";

export default function useAuthCheck() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (isTokenExpired(token)) {
      localStorage.removeItem("token");
      navigate("/signin");
    }
  }, [navigate]);
}
