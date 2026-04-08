import type { App, Plugin } from "vue";
import AliyunCaptcha, { AliyunCaptcha as AliyunCaptchaComponent } from "./components/AliyunCaptcha";
import createAliyunCaptcha, {
  DEFAULT_BUTTON_STYLE,
  DEFAULT_SLIDE_STYLE,
  HIDDEN_BUTTON_STYLE,
} from "./core";
import { aliyunCaptchaOptionsKey } from "./symbols";
import type { AliyunCaptchaPluginOptions } from "./types";
import { DEFAULT_SCRIPT_SRC, loadAliyunCaptchaScript } from "./utils/loadScript";

export * from "./types";
export { DEFAULT_SCRIPT_SRC, loadAliyunCaptchaScript };
export {
  createAliyunCaptcha,
  DEFAULT_BUTTON_STYLE,
  DEFAULT_SLIDE_STYLE,
  HIDDEN_BUTTON_STYLE,
};
export { AliyunCaptchaComponent, aliyunCaptchaOptionsKey };

export function createAliyunCaptchaPlugin(
  options: AliyunCaptchaPluginOptions = {}
): Plugin {
  return {
    install(app: App, runtimeOptions: AliyunCaptchaPluginOptions = {}) {
      app.provide(aliyunCaptchaOptionsKey, {
        ...options,
        ...runtimeOptions,
      });
      app.component("AliyunCaptcha", AliyunCaptcha);
    },
  };
}

const AliyunCaptchaPlugin = createAliyunCaptchaPlugin();

export { AliyunCaptcha };
export default AliyunCaptchaPlugin;
