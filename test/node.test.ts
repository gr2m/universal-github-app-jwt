import { install, Clock } from "lolex";
import WebCrypto from "node-webcrypto-ossl";

import { githubAppJwtSign } from "../src/index";

const APP_ID = 1;
const PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA1c7+9z5Pad7OejecsQ0bu3aozN3tihPmljnnudb9G3HECdnH
lWu2/a1gB9JW5TBQ+AVpum9Okx7KfqkfBKL9mcHgSL0yWMdjMfNOqNtrQqKlN4kE
p6RD++7sGbzbfZ9arwrlD/HSDAWGdGGJTSOBM6pHehyLmSC3DJoR/CTu0vTGTWXQ
rO64Z8tyXQPtVPb/YXrcUhbBp8i72b9Xky0fD6PkEebOy0Ip58XVAn2UPNlNOSPS
ye+Qjtius0Md4Nie4+X8kwVI2Qjk3dSm0sw/720KJkdVDmrayeljtKBx6AtNQsSX
gzQbeMmiqFFkwrG1+zx6E7H7jqIQ9B6bvWKXGwIDAQABAoIBAD8kBBPL6PPhAqUB
K1r1/gycfDkUCQRP4DbZHt+458JlFHm8QL6VstKzkrp8mYDRhffY0WJnYJL98tr4
4tohsDbqFGwmw2mIaHjl24LuWXyyP4xpAGDpl9IcusjXBxLQLp2m4AKXbWpzb0OL
Ulrfc1ZooPck2uz7xlMIZOtLlOPjLz2DuejVe24JcwwHzrQWKOfA11R/9e50DVse
hnSH/w46Q763y4I0E3BIoUMsolEKzh2ydAAyzkgabGQBUuamZotNfvJoDXeCi1LD
8yNCWyTlYpJZJDDXooBU5EAsCvhN1sSRoaXWrlMSDB7r/E+aQyKua4KONqvmoJuC
21vSKeECgYEA7yW6wBkVoNhgXnk8XSZv3W+Q0xtdVpidJeNGBWnczlZrummt4xw3
xs6zV+rGUDy59yDkKwBKjMMa42Mni7T9Fx8+EKUuhVK3PVQyajoyQqFwT1GORJNz
c/eYQ6VYOCSC8OyZmsBM2p+0D4FF2/abwSPMmy0NgyFLCUFVc3OECpkCgYEA5OAm
I3wt5s+clg18qS7BKR2DuOFWrzNVcHYXhjx8vOSWV033Oy3yvdUBAhu9A1LUqpwy
Ma+unIgxmvmUMQEdyHQMcgBsVs10dR/g2xGjMLcwj6kn+xr3JVIZnbRT50YuPhf+
ns1ScdhP6upo9I0/sRsIuN96Gb65JJx94gQ4k9MCgYBO5V6gA2aMQvZAFLUicgzT
u/vGea+oYv7tQfaW0J8E/6PYwwaX93Y7Q3QNXCoCzJX5fsNnoFf36mIThGHGiHY6
y5bZPPWFDI3hUMa1Hu/35XS85kYOP6sGJjf4kTLyirEcNKJUWH7CXY+00cwvTkOC
S4Iz64Aas8AilIhRZ1m3eQKBgQCUW1s9azQRxgeZGFrzC3R340LL530aCeta/6FW
CQVOJ9nv84DLYohTVqvVowdNDTb+9Epw/JDxtDJ7Y0YU0cVtdxPOHcocJgdUGHrX
ZcJjRIt8w8g/s4X6MhKasBYm9s3owALzCuJjGzUKcDHiO2DKu1xXAb0SzRcTzUCn
7daCswKBgQDOYPZ2JGmhibqKjjLFm0qzpcQ6RPvPK1/7g0NInmjPMebP0K6eSPx0
9/49J6WTD++EajN7FhktUSYxukdWaCocAQJTDNYP0K88G4rtC2IYy5JFn9SWz5oh
x//0u+zd/R/QRUzLOw4N72/Hu+UG6MNt5iDZFCtapRaKt6OvSBwy8w==
-----END RSA PRIVATE KEY-----`;

// pkcs8 version of the key above, which is pkcs1
// see https://stackoverflow.com/questions/51033786/how-can-i-import-an-rsa-private-key-in-pem-format-for-use-with-webcrypto/51035703#51035703
const PRIVATE_KEY_PKCS8 = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDVzv73Pk9p3s56
N5yxDRu7dqjM3e2KE+aWOee51v0bccQJ2ceVa7b9rWAH0lblMFD4BWm6b06THsp+
qR8Eov2ZweBIvTJYx2Mx806o22tCoqU3iQSnpEP77uwZvNt9n1qvCuUP8dIMBYZ0
YYlNI4Ezqkd6HIuZILcMmhH8JO7S9MZNZdCs7rhny3JdA+1U9v9hetxSFsGnyLvZ
v1eTLR8Po+QR5s7LQinnxdUCfZQ82U05I9LJ75CO2K6zQx3g2J7j5fyTBUjZCOTd
1KbSzD/vbQomR1UOatrJ6WO0oHHoC01CxJeDNBt4yaKoUWTCsbX7PHoTsfuOohD0
Hpu9YpcbAgMBAAECggEAPyQEE8vo8+ECpQErWvX+DJx8ORQJBE/gNtke37jnwmUU
ebxAvpWy0rOSunyZgNGF99jRYmdgkv3y2vji2iGwNuoUbCbDaYhoeOXbgu5ZfLI/
jGkAYOmX0hy6yNcHEtAunabgApdtanNvQ4tSWt9zVmig9yTa7PvGUwhk60uU4+Mv
PYO56NV7bglzDAfOtBYo58DXVH/17nQNWx6GdIf/DjpDvrfLgjQTcEihQyyiUQrO
HbJ0ADLOSBpsZAFS5qZmi01+8mgNd4KLUsPzI0JbJOViklkkMNeigFTkQCwK+E3W
xJGhpdauUxIMHuv8T5pDIq5rgo42q+agm4LbW9Ip4QKBgQDvJbrAGRWg2GBeeTxd
Jm/db5DTG11WmJ0l40YFadzOVmu6aa3jHDfGzrNX6sZQPLn3IOQrAEqMwxrjYyeL
tP0XHz4QpS6FUrc9VDJqOjJCoXBPUY5Ek3Nz95hDpVg4JILw7JmawEzan7QPgUXb
9pvBI8ybLQ2DIUsJQVVzc4QKmQKBgQDk4CYjfC3mz5yWDXypLsEpHYO44VavM1Vw
dheGPHy85JZXTfc7LfK91QECG70DUtSqnDIxr66ciDGa+ZQxAR3IdAxyAGxWzXR1
H+DbEaMwtzCPqSf7GvclUhmdtFPnRi4+F/6ezVJx2E/q6mj0jT+xGwi433oZvrkk
nH3iBDiT0wKBgE7lXqADZoxC9kAUtSJyDNO7+8Z5r6hi/u1B9pbQnwT/o9jDBpf3
djtDdA1cKgLMlfl+w2egV/fqYhOEYcaIdjrLltk89YUMjeFQxrUe7/fldLzmRg4/
qwYmN/iRMvKKsRw0olRYfsJdj7TRzC9OQ4JLgjPrgBqzwCKUiFFnWbd5AoGBAJRb
Wz1rNBHGB5kYWvMLdHfjQsvnfRoJ61r/oVYJBU4n2e/zgMtiiFNWq9WjB00NNv70
SnD8kPG0MntjRhTRxW13E84dyhwmB1QYetdlwmNEi3zDyD+zhfoyEpqwFib2zejA
AvMK4mMbNQpwMeI7YMq7XFcBvRLNFxPNQKft1oKzAoGBAM5g9nYkaaGJuoqOMsWb
SrOlxDpE+88rX/uDQ0ieaM8x5s/Qrp5I/HT3/j0npZMP74RqM3sWGS1RJjG6R1Zo
KhwBAlMM1g/Qrzwbiu0LYhjLkkWf1JbPmiHH//S77N39H9BFTMs7Dg3vb8e75Qbo
w23mINkUK1qlFoq3o69IHDLz
-----END PRIVATE KEY-----`;
// see https://runkit.com/gr2m/reproducable-jwt
const BEARER =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOi0zMCwiZXhwIjo1NzAsImlzcyI6MX0.q3foRa78U3WegM5PrWLEh5N0bH1SD62OqW66ZYzArp95JBNiCbo8KAlGtiRENCIfBZT9ibDUWy82cI4g3F09mdTq3bD1xLavIfmTksIQCz5EymTWR5v6gL14LSmQdWY9lSqkgUG0XCFljWUglEP39H4yeHbFgdjvAYg3ifDS12z9oQz2ACdSpvxPiTuCC804HkPVw8Qoy0OSXvCkFU70l7VXCVUxnuhHnk8-oCGcKUspmeP6UdDnXk-Aus-eGwDfJbU2WritxxaXw6B4a3flTPojkYLSkPBr6Pi0H2-mBsW_Nvs0aLPVLKobQd4gqTkosX3967DoAG8luUMhrnxe8Q";

let clock: Clock;
beforeEach(() => {
  clock = install({ now: 0, toFake: ["Date", "setTimeout"] });
});

test("README example for app auth", async () => {
  const result = await githubAppJwtSign({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    crypto: new WebCrypto()
  });

  expect(result).toStrictEqual({
    appId: APP_ID,
    expiration: 570,
    token: BEARER
  });
});

test("README example for app auth with private key in PKCS#8 format", async () => {
  const result = await githubAppJwtSign({
    id: APP_ID,
    privateKey: PRIVATE_KEY_PKCS8,
    crypto: new WebCrypto()
  });

  expect(result).toStrictEqual({
    appId: APP_ID,
    expiration: 570,
    token: BEARER
  });
});
