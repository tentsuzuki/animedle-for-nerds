const guessInput = document.getElementById("guess");
const guessButton = document.getElementById("button");
const result = document.getElementById("result");
const animeImage = document.getElementById("image");
const continueButton = document.getElementById("continue");
document.getElementById("correcttable").style.display = "none";

let animeTitle = "";
let animeType = "";
let animeImageUrl = "";
let attempts = 0;
const maxAttempts = 5;
let score = 0;

const scoreboard = document.getElementById("scoreboard");
updateScoreboard();

function updateScoreboard() {
  scoreboard.textContent = `Score: ${score}`;
}

guessButton.addEventListener("click", checkGuess);

function checkGuess() {
  const guess = guessInput.value.trim().toLowerCase();
  guessInput.value = "";

  const correctAnswers = [animeTitle];

  if (correctAnswers.some(answer => answer.toLowerCase() === guess)) {
    result.textContent = "go outside, please.";
    guessButton.disabled = true;
    score++;
    updateScoreboard();
    continueButton.disabled = false;
    document.getElementById("correcttable").style.display = "block";
  } else {
    attempts++;
    if (attempts >= maxAttempts) {
      result.textContent = `wow, you're bad. title: ${animeTitle}`;
      guessButton.disabled = true;
      continueButton.disabled = false;
      fetchAnimeVariables(guess);
      document.getElementById("correcttable").style.display = "block";
    } else {
      result.textContent = `guess harder: attempt ${attempts}/${maxAttempts}`;
      fetchAnimeVariables(guess);
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
      const fetchedType = anime.type;
      const fetchedSeason = anime.season;
      const fetchedYear = anime.year;
      const fetchedScore = anime.score;
      const fetchedStudios = anime.studios.map((studio) => studio.name) || [];
      const fetchedGenres = anime.genres.map((genre) => genre.name) || [];
      const fetchedStatus = anime.status;

      const valuesToCheck = [animeRating, fetchedTitle, , fetchedType, fetchedSeason, fetchedYear, fetchedScore, ...fetchedStudios, ...fetchedGenres, ...fetchedStatus];

      if (valuesToCheck.some((value) => value === null || value === undefined)) {
        setTimeout(fetchRandomAnime, 500);
      } else {
        animeTitle = fetchedTitle;
        animeImageUrl = anime.images.jpg.image_url;
        animeSeason = fetchedSeason;
        animeYear = fetchedYear;
        animeScore = fetchedScore;
        animeStudio = fetchedStudios;
        animeGenre = fetchedGenres;
        animeStatus = fetchedStatus;
        animeType = fetchedType;
        updateAnimeImage();

      }

      const tableBody = document.querySelector("#correcttable tbody");
      tableBody.innerHTML = "";

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${animeTitle}</td>
        <td>${animeType}</td>
        <td>${animeRating}</td>
        <td>${fetchedSeason}</td>
        <td>${fetchedYear}</td>
        <td>${fetchedScore}</td>
        <td>${fetchedStudios.join(", ")}</td>
        <td>${fetchedGenres.join(", ")}</td>
        <td>${fetchedStatus}</td>
      `;

      tableBody.appendChild(row);

      continueButton.addEventListener("click", handleContinue);
      continueButton.disabled = true;
    })
    .catch((error) => {
      console.log(error);
      result.textContent = "api fucked up.";
    });
}

function updateAnimeImage() {
  animeImage.src = animeImageUrl;
}

function handleContinue() {
  result.textContent = "";
  guessButton.disabled = false;
  attempts = 0;
  continueButton.removeEventListener("click", handleContinue);
  continueButton.disabled = true;
  document.getElementById("correcttable").style.display = "none";
  const tableBodyGuess = document.querySelector("#guesstable tbody");
  tableBodyGuess.innerHTML = "";
  fetchRandomAnime();
}

fetch('titles.xml')
  .then((response) => response.text())
  .then((xmlString) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const items = xmlDoc.getElementsByTagName('item');

    const allEntries = [];

    for (let i = 0; i < items.length; i++) {
      const name = items[i].getElementsByTagName('name')[0].textContent;
      allEntries.push(name);
    }

    autocomplete(guessInput, allEntries);
  })
  .catch((error) => {
    console.log(error);
    result.textContent = 'autocomplete fucked up';
  });

function fetchAnimeVariables(guess) {
  const encodedGuess = encodeURIComponent(guess);
  console.log(`https://api.jikan.moe/v4/anime?q=${encodedGuess}`);
  fetch(`https://api.jikan.moe/v4/anime?q=${encodedGuess}`)
    .then((response) => response.json())
    .then((data) => {
      const anime = data.data[0];
      if (!anime) {
        throw new Error("No anime found.");
      }

      const animeRating = anime.rating || "n/a";
      const fetchedTitle = anime.title || "n/a";
      const fetchedType = anime.type || "n/a";
      const fetchedSeason = anime.season || "n/a";
      const fetchedYear = anime.year || "n/a";
      const fetchedScore = anime.score || "n/a";
      const fetchedStudios = anime.studios ? anime.studios.map((studio) => studio.name) : [];
      const fetchedGenres = anime.genres ? anime.genres.map((genre) => genre.name) : [];
      const fetchedStatus = anime.status || "n/a";

      const tableBody = document.querySelector("#guesstable tbody");
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${fetchedTitle}</td>
          <td>${fetchedType}</td>
          <td>${animeRating}</td>
          <td>${fetchedSeason}</td>
          <td>${fetchedYear}</td>
          <td>${fetchedScore}</td>
          <td>${fetchedStudios.join(", ")}</td>
          <td>${fetchedGenres.join(", ")}</td>
          <td>${fetchedStatus}</td>
          `;
      tableBody.appendChild(row);
    })
    .catch((error) => {
      console.log(error);
      result.textContent = "API failed.";
    });
}