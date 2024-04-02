document.querySelector(".jsFilter").addEventListener("click", function () {
    document.querySelector(".filter-menu").classList.toggle("active");
});
/**
 

document.querySelector(".grid").addEventListener("click", function () {
    document.querySelector(".list").classList.remove("active");
    document.querySelector(".grid").classList.add("active");
    document.querySelector(".products-area-wrapper").classList.add("gridView");
    document
        .querySelector(".products-area-wrapper")
        .classList.remove("tableView");
});

document.querySelector(".list").addEventListener("click", function () {
    document.querySelector(".list").classList.add("active");
    document.querySelector(".grid").classList.remove("active");
    document.querySelector(".products-area-wrapper").classList.remove("gridView");
    document.querySelector(".products-area-wrapper").classList.add("tableView");
});

 */
let puzzleIds = []
let fabEl = document.getElementById("fab")
if (puzzleIds.length !== 0) {
    fabEl.classList.remove("hidden")

}
else {
    fabEl.classList.add("hidden")

}

fabEl.addEventListener("click", async function (e) {
    //hit endpoint with list of puzzle ids

    const idList = puzzleIds.join(",")
    // console.log(String(puzzleIds));
    // console.log(puzzleIds.toString());
    const endpoint = `/catalog-detail/${idList}`

    location.assign(endpoint)




})

document.addEventListener("click", function (e) {

    if (e.target.type === "checkbox") {
        // console.log("element id: ", e.target.id);
        const checkboxId = e.target.id
        const checkboxEL = document.getElementById(checkboxId)

        if (checkboxEL.checked && !puzzleIds.includes(checkboxId)) {

            puzzleIds.push(checkboxId)
        }

        else if (!checkboxEL.checked && puzzleIds.includes(checkboxId)) {
            const index = puzzleIds.indexOf(checkboxId);
            if (index > -1) { // only splice array when item is found
                puzzleIds.splice(index, 1); // 2nd parameter means remove one item only
            }

        }

        else {
            console.log("else");

        }

        if (puzzleIds.length !== 0) {
            fabEl.classList.remove("hidden")

        }
        else {
            fabEl.classList.add("hidden")

        }

    };
})

let modeSwitch_main = document.querySelector('.mode-switch');
modeSwitch_main.addEventListener('click', function () {
    document.documentElement.classList.toggle('light');
    modeSwitch_main.classList.toggle('active');
});

