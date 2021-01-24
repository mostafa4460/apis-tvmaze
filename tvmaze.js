/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const res = await axios.get('http://api.tvmaze.com/search/shows', { params: {q: query}});
  const shows = res.data.map(show => (
    {
      id: show.show.id, 
      name: show.show.name, 
      summary: show.show.summary, 
      image: show.show.image ? show.show.image.medium : null
    }
  ));
  return shows;
};



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let imgURL = "https://tinyurl.com/tv-missing";
    if (show.image) imgURL = show.image;
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <img class="card-img-top" src="${imgURL}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
           </div>
           <button class="btn btn-success">Episodes</button>
         </div>
       </div>
      `);

    $showsList.append($item);
  };
};


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  const episodes = res.data.map(episode => (
    {
      id: episode.id,
      name: episode.name,
      season: episode.season,
      episode: episode.number
    }
  ));
  return episodes;
};

/** Given a list of episodes:
 * [ { id, name, season, episode } ]
 * add episodes to DOM
 */

function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();
  for (let episode of episodes) {
    let $item = $(
      `<li data-episode-id="${episode.id}">
        <b>${episode.name}</b>
        - Season ${episode.season} Episode ${episode.episode}
      </li>`
    );

    $episodesList.append($item);
  };
};

/** Handle Episodes Button
 * - Get all episodes of a clicked show using its ID
 * - Add list of episodes to episodes-area
 * - Show #episodes-area
 */

$("#shows-list").on("click", ".Show", async function handleEpisodes(e) {
  if(e.target.tagName === "BUTTON") {
    const showID = $(this).attr("data-show-id");
    const episodes = await getEpisodes(showID);
    populateEpisodes(episodes);
    $("#episodes-area").show();
  };
});