# aliyun-captcha-vue3-plugin

Aliyun slider captcha with a framework-agnostic core and an optional Vue 3 wrapper.

## Install

```bash
pnpm add aliyun-captcha-vue3-plugin
```

## Generic Usage

Use the `core` subpath in React or plain DOM code.

```ts
import { createAliyunCaptcha } from "aliyun-captcha-vue3-plugin/core";

const controller = createAliyunCaptcha({
  mount: "#captcha-root",
  sceneId: "your-scene-id",
  prefix: "your-prefix",
  verify: async (captchaVerifyParam) => {
    const response = await fetch("/api/captcha/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(captchaVerifyParam),
    });

    return response.json();
  },
  onSuccess(payload) {
    console.log("captcha success", payload);
  },
});

await controller.init();
await controller.show();
```

## React Example

```tsx
import { useEffect, useRef } from "react";
import {
  createAliyunCaptcha,
  type AliyunCaptchaController,
} from "aliyun-captcha-vue3-plugin/core";

export function LoginCaptcha() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<AliyunCaptchaController | null>(null);

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    const controller = createAliyunCaptcha({
      mount: rootRef.current,
      manual: true,
      sceneId: "your-scene-id",
      prefix: "your-prefix",
      verify: async (captchaVerifyParam) => {
        const response = await fetch("/api/captcha/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(captchaVerifyParam),
        });

        return response.json();
      },
    });

    controllerRef.current = controller;
    void controller.init();

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, []);

  return (
    <>
      <div ref={rootRef} />
      <button type="button" onClick={() => void controllerRef.current?.show()}>
        打开验证码
      </button>
    </>
  );
}
```

## Vue Usage

```ts
import { createApp } from "vue";
import App from "./App.vue";
import AliyunCaptchaPlugin from "aliyun-captcha-vue3-plugin";

const app = createApp(App);

app.use(AliyunCaptchaPlugin, {
  sceneId: "your-scene-id",
  prefix: "your-prefix",
  verify: async (captchaVerifyParam) => {
    const response = await fetch("/api/captcha/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(captchaVerifyParam),
    });

    return response.json();
  },
});

app.mount("#app");
```

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { AliyunCaptchaExpose } from "aliyun-captcha-vue3-plugin";

const captchaRef = ref<AliyunCaptchaExpose | null>(null);

function openCaptcha() {
  void captchaRef.value?.show();
}
</script>

<template>
  <AliyunCaptcha ref="captchaRef" manual @success="console.log">
    点击校验
  </AliyunCaptcha>

  <button type="button" @click="openCaptcha">
    手动唤起验证码
  </button>
</template>
```

## Exports

- `aliyun-captcha-vue3-plugin`: Vue plugin and component entry.
- `aliyun-captcha-vue3-plugin/core`: framework-agnostic controller entry.
- `AliyunCaptcha`: component
- `AliyunCaptchaComponent`: named component export
- `createAliyunCaptcha`: generic controller factory
- `createAliyunCaptchaPlugin`: plugin factory with options
- `loadAliyunCaptchaScript`: script loader
- `DEFAULT_SCRIPT_SRC`: default SDK script URL

## Notes

- `sceneId`, `prefix`, and `verify` are required for both the generic controller and the Vue wrapper.
- `manual` hides the internal trigger button so you can call `show()` yourself.
- Vue emits `ready`, `verified`, `success`, `fail`, and `error`.
