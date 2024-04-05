import { ethers } from "ethers";
import * as bitcoin from "bitcoinjs-lib";
import apiEndpoints from "./apiEndpoints.json";
import axios from "axios";

export const importPolygonWallet = (privateKey) => {
  const provider = new ethers.JsonRpcProvider(
    apiEndpoints.polygonMumbai.rpcUrl
  );
  const wallet = new ethers.Wallet(privateKey, provider);
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    network: "polygon",
    raw_Wallet: wallet,
  };
};

const TESTNET = bitcoin.networks.testnet;

export const importBitcoinWallet = (privateKey) => {
  // console.log(bitcoin);
  console.log(privateKey);
  // privateKey = bitcoin.
  const keyPair = bitcoin.ECPair.fromWIF(privateKey,TESTNET);
  console.log("keyPair", keyPair.publicKey);
  const { address } = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network: TESTNET,
  });
  // const address = ""
  console.log(address);
  return { address: address || "", privateKey, network: "bitcoin" };
};

// importBitcoinWallet("cQwvteuYhtktsv12YYT16ZmFhsoTm8iNzKrj3Qt7EAGL3wEyGkiq");

export const fetchCryptoPrice = async (crypto) => {
  const response = await fetch(apiEndpoints.cryptoPrices[crypto]);
  const data = await response.json();
  return data[crypto].usd;
};

export const fetchPolygonBalance = async (walletAddress) => {
  const polygonMumbaiProvider = new ethers.JsonRpcProvider(
    apiEndpoints.polygonMumbai.rpcUrl
  );
  const balanceBigInt = await polygonMumbaiProvider.getBalance(walletAddress);
  const balanceInMatic = ethers.formatEther(balanceBigInt);
  console.log(`Balance: ${balanceInMatic} MATIC`);
  return balanceInMatic;
};

export const estimateGasPolygon = async (recipientAddress, amountToSend) => {
  // const parcedBal = ethers.formatEther(balance);
  const provider = new ethers.JsonRpcProvider(
    apiEndpoints.polygonMumbai.rpcUrl
  );
  if (!parseFloat(amountToSend)) return;
  const { gasPrice, maxFeePerGas, maxPriorityFeePerGas } =
    await provider.getFeeData();
  console.log(ethers.formatEther(gasPrice));
  console.log(ethers.formatEther(maxFeePerGas));
  console.log(ethers.formatEther(maxPriorityFeePerGas));

  // Estimating the gas limit for the transaction
  console.log(amountToSend);
  const estimatedGasLimit = await provider.estimateGas({
    to: recipientAddress,
    value: ethers.parseEther(amountToSend),
  });
  console.log(estimatedGasLimit);
  const GasFee = 21000 * ethers.formatEther(gasPrice);
  console.log(GasFee);
  return GasFee;
};

export const sendPolygonMATIC = async (
  recipientAddress,
  amountToSend,
  wallet
) => {
  const tx = {
    to: recipientAddress,
    value: ethers.parseEther(amountToSend),
  };
  console.log("Sending transaction...");
  const txResponse = await wallet.sendTransaction(tx);
  console.log(txResponse, `Transaction hash: ${txResponse.hash}`);
  const receipt = await txResponse.wait();
  console.log(receipt, "Transaction confirmed in block:", receipt.blockNumber);
  return receipt;
};

export const isValidAddress = (address) => {
  return ethers.isAddress(address);
};

