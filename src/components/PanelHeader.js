import React from 'react';
import PropTypes from 'prop-types';

const options = [
  'STR',
  'DEX',
  'INT',
  'LUK',
  'DSD',
  'DSI',
  'DSL',
  'DDI',
  'DDL',
  'DIL',
  'MHP',
  'MMP',
  'LVD',
  'DEF',
  'ATK',
  'MAT',
  'MOV',
  'JUM',
  'ALL',
];

const PanelHeader = ({
  weights,
  onWeightChanged,
  isRun,
  onRunClicked,
  onDownloadClicked,
  onSettingButtonClicked,
  isNewLogic,
  onNewLogicChanged,
  itemLevel,
  onItemLevelChanged,
  atkScore,
  onAtkScoreChanged,
  allStatScore,
  onAllStatScoreChanged,
  maxResultSize,
  onMaxResultSizeChanged,
  maxResultQueue,
  onMaxResultQueueChanged,
  runWindow,
  onRunWindowChanged,
}) => {
  return (
    <div className="PanelHeader">
      <div className="PanelHeaderRow">
        {options.slice(0, 10).map((text, index) => {
          return (
            <PanelHeaderElement
              key={text}
              text={text}
              value={weights[index]}
              isRun={isRun}
              step={1}
              onChange={onWeightChanged(index)}
            />
          );
        })}
      </div>
      <div className="PanelHeaderRow">
        {options.slice(10, options.length).map((text, index) => {
          return (
            <PanelHeaderElement
              key={text}
              text={text}
              value={weights[index + 10]}
              isRun={isRun}
              step={1}
              onChange={onWeightChanged(index + 10)}
            />
          );
        })}
        <RunMode value={isNewLogic} onNewLogicChanged={onNewLogicChanged} isRun={isRun} />
      </div>
      <div className="PanelHeaderRow">
        <ItemLevel value={itemLevel} onItemLevelChanged={onItemLevelChanged} isRun={isRun} />
        <PanelHeaderElement
          text="Atk Score"
          value={atkScore}
          onChange={onAtkScoreChanged}
          isRun={isRun}
          step={0.1}
        />
        <PanelHeaderElement
          text="All Stat Score"
          value={allStatScore}
          onChange={onAllStatScoreChanged}
          isRun={isRun}
          ls={'-0.1em'}
          step={0.1}
        />
        <PanelHeaderElement
          text="Max Results"
          value={maxResultSize}
          onChange={onMaxResultSizeChanged}
          isRun={isRun}
          max={100000000}
          step={10000}
          width={2}
        />
        <PanelHeaderElement
          text="Max Result Queue"
          value={maxResultQueue}
          onChange={onMaxResultQueueChanged}
          isRun={isRun}
          max={maxResultSize / 10}
          step={1000}
          width={2}
        />
        <PanelHeaderElement
          text="Run Window"
          value={runWindow}
          onChange={onRunWindowChanged}
          isRun={isRun}
          step={100}
          width={2}
        />
      </div>
      <div className="PanelHeaderRow" style={{ justifyContent: 'flex-end', paddingTop: '5px' }}>
        <button disabled={isRun} onClick={onSettingButtonClicked('all1')}>
          Set All 1
        </button>
        <button disabled={isRun} onClick={onSettingButtonClicked('expect')}>
          Set Expect
        </button>
        <button onClick={onDownloadClicked} style={{ marginLeft: '5px' }}>
          download as csv
        </button>
        <button onClick={onRunClicked} style={{ marginLeft: '5px' }}>
          {isRun ? 'Stop' : 'Run'}
        </button>
      </div>
    </div>
  );
};

export default PanelHeader;

PanelHeader.propTypes = {
  weights: PropTypes.arrayOf(PropTypes.number).isRequired,
  onWeightChanged: PropTypes.func.isRequired,
  isRun: PropTypes.bool.isRequired,
  onRunClicked: PropTypes.func.isRequired,
  isNewLogic: PropTypes.bool.isRequired,
  onNewLogicChanged: PropTypes.func.isRequired,
};

const PanelHeaderElement = ({
  text,
  value,
  onChange,
  isRun,
  min = 1,
  max = 100,
  width = 1,
  step,
  ls,
}) => {
  return (
    <div className="PanelHeaderElement" style={{ width: `${width * 10}%` }}>
      <span style={{ letterSpacing: ls }}>{text}</span>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        disabled={isRun}
      />
    </div>
  );
};

PanelHeaderElement.propTypes = {
  text: PropTypes.string.isRequired,
};

const RunMode = ({ value, onNewLogicChanged, isRun }) => {
  return (
    <div className="PanelHeaderElement">
      <span style={{ letterSpacing: '-0.1em' }}>New Logic</span>
      <input type="checkbox" checked={value} onChange={onNewLogicChanged} disabled={isRun} />
    </div>
  );
};

const ItemLevel = ({ value, onItemLevelChanged, isRun }) => {
  return (
    <div className="PanelHeaderElement">
      <span style={{ letterSpacing: '-0.1em' }}>Item Level</span>
      <select onChange={onItemLevelChanged} value={value} disabled={isRun} style={{ width: '50%' }}>
        <option value="140">140</option>
        <option value="150">150</option>
        <option value="160">160</option>
        <option value="200">200</option>
      </select>
    </div>
  );
};
