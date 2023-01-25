// ==UserScript==
// @name        V2EX - 切换暗色主题
// @description None
// @namespace   http://tampermonkey.net/
// @author      liukewia
// @icon        https://www.v2ex.com/static/favicon.ico
// @version     1.0
// @match       https://v2ex.com/*
// @match       https://www.v2ex.com/*
// @grant       none
// @updated-at  2023/01/25
// ==/UserScript==

// 用户系统是否偏好暗黑
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

const getToggleBtn = () => document.querySelector("a.light-toggle");

const getIsDocumentLoaded = getToggleBtn;

// 当前网页是否为黑
const isDark = () => {
  const wrapper = document.getElementById("Wrapper");
  if (!wrapper) {
    return false;
  }

  return wrapper.classList.contains("Night");
};

const toggleTheme = () => {
  const btn = getToggleBtn();
  if (!btn || !(btn instanceof HTMLElement)) {
    return;
  }
  btn.click();
};

const work = () => {
  if (!getIsDocumentLoaded()) {
    return false;
  }
  if (isDark() && !prefersDark) {
    toggleTheme();
  }
  if (!isDark() && prefersDark) {
    toggleTheme();
  }
  return true;
};

const poll = () =>
  setTimeout(() => {
    const result = work();
    if (!result) {
      poll();
    }
  }, 100);

poll();
