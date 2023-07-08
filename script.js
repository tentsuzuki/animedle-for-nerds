const guessInput = document.getElementById("guess");
const guessButton = document.getElementById("button");
const result = document.getElementById("result");
const animeImage = document.getElementById("image");

let animeTitle = "";
let animeSynonyms = "";
let animeImageUrl = "";
let attempts = 0;
const maxAttempts = 5;

guessButton.addEventListener("click", checkGuess);

function checkGuess() {
  const guess = guessInput.value.trim().toLowerCase();
  guessInput.value = "";

  const correctAnswers = [animeTitle, ...animeSynonyms];

  if (correctAnswers.some(answer => answer.toLowerCase() === guess)) {
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
fetchRandomAnime();

function fetchRandomAnime() {
  fetch('https://api.jikan.moe/v4/random/anime')
    .then((response) => response.json())
    .then((data) => {
      const anime = data.data;
      const animeRating = anime.rating;
      const fetchedTitle = anime.title;
      const fetchedSynonyms = anime.title_synonyms || [];
      const fetchedSeason = anime.season;
      const fetchedYear = anime.year;
      const fetchedScore = anime.score;
      const fetchedStudios = anime.studios.map((studio) => studio.name) || [];
      const fetchedGenres = anime.genres.map((genre) => genre.name) || [];

      const valuesToCheck = [animeRating, fetchedTitle, ...fetchedSynonyms, fetchedSeason, fetchedYear, fetchedScore, ...fetchedStudios, ...fetchedGenres];

      if (valuesToCheck.some((value) => value === null || value === undefined)) {
        console.log('Re-requesting anime');
        setTimeout(fetchRandomAnime, 500);
      } else {
        animeTitle = fetchedTitle;
        animeImageUrl = anime.images.jpg.image_url;
        animeSynonyms = fetchedSynonyms;
        animeSeason = fetchedSeason;
        animeYear = fetchedYear;
        animeScore = fetchedScore;
        animeStudio = fetchedStudios;
        animeGenre = fetchedGenres;
        updateAnimeImage();
      }
    })
    .catch((error) => {
      console.log(error);
      result.textContent = "Something went wrong.";
    });
}

function updateAnimeImage() {
  animeImage.src = animeImageUrl;
}

fetch('anime.json')
  .then((response) => response.json())
  .then((data) => {
    const database = data.data;

    const allEntries = [];

    database.forEach((entry) => {
      const { title, synonyms } = entry;

      allEntries.push(title);
      synonyms.forEach((synonym) => allEntries.push(synonym));
    });

    autocomplete(guessInput, allEntries);
  })
  .catch((error) => {
    console.log(error);
    result.textContent = "Something went wrong.";
  });

function autocomplete(input, data) {
  let currentFocus;

  input.addEventListener("input", function () {
    const value = this.value;
    closeAllLists();

    if (!value) {
      return false;
    }

    currentFocus = -1;

    const dropdown = document.createElement("div");
    dropdown.setAttribute("id", this.id + "autocomplete-list");
    dropdown.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(dropdown);

    const matchingEntries = data.filter((entry) =>
      entry.toLowerCase().includes(value.toLowerCase())
    );

    matchingEntries.forEach((entry) => {
      const dropdownItem = document.createElement("div");
      dropdownItem.innerHTML = "<strong>" + entry.substr(0, value.length) + "</strong>";
      dropdownItem.innerHTML += entry.substr(value.length);
      dropdownItem.addEventListener("click", function () {
        input.value = entry;
        closeAllLists();
      });
      dropdown.appendChild(dropdownItem);
    });
  });

  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });

  function closeAllLists(element) {
    const dropdowns = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < dropdowns.length; i++) {
      if (element !== dropdowns[i] && element !== input) {
        dropdowns[i].parentNode.removeChild(dropdowns[i]);
      }
    }
  }
}