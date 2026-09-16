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

import { mount, shallowMount } from "@vue/test-utils";
import type { Config } from "@onlyoffice/doceditor-types";
import DocumentEditor from "./DocumentEditor.vue";

declare global {
  interface Window {
    DocsAPI?: { DocEditor: (id: string, config: Config) => any };
    DocEditor?: { instances: Record<string, any> };
  }
}

const config: Config = {
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
};

const withKey = (key: string): Config => ({
  ...config,
  document: { ...config.document!, key },
});

let openedKeys: string[];
let attachedOnDestroy: boolean[];

const mockDocsAPI = () => {
  window.DocsAPI = {
    DocEditor: (id: string, editorConfig: Config) => {
      openedKeys.push(editorConfig.document!.key!);

      const target = document.getElementById(id)!;
      const iframe = document.createElement("iframe");
      iframe.setAttribute("name", "frameEditor");
      target.parentNode!.replaceChild(iframe, target);

      return {
        destroyEditor: () => {
          attachedOnDestroy.push(iframe.isConnected);

          const placeholder = document.createElement("div");
          placeholder.setAttribute("id", id);
          iframe.parentNode?.replaceChild(placeholder, iframe);
        },
      } as any;
    },
  };
};

const editor = () => window.DocEditor?.instances["docxEditor"];
const iframes = () => document.querySelectorAll("iframe[name='frameEditor']");
const placeholders = () => document.querySelectorAll("#docxEditor");
const leftovers = () => document.querySelectorAll("[data-v-app] > *");
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

const mountEditor = (props: Record<string, unknown> = {}) =>
  mount(DocumentEditor, {
    attachTo: document.body,
    props: {
      id: "docxEditor",
      documentServerUrl: "http://documentserver/",
      config,
      ...props,
    },
  });

describe("DocumentEditor", () => {
  beforeEach(() => {
    openedKeys = [];
    attachedOnDestroy = [];
    mockDocsAPI();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    window.DocsAPI = undefined;
    window.DocEditor = undefined;
    document.body.innerHTML = "";
  });

  it("renders the DocumentEditor component", () => {
    shallowMount(DocumentEditor, {
      props: {
        id: "docxEditor",
        documentServerUrl: "http://documentserver/",
        config
      }
    });
  });

  it("renders the placeholder inside a wrapper it owns", () => {
    const wrapper = mountEditor();
    const root = wrapper.element as HTMLElement;

    expect(root.id).toBe("");
    expect(root.style.display).toBe("contents");
    expect(root.querySelector("#docxEditor")).not.toBeNull();
  });

  it("destroys the editor while it is still in the document", async () => {
    const wrapper = mountEditor();
    await flush();

    expect(editor()).toBeDefined();

    wrapper.unmount();

    expect(attachedOnDestroy).toEqual([true]);
    expect(editor()).toBeUndefined();
    expect(iframes()).toHaveLength(0);
    expect(placeholders()).toHaveLength(0);
    expect(leftovers()).toHaveLength(0);
  });

  it("can be mounted again after being unmounted", async () => {
    const first = mountEditor();
    await flush();

    first.unmount();

    const second = mountEditor();
    await flush();

    expect(editor()).toBeDefined();
    expect(iframes()).toHaveLength(1);
    expect(placeholders()).toHaveLength(0);
    expect(second.element.querySelector("iframe[name='frameEditor']")).not.toBeNull();
    expect(openedKeys).toEqual(["Khirz6zTPdfd7", "Khirz6zTPdfd7"]);

    second.unmount();
  });

  it("recreates the editor when the config changes", async () => {
    const wrapper = mountEditor();
    await flush();

    const first = editor();

    await wrapper.setProps({ config: withKey("aNewKey") });
    await flush();

    expect(editor()).toBeDefined();
    expect(editor()).not.toBe(first);
    expect(openedKeys).toEqual(["Khirz6zTPdfd7", "aNewKey"]);
    expect(iframes()).toHaveLength(1);
    expect(wrapper.element.querySelector("iframe[name='frameEditor']")).not.toBeNull();

    wrapper.unmount();
  });

  it("creates no editor when unmounted while api.js is loading", async () => {
    const onLoadComponentError = jest.fn();
    const loaded = holdApiScript();

    const wrapper = mountEditor({ onLoadComponentError });

    wrapper.unmount();

    loaded();
    await flush();

    expect(openedKeys).toEqual([]);
    expect(editor()).toBeUndefined();
    expect(onLoadComponentError).not.toHaveBeenCalled();
    expect(iframes()).toHaveLength(0);
    expect(leftovers()).toHaveLength(0);
  });
});

const holdApiScript = () => {
  const docsAPI = window.DocsAPI;
  window.DocsAPI = undefined;

  let load = () => {};
  const appendChild = document.body.appendChild.bind(document.body);

  jest.spyOn(document.body, "appendChild").mockImplementation(((node: any) => {
    if (node.id !== "onlyoffice-api-script") return appendChild(node);

    load = () => {
      window.DocsAPI = docsAPI;
      node.onload();
    };

    return node;
  }) as any);

  return () => load();
};
