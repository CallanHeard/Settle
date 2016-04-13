/*
* Author: Callan Heard (c.j.heard@ncl.ac.uk)
* Project: NCL CSC3122: Mobile Computer Systems Development, Portfolio Part 2
* Purpose: settle app many system logic/scripts
*/

	var server		= 'http://localhost/csc3122/';	//Back-end server location
	var handle		= 'handle.php?';				//Handler file name
	var profiles	= 'profiles/';					//Profile images directory name
	
	var id;			//Current user ID
	var user;		//Current user
	var payments;	//Current user's payments
	
	var currentHeading = 0; //Starting page overview heading

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
				sidebar(nav); //Add sidebar to page
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
<i onclick="toggleNav();" class="fa fa-bars" aria-hidden="true"></i> <!-- Show nav overlay button -->\
<h1>' + title + '</h1> <!-- Main page title --></div>';
		
		document.body.innerHTML = markup + document.body.innerHTML; //Append markup to page
		
	}
	
	/*
	 * sidebar function for adding navigational sidebar to page
	 */
	function sidebar(selected) {

		//Generate markup
		var markup = '<!-- Page navigation -->\
<div id="sidebar" style="display: none">\
<div class="overlay" onclick="toggleNav();"></div>\
<ul>\
<li>' + user.displayProfile() + '</li>\
<li><a href="dashboard.html?id=' + id + '"' + (selected == 'dashboard' ? ' class="selected"' : '') + '>Dashboard<i class="fa fa-home" aria-hidden="true"></i></a></li>\
<li><a href="#">Notifications<i class="fa fa-flag" aria-hidden="true"></i></a></li>\
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
	 * toggleHeading function for switching between displayed page overview headings
	 */
	function toggleHeading(heading) {
		
		var headings = document.getElementById('totals').getElementsByTagName('div'); //Get page overview headings
		
		heading.removeAttribute('class');													//Hide previous heading
		currentHeading = currentHeading == headings.length - 1 ? 0 : currentHeading + 1;	//Loop pointer through overview headings														//Loop through dashboard heading numbers
		headings[currentHeading].setAttribute('class', 'selected');							//Show new dashboard heading
		
	}
	
	/*
	 * dashboard function for loading dashboard page content
	 */
	function dashboard() {
		
		//Get all user payments
		xmlhttp = new XMLHttpRequest(); //Create new AJAX request object
		
		//Handle various callbacks from request
		xmlhttp.onreadystatechange = function() {
		
			//Once request is complete
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				
				payments = JSON.parse(xmlhttp.responseText); //Parse response
				
				//Convert parsed JSON objects into Payment objects
				for (var i in payments) {
				
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
		
		//Calculate page overview heading totals
		var balance	= 0;
		var owes	= 0;
		var owed	= 0;
		
		//For each payment in payments
		for (var i in payments) {
			
			balance	+= payments[i].orientation == 'owes' ? -payments[i].amount : payments[i].total;	//Update balance
			owes	+= payments[i].orientation == 'owes' ? payments[i].amount : 0;					//Update owes
			owed	+= payments[i].orientation == 'owed' ? payments[i].total : 0;					//Update owed
			
		}
		
		/* TODO responsive total value size */
		
		//Set balance heading/total
		document.getElementById('balance_total').innerHTML = parseFloat(Math.round(Math.abs(balance) * 100) / 100).toFixed(2);						//Set balance value, formatted two decimal places
		document.getElementById('balance_total').setAttribute('class', 'selected' + (balance < 0 ? ' red' : '') + (balance > 0 ? ' green' : ''));	//Set balance colour
		
		document.getElementById('owes_total').innerHTML = parseFloat(Math.round(Math.abs(owes) * 100) / 100).toFixed(2);	//Set owes value, formatted two decimal places
		document.getElementById('owes_total').setAttribute('class', (owes > 0 ? 'red' : 'green'));							//Set owes colour
		
		document.getElementById('owed_total').innerHTML = parseFloat(Math.round(Math.abs(owed) * 100) / 100).toFixed(2);	//Set owed value, formatted two decimal places
		if (owed > 0) document.getElementById('owed_total').setAttribute('class', 'green');									//Set owed colour
		
		document.getElementById('totals').getElementsByTagName('div')[currentHeading].setAttribute('class', 'selected'); //Show starting page overview heading
		
	}
	
	/*
	 * payment function for loading view payment page content
	 */
	function payment() {
		
		var payment_id = getParam('payment'); //Get payment ID

		//If payment ID is present
		if (payment_id != null && payment_id != '') {
		
			//Get single payment
			xmlhttp = new XMLHttpRequest(); //Create new AJAX request object
			
			//Handle various callbacks from request
			xmlhttp.onreadystatechange = function() {
			
				//Once request is complete
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					
					var payment = JSON.parse(xmlhttp.responseText); //Parse response
					
					//Parse response again to create host user
					var host = JSON.parse(xmlhttp.responseText);	//(Little bit convoluted but really helpful)
					host.id = payment.host_user;					//Update host id before initialising
					host = new User(host);							//Initialise host as User object
					
					//Load page content
					document.title = payment.name + ' ' + document.title;										//Update page title
					document.getElementById('topbar').getElementsByTagName('h1')[0].innerHTML = payment.name;	//Update page heading
					
					document.getElementById('total_total').innerHTML = payment.total; //Update payment total heading value
					
					document.getElementById('details').innerHTML = host;
					
				}
				
			};
			
			xmlhttp.open('GET', server + handle + 'payment=' + payment_id, false);	//Specify AJAX request
			xmlhttp.send();															//And send
			
		}
		//Else, TODO handle error
		else {
			window.location = 'dashboard.html?id=' + id; //Return to dashboard
		}
	
	}