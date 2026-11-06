/* SPDX-FileCopyrightText: 2026 Tsogtgerel Gantumur
 * SPDX-License-Identifier: MIT
 * Tool-local footer translations; no application state or network access.
 */
(function () {
  "use strict";
  const notice = document.querySelector("[data-sol-notice]");
  if (!notice) return;
  const labels = {
    en: { source: "Source", license: "MIT License", credits: "Credits" },
    mn: { source: "Эх код", license: "MIT лиценз", credits: "Талархал" }
  };
  function update() {
    const language = document.documentElement.lang.toLowerCase().split("-")[0];
    const text = labels[language] || labels.en;
    notice.querySelectorAll("[data-sol-notice-label]").forEach(function (link) {
      const value = text[link.dataset.solNoticeLabel];
      if (value) link.textContent = value;
    });
  }
  update();
  new MutationObserver(update).observe(document.documentElement, {
    attributes: true, attributeFilter: ["lang"]
  });
})();
