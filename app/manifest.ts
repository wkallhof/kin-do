import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kin Do",
    short_name: "Kin Do",
    description: "Family activities app",
    start_url: "/welcome",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png"
      },
      {
        src: "/icons/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icons/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png"
      }
    ]
  }
} 