var fs = require('fs');

function readProperties(fname){
    var lines = fs.readFileSync(fname, 'utf8').split('\n')
    var obj = {}
    for (let i=0; i<lines.length; i++){
	let line = lines[i].split('=')
	obj[line[0]] = line[1]
    }
    return obj
}

module.exports.cfg = readProperties('config.p')

