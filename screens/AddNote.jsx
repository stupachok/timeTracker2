import React, { useState } from 'react';
import styled from 'styled-components/native';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { format } from 'date-fns';
import { auth, db } from '../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const priorities = ['Low', 'Medium', 'High'];

const Container = styled.View`
  padding: 20px;
  background-color: #fff;
`;

const Label = styled.Text`
  font-size: 16px;
  margin-bottom: 5px;
  font-weight: 600;
`;

const Input = styled.TextInput`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 15px;
`;

const PriorityContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

const AddButton = styled.TouchableOpacity`
  background-color: #28a745;
  padding: 15px;
  align-items: center;
  border-radius: 5px;
`;

const AddButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

export default function AddNoteScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [priority, setPriority] = useState('Medium');

  const handleAddNote = async () => {
    if (title.trim() === '') {
      Alert.alert('Error', 'Enter title');
      return;
    }

    const newNote = {
      title,
      description,
      estimatedTime,
      priority,
      status: 'To Do',
      date: format(new Date(), 'yyyy-MM-dd'),
      createdAt: new Date().toISOString(),
      trackedTime: 0,
      xpGranted: false,
    };

    try {
      const user = auth.currentUser;
      if (!user) return;

      const ref = collection(db, 'users', user.uid, 'tasks');
      await addDoc(ref, newNote);

      navigation.goBack();
    } catch (err) {
      console.error('Error', err);
    }
  };

  return (
    <ScrollView>
      <Container>
        <Label>Title</Label>
        <Input
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />

        <Label>Description</Label>
        <Input
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Label>Estimated time (hours)</Label>
        <Input
          placeholder="For example: 2"
          keyboardType="numeric"
          value={estimatedTime}
          onChangeText={setEstimatedTime}
        />

        <Label>Priority</Label>
        <PriorityContainer>
          {priorities.map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.priorityButton,
                priority === p && styles.priorityButtonActive,
              ]}
              onPress={() => setPriority(p)}
            >
              <Text
                style={
                  priority === p
                    ? styles.priorityTextActive
                    : styles.priorityText
                }
              >
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </PriorityContainer>

        <AddButton onPress={handleAddNote}>
          <AddButtonText>+ Add task</AddButtonText>
        </AddButton>
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  priorityButton: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
    marginTop: 5,
  },
  priorityButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  priorityText: {
    color: '#333',
  },
  priorityTextActive: {
    color: '#fff',
  },
});
