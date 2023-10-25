import { evaluateDynamicSources } from "./evaluate-sources.mjs";

const evaluations = {
  'link[rel=canonical]': 'href',
  'meta[property="og:url"]': 'content',
  'meta[itemprop="description"]': 'content',
}

export const getDomainName = async (page, url) => {
    let domainNames = null;

    try {
      // Find the meta description from multiple possible sources using the specified format.
      domainNames = await evaluateDynamicSources(page, evaluations, domainNames);
  
    } catch (error) {
      console.error('Error finding domain name:');
    }
    
    return domainNames ? 
    new URL(domainNames).hostname.replace("www.", "") : 
    new URL(url).hostname.replace("www.", "")
};