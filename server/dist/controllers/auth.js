"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("../database/users");
exports.default = {
    getLoginSuccess: async (req, res) => {
        if (req.user) {
            res.status(200).json({ user: req.user });
        }
    },
    getLoginFailed: async (req, res) => {
        res.status(401).json({ message: "User not authenticated" });
    },
    logout: async (req, res) => {
        req.logout((err) => {
            if (err) {
                // Handle any errors that occur during logout
                return res.status(500).json({ error: "Logout failed" });
            }
            // Redirect to the client URL upon successful logout
            const CLIENT_URL = process.env.CLIENT_URL;
            return res.redirect(CLIENT_URL);
        });
    },
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            await (0, users_1.deleteUser)(Number(id));
            console.log("DELETED USER ", id);
            res.status(200).json({ message: "User succesfully deleted" });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to delete account" });
        }
    },
};
//# sourceMappingURL=auth.js.map