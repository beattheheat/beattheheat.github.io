self.addEventListener("install", (event) => {

  console.log("Service Worker installed");

  self.skipWaiting();

});

self.addEventListener("activate", (event) => {

  console.log("Service Worker activated");

  event.waitUntil(
    clients.claim()
  );

});

self.addEventListener("fetch", (event) => {

});

self.addEventListener("push", (event) => {

  let data = {};

  if (event.data) {
    data = event.data.json();
  }

  const title =
    data.title || "Heat Alert";

  const options = {

    body:
      data.body ||
      "High heat index detected. Remember to stay hydrated and avoid unnecessary strenuous outdoor activity.",

    icon:
      "icon-192.png",

    badge:
      "icon-192.png",

    vibrate: [200, 100, 200],

    data: {
      url: data.url || "/"
    }
  };

  event.waitUntil(

    self.registration.showNotification(
      title,
      options
    )

  );

});

self.addEventListener("notificationclick", (event) => {

  event.notification.close();

  const targetUrl =
    event.notification.data.url || "/";

  event.waitUntil(

    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    })
    .then((clientList) => {

      for (const client of clientList) {

        if (client.url.includes(targetUrl) &&
            "focus" in client) {

          return client.focus();

        }
      }

      if (clients.openWindow) {

        return clients.openWindow(targetUrl);

      }

    })

  );

});

self.addEventListener("message", (event) => {

  console.log("Message received in service worker");

});
