var Promise = require('promise');

function example() {
	function get(url, callback) {
		callback(null, 'Hello World');
	}
	var test = new Promise(function (resolve, reject) {
		get('http://www.google.com', function (err, res) {
			if (err) reject(err);
			else resolve(res);
		});
	});

	var HyperFriendlyResult = function(parent) {
		this.parent = parent;
	}

	HyperFriendlyResult.prototype.start = function() {
		if (this.parent) this.parent.start();
	}

	HyperFriendlyResult.prototype.follow = function(rel, callback) {
		var self = this;
		var newHyperResult = new HyperFriendlyResult(self);
		self.do = function(result) { 
			var res = get(result, function (err, res1) { self.then(res1); });
		};
		self.then = function(result) { 
			newHyperResult.do(result);
		};
		return newHyperResult;
	}

	HyperFriendlyResult.prototype.result = function(callback) {
		this.do = function(result) { callback(result) }
		this.start();
	}

	var HyperFriendlyClient = function(baseUrl) {
		this.baseUrl = baseUrl;		
	}

	HyperFriendlyClient.prototype.root = function() {
		var self = this;

		var hyperFriendlyResult = new HyperFriendlyResult(self);
		self.do = function () {
			test.done(self.then);
		}

		self.then = function(result) {
			hyperFriendlyResult.do(result);
		}

		self.start = function() {
			self.do();
		}

		return hyperFriendlyResult;
	}


	
	var client = new HyperFriendlyClient('http://some.root.url/');

	client.root().follow('first_link').follow('second_link').result(function (result) {
		console.log('Done ' + result);
	});
}

example();