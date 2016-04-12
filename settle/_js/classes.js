/*
* Author: Callan Heard (c.j.heard@ncl.ac.uk)
* Project: NCL CSC3122: Mobile Computer Systems Development, Portfolio Part 2
* Purpose: settle app class definitions
*/

	var server		= 'http://localhost/csc3122/';	//Back-end server location
	var handle		= 'handle.php?';				//Handler file name
	var profiles	= 'profiles/';					//Profile images directory name

	/*
	 * User class definition
	 */
	function User(json) {
		
		for (var property in json) this[sanitise(property)] = json[property]; //Initialise object from JSON
		
		this.fullName	= this.firstName + ' ' + this.lastName; //Initialise full name
		this.profile	= server + profiles + this.id + '.jpg'; //Initialise link to profile image
		
	}
	
	/*
	 * User class prototype
	 */
	User.prototype = {
		
		/* TODO pin and score */
		
		//Override class toString method to generate mark-up
		toString: function() {
			
			var returnString = ''; //String for storing mark-up to be returned
			
			returnString += '<div class="profile">\
<img src="' + this.profile + '" alt="' + this.fullName + '\'s Profile Image" />\
<p>' + this.fullName + '</p>\
<p>' + this.email + '</p>\
<p>Score: <span>0</span></p></div>';
			
			return returnString; //Return generated mark-up
			
		}
		
	}
	
	/*
	 * Payment class
	 */
	function Payment(json) {
		
		for (var property in json) this[sanitise(property)] = json[property]; //Initialise object from JSON
		
		this.hostName	= this.firstName + ' ' + this.lastName;			//Initialise full name
		this.profile	= server + profiles + this.hostUser + '.jpg';	//Initialise link to profile image
		
	}
	
	/*
	 * Payment class prototype
	 */
	Payment.prototype = {
		
		//Override class toString method to generate mark-up
		toString: function() {
			
			var returnString = ''; //String for storing mark-up to be returned
			
			returnString += '<!-- Payment ' + this.id + ' -->\
<li class="payment clear">\
<a href="#" class="clear">\
<img src="' + this.profile + '" /> <!-- Payment host profile image -->\
<div class="details">\
<div class="left">\
<p>' + this.name + '</p>\
<p>' + this.hostName + '</p>\
</div>\
<p class="amount">' + this.amount + '</p>\
</div>\
</a>\
<hr />\
</li>';
			
			return returnString; //Return generated mark-up
			
		}
		
	}
	
	/*
	 * Sanitise function for sanitising field from database into JavaScript convention (convert '_' spaced into CamelCase)
	 */
	function sanitise(string) {
		
		parts = string.split('_'); //Get each part of field name
		
		//Capitalise first letter of each part (other than first)
		for (var i=1; i<parts.length; i++){
			parts[i] = parts[i].charAt(0).toUpperCase() + parts[i].substr(1);
		}  
		
		return parts.join(''); //Recombine into string and return
		
	}