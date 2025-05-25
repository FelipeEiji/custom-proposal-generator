'use client';
import React, { createContext, useContext, useState } from 'react';
import { ProposalItem } from '@/types/Product';

interface ProposalContextType {
  items: ProposalItem[];
  addItem: (item: ProposalItem) => void;
  removeItem: (id: string) => void;
  resetItems: () => void;
}

const ProposalContext = createContext<ProposalContextType | undefined>(undefined);

export const ProposalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ProposalItem[]>([]);

  const addItem = (item: ProposalItem) => {
    setItems((prev) => [...prev.filter(i => i.code !== item.code), item]);
  };

  const removeItem = (code: string) => {
    setItems((prev) => prev.filter(i => i.code !== code));
  };

  const resetItems =  () => {
    setItems([]);
  }

  return (
    <ProposalContext.Provider value={{ items, addItem, removeItem, resetItems }}>
      {children}
    </ProposalContext.Provider>
  );
};

export const useProposal = () => {
  const context = useContext(ProposalContext);
  if (!context) throw new Error('useProposal must be used within ProposalProvider');
  return context;
};