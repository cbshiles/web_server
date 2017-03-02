var http = require('http')
var fs = require('fs')

function loadDomain(path){
    console.log(path)
    
    var dom = {
	subs: {},
	methods: require(path+'responder.js').methods
    }

    var subDir = path+'subs/'
    var subs = fs.readdirSync(subDir)
    for (var i=0; i<subs.length; i++)
	dom.subs[subs[i]] = loadDomain(subDir+subs[i]+'/')

    dom.route = function(req, res){
	if (req.url.length > 1){
	    var subDom = dom.subs[req.url.pop()]
	    if (typeof subDom == 'undefined') 
		res.end("Out of bounds")
	    else subDom.route(req, res)
	} else {
	    req.url = [path, req.url[0]]
	    var func = dom.methods[req.method]
	    if (typeof func == 'undefined')
		res.end('?0? - Unsupported HTTP method')
	    func(req, res)
	}
    }
	
    return dom
}

function host(sitePath, port){
    
    var root = loadDomain(sitePath+"domains/")

    function route(req, res){
	req.url = req.url.substring(1).split("/").reverse()
	return root.route(req, res)
    }

    function launch(){
	http.createServer(route).listen(port)
	console.log('Server running on '+port+'.')
    }

    launch()
}

host("/home/brenan/code/web/sites/community/", 4201)


	
