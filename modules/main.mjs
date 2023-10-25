import { chromium } from 'playwright';
import { getImgPreviewUrl } from './find-image.mjs';
import { getDescription } from './find-description.mjs';
import { getDomainName } from './find-domain.mjs';
import { getFavicon } from './find-favicon.mjs';
import dotenv from 'dotenv';

dotenv.config()

const RESOURCE_EXCLUSTIONS = JSON.parse(process.env.RESOURCE_EXCLUSTIONS);

export async function findURLPreview(urlLink) {
  const browser = await chromium.launch({
    chromiumSandbox: true,
    devtools: false,
  });
  const page = await browser.newPage({
    acceptDownloads: false,
  });
  await page.route('**/*', (route) => {
    return RESOURCE_EXCLUSTIONS.includes(route.request().resourceType())
        ? route.abort()
        : route.continue()
  });
  await page.goto(urlLink);
  const domain = await getDomainName(page, urlLink);
  const image = await getImgPreviewUrl(page, urlLink);
  const favicon = await getFavicon(page, urlLink);
  const title = await page.title();
  const description = await getDescription(page);
  const url = await page.url();
  await browser.close();
  return { domain, image, favicon, title, description, url };
}
