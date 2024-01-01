import express, { Response, NextFunction } from "express";
import cors from "cors";
import { Server as SocketIoServer } from "socket.io";
import http from "http";
import plaidRoutes from "./routes/plaid";
import session from "express-session";
import passport from "./config/passport";
// import transactionsRoutes from "./routes/transactions";
import authRoutes from "./routes/auth";
import webhookRoutes from "./routes/webhook";
import SocketRequest from "./interfaces/SocketRequest";
import itemsRoutes from "./routes/items";
import accountsRoutes from "./routes/accounts";
import institutionsRoutes from "./routes/institutions";
import transactionsRoutes from "./routes/transactions";
import budgetRoutes from "./routes/budgets";
import assetsRoutes from "./routes/assets";
import networthRoutes from "./routes/networth";

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

// socket initialization
const server = http.createServer(app);
const io = new SocketIoServer(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// middleware to pass the socket to each request
app.use((req: SocketRequest, res: Response, next: NextFunction) => {
  req.io = io;
  next();
});

// moved routes here so that the routes middlewares are set before we initialize the routes
app.use("/plaid", plaidRoutes);
app.use("/auth", authRoutes);
app.use("/webhook", webhookRoutes);
app.use("/items", itemsRoutes);
app.use("/accounts", accountsRoutes);
app.use("/institutions", institutionsRoutes);
app.use("/transactions", transactionsRoutes);
app.use("/budgets", budgetRoutes);
app.use("/assets", assetsRoutes);
app.use("/networth", networthRoutes);
app.use("/test", (req, res) => {
  res.send("hello world");
});

io.on("connection", (socket) => {
  console.log(`Socket connected`);

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });
});

server.listen(PORT || 8000, () =>
  console.log(`Server has started on port: ${PORT}`)
);
