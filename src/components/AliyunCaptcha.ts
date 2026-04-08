import {
  computed,
  defineComponent,
  h,
  inject,
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue";
import {
  createAliyunCaptcha,
  DEFAULT_BUTTON_STYLE,
  DEFAULT_SLIDE_STYLE,
  HIDDEN_BUTTON_STYLE,
} from "../core";
import { DEFAULT_SCRIPT_SRC } from "../utils/loadScript";
import type {
  AliyunCaptchaController,
  AliyunCaptchaExpose,
  AliyunCaptchaPluginOptions,
  AliyunCaptchaSlideStyle,
  AliyunCaptchaVerifyHandler,
} from "../types";
import { aliyunCaptchaOptionsKey } from "../symbols";

export const AliyunCaptcha = defineComponent({
  name: "AliyunCaptcha",
  props: {
    sceneId: {
      type: String,
      default: "",
    },
    prefix: {
      type: String,
      default: "",
    },
    mode: {
      type: String,
      default: undefined,
    },
    language: {
      type: String,
      default: undefined,
    },
    scriptSrc: {
      type: String,
      default: undefined,
    },
    buttonText: {
      type: String,
      default: undefined,
    },
    buttonClass: {
      type: String,
      default: undefined,
    },
    wrapperClass: {
      type: String,
      default: undefined,
    },
    buttonStyle: {
      type: Object,
      default: undefined,
    },
    wrapperStyle: {
      type: Object,
      default: undefined,
    },
    slideStyle: {
      type: Object,
      default: undefined,
    },
    manual: {
      type: Boolean,
      default: undefined,
    },
    cleanupOnUnmount: {
      type: Boolean,
      default: undefined,
    },
    verify: {
      type: Function,
      default: undefined,
    },
  },
  emits: ["ready", "verified", "success", "fail", "error"],
  setup(props, { emit, expose, slots }) {
    const pluginOptions =
      inject<AliyunCaptchaPluginOptions>(aliyunCaptchaOptionsKey, {}) || {};
    const controller = ref<AliyunCaptchaController | null>(null);
    const elementRef = ref<HTMLElement | null>(null);
    const buttonRef = ref<HTMLElement | null>(null);

    const resolvedSceneId = computed(() => props.sceneId || pluginOptions.sceneId || "");
    const resolvedPrefix = computed(() => props.prefix || pluginOptions.prefix || "");
    const resolvedMode = computed(() => props.mode || pluginOptions.mode || "popup");
    const resolvedLanguage = computed(
      () => props.language || pluginOptions.language || "cn"
    );
    const resolvedScriptSrc = computed(
      () => props.scriptSrc || pluginOptions.scriptSrc || DEFAULT_SCRIPT_SRC
    );
    const resolvedButtonText = computed(
      () => props.buttonText || pluginOptions.buttonText || "点击弹出验证码"
    );
    const resolvedSlideStyle = computed<AliyunCaptchaSlideStyle>(
      () =>
        (props.slideStyle as AliyunCaptchaSlideStyle | undefined) ||
        pluginOptions.slideStyle ||
        DEFAULT_SLIDE_STYLE
    );
    const resolvedManual = computed(
      () => props.manual ?? pluginOptions.manual ?? false
    );
    const resolvedCleanupOnUnmount = computed(
      () => props.cleanupOnUnmount ?? pluginOptions.cleanupOnUnmount ?? true
    );
    const resolvedVerify = computed<AliyunCaptchaVerifyHandler | undefined>(
      () =>
        (props.verify as AliyunCaptchaVerifyHandler | undefined) ||
        pluginOptions.verify
    );

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
        onReady: (instance) => {
          emit("ready", instance);
        },
        onVerified: (payload) => {
          emit("verified", payload);
        },
        onSuccess: (payload) => {
          emit("success", payload);
        },
        onFail: (error) => {
          emit("fail", error);
        },
        onError: (error) => {
          emit("error", error);
        },
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
      await init();
      await controller.value?.show();
    }

    onMounted(() => {
      void init().catch(() => undefined);
    });

    onBeforeUnmount(() => {
      controller.value?.destroy();
      controller.value = null;
    });

    expose<AliyunCaptchaExpose>({
      init,
      show,
      getInstance: () => controller.value?.getInstance() || null,
    });

    return () =>
      h(
        "div",
        {
          class: props.wrapperClass || pluginOptions.wrapperClass,
          style: props.wrapperStyle || pluginOptions.wrapperStyle,
        },
        [
          h(
            "button",
            {
              ref: buttonRef,
              type: "button",
              class: props.buttonClass || pluginOptions.buttonClass,
              style: resolvedManual.value
                ? HIDDEN_BUTTON_STYLE
                : {
                    ...DEFAULT_BUTTON_STYLE,
                    ...(pluginOptions.buttonStyle || {}),
                    ...(props.buttonStyle || {}),
                  },
            },
            slots.default ? slots.default() : resolvedButtonText.value
          ),
          h("div", {
            ref: elementRef,
          }),
        ]
      );
  },
});

export default AliyunCaptcha;
