import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import myEpicNftAbi from "./utils/myEpicNftAbi.json";
import Loader from "./components/Loader/Loader";
import { Buffer } from 'buffer';
import axios from "axios";


// Constants
const TWITTER_HANDLE = 'CalMoonDude1';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = 'https://testnets.opensea.io/collection/squarenft-icys4kexwu';
const TOTAL_MINT_COUNT = 50;

const CONTRACT_ADDRESS = "0x6BC44F1e8769DF34b10951B786d247f615c2482C";

const colors = ["red", "blue", "grey", "yellow", "green", "purple", "orange", "brown"];
const firstWords = ["Big", "Fat", "Small", "Tall", "Beautiful", "Enlightened", "Weak", "Delicious", "Hard", "Soft", "Fancy", "Smelly", "Disgusting", "Phallic", "Speedy", "Tantalizing", "Sultry"];
const secondWords = ["Stinging", "Twirling", "Diving", "Melting", "Sinking", "Dipping", "Fucking", "Waving", "Fighting", "Falling", "Laughing", "Sulking", "Dreaming", "Pissing", "Rolling"];
const thirdWords = ["Octopus", "Tree", "Cloud", "Monster", "Beetle", "Bard", "Yeetus", "Danger", "Whirlpool", "Boulder", "Avalanche", "Jello", "Stingray", "Buddha", "Dog", "Ferret", "Trash"];

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [NFTsMinted, setNFTsMinted] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const getRandomWord = (wordArr: string[]) => {
    const rand = Math.floor(Math.random() * wordArr.length);
    return wordArr[rand];
  }

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    let chainId = await ethereum.request({ method: "eth_chainId" });
    console.log("Connected to chain:", chainId);

    const rinkebyChainId = "0x4";
    if (chainId !== rinkebyChainId) {
      alert("You are not connected to the Rinkeby Test Network!");
    }

    ethereum.on("chainChanged", (_chainId: string) => {
      const rinkebyChainId = "0x4";
      if (_chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby Test Network!");
      } else {
        document.location.reload();
      }
    })

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      setupEventListener();
    } catch (error) {
      console.log(error)
    }
  }

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNftAbi.abi, signer);
        
        connectedContract.on("NewEpicNFTMinted", async (from, tokenId) => {
          console.log(from, tokenId.toNumber(), NFTsMinted);
          if ((tokenId.toNumber() + 1) !== NFTsMinted) {
            alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`);
            setNFTsMinted(await getTotalNFTsMintedSoFar());
          }
        });

        console.log("Setup event listener");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const getIpfsLink = (metadata: any) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`
    return axios.post(
      url,
      metadata,
      {
        headers: {
          pinata_api_key: String(import.meta.env.VITE_PINATA_API_KEY),
          pinata_secret_api_key: String(import.meta.env.VITE_PINATA_SECRET_API_KEY)
        },
      }
    )
    .then(function (response) {
      //handle your response here
      return response.data.IpfsHash;
    })
    .catch(function (error) {
      //handle error here
    });
  };

  const askContractToMintNft = async () => {;
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNftAbi.abi, signer);

        const fontColor = getRandomWord(colors);
        const firstWord = getRandomWord(firstWords);
        const secondWord = getRandomWord(secondWords);
        const thirdWord = getRandomWord(thirdWords);
        const combinedWord = firstWord + secondWord + thirdWord;

        const svg = `<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: ${fontColor}; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>${combinedWord}</text></svg>`;
        const encodedSvg = Buffer.from(svg).toString("base64");
        
        let metadata = JSON.stringify({
          name: combinedWord,
          description: "A highly acclaimed collection of very cool squares.",
          image: `data:image/svg+xml;base64,${encodedSvg}`
        })
        console.log(metadata);
        const CID = await getIpfsLink(metadata);

        // console.log("Going to pop wallet now to pay gas...");
        // let nftTxn = await connectedContract.makeAnEpicNFT(`https://cloudflare-ipfs.com/ipfs/${CID}`);
        // setIsLoading(true);

        // console.log("Mining...please wait.");
        // await nftTxn.wait();

        // console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
      } else {
        console.log("Ethereum object doesn't exist");
      }
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  const getTotalNFTsMintedSoFar = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNftAbi.abi, signer);

        let txn = await connectedContract.getTotalNFTsMintedSoFar();
        return txn.toNumber();
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    async function _setNFTsMinted() {
      setNFTsMinted(await getTotalNFTsMintedSoFar());
    }
    _setNFTsMinted();
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="header gradient-text">You have minted {NFTsMinted}/{TOTAL_MINT_COUNT} NFTs</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount === "" ? (
            <button onClick={connectWallet} className="cta-button connect-wallet-button">
              Connect to Wallet
            </button>
          ) : (
            <button onClick={() => askContractToMintNft()} className="cta-button connect-wallet-button">
              Mint NFT
            </button>
          )}
        </div>
        {isLoading ? <Loader /> : ""}
        <div className="footer-container">
          <form action={OPENSEA_LINK} className="cta-button connect-wallet-button">
            <input className="collectionButton" type="submit" value="See the Collection!" />
          </form>
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;