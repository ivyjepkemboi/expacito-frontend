import { jwtDecode } from "jwt-decode";


export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // current time in seconds
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};
