import { useEffect } from "react";
import { StyleSheet, ScrollView } from "react-native";
import MessageItem from "./MessageItem";

export default function MessageList({messages ,scrollViewRef, roomId}){


  // useEffect(() => {
  //   // console.log(messages[1]);
  // })

      return(
          <ScrollView 
          ref = {scrollViewRef}
          showsVerticalScrollIndicator = {false} 
          key={Math.random}
          contentContainerStyle = {{paddingTop: 10,}}>
            {
              messages.map((message, index) => {
                // let id = message.id;
                
                return <MessageItem message = {message} key={index} roomId = {roomId}
                // onPress = {() => navigate("/home/[message]", {  })}
                />
              })
            }
          </ScrollView>
      )
  }
  
  const styles = StyleSheet.create({

  })