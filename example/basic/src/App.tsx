import React from 'react';
import { ReactUploaderSkeleton } from '../../../src';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <ReactUploaderSkeleton />
      </header>
    </div>
  );
};

export default App;
