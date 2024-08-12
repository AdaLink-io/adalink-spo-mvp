<?php
//if(isset($_POST['assetNames'])){
   
    $network=$_POST['network'];
    $userType=$_POST['userType'];
    $displayName=$_POST['displayName'];
    $poolID=$_POST['poolID'];
    $socialLink=$_POST['socialLink'];
    $website=$_POST['website'];
    $walletType=$_POST['walletType'];
    
    $userPFP=$_FILES['userPFP']['tmp_name'];
    $paymentAddress=$_POST['paymentAddress'];
    
    $stakeAddress=$_POST['stakeAddress'];
    
    
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
    if ($userType == "SPO") {
	$sql = "SELECT ID FROM StakePools WHERE PoolID = '".$poolID."'";
	$result = $conn->query($sql);
	if ($result->num_rows > 0) {
		while($row = $result->fetch_assoc()) {
			$response=$row["ID"];      
		}
		echo "SPO already registered.";
		$conn->close();
		exit;
	}
	$sql = "SELECT ID FROM StakePools WHERE StakeAddress = '".$stakeAddress."'";
	$result = $conn->query($sql);
	if ($result->num_rows > 0) {
		while($row = $result->fetch_assoc()) {
			$response=$row["ID"];      
		}
		echo "Wallet already linked with another stake pool.";
		$conn->close();
		exit;
	}	
    } else {
    	$sql = "SELECT ID FROM Affiliates WHERE StakeAddress = '".$stakeAddress."'";
	$result = $conn->query($sql);
	if ($result->num_rows > 0) {
		while($row = $result->fetch_assoc()) {
			$response=$row["ID"];      
		}
		echo "Affiliate already registered.";
		$conn->close();
		exit;
	}    	
    }
    
    // To open the file and store its contents in $file_contents
    $userPFP_file=fopen($userPFP, 'r');
    $userPFP_data=fread($userPFP_file, filesize($userPFP));
    fclose($userPFP_file);
    // We need to escape some stcharacters that might appear in  file_contents,so do that now, before we begin the query.
 
    $userPFP_data=addslashes($userPFP_data);
    
    $target_dir = "../images/accounts/";
    if ($userType == "SPO") {
    	$target_pfp = $target_dir.$poolID;
    	$url_pfp = "https://adalink.io/images/accounts/".$poolID;
    } else {
    	$target_pfp = $target_dir.$stakeAddress;
    	$url_pfp = "https://adalink.io/images/accounts/".$stakeAddress;
    }
    move_uploaded_file($userPFP, $target_pfp);
    
    if ($userType == "SPO") {
    	//use blockfrost to get pool info
    	$ch = curl_init();

	if ($network == 1){
		$url = "https://cardano-mainnet.blockfrost.io/api/v0/pools/".$poolID;
		$key = 'mainnetedOr1A0jt3OG6NJ4dI0U59cFb42hgD3t';
	}else{
		$url = "https://cardano-preview.blockfrost.io/api/v0/pools/".$poolID;
		$key = 'preview2veeuotXrSHV9blXL7rZo8Ty6fuyhtdP';
	}
	

	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');


	$headers = array();
	$headers[] = 'Accept: application/json';
	$headers[] = 'Project_id: '.$key;
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

	$jsonResponse = curl_exec($ch);
	$poolInfo = json_decode($jsonResponse,true);
	$isValidPool = true;
	$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	if ($httpCode != 200) {
    		$isValidPool = false;
    		$conn->close();
    		curl_close($ch);
    		echo "Error: Invalid pool ID.";
	}
	curl_close($ch);
	
	//use blockfrost to get pool metadata
	$ch = curl_init();

	if ($network == 1){
		$url = "https://cardano-mainnet.blockfrost.io/api/v0/pools/".$poolID."/metadata";
		$key = 'mainnetTkJ9JhYABJ8tBO9tb53iB7KVKrdA949z';
	}else{
		$url = "https://cardano-preview.blockfrost.io/api/v0/pools/".$poolID."/metadata";
		$key = 'preview2veeuotXrSHV9blXL7rZo8Ty6fuyhtdP';
	}
	

	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');


	$headers = array();
	$headers[] = 'Accept: application/json';
	$headers[] = 'Project_id: '.$key;
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

	$jsonResponse = curl_exec($ch);
	$poolMetadata = json_decode($jsonResponse,true);
	$isValidMetadata = true;
	if (curl_errno($ch)) {
    		$isValidMetadata = false;
	}
	curl_close($ch);
	if ($isValidPool) {
		//use blockfrost to get time stamp of pool creation time
		$ch = curl_init();

		if ($network == 1){
			$url = "https://cardano-mainnet.blockfrost.io/api/v0/txs/".$poolInfo["registration"][0];
			$key = 'mainnetDU16bPlzuGBSBllYPKLWl52yYRvc34O9';
		}else{
			$url = "https://cardano-preview.blockfrost.io/api/v0/txs/".$poolInfo["registration"][0];
			$key = 'preview2veeuotXrSHV9blXL7rZo8Ty6fuyhtdP';
		}
		

		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');


		$headers = array();
		$headers[] = 'Accept: application/json';
		$headers[] = 'Project_id: '.$key;
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

		$jsonResponse = curl_exec($ch);
		$poolCreationTx = json_decode($jsonResponse,true);
		$poolCreationDate = $poolCreationTx["block_time"];
		curl_close($ch);	
	
	}
	//set table in db
	$table="StakePools";
	if ($isValidPool) {
		$sql="INSERT INTO ".$table." (Ticker, DisplayName, PoolID, CreationDate, PFP, Website, SocialLink, WalletAddress, StakeAddress, ActiveStake, LiveStake, Saturation, FixedFees, Margin, RecentROA, LifeTimeROA, CurrentBlocks, LifeTimeBlocks, LifeTimeLuck, DelegatorsCount, Pledge,InitialStake,InitialSaturation) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		$stmt = $conn->prepare($sql);
		$recentROA = "3.1%";
		$lifeTimeROA = "3.16%";
		$lifeTimeLuck = "98.84%";
		$stmt->bind_param("sssssssssssssssssssssss", $poolMetadata["ticker"],$displayName,$poolID,$poolCreationDate,$url_pfp,$website,$socialLink,$paymentAddress,$stakeAddress,$poolInfo["active_stake"],$poolInfo["live_stake"],$poolInfo["live_saturation"],$poolInfo["fixed_cost"],$poolInfo["margin_cost"],$recentROA,$lifeTimeROA,$poolInfo["blocks_epoch"],$poolInfo["blocks_minted"],$lifeTimeLuck,$poolInfo["live_delegators"],$poolInfo["declared_pledge"],$poolInfo["live_stake"],$poolInfo["live_saturation"]);
	}
	
	
    } else {
    	$uniqueID="A".strtoupper(substr($stakeAddress, -5)); 
    	$table="Affiliates";
    	$sql="INSERT INTO ".$table." (UniqueID, DisplayName, Type, WalletAddress, StakeAddress, PFP, Website, SocialLink) VALUES (?,?,?,?,?,?,?,?)";
    	$stmt = $conn->prepare($sql);
    	$affiliateType = " ";
    	$stmt->bind_param("ssssssss", $uniqueID,$displayName,$affiliateType,$paymentAddress,$stakeAddress,$url_pfp,$website,$socialLink);
    }
    


    

    if ($stmt->execute() === TRUE) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
    
    $conn->close();
//}*/
