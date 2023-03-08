export function getEnv() {
  return {
    NODE_ENV: process.env.NODE_ENV,
    MOCK: process.env.MOCK || "false",
  };
}

type ENV = ReturnType<typeof getEnv>;

declare global {
  var ENV: ENV;
  interface Window {
    ENV: ENV;
  }
}
