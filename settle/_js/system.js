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
	 * Adds back button to topbar
	 */
	function topbarBack() {
		/* TODO add after nav button, not before */
		document.getElementById('topbar').innerHTML = '<i onclick="window.history.back();" class="fa fa-chevron-left" aria-hidden="true"></i>' + document.getElementById('topbar').innerHTML;
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
		
		var value = document.getElementById('sidebar').style.display; //Get sidebar visibility
		
		//If sidebar is hidden
		if (value == 'none') {
			
			document.getElementById('sidebar').style.display = 'block'; //Display whole sidebar
			
			var side = document.getElementById('sidebar').getElementsByTagName('ul')[0];	//Get sidebar menu list element
			var left = -76;																	//Starting left position of menu
			
			//Set interval (1ms) for menu slider function
			var interval = setInterval(
				
				//Menu slider function
				function() {
					
					//If slider complete
					if (left == 0) {
						clearInterval(interval); //Clear interval
					}
					//Else, slide menu
					else {
						
						left = left + 1;					//Increment left position
						side.style.marginLeft = left + '%';	//Set new left position of menu
						
					}
					
				},
				
			1);
			
		}
		//Else, sidebar is visible
		else {
			
			var side = document.getElementById('sidebar').getElementsByTagName('ul')[0];	//Get sidebar menu list element
			var left = 0;																	//Starting left position of menu
			
			//Set interval (1ms) for menu slider function
			var interval = setInterval(
				
				//Menu slider function
				function() {
					
					//If slider complete
					if (left == -75) {
						
						document.getElementById('sidebar').style.display = 'none';	//Hide sidebar
						clearInterval(interval);									//Clear interval
						
					}
					//Else, slide menu
					else {
						
						left = left - 1;					//Decrement left position
						side.style.marginLeft = left + '%';	//Set new left position of menu
						
					}
					
				},
				
			1);
			
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
				
					payments[i] = new Payment(payments[i]); //Create new Payment object from JSON
					
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
		
		topbarBack(); //Add back button
		
		var payment_id = getParam('payment'); //Get payment ID

		//If payment ID is present
		if (payment_id != null && payment_id != '') {
		
			//Get single payment
			payment_request = new XMLHttpRequest(); //Create new AJAX request object
			
			//Handle various callbacks from request
			payment_request.onreadystatechange = function() {
			
				//Once request is complete
				if (payment_request.readyState == 4 && payment_request.status == 200) {
					
					var payment = JSON.parse(payment_request.responseText); //Parse response
					
					//Parse response again to create host user
					var host = JSON.parse(payment_request.responseText);	//(Little bit convoluted but really helpful)
					host.id = payment.host_user;							//Update host id before initialising
					host = new User(host);									//Initialise host as User object
					
					//Load page content
					document.title = payment.name + ' ' + document.title;										//Update page title
					document.getElementById('topbar').getElementsByTagName('h1')[0].innerHTML = payment.name;	//Update page heading
					
					document.getElementById('total_total').innerHTML = payment.total; //Update payment total heading value
					
					document.getElementById('details').innerHTML = host;									//Add host details to details section
					document.getElementById('details').innerHTML += '<p>' + payment.description + '</p>';	//Add payment description to details section
					
				}
				
			};
			
			payment_request.open('GET', server + handle + 'payment=' + payment_id, false);	//Specify AJAX request
			payment_request.send();															//And send
			
			//Get payment contributors
			members_request = new XMLHttpRequest(); //Create new AJAX request object
			
			//Handle various callbacks from request
			members_request.onreadystatechange = function() {
			
				//Once request is complete
				if (members_request.readyState == 4 && members_request.status == 200) {
					
					members = JSON.parse(members_request.responseText); //Parse response
	
					//Calculate page overview heading totals
					var remaining	= 0;
					var paid		= 0;
	
					//Convert parsed JSON objects into User objects
					for (var i in members) {
					
						members[i] = new User(members[i]); //Create new User object from JSON
						
						document.getElementById('members').innerHTML += '<li>' + members[i] + '<hr /></li>'; //Add contributor to list on page
						
						//If payment is paid
						if (members[i].settled == 1) {
							paid += members[i].amount; //Add amount to total paid
						}
						//Else payment not paid
						else {
							remaining += members[i].amount; //Add amount to total remaining
						}
						
					}
					
					document.getElementById('paid_total').innerHTML = parseFloat(Math.round(Math.abs(paid) * 100) / 100).toFixed(2);	//Set paid value, formatted two decimal places
					document.getElementById('paid_total').setAttribute('class', (paid > 0 ? 'green' : 'red'));							//Set owes colour
					
					document.getElementById('remaining_total').innerHTML = parseFloat(Math.round(Math.abs(remaining) * 100) / 100).toFixed(2); //Set remaining value, formatted two decimal places
					
				}
				
			};
			
			members_request.open('GET', server + handle + 'contributors=' + payment_id, false);	//Specify AJAX request
			members_request.send();																//And send
			
		}
		//Else, TODO handle error
		else {
			window.location = 'dashboard.html?id=' + id; //Return to dashboard
		}
	
	}