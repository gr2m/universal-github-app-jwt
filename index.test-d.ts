import { expectType } from "tsd";
import githubAppJwt from ".";

export async function test() {
  const result = await githubAppJwt({
    id: 123,
    privateKey: "",
  });

  expectType<number>(result.appId);
  expectType<number>(result.expiration);
  expectType<string>(result.token);
}
