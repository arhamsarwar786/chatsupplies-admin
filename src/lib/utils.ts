import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from "./types"; 




export const decodeToken = (token: string): DecodedToken | null => {
  try {
    // Decode the token
    
    const decoded = jwtDecode<DecodedToken>(token);

    // Check token expiration
    // if (isTokenExpired(decoded)) {
    //   return null;
    // }

    return decoded;
  } catch (error) {
    return error instanceof Error ? null : null;
  }
};
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
