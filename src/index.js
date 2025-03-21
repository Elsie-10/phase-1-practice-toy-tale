let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  
    // Fetch all toy objects and populate the toy collection
    fetchToys();
  
    // Add event listener to the toy form (already implemented in the previous steps)
    const toyForm = document.getElementById('toy-form');
    toyForm.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const name = document.getElementById('toy-name').value;
      const image = document.getElementById('toy-image').value;
      const newToy = {
        name: name,
        image: image,
        likes: 0
      };
  
      // Send a POST request to create the new toy
      fetch('http://localhost:3000/toys', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(newToy)
      })
        .then(response => response.json())
        .then(toy => {
          // If the POST request is successful, add the new toy to the DOM
          addToyToDOM(toy);
          // Clear the form
          toyForm.reset();
        })
        .catch(error => {
          console.error('Error creating new toy:', error);
        });
    });
  });
  
  // Function to fetch toys and populate the collection
  function fetchToys() {
    fetch('http://localhost:3000/toys')
      .then(response => response.json())
      .then(toys => {
        const toyCollectionDiv = document.getElementById('toy-collection');
        toys.forEach(toy => {
          addToyToDOM(toy);
        });
      })
      .catch(error => {
        console.error('Error fetching toy data:', error);
      });
  }
  
  // Function to create and append a new toy card to the DOM
  function addToyToDOM(toy) {
    const toyCollectionDiv = document.getElementById('toy-collection');
  
    const toyCard = document.createElement('div');
    toyCard.classList.add('card');
    toyCard.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" alt="${toy.name}" class="toy-avatar" />
      <p>Likes: <span id="likes-${toy.id}">${toy.likes}</span></p>
      <button class="like-btn" id="like-btn-${toy.id}" data-id="${toy.id}">
        Like
      </button>
    `;
    toyCollectionDiv.appendChild(toyCard);
  
    // Add event listener for the "Like" button
    const likeButton = document.querySelector(`#like-btn-${toy.id}`);
    likeButton.addEventListener('click', function() {
      // Capture the toy's ID
      const toyId = toy.id;
      // Calculate the new number of likes
      const newLikes = toy.likes + 1;
  
      // Send the PATCH request to update the number of likes for this toy
      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          likes: newLikes
        })
      })
        .then(response => response.json())
        .then(updatedToy => {
          // Update the likes in the DOM without reloading the page
          document.getElementById(`likes-${toyId}`).textContent = updatedToy.likes;
          // Update the toy's likes in the toy object (optional, for reference)
          toy.likes = updatedToy.likes;
        })
        .catch(error => {
          console.error('Error updating toy likes:', error);
        });
    });
  }
  
