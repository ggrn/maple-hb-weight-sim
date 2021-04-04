/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
import optionConfigs from '../config/options';

const { options, optionValues, gradeRate } = optionConfigs;

let results = [];
let newResults = [];
let tempNewResults = [];
let counts; // = options.map(() => 0);
let overs = { all: [], str: [], dex: [], int: [], luk: [] };
let isRun = false;
let maxStrScore, maxDexScore, maxIntScore, maxLukScore;

const configs = {
  weights: undefined,
  itemLevel: 160,
  atkScore: 4.0,
  allStatScore: 10.0,
  maxResultSize: 10000000,
  maxResultQueue: 10000,
  runWindow: 1000,
};

const defaultOption = options.map(() => 0);

const getWeightedArray = (weights) => {
  return weights.reduce((acc, curr, i) => {
    for (let index = 0; index < curr; index++) {
      acc.push(i);
    }
    return acc;
  }, []);
};
const weightedGrades = getWeightedArray(gradeRate);
const getOptionValueRandom = (selected) => {
  return optionValues[configs.itemLevel][selected][weightedGrades[getRandomInt(0, 100)]];
};

const getRandomOptions = () => {
  const selectedOptions = [...defaultOption];
  let weightedOptions = getWeightedArray(configs.weights);

  let left, right, selected;
  left = weightedOptions;
  right = weightedOptions;

  for (let index = 0; index < 4; index++) {
    if (left.length === 0) {
      selected = right[getRandomInt(0, right.length)];
    } else if (right.length === 0) {
      selected = left[getRandomInt(0, left.length)];
    } else {
      selected =
        getRandomInt(0, 2) === 0
          ? left[getRandomInt(0, left.length)]
          : right[getRandomInt(0, right.length)];
    }
    left = weightedOptions.slice(0, weightedOptions.indexOf(selected));
    right = weightedOptions.slice(
      weightedOptions.lastIndexOf(selected) + 1,
      weightedOptions.length,
    );
    weightedOptions = weightedOptions.filter(filterWeightedOptionBySelected(selected));
    selectedOptions[selected] = getOptionValueRandom(selected);
  }

  return selectedOptions;
};

