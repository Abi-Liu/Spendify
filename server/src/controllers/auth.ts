import { Request, Response } from "express";
import { deleteUser } from "../database/users";

export default {
  getLoginSuccess: async (req: Request, res: Response) => {
    console.log("user : ", req.user, " cookies: ", req.cookies);
    if (req.user) {
      res.status(200).json({ user: req.user, cookies: req.cookies });
    } else {
      res.status(400).json({ message: "req.user is undefined" });
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

  deleteUser: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await deleteUser(Number(id));
      console.log("DELETED USER ", id);
      res.status(200).json({ message: "User succesfully deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to delete account" });
    }
  },
};
