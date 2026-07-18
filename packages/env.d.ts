/// <reference types="vite/client" />

// 声明样式文件模块
declare module '*.scss' {
  const content: string;
  export default content;
}

declare module '*.sass' {
  const content: string;
  export default content;
}

declare module '*.css' {
  const content: string;
  export default content;
}

// 声明 Vue 文件
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
