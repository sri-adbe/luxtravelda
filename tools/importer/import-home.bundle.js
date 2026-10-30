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

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
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

  // tools/importer/parsers/columns-intro.js
  function parse2(element, { document: document2 }) {
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

  // tools/importer/parsers/cards-profile.js
  function parse3(element, { document: document2 }) {
    const cells = [];
    [...element.children].filter((el) => el.tagName === "ARTICLE").forEach((card) => {
      const srcImg = card.querySelector("img");
      let imageCell = "";
      if (srcImg) {
        const img = document2.createElement("img");
        img.src = srcImg.getAttribute("src");
        img.alt = srcImg.getAttribute("alt") || "";
        imageCell = img;
      }
      const bodySrc = [...card.children].find((el) => el.tagName === "DIV") || card;
      const body = [];
      const place = bodySrc.querySelector("p.place");
      if (place && place.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = place.textContent.trim();
        body.push(p);
      }
      const heading = bodySrc.querySelector("h1, h2, h3, h4");
      if (heading) {
        const h = document2.createElement(heading.tagName.toLowerCase());
        h.textContent = heading.textContent.trim();
        body.push(h);
      }
      [...bodySrc.children].filter((el) => el.tagName === "P" && !el.classList.contains("place") && el.textContent.trim()).forEach((bio) => {
        const p = document2.createElement("p");
        p.textContent = bio.textContent.trim();
        body.push(p);
      });
      const cta = bodySrc.querySelector("button, a");
      if (cta && cta.textContent.trim()) {
        const p = document2.createElement("p");
        const a = document2.createElement("a");
        a.href = cta.getAttribute("href") || "#contact";
        a.textContent = cta.textContent.replace(/\s+/g, " ").replace(/\s*→\s*$/, "").trim();
        p.append(a);
        body.push(p);
      }
      cells.push([imageCell, body]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-profile", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-landscape.js
  function parse4(element, { document: document2 }) {
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

  // tools/importer/parsers/cards-numbered.js
  function parse5(element, { document: document2 }) {
    const cells = [];
    [...element.children].filter((el) => el.tagName === "ARTICLE").forEach((card) => {
      const content = [];
      const num = card.querySelector("b, strong");
      if (num && num.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = num.textContent.trim();
        content.push(p);
      }
      const icon = card.querySelector(".amalfi-card-header img");
      if (icon && icon.getAttribute("src")) {
        const p = document2.createElement("p");
        const img = document2.createElement("img");
        img.src = icon.getAttribute("src");
        img.alt = icon.getAttribute("alt") || "";
        p.append(img);
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

  // tools/importer/parsers/quote-card.js
  function parse6(element, { document: document2 }) {
    const cells = [];
    const cite = element.querySelector("cite");
    const quoteText = [...element.childNodes].filter((n) => n !== cite && !(n.nodeType === 1 && n.tagName === "CITE")).map((n) => n.textContent).join(" ").replace(/\s+/g, " ").trim();
    if (quoteText) {
      const p = document2.createElement("p");
      p.textContent = quoteText;
      cells.push([p]);
    }
    const attribution = cite ? cite.textContent.replace(/\s+/g, " ").trim().replace(/^[-–—]\s*/, "") : "";
    if (attribution) {
      const p = document2.createElement("p");
      p.textContent = attribution;
      cells.push([p]);
    }
    const name = element.classList.contains("featured") ? "quote-card (featured)" : "quote-card";
    const block = WebImporter.Blocks.createBlock(document2, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-cta-banner.js
  function parse7(element, { document: document2 }) {
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
  var anchorIds = /* @__PURE__ */ new Map();
  function transform2(hookName, element, payload) {
    const template = payload && payload.template;
    const sections = template && template.sections || [];
    if (sections.length < 2) return;
    const doc = element.ownerDocument || document;
    if (hookName === "beforeTransform") {
      anchorIds.clear();
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const selectors = [].concat(section.selector || []);
        const start = findStart(element, selectors);
        if (!start) continue;
        if (start.id) anchorIds.set(section.id, start.id);
        const needsMeta = section.style || anchorIds.has(section.id);
        if (needsMeta) {
          const end = findEnd(element, selectors, start);
          const endMarker = doc.createElement("div");
          endMarker.setAttribute(END_ATTR, section.id);
          end.after(endMarker);
        }
        if (i > 0 || needsMeta) {
          const hr = doc.createElement("hr");
          if (needsMeta) hr.setAttribute(SECTION_ATTR, section.id);
          start.before(hr);
        }
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const anchorId = anchorIds.get(section.id);
        if (!section.style && !anchorId) continue;
        const hr = element.querySelector(`hr[${SECTION_ATTR}="${section.id}"]`);
        const endMarker = element.querySelector(`[${END_ATTR}="${section.id}"]`);
        const cells = {};
        if (section.style) cells.style = section.style;
        if (anchorId) cells.id = anchorId;
        const metadata = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells
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

  // tools/importer/import-home.js
  var PAGE_TEMPLATE = {
    "name": "home",
    "urls": [
      "https://speak-salsa-30519598.figma.site/"
    ],
    "representativeUrl": "https://speak-salsa-30519598.figma.site/",
    "description": "Homepage: full-bleed hero, curator profiles, destination grid, numbered services, testimonials and closing CTA",
    "blocks": [
      {
        "name": "hero-overlay",
        "instances": [
          "section.hero-video",
          "#top"
        ]
      },
      {
        "name": "columns-intro",
        "instances": [
          ".section-head"
        ]
      },
      {
        "name": "cards-profile",
        "instances": [
          ".curator-grid"
        ]
      },
      {
        "name": "cards-landscape",
        "instances": [
          ".destination-grid"
        ]
      },
      {
        "name": "cards-numbered",
        "instances": [
          ".services-grid"
        ]
      },
      {
        "name": "quote-card",
        "instances": [
          ".quotes > blockquote"
        ]
      },
      {
        "name": "hero-cta-banner",
        "instances": [
          "section.closing",
          "#contact"
        ]
      }
    ],
    "urlPattern": "/",
    "sections": [
      {
        "id": "rc1",
        "name": "Hero",
        "selector": [
          "section.hero-video",
          "#top"
        ],
        "style": null,
        "blocks": [
          "hero-overlay"
        ],
        "defaultContent": []
      },
      {
        "id": "rc2",
        "name": "Curators",
        "selector": [
          "section.curators",
          ".tagline"
        ],
        "style": "tan",
        "blocks": [
          "columns-intro",
          "cards-profile"
        ],
        "defaultContent": [
          ".tagline"
        ]
      },
      {
        "id": "rc4",
        "name": "Destinations",
        "selector": [
          "section.destinations",
          "#destinations"
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
        "name": "Services",
        "selector": [
          "section.services",
          "#services"
        ],
        "style": "tan, centered",
        "blocks": [
          "cards-numbered"
        ],
        "defaultContent": [
          ".center-title"
        ]
      },
      {
        "id": "rc6",
        "name": "Testimonials",
        "selector": [
          "section.testimonials"
        ],
        "style": "quote-row",
        "blocks": [
          "columns-intro",
          "quote-card"
        ],
        "defaultContent": []
      },
      {
        "id": "rc7",
        "name": "Closing CTA",
        "selector": [
          "section.closing",
          "#contact"
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
    "columns-intro": parse2,
    "cards-profile": parse3,
    "cards-landscape": parse4,
    "cards-numbered": parse5,
    "quote-card": parse6,
    "hero-cta-banner": parse7
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
  var import_home_default = {
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
  return __toCommonJS(import_home_exports);
})();
