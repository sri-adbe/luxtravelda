/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-destinations.js
  var import_destinations_exports = {};
  __export(import_destinations_exports, {
    default: () => import_destinations_default
  });

  // tools/importer/parsers/hero-overlay.js
  function parse(element, { document: document2 }) {
    const cells = [];
    const bg = [...element.children].find((el) => el.tagName === "IMG") || element.querySelector("img.hero-video-bg, img.amalfi-hero-bg");
    if (bg) {
      const img = document2.createElement("img");
      img.src = bg.getAttribute("src");
      img.alt = bg.getAttribute("alt") || "";
      cells.push([img]);
    }
    const root = element.querySelector(".hero-video-content, .amalfi-hero-content") || element;
    const content = [];
    const eyebrow = root.querySelector(".amalfi-eyebrow");
    if (eyebrow) {
      const t = (eyebrow.querySelector(".amalfi-eyebrow-text") || eyebrow).textContent.replace(/\s+/g, " ").trim();
      if (t) {
        const p = document2.createElement("p");
        p.textContent = t;
        content.push(p);
      }
    }
    const heading = root.querySelector("h1, h2");
    if (heading) {
      const h = document2.createElement(heading.tagName.toLowerCase());
      h.textContent = heading.textContent.trim();
      content.push(h);
    }
    const sub = root.querySelector("p.hero-video-sub, p.amalfi-hero-sub") || [...root.querySelectorAll("p")].find((p) => !p.closest(".amalfi-eyebrow") && p.textContent.trim());
    if (sub && sub.textContent.trim()) {
      const p = document2.createElement("p");
      p.textContent = sub.textContent.trim();
      content.push(p);
    }
    const cta = root.querySelector("button, a");
    if (cta && cta.textContent.trim()) {
      const p = document2.createElement("p");
      const a = document2.createElement("a");
      a.href = cta.getAttribute("href") || "#contact";
      a.textContent = cta.textContent.replace(/\s+/g, " ").trim();
      p.append(a);
      content.push(p);
    }
    cells.push([content]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-overlay", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-media.js
  function parse2(element, { document: document2 }) {
    const imgSrc = element.querySelector("img.amalfi-intro-img") || element.querySelector(".amalfi-intro-img-wrap img");
    const textSrc = element.querySelector(".amalfi-intro-text") || [...element.children].find((el) => el.querySelector("h1, h2, h3")) || element;
    const text = [];
    const eyebrow = textSrc.querySelector(".amalfi-eyebrow");
    if (eyebrow) {
      const t = (eyebrow.querySelector(".amalfi-eyebrow-text") || eyebrow).textContent.replace(/\s+/g, " ").trim();
      if (t) {
        const p = document2.createElement("p");
        p.textContent = t;
        text.push(p);
      }
    }
    const heading = textSrc.querySelector("h1, h2, h3");
    if (heading) {
      const h = document2.createElement(heading.tagName.toLowerCase());
      h.textContent = heading.textContent.replace(/\s+/g, " ").trim();
      text.push(h);
    }
    [...textSrc.querySelectorAll("p")].filter((p) => !p.classList.contains("amalfi-eyebrow") && !p.closest(".amalfi-eyebrow") && !p.closest(".amalfi-rule-wrap") && p.textContent.trim()).forEach((src) => {
      const p = document2.createElement("p");
      p.textContent = src.textContent.replace(/\s+/g, " ").trim();
      text.push(p);
    });
    let imageCell = "";
    if (imgSrc) {
      const img = document2.createElement("img");
      img.src = imgSrc.getAttribute("src");
      img.alt = imgSrc.getAttribute("alt") || "";
      imageCell = img;
    }
    const cells = [[text, imageCell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-media", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-intro.js
  function parse3(element, { document: document2 }) {
    const children = [...element.children];
    const mainSrc = children.find((el) => el.tagName === "DIV" && el.querySelector("h1, h2, h3"));
    const asideSrc = children.filter((el) => el !== mainSrc && el.textContent.trim());
    const main = [];
    if (mainSrc) {
      const eyebrow = mainSrc.querySelector(".eyebrow, .amalfi-eyebrow");
      if (eyebrow && eyebrow.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = eyebrow.textContent.replace(/\s+/g, " ").trim();
        main.push(p);
      }
      const heading = mainSrc.querySelector("h1, h2, h3");
      if (heading) {
        const h = document2.createElement(heading.tagName.toLowerCase());
        h.textContent = heading.textContent.trim();
        main.push(h);
      }
    }
    const aside = [];
    asideSrc.forEach((el) => {
      const p = document2.createElement("p");
      p.textContent = el.textContent.replace(/\s+/g, " ").trim();
      aside.push(p);
    });
    const cells = [[main, aside.length ? aside : ""]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-intro", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-numbered.js
  function parse4(element, { document: document2 }) {
    const cells = [];
    [...element.children].filter((el) => el.tagName === "ARTICLE").forEach((card) => {
      const content = [];
      const num = card.querySelector("b, strong");
      if (num && num.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = num.textContent.trim();
        content.push(p);
      }
      const heading = card.querySelector("h1, h2, h3, h4") || card.querySelector(".amalfi-card-title");
      if (heading && heading.textContent.trim()) {
        const tag = /^H[1-4]$/.test(heading.tagName) ? heading.tagName.toLowerCase() : "h3";
        const h = document2.createElement(tag);
        h.textContent = heading.textContent.trim();
        content.push(h);
      }
      [...card.children].filter((el) => el.tagName === "P" && el.textContent.trim()).forEach((desc) => {
        const p = document2.createElement("p");
        p.textContent = desc.textContent.trim();
        content.push(p);
      });
      const link = card.querySelector("a[href], button");
      if (link) {
        const p = document2.createElement("p");
        const a = document2.createElement("a");
        a.href = link.getAttribute("href") || "#contact";
        a.textContent = link.textContent.trim() || "\u2197";
        p.append(a);
        content.push(p);
      }
      cells.push([content]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-numbered", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-landscape.js
  function parse5(element, { document: document2 }) {
    const cells = [];
    [...element.children].filter((el) => el.classList.contains("destination") || el.classList.contains("amalfi-acc-card") || el.tagName === "ARTICLE").forEach((card) => {
      const srcImg = card.querySelector("img");
      let imageCell = "";
      if (srcImg) {
        const img = document2.createElement("img");
        img.src = srcImg.getAttribute("src");
        img.alt = srcImg.getAttribute("alt") || "";
        imageCell = img;
      }
      const href = card.tagName === "A" ? card.getAttribute("href") : null;
      const body = [];
      const place = card.querySelector("p.place");
      if (place && place.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = place.textContent.trim();
        body.push(p);
      }
      const heading = card.querySelector("h1, h2, h3, h4");
      if (heading) {
        const h = document2.createElement(heading.tagName.toLowerCase());
        const title = heading.textContent.trim();
        if (href) {
          const a = document2.createElement("a");
          a.href = href;
          a.textContent = title;
          h.append(a);
        } else {
          h.textContent = title;
        }
        body.push(h);
      }
      [...card.children].filter((el) => el.tagName === "P" && !el.classList.contains("place") && el.textContent.trim()).forEach((desc) => {
        const p = document2.createElement("p");
        p.textContent = desc.textContent.trim();
        body.push(p);
      });
      cells.push([imageCell, body]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-landscape", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-panel.js
  function parse6(element, { document: document2 }) {
    let cols = [...element.querySelectorAll(":scope > .amalfi-flex-col")];
    if (!cols.length) {
      cols = [...element.children].filter((el) => el.tagName === "DIV" && el.textContent.trim());
    }
    const row = cols.map((col) => {
      const content = [];
      [...col.querySelectorAll("h1, h2, h3, h4, h5, h6, p")].forEach((src) => {
        const t = src.textContent.replace(/\s+/g, " ").trim();
        if (!t) return;
        const el = document2.createElement(src.tagName.toLowerCase());
        el.textContent = t;
        content.push(el);
      });
      return content.length ? content : "";
    });
    const cells = [row.length ? row : [""]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-panel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse7(element, { document: document2 }) {
    const cells = [];
    let wraps = [...element.querySelectorAll(":scope > .amalfi-gallery-img-wrap")];
    if (!wraps.length) wraps = [...element.children];
    wraps.forEach((wrap) => {
      const srcImg = wrap.tagName === "IMG" ? wrap : wrap.querySelector("img");
      if (!srcImg || !srcImg.getAttribute("src")) return;
      const img = document2.createElement("img");
      img.src = srcImg.getAttribute("src");
      img.alt = srcImg.getAttribute("alt") || "";
      cells.push([img]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-cta-banner.js
  function parse8(element, { document: document2 }) {
    const cells = [];
    const bg = [...element.children].find((el) => el.tagName === "IMG") || element.querySelector("img.amalfi-cta-bg");
    let bgSrc = bg ? bg.getAttribute("src") : null;
    if (!bgSrc) {
      const style = element.getAttribute("style") || "";
      const urls = [...style.matchAll(/url\(\s*(?:&quot;|["'])?([^"')&]+)(?:&quot;|["'])?\s*\)/g)];
      if (urls.length) bgSrc = urls[urls.length - 1][1];
    }
    if (bgSrc) {
      const img = document2.createElement("img");
      img.src = bgSrc;
      img.alt = bg && bg.getAttribute("alt") || "";
      cells.push([img]);
    }
    const root = [...element.children].find((el) => el.tagName === "DIV" && el.querySelector("h1, h2, h3")) || element;
    const content = [];
    const eyebrow = root.querySelector(".eyebrow, .amalfi-eyebrow");
    const eyebrowText = eyebrow ? (eyebrow.querySelector(".amalfi-eyebrow-text") || eyebrow).textContent.replace(/\s+/g, " ").trim() : "";
    if (eyebrowText) {
      const p = document2.createElement("p");
      p.textContent = eyebrowText;
      content.push(p);
    }
    const heading = root.querySelector("h1, h2, h3");
    if (heading) {
      const h = document2.createElement(heading.tagName.toLowerCase());
      h.textContent = heading.textContent.trim();
      content.push(h);
    }
    const cta = root.querySelector("button, a");
    if (cta && cta.textContent.trim()) {
      const p = document2.createElement("p");
      const a = document2.createElement("a");
      a.href = cta.getAttribute("href") || "#contact";
      a.textContent = cta.textContent.replace(/\s+/g, " ").trim();
      p.append(a);
      content.push(p);
    }
    [...root.querySelectorAll("p")].filter((el) => el !== eyebrow && !el.closest(".eyebrow, .amalfi-eyebrow") && el.textContent.trim()).forEach((note) => {
      const p = document2.createElement("p");
      p.textContent = note.textContent.trim();
      content.push(p);
    });
    cells.push([content]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-cta-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/luxtravelda-cleanup.js
  function transform(hookName, element, payload) {
    if (hookName === "beforeTransform") {
      WebImporter.DOMUtils.remove(element, [
        "header.nav",
        "footer#journal",
        "footer.footer",
        "script",
        "style",
        "noscript",
        "iframe",
        "link"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "img.amalfi-dash",
        ".amalfi-rule-wrap",
        ".amalfi-flex-banner > img",
        ".amalfi-card-header img",
        "article.amalfi-card > img"
      ]);
      const doc = element.ownerDocument || document;
      element.querySelectorAll("div.amalfi-eyebrow").forEach((eyebrow) => {
        const textEl = eyebrow.querySelector(".amalfi-eyebrow-text") || eyebrow;
        const text = textEl.textContent.replace(/\s+/g, " ").trim();
        if (!text) {
          eyebrow.remove();
          return;
        }
        const p = doc.createElement("p");
        p.className = "amalfi-eyebrow";
        p.textContent = text;
        eyebrow.replaceWith(p);
      });
    }
    if (hookName === "afterTransform") {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "nav",
        "script",
        "style",
        "noscript",
        "iframe",
        "link",
        "source"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        [...el.attributes].forEach((attr) => {
          const n = attr.name;
          if (n.startsWith("data-excat-")) return;
          if (n.startsWith("data-") || n.startsWith("on") || n === "tabindex" || n === "aria-hidden") {
            el.removeAttribute(n);
          }
        });
      });
    }
  }

  // tools/importer/transformers/luxtravelda-sections.js
  var SECTION_ATTR = "data-excat-section-id";
  var END_ATTR = "data-excat-section-end";
  function safeQuery(root, sel) {
    try {
      return root.querySelector(sel);
    } catch (e) {
      return null;
    }
  }
  function findStart(root, selectors) {
    for (const sel of selectors) {
      const el = safeQuery(root, sel);
      if (el) return el;
    }
    return null;
  }
  function findEnd(root, selectors, start) {
    let end = start;
    selectors.forEach((sel) => {
      const el = safeQuery(root, sel);
      if (!el || el === end || el.contains(end) || end.contains(el)) return;
      if (end.compareDocumentPosition(el) & 4) end = el;
    });
    return end;
  }
  function transform2(hookName, element, payload) {
    const template = payload && payload.template;
    const sections = template && template.sections || [];
    if (sections.length < 2) return;
    const doc = element.ownerDocument || document;
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const selectors = [].concat(section.selector || []);
        const start = findStart(element, selectors);
        if (!start) continue;
        if (section.style) {
          const end = findEnd(element, selectors, start);
          const endMarker = doc.createElement("div");
          endMarker.setAttribute(END_ATTR, section.id);
          end.after(endMarker);
        }
        if (i > 0 || section.style) {
          const hr = doc.createElement("hr");
          if (section.style) hr.setAttribute(SECTION_ATTR, section.id);
          start.before(hr);
        }
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const hr = element.querySelector(`hr[${SECTION_ATTR}="${section.id}"]`);
        const endMarker = element.querySelector(`[${END_ATTR}="${section.id}"]`);
        const metadata = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        if (endMarker) {
          endMarker.before(metadata);
        } else if (hr) {
          hr.after(metadata);
        } else {
          const fallback = findStart(element, [].concat(section.selector || []));
          if (fallback) fallback.after(metadata);
        }
        if (endMarker) endMarker.remove();
        if (hr) {
          if (i === 0) hr.remove();
          else hr.removeAttribute(SECTION_ATTR);
        }
      }
    }
  }

  // tools/importer/import-destinations.js
  var PAGE_TEMPLATE = {
    "name": "destinations",
    "urls": [
      "https://speak-salsa-30519598.figma.site/destinations/amalfi-coast"
    ],
    "representativeUrl": "https://speak-salsa-30519598.figma.site/destinations/amalfi-coast",
    "description": "Destination detail pages: photo hero, intro with image, experience cards, stay tiles, heritage feature, concierge panel, gallery and closing CTA",
    "blocks": [
      {
        "name": "hero-overlay",
        "instances": [
          "section.amalfi-hero"
        ]
      },
      {
        "name": "columns-media",
        "instances": [
          "section.amalfi-intro"
        ]
      },
      {
        "name": "columns-intro",
        "instances": [
          ".amalfi-section-head"
        ]
      },
      {
        "name": "cards-numbered",
        "instances": [
          ".amalfi-cards-grid"
        ]
      },
      {
        "name": "cards-landscape",
        "instances": [
          ".amalfi-acc-grid"
        ]
      },
      {
        "name": "columns-panel",
        "instances": [
          ".amalfi-flex-banner"
        ]
      },
      {
        "name": "cards-gallery",
        "instances": [
          ".amalfi-gallery-grid"
        ]
      },
      {
        "name": "hero-cta-banner",
        "instances": [
          "section.amalfi-cta-section"
        ]
      }
    ],
    "urlPattern": "/destinations/*",
    "sections": [
      {
        "id": "rc1",
        "name": "Destination hero",
        "selector": [
          "section.amalfi-hero"
        ],
        "style": null,
        "blocks": [
          "hero-overlay"
        ],
        "defaultContent": []
      },
      {
        "id": "rc2",
        "name": "Destination intro",
        "selector": [
          "section.amalfi-intro"
        ],
        "style": null,
        "blocks": [
          "columns-media"
        ],
        "defaultContent": []
      },
      {
        "id": "rc3",
        "name": "Behind the Scenes Access",
        "selector": [
          "section.amalfi-tan:has(> .amalfi-cards-grid)",
          "section.amalfi-tan:not(.amalfi-cultural)"
        ],
        "style": "tan",
        "blocks": [
          "columns-intro",
          "cards-numbered"
        ],
        "defaultContent": []
      },
      {
        "id": "rc4",
        "name": "Thoughtful Luxury Havens",
        "selector": [
          "section.amalfi-section:has(> .amalfi-acc-grid)",
          "#root > div > section.amalfi-section:nth-of-type(4)"
        ],
        "style": null,
        "blocks": [
          "columns-intro",
          "cards-landscape"
        ],
        "defaultContent": []
      },
      {
        "id": "rc5",
        "name": "Local Legacies",
        "selector": [
          "section.amalfi-cultural"
        ],
        "style": "tan",
        "blocks": [],
        "defaultContent": [
          ".amalfi-cultural-img-wrap",
          ".amalfi-cultural .amalfi-intro-text"
        ]
      },
      {
        "id": "rc6",
        "name": "Fluidity to Match Your Pace",
        "selector": [
          "section.amalfi-flex-section"
        ],
        "style": "centered",
        "blocks": [
          "columns-panel"
        ],
        "defaultContent": [
          ".amalfi-flex-header"
        ]
      },
      {
        "id": "rc7",
        "name": "Gallery",
        "selector": [
          "section.amalfi-gallery-section"
        ],
        "style": "centered",
        "blocks": [
          "cards-gallery"
        ],
        "defaultContent": [
          "section.amalfi-gallery-section > p"
        ]
      },
      {
        "id": "rc8",
        "name": "Closing CTA",
        "selector": [
          "section.amalfi-cta-section"
        ],
        "style": null,
        "blocks": [
          "hero-cta-banner"
        ],
        "defaultContent": []
      }
    ]
  };
  var parsers = {
    "hero-overlay": parse,
    "columns-media": parse2,
    "columns-intro": parse3,
    "cards-numbered": parse4,
    "cards-landscape": parse5,
    "columns-panel": parse6,
    "cards-gallery": parse7,
    "hero-cta-banner": parse8
  };
  var transformers = [transform, transform2];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((fn) => {
      try {
        fn(hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    const seen = /* @__PURE__ */ new Set();
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        document2.querySelectorAll(selector).forEach((element) => {
          if (seen.has(element)) return;
          seen.add(element);
          pageBlocks.push({ name: blockDef.name, selector, element });
        });
      });
    });
    return pageBlocks;
  }
  var import_destinations_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (!parser) return;
        try {
          parser(block.element, { document: document2, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      });
      executeTransformers("afterTransform", main, payload);
      main.appendChild(document2.createElement("hr"));
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: { title: document2.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }];
    }
  };
  return __toCommonJS(import_destinations_exports);
})();
