import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => (
  <div>
    <h1>Hello, React with ES6 Modules!</h1>
    <p>This is a basic setup to get started with React.</p>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
