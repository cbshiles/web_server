var fs = require('fs')

function getSnippet(name){
    var snipDir = config['snippetDirectory']
    return fs.readFileSync(snipDir+name+'.html')
}

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
		var provFn = prov[mld.vars[dex]]
		ans += provFn ? provFn() : getSnippet(mld.vars[dex])
	    }
	    isText = !isText
	}
	return ans
    }

    return dew(mold)
}
this.combine = combine

function blankProvider(){ //yummy
    return { vars: function(hook){ return {} } }
}

function stdHtml(path, base, req, res){
    var r = path+base

    var moldF = r+'.json'
    if (fs.existsSync(moldF)){
	fs.readFile(moldF, 'utf8', (err, data) => {
	    if (err) res.end(err.toString())
	    var mold = JSON.parse(data)
	    var provider = blankProvider()
	    try { //If no matching javascript file, use blank provider [only match snippets]
		provider = require(r+'.js')
	    } catch(err){;}
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
this.stdHtml = stdHtml

function makeGet(htmlFn){
    return function(req, res){
	var path = decodeURIComponent(req.url[0])
	var file = decodeURIComponent(req.url[1])

	let j = file.lastIndexOf('?')
	if (j > -1)
	    file = file.substring(0, j)
	
	var dot = file.lastIndexOf('.')
	var base, xten
	if (dot == -1){
	    base = file
	    xten = ''
	} else {
	    base = file.substring(0, dot)
	    xten = file.substring(dot+1)
	}

	if (xten == '') { //route requests w/o file extensions to index.html
	    var z = (base == '')?path+'pages/':path+'subs/'+base+'/pages/'
	    htmlFn(z, 'index', req, res)
	}
	else if (xten == 'html') htmlFn(path+'pages/', base, req, res)
	else {
	    fs.readFile(path+'res/'+file,
			function(err, data) { 
			    if (err){
				console.log(err)
				res.end("Four Oh Four")
			    } else {
				if (xten == "css")
				    res.setHeader("Content-Type", "text/css");
				else if (xten == 'js')
				    res.setHeader("Content-Type", "text/javascript");
				else
				    res.setHeader("Content-Type", "text/plain");    
				res.end(data)
			    }
			})
	}
    }
}
this.makeGet = makeGet

var stdMethods = {
    GET: makeGet(stdHtml)
}
this.stdMethods = stdMethods
this.nrmGet = makeGet(stdHtml)

this.DataGlobber = function(req){
    this.data = ''
    this.glob = function(d){
	this.data += d
	if (this.data.length > 1e5) { // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
	    req.connection.destroy();
        }
    }.bind(this)
    req.on('data', this.glob)
}

