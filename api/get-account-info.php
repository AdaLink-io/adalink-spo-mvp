<?php
//if(isset($_POST['paymentType'])){
    $address = $_GET["stakeAddress"];
    $servername = "localhost";
    $username = "adaldlee_fourzin";
    $password = "YA,SODvt-.X^";
    $dbname = "adaldlee_adalink";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "SELECT * FROM StakePools WHERE StakeAddress = '".$address."'";
    $result = $conn->query($sql);
    $data = array();
    while($row = $result->fetch_assoc())
    {
	$data[] = $row;
    }
    if (count($data[0])!=22){
    	$sql = "SELECT * FROM Affiliates WHERE StakeAddress = '".$address."'";
    	$result = $conn->query($sql);
    }
    while($row = $result->fetch_assoc())
    {
	$data[] = $row;
    }    
    echo json_encode($data[0]);
    $conn->close();
//}
