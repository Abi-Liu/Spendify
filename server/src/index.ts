import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import plaidRoutes from "./routes/plaid";
import session from "express-session"; // Import express-session
import passport from "./config/passport";
// import transactionsRoutes from "./routes/transactions";
import authRoutes from "./routes/auth";
import webhookRoutes from "./routes/webhook";

const app = express();
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(express.json());

// Use express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret", // Set a secret key for session
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000, // 2 weeks
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// create a database connection
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let connection: any;
async function connect() {
  connection = await connectDB();
}
// creates connection to PlanetScale
connect();

app.use("/plaid", plaidRoutes);
app.use("/auth", authRoutes);
app.use("/webhook", webhookRoutes);
// app.use("/transactions", transactionsRoutes);

app.listen(process.env.PORT || 8000, () =>
  console.log(`Server has started on port: ${process.env.PORT}`)
);
