 const http = require("http");
const appConfig = require("./app.js");
require("dotenv").config();
const { initSocketIO } = require('./socket');

const app = appConfig.app;
const httpServer = http.createServer(app);

 
initSocketIO(httpServer, app).then(() => {
  const PORT = process.env.PORT || 8000;
  httpServer.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Socket.IO init error:', err);
});