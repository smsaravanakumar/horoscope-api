const express = require("express");
const cors = require("cors");
require("dotenv").config();

const horoscopeRoutes = require("./routes/horoscope");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Horoscope API is running",
  });
});

app.use("/api/horoscope", horoscopeRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Horoscope API running on port ${PORT}`);
});