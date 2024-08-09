
import { StyleSheet, Text,  View,  TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { auth } from "../firebase/Config";

export default function MessageItem({message, roomId}){
        
      if(auth.currentUser?.uid == message?.uid){

        return(
            <TouchableOpacity style = {styles.myChatContainerSender} onPress={() => router.push({pathname: "/home/[message]", params: {mid : message.id, roomId : roomId}})}>
              <Text style = {styles.myTextMessageSender}>
                  {message?.text}
              </Text>
            </TouchableOpacity>
        )

      }else{

        return(
          <View style = {styles.myChatContainerRec}>
            <Text style = {styles.myTextMessageRec}>
                {message?.text}
            </Text>
          </View>
      )

      }
  }
  
  const styles = StyleSheet.create({
    myChatContainerSender: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      margin: 3,
    },
    myChatContainerRec: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      margin: 3,
    },
    myTextMessageSender: {
      maxWidth: '80%', 
      marginLeft: 3,
      backgroundColor: '#022C43', 
      textAlign: 'right',
      padding: 10,
      borderRadius: 20,
      fontSize: 18,
      color:'white'
    },
    myTextMessageRec: {
      maxWidth: '80%', 
      marginLeft: 3,
      backgroundColor: '#FFD700', 
      textAlign: 'left',
      padding: 10,
      borderRadius: 20,
      color: 'white',
      fontSize: 18,
      color:"black"
    },
  })