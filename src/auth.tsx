// import { jwtDecode } from "jwt-decode";
// import { useNavigate } from "react-router";


// export const isTokenExpired = (token) => {
//   if (!token) return true
//   ;

//   try {
//     const decoded = jwtDecode(token);
//     const currentTime = Date.now() / 1000; // current time in seconds
//     return decoded.exp < currentTime;
//   } catch (error) {
//     return true;
//   }
// };
// src/auth.tsx
import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  try {
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export const logout = (navigate: (path: string) => void) => {
  localStorage.removeItem("token");
  navigate("/sign-in");
};

