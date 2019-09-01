declare module "@sagi.io/cfw-jwt" {
  type PrivateKey = string;
  type AppId = number;
  type Expiration = number;
  type Token = string;

  type Result = {
    appId: AppId;
    expiration: Expiration;
    token: Token;
  };

  type Payload = {
    iat: number;
    exp: number;
    iss: number;
  };

  type GetTokenOptions = {
    privateKeyPEM: PrivateKey;
    payload: Payload;
    alg: "RS256";
    cryptoImpl: Crypto;
    headerAdditions: {};
  };

  export function getToken(options: GetTokenOptions): Token;
}
