import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import User from "../models/User.js";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

console.log("GOOGLE_CLIENT_ID =>", CLIENT_ID);   // <-- Must show value
console.log("GOOGLE_CLIENT_SECRET =>", CLIENT_SECRET);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          name: profile.displayName,
          email,
          password: "google_oauth", 
          googleId: profile.id,
          image: profile.photos[0].value,
        });
      }

      return done(null, user);
    }
  )
);

export default passport;
