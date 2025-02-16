"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import SignUpModal from "./components/SignUpModal";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const handleShowSignUpModal = () => setShowSignUpModal(true);
  const handleCloseSignUpModal = () => setShowSignUpModal(false);

  return (
    <html lang="en">
      <head>
        <meta property="og:title" content="CareerChain" />
        <meta property="og:description" content="CareerChain will help you with your tasks and answer most if not all of your queries. You can use CareerChain as a chatGPT alternative." />
        <meta property="og:image" content="/openai.svg" />
        <link rel="icon" href="/opena.svg" type="image/png" />
        {/* Add other head elements like stylesheets or scripts here */}
      </head>
      <body className={inter.className}>
        {children}
        <SignUpModal show={showSignUpModal} handleClose={handleCloseSignUpModal} />
      </body>
    </html>
  );
}