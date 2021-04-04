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
      <span>{value.toFixed(2)}%</span>
    </div>
  );
};

const STAT_STEPS = [70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180];
const Statistics = ({ stat }) => {
  return (
    <div className="Statistics">
      <StatElement text={'Runs'} value={stat.run} />
      <StatElement text={'Max Score'} value={stat.maxScore} />
      <StatElement text={'Max STR Score'} value={stat.maxStrScore} />
      <StatElement text={'Max DEX Score'} value={stat.maxDexScore} />
      <StatElement text={'Max INT Score'} value={stat.maxIntScore} />
      <StatElement text={'Max LUK Score'} value={stat.maxLukScore} />
      {STAT_STEPS.map((step, i) => (
        <StatElement
          key={i}
          text={`Over ${step} (%)`}
          value={((stat?.overs?.all[i] / stat?.run) * 100).toFixed(8)}
        />
      ))}
      {STAT_STEPS.map((step, i) => (
        <StatElement
          key={'str' + i}
          text={`Over ${step} (%, STR)`}
          value={((stat?.overs?.str[i] / stat?.run) * 100).toFixed(8)}
          color={'#b60000'}
        />
      ))}
      {STAT_STEPS.map((step, i) => (
        <StatElement
          key={'dex' + i}
          text={`Over ${step} (%, DEX)`}
          value={((stat?.overs?.dex[i] / stat?.run) * 100).toFixed(8)}
          color={'green'}
        />
      ))}
      {STAT_STEPS.map((step, i) => (
        <StatElement
          key={'int' + i}
          text={`Over ${step} (%, INT)`}
          value={((stat?.overs?.int[i] / stat?.run) * 100).toFixed(8)}
          color={'blue'}
        />
      ))}
      {STAT_STEPS.map((step, i) => (
        <StatElement
          key={'luk' + i}
          text={`Over ${step} (%, LUK)`}
          value={((stat?.overs?.luk[i] / stat?.run) * 100).toFixed(8)}
          color={'#615a17'}
        />
      ))}
    </div>
  );
};

const StatElement = ({ text, value, color }) => {
  return (
    <div className="StatElement">
      <span style={{ color: color }}>{text}</span>
      <span style={{ color: color }}>{value}</span>
    </div>
  );
};
