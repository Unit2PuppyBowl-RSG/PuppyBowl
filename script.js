const playerContainerHTML = document.getElementById('player-container');
const newPlayerFormContainer = document.getElementById('new-player-form');
const playerDetailsElement = document.getElementById('player-detailcontainer');

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
    console.log('dogs');
    return data.data.players; // Return the fetched data
  } catch (err) {
    console.error('Uh oh, trouble fetching players!', err);
  }
};

fetchAllPlayers();

const fetchSinglePlayer = async (id) => {
  try {
    const response = await fetch(`${APIURL}/players/${id}`);
    const data = await response.json();
    console.log(data.data);
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${id}!`, err);
  }
};

//fetchSinglePlayer(8805);

const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(`${APIURL}/players/${playerObj.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(playerObj),
    });
    const result = await response.json();
    console.log(result);
  } catch (err) {
    console.error('Oops, something went wrong with adding that player!', err);
  }
};
//addNewPlayer();

const removePlayer = async (id) => {
  try {
    const response = await fetch(`${APIURL}/players/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const result = await response.json();
    console.log(result);
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${id} from the roster!`,
      err
    );
  }
};
//removePlayer();

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
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the code below.
 *
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
function createPlayerCards(playerList) {
  let playerContainer = '';

  // Loop through each player object
  for (let i = 0; i < playerList.length; i++) {
    const player = playerList[i];

    // Create HTML string for the player card
    const playerCardHTML = `
      <div class="player-card">
        <img width="300" src="${player.imageUrl}">
        <h3>${player.name}</h3>
        <p>Breed: ${player.breed}</p>
        <p>ID: ${player.id}</p>
        <p>Status: ${player.status}</p>
        <p>Team: ${player.teamId}</p>
        <p>Cohort: ${player.cohortId}</p>
        <p>Created: ${player.createdAt}</p>
        <p>Updated: ${player.updatedAt}</p>
        <button class="see-details" data-player-id="${player.id}">See Details</button>
        <button class="remove-roster" data-player-id="${player.id}">Remove from Roster</button>
      </div>
    `;

    // Add the player card HTML to the container string
    playerContainer += playerCardHTML;
  }

  // Add the player container HTML to the DOM
  playerContainerHTML.innerHTML = playerContainer;

  // Add event listeners to buttons
  const seeDetailsButtons = document.querySelectorAll('.see-details');
  //console.log(seeDetailsButtons);

  const removeRosterButtons = document.querySelectorAll('.remove-roster');

  // Event listener for "See details" button
  seeDetailsButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      console.log(button.dataset);
      const id = button.dataset.playerId;
      fetchSinglePlayer(id);
    });
  });

  // Event listener for "Remove from roster" button
 removeRosterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const id = button.dataset.playerId;
    console.log('Hello');
    removePlayer(id);
  });
});

  return playerContainer;
}

function fetchSinglePlayers(id) {
  // Make a fetch request to API to get details for a single player
  // Replace this with your actual fetch code
  fetch(`${APIURL}/players/${id}`)
    .then((response) => response.json())
    .then((player) => {
      // Process the fetched player data
      console.log(player);
    })
    .catch((error) => {
      console.error('Error fetching player:', error);
    });
}

const seePlayerDetails = async (id) => {
try {
    const response = await fetch(`${APIURL}/players/${id}`);
    const data = await response.json();
    console.log(data.data.players);
 // create new HTML element to display party details
    const playerDetailsElement = document.createElement('div');
    playerDetailsElement.classList.add('.player-detailcontainer');
    playerDetailsElement.innerHTML = `
            <div class="player-details">
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
        `;

        //empty the container
    playerContainer.innerHTML = '';

    //hide the party list container
    playerListContainer.style.display = 'none'

     //put the party details on the page. (in the container)
    playerContainer.appendChild(playerDetailsElement);
    //console.log(playerDetailsElement);

    // add event listener to close button
    const closeButton = playerDetailsElement.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
      playerDetailsElement.remove();
      playerListContainer.style.display = 'block';
    });
  } catch (error) {
    console.error(error);
  }  
};



function removePlayers(id) {
  // Make a fetch request to API to remove a player from the roster
  // Replace this with your actual fetch code
  fetch(`${APIURL}/players/${id}`, { method: 'DELETE' })
    .then((response) => {
      if (response.ok) {
        console.log('Player removed successfully');
      } else {
        throw new Error('Failed to remove player');
      }
    })
    .catch((error) => {
      console.error('Error removing player:', error);
    });
}

const renderAllPlayers = async () => {
  try {
    const players = await fetchAllPlayers();
    const playerContainer= createPlayerCards(players);
    playerContainerHTML.innerHTML = playerContainer;
  } catch (err) {
    console.error('Uh oh, trouble rendering players!', err);
  }
};

//renderAllPlayers();

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
  try {
    const newPlayerForm = `
      <form id="new-player-form">
        <label for="name">Name:</label>
        <input type="text" name="name" id="name">
        <label for="breed">Breed:</label>
        <input type="text" name="breed" id="breed">
        <label for="team">Team:</label>
        <input type="text" name="team" id="team">
        <label for="team">Status:</label>
        <input type="text" name="status" id="status">
        <label for="team">Image:</label>
        <input type="file" name="image" id="image">
        <button class="add-button">Add Player</button>
      </form>
    `;
    newPlayerFormContainer.innerHTML = newPlayerForm;
    const addButton = document.querySelector('.add-button');
    addButton.addEventListener('click', (event) => {
      event.preventDefault();
      const newPlayer = {
        name: document.getElementById('name').name,
        breed: document.getElementById('breed').breed,
        team: document.getElementById('team').team,
      };
      addNewPlayer(newPlayer);
    });
  } catch (err) {
    console.error('Uh oh, trouble rendering the new player form!', err);
  }
};

const init = async () => {
  await renderAllPlayers();
  renderNewPlayerForm();
};


init();
