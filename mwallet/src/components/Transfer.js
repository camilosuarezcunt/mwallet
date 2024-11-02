import React, { useEffect, useState } from "react";
import { Input, Button, Spin, Tooltip, Form } from 'antd';
import { ethers } from "ethers";
import './Transfer.css';

const Transfer = ({
  balance,
  CHAINS_CONFIG,
  selectedChain,
  seedPhrase,
  processing,
  setProcessing,
  getAccountTokens
}) => {
  const [amountToSend, setAmountToSend] = useState(null);
  const [sendToAddress, setSendToAddress] = useState(null);
  const [hash, setHash] = useState(null);

  async function sendTransaction(to, amount) {
    const chain = CHAINS_CONFIG[selectedChain];

    const provider = new ethers.JsonRpcProvider(chain.rpcUrl);

    const privateKey = ethers.Wallet.fromPhrase(seedPhrase).privateKey;

    const wallet = new ethers.Wallet(privateKey, provider);

    const tx = {
      to: to,
      value: ethers.parseEther(amount.toString()),
    };

    setProcessing(true);
    try {
      const transaction = await wallet.sendTransaction(tx);

      setHash(transaction.hash);
      const receipt = await transaction.wait();

      setHash(null);
      setProcessing(false);
      setAmountToSend(null);
      setSendToAddress(null);

      if (receipt.status === 1) {
        getAccountTokens();
      } else {
        console.log("failed");
      }
    } catch (err) {
      setHash(null);
      setProcessing(false);
      setAmountToSend(null);
      setSendToAddress(null);
    }
  }

  return (
    <div className="transfer-container">
      <h3 className="header-white title">Native Balance</h3>
      <h1 className="header-white">
        {balance.toFixed(3)} {CHAINS_CONFIG[selectedChain].ticker}
      </h1>
      <div className="sendRow">
        <Form.Item
          label={<p className="transfer-text">To:</p>}
          className="transfer-form-item"
        >
          <Input
            value={sendToAddress}
            onChange={(e) => setSendToAddress(e.target.value)}
            placeholder="0x..."
            className="transfer-form input-to"
          />
        </Form.Item>
      </div>
      <div className="sendRow">
        <Form.Item
          label={<p className="transfer-text">Amount:</p>}
          className="transfer-form-item"
        >
          <Input
            value={amountToSend}
            onChange={(e) => setAmountToSend(e.target.value)}
            placeholder="Native tokens you wish to send..."
            className="transfer-form input-amount"
          />
        </Form.Item>
      </div>
      <Button
        type="primary"
        onClick={() => sendTransaction(sendToAddress, amountToSend)}
        className="transfer-button"
      >
        Send Tokens
      </Button>

      {processing && (
        <>
          <Spin />
          {hash && (
            <Tooltip title={hash}>
              <p>Hover For Tx Hash</p>
            </Tooltip>
          )}
        </>
      )}
    </div>
  );
};

export default Transfer;