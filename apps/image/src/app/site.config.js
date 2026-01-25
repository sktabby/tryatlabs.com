export const SITE = {
  name: "TryAtLabs",
  canonicalBase:
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "https://image.tryatlabs.com",
};
