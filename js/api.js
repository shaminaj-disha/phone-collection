document.getElementById("error-message").style.display = "none";
document.getElementById("no-input").style.display = "none";
document.getElementById("no-result").style.display = "none";
//toggleSpinner function
const toggleSpinner = displayStyle => {
    document.getElementById("loading-spinner").style.display = displayStyle;
}
//displayError function
const displayError = () => {
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
//searchPhone function
const searchPhone = async () => {
    const searchField = document.getElementById("search-field");
    const searchText = searchField.value;
    const lowerSearchText = searchText.toLowerCase();
    //clear field
    searchField.value = "";
    if (searchText == "") {
        document.getElementById("search-result").textContent = "";
        document.getElementById("phone-details").textContent = "";
        document.getElementById("error-message").style.display = "none";
        document.getElementById("no-result").style.display = "none";
        document.getElementById("no-input").style.display = "block";
        toggleSpinner("none");
    }
    else {
        document.getElementById("error-message").style.display = "none";
        document.getElementById("no-input").style.display = "none";
        toggleSpinner("block");
        toggleSearchResult("none");
        togglePhoneDetails("none");
        //load data
        url = `https://openapi.programming-hero.com/api/phones?search=${lowerSearchText}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            //console.log(data.data.length);
            displaySearchResult(data.data);
        }
        catch (error) {
            console.log(error);
            displayError();
            toggleSearchResult(none);
            togglePhoneDetails(none);
        }
    }
}
//displaySearchResult function
const displaySearchResult = phones => {
    const searchResult = document.getElementById("search-result");
    searchResult.textContent = "";
    document.getElementById("phone-details").textContent = "";
    if (phones.length == 0) {
        document.getElementById("no-result").style.display = "block";
    }
    else {
        if (phones.length >= 20) {
            const slicedItems = phones.slice(0, 20);
            //console.log(slicedItems);
            document.getElementById("no-result").style.display = "none";
            slicedItems?.forEach(phone => {
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
            const searchresultcontainer = document.getElementById("search-result-container");
            const buttonDiv = document.createElement("div");
            buttonDiv.classList.add("d-flex");
            buttonDiv.classList.add("justify-content-center");
            const showMorebutton = document.createElement("button");
            showMorebutton.classList.add("btn");
            showMorebutton.classList.add("btn-primary");
            showMorebutton.classList.add("my-3");
            showMorebutton.innerText = "Show More";
            buttonDiv.appendChild(showMorebutton);
            searchresultcontainer.appendChild(buttonDiv);
            /* const showLessbutton = document.createElement("button");
            showLessbutton.classList.add("btn");
            showLessbutton.classList.add("btn-primary");
            showLessbutton.classList.add("my-3");
            showLessbutton.innerText = "Show Less";
            buttonDiv.appendChild(showLessbutton);
            searchresultcontainer.appendChild(buttonDiv);
            showLessbutton.style.display = "none"; */
            showMorebutton.onclick = function () {
                showMorebutton.style.display = "none";
                const remainingItems = phones.slice(20);
                remainingItems?.forEach(phone => {
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
                /* showLessbutton.style.display = "block";
                showLessbutton.onclick = function () {

                } */
            }
        }
        else {
            document.getElementById("no-result").style.display = "none";
            phones?.forEach(phone => {
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
    }
    toggleSpinner("none");
    toggleSearchResult("block");
}
//loadPhoneDetail function
const loadPhoneDetail = async phoneId => {
    //console.log(phoneId);
    document.getElementById("error-message").style.display = "none";
    const url = `https://openapi.programming-hero.com/api/phone/${phoneId}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        //console.log(data.data);
        displayPhoneDetail(data.data);
    }
    catch (error) {
        console.log(error);
        displayError();
        toggleSearchResult(none);
        togglePhoneDetails(none);
    }
}
// displayPhoneDetail function
const displayPhoneDetail = phone => {
    console.log(phone.others);
    const phoneDetails = document.getElementById("phone-details");
    phoneDetails.textContent = "";
    const div = document.createElement("div");
    div.classList.add("card");
    // for (const key in phone.others) {
    //     //console.log(key);
    // }
    if (phone.others) {
        const keys = Object.keys(phone.others);
        div.innerHTML = `
        <div class="w-50 my-3 mx-auto">
            <img src="${phone.image}" class="card-img-top" alt="...">
        </div>
        <div class="card-body">
            <h5 class="card-title">Title: ${phone.name}</h5>
            <p>Brand: ${phone.brand}</p>
            <p>Storage: ${phone.mainFeatures.storage}</p>
            <p>Display Size: ${phone.mainFeatures.displaySize}</p>
            <p>Chipset: ${phone.mainFeatures.chipSet}</p>
            <p>Memory: ${phone.mainFeatures.memory}</p>
            <p>Sensors: ${phone.mainFeatures.sensors}</p>
            <p>Others:</p>
            <p>${keys[0]}: ${phone.others[keys[0]]}</p>
            <p>${keys[1]}: ${phone.others[keys[1]]}</p>
            <p>${keys[2]}: ${phone.others[keys[2]]}</p>
            <p>${keys[3]}: ${phone.others[keys[3]]}</p>
            <p>${keys[4]}: ${phone.others[keys[4]]}</p>
            <p>${keys[5]}: ${phone.others[keys[5]]}</p>
            <p>Release Date: ${phone.releaseDate ? phone.releaseDate : "No release date found"}</p>
        </div>
    `;
    }
    //console.log(otherskeys);

    else {
        div.innerHTML = `
        <div class="w-50 my-3 mx-auto">
            <img src="${phone.image}" class="card-img-top" alt="...">
        </div>
        <div class="card-body">
            <h5 class="card-title">Title: ${phone.name}</h5>
            <p>Brand: ${phone.brand}</p>
            <p>Storage: ${phone.mainFeatures.storage}</p>
            <p>Display Size: ${phone.mainFeatures.displaySize}</p>
            <p>Chipset: ${phone.mainFeatures.chipSet}</p>
            <p>Memory: ${phone.mainFeatures.memory}</p>
            <p>Sensors: ${phone.mainFeatures.sensors}</p>
            <p>Others: Not defined</p>
            <p>Release Date: ${phone.releaseDate ? phone.releaseDate : "No release date found"}</p>
        </div>
    `;
    }
    phoneDetails.appendChild(div);
    togglePhoneDetails("block");
}