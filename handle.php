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
		
		$sql = "SELECT * FROM user WHERE id={$_GET['user']}";	//Generate SQL
		$result = $connection->query($sql);						//And execute
		
		//There should only be one
		if ($result->num_rows == 1) {
			echo json_encode($result->fetch_assoc()); //Return user details as JSON object
		}
		
		$connection->close(); //Close database connection
		
	}
	
	/*
	 * Handle payment list requests
	 */
	if (isset($_GET['payments'])) {
		
		$connection = establish_connection(); //Establish database connection
		
		//Generate SQL - only get required columns to minimise server usage/traffic
		$sql = "SELECT payment.id, payment.name, payment.total, payment.contributors, contributes.amount, payment.host_user, user.first_name, user.last_name
				FROM payment INNER JOIN user ON (payment.host_user = user.id), contributes
				WHERE contributes.user_id = {$_GET['payments']} AND contributes.settled = 0";
		
		$result = $connection->query($sql);						//And execute
		
		//If there is some payments
		if ($result->num_rows > 0) {

			$i = 0;					//Counter for results
			$payments = Array();	//Array to store/encode results
			
			//Loop through the results
			while ($row = $result->fetch_assoc()) {
				$payments[$i++] = $row; //Add result to array
			}
			
			echo json_encode($payments); //Return results as JSON object array

		}
		
		$connection->close(); //Close database connection
		
	}