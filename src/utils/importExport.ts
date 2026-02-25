import { Temple } from '../types';
import { TEMPLES } from '../constants';

export const exportTemples = (temples: Temple[]): void => {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    temples,
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `phanthiet-temples-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importTemples = (file: File): Promise<Temple[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (!data.temples || !Array.isArray(data.temples)) {
          reject(new Error('Invalid file format'));
          return;
        }
        
        const temples = data.temples as Temple[];
        
        temples.forEach((temple) => {
          if (!temple.id || !temple.name || !temple.culture) {
            reject(new Error('Invalid temple data'));
            return;
          }
        });
        
        resolve(temples);
      } catch (err) {
        reject(new Error('Failed to parse JSON'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const getInitialTemples = (): Temple[] => {
  return TEMPLES;
};
