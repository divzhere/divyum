import { validateAllContent } from "../lib/content.ts";

try {
  await validateAllContent();
  console.log("Content check passed.");
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
