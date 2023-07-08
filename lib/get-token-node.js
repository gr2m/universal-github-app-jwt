// @ts-check

import jsonwebtoken from "jsonwebtoken";

/**
 * @param {import('../internals').GetTokenOptions} options
 * @returns {Promise<string>}
 */
export async function getToken({ privateKey, payload }) {
  if (privateKey.includes("-----BEGIN OPENSSH PRIVATE KEY-----")) {
    throw new Error(
      "[universal-github-app-jwt] Private Key is in OpenSSH format, but only PKCS is supported. See https://github.com/gr2m/universal-github-app-jwt#readme"
    );
  }

  return jsonwebtoken.sign(payload, privateKey, {
    algorithm: "RS256",
  });
}
