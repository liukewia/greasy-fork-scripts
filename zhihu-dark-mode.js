// ==UserScript==
// @name        知乎 - 切换暗色主题
// @description None
// @namespace   http://tampermonkey.net/
// @author      liukewia
// @icon        https://static.zhihu.com/static/favicon.ico
// @version     1.0
// @match       https://*.zhihu.com/*
// @grant        none
// @run-at      document-startrr
// @updated-at  2022/3/23
// ==/UserScript==

const key = "data-theme";
const light = "light";
const dark = "dark";

const getThemeFromLs = () => localStorage.getItem(key);
const setThemeToLs = (theme) => localStorage.setItem(key, theme);
const htmlEle = document.documentElement;
const getThemeFromPage = () => htmlEle.getAttribute(key);
const applyThemeToPage = (theme) => htmlEle.setAttribute(key, theme);

const fallbackToLightIfEmpty = () => {
  if (!getThemeFromLs()) {
    setThemeToLs(light);
  }
};
fallbackToLightIfEmpty();

const observeConfig = {
  attributeFilter: [key],
  attributeOldValue: true,
};

// 页面加载过程中插件改主题色，可能落回亮色，观察html相应属性并修正
const observer = new MutationObserver((mutationsList, mutationObserver) => {
  mutationsList.forEach((mutation) => {
    if (getThemeFromPage() !== mutation.oldValue) {
      mutationObserver.disconnect();
      applyThemeToPage(mutation.oldValue);
      mutationObserver.observe(htmlEle, observeConfig);
    }
  });
});

const toggleTheme = () => {
  observer.disconnect();
  fallbackToLightIfEmpty();

  const setThemeToLsAndPage = (theme) => {
    setThemeToLs(theme);
    applyThemeToPage(theme);
  };

  if (getThemeFromLs() === light) {
    setThemeToLsAndPage(dark);
  } else if (getThemeFromLs() === dark) {
    setThemeToLsAndPage(light);
  }
  observer.observe(htmlEle, observeConfig);
};

// 页面右下角按钮
window.addEventListener("load", () => {
  if (getThemeFromLs() === dark) {
    applyThemeToPage(dark);
  }
  observer.observe(htmlEle, observeConfig);

  // 参考 https://greasyfork.org/en/scripts/397672-%E7%9F%A5%E4%B9%8E-%E5%BC%BA%E8%A1%8C%E8%AE%BE%E4%B8%BA%E6%9A%97%E8%89%B2%E4%B8%BB%E9%A2%98
  const buttons = document.querySelector(".CornerButtons");
  if (!buttons) return;
  const container = document.createElement("div");
  container.className = "CornerAnimayedFlex";
  const button = document.createElement("button");
  const label = "切换主题";
  const eleInfoMap = {
    "data-tooltip": label,
    "data-tooltip-position": "left",
    "data-tooltip-will-hide-on-click": "true",
    "aria-label": label,
    type: "button",
    class: "Button CornerButton Button--plain",
  };
  Object.keys(eleInfoMap).forEach((key) =>
    button.setAttribute(key, eleInfoMap[key])
  );
  // 图标来自 Google Material Icons
  button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="Zi" fill="currentColor" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-.89 0-1.74-.2-2.5-.55C11.56 16.5 13 14.42 13 12s-1.44-4.5-3.5-5.45C10.26 6.2 11.11 6 12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6z"/></svg>`;

  button.addEventListener("click", toggleTheme);
  container.appendChild(button);
  buttons.insertBefore(container, buttons.firstElementChild);
});

// 最后可选使用babel在线转为es5以求更好兼容
