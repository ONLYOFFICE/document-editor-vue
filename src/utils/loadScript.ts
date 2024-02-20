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

const loadScript = async (url: string, id: string) => {
  return new Promise((resolve, reject) => {
    try {
      // If DocsAPI is defined return resolve.
      //@ts-ignore
      if (window.DocsAPI) return resolve(null);

      const existedScript = document.getElementById(id);

      if (existedScript) {
        // If the script element is found, wait for it to load.
        let intervalHandler = setInterval(() => {
          const loading = existedScript.getAttribute("loading");
          if (loading) {
            // If the download is not completed, continue to wait.
            return;
          } else {
            // If the download is completed, stop the wait.
            clearInterval(intervalHandler);

            // If DocsAPI is defined, after loading return resolve.
            //@ts-ignore
            if (window.DocsAPI) return resolve(null);

            // If DocsAPI is not defined, delete the existing script and create a new one.
            const script = _createScriptTag(id, url, resolve, reject);
            existedScript.remove();
            document.body.appendChild(script);
          }
        }, 500);
      } else {
        // If the script element is not found, create it.
        const script = _createScriptTag(id, url, resolve, reject);
        document.body.appendChild(script);
      }
    } catch (e) {
      console.error(e);
    }
  });
};

const _createScriptTag = (id: string, url: string, resolve: (value: unknown) => void, reject: (reason?: any) => void) => {
  const script = document.createElement("script");

  script.id = id;
  script.type = "text/javascript";
  script.src = url;
  script.async = true;

  script.onload = () => {
    // Remove attribute loading after loading is complete.
    script.removeAttribute("loading");
    resolve(null);
  };
  script.onerror = (error: any) => {
    // Remove attribute loading after loading is complete.
    script.removeAttribute("loading");
    reject(error);
  };

  script.setAttribute("loading", "");

  return script;
};

export default loadScript;
