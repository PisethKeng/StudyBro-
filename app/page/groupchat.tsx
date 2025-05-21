import React, { useState, useEffect } from 'react';
import { auth } from '../lib/types/config';
import {
  createStudyGroup, 
  joinStudyGroup, 
  getStudyGroups, 
  getUserStudyGroups,
  sendMessage,
  getGroupMessages,
  deleteStudyGroup
} from '../lib/firebase/groupChat';
import type { StudyGroup, ChatMessage } from '../lib/types/firebase';

export default function GroupChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [input, setInput] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
  });

  // Load groups on component mount
  useEffect(() => {
    loadGroups();
  }, []);

  // Load messages when a group is selected
  useEffect(() => {
    if (selectedGroup) {
      loadMessages(selectedGroup.id);
    }
  }, [selectedGroup]);

  const loadGroups = async () => {
    try {
      const allGroups = await getStudyGroups();
      setGroups(allGroups);
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  };

  const loadMessages = async (groupId: string) => {
    try {
      const groupMessages = await getGroupMessages(groupId);
      setMessages(groupMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleCreateGroup = async () => {
    if (!auth.currentUser) {
      console.error('No authenticated user found');
      alert('Please sign in to create a group');
      return;
    }
    
    if (!newGroup.name.trim()) {
      alert('Please enter a group name');
      return;
    }
    
    try {
      console.log('Creating group with data:', {
        name: newGroup.name,
        description: newGroup.description,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Anonymous'
      });

      await createStudyGroup(
        newGroup.name,
        newGroup.description,
        auth.currentUser.uid,
        auth.currentUser.displayName || 'Anonymous'
      );
      
      console.log('Group created successfully');
      setShowCreateGroup(false);
      setNewGroup({ name: '', description: '' });
      await loadGroups();
    } catch (error) {
      console.error('Detailed error creating group:', error);
      alert('Error creating group: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!auth.currentUser) return;
    
    try {
      await joinStudyGroup(
        groupId,
        auth.currentUser.uid,
        auth.currentUser.displayName || 'Anonymous'
      );
      loadGroups();
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedGroup || !auth.currentUser) return;

    try {
      await sendMessage(
        selectedGroup.id,
        auth.currentUser.uid,
        auth.currentUser.displayName || 'Anonymous',
        input
      );
      setInput('');
      loadMessages(selectedGroup.id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!auth.currentUser) {
      alert('Please sign in to delete a group');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteStudyGroup(groupId, auth.currentUser.uid);
      setSelectedGroup(null);
      await loadGroups();
      alert('Group deleted successfully');
    } catch (error) {
      console.error('Error deleting group:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete group');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-12 h-[calc(100vh-2rem)]">
            {/* Groups Sidebar */}
            <div className="col-span-3 bg-gray-50 border-r p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Study Groups</h2>
                <button
                  onClick={() => setShowCreateGroup(true)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Group
                </button>
              </div>

              {/* Create Group Modal */}
              {showCreateGroup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white p-6 rounded-lg w-96">
                    <h3 className="text-xl font-bold mb-4">Create New Study Group</h3>
                    <input
                      type="text"
                      value={newGroup.name}
                      onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                      placeholder="Group Name"
                      className="w-full p-2 border rounded-lg mb-4"
                    />
                    <textarea
                      value={newGroup.description}
                      onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                      placeholder="Group Description"
                      className="w-full p-2 border rounded-lg mb-4"
                      rows={3}
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setShowCreateGroup(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreateGroup}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Create
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Groups List */}
              <div className="space-y-3">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className={`p-3 rounded-lg cursor-pointer ${
                      selectedGroup?.id === group.id
                        ? 'bg-blue-100 border-blue-500'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedGroup(group)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{group.name}</h3>
                        <p className="text-sm text-gray-500">{group.description}</p>
                      </div>
                      {group.createdBy === auth.currentUser?.uid && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGroup(group.id);
                          }}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {group.members.length} members
                      </span>
                      {!group.members.includes(auth.currentUser?.uid || '') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoinGroup(group.id);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          Join
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="col-span-9 flex flex-col">
              {selectedGroup ? (
                <>
                  {/* Chat Header */}
                  <div className="bg-blue-600 text-white p-4">
                    <h1 className="text-xl font-bold">{selectedGroup.name}</h1>
                    <p className="text-sm text-blue-100">
                      {selectedGroup.members.length} members
                    </p>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === auth.currentUser?.uid
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.senderId === auth.currentUser?.uid
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p>{message.text}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs opacity-70">
                              {message.senderName}
                            </span>
                            <span className="text-xs opacity-70">
                              {message.timestamp?.toDate().toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input Area */}
                  <div className="border-t p-4 bg-gray-50">
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleSend}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Select a group to start chatting
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
