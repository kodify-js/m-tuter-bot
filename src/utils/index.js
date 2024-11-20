import {createWriteStream} from "fs";

// creating log file
export function logToFile(message) {
    const logStream = createWriteStream('logs.txt', { flags: 'a' });
    logStream.write(`${message}\n`);
    logStream.end();
  }

export var twirlTimer = (function() {
    var P = ["\\", "|", "/", "-"];
    var x = 0;
    return setInterval(function() {
      process.stdout.write("\r" + P[x++]);
      x &= 3;
    }, 250);
  })();