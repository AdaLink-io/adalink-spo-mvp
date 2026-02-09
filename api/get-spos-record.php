<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

// ---- DB CONFIG (move to env/config later) ----
$servername = "localhost";
$username   = "adaldlee_fourzin";
$password   = "YA,SODvt-.X^";
$dbname     = "adaldlee_adalink";
$table      = "StakePools";

// ---- CONNECT ----
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode([
    "error" => "DB connection failed",
    "details" => $conn->connect_error
  ]);
  exit;
}

$conn->set_charset("utf8mb4");


$sql = "SELECT PoolID, Ticker, DisplayName, PFP, LiveStake, Saturation FROM `$table`";
$result = $conn->query($sql);

if (!$result) {
  http_response_code(500);
  echo json_encode([
    "error" => "Query failed",
    "details" => $conn->error
  ]);
  $conn->close();
  exit;
}

$data = [];

while ($row = $result->fetch_assoc()) {
  $poolId = $row["PoolID"];

  $liveStake   = is_numeric($row["LiveStake"]) ? (float)$row["LiveStake"] : null;
  $saturation  = is_numeric($row["Saturation"]) ? (float)$row["Saturation"] : null;

  $data[$poolId] = [
    "Ticker"      => $row["Ticker"],
    "DisplayName" => $row["DisplayName"],
    "PFP"         => $row["PFP"],
    "LiveStake"   => $liveStake,
    "Saturation"  => $saturation
  ];
}

$conn->close();

// IMPORTANT: encode the array (NOT a JSON string)
echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
