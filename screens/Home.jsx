import React, { useState, useEffect, useLayoutEffect } from 'react';
import styled from 'styled-components/native';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  Pressable,
} from 'react-native';
import { auth, db } from '../firebase/firebaseConfig';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import Note from '../components/Note';
import WeekDaySelector from '../components/WeekDaySelector';
import { format } from 'date-fns';
import { signOut } from 'firebase/auth';
import Loading from '../components/Loading';

const HomeView = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;

const InnerContainer = styled.View`
  padding: 20px;
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
          <Text style={{ color: '#007bff', fontWeight: '600' }}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('LogIn');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const fetchNotes = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const ref = collection(db, 'users', user.uid, 'tasks');
      const snap = await getDocs(ref);
      const loadedNotes = [];
      snap.forEach((doc) => {
        loadedNotes.push({ id: doc.id, ...doc.data() });
      });
      setNotes(loadedNotes);
    } catch (err) {
      console.error('Failed to load notes:', err);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      fetchNotes();
    });
    return unsubscribe;
  }, [navigation]);

  const handleDeleteSelected = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      for (const id of selectedNotes) {
        await deleteDoc(doc(db, 'users', user.uid, 'tasks', id));
      }

      setSelectedNotes([]);
      fetchNotes();
    } catch (err) {
      console.error('Failed to delete tasks:', err);
    }
  };

  const toggleSelectNote = (id) => {
    setSelectedNotes((prev) =>
      prev.includes(id)
        ? prev.filter((noteId) => noteId !== id)
        : [...prev, id]
    );
  };

  const openNoteDetails = (note) => {
    navigation.navigate('Details', { note });
  };

  const openAddNote = () => {
    navigation.navigate('AddNote');
  };

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  const filteredNotes = notes.filter((n) => n.date === formattedDate);
  const activeNotes = filteredNotes.filter((n) => n.status !== 'Done');
  const archivedNotes = filteredNotes.filter((n) => n.status === 'Done');

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotes();
  };

  if (loading) return <Loading />;

  return (
    <HomeView>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Pressable onPress={() => setSelectedNotes([])}>
          <InnerContainer>
            <HomeTitle>Tasks</HomeTitle>

            <WeekDaySelector
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />

            {selectedNotes.length > 0 && (
              <DeleteButton onPress={handleDeleteSelected}>
                <DeleteText>
                  🗑 Delete selected ({selectedNotes.length})
                </DeleteText>
              </DeleteButton>
            )}

            {activeNotes.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
                  🟢 Active tasks
                </Text>
                {activeNotes.map((item) => (
                  <Note
                    key={item.id}
                    note={item}
                    onPress={() => openNoteDetails(item)}
                    onLongPress={() => toggleSelectNote(item.id)}
                    selected={selectedNotes.includes(item.id)}
                  />
                ))}
              </View>
            )}

            {archivedNotes.length > 0 && (
              <View>
                <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
                  📦 Archive ({format(selectedDate, 'd MMMM yyyy')})
                </Text>
                {archivedNotes.map((item) => (
                  <Note
                    key={item.id}
                    note={item}
                    onPress={() => {}}
                    onLongPress={() => {}}
                    selected={false}
                  />
                ))}
              </View>
            )}
          </InnerContainer>
        </Pressable>
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={openAddNote}>
        <Text style={styles.addButtonText}>+ Add task</Text>
      </TouchableOpacity>
    </HomeView>
  );
}

const styles = StyleSheet.create({
  addButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    width: '90%',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
