import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Провайдеры для тестов
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
    </>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Хелпер для ожидания
export const waitForLoadingToFinish = () =>
  new Promise(resolve => setTimeout(resolve, 0));

// Хелпер для создания мок-файла
export const createMockFile = (
  content: string = 'test content',
  name: string = 'test.jpg',
  type: string = 'image/jpeg'
): File => {
  const blob = new Blob([content], { type });
  return new File([blob], name, { type });
};

// Хелпер для создания мок-события файла
export const createMockFileEvent = (files: File[]): { target: { files: FileList } } => {
  return {
    target: {
      files: files as unknown as FileList,
    },
  };
};
