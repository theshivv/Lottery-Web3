import React, { useState, useEffect } from "react";
import "./Manager.css";

const Manager = ({ state }) => {
  const [account, setAccount] = useState("");
  const [cbalance, setcbalance] = useState(0);
  const [lwinner, setlwinner] = useState("No Winner Yet");

  const setAccountListener = (provider) => {
    provider.on("accountsChanged",(accounts) =>{
      setAccount(accounts[0]);
  })
  }

  useEffect(() => {
    const getAccount = async () => {
      const { web3 } = state;
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);
      console.log(accounts[0]);
      setAccountListener(web3.givenProvider);
      setAccount(accounts[0]);
    };
    state.web3 && getAccount();
  }, [state, state.web3]);

  const contractBalance = async () => {
    const { contract } = state;
    try {
        // console.log("Manager :",contract.methods.Manager().call());
      const balance = await contract.methods.getBalance().call({ from: account });
      console.log("Balance :",
      
      
      
      
      
      balance);
      setcbalance(balance);
    } catch (e) {
      setcbalance("You are not the manager");
    }
  };

  const winner = async () => {
    const { contract } = state;
    try {
      await contract.methods.pickWinner().send({ from: account }); //as changing state of blockchain
      const lotteryWinner = await contract.methods.winner().call(); //not changing the state of blockchain

      console.log("Lottery Winner:",lotteryWinner);
      setlwinner(lotteryWinner);
    } catch (e) {
      if (e.message.includes("You are not the manager")) {
        setlwinner("You are not the manager");
      } else if (
        e.message.includes("Players are less than 3")
      ) {
        setlwinner("Players are less than 3");
      } else {
        setlwinner("No winner yet");
      }
    }
  };

  return (
    <ul className="list-group" id ="list">
        <div className="center">
            <li className="list-group-item" aria-disabled="true">
                <b>Connected Account: </b> {account}
            </li>
            <li className="list-group-item">
                <b>Winner : </b>
                {lwinner}
            <button className="button1" onClick={winner}>
                Click for Winner
            </button>
            </li>
            <li className="list-group-item">
                <b>Balance : </b> {cbalance} ETH
                <button className="button1" onClick={contractBalance}>
                    Click For Balance
                </button>
            </li>

        </div>
        </ul>
    
  );
};

export default Manager;
