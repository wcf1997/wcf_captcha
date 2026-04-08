import type { InjectionKey } from "vue";
import type { AliyunCaptchaPluginOptions } from "./types";

export const aliyunCaptchaOptionsKey: InjectionKey<AliyunCaptchaPluginOptions> =
  Symbol("aliyun-captcha-options");
