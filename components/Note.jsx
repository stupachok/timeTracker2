import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import styled from 'styled-components/native';
import { format } from 'date-fns';
import { getXPFromPriority, updateUserXP } from './UpdateUserXp';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

const STATUS_OPTIONS = ['To Do', 'In Progress', 'Done', 'Pending'];

const NoteView = styled.View`
  padding: 10px;
  background-color: ${(props) => (props.selected ? '#e6f0ff' : '#fff')};
  border-radius: 5px;
  border-width: 1px;
  border-color: ${(props) => (props.selected ? '#3399ff' : '#ddd')};
  margin-bottom: 10px;
`;

const NoteText = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

const InfoText = styled.Text`
  font-size: 14px;
  color: #555;
  margin-top: 4px;
`;

const NoteHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

const StatusLabel = styled.Text`
  font-size: 14px;
  color: #333;
  margin-right: 6px;
`;

const MenuView = styled.View`
  position: absolute;
  width: 140px;
  background-color: #fff;
  border-width: 1px;
  border-color: #ccc;
  border-radius: 5px;
  z-index: 10;
  elevation: 3;
`;

const MenuItem = styled.Text`
  padding: 8px 12px;
  font-size: 14px;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

const MenuText = styled.Text`
  font-size: 18px;
  color: #333;
`;

const StatusView = styled.View`
  position: relative;
  flex-direction: row;
  align-items: center;
`;

const PriorityDot = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${(props) => {
    switch (props.priority) {
      case 'High':
        return 'red';
      case 'Medium':
        return 'green';
      case 'Low':
      default:
        return '#888';
    }
  }};
  margin-right: 6px;
`;

export default function Note({ note, onPress, onLongPress, selected }) {
  const [status, setStatus] = useState(note.status || 'To Do');
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const statusButtonRef = useRef();

  const handleStatusMenu = async (newStatus) => {
    setStatus(newStatus);
    setShowMenu(false);
    await updateNoteStatus(newStatus);
  };

  const updateNoteStatus = async (newStatus) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, 'users', user.uid, 'tasks', note.id);
      const updates = { status: newStatus };

      if (newStatus === 'Done' && !note.xpGranted) {
        const xp = getXPFromPriority(note.priority?.toLowerCase() || 'low');
        await updateUserXP(user.uid, xp);
        updates.xpGranted = true;
      }

      await updateDoc(ref, updates);
    } catch (err) {
      console.error('❌ Failed to update note status:', err);
    }
  };

  const openMenu = () => {
    if (note.status === 'Done') return;
    statusButtonRef.current?.measureInWindow((x, y, width, height) => {
      setMenuPosition({ top: y + height + 4, left: x });
      setShowMenu(true);
    });
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.9}
    >
      <NoteView selected={selected}>
        <NoteHeader>
          <View style={{ flex: 1 }}>
            <NoteText>{note.title}</NoteText>
            {note.estimatedTime && (
              <InfoText>⏱ Estimate: {note.estimatedTime} hours.</InfoText>
            )}
            {note.date && (
              <InfoText>📅 Date: {format(new Date(note.date), 'd MMM yyyy')}</InfoText>
            )}
            {note.priority && (
              <InfoText>🔥 Priority: {note.priority}</InfoText>
            )}
          </View>

          <StatusView>
            <PriorityDot priority={note.priority} />
            <TouchableOpacity
              ref={statusButtonRef}
              style={styles.menuButton}
              onPress={openMenu}
            >
              <StatusLabel>{status}</StatusLabel>
              <MenuText>⋮</MenuText>
            </TouchableOpacity>
          </StatusView>
        </NoteHeader>

        <Modal
          transparent
          visible={showMenu}
          animationType="fade"
          onRequestClose={() => setShowMenu(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
            <View style={StyleSheet.absoluteFillObject}>
              <View
                style={[
                  styles.absoluteMenu,
                  { top: menuPosition.top, left: menuPosition.left },
                ]}
              >
                <MenuView>
                  {STATUS_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => handleStatusMenu(option)}
                    >
                      <MenuItem>{option}</MenuItem>
                    </TouchableOpacity>
                  ))}
                </MenuView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </NoteView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 6,
  },
  absoluteMenu: {
    position: 'absolute',
  },
});
