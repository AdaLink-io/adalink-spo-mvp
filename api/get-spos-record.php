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

$data = [];

if ($result && $result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    $poolId = $row['PoolID'];
    $data[$poolId] = [
      "Ticker" => $row["Ticker"],
      "DisplayName" => $row["DisplayName"],
      "PFP" => $row["PFP"],
      "LiveStake" => is_numeric($row["LiveStake"]) ? (float)$row["LiveStake"] : $row["LiveStake"],
      "Saturation" => is_numeric($row["Saturation"]) ? (float)$row["Saturation"] : $row["Saturation"],
    ];
  }
}

echo json_encode($data, JSON_UNESCAPED_SLASHES);
$conn->close();
