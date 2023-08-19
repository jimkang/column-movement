/* global process */
var fs = require('fs');
var seedrandom = require('seedrandom');
var RandomId = require('@jimkang/randomid');

var randomId = RandomId({
  random: seedrandom(process.argv[2] || new Date().getTime()),
});

var anonByOrig = {};

var thirdGradeRows = parseCsvAtFilePath('data/3rd-grade.csv');
var fourthGradeRows = parseCsvAtFilePath('data/4th-grade.csv');

var teachersByThirdGrader = {};
var fourthGradersByTeacher = {};
var studentsBySrcByDest = {};

putTeachersInDict(teachersByThirdGrader, thirdGradeRows);
putStudentsInDict(fourthGradersByTeacher, fourthGradeRows);
mapMotion();

//console.log(teachersByThirdGrader);
//console.log(fourthGradersByTeacher);
console.log(studentsBySrcByDest);

function mapMotion() {
  for (let teacher in fourthGradersByTeacher) {
    let fourthGraders = fourthGradersByTeacher[teacher];
    var studentsBySrc = readKey({
      dict: studentsBySrcByDest,
      key: teacher,
      defaultVal: {},
    });

    fourthGraders.forEach(putStudentInSrcList);
  }

  function putStudentInSrcList(student) {
    let srcTeacher = teachersByThirdGrader[student];
    let studentList = readKey({
      dict: studentsBySrc,
      key: srcTeacher,
      defaultVal: [],
    });
    studentList.push(student);
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
  var teachersByCol = {};
  if (rows.length < 1) {
    return;
  }
  var headerRow = rows[0];
  for (let col = 0; col < headerRow.length; ++col) {
    teachersByCol['' + col] = headerRow[col];
  }

  for (let rowIndex = 1; rowIndex < rows.length; ++rowIndex) {
    let row = rows[rowIndex];
    for (let colIndex = 0; colIndex < row.length; ++colIndex) {
      const student = row[colIndex];
      if (!student || student.length < 1) {
        continue;
      }
      const teacher = teachersByCol[colIndex];
      let students = dict[teacher];
      if (!students) {
        students = [];
        dict[teacher] = students;
      }
      students.push(student);
    }
  }
}

function putTeachersInDict(dict, rows) {
  var teachersByCol = {};
  if (rows.length < 1) {
    return;
  }
  var headerRow = rows[0];
  for (let col = 0; col < headerRow.length; ++col) {
    teachersByCol['' + col] = headerRow[col];
  }

  for (let rowIndex = 1; rowIndex < rows.length; ++rowIndex) {
    let row = rows[rowIndex];
    for (let colIndex = 0; colIndex < row.length; ++colIndex) {
      const student = row[colIndex];
      if (!student || student.length < 1) {
        continue;
      }
      const teacher = teachersByCol[colIndex];
      dict[student] = teacher;
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
