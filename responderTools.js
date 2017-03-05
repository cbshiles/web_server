var fs = require('fs')

function combine(mold, provider){

    var prov = provider.vars(hook)

    function hook(name)
    {return dew(mold.subs[name])}
    
    //assumes valid mold (its up to the compiler to only create valid molds)
    function dew(mld){
	var isText = !mld.firstWasVar
	var ltot = mld.vars.length+mld.texts.length;
	var ans = ""
	for (var i=0; i<ltot; i++){
	    var dex = (i - i%2)/2 //integer div 
	    if (isText){
		ans += mld.texts[dex]
	    } else {
		ans += prov[mld.vars[dex]]()
	    }
	    isText = !isText
	}
	return ans
    }

    return dew(mold)
}
module.exports.combine = combine

function stdHtml(path, base, req, res){
    var r = path+base

    var moldF = r+'.json'
    if (fs.existsSync(moldF)){
	fs.readFile(moldF, 'utf8', (err, data) => {
	    if (err) res.end(err.toString())
	    var mold = JSON.parse(data)
	    var provider = require(r+'.js')
	    res.end(combine(mold, provider))
	})
    } else {
	var htmlF = r+'.html'
	if (fs.existsSync(htmlF))
	    fs.readFile(htmlF, 'utf8', (err, data) => {
		if (err) res.end(err.toString())
		res.end(data)
	    })
	else res.end("File not found.")
    }
}
module.exports.stdHtml = stdHtml

function makeGet(htmlFn){
    return function(req, res){
	var path = req.url[0]
	var file = req.url[1]

	var dot = file.lastIndexOf('.')
	var base, xten
	if (dot == -1){
	    base = file
	    xten = ''
	} else {
	    base = file.substring(0, dot)
	    xten = file.substring(dot+1)
	}

	if (xten == 'html') htmlFn(path+'pages/', base, req, res)
	else {
	    fs.readFile(path+'res/'+file,
			function(err, data) { 
			    if (err){
				console.log(err)
				res.end("Four Oh Four")
			    }
			    res.end(data)
			})
	}
    }
}
module.exports.makeGet = makeGet

var stdMethods = {
    GET: makeGet(stdHtml),
    POST: function(req, res){
	res.end("bleh")
    }
}
module.exports.stdMethods = stdMethods
