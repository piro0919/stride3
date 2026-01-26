import { createSerwistRoute } from "@serwist/turbopack";
import { spawnSync } from "node:child_process";

const revision =
  spawnSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf-8",
  }).stdout?.trim() ?? crypto.randomUUID();

export const { dynamic, dynamicParams, generateStaticParams, GET, revalidate } =
  createSerwistRoute({
    additionalPrecacheEntries: [{ revision, url: "/~offline" }],
    nextConfig: {},
    swSrc: "src/app/sw.ts",
  });
