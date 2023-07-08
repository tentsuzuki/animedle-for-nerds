const guessInput = document.getElementById("guess");
const guessButton = document.getElementById("button");
const result = document.getElementById("result");
const animeImage = document.getElementById("image");

let animeTitle = "";
let animeImageUrl = "";
let attempts = 0;
const maxAttempts = 5;

guessButton.addEventListener("click", checkGuess);

function checkGuess() {
  const guess = guessInput.value.trim().toLowerCase();
  guessInput.value = "";

  if (guess === animeTitle) {
    result.textContent = "go outside, please.";
    guessButton.disabled = true;
  } else {
    attempts++;
    if (attempts >= maxAttempts) {
      result.textContent = `wow, you're bad. title: ${animeTitle}`;
      guessButton.disabled = true;
    } else {
      result.textContent = `guess harder: attempt ${attempts}/${maxAttempts}`;
    }
  }
}

fetch('https://api.jikan.moe/v4/random/anime?sfw')
  .then((response) => response.json())
  .then((data) => {
    const anime = data.data;
    animeTitle = anime.title;
    animeImageUrl = anime.images.jpg.image_url;
    updateAnimeImage();
  })
  .catch((error) => {
    console.log(error);
    result.textContent = "Something went wrong.";
  });

function updateAnimeImage() {
  animeImage.src = animeImageUrl;
}