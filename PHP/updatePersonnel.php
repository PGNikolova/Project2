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
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    mysqli_close($conn);
    echo json_encode($output);
    exit;
}	

$query = $conn->prepare('UPDATE personnel 
                         SET firstName = ?, lastName = ?, email = ?, departmentID = ? 
                         WHERE id = ?');

if ( false === $query ) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "failed";
    $output['status']['description'] = "query preparation failed";
    $output['data'] = [];
    mysqli_close($conn);
    echo json_encode($output);
    exit;
}

// Bind parameters using "sssii" for three strings and two integers.
$query->bind_param(
    "sssii",
    $_POST['firstName'],    // firstName as string
    $_POST['lastName'],     // lastName as string
    $_POST['email'],        // email as string
    $_POST['departmentID'], // departmentID as integer
    $_POST['id']            // id as integer from your hidden field
);

$query->execute();

if ( false === $query ) {
    $output['status']['code'] = "401";
    $output['status']['name'] = "failed";
    $output['status']['description'] = "query execution failed";
    $output['data'] = [];
    mysqli_close($conn);
    echo json_encode($output);
    exit;
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "personnel record updated successfully";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = [];

mysqli_close($conn);
echo json_encode($output);
?>
