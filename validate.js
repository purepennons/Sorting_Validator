var argv     = require('minimist')(process.argv.slice(2))
  , Promise  = require('bluebird')
  , readline = require('readline')
  , fs       = Promise.promisifyAll(require('fs'))
;

function isSmaller(a, b) {
  if(a > b) return false;
  return true;
};

// main
var input = argv.i || argv.input || null;
var increase = !!(!argv.dec || argv.inc);

var fileStream = fs.createReadStream(input);

var prev    = null
  , current = null
  , count   = 0
  , isValid = true
;
console.log(increase);

var rl = readline.createInterface({
  input: fileStream
});

rl.on('line', function (num) {

  count++;

  prev = current;
  current = num;

  if(prev !== null && current !== null) {
    if(isValid) {
      isValid = increase? isSmaller(prev, current): !isSmaller(prev, current);
    }else {
      rl.close();
    }
  }

});

rl.on('close', function () {
  if(isValid) {
    console.log('檔案驗證結果：[通過]');
  }else {
    console.log('檔案驗證結果：[不通過]');
    console.log('在 %s 行附近出錯', count-1);
  }
});
