import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Keyboard,
} from "react-native";
import ChatHeader from "../../Components/ChatHeader";
import { useLocalSearchParams, useRouter } from "expo-router";
import MessageList from "../../Components/MessageList";
import { sendMessage, setRoom, getMessages } from "../../firebase/chat";
import Ionicons from '@expo/vector-icons/Ionicons';
import { auth, db } from "./../../firebase/Config";
import {
  doc,
  collection,
  query,
  onSnapshot,
  orderBy,
  updateDoc,
} from "firebase/firestore";

export default function ChatRoom() {
  const item = useLocalSearchParams();
  const router = useRouter();
  const textRef = useRef();
  const inputRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const user = auth.currentUser;
  const scrollViewRef = useRef(null);

  useEffect(() => {
    createRoom();

    // const uid = auth.currentUser.uid;
    console.log(user.uid);
    const roomId = getRoomId(user.uid, item?.uid);
    const docRef = doc(db, "rooms", roomId);
    const messageRef = collection(docRef, "messages");
    const q = query(messageRef, orderBy("createdAt", "asc"));
    let unsub = onSnapshot(q, (snapshot) => {
      let allMessages = snapshot.docs.map((doc) => {
        return doc.data();
      });
      setMessages([...allMessages]);
    });

    // messages.sort();
    // let mss = messages;
    // console.log(mergeSort([5,6,2,1,3,9,8,4,3,7,10,100]));
    // mergeSort(mss);
    // setMessages(mss);

    const handleKeyboard = Keyboard.addListener(
      "keyboardDidShow",
      updateScrollView
    );

    return () => {
      unsub;
      handleKeyboard.remove();
    };
  }, []);

  useEffect(() => {
    updateScrollView();
  }, [messages]);

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({ animated: false });
    }, 100);
  };

  const createRoom = async () => {
    try {
      // const user = JSON.parse(await AsyncStorage.getItem("user"));
      let roomId = getRoomId(user?.uid, item?.uid);
      setRoom(roomId);
    } catch (e) {
      console.log(e);
    }
  };

  const getRoomId = (uid1, uid2) => {
    const sortedIds = [uid1, uid2].sort();
    const roomId = sortedIds.join("-");
    return roomId;
  };

  const handleSendMessage = async () => {
    let message = textRef.current
    if (!message) {
      return;
    }
     message = textRef.current.trim();
    try {
      // const user = JSON.parse(await AsyncStorage.getItem("user"));
      if (!user) {
        console.error("User data not found in AsyncStorage");
        return;
      }
      // console.log(user.data);
      const roomId = getRoomId(user.uid, item?.uid);
      const newDoc = await sendMessage(roomId, user.uid, message);
      textRef.current = "";
      if (inputRef) {
        inputRef?.current?.clear();
      }
      console.log("message id ", (await newDoc).id);
      // addMessageId(roomId, newDoc, user.uid);
    } catch (e) {
      console.log(e);
    }
  };

  const gMessages = async () => {
    // const user = JSON.parse(await AsyncStorage.getItem("user"));
    let roomId = getRoomId(user?.uid, item?.uid);
    const m = getMessages(roomId, setMessages);
  };

  function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    let mid = Math.floor(arr.length / 2);
    let left = mergeSort(arr.slice(0, mid));
    let right = mergeSort(arr.slice(mid));
    return merge(left, right);
  }

  function merge(left, right) {
    let sortedArr = [];
    while (left.length && right.length) {
      if (left[0] < right[0] && left[0] < right[0]) {
        sortedArr.push(left.shift());
      } else {
        sortedArr.push(right.shift());
      }
    }
    return [...sortedArr, ...left, ...right];
  }

  //1714205749
  // console.log(messages[0].text, messages[0].createdAt.nanoseconds);
  // console.log(messages)
  return (
    <View style ={{flex:"1"}}>
      <StatusBar style="dark" />
      <ChatHeader router={router} user={item} secondUser={user} />
      <View style={{ height: "90%" }}>
        <MessageList
          messages={messages}
          scrollViewRef={scrollViewRef}
          roomId={getRoomId(user?.uid, item?.uid)}
        />
      </View>
      <View style={styles.input}>
        <TextInput
          placeholder="Type message..."
          onChangeText={(value) => {
            textRef.current = value;
          }}
          ref={inputRef}
          style={{ flex: 1 }}
        />
        <TouchableOpacity style={styles.resButt} onPress={handleSendMessage}>
        <Ionicons name="send" size={24} color="#FFD700"  style={{marginLeft:14}} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 3,
    paddingLeft: 10,
    height: 50,
    flexDirection: "row",
    marginBottom: -100,
    borderRadius: 50,
    borderColor: "#FFD700",
  },
  resButt: {
    justifyContent: "center",
    justifyContent:'center',
    backgroundColor: "#115173",
    height: 40,
    width: 50,
    borderRadius: 60,
    height: "100%",
  },
});
