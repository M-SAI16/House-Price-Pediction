function getBathValue() {
    const uiBathrooms = document.getElementsByName("uiBathrooms");
    for (let i in uiBathrooms) {
        if (uiBathrooms[i].checked) {
            return parseInt(i) + 1;
        }
    }
    return -1;
}

function getBHKValue() {
    const uiBHK = document.getElementsByName("uiBHK");
    for (let i in uiBHK) {
        if (uiBHK[i].checked) {
            return parseInt(i) + 1;
        }
    }
    return -1;
}

function onClickedEstimatePrice() {
    console.log("Estimate price button clicked");
    
    const sqft = document.getElementById("uiSqft");
    const bhk = getBHKValue();
    const bathrooms = getBathValue();
    const location = document.getElementById("uiLocations");
    const priceDisplay = document.querySelector(".price-display");
    
    // Validate inputs
    if (!sqft.value || sqft.value < 100) {
        showError("Please enter a valid area (minimum 100 sq ft)");
        return;
    }
    
    if (location.value === "") {
        showError("Please select a location");
        return;
    }

    const url = "http://127.0.0.1:5000/predict_home_price";
    
    // Show loading state
    priceDisplay.innerHTML = "Calculating...";
    
    $.post(url, {
        total_sqft: parseFloat(sqft.value),
        bhk: bhk,
        bath: bathrooms,
        location: location.value
    }, function(data, status) {
        if (status === "success") {
            const price = data.estimated_price;
            priceDisplay.innerHTML = `₹ ${price.toLocaleString()} Lakh`;
            priceDisplay.style.color = "#2d3748";
        } else {
            showError("Failed to get price estimate. Please try again.");
        }
    }).fail(function() {
        showError("Server error. Please try again later.");
    });
}

function showError(message) {
    const priceDisplay = document.querySelector(".price-display");
    priceDisplay.innerHTML = message;
    priceDisplay.style.color = "#e53e3e";
}

function onPageLoad() {
    console.log("Document loaded");
    const url = "http://127.0.0.1:5000/get_location_names";
    
    $.get(url, function(data, status) {
        console.log("Got response for get_location_names request");
        if (data && status === "success") {
            const locations = data.locations;
            const uiLocations = document.getElementById("uiLocations");
            
            // Clear existing options except the first one
            while (uiLocations.options.length > 1) {
                uiLocations.remove(1);
            }
            
            // Add new options
            locations.forEach(location => {
                const opt = new Option(location);
                uiLocations.add(opt);
            });
        } else {
            showError("Failed to load locations. Please refresh the page.");
        }
    }).fail(function() {
        showError("Server error. Please try again later.");
    });
}

// Initialize when the document is ready
document.addEventListener("DOMContentLoaded", onPageLoad); 