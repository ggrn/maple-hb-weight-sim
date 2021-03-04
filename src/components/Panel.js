import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import PanelHeader from './PanelHeader';
import PanelBody from './PanelBody';
// eslint-disable-next-line import/no-webpack-loader-syntax
import HBWorker from 'workerize-loader!../worker/hb.worker';

const Panel = ({ id, defaultWeight }) => {
  const [weights, setWeights] = useState(defaultWeight);
  const [isRun, setIsRun] = useState(false);
  const [stat, setStat] = useState({});

  const [worker, setWorker] = useState(null);
  useEffect(() => {
    setWorker((worker) => (worker === null ? new HBWorker() : worker));

    return () => {
      console.log('term');
      setWorker((worker) => {
        worker?.terminate();
        return null;
      });
    };
  }, [setWorker]);

  useEffect(() => {
    if (worker) {
      worker.onmessage = (ev) => {
        if (ev.data.type === 'run') {
          if (ev.data.value) {
            setIsRun(true);
          } else {
            setIsRun(false);
          }
        } else if (ev.data.type === 'stat') {
          setStat(ev.data.value);
        } else if (ev.data.type === 'download' && ev.data.link) {
          const link = document.createElement('a');
          link.download = `maple_hb_result_${Date.now()}.csv`;
          link.href = ev.data.link;
          link.click();
          URL.revokeObjectURL(link.href);
        }
      };
    }
  }, [worker, setIsRun]);

  const onWeightChanged = useCallback(
    (weightIndex) => (ev) => {
      setWeights((weights) => [
        ...weights.slice(0, weightIndex),
        Number(ev.target.value),
        ...weights.slice(weightIndex + 1, weights.length),
      ]);
    },
    [setWeights],
  );

  const onRunClicked = useCallback(() => {
    if (isRun) {
      worker?.postMessage({ run: false });
    } else {
      worker?.postMessage({ run: true, weights });
    }
  }, [worker, isRun, weights]);

  const onDownloadClicked = useCallback(() => {
    worker?.postMessage({ download: true });
  }, [worker]);

  const onSettingButtonClicked = useCallback(
    (type) => () => {
      if (type === 'all1') setWeights([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
      if (type === 'expect')
        setWeights([5, 5, 5, 5, 7, 7, 7, 7, 7, 7, 8, 8, 4, 9, 8, 8, 10, 10, 1]);
    },
    [setWeights],
  );

  return (
    <div className="Panel">
      <PanelHeader
        weights={weights}
        onWeightChanged={onWeightChanged}
        isRun={isRun}
        onRunClicked={onRunClicked}
        onDownloadClicked={onDownloadClicked}
        onSettingButtonClicked={onSettingButtonClicked}
      />
      <PanelBody stat={stat} />
    </div>
  );
};

Panel.propTypes = {
  defaultWeight: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default Panel;
