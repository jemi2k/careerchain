import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';

// Replace with your Infura project ID and project secret
const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET;
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

// Replace with your deployed contract address and ABI
const contractAddress = '0x442824aef91ac0f4F3B207CE6829713042c0De67'; // Corrected contract address
const contractABI = [
  {
		"inputs": [
			{
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			}
		],
		"name": "setProfile",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getProfile",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const SignUpModal = ({ show, handleClose, provider, address, setProvider, setAddress, setUserName, profileData, setProfileData }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [modalShow, setModalShow] = useState(show);

  useEffect(() => {
    const handleOpenSignUpModal = () => {
      handleShow();
    };

    window.addEventListener("openSignUpModal", handleOpenSignUpModal);

    return () => {
      window.removeEventListener("openSignUpModal", handleOpenSignUpModal);
    };
  }, []);

  useEffect(() => {
    setModalShow(show);
  }, [show]);

  useEffect(() => {
    if (profileData) {
      setName(profileData.name);
      setEmail(profileData.email);
    }
  }, [profileData]);

  const handleShow = () => {
    setModalShow(true);
  };

  const handleCloseModal = () => {
    setModalShow(false);
    handleClose();
  };

  const connectWallet = async () => {
    try {
      const web3Modal = new Web3Modal();
      const instance = await web3Modal.connect();
      
      // Use the correct ethers v6 syntax
      const provider = new ethers.BrowserProvider(instance);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      setProvider(provider);
      setAddress(address);

      // Retrieve user profile data from the smart contract
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const ipfsHash = await contract.getProfile(address);
      if (ipfsHash) {
        const response = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        const profile = await response.json();
        setProfileData(profile);
        setName(profile.name);
        setEmail(profile.email);
        setUserName(profile.name);
      }
    } catch (error) {
      console.error("Error connecting wallet or retrieving profile data:", error);
    }
  };

  const handleSignUp = async () => {
    if (!provider) {
      alert('Please connect your wallet first.');
      return;
    }

    try {
      // Upload user profile to IPFS
      const profile = { name, email, address };
      const added = await client.add(JSON.stringify(profile));
      const ipfsHash = added.path;
      setIpfsHash(ipfsHash);

      // Interact with the smart contract
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      await contract.setProfile(ipfsHash);

      // Emit the userSignedUp event
      const event = new CustomEvent("userSignedUp", { detail: { name, address } });
      window.dispatchEvent(event);

      // Handle sign-up logic here
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Wallet Address:', address);
      console.log('IPFS Hash:', ipfsHash);

      handleCloseModal();
    } catch (error) {
      console.error("Error uploading to IPFS or interacting with the contract:", error);
    }
  };

  const trimAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Modal show={modalShow} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Start your journey, Buddy! 🚀</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!provider && (
          <div className="mb-3">
            <h5 className='mb-2'>Connect your wallet</h5>
            <Button 
              onClick={connectWallet} 
              style={{ backgroundColor: '#6B21A8', borderColor: '#6B21A8' }}
              className="mb"
            >
              Connect Wallet
            </Button>
          </div>
        )}
        {provider && (
          <div className="mb-4">
            <h5>Wallet Connected</h5>
            <p>Address: {trimAddress(address)}</p>
            {profileData && (
              <div>
                <h5>Profile Info:</h5>
                <p>Name: {profileData.name}</p>
                <p>Email: {profileData.email}</p>
              </div>
            )}
          </div>
        )}
        <Form>
          <Form.Group controlId="formName" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Button 
            variant="primary" 
            onClick={handleSignUp}
            style={{ backgroundColor: '#6B21A8', borderColor: '#6B21A8' }}
          >
            {profileData ? 'Update' : 'Sign Up'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SignUpModal;