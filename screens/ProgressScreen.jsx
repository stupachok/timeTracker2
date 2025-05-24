import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import { ScrollView, RefreshControl, Image, Dimensions, Text } from 'react-native';
import Loading from '../components/Loading';

const screenWidth = Dimensions.get('window').width;

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

const AvatarContainer = styled.View`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 250px;
  height: 250px;
`;

const LevelBox = styled.View`
  background-color: #fff;
  padding: 20px;
  width: ${screenWidth - 40}px;
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

const xpForLevel = (level) => 25 * level;

export const calculateLevelFromXP = (totalXP = 0) => {
  let level = 1;
  let xpSum = 0;
  let xpToNext = xpForLevel(level);

  while (totalXP >= xpSum + xpToNext) {
    xpSum += xpToNext;
    level++;
    xpToNext = xpForLevel(level);
  }

  const xpProgress = totalXP - xpSum;
  const progress = xpToNext > 0 ? (xpProgress / xpToNext) * 100 : 0;

  return {
    level,
    currentXP: totalXP,
    xpProgress,
    xpToNext: xpToNext - xpProgress,
    xpForNext: xpToNext,
    progress,
  };
};

export default function ProgressScreen() {
  const [xpData, setXpData] = useState({
    level: 1,
    currentXP: 0,
    xpProgress: 0,
    xpForNext: 25,
    xpToNext: 25,
    progress: 0,
  });

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchXP = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const totalXP = snap.data().totalXP ?? 0;
          const data = calculateLevelFromXP(totalXP);
          setXpData(data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch XP', err);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchXP();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchXP();
  };

  if (loading) return <Loading />;

  const avatarSources = {
    1: require('../assets/images/avatar_1.png'),
    2: require('../assets/images/avatar_2.png'),
    3: require('../assets/images/avatar_3.png'),
  };

  const avatarSource = avatarSources[xpData.level] || avatarSources[3];

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Container>
        <Title>👤 User progress</Title>

        <LevelBox>
          <LevelText>Level {xpData.level}</LevelText>
          <XpText>XP: {xpData.xpProgress} / {xpData.xpForNext}</XpText>
          <ProgressBarContainer>
            <ProgressBarFill progress={xpData.progress} />
          </ProgressBarContainer>
        </LevelBox>

        <XpText>Ще {xpData.xpToNext} XP to next level 🚀</XpText>

        <AvatarContainer>
          <Image source={avatarSource} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
        </AvatarContainer>
      </Container>
    </ScrollView>
  );
}
