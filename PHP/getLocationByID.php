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
    $output['status']['returnedIn'] = ((microtime(true) - $executionStartTime) / 1000) . " ms";
    $output['data'] = [];
    mysqli_close($conn);
    echo json_encode($output);
    exit;
}

// Get the location id from the GET or POST parameters
$locationID = isset($_GET['id']) ? $_GET['id'] : (isset($_POST['id']) ? $_POST['id'] : null);

if (!$locationID) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "error";
    $output['status']['description'] = "No location id provided";
    $output['data'] = [];
    mysqli_close($conn);
    echo json_encode($output);
    exit;
}

$query = $conn->prepare('SELECT id, name FROM location WHERE id = ?');
if ( false === $query ) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "failed";
    $output['status']['description'] = "query preparation failed";
    $output['data'] = [];
    mysqli_close($conn);
    echo json_encode($output);
    exit;
}

$query->bind_param("i", $locationID);
$query->execute();

$result = $query->get_result();
$data = $result->fetch_assoc();

if (!$data) {
    $output['status']['code'] = "404";
    $output['status']['name'] = "not found";
    $output['status']['description'] = "No location found with that id";
    $output['data'] = [];
} else {
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "Location retrieved successfully";
    $output['status']['returnedIn'] = ((microtime(true) - $executionStartTime) / 1000) . " ms";
    $output['data'] = $data;
}

mysqli_close($conn);
echo json_encode($output);
?>
