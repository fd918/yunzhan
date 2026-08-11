(() => {
  "use strict";

  const ACCESS_STORAGE_KEY = "yunzhan-knowledge-access-v1";
  const PASSWORD_HASH = "5a21aed2d606dccfba873ffb9bd90144f76925c3cc9135e4387a8fdbe2c7a5d3";
  const currentScriptUrl = document.currentScript?.src ?? new URL("access-gate.js", window.location.href).href;
  const logoUrl = new URL("yunzhan-logo.png", currentScriptUrl).href;

  document.documentElement.classList.add("yz-access-pending");

  const styles = document.createElement("style");
  styles.dataset.yzAccessGate = "true";
  styles.textContent = `
    html.yz-access-pending,
    html.yz-access-pending body {
      min-height: 100%;
      overflow: hidden !important;
    }

    html.yz-access-pending body > :not(#yz-access-gate) {
      visibility: hidden !important;
    }

    #yz-access-gate,
    #yz-access-gate * {
      box-sizing: border-box;
    }

    #yz-access-gate {
      --yz-access-primary: #2f68ff;
      --yz-access-primary-hover: #2459dd;
      --yz-access-text: #172033;
      --yz-access-muted: #667085;
      --yz-access-border: #d9e2f2;
      --yz-access-error: #b42318;
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      display: grid;
      place-items: center;
      min-height: 100dvh;
      overflow-y: auto;
      padding: max(24px, env(safe-area-inset-top)) 20px max(24px, env(safe-area-inset-bottom));
      color: var(--yz-access-text);
      background:
        radial-gradient(circle at 15% 12%, rgba(47, 104, 255, 0.13), transparent 31%),
        radial-gradient(circle at 88% 88%, rgba(36, 169, 116, 0.1), transparent 30%),
        #f5f8fd;
      font-family: "Microsoft YaHei", "PingFang SC", "Noto Sans SC", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .yz-access-card {
      width: min(100%, 440px);
      padding: 36px 36px 32px;
      border: 1px solid rgba(217, 226, 242, 0.92);
      border-radius: 22px;
      background: rgba(255, 255, 255, 0.97);
      box-shadow: 0 24px 70px rgba(23, 61, 122, 0.14);
    }

    .yz-access-logo {
      display: block;
      width: 164px;
      max-width: 62%;
      height: auto;
      aspect-ratio: 2749 / 789;
      object-fit: contain;
      margin: 0 auto 28px;
    }

    .yz-access-eyebrow {
      margin: 0 0 8px;
      color: var(--yz-access-primary);
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-align: center;
    }

    .yz-access-title {
      margin: 0;
      font-size: clamp(24px, 6vw, 30px);
      line-height: 1.3;
      text-align: center;
    }

    .yz-access-description {
      margin: 12px auto 28px;
      color: var(--yz-access-muted);
      font-size: 15px;
      line-height: 1.7;
      text-align: center;
    }

    .yz-access-label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 700;
    }

    .yz-access-input-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      min-height: 48px;
      border: 1px solid var(--yz-access-border);
      border-radius: 12px;
      background: #fff;
      transition: border-color 180ms ease, box-shadow 180ms ease;
    }

    .yz-access-input-row:focus-within {
      border-color: var(--yz-access-primary);
      box-shadow: 0 0 0 4px rgba(47, 104, 255, 0.13);
    }

    .yz-access-input {
      width: 100%;
      min-width: 0;
      min-height: 46px;
      padding: 11px 14px;
      border: 0;
      border-radius: 11px 0 0 11px;
      outline: 0;
      color: var(--yz-access-text);
      background: transparent;
      font: inherit;
      font-size: 16px;
    }

    .yz-access-toggle {
      min-width: 64px;
      min-height: 46px;
      padding: 0 14px;
      border: 0;
      border-left: 1px solid var(--yz-access-border);
      border-radius: 0 11px 11px 0;
      color: #42526a;
      background: #f8fafc;
      font: inherit;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      touch-action: manipulation;
    }

    .yz-access-toggle:hover {
      background: #eef4ff;
    }

    .yz-access-toggle:focus-visible,
    .yz-access-submit:focus-visible {
      outline: 3px solid rgba(47, 104, 255, 0.35);
      outline-offset: 3px;
    }

    .yz-access-error {
      min-height: 22px;
      margin: 8px 0 0;
      color: var(--yz-access-error);
      font-size: 13px;
      line-height: 1.6;
    }

    .yz-access-submit {
      width: 100%;
      min-height: 48px;
      margin-top: 14px;
      padding: 11px 18px;
      border: 0;
      border-radius: 12px;
      color: #fff;
      background: var(--yz-access-primary);
      box-shadow: 0 8px 20px rgba(47, 104, 255, 0.22);
      font: inherit;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      touch-action: manipulation;
      transition: background-color 180ms ease, box-shadow 180ms ease, opacity 180ms ease;
    }

    .yz-access-submit:hover:not(:disabled) {
      background: var(--yz-access-primary-hover);
      box-shadow: 0 10px 24px rgba(47, 104, 255, 0.28);
    }

    .yz-access-submit:disabled {
      cursor: wait;
      opacity: 0.62;
    }

    .yz-access-note {
      margin: 18px 0 0;
      color: var(--yz-access-muted);
      font-size: 12px;
      line-height: 1.6;
      text-align: center;
    }

    @media (max-width: 520px) {
      #yz-access-gate {
        place-items: start center;
        padding-inline: 16px;
      }

      .yz-access-card {
        margin-top: 5vh;
        padding: 28px 20px 24px;
        border-radius: 18px;
      }

      .yz-access-logo {
        margin-bottom: 24px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .yz-access-input-row,
      .yz-access-submit {
        transition: none;
      }
    }
  `;
  document.head.append(styles);

  function hasAccess() {
    try {
      return window.sessionStorage.getItem(ACCESS_STORAGE_KEY) === "granted";
    } catch {
      return false;
    }
  }

  function grantAccess() {
    try {
      window.sessionStorage.setItem(ACCESS_STORAGE_KEY, "granted");
    } catch {
      // 浏览器禁用会话存储时，本次页面仍可正常放行。
    }
  }

  function revealPage() {
    document.getElementById("yz-access-gate")?.remove();
    document.documentElement.classList.remove("yz-access-pending");
  }

  async function hashPassword(value) {
    if (!window.crypto?.subtle || !window.TextEncoder) {
      throw new Error("当前浏览器不支持安全校验，请升级浏览器后重试。");
    }

    const bytes = new TextEncoder().encode(value);
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  async function validatePassword(value) {
    return (await hashPassword(value)) === PASSWORD_HASH;
  }

  window.YunzhanAccessGate = Object.freeze({
    grantAccess,
    hasAccess,
    validatePassword,
  });

  function mountGate() {
    if (hasAccess()) {
      revealPage();
      return;
    }

    const gate = document.createElement("div");
    gate.id = "yz-access-gate";
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-modal", "true");
    gate.setAttribute("aria-labelledby", "yz-access-title");
    gate.innerHTML = `
      <main class="yz-access-card">
        <img class="yz-access-logo" src="${logoUrl}" width="2749" height="789" alt="云瞻" />
        <p class="yz-access-eyebrow">内部工作知识中心</p>
        <h1 class="yz-access-title" id="yz-access-title">访问云瞻知识库</h1>
        <p class="yz-access-description">请输入当前访问密码。验证通过后，本标签页内无需重复输入。</p>
        <form id="yz-access-form" novalidate>
          <label class="yz-access-label" for="yz-access-password">访问密码</label>
          <div class="yz-access-input-row">
            <input
              class="yz-access-input"
              id="yz-access-password"
              name="password"
              type="password"
              autocomplete="current-password"
              autocapitalize="off"
              spellcheck="false"
              required
              aria-describedby="yz-access-error"
            />
            <button class="yz-access-toggle" id="yz-access-toggle" type="button" aria-controls="yz-access-password" aria-pressed="false">显示</button>
          </div>
          <p class="yz-access-error" id="yz-access-error" role="alert" aria-live="polite"></p>
          <button class="yz-access-submit" id="yz-access-submit" type="submit">进入知识库</button>
        </form>
        <p class="yz-access-note">临时共享密码仅用于日常访问门槛，站点仍不得录入敏感信息。</p>
      </main>
    `;

    document.body.prepend(gate);

    const form = gate.querySelector("#yz-access-form");
    const passwordInput = gate.querySelector("#yz-access-password");
    const toggleButton = gate.querySelector("#yz-access-toggle");
    const submitButton = gate.querySelector("#yz-access-submit");
    const errorMessage = gate.querySelector("#yz-access-error");

    toggleButton.addEventListener("click", () => {
      const shouldShow = passwordInput.type === "password";
      passwordInput.type = shouldShow ? "text" : "password";
      toggleButton.textContent = shouldShow ? "隐藏" : "显示";
      toggleButton.setAttribute("aria-pressed", String(shouldShow));
      passwordInput.focus();
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      errorMessage.textContent = "";

      if (!passwordInput.value) {
        errorMessage.textContent = "请输入访问密码。";
        passwordInput.focus();
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = "正在验证…";

      try {
        const isValid = await validatePassword(passwordInput.value);
        if (!isValid) {
          errorMessage.textContent = "密码不正确，请重新输入。";
          passwordInput.select();
          return;
        }

        grantAccess();
        passwordInput.value = "";
        revealPage();
      } catch (error) {
        errorMessage.textContent = error instanceof Error ? error.message : "验证失败，请刷新页面后重试。";
        passwordInput.focus();
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "进入知识库";
      }
    });

    window.requestAnimationFrame(() => passwordInput.focus());
  }

  function startGate() {
    const reactGate = document.querySelector('[data-yz-react-gate="true"]');
    if (reactGate) {
      if (hasAccess()) {
        reactGate.hidden = true;
        document.documentElement.classList.remove("yz-access-pending");
      }
      return;
    }

    mountGate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startGate, { once: true });
  } else {
    startGate();
  }
})();
