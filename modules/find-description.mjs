import { evaluateDynamicSources } from "./evaluate-sources.mjs";

const evaluations = {
  'meta[name="description"]': 'content',
  'meta[name="twitter:description"]': 'content',
  'meta[property="og:description"]': 'content',
  'meta[itemprop="description"]': 'content',
}

export async function getDescription(page) {

  let description = null;

  try {
    
    // Find the meta description from multiple possible sources.
    description = await evaluateDynamicSources(page, evaluations, description)

    if (!description) {
      description = await page.$eval('p', (p) => p.textContent); 
    } // First <p> tag in the body

  } catch (error) {
    console.error('Error finding description:');
  }
  
  if (description && !description.length > 0) return null;

  return description;
}
