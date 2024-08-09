import { auth, db } from "./Config";
import {
  getDocs,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
  getDoc,
  QuerySnapshot,
  Timestamp,
  orderBy,
  updateDoc,

} from "firebase/firestore";
// Get a list of todos from your database

async function getUsers(uid) {
      const q = query(collection(db, "users"), where("uid", "!=", uid));
      const querySnapshot = await getDocs(q);
      
      const users = querySnapshot.docs.map((doc) => ({ ...doc.data() }));
      return users;
  }

  async function sendMessage(roomId, uid, message) {
    const docRef = doc(db, "rooms", roomId);
    const messagesRef = collection(docRef, "messages");
    const newDoc = await addDoc(messagesRef, {
        uid: uid,
        text: message,
        createdAt: Timestamp.fromDate(new Date()),
    });
    const messageRef1 = doc(db, `rooms/${roomId}/messages`, newDoc.id);
    const updateData = {
      id: newDoc.id,
    };

    try {
      await updateDoc(messageRef1, updateData, { merge: true });
      console.log("Completed updated successfully!");
    } catch (error) {
      console.error("Error updating completed:", error);
    }
    return newDoc;
  }

  async function editMessage(mid, roomId, newText) {
    const messageRef = doc(db, `rooms/${roomId}/messages`, mid);
    const updateData = {
      text: newText,
    };

    try {
      await updateDoc(messageRef, updateData, { merge: true });
      console.log("Completed updated successfully!");
    } catch (error) {
      console.error("Error updating completed:", error);
    }
  }

  async function getMessages(roomId, setMessages){
    const docRef = doc(db, "rooms", roomId);
    const messageRef = collection(docRef, "messages");
    const q = query(messageRef, orderBy('createdAt', 'asc'));
    let unsub = onSnapshot(q, (snapshot) => {
        let messages = snapshot.docs.map(doc => {
            return doc.data();   
    });
        setMessages([...messages]);
    })
    return unsub;
  }

async function getSpecificMessage(roomId, id) {
  const docRef = doc(db, `rooms/${roomId}/messages`, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    return docSnap.data();
  }
  
  // docSnap.data() will be undefined in this case
  console.log("No such document!");
  return undefined
}

async function setRoom(roomId){
    await setDoc(doc(db, "rooms", roomId),{
        roomId,
        time: Timestamp.fromDate(new Date())
    });

}
async function addUser({uid,email}, username, phone) {
  const data  = {
    uid: uid,
    email: email,
    username: username,
    phone: phone,
  }
  try {
    await setDoc(doc(db, "users", uid), data)
    // const docRef = await addDoc(collection(db, uid), {uid,email});
    console.log("Document written with ID: ", uid);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function addMessageId(roomId, message, uid) {
  const messageRef = doc(db, `rooms/${roomId}/messages`, message.id);
    const updateData = {
      id: message.id,
    };

    try {
      await updateDoc(messageRef, updateData, { merge: true });
      console.log("Completed updated successfully!");
    } catch (error) {
      console.error("Error updating completed:", error);
    }
  
}

export { getUsers, setRoom, sendMessage, getMessages, addMessageId, getSpecificMessage, editMessage, addUser};
