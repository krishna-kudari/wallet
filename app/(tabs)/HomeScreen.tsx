import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { observer } from "mobx-react";
import { useStore } from "../../store/StoreContext";
import tw from "twrnc";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";

const HomeScreen = observer( () => {
  const [btcPrice, setBtcPrice] = useState<string>("Loading...");
  const [usdtPrice, setUsdtPrice] = useState<string>("Loading...");
  const { walletStore } = useStore();
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");

  console.log(walletStore.balance);
  
  useEffect(() => {
    // Fetch Bitcoin price
    fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    )
      .then((response) => response.json())
      .then((data) => setBtcPrice(`$${data.bitcoin.usd.toString()}`))
      .catch((error) => console.log(error));

    // Fetch USDT price
    fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=polygon-ecosystem-token&vs_currencies=usd"
    )
      .then((response) => response.json())
      .then((data) => setUsdtPrice(`$${data[`polygon-ecosystem-token`].usd.toString()}`))
      .catch((error) => console.log(error));
  }, []);

  return (
    <SafeAreaView
      style={tw`flex-1 bg-[${Colors.systemGbgDark[200]}] items-center p-4`}
    >
      {walletStore.activeWalletAddress && (
        <View style={tw`p-2 bg-[${Colors.systemGbgDark[100]}] rounded-lg mr-auto mb-10`}>
          <Text style={tw`text-white`}>
            Address: {walletStore.activeWalletAddress}
          </Text>
          <Text style={tw`text-gray-400`}>
            Network: {walletStore.activeWallet?.network}
          </Text>
        </View>
      )}
      {/* <Text style={tw`text-white text-xl mb-2`}>Live Crypto Prices</Text> */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-white text-lg`}>BTC: {btcPrice}</Text>
        <Text style={tw`text-white text-lg`}>MATIC: {usdtPrice}</Text>
      </View>
      <Text style={tw`text-white mb-2`}>
        Balance: {walletStore.balance} MATIC
      </Text>
      <TextInput
        style={tw`bg-gray-800 text-white p-2 mb-2`}
        placeholder="Receiver Address"
        value={receiver}
        onChangeText={setReceiver}
      />
      <TextInput
        style={tw`bg-gray-800 text-white p-2 mb-2`}
        placeholder="Amount of MATIC"
        keyboardType="numeric"
        value={amount}
        onChangeText={(value) => {
          setAmount(value);
          walletStore.estimateGas(receiver, value);
        }}
      />
      <Text style={tw`text-white mb-2`}>
        Estimated Gas: {walletStore.gasEstimate}
      </Text>
      <Button
        title="Send MATIC"
        disabled={walletStore.isSendDisabled}
        onPress={() => {
          walletStore.sendMatic(receiver,amount);
        }}
      />
    </SafeAreaView>
  );
});

export default HomeScreen;
