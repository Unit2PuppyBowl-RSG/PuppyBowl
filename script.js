const playersContainer = document.getElementById('all-players-container');
const playerContainer = document.getElementById('player-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2302-ACC-ET-WEB-PT-A';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(`${APIURL}/players`);
        const data = await response.json();
        console.log(data.data.players);
        return data.data.players;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};


const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/players/${playerId}`);
        const data = await response.json();
        console.log(data);
        return data.data.player;
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(`${APIURL}/players`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerObj),
        });
        const data = await response.json();
        console.log(data);
        renderAllPlayers(data.data.players);
        location.reload(); // Refresh the page
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/players/${playerId}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        console.log(data);
        const updatedPlayerList = data.data.players; // Get the updated player list from the response
        renderAllPlayers(updatedPlayerList);
        location.reload(); // Refresh the page
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};


/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
    try {
      const playerContainer = document.getElementById('player-container');
      const playerContainerHTML = playerList
        .map((player) => `
          <div class="player-card">
              <img width="300" src="${player.imageUrl}">
              <h2 class="player-name">${player.name}</h2>
              <p>${player.breed}</p>
              <button class="see-details-button" data-player-id="${player.id}">See details</button>
              <button class="remove-from-roster-button" data-player-id="${player.id}">Remove from roster</button>
          </div>
          
          <div class="player-details hidden" id="player-details-${player.id}">
              <div class="modal">
                  <div class="modal-content">
                  <img width="300" src="${player.imageUrl}">
                      <h3>${player.name}</h3>
                      <p>Breed: ${player.breed}</p>
                      <p>ID: ${player.id}</p>
                      <p>Status: ${player.status}</p>
                      <p>Team: ${player.teamId}</p>
                      <p>Cohort: ${player.cohortId}</p>
                      <p>Created: ${player.createdAt}</p>
                      <p>Updated: ${player.updatedAt}</p>
                      <button class="close-button">Close</button>
                  </div>
              </div>
          </div>
        `)
        .join('');
  
      playerContainer.innerHTML = playerContainerHTML;
  
      const seeDetailsButtons = document.querySelectorAll('.see-details-button');
      seeDetailsButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const playerId = button.dataset.playerId;
          const playerDetails = document.getElementById(`player-details-${playerId}`);
          playerDetails.classList.remove('hidden');
          showOverlay();
        });
      });
      
      function showOverlay() {
        const overlay = document.getElementById('modal-overlay');
        overlay.style.display = 'flex';
      }
      
      function hideOverlay() {
        const overlay = document.getElementById('modal-overlay');
        overlay.style.display = 'none';
      }
      
      const closeButtons = document.querySelectorAll('.close-button');
      closeButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const playerDetails = button.closest('.player-details');
          playerDetails.classList.add('hidden');
          hideOverlay();
        });
      });
      
      const removeFromRosterButtons = document.querySelectorAll('.remove-from-roster-button');
      removeFromRosterButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const playerId = button.dataset.playerId;
          removePlayer(playerId);
        });
      });
    } catch (err) {
      console.error('Uh oh, trouble rendering players!', err);
    }
  };
  
  

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {
        const newPlayerFormContainer = document.getElementById('new-player-form-container');
        newPlayerFormContainer.innerHTML = `
            <form id="new-player-form" class="new-player-form">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name">
                <label for="breed">Breed:</label>
                <input type="text" id="breed" name="breed">
                <label for="imageUrl">Image URL:</label>
                <input type="text" id="imageUrl" name="imageUrl">
                <button type="submit">Add player</button>
                <button type="reset">Reset</button>
            </form>
        `;
        const newPlayerForm = document.getElementById('new-player-form');
        newPlayerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(newPlayerForm);
            const playerObj = {
                name: formData.get('name'),
                breed: formData.get('breed'),
                imageUrl: formData.get('imageUrl'),
            };
            await addNewPlayer(playerObj);
            newPlayerForm.reset();
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}
    const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
    renderNewPlayerForm();
}

init();