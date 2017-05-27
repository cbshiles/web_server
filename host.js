var http = require('http')
var fs = require('fs')
var rTools = require('./responderTools')

function logg(data){
    console.log(data + ':~:' + new Date().toISOString())
}

function loadDomain(path){

    var ownResponder = fs.existsSync(path+'responder.js')
    var dom = {
	subs: {},
	methods: (ownResponder ?
		  require(path+'responder.js').methods :
		  rTools.stdMethods)
    }

    var subDir = path+'subs/'
    if (fs.existsSync(subDir)){ //load sub dir if exists
	var subs = fs.readdirSync(subDir)
	for (var i=0; i<subs.length; i++)
	    dom.subs[subs[i]] = loadDomain(subDir+subs[i]+'/')
    }

    dom.route = function(req, res){
	if (req.url.length > 1){ //redirect to sub domain
	    var subDom = dom.subs[req.url.pop()]
	    if (typeof subDom == 'undefined') 
		res.end("Out of bounds")
	    else subDom.route(req, res)
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


function logRequest(req){
    logg(req.url)
}


function host(sitePath, port){
    
    var root = loadDomain(sitePath+"domains/")

    function route(req, res){
	logRequest(req)
	if (req.url.substring(req.url.length-1) == "/"){
	    req.url = req.url.substring(0, req.url.length-1)
	} //change req.url from string to list
	req.url = req.url.substring(1).split("/").reverse()
	return root.route(req, res)
    }

    function launch(){
	http.createServer(route).listen(port)
	logg('Server running on '+port+'.')
    }

    launch()
}

host("./community/", 4200)
