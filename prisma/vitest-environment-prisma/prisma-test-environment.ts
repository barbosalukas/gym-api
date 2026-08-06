import "dotenv/config";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { Environment } from "vitest/environments";
import { prisma } from "../../src/lib/prisma";

function generatedDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please provide DATABASE_URL environment variable.");
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set("schema", schema);

  return url.toString();
}

export default <Environment>{
  name: "prisma",
  viteEnvironment: "ssr",

  async setup() {
    const schema = randomUUID();
    const databaseUrl = generatedDatabaseUrl(schema);

    process.env.DATABASE_URL = databaseUrl;
    execSync("npx prisma migrate deploy");

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(`
          DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
        await prisma.$disconnect();
      },
    };
  },
};
