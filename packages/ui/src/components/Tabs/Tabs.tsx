import React, { useState } from 'react';
import { cn } from '../../lib/utils';

interface TabProps {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabProps[];
}

export const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);
  const tabWidth = `${100 / tabs.length}%`;

  return (
    <div>
      <nav className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-row -mb-px text-sm font-medium text-center" role="tablist">
          {tabs.map((tab, index) => (
            <li key={index} className="me-2" role="presentation" style={{ width: tabWidth }}>
              <button
                className={cn(
                  'inline-block p-4 border-b-2 rounded-t-lg w-full',
                  activeTab === index
                    ? 'border-blue-600 text-blue-600'
                    : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                )}
                onClick={() => setActiveTab(index)}
                type="button"
                role="tab"
                aria-selected={activeTab === index}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div>
        {tabs.map((tab, index) => (
          <section
            key={index}
            className={cn('p-4 rounded-lg bg-gray-50 dark:bg-gray-800', activeTab === index ? 'block' : 'hidden')}
            role="tabpanel"
            aria-labelledby={`tab-${index}`}
          >
            {tab.content}
          </section>
        ))}
      </div>
    </div>
  );
};
