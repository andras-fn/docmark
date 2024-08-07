import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "dotenv/config";

// schema import
import * as documentGroup from "./schemas/documentGroup";
import * as document from "./schemas/document";
import * as markingScheme from "./schemas/markingScheme";
import * as testCriteria from "./schemas/testCriteria";
import * as markingRunResults from "./schemas/markingRunResults";

const POSTGRES_URI = process.env.POSTGRES_URI;

if (!POSTGRES_URI) {
  throw new Error("POSTGRES_URI environment variable is not defined.");
}

export const migrationClient = postgres(POSTGRES_URI, { max: 1 });

export const db = drizzle(postgres(POSTGRES_URI), {
  schema: {
    ...documentGroup,
    ...document,
    ...markingScheme,
    ...testCriteria,
    ...markingRunResults,
  },
});
