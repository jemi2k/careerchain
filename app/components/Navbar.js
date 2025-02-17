import Link from "next/link";
import { useEffect, useState } from "react";
import { LuMenu } from "react-icons/lu";
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';

const contractAddress = '0x442824aef91ac0f4F3B207CE6829713042c0De67';
const contractABI = [
  "function getProfile(address user) public view returns (string memory)"
];

const Navbar = ({ userName, userAddress, setUserName, setUserAddress, handleShowModal }) => {
  const menuItems = ["About", "Services"];
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLinkClick = () => {
    setShowMenu(false);
  };

  const trimAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleStartHereClick = async () => {
    try {
      const web3Modal = new Web3Modal();
      const instance = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(instance);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      setUserAddress(walletAddress);

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
        setUserName(profile.name);
      } else {
        handleShowModal();
      }
    } catch (error) {
      console.error("Error connecting wallet or retrieving profile data:", error);
    }
  };

  return (
    <nav
      className={`w-[100vw] shadow-lg z-50 ${
        isScrolled ? "text-black" : "text-[#ffffffbf]"
      } transition-all duration-200 `}
    >
      <div className="container mx-auto flex items-center px-5 py-6">
        <Link href="/" className="font-extrabold text-3xl">
          Career<span className="text-purple-700">Chain</span>
        </Link>
        
        {/* Mobile Menu Button */}
        <div
          className={`flex md:hidden p-2 ml-auto shadow-xl rounded-sm hover:scale-105 transition-all duration-300 ${
            isScrolled ? "bg-black text-white" : "bg.white text-black"
          }`}
          onClick={() => setShowMenu((prev) => !prev)}
          role="button"
          aria-label="Toggle Menu">
            <LuMenu/>
        </div>

        {/* Menu Items */}
        <div
          className={`fixed md:relative ml-auto top-16 md:top-0 left-0 overflow-y-auto bottom-0 h-[90vh] w.full md:w-auto md:h-auto flex flex-col md:flex-row md:space-x-6 md:translate-y-0 transition-transform duration-300 justify-center ${
            showMenu ? "translate-y-0" : "translate-y-full md:translate-y-0"
          }`}
        >
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={`#${item.toLowerCase()}`}
              onClick={handleLinkClick}
              className={`${
                isScrolled ? "hover:text-purple-600" : "hover:text-white"
              } font-semibold transition-all duration-300 p-3 md:p-1`}
            >
              {item}
            </Link>
          ))}
          <button
            onClick={handleStartHereClick}
            className={`${
              isScrolled ? "hover:text-purple-400" : "hover:text-white"
            } font-semibold transition-all duration-300 p-3 md:p-1  rounded-xl `}
          >
            {userName ? `${userName} (${trimAddress(userAddress)})` : 'Start Here 🚀'}
            <div className="absolute inset-0 border-2 border-purple-700 rounded-lg animate-border glow"></div>

            <style jsx>{`
              @keyframes borderMove {
                0% { clip-path: inset(0 0 97% 0); }
                25% { clip-path: inset(0 97% 0 0); }
                50% { clip-path: inset(97% 0 0 0); }
                75% { clip-path: inset(0 0 0 97%); }
                100% { clip-path: inset(0 0 97% 0); }
              }

              .animate-border {
                animation: borderMove 3s linear infinite;
              }

              .glow {
                box-shadow: 0 0 15px rgba(0, 102, 255, 0.8),
                            0 0 30px rgba(0, 102, 255, 0.6),
                            0 0 45px rgba(0, 102, 255, 0.4);
              }

              button {
                position: relative;
                right: 5px; 
              }
            `}</style>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;