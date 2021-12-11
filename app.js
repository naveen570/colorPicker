const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".btn-generate");
const adjustBtns = document.querySelectorAll(".btn-color-slider");
function generateHex() {
  const hexColor = chroma.random();
  return hexColor;
}
function randomColors() {
  colorDivs.forEach((div, index) => {
    const colorHeader = div.children[0];
    const randomColor = generateHex();
    div.style.backgroundColor = randomColor;
    colorHeader.innerText = randomColor;
    checkTextContrast(randomColor, colorHeader);
    const colorSliders = div.querySelectorAll(
      '.color-sliders input[type="range"'
    );
    const color = chroma(randomColor);
    const hue = colorSliders[0];
    const brightness = colorSliders[1];
    const saturation = colorSliders[2];
    updateSlider(color, hue, brightness, saturation);
  });
}
randomColors();
generateBtn.addEventListener("click", () => {
  randomColors();
});
adjustBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const colorSliders = btn.parentElement.parentElement.children[2];
    colorSliders.classList.toggle("active");
  });
});

function checkTextContrast(color, text) {
  const luminance = chroma(color).luminance();
  if (luminance > 0.5) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}
function updateSlider(color, hue, brightness, saturation) {
  //saturation
  const noSat = color.set("hsl.s", 0);
  const fullSat = color.set("hsl.s", 1);
  const satScale = chroma.scale([noSat, color, fullSat]);
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
