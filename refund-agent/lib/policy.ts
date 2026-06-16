import { readFileSync } from "node:fs";
import { join } from "node:path";

export const policyText = readFileSync(join(process.cwd(), "data", "refund-policy.md"), "utf8");
