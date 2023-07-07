const guessInput = document.getElementById("guess");
const guessButton = document.getElementById("button");
const result = document.getElementById("result");
const animeImage = document.getElementById("image");
const dropdown = document.getElementById("dropdown");

let animeTitle = "";
let animeImageUrl = "";
let attempts = 0;
const maxAttempts = 5;
const animeData = [];

guessButton.addEventListener("click", checkGuess);
guessInput.addEventListener("input", showDropdown);

function checkGuess() {
  const guess = guessInput.value.trim().toLowerCase();
  guessInput.value = "";

  if (guess === animeTitle) {
    result.textContent = "go outside, please.";
    guessButton.disabled = true;
  } else {
    attempts++;
    if (attempts >= maxAttempts) {
      result.textContent = `wow, you're bad. the title is: ${animeTitle}`;
      guessButton.disabled = true;
    } else {
      result.textContent = `guess harder: attempt ${attempts}/${maxAttempts}`;
    }
  }
}

function showDropdown() {
  const searchText = guessInput.value.trim().toLowerCase();
  const matchingTitles = animeData.filter((title) =>
    title.toLowerCase().startsWith(searchText)
  );

  if (searchText === "") {
    dropdown.innerHTML = "";
    dropdown.classList.remove("show");
  } else {
    const dropdownItems = matchingTitles
      .map(
        (title) =>
          `<div class="dropdown-item">${title}</div>`
      )
      .join("");
    dropdown.innerHTML = dropdownItems;
    dropdown.classList.add("show");
  }
}

dropdown.addEventListener("click", (event) => {
  const selectedTitle = event.target.textContent;
  guessInput.value = selectedTitle;
  dropdown.innerHTML = "";
  dropdown.classList.remove("show");
});

fetch("anime.json")
  .then((response) => response.json())
  .then((data) => {
    animeData.push(...data.data.map((anime) => anime.title));
    let randomAnime = getRandomAnime(data.data);

    animeTitle = randomAnime.title;
    animeImageUrl = randomAnime.picture;
    updateAnimeImage();
  })
  .catch((error) => {
    console.log(error);
    result.textContent = "Something went wrong.";
  });

function updateAnimeImage() {
  animeImage.src = animeImageUrl;
}

function getRandomAnime(animeData) {
  const randomIndex = Math.floor(Math.random() * animeData.length);
  return animeData[randomIndex];
}
