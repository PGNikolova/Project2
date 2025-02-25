<?php
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);
    include("config.php");
    header('Content-Type: application/json; charset=UTF-8');

    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    if (mysqli_connect_errno()) {
        echo json_encode(["status" => ["code" => "300", "name" => "failure", "description" => "Database unavailable"]]);
        exit;
    }

    $locationID = $_REQUEST['id'];

    // Check if departments exist in this location
    $checkQuery = $conn->prepare('SELECT COUNT(*) FROM department WHERE locationID = ?');
    $checkQuery->bind_param("i", $locationID);
    $checkQuery->execute();
    $checkQuery->bind_result($count);
    $checkQuery->fetch();
    $checkQuery->close();

    if ($count > 0) {
        echo json_encode(["status" => ["code" => "409", "name" => "conflict", "description" => "This location has departments assigned and cannot be deleted."]]);
        exit;
    }

    // Proceed with deletion if no dependencies exist
    $deleteQuery = $conn->prepare('DELETE FROM location WHERE id = ?');
    $deleteQuery->bind_param("i", $locationID);
    $deleteQuery->execute();

    if ($deleteQuery) {
        echo json_encode(["status" => ["code" => "200", "name" => "ok", "description" => "Location deleted successfully"]]);
    } else {
        echo json_encode(["status" => ["code" => "400", "name" => "error", "description" => "Query failed"]]);
    }

    $conn->close();
?>
