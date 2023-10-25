import express, { json } from "express";
import dotenv from 'dotenv'
import verifyToken from "./middleware/auth.mjs";
import validUrl from 'valid-url'
import { findURLPreview } from "./modules/main.mjs";

dotenv.config()

// Constants
let urls = process.env.ALLOWED_ORIGIN_URL

// Create http server
const app = express()

if (urls) {
  urls = urls.match(/'([^']+)'/g)
  app.use(cors({ origin: urls.map(url => url.replace(/'/g, '')) }))
}

function isValidURL(url) {
  const urlPattern = new RegExp(`^(https?|ftp):\/\/[^\\s/$.?#].[^\\s]*${validDomain}`);
  return urlPattern.test(url);
}

app.use(json({ limit: "50mb" }));

app.get('/preview:param(*)', verifyToken, async (req, res) => {
  const urlParam = req.query.url;
  const validDomain = validUrl.isHttpUri(urlParam) || validUrl.isHttpsUri(urlParam)

  if (!urlParam || !validDomain || !validUrl.isWebUri(urlParam)) {
    return res.status(400).json({ message: 'Invalid URL provided.' });
  }

  await findURLPreview(urlParam)
  .then((preview) => {
    if (preview) {
      res.status(200).send(preview);
    } else {
      console.log(preview);
      res.status(400).json({ message: 'Invalid URL provided.' })
      ;
    }
  })
  .catch((error) => {
    console.log(error);
    res.status(400).json({ message: 'Invalid URL provided.' })
  });
});

app.get("/welcome", verifyToken, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

// This should be the last route else any after it won't work
app.use("*", (req, res) => {
  res.status(404).json({
    success: "false",
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});


export default app;
