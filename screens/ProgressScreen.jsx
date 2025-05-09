import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: #f8f9fa;
  padding: 20px;
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const LevelBox = styled.View`
  background-color: #fff;
  padding: 20px;
  width: 100%;
  border-radius: 10px;
  elevation: 3;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 10px;
  shadow-offset: 0px 2px;
  margin-bottom: 20px;
`;

const LevelText = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: #007bff;
`;

const XpText = styled.Text`
  font-size: 16px;
  color: #333;
  margin-top: 10px;
`;

const ProgressBarContainer = styled.View`
  width: 100%;
  height: 16px;
  background-color: #e0e0e0;
  border-radius: 8px;
  margin-top: 10px;
`;

const ProgressBarFill = styled.View`
  height: 100%;
  width: ${props => props.progress}%;
  background-color: #28a745;
  border-radius: 8px;
`;

export default function ProgressScreen() {
  // Заглушки для XP (пізніше підключимо до реальних значень)
  const currentLevel = 3;
  const currentXP = 250;
  const xpForNextLevel = 500;
  const progressPercent = (currentXP / xpForNextLevel) * 100;

  return (
    <Container>
      <Title>👤 Прогрес користувача</Title>

      <LevelBox>
        <LevelText>Рівень {currentLevel}</LevelText>
        <XpText>XP: {currentXP} / {xpForNextLevel}</XpText>
        <ProgressBarContainer>
          <ProgressBarFill progress={progressPercent} />
        </ProgressBarContainer>
      </LevelBox>

      <XpText>Ще {xpForNextLevel - currentXP} XP до нового рівня 🚀</XpText>
    </Container>
  );
}
