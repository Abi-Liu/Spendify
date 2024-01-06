"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const plaid_1 = __importDefault(require("./routes/plaid"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("./config/passport"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const auth_1 = __importDefault(require("./routes/auth"));
const webhook_1 = __importDefault(require("./routes/webhook"));
const items_1 = __importDefault(require("./routes/items"));
const accounts_1 = __importDefault(require("./routes/accounts"));
const institutions_1 = __importDefault(require("./routes/institutions"));
const transactions_1 = __importDefault(require("./routes/transactions"));
const budgets_1 = __importDefault(require("./routes/budgets"));
const assets_1 = __importDefault(require("./routes/assets"));
const networth_1 = __importDefault(require("./routes/networth"));
const redis_1 = __importDefault(require("./config/redis"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: ["http://localhost:5173"], credentials: true }));
app.use(express_1.default.json());
// Use express-session and connect-redis for persistent session store
const redisStore = new connect_redis_1.default({
    client: redis_1.default,
});
const { SESSION_SECRET, PORT } = process.env;
app.use((0, express_session_1.default)({
    store: redisStore,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // cookie: {
    //   maxAge: 24 * 60 * 60 * 1000, // 1 day
    // },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// socket initialization
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});
// middleware to pass the socket to each request
app.use((req, res, next) => {
    req.io = io;
    next();
});
// moved routes here so that the routes middlewares are set before we initialize the routes
app.use("/plaid", plaid_1.default);
app.use("/auth", auth_1.default);
app.use("/webhook", webhook_1.default);
app.use("/items", items_1.default);
app.use("/accounts", accounts_1.default);
app.use("/institutions", institutions_1.default);
app.use("/transactions", transactions_1.default);
app.use("/budgets", budgets_1.default);
app.use("/assets", assets_1.default);
app.use("/networth", networth_1.default);
app.use("/test", (req, res) => {
    res.send("hello world");
});
io.on("connection", (socket) => {
    // on client  connection, server will receive an event containing the userId
    socket.on("user", (userId) => {
        console.log(`User ${userId} connected`);
        // associate the socket connection with a specific user
        socket.userId = userId;
    });
    socket.on("disconnect", () => {
        console.log("Socket disconnected");
    });
});
server.listen(PORT || 8000, () => console.log(`Server has started on port: ${PORT}`));
//# sourceMappingURL=index.js.map