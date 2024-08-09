import { Text, View, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput } from "react-native";
import { Stack, router } from "expo-router";
import { logout } from "../../firebase/auth";
import { useEffect, useState } from "react";
import UserList from './../../Components/UserList';
import {getUsers} from './../../firebase/chat';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../../firebase/Config";

export default function Page() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;


  const handlelogout = ()=>{
    
              router.replace("/");
              logout();
  }
  const listUsers = async () => {
    const user = JSON.parse (await AsyncStorage.getItem("user"));
    if(user){
const listOfUsers = await getUsers(user.uid);
    if(listOfUsers){
      setUsers(listOfUsers);
      setLoading(false);
    }else{
      console.log("nop!");
    }
    }
    
  }

  useEffect(() => {
    listUsers();
  }, [!loading])

  
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen
        options={{
          // https://reactnavigation.org/docs/headers#setting-the-header-title
          title: "Chats",
          // https://reactnavigation.org/docs/headers#adjusting-header-styles
          headerStyle: { backgroundColor: "#115173" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          // https://reactnavigation.org/docs/headers#replacing-the-title-with-a-custom-component
          // headerTitle: props => <LogoTitle {...props} />,
          headerRight: (props) => (
            <TouchableOpacity style={styles.resButt1} onPress={handlelogout}>
          <Text
            style={{
              textAlign: "center",
              fontWeight: "500",
              fontSize: 19,
              color: "white",
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>
          ),
        }}
      />
      <UserList users={ users } currentUser={currentUser} loading = {loading}/>
    </View>
  );
}

const styles = StyleSheet.create({
  resButt1: {
    justifyContent: "center",
    backgroundColor: "black",
    height: 40,
    width: 100,
    borderRadius: 50,
    borderWidth: 3,
  },
});