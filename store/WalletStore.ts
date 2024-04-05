import { makeAutoObservable } from "mobx";
import {
  importPolygonWallet,
  importBitcoinWallet,
  fetchPolygonBalance,
  estimateGasPolygon,
  sendPolygonMATIC,
  isValidAddress,
  fetchPolygonMumbaiTransactionHistory,
  fetchBitcoinTestnetBalance,
  fetchBTCTransactionHistory,
  sendTestnetBTC,
} from "../services/blockchainService";
import { ethers } from "ethers";
import apiEndpoints from "../services/apiEndpoints.json";

export class WalletStore {
  wallets: Map<string, any> = new Map();
  activeWalletAddress: string | null = null;
  activeWallet: any;
  livePrices: { bitcoin: number; usdt: number } = { bitcoin: 0, usdt: 0 };
  provider = new ethers.JsonRpcProvider(apiEndpoints.polygonMumbai.rpcUrl);
  balance: string = "";
  gasEstimate = "";
  errorMessage: string = "";
  transactionError = "";
  transactions = [];
  loadingTransactions = false;

  constructor() {
    makeAutoObservable(this);
    // this.fetchLivePrices();
    if (this.activeWalletAddress) this.fetchBalance();
  }

  async fetchLivePrices() {
    // const bitcoinPrice = await fetchCryptoPrice("bitcoin");
    // const usdtPrice = await fetchCryptoPrice("usdt");
    // this.livePrices = { bitcoin: bitcoinPrice, usdt: usdtPrice };
  }

  importWallet(privateKey: string, type: "bitcoin" | "polygon") {
    try {
      const wallet =
        type === "polygon"
          ? importPolygonWallet(privateKey)
          : importBitcoinWallet(privateKey);
      this.wallets.set(wallet.address, wallet);
      this.activeWalletAddress = wallet.address;

      this.activeWallet = wallet;
      this.fetchBalance();
      this.errorMessage = ""; // Clear any previous error
    } catch (error) {
      console.error("Wallet import failed:", error);
      this.errorMessage = "Invalid private key or import failed.";
    }
  }

  switchWallet(address: string) {
    if (this.wallets.has(address)) {
      this.activeWalletAddress = address;
      this.activeWallet = this.wallets.get(address);
    } else {
      console.error("Wallet not found");
    }
  }

  clearError() {
    this.errorMessage = "";
  }

  async fetchBalance() {
    console.log(this.activeWalletAddress);
    const currentWallet = this.activeWallet;
    if (currentWallet.network == "polygon") {
      this.balance = await fetchPolygonBalance(this.activeWalletAddress);
    } else if (currentWallet.network == "bitcoin") {
      this.balance =
        (await fetchBitcoinTestnetBalance(this.activeWalletAddress)) + "";
    }
  }

  async estimateGas(recipientAddress: string, amountToSend: string) {
    try {
      if (this.activeWallet.network == "polygon") {
        const GasFee = await estimateGasPolygon(recipientAddress, amountToSend);
        const totalTransactionCost = GasFee + amountToSend;
        if (totalTransactionCost > this.balance) {
          console.log("insufficient balance");
        }
        this.gasEstimate = GasFee + "Matic";
      } else if (this.activeWallet.network == "bitcoin") {
        this.gasEstimate = 100 + "satoshi";
      }
    } catch (error) {
      console.error(error);
      this.gasEstimate = "Error estimating gas";
    }
  }

  get isSendDisabled() {
    return false 
    // parseFloat(this.balance) < parseFloat(this.gasEstimate);
  }

  async sendMatic(receiver: string, amount: string) {
    console.log("Sending");
    console.log(this.activeWallet);
    try {
      if (this.activeWallet.network == "polygon") {
        console.log("plygon");
        if (!isValidAddress(receiver)) {
          alert("not a valid reciever address");
          return;
        }
        console.log("valid polygon");
        const receipt = await sendPolygonMATIC(
          receiver,
          amount,
          this.activeWallet.raw_Wallet
        );
        alert(
          `${receipt},'Transaction confirmed in block:', ${receipt.blockNumber}`
        );
      } else if (this.activeWallet.network == "bitcoin") {
        const satoshis = Number(amount)*1e8;
        console.log("sending bitcoin",satoshis);
        const data : any = await sendTestnetBTC(this.activeWallet.privateKey,receiver,satoshis);
        alert(`transaction broadcasted to cipherblock bitcoin server successfully ${data.tx.hash}`)
      }
    } catch (error) {
      console.error(error);
      this.transactionError = "Transaction failed";
    }
  }

  async fetchTransactionHystory() {
    if(!this.activeWalletAddress)return;
    if (this.activeWallet.network == "polygon") {
      this.loadingTransactions = true;
      const txhistory = await fetchPolygonMumbaiTransactionHistory(
        this.activeWalletAddress
      );
      this.transactions = txhistory;
      this.loadingTransactions = false;
    } else if (this.activeWallet.network == "bitcoin") {
      this.loadingTransactions = true;
      const txhistory = await fetchBTCTransactionHistory(this.activeWalletAddress);
      this.transactions = txhistory;
      this.loadingTransactions = false;
    }
  }
}
