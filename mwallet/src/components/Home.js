import "./Home.css";
import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div className="content">
        <h2 className="title">Best Crypto Wallet</h2>
        <h4 className="subtitle">Secure, Self Custodial, Decentralized</h4>
        <Button
          onClick={() => navigate("/createaccount")}
          className="frontPageButton"
          type="primary"
        >
          Create A Wallet
        </Button>
        <Button
          onClick={() => navigate("/recover")}
          className="frontPageButton"
          type="default"
        >
          Sign In With Seed Phrase
        </Button>
      </div>
    </>
  );
}

export default Home;
