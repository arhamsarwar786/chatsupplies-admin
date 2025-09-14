export type DecodedToken = {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp?: number;
  username?: string; // Optional username field
}
