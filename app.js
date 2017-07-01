var http = require("http");
var url = require('url');
var fs = require('fs');

var port = 3000;

http.createServer(function (req, res) {
    //res.writeHead(200, {'Content-Type': 'text/html'});
    //res.write(req.url);
    //Split HTTP url
    //console.log(req.url);
    var address = req.url;
    var q = url.parse(address,true);
    var pathname = q.pathname;
    var qdata = q.query;
    var testHandle = qdata.testHandle;

    // control for favicon

	if (req.url == '/favicon.ico') {
	res.writeHead(200, {'Content-Type': 'image/x-icon'} );
	res.end();
	//console.log('favicon requested');
	return;
	}

	//read JSON and Handle HTTP url requests
 	fs.readFile('package.json', 'utf8', function(err, data) {
    	if (err) throw err; // we'll not consider error handling for now
    	//console.log(data);
		//process JSON
		var sites = JSON.parse(data);
		var sitesToTest = sites.sitesToTest;
		var sitelength = sitesToTest.length;
		var iterations = sites.iterations;
		//console.log(sitesToTest);
		//console.log(sitelength);
		//console.log(iterations);
		//console.log(pathname);

		//Add www to url hostname
		for(i=0;i<sitelength;i++){
			var sitename = sitesToTest[i];
			if(sitename.indexOf('www') == -1){
				var newname = sitename.replace('://', '://www.');
				sitesToTest[i] = newname;
			}			
			//console.log(sitesToTest[i]);

		}

		//Handle HTTP url
	    if(pathname == '/startTest'){
	    	startTest(sitelength,iterations,sitesToTest);
	    }else if(pathname == '/testStatus'){
	    	testStatus(sitelength,iterations,sitesToTest);

	    }else if(pathname == '/testResults'){
			testResults(sitelength,iterations,sitesToTest);

	    }else if(pathname == '/allTests'){
	    	allTests(sitelength,iterations,sitesToTest);
	    }else{

	    }
  	});

    res.end();
}).listen(port);
console.log('Server running at http://127.0.0.1:' + port);


function startTest(sitelength,iterations,sitesToTest){
	for(j=0;j<sitelength;j++){
		for(i=0;i<iterations;i++){			
			var sitename = sitesToTest[j];
			httpRequest(sitename);			
		}
		console.log('testHandle: ' + sitename + ' , status: ' + 'started');
	}
}

function testResults(sitelength,iterations,sitesToTest){
	for(j=0;j<sitelength;j++){
		for(i=0;i<iterations;i++){			
			var sitename = sitesToTest[j];
			var startTestTime = (new Date).getTime();
			//console.log(startTestTime);
			httpRequest(sitename);
			var endTestTime = (new Date).getTime();
			//console.log(endTestTime);
			var list = [];
			var jsonobj = {
				site: sitename,
				avg: 5,
				max: 10,
				min: 1,
				startTestTime: startTestTime,
				endTestTime: endTestTime
			}
			list.push(jsonobj);
		}
		var json = JSON.stringify(list);
		console.log(json);
	}
}

function testStatus(sitelength,iterations,sitesToTest){
	for(j=0;j<sitelength;j++){
		for(i=0;i<iterations;i++){			
			var sitename = sitesToTest[j];
			httpRequest(sitename);
			var list = [];
			var jsonobj = {
				testHandle: sitename,
				status: "finished"
			}
			list.push(jsonobj);
		}
		var json = JSON.stringify(list);
		console.log(json);
	}
}

function allTests(sitelength,iterations,sitesToTest){
	var handleArray = [];
	for(j=0;j<sitelength;j++){
		for(i=0;i<iterations;i++){			
			var sitename = sitesToTest[j];
			httpRequest(sitename);	
		}
		handleArray.push(sitename);
	}
	var jsonobj = {
		handles: handleArray
	}
	var json = JSON.stringify(jsonobj);
	console.log(json);
}

function httpRequest(sitename){
	http.get(sitename, function(res){
		//console.log('Status: ' + res.statusCode);
		//console.log('Headers: ' + JSON.stringify(res.headers));
		//console.log('testHandle: ' + sitename + ' , status: ' + 'started');
	    res.setEncoding('utf8');
	    res.on('data', function(chunk){
	        //console.log(chunk);
	    });
	    res.on('error', function(e) {
		  console.log('problem with request: ' + e.message);
		});
		// write data to request body
	});
}