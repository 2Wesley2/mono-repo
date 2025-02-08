"use client";

import { Trophy, FileText, Share2, Mail } from 'lucide-react';
import React from 'react';

const MainContent: React.FC = () => {
  return (
    <main className="mainContent">
        <div className="greetingContainer">
            <h1 className="greeting">Olá, Borderless</h1>
            <div className="pointsContainer">
            <p className="pointsLabel">pontos:</p>
            <p className="pointsValue">0</p>
            </div>
        </div>

        <div className="banner">
            <img src="/placeholder.svg?height=300&width=1000&text=Banner+Image" alt="Promotional Banner" className="bannerImage"/>
        </div>

      <section>
        <h2 className="shortcutsTitle">Atalhos</h2>
        <div className="shortcutsGrid">
          {[
            { icon: Trophy, label: 'Prêmios', color: 'bg-blue-100 text-blue-600' },
            { icon: FileText, label: 'Extrato', color: 'bg-green-100 text-green-600' },
            { icon: Share2, label: 'Indique Amigos', color: 'bg-purple-100 text-purple-600' },
            { icon: Mail, label: 'Contato', color: 'bg-red-100 text-red-600' },
          ].map((item, index) => (
            <div key={index} className="shortcutCard">
              <div className={`iconContainer ${item.color}`}>
                <item.icon className="icon" />
              </div>
              <span className="shortcutLabel">{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default MainContent;
