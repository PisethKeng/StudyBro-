import { Timestamp } from 'firebase/firestore';

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdByName: string;
  members: string[];
  memberNames: { [key: string]: string };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ChatMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Timestamp;
  type: 'text' | 'file';
  fileUrl?: string;
  fileName?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  joinedGroups: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
} 