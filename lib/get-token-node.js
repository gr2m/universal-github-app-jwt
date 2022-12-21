// @ts-check

import jsonwebtoken from "jsonwebtoken";

/**
 * @param {import('../internals').GetTokenOptions} options
 * @returns {Promise<string>}
 */
export async function getToken({ privateKey, payload }) {
  return jsonwebtoken.sign(payload, privateKey, {
    algorithm: "RS256",
  });
}
