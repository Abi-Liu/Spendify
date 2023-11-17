/* eslint-disable @typescript-eslint/no-explicit-any */
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { getUser, createUser } from "../database/users";
import { User } from "../interfaces/databaseTypes";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, CALLBACK_URL } = process.env;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !CALLBACK_URL) {
  throw new Error("Google Oauth env vars are not properly loading in");
}

// Passport configuration
const callbackURL = `${
  CALLBACK_URL || "http://localhost:8000"
}/auth/google/callback`;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
      callbackURL,
    },
    async function (
      accessToken: any,
      refreshToken: any,
      profile: any,
      cb: any
    ) {
      try {
        let user = await getUser(profile.id);
        if (!user) {
          user = await createUser(
            profile.id,
            profile.name.givenName,
            profile.name.familyName,
            profile.photos[0].value
          );
        }
        cb(null, user);
      } catch (error) {
        console.log(error);
      }
    }
  )
);

passport.serializeUser((user: User, done) => {
  done(null, user);
});
passport.deserializeUser((user: User, done) => {
  done(null, user);
});

export default passport;
