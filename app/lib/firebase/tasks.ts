// tasks.ts
import { db } from '../types/config'
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import type { Task, NewTask } from '../types'

/**
 * Fetch all tasks for the given user, ordered by dueDate ascending.
 * Converts Firestore Timestamps → JS Date so the UI can render dates.
 */
export async function getUserTasks(userId: string): Promise<Task[]> {
  try {
    // make sure this path matches what you use in createTask()
    const tasksCol = collection(db, 'tasks')
    const q = query(
      tasksCol,
      where('userId', '==', userId),
      orderBy('dueDate', 'asc')
    )

    console.log('Fetching tasks for user:', userId)
    const snap = await getDocs(q)
    const tasks = snap.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title as string,
        description: data.description as string,
        completed: data.completed as boolean,
        priority: data.priority as 'high' | 'medium' | 'low',
        // convert Firestore Timestamp → JS Date
        dueDate: (data.dueDate as Timestamp).toDate(),
      }
    })
    console.log('Fetched tasks:', tasks.length)
    return tasks
  } catch (error) {
    console.error('Error fetching tasks:', error)
    throw error
  }
}

/**
 * Create a new task under /tasks
 */
export async function createTask(userId: string, newTask: NewTask): Promise<void> {
  try {
    const tasksCol = collection(db, 'tasks')
    const taskData = {
      userId,
      title: newTask.title,
      description: newTask.description || '',
      completed: false,
      priority: newTask.priority,
      dueDate: Timestamp.fromDate(newTask.dueDate),
      createdAt: Timestamp.fromDate(new Date()),
    }
    
    console.log('Creating task with data:', taskData)
    await addDoc(tasksCol, taskData)
    console.log('Task created successfully')
  } catch (error) {
    console.error('Error creating task:', error)
    throw error
  }
}

/**
 * Update an existing task
 */
export async function updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
  try {
    const taskRef = doc(db, 'tasks', taskId)
    const updateData = {
      ...updates,
      updatedAt: Timestamp.fromDate(new Date())
    }
    await updateDoc(taskRef, updateData)
  } catch (error) {
    console.error('Error updating task:', error)
    throw error
  }
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: string): Promise<void> {
  try {
    const taskRef = doc(db, 'tasks', taskId)
    await deleteDoc(taskRef)
  } catch (error) {
    console.error('Error deleting task:', error)
    throw error
  }
}