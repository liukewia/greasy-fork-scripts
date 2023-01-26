// ==UserScript==
// @name        V2EX - 切换暗色主题
// @description None
// @namespace   http://tampermonkey.net/
// @author      liukewia
// @icon        https://www.v2ex.com/static/favicon.ico
// @version     1.0.1
// @match       https://v2ex.com/*
// @match       https://www.v2ex.com/*
// @grant       none
// @updated-at  2023/01/26
// ==/UserScript==

(() => {
  "use strict";

  if (!window.matchMedia) {
    console.warn("不支持 matchMedia API");
    return;
  }

  const toggleBtn = document.querySelector(".light-toggle");

  if (!toggleBtn) {
    console.warn("找不到 toggle btn");
    return;
  }

  const toggleLink = toggleBtn.getAttribute("href");
  if (!toggleLink) {
    console.warn("找不到 toggle link");
    return;
  }

  const mediaQueryLight = window.matchMedia("(prefers-color-scheme: light)");
  const isLightPreferred = mediaQueryLight.matches;

  // 用户系统是否偏好暗黑
  const mediaQueryDark = window.matchMedia("(prefers-color-scheme: dark)");

  const isDarkPreferred = mediaQueryDark.matches;

  // 当前网页是否为黑
  const isDark = (() => {
    const wrapper = document.getElementById("Wrapper");
    if (!wrapper) {
      return false;
    }

    return wrapper.classList.contains("Night");
  })();

  const toggle = () => {
    window.location.replace(toggleLink);
  };

  if (isLightPreferred && isDark) {
    toggle();
  }

  mediaQueryLight.addEventListener("change", () => {
    if (isDark) {
      toggle();
    }
  });

  if (isDarkPreferred && !isDark) {
    toggle();
  }

  mediaQueryDark.addEventListener("change", () => {
    if (!isDark) {
      toggle();
    }
  });
})();
