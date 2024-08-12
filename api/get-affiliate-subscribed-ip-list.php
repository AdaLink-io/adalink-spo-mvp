<?php
//if(isset($_POST['assetNames'])){
    $aID = $_GET["aID"];
    $table="AffiliateLinks";
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

    //$conn->query("SET CHARACTER SET UTF8");
    $sql = "SELECT * FROM ".$table." WHERE AffiliateID = '".$aID."'";
    $result = $conn->query($sql);

	$data = array();
	while($row = $result->fetch_assoc())
	{
	    $data[] = $row;
	}
    echo json_encode($data);
    //echo $result;
    $conn->close();
//}
