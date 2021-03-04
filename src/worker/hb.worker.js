/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
import optionConfigs from '../config/options';

const { options, optionValues, gradeRate } = optionConfigs;

const MAX_RESULT_SIZE = 10000000;
const MAX_RESULT_QUEUE = 10000;
const RUN_WINDOW = 1000;
const ATK_SCORE = 4;
const ALL_SCORE = 10;

let results = [];
let newResults = [];
let tempNewResults = [];
let counts; // = options.map(() => 0);
let overs;
let isRun = false;
let maxStrScore, maxDexScore, maxIntScore, maxLukScore;
let weights;
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
  return optionValues[selected][weightedGrades[getRandomInt(0, 100)]];
};

const getRandomOptions = () => {
  const selectedOptions = [...defaultOption];
  let weightedOptions = getWeightedArray(weights);

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
    if (selected === undefined) debugger;
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

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const filterWeightedOptionBySelected = (selected) => (w) => w !== selected;

const run = () => {
  if (results.length >= MAX_RESULT_SIZE || !isRun) {
    console.log('worker stopped.');
    isRun = false;
    self.postMessage({ type: 'run', value: false });
    return;
  }

  if (newResults.length < MAX_RESULT_QUEUE) {
    for (let index = 0; index < RUN_WINDOW; index++) {
      newResults.push(getRandomOptions());
    }
  }

  setTimeout(run);
};

const statAndPublishResults = () => {
  if (!isRun) {
    return;
  }
  tempNewResults = [...newResults].slice(0, MAX_RESULT_SIZE - results.length);
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
  let tempOvers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  tempNewResults.forEach((r) => {
    r.forEach((optionValue, i) => {
      if (optionValue > 0) counts[i]++;
    });
    strScore = r[0] + r[4] + r[5] + r[6] + r[14] * ATK_SCORE + r[18] * ALL_SCORE;
    tempMaxStrScore = strScore > tempMaxStrScore ? strScore : tempMaxStrScore;
    dexScore = r[1] + r[4] + r[7] + r[8] + r[14] * ATK_SCORE + r[18] * ALL_SCORE;
    tempMaxDexScore = dexScore > tempMaxDexScore ? dexScore : tempMaxDexScore;
    intScore = r[2] + r[5] + r[7] + r[9] + r[15] * ATK_SCORE + r[18] * ALL_SCORE;
    tempMaxIntScore = intScore > tempMaxIntScore ? intScore : tempMaxIntScore;
    lukScore = r[3] + r[6] + r[8] + r[9] + r[14] * ATK_SCORE + r[18] * ALL_SCORE;
    tempMaxLukScore = lukScore > tempMaxLukScore ? lukScore : tempMaxLukScore;

    resultMaxScore = Math.max(strScore, dexScore, intScore, lukScore);
    tempOvers.forEach((_, i, arr) => {
      if (resultMaxScore >= i * 10 + 70) {
        arr[i]++;
      }
    });
  });
  tempOvers.forEach((ov, i) => {
    overs[i] += ov;
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
    over70: overs[0],
    over80: overs[1],
    over90: overs[2],
    over100: overs[3],
    over110: overs[4],
    over120: overs[5],
    over130: overs[6],
    over140: overs[7],
    over150: overs[8],
    over160: overs[9],
    over170: overs[10],
    over180: overs[11],
    counts,
  };
};

const pushToResults = (ress) => (res) => ress.push(res);

const getCsv = (results) => {
  if (results.length === 0) return '';

  return options.join(',') + '\n' + results.map((r) => Object.values(r).join(',')).join('\n');
};

self.addEventListener('message', (ev) => {
  if (ev.data.run === true && ev.data.weights) {
    console.log('worker running.');
    isRun = true;
    weights = ev.data.weights;
    results = [];
    counts = options.map(() => 0);
    overs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    maxStrScore = Number.MIN_SAFE_INTEGER;
    maxDexScore = Number.MIN_SAFE_INTEGER;
    maxIntScore = Number.MIN_SAFE_INTEGER;
    maxLukScore = Number.MIN_SAFE_INTEGER;
    run();
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
