import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const priorities = ['Low', 'Medium', 'High'];

const Container =  styled.View`
    padding-top: 20px;
    padding-bottom:20px;
    padding-right: 20px;
    padding-left: 20px;
    background-color: #fff;
`;

const Label = styled.Text`
    font-size: 16px;
    margin-bottom: 5px;
    font-weight: 600;
`;

const Input = styled.TextInput`
    border-style: solid;
    border-color: #ccc;
    border-width: 1px;
    border-radius: 5px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 10px;
    padding-left: 10px;
    font-size: 16px;
    margin-bottom: 15px;
`;

const PriorityContainer = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 20px;
`;

const PriorityText = styled.Text`
    color: #333;
`;

const AddButton = styled.View`
    background-color: #28a745;
    padding-top: 15px;
    padding-bottom:15px;
    padding-left: 15px;
    padding-right: 15px;
    align-items: center;
`;

const AddButtonText = styled.Text`
    color: #fff;
    font-size: 15px;
    font-weight: 600;
`;

const saveNotes = async (notes) => {
  try {
    await AsyncStorage.setItem('@notes', JSON.stringify(notes));
  } catch (e) {
    console.error('Помилка при збереженні нотаток:', e);
  }
};

const loadNotes = async () => {
  try {
    const json = await AsyncStorage.getItem('@notes');
    return json != null ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Помилка при завантаженні нотаток:', e);
    return [];
  }
};

export default function AddNoteScreen({navigation}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');
    const [priority, setPriority] = useState('Medium');

    const handleAddNote = async () => {
        const newNote = {
            id: Date.now().toString(),
            title, description, estimatedTime, priority,
            createdAt: new Date().toISOString(),
          };

        const existingNotes = await loadNotes();
        const updatedNotes = [...existingNotes, newNote];
        await saveNotes(updatedNotes);

        navigation.goBack();
    };

    return (
        <ScrollView>
            <Container>
                <Label>title</Label>
                <Input placeholder='title' value={title} onChangeText={setTitle} />

                <Label>description</Label>
                <Input placeholder='description' value={description} onChangeText={setDescription} />

                <Label>estimatedTime</Label>
                <Input placeholder='estimatedTime' keyboardType='numeric' value={estimatedTime} onChangeText={setEstimatedTime} />

                <Label>priority</Label>
                <PriorityContainer>
                    {priorities.map((p) => (
                        <TouchableOpacity
                        key={p}
                        style={[styles.priorityButton, priority === p && styles.priorityButtonActive]}
                        onPress={() => setPriority(p)}>
                            <Text style={priority === p ? styles.priorityTextActive : styles.priorityText}>{p}</Text>
                        </TouchableOpacity>
                    ))}
                </PriorityContainer>

                <TouchableOpacity onPress={handleAddNote}>
                    <AddButton>
                        <AddButtonText>add task</AddButtonText>
                    </AddButton>
                </TouchableOpacity>
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
});