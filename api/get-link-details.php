<?php
//if(isset($_POST['paymentType'])){
    $poolid = $_GET["poolid"];
    $aid= $_GET["aid"];
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

    $sql = "SELECT TICKER FROM StakePools WHERE PoolID = '".$poolid."'";
    $result = $conn->query($sql);
    $data = array();
    while($row = $result->fetch_assoc())
    {
	$data[0] = $row;
    }
    $sql = "SELECT DisplayName FROM Affiliates WHERE UniqueID = '".$aid."'";
    $result = $conn->query($sql);
    while($row = $result->fetch_assoc())
    {
	$data[1] = $row;
    }    
    echo json_encode($data);
    $conn->close();
//}
