import React from "react";
import "./Loader.css";

const Loader = () => {
    return (
        <div>
            <p>Minting your NFT...</p>
            <div className="lds-roller">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}

export default Loader;