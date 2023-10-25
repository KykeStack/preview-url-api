export const evaluateDynamicSources = async (page, source, target) => {
  for (const selector of Object.keys(source)) {
    try {
      target = await page.$eval(selector, 
        (element, value) => {
        return element.getAttribute(value);
      }, source[selector]);
      if (target) return target;
    } catch (e) {
      continue;
    }
  }
  return target;
}