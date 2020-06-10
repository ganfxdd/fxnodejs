var fs = require('fs');

class MyFile {
    write(name, text) {
        fs.writeFile(name, text);
    }
}

module.exports = MyFile;
