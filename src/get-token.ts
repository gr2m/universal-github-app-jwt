import jsonwebtoken from "jsonwebtoken";

import { GetTokenOptions, Token } from "./types";

export async function getToken({
  privateKey,
  payload,
}: GetTokenOptions): Promise<Token> {
  return jsonwebtoken.sign(payload, privateKey, {
    algorithm: "RS256",
  });
}
