// src/pages/Home.js
import React, { useState,useEffect } from 'react';
import './Home.css';
import './SPOs.css'; // Import the CSS file
import CreateProgramWindow from '../components/CreateProgramWindow';
import AffiliateLinkWindow from '../components/AffiliateLinkWindow';
import BonusRequestWindow from '../components/BonusRequestWindow';
import searchIcon from '../assets/images/search-icon.svg';
import filterIcon from '../assets/images/filter-icon.png';

import {displayNumberInPrettyFormat,getCurrentEpochNumber} from '../Constants';


let response = await fetch('https://adalink.io/api/get-spos-record.php',{cache:"reload"}); 
let sposRecord = JSON.parse(await response.text());
sposRecord = JSON.parse(sposRecord);
//let searchedIPsList = ipsList;
let selectedIP;
let currentEpoch = getCurrentEpochNumber();


function Home({isLoggedIn,ipsList,setIPsList,accountInfo,setImportantIPsList,walletAPI,lucid,selectedIPID,setMessageWindowContent,setMessageWindowButtonText,setShowMessageWindow}) {

  let searchedIPsList;
  //ipsList;
  let searchOrdering = 0;
  let orderBy;
  const [searchOrderingState,setSearchOrdering] = useState(0); // -1:decending, 0:no preference, 1:ascending
  const [orderByState,setOrderBy] = useState(); //fixedFees,margin,saturation
  
  const [isCreateProgramWindowOpen,setCreateWindowOpen]=useState(false);
  const [isAffiliateLinkWindowOpen,setAffiliateLinkWindowOpen]=useState(false);
  const [isBonusRequestWindowOpen,setBonusRequestWindowOpen]=useState(false);
  
  const [ipsListHTMLSyntax,setIPsListHTMLSyntax] = useState(constructIPsListSyntax());

  useEffect(() => {
    document.getElementById("nav-item-1").style.fontWeight="bold";
    updateIPsSearchResult(' ');
    setIPsListHTMLSyntax(constructIPsListSyntax());
  },[])

  useEffect(() => {

    const intervalId = setInterval(() => {
      // This code will run every 10 seconds
      //in development it is set to 10 hrs instead of 10000
      fetch('https://adalink.io/api/get-ips-list.php',{cache:'reload'})
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setIPsList(data);
        if(selectedIP!==undefined)
          selectedIPID=selectedIP["ID"];
        updateIPsSearchResult((document.getElementById('ipSearchInput').value))
        setIPsListHTMLSyntax(constructIPsListSyntax())
        
      })
      .catch((error) => {
        console.error('Error fetching incentive programs:', error);
      });
    }, 10000); //36000000 10000

    // Don't forget to clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }); // Empty dependency array to run the effect only once
 
  function updateIPsSearchResult(searchString){
    
    let searchResult;
    if(searchString === "" || searchString === " ")
      searchResult=ipsList;
    else
      searchResult = ipsList.reduce(function(list,ip) {if(sposRecord[ip['PoolID']]['DisplayName'].toLowerCase().includes(searchString.toLowerCase()) || ip['PoolID'].toLowerCase().includes(searchString) || sposRecord[ip['PoolID']]['Ticker'].toLowerCase().includes(searchString)){list.push(ip);}return list;},[]);
    
    
    //check filter values
    let minRewardRate = document?.getElementById('minRewardRate').value;
    let maxRewardRate = document?.getElementById('maxRewardRate').value;
    let minStartEpoch = document?.getElementById('minStartEpoch').value;
    let maxStartEpoch = document?.getElementById('maxStartEpoch').value;
    let minEndEpoch = document?.getElementById('minEndEpoch').value;
    let maxEndEpoch = document?.getElementById('maxEndEpoch').value;
    let campaignStatus = document?.getElementById("campaignStatus").value;
  
    //let filteredResult = searchResult;
    
    if(minRewardRate !== ''){
      searchResult = searchResult.reduce(function(list,ip) {if(parseFloat(ip['RewardRate'])/1000000>=parseFloat(minRewardRate))list.push(ip);return list;},[]);
    }
    if(maxRewardRate !== ''){
      searchResult = searchResult.reduce(function(list,ip) {if(parseFloat(ip['RewardRate'])/1000000<=parseFloat(maxRewardRate))list.push(ip);return list;},[]);
    }  
    if(minStartEpoch !== ''){
      searchResult = searchResult.reduce(function(list,ip) {if(ip['StartEpoch']>=minStartEpoch)list.push(ip);return list;},[]);
    }  
    if(maxStartEpoch !== ''){
      searchResult = searchResult.reduce(function(list,ip) {if(ip['StartEpoch']<=maxStartEpoch)list.push(ip);return list;},[]);
    } 
    if(minEndEpoch !== ''){
      searchResult = searchResult.reduce(function(list,ip) {if(ip['EndEpoch']>=minEndEpoch)list.push(ip);return list;},[]);
    }  
    if(maxEndEpoch !== ''){
      searchResult = searchResult.reduce(function(list,ip) {if(ip['EndEpoch']<=maxEndEpoch)list.push(ip);return list;},[]);
    } 
    if(campaignStatus == "active"){
      searchResult = searchResult.reduce(function(list,ip) {if((ip['EndEpoch']-1)>currentEpoch)list.push(ip);return list;},[]);
    }
    if(campaignStatus == "ended"){
      searchResult = searchResult.reduce(function(list,ip) {if((ip['EndEpoch']-1)<=currentEpoch)list.push(ip);return list;},[]);
    }
  
  
    searchedIPsList = searchResult;
        
    
  }


  function constructIPsListSyntax(){
    
    if(searchedIPsList === undefined)
      return "";
    //order searchedIPsList before mapping
    if(searchOrdering==1){
      searchedIPsList=searchedIPsList.sort((a,b) => parseInt(a[orderBy])-parseInt(b[orderBy]));
    }else if(searchOrdering==-1){
      searchedIPsList=searchedIPsList.sort((a,b) => parseInt(b[orderBy])-parseInt(a[orderBy]));
    }
    let htmlBlocks = searchedIPsList.map((ip) => (
      <div key={ip['PoolID']+ip['StartEpoch']} className="ip-section "  >
        <div className='ip-section-header ' onClick={() => {if(selectedIPID===ip["ID"]){selectedIPID="0";selectedIP=undefined}else{selectedIPID=ip["ID"];selectedIP=ip};setIPsListHTMLSyntax(constructIPsListSyntax())} }>
          <div className='spo-pfp-in-spo-header'>
            <img alt="" src={sposRecord[ip['PoolID']]["PFP"]} width={100} />
          </div>
          <div className='spo-header-parameter-section'>
            <div>TICKER</div>
            <div>{sposRecord[ip['PoolID']]["Ticker"]}</div>
          </div>
          <div className='spo-header-parameter-section'>
            <div>Reward Rate</div>
            <div>{displayNumberInPrettyFormat(parseFloat(ip["RewardRate"])/1000000)} ₳/Brought ₳</div>
          </div>
          <div className='spo-header-parameter-section'>
            <div>Start Epoch</div>
            <div>{ip['StartEpoch']}</div>
          </div>
          <div className='spo-header-parameter-section'>
            <div>Status</div>
            {currentEpoch<(ip['EndEpoch']-1)?
            <div>Active</div>
            :
            <div>Ended</div>
            }
          </div>
          <div className='spo-header-parameter-section'>
            {currentEpoch<(ip['EndEpoch']-1)?
            <>
            <div>Remaining Epochs</div>
            <div>{ip['EndEpoch']-currentEpoch-1}</div>
            </>
            :
            <>
            <div>End Epoch</div>
            <div>{ip['EndEpoch']}</div>
            </>
            }
          </div>
          <div className='spo-header-parameter-section'>
            <div>Program's Effect on Stake</div>
            {currentEpoch<(ip['EndEpoch']-1)?
            <div>{((sposRecord[ip['PoolID']]['LiveStake']/ip['PoolInitialStake']-1)*100).toFixed(2)}%</div>
            :
            <div>{((ip['PoolFinalStake']/ip['PoolInitialStake']-1)*100).toFixed(2)}%</div>
            }
          </div>                                
        </div>
        <div className='spo-section-body' id={"ip-"+ip["ID"]} style={{height: selectedIPID===ip["ID"]?document.getElementById("ip-"+ip["ID"]).scrollHeight:'0px'}}>
          <hr />
          <div className='spo-parameter-area'>
            <div>Initial Stake Amount of Pool (Before Campaign):</div>
            <div>{displayNumberInPrettyFormat((parseFloat(ip["PoolInitialStake"])/1000000).toFixed(0))} ₳</div>
          </div>
          <div className='ip-details-area'>
            <div className='spo-sub-details-area'>
              <div className='spo-parameter-area'>
                {currentEpoch<(ip['EndEpoch']-1)?
                <>
                <div>Current Live Stake of pool:</div>
                <div>{displayNumberInPrettyFormat((parseFloat(sposRecord[ip['PoolID']]["LiveStake"])/1000000).toFixed(0))} ₳</div>
                </>
                :
                <>
                <div>Pool's Stake After Campaign:</div>
                <div>{displayNumberInPrettyFormat((parseFloat(ip['PoolFinalStake'])/1000000).toFixed(0))} ₳</div>                
                </>}
              </div>    
              <div className='spo-parameter-area'>
                <div>Stake Amount needed to reach saturation:</div>
                <div>{displayNumberInPrettyFormat((parseFloat((sposRecord[ip['PoolID']]["LiveStake"]*((1/sposRecord[ip['PoolID']]["Saturation"])-1)))/1000000).toFixed(0))} ₳</div>
              </div>    
              <div className='spo-parameter-area'>
                <div>Remaining Rewards Per epoch:</div>
                {currentEpoch<(ip['EndEpoch']-1)?
                <div>{displayNumberInPrettyFormat(ip['MaximumRewardPerEpoch']/1000000*sposRecord[ip['PoolID']]["LiveStake"]*(1-sposRecord[ip['PoolID']]["Saturation"])/(sposRecord[ip['PoolID']]["LiveStake"]-sposRecord[ip['PoolID']]["Saturation"]*ip['PoolInitialStake']))} ₳</div>
                :
                <div>N/A</div>
                }
                </div>    
            </div>
            {
            currentEpoch<(ip['EndEpoch']-1)?
            <div className='ip-sub-details-area'>
              <button className='btnType1' onClick={() => {setBonusRequestWindowOpen(true)}}>Request bonus</button>
              <button className='btnType1' onClick={() => {setAffiliateLinkWindowOpen(true)}}>Generate affiliate link</button>
            </div>
            :
            <></>
            }
          </div>
        </div>
      </div>
    ));
    
    return(
      <div className={"slide-in-fwd-center"} id="spos-list">
          {htmlBlocks.every(function (block) {return block === ''})?
          <div className="" style={{marginLeft:"5px",color:"var(--major-color)"}}>There are no available incentive programs.</div>
          :
          htmlBlocks}
      </div>
  );
  }
  


  return (
    <div className="home">
      <div className="container">
        <div style={{height:"4rem"}}>{}</div>
        <div className=''>
          <div className='header-section-of-ips'>
            <div className="search-bar-container">
              <div className="search-bar">
                <img alt='' src={searchIcon} style={{marginLeft:"5px",marginTop:"6px",float:"left"}}/>  
                <input className="search-input" placeholder="Search by pool ticker, id or name..." id="ipSearchInput" onChange={() => {updateIPsSearchResult(document.getElementById('ipSearchInput').value);setIPsListHTMLSyntax(constructIPsListSyntax())}}></input>
              </div>
            </div>
            {(isLoggedIn && accountInfo["PoolID"]!==undefined)?
              <button className='btnType1' onClick={() => {setCreateWindowOpen(true)}}>Create new program</button>
              :
              <></>
            }
          </div>
          <div className='filter-container'>
            <img alt='' src={filterIcon} width={26}/>
            <div className='filter-parameter-element'>
              <div>Reward Rate</div>
              <div className='filter-arrows'>
                <div  className='filter-arrow-icon'
                      style={{color:(searchOrderingState===1&&orderByState==="RewardRate")?"var(--major-backgroundColor)":"var(--main-borderColor)"}}
                      onClick={() => {if(searchOrdering===1&&orderBy==="RewardRate"){searchOrdering=0;orderBy=null;setSearchOrdering(0);setOrderBy()}else{searchOrdering=1;orderBy="RewardRate";setSearchOrdering(1);setOrderBy("RewardRate")};setIPsListHTMLSyntax(constructIPsListSyntax())}}>
                  ▲
                </div>
                <div  className='filter-arrow-icon'
                      style={{color:(searchOrderingState===-1&&orderByState==="RewardRate")?"var(--major-backgroundColor)":"var(--main-borderColor)"}}
                      onClick={() => {if(searchOrdering===-1&&orderBy==="RewardRate"){searchOrdering=0;orderBy=null;setSearchOrdering(0);setOrderBy()}else{searchOrdering=-1;orderBy="RewardRate";setSearchOrdering(-1);setOrderBy("RewardRate")};setIPsListHTMLSyntax(constructIPsListSyntax())}}>
                  ▼
                </div>
              </div>
              <div className='filter-input-range' >
                <input  className='filter-input-text'  type='number' id='minRewardRate' onChange={() => {updateIPsSearchResult(document.getElementById('ipSearchInput').value);setIPsListHTMLSyntax(constructIPsListSyntax())}}/>
                <div>-</div>
                <input className='filter-input-text' type='number' id='maxRewardRate' onChange={() => {updateIPsSearchResult(document.getElementById('ipSearchInput').value);setIPsListHTMLSyntax(constructIPsListSyntax())}}/>
              </div>
            </div>
            <div className='filter-parameter-element'>
              <div>Start Epoch</div>
              <div className='filter-arrows'>
                <div  className='filter-arrow-icon'
                      style={{color:(searchOrderingState===1&&orderByState==="StartEpoch")?"var(--major-backgroundColor)":"var(--main-borderColor)"}}
                      onClick={() => {if(searchOrdering===1&&orderBy==="StartEpoch"){searchOrdering=0;orderBy=null;setSearchOrdering(0);setOrderBy()}else{searchOrdering=1;orderBy="StartEpoch";setSearchOrdering(1);setOrderBy("StartEpoch")};setIPsListHTMLSyntax(constructIPsListSyntax())}}>
                  ▲
                </div>
                <div  className='filter-arrow-icon'
                      style={{color:(searchOrderingState===-1&&orderByState==="StartEpoch")?"var(--major-backgroundColor)":"var(--main-borderColor)"}}
                      onClick={() => {if(searchOrdering===-1&&orderBy==="StartEpoch"){searchOrdering=0;orderBy=null;setSearchOrdering(0);setOrderBy()}else{searchOrdering=-1;orderBy="StartEpoch";setSearchOrdering(-1);setOrderBy("StartEpoch")};setIPsListHTMLSyntax(constructIPsListSyntax())}}>
                  ▼
                </div>
              </div>
              <div className='filter-input-range'>
                <input className='filter-input-text' type='number' id='minStartEpoch' onChange={() => {updateIPsSearchResult(document.getElementById('ipSearchInput').value);setIPsListHTMLSyntax(constructIPsListSyntax())}}/>
                <div>-</div>
                <input className='filter-input-text' type='number' id='maxStartEpoch' onChange={() => {updateIPsSearchResult(document.getElementById('ipSearchInput').value);setIPsListHTMLSyntax(constructIPsListSyntax())}}/>
              </div>
            </div>     
            <div className='filter-parameter-element'>
              <div>End Epoch</div>
              <div className='filter-arrows'>
                <div  className='filter-arrow-icon'
                      style={{color:(searchOrderingState===1&&orderByState==="EndEpoch")?"var(--major-backgroundColor)":"var(--main-borderColor)"}}
                      onClick={() => {if(searchOrdering===1&&orderBy==="EndEpoch"){searchOrdering=0;orderBy=null;setSearchOrdering(0);setOrderBy()}else{searchOrdering=1;orderBy="EndEpoch";setSearchOrdering(1);setOrderBy("EndEpoch")};setIPsListHTMLSyntax(constructIPsListSyntax())}}>
                  ▲
                </div>
                <div  className='filter-arrow-icon'
                      style={{color:(searchOrderingState===-1&&orderByState==="EndEpoch")?"var(--major-backgroundColor)":"var(--main-borderColor)"}}
                      onClick={() => {if(searchOrdering===-1&&orderBy==="EndEpoch"){searchOrdering=0;orderBy=null;setSearchOrdering(0);setOrderBy()}else{searchOrdering=-1;orderBy="EndEpoch";setSearchOrdering(-1);setOrderBy("EndEpoch")};setIPsListHTMLSyntax(constructIPsListSyntax())}}>
                  ▼
                </div>
              </div>
              <div className='filter-input-range'>
                <input className='filter-input-text' type='number' id='minEndEpoch' onChange={() => {updateIPsSearchResult(document.getElementById('ipSearchInput').value);setIPsListHTMLSyntax(constructIPsListSyntax())}}/>
                <div>-</div>
                <input className='filter-input-text' type='number' id='maxEndEpoch' onChange={() => {updateIPsSearchResult(document.getElementById('ipSearchInput').value);setIPsListHTMLSyntax(constructIPsListSyntax())}}/>
              </div>
            </div>
            <div className='filter-parameter-element'>
              <div>Status</div>
              <select id="campaignStatus" onChange={() => {updateIPsSearchResult(document.getElementById('ipSearchInput').value);setIPsListHTMLSyntax(constructIPsListSyntax())}}>
                <option value="active">Active</option>
                <option value="all">All</option>
                <option value="ended">Ended</option>
              </select>
            </div>                    
          </div>
          <div className='spos-section'>
            {ipsListHTMLSyntax}  
          </div>          
        </div>
      </div>
    {isCreateProgramWindowOpen &&
    <CreateProgramWindow
      isLoggedIn={isLoggedIn}
      accountInfo={accountInfo}
      walletAPI={walletAPI}
      lucid={lucid}
      onClose={() => {setCreateWindowOpen(false)}}
      setMessageWindowContent={setMessageWindowContent}
      setMessageWindowButtonText={setMessageWindowButtonText}
      setShowMessageWindow={setShowMessageWindow}  
    />
    }
    {isAffiliateLinkWindowOpen &&
    <AffiliateLinkWindow
      isLoggedIn={isLoggedIn}
      accountInfo={accountInfo}
      ip={selectedIP}
      spo={sposRecord[selectedIP["PoolID"]]}
      setImportantIPsList={setImportantIPsList}
      onClose={() => {setAffiliateLinkWindowOpen(false)}}
      setMessageWindowContent={setMessageWindowContent}
      setMessageWindowButtonText={setMessageWindowButtonText}
      setShowMessageWindow={setShowMessageWindow}  
    />
    }
    {isBonusRequestWindowOpen &&
    <BonusRequestWindow
      isLoggedIn={isLoggedIn}
      accountInfo={accountInfo}
      ip={selectedIP}
      spo={sposRecord[selectedIP["PoolID"]]}
      setImportantIPsList={setImportantIPsList}
      onClose={() => {setBonusRequestWindowOpen(false)}}
      setMessageWindowContent={setMessageWindowContent}
      setMessageWindowButtonText={setMessageWindowButtonText}
      setShowMessageWindow={setShowMessageWindow}  
    />
    }
    </div>
  );
}

export default Home;
