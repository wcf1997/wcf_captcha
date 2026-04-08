import { defineComponent, inject, ref, computed, onMounted, onBeforeUnmount, h } from 'vue';
import { D as DEFAULT_SCRIPT_SRC, a as DEFAULT_SLIDE_STYLE, H as HIDDEN_BUTTON_STYLE, b as DEFAULT_BUTTON_STYLE, c as createAliyunCaptcha } from './core-Bk6UiLa4.js';
export { l as loadAliyunCaptchaScript } from './core-Bk6UiLa4.js';

const aliyunCaptchaOptionsKey = Symbol("aliyun-captcha-options");

const AliyunCaptcha = defineComponent({
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
    const pluginOptions = inject(aliyunCaptchaOptionsKey, {}) || {};
    const controller = ref(null);
    const elementRef = ref(null);
    const buttonRef = ref(null);
    const resolvedSceneId = computed(() => props.sceneId || pluginOptions.sceneId || "");
    const resolvedPrefix = computed(() => props.prefix || pluginOptions.prefix || "");
    const resolvedMode = computed(() => props.mode || pluginOptions.mode || "popup");
    const resolvedLanguage = computed(() => props.language || pluginOptions.language || "cn");
    const resolvedScriptSrc = computed(() => props.scriptSrc || pluginOptions.scriptSrc || DEFAULT_SCRIPT_SRC);
    const resolvedButtonText = computed(() => props.buttonText || pluginOptions.buttonText || "点击弹出验证码");
    const resolvedSlideStyle = computed(() => props.slideStyle || pluginOptions.slideStyle || DEFAULT_SLIDE_STYLE);
    const resolvedManual = computed(() => {
      var _a, _b;
      return (_b = (_a = props.manual) !== null && _a !== void 0 ? _a : pluginOptions.manual) !== null && _b !== void 0 ? _b : false;
    });
    const resolvedCleanupOnUnmount = computed(() => {
      var _a, _b;
      return (_b = (_a = props.cleanupOnUnmount) !== null && _a !== void 0 ? _a : pluginOptions.cleanupOnUnmount) !== null && _b !== void 0 ? _b : true;
    });
    const resolvedVerify = computed(() => props.verify || pluginOptions.verify);
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
    onMounted(() => {
      void init().catch(() => undefined);
    });
    onBeforeUnmount(() => {
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
    return () => h("div", {
      class: props.wrapperClass || pluginOptions.wrapperClass,
      style: props.wrapperStyle || pluginOptions.wrapperStyle
    }, [h("button", {
      ref: buttonRef,
      type: "button",
      class: props.buttonClass || pluginOptions.buttonClass,
      style: resolvedManual.value ? HIDDEN_BUTTON_STYLE : {
        ...DEFAULT_BUTTON_STYLE,
        ...(pluginOptions.buttonStyle || {}),
        ...(props.buttonStyle || {})
      }
    }, slots.default ? slots.default() : resolvedButtonText.value), h("div", {
      ref: elementRef
    })]);
  }
});

function createAliyunCaptchaPlugin() {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    install(app) {
      app.provide(aliyunCaptchaOptionsKey, options);
      app.component("AliyunCaptcha", AliyunCaptcha);
    }
  };
}
const AliyunCaptchaPlugin = createAliyunCaptchaPlugin();

export { AliyunCaptcha, AliyunCaptcha as AliyunCaptchaComponent, DEFAULT_BUTTON_STYLE, DEFAULT_SCRIPT_SRC, DEFAULT_SLIDE_STYLE, HIDDEN_BUTTON_STYLE, aliyunCaptchaOptionsKey, createAliyunCaptcha, createAliyunCaptchaPlugin, AliyunCaptchaPlugin as default };
//# sourceMappingURL=index.js.map
