/* eslint-disable */
/* global WebImporter */

import heroOverlayParser from './parsers/hero-overlay.js';
import columnsIntroParser from './parsers/columns-intro.js';
import cardsProfileParser from './parsers/cards-profile.js';
import cardsLandscapeParser from './parsers/cards-landscape.js';
import cardsNumberedParser from './parsers/cards-numbered.js';
import quoteCardParser from './parsers/quote-card.js';
import heroCtaBannerParser from './parsers/hero-cta-banner.js';

import cleanupTransformer from './transformers/luxtravelda-cleanup.js';
import sectionsTransformer from './transformers/luxtravelda-sections.js';

const PAGE_TEMPLATE = {
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

const parsers = {
  'hero-overlay': heroOverlayParser,
  'columns-intro': columnsIntroParser,
  'cards-profile': cardsProfileParser,
  'cards-landscape': cardsLandscapeParser,
  'cards-numbered': cardsNumberedParser,
  'quote-card': quoteCardParser,
  'hero-cta-banner': heroCtaBannerParser,
};

const transformers = [cleanupTransformer, sectionsTransformer];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((fn) => {
    try { fn(hookName, element, enhancedPayload); }
    catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const seen = new Set();
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        // several instance selectors can match the same element (e.g. section.hero-video and #top)
        if (seen.has(element)) return;
        seen.add(element);
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    });
  });
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (!parser) return;
      try { parser(block.element, { document, url, params }); }
      catch (e) { console.error(`Failed to parse ${block.name} (${block.selector}):`, e); }
    });

    executeTransformers('afterTransform', main, payload);

    main.appendChild(document.createElement('hr'));
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }];
  },
};
