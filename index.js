const fs = require("fs");
const http = require("http");
const url = require("url");


const templateReplace = require('./modules/templateReplace.js');
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);


const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataObj.map(el => {
      return templateReplace(templateCard, el);
    });
    const output = templateOverview.replace("{%PRODUCTCARDS%}", cardsHtml);
    res.end(output);
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = templateReplace(templateProduct, product);
    return res.end(output);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html"
    });
    res.end("<h1>Page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to port 8000");
});
