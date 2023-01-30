
import './App.css';
import {Container, Row, Col} from 'react-bootstrap';
import Web3Modal from 'web3modal';
import {providers, Contract} from 'ethers';
import { useEffect, useRef, useState } from 'react'
import {WHITELIST_CONTRACT_ADDRESS, abi} from './constants';

function App() {

  const [walletConnected, setWalletConnected] = useState(false); //Checks if wallet is connected
  const [joinedWhitelist, setJoinedWhitelist] = useState(false); //Checks if address has joined the whitelist or not
  const [loading, setLoading] = useState(false); //False if not loading, true when waiting for transaction to happen
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);  //Checks the number of whitelisted address
  const web3ModalRef = useRef();

  const [email, setEmail] = useState(""); // For email address
  const [message, setMessage] = useState(""); //For message if invalid address or not, initial state is empty
  const [Show, setShow] = useState(false); // Hides the input box, initial as false unless stated as true


  // Get provider and signer in the wallet
  const getProviderOrSigner = async (needSigner = false) => {
  
    const provider = await web3ModalRef.current.connect(); // To connect to our wallet
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork(); //Gets tha ChainId of the network being used
    if (chainId !== 5) {
      window.alert("Change the network to Goerli");
      throw new Error("Change network to Goerli");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  // Add adress to the Whitelist
  const addAddressToWhitelist = async () => {
    try {
     
      const signer = await getProviderOrSigner(true); 
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      
      const tx = await whitelistContract.addAddresstoWhitelist();
      
      setLoading(true);
      await tx.wait();
      setLoading(false);
      
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);

    } catch (err) {
      console.error(err);
    }
  };

  // The total number of Whitelisted Address
  const getNumberOfWhitelisted = async () => {
    try {
     
      const provider = await getProviderOrSigner();
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );

      const _numberOfWhitelisted = await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhitelisted(_numberOfWhitelisted);

    } catch (err) {
      console.error(err);
    }
  };

  // Checks if the address is already in the whitlist
  const checkIfAddressInWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      
      const address = await signer.getAddress();
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        address
      );
      setJoinedWhitelist(_joinedWhitelist);
    } catch (err) {
      console.error(err);
    }
  };

  //Connects wallet
  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);

      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();
      ShowInput();
    } catch (err) {
      console.error(err);
    }
  };

  //Button function will be used in the frontend
  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className="description">
            Thanks for joining the Whitelist!
          </div>
        );
      } else if (loading) {
        return <button className='button'>Loading...</button>;
      } else {
        return (
          <button onClick={emailValidation} className='button'>
            Join the Whitelist
          </button>
        );
        
      }
    } else { 
      return (
        <button onClick={connectWallet} className='button'>
          Connect your wallet
        </button>
      );
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  const emailValidation = () => { //For onclick, two process is happening the validation of email and adding address to whitelist
    const EmailFormat = /[a-zA-Z0-9._]+@[a-z]+\.[a-z]{2,8}(.[a-z{2,8}])?/; //name@domain.extension.optional extension
    if (EmailFormat.test(email)) {
      setMessage(""); //For setting the message that will appear
      addAddressToWhitelist();
    } 
    
    else if (!EmailFormat.test(email) && email === "") {
      setMessage("Please Enter a Valid Email Address");
    } 

    else {
      setMessage("");
    }
  };

  const handleOnChange = (e) => { // Gets the value in the input field
    setEmail(e.target.value); 
  };

  const ShowInput = event => { //An event to show the input box, set it to true
    setShow(true);
  };


  return (

      <Container className='bg'>
        <Row className='main'>
          <Col className='col'>
          <h1 className='title'>WHITLISTING REGISTRATION</h1>

          <div className='description'>
            {numberOfWhitelisted} have already joined the Whitelist
          </div><br></br>
          
            {Show && (<div className='inputbox'> 
              Email Address: <input className='textbox' type="text" value={email} onChange={handleOnChange}></input>
              <p className="message">{message}</p>
            </div>)}

          <div className='divButton'>{renderButton()}</div>
          
          </Col>
        </Row>

    
    <footer className='footer'>Made by 247Codecamp </footer>

     </Container>

    
  );
}

export default App;
