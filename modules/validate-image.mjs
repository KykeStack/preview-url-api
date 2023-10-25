import util from "util";
import request from "request";
import getUrls from "get-urls";

const BASE64_REGEX = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
const promisifiedRequest = util.promisify(request);

export const urlImageIsAccessible = async (url) => {
  const correctedUrls = getUrls(url);
  if (BASE64_REGEX.test(url)) {
    return true;
  }
  if (correctedUrls.size !== 0) {
    const urlResponse = await promisifiedRequest(correctedUrls.values().next().value);
    const contentType = urlResponse.headers["content-type"];
    return new RegExp("image/*").test(contentType);
  }
};