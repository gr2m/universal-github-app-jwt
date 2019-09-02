const http = require("http");

const puppeteer = require("puppeteer");
const handler = require("serve-handler");

// serve static files from project root
const server = http.createServer(handler);
server.listen(async () => {
  const port = server.address().port;
  const url = `http://localhost:${port}/test/browser.test`;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const errors = [];
  page.on("console", async data => {
    const msg = String(data.args()[0]).substr("JSHandle:".length);
    if (msg === "done.") {
      await browser.close();
      server.close();

      if (errors.length) {
        console.log("Assertions failed:\n- " + errors.join("\n- "));
        process.exit(1);
      }

      console.log("All tests passed.");
    }

    errors.push(msg);
  });

  await page.goto(url);
});