export const fetchPolygonMumbaiTransactionHistory = async (walletAddress) => {
  console.log("fetching Transactions");
  const apiKey = "WGCIMJ6RP8MNWQNQY498M4VFJ8WKQGK5YN";
  const apiUrl = `https://api-testnet.polygonscan.com/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;

  try {
    const response = await axios.get(apiUrl);
    const { data } = response;

    if (data.status === "1" && data.result.length > 0) {
      console.log("Transaction history:", data.result);
      return data.result;
    } else if (data.result.length === 0) {
      console.log("No transactions found for this address.");
    } else {
      console.log("Error fetching transaction history:", data.message);
    }
  } catch (error) {
    console.error("Failed to fetch transaction history:", error);
  }
};

// const mumbaiWalletAddress = '0xe52E8333c557d11B5cB26445e19075A16C66AdB0';
// const history = await fetchPolygonMumbaiTransactionHistory(mumbaiWalletAddress);
// console.log(history);

export const fetchBitcoinTestnetBalance = async (walletAddress) => {
  console.log("fetching balance of bitcoin test wallet");
  const baseUrl = "https://api.blockcypher.com";
  const url = `${baseUrl}/v1/btc/test3/addrs/${walletAddress}/balance`;

  try {
    const response = await axios.get(url);
    const balance = response.data.balance;
    const finalBalance = balance / 1e8; // Convert satoshi to bitcoin
    console.log(`Balance: ${balance} Satoshis, ${finalBalance} BTC`);
    return finalBalance;
  } catch (error) {
    console.error("Error fetching Bitcoin testnet wallet balance:", error);
  }
};

// fetchBitcoinTestnetBalance("mt8GP7Ves4ThninRAbn54zdJTPdRDX7qES");
// // Example usage with a testnet wallet address
// const testnetWalletAddress = '18JLRTUi8j3yPGkZCYRYFQxjRAK4TeAFsu';
// fetchBitcoinTestnetBalance(testnetWalletAddress);

export const sendTestnetBTC = async (
  senderPrivateKeyWIF = "cQwvteuYhtktsv12YYT16ZmFhsoTm8iNzKrj3Qt7EAGL3wEyGkiq",
  recipientAddress = "mqstc9zHAJUKgb3DfBFMFgeBWsTS2TAVZL",
  amountToSend = 500
) => {
  const network = bitcoin.networks.testnet;

  // Create a keyPair from the sender's private key
  const keyPair = bitcoin.ECPair.fromWIF(senderPrivateKeyWIF, network);
  // console.log("keyPair",keyPair);
  // console.log("keyPair", keyPair.publicKey);
  const { address } = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network: TESTNET,
  });
  // const address = ""
  // console.log(address);
  const txb = new bitcoin.TransactionBuilder(network);
  console.log("transaction builder",txb);

  const utxos = await getUTXOs(address);
  console.log("utxos",utxos);
  // return ;
  // return ;
  let amountAvailable = 0;
  utxos.forEach((utxo) => {
    txb.addInput(utxo.txId, utxo.vout);
    amountAvailable += utxo.amount;
  });
  // console.log("txb after input",txb,amountAvailable);
  // Add the recipient output
  txb.addOutput(recipientAddress, amountToSend);
  console.log("txb after output",txb,amountAvailable);
  // return;
  // If there's change, send it back to the sender
  const change = amountAvailable - amountToSend - (await calculateFee());
  console.log("Change",change);
  if (change > 0) {
    txb.addOutput(address, change);
  }else if(change < 0){
    console.log("not enough balance");
    return;
  }
  
  // Sign each input with the sender's private key
  for (let i = 0; i < utxos.length; i++) {
    txb.sign(i, keyPair);
  }
  
  const tx = txb.build();
  console.log("tx build",tx);
  const txHex = tx.toHex();
  console.log("tx hex",txHex);
  return await broadcastTransaction(txHex);
};

// sendTestnetBTC();
export async function getUTXOs(address) {
  try {
    const url = `https://api.blockcypher.com/v1/btc/test3/addrs/${address}?unspentOnly=true`;
    const response = await axios.get(url);
    console.log("utxo data",response.data);
    const utxos = response.data.txrefs || [];
    return utxos.map((utxo) => ({
      txId: utxo.tx_hash,
      vout: utxo.tx_output_n,
      amount: utxo.value,
    }));
  } catch (error) {
    console.error("Error fetching UTXOs:", error);
    return [];
  }
}

export async function getCurrentFeeRate() {
  try {
    const response = await axios.get('https://mempool.space/api/v1/fees/recommended');
    // console.log("curreent feess",response.data);
    return response.data.fastestFee;
  } catch (error) {
    console.error('Error getting current fee rate:', error);
    return 20; 
  }
}

export async function calculateFee(inputsCount = 1, outputsCount = 2) {
  // Estimate the size of the transaction in bytes
  // inputs_count * 148 + outputs_count * 34 + 10 + inputs_count
  // return 4;
  const txSize = (inputsCount * 148) + (outputsCount * 34) + 10 + inputsCount;
  
  // Calculate the fee by multiplying the estimated size by the fee rate
  const fastestFee = await  getCurrentFeeRate();
  // console.log("fastest Fee",fastestFee);
  const fee = txSize * fastestFee;
  // console.log("transaction fee",fee);
  return fee;
}

// calculateFee();

export async function broadcastTransaction(signedTxHex) {
  try {
    const url = 'https://api.blockcypher.com/v1/btc/test3/txs/push';
    const response = await axios.post(url, { tx: signedTxHex });
    console.log('Transaction broadcasted:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error broadcasting transaction:', error);
  }
}

export async function fetchBTCTransactionHistory(testnetAddress = "mt8GP7Ves4ThninRAbn54zdJTPdRDX7qES") {
  const baseUrl = 'https://api.blockcypher.com/v1/btc/test3';
  const url = `${baseUrl}/addrs/${testnetAddress}/full`;
  try {
    const response = await axios.get(url);
    console.log(response.data);
    let txs = response.data.txs.map((tx) => {
      // console.log(tx.inputs , tx.outputs);
      let obj = {
      hash : tx.hash,
      from: tx.addresses[0],
      to: tx.addresses[1],
      fees: tx.fees,
      value: tx.value
      }
      return obj;
    }) 
    return txs; 
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return [];
  }
}

// fetchBTCTransactionHistory()

