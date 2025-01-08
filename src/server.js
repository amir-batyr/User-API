import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();
const port = process.env.SERVER_PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
