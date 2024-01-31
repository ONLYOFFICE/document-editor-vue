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
      if (document.getElementById(id)) {
        //@ts-ignore
        if (window.DocsAPI) return resolve(null);

        let intervalHandler = setInterval(() => {
          //@ts-ignore
          if (!window.DocsAPI) return;

          clearInterval(intervalHandler);

          return resolve(null);
        }, 500);
      } else {
        const script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.setAttribute("id", id);

        script.onload = resolve;
        script.onerror = reject;

        script.src = url;
        script.async = true;

        document.body.appendChild(script);
      }
    } catch (e) {
      console.error(e);
    }
  });
};

export default loadScript;
