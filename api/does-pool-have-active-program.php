<?php
//if(isset($_POST['paymentType'])){
    $poolID = $_GET["poolID"];
    $startEpoch=$_GET["startEpoch"];
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

    $sql = "SELECT ID FROM IncentivePrograms WHERE PoolID = '".$poolID."' AND StartEpoch = ".$startEpoch;

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
