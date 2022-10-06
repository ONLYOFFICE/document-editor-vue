<template>
  <div :id="id"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import loadScript from "../utils/loadScript";

declare global {
  interface Window {
    DocsAPI?: any;
    DocEditor?: any;
  }
}

export default defineComponent({
  name: 'DocumentEditor',
  props: {
    id: String,
    documentServerUrl: String,
    config: Object,
    document_fileType: String,
    document_title: String,
    documentType: String,
    editorConfig_lang: String,
    height: String,
    type: String,
    width: String,

    events_onAppReady: Function,
    events_onDocumentReady: Function,
    events_onDocumentStateChange: Function,
    events_onError: Function
  },
  mounted() {
    let url = this.documentServerUrl;
    if (!url!.endsWith("/")) url += "/";

    const docApiUrl = `${url}web-apps/apps/api/documents/api.js`;
    loadScript(docApiUrl, "onlyoffice-api-script")
      .then(() => this.onLoad())
      .catch((err) => console.error(err));
  },
  unmounted() {
    const id = this.id || "";

    if (window?.DocEditor?.instances[id]) {
      window.DocEditor.instances[id].destroyEditor();
      window.DocEditor.instances[id] = undefined;
    }
  },
  watch: {
    config: {
      handler: function (newVal, oldVal) {
        this.onChangeProps()     
      },
      deep: true
    },
    document_fileType: function(newVal, oldVal) { this.onChangeProps() },
    document_title: function(newVal, oldVal) { this.onChangeProps() },
    documentType: function(newVal, oldVal) { this.onChangeProps() },
    editorConfig_lang: function(newVal, oldVal) { this.onChangeProps() },
    height: function(newVal, oldVal) { this.onChangeProps() },
    type: function(newVal, oldVal) { this.onChangeProps() },
    width: function(newVal, oldVal) { this.onChangeProps() }
  },
  methods: {
    onLoad () {
       try {
        const id = this.id || "";

        if (!window.DocsAPI) throw new Error("DocsAPI is not defined");
        if (window?.DocEditor?.instances[id]) {
          console.log("Skip loading. Instance already exists", id);
          return;
        }

        if (!window?.DocEditor?.instances) {
          window.DocEditor = { instances: {} };
        }

        let initConfig = Object.assign({
          document: {
            fileType: this.document_fileType,
            title: this.document_title,
          },
          documentType: this.documentType,
          editorConfig: {
            lang: this.editorConfig_lang,
          },
          events: {
            onAppReady: this.events_onAppReady,
            onDocumentReady: this.events_onDocumentReady,
            onDocumentStateChange: this.events_onDocumentStateChange,
            onError: this.events_onError,
          },
          height: this.height,
          type: this.type,
          width: this.width,
        }, this.config || {});

        const editor = window.DocsAPI.DocEditor(id, initConfig);
        window.DocEditor.instances[id] = editor;
      } catch (err: any) {
        console.error(err);
        this.events_onError!(err);
      }
    },
    onChangeProps () {
      const id = this.id || "";

      if (window?.DocEditor?.instances[id]) {
        window.DocEditor.instances[id].destroyEditor();
        window.DocEditor.instances[id] = undefined;
  
        console.log("Important props have been changed. Load new Editor.");
        this.onLoad();
      }
    }
  }
});
</script>
