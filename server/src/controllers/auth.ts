import { Request, Response } from "express";

export default {
  getLoginSuccess: async (req: Request, res: Response) => {
    if (req.user) {
      res.status(200).json({ user: req.user });
    }
  },

  getLoginFailed: async (req: Request, res: Response) => {
    res.status(401).json({ message: "User not authenticated" });
  },

  logout: async (req: Request, res: Response) => {
    const clientURL = process.env.CLIENT_URL || "http://localhost:5173/";
    (req.logout as () => void)();
    res.redirect(clientURL);
  },
};
