
export enum TempleCulture {
  CHAM = 'Чамы (Индуизм)',
  CHINESE = 'Китай (Буддизм/Даосизм)',
  VIETNAMESE = 'Вьетнам (Традиции)',
  CAODAI = 'Каодай (Синтез религий)',
  HISTORY = 'История и наследие',
}

export interface Temple {
  id: string;
  name: string;
  russianName: string;
  culture: TempleCulture;
  description: string;
  history: string;
  location: { address: string };
  imageUrl: string;
  highlights: string[];
  audioScript: string;
  duration: string;
  hasLunchBreak: boolean;
  openTime?: string; // Например "07:30"
  closeTime?: string; // Например "17:00"
  isNightActive?: boolean; // Играет ли красками вечером
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
