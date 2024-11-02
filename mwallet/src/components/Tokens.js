import React from 'react';
import { List, Avatar } from 'antd';
import './Tokens.css';

const Tokens = ({ tokens, logo }) => {
  return (
    <div className='tokens-container'>
      {tokens ? (
        <>
          <List
            bordered
            className="tokenList"
            itemLayout="horizontal"
            dataSource={tokens}
            renderItem={(item, index) => (
              <List.Item
                className="tokenName"
                style={{ textAlign: "left" }}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.logo || logo} />}
                  title={item.symbol}
                  description={item.name}
                />
                <div className="tokenAmount">
                  {(
                    Number(item.balance) /
                    10 ** Number(item.decimals)
                  ).toFixed(3)}{" "}
                  Tokens
                </div>
              </List.Item>
            )}
          />
        </>
      ) : (
        <>
          <span>You seem to not have any tokens yet</span>
        </>
      )}
    </div>
  );
};

export default Tokens;