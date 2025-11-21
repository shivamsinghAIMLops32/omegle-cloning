"use client";

/**
 * Collect browser fingerprint data on the client side
 * This should be called once when the user visits the site
 */
export function collectFingerprintData() {
  if (typeof window === "undefined") {
    return null;
  }

  return {
    userAgent: navigator.userAgent,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: new Date().getTimezoneOffset(),
    language: navigator.language,
    platform: navigator.platform,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
  };
}

/**
 * Generate a canvas fingerprint (more unique but can be blocked)
 */
export function generateCanvasFingerprint(): string {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    if (!ctx) return "no-canvas";

    const text = "StrangerChat,🎨";
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText(text, 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText(text, 4, 17);

    return canvas.toDataURL();
  } catch (e) {
    return "canvas-blocked";
  }
}
