const nameSrc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function SequentialNamer() {
  var index = 0;
  return getNextName;

  function getNextName() {
    const charIndex = index % nameSrc.length;
    const repeatCount = ~~(index / nameSrc.length) + 1;
    var name = '';
    for (let i = 0; i < repeatCount; ++i) {
      name += nameSrc.charAt(charIndex);
    }
    index += 1;
    return name;
  }
}

module.exports = SequentialNamer;
