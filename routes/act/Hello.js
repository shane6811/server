function Hello() { 
	var name="default Name"; 
	this.setName = function(thyName) { 
		name = thyName; 
	}; 
	this.sayHello = function() { 
		return 'Hello ' + name;
		console.log('Hello ' + name); 
	}; 
}; 
module.exports = Hello;