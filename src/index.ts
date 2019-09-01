import { getToken } from "./get-token";

import { Options, Result } from "./types";

export async function githubAppJwtSign({
  id,
  privateKey,
  crypto
}: Options): Promise<Result> {
  // WebCrypto is falsy in browsers, in which case we want to use the crypto API anyway
  /* istanbul ignore next */
  crypto = crypto || window.crypto;

  // When creating a JSON Web Token, it sets the "issued at time" (iat) to 30s
  // in the past as we have seen people running situations where the GitHub API
  // claimed the iat would be in future. It turned out the clocks on the
  // different machine were not in sync.
  const now = Math.floor(Date.now() / 1000) - 30;
  const expiration = now + 60 * 10; // JWT expiration time (10 minute maximum)

  const payload = {
    iat: now, // Issued at time
    exp: expiration,
    iss: id
  };

  const token = await getToken({
    privateKeyPEM: privateKey,
    payload,
    crypto
  });

  return {
    appId: id,
    expiration,
    token
  };
}
