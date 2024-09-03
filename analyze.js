/* global process */
var fs = require('fs');
var seedrandom = require('seedrandom');
var RandomId = require('@jimkang/randomid');

if (process.argv.length < 4) {
  console.log(
    'Usage: node analyze.js <file-a.csv> <file-b.csv> [random seed for anonymous ids]'
  );
  process.exit();
}

const fileA = process.argv[2];
const fileB = process.argv[3];

var randomId = RandomId({
  random: seedrandom(
    (process.argv.length > 4 && process.argv[4]) || new Date().getTime()
  ),
});

var anonByOrig = {};

var aRows = parseCsvAtFilePath(fileA);
var bRows = parseCsvAtFilePath(fileB);

var headingsByAValue = {};
var bValuesByHeading = {};
var valuesBySrcByDest = {};

putHeadingsInDict(headingsByAValue, aRows);
putStudentsInDict(bValuesByHeading, bRows);
mapMotion();

//console.log(headingsByAValue);
//console.log(bValuesByHeading);
console.log(valuesBySrcByDest);

function mapMotion() {
  for (let heading in bValuesByHeading) {
    let bValues = bValuesByHeading[heading];
    var valuesBySrc = readKey({
      dict: valuesBySrcByDest,
      key: heading,
      defaultVal: {},
    });

    bValues.forEach(putStudentInSrcList);
  }

  function putStudentInSrcList(value) {
    let srcHeading = headingsByAValue[value];
    let valueList = readKey({
      dict: valuesBySrc,
      key: srcHeading,
      defaultVal: [],
    });
    valueList.push(value);
  }
}

function parseCsvAtFilePath(filePath) {
  var rows = fs
    .readFileSync(filePath, { encoding: 'utf8' })
    .split('\r\n')
    .map((rowText) => rowText.split(','));

  rows = rows
    .slice(0, 1)
    .concat(rows.slice(1).map((row) => row.map(anonymize)));
  return rows;

  function anonymize(orig) {
    return readKey({ dict: anonByOrig, key: orig, defaultVal: randomId(5) });
  }
}

function putStudentsInDict(dict, rows) {
  var headingsByCol = {};
  if (rows.length < 1) {
    return;
  }
  var headerRow = rows[0];
  for (let col = 0; col < headerRow.length; ++col) {
    headingsByCol['' + col] = headerRow[col];
  }

  for (let rowIndex = 1; rowIndex < rows.length; ++rowIndex) {
    let row = rows[rowIndex];
    for (let colIndex = 0; colIndex < row.length; ++colIndex) {
      const value = row[colIndex];
      if (!value || value.length < 1) {
        continue;
      }
      const heading = headingsByCol[colIndex];
      let values = dict[heading];
      if (!values) {
        values = [];
        dict[heading] = values;
      }
      values.push(value);
    }
  }
}

function putHeadingsInDict(dict, rows) {
  var headingsByCol = {};
  if (rows.length < 1) {
    return;
  }
  var headerRow = rows[0];
  for (let col = 0; col < headerRow.length; ++col) {
    headingsByCol['' + col] = headerRow[col];
  }

  for (let rowIndex = 1; rowIndex < rows.length; ++rowIndex) {
    let row = rows[rowIndex];
    for (let colIndex = 0; colIndex < row.length; ++colIndex) {
      const value = row[colIndex];
      if (!value || value.length < 1) {
        continue;
      }
      const heading = headingsByCol[colIndex];
      dict[value] = heading;
    }
  }
}

function readKey({ dict, key, defaultVal }) {
  var val = dict[key];
  if (val === undefined) {
    val = defaultVal;
    dict[key] = val;
  }
  return val;
}
