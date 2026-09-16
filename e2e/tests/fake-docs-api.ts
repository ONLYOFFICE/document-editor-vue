export const API_SCRIPT_PATTERN = "**/web-apps/apps/api/documents/api.js**";

export const fakeDocsApiSource = `
  window.__e2eOpenedKeys__ = [];
  window.DocsAPI = {
    DocEditor: function (id, config) {
      window.__e2eOpenedKeys__.push(config.document.key);

      var target = document.getElementById(id);
      var iframe = document.createElement('iframe');
      iframe.setAttribute('name', 'frameEditor');
      target.parentNode.replaceChild(iframe, target);

      setTimeout(function () {
        if (config.events && config.events.onAppReady) {
          config.events.onAppReady();
        }
      }, 0);

      return {
        destroyEditor: function () {
          var placeholder = document.createElement('div');
          placeholder.setAttribute('id', id);
          iframe.parentNode.replaceChild(placeholder, iframe);
        }
      };
    }
  };
`;
