export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate: Date;
}

export interface NewTask {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: Date;
} 