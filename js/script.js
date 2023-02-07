$(document).ready(function () {
  const currentDay = moment().format("DD/MMM/YYYY, HH:mm");
  $("#current-day").html(currentDay);

  let units = "metric";
  let apiKey = "baad171896e0c3b36f831a6990f30812";
  let searchHistory = [];
  historyList = $("#history");
  let searchInput = $("#search-input");
  let searchForm = $("#search-form");




	function GeolocationCoordinates(searchValue){
		let coordsUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${searchValue}&limit=50&appid=${apiKey}&units=${units}`;
		console.log(coordsUrl);
		$.ajax({
			url: coordsUrl,
			method: 'GET',
		}).then(function(coords){
			if(coords.cod === '404'){
				alert('Location not found. Please enter a different city name.');
				return;
			}
			localStorage.setItem(searchValue, JSON.stringify(coords));
			updateSearchHistory(searchValue);
			displaySearchHistory();
			currentLocation(coords[0]);
		});
	}

	function getForecastNow(city, data) {
		$('.city').text(`${city}`);

		let celsius = Math.floor(data.main.temp);
		$('#celsius-temp').text(`${celsius}℃`);
		
		let iconCode = data.weather[0].icon;
		let iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
		$("#weather-icon").html("");
    $("#weather-icon").append(`<img src="${iconUrl}" alt="Weather Icon">`);
    $(".description")
      .text(data.weather[0].description)
      .css("display", "block", "margin-left", "auto");

		let humidity = data.main.humidity;
		$('#humidity').text(`🔥 Humidity: ${humidity}%`);

		let wind = Math.floor(data.wind.speed);
		$('#wind').text(`💨 Wind: ${wind}Km/H`);

		let feelsLike = Math.floor(data.main.feels_like);
		$('#feels-like').text(`🌡️ Feels like: ${feelsLike} ℃`);

		let pressure = data.main.pressure;
		$('#pressure').text(`⤵ Pressure: ${pressure} hPa`);
	}

	function currentLocation(position){
		let latitude = position.lat;
		let longitude = position.lon;
		let city = position.name;
		let geoUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
		$.ajax({
			url: geoUrl,
			method: 'GET',
		}).then(function(response){
			console.log(response);
			getForecastNow(city, response.list[0]);
			// getNextDayForecast(response.list);
		});
	}


  function updateSearchHistory(searchValue) {
    let storedSearchHistory = localStorage.getItem("searchHistory");
    if (!storedSearchHistory) {
    } else {
      searchHistory = JSON.parse(storedSearchHistory);
    }

    if (!searchHistory.includes(searchValue)) {
      searchHistory.push(searchValue);
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
      displaySearchHistory();
    }
  }

  // The purpose of this function is to display a list of previously
  // searched items (stored in a searchHistory array) on a web page as buttons.
  function displaySearchHistory() {
    let storedSearchHistory = localStorage.getItem("searchHistory");
    if (storedSearchHistory) {
      searchHistory = JSON.parse(storedSearchHistory);
    }
    historyList.html("");
    // render search history buttons on the page

    //for loop to iterate through each item in the searchHistory array.
    for (let i = 0; i < searchHistory.length; i++) {
      // create a new button element
      let historyBtn = $("<button>");
      historyBtn.attr("type", "button");
      historyBtn.attr("data-search", searchHistory[i]);
      historyBtn
        .addClass("history-btn btn btn-primary")
        .text(searchHistory[i])
        .css("margin-right", "10px");
      // appends the button to the historyList element.
      historyList.append(historyBtn);
    }
    historyList.on("click", ".history-btn", function () {
      let searchValue = $(this).attr("data-search");
      GeolocationCoordinates(searchValue);
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    let searchValue = searchInput.val().trim();
    if (searchValue) {
      GeolocationCoordinates(searchValue);
      searchInput.val("");
    }
  }

  displaySearchHistory();
  searchForm.on("submit", handleSubmit);
});
