var http = require('http')
var fs = require('fs')

function loadDomain(path){
    var dom = {}
    console.log(path)
    dom.path = path
    dom.responder = require(path+"responder.js")

    var subs = fs.readdirSync(path+'subs/')
    dom.subs = {}
    for (var i=0; i<subs.length; i++)
	dom.subs[subs[i]] = loadDomain(path+'subs/'+subs[i]+'/')

    dom.route = function(req, res){
	console.log(req.url)
	if (req.url.length > 1){
	    var subDom = dom.subs[req.url.pop()]
	    if (typeof subDom == 'undefined') 
		res.end("Out of bounds")
	    else subDom.route(req, res)
	} else {
	    req.url = [path, req.url[0]]
	    console.log(req.url)
	    dom.responder.main(req, res)
	}
    }
	
    return dom
}

function host(sitePath, port){
    var root = loadDomain(sitePath+"domains/")

    function route(req, res){
	req.url = req.url.substring(1).split("/")
	console.log(req.url)
	return root.route(req, res)
    }

    function launch(){
	http.createServer(route).listen(port)
	console.log('Server running on '+port+'.')
    }

    launch()
}

host("/home/brenan/code/web/sites/community/", 4201)


	
