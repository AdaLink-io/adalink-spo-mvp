<?php
//if(isset($_POST['paymentType'])){
    $stakeAddress = $_GET["stakeAddress"];
    $parameter=$_GET["parameter"];
    $value=$_GET["value"];
    $userType =$_GET["type"];
    $key=$_GET["key"];

    $servername = "localhost";
    $username = "adaldlee_fourzin";
    $password = "YA,SODvt-.X^";
    $dbname = "adaldlee_adalink";

    //check if password is correct, if not jump to end
    if ($userType == "SPO"){
    	$table="StakePools";
    }else{
    	$table="Affiliates";
    }
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }/*else{
        printf("Connected to DB");
    }*/

    //get paymentAddress of user
    $sql = "SELECT WalletAddress FROM ".$table." WHERE StakeAddress = '".$stakeAddress."'";
    $result = $conn->query($sql);
    while($row = $result->fetch_assoc())
    {
	$paymentAddress = $row["WalletAddress"];
    }
    $key1=substr($paymentAddress,11,1);
    $key2=substr($paymentAddress,22,1);
    $key3=substr($paymentAddress,33,1);
    $key4=substr($paymentAddress,44,1);
    if($key == $key1.$key2.$key3.$key4){
    	$sql = "UPDATE ".$table." SET ".$parameter."=? WHERE StakeAddress=?";

    	$stmt = $conn->prepare($sql);
    	$stmt->bind_param("ss", $value, $stakeAddress);


    	if ($stmt->execute() === TRUE) {
            echo "Record updated successfully";
    	} else {
            echo "Error: " . $sql . "<br>" . $conn->error;
    	}
    }else{
    	echo "Denied";
    }
    $conn->close();

//}
