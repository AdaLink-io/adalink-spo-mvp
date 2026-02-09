<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

$table = "StakePools";
$servername = "localhost";
$username = "adaldlee_fourzin";
$password = "YA,SODvt-.X^";
$dbname = "adaldlee_adalink";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["error" => "DB connection failed"]);
  exit;
}

$sql = "SELECT PoolID, Ticker, DisplayName, PFP, LiveStake, Saturation FROM $table";
$result = $conn->query($sql);

$out = []; // IMPORTANT: this is an object map keyed by PoolID

if ($result && $result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    $poolId = $row['PoolID'];
    unset($row['PoolID']);          // remove PoolID from inner object
    $out[$poolId] = $row;           // map PoolID -> row data
  }
}

echo json_encode($out, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
$conn->close();
