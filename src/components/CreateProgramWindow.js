/* global BigInt */
import React, { useEffect, useState } from 'react';
import {Constr, Data, toHex,fromHex} from 'lucid-cardano';
import './SignUpWindow.css';
import './CreateProgramWindow.css';
import downArrow from '../assets/images/down-arrow.svg';
import {SCRIPT_ADDRESS,stringToHex,getCurrentEpochNumber,displayNumberInPrettyFormat,removePrettyFormat} from '../Constants';


const CreateProgramWindow = ({ walletAPI,walletName,walletIcon,lucid,openWalletMenu,onClose,setLoggedIn,accountInfo,setMessageWindowContent,setMessageWindowButtonText,setShowMessageWindow}) => {


  const closeWindow = (event) => {
      if(event.target.className.toString()==="backdrop"){ 
        onClose();
    }
  }

  //get current epoch number
  let currentEpoch = getCurrentEpochNumber();
  //

  const [startEpoch,setStartEpoch]=useState(currentEpoch);
  const [endEpoch,setEndEpoch]=useState(currentEpoch+1);
  const [saturationTarget,setSaturationTarget]=useState((100+Math.ceil(accountInfo['Saturation']*100))/2);

  

  function updateProgramParametersGivenMaximumRewardPerEpoch(){
    let startEpoch=document.getElementById('startEpoch').value;
    let endEpoch=document.getElementById('endEpoch').value;
    let maximumRewardPerEpoch= document?.getElementById('maximumRewardPerEpoch').value;
    let totalMaximumRewards,rewardRate;
    if(maximumRewardPerEpoch == ''){
      //maximumRewardPerEpoch = 0;
      document.getElementById('totalMaximumRewards').value= '';
      document.getElementById('rewardRate').value= '';
      return;
    }
    maximumRewardPerEpoch = removePrettyFormat(maximumRewardPerEpoch);
    totalMaximumRewards = maximumRewardPerEpoch * (endEpoch-startEpoch);
    let saturationTarget=document.getElementById('saturationTargetSlider').value/100;
    rewardRate = totalMaximumRewards / ((accountInfo['LiveStake']/1000000/accountInfo['Saturation']*saturationTarget)*(1-accountInfo['Saturation']));
    //rewardRate = totalMaximumRewards / ((accountInfo['LiveStake']/1000000)*(1/accountInfo['Saturation']-1));
    document.getElementById('totalMaximumRewards').value= displayNumberInPrettyFormat(totalMaximumRewards);
    if(rewardRate<0.000001)
      document.getElementById('rewardRate').value=0;
    else
      document.getElementById('rewardRate').value= displayNumberInPrettyFormat(rewardRate);
    
  }
  function updateProgramParametersGivenTotalMaximumReward(){
    let startEpoch=document.getElementById('startEpoch').value;
    let endEpoch=document.getElementById('endEpoch').value; 
    let totalMaximumRewards= document?.getElementById('totalMaximumRewards').value;
    let maximumRewardPerEpoch,rewardRate;
    if(totalMaximumRewards == ''){
      //maximumRewardPerEpoch = 0;
      document.getElementById('maximumRewardPerEpoch').value= '';
      document.getElementById('rewardRate').value= '';
      return;
    }
    totalMaximumRewards = removePrettyFormat(totalMaximumRewards);
    maximumRewardPerEpoch = totalMaximumRewards / (endEpoch-startEpoch);
    let saturationTarget=document.getElementById('saturationTargetSlider').value/100;
    rewardRate = totalMaximumRewards / ((accountInfo['LiveStake']/1000000/accountInfo['Saturation']*saturationTarget)*(1-accountInfo['Saturation']));
    //rewardRate = totalMaximumRewards / ((accountInfo['LiveStake']/1000000)*(1/accountInfo['Saturation']-1));
    document.getElementById('maximumRewardPerEpoch').value= displayNumberInPrettyFormat(maximumRewardPerEpoch);
    if(rewardRate<0.000001)
      document.getElementById('rewardRate').value=0;
    else
      document.getElementById('rewardRate').value= displayNumberInPrettyFormat(rewardRate);
    
  }
  function updateProgramParametersGivenRewardRate(){
    let startEpoch=document.getElementById('startEpoch').value;
    let endEpoch=document.getElementById('endEpoch').value; 
    let rewardRate= document?.getElementById('rewardRate').value;
    let maximumRewardPerEpoch,totalMaximumRewards;
    if(rewardRate == ''){
      //maximumRewardPerEpoch = 0;
      document.getElementById('maximumRewardPerEpoch').value= '';
      document.getElementById('totalMaximumRewards').value= '';
      return;
    }
    rewardRate = removePrettyFormat(rewardRate);
    let saturationTarget=document.getElementById('saturationTargetSlider').value/100;
    //let rewardRate = totalMaximumRewards / ((accountInfo['LiveStake']/1000000/accountInfo['Saturation']*saturationTarget)*(1-accountInfo['Saturation']));
    totalMaximumRewards = rewardRate * ((accountInfo['LiveStake']/1000000/accountInfo['Saturation']*saturationTarget)*(1-accountInfo['Saturation']));
    maximumRewardPerEpoch = totalMaximumRewards / (endEpoch-startEpoch);
    document.getElementById('maximumRewardPerEpoch').value= displayNumberInPrettyFormat(maximumRewardPerEpoch);
    document.getElementById('totalMaximumRewards').value= displayNumberInPrettyFormat(totalMaximumRewards);
  }
  function updateProgramParametersGivenStartEpoch(){
    let startEpoch=document.getElementById('startEpoch').value;
    let endEpoch=document.getElementById('endEpoch').value;
    let maximumRewardPerEpoch= document?.getElementById('maximumRewardPerEpoch').value;
    let totalMaximumRewards,rewardRate;
    if(maximumRewardPerEpoch == ''){
      //maximumRewardPerEpoch = 0;
      document.getElementById('totalMaximumRewards').value= '';
      document.getElementById('rewardRate').value= '';
      return;
    }
    maximumRewardPerEpoch = removePrettyFormat(maximumRewardPerEpoch);
    totalMaximumRewards = maximumRewardPerEpoch * (endEpoch-startEpoch);
    //rewardRate = totalMaximumRewards / ((accountInfo['LiveStake']/1000000)*(1/accountInfo['Saturation']-1));
    let saturationTarget=document.getElementById('saturationTargetSlider').value/100;
    rewardRate = totalMaximumRewards / ((accountInfo['LiveStake']/1000000/accountInfo['Saturation']*saturationTarget)*(1-accountInfo['Saturation']));
    document.getElementById('totalMaximumRewards').value= displayNumberInPrettyFormat(totalMaximumRewards);
    if(rewardRate<0.000001)
      document.getElementById('rewardRate').value=0;
    else
      document.getElementById('rewardRate').value= displayNumberInPrettyFormat(rewardRate);
  }
  function updateRewardRateGivenSaturationTarget(){
    
    let totalMaximumRewards = removePrettyFormat(document.getElementById('totalMaximumRewards')?.value);
    let saturationTarget=document.getElementById('saturationTargetSlider').value/100;
    let rewardRate = totalMaximumRewards / ((accountInfo['LiveStake']/1000000/accountInfo['Saturation']*saturationTarget)*(1-accountInfo['Saturation']));
    //let rewardRate = totalMaximumRewards / ((accountInfo['LiveStake']/1000000)*(1/accountInfo['Saturation']-1));

    if(rewardRate<0.000001)
      document.getElementById('rewardRate').value=0;
    else
      document.getElementById('rewardRate').value= displayNumberInPrettyFormat(rewardRate);
  }

  async function handleProgramLaunch() {

    let startEpoch = document.getElementById('startEpoch').value;
    let endEpoch = document.getElementById('endEpoch').value;
    let maximumRewardPerEpoch = removePrettyFormat(document.getElementById('maximumRewardPerEpoch')?.value);
    let rewardRate = removePrettyFormat(document.getElementById('rewardRate')?.value);
    let totalMaximumRewards = removePrettyFormat(document.getElementById('totalMaximumRewards')?.value);

    setMessageWindowContent("Checking user input...");
    setMessageWindowButtonText('')
    setShowMessageWindow(true);

    if(maximumRewardPerEpoch == '' || rewardRate == '' || totalMaximumRewards == ''){
      setMessageWindowContent("Please specify reward information.");
      setMessageWindowButtonText('OK');
      setShowMessageWindow(true);
      return;
    }

    //exit if user did not permit access or choose wallet
    if(walletAPI===undefined){
      setMessageWindowContent("Please select a wallet");
      setMessageWindowButtonText('OK');
      setShowMessageWindow(true);
      return;
    }

    if(await doesPoolHaveActiveProgram(accountInfo['PoolID'])){
      setMessageWindowContent("Can not create campaign. Theis pool has an active running program.");
      setMessageWindowButtonText('OK');
      setShowMessageWindow(true);
      return;
    }

    lucid.selectWallet(walletAPI);
    const publicKeyHash = lucid.utils.getAddressDetails(
      await lucid.wallet.address()
    ).paymentCredential?.hash;
    //let paymentAddress = await lucid.wallet.address();
    //let stakeAddress = await lucid.wallet.rewardAddress();

    //calculate target stake 
    let saturationTarget=document.getElementById('saturationTargetSlider').value/100;
    let stakeTarget=Math.floor(parseFloat(accountInfo['LiveStake'])/saturationTarget);
    const datum = Data.to(new Constr(0, [publicKeyHash,stringToHex(accountInfo['PoolID']),BigInt(startEpoch),BigInt(endEpoch),BigInt(parseInt(maximumRewardPerEpoch*1000000)),BigInt(parseInt(rewardRate*1000000)),BigInt(parseInt(totalMaximumRewards*1000000)),BigInt(accountInfo['LiveStake']),BigInt(stakeTarget)]));
    
    let tx = lucid.newTx();
    //add 2.5 ada per epoch for adalink and tx fees
    let adalinkFees = (endEpoch-startEpoch)*2500000;
    tx.payToContract(SCRIPT_ADDRESS,{inline : datum},{lovelace: BigInt(parseInt(totalMaximumRewards*1000000+adalinkFees))});
    
    try{
      tx = await tx.complete();
    }catch(e){
      setMessageWindowContent(e);
      setMessageWindowButtonText("Ok");
      setShowMessageWindow(true);
      return;
    }

    try{
      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit();
      setMessageWindowContent(<><div>New campaign has been launched successfully!</div><br/><div style={{textAlign:"left",fontSize:"13px",paddingLeft:"1.2rem"}}>Program will be automatically displayed as soon as the transaction is confirmed on chain.</div></>)
      setMessageWindowButtonText("Ok");
      setShowMessageWindow(true);
      onClose();
      return;      
    }catch{
      setMessageWindowContent("User declined transaction.")
      setMessageWindowButtonText("Ok");
      setShowMessageWindow(true);
      return;
    }


  }

  async function doesPoolHaveActiveProgram(poolID){
        
    let response, responseInfo;
    response = await fetch('https://adalink.io/api/does-pool-have-active-program.php?poolID='+poolID+'&startEpoch='+currentEpoch,{cache:'reload'}); 
    responseInfo = JSON.parse(await response.text());
    
    if(responseInfo=="-1"){
        return false;
    }
    else
        return true;
  }


  return (
    <div className="backdrop" onClick={closeWindow}>
      <div className='signup-menu'>
        <h3>New Incentive Program</h3>
        <br/>
        <div style={{display:"flex",gap:"30px"}}>
          <div className='sign-up-text-fields-area'>
            <div className='sign-up-text-field'>
              <div className='sign-up-text-field-title'>Start from epoch:</div>
              <div className='sign-up-text-field-input' >
                <select id="startEpoch" style={{height:"25px"}} 
                  onChange={() => {
                    setStartEpoch(document.getElementById('startEpoch').value);
                    if(document.getElementById('startEpoch').value>=document.getElementById('endEpoch').value){
                      document.getElementById('endEpoch').value=parseInt(document.getElementById('startEpoch').value)+1;
                      setEndEpoch(document.getElementById('endEpoch').value);
                    }
                    updateProgramParametersGivenStartEpoch();
                  }}>
                  <option value={currentEpoch+1}>{currentEpoch+1}</option>
                  <option value={currentEpoch+2}>{currentEpoch+2}</option>
                  <option value={currentEpoch+3}>{currentEpoch+3}</option>
                  <option value={currentEpoch+4}>{currentEpoch+4}</option>
                  <option value={currentEpoch+5}>{currentEpoch+5}</option>
                </select>
              </div>
            </div>
            <div className='sign-up-text-field'>
              <div className='sign-up-text-field-title'>End at epoch:</div>
              <div className='sign-up-text-field-input' >
                <select id="endEpoch" style={{height:"25px"}} 
                  onChange={() => {
                    setEndEpoch(document.getElementById('endEpoch').value);
                    if(document.getElementById('startEpoch').value>=document.getElementById('endEpoch').value){
                      document.getElementById('startEpoch').value=parseInt(document.getElementById('endEpoch').value)-1;
                      setStartEpoch(document.getElementById('startEpoch').value);
                    }
                    updateProgramParametersGivenStartEpoch();                    
                  }}>
                  <option value={currentEpoch+2}>{currentEpoch+2}</option>
                  <option value={currentEpoch+3}>{currentEpoch+3}</option>
                  <option value={currentEpoch+4}>{currentEpoch+4}</option>
                  <option value={currentEpoch+5}>{currentEpoch+5}</option>
                  <option value={currentEpoch+6}>{currentEpoch+6}</option>
                  <option value={currentEpoch+7}>{currentEpoch+7}</option>
                  <option value={currentEpoch+8}>{currentEpoch+8}</option>
                  <option value={currentEpoch+9}>{currentEpoch+9}</option>
                  <option value={currentEpoch+10}>{currentEpoch+10}</option>
                </select>
              </div>
            </div>
            <div className='sign-up-text-field'>
              <div className='sign-up-text-field-title'>Maximum rewards per epoch:</div>
              <div className='sign-up-text-field-input' style={{flex:1}}>
                <input type='text' id='maximumRewardPerEpoch' style={{width:"100%",height:"20px"}}
                  onKeyDown={(event) => {
                    if ((!/[0-9.]/.test(event.key)) && (!/[\B]/.test(event.key)) && event.key != 'ArrowLeft' && event.key != 'ArrowRight' ) {
                      event.preventDefault();
                    }
                    if (event.key == '.' && document.getElementById('maximumRewardPerEpoch').value.split(".").length>1){
                      event.preventDefault();
                    }
                  }}
                  onChange={() => {
                    document.getElementById('maximumRewardPerEpoch').value=displayNumberInPrettyFormat(removePrettyFormat(document.getElementById('maximumRewardPerEpoch').value));
                    updateProgramParametersGivenMaximumRewardPerEpoch();
                  }}
                />
              </div>
              <div style={{paddingLeft:"5px"}}>₳</div>
            </div>
            <div className='sign-up-text-field'>
              <div className='sign-up-text-field-title'>Reward rate:</div>
              <div className='sign-up-text-field-input' style={{flex:1}}>
                <input type='text' id='rewardRate' style={{width:"100%",height:"20px"}}
                  onKeyDown={(event) => {
                    if ((!/[0-9.]/.test(event.key)) && (!/[\B]/.test(event.key)) && event.key != 'ArrowLeft' && event.key != 'ArrowRight' ) {
                      event.preventDefault();
                    }
                    if (event.key == '.' && document.getElementById('rewardRate').value.split(".").length>1){
                      event.preventDefault();
                    }
                  }}                
                  onChange={() => {
                    document.getElementById('rewardRate').value=displayNumberInPrettyFormat(removePrettyFormat(document.getElementById('rewardRate').value));
                    updateProgramParametersGivenRewardRate();                      
                  }}
                />
              </div>
              <div style={{paddingLeft:"5px"}}>₳/Brought ₳</div>
            </div>
            <div className='sign-up-text-field'>
              <div className='sign-up-text-field-title'>Total maximum rewards:</div>
              <div className='sign-up-text-field-input' style={{flex:1}}>
                <input type='text' id='totalMaximumRewards' style={{width:"100%",height:"20px"}}
                  onKeyDown={(event) => {
                    if ((!/[0-9.]/.test(event.key)) && (!/[\B]/.test(event.key)) && event.key != 'ArrowLeft' && event.key != 'ArrowRight' ) {
                      event.preventDefault();
                    }
                    if (event.key == '.' && document.getElementById('totalMaximumRewards').value.split(".").length>1){
                      event.preventDefault();
                    }
                  }}                
                  onChange={() => {
                    document.getElementById('totalMaximumRewards').value=displayNumberInPrettyFormat(removePrettyFormat(document.getElementById('totalMaximumRewards').value));
                    updateProgramParametersGivenTotalMaximumReward();                    
                  }}
                />
              </div>
              <div style={{paddingLeft:"5px"}}>₳</div>
            </div>
            <div>
            <div style={{textAlign:"left"}}>Saturation target:</div>   
            <input type="range" min={Math.ceil(accountInfo['Saturation']*100).toFixed(2)} max='100' defaultValue={saturationTarget} className="slider" id="saturationTargetSlider" 
              onChange={() => {
                setSaturationTarget(document.getElementById('saturationTargetSlider').value);
                updateRewardRateGivenSaturationTarget();
                }}>
            </input>
            <div className='saturation-values'>
              <div>{(accountInfo['Saturation']*100).toFixed(2)}%</div>
              <div>{saturationTarget}%</div>
              <div>100%</div>
            </div>
            </div>
          </div>
        </div>
        <div style={{textAlign:"right",marginTop:"2rem"}}>
          <button className='btnType1' style={{width:"120px"}} onClick={async () => await handleProgramLaunch()}>Launch</button>
        </div>
      </div>
    </div>
  );
};

export default CreateProgramWindow;
