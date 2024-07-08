const site1 = "https://sunnah.com/";
const site2 = "https://hadithhub.com/";

document.getElementById("urlForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const book = document.getElementById("book").value;
    const numberInput = document.getElementById("numberInput").value;

    if (book && numberInput) {
        const url1 = `${site1}${book}:${numberInput}`;
        const url2 = `${site2}${book}:${numberInput}`;
        document.getElementById(
            "result"
        ).innerHTML = `<a href="${url1}" target="_blank">${url1}</a>`;
        document.getElementById(
            "result"
        ).innerHTML += `<br><br><a href="${url2}" target="_blank">${url2}</a>`;
    } else {
        document.getElementById("result").textContent =
            "Please provide both a text string and a number.";
    }
});
