function packageWords(t) {
    var inputContent = t.trim();
    var array = inputContent.split(/\s+/);
    var datamsg;
    var datamsg;
    var regexTmp;
    regexTmp = array[0];
    for (var i = 1; i < array.length; i++){
      regexTmp = regexTmp + '|' + array[i];
    }
    return regexTmp;
  }


  module.exports = packageWords;