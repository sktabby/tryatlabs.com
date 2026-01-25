export const SITE = {
  name: "TryAtLabs Tools",
  canonicalBase:
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "https://tools.tryatlabs.com",
};
