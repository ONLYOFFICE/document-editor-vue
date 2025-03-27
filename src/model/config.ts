/*
* (c) Copyright Ascensio System SIA 2025
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
  document?: {
    fileType: string;
    key: string;
    referenceData?: {
      fileKey: string,
      instanceId: string,
      key: string
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
      /**
       * @deprecated Deprecated since version 5.5, please add the onRequestRestore field instead.
       */
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
      /**
       * @deprecated Deprecated since version 6.0, please add the onRequestRename field instead.
       */
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
    /**
     * @deprecated Deprecated since version 8.2, please use the region parameter instead.
      */
    location?: string;
    mode?: string;
    recent?: any[];
    region?: string;
    templates?: any[];
    user?: {
      /**
       * @deprecated Deprecated since version 4.2, please use name instead.
       */
      firstname?: string;
      group?: string;
      id?: string;
      image?: string;
      /**
       * @deprecated Deprecated since version 4.2, please use name instead.
       */
      lastname?: string;
      name?: string;
    };
    customization?: {
      anonymous?: {
        request?: boolean;
        label?: string;
      };
      autosave?: boolean;
      /**
       * @deprecated Deprecated since version 7.1, please use the document.permissions.chat parameter instead.
       */
      chat?: boolean;
      close: {
        visible: boolean;
        text: string;
      }
      /**
       * @deprecated Deprecated since version 6.3, please use the document.permissions.editCommentAuthorOnly and document.permissions.deleteCommentAuthorOnly fields instead.
       */
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
        imageLight?: string;
        imageEmbedded?: string;
        url?: string;
        visible?: boolean;
      };
      macros?: boolean;
      macrosMode?: string;
      mentionShare?: boolean;
      mobile?: {
        forceView?: boolean;
        info?: boolean;
        standardView?: boolean;
      };
      /**
       * @deprecated Starting from version 8.2, please use the mobile parameter instead.
       */
      mobileForceView?: boolean;
      plugins?: boolean;
      pointerMode: 'select' | 'hand';
      review?: {
        hideReviewDisplay?: boolean;
        hoverMode?: boolean;
        reviewDisplay?: string;
        showReviewChanges?: boolean;
        trackChanges?: boolean;
      };
      /**
       * @deprecated Deprecated since version 7.0. Please use the review.reviewDisplay parameter instead.
       */
      reviewDisplay?: string;
      showHorizontalScroll?: boolean; 
      /**
       * @deprecated Deprecated since version 7.0. Please use the review.showReviewChanges parameter instead.
       */
      showReviewChanges?: boolean;
      showVerticalScroll?: boolean;
      slidePlayerBackground: string;
      /**
       * @deprecated Deprecated since version 7.1. Please use the features.spellcheck parameter instead.
       */
      spellcheck?: boolean;
      submitForm?: {
        visible:  boolean,
        resultMessage: string,

      } | boolean;
      toolbarHideFileName?: boolean;
      toolbarNoTabs?: boolean;
      /**
       * @deprecated Deprecated since version 7.0. Please use the review.trackChanges parameter instead.
       */
      trackChanges?: boolean;
      uiTheme?: string;
      unit?: string;
      wordHeadingsColor?: string;
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
      options?: {
        all?: Object;
        pluginGuid: Object;
      };
      pluginsData?: string[];
      /**
       * @deprecated Deprecated since version 4.3, please use the absolute URLs in pluginsData field.
       */
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
    onReady?: (event: object) => void;
    onRequestClose?: (event: object) => void;
    /**
     * @deprecated Deprecated since version 7.5, please use onRequestSelectDocument instead.
     */
    onRequestCompareFile?: (event: object) => void;
    onRequestCreateNew?: (event: object) => void;
    onRequestEditRights?: (event: object) => void;
    onRequestHistory?: (event: object) => void;
    onRequestHistoryClose?: (event: object) => void;
    onRequestHistoryData?: (event: object) => void;
    onRequestInsertImage?: (event: object) => void;
    /**
     * @deprecated Deprecated since version 7.5, please use onRequestSelectSpreadsheet instead.
     */
    onRequestMailMergeRecipients?: (event: object) => void;
    onRequestOpen?: (event: object) => void;
    onRequestReferenceData?: (event: object) => void;
    onRequestReferenceSource?: (event: object) => void;
    onRequestRefreshFile?: (event: object) => void;
    onRequestRename?: (event: object) => void;
    onRequestRestore?: (event: object) => void;
    onRequestSaveAs?: (event: object) => void;
    onRequestSelectDocument?: (event: object) => void;
    onRequestSelectSpreadsheet?: (event: object) => void;
    onRequestSendNotify?: (event: object) => void;
    onRequestSharingSettings?: (event: object) => void;
    onRequestStartFilling: (event: object) => void;
    onRequestUsers?: (event: object) => void;
    onSubmit?: (event: object) => void;
    onUserActionRequired?: (event: object) => void;
    onWarning?: (event: object) => void;
  }
};
