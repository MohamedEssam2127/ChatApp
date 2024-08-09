import { Stack, router,useGlobalSearchParams } from "expo-router";
import { TextInput, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useEffect, useRef, useState } from "react";
import { editMessage } from "../../firebase/chat";
import { db } from "../../firebase/Config";
import { deleteDoc, doc, getDoc } from "firebase/firestore";

export default function Page() {
  const { mid, roomId } = useGlobalSearchParams();
  const [message, setMessage] = useState({});
  const [isGet, setIsGet] = useState(false);
  const [newText, setNewText] = useState("");
  const textRef = useRef();
  const inputRef = useRef(null);

  console.log('id ', mid);
  console.log('roomId ', roomId);

  const getMessage = async () => {
    const docRef = doc(db, `rooms/${roomId}/messages`, mid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());
      setMessage(docSnap.data());
      setIsGet(true);
      return
    }
  
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
    return undefined
      
  }

  const updateText = async () => {
    
    let mess = textRef.current.trim();
    console.log(mess)
    console.log(message.text)
    if(!mess || message.text === mess){
      router.back();
    return;
    }
    editMessage(mid, roomId, mess);
    router.back();
  }

  const deleteMessage = async () => {
    try{
      await deleteDoc(doc(db, `rooms/${roomId}/messages`, mid));
      console.log("Deleted!");
      router.back();
    }catch(e){
      console.log(e);
    }
    
  }

  useEffect(() => {
    getMessage();
  }, [isGet])

  // console.log(message)

  const handleTime = () => {
    if(message){
      let date = message?.createdAt;
      return handleDate(new Date(date?.seconds * 1000));
    }
  }

  const handleDate = (date) => {
    let day = date.getDate();
    let monthNames = ["Jan", "Feb", "Mar", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let month = monthNames[date.getMonth()];
    let formatTime = day + " " + month;
    return formatTime;
  }


  return ( 
    <View style = {{alignItems: 'center'}}>
      <Stack.Screen
      
        options={{
          headerStyle: { backgroundColor: "gray" },
          title: "Edit Message",
          headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
        }}
      />
      <View style = {styles.input}>
      <TextInput
        placeholder="Edit This message here..."
        defaultValue={message.text} 
        onChangeText={(value) => textRef.current = value} 
        ref={inputRef}
        style={{flex: 1}}
      />
        <TouchableOpacity style={styles.resButt} onPress={updateText}>
            <Text
              style={{
                textAlign: "center",
                fontWeight: "500",
                fontSize: 19,
                color: "white",
              }}
            >
              Update
            </Text>
          </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={[styles.resButt, {borderWidth: 3, marginTop: 10}]} onPress={deleteMessage}>
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 22,
                color: "black",
              }}
            >
              Delete
            </Text>
          </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 50,
    borderWidth: 2,
    paddingLeft: 10,
    marginBottom: 10,
    borderColor: "gray",
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  resButt: {
    justifyContent: "center",
    backgroundColor: "gray",
    height: 40,
    width: 100,
    borderRadius: 50,
    // borderWidth: 3,
  },
});
