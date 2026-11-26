import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained build in `.next/standalone` for hosts that have no npm or
  // shell; `npm run deploy` packages it for upload
  output: "standalone",
};

export default nextConfig;
