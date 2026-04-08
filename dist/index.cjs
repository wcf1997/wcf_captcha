'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');
var core = require('./core-vyKR-Kol.js');

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
    const resolvedScriptSrc = vue.computed(() => props.scriptSrc || pluginOptions.scriptSrc || core.DEFAULT_SCRIPT_SRC);
    const resolvedButtonText = vue.computed(() => props.buttonText || pluginOptions.buttonText || "点击弹出验证码");
    const resolvedSlideStyle = vue.computed(() => props.slideStyle || pluginOptions.slideStyle || core.DEFAULT_SLIDE_STYLE);
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
      const nextController = core.createAliyunCaptcha({
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
      style: resolvedManual.value ? core.HIDDEN_BUTTON_STYLE : {
        ...core.DEFAULT_BUTTON_STYLE,
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

exports.DEFAULT_BUTTON_STYLE = core.DEFAULT_BUTTON_STYLE;
exports.DEFAULT_SCRIPT_SRC = core.DEFAULT_SCRIPT_SRC;
exports.DEFAULT_SLIDE_STYLE = core.DEFAULT_SLIDE_STYLE;
exports.HIDDEN_BUTTON_STYLE = core.HIDDEN_BUTTON_STYLE;
exports.createAliyunCaptcha = core.createAliyunCaptcha;
exports.loadAliyunCaptchaScript = core.loadAliyunCaptchaScript;
exports.AliyunCaptcha = AliyunCaptcha;
exports.AliyunCaptchaComponent = AliyunCaptcha;
exports.aliyunCaptchaOptionsKey = aliyunCaptchaOptionsKey;
exports.createAliyunCaptchaPlugin = createAliyunCaptchaPlugin;
exports.default = AliyunCaptchaPlugin;
//# sourceMappingURL=index.cjs.map
