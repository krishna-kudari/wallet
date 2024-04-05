import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../../store/StoreContext'; // Adjust path as needed
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { ethers } from 'ethers';
import tw from 'twrnc'
const TransactionHistory = observer(() => {
  const { walletStore } = useStore();

  useEffect(() => {
    walletStore.fetchTransactionHystory();
  },[walletStore.activeWalletAddress]);

  return (
    <View style={tw`p-5`}>
      {walletStore.loadingTransactions ? (
        <Text style={tw`text-white`}>Loading transactions...</Text>
      ) : (
        walletStore.transactions.map((tx : any) => (
          <View key={tx.hash} style={tw`border bg-gray-800 mx-auto border-gray-200 p-10 mb-5 rounded-lg`}>
            <Text style={tw`text-white`}>Date: {new Date(tx.timeStamp * 1000).toLocaleString()}</Text>
            <TouchableOpacity onPress={() => Linking.openURL(`${walletStore.activeWallet.network == "bitcoin" ? `https://api.blockcypher.com/v1/btc/main/txs/${tx.hash}` : `https://mumbai.polygonscan.com/tx/${tx.hash}`}`)}>
              <Text style={styles.link}>Hash: {tx.hash}</Text>
            </TouchableOpacity>
            <Text style={tw`text-white`}>From: {tx.from}</Text>
            <Text style={tw`text-white`}>To: {tx.to}</Text>
            <Text style={tw`text-white`}>Amount: {`${(tx.value)}`} {walletStore.activeWallet.network == "plygon" ? "Wei" : "Satoshi"}</Text> {/* Convert this value to MATIC if needed */}
          </View>
        ))
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 20,
    color: 'white',
  },
  transaction: {
    marginBottom: 15,
    color: 'white',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default TransactionHistory;
