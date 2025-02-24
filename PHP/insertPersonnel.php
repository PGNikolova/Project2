<?php
include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if ($conn->connect_errno) {
    echo json_encode(["status" => ["code" => "300", "message" => "Database unavailable"], "error" => $conn->connect_error]);
    exit();
}

// Validate input
if (!isset($_POST['firstName'], $_POST['lastName'], $_POST['jobTitle'], $_POST['email'], $_POST['departmentID'])) {
    echo json_encode(["status" => ["code" => "400", "message" => "Missing required fields"]]);
    exit();
}

// Ensure department exists
$deptCheck = $conn->prepare("SELECT id FROM department WHERE id = ?");
$deptCheck->bind_param("i", $_POST['departmentID']);
$deptCheck->execute();
$deptCheck->store_result();

if ($deptCheck->num_rows === 0) {
    echo json_encode(["status" => ["code" => "400", "message" => "Invalid department ID"]]);
    exit();
}

// Find the lowest available personnel ID
$findGapQuery = "SELECT MIN(t1.id + 1) AS nextAvailableID 
                 FROM personnel t1 
                 LEFT JOIN personnel t2 ON t1.id + 1 = t2.id 
                 WHERE t2.id IS NULL";
$gapResult = $conn->query($findGapQuery);
$nextID = $gapResult->fetch_assoc()['nextAvailableID'];

if (!$nextID) {
    // If no gaps, use the normal auto-increment value
    $nextID = NULL;
}

// Insert personnel manually specifying ID if a gap exists
if ($nextID) {
    $query = $conn->prepare('INSERT INTO personnel (id, firstName, lastName, jobTitle, email, departmentID) VALUES (?, ?, ?, ?, ?, ?)');
    $query->bind_param("issssi", $nextID, $_POST['firstName'], $_POST['lastName'], $_POST['jobTitle'], $_POST['email'], $_POST['departmentID']);
} else {
    $query = $conn->prepare('INSERT INTO personnel (firstName, lastName, jobTitle, email, departmentID) VALUES (?, ?, ?, ?, ?)');
    $query->bind_param("ssssi", $_POST['firstName'], $_POST['lastName'], $_POST['jobTitle'], $_POST['email'], $_POST['departmentID']);
}

$query->execute();

// Verify the insert
if ($query->affected_rows > 0) {
    echo json_encode(["status" => ["code" => "200", "message" => "Success"], "last_inserted_id" => $conn->insert_id]);
} else {
    echo json_encode(["status" => ["code" => "400", "message" => "Insert failed", "sql_error" => $conn->error]]);
}

$conn->close();
?>
