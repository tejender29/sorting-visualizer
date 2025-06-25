let array = [];
let delay = 50;
let swapCount = 0;
let compareCount = 0;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateArray(size = 50) {
  array = Array.from({ length: size }, () => Math.floor(Math.random() * 300) + 10);
  drawBars();
  resetStats();
  setSortName("None");
}

function drawBars() {
  const container = document.querySelector(".bars-container");
  container.innerHTML = "";
  array.forEach(value => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value}px`;
    container.appendChild(bar);
  });
}

function updateSpeed(value) {
  delay = 101 - parseInt(value);
  document.getElementById("speedValue").textContent = `${(100 - delay) / 10}x`;
}

function toggleTheme() {
  document.body.classList.toggle("light");
}

function updateStats() {
  document.getElementById("swapCount").textContent = `Swaps: ${swapCount}`;
  document.getElementById("compareCount").textContent = `Comparisons: ${compareCount}`;
}

function resetStats() {
  swapCount = 0;
  compareCount = 0;
  updateStats();
}

function setSortName(name) {
  document.getElementById("currentSort").textContent = `Currently Running: ${name}`;
}

function disableControls() {
  document.querySelectorAll("button").forEach(btn => btn.disabled = true);
}

function enableControls() {
  document.querySelectorAll("button").forEach(btn => btn.disabled = false);
}

async function bubbleSort() {
  const bars = document.querySelectorAll(".bar");
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      compareCount++;
      updateStats();
      bars[j].style.background = "red";
      bars[j + 1].style.background = "red";
      if (array[j] > array[j + 1]) {
        swapCount++;
        updateStats();
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        bars[j].style.height = `${array[j]}px`;
        bars[j + 1].style.height = `${array[j + 1]}px`;
      }
      await sleep(delay);
      bars[j].style.background = "";
      bars[j + 1].style.background = "";
    }
  }
}

async function selectionSort() {
  const bars = document.querySelectorAll(".bar");
  let n = array.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      compareCount++;
      updateStats();
      bars[j].style.background = "orange";
      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
      await sleep(delay);
      bars[j].style.background = "";
    }
    if (minIdx !== i) {
      swapCount++;
      updateStats();
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      bars[i].style.height = `${array[i]}px`;
      bars[minIdx].style.height = `${array[minIdx]}px`;
    }
    bars[i].style.background = "green";
  }
}

async function insertionSort() {
  const bars = document.querySelectorAll(".bar");
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      compareCount++;
      updateStats();
      array[j + 1] = array[j];
      bars[j + 1].style.height = `${array[j + 1]}px`;
      j--;
      await sleep(delay);
    }
    array[j + 1] = key;
    bars[j + 1].style.height = `${key}px`;
    bars[i].style.background = "green";
  }
}

async function mergeSortCaller() {
  await mergeSort(0, array.length - 1);
  drawBars();
}

async function mergeSort(left, right) {
  if (left >= right) return;

  let mid = Math.floor((left + right) / 2);
  await mergeSort(left, mid);
  await mergeSort(mid + 1, right);
  await merge(left, mid, right);
}

async function merge(l, m, r) {
  let n1 = m - l + 1;
  let n2 = r - m;

  let L = [], R = [];

  for (let i = 0; i < n1; i++) L[i] = array[l + i];
  for (let j = 0; j < n2; j++) R[j] = array[m + 1 + j];

  let i = 0, j = 0, k = l;
  while (i < n1 && j < n2) {
    compareCount++;
    updateStats();
    if (L[i] <= R[j]) {
      array[k] = L[i];
      i++;
    } else {
      array[k] = R[j];
      j++;
    }
    document.querySelectorAll(".bar")[k].style.height = `${array[k]}px`;
    await sleep(delay);
    k++;
  }

  while (i < n1) {
    array[k] = L[i];
    document.querySelectorAll(".bar")[k].style.height = `${array[k]}px`;
    i++;
    k++;
    await sleep(delay);
  }

  while (j < n2) {
    array[k] = R[j];
    document.querySelectorAll(".bar")[k].style.height = `${array[k]}px`;
    j++;
    k++;
    await sleep(delay);
  }
}

async function quickSortCaller() {
  await quickSort(0, array.length - 1);
}

async function quickSort(low, high) {
  if (low < high) {
    let pi = await partition(low, high);
    await quickSort(low, pi - 1);
    await quickSort(pi + 1, high);
  }
}

async function partition(low, high) {
  let pivot = array[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    compareCount++;
    updateStats();
    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      swapCount++;
      updateStats();
      document.querySelectorAll(".bar")[i].style.height = `${array[i]}px`;
      document.querySelectorAll(".bar")[j].style.height = `${array[j]}px`;
      await sleep(delay);
    }
  }
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  swapCount++;
  updateStats();
  document.querySelectorAll(".bar")[i + 1].style.height = `${array[i + 1]}px`;
  document.querySelectorAll(".bar")[high].style.height = `${array[high]}px`;
  await sleep(delay);
  return i + 1;
}

function startSort(type) {
  setSortName(type.charAt(0).toUpperCase() + type.slice(1) + " Sort");
  disableControls();

  switch (type) {
    case "bubble": bubbleSort().then(enableControls); break;
    case "selection": selectionSort().then(enableControls); break;
    case "insertion": insertionSort().then(enableControls); break;
    case "merge": mergeSortCaller().then(enableControls); break;
    case "quick": quickSortCaller().then(enableControls); break;
    default: enableControls(); break;
  }
}

generateArray();