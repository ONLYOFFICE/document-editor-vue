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

import { shallowMount } from "@vue/test-utils";
import DocumentEditor from "./DocumentEditor.vue";

describe("DocumentEditor", () => {
  it("renders the DocumentEditor component", () => {
    const wrapper = shallowMount(DocumentEditor, {
      props: { 
        id: "docxEditor",
        documentServerUrl: "http://documentserver/",
        config: {
          "document": {
            "fileType": "docx",
            "key": "Khirz6zTPdfd7",
            "title": "Example Document Title.docx",
            "url": "https://example.com/url-to-example-document.docx"
          },
          "documentType": "word",
          "editorConfig": {
            "callbackUrl": "https://example.com/url-to-callback.ashx"
          }
        }
      }
    });
  });
});
