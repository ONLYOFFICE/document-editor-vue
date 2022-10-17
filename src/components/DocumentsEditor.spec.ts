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
