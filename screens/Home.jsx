import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import {
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Note from '../components/Note';

const HomeView = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
`;

const HomeTitle = styled.Text`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
`;

const DeleteButton = styled.TouchableOpacity`
  background-color: #dc3545;
  padding: 12px;
  border-radius: 5px;
  align-items: center;
  margin-bottom: 10px;
`;

const DeleteText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;

export default function HomeScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState([]);

  const loadNotes = async () => {
    const data = await AsyncStorage.getItem('@notes');
    if (data) {
      setNotes(JSON.parse(data));
    }
  };

  const saveNotes = async (updatedNotes) => {
    await AsyncStorage.setItem('@notes', JSON.stringify(updatedNotes));
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadNotes);
    return unsubscribe;
  }, [navigation]);

  const toggleSelectNote = (id) => {
    setSelectedNotes((prev) =>
      prev.includes(id) ? prev.filter((noteId) => noteId !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    const remainingNotes = notes.filter((note) => !selectedNotes.includes(note.id));
    setNotes(remainingNotes);
    setSelectedNotes([]);
    await saveNotes(remainingNotes);
  };

  const openNoteDetails = (note) => {
    navigation.navigate('Details', { note });
  };

  const openAddNote = () => {
    navigation.navigate('AddNote');
  };

  return (
    <Pressable onPress={() => setSelectedNotes([])} style={{ flex: 1 }}>
      <HomeView>
        <HomeTitle>Tasks</HomeTitle>

        {selectedNotes.length > 0 && (
          <DeleteButton
            onPress={(e) => {
              e.stopPropagation?.();
              handleDeleteSelected();
            }}
          >
            <DeleteText>🗑 Видалити вибрані ({selectedNotes.length})</DeleteText>
          </DeleteButton>
        )}

        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isSelected = selectedNotes.includes(item.id);

            const handlePress = () => {
              if (selectedNotes.length > 0) {
                toggleSelectNote(item.id);
              } else {
                openNoteDetails(item);
              }
            };

            const handleLongPress = () => {
              if (selectedNotes.length === 0) {
                toggleSelectNote(item.id);
              }
            };

            return (
              <Note
                note={item}
                onPress={handlePress}
                onLongPress={handleLongPress}
                selected={isSelected}
              />
            );
          }}
        />

        <TouchableOpacity style={styles.addButton} onPress={openAddNote}>
          <Text style={styles.addButtonText}>+ Додати нотатку</Text>
        </TouchableOpacity>
      </HomeView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
