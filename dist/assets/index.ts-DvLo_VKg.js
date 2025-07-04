(function(){window.__racContentInjected = true;
console.log("[CS] content script loaded and running.");
function onMouseOver(e) {
  e.target.style.outline = "2px solid #007bff";
}
function onMouseOut(e) {
  e.target.style.outline = "";
}
function onClick(e) {
  const text = window.getSelection()?.toString() || e.target.innerText || "";
  console.log("[CS] onClick detected, sending embed-and-search:", { text: text.substring(0, 100) + "..." });
  chrome.runtime.sendMessage({ type: "embed-and-search", payload: { text, requestId: Date.now().toString() } });
}
function addListeners() {
  console.log("[CS] Adding mouse and click listeners.");
  document.addEventListener("mouseover", onMouseOver, true);
  document.addEventListener("mouseout", onMouseOut, true);
  document.addEventListener("click", onClick, true);
}
function removeListeners() {
  console.log("[CS] Removing mouse and click listeners.");
  document.removeEventListener("mouseover", onMouseOver, true);
  document.removeEventListener("mouseout", onMouseOut, true);
  document.removeEventListener("click", onClick, true);
}
addListeners();
chrome.runtime.onMessage.addListener((msg) => {
  console.log("[CS] Received message:", msg);
  if (msg?.type === "deactivate-selection-mode") {
    console.log("[CS] Deactivation signal received. Cleaning up.");
    removeListeners();
    document.querySelectorAll('[style*="2px solid #007bff"]').forEach((el) => {
      el.style.outline = "";
    });
    console.log("[CS] Cleanup complete.");
  }
});
})()
