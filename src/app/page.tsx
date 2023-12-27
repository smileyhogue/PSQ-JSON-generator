// pages/index.tsx

import React from 'react';
import DynamicQuestionnaire from './components/DynamicQuestionnaire';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Dynamic Questionnaire</h1>
      <DynamicQuestionnaire />
    </div>
  );
};

export default Home;
