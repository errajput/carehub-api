import { z } from "zod";

const RoleEnum = z.enum(["admin", "doctor", "patient"]);

export default function roleMiddleware(required) {
  // Validate required role(s)
  const roles = z.array(RoleEnum).or(RoleEnum).parse(required);

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "No user" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
}
