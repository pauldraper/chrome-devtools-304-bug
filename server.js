#!/usr/bin/env node
const { createServer } = require("node:http");

const html = `
<!doctype html>
<div id="message"></div>
<script>
  fetch("/test");
  fetch("http://localhost:8001/test");
</script>
`.trim();

const cacheKey = Math.floor(Math.random() * Math.pow(2, 32)).toString(16);

const handler = async (req, res) => {
  switch (req.url) {
    case "/":
      res.setHeader("Content-Type", "text/html");
      res.end(html);
      break;
    case "/test":
      if (req.headers["if-none-match"] === `"${cacheKey}"`) {
        res.statusCode = 304;
        res.end();
        console.log("304");
        break;
      }
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("ETag", `"${cacheKey}"`);
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "Hello World!" }));
      console.log("200");
      break;
  }
  res.statusCode = 404;
  res.end();
}

createServer(handler).listen(8000);

createServer(handler).listen(8001);
