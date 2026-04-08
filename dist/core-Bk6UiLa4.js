const DEFAULT_SCRIPT_ID = "aliyun-captcha-sdk";
const DEFAULT_SCRIPT_SRC = "https://o.alicdn.com/captcha-frontend/aliyunCaptcha/AliyunCaptcha.js";
function loadAliyunCaptchaScript() {
  let scriptSrc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_SCRIPT_SRC;
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.reject(new Error("Aliyun captcha can only be initialized in a browser environment."));
  }
  if (typeof window.initAliyunCaptcha === "function") {
    return Promise.resolve();
  }
  if (window.__aliyunCaptchaScriptPromise__) {
    return window.__aliyunCaptchaScriptPromise__;
  }
  window.__aliyunCaptchaScriptPromise__ = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(DEFAULT_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener("load", handleLoad, {
        once: true
      });
      existingScript.addEventListener("error", handleError, {
        once: true
      });
      return;
    }
    const script = document.createElement("script");
    script.id = DEFAULT_SCRIPT_ID;
    script.src = scriptSrc;
    script.async = true;
    script.addEventListener("load", handleLoad, {
      once: true
    });
    script.addEventListener("error", handleError, {
      once: true
    });
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

const DEFAULT_SLIDE_STYLE = {
  width: 360,
  height: 40
};
const DEFAULT_BUTTON_STYLE = {
  zIndex: "99",
  width: "150px",
  boxSizing: "border-box",
  borderRadius: "4px",
  border: "1px solid transparent",
  cursor: "pointer",
  backgroundColor: "hsla(160, 100%, 37%, 1)",
  color: "#fff",
  padding: "8px 0",
  fontSize: "14px",
  lineHeight: "22px",
  textAlign: "center"
};
const HIDDEN_BUTTON_STYLE = {
  position: "absolute",
  width: "1px",
  height: "1px",
  margin: "-1px",
  border: "0",
  padding: "0",
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap"
};
function createUid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}
function toError(error) {
  return error instanceof Error ? error : new Error(String(error));
}
function cleanupPopupDom() {
  var _a, _b;
  (_a = document.getElementById("aliyunCaptcha-mask")) === null || _a === void 0 ? void 0 : _a.remove();
  (_b = document.getElementById("aliyunCaptcha-window-popup")) === null || _b === void 0 ? void 0 : _b.remove();
}
function resolveDomTarget(target) {
  if (!target) {
    return null;
  }
  if (typeof target === "string") {
    return document.querySelector(target);
  }
  return target;
}
function ensureElementId(element, fallback) {
  if (!element.id) {
    element.id = fallback;
  }
  return element.id;
}
function applyInlineStyle(element, style) {
  if (style) {
    Object.assign(element.style, style);
  }
}
function createInternalElement(mountElement, className, style) {
  const element = document.createElement("div");
  if (className) {
    element.className = className;
  }
  applyInlineStyle(element, style);
  mountElement.appendChild(element);
  return element;
}
function createInternalButton(mountElement, options) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = options.buttonText || "点击弹出验证码";
  if (options.buttonClass) {
    button.className = options.buttonClass;
  }
  Object.assign(button.style, options.manual ? HIDDEN_BUTTON_STYLE : {
    ...DEFAULT_BUTTON_STYLE,
    ...options.buttonStyle
  });
  mountElement.appendChild(button);
  return button;
}
function createAliyunCaptcha() {
  let initialOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const options = {
    ...initialOptions
  };
  const uid = createUid("aliyun-captcha");
  let captchaInstance = null;
  let isInitialized = false;
  let createdElement = null;
  let createdButton = null;
  function notifyError(error) {
    var _a;
    const normalizedError = toError(error);
    (_a = options.onError) === null || _a === void 0 ? void 0 : _a.call(options, normalizedError);
    return normalizedError;
  }
  function ensureTargets() {
    const mountElement = resolveDomTarget(options.mount);
    const element = resolveDomTarget(options.element) || (mountElement ? createdElement || (createdElement = createInternalElement(mountElement, options.wrapperClass, options.wrapperStyle)) : null);
    if (!element) {
      throw notifyError(new Error("AliyunCaptcha requires an `element` or `mount` target in the browser."));
    }
    const button = resolveDomTarget(options.button) || (mountElement ? createdButton || (createdButton = createInternalButton(mountElement, options)) : null);
    if (!button) {
      throw notifyError(new Error("AliyunCaptcha requires a `button` target, or a `mount` element so one can be created."));
    }
    return {
      element,
      button
    };
  }
  async function init() {
    if (isInitialized) {
      return;
    }
    if (!options.sceneId || !options.prefix) {
      throw notifyError(new Error("AliyunCaptcha requires both sceneId and prefix."));
    }
    if (!options.verify) {
      throw notifyError(new Error("AliyunCaptcha requires a verify handler. Pass it when creating the controller."));
    }
    const {
      element,
      button
    } = ensureTargets();
    await loadAliyunCaptchaScript(options.scriptSrc || DEFAULT_SCRIPT_SRC);
    if (typeof window.initAliyunCaptcha !== "function") {
      throw notifyError(new Error("initAliyunCaptcha is unavailable after the script loaded."));
    }
    window.initAliyunCaptcha({
      SceneId: options.sceneId,
      prefix: options.prefix,
      mode: options.mode || "popup",
      element: `#${ensureElementId(element, `${uid}-element`)}`,
      button: `#${ensureElementId(button, `${uid}-button`)}`,
      captchaVerifyCallback: async captchaVerifyParam => {
        var _a, _b, _c;
        try {
          const result = await options.verify(captchaVerifyParam);
          const {
            captchaResult,
            bizResult,
            ...restResult
          } = result;
          const normalizedResult = {
            ...restResult,
            captchaResult: Boolean(captchaResult),
            bizResult: bizResult === undefined ? undefined : Boolean(bizResult)
          };
          const payload = {
            captchaVerifyParam,
            result: normalizedResult
          };
          (_a = options.onVerified) === null || _a === void 0 ? void 0 : _a.call(options, payload);
          return normalizedResult;
        } catch (error) {
          const normalizedError = toError(error);
          (_b = options.onFail) === null || _b === void 0 ? void 0 : _b.call(options, normalizedError);
          (_c = options.onError) === null || _c === void 0 ? void 0 : _c.call(options, normalizedError);
          return {
            captchaResult: false,
            bizResult: false
          };
        }
      },
      onBizResultCallback: bizResult => {
        var _a;
        const payload = {
          instance: captchaInstance,
          bizResult
        };
        (_a = options.onSuccess) === null || _a === void 0 ? void 0 : _a.call(options, payload);
      },
      getInstance: instance => {
        var _a;
        captchaInstance = instance;
        (_a = options.onReady) === null || _a === void 0 ? void 0 : _a.call(options, instance);
      },
      slideStyle: options.slideStyle || DEFAULT_SLIDE_STYLE,
      language: options.language || "cn"
    });
    isInitialized = true;
  }
  async function show() {
    if (!isInitialized) {
      await init();
    }
    ensureTargets().button.click();
  }
  function destroy() {
    var _a, _b;
    const destroyableInstance = captchaInstance;
    (_a = destroyableInstance === null || destroyableInstance === void 0 ? void 0 : destroyableInstance.destroy) === null || _a === void 0 ? void 0 : _a.call(destroyableInstance);
    if ((_b = options.cleanupOnUnmount) !== null && _b !== void 0 ? _b : true) {
      cleanupPopupDom();
    }
    createdButton === null || createdButton === void 0 ? void 0 : createdButton.remove();
    createdElement === null || createdElement === void 0 ? void 0 : createdElement.remove();
    createdButton = null;
    createdElement = null;
    captchaInstance = null;
    isInitialized = false;
  }
  function getInstance() {
    return captchaInstance;
  }
  function getElement() {
    return ensureTargets().element;
  }
  function getButton() {
    return ensureTargets().button;
  }
  return {
    init,
    show,
    destroy,
    getInstance,
    getElement,
    getButton
  };
}

export { DEFAULT_SCRIPT_SRC as D, HIDDEN_BUTTON_STYLE as H, DEFAULT_SLIDE_STYLE as a, DEFAULT_BUTTON_STYLE as b, createAliyunCaptcha as c, loadAliyunCaptchaScript as l };
//# sourceMappingURL=core-Bk6UiLa4.js.map
