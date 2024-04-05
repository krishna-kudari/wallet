// screens/WalletImportScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  FlatList,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { observer } from "mobx-react";
import { useStore } from "../../store/StoreContext"; // Assuming you have a context setup for MobX stores
import tw from "twrnc";
import { StatusBar, setStatusBarHidden } from "expo-status-bar";
import Colors from "@/constants/Colors";

const WalletImportScreen = observer(() => {
  const { walletStore } = useStore();
  const [selectedWalletType, setSelectedWalletType] = useState<
    "bitcoin" | "polygon"
  >("polygon");
  const [privateKey, setPrivateKey] = useState("");
  const [isPrivateKeyVisible, setIsPrivateKeyVisible] = useState(false);
  const [currentWallet, setCurrentWallet] = useState(walletStore.activeWalletAddress);
  useEffect(() => {
    setStatusBarHidden(false);
  }, []);

  const togglePrivateKeyVisibility = () => {
    setIsPrivateKeyVisible(!isPrivateKeyVisible);
  };

  const handleImportWallet = () => {
    console.log(selectedWalletType, privateKey);
    if(!privateKey)return;
    walletStore.importWallet(privateKey, selectedWalletType);
    setPrivateKey(""); // Clear input field
  };

  useEffect(()=>{
    setCurrentWallet(walletStore.activeWalletAddress);
  },[walletStore.activeWalletAddress,walletStore.activeWallet])
  useEffect(() => {
    if (walletStore.errorMessage) {
      alert(walletStore.errorMessage); // Simple error handling
      walletStore.clearError(); // Clear error after showing it
    }
  }, [walletStore, walletStore.errorMessage]);

  const handleWalletClick = (address:string) => {
    walletStore.switchWallet(address);
    console.log(`Current wallet set to: ${address}`);
    console.log(walletStore.activeWalletAddress,walletStore.activeWallet);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[${Colors.systemGbgDark[200]}] p-4`}>
      <Text style={tw`text-[${Colors.systemTintDark.indigo}] text-lg mb-4`}>
        Import Wallet
      </Text>

      <Picker
        selectedValue={selectedWalletType}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedWalletType(itemValue)
        }
        style={tw`text-white bg-[${Colors.systemGbgDark[100]}] border-none mb-4 p-2 rounded-md`}
      >
        <Picker.Item label="Polygon" value="polygon" />
        <Picker.Item label="Bitcoin" value="bitcoin" />
      </Picker>

      <View
        style={tw`flex-row items-center bg-[${Colors.systemGbgDark[100]}] mb-4 rounded`}
      >
        <TextInput
          style={tw`flex-1 text-white p-2`}
          placeholder="Enter Private Key"
          placeholderTextColor="#9ca3af" // Tailwind gray-400
          value={privateKey}
          onChangeText={setPrivateKey}
          secureTextEntry={!isPrivateKeyVisible}
        />
        <Pressable onPress={togglePrivateKeyVisibility} style={tw`p-2`}>
          <Text style={tw`text-white`}>
            {isPrivateKeyVisible ? "Hide" : "Show"}
          </Text>
        </Pressable>
      </View>

      <TouchableOpacity
        onPress={handleImportWallet}
        style={tw`bg-[${Colors.systemTintDark.indigo}] p-3 rounded`}
      >
        <Text style={tw`text-white text-center`}>Import</Text>
      </TouchableOpacity>

      {/* Displaying imported wallets */}

      <Text
        style={tw`text-[${Colors.systemTintDark.indigo}] font-semibold text-xl text-center mt-10`}
      >
        Wallets
      </Text>
      <FlatList
        data={Array.from(walletStore.wallets.values())}
        keyExtractor={(item) => item.address}
        style={tw`py-4`}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleWalletClick(item.address)} style={tw`p-2 mb-4 flex flex-row items-center justify-between gap-2 rounded-lg bg-[${Colors.systemGbgDark[100]}]`}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-white`}>Address: {item.address}</Text>
              <Text style={tw`text-gray-400`}>Network: {item.network}</Text>
            </View>
            <View
              style={tw`w-3 h-3 rounded-full ${item.address == currentWallet ? `bg-[${Colors.systemTintDark.indigo}]` : ""}`}
            ></View>
          </TouchableOpacity >
        )}
      />
    </SafeAreaView>
  );
});

export default WalletImportScreen;
