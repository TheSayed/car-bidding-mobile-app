import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { COLORS } from "../../constant/COLORS";
import styles from "./LoginScreen.styles";
import useLoginScreenHook from "./useLoginScreenHook";

const LoginScreen = () => {
  const { username, setUsername, isLoading, handleLogin, isButtonDisabled } =
    useLoginScreenHook();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ width: "100%", alignItems: "center" }}>
        <Text style={styles.appName}>CarBid</Text>
        <Text style={styles.sloganText}>Your Dream Car</Text>
        <Text style={styles.promptHeader}>Enter your username to continue</Text>
        <TextInput
          style={styles.input}
          placeholder="Nickname"
          placeholderTextColor={COLORS.LIGHT_GRAY}
          value={username}
          onChangeText={setUsername}
          maxLength={20}
          editable={!isLoading}
        />
        <Pressable
          onPress={handleLogin}
          disabled={isButtonDisabled}
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed || isButtonDisabled ? 0.6 : 1 },
          ]}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.WHITE} />
          ) : (
            <Text style={styles.buttonText}>JOIN AS GUEST</Text>
          )}
        </Pressable>
        <Text style={styles.infoText}>
          Secure, temporary profile based on your nickname.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
