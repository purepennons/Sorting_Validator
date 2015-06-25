var argv     = require('minimist')(process.argv.slice(2))
  , Promise  = require('bluebird')
  , readline = require('readline')
  , fs       = Promise.promisifyAll(require('fs'))
;

function isSmaller ( prev, current ) {
  return Number(prev) <= Number(current);
}

// main
(function () {
  var input = argv.i || argv.input || null;
  var increase = !!(!argv.dec || argv.inc);

  console.log('Test %s', input);

  if(input) {
    var fileStream = fs.createReadStream(input.toString());

    var prev    = null
      , current = null
      , count   = 0
      , isValid = true
    ;

    var rl = readline.createInterface({
      input: fileStream
    });

    // readline events
    rl.on('line', function (num) {

      count++;

      prev = current;
      current = num;

      if(prev !== null && current !== null) {
        if(isValid) {
          isValid = increase? isSmaller(prev, current): isSmaller(current, prev);
        }else {
          rl.close();
        }
      }

    });

    rl.on('close', function () {
      if(isValid) {
        console.log('Result：[Pass]');
        console.log('Total lines：', count);
      }else {
        console.log('Result：[Not Pass]');
        console.log('Detect error at line %s', count-1);
      }
      return;
    });

    // readStream events
    fileStream.on('error', function () {
      console.log('%s is not exist.', input);
      return;
    });

  }else {
    console.log('Without input file');
    return;
  }
})();
