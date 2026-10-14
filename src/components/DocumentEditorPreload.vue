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
  <iframe
    :src="preloadUrl"
    title="onlyoffice-preload"
    tabindex="-1"
    aria-hidden="true"
    style="display: none"
  ></iframe>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DocumentEditorPreload',
  props: {
    documentServerUrl: {
      type: String,
      required: true
    }
  },
  computed: {
    preloadUrl(): string {
      let url = this.documentServerUrl;
      if (!url.endsWith("/")) url += "/";

      return `${url}web-apps/apps/api/documents/preload.html`;
    }
  }
});
</script>
