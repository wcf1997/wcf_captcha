(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue')) :
    typeof define === 'function' && define.amd ? define(['exports', 'vue'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.AliyunCaptchaVue = {}, global.Vue));
})(this, (function (exports, vue) { 'use strict';

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

    const aliyunCaptchaOptionsKey = Symbol("aliyun-captcha-options");

    const AliyunCaptcha = vue.defineComponent({
      name: "AliyunCaptcha",
      props: {
        sceneId: {
          type: String,
          default: ""
        },
        prefix: {
          type: String,
          default: ""
        },
        mode: {
          type: String,
          default: undefined
        },
        language: {
          type: String,
          default: undefined
        },
        scriptSrc: {
          type: String,
          default: undefined
        },
        buttonText: {
          type: String,
          default: undefined
        },
        buttonClass: {
          type: String,
          default: undefined
        },
        wrapperClass: {
          type: String,
          default: undefined
        },
        buttonStyle: {
          type: Object,
          default: undefined
        },
        wrapperStyle: {
          type: Object,
          default: undefined
        },
        slideStyle: {
          type: Object,
          default: undefined
        },
        manual: {
          type: Boolean,
          default: undefined
        },
        cleanupOnUnmount: {
          type: Boolean,
          default: undefined
        },
        verify: {
          type: Function,
          default: undefined
        }
      },
      emits: ["ready", "verified", "success", "fail", "error"],
      setup(props, _ref) {
        let {
          emit,
          expose,
          slots
        } = _ref;
        const pluginOptions = vue.inject(aliyunCaptchaOptionsKey, {}) || {};
        const controller = vue.ref(null);
        const elementRef = vue.ref(null);
        const buttonRef = vue.ref(null);
        const resolvedSceneId = vue.computed(() => props.sceneId || pluginOptions.sceneId || "");
        const resolvedPrefix = vue.computed(() => props.prefix || pluginOptions.prefix || "");
        const resolvedMode = vue.computed(() => props.mode || pluginOptions.mode || "popup");
        const resolvedLanguage = vue.computed(() => props.language || pluginOptions.language || "cn");
        const resolvedScriptSrc = vue.computed(() => props.scriptSrc || pluginOptions.scriptSrc || DEFAULT_SCRIPT_SRC);
        const resolvedButtonText = vue.computed(() => props.buttonText || pluginOptions.buttonText || "点击弹出验证码");
        const resolvedSlideStyle = vue.computed(() => props.slideStyle || pluginOptions.slideStyle || DEFAULT_SLIDE_STYLE);
        const resolvedManual = vue.computed(() => {
          var _a, _b;
          return (_b = (_a = props.manual) !== null && _a !== void 0 ? _a : pluginOptions.manual) !== null && _b !== void 0 ? _b : false;
        });
        const resolvedCleanupOnUnmount = vue.computed(() => {
          var _a, _b;
          return (_b = (_a = props.cleanupOnUnmount) !== null && _a !== void 0 ? _a : pluginOptions.cleanupOnUnmount) !== null && _b !== void 0 ? _b : true;
        });
        const resolvedVerify = vue.computed(() => props.verify || pluginOptions.verify);
        async function init() {
          if (controller.value) {
            return;
          }
          if (!elementRef.value || !buttonRef.value) {
            const error = new Error("AliyunCaptcha DOM refs are unavailable before mount.");
            emit("error", error);
            throw error;
          }
          const nextController = createAliyunCaptcha({
            sceneId: resolvedSceneId.value,
            prefix: resolvedPrefix.value,
            mode: resolvedMode.value,
            language: resolvedLanguage.value,
            scriptSrc: resolvedScriptSrc.value,
            slideStyle: resolvedSlideStyle.value,
            buttonText: resolvedButtonText.value,
            manual: resolvedManual.value,
            cleanupOnUnmount: resolvedCleanupOnUnmount.value,
            verify: resolvedVerify.value,
            element: elementRef.value,
            button: buttonRef.value,
            onReady: instance => {
              emit("ready", instance);
            },
            onVerified: payload => {
              emit("verified", payload);
            },
            onSuccess: payload => {
              emit("success", payload);
            },
            onFail: error => {
              emit("fail", error);
            },
            onError: error => {
              emit("error", error);
            }
          });
          try {
            await nextController.init();
            controller.value = nextController;
          } catch (error) {
            nextController.destroy();
            throw error;
          }
        }
        async function show() {
          var _a;
          await init();
          await ((_a = controller.value) === null || _a === void 0 ? void 0 : _a.show());
        }
        vue.onMounted(() => {
          void init().catch(() => undefined);
        });
        vue.onBeforeUnmount(() => {
          var _a;
          (_a = controller.value) === null || _a === void 0 ? void 0 : _a.destroy();
          controller.value = null;
        });
        expose({
          init,
          show,
          getInstance: () => {
            var _a;
            return ((_a = controller.value) === null || _a === void 0 ? void 0 : _a.getInstance()) || null;
          }
        });
        return () => vue.h("div", {
          class: props.wrapperClass || pluginOptions.wrapperClass,
          style: props.wrapperStyle || pluginOptions.wrapperStyle
        }, [vue.h("button", {
          ref: buttonRef,
          type: "button",
          class: props.buttonClass || pluginOptions.buttonClass,
          style: resolvedManual.value ? HIDDEN_BUTTON_STYLE : {
            ...DEFAULT_BUTTON_STYLE,
            ...(pluginOptions.buttonStyle || {}),
            ...(props.buttonStyle || {})
          }
        }, slots.default ? slots.default() : resolvedButtonText.value), vue.h("div", {
          ref: elementRef
        })]);
      }
    });

    function createAliyunCaptchaPlugin() {
      let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return {
        install(app) {
          let runtimeOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          app.provide(aliyunCaptchaOptionsKey, {
            ...options,
            ...runtimeOptions
          });
          app.component("AliyunCaptcha", AliyunCaptcha);
        }
      };
    }
    const AliyunCaptchaPlugin = createAliyunCaptchaPlugin();

    exports.AliyunCaptcha = AliyunCaptcha;
    exports.AliyunCaptchaComponent = AliyunCaptcha;
    exports.DEFAULT_BUTTON_STYLE = DEFAULT_BUTTON_STYLE;
    exports.DEFAULT_SCRIPT_SRC = DEFAULT_SCRIPT_SRC;
    exports.DEFAULT_SLIDE_STYLE = DEFAULT_SLIDE_STYLE;
    exports.HIDDEN_BUTTON_STYLE = HIDDEN_BUTTON_STYLE;
    exports.aliyunCaptchaOptionsKey = aliyunCaptchaOptionsKey;
    exports.createAliyunCaptcha = createAliyunCaptcha;
    exports.createAliyunCaptchaPlugin = createAliyunCaptchaPlugin;
    exports.default = AliyunCaptchaPlugin;
    exports.loadAliyunCaptchaScript = loadAliyunCaptchaScript;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.umd.js.map
