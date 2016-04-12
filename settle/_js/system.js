/*
* Author: Callan Heard (c.j.heard@ncl.ac.uk)
* Project: NCL CSC3122: Mobile Computer Systems Development, Portfolio Part 2
* Purpose: settle app many system logic/scripts
*/

	var server = 'http://localhost/csc3122/';	//Back-end server location
	var handle = 'handle.php?';					//Handler file name
	
	var id;			//Current user ID
	var user;		//Current user
	var payments;	//Current user's payments

	/*
	 * load function for retrieving page content from database
	 */
	function load(top, nav) {

		id = getParam('id'); //Get user ID

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
				
			};
			
			xmlhttp.open('GET', server + handle + 'user=' + id, false);	//Specify AJAX request
			xmlhttp.send();												//And send

			//If page requires topbar
			if (top) {
				topbar(top); //Add topbar to page
			}
			
			//If page required sidebar
			if (nav) {
				sidebar(); //Add sidebar to page
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
	 * topbar function for adding navigational topbar to page
	 */
	function topbar(title) {
		
		//Generate markup
		var markup = '<!-- Page top bar -->\
<div id="topbar" class="clear">\
<a href="#" onclick="toggleNav();"><i class="fa fa-bars" aria-hidden="true"></i></a> <!-- Show nav overlay button -->\
<h1>' + title + '</h1> <!-- Main page title --></div>';
		
		document.body.innerHTML = markup + document.body.innerHTML; //Append markup to page
		
	}
	
	/*
	 * sidebar function for adding navigational sidebar to page
	 */
	function sidebar() {

		//Generate markup
		var markup = '<!-- Page navigation -->\
<div id="sidebar" style="display: none">\
<div class="overlay" onclick="toggleNav();"></div>\
<ul>\
<li>' + user + '</li>\
<li><a href="#">Dashboard<i class="fa fa-home" aria-hidden="true"></i></a></li>\
<li><a href="#">Notification<i class="fa fa-flag" aria-hidden="true"></i></a></li>\
<li><a href="#">New Payment<i class="fa fa-plus" aria-hidden="true"></i></a></li>\
<li><a href="#">Account<i class="fa fa-wrench" aria-hidden="true"></i></a></li>\
</ul>\
</div>';
		
		document.body.innerHTML += markup; //Append markup to page
		
	}
	
	/*
	 * toggleNav function for showing/hiding sidebar
	 */
	function toggleNav() {
		
		/* TODO Slide plugin */
		var value = document.getElementById('sidebar').style.display;//Get sidebar visibility
		
		//If sidebar is hidden
		if (value == 'none') {
			document.getElementById('sidebar').style.display = 'block'; //Display sidebar
		}
		//Else, sidebar is visible
		else {
			document.getElementById('sidebar').style.display = 'none'; //Hide sidebar
		}
		
		
	}
	
	/*
	 * dashboard function for loading dashboard page content
	 */
	function dashboard() {
		
		//Get all incoming payments
		xmlhttp = new XMLHttpRequest(); //Create new AJAX request object
		
		//Handle various callbacks from request
		xmlhttp.onreadystatechange = function() {
		
			//Once request is complete
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				
				payments = JSON.parse(xmlhttp.responseText); //Parse response
				
				//Convert parsed JSON objects into Payment objects
				for (var i = 0; i < payments.length; i++) {
				
					payments[i] = new Payment(payments[i]);																		//Create new Payment object from JSON
					
					document.getElementById(payments[i].orientation).style.display = 'block';									//Show list heading
					document.getElementById(payments[i].orientation).getElementsByTagName('ul')[0].innerHTML += payments[i];	//Add Payment to page
				
				}
				
			}
			
		};
		
		xmlhttp.open('GET', server + handle + 'payments=' + id, false);	//Specify AJAX request
		xmlhttp.send();													//And send
		
		//If there are no payments
		if (document.getElementById('owes').style.display == '' && document.getElementById('owed').style.display == '') {
			document.body.innerHTML += '<p>No payments found! Click the link above to create one, or use your PIN to join someone else\'s</p>';
		}
		
	}