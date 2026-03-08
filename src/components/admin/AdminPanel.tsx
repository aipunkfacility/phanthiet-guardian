import { useRef } from 'react';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Download, Upload, RefreshCw } from 'lucide-react';

interface AdminPanelProps {
  open: boolean;
  onClose: () => void;
  onExport: () => void;
  onImport: (data: any[]) => void;
  onLogout: () => void;
}

export function AdminPanel({ open, onClose, onExport, onImport, onLogout }: AdminPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data)) {
          onImport(data);
          alert('Данные успешно импортированы');
        } else {
          alert('Неверный формат данных');
        }
      } catch (error) {
        alert('Ошибка чтения файла');
      }
    };
    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Админ-панель</CardTitle>
          <CardDescription>
            Управление данными храмов
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={onExport}
            >
              <Download className="w-4 h-4" />
              Экспорт данных (JSON)
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={handleImportClick}
            >
              <Upload className="w-4 h-4" />
              Импорт данных (JSON)
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="pt-4 border-t">
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={onLogout}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Выйти из админ-режима
            </Button>
          </div>

          <Button 
            variant="ghost" 
            className="w-full"
            onClick={onClose}
          >
            Закрыть
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
