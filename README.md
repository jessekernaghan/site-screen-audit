## Overview

Primarily using puppeteer, but using a few other packages as well which you can checkout in `package.json`.

Some quick notes:

- screens output as png
- the hope for this in the future is potentially using visual diffing to process large sitemaps but only extract unique screens from it
- do with it as you want/will

## Configuration

Example configuration:

```
{
  "blacklist": ["https://www.somesite.com/assets/*"],
  "repeat": [
    "https://www.somesite.com/category/*",
    "https://www.somesite.com/product/*"
  ],
  "force": [
    "https://www.somesite.com/category/some-category",
    "https://www.somesite.com/category/some-category/some-very-specific-product"
  ]
}
```

### blacklist

The `blacklist` key uses a wildcard match to actively skip processing certain URLs. An example of this would be skipping any asset files returned from a site crawl.

### repeat

The `repeat` key uses a wildcard match to skip repeated matches against a pattern. This is used if you want to see an example of, say, a category or product page without seeing every single product page. Great for isolating templates.

### force

The `force` key also accepts a wildcard match, but usually it would be used to try and grab specific screens you care about. This overrides anything that might have matched a blacklist or a repeat so be careful of unexpected conflicts!

## CSV Input

Please refer to the `example.sitemap.csv` for the format that this script accepts. It takes the first column and starts on the second row (index 1) to prevent header collision.

## Usage

If you don't want to create a global script, run the following command from the root of the project:

```
node index.js --config=path/to/config.json --inputfile=path/to/sitemap.csv --outputdir=path/to/outputdir
```

If you do, simply run `npm link` in the project root then from any directory you can run:

```
screen-audit --config=path/to/config.json --inputfile=path/to/sitemap.csv --outputdir=path/to/outputdir
```

**Note**: make sure that the `./index.js` file is executable.
