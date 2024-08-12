/* global BigInt */
import React, { useState } from 'react';
import './AffiliateTransaction.css';
import WalletMenu from '../components/WalletMenu';
import { NETWORK,stringToHex } from '../Constants';
import {Constr, Data} from 'lucid-cardano';
import loadingIcon from '../assets/images/loading.gif';

const queryParameters = new URLSearchParams(window.location.search);
let linkID=queryParameters.get('linkid');
let response,ipDetails,poolID,affiliateID;
if(linkID!==null){

  response = await fetch('https://adalink.io/api/get-affiliate-link-details.php?linkid='+linkID,{cache:"reload"}); 
  ipDetails = JSON.parse(await response.text());
  poolID=ipDetails[0]['PoolID'];
  affiliateID = ipDetails[0]['AffiliateID'];
  response = await fetch('https://adalink.io/api/get-link-details.php?poolid='+poolID+'&aid='+affiliateID,{cache:"reload"}); 
}
let linkDetails;
try{
  linkDetails = JSON.parse(await response.text());
}catch{
  console.log('Could not load linkDetails')
}
let poolTicker,affiliateDisplayName;
if(linkDetails?.length>0){
  poolTicker = linkDetails[0]['TICKER'];
  affiliateDisplayName = linkDetails[1]['DisplayName'];
}

const AffiliateTransaction = ({lucid}) => {

  const [buttonText,setButtonText]=useState("Delegate")
  const [isDelegated,setIsDelegated]=useState(false);
  const [isWalletMenuOpen,setWalletMenuOpen]=useState(false);
  
  const [walletAPI,setWalletAPI]=useState();
  const [walletIcon,setWalletIcon]=useState();
  const [walletName,setWalletName]=useState();

  async function handleButtonClick(){
    if(buttonText=="Done!") return
    if(walletAPI===undefined){
      setWalletMenuOpen(true);
    }else{
      setButtonText(<img alt='' src={loadingIcon} width={16} style={{verticalAlign:"center"}} />);
      lucid.selectWallet(walletAPI);
      if(await walletAPI.getNetworkId() != NETWORK){
        alert("Incorrect wallet network.");
        return;
      }
      const walletAddress = await lucid.wallet.address();
      const rewardAddress = await lucid.wallet.rewardAddress();
      const walletDelegation = await lucid.wallet.getDelegation();
      //console.log(walletDelegation)
      
      const datum = Data.to(new Constr(0, [stringToHex("AdaLink"),stringToHex(affiliateID)]));
      let tx ;
      if(walletDelegation['poolId']==null){
        console.log('yes null!');
        tx = await lucid.newTx()
        .payToContract(walletAddress,{inline:datum},2000000n)
        .registerStake(rewardAddress)
        .delegateTo(rewardAddress,poolID)
        .complete();
      }else{
        tx = await lucid.newTx()
        .payToContract(walletAddress,{inline:datum},2000000n)
        .delegateTo(rewardAddress,poolID)
        .complete();
      }
      
      try{
        const signedTx = await tx.sign().complete();
        const txHash = await signedTx.submit();
      }catch{
        setButtonText('Delegate');
        return;
      }
      setButtonText("Done!");
      document.getElementById('delegateBtn').classList.replace('btnType1','staticBtn');
    }
  }

  return (
    <div className="affiliate-transaction-background" >
      <div className='affiliate-transaction-window'>
        <h3>Affiliate Transaction</h3>
        <br/>
        <div style={{display:"flex",gap:"30px"}}>
          <div className='sign-up-text-fields-area'>
            <div className='affiliate-link-field'>
              Check, connect and delegate. It is this simple.
            </div>
            <div className='affiliate-link-field'>
              Affiliate: {affiliateDisplayName}
            </div>
            <div className='affiliate-link-field'>
              Pool Ticker: {poolTicker}
            </div>
          </div>
        </div>
        <div style={{marginTop:"3rem"}}>
          <button className='btnType1' id='delegateBtn' style={{width:"160px"}} onClick={() => {handleButtonClick()}}>{walletAPI===undefined?"Connect wallet":buttonText}</button>
        </div>
      </div>
      {isWalletMenuOpen &&
      <WalletMenu
        onClose={setWalletMenuOpen}
        setWalletAPI={setWalletAPI}
        setWalletIcon={setWalletIcon}
        setWalletName={setWalletName}
      />
      }
    </div>
  );
};

export default AffiliateTransaction;
