import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import tw from 'twrnc';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { HistoryIcon, TelegramIcon, WalletIcon } from '@/assets/icons';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.systemTintDark.indigo,
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="HomeScreen"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TelegramIcon  style={tw`mb-2`} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color }) => <WalletIcon  style={tw`p-2`} />,
        }}
      />
      <Tabs.Screen
        name="TransactionHistory"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color }) => <HistoryIcon style={tw`p-3`} name="code" color={color} />,
        }}
      />
    </Tabs>
  );
}
