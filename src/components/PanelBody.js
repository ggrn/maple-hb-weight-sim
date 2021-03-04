import React from 'react';
import PropTypes from 'prop-types';
import optionConfigs from '../config/options';

const PanelBody = ({ stat }) => {
  return (
    <div className="PanelBody">
      <Graph stat={stat} />
      <Statistics stat={stat} />
    </div>
  );
};

PanelBody.propTypes = {
  stat: PropTypes.any,
};

export default PanelBody;

const Graph = ({ stat }) => {
  const { counts = [] } = stat;
  return (
    <div className="Graph">
      {optionConfigs.options.map((text, i) => {
        return (
          <GraphElement text={text} value={(counts[i] / Math.max(...counts)) * 100} key={text} />
        );
      })}
    </div>
  );
};

const GraphElement = ({ text, value }) => {
  return (
    <div className="GraphElement">
      <span>{text}</span>
      <div className="Bar">
        <div className="BarElement" style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
};

const Statistics = ({ stat }) => {
  return (
    <div className="Statistics">
      <StatElement text={'Runs'} value={stat.run} />
      <StatElement text={'Max Score'} value={stat.maxScore} />
      <StatElement text={'Max STR Score'} value={stat.maxStrScore} />
      <StatElement text={'Max DEX Score'} value={stat.maxDexScore} />
      <StatElement text={'Max INT Score'} value={stat.maxIntScore} />
      <StatElement text={'Max LUK Score'} value={stat.maxLukScore} />
      <StatElement text={'Over 70 (%)'} value={((stat.over70 / stat.run) * 100).toFixed(8)} />
      <StatElement text={'Over 80 (%)'} value={((stat.over80 / stat.run) * 100).toFixed(8)} />
      <StatElement text={'Over 90 (%)'} value={((stat.over90 / stat.run) * 100).toFixed(8)} />
      <StatElement text={'Over 100 (%)'} value={((stat.over100 / stat.run) * 100).toFixed(8)} />
      <StatElement text={'Over 110 (%)'} value={((stat.over110 / stat.run) * 100).toFixed(8)} />
      <StatElement text={'Over 120 (%)'} value={((stat.over120 / stat.run) * 100).toFixed(8)} />
      <StatElement text={'Over 130 (%)'} value={((stat.over130 / stat.run) * 100).toFixed(8)} />
      <StatElement text={'Over 140 (%)'} value={((stat.over140 / stat.run) * 100).toFixed(8)} />
      <StatElement text={'Over 150 (%)'} value={((stat.over150 / stat.run) * 100).toFixed(8)} />
      <StatElement text={'Over 160 (%)'} value={((stat.over160 / stat.run) * 100).toFixed(8)} />
      <StatElement text={'Over 170 (%)'} value={((stat.over170 / stat.run) * 100).toFixed(8)} />
      <StatElement text={'Over 180 (%)'} value={((stat.over180 / stat.run) * 100).toFixed(8)} />
    </div>
  );
};

const StatElement = ({ text, value }) => {
  return (
    <div className="StatElement">
      <span>{text}</span>
      <input type="number" disabled value={value} readOnly />
    </div>
  );
};
