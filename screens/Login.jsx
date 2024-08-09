import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { changePass, login } from "../firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/Config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [massage, setMassage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // console.log("auth().currentUser", auth.currentUser);
    const unsub = onAuthStateChanged(auth, 
      (user) => {
        if(user){
          AsyncStorage.setItem("user", JSON.stringify(user));
          router.replace("/home");
        }
        else{
          AsyncStorage.removeItem("user");
          router.replace("/account/login");
        }
        // setUser(user)
      });

    return () => {
      unsub();
    };
  }, []);

  const handleLogin = async () => {
    try {
        setLoading(false);
        const credentials = await login(email, password);
        console.log('credentials', credentials);
        setLoading(true);
        router.navigate(`/home`);
    } catch (error) {
        setLoading(true);
        console.log('error', JSON.stringify(error));
        setError(error);
    }
  };

  const handleChangePass = async () => {
    try {
      const credentials = await changePass(email);
      console.log("credentials", credentials);
      setMassage("The massage sent! Check your email box.");
    } catch (error) {
      console.log("error", JSON.stringify(error));
      setError(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backLabel}>
        <Text style={styles.label}>LogIn</Text>
      </View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Text style={{ marginLeft: 20 }}>{error.code}</Text>
      <TouchableOpacity onPress={handleChangePass}>
        <Text style={{ marginLeft: 20, fontWeight: "700" ,color:"#022C43" }}>
          Forgot Password?
        </Text>
      </TouchableOpacity>
      <Text style={{ marginLeft: 20 }}>{massage}</Text>
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.resButt} onPress={handleLogin}>
          {!loading? <ActivityIndicator size={'small'} color={'#022C43'}/> : <Text
            style={{
              textAlign: "center",
              fontWeight: "500",
              fontSize: 19,
              color: "white",
            }}
          >
            LOGIN
          </Text>}
          
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("/account/register")}>
          <Text style={{ marginTop: 10, fontWeight: "bold" }}>
            don't have an account? register
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    margin: 15,
  },
  input: {
    borderRadius: 50,
    borderWidth: 2,
    padding: 10,
    marginBottom: 10,
    borderColor: "gray",
  },
  label: {
    textAlign: "center",
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
  },
  backLabel: {
    backgroundColor: "#022C43",
    justifyContent: "center",
    marginTop: -50,
    margin: 50,
    height: 80,
    borderRadius: 30,
    borderWidth: 5,
  },
  resButt: {
    justifyContent: "center",
    backgroundColor: "#022C43",
    height: 40,
    width: 100,
    borderRadius: 50,
    borderWidth: 3,
  },
  bottom: {
    alignItems: "center",
    marginTop: 20,
  },
});

export default Login;
