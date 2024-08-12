<?php
//if(isset($_POST['paymentType'])){
    $address = $_GET["stakeAddress"];
    $poolID = $_GET["poolID"];
    $userType=$_GET["userType"];
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

    if ($poolID!="")
     $sql = "SELECT ID FROM StakePools WHERE PoolID = '".$poolID."'";
    else if ($userType=="SPO")
     $sql = "SELECT ID FROM StakePools WHERE StakeAddress = '".$address."'";
    else
     $sql = "SELECT ID FROM Affiliates WHERE StakeAddress = '".$address."'";
    $result = $conn->query($sql);

    $response="-1";
    if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
            $response=$row["ID"];      
        }
    } else {
        $response="-1";
    }
    echo $response;
    $conn->close();
//}
