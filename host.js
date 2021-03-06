var http = require('http')
var fs = require('fs')

//Global properties for easy access in modules
config = require('./propReader').read(__dirname+'/config.prop')
toolz = require('./responderTools')

/*
 * Log function, adds current time to the message
 */
function logg(data){
    console.log(data + ' :~: ' + new Date().toISOString())
}

function requireUncached(module){
    delete require.cache[require.resolve(module)]
    return require(module)
}

/*
 * Recursive function to load a 'domain'.
 * Can be called on root domain of website, and all subs will be loaded.
 */
function loadDomain(path){

    var ownResponder = fs.existsSync(path+'responder.js')
    var dom = {
	subs: {},
	methods: (ownResponder ?
		  requireUncached(path+'responder.js').methods :
		  toolz.stdMethods)
    }

    dom.route = function(req, res){

	if (req.url.length > 1){ //redirect to sub domain

	    var subDir = path+'subs/'+req.url.pop()+'/'
	    if (fs.existsSync(subDir)){ //load sub dir if exists
		var subDom = loadDomain(subDir)
		subDom.route(req, res)
	    } else {
		res.end("Out of bounds")
	    }
	} else { // actually load a page

	    req.url = [path, req.url[0]]
	    var func = dom.methods[req.method]

	    if (typeof func === 'undefined')
		res.end('?0? - Unsupported HTTP method')
	    else
		func(req, res)
	}
    }
	
    return dom
}

/*
 * sitePath - path on file system to the root of the AML website
 * port - port number the site is to be hosted on
 */
function host(sitePath, port){
    
    var root = loadDomain(sitePath+"domains/")

    function route(req, res){
	logg(typeof res+' '+req.url)
	// remove trailing slash
	if (req.url.substring(req.url.length-1) == "/"){
	    req.url = req.url.substring(0, req.url.length-1)
	}
	//change req.url from string to list
	req.url = req.url.substring(1).split("/").reverse()
	return root.route(req, res)
    }

    http.createServer(route).listen(port)
    logg('Server running on '+port+'.')
}

var defaultPort = 4200
var port = (typeof process.argv[3] == 'undefined') ? defaultPort : parseInt(process.argv[3])
host(process.argv[2], port)
