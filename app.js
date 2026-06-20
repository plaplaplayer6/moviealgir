const ratingOrder = {
    "G": 0,
    "PG": 1,
    "PG-13": 2,
    "R": 3,
    "NC-17": 4
};

let movies = [];

async function loadMovies() {

    const response = await fetch("movies.json");

    movies = await response.json();
}

function allowed(movieRating, userRating) {

    return ratingOrder[movieRating]
        <= ratingOrder[userRating];
}

function calculateScore(movie) {

    let score = movie.imdb * 10;

    score += Math.log(movie.votes + 1);

    const release = new Date(movie.releaseDate);
    const now = new Date();

    const daysOld =
        (now - release) / (1000 * 60 * 60 * 24);

    if (daysOld < 180) {
        score += 25;
    }

    if (movie.inTheaters) {
        score += 40;
    }

    return score;
}

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j =
            Math.floor(Math.random() * (i + 1));

        [array[i], array[j]]
            = [array[j], array[i]];
    }

    return array;
}

function generateCalendar() {

    const ratingFilter =
        document.getElementById("ratingFilter").value;

    const recentOnly =
        document.getElementById("recentOnly").checked;

    const theatersOnly =
        document.getElementById("theatersOnly").checked;

    let filtered = movies.filter(movie => {

        if (!allowed(movie.rating, ratingFilter))
            return false;

        if (theatersOnly && !movie.inTheaters)
            return false;

        if (recentOnly) {

            const release =
                new Date(movie.releaseDate);

            const days =
                (new Date() - release)
                / (1000 * 60 * 60 * 24);

            if (days > 365)
                return false;
        }

        return true;
    });

    filtered.forEach(movie => {
        movie.score = calculateScore(movie);
    });

    filtered.sort((a, b) => b.score - a.score);

    let used = new Set();

    let schedule = [];

    while (
        schedule.length < 365 &&
        filtered.length > 0
    ) {

        const movie = filtered.shift();

        if (!used.has(movie.title)) {

            used.add(movie.title);

            schedule.push(movie);
        }
    }

    render(schedule);
}

function render(schedule) {

    const container =
        document.getElementById("movieList");

    container.innerHTML = "";

    schedule.forEach((movie, index) => {

        container.innerHTML += `
        <div class="movie-card">
            <div class="day">
                Day ${index + 1}
            </div>

            <h2>${movie.title}</h2>

            <p>Rating: ${movie.rating}</p>

            <p>IMDb: ${movie.imdb}</p>

            <p>Genre: ${movie.genre}</p>

            <p>Released: ${movie.releaseDate}</p>
        </div>
        `;
    });
}

loadMovies();
