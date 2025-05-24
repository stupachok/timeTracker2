import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';
import { View, Animated, Easing, Text } from 'react-native';
import { format } from 'date-fns';
import Loading from '../components/Loading';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const DetailView = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
`;

const DetailTitle = styled.Text`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
`;

const DetailNoteView = styled.View`
  padding: 15px;
  border-width: 1px;
  border-color: #ddd;
  border-radius: 5px;
  background-color: #fff;
`;

const FieldLabel = styled.Text`
  font-weight: 600;
  margin-top: 10px;
  margin-bottom: 4px;
  color: #555;
`;

const FieldValue = styled.Text`
  font-size: 16px;
  color: #222;
`;

export default function DetailsScreen({ route }) {
  const noteId = route.params?.note?.id;
  const [note, setNote] = useState(null);
  const [trackedTime, setTrackedTime] = useState(0);
  const intervalRef = useRef(null);
  const spinValue = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (note?.status?.toLowerCase() === 'in progress') {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.setValue(0);
    }
  }, [note]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const loadNote = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const ref = doc(db, 'users', user.uid, 'tasks', noteId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setNote({ id: snap.id, ...data });
        setTrackedTime(data.trackedTime || 0);
      }
    } catch (err) {
      console.error('Cannot load task', err);
    } finally {
      setLoading(false);
    }
  };

  const saveTrackedTime = async (updatedTime) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const ref = doc(db, 'users', user.uid, 'tasks', noteId);
      await updateDoc(ref, { trackedTime: updatedTime });
    } catch (err) {
      console.error('Cannot save time', err);
    }
  };

  useEffect(() => {
    loadNote();
  }, []);

  useEffect(() => {
    if (note?.status?.toLowerCase() === 'in progress') {
      intervalRef.current = setInterval(() => {
        setTrackedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [note]);

  useEffect(() => {
    if (note) {
      saveTrackedTime(trackedTime);
    }
  }, [trackedTime]);

  if (loading || !note) return <Loading />;

  return (
    <DetailView>
      <DetailTitle>Details</DetailTitle>
      <DetailNoteView>
        <FieldLabel>Title</FieldLabel>
        <FieldValue>{note.title}</FieldValue>

        <FieldLabel>Description</FieldLabel>
        <FieldValue>{note.description || '—'}</FieldValue>

        <FieldLabel>Estimated time</FieldLabel>
        <FieldValue>{note.estimatedTime || '—'} год.</FieldValue>

        <FieldLabel>Priority</FieldLabel>
        <FieldValue>{note.priority || '—'}</FieldValue>

        <FieldLabel>Status</FieldLabel>
        <FieldValue>{note.status || '—'}</FieldValue>

        <FieldLabel>Tracked time</FieldLabel>
        <FieldValue>{formatTime(trackedTime)}</FieldValue>

        <View style={{ alignItems: 'center', marginBottom: 10 }}>
          {note.status?.toLowerCase() === 'in progress' ? (
            <Animated.Text style={{ fontSize: 28, transform: [{ rotate: spin }] }}>
              ⏱️
            </Animated.Text>
          ) : (
            <Text style={{ fontSize: 28, color: '#999' }}>⏱️</Text>
          )}
        </View>
      </DetailNoteView>
    </DetailView>
  );
}
