require("dotenv").config(); // must be first
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const roomRoutes = require("./routes/roomRoutes");
const videoRoutes = require("./routes/videoRoutes");

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use(session({ 
  secret: "nfeiwofnieownfiow",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 86400, 
    httpOnly: true,
    secure: false 
  },
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URL })
}))


app.use("/host", roomRoutes);
app.use("/api/videos", videoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
