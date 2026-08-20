<template>
  <DocumentEditor
    id="e2e-editor"
    documentServerUrl="http://e2e-document-server.test/"
    :config="config"
    :onLoadComponentError="onLoadComponentError"
  />
</template>

<script setup lang="ts">
import { DocumentEditor } from "@onlyoffice/document-editor-vue";
import type { Config } from "@onlyoffice/doceditor-types";

declare global {
  interface Window {
    __e2eEvents__?: string[];
    __e2eErrors__?: Array<{ errorCode: number; errorDescription: string }>;
  }
}

const config: Config = {
  document: {
    fileType: "docx",
    key: "e2e-test-key",
    title: "e2e-test-document.docx",
    url: "http://e2e-document-server.test/e2e-test-document.docx",
  },
  documentType: "word",
  editorConfig: {
    callbackUrl: "http://e2e-document-server.test/callback",
  },
  events: {
    onAppReady: () => {
      (window.__e2eEvents__ ??= []).push("appReady");
    },
  },
};

function onLoadComponentError(errorCode: number, errorDescription: string) {
  (window.__e2eErrors__ ??= []).push({ errorCode, errorDescription });
}
</script>
