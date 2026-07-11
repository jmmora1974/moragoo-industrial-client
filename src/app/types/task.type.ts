export interface TaskInfo {
  id: string;
  title: string;
  status: 'pending' | 'done' | 'failed';
  createdAt: string;
  updatedAt?: string;
}
