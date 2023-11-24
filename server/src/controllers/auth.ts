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
    req.logout((err) => {
      if (err) {
        // Handle any errors that occur during logout
        return res.status(500).json({ error: "Logout failed" });
      }

      // Redirect to the client URL upon successful logout
      const CLIENT_URL = process.env.CLIENT_URL;
      return res.redirect(CLIENT_URL as string);
    });
  },
};
