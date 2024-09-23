// src/pages/Home.js
import React, { useState, useEffect } from 'react';

import './ProfilePage.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';
import editIcon from '../assets/images/edit-icon.png';
import { displayNumberInPrettyFormat, getCurrentEpochNumber } from '../Constants';
import EditWindow from '../components/EditWindow';
import ConfirmWindow from '../components/ConfirmWindow';


function ProfilePage({accountInfo,importantIPsList,setImportantBRsList,importantBRsList,setAccountInfo,setMessageWindowContent,setMessageWindowButtonText,setShowMessageWindow}) {
  
  const navigate = useNavigate();
  const [isEditWindowOpen,setEditWindowOpen] =useState(false);
  const [isConfirmWindoOpen,setConfirmWindowOpen]=useState(false);
  const [parameterToBeEdited,setParameterToBeEdited]=useState();

  const [ipDropDownListHTMLSyntax,setIPDropDownListHTMLSyntax]=useState();
  const [selectedIP,setSelectedIP]=useState();
  const [selectedBR,setSelectedBr]=useState();
  const [currentEpoch,setCurrentEpoch]=useState(getCurrentEpochNumber());
  const [totalFunds,setTotalFunds]=useState();
  const [broughtADA,setBroughtADA]=useState();

  function redirectTo(page){
    navigate('/'+page);
  }

  useEffect(() => {
    setIPDropDownListHTMLSyntax(constructIPDropDownListHTMLSyntax());
    setCurrentEpoch(getCurrentEpochNumber());
    calculateAccountAnalytics();
  },[])

  useEffect(() => {
    setIPDropDownListHTMLSyntax(constructIPDropDownListHTMLSyntax());
  },[importantIPsList])

  function calculateAccountAnalytics(){
    
    let buffer1=0,buffer2=0;
    if(accountInfo["UniqueID"]==undefined){

      importantIPsList?.forEach(ip => {
        buffer1=buffer1+parseInt(ip["TotalMamimumReward"]);
        if(parseInt(ip["EndEpoch"])>currentEpoch)
          buffer2=parseInt(accountInfo["LiveStake"])-parseInt(ip["PoolInitialStake"]);
        else
          buffer2=parseInt(ip["PoolFinalStake"])-parseInt(ip["PoolInitialStake"]);
      });
    }else{
      importantIPsList?.forEach(ip => {
        buffer1=buffer1+parseInt(ip["RewardsReceived"]);
        buffer2=buffer2+parseInt(ip["BroughtADA"]);
      });
    }
    setTotalFunds(buffer1);
    setBroughtADA(buffer2);
  }

  function constructIPDropDownListHTMLSyntax(){
    
    let htmlBlocks;
    if(accountInfo["UniqueID"]!=undefined){
      if(importantIPsList === undefined)
        return "";
      htmlBlocks = importantIPsList.map((ip,ipIndex) => (
        <option key={ip['PoolID']+ip['StartEpoch']} value={ipIndex}>{ip['StartEpoch']+"-"+ip["PoolTicker"]}</option>
      ));
    }else{
      if(importantIPsList === undefined)
        return "";
      htmlBlocks = importantIPsList.map((ip,ipIndex) => (
        <option key={ip['PoolID']+ip['StartEpoch']} value={ipIndex}>{ip['StartEpoch']+"-"+accountInfo["Ticker"]}</option>
      ));
    }
    setSelectedIP(importantIPsList[0]);
    return(
      <select className='dropdown-type1' id='selected-ip' onChange={() => setSelectedIP(importantIPsList[document.getElementById('selected-ip').value])}>
        {htmlBlocks}
      </select>
    );
  }

  function handleCopyLink(){
    let affiliateLink="https://app-preview.adalink.io/affiliate-transaction?linkid="+selectedIP["LinkID"];
    navigator.clipboard.writeText(affiliateLink);
    setMessageWindowContent("Affiliate link copied to clipboard.");
    setMessageWindowButtonText("OK");
    setShowMessageWindow(true);
  }

  async function handleBRRemoval(br){
    //delete br from database
    let response = await fetch('https://adalink.io/api/remove-bonus-request.php?requestID='+br["RequestID"],{cache:'reload'}); 
    //delete br from importantBRList
    let newImportantBRsList = importantBRsList.filter((item) => (item["Request"] ===br["RequestID"]));
    setImportantBRsList(newImportantBRsList);
    console.log(newImportantBRsList)
  }

  return (
    <div className="home">
      <div className="container">
        <div style={{height:"4rem"}}></div>
        {accountInfo===undefined?
        <>
        {redirectTo('')}
        </>
        :
        <>
        <div className='profile-section'>
          <div className='section-title'>
            <div>Account Info</div>
            <div style={{flex:2}} ><hr/></div>
          </div>
          <div className='account-info-section'>
              <div className='account-info-text'>
                <div className='account-info-parameter-section'>
                  <div>Display Name:</div>
                  <div>{accountInfo["DisplayName"]}</div>
                  <img className='account-info-parameter-edit-icon' src={editIcon} onClick={() => {setParameterToBeEdited('Display Name');setEditWindowOpen(true)}}/>
                </div>
                {accountInfo["PoolID"]!=undefined?
                <>
                <div className='account-info-parameter-section'>
                  <div>Pool ID:</div>
                  <div>{accountInfo["PoolID"]}</div>
                </div>
                <div className='account-info-parameter-section'>
                  <div>Ticker:</div>
                  <div>{accountInfo["Ticker"]}</div>
                </div>
                </>
                :
                <>
                <div className='account-info-parameter-section'>
                  <div>Affiliate ID:</div>
                  <div>{accountInfo["UniqueID"]}</div>
                </div>
                </>}
                <div className='account-info-parameter-section'>
                  <div>Website:</div>
                  <div>{accountInfo["Website"]}</div>
                  <img className='account-info-parameter-edit-icon' src={editIcon} onClick={() => {setParameterToBeEdited('Website');setEditWindowOpen(true)}}/>
                </div>
                <div className='account-info-parameter-section'>
                  <div>Social Link:</div>
                  <div>{accountInfo["SocialLink"]}</div>
                  <img className='account-info-parameter-edit-icon' src={editIcon} onClick={() => {setParameterToBeEdited('Social Link');setEditWindowOpen(true)}}/>
                </div>
              </div>
            <div className='account-info-pfp-container'>
              <img className='account-info-pfp' src={accountInfo["PFP"]}/>
            </div>
          </div>
        </div>
        {accountInfo["PoolID"]!=undefined?
        <div className='profile-section'>
          <div className='section-title'>
              <div>Pool's Statistics</div>
              <div style={{flex:2}} ><hr/></div>
          </div>
          <div className='pool-statistics-section'>
            <div className='pool-statistics-group'>
              <div className='account-info-parameter-section'>
                <div>Saturation:</div>
                <div>{(parseFloat(accountInfo["Saturation"])*100).toFixed(2)}%</div>
              </div>   
              <div className='account-info-parameter-section'>
                <div>Live Stake:</div>
                <div>{displayNumberInPrettyFormat((parseFloat(accountInfo["LiveStake"])/1000000).toFixed(0))} ₳</div>
              </div>
              <div className='account-info-parameter-section'>
                <div>Active Stake:</div>
                <div>{displayNumberInPrettyFormat((parseFloat(accountInfo["ActiveStake"])/1000000).toFixed(0))} ₳</div>
              </div>                                            
            </div>  
            <div className='pool-statistics-group'>
              <div className='account-info-parameter-section'>
                <div>Fixed Fees:</div>
                <div>{(parseFloat(accountInfo["FixedFees"])/1000000).toFixed(2)} ₳</div>
              </div>   
              <div className='account-info-parameter-section'>
                <div>Margin Fees:</div>
                <div>{(parseFloat(accountInfo["Margin"])*100).toFixed(2)}%</div>
              </div>             
            </div>  
            <div className='pool-statistics-group'>
              <div className='account-info-parameter-section'>
                <div>Creation Date:</div>
                <div>{new Date(accountInfo["CreationDate"]*1000).toUTCString()}</div>
              </div>   
              <div className='account-info-parameter-section'>
                <div>Delegators Count:</div>
                <div>{parseFloat(accountInfo["DelegatorsCount"])}</div>
              </div>
              {/*<div className='account-info-parameter-section'>
                <div>Lifetime Luck:</div>
                <div>{(parseFloat(accountInfo["Margin"])*100).toFixed(2)}%</div>
              </div>*/}                 
            </div>                            
            <div className='pool-statistics-group'>
              <div className='account-info-parameter-section'>
                <div>Declared Pledge:</div>
                <div>{displayNumberInPrettyFormat((parseFloat(accountInfo["Pledge"])/1000000).toFixed(0))} ₳</div>
              </div>   
              {/*<div className='account-info-parameter-section'>
                <div>Active Pledge:</div>
                <div>{parseFloat(accountInfo["LiveStake"])} ₳</div>
              </div>*/}
              <div className='account-info-parameter-section'>
                <div>Pledge Levarage:</div>
                <div>{displayNumberInPrettyFormat((parseFloat(accountInfo["ActiveStake"])/parseFloat(accountInfo["Pledge"])).toFixed(1))}</div>
              </div>                 
            </div>  
            <div className='pool-statistics-group'>
              <div className='account-info-parameter-section'>
                <div>Current Epoch's Blocks:</div>
                <div>{parseFloat(accountInfo["CurrentBlocks"])}</div>
              </div>   
              <div className='account-info-parameter-section'>
                <div>Lifetime Blocks:</div>
                <div>{displayNumberInPrettyFormat(accountInfo["LifeTimeBlocks"])}</div>
              </div>             
            </div>                                     
          </div>          
        </div>
        :
        <></>}
        {accountInfo['PoolID']!=undefined?
        <div className='profile-section'>
          <div className='section-title'>
              <div>Pool’s Analytics</div>
              <div style={{flex:2}} ><hr/></div>
          </div>
          <div className='pool-analytics-section'>
            <div className='pool-analytics-parameter-section'>
              <div>Saturation when registered with AdaLink:</div>
              <div>{(accountInfo["InitialSaturation"]*100).toFixed(2)}%</div>
            </div>
            <div className='pool-analytics-parameter-section'>
        
              <div>Saturation Increase:</div>
              <div>{((accountInfo["Saturation"]-accountInfo["InitialSaturation"])*100).toFixed(2)}%</div>
            </div>
            <div className='pool-analytics-parameter-section'>
              <div>Stake brought to pool from affiliates:</div>
              <div>{displayNumberInPrettyFormat(broughtADA/1000000)} ₳</div>
            </div>
            <div className='pool-analytics-parameter-section'>
              <div>Number of campaigns created:</div>
              <div>{importantIPsList?.length}</div>
            </div>
            <div className='pool-analytics-parameter-section'>
              <div>Amount of Funds invested:</div>
              <div>{displayNumberInPrettyFormat((totalFunds/1000000))} ₳</div>
            </div>
            <div className='pool-analytics-parameter-section'>
              <div>Projected Annual Income From brought ₳ (Excluding fixed fees):</div>
              <div>{displayNumberInPrettyFormat(((broughtADA*accountInfo["Margin"]*0.032)/1000000))} ₳</div>
            </div>
          </div>
        </div>
        :
        <div className='profile-section'>
          <div className='section-title'>
              <div>Affiliate's Analytics</div>
              <div style={{flex:2}} ><hr/></div>
          </div>
          <div className='pool-analytics-section'>
            <div className='pool-analytics-parameter-section'>
              <div>Number of incentive programs participated in:</div>
              <div>{importantIPsList?.length}</div>
            </div>
            <div className='pool-analytics-parameter-section'>
              <div>Total rewards received from campaigns:</div>
              <div>{displayNumberInPrettyFormat((totalFunds/1000000))} ₳</div>
            </div>
            <div className='pool-analytics-parameter-section'>
              <div>Total brought ₳ to stake pools:</div>
              <div>{displayNumberInPrettyFormat((broughtADA/1000000))} ₳</div>
            </div>
          </div>
        </div>}
        {accountInfo['PoolID']!=undefined?
        <div className='profile-section'>
          <div className='section-title'>
              <div>Incentive Programs’ Summary</div>
              <div style={{flex:2}} ><hr/></div>
          </div>
          {selectedIP==undefined?
          <div className='incentive-programs-summary-section'>
            No incentive programs are associated with this account.
          </div>
          :
          <div className='incentive-programs-summary-section'>
            <div className='incentive-programs-summary-parameter-section'>
              <div>Incentive Program:</div>
              {ipDropDownListHTMLSyntax}
            </div>
            <div className='incentive-programs-summary-parameter-section'>
              <div>Status:</div>
              <div>{currentEpoch<selectedIP["EndEpoch"]?"Active":"Ended"}</div>
            </div> 
            <div className='incentive-programs-summary-parameter-section'>
              <div>Start Epoch:</div>
              <div>{selectedIP["StartEpoch"]}</div>
            </div> 
            <div className='incentive-programs-summary-parameter-section'>
              <div>End Epoch:</div>
              <div>{selectedIP["EndEpoch"]}</div>
            </div> 
            <div className='incentive-programs-summary-parameter-section'>
              <div>Funds paid:</div>
              <div>{displayNumberInPrettyFormat(selectedIP["TotalMamimumReward"]/1000000)} ₳</div>
            </div> 
            <div className='incentive-programs-summary-parameter-section'>
              <div>Brought ₳ to pool:</div>
              <div>
                {currentEpoch<selectedIP["EndEpoch"]?
                displayNumberInPrettyFormat((accountInfo["LiveStake"]-selectedIP["PoolInitialStake"])/1000000)
                :
                displayNumberInPrettyFormat((selectedIP["PoolFinalStake"]-selectedIP["PoolInitialStake"])/1000000)
                } ₳
              </div>
            </div>             
          </div>
          }
        </div>
        :
        <div className='profile-section'>
          <div className='section-title'>
              <div>Incentive Programs’ Summary</div>
              <div style={{flex:2}} ><hr/></div>
          </div>
          {selectedIP==undefined?
          <div className='incentive-programs-summary-section'>
            No incentive programs are associated with this account.
          </div>
          :
          <div className='incentive-programs-summary-section'>
            <div className='incentive-programs-summary-parameter-section'>
              <div>Incentive Program:</div>
              {ipDropDownListHTMLSyntax}
            </div>
            <div className='incentive-programs-summary-parameter-section'>
              <div>Affiliate Link:</div>
              <div>https://app-preview.adalink.io/affiliate-transaction?linkid={selectedIP['LinkID']}</div>
              <button className='btnType1' onClick={() => {handleCopyLink()}}>Copy link</button>
            </div>
            <div className='incentive-programs-summary-parameter-section'>
              <div>Status:</div>
              <div>{currentEpoch<selectedIP["EndEpoch"]?"Active":"Ended"}</div>
            </div> 
            <div className='incentive-programs-summary-parameter-section'>
              <div>Start Epoch:</div>
              <div>{selectedIP["StartEpoch"]}</div>
            </div> 
            <div className='incentive-programs-summary-parameter-section'>
              <div>End Epoch:</div>
              <div>{selectedIP["EndEpoch"]}</div>
            </div> 
            <div className='incentive-programs-summary-parameter-section'>
              <div>Brought ₳ to Pool During the Program:</div>
              <div>{displayNumberInPrettyFormat(selectedIP["BroughtADA"]/10000000)} ₳</div>
            </div> 
            <div className='incentive-programs-summary-parameter-section'>
              <div>Rewards Received:</div>
              <div>{displayNumberInPrettyFormat(selectedIP["RewardsReceived"]/1000000)} ₳</div>
            </div>             
          </div>
          }
        </div>}
        </>}
        {accountInfo["PoolID"]!=undefined?
        <div className='profile-section'>
          <div className='section-title'>
              <div>Bonus Requests</div>
              <div style={{flex:2}} ><hr/></div>
          </div>
          <div className='br-container'>
            <div>
              {importantBRsList.map((br) => (
                <div className='br-item'>
                  <div className='br-details'>
                    <div>Affiliate ID: {br["AffiliateID"]}</div>
                    <div>Affiliate Name: {br["AffiliateDisplayName"]}</div>
                    <div>Campaign Code: {br["StartEpoch"]}-{br["PoolTicker"]}</div>
                  </div>
                  <div className='br-buttons'>
                    <button className='btnType1' onClick={() => {window.open("https://tip-preview.adalink.io/tip?AffEq="+br["AffiliateID"])}}>Tip</button>
                    <button className='btnType1'  onClick={() => {setSelectedBr(br);setConfirmWindowOpen(true)}}>Remove</button>
                  </div>
                </div>))}
            </div>
          </div>
       </div>
       :
       <></>}
        {isEditWindowOpen &&
        <EditWindow
          onClose={() => setEditWindowOpen(false)}
          parameterToBeEdited={parameterToBeEdited}
          accountInfo={accountInfo}
          setAccountInfo={setAccountInfo}
          setMessageWindowContent={setMessageWindowContent}
          setMessageWindowButtonText={setMessageWindowButtonText}
          setShowMessageWindow={setShowMessageWindow}
        />
        }      
        {isConfirmWindoOpen &&
        <ConfirmWindow
          onClose={() => setConfirmWindowOpen(false)}
          onAction={() => handleBRRemoval(selectedBR)}
        />
        }
      </div>
    </div>
  );
}

export default ProfilePage;
