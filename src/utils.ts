export function string2ArrayBuffer(str: string) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

export function getDERfromPEM(pem: string): ArrayBuffer {
  const pemB64 = pem
    .trim()
    .split("\n")
    .slice(1, -1) // Remove the --- BEGIN / END PRIVATE KEY ---
    .join("");

  const decoded = atob(pemB64);
  return string2ArrayBuffer(decoded);
}

export function getEncodedMessage(header: object, payload: object): string {
  return `${base64encodeJSON(header)}.${base64encodeJSON(payload)}`;
}

export function base64encode(buffer: ArrayBuffer): string {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return fromBase64(btoa(binary));
}

function fromBase64(base64: string): string {
  return base64
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64encodeJSON(obj: object) {
  return fromBase64(btoa(JSON.stringify(obj)));
}
