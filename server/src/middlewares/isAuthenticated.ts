import { Request, Response, NextFunction } from "express";

export default function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    console.error("User is not authenticated");
    res
      .status(401)
      .json({ message: "User must be authenticated to access this route" });
  }
}
