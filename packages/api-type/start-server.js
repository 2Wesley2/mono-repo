import "tsconfig-paths/register.js";
import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("ts-node/esm", pathToFileURL("./"));

import("./src/main.ts").catch((error) => {
  process.exit(1);
});
