"use client";

import React, { useState, useEffect } from "react";
import Chatbot from "./components/Chatbot";
import Navbar from "./components/Navbar";
import Masthead from "./components/Masthead";
import Footer from "./components/Footer";
import About from "./components/About";
import Services from "./components/Services";
import SignUpModal from "./components/SignUpModal";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

const contractAddress = "0x442824aef91ac0f4F3B207CE6829713042c0De67"; 
const contractABI = ["function getProfile(address user) public view returns (string memory)"];

export default function Chat() {
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState("");
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
      const walletAddress = await signer.getAddress();

      setProvider(provider);
      setAddress(walletAddress);

      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const storedIpfsHash = await contract.getProfile(walletAddress);
      if (storedIpfsHash) {
        const response = await fetch(`https://ipfs.io/ipfs/${storedIpfsHash}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
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
    const openModal = () => setShowSignUpModal(true);
    window.addEventListener("openSignUpModal", openModal);
    return () => window.removeEventListener("openSignUpModal", openModal);
  }, []);

  return (
    <div className="page-top">
      <Chatbot />
      <div className="relative flex min-h-screen w-full flex-col bg-img">
        <div className="absolute inset-0 bg-gray-800 opacity-60 z-0 pointer-events-none"></div>
        <div className="relative z-10">
          <Navbar
            userName={userName}
            userAddress={address}
            setUserName={setUserName}
            setUserAddress={setAddress}
            handleShowModal={handleShowSignUpModal}
          />
          <Masthead />
        </div>
      </div>
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
      <Footer />
      <SignUpModal
        show={showSignUpModal}
        handleClose={handleCloseSignUpModal}
        setUserName={setUserName}
        setAddress={setAddress}
      />
    </div>
  );
}
