<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

$table = "StakePools";
$servername = "localhost";
$username = "adaldlee_fourzin";
$password = "YA,SODvt-.X^";
$dbname = "adaldlee_adalink";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode([
    "error" => "Connection failed",
    "details" => $conn->connect_error
  ]);
  exit;
}

// Recommended if non-ascii text exists
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

// Build an object keyed by PoolID
$out = [];

while ($row = $result->fetch_assoc()) {
  $poolId = (string)($row['PoolID'] ?? '');

  // Normalize any backslashes in URLs/paths
  $pfp = isset($row['PFP']) ? str_replace("\\", "/", $row['PFP']) : "";

  $out[$poolId] = [
    "Ticker"      => (string)($row['Ticker'] ?? ''),
    "DisplayName" => (string)($row['DisplayName'] ?? ''),
    "PFP"         => (string)$pfp,
    "LiveStake"   => is_numeric($row['LiveStake'] ?? null) ? (float)$row['LiveStake'] : 0,
    "Saturation"  => is_numeric($row['Saturation'] ?? null) ? (float)$row['Saturation'] : 0,
  ];
}

echo json_encode($out, JSON_UNESCAPED_SLASHES);

$conn->close();
