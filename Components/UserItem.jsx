import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { db } from "./../firebase/Config";
import {
  doc,
  collection,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import Ionicons from '@expo/vector-icons/Ionicons';
export default function UserItem({item, index, router, currentUser}){

  const [messages, setMessages] = useState([]);
  const [lastMessages, setLastMessages] = useState(undefined);

  const getRoomId = (uid1, uid2) => {
    const sortedIds = [uid1, uid2].sort();
    const roomId = sortedIds.join('-');
    return roomId;
  }

  useEffect(() => {
    // const uid = auth.currentUser.uid;
    // console.log(uid);
    const roomId = getRoomId(currentUser?.uid, item?.uid);
    const docRef = doc(db, "rooms", roomId);
    const messageRef = collection(docRef, "messages");
    const q = query(messageRef, orderBy('createdAt', 'asc'));
    let unsub = onSnapshot(q, (snapshot) => {
        let allMessages = snapshot.docs.map(doc => {
            return doc.data();   
    });
        setLastMessages(allMessages[allMessages.length - 1]? allMessages[allMessages.length - 1] : null);
    })
    return unsub;
    
  }, []);

  const openChat = () => {
    router.push({pathname: "/home/chatRoom", params: item});
  }

  const handleLastMessage = () => {
    if(typeof lastMessages == 'undefined') return "Loading...";
    if(lastMessages){
      if(currentUser?.uid == lastMessages?.uid) return "You: " + lastMessages?.text;
      return lastMessages?.text;
    }else{
      return "Start Chatting";
    }
  }

  const handleTime = () => {
    if(lastMessages){
      let date = lastMessages?.createdAt;
      return handleDate(new Date(date?.seconds * 1000));
    }
  }

  const handleDate = (date) => {
    let day = date.getDate();
    let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let month = monthNames[date.getMonth()];
    let formatTime = day + " " + month;
    return formatTime;
  }


    return(
        <TouchableOpacity style = {styles.item} onPress={openChat}>
          <View style = {styles.container}>
            
            <Text style = {styles.name}> 
            <Ionicons name="person" size={24} color="#FFD700" style= {{marginRight:10}} />
            {item.username}</Text>
            <Text style = {styles.time}>{handleTime()}</Text>
          </View>
          <Text style = {styles.lastM}>{handleLastMessage()}</Text>
        </TouchableOpacity>
        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
      },
      name: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 7,
        fontSize: 25,
        fontWeight : 'bold',
        color:'white'
      },
      time: {
        alignItems: 'flex-end',
        margin: 15,
        fontSize: 15,
        color: '#FFD700',
      },
      lastM: {
        margin: 10,
        marginBottom: 10,
        color: '#FFD700',
      },
      item: {
        backgroundColor: '#115173', 
        margin: 10,
        color: 'white',
        borderRadius: 10,
        borderWidth: 3,
      }
})