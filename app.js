const moviesGridElement = document.querySelector(".movies-grid");
const resultsInfoElement = document.querySelector(".resultsInfo");
const searchInputElement = document.querySelector("#searchInput");
const moviesWrapperElement = document.querySelector(".movies__wrapper");

function moviesHTML(movie) {
  return `<div class="movie-card">
          <img
            class="movie-card__img"
            src="${movie.Poster !== "N/A" ? movie.Poster : "./assets/img-missing.png"}" 
            alt=""
            onerror="this.onerror = null; this.src = './assets/img-missing.png'"
          />
          <h2 class="movie-card__title">${movie.Title}</h2>
          <p class="movie-card__year">${movie.Year}</p>
        </div>`;
}

let moviesData;

async function renderMovies(search, filter) {
  moviesWrapperElement.classList += " loading";
  const movies = await fetch(
    `http://www.omdbapi.com/?apikey=f473479b&s=${search}`,
  );
  moviesData = await movies.json();
  moviesWrapperElement.classList.remove("loading");
  if (!moviesData.Search) {
    moviesGridElement.innerHTML = noResultsHTML(search);
    return;
  }

  if (filter === "a-z") {
    moviesData.Search.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (filter === "z-a") {
    moviesData.Search.sort((a, b) => b.Title.localeCompare(a.Title));
  } else if (filter === "newest") {
    moviesData.Search.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
  } else if (filter === "oldest") {
    moviesData.Search.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  }

  moviesGridElement.innerHTML = moviesData.Search.map((movie) =>
    moviesHTML(movie),
  ).join("");
  console.log(moviesData);
}

renderMovies("Marvel", "a-z");

let activeSearch = "marvel";

function onSearch(event) {
  event.preventDefault();
  activeSearch = searchInputElement.value;
  renderSearch(activeSearch);
  renderMovies(activeSearch);
}

function renderSearch(search) {
  resultsInfoElement.innerHTML = displaySearchHTML(search);
}

function displaySearchHTML(search) {
  return `<span>Showing: </span>${search}`;
}

function onSort(event) {
  const filter = event.target.value;
  renderMovies(activeSearch, filter);
  console.log(filter);
}

function noResultsHTML(search) {
  return `<div class="no-results">
            <h2 class="no-results__title">No matches found</h2>
            <p class="no-results__para">
              no matches for "<span>${search}</span>". 
            </p>
          </div>`;
}
