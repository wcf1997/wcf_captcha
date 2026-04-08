import { DEFAULT_SCRIPT_SRC, loadAliyunCaptchaScript } from "./utils/loadScript";
import type {
  AliyunCaptchaController,
  AliyunCaptchaControllerOptions,
  AliyunCaptchaDomTarget,
  AliyunCaptchaInlineStyle,
  AliyunCaptchaSdkInstance,
  AliyunCaptchaSlideStyle,
  AliyunCaptchaSuccessPayload,
  AliyunCaptchaVerifiedPayload,
  AliyunCaptchaVerifyParam,
  AliyunCaptchaVerifyResult,
} from "./types";
export * from "./types";

export const DEFAULT_SLIDE_STYLE: AliyunCaptchaSlideStyle = {
  width: 360,
  height: 40,
};

export const DEFAULT_BUTTON_STYLE = {
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
  textAlign: "center",
} as const;

export const HIDDEN_BUTTON_STYLE = {
  position: "absolute",
  width: "1px",
  height: "1px",
  margin: "-1px",
  border: "0",
  padding: "0",
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
} as const;

function createUid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

function cleanupPopupDom() {
  document.getElementById("aliyunCaptcha-mask")?.remove();
  document.getElementById("aliyunCaptcha-window-popup")?.remove();
}

function resolveDomTarget(target?: AliyunCaptchaDomTarget): HTMLElement | null {
  if (!target) {
    return null;
  }

  if (typeof target === "string") {
    return document.querySelector<HTMLElement>(target);
  }

  return target;
}

function ensureElementId(element: HTMLElement, fallback: string): string {
  if (!element.id) {
    element.id = fallback;
  }

  return element.id;
}

function applyInlineStyle(
  element: HTMLElement,
  style?: AliyunCaptchaInlineStyle
) {
  if (style) {
    Object.assign(element.style, style);
  }
}

function createInternalElement(
  mountElement: HTMLElement,
  className?: string,
  style?: AliyunCaptchaInlineStyle
) {
  const element = document.createElement("div");

  if (className) {
    element.className = className;
  }

  applyInlineStyle(element, style);
  mountElement.appendChild(element);
  return element;
}

function createInternalButton(
  mountElement: HTMLElement,
  options: AliyunCaptchaControllerOptions
) {
  const button = document.createElement("button");

  button.type = "button";
  button.textContent = options.buttonText || "点击弹出验证码";

  if (options.buttonClass) {
    button.className = options.buttonClass;
  }

  Object.assign(
    button.style,
    options.manual
      ? HIDDEN_BUTTON_STYLE
      : {
          ...DEFAULT_BUTTON_STYLE,
          ...options.buttonStyle,
        }
  );

  mountElement.appendChild(button);
  return button;
}

export function createAliyunCaptcha(
  initialOptions: AliyunCaptchaControllerOptions = {}
): AliyunCaptchaController {
  const options: AliyunCaptchaControllerOptions = {
    ...initialOptions,
  };

  const uid = createUid("aliyun-captcha");
  let captchaInstance: AliyunCaptchaSdkInstance | null = null;
  let isInitialized = false;
  let createdElement: HTMLElement | null = null;
  let createdButton: HTMLButtonElement | null = null;

  function notifyError(error: unknown): Error {
    const normalizedError = toError(error);
    options.onError?.(normalizedError);
    return normalizedError;
  }

  function ensureTargets() {
    const mountElement = resolveDomTarget(options.mount);
    const element =
      resolveDomTarget(options.element) ||
      (mountElement
        ? (createdElement ||= createInternalElement(
            mountElement,
            options.wrapperClass,
            options.wrapperStyle
          ))
        : null);

    if (!element) {
      throw notifyError(
        new Error(
          "AliyunCaptcha requires an `element` or `mount` target in the browser."
        )
      );
    }

    const button =
      resolveDomTarget(options.button) ||
      (mountElement
        ? (createdButton ||= createInternalButton(mountElement, options))
        : null);

    if (!button) {
      throw notifyError(
        new Error(
          "AliyunCaptcha requires a `button` target, or a `mount` element so one can be created."
        )
      );
    }

    return { element, button };
  }

  async function init() {
    if (isInitialized) {
      return;
    }

    if (!options.sceneId || !options.prefix) {
      throw notifyError(
        new Error("AliyunCaptcha requires both sceneId and prefix.")
      );
    }

    if (!options.verify) {
      throw notifyError(
        new Error(
          "AliyunCaptcha requires a verify handler. Pass it when creating the controller."
        )
      );
    }

    const { element, button } = ensureTargets();

    await loadAliyunCaptchaScript(options.scriptSrc || DEFAULT_SCRIPT_SRC);

    if (typeof window.initAliyunCaptcha !== "function") {
      throw notifyError(
        new Error("initAliyunCaptcha is unavailable after the script loaded.")
      );
    }

    window.initAliyunCaptcha({
      SceneId: options.sceneId,
      prefix: options.prefix,
      mode: options.mode || "popup",
      element: `#${ensureElementId(element, `${uid}-element`)}`,
      button: `#${ensureElementId(button, `${uid}-button`)}`,
      captchaVerifyCallback: async (
        captchaVerifyParam: AliyunCaptchaVerifyParam
      ): Promise<AliyunCaptchaVerifyResult> => {
        try {
          const result = await options.verify!(captchaVerifyParam);
          const { captchaResult, bizResult, ...restResult } = result;
          const normalizedResult: AliyunCaptchaVerifyResult = {
            ...restResult,
            captchaResult: Boolean(captchaResult),
            bizResult: bizResult === undefined ? undefined : Boolean(bizResult),
          };
          const payload: AliyunCaptchaVerifiedPayload = {
            captchaVerifyParam,
            result: normalizedResult,
          };

          options.onVerified?.(payload);
          return normalizedResult;
        } catch (error) {
          const normalizedError = toError(error);
          options.onFail?.(normalizedError);
          options.onError?.(normalizedError);
          return {
            captchaResult: false,
            bizResult: false,
          };
        }
      },
      onBizResultCallback: (bizResult?: unknown) => {
        const payload: AliyunCaptchaSuccessPayload = {
          instance: captchaInstance,
          bizResult,
        };

        options.onSuccess?.(payload);
      },
      getInstance: (instance: AliyunCaptchaSdkInstance) => {
        captchaInstance = instance;
        options.onReady?.(instance);
      },
      slideStyle: options.slideStyle || DEFAULT_SLIDE_STYLE,
      language: options.language || "cn",
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
    const destroyableInstance = captchaInstance as
      | { destroy?: () => void }
      | null;

    destroyableInstance?.destroy?.();

    if (options.cleanupOnUnmount ?? true) {
      cleanupPopupDom();
    }

    createdButton?.remove();
    createdElement?.remove();
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
    getButton,
  };
}

export default createAliyunCaptcha;
