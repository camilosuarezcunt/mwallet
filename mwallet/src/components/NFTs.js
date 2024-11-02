// import "../App.css";
import React from 'react';
import './NFTs.css';

const NFTs = ({ nfts }) => {
  return (
    <div className="nfts-container">
      {nfts ? (
        <>
          {nfts.map((e, i) => (
            e && (
              <img
                key={i}
                className="nftImage"
                alt="nftImage"
                src={e}
              />
            )
          ))}
        </>
      ) : (
        <>
          <span className='nunito-font'>You seem to not have any NFTs yet</span>
        </>
      )}
    </div>
  );
};

export default NFTs;