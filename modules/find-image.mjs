import { URL } from 'url';
import { urlImageIsAccessible } from './validate-image.mjs';
import { evaluateDynamicSources } from './evaluate-sources.mjs';

const evaluations = {
  'meta[property="og:image"]': 'content',
  'meta[name="twitter:image"]': 'content',
  'link[rel="image_src"]': 'href',
  'img': 'src'
}

export const getImgPreviewUrl = async (page, url) => {
  let imageSrc = null;

  try {
    // Find the og:image, twitter:image, and link[rel="image_src"] meta tags.
    imageSrc = await evaluateDynamicSources(page, evaluations, imageSrc)
    } catch (error) {
      console.error('Error finding image meta tags:');
    }

  if (imageSrc) {
    // Check if the imageSrc is a valid URL. If not, join it with a base URL.
    if (!imageSrc.length > 0) return null;
    if (!URL.canParse(imageSrc)) {
      // Replace with your base URL
      const combinedImageUrl = new URL(imageSrc, url).toString();
      if (!await urlImageIsAccessible(combinedImageUrl)) return null;
      imageSrc = combinedImageUrl;
    }
  }
  return imageSrc;
}


