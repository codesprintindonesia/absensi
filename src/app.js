import { httpServer, httpPort } from "./servers/http.server.js";
import chalk from "chalk";

try {
  httpServer.listen(httpPort, () => {
    console.log(
      chalk.blue(`HTTP server listening on port ${httpPort} - ${process.env.NODE_ENV}`)
    );
  });
} catch (e) {
  console.log(e.message);
}
