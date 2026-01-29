
export type AppID = 'calculator' | 'taskmaster' | 'timer' | 'snake' | 'start';

export interface WindowState {
  id: AppID;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  position: { x: number; y: number };
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}
