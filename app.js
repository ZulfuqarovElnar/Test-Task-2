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

