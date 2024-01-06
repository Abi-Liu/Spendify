"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_1 = __importDefault(require("passport"));
const users_1 = require("../database/users");
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, CLIENT_URL } = process.env;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !CLIENT_URL) {
    throw new Error("Google Oauth env vars are not properly loading in");
}
// Passport configuration
// TODO: fix the callbackURL to be the server env variable not the client
const callbackURL = `http://localhost:8000/auth/google/callback`;
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL,
}, async function (accessToken, refreshToken, profile, cb) {
    try {
        let user = await (0, users_1.getUser)(profile.id);
        if (!user) {
            user = await (0, users_1.createUser)(profile.id, profile.emails[0].value, profile.name.givenName, profile.name.familyName, profile.photos[0].value);
        }
        cb(null, user);
    }
    catch (error) {
        console.log(error);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map