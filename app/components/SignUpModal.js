import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { Modal, Button, Form } from 'react-bootstrap';
import { create as ipfsHttpClient } from 'ipfs-http-client';

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

const contractAddress = '0x442824aef91ac0f4F3B207CE6829713042c0De67';
const contractABI = [
  "function setProfile(string memory ipfsHash) public",
  "function getProfile(address user) public view returns (string memory)"
];

const SignUpModal = ({ show, handleClose, setUserName, setAddress }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [provider, setProvider] = useState(null);
  const [address, setLocalAddress] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [profileData, setProfileData] = useState(null);

  const connectWallet = async () => {
    try {
      const web3Modal = new Web3Modal();
      const instance = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(instance);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      setProvider(provider);
      setLocalAddress(walletAddress);

      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const storedIpfsHash = await contract.getProfile(walletAddress);
      if (storedIpfsHash) {
        const response = await fetch(`https://ipfs.io/ipfs/${storedIpfsHash}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        const profile = await response.json();
        setProfileData(profile);
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
      const profile = { name, email, address };
      const added = await client.add(JSON.stringify(profile));
      const ipfsHash = added.path;
      setIpfsHash(ipfsHash);

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      await contract.setProfile(ipfsHash);

      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Wallet Address:', address);
      console.log('IPFS Hash:', ipfsHash);

      const event = new CustomEvent('signUpSuccess', {
        detail: { name, wallet: address }
      });
      window.dispatchEvent(event);

      setUserName(name);
      setAddress(address);
      handleClose();
    } catch (error) {
      console.error("Error uploading to IPFS or interacting with the contract:", error);
    }
  };

  const trimAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Hi Buddy 🙌 Join here</Modal.Title>
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