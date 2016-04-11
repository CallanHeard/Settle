<?php
/*
 * Author: Callan Heard (c.j.heard@ncl.ac.uk)
 * Project: NCL CSC3122: Mobile Computer Systems Development, Portfolio Part 2
 * Purpose: settle app handler for back-end requests to the database
 */

	//Database Connection values
	$server_name	= 'localhost';
	$username		= 'root';
	$password		= '';
	$database_name	= 'settle';

	//Function for establishing a connection to the database
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

	//Code for handling log-in request
	if (isset($_GET['login'])) {
		
		header('Location: settle/dashboard.html');
		
	}
	
?>