import express from "express";
import cors from "cors";
import plaidRoutes from "./routes/plaid";
import session from "express-session";
import passport from "./config/passport";
// import transactionsRoutes from "./routes/transactions";
import authRoutes from "./routes/auth";
import webhookRoutes from "./routes/webhook";

const app = express();
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(express.json());

// Use express-session
const { SESSION_SECRET, PORT } = process.env;
app.use(
  session({
    secret: SESSION_SECRET as string, // Set a secret key for session
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000, // 2 weeks
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/plaid", plaidRoutes);
app.use("/auth", authRoutes);
app.use("/webhook", webhookRoutes);
// app.use("/transactions", transactionsRoutes);

app.listen(PORT || 8000, () =>
  console.log(`Server has started on port: ${PORT}`)
);
