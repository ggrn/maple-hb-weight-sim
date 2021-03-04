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
}) => {
  return (
    <div className="PanelHeader">
      <div className="PanelHeaderRow">
        {options.slice(0, 10).map((text, index) => {
          return (
            <PanelHeaderElement
              key={text}
              text={text}
              weight={weights[index]}
              isRun={isRun}
              onWeightChanged={onWeightChanged(index)}
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
              weight={weights[index + 10]}
              isRun={isRun}
              onWeightChanged={onWeightChanged(index + 10)}
            />
          );
        })}
      </div>
      <div className="PanelHeaderRow" style={{ justifyContent: 'flex-end', paddingTop: '5px' }}>
        <button onClick={onDownloadClicked}>download</button>
        <button disabled={isRun} onClick={onSettingButtonClicked('all1')}>
          Set All 1
        </button>
        <button disabled={isRun} onClick={onSettingButtonClicked('expect')}>
          Set Expect
        </button>
        <button onClick={onRunClicked}>{isRun ? 'Stop' : 'Run'}</button>
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
};

const PanelHeaderElement = ({ text, weight, onWeightChanged, isRun }) => {
  return (
    <div className="PanelHeaderElement">
      <span>{text}</span>
      <input
        type="number"
        min={1}
        max={100}
        step={1}
        value={weight}
        onChange={onWeightChanged}
        disabled={isRun}
      />
    </div>
  );
};

PanelHeaderElement.propTypes = {
  text: PropTypes.string.isRequired,
};
