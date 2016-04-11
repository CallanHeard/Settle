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
		
		this.fullName	= this.firstName + ' ' + this.lastName;	//Initialise full name
		this.profile	= server + profiles + this.id;			//Initialise link to profile image
		
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