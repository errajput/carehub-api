export default function roleMiddleware(required) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "No user" });
    }

    const roles = Array.isArray(required) ? required : [required];

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Your are not Authorized for this action" });
    }

    next();
  };
}
