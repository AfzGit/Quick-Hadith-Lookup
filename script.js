const site1 = "https://sunnah.com/";
const site2 = "https://hadithhub.com/";
const site3 = "https://mohaddis.com/View/";

let full, har, hen, harg, heng;
let gradingsCopy = "";

function copyToClipboard(textToCopy) {
    navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
            // alert(`Copied the text: ${textToCopy}`);
            document.getElementById(
                "copy-status"
            ).innerHTML = `✅📋 Copied to Clipboard:</h1><h4>${textToCopy}`;
        })
        .catch((err) => {
            console.error("Error copying text: ", err);
        });
}

// get hadith
// gethadith("abudawud", 100, "eng", true).then((h) => { console.log(h.ar, h.en, h.grades[0].name + ": " + h.grades[0].grade); var gradings = ""; if (h.grades) { h.grades.forEach((grade) => { gradings += `${grade.name}: ${grade.grade}\n`; }); } console.log(gradings); }).catch((error) => { console.error("Error fetching data:", error); });
async function gethadith(book, num, lang, diatrics) {
    const url =
        "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/";
    // const url2 = "https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/editions/eng-muslim.min.json";
    // const url3 = "https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/editions/eng-muslim.json";

    // if districs false, set to 1 which means off. Else set to nothing which means On
    if (diatrics == "false") {
        diatrics = "1";
    }
    if (diatrics == "true") {
        diatrics = "";
    }

    try {
        // Fetch Arabic hadith
        // "link": "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-abudawud.json",

        const arResponse = await fetch(
            `${url}ara-${book}${diatrics}/${num}.min.json`
        );
        if (!arResponse.ok) {
            throw new Error("Failed to fetch Arabic Hadith");
        }
        const arData = await arResponse.json();

        // Fetch hadith in specified language
        const enResponse = await fetch(`${url}${lang}-${book}/${num}.min.json`);
        if (!enResponse.ok) {
            throw new Error("Failed to fetch Hadith");
        }
        const enData = await enResponse.json();

        if (enData.hadiths && arData.hadiths) {
            return {
                en: enData.hadiths[0].text,
                enName: enData.metadata.name,
                enChap: enData.hadiths[0].reference.book,
                enChapHadith: enData.hadiths[0].reference.hadith,
                enNum: enData.hadiths[0].hadithnumber,
                ar: arData.hadiths[0].text,
                grades: enData.hadiths[0].grades,
            };
        } else {
            throw new Error("Hadith data is not available");
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

function mohaddis_Fix(book, number) {
    switch (book) {
        case "bukhari":
            book = "Sahi-Bukhari";
            break;
        case "muslim":
            break;
        case "abudawud":
            book = "Abu-Daud";
            break;
        case "tirmidhi":
            book = "Tarimdhi";
            break;
        case "nasai":
            book = "Sunan-nasai";
            break;
        case "ibnmajah":
            book = "ibn-majah";
            break;
    }
    return `${site3}${book}/${number}`;
}

// MAIN
document.getElementById("urlForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // html values
    const book = document.getElementById("book").value;
    const lang = document.getElementById("lang").value;
    const numberInput = document.getElementById("numberInput").value;
    const diatrics = document.getElementById("diatrics").value;

    // url fixes
    const url1 = `${site1}${book}:${numberInput}`;
    const url2 = `${site2}${book}:${numberInput}`;
    const url3 = mohaddis_Fix(book, numberInput);

    // add increment and decrement buttons
    document.getElementById(
        "buttons"
    ).innerHTML = `<button type="submit" onclick="document.getElementById('numberInput').value = parseInt(document.getElementById('numberInput').value) - 1;" > Prev </button> - <button type="submit" onclick="document.getElementById('numberInput').value = parseInt(document.getElementById('numberInput').value) + 1;" > Next </button>`;

    // sunnahCom
    document.getElementById(
        "result"
    ).innerHTML = `<li><a href="${url1}" target="_blank">${url1}</a></li>`;

    // HadithHub
    document.getElementById(
        "result"
    ).innerHTML += `<li><a href="${url2}" target="_blank">${url2}</a> (Has many languages)</li>`;

    // Mohaddis
    document.getElementById(
        "result"
    ).innerHTML += `<li>Urdu: <a href="${url3}" target="_blank">${url3}</a></li>`;

    // hadith with grading
    gethadith(book, numberInput, lang, diatrics)
        .then((h) => {
            var gradings = "";
            gradingsCopy = "";
            if (h.grades) {
                gradings += `<br>`;
                h.grades.forEach((grade) => {
                    gradings += `<li>[${grade.grade}, ${grade.name}]</li>`;
                    gradingsCopy += ` (${grade.grade}, ${grade.name})`;
                });
                gradings += "<br>";
            }

            // buttons to copy
            if (h.enChapHadith == "0") {
                hadithDetails = `${h.enName} #${h.enNum}`;
            } else {
                hadithDetails = `${h.enName} #${h.enNum} (Chapter ${h.enChap}/${h.enChapHadith})`;
            }
            har = `${h.ar}\n\n[${hadithDetails}]`;
            hen = `${h.en}\n\n[${hadithDetails}]`;
            if (gradingsCopy == "") {
                full = `${h.ar}\n\n${h.en}\n\n[${hadithDetails}]`;
                harg = `${h.ar}\n\n[${hadithDetails}]`;
                heng = `${h.en}\n\n[${hadithDetails}]`;
            } else {
                full = `${h.ar}\n\n${h.en}\n\n[${hadithDetails}, Graded:${gradingsCopy}]`;
                harg = `${h.ar}\n\n[${hadithDetails}, Graded:${gradingsCopy}]`;
                heng = `${h.en}\n\n[${hadithDetails}, Graded:${gradingsCopy}]`;
            }

            // print hadith
            document.getElementById(
                "hadith"
            ).innerHTML = `${hadithDetails}<br><br>${h.ar} <br><br>${h.en} <br>${gradings}`;

            // copy by default
            copyToClipboard(full);

            // full button
            document.getElementById("hadith").innerHTML +=
                "<button onclick='copyToClipboard(full)'>Copy Full</button>";

            if (!gradingsCopy == "") {
                // Gradings button
                document.getElementById("hadith").innerHTML +=
                    "<li><button onclick='copyToClipboard(gradingsCopy)'>Copy Gradings</button></li>";

                // Arabic button
                document.getElementById("hadith").innerHTML +=
                    "<li><button onclick='copyToClipboard(har)'>Copy Arabic</button> - <button onclick='copyToClipboard(harg)'>Copy Arabic + Gradings</button></li>";

                // English button
                document.getElementById("hadith").innerHTML +=
                    "<li><button onclick='copyToClipboard(hen)'>Copy Translation</button> - <button onclick='copyToClipboard(heng)'>Copy Translation + Gradings</button>";
            } else {
                // Arabic button
                document.getElementById("hadith").innerHTML +=
                    "<li><button onclick='copyToClipboard(har)'>Copy Arabic</button></li>";

                // English button
                document.getElementById("hadith").innerHTML +=
                    "<li><button onclick='copyToClipboard(hen)'>Copy Translation</button></li>";
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            document.getElementById(
                "hadith"
            ).innerHTML = `Failed to get hadith ${numberInput} of ${book} in ${lang}`;
        });
});
