export declare const AliyunCaptcha: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    sceneId: {
        type: StringConstructor;
        default: string;
    };
    prefix: {
        type: StringConstructor;
        default: string;
    };
    mode: {
        type: StringConstructor;
        default: undefined;
    };
    language: {
        type: StringConstructor;
        default: undefined;
    };
    scriptSrc: {
        type: StringConstructor;
        default: undefined;
    };
    buttonText: {
        type: StringConstructor;
        default: undefined;
    };
    buttonClass: {
        type: StringConstructor;
        default: undefined;
    };
    wrapperClass: {
        type: StringConstructor;
        default: undefined;
    };
    buttonStyle: {
        type: ObjectConstructor;
        default: undefined;
    };
    wrapperStyle: {
        type: ObjectConstructor;
        default: undefined;
    };
    slideStyle: {
        type: ObjectConstructor;
        default: undefined;
    };
    manual: {
        type: BooleanConstructor;
        default: undefined;
    };
    cleanupOnUnmount: {
        type: BooleanConstructor;
        default: undefined;
    };
    verify: {
        type: FunctionConstructor;
        default: undefined;
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("error" | "ready" | "verified" | "success" | "fail")[], "error" | "ready" | "verified" | "success" | "fail", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    sceneId: {
        type: StringConstructor;
        default: string;
    };
    prefix: {
        type: StringConstructor;
        default: string;
    };
    mode: {
        type: StringConstructor;
        default: undefined;
    };
    language: {
        type: StringConstructor;
        default: undefined;
    };
    scriptSrc: {
        type: StringConstructor;
        default: undefined;
    };
    buttonText: {
        type: StringConstructor;
        default: undefined;
    };
    buttonClass: {
        type: StringConstructor;
        default: undefined;
    };
    wrapperClass: {
        type: StringConstructor;
        default: undefined;
    };
    buttonStyle: {
        type: ObjectConstructor;
        default: undefined;
    };
    wrapperStyle: {
        type: ObjectConstructor;
        default: undefined;
    };
    slideStyle: {
        type: ObjectConstructor;
        default: undefined;
    };
    manual: {
        type: BooleanConstructor;
        default: undefined;
    };
    cleanupOnUnmount: {
        type: BooleanConstructor;
        default: undefined;
    };
    verify: {
        type: FunctionConstructor;
        default: undefined;
    };
}>> & Readonly<{
    onReady?: ((...args: any[]) => any) | undefined;
    onVerified?: ((...args: any[]) => any) | undefined;
    onSuccess?: ((...args: any[]) => any) | undefined;
    onFail?: ((...args: any[]) => any) | undefined;
    onError?: ((...args: any[]) => any) | undefined;
}>, {
    prefix: string;
    mode: string;
    slideStyle: Record<string, any>;
    language: string;
    sceneId: string;
    scriptSrc: string;
    buttonText: string;
    buttonClass: string;
    wrapperClass: string;
    buttonStyle: Record<string, any>;
    wrapperStyle: Record<string, any>;
    manual: boolean;
    cleanupOnUnmount: boolean;
    verify: Function;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default AliyunCaptcha;
