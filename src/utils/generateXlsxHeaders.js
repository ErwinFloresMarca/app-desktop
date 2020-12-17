function alphaToNum(alpha) {
  var i = 0,
      num = 0,
      len = alpha.length;

  for (; i < len; i++) {
    num = num * 26 + alpha.charCodeAt(i) - 0x40;
  }

  return num - 1;
}

function numToAlpha(num) {
  var alpha = '';

  for (; num >= 0; num = parseInt(num / 26, 10) - 1) {
    alpha = String.fromCharCode(num % 26 + 0x41) + alpha;
  }

  return alpha;
}

function _buildColumnsArray(range) {
  
  var i,
      res = [],
      rangeNum = range.split(':').map(function(val) {
        return alphaToNum(val.replace(/[0-9]/g, ''));
      }),
      start = rangeNum[0],
      end = rangeNum[1] + 1;

  for (i = start; i < end ; i++) {
    res.push(numToAlpha(i));
  }

  return res;
}

export default _buildColumnsArray;