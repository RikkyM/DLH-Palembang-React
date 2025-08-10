const Ziggy = {
  url: "http:\/\/192.168.18.13:8000",
  port: 8000,
  defaults: {},
  routes: {
    login: { uri: "sirep\/login", methods: ["GET", "HEAD"] },
    "login.process": { uri: "sirep\/login", methods: ["POST"] },
    "storage.local": {
      uri: "storage\/{path}",
      methods: ["GET", "HEAD"],
      wheres: { path: ".*" },
      parameters: ["path"],
    },
  },
};
if (typeof window !== "undefined" && typeof window.Ziggy !== "undefined") {
  Object.assign(Ziggy.routes, window.Ziggy.routes);
}
export { Ziggy };
