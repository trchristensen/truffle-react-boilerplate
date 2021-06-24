import Web3 from "web3";
import Decentragram from "./abis/Decentragram.json";
const ipfsClient = require("ipfs-http-client");

export const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

/**
 * Loads Web3 (MetaMask).
 * @returns {Object} - The book object itself.
 */
export const loadWeb3 = async () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    // await window.ethereum.enable()
    return window.web3.eth.requestAccounts()

  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    window.alert(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
  }
  
};


/**
 * Load Smart Contract Data from the Ethereum Blockchain into web3.
 * @returns {Object} - Object containing images, smart contract data, metamask connected wallet balance and public key.
 */
export const loadBlockchainData = async () => {
  const web3 = window.web3;
  
  // Load account
  const accounts = await web3.eth.getAccounts();

  console.log(accounts);

  const getBalance = await web3.eth.getBalance(accounts[0]);
  const theBalance = window.web3.utils.fromWei(getBalance);
  const walletBalance = parseFloat(theBalance).toFixed(3);


 const networkId = await web3.eth.net.getId();
    const networkData = Decentragram.networks[networkId];
    console.log("networkData", networkData);

  if (networkData) {
    const smartContract = new web3.eth.Contract(
      Decentragram.abi,
      networkData.address
    );

    const getImagesCount = await smartContract.methods
      .imageCount()
      .call();

    // Load images
    let images = []
    for (var i = 1; i <= getImagesCount; i++) {
      const image = await smartContract.methods.images(i).call();
      images = [...images, image];
    }
    const sortedImages = images.sort((a, b) => b.tipAmount - a.tipAmount);

    const blockChainData = {
        images: sortedImages,
        imagesCount: parseFloat(getImagesCount),
        smartContract,
        walletBalance,
        account: accounts[0],
        shortAccount: `${accounts[0].slice(0,6)}...${accounts[0].slice(-4)}`
    }
    console.log('blockchain data', blockChainData)
    return blockChainData

    
  } else {
    window.alert("Decentragram contract not deployed to detected network.");
  }
};

/**
 * Grabs the image and "buffers" it.
 * @version 1.2.3
 * @param {event} event - The action of the user uploading the image.
 * @returns {hash} - Returns a hash.
 */
export const captureFile = (event) => {
  event.preventDefault();
  const file = event.target.files[0];
  const reader = new window.FileReader();
  reader.readAsArrayBuffer(file);

  reader.onloadend = () => {
    console.log('buffer', Buffer(reader.result))
    return {buffer: Buffer(reader.result)}
  };

};


/**
 * Uploads the image to ipfs.
 * @param {hash} buffer - The hash of the image being uploaded.
 * @param {string} description - Description of the image.
 * @returns {Object} - The smart contract object.
 * @returns {string} - Ethereum address of the signer (user).
 */
export const uploadImage = (buffer, description, smartContract, account) => {
  console.log("Submitting file to ipfs...");
  let timestamp = new Date().getTime().toString();

  console.log({
    buffer,
    description,
    smartContract,
    account
  })
  //adding file to the IPFS
  ipfs.add(buffer, (error, result) => {
    console.log("Ipfs result", result);
    if (error) {
      console.error(error);
      return;
    }
    smartContract.methods
      .uploadImage(result[0].hash, description, timestamp)
      .send({
        from: account,
      })
      .on("transactionHash", (hash) => {
        return {
          loading: false,
          hash: hash
        }
      });
  });
};

export const tipImageOwner = (id, tipAmount, account, smartContract) => {

  smartContract.methods
    .tipImageOwner(id)
    .send({ from: account, value: tipAmount })
    .on("transactionHash", (hash) => {
      return {
        loading: false,
        hash,
      };
    });
};
