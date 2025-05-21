import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  Timestamp,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../types/config';
import type { StudyGroup, ChatMessage, UserProfile } from '../types/firebase';

// Create a new study group
export const createStudyGroup = async (
  name: string,
  description: string,
  userId: string,
  userName: string
): Promise<string> => {
  try {
    // First, create the study group document
    const groupRef = await addDoc(collection(db, 'studyGroups'), {
      name,
      description,
      createdBy: userId,
      createdByName: userName,
      members: [userId],
      memberNames: { [userId]: userName },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Then, create a welcome message in the group
    await addDoc(collection(db, 'messages'), {
      groupId: groupRef.id,
      senderId: 'system',
      senderName: 'System',
      text: `Welcome to ${name}! This is the beginning of your study group.`,
      type: 'text',
      timestamp: serverTimestamp(),
    });

    // Add group to user's joined groups
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      joinedGroups: arrayUnion(groupRef.id)
    });

    console.log('Study group created successfully:', groupRef.id);
    return groupRef.id;
  } catch (error) {
    console.error('Error creating study group:', error);
    throw error;
  }
};

// Join a study group
export const joinStudyGroup = async (
  groupId: string,
  userId: string,
  userName: string
): Promise<void> => {
  try {
    const groupRef = doc(db, 'studyGroups', groupId);
    const groupDoc = await getDoc(groupRef);

    if (!groupDoc.exists()) {
      throw new Error('Group not found');
    }

    const group = groupDoc.data() as StudyGroup;
    if (group.members.includes(userId)) {
      throw new Error('Already a member of this group');
    }

    // Update group with new member
    await updateDoc(groupRef, {
      members: arrayUnion(userId),
      [`memberNames.${userId}`]: userName,
      updatedAt: serverTimestamp(),
    });

    // Add join message
    await addDoc(collection(db, 'messages'), {
      groupId,
      senderId: 'system',
      senderName: 'System',
      text: `${userName} joined the group`,
      type: 'text',
      timestamp: serverTimestamp(),
    });

    // Add group to user's joined groups
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      joinedGroups: arrayUnion(groupId)
    });

    console.log('Successfully joined study group:', groupId);
  } catch (error) {
    console.error('Error joining study group:', error);
    throw error;
  }
};

// Get all study groups
export const getStudyGroups = async (): Promise<StudyGroup[]> => {
  try {
    const groupsQuery = query(
      collection(db, 'studyGroups'),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(groupsQuery);
    const groups = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as StudyGroup[];

    console.log('Retrieved study groups:', groups.length);
    return groups;
  } catch (error) {
    console.error('Error getting study groups:', error);
    throw error;
  }
};

// Get user's study groups
export const getUserStudyGroups = async (userId: string): Promise<StudyGroup[]> => {
  const groupsQuery = query(
    collection(db, 'studyGroups'),
    where('members', 'array-contains', userId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(groupsQuery);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as StudyGroup[];
};

// Send a message to a study group
export const sendMessage = async (
  groupId: string,
  userId: string,
  userName: string,
  text: string,
  type: 'text' | 'file' = 'text',
  fileUrl?: string,
  fileName?: string
): Promise<string> => {
  try {
    const messageRef = await addDoc(collection(db, 'messages'), {
      groupId,
      senderId: userId,
      senderName: userName,
      text,
      type,
      fileUrl,
      fileName,
      timestamp: serverTimestamp(),
    });

    // Update group's last activity
    const groupRef = doc(db, 'studyGroups', groupId);
    await updateDoc(groupRef, {
      updatedAt: serverTimestamp(),
    });

    console.log('Message sent successfully:', messageRef.id);
    return messageRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Get messages for a study group
export const getGroupMessages = async (groupId: string): Promise<ChatMessage[]> => {
  try {
    const messagesQuery = query(
      collection(db, 'messages'),
      where('groupId', '==', groupId),
      orderBy('timestamp', 'asc')
    );
    
    const snapshot = await getDocs(messagesQuery);
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatMessage[];

    console.log('Retrieved messages:', messages.length);
    return messages;
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
};

// Delete a study group and its messages
export const deleteStudyGroup = async (groupId: string, userId: string): Promise<void> => {
  try {
    const groupRef = doc(db, 'studyGroups', groupId);
    const groupDoc = await getDoc(groupRef);

    if (!groupDoc.exists()) {
      throw new Error('Group not found');
    }

    const group = groupDoc.data() as StudyGroup;
    
    // Check if user is the creator of the group
    if (group.createdBy !== userId) {
      throw new Error('Only the group creator can delete the group');
    }

    // Delete all messages in the group
    const messagesQuery = query(
      collection(db, 'messages'),
      where('groupId', '==', groupId)
    );
    const messagesSnapshot = await getDocs(messagesQuery);
    
    // Delete each message
    const deletePromises = messagesSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    // Delete the group document
    await deleteDoc(groupRef);

    // Update all members' joinedGroups array
    const updatePromises = group.members.map(memberId => {
      const userRef = doc(db, 'users', memberId);
      return updateDoc(userRef, {
        joinedGroups: arrayRemove(groupId)
      });
    });
    await Promise.all(updatePromises);

    console.log('Study group deleted successfully:', groupId);
  } catch (error) {
    console.error('Error deleting study group:', error);
    throw error;
  }
}; 