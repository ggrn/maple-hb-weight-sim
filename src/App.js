import './App.css';
import Panel from './components/Panel';

const App = () => {
  return (
    <div className="App">
      <Panel defaultWeight={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]} />
      <Panel
        defaultWeight={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
        defaultIsNewLogic
      />
      <Panel defaultWeight={[5, 5, 5, 5, 7, 7, 7, 7, 7, 7, 8, 8, 4, 9, 8, 8, 10, 10, 1]} />
      <Panel
        defaultWeight={[5, 5, 5, 5, 7, 7, 7, 7, 7, 7, 8, 8, 4, 9, 8, 8, 10, 10, 1]}
        defaultIsNewLogic
      />
    </div>
  );
};

export default App;
