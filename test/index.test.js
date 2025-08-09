// @ts-check

import { describe, test, expect } from "vitest";
import githubAppJwtNode from "../dist/node.js";
import githubAppJwtDefault from "../dist/default.js";

if (process.versions.deno) {
  if (process.env.TEST_ENVIRONMENT !== "DENO") {
    console.error(
      "Running tests in Deno environment requires TEST_ENVIRONMENT to be set to 'DENO'.",
    );
    process.exit(1);
  }
  console.log("Running tests in Deno environment");
} else if (process.versions.bun) {
  if (process.env.TEST_ENVIRONMENT !== "BUN") {
    console.error(
      "Running tests in Bun environment requires TEST_ENVIRONMENT to be set to 'BUN'.",
    );
    process.exit(1);
  }
  console.log("Running tests in Bun environment");
} else if (globalThis.EdgeRuntime) {
  if (process.env.TEST_ENVIRONMENT !== "EDGE") {
    console.error(
      "Running tests in edge environment requires TEST_ENVIRONMENT to be set to 'EDGE'.",
    );
    process.exit(1);
  }
  console.log("Running tests in Edge Runtime environment");
} else if (process.versions.node) {
  if (process.env.TEST_ENVIRONMENT !== "NODE") {
    console.error(
      "Running tests in Node environment requires TEST_ENVIRONMENT to be set to 'NODE'.",
    );
    process.exit(1);
  }
  console.log("Running tests in Node.js environment");
} else {
  console.error("Unsupported environment.");
  process.exit(1);
}

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
