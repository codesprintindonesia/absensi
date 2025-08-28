// import { httpServer, httpPort } from "./servers/http.server.js";
// import chalk from "chalk";

// try {
//   httpServer.listen(httpPort, () => {
//     console.log(
//       chalk.blue(`HTTP server listening on port ${httpPort} - ${process.env.NODE_ENV}`)
//     );
//   });
// } catch (e) {
//   console.log(e.message);
// }


import { httpServer, httpPort } from "./servers/http.server.js";
import { validateEnv } from "./validations/env.validation.js";
import chalk from "chalk";

// Validate environment variables first
try {
  const validEnv = validateEnv();
  console.log(chalk.green("✓ Environment variables validated"));
  console.log(`DATABASE: ${validEnv.DATABASE}`);
  console.log(`PORT: ${validEnv.PORT}`);
} catch (error) {
  console.error(chalk.red("❌ Environment validation failed:"), error.message);
  process.exit(1);
}

httpServer.listen(httpPort, '0.0.0.0', () => {
  console.log(
    chalk.blue(`HTTP server listening on port ${httpPort} - ${process.env.NODE_ENV}`)
  );
  console.log(chalk.blue(`Server accessible at: http://localhost:${httpPort}`));
  console.log(chalk.blue(`Health check: http://localhost:${httpPort}/health`));
});