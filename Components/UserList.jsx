
import { StyleSheet, FlatList, ActivityIndicator } from "react-native";
import UserItem from './UserItem';
import { router } from "expo-router";
import { useState } from "react";

export default function UserList({users, currentUser, loading}){

  
  if(loading){
    return(
      <ActivityIndicator size={'large'} color={"#115173"}/>
    )
  }else{
    return(
      <FlatList
              style={styles.container}
              data={users}
              keyExtractor={(item) => item.uid}
              renderItem={({ item, index }) => (
                <UserItem 
                    router = {router}
                    item = {item}
                    index = {index} 
                    currentUser = {currentUser}
                />
              )}
          />
      )
  }
  }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
      }
})