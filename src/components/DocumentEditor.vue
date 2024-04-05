/*
* (c) Copyright Ascensio System SIA 2024
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
import loadScript from "../utils/loadScript";
import { IConfig } from "../model/config";
import cloneDeep from "lodash/cloneDeep";

declare global {
  interface Window {
    DocsAPI?: any;
    DocEditor?: any;
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
    config: {
      type: Object as PropType<IConfig>,
      required: true
    },
    document_fileType: String,
    document_title: String,
    documentType: String,
    editorConfig_lang: String,
    height: String,
    type: String,
    width: String,

    onLoadComponentError: Function,

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
    /**
     * @deprecated Deprecated since version 7.5, please use events_onRequestSelectSpreadsheet instead.
     */
    events_onRequestMailMergeRecipients: Function,
    /**
     * @deprecated Deprecated since version 7.5, please use events_onRequestSelectDocument instead.
     */
    events_onRequestCompareFile: Function,
    events_onRequestEditRights: Function,
    events_onRequestHistory: Function,
    events_onRequestHistoryClose: Function,
    events_onRequestHistoryData: Function,
    events_onRequestRestore: Function,
    events_onRequestSelectSpreadsheet: Function,
    events_onRequestSelectDocument: Function,
    events_onRequestUsers: Function,
  },
  mounted() {
    let url = this.documentServerUrl;
    if (!url!.endsWith("/")) url += "/";

    const docApiUrl = `${url}web-apps/apps/api/documents/api.js`;
    loadScript(docApiUrl, "onlyoffice-api-script")
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

        if (!window.DocsAPI) this.onError(-3);
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
      this.events_onAppReady!(window.DocEditor.instances[id]);
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
