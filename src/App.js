import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Components
import Navigation from './components/Navigation';
import Search from './components/Search';
import Home from './components/Home';

// ABIs
import RealEstate from './abis/RealEstate.json';
import Escrow from './abis/Escrow.json';

// Config
import config from './config.json'

// Metadata
import metadata1 from './metadata/1.json'
import metadata2 from './metadata/2.json'
import metadata3 from './metadata/3.json'

function App() {
  const [provider, setProvider] = useState(null)
  const [escrow, setEscrow] = useState(null)

  const [account, setAccount] = useState(null)

  const [homes, setHomes] = useState([])
  const [home, setHome] = useState({})
  const [toggle, setToggle] = useState(false);

  const loadBlockchainData = async() => {
    const provider = new ethers. providers.JsonRpcProvider(config.INFURA_ENDPOINT)
    setProvider(provider)

    // Real Estate Contract
    const realEstateContract = new ethers.Contract(RealEstate.address, RealEstate.abi, provider)
    let totalSupply = await realEstateContract.totalSupply()
    totalSupply = parseInt(totalSupply._hex)

    const homes = []
    homes.push(metadata1)
    homes.push(metadata2)
    homes.push(metadata3)
    setHomes(homes)

    // Escrow Contract
    const escrowContract = new ethers.Contract(Escrow.address, Escrow.abi, provider)
    setEscrow(escrow)

    window.ethereum.on('accountsChanges', async() => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account)
    })   
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  const togglePop = (home) => {
    setHome(home)
    toggle ? setToggle(false) : setToggle(true);
  }

  return (
    <div>
      <Navigation account={account} setAccount={setAccount}/>
      <Search />

      <div className='.cards__section'>
        <h3>Homes for you</h3>
        <hr/>

        <div className='cards'>
          {homes.map((home, index) => (
            <div className='card' key={index} onClick={() => togglePop(home)}>
              <div className='card__image'>
                <img src={home.image} alt='Home'/>
              </div>
              <div className='card__info'>
                <h4>{home.attributes[0].value}</h4>
                <p>
                  <strong>{home.attributes[2].value}</strong> bds |
                  <strong>{home.attributes[3].value}</strong> ba |
                  <strong>{home.attributes[4].value}</strong> sqft
                </p>
                <p>{home.address}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {toggle && (
        <Home home={home} provider={provider} account={account} escrow={escrow} togglePop={togglePop} />
      )}
    </div>
  );
}

export default App;
