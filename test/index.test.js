// @ts-check

import { describe, test, expect } from "vitest";
import githubAppJwtNode from "../index.js";
import githubAppJwtDefault from "../dist/default.js";

import {
  APP_ID,
  BEARER,
  PRIVATE_KEY_PKCS1,
  PRIVATE_KEY_PKCS8,
  PRIVATEY_KEY_OPENSSH,
} from "./fixtures.js";

["node", "web"].forEach((env) => {
  const githubAppJwt = env === "node" ? githubAppJwtNode : githubAppJwtDefault;
  describe(`githubAppJwt in ${env}`, () => {
    test("README example for app auth with private key in PKCS#8 format", async () => {
      Date.now = () => 0; // Mock current time to 0 for predictable results

      const result = await githubAppJwt({
        id: APP_ID,
        privateKey: PRIVATE_KEY_PKCS8,
      });

      expect(result).toStrictEqual({
        appId: APP_ID,
        expiration: 570,
        token: BEARER,
      });
    });

    test("README example for app auth with private key in PKCS#1 format", async () => {
      Date.now = () => 0; // Mock current time to 0 for predictable results

      let result;
      try {
        result = await githubAppJwt({
          id: APP_ID,
          privateKey: PRIVATE_KEY_PKCS1,
        });
      } catch (error) {
        expect(env).toBe("web"); // PKCS#1 is not supported in the web environment
        expect(/** @type {Error} */ (error).message).toBe(
          "[universal-github-app-jwt] Private Key is in PKCS#1 format, but only PKCS#8 is supported. See https://github.com/gr2m/universal-github-app-jwt#private-key-formats",
        );
        return; // Skip the rest of the test
      }

      expect(env).toBe("node"); // PKCS#1 is supported in the node environment
      expect(result).toStrictEqual({
        appId: APP_ID,
        expiration: 570,
        token: BEARER,
      });
    });

    test("Throws error if key is OpenSSH", async () => {
      Date.now = () => 0; // Mock current time to 0 for predictable results

      try {
        await githubAppJwt({
          id: APP_ID,
          privateKey: PRIVATEY_KEY_OPENSSH,
        });
        throw new Error("should throw");
      } catch (error) {
        expect(/** @type {Error} */ (error).message).toBe(
          "[universal-github-app-jwt] Private Key is in OpenSSH format, but only PKCS#8 is supported. See https://github.com/gr2m/universal-github-app-jwt#private-key-formats",
        );
      }
    });

    test("Include the time difference in the expiration and issued_at field", async () => {
      Date.now = () => 0; // Mock current time to 0 for predictable results

      const result = await githubAppJwt({
        id: APP_ID,
        privateKey: PRIVATE_KEY_PKCS8,
        now: 10,
      });

      expect(result.appId).toBe(APP_ID);
      expect(result.expiration).toBe(580);

      const resultPayload = JSON.parse(atob(result.token.split(".")[1]));
      expect(resultPayload.exp).toBe(580);
      expect(resultPayload.iat).toBe(-20);
    });

    test("Replace escaped line breaks with actual linebreaks", async () => {
      Date.now = () => 0; // Mock current time to 0 for predictable results

      const result = await githubAppJwt({
        id: APP_ID,
        privateKey: PRIVATE_KEY_PKCS8.replace(/\n/g, "\\n"),
      });

      expect(result).toStrictEqual({
        appId: APP_ID,
        expiration: 570,
        token: BEARER,
      });
    });

    // New test for id set to Client ID
    test("id set to Client ID", async () => {
      Date.now = () => 0; // Mock current time to 0 for predictable results

      const result = await githubAppJwt({
        id: "client_id_string",
        privateKey: PRIVATE_KEY_PKCS8,
      });

      expect(typeof result.token).toBe("string");
      expect(result.appId).toBe("client_id_string");
    });
  });
});
