# @onlyoffice/document-editor-vue

This repo contains the ONLYOFFICE Docs Vue.js component which integrates [ONLYOFFICE Document Server](https://github.com/ONLYOFFICE/DocumentServer) into [Vue.js](https://vuejs.org/) projects.

**Please note**: Before working with this component, you need to install ONLYOFFICE Docs. To do so, you can use [Docker](https://github.com/onlyoffice/Docker-DocumentServer) (recommended).

## Prerequisites
This procedure requires [Node.js (and npm)](https://nodejs.org/en).

## Creating the demo Vue.js application with ONLYOFFICE Docs editor
This procedure creates a [basic Vue.js application](https://cli.vuejs.org/guide/creating-a-project.html#vue-create) and installs an ONLYOFFICE Docs editor in it.

1. Open a command line or command prompt and create a Vue.js 3.x project named *onlyoffice-vue-demo* using the [Create Vue Tool](https://github.com/vuejs/create-vue):

```
npm create vue@3
```

2. Go to the newly created directory:

```
cd onlyoffice-vue-demo
```

3. Install ONLYOFFICE Docs Vue.js component and the Document Editor API types from **npm** and save them to the *package.json* file with *--save*:

```
npm install --save @onlyoffice/document-editor-vue @onlyoffice/doceditor-types
```

The `@onlyoffice/doceditor-types` package version tracks the ONLYOFFICE Docs Server version, so you can install the version that matches your Document Server.

4. Open the *./src/App.vue* file in the *onlyoffice-vue-demo* project and replace its contents with the following code:

```
<template>
    <DocumentEditor 
        id="docEditor" 
        documentServerUrl="http://documentserver/"
        :config="config"
        :onLoadComponentError="onLoadComponentError"
    /> 
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { DocumentEditor } from "@onlyoffice/document-editor-vue";

export default defineComponent({
    name: 'ExampleComponent',
    components: {
        DocumentEditor
    },
    data() {
        const onDocumentReady = () => {
            console.log("Document is loaded");
        };

        return {
            config: {
                document: {
                    fileType: "docx",
                    key: "Khirz6zTPdfd7",
                    title: "Example Document Title.docx",
                    url: "https://example.com/url-to-example-document.docx"
                },
                documentType: "word",
                editorConfig: {
                    callbackUrl: "https://example.com/url-to-callback.ashx"
                },
                events: {
                    onDocumentReady: onDocumentReady
                }
            }
        }
    },
    methods: {
        onLoadComponentError (errorCode, errorDescription) {
            switch(errorCode) {
                case -1: // Unknown error loading component
                    console.log(errorDescription);
                    break;

                case -2: // Error load DocsAPI from http://documentserver/
                    console.log(errorDescription);
                    break;

                case -3: // DocsAPI is not defined
                    console.log(errorDescription);
                    break;
            }
        }
    },
});
</script>
```

Replace the following lines with your own data:
* **"http://documentserver/"** - replace with the URL of your server;
* **"https://example.com/url-to-example-document.docx"** - replace with the URL to your file;
* **"https://example.com/url-to-callback.ashx"** - replace with your callback URL (this is required for the saving functionality to work).

5. Test the application using the Vue development server:

* To start the development server, navigate to the *onlyoffice-vue-demo* directory and run:

```
npm run dev
```

* To stop the development server, select on the command line or command prompt and press *Ctrl+C*.

## Deploying the demo Vue.js application

The easiest way to deploy the application to a production environment is to install [serve](https://github.com/vercel/serve) and create a static server:

1. Install the *serve* package globally:

```
npm install -g serve
```

2. Serve your static site on the 3000 port:

```
serve -s build
```

Another port can be adjusted using the *-l* or *--listen* flags:

```
serve -s build -l 4000
```

3. To serve the project folder, go to it and run the *serve* command:

```
cd onlyoffice-react-demo
serve
```

Now you can deploy the application to the created server:

1. Navigate to the *onlyoffice-vue-demo* directory and run:

```
npm run build
```

The *dist* directory will be created with a production build of your app.

2. Copy the contents of the *onlyoffice-vue-demo/dist* directory to the root directory of the web server (to the *onlyoffice-react-demo* folder).

The application will be deployed on the web server (*http://localhost:3000* by default).


## API
### Props
| Name | Type | Default | Required | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| `id` | string | null | yes | Component unique identifier. |
| `documentServerUrl` | string | null | yes | Address ONLYOFFICE Document Server. |
| `shardkey` | string \| boolean | true | no | The string or boolean parameter required to request load balancing during collaborative editing: all users editing the same document are served by the same server. [Shard key](https://api.onlyoffice.com/docs/docs-api/get-started/how-it-works/#shard-key)|
| `config` | Config | null | yes | Generic configuration object for opening a file with token. [Config API](https://api.onlyoffice.com/docs/docs-api/usage-api/config/) |
| `onLoadComponentError` | (errorCode: number, errorDescription: string) => void | null | no | The function called when an error occurs while loading a component |

### Notes

* A `config` passed as an object literal is a new object on every render of the parent component. The editor is rebuilt only when the contents of `config` really change; handlers are treated as equal in that comparison, so passing a new function does not tear the editor down, exactly as the `events_*` props do not.
* The component renders the editor placeholder inside a wrapper element. ONLYOFFICE Docs replaces the placeholder with its own iframe, so the wrapper is what keeps the component removable by Vue and reusable after unmounting. The wrapper is styled with `display: contents` and creates no box of its own, so the editor is laid out by the element you place the component in, and sizing it is unchanged.
* Attributes you pass to `<DocumentEditor>` that are not props (`class`, `style`, `data-*`, `aria-*`) land on that wrapper, so they survive the moment Docs swaps the placeholder for its iframe and a selector such as `.your-class iframe` keeps working. The wrapper generates no box, so use the `height` and `width` props, or the element you place the component in, to size the editor: a height given in `class` or `style` applies to the wrapper and has no effect unless it also overrides `display`.

## Preloading the editor

Starting from ONLYOFFICE Docs 9.0, the editor static assets (HTML, CSS, JS, fonts) can be cached before a document is opened, which makes the first opening faster. [Preload](https://api.onlyoffice.com/docs/docs-api/get-started/configuration/preload/)

Place the `DocumentEditorPreload` component on a page where the editor itself is not shown yet: a file list, a login screen, an application layout.

```
<template>
    <DocumentEditorPreload documentServerUrl="http://documentserver/" />
    <RouterView />
</template>

<script setup>
import { DocumentEditorPreload } from "@onlyoffice/document-editor-vue";
</script>
```

The component renders a hidden iframe with the preload page of ONLYOFFICE Docs and does nothing else. Rendering it next to `DocumentEditor` brings no benefit, because `DocumentEditor` requests the same assets as soon as it is mounted.

### Props
| Name | Type | Default | Required | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| `documentServerUrl` | string | null | yes | Address of ONLYOFFICE Document Server. |

**Please note**:
* the preload page appeared in ONLYOFFICE Docs 9.0, earlier versions answer the request for it with the 404 error: it breaks nothing, but is visible in the browser network log;
* one component per application is enough;
* do not replace it with `<link rel="prefetch">`: the editor assets are loaded within the iframe context, so prefetch will not cache them.

## Storybook

Change the address of the Document Server in the *config/default.json* file:
```
"documentServerUrl": "http://documentserver/"
```

### Build Storybook:
```
npm run build-storybook
```
### Start Storybook:
```
npm run storybook
```

## Development

### Clone project from the GitHub repository:
```
git clone https://github.com/ONLYOFFICE/document-editor-vue
```
### Install the project dependencies:
```
npm install
```
### Test the component:
```
npm run test
```
### Build the project:
```
npm run build
```
### Create the package:
```
npm pack
```

## Feedback and support

In case you have any issues, questions, or suggestions for the ONLYOFFICE Document Server Vue component, please refer to the [Issues](https://github.com/ONLYOFFICE/document-editor-vue/issues) section.

Official project website: [www.onlyoffice.com](https://www.onlyoffice.com/).

Support forum: [forum.onlyoffice.com](https://forum.onlyoffice.com/).
