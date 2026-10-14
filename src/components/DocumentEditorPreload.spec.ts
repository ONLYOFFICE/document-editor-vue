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

import { mount } from "@vue/test-utils";
import DocumentEditorPreload from "./DocumentEditorPreload.vue";

const mountPreload = (documentServerUrl: string) =>
  mount(DocumentEditorPreload, {
    attachTo: document.body,
    props: { documentServerUrl },
  });

const preloadIframe = () =>
  document.querySelector<HTMLIFrameElement>("iframe[title='onlyoffice-preload']");

describe("DocumentEditorPreload", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders a hidden iframe pointing to the preload page", () => {
    mountPreload("http://documentserver/");

    const iframe = preloadIframe();

    expect(iframe).not.toBeNull();
    expect(iframe!.getAttribute("src")).toBe(
      "http://documentserver/web-apps/apps/api/documents/preload.html"
    );
    expect(iframe!.style.display).toBe("none");
  });

  it("keeps the iframe out of the tab order and of the accessibility tree", () => {
    mountPreload("http://documentserver/");

    const iframe = preloadIframe()!;

    expect(iframe.getAttribute("tabindex")).toBe("-1");
    expect(iframe.getAttribute("aria-hidden")).toBe("true");
  });

  it("adds the missing trailing slash to the document server url", () => {
    mountPreload("http://documentserver");

    expect(preloadIframe()!.getAttribute("src")).toBe(
      "http://documentserver/web-apps/apps/api/documents/preload.html"
    );
  });

  it("removes the iframe on unmount", () => {
    const wrapper = mountPreload("http://documentserver/");

    wrapper.unmount();

    expect(preloadIframe()).toBeNull();
  });
});
