/// <reference lib="webworker" />

import { defaultCache } from "@serwist/turbopack/worker";
import {
  CacheFirst,
  NetworkFirst,
  type PrecacheEntry,
  type RuntimeCaching,
  Serwist,
  type SerwistGlobalConfig,
  StaleWhileRevalidate,
} from "serwist";

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const customRuntimeCaching: RuntimeCaching[] = [
  {
    handler: new CacheFirst({
      cacheName: "google-fonts-stylesheets",
    }),
    matcher: /^https:\/\/fonts\.googleapis\.com\/.*/i,
  },
  {
    handler: new CacheFirst({
      cacheName: "google-fonts-webfonts",
    }),
    matcher: /^https:\/\/fonts\.gstatic\.com\/.*/i,
  },
  {
    handler: new CacheFirst({
      cacheName: "images",
    }),
    matcher: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
  },
  {
    handler: new StaleWhileRevalidate({
      cacheName: "static-resources",
    }),
    matcher: /\.(?:js|css)$/i,
  },
  {
    handler: new NetworkFirst({
      cacheName: "api-cache",
      networkTimeoutSeconds: 10,
    }),
    matcher: /\/api\/.*/i,
  },
  ...defaultCache,
];
const serwist = new Serwist({
  clientsClaim: true,
  navigationPreload: true,
  precacheEntries: self.__SW_MANIFEST,
  runtimeCaching: customRuntimeCaching,
  skipWaiting: true,
});

serwist.addEventListeners();

self.addEventListener("push", (event) => {
  const promiseChain = (async (): Promise<void> => {
    if (!event.data) {
      await self.registration.showNotification("Stride3", {
        badge: "/icon-192.svg",
        body: "新しい通知があります",
        icon: "/icon-192.svg",
      });
      return;
    }

    try {
      const data = event.data.json() as {
        badge?: string;
        body: string;
        icon?: string;
        title: string;
        url?: string;
      };
      const options = {
        badge: data.badge || "/icon-192.svg",
        body: data.body,
        data: { url: data.url || "/" },
        icon: data.icon || "/icon-192.svg",
        requireInteraction: true,
        vibrate: [100, 50, 100],
      } satisfies NotificationOptions & { vibrate?: number[] };

      await self.registration.showNotification(data.title, options);
    } catch {
      await self.registration.showNotification("Stride3", {
        badge: "/icon-192.svg",
        body: "通知があります",
        icon: "/icon-192.svg",
      });
    }
  })();

  event.waitUntil(promiseChain);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = (event.notification.data?.url as string) || "/";

  event.waitUntil(
    self.clients
      .matchAll({ includeUncontrolled: true, type: "window" })
      .then(
        (clientList): Promise<null | undefined | WindowClient> | undefined => {
          for (const client of clientList) {
            if ("focus" in client) {
              return client.focus();
            }
          }
          if (self.clients.openWindow) {
            return self.clients.openWindow(url);
          }
          return undefined;
        },
      ),
  );
});
