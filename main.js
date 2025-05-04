const apiKey = 'a8c6d363b9f3a2700f7952274feb5b1e';
const baseUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500'
const language = 'ko-KR';

const movieList = document.getElementById('movie-list');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.querySelector('.close-btn');
const title = document.getElementById('title');
const searchTitle = document.getElementById('search-title');
const homeBtn = document.getElementById('home-btn');


// API 이용 인기 영화 GET
function fetchPopularMovies() {
  const url = `${baseUrl}/movie/popular?api_key=${apiKey}&language=${language}&page=1`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      title.style.display = 'block';
      searchTitle.style.display = 'none';
      renderMovies(data.results);
    })
    .catch(error => {
      movieList.innerHTML = '<p style="color:white;">영화 정보 불러오기 실패.</p>';
      console.error(error);
    });
}

// 영화 검색
function searchMovies(query) {
  const url = `${baseUrl}/search/movie?api_key=${apiKey}&language=${language}&query=${encodeURIComponent(query)}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      renderMovies(data.results);
    })
    .catch(error => {
      movieList.innerHTML = '<p style="color:white;">검색 결과 불러오기 실패.</p>';
      console.error(error);
    });
}

// 영화 카드 랜더링
function renderMovies(movies) {
  movieList.innerHTML = '';
  if (!movies || movies.length == 0) {
    movieList.innerHTML = '<p style="color:white;">검색 결과 없음.</p>';
    return;
  }
  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';
    movieCard.innerHTML = `
      <img src="${movie.poster_path ? imageBaseUrl + movie.poster_path : 'https://via.placeholder.com/200x300?text=No+Image'}" alt="${movie.title}" />
      <div class="movie-info">
        <div class="movie-title">${movie.title}</div>
        <div class="movie-rating">⭐ ${movie.vote_average}</div>
        <div class="movie-overview">${movie.overview ? movie.overview.slice(0, 60) + '...' : '줄거리 정보 없음'}</div>
      </div>
    `;
    movieCard.addEventListener('click', function () {
      MovieDetails(movie.id);
    });
    movieList.appendChild(movieCard);
  });
}

// 영화 정보 모달
function MovieDetails(movieId) {
  const url = `${baseUrl}/movie/${movieId}?api_key=${apiKey}&language=${language}`;

  fetch(url)
    .then(res => res.json())
    .then(movie => {
      modalBody.innerHTML = `
        <h2>${movie.title} (${movie.release_date ? movie.release_date.slice(0, 4) : ''})</h2>
        <img src="${movie.poster_path ? imageBaseUrl + movie.poster_path : 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${movie.title}" style="width:11.25rem; float:left; margin-right:1.25rem; border-radius:0.5rem;"/>
        <div style="overflow:hidden;">
          <p><strong>평점:</strong> ⭐ ${movie.vote_average}</p>
          <p><strong>장르:</strong> ${movie.genres.map(g => g.name).join(', ')}</p>
          <p><strong>상영시간:</strong> ${movie.runtime ? movie.runtime + '분' : '정보 없음'}</p>
          <p><strong>줄거리:</strong><br/>${movie.overview || '줄거리 정보 없음'}</p>
        </div>
      `;
      modal.classList.remove('hidden');
    })
    .catch(eror => {
      modalBody.innerHTML = '<p style="color:white;">상세 정보 불러오기 실패.</p>';
      modal.classList.remove('hidden');
      console.error(error);
    });
}

// 모달 닫기
closeBtn.addEventListener('click', function () {
  modal.classList.add('hidden');
  modalBody.innerHTML = '';
});
window.addEventListener('click', function (e) {
  if (e.target === modal) {
    modal.classList.add('hidden');
    modalBody.innerHTML = '';
  }
});
window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    modal.classList.add('hidden');
    modalBody.innerHTML = '';
  }
});

//검색 이벤트리스너
searchBtn.addEventListener('click', function () {
  const query = searchInput.value.trim();
  if (query) {
    searchMovies(query);
    title.style.display = 'none';
    searchTitle.style.display = 'block';
  }
});

// 엔터키로도 검색 가능하게
searchInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    searchBtn.click();
  }
});

homeBtn.addEventListener('click', function () {
  fetchPopularMovies();
  title.style.display = 'block';
  searchTitle.style.display = 'none';
  searchInput.value = '';
});


//페이지 로드 초기값
fetchPopularMovies();