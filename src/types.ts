export type AliyunCaptchaStyleValue = string | number;
export type AliyunCaptchaInlineStyle = Record<
  string,
  AliyunCaptchaStyleValue | undefined
>;
export type AliyunCaptchaDomTarget = string | HTMLElement;

export interface AliyunCaptchaSlideStyle {
  width: number;
  height: number;
}

export interface AliyunCaptchaVerifyParam {
  [key: string]: unknown;
}

export interface AliyunCaptchaVerifyResult {
  captchaResult: boolean;
  bizResult?: boolean;
  [key: string]: unknown;
}

export interface AliyunCaptchaSdkInstance {
  [key: string]: unknown;
}

export type AliyunCaptchaVerifyHandler = (
  captchaVerifyParam: AliyunCaptchaVerifyParam
) =>
  | AliyunCaptchaVerifyResult
  | Promise<AliyunCaptchaVerifyResult>;

export interface AliyunCaptchaBaseOptions {
  sceneId?: string;
  prefix?: string;
  mode?: string;
  language?: string;
  scriptSrc?: string;
  slideStyle?: AliyunCaptchaSlideStyle;
  buttonText?: string;
  buttonClass?: string;
  buttonStyle?: AliyunCaptchaInlineStyle;
  wrapperClass?: string;
  wrapperStyle?: AliyunCaptchaInlineStyle;
  manual?: boolean;
  cleanupOnUnmount?: boolean;
  verify?: AliyunCaptchaVerifyHandler;
}

export interface AliyunCaptchaPluginOptions extends AliyunCaptchaBaseOptions {}

export interface AliyunCaptchaControllerOptions extends AliyunCaptchaBaseOptions {
  mount?: AliyunCaptchaDomTarget;
  element?: AliyunCaptchaDomTarget;
  button?: AliyunCaptchaDomTarget;
  onReady?: (instance: AliyunCaptchaSdkInstance) => void;
  onVerified?: (payload: AliyunCaptchaVerifiedPayload) => void;
  onSuccess?: (payload: AliyunCaptchaSuccessPayload) => void;
  onFail?: (error: Error) => void;
  onError?: (error: Error) => void;
}

export interface AliyunCaptchaSuccessPayload {
  instance: AliyunCaptchaSdkInstance | null;
  bizResult?: unknown;
}

export interface AliyunCaptchaVerifiedPayload {
  captchaVerifyParam: AliyunCaptchaVerifyParam;
  result: AliyunCaptchaVerifyResult;
}

export interface AliyunCaptchaExpose {
  init: () => Promise<void>;
  show: () => Promise<void>;
  getInstance: () => AliyunCaptchaSdkInstance | null;
}

export interface AliyunCaptchaController extends AliyunCaptchaExpose {
  destroy: () => void;
  getElement: () => HTMLElement;
  getButton: () => HTMLElement;
}
