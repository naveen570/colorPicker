const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".btn-generate");
const adjustBtns = document.querySelectorAll(".btn-color-slider");
const colorSliders = document.querySelectorAll(".color-sliders");
const currentHexes = document.querySelectorAll("h2");
const copyContainer = document.querySelector(".copy-container");
const copyPopup = document.querySelector(".copy-popup");
let initialColors;
//Event Listeners
generateBtn.addEventListener("click", () => {
  randomColors();
});
colorSliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});
colorDivs.forEach((div, index) => {
  div.addEventListener("change", () => {
    updateUI(index);
  });
});
currentHexes.forEach((hex) => {
  hex.addEventListener("click", () => {
    copyClip(hex);
  });
});
copyPopup.addEventListener("transitionend", () => {
  copyContainer.classList.remove("active");
});
//functions
function generateHex() {
  const hexColor = chroma.random();
  return hexColor;
}
function randomColors() {
  initialColors = [];
  colorDivs.forEach((div, index) => {
    const colorHeader = div.children[0];
    const icons = div.querySelectorAll(".controls button");

    const randomColor = generateHex();
    initialColors.push(randomColor);
    div.style.backgroundColor = randomColor;
    colorHeader.innerText = randomColor;
    checkContrast(randomColor, colorHeader);
    for (icon of icons) {
      checkContrast(randomColor, icon);
    }
    const colorSliders = div.querySelectorAll(
      '.color-sliders input[type="range"'
    );
    const color = chroma(randomColor);
    const hue = colorSliders[0];
    const brightness = colorSliders[1];
    const saturation = colorSliders[2];
    updateSlider(color, hue, brightness, saturation);
  });
  resetInputs();
}
randomColors();

adjustBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const colorSliders = btn.parentElement.parentElement.children[2];
    colorSliders.classList.toggle("active");
  });
});

function checkContrast(color, target) {
  const luminance = chroma(color).luminance();
  if (luminance > 0.5) {
    target.style.color = "black";
  } else {
    target.style.color = "white";
  }
}

function updateSlider(color, hue, brightness, saturation) {
  //saturation
  const noSat = color.set("hsl.s", 0);
  const fullSat = color.set("hsl.s", 1);
  const satScale = chroma.scale([noSat, color, fullSat]);
  //brigtness
  const midBrightness = color.set("hsl.l", 0.5);
  const brightnessScale = chroma.scale(["black", midBrightness, "white"]);

  saturation.style.backgroundImage = `linear-gradient(to right,${satScale(
    0
  )},${satScale(1)})`;
  brightness.style.backgroundImage = `linear-gradient(to right,${brightnessScale(
    0
  )},${brightnessScale(0.5)},${brightnessScale(1)})`;
  hue.style.backgroundImage = `linear-gradient(to right,rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
}

function hslControls(e) {
  const index =
    e.target.dataset.hue || e.target.dataset.bright || e.target.dataset.sat;
  const sliders =
    e.target.parentElement.parentElement.querySelectorAll('input[type="range"');
  const hue = sliders[0];
  const brightness = sliders[1];
  const sat = sliders[2];
  const currentColorPanel = colorDivs[index];
  const bgColor = initialColors[index];
  const color = chroma(bgColor)
    .set("hsl.h", hue.value)
    .set("hsl.s", sat.value)
    .set("hsl.l", brightness.value);
  currentColorPanel.style.backgroundColor = color;
  updateSlider(color, hue, brightness, sat);
}
function updateUI(index) {
  const activeDiv = colorDivs[index];
  const color = chroma(activeDiv.style.backgroundColor);
  const hexText = activeDiv.querySelector("h2");
  const icons = activeDiv.querySelectorAll(".controls button");
  hexText.innerText = color.hex();
  checkContrast(color, hexText);
  for (icon of icons) {
    checkContrast(color, icon);
  }
}
function resetInputs() {
  const sliders = document.querySelectorAll(".color-sliders input");
  sliders.forEach((slider) => {
    if (slider.name === "hue-input") {
      const currentColor = initialColors[slider.dataset.hue];
      const hueValue = chroma(currentColor).hsl()[0];
      slider.value = Math.floor(hueValue);
    }
    if (slider.name === "brightness-input") {
      const currentColor = initialColors[slider.dataset.bright];
      const brightValue = chroma(currentColor).hsl()[2];
      slider.value = Math.floor(brightValue * 100) / 100;
    }
    if (slider.name === "saturation-input") {
      const currentColor = initialColors[slider.dataset.sat];
      const satValue = chroma(currentColor).hsl()[1];
      slider.value = Math.floor(satValue * 100) / 100;
    }
  });
}
function copyClip(hex) {
  const el = document.createElement("textarea");
  el.value = hex.innerText;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  copyContainer.classList.add("active");
  document.body.removeChild(el);
}
