const main = async () => {
    const nftContractFactory = await hre.ethers.getContractFactory("MyEpicNFT");
    const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();
    console.log("Contract deployed to:", nftContract.address);

    let txn = await nftContract.makeAnEpicNFT("https://cloudflare-ipfs.com/ipfs/QmevJDHKDnJ18oV38QSs6TtCvGSo8nELi6Rb3679i7Ydcz");
    await txn.wait();

    let nftCountTxn = await nftContract.getTotalNFTsMintedSoFar();
    console.log(nftCountTxn.toNumber());

    txn = await nftContract.makeAnEpicNFT("https://cloudflare-ipfs.com/ipfs/QmeFZsLqS2GvdYRjEXMfYynW3BgqtgTexhPDpSY97rwDjy");
    await txn.wait()
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

runMain();