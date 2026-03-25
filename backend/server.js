require("dotenv").config();
const http = require("http");
const app = require("./app");
const sequelize=require('./src/config/db')
const { initSocket } = require('./src/config/socket')

const server = http.createServer(app);

// socket
initSocket(server);

// DB sync
sequelize.sync().then(() => {
  console.log("DB Synced");

  server.listen(5000, () => {
    console.log("Server running on 5000");
  });
});
