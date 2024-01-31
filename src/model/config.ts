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

export interface IConfig {
  documentType?: string;
  height?: string;
  token?: string;
  type?: string;
  width?: string;
  document: {
    fileType: string;
    key: string;
    referenceData?: {
      fileKey: string,
      instanceId: string
    }
    title: string;
    url: string;
    info?: {
      owner?: string;
      uploaded?: string;
      favorite?: boolean;
      folder?: string;
      sharingSettings?: any[];
    };
    permissions?: {
      changeHistory?: boolean;
      chat?: boolean;
      comment?: boolean;
      commentGroups?: any;
      copy?: boolean;
      deleteCommentAuthorOnly?: boolean;
      download?: boolean;
      edit?: boolean;
      editCommentAuthorOnly?: boolean;
      fillForms?: boolean;
      modifyContentControl?: boolean;
      modifyFilter?: boolean;
      print?: boolean;
      protect?: boolean;
      rename?: boolean;
      review?: boolean;
      reviewGroups?: string[];
      userInfoGroups?: string[];
    };
  };
  editorConfig?: {
    actionLink?: any;
    callbackUrl?: string;
    coEditing?: {
      mode: string;
      change: boolean;
    };
    createUrl?: string;
    lang?: string;
    location?: string;
    mode?: string;
    recent?: any[];
    region?: string;
    templates?: any[];
    user?: {
      firstname?: string;
      group?: string;
      id?: string;
      lastname?: string;
      name?: string;
    };
    customization?: {
      anonymous?: {
        request?: boolean;
        label?: string;
      };
      autosave?: boolean;
      chat?: boolean;
      commentAuthorOnly?: boolean;
      comments?: boolean;
      compactHeader?: boolean;
      compactToolbar?: boolean;
      compatibleFeatures?: boolean;
      customer?: {
        address?: string;
        info?: string;
        logo?: string;
        logoDark?: string;
        mail?: string;
        name?: string;
        phone?: string;
        www?: string;
      };
      features?: any;
      feedback?: any;
      forcesave?: boolean;
      goback?: any;
      help?: boolean;
      hideNotes?: boolean;
      hideRightMenu?: boolean;
      hideRulers?: boolean;
      integrationMode?: string;
      logo?: {
        image?: string;
        imageDark?: string;
        imageEmbedded?: string;
        url?: string;
      };
      macros?: boolean;
      macrosMode?: string;
      mentionShare?: boolean;
      plugins?: boolean;
      review?: {
        hideReviewDisplay?: boolean;
        hoverMode?: boolean;
        reviewDisplay?: string;
        showReviewChanges?: boolean;
        trackChanges?: boolean;
      };
      reviewDisplay?: string;
      showReviewChanges?: boolean;
      spellcheck?: boolean;
      toolbarHideFileName?: boolean;
      toolbarNoTabs?: boolean;
      trackChanges?: boolean;
      uiTheme?: string;
      unit?: string;
      zoom?: number;
    };
    embedded?: {
      embedUrl?: string;
      fullscreenUrl?: string;
      saveUrl?: string;
      shareUrl?: string;
      toolbarDocked?: string;
    };
    plugins?: {
      autostart?: string[];
      pluginsData?: string[];
      url?: string;
    };
  };
  events?: {
    onAppReady?: (event: object) => void;
    onCollaborativeChanges?: (event: object) => void;
    onDocumentReady?: (event: object) => void;
    onDocumentStateChange?: (event: object) => void;
    onDownloadAs?: (event: object) => void;
    onError?: (event: object) => void;
    onInfo?: (event: object) => void;
    onMetaChange?: (event: object) => void;
    onMakeActionLink?: (event: object) => void;
    onOutdatedVersion?: (event: object) => void;
    onPluginsReady?: (event: object) => void;
    onRequestClose?: (event: object) => void;
    onRequestCompareFile?: (event: object) => void;
    onRequestCreateNew?: (event: object) => void;
    onRequestEditRights?: (event: object) => void;
    onRequestHistory?: (event: object) => void;
    onRequestHistoryClose?: (event: object) => void;
    onRequestHistoryData?: (event: object) => void;
    onRequestInsertImage?: (event: object) => void;
    onRequestMailMergeRecipients?: (event: object) => void;
    onRequestReferenceData?: (event: object) => void;
    onRequestRename?: (event: object) => void;
    onRequestRestore?: (event: object) => void;
    onRequestSaveAs?: (event: object) => void;
    onRequestSendNotify?: (event: object) => void;
    onRequestSharingSettings?: (event: object) => void;
    onRequestUsers?: (event: object) => void;
    onWarning?: (event: object) => void;
  }
};
