const DEFAULT_SCRIPT_ID = "aliyun-captcha-sdk";

declare global {
  interface Window {
    initAliyunCaptcha?: (options: Record<string, unknown>) => void;
    __aliyunCaptchaScriptPromise__?: Promise<void>;
  }
}

export const DEFAULT_SCRIPT_SRC =
  "https://o.alicdn.com/captcha-frontend/aliyunCaptcha/AliyunCaptcha.js";

export function loadAliyunCaptchaScript(
  scriptSrc: string = DEFAULT_SCRIPT_SRC
): Promise<void> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.reject(
      new Error("Aliyun captcha can only be initialized in a browser environment.")
    );
  }

  if (typeof window.initAliyunCaptcha === "function") {
    return Promise.resolve();
  }

  if (window.__aliyunCaptchaScriptPromise__) {
    return window.__aliyunCaptchaScriptPromise__;
  }

  window.__aliyunCaptchaScriptPromise__ = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(
      DEFAULT_SCRIPT_ID
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad, { once: true });
      existingScript.addEventListener("error", handleError, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = DEFAULT_SCRIPT_ID;
    script.src = scriptSrc;
    script.async = true;
    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });
    document.head.appendChild(script);

    function handleLoad() {
      if (typeof window.initAliyunCaptcha === "function") {
        resolve();
        return;
      }

      window.__aliyunCaptchaScriptPromise__ = undefined;
      reject(new Error("Aliyun captcha script loaded, but initAliyunCaptcha is unavailable."));
    }

    function handleError() {
      window.__aliyunCaptchaScriptPromise__ = undefined;
      reject(new Error(`Failed to load Aliyun captcha script: ${scriptSrc}`));
    }
  });

  return window.__aliyunCaptchaScriptPromise__;
}
