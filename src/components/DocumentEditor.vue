/*
* (c) Copyright Ascensio System SIA 2026
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

<template>
  <div :id="id"></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import type { Config, DocEditor } from "@onlyoffice/doceditor-types";
import loadScript from "../utils/loadScript";
import cloneDeep from "lodash/cloneDeep";

declare global {
  interface Window {
    DocsAPI?: {
      DocEditor: (id: string, config: Config) => DocEditor;
    };
    DocEditor?: {
      instances: Record<string, DocEditor | undefined>;
    };
  }
}

export default defineComponent({
  name: 'DocumentEditor',
  props: {
    id: {
      type: String,
      required: true
    },
    documentServerUrl: {
      type: String,
      required: true
    },
    shardkey: {
      type: [String, Boolean], 
      default: true
    },
    config: {
      type: Object as PropType<Config>,
      required: true
    },
    /**
     * @deprecated Use `config.document.fileType` instead.
     */
    document_fileType: String,
    /**
     * @deprecated Use `config.document.title` instead.
     */
    document_title: String,
    /**
     * @deprecated Use `config.documentType` instead.
     */
    documentType: String,
    /**
     * @deprecated Use `config.editorConfig.lang` instead.
     */
    editorConfig_lang: String,
    /**
     * @deprecated Use `config.height` instead.
     */
    height: String,
    /**
     * @deprecated Use `config.type` instead.
     */
    type: String,
    /**
     * @deprecated Use `config.width` instead.
     */
    width: String,

    onLoadComponentError: Function,

    /**
     * @deprecated Use `config.events.onAppReady` instead.
     */
    events_onAppReady: Function,
    /**
     * @deprecated Use `config.events.onDocumentStateChange` instead.
     */
    events_onDocumentStateChange: Function,
    /**
     * @deprecated Use `config.events.onMetaChange` instead.
     */
    events_onMetaChange: Function,
    /**
     * @deprecated Use `config.events.onDocumentReady` instead.
     */
    events_onDocumentReady: Function,
    /**
     * @deprecated Use `config.events.onInfo` instead.
     */
    events_onInfo: Function,
    /**
     * @deprecated Use `config.events.onWarning` instead.
     */
    events_onWarning: Function,
    /**
     * @deprecated Use `config.events.onError` instead.
     */
    events_onError: Function,
    /**
     * @deprecated Use `config.events.onRequestSharingSettings` instead.
     */
    events_onRequestSharingSettings: Function,
    /**
     * @deprecated Use `config.events.onRequestRename` instead.
     */
    events_onRequestRename: Function,
    /**
     * @deprecated Use `config.events.onMakeActionLink` instead.
     */
    events_onMakeActionLink: Function,
    /**
     * @deprecated Use `config.events.onRequestInsertImage` instead.
     */
    events_onRequestInsertImage: Function,
    /**
     * @deprecated Use `config.events.onRequestSaveAs` instead.
     */
    events_onRequestSaveAs: Function,
    /**
     * @deprecated Deprecated since version 7.5, please use `config.events.onRequestSelectSpreadsheet` instead.
     */
    events_onRequestMailMergeRecipients: Function,
    /**
     * @deprecated Deprecated since version 7.5, please use `config.events.onRequestSelectDocument` instead.
     */
    events_onRequestCompareFile: Function,
    /**
     * @deprecated Use `config.events.onRequestEditRights` instead.
     */
    events_onRequestEditRights: Function,
    /**
     * @deprecated Use `config.events.onRequestHistory` instead.
     */
    events_onRequestHistory: Function,
    /**
     * @deprecated Use `config.events.onRequestHistoryClose` instead.
     */
    events_onRequestHistoryClose: Function,
    /**
     * @deprecated Use `config.events.onRequestHistoryData` instead.
     */
    events_onRequestHistoryData: Function,
    /**
     * @deprecated Use `config.events.onRequestRestore` instead.
     */
    events_onRequestRestore: Function,
    /**
     * @deprecated Use `config.events.onRequestSelectSpreadsheet` instead.
     */
    events_onRequestSelectSpreadsheet: Function,
    /**
     * @deprecated Use `config.events.onRequestSelectDocument` instead.
     */
    events_onRequestSelectDocument: Function,
    /**
     * @deprecated Use `config.events.onRequestUsers` instead.
     */
    events_onRequestUsers: Function,
  },
  mounted() {
    let url = this.documentServerUrl;
    if (!url!.endsWith("/")) url += "/";

    let docsApiUrl = `${url}web-apps/apps/api/documents/api.js`;
    if (this.shardkey) {
      if (typeof this.shardkey === "boolean") {
        docsApiUrl += `?shardkey=${this.config.document?.key}`;
      } else {
        docsApiUrl += `?shardkey=${this.shardkey}`;
      }
    }

    loadScript(docsApiUrl, "onlyoffice-api-script")
      .then(() => this.onLoad())
      .catch(()=> {this.onError(-2)});
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

        if (!window.DocsAPI) {
          this.onError(-3);
          return;
        }
        if (window?.DocEditor?.instances[id]) {
          console.log("Skip loading. Instance already exists", id);
          return;
        }

        if (!window?.DocEditor?.instances) {
          window.DocEditor = { instances: {} };
        }

        var cloneConfig = cloneDeep(this.config);

        var propsConfig: any = {
          documentType: this.documentType,
          events: {
            onAppReady: this.onAppReady,
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
            onRequestRestore: this.events_onRequestRestore,
            onRequestSelectSpreadsheet: this.events_onRequestSelectSpreadsheet,
            onRequestSelectDocument: this.events_onRequestSelectDocument,
            onRequestUsers: this.events_onRequestUsers
          },
          height: this.height,
          type: this.type,
          width: this.width,
        };

        const document = this.getDocument();
        const editorConfig = this.getEditorConfig();

        if (document !== null) {
          propsConfig.document = document;
        }

        if (editorConfig !== null) {
          propsConfig.editorConfig = editorConfig;
        }

        let initConfig = Object.assign(propsConfig, cloneConfig || {});

        const editor = window.DocsAPI.DocEditor(id, initConfig);
        window.DocEditor.instances[id] = editor;
      } catch (err: any) {
        console.error(err);
        this.onError(-1);
      }
    },
    getDocument() {
      var document: any = null;

      if (this.document_fileType) {
        document = document || {};
        document.fileType = this.document_fileType;
      }
      if (this.document_title) {
        document = document || {};
        document.document_title = this.document_title;
      }

      return document;
    },
    getEditorConfig() {
      var editorConfig: any = null;

      if (this.editorConfig_lang) {
        editorConfig = editorConfig || {};
        editorConfig.lang = this.editorConfig_lang;
      }

      return editorConfig;
    },
    onError(errorCode: Number) {
      let message;

      switch(errorCode) {
        case -2:
          message = "Error load DocsAPI from " + this.documentServerUrl;
          break;
        case -3:
          message = "DocsAPI is not defined";
          break;
        default:
          message = "Unknown error loading component";
          errorCode = -1;
      }

      if (typeof this.onLoadComponentError == "undefined") {
        console.error(message);
      } else {
        this.onLoadComponentError(errorCode, message);
      }
    },
    onAppReady() {
      const id = this.id || "";
      this.events_onAppReady!(window.DocEditor?.instances[id] || {});
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
