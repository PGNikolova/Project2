<?php
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);
    include("config.php");
    header('Content-Type: application/json; charset=UTF-8');

    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    if (mysqli_connect_errno()) {
		error_log("Database connection failed.");
        echo json_encode(["status" => ["code" => "300", "name" => "failure", "description" => "Database unavailable"]]);
        exit;
    }

    $departmentID = $_REQUEST['id'];
	error_log("Received department ID: " . $departmentID);
    // Check if personnel exist in this department
    $checkQuery = $conn->prepare('SELECT COUNT(*) FROM personnel WHERE departmentID = ?');
    $checkQuery->bind_param("i", $departmentID);
    $checkQuery->execute();
    $checkQuery->bind_result($count);
    $checkQuery->fetch();
    $checkQuery->close();

    if ($count > 0) {
		error_log("Cannot delete department due to personnel dependency.");
        echo json_encode(["status" => ["code" => "409", "name" => "conflict", "description" => "This department has personnel assigned and cannot be deleted."]]);
        exit;
    }

    // Proceed with deletion if no dependencies exist
    $deleteQuery = $conn->prepare('DELETE FROM department WHERE id = ?');
    $deleteQuery->bind_param("i", $departmentID);
    $deleteQuery->execute();

    if ($deleteQuery) {
		error_log("Department deleted successfully.");
        echo json_encode(["status" => ["code" => "200", "name" => "ok", "description" => "Department deleted successfully"]]);
    } else {
		error_log("Deleting department failed.");
        echo json_encode(["status" => ["code" => "400", "name" => "error", "description" => "Query failed"]]);
    }

    $conn->close();
?>
