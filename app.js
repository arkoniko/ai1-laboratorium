document.addEventListener("DOMContentLoaded", function () {
  // Inicjalizacja Leaflet
  let map = L.map('map-container', {
    maxBounds: [
      // południowy zachód
      [-90, -180],
      // północny wschód
      [90, 180]
    ],
    maxBoundsViscosity: 1.0,
  }).setView([51.505, -0.09], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  var myLocationBtn = document.getElementById("myLocationBtn");
  var downloadMapBtn = document.getElementById("downloadMapBtn");
  var puzzleBtn = document.getElementById("puzzle-btn");
  var coordinatesBar = document.getElementById("coordinates-bar");
  var puzzleContainer = document.getElementById("puzzle-container");
  var puzzlePreviewContainer = document.getElementById("puzzle-preview-container");

  var userLocation;
  var originalMapImage;
  var puzzleTiles;
  toggleButtons(true, false, false);

  function updateCoordinatesBar(lat, lng) {
    coordinatesBar.textContent = lat + " / " + lng;
  }

  function toggleButtons(geolocation, raster, puzzle) {
    myLocationBtn.style.display = geolocation ? "block" : "none";
    downloadMapBtn.style.display = raster ? "block" : "none";
    puzzleBtn.style.display = puzzle ? "block" : "none";
  }

  // Geolocation
  myLocationBtn.addEventListener("click", function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        map.setView([lat, lng], 13);
        updateCoordinatesBar(lat, lng);
        toggleButtons(false, true, false);
        userLocation = [lat, lng];
      });
    } else {
      alert("Geolocation API nie jest wspierane przez twoja przegladarke.");
    }
  });

  downloadMapBtn.addEventListener("click", function () {
    leafletImage(map, function (err, canvas) {
      // Eksport
      originalMapImage = new Image();
      originalMapImage.src = canvas.toDataURL();
      map.remove();
      document.getElementById("map-container").innerHTML = "";
      document.getElementById("map-container").appendChild(originalMapImage);
      toggleButtons(false, false, true);

    });
  });

  function generatePuzzleTiles() {
    puzzleTiles = Array.from({ length: 16 }, (_, index) => index);
    shuffleArray(puzzleTiles);
    puzzlePreviewContainer.innerHTML = "";
    puzzleTiles.forEach(function (tileIndex, index) {
      var tile = document.createElement("div");
      tile.classList.add("puzzle-tile");
      tile.draggable = true;
      tile.style.backgroundImage = "url('" + originalMapImage.src + "')";
      tile.style.backgroundSize = "400% 400%";
      tile.style.backgroundPosition = (tileIndex % 4) * -100 + "% " + Math.floor(tileIndex / 4) * -100 + "%";
      tile.dataset.index = index;
      tile.addEventListener("dragstart", function (event) {
        event.dataTransfer.setData("text/plain", tileIndex);
      });
      puzzlePreviewContainer.appendChild(tile);
    });
  }
  
  // Puzzle
  puzzleBtn.addEventListener("click", function () {
    toggleButtons(false, false, false);
    generatePuzzleTiles();
    puzzlePreviewContainer.addEventListener("dragstart", function (event) {
      event.dataTransfer.setData("text/plain", event.target.style.backgroundPosition);
    });

    puzzleContainer.addEventListener("dragover", function (event) {
      event.preventDefault();
    });

    puzzleContainer.addEventListener("drop", function (event) {
      event.preventDefault();

      var droppedPosition = event.dataTransfer.getData("text/plain");

      var droppedTile = document.createElement("div");
      droppedTile.classList.add("puzzle-tile");
      droppedTile.draggable = true;
      droppedTile.style.backgroundImage = "url('" + originalMapImage.src + "')";
      droppedTile.style.backgroundSize = "400% 400%";
      droppedTile.style.backgroundPosition = droppedPosition;

      droppedTile.addEventListener("dragstart", function (event) {
        event.dataTransfer.setData("text/plain", event.target.style.backgroundPosition);
      });

      var rect = puzzleContainer.getBoundingClientRect();
      var offsetX = event.clientX - rect.left;
      var offsetY = event.clientY - rect.top;
      droppedTile.style.left = offsetX - droppedTile.offsetWidth / 2 + "px";
      droppedTile.style.top = offsetY - droppedTile.offsetHeight / 2 + "px";

      puzzleContainer.appendChild(droppedTile);

      puzzlePreviewContainer.removeChild(event.target);

      if (puzzleContainer.children.length === 16) {
        checkPuzzle();
      }
    });
  });

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  function checkPuzzle() {
    var puzzleTilesInContainer = Array.from(puzzleContainer.children);
    var correctPositions = Array.from({ length: 16 }, (_, index) => (index % 4) * -100 + "% " + Math.floor(index / 4) * -100 + "%");
    var success = puzzleTilesInContainer.every(function (tile, index) {
      var correctIndex = correctPositions.indexOf(tile.style.backgroundPosition);
      return correctIndex === parseInt(tile.dataset.index);
    });
    if (success) {
      alert("SUKCES");
    } else {
      alert("KICHA");
    }
  }
});
