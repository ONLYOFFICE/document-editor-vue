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

3. Install ONLYOFFICE Docs Vue.js component from **npm** and save it to the *package.json* file with *--save*:

```
npm install --save @onlyoffice/document-editor-vue
```

4. Open the *./src/App.vue* file in the *onlyoffice-vue-demo* project and replace its contents with the following code:

```
<template>
    <DocumentEditor 
        id="docEditor" 
        documentServerUrl="http://documentserver/"
        :config="config"
        :events_onDocumentReady="onDocumentReady"
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
                }
            }
        }
    },
    methods: {
        onDocumentReady() {
            console.log("Document is loaded");
        },
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
| `config` | object | null | yes | Generic configuration object for opening a file with token. [Config API](https://api.onlyoffice.com/editors/config/) |
| `onLoadComponentError` | (errorCode: number, errorDescription: string) => void | null | no | The function called when an error occurs while loading a component |
| `document_fileType` | string | null | no | The type of the file. |
| `document_title` | string | null | no | The file name. |
| `documentType` | string | null | no | The document type. |
| `height` | string | null | no | Defines the document height in the browser window. |
| `type` | string | null | no | Defines the platform type used to access the document (desktop, mobile or embedded). |
| `width` | string | null | no | Defines the document width in the browser window. |
| `events_onAppReady` | (event: object) => void | null | no | The function called when the application is loaded into the browser. |
| `events_onDocumentStateChange` | (event: object) => void | null | no | The function called when the document is modified. |
| `events_onMetaChange` | (event: object) => void | null | no | The function called when the meta information of the document is changed via the meta command. |
| `events_onDocumentReady` | (event: object) => void | null | no | The function called when the document is loaded into the document editor. |
| `events_onInfo` | (event: object) => void | null | no | The function called when the application opened the file. |
| `events_onWarning`| (event: object) => void | null | no | The function called when a warning occurs. |
| `events_onError` | (event: object) => void | null | no | The function called when an error or some other specific event occurs. |
| `events_onRequestSharingSettings` | (event: object) => void | null | no | The function called when the user is trying to manage document access rights by clicking _Change access rights_ button. |
| `events_onRequestRename` | (event: object) => void | null | no | The function called when the user is trying to rename the file by clicking the _Rename..._ button. |
| `events_onMakeActionLink` | (event: object) => void | null | no | The function called when the user is trying to get link for opening the document which contains a bookmark, scrolling to the bookmark position. |
| `events_onRequestInsertImage` | (event: object) => void | null | no | The function called when the user is trying to insert an image by clicking the _Image from Storage_ button. |
| `events_onRequestSaveAs` | (event: object) => void | null | no | The function called when the user is trying to save file by clicking _Save Copy as..._ button. |
| `events_onRequestMailMergeRecipients` [DEPRECATED] | (event: object) => void | null | no | the function called when the user is trying to select recipients data by clicking the _Mail merge_ button. |
| `events_onRequestCompareFile` [DEPRECATED] | (event: object) => void | null | no | The function called when the user is trying to select document for comparing by clicking the _Document from Storage_ button. |
| `events_onRequestEditRights` | (event: object) => void | null | no | The function called when the user is trying to switch the document from the viewing into the editing mode by clicking the _Edit Document_ button. |
| `events_onRequestHistory` | (event: object) => void | null | no | The function called when the user is trying to show the document version history by clicking the _Version History_ button. |
| `events_onRequestHistoryClose` | (event: object) => void | null | no | The function called when the user is trying to go back to the document from viewing the document version history by clicking the _Close History_ button. |
| `events_onRequestHistoryData` | (event: object) => void | null | no | The function called when the user is trying to click the specific document version in the document version history. |
| `events_onRequestRestore` | (event: object) => void | null | no | The function called when the user is trying to restore the file version by clicking the _Restore_ button in the version history. |
| `events_onRequestSelectSpreadsheet` | (event: object) => void | null | no | The function called when the user is trying to select recipients data by clicking the Mail merge button. |
| `events_onRequestSelectDocument` | (event: object) => void | null | no | The function called when the user is trying to select a document for comparing or combining. |
| `events_onRequestUsers` | (event: object) => void | null | no | The function called when  the user can select other users to mention in the comments, grant the access rights to edit the specific sheet ranges, or set the user avatars. |

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
