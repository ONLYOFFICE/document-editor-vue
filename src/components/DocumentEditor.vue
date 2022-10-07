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
    events_onDocumentStateChange: Function,
    events_onMetaChange: Function,
    events_onDocumentReady: Function,
    events_onInfo: Function,
    events_onWarning: Function,
    events_onError: Function,
    events_onRequestSharingSettings: Function,
    events_onRequestRename: Function,
    events_onMakeActionLink: Function,
    events_onRequestInsertImage: Function,
    events_onRequestSaveAs: Function,
    events_onRequestMailMergeRecipients: Function,
    events_onRequestCompareFile: Function,
    events_onRequestEditRights: Function,
    events_onRequestHistory: Function,
    events_onRequestHistoryClose: Function,
    events_onRequestHistoryData: Function,
    events_onRequestRestore: Function,
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
            onDocumentStateChange: this.events_onDocumentStateChange,
            onMetaChange: this.events_onMetaChange,
            onDocumentReady: this.events_onDocumentReady,
            onInfo: this.events_onInfo,
            onWarning: this.events_onWarning,
            onError: this.events_onError,
            onRequestSharingSettings: this.events_onRequestSharingSettings,
            onRequestRename: this.events_onRequestRename,
            onMakeActionLink: this.events_onMakeActionLink,
            onRequestInsertImage: this.events_onRequestInsertImage,
            onRequestSaveAs: this.events_onRequestSaveAs,
            onRequestMailMergeRecipients: this.events_onRequestMailMergeRecipients,
            onRequestCompareFile: this.events_onRequestCompareFile,
            onRequestEditRights: this.events_onRequestEditRights,
            onRequestHistory: this.events_onRequestHistory,
            onRequestHistoryClose: this.events_onRequestHistoryClose,
            onRequestHistoryData: this.events_onRequestHistoryData,
            onRequestRestore: this.events_onRequestRestore
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
