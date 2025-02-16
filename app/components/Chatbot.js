"use client";

import React, { useEffect, useState, useRef } from "react";
import { useChat } from "ai/react";
import { IoArrowBackSharp, IoArrowForward, IoSend } from "react-icons/io5";


const Chatbot = () => {
     const { messages, input, handleInputChange, handleSubmit } = useChat();
      const [isOpen, setIsOpen] = useState(false);
      const [showChatbot, setShowChatbot] = useState(false);
      const bottomRef = useRef();
    
      const mongoSubmit = async () => {
        const response = await fetch("/api/chat/sendChats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: "fidel@gmail.com", messages }),
        });
        await response.json();
      };
    
      const sendChats = async (e) => {
        handleSubmit(e);
        mongoSubmit();
      };
    
      useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [messages]);
    

  return (
 <div>
      {/* Chatbot Icon/Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`custom-chatbot-button ${
          isOpen && "hidden"
        } z-50 w-[70px] bg-white rounded-full p-3`}
        style={{ position: "fixed", bottom: "50px", right: "20px" }}
      >
        <img src="/chat-bot-icon.png" alt="Chatbot Icon" />
      </button>

      {isOpen && !showChatbot && (
        <div className="chat-bot-initial fixed bottom-[70px] right-[20px] bg-white flex flex-col justify-center max-h-[80%] w-[90%] sm:w-[350px] z-50 px-10 py-10 items-center gap-9 rounded shadow-2xl">
          <div
            className="text-[#BA53E1] items-start self-start relative top-5"
            onClick={() => setIsOpen(false)}
          >
            <IoArrowBackSharp
              size={"2rem"}
              className="cursor-pointer relative h-[20px] transition-all duration-200 hover:right-[5px]"
            />
          </div>
          <h2 className="text-[#8E5DF5] text-[18px] sm:text-[24px] h-[70px]">
            Your Assistant is Ready
          </h2>
          <img
            src="/chat-bot-icon.png"
            alt="Chatbot Icon"
            className="w-[106px] h-[166px] sm:w-[176px] sm:h-[166px]"
          />
          <button
            onClick={() => setShowChatbot(true)}
            className="bg-[#BA53E1] text-white text:[16px] sm:text-[20px] rounded-[10px] shadow-[0px_3px_3px_0px_#00000040] w-[55vw] sm:w-[200px] p-2 flex items-center relative hover:top-[-2px] transition-top"
          >
            <p className="m-auto">Continue</p>
            <IoArrowForward className="ml-auto text-black" size={"1.5rem"} />
          </button>
        </div>
      )}

      {isOpen && showChatbot && (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white fixed bottom-0 right-0 w-[90%] sm:w-[400px] h-[90%] z-50 shadow-2xl">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-600">
            <h1 className="text-xl font-semibold">Assistant</h1>
            <button onClick={() => setIsOpen(false)} className="text-red-400">
              Close
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-grow p-4 overflow-auto">
            {messages.map((m, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg mb-2 ${
                  m.role === "user"
                    ? "bg-blue-500 self-end text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                {m.content}
              </div>
            ))}
            <div ref={bottomRef}></div>
          </div>

          {/* Chat Input */}
          <form
            onSubmit={sendChats}
            className="p-4 bg-gray-800 border-t border-gray-600 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={handleInputChange}
              className="flex-grow p-2 bg-gray-700 text-white rounded-lg outline-none"
            />
            <button type="submit" className="text-white bg-blue-500 p-2 rounded-lg">
              <IoSend size={"1.5rem"} />
            </button>
          </form>
        </div>
      )}
    </div>  )
}
export default Chatbot