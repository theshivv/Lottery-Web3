import React, {useEffect, useState} from "react";


const Players = ({state,address}) => {
    const [account, setAccount] = useState("No Account Connected");
    const [registerPlayers, setRegisterPlayers] = useState([]);
    const [reload, setReload] = useState(false);

    const reloadEffect = () => {
      setReload(!reload);
    }

    const setAccountListener = (provider) => {
      provider.on("accountsChanged",(accounts) =>{
        setAccount(accounts[0]);
    })
    }



    useEffect(() => {
      
        const getAccounts =async() => {
            const {web3} =state;
            const accounts = await web3.eth.getAccounts();
            setAccountListener(web3.givenProvider);
            setAccount(accounts[0]);
        }
        state.web3 && getAccounts();

    }, [state, state.web3]);

    useEffect(() => {
      const getPlayers = async() => {
            const {contract} =state;
            const players = await contract.methods.allPlayers().call();
            console.log("Players :",players);
            const registerPlayers = await Promise.all(
                players.map((player) => {
                    return player;
                })
            )
            console.log("Registered Players: ",registerPlayers);
            setRegisterPlayers(registerPlayers);
            reloadEffect();
      }

      state.contract && getPlayers();

    }, [state, state.contract,reload]);
    
    

  return (
    <>
      <ul className="list-group" id="list">
        <div className="center">
          <li className="list-group-item" aria-disabled="true">
            <b>Connected account :</b> {account}
          </li>
          <li className="list-group-item">
            <b>Please pay 0.01 ether on this contract address : </b> {address}
          </li>
          <li className="list-group-item">
            <b>Registerd Players </b>:
            <br />
            <br />
            {registerPlayers.length !== 0 &&
              registerPlayers.map((name) => <p key={name}>{name}</p>)}
          </li>
        </div>
      </ul>
    </>
  )
}

export default Players;
