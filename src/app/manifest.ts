import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#ffffff",
    description: "Stride3 Application",
    display: "standalone",
    icons: [
      {
        sizes: "192x192",
        src: "/icon-192.svg",
        type: "image/svg+xml",
      },
      {
        sizes: "512x512",
        src: "/icon-512.svg",
        type: "image/svg+xml",
      },
    ],
    name: "Stride3",
    orientation: "portrait",
    short_name: "Stride3",
    start_url: "/",
    theme_color: "#000000",
  };
}
