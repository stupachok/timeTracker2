import React from 'react';
import styled from 'styled-components/native';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';

const LoginView = styled.View`
    flex: 1;
    justifyContent: center;
    alignItems: center;
    backgroundColor: #f5f5f5;
`;

const LoginTitle = styled.Text`
    font-size: 24;
    font-weight: 700;
    margin-bottom: 20;
`;

const LoginInput = styled.TextInput`
    width: 80%;
    margin-bottom: 10;
    border-width: 1;
    border-style: solid;
    border-color: #ccc;
    border-radius: 5px;
    background-color: #fff;
`;

const LoginError = styled.Text`
    color: red;
    margin-bottom: 10;
`;

const LoginButtonText = styled.Text`
    color: white;
    font-size: 18;
    font-weight: bold;
`;

export default function LoginScreen ({navigation}) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const handleLogin = () => {
    if (!email || !password) {
      setError('enter something');
      return;
    }
    if (!validateEmail(email)) {
      setError('enter valid email');
      return;
    }
    if (password.length < 6) {
      setError('short password');
      return;
    }
    setError('');
    Alert.alert('Успішний вхід', `Вітаємо, ${email}!`, [
        { text: 'OK', onPress: () => navigation.navigate('MainTabs') }
    ]);
  };

  return (
    <LoginView>
      <LoginTitle>login</LoginTitle>
      <LoginInput
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <LoginInput
        placeholder="password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <LoginError>{error}</LoginError> : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <LoginButtonText>enter</LoginButtonText>
      </TouchableOpacity>
    </LoginView>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  }
});

