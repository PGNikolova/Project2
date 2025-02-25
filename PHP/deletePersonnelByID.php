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

    $personnelID = $_REQUEST['id'];

    // Delete personnel
    $deleteQuery = $conn->prepare('DELETE FROM personnel WHERE id = ?');
    $deleteQuery->bind_param("i", $personnelID);
    $deleteQuery->execute();

    if ($deleteQuery) {
        echo json_encode(["status" => ["code" => "200", "name" => "ok", "description" => "Personnel deleted successfully"]]);
    } else {
        echo json_encode(["status" => ["code" => "400", "name" => "error", "description" => "Query failed"]]);
    }

    $conn->close();
?>
