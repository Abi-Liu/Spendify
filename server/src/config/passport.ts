/* eslint-disable @typescript-eslint/no-explicit-any */
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { getUser, createUser } from "../database/users";
import { User } from "../interfaces/databaseTypes";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  CLIENT_URL,
  ENV,
  VITE_SERVER_URL,
} = process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !CLIENT_URL) {
  throw new Error("Google Oauth env vars are not properly loading in");
}

const apiUrl = ENV === "dev" ? "http://localhost:8000" : VITE_SERVER_URL;

// Passport configuration
const callbackURL = `${apiUrl}/auth/google/callback`;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
      callbackURL,
    },
    async function (
      accessToken: string,
      refreshToken: string,
      profile: any,
      cb: any
    ) {
      try {
        let user = await getUser(profile.id);
        if (!user) {
          user = await createUser(
            profile.id,
            profile.emails[0].value,
            profile.name.givenName,
            profile.name.familyName,
            profile.photos[0].value
          );
        }
        cb(null, user);
      } catch (error) {
        cb(error);
        console.error(error);
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
