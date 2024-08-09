import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { auth, db } from "./../firebase/Config";

export default function ChatHeader({router, user}){
      return(
          <Stack.Screen
            options={{
                title: "",
                headerStyle: { backgroundColor: "#115173" },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
                headerRight: () => (
                    <View>
                        <Text style = {styles.name}>{user?.username}</Text>
                    </View>
                    
                    
                )
            }}
          />
      )
  }
  
  const styles = StyleSheet.create({
    name: {
        fontSize: 20,
        fontWeight: '500',
    }
  })