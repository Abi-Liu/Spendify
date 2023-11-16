/* eslint-disable @typescript-eslint/no-explicit-any */
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { getUser, createUser } from "../database/users";
import { User } from "../interfaces/databaseTypes";

// Passport configuration

const callbackURL = `${
  process.env.CALLBACK_URL || "http://localhost:8000"
}/auth/google/callback`;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
