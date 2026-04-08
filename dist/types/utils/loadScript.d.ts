declare global {
    interface Window {
        initAliyunCaptcha?: (options: Record<string, unknown>) => void;
        __aliyunCaptchaScriptPromise__?: Promise<void>;
    }
}
export declare const DEFAULT_SCRIPT_SRC = "https://o.alicdn.com/captcha-frontend/aliyunCaptcha/AliyunCaptcha.js";
export declare function loadAliyunCaptchaScript(scriptSrc?: string): Promise<void>;
