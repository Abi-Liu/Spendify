"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        console.error("User is not authenticated");
        res
            .status(401)
            .json({ message: "User must be authenticated to access this route" });
    }
}
exports.default = isAuthenticated;
//# sourceMappingURL=isAuthenticated.js.map