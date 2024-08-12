<?php
//if(isset($_POST['assetNames'])){
   
    $linkID=$_GET['linkID'];
    $affiliateID=$_GET['affiliateID'];
    $affiliateDisplayName=$_GET['affiliateDisplayName'];
    $poolID=$_GET['poolID'];
    $poolTicker=$_GET['poolTicker'];
    $startEpoch=$_GET['startEpoch'];
    $endEpoch=$_GET['endEpoch'];
    
    
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
    
    //check if poolID is legit for SPOs & check affiliate's stake address 
    $sql = "SELECT ID FROM AffiliateLinks WHERE LinkID = '".$linkID."'";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
	      $response=$row["ID"];      
	}
    echo "Affiliate link already registered.";
	$conn->close();
	exit;
    }    	
    
    $table="AffiliateLinks";
    $sql="INSERT INTO ".$table." (LinkID, AffiliateID, PoolID, StartEpoch, EndEpoch, PoolTicker) VALUES (?,?,?,?,?,?)";
    $stmt = $conn->prepare($sql);
    $affiliateType = " ";
    $stmt->bind_param("sssiis", $linkID, $affiliateID, $poolID, $startEpoch, $endEpoch, $poolTicker);
    


    

    if ($stmt->execute() === TRUE) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
    
    $conn->close();
//}*/
