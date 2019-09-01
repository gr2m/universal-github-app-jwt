import { Payload, PrivateKey, Token } from "./types";
import {
  getEncodedMessage,
  getDERfromPEM,
  string2ArrayBuffer,
  base64encode
} from "./utils";

type Options = {
  privateKeyPEM: PrivateKey;
  payload: Payload;
  crypto: Crypto;
};

export const getToken = async ({
  privateKeyPEM,
  payload,
  crypto
}: Options): Promise<Token> => {
  const algorithm = {
    name: "RSASSA-PKCS1-v1_5",
    hash: { name: "SHA-256" }
  };
  const header = { alg: "RS256", typ: "JWT" };

  const privateKeyDER = getDERfromPEM(privateKeyPEM);
  const privateKey = await crypto.subtle.importKey(
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
    privateKey,
    encodedMessageArrBuf
  );

  const encodedSignature = base64encode(signatureArrBuf);

  return `${encodedMessage}.${encodedSignature}`;
};
