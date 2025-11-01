import jwt from "jsonwebtoken"

export default function verifyJWTToken(req, res, next) {
  console.log("Cookies received:", req.cookies);

  let token = req.cookies?.token;

  if (!token && req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "No token found" });
  }
  const secret = process.env.JWT_SECRET || "Google";
  jwt.verify(token, secret, (error, decoded) => {
    if (error) {
      return res.status(403).json({ success: false, message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
}