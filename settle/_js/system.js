/*
* Author: Callan Heard (c.j.heard@ncl.ac.uk)
* Project: NCL CSC3122: Mobile Computer Systems Development, Portfolio Part 2
* Purpose: settle app many system logic/scripts
*/

	var server = 'http://localhost/csc3122/';	//Back-end server location
	var handle = 'handle.php?';					//Handler file name
	var user;

	/*
	* load function for retrieving page content from database
	*/
	function load(nav) {

		var id = getParam('id'); //Get user ID

		//If ID is present
		if (id != null && id != '') {

			//Get user details
			xmlhttp = new XMLHttpRequest(); //Create new AJAX request object
			
			//Handle various callbacks from request
			xmlhttp.onreadystatechange = function() {
			
				//Once request is complete
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					user = new User(JSON.parse(xmlhttp.responseText)); //Instantiate user object from JSON response
				}
				
			}
			
			xmlhttp.open('GET', server + handle + 'user=' + id, false);	//Specify AJAX request
			xmlhttp.send();												//And send

			//If page required sidebar
			if (nav) {
				sidebar();
			}
			
		}
		//Else, TODO handle error
		else {
			window.location = 'index.html'; //Return to login page
		}

	}

	/*
	* getParam function for retrieving a query parameter from the URL string
	* Source: http://stackoverflow.com/a/901144/2030247
	*/
	function getParam(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
		results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}
	
	/*
	 * sidebar function for adding navigational sidebar to page
	 */
	function sidebar() {

		var markup = '<div id="sidebar">' + user + '\
<ul>\
<li>Dashboard</li>\
<li>Notifications</li>\
<li>New Payment</li>\
<li>Account</li>\
</ul>\
</div>';
		
		document.body.innerHTML += markup;
		
	}