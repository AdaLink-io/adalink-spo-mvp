<?php
//if(isset($_POST['assetNames'])){
    //$table = $_GET["table"];
    $table="StakePools";
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
    $sql = "SELECT * FROM ".$table;
    $result = $conn->query($sql);

    $jsonInString="{";
    if ($result->num_rows > 0) {
    // output data of each row
    	while($row = $result->fetch_assoc()) {
	    	if ($jsonInString != "{")
		    	$jsonInString=$jsonInString.",";
		$jsonInString=$jsonInString.'"'.$row['PoolID'].'":{"Ticker":"'.$row['Ticker'].'","DisplayName":"'.$row['DisplayName'].'","PFP":"'.$row['PFP'].'","LiveStake":'.$row['LiveStake'].',"Saturation":'.$row['Saturation'].'}';
         }
    }
    $jsonInString=$jsonInString."}";
    echo json_encode($jsonInString);
    $conn->close();
//}
