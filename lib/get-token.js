// we don't @ts-check here because it chokes crypto which is a global API in modern JS runtime environments

import {
  getEncodedMessage,
  getDERfromPEM,
  string2ArrayBuffer,
  base64encode,
} from "./utils.js";

/**
 * @param {import('../internals').GetTokenOptions} options
 * @returns {Promise<string>}
 */
export async function getToken({ privateKey, payload }) {
  // WebCrypto only supports PKCS#8, unfortunately
  if (/BEGIN RSA PRIVATE KEY/.test(privateKey)) {
    throw new Error(
      "[universal-github-app-jwt] Private Key is in PKCS#1 format, but only PKCS#8 is supported. See https://github.com/gr2m/universal-github-app-jwt#readme"
    );
  }

  const algorithm = {
    name: "RSASSA-PKCS1-v1_5",
    hash: { name: "SHA-256" },
  };

  /** @type {import('../internals').Header} */
  const header = { alg: "RS256", typ: "JWT" };

  const privateKeyDER = getDERfromPEM(privateKey);
  const importedKey = await crypto.subtle.importKey(
    "pkcs8",
    privateKeyDER,
    algorithm,
    false,
    ["sign"]
  );

  const encodedMessage = getEncodedMessage(header, payload);
  const encodedMessageArrBuf = string2ArrayBuffer(encodedMessage);

  const signatureArrBuf = await crypto.subtle.sign(
    algorithm.name,
    importedKey,
    encodedMessageArrBuf
  );

  const encodedSignature = base64encode(signatureArrBuf);

  return `${encodedMessage}.${encodedSignature}`;
}
