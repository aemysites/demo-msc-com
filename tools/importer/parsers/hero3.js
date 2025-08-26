/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get the best image from a banner
  function getBannerImage(bannerLink) {
    const imageDiv = bannerLink.querySelector('.msc-image-banner__image');
    if (!imageDiv) return null;
    // Prefer desktop image with src
    let img = imageDiv.querySelector('img.desktop[src]');
    if (!img) {
      img = imageDiv.querySelector('img.mobile[src]');
    }
    if (!img) {
      img = imageDiv.querySelector('img');
    }
    return img || null;
  }

  // Helper: get heading, description from banner
  function getBannerContent(bannerLink) {
    const contentDiv = bannerLink.querySelector('.msc-image-banner__content');
    if (!contentDiv) return [];
    const sections = [];
    // Heading
    const heading = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) sections.push(heading);
    // Description
    const description = contentDiv.querySelector('.msc-section-description, p');
    if (description) sections.push(description);
    return sections;
  }

  // Helper: get CTA link from the main cell
  function getBannerCTA(mainCell) {
    const ctaDiv = mainCell.querySelector('.msc-image-banner__cta');
    if (ctaDiv) {
      const link = ctaDiv.querySelector('a');
      if (link) return link;
    }
    return null;
  }

  // Find the main cell containing the banner
  const mainCell = element.querySelector('.cell.position-relative');
  if (!mainCell) return;

  // Find the banner link that wraps the image & content
  const bannerLink = mainCell.querySelector('.msc-image-banner__link');
  if (!bannerLink) return;

  // Extract image
  const img = getBannerImage(bannerLink);

  // Extract heading/content
  const contentArr = getBannerContent(bannerLink);

  // Extract CTA
  const cta = getBannerCTA(mainCell);

  // Compose row 3 content
  const row3Content = [];
  if (contentArr.length) row3Content.push(...contentArr);
  if (cta) row3Content.push(cta);

  // Table header exactly as example
  const cells = [
    ['Hero (hero3)'],
    [img ? img : ''],
    [row3Content.length ? row3Content : ''],
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
