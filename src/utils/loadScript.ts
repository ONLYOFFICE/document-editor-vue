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
