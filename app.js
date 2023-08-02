// MouseOver to hide a specific hr element
// Change Logo img 
document.addEventListener("DOMContentLoaded", function () {
    const hideLine = (lineClassName) => {
        const line = document.querySelector(`.${lineClassName}`);
        line && (line.style.visibility = "hidden");
    };

    const showLine = (lineClassName) => {
        const line = document.querySelector(`.${lineClassName}`);
        line && (line.style.visibility = "visible");
    };

    const setHoverEvents = (factId, linesToHide) => {
        const fact = document.getElementById(factId);
        fact.addEventListener("mouseover", () => {
            linesToHide.forEach(hideLine);
            if (factId === "factImg") {
                const img = fact.querySelector("img");
                img && (img.src = "images/Logo_inverted.svg");
            }
        });
        fact.addEventListener("mouseout", () => {
            linesToHide.forEach(showLine);
            if (factId === "factImg") {
                const img = fact.querySelector("img");
                img && (img.src = "images/Logo.svg");
            }
        });
    };

    setHoverEvents("fact1", ["line1"]);
    setHoverEvents("fact2", ["line1", "line2"]);
    setHoverEvents("fact3", ["line2", "line3"]);
    setHoverEvents("factImg", ["line3", "line4"]);
});

// * FactDesription clicked
const factDescriptions = document.querySelectorAll(".factDesription");

let loadingFlag = false; 

factDescriptions.forEach((fact) => {
  const factPlusIcon = fact.querySelector(".fact-plus i");
  const factClickElement = fact.nextElementSibling;

  fact.addEventListener("click", async () => {
    if (!loadingFlag) {
      loadingFlag = true; 

      const isOpen = factPlusIcon.classList.contains("fa-minus");
      factPlusIcon.classList.toggle("fa-plus", isOpen);
      factPlusIcon.classList.toggle("fa-minus", !isOpen);
      factClickElement.style.display = isOpen ? "none" : "block";

      try {
        const factIndex = Array.from(factDescriptions).indexOf(fact);
        await catImages(factIndex + 1);
      } catch (error) {
        console.error(error);
      }
      loadingFlag = false; 
    }
  });
});

// * Cat Api added

const accessKey = "zznK8bJyCOG783FzSPbnL9lC0E3b0sCw2y6XxkXQ1g0";

const factItemEls = document.querySelectorAll('.factItem');
let page = 1;
let currentPageResults = [];
let apiCallInProgress = false;
let previouslyDisplayedIndexes = [];
let loadingFlags = [];

async function catImages(factIndex) {
  inputData = "cat";
  const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}`;
  const factClickElement = document.getElementById(`factClick${factIndex}`);

  factClickElement.innerHTML = "Loading...";
  factClickElement.classList.remove("error");
  factClickElement.classList.add("loading");

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (page === 1) {
      factClickElement.innerHTML = "";
    }

    const currentPageResults = data.results.filter((result, index) => {
      return !previouslyDisplayedIndexes.includes(index);
    });

    if (currentPageResults.length === 0) {
      page++;
      previouslyDisplayedIndexes = [];
      return catImages(factIndex);
    }

    const randomIndex = Math.floor(Math.random() * currentPageResults.length);
    const result = currentPageResults[randomIndex];
    const resultIndexInData = data.results.indexOf(result);
    previouslyDisplayedIndexes.push(resultIndexInData);

    const factCardHTML = `
      <div class="fact-card">
        <img src="${result.urls.small}" alt="${result.alt_description}">
        <a href="${result.links.html}" target="_blank" rel="noopener noreferrer">
          ${result.alt_description}
        </a>
      </div>
    `;

    factClickElement.innerHTML = factCardHTML;
    factClickElement.classList.remove("loading"); 

    apiCallInProgress = false;
  } catch (error) {
    factClickElement.innerHTML = "Error occurred while fetching data.";
    factClickElement.classList.add("error");
    factClickElement.classList.remove("loading");

    apiCallInProgress = false;
  }
}

factItemEls.forEach((factItemEl, index) => {
  const factDescriptionEl = factItemEl.querySelector('.factDesription');

  loadingFlags[index] = false;

  factDescriptionEl.addEventListener('click', () => {
    if (!loadingFlags[index]) {
      loadingFlags[index] = true;
      catImages(index + 1)
        .then(() => {
          loadingFlags[index] = false;
        })
        .catch((error) => {
          loadingFlags[index] = false;
          console.error(error);
        });
    }
  });
});
