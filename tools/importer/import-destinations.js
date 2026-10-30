/* eslint-disable */
/* global WebImporter */

import heroOverlayParser from './parsers/hero-overlay.js';
import columnsMediaParser from './parsers/columns-media.js';
import columnsIntroParser from './parsers/columns-intro.js';
import cardsNumberedParser from './parsers/cards-numbered.js';
import cardsLandscapeParser from './parsers/cards-landscape.js';
import columnsPanelParser from './parsers/columns-panel.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import heroCtaBannerParser from './parsers/hero-cta-banner.js';

import cleanupTransformer from './transformers/luxtravelda-cleanup.js';
import sectionsTransformer from './transformers/luxtravelda-sections.js';

const PAGE_TEMPLATE = {
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

const parsers = {
  'hero-overlay': heroOverlayParser,
  'columns-media': columnsMediaParser,
  'columns-intro': columnsIntroParser,
  'cards-numbered': cardsNumberedParser,
  'cards-landscape': cardsLandscapeParser,
  'columns-panel': columnsPanelParser,
  'cards-gallery': cardsGalleryParser,
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
    // page metadata plus the template, so destination pages get body.destination styling
    const meta = WebImporter.Blocks.getMetadata(document) || {};
    meta.template = 'destination';
    main.append(WebImporter.Blocks.getMetadataBlock(document, meta));
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
