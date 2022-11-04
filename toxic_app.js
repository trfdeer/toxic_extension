const SERVER_URL = "CHANGE_ME_BEFORE_RUNNING";

const observerCallback = (mutationList, _) => {
  for (const mutation of mutationList) {
    if (
      mutation.type === "childList" &&
      mutation.addedNodes.length > 0 &&
      mutation.previousSibling === null &&
      mutation.target.tagName == "YTD-COMMENT-THREAD-RENDERER"
    ) {
      let renderer = mutation.target.children[0];

      let text = renderer.querySelector("#content-text").textContent;
      let toolbar = renderer.querySelector("#toolbar");

      toolbar.classList.add("loading-report");

      fetch(`${SERVER_URL}/text?` + new URLSearchParams({ q: text }))
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.label == "positive") {
            toolbar.classList.add("positive-report");
          } else if (data.label == "neutral") {
            toolbar.classList.add("neutral-report");
          } else {
            toolbar.classList.add("negative-report");
          }
        })
        .catch((err) => {
          console.log(err);
          toolbar.classList.add("teapot-report");
        });
    }
  }
};

const observer = new MutationObserver(observerCallback);
observer.observe(document.body, { childList: true, subtree: true });
