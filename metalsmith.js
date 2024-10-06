import Metalsmith from "metalsmith";
import browserSync from "browser-sync";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import markdown from "@metalsmith/markdown";
import layouts from "@metalsmith/layouts";
import collections from "@metalsmith/collections";
import permalinks from "@metalsmith/permalinks";
import when from "metalsmith-if";
import htmlMinifier from "metalsmith-html-minifier";
import replace from "metalsmith-regex-replace";
import assets from "metalsmith-static-files";
import metadata from "@metalsmith/metadata";
import * as marked from "marked";
import { replaceTextInDirectory } from './utils/replace-text-in-directory.js';


const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname)
let performanceStart = performance.now();
const isProduction = process.env.NODE_ENV === "production";
const noop = () => {};
let devServer = null;

// functions to extend Nunjucks environment
const spaceToDash = (string) => string.replace(/\s+/g, "-");
const condenseTitle = (string) => string.toLowerCase().replace(/\s+/g, "");
const UTCdate = (date) => date.toUTCString("M d, yyyy");
const newsDate = (string) =>
  new Date(string).toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric" });
const trimSlashes = (string) => string.replace(/(^\/)|(\/$)/g, "");
const md = (mdString) => {
  try {
    return marked.parse(mdString, { mangle: false, headerIds: false });
  } catch (e) {
    return mdString;
  }
};
const thisYear = () => new Date().getFullYear();

function msBuild() {
    return Metalsmith(__dirname)
      .clean(true)
      .watch(isProduction ? false : ["src", "layouts"])
      .source("./src/content")
      .destination("./build")
      .use(
        collections({
          news: {
            pattern: "news/*.md",
            sortBy: "date",
            reverse: true,
            refer: true,
            limit: 10,
          },
        })
      )
      .use(markdown())
      .use(permalinks())
    //   .env('DEBUG', '@metalsmith/layouts*')
      .use(layouts({
        directory: "layouts",
        engineOptions: {
          path: ["layouts"],
          filters: {
            spaceToDash,
            condenseTitle,
            UTCdate,
            newsDate,
            trimSlashes,
            md,
            thisYear,
          },
        },
      }))
      .use(
        assets({
          source: "./src/assets/",
          destination: "assets/",
        })
      )
      .use(
        assets({
          source: "./bootstrap-static",
          destination: "",
        })
      )
      .use(isProduction ? htmlMinifier() : noop);
}

const ms = msBuild();
ms.build((err) => {
  if (err) {
    throw err;
  }
  /* eslint-disable no-console */
  console.log(`Build success in ${((performance.now() - performanceStart) / 1000).toFixed(1)}s`);
  if (ms.watch()) {

    // when running locally, update link URLs for ease of use to navigate
    replaceTextInDirectory('./build', 'https://phillymahjong.com', 'http://localhost:3000');

    if (devServer) {
      performanceStart = performance.now();
      devServer.reload();
    } else {
      devServer = browserSync.create();
      devServer.init({
        host: "localhost",
        server: "./build",
        files: ["./build/**"],
        port: 3000,
        injectChanges: false,
        reloadThrottle: 0,
      });
    }
  }
});