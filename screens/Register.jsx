import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { register } from "../firebase/auth";
import { addUser } from "../firebase/chat";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(true);

  const handlePress = async () => {
    try {
        setLoading(false);
        const credentials = await register(email, password);
        await addUser(credentials.user, username, phone);
        console.log('credentials', credentials);
        console.log('user', credentials.user);
        console.log('uid', credentials.user.uid);
        setLoading(true);
        router.navigate(`/home`);
    } catch (error) {
        setLoading(true);
        console.log('error', JSON.stringify(error));
        setError(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backLabel}>
        <Text style={styles.label}>Register</Text>
      </View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
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
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.resButt} onPress={handlePress}>
          {!loading? <ActivityIndicator size={'small'} color={'#ced4da'}/>  : <Text
              style={{
                textAlign: "center",
                fontWeight: "500",
                fontSize: 19,
                color: "white",
              }}
            >
              Register
            </Text>
          }
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("/account/login")}>
          <Text style={{ marginTop: 10, fontWeight: "bold" }}>
            have an account? login
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
    borderColor: "#022C43",
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

export default Register;
