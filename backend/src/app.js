const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./configs/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");
const path = require("path");
// middleware
const app = express();
dotenv.config();
const _dirname = path.resolve();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Enable CORS for all routes
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

// All routes

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initializeSocket(server);

app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});
// database connection
connectDB()
  .then(() => {
    console.log("Database connect successfully");
    server.listen(process.env.PORT, () => {
      console.log(
        `Server is Successfully listening on port ${process.env.PORT} ...`
      );
    });
  })
  .catch(() => {
    console.log("Database cannot connected");
  });
