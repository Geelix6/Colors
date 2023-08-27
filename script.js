const columns = document.querySelectorAll(".col");

function setRandomColor(isInitial) {
  const colors = isInitial ? getColorsFromHash() : [];

  columns.forEach((column, index) => {
    let color;

    if (isInitial) {
      if (!colors[index]) {
        color = chroma.random();
      } else if (!(colors[index].length == 7) || !colors[index].match(/[0-9a-f]{6}/i)) {
        alert(`Значение ${colors[index]} не является валидным, в колонке будет создан случайный цвет`);
        color = chroma.random();
      } else {
        color = colors[index];
      }
    } else {
      color = chroma.random();
    }

    const text = column.querySelector("h2");
    const button = column.querySelector("button");
    const isLocked = column.querySelector("i").classList.contains("fa-lock");

    if (isLocked) {
      colors.push(text.textContent);
      return;
    }
    if (!isInitial) {
      colors.push(color);
    }

    column.style.backgroundColor = color;
    text.textContent = color;

    setTextColor(text, color);
    setTextColor(button, color);
  });

  updateColorsHash(colors);
}
setRandomColor((isInitial = true));

function setTextColor(text, color) {
  const luminance = chroma(color).luminance();
  text.style.color = luminance < 0.5 ? "white" : "black";
}

function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}

function updateColorsHash(colors) {
  location.hash = colors
    .map((color) => {
      return color.toString().substring(1);
    })
    .join("-");
}

function getColorsFromHash() {
  if (location.hash.length > 1) {
    return location.hash
      .substring(1)
      .split("-")
      .map((color) => "#" + color);
  }
  return [];
}

document.addEventListener("keydown", (event) => {
  event.preventDefault();
  if (event.code == "Space") {
    setRandomColor();
  }
});

document.addEventListener("click", (event) => {
  const type = event.target.dataset.type;
  if (type === "lock" || event.target.closest("button")) {
    const icon = event.target.tagName === "I" ? event.target : event.target.children[0];
    icon.classList.toggle("fa-lock");
    icon.classList.toggle("fa-lock-open");
  } else if (type === "copy") {
    copyToClipboard(event.target.textContent);
  }
});
