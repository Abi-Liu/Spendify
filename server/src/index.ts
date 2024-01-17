import express, { Response, NextFunction } from "express";
import cors from "cors";
import { Server as SocketIoServer } from "socket.io";
import http from "http";
import plaidRoutes from "./routes/plaid";
import session from "express-session";
import passport from "./config/passport";
import RedisStore from "connect-redis";
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
import CustomSocket from "./interfaces/CustomSocket";
import redis from "./config/redis";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "https://bbapi.online"],
    credentials: true,
  })
);
app.use(express.json());

// Use express-session and connect-redis for persistent session store
const redisStore = new RedisStore({
  client: redis,
  ttl: 60 * 60 * 24, // 1 day
});

const { SESSION_SECRET, PORT } = process.env;
app.use(
  session({
    store: redisStore,
    secret: SESSION_SECRET as string, // Set a secret key for session
    resave: false,
    saveUninitialized: false,
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
app.get("/version", (req, res) => {
  res.send("git commit: 33f68b5");
});

io.on("connection", (socket: CustomSocket) => {
  // on client  connection, server will receive an event containing the userId
  socket.on("user", (userId: string) => {
    console.log(`User ${userId} connected`);
    // associate the socket connection with a specific user
    socket.userId = userId;
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });
});

server.listen(PORT || 8000, () =>
  console.log(`Server has started on port: ${PORT}`)
);
