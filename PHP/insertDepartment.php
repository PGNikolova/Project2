<?php
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "Database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}

	// Check if required fields are missing
	if (!isset($_POST['name']) || !isset($_POST['locationID'])) {
		$output['status']['code'] = "400";
		$output['status']['name'] = "missing parameters";
		$output['status']['description'] = "Missing department name or locationID.";
		echo json_encode($output);
		exit;
	}

	$name = trim($_POST['name']);
	$locationID = (int)$_POST['locationID'];

	if ($name === "" || $locationID <= 0) {
		$output['status']['code'] = "400";
		$output['status']['name'] = "invalid data";
		$output['status']['description'] = "Invalid department name or locationID.";
		echo json_encode($output);
		exit;
	}

	// Find the next available ID manually (prevent ID gaps)
	$nextIDQuery = $conn->query("SELECT IFNULL(MAX(id) + 1, 1) AS nextID FROM department");
	$nextIDRow = $nextIDQuery->fetch_assoc();
	$nextID = $nextIDRow['nextID'];

	// Manually insert with a specific ID
	$query = $conn->prepare('INSERT INTO department (id, name, locationID) VALUES (?, ?, ?)');
	$query->bind_param("isi", $nextID, $name, $locationID);

	if ($query->execute()) {
		$output['status']['code'] = "200";
		$output['status']['name'] = "ok";
		$output['status']['description'] = "success";
		$output['last_inserted_id'] = $nextID;
	} else {
		$output['status']['code'] = "500";
		$output['status']['name'] = "query error";
		$output['status']['description'] = "Database error: " . $conn->error;
	}

	$query->close();
	mysqli_close($conn);

	echo json_encode($output);
?>
