module.exports = [
  {
    name: "inputfile",
    short: "i",
    type: "path",
    description: "The CSV of links to crawl",
    example:
      "'script --inputfile=/path/to/file.csv' or 'script -i /path/to/file.csv'"
  },
  {
    name: "outputdir",
    short: "o",
    type: "path",
    description: "The output location for the audit files",
    example:
      "'script --outputdir=/path/to/output' or 'script -o /path/to/output'"
  },
  {
    name: "config",
    short: "c",
    type: "path",
    description: "The JSON configuration file location",
    example:
      "'script --config=/path/to/config.json' or 'script -c /path/to/config.json'"
  }
];
