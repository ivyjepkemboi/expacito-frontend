import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";


export const isTokenExpired = (token) => {
  if (!token) return true
  ;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 10000; // current time in seconds
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};