const getRandomOptionsNew = () => {
  const selectedOptions = [...defaultOption];
  let weightedOptions = getWeightedArray(configs.weights);
  let selected;

  for (let index = 0; index < 4; index++) {
    selected = weightedOptions[getRandomInt(0, weightedOptions.length)];
    weightedOptions = weightedOptions.filter(filterWeightedOptionBySelected(selected));
    selectedOptions[selected] = getOptionValueRandom(selected);
  }

  return selectedOptions;
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const filterWeightedOptionBySelected = (selected) => (w) => w !== selected;

const run = () => {
  if (results.length >= configs.maxResultSize || !isRun) {
    console.log('worker stopped.');
    isRun = false;
    self.postMessage({ type: 'run', value: false });
    return;
  }

  if (newResults.length < configs.maxResultQueue) {
    for (let index = 0; index < configs.runWindow; index++) {
      newResults.push(getRandomOptions());
    }
  }

  setTimeout(run);
};

const runNew = () => {
  if (results.length >= configs.maxResultSize || !isRun) {
    console.log('worker stopped.');
    isRun = false;
    self.postMessage({ type: 'run', value: false });
    return;
  }

  if (newResults.length < configs.maxResultQueue) {
    for (let index = 0; index < configs.runWindow; index++) {
      newResults.push(getRandomOptionsNew());
    }
  }

  setTimeout(runNew);
};

const statAndPublishResults = () => {
  if (!isRun) {
    return;
  }
  tempNewResults = [...newResults].slice(0, configs.maxResultSize - results.length);
  newResults = [];
  const stats = getStats(tempNewResults);
  self.postMessage({ type: 'stat', value: stats });
  tempNewResults.forEach(pushToResults(results));
  if (isRun) {
    setTimeout(statAndPublishResults, 100);
  }
};

const getStats = (tempNewResults) => {
  let tempMaxStrScore = 0;
  let tempMaxDexScore = 0;
  let tempMaxIntScore = 0;
  let tempMaxLukScore = 0;
  let strScore, dexScore, intScore, lukScore, resultMaxScore;
  let tempOvers = {
    all: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    str: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    dex: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    int: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    luk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  };

  tempNewResults.forEach((r) => {
    r.forEach((optionValue, i) => {
      if (optionValue > 0) counts[i]++;
    });
    strScore = r[0] + r[4] + r[5] + r[6] + r[14] * configs.atkScore + r[18] * configs.allStatScore;
    tempMaxStrScore = strScore > tempMaxStrScore ? strScore : tempMaxStrScore;
    tempOvers.str.forEach((_, i, arr) => {
      if (strScore >= i * 10 + 70) {
        arr[i]++;
      }
    });

    dexScore = r[1] + r[4] + r[7] + r[8] + r[14] * configs.atkScore + r[18] * configs.allStatScore;
    tempMaxDexScore = dexScore > tempMaxDexScore ? dexScore : tempMaxDexScore;
    tempOvers.dex.forEach((_, i, arr) => {
      if (dexScore >= i * 10 + 70) {
        arr[i]++;
      }
    });

    intScore = r[2] + r[5] + r[7] + r[9] + r[15] * configs.atkScore + r[18] * configs.allStatScore;
    tempMaxIntScore = intScore > tempMaxIntScore ? intScore : tempMaxIntScore;
    tempOvers.int.forEach((_, i, arr) => {
      if (intScore >= i * 10 + 70) {
        arr[i]++;
      }
    });

    lukScore = r[3] + r[6] + r[8] + r[9] + r[14] * configs.atkScore + r[18] * configs.allStatScore;
    tempMaxLukScore = lukScore > tempMaxLukScore ? lukScore : tempMaxLukScore;
    tempOvers.luk.forEach((_, i, arr) => {
      if (lukScore >= i * 10 + 70) {
        arr[i]++;
      }
    });

    resultMaxScore = Math.max(strScore, dexScore, intScore, lukScore);
    tempOvers.all.forEach((_, i, arr) => {
      if (resultMaxScore >= i * 10 + 70) {
        arr[i]++;
      }
    });
  });
  Object.keys(tempOvers).forEach((key) => {
    tempOvers[key].forEach((ov, i) => {
      overs[key][i] += ov;
    });
  });

  maxStrScore = tempMaxStrScore > maxStrScore ? tempMaxStrScore : maxStrScore;
  maxDexScore = tempMaxDexScore > maxDexScore ? tempMaxDexScore : maxDexScore;
  maxIntScore = tempMaxIntScore > maxIntScore ? tempMaxIntScore : maxIntScore;
  maxLukScore = tempMaxLukScore > maxLukScore ? tempMaxLukScore : maxLukScore;

  return {
    run: results.length + tempNewResults.length,
    maxScore: Math.max(maxStrScore, maxDexScore, maxIntScore, maxLukScore),
    maxStrScore,
    maxDexScore,
    maxIntScore,
    maxLukScore,
    overs,
    counts,
  };
};

const pushToResults = (ress) => (res) => ress.push(res);

const getCsv = (results) => {
  if (results.length === 0) return '';

  return options.join(',') + '\n' + results.map((r) => Object.values(r).join(',')).join('\n');
};

const setConfigs = (evData = {}) => {
  if (evData.weights) {
    configs.weights = evData.weights;
  }
  ['itemLevel', 'atkScore', 'allStatScore', 'maxResultSize', 'maxResultQueue', 'runWindow'].forEach(
    (key) => {
      ((pred) => !isNaN(pred) && (configs[key] = pred))(parseFloat(evData[key]));
    },
  );
};

self.addEventListener('message', (ev) => {
  if (ev.data.run === true && ev.data.weights) {
    console.log('worker running.');
    setConfigs(ev.data);

    isRun = true;
    results = [];
    counts = options.map(() => 0);

    console.log(configs);

    overs = Object.keys(overs).reduce(
      (acc, key) => ({ ...acc, [key]: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }),
      {},
    );

    maxStrScore = Number.MIN_SAFE_INTEGER;
    maxDexScore = Number.MIN_SAFE_INTEGER;
    maxIntScore = Number.MIN_SAFE_INTEGER;
    maxLukScore = Number.MIN_SAFE_INTEGER;

    !ev.data.isNewLogic ? run() : runNew();
    statAndPublishResults();

    self.postMessage({ type: 'run', value: true });
  } else if (ev.data.run === false) {
    isRun = false;
    self.postMessage({ type: 'run', value: false });
  } else if (ev.data.download === true) {
    const csvBlob = new Blob([getCsv(results)], { type: 'application/csv;charset=utf-8;' });
    self.postMessage({ type: 'download', link: URL.createObjectURL(csvBlob) });
  }
});
