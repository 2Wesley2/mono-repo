import React, { useState } from 'react';
import { TabsProps } from '../../types/tabs';
import { TabButton, TabPanel } from '../../ui/tabs';

export const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);
  const tabWidth = `${100 / tabs.length}%`;

  return (
    <div className="w-full h-full">
      <nav className="mb-4 border-b">
        <ul className="flex flex-row -mb-px text-sm font-medium text-center" role="tablist">
          {tabs.map((tab, index) => (
            <li key={index} className="me-2" role="presentation" style={{ width: tabWidth }}>
              <TabButton
                active={activeTab === index}
                onClick={() => setActiveTab(index)}
                type="button"
                role="tab"
                aria-selected={activeTab === index}
              >
                {tab.label}
              </TabButton>
            </li>
          ))}
        </ul>
      </nav>
      <div className="h-full w-full">
        {tabs.map((tab, index) => (
          <TabPanel key={index} active={activeTab === index} role="tabpanel" aria-labelledby={`tab-${index}`}>
            {tab.content}
          </TabPanel>
        ))}
      </div>
    </div>
  );
};
