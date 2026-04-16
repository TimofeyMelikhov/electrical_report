type EnvKey = "VITE_API_BASE_URL" | "VITE_BASE_URL_OBJECT_ID";

const getRequiredEnv = (key: EnvKey): string => {
  const value = (import.meta.env[key] ?? "").toString().trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const env = Object.freeze({
  apiBaseUrl: getRequiredEnv("VITE_API_BASE_URL"),
  objectId: getRequiredEnv("VITE_BASE_URL_OBJECT_ID"),
});
