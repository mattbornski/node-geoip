/* Mocha test
   to use:
     npm install mocha
     mocha <filename>
   or
     npm test
*/

var assert = require('assert');
var geoip = require('../lib/geoip');

describe('Looking up ip addresses', function () {
  it('should match expected results', function (done) {
    var t1 = Date.now();
    var t2 = Date.now();

    if (process.argv.length > 2) {
    	console.dir(geoip.lookup(process.argv[2]));
    	var t3 = Date.now();
    	console.log("Startup: %dms, exec: %dms", t2-t1, t3-t2);
    	return done();
    }

    var n = 30000;

    var f = [], nf = [];
    var ts = Date.now();
    for (var i = 0; i < n; i++) {
      var ip = null;
    	if (i % 2 == 0) {
    		ip = Math.round(Math.random()*0xff000000 + 0xffffff);
    	} else {
    		ip = "2001:" +
    			Math.round(Math.random()*0xffff).toString(16) + ":" +
    			Math.round(Math.random()*0xffff).toString(16) + ":" +
    			Math.round(Math.random()*0xffff).toString(16) + ":" +
    			Math.round(Math.random()*0xffff).toString(16) + ":" +
    			Math.round(Math.random()*0xffff).toString(16) + ":" +
    			Math.round(Math.random()*0xffff).toString(16) + ":" +
    			Math.round(Math.random()*0xffff).toString(16) + "";
    	}
    	var r = geoip.lookup(ip);
    	if (r === null) {
    		nf.push(ip);
    		continue;
    	}
    	f.push([ip, r]);
    	assert.ok(geoip.cmp(ip, r.range[0]) >= 0 , "Problem with " + geoip.pretty(ip) + " < " + geoip.pretty(r.range[0]));
    	assert.ok(geoip.cmp(ip, r.range[1]) <= 0 , "Problem with " + geoip.pretty(ip) + " > " + geoip.pretty(r.range[1]));
    }
    var te = Date.now();

    /*
    f.forEach(function(ip) {
    	console.log("%s bw %s & %s is %s", geoip.pretty(ip[0]), geoip.pretty(ip[1].range[0]), geoip.pretty(ip[1].range[1]), ip[1].country);
    });
    */

    console.log("Found %d (%d/%d) ips in %dms (%s ip/s) (%sμs/ip)", n, f.length, nf.length, te-ts, (n*1000/(te-ts)).toFixed(3), ((te-ts)*1000/n).toFixed(0));
    console.log("Took %d ms to startup", t2-t1);
    done();
  });
});


