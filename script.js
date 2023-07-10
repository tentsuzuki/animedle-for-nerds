const guessInput = document.getElementById("guess");
const guessButton = document.getElementById("button");
const result = document.getElementById("result");
const animeImage = document.getElementById("image");
const continueButton = document.getElementById("continue");
document.getElementById("correcttable").style.display = "none";

let animeTitle = "";
let animeType = "";
let animeImageUrl = "";
let animeRating = "";
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
      const fetchedRating = anime.rating;
      const fetchedTitle = anime.title;
      const fetchedType = anime.type;
      const fetchedSeason = anime.season;
      const fetchedYear = anime.year;
      const fetchedScore = anime.score;
      const fetchedStudios = anime.studios.map((studio) => studio.name) || [];
      const fetchedGenres = anime.genres.map((genre) => genre.name) || [];
      const fetchedStatus = anime.status;

      const valuesToCheck = [fetchedRating, fetchedTitle, , fetchedType, fetchedSeason, fetchedYear, fetchedScore, ...fetchedStudios, ...fetchedGenres, ...fetchedStatus];

      if (valuesToCheck.some((value) => value === null || value === undefined)) {
        setTimeout(fetchRandomAnime, 500);
      } else {
        animeRating = fetchedRating;
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

        const tableBody = document.querySelector("#correcttable tbody");

        const newRow = document.createElement("tr");
        newRow.innerHTML = `
          <td>${animeTitle}</td>
          <td>${animeType}</td>
          <td>${animeRating}</td>
          <td>${animeSeason}</td>
          <td>${animeYear}</td>
          <td>${animeScore}</td>
          <td>${animeStudio.join(', ')}</td>
          <td>${animeGenre.join(', ')}</td>
          <td>${animeStatus}</td>
        `;

        tableBody.appendChild(newRow);
      }
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

function fetchAnimeVariables(guess) {
  const encodedGuess = encodeURIComponent(guess);
  console.log(`https://api.jikan.moe/v4/anime?q=${encodedGuess}`);
  fetch(`https://api.jikan.moe/v4/anime?q=${encodedGuess}`)
    .then((response) => response.json())
    .then((data) => {
      const guessanime = data.data[0];
      if (!guessanime) {
        throw new Error("No anime found.");
      }

      const guessRating = guessanime.rating || "n/a";
      const guessTitle = guessanime.title || "n/a";
      const guessType = guessanime.type || "n/a";
      const guessSeason = guessanime.season || "n/a";
      const guessYear = guessanime.year || "n/a";
      const guessScore = guessanime.score || "n/a";
      const guessStudios = guessanime.studios ? guessanime.studios.map((studio) => studio.name) : [];
      const guessGenres = guessanime.genres ? guessanime.genres.map((genre) => genre.name) : [];
      const guessStatus = guessanime.status || "n/a";

      const tableBody = document.querySelector("#guesstable tbody");
      const row = document.createElement("tr");

      const titleMatchClass = guessTitle === animeTitle ? "match" : "no-match";
      const typeMatchClass = guessType === animeType ? "match" : "no-match";
      const ratingMatchClass = guessRating && guessRating.toLowerCase() === animeRating && animeRating.toLowerCase() ? "match" : "no-match";
      const seasonMatchClass = guessSeason === animeSeason ? "match" : "no-match";
      const studiosMatchClass = guessStudios.some((studio) => animeStudio.includes(studio)) ? "partial-match" : "no-match";
      const genresMatchClass = guessGenres.some((genre) => animeGenre.includes(genre)) ? "partial-match" : "no-match";
      const statusMatchClass = guessStatus === animeStatus ? "match" : "no-match";
      const yearArrowClass = guessYear < animeYear ? "down-arrow" : guessYear > animeYear ? "up-arrow" : "match";
      const scoreArrowClass = parseFloat(guessScore) < parseFloat(animeScore) ? "down-arrow" : parseFloat(guessScore) > parseFloat(animeScore) ? "up-arrow" : "match";
      console.log(scoreArrowClass);

      row.innerHTML = `
      <td class="${titleMatchClass}">${guessTitle}</td>
      <td class="${typeMatchClass}">${guessType}</td>
      <td class="${ratingMatchClass}">${guessRating}</td>
      <td class="${seasonMatchClass}">${guessSeason}</td>
      <td class="year-cell ${yearArrowClass}">${guessYear}</td>
      <td class="score-cell ${scoreArrowClass}">${guessScore}</td>
      <td class="${studiosMatchClass}">${guessStudios.join(", ")}</td>
      <td class="${genresMatchClass}">${guessGenres.join(", ")}</td>
      <td class="${statusMatchClass}">${guessStatus}</td>
      `;

      const cells = row.querySelectorAll("td");
      cells.forEach((cell) => {
        const isMatch = cell.classList.contains("match");
        const isPartialMatch = cell.classList.contains("partial-match");
        if (isMatch) {
          cell.style.backgroundColor = "green";
        } else if (isPartialMatch) {
          cell.style.backgroundColor = "orange";
        } else {
          cell.style.backgroundColor = "red";
        }
        if (cell.innerText === "n/a" || cell.innerText === "") {
          cell.style.backgroundColor = "black";
        }
      });

      const yearCell = row.querySelector(".up-arrow, .down-arrow");
      if (yearCell) {
        yearCell.style.backgroundImage = `url("./images/downarrow.png")`;
        if (yearArrowClass === "down-arrow") {
          yearCell.style.backgroundImage = `url("./images/uparrow.png")`;
        }
      }

      const scoreCell = row.querySelector(".score-cell");
      if (scoreCell) {
        scoreCell.style.backgroundImage = `url("./images/downarrow.png")`;
        if (scoreArrowClass === "down-arrow") {
          scoreCell.style.backgroundImage = `url("./images/uparrow.png")`;
        }
      }


      tableBody.appendChild(row);
    })
    .catch((error) => {
      console.log(error);
      result.textContent = "API failed.";
    });
}