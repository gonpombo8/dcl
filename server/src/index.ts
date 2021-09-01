import { main } from "./server";

main().catch((e) => {
  console.error("Exiting process because of unhandled exception", e);
  process.exit(1);
});
