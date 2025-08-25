import { httpServer, httpPort } from "./servers/http.server.js";
import chalk from "chalk";

httpServer.listen(httpPort, () => {
  console.log(
    chalk.blue(`HTTP server listening on port ${httpPort} - ${process.env.NODE_ENV}`)
  );
});
