var fs = require('fs');

function read(fname){
    var lines = fs.readFileSync(fname, 'utf8').split('\n')
    var obj = {}
    for (let i=0; i<lines.length; i++){
	let line = lines[i].split('=')
	obj[line[0]] = line[1]
    }
    return obj
}

this.read = read
