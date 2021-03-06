<?php
/*
 * Author: Callan Heard (c.j.heard@ncl.ac.uk)
 * Project: NCL CSC3122: Mobile Computer Systems Development, Portfolio Part 2
 * Purpose: settle app handler for back-end requests to the database
 */

	//Allow cross-server requests
	header('Content-type: text/html');
	header('Access-Control-Allow-Origin: *');
 
	//Database Connection values
	$server_name	= 'localhost';
	$username		= 'root';
	$password		= '';
	$database_name	= 'settle';
 
	date_default_timezone_set("Europe/London"); //Set default timezone
	
	/*
	 * establish_connection function for establishing a connection to the database
	 */
	function establish_connection() {
		
		//Create new MySQLi connection
		$connection = new mysqli(
			$GLOBALS['server_name'],
			$GLOBALS['username'],
			$GLOBALS['password'],
			$GLOBALS['database_name']
		);

		//Check connection
		if ($connection->connect_error) {
			die("Connection failed: " . $connection->connect_error);    //Die if error occurred
		}
		else {
			return $connection;                                         //Or return the connection
		}
		
	}
	
	/*
	 * Handle profile requests
	 */
	if (isset($_GET['user'])) {
		
		$connection = establish_connection(); //Establish database connection
		
		$sql = "SELECT * FROM user WHERE id = {$_GET['user']}";	//Generate SQL
		$result = $connection->query($sql);						//And execute
		
		//There should only be one
		if ($result->num_rows == 1) {
			echo json_encode($result->fetch_assoc()); //Return user details as JSON object
		}
		
		$connection->close(); //Close database connection
		
	}
	
	/*
	 * Handle checks for notifications
	 */
	if (isset($_GET['checkNotifications'])) {
		
		$connection = establish_connection(); //Establish database connection
		
		//Generate SQL
		$sql = "SELECT COUNT(*) AS 'total'
				FROM notification
				WHERE recipient_id = {$_GET['checkNotifications']} AND confirmed = 0";
		
		$result = $connection->query($sql); //And execute
		
		//There should only be one
		if ($result->num_rows == 1) {
			echo json_encode($result->fetch_assoc()); //Return notification total as JSON object
		}
		
		$connection->close(); //Close database connection
		
	}
	
	/*
	 * Handle notification list requests
	 */
	if (isset($_GET['notifications'])) {
		
		$connection = establish_connection(); //Establish database connection
		
		//Generate SQL
		$sql = "SELECT n.id, n.sender_id, n.recipient_id, n.payment_id, n.type, n.confirmed, u.id AS 'sender_id', u.first_name AS 'sender_first_name', u.last_name AS 'sender_last_name', p.id AS 'payment_id', p.name AS 'payment'
				FROM notification n, user u, payment p
				WHERE n.recipient_id = {$_GET['notifications']} AND n.confirmed = 0 AND u.id = n.sender_id AND p.id = n.payment_id";
		
		$result = $connection->query($sql); //And execute
		
		//If there is some results
		if ($result->num_rows > 0) {
		
			$results;	//Array for storing/returning results
			$i = 0;		//Counter for results
			
			//Loop through the results
			while ($row = $result->fetch_assoc()) {
				$results[$i++] = $row; //Add result to array
			}
			
			echo json_encode($results); //Return results as JSON object array
			
		}
		
		$connection->close(); //Close database connection
		
	}
	
	/*
	 * Handle notification confirmation
	 */
	if (isset($_GET['confirm']) && isset($_GET['type'])) {
		
		$connection = establish_connection(); //Establish database connection
		
		//Generate SQL for update
		$sql = "UPDATE notification SET confirmed = 1 WHERE id = {$_GET['confirm']}";
		
		$connection->query($sql); //And execute
		
		//If type is adding someone to a payment
		if ($_GET['type'] == 1) {
		
			//Generate SQL for full payment confirmation check
			$sql = "SELECT *
					FROM notification
					WHERE payment_id = (SELECT payment_id FROM notification WHERE id = {$_GET['confirm']}) AND type = 1 AND confirmed = 0";
			
			$result = $connection->query($sql); //And execute
			
			//If there is no results, payment fully confirmed
			if ($result->num_rows == 0) {
				
				//Generate SQL for update
				$sql = "UPDATE payment p
						SET p.confirmed = 1
						WHERE p.id = (SELECT n.payment_id FROM notification n WHERE n.id = {$_GET['confirm']})";
						
				$connection->query($sql); //And execute
				
			}
			
		}
		
		//If type is confirming payment
		if ($_GET['type'] == 2) {
			header("Location: handle.php?paid={$_GET['pid']}&contributor={$_GET['cid']}"); //Execute payment confirmation
		}
		
		$connection->close(); //Close database connection
		
	}
	
	/*
	 * Handle payment list requests
	 */
	if (isset($_GET['payments'])) {
		
		$connection = establish_connection(); //Establish database connection
		
		//Generate SQL - only get required columns to minimise server usage/traffic
		$sql = "SELECT p.id, p.name, p.total, p.contributors, c.amount, p.host_user, u.first_name, u.last_name
				FROM payment p INNER JOIN user u ON (p.host_user = u.id), contributes c
				WHERE c.user_id = {$_GET['payments']} AND c.payment_id = p.id AND c.settled = 0 AND p.confirmed = 1";
		
		$result = $connection->query($sql); //And execute
		
		$payments;	//Array for storing/returning results
		$i = 0;		//Counter for results
		
		//If there is some results
		if ($result->num_rows > 0) {

			$payments = Array();	//Initialise results array
			
			//Loop through the results
			while ($row = $result->fetch_assoc()) {
				$payments[$i++] = $row; //Add result to array
			}

		}
		
		//Generate SQL - only get required columns to minimise server usage/traffic
		$sql = "SELECT p.id, p.name, p.total, p.contributors, p.host_user, u.first_name, u.last_name
				FROM payment p, user u
				WHERE p.host_user = {$_GET['payments']} AND u.id = {$_GET['payments']} AND p.total > 0 AND p.confirmed = 1";
				
		$result = $connection->query($sql); //And execute
		
		//If there is some results
		if ($result->num_rows > 0) {
			
			//If results array has not been initialised (no outgoing payments)
			if (!isset($payments)) {
				$payments = Array(); //Initialise results array
			}
			
			//Loop through the results
			while ($row = $result->fetch_assoc()) {
				$payments[$i++] = $row; //Add result to array
			}
			
		}
		
		//If there are results
		if(isset($payments)) {
			echo json_encode($payments); //Return results as JSON object array
		}
		
		$connection->close(); //Close database connection
		
	}
	
	/*
	 * Handle payment requests
	 */
	if (isset($_GET['payment'])) {
		
		$connection = establish_connection(); //Establish database connection
		
		//Generate SQL - only get required columns to minimise server usage/traffic
		$sql = "SELECT p.name, p.description, p.total, p.host_user, u.email, u.first_name, u.last_name
				FROM payment p, user u
				WHERE p.id = {$_GET['payment']} AND u.id = p.host_user";

		$result = $connection->query($sql); //And execute
		
		//There should only be one
		if ($result->num_rows == 1) {
			echo json_encode($result->fetch_assoc()); //Return payment details as JSON object
		}
		
		$connection->close(); //Close database connection
		
	}
	
	/*
	 * Handle payment contributor list requests
	 */
	if (isset($_GET['contributors'])) {
		
		$connection = establish_connection(); //Establish database connection
		
		//Generate SQL - only get required columns to minimise server usage/traffic
		$sql = "SELECT u.id, u.first_name, u.last_name, u.email, c.amount, c.settled
				FROM user u, contributes c
				WHERE c.payment_id = {$_GET['contributors']} AND u.id = c.user_id";
		
		$result = $connection->query($sql); //And execute
		
		//If there is some results
		if ($result->num_rows > 0) {
		
			$results;	//Array for storing/returning results
			$i = 0;		//Counter for results
			
			//Loop through the results
			while ($row = $result->fetch_assoc()) {
				$results[$i++] = $row; //Add result to array
			}
			
			echo json_encode($results); //Return results as JSON object array
			
		}
		
		$connection->close(); //Close database connection
		
	}
	
	/*
	 * Handle host user contributor payment notification checks
	 */
	if (isset($_GET['checkNotify'])) {
		
		$connection = establish_connection(); //Establish database connection
		
		//Generate SQL for check for completed payment
		$sql = "SELECT *
				FROM contributes
				WHERE user_id = {$_GET['checkNotify']} AND payment_id = {$_GET['pid']} AND settled = 1";
		
		$result = $connection->query($sql); //And execute
		
		//If notification exists
		if ($result->num_rows > 0) {
			echo 'true'; //Echo true
		}
		//Else, check for notification
		else {
			
			//Generate SQL for check for notification
			$sql = "SELECT *
					FROM notification
					WHERE sender_id = {$_GET['checkNotify']} AND payment_id = {$_GET['pid']} AND type = 2 AND confirmed = 0";
			
			$result = $connection->query($sql); //And execute
			
			//If notification exists
			if ($result->num_rows > 0) {
				echo 'true'; //Echo true
			}
			
		}
		
		$connection->close(); //Close database connection
		
	}
	
	/*
	 * Handle notifying host user of contributor payment
	 */
	if (isset($_GET['notify'])) {
		
		$connection = establish_connection(); //Establish database connection
		
		//Generate SQL for adding new notification
		$sql = "INSERT INTO notification (sender_id, recipient_id, payment_id, type)
				VALUES (
					'{$_GET['notify']}',
					(SELECT host_user FROM payment WHERE id = {$_GET['pid']}),
					'{$_GET['pid']}',
					'2'
				)";
		
		$connection->query($sql); //And execute
		
		$connection->close(); //Close database connection
		
	}
	
	/*
	 * Handle contributor payment
	 */
	if (isset($_GET['paid']) && isset($_GET['contributor'])) {
		
		$connection = establish_connection(); //Establish database connection
	
		//Generate SQL for required values
		$sql = "SELECT u.score, p.date, (SELECT COUNT(*) FROM contributes c WHERE c.user_id = {$_GET['contributor']}) AS 'count'
				FROM user u, payment p
				WHERE u.id = {$_GET['contributor']} AND p.id = {$_GET['paid']}";
		
		$result = $connection->query($sql); //Retrieve required values

		//There should only be one
		if ($result->num_rows == 1) {
		
			$values = $result->fetch_assoc(); //Get result values

			$time = time() - $values['date']; //Calculate time since creation time

			/* TODO make this better: incorporate amount paid back? */
			//Calculate score based on time
			$score = $values['score'];
			
			if ($time < 3600)			$score += 10;	//If time taken to pay is less than an hour
			else if ($time < 43200)		$score += 8;	//If time taken to pay is less than 12 hours
			else if ($time < 86400)		$score += 5;	//If time taken to pay is less than 24 hours
			else if ($time < 604800)	$score += 2;	//If time taken to pay is less than a week
			else if ($time < 2592000)	$score += 1;	//If time taken to pay is less than 30 days
			else if ($time < 5184000)	$score += 0.5;	//If time taken to pay is less than 60 days

			$percentage = $score / ($values['count'] * 10) * 100; //Calculate user score percentage of maximum possible score
			
			//Generate SQL for updates
			$sql1 = "UPDATE contributes c
					SET c.settled = 1
					WHERE c.payment_id = {$_GET['paid']} AND c.user_id = {$_GET['contributor']}";
					
			$sql2 = "UPDATE payment p INNER JOIN contributes c ON (c.payment_id = p.id)
					SET p.total = p.total - c.amount, p.contributors = p.contributors - 1
					WHERE p.id = {$_GET['paid']} AND c.user_id = {$_GET['contributor']}";
					
			$sql3 = "UPDATE user SET score = {$score}, percentage = {$percentage} WHERE id = {$_GET['contributor']}";

			/* TODO very bad - should be transaction handling rollbacks etc */
			$connection->query($sql1);
			$connection->query($sql2);
			$connection->query($sql3);
			
		}
		
		$connection->close(); //Close database connection
		
	}
	
	/*
	 * Handle quick user requests (when adding members to a new payment)
	 */
	if (isset($_GET['newUser'])) {
		
		$connection = establish_connection(); //Establish database connection
	
		//Generate SQL for required values
		$sql = "SELECT id, first_name, last_name, email, percentage
				FROM user
				WHERE pin = \"{$_GET['newUser']}\"";
				
		$result = $connection->query($sql); //And execute
		
		//There should only be one
		if ($result->num_rows == 1) {
			echo json_encode($result->fetch_assoc()); //Return user details as JSON object
		}
		
		$connection->close(); //Close database connection
		
	}
	
	/*
	 * Handle create payment requests
	 */
	if (isset($_POST['createPayment'])) {
		
		//Server-side check form entries have been submitted
		if (isset($_POST['name']) && isset($_POST['pounds']) && isset($_POST['pennies']) && isset($_POST['members'])) {
			
			$connection = establish_connection(); //Establish database connection
		
			$total	= mysqli_real_escape_string($connection, $_POST['pounds']).'.'.mysqli_real_escape_string($connection, $_POST['pennies']);	//Total payment amounts combined
			$amount	= floor(($total / (count($_POST['members']) + 1)) * 100) / 100;																//Each member contribution amount (+1 for host who has paid) (rounded down to nearest penny)
			
			/* TODO again, very bad - should be transaction handling rollbacks etc */
			
			//Generate SQL for creating new payment
			$sql = "INSERT INTO payment (name, description, total, host_user, contributors, date)
					VALUES (
						'".mysqli_real_escape_string($connection, $_POST['name'])."',
						'".(isset($_POST['description']) ? mysqli_real_escape_string($connection, $_POST['description']) : '')."',
						'".($total - $amount)."',
						'{$_GET['id']}',
						'".count($_POST['members'])."',
						'".time()."'
					)";
					
			$connection->query($sql); //And execute
			
			$payment_id = mysqli_insert_id($connection); //New payment ID
			
			//Add contributor/notification table entries for each payment member
			foreach ($_POST['members'] as $member) {
				
				//Generate SQL for adding new contribution
				$sql = "INSERT INTO contributes (user_id, payment_id, amount)
						VALUES (
							'{$member}',
							'{$payment_id}',
							'{$amount}'
						)";
				
				$connection->query($sql); //And execute
				
				//Generate SQL for adding new notification
				$sql = "INSERT INTO notification (sender_id, recipient_id, payment_id, type)
						VALUES (
							'{$_GET['id']}',
							'{$member}',
							'{$payment_id}',
							'1'
						)";
				
				$connection->query($sql); //And execute
				
			}
			
			$connection->close(); //Close database connection
		
		}
		//Else, something missing
		else {
			//Handle error
		}
		
	}