import { evaluateDynamicSources } from './evaluate-sources.mjs';
import { urlImageIsAccessible } from './validate-image.mjs';

const evaluations = {
  'link[rel=icon]': 'href',
  'link[rel="shortcut icon"]': 'href',
  'link[rel=icon]': 'href',
  'link[rel="apple-touch-icon"],link[rel="apple-touch-icon-precomposed"]': 'href',
}

export async function getFavicon(page, url) {
  const noLinkIcon = `${new URL(url).origin}/favicon.ico`;
  if (await urlImageIsAccessible(noLinkIcon)) {
    return noLinkIcon;
  }

  let favicon = null;

  try {
    // Find the meta description from multiple possible sources.
    favicon = await evaluateDynamicSources(page, evaluations, favicon);
  } catch (error) {
    console.error('Error finding description:');
  }
  
  if (favicon) {
    if (!favicon.length > 0) return null;
    if (!URL.canParse(favicon)) {
      // Replace with your base URL
      const combinedFaviconUrl = new URL(favicon, url).toString();
      if (!await urlImageIsAccessible(combinedFaviconUrl)) return null;
      favicon = combinedFaviconUrl;
    }
  }

  return favicon;
}
