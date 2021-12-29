const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".btn-generate");
const adjustBtns = document.querySelectorAll(".btn-color-slider");
const colorSliders = document.querySelectorAll(".color-sliders");
const currentHexes = document.querySelectorAll("h2");
const copyContainer = document.querySelector(".copy-container");
const copyPopup = document.querySelector(".copy-popup");
const closecolorSliders = document.querySelectorAll(".slider-close");
const lockBtns = document.querySelectorAll(".color-lock");
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
adjustBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    openColorSlider(index);
  });
});
closecolorSliders.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    CloseColorSlider(index);
  });
});
lockBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    lockTheColor(index);
  });
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
    if (div.classList.contains("locked")) {
      initialColors.push(colorHeader.innerText);
      return;
    } else {
      initialColors.push(randomColor);
    }
    div.style.backgroundColor = randomColor;
    colorHeader.innerText = randomColor;
    checkContrast(randomColor, colorHeader);
    for (icon of icons) {
      checkContrast(randomColor, icon);
    }
    const colorSliders = div.querySelectorAll(
      '.color-sliders input[type="range"]'
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
  for (const icon of icons) {
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
function openColorSlider(index) {
  colorSliders[index].classList.toggle("active");
}
function CloseColorSlider(index) {
  colorSliders[index].classList.remove("active");
}
function lockTheColor(index) {
  const activeDiv = colorDivs[index];
  activeDiv.classList.toggle("locked");
  if (activeDiv.classList.contains("locked")) {
    const i = lockBtns[index].querySelector("svg");
    i.classList.remove("fa-lock-open");
    i.classList.add("fa-lock");
  } else {
    const i = lockBtns[index].querySelector("svg");
    i.classList.remove("fa-lock");
    i.classList.add("fa-lock-open");
  }
}

// save/library popups and local storage

const saveContainer = document.querySelector(".save-container");
const libraryContainer = document.querySelector(".library-container");
const savePopup = document.querySelector(".save-popup");
const libraryPopup = document.querySelector(".library-popup");
const saveBtn = document.querySelector(".btn-save");
const libraryBtn = document.querySelector(".btn-library");
const saveSubmitBtn = document.querySelector(".save-submit");
const closeSaveBtn = document.querySelector(".close-save");
const closelibraryBtn = document.querySelector(".close-library");
const paletteName = savePopup.querySelector(".save-name");
let savedColorPalettes = [];

saveBtn.addEventListener("click", () => {
  openPopup(saveContainer);
});
libraryBtn.addEventListener("click", () => {
  openPopup(libraryContainer);
});
closeSaveBtn.addEventListener("click", () => {
  closePopUp(saveContainer);
});
closelibraryBtn.addEventListener("click", () => {
  closePopUp(libraryContainer);
});
saveSubmitBtn.addEventListener("click", saveColorPalette);
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    if (saveContainer.classList.contains("active")) {
      saveColorPalette();
    }
  }
});
function openPopup(targetElement) {
  targetElement.classList.add("active");
}
function closePopUp(targetElement) {
  targetElement.classList.remove("active");
}
function saveColorPalette() {
  const name = paletteName.value;
  const colors = [];
  currentHexes.forEach((hex) => {
    colors.push(hex.innerText);
  });
  let paletteNumber;
  const LocalPalettes = JSON.parse(localStorage.getItem("colorPalettes"));
  if (LocalPalettes) {
    paletteNumber = LocalPalettes.length;
  } else {
    paletteNumber = savedColorPalettes.length;
  }

  const colorPalette = { name, colors, nr: paletteNumber };
  savedColorPalettes.push(colorPalette);
  saveColorPaletteToLocal(colorPalette);
  closePopUp(saveContainer);
  paletteName.value = "";
  updateLibrary(colorPalette);
}
function saveColorPaletteToLocal(colorPalette) {
  let localColorPalettes;
  if (localStorage.getItem("colorPalettes") === null) {
    localColorPalettes = [];
  } else {
    localColorPalettes = JSON.parse(localStorage.getItem("colorPalettes"));
  }
  console.log(localColorPalettes);
  localColorPalettes.push(colorPalette);
  localStorage.setItem("colorPalettes", JSON.stringify(localColorPalettes));
}
function getColorPaletteFromLocal() {
  let localColorPalettes;
  if (localStorage.getItem("colorPalettes") === null) {
    localColorPalettes = [];
  } else {
    localColorPalettes = JSON.parse(localStorage.getItem("colorPalettes"));
    savedColorPalettes = [...localColorPalettes];
    localColorPalettes.forEach((colorPalette) => {
      updateLibrary(colorPalette);
    });
  }
}
getColorPaletteFromLocal();
function updateLibrary(colorPalette) {
  const customPalette = document.createElement("div");
  customPalette.classList.add("custom-palette");
  const paletteHeader = document.createElement("h4");
  paletteHeader.classList.add("palette-header");
  paletteHeader.innerText = colorPalette.name;
  const previewColors = document.createElement("div");
  previewColors.classList.add("preview-colors");
  colorPalette.colors.forEach((color) => {
    const colorDiv = document.createElement("div");
    colorDiv.classList.add("mini-color");
    colorDiv.style.backgroundColor = color;
    previewColors.appendChild(colorDiv);
  });
  const pickBtn = document.createElement("button");
  pickBtn.classList.add("pick-palette", "btn", colorPalette.nr);
  pickBtn.innerText = "select";
  pickBtn.addEventListener("click", (e) => {
    closePopUp(libraryContainer);
    const paletteIndex = e.target.classList[2];
    initialColors = [];
    savedColorPalettes[paletteIndex].colors.forEach((color, index) => {
      colorDivs[index].style.backgroundColor = color;
      initialColors.push(color);
      currentHexes[index].innerText = color;
      updateUI(index);
      const colorSliders = colorDivs[index].querySelectorAll(
        '.color-sliders input[type="range"]'
      );
      const hue = colorSliders[0];
      const brightness = colorSliders[1];
      const saturation = colorSliders[2];
      updateSlider(chroma(color), hue, brightness, saturation);
    });
    resetInputs();
  });
  customPalette.appendChild(paletteHeader);
  customPalette.appendChild(previewColors);
  customPalette.appendChild(pickBtn);

  libraryPopup.appendChild(customPalette);
}
