//toggleSpinner function
const toggleSpinner = displayStyle => {
    document.getElementById("loading-spinner").style.display = displayStyle;
}
//displayError function
const displayError = () => {
    toggleSearchResult("none");
    togglePhoneDetails("none");
    toggleSpinner("none");
    document.getElementById("no-result").style.display = "none";
    document.getElementById("no-input").style.display = "none";
    document.getElementById("error-message").style.display = "block";
}
// toggleSearchResult function
const toggleSearchResult = displayStyle => {
    document.getElementById("search-result-container").style.display = displayStyle;
}
// togglePhoneDetails function
const togglePhoneDetails = displayStyle => {
    document.getElementById("phone-details").style.display = displayStyle;
}
//searchResultsInnerHTML function
const searchResultsInnerHTML = (items, searchResult) => {
    items?.forEach(phone => {
        const div = document.createElement("div");
        div.classList.add("col");
        div.innerHTML = `
        <div class="card h-100">
            <img src="${phone.image}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">Title: ${phone.phone_name}</h5>
                <p>Brand: ${phone.brand}</p>
                <button onclick="loadPhoneDetail('${phone.slug}')" type="button" class="btn btn-primary">Show Details</button>
            </div>
        </div>
    `;
        searchResult.appendChild(div);
    });
}
//phonDetailsInnerHTML function
const phonDetailsInnerHTML = (phone, joinedsensorsArray, phoneDetails) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
        <div class="w-50 my-3 mx-auto">
            <img src="${phone.image}" class="card-img-top" alt="...">
        </div>
        <div class="card-body">
            <h5 class="card-title">Title: ${phone.name}</h5>
            <p>Brand: ${phone.brand}</p>
            <p>Release Date: ${phone.releaseDate ? phone.releaseDate : "No release date found"}</p>
            <p>Storage: ${phone.mainFeatures.storage}</p>
            <p>Display Size: ${phone.mainFeatures.displaySize}</p>
            <p>Chipset: ${phone.mainFeatures.chipSet}</p>
            <p>Memory: ${phone.mainFeatures.memory}</p>
            <p>Sensors: ${joinedsensorsArray}</p>
        </div>
    `;
    phoneDetails.appendChild(div);
}
//searchPhone function
const searchPhone = async () => {
    document.getElementById("cover-image").style.display = "none";
    const searchField = document.getElementById("search-field");
    const searchText = searchField.value;
    const lowerSearchText = searchText.toLowerCase();
    //clear field
    searchField.value = "";
    //when search is empty
    if (searchText == "") {
        document.getElementById("search-result").textContent = "";
        document.getElementById("phone-details").textContent = "";
        document.getElementById("error-message").style.display = "none";
        document.getElementById("no-result").style.display = "none";
        document.getElementById("show-more-btn").style.display = "none";
        document.getElementById("show-less-btn").style.display = "none";
        toggleSpinner("none");
        document.getElementById("no-input").style.display = "block";
    }
    //when search is not empty fetch data
    else {
        document.getElementById("error-message").style.display = "none";
        document.getElementById("no-input").style.display = "none";
        document.getElementById("no-result").style.display = "none";
        toggleSpinner("block");
        toggleSearchResult("none");
        togglePhoneDetails("none");
        //load data
        url = `https://openapi.programming-hero.com/api/phones?search=${lowerSearchText}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            displaySearchResult(data.data);
        }
        catch (error) {
            console.log(error);
            displayError();
        }
    }
}
//displaySearchResult function
const displaySearchResult = phones => {
    const searchResult = document.getElementById("search-result");
    searchResult.textContent = "";
    document.getElementById("phone-details").textContent = "";
    //when no result found
    if (phones.length == 0) {
        document.getElementById("no-result").style.display = "block";
        document.getElementById("show-more-btn").style.display = "none";
        document.getElementById("show-less-btn").style.display = "none";
    }
    else {
        //when searched items are more than 20
        if (phones.length > 20) {
            const slicedItems = phones.slice(0, 20);
            document.getElementById("no-result").style.display = "none";
            searchResultsInnerHTML(slicedItems, searchResult);
            //show-all btn show and click
            document.getElementById("show-less-btn").style.display = "none";
            const showAllBtn = document.getElementById("show-more-btn");
            const showLessBtn = document.getElementById("show-less-btn");
            showAllBtn.style.display = "block";
            //onclick
            showAllBtn.addEventListener("click", function () {
                showAllBtn.style.display = "none";
                searchResult.textContent = "";
                searchResultsInnerHTML(phones, searchResult);
                showLessBtn.style.display = "block";
            })
            showLessBtn.addEventListener("click", function () {
                showLessBtn.style.display = "none";
                searchResult.textContent = "";
                searchResultsInnerHTML(slicedItems, searchResult);
                showAllBtn.style.display = "block";
            })
        }
        //when searched items are less than or equal than 20
        else {
            document.getElementById("show-more-btn").style.display = "none";
            document.getElementById("show-less-btn").style.display = "none";
            document.getElementById("no-result").style.display = "none";
            searchResultsInnerHTML(phones, searchResult);
        }
    }
    toggleSpinner("none");
    toggleSearchResult("block");
}
//loadPhoneDetail function
const loadPhoneDetail = async phoneId => {
    document.getElementById("error-message").style.display = "none";
    const url = `https://openapi.programming-hero.com/api/phone/${phoneId}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        displayPhoneDetail(data.data);
    }
    catch (error) {
        console.log(error);
        displayError();
    }
}
// displayPhoneDetail function
const displayPhoneDetail = phone => {
    const phoneDetails = document.getElementById("phone-details");
    phoneDetails.textContent = "";
    const sensorsArray = phone.mainFeatures.sensors;
    //join array
    const joinedsensorsArray = sensorsArray.join(", ");
    //when there is 'others' property present
    if (phone.others) {
        const keys = Object.keys(phone.others);
        phonDetailsInnerHTML(phone, joinedsensorsArray, phoneDetails);
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
        <div class="card-body">
            <p>Others:</p>
            <p>${keys[0]}: ${phone.others[keys[0]]}</p>
            <p>${keys[1]}: ${phone.others[keys[1]]}</p>
            <p>${keys[2]}: ${phone.others[keys[2]]}</p>
            <p>${keys[3]}: ${phone.others[keys[3]]}</p>
            <p>${keys[4]}: ${phone.others[keys[4]]}</p>
            <p>${keys[5]}: ${phone.others[keys[5]]}</p>
        </div>
    `;
        phoneDetails.appendChild(div);
    }
    //when there is no 'others' property present
    else {
        phonDetailsInnerHTML(phone, joinedsensorsArray, phoneDetails);
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
        <div class="card-body">
            <p>Others: Not available</p>
        </div>
    `;
        phoneDetails.appendChild(div);
    }
    togglePhoneDetails("block");
}