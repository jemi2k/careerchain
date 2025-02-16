"use client";

import React, { useState, useEffect } from "react";
import Chatbot from "./components/Chatbot";
import Navbar from "./components/Navbar";
import Masthead from "./components/Masthead";
import Footer from "./components/Footer";
import About from "./components/About";
import Services from "./components/Services";
import Portfolio from "./components/Portifolio";
import SignUpModal from "./components/SignUpModal";
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';

const contractAddress = '0x442824aef91ac0f4F3B207CE6829713042c0De67'; // Corrected contract address
const contractABI = [
  // ABI of the UserProfile contract
  "function getProfile(address user) public view returns (string memory)"
];

export default function Chat() {
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState('');
  const [userName, setUserName] = useState(null);
  const [profileData, setProfileData] = useState(null);

  const handleShowSignUpModal = () => setShowSignUpModal(true);
  const handleCloseSignUpModal = () => setShowSignUpModal(false);

  const connectWallet = async () => {
    try {
      const web3Modal = new Web3Modal();
      const instance = await web3Modal.connect();
      
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
        setUserName(profile.name);
        setProfileData(profile);
      }
    } catch (error) {
      console.error("Error connecting wallet or retrieving profile data:", error);
    }
  };

  useEffect(() => {
    const openModal = () => {
      setShowSignUpModal(true);
    };

    window.addEventListener("openSignUpModal", openModal);

    return () => {
      window.removeEventListener("openSignUpModal", openModal);
    };
  }, []);

  return (
    <div className="page-top">
      {/* Chatbot */}
      <Chatbot />

      {/* Background with Opacity */}
      <div className="relative flex min-h-screen w-full flex-col bg-img">
        {/* Opacity Layer */}
        <div className="absolute inset-0 bg-gray-800 opacity-60 z-0 pointer-events-none"></div>

        {/* Navbar and Masthead */}
        <div className="relative z-10">
          <Navbar 
            userName={userName} 
            userAddress={address} 
            connectWallet={connectWallet} 
            handleShowModal={handleShowSignUpModal} 
          />
          <Masthead />
        </div>
      </div>

      {/* Content Sections */}
      <div id="about">
        <About />
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <div id="services">
          <Services />
        </div>
      </div>
      <div id="sign-up">
        {/* Placeholder for Sign Up section */}
      </div>
      {/* <Portfolio /> */}
      <Footer />

      {/* Sign Up Modal */}
      <SignUpModal 
        show={showSignUpModal} 
        handleClose={handleCloseSignUpModal} 
        provider={provider} 
        address={address} 
        setProvider={setProvider} 
        setAddress={setAddress} 
        setUserName={setUserName} 
        profileData={profileData}
        setProfileData={setProfileData}
      />
    </div>
  );
}
