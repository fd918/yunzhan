(() => {
  "use strict";

  const EDITOR_ID = "yz-knowledge-editor";
  const STORAGE_PREFIX = "yunzhan-knowledge-draft-v1:";
  const EXCLUDED_SELECTOR = [
    "[data-pagefind-ignore]",
    "script",
    "style",
    "link",
    "meta",
    ".page-brand",
    ".back-top",
    ".knowledge-back-top",
    `#${EDITOR_ID}`,
  ].join(",");

  let editing = false;
  let dirty = false;
  let savedRange = null;
  let roots = [];

  function storageKey() {
    return `${STORAGE_PREFIX}${window.location.pathname}`;
  }

  function resolveEditableRoots() {
    const explicitRoots = Array.from(document.querySelectorAll("[data-yz-editor-root]"));
    if (explicitRoots.length > 0) return explicitRoots;

    const main = document.querySelector("main");
    if (main) return [main];

    return Array.from(document.body.children).filter(
      (element) => !element.matches(EXCLUDED_SELECTOR),
    );
  }

  function getDraft() {
    try {
      const value = window.localStorage.getItem(storageKey());
      if (!value) return null;
      const draft = JSON.parse(value);
      if (draft?.version !== 1 || !Array.isArray(draft.roots)) return null;
      return draft;
    } catch {
      return null;
    }
  }

  function restoreDraft() {
    const draft = getDraft();
    if (!draft) return false;

    draft.roots.forEach((html, index) => {
      if (roots[index] && typeof html === "string") roots[index].innerHTML = html;
    });
    return true;
  }

  function saveDraft() {
    const draft = {
      version: 1,
      path: window.location.pathname,
      title: document.title,
      savedAt: new Date().toISOString(),
      roots: roots.map((root) => root.innerHTML),
    };

    try {
      window.localStorage.setItem(storageKey(), JSON.stringify(draft));
      dirty = false;
      updateStatus("草稿已保存到当前浏览器", "saved");
      return true;
    } catch {
      updateStatus("保存失败：浏览器没有可用的本机存储空间", "error");
      return false;
    }
  }

  function updateStatus(message, state = "neutral") {
    const status = document.querySelector("#yz-editor-status");
    if (!status) return;
    status.textContent = message;
    status.dataset.state = state;
  }

  function markDirty() {
    dirty = true;
    updateStatus("有尚未保存的修改", "dirty");
  }

  function selectionBelongsToEditableRoot(selection) {
    if (!selection || selection.rangeCount === 0) return false;
    const node = selection.anchorNode;
    const element = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement;
    return Boolean(element && roots.some((root) => root.contains(element)));
  }

  function rememberSelection() {
    const selection = window.getSelection();
    if (!editing || !selectionBelongsToEditableRoot(selection)) return;
    savedRange = selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null;
  }

  function restoreSelection() {
    if (!savedRange) return false;
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(savedRange);
    return true;
  }

  function applyCommand(command, value) {
    if (!editing || !restoreSelection()) {
      updateStatus("请先选中要调整的文字", "error");
      return;
    }

    document.execCommand("styleWithCSS", false, command !== "bold");
    const applied = document.execCommand(command, false, value ?? null);
    if (!applied && command === "hiliteColor") {
      document.execCommand("backColor", false, value);
    }
    rememberSelection();
    markDirty();
  }

  function setEditing(nextEditing) {
    editing = nextEditing;
    roots.forEach((root) => {
      if (editing) {
        root.setAttribute("contenteditable", "true");
        root.setAttribute("spellcheck", "true");
        root.classList.add("yz-editor-editable-root");
        root.querySelectorAll(EXCLUDED_SELECTOR).forEach((element) => {
          element.setAttribute("contenteditable", "false");
        });
      } else {
        root.removeAttribute("contenteditable");
        root.removeAttribute("spellcheck");
        root.classList.remove("yz-editor-editable-root");
        root.querySelectorAll(EXCLUDED_SELECTOR).forEach((element) => {
          element.removeAttribute("contenteditable");
        });
      }
    });

    const panel = document.querySelector("#yz-editor-panel");
    const toggle = document.querySelector("#yz-editor-toggle");
    if (panel) panel.hidden = !editing;
    if (toggle) {
      toggle.textContent = editing ? "退出编辑" : "编辑内容";
      toggle.setAttribute("aria-expanded", String(editing));
    }

    document.documentElement.classList.toggle("yz-editor-active", editing);
    if (editing) {
      updateStatus(dirty ? "有尚未保存的修改" : "可直接点击正文修改，或选中文字设置格式", dirty ? "dirty" : "neutral");
      roots[0]?.focus({ preventScroll: true });
    }
  }

  function cleanCloneForExport(clone) {
    clone.querySelector(`#${EDITOR_ID}`)?.remove();
    clone.querySelector("[data-yz-editor-style]")?.remove();
    clone.classList.remove("yz-editor-active");
    clone.querySelectorAll(".yz-editor-editable-root").forEach((element) => {
      element.classList.remove("yz-editor-editable-root");
      element.removeAttribute("contenteditable");
      element.removeAttribute("spellcheck");
    });
    clone.querySelectorAll("[contenteditable]").forEach((element) => {
      element.removeAttribute("contenteditable");
    });
  }

  function exportHtml() {
    if (dirty && !saveDraft()) return;

    const clone = document.documentElement.cloneNode(true);
    cleanCloneForExport(clone);
    const html = `<!DOCTYPE html>\n${clone.outerHTML}`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const sourceName = window.location.pathname.split("/").filter(Boolean).pop() || "knowledge-page.html";
    const fileName = sourceName.endsWith(".html")
      ? sourceName.replace(/\.html$/i, "-修改稿.html")
      : `${sourceName}-修改稿.html`;
    link.href = url;
    link.download = fileName;
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    updateStatus("修改稿已下载；正式发布仍需更新知识库源码", "saved");
  }

  function resetDraft() {
    if (!getDraft()) {
      updateStatus("当前页面没有已保存的本机草稿", "neutral");
      return;
    }
    if (!window.confirm("确定删除本机草稿并恢复网站正式版本吗？此操作无法撤销。")) return;

    window.localStorage.removeItem(storageKey());
    window.location.reload();
  }

  function mountStyles() {
    const style = document.createElement("style");
    style.dataset.yzEditorStyle = "true";
    style.textContent = `
      #${EDITOR_ID}, #${EDITOR_ID} * { box-sizing: border-box; }
      #${EDITOR_ID} {
        --yz-editor-primary: #2459dd;
        --yz-editor-text: #172033;
        --yz-editor-muted: #667085;
        --yz-editor-border: #d8e1ee;
        position: fixed;
        left: 18px;
        bottom: max(18px, env(safe-area-inset-bottom));
        z-index: 2147483000;
        display: flex;
        max-width: min(720px, calc(100vw - 36px));
        align-items: flex-end;
        gap: 8px;
        color: var(--yz-editor-text);
        font-family: "Microsoft YaHei", "PingFang SC", "Noto Sans SC", system-ui, sans-serif;
      }
      .yz-editor-toggle,
      .yz-editor-button {
        min-height: 42px;
        border: 1px solid var(--yz-editor-border);
        border-radius: 9px;
        background: #fff;
        color: #334155;
        box-shadow: 0 6px 20px rgba(15, 23, 42, 0.12);
        font: inherit;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        touch-action: manipulation;
      }
      .yz-editor-toggle { min-width: 92px; padding: 9px 14px; color: #fff; background: var(--yz-editor-primary); border-color: var(--yz-editor-primary); }
      .yz-editor-panel {
        width: min(590px, calc(100vw - 136px));
        padding: 12px;
        border: 1px solid var(--yz-editor-border);
        border-radius: 13px;
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 14px 38px rgba(15, 23, 42, 0.18);
      }
      .yz-editor-panel[hidden] { display: none; }
      .yz-editor-status { margin: 0 0 9px; color: var(--yz-editor-muted); font-size: 12px; line-height: 1.5; }
      .yz-editor-status[data-state="dirty"] { color: #985b0b; }
      .yz-editor-status[data-state="saved"] { color: #176b4a; }
      .yz-editor-status[data-state="error"] { color: #b42318; }
      .yz-editor-actions { display: flex; flex-wrap: wrap; gap: 7px; }
      .yz-editor-button { min-width: 42px; padding: 7px 10px; box-shadow: none; }
      .yz-editor-button:hover { border-color: #93add5; background: #f3f7fd; }
      .yz-editor-button.primary { color: #fff; background: var(--yz-editor-primary); border-color: var(--yz-editor-primary); }
      .yz-editor-button.danger { color: #9f2d25; }
      .yz-editor-mark { width: 18px; height: 18px; border: 1px solid rgba(15, 23, 42, 0.18); border-radius: 4px; }
      .yz-editor-button mark { padding: 1px 4px; border-radius: 3px; color: inherit; }
      .yz-editor-note { margin: 9px 0 0; color: #7b8798; font-size: 11px; line-height: 1.5; }
      .yz-editor-editable-root { outline: 2px dashed rgba(36, 89, 221, 0.35); outline-offset: 6px; }
      .yz-editor-editable-root:focus { outline-color: rgba(36, 89, 221, 0.8); }
      html.yz-editor-active { scroll-padding-bottom: 150px; }
      #${EDITOR_ID} button:focus-visible { outline: 3px solid rgba(47, 104, 255, 0.32); outline-offset: 2px; }
      @media (max-width: 700px) {
        #${EDITOR_ID} { right: 10px; bottom: max(10px, env(safe-area-inset-bottom)); left: 10px; max-width: none; flex-direction: column-reverse; align-items: stretch; }
        .yz-editor-toggle { align-self: flex-start; }
        .yz-editor-panel { width: 100%; max-height: 48vh; overflow-y: auto; }
        .yz-editor-button { min-height: 44px; }
      }
      @media (prefers-reduced-motion: reduce) {
        #${EDITOR_ID} * { scroll-behavior: auto !important; transition: none !important; }
      }
      @media print { #${EDITOR_ID} { display: none !important; } }
    `;
    document.head.append(style);
  }

  function mountEditor(draftRestored) {
    const editor = document.createElement("div");
    editor.id = EDITOR_ID;
    editor.setAttribute("contenteditable", "false");
    editor.setAttribute("data-pagefind-ignore", "true");
    editor.innerHTML = `
      <button class="yz-editor-toggle" id="yz-editor-toggle" type="button" aria-expanded="false" aria-controls="yz-editor-panel">编辑内容</button>
      <section class="yz-editor-panel" id="yz-editor-panel" aria-label="知识内容编辑工具" hidden>
        <p class="yz-editor-status" id="yz-editor-status" aria-live="polite">${draftRestored ? "已载入当前浏览器保存的草稿" : "可直接点击正文修改，或选中文字设置格式"}</p>
        <div class="yz-editor-actions">
          <button class="yz-editor-button" type="button" data-command="bold" title="加粗选中文字"><strong>加粗</strong></button>
          <button class="yz-editor-button" type="button" data-command="hiliteColor" data-value="#fff1a8" title="黄色标记"><mark style="background:#fff1a8">黄色</mark></button>
          <button class="yz-editor-button" type="button" data-command="hiliteColor" data-value="#ffd5d2" title="红色标记"><mark style="background:#ffd5d2">红色</mark></button>
          <button class="yz-editor-button" type="button" data-command="hiliteColor" data-value="#cceedd" title="绿色标记"><mark style="background:#cceedd">绿色</mark></button>
          <button class="yz-editor-button" type="button" data-command="removeFormat" title="清除选中文字的格式">清除格式</button>
          <button class="yz-editor-button" type="button" data-command="undo" title="撤销上一步">撤销</button>
          <button class="yz-editor-button primary" id="yz-editor-save" type="button">保存草稿</button>
          <button class="yz-editor-button" id="yz-editor-export" type="button">导出修改稿</button>
          <button class="yz-editor-button danger" id="yz-editor-reset" type="button">恢复正式版</button>
        </div>
        <p class="yz-editor-note">草稿只保存在当前浏览器，不会自动修改其他人的页面。正式发布请使用“导出修改稿”后更新知识库源码。</p>
      </section>
    `;
    document.body.append(editor);

    editor.querySelector("#yz-editor-toggle").addEventListener("click", () => setEditing(!editing));
    editor.querySelector("#yz-editor-save").addEventListener("click", saveDraft);
    editor.querySelector("#yz-editor-export").addEventListener("click", exportHtml);
    editor.querySelector("#yz-editor-reset").addEventListener("click", resetDraft);
    editor.querySelectorAll("[data-command]").forEach((button) => {
      button.addEventListener("mousedown", (event) => event.preventDefault());
      button.addEventListener("click", () => applyCommand(button.dataset.command, button.dataset.value));
    });
  }

  function startEditor() {
    if (document.getElementById(EDITOR_ID)) return;
    roots = resolveEditableRoots();
    if (roots.length === 0) return;

    const draftRestored = restoreDraft();
    mountStyles();
    mountEditor(draftRestored);

    document.addEventListener("selectionchange", rememberSelection);
    document.addEventListener("input", (event) => {
      const target = event.target;
      if (editing && target instanceof Node && roots.some((root) => root.contains(target))) markDirty();
    });
    document.addEventListener("paste", (event) => {
      if (!editing || !selectionBelongsToEditableRoot(window.getSelection())) return;
      event.preventDefault();
      document.execCommand("insertText", false, event.clipboardData?.getData("text/plain") ?? "");
    });
    document.addEventListener("keydown", (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        saveDraft();
      } else if (event.key === "Escape" && editing) {
        setEditing(false);
      }
    });
    window.addEventListener("beforeunload", (event) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startEditor, { once: true });
  } else {
    startEditor();
  }
})();
