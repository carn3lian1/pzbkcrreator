
const mainCont = document.getElementById("main");
const btnDivCont = document.getElementById("btnDiv");
const puzzleObj =
    [
        {
            "id": "8266990810",
            "name": "crossword",
            "status": "active",
            "img": "/web/assets/crossword.jpg",
            "short_desc": "Word game with interlocking clues to fill a grid of squares.",
            "desc": "Crossword puzzles are word games involving a grid of white and black squares. Clues, organized by number and direction, guide players to interlock words, requiring vocabulary and deductive skills for completion.",
            "category": "word puzzles"
        },
        {
            "id": "2604650856",
            "name": "word search",
            "status": "active",
            "img": "/web/assets/word_search.jpg",
            "short_desc": "Locate hidden words within a grid of letters, using given clues.",
            "desc": "A word search puzzle presents a grid of letters, containing a list of hidden words. Words can be found horizontally, vertically, diagonally, forwards, or backward, requiring keen observation to discover them all.",
            "category": "word puzzles"
        },
        {
            "id": "2272492575",
            "name": "sudoku",
            "status": "active",
            "img": "/web/assets/sudoku.jpg",
            "short_desc": "Number puzzle filling grid with 1-9, no repetition within rows/columns.",
            "desc": "Sudoku is a number-based logic puzzle. A 9x9 grid is divided into 3x3 subgrids. The goal is to fill the grid with digits 1-9, ensuring no repetition within rows, columns, or subgrids.",
            "category": "math puzzles"
        },
        {
            "id": "227249243575",
            "name": "maze",
            "status": "active",
            "img": "/web/assets/labyrinthine_puzzle.jpg",
            "short_desc": "Navigate paths to reach the goal through twists and turns.",
            "desc": "A maze puzzle is a labyrinthine challenge where the objective is to find a path from a starting point to a designated endpoint, often navigating through intricate passages, dead-ends, and choices.",
            "category": "maze puzzles"
        },
        {
            "id": "2380971462",
            "name": "cryptogram",
            "status": "active",
            "img": "/web/assets/cryptogram.jpg",
            "short_desc": "Code-based puzzle: Substitute letters with symbols to decode hidden message.",
            "desc": "A cryptogram puzzle encodes a message by substituting each letter with another letter or symbol. Solvers use patterns, letter frequency, and deduction to unveil the concealed text's meaning.",
            "category": "logic puzzles"
        },
        {
            "id": "2933839152",
            "name": "fillomino",
            "status": "active",
            "img": "/web/assets/filomino.jpg",
            "short_desc": "Grid puzzle dividing regions while respecting digit quantity per area.",
            "desc": "A Fillomino puzzle tasks solvers with partitioning a grid into contiguous regions. Each region contains a specific number of cells, indicated by the number in that region. The challenge lies in strategizing how to divide the grid while adhering to these quantity constraints.",
            "category": "math puzzles"
        },
        {
            "id": "556674886",
            "name": "hashi",
            "status": "active",
            "img": "/web/assets/hashi.jpg",
            "short_desc": "Connect islands with bridges, adhering to numerical bridge limits.",
            "desc": "A Hashi puzzle involves connecting a set of islands using bridges. The number on each island indicates how many bridges must connect to it. Logical reasoning is essential to complete the interconnected bridge network.",
            "category": "logic puzzles"
        },
        {
            "id": "9079324324212342312437",
            "name": "kenken",
            "status": "active",
            "img": "/web/assets/kenken.jpg",
            "short_desc": "Math puzzle: Fill grid with numbers, using arithmetic and constraints.",
            "desc": "A KenKen puzzle requires filling a grid with numbers, adhering to mathematical constraints and ensuring that no repeated digit appears in any row or column. Arithmetic operations provide solving hints.",
            "category": "math puzzles"
        },
        {
            "id": "2964639661",
            "name": "arithmagon",
            "status": "active",
            "img": "/web/assets/arithmagon.jpg",
            "short_desc": "Numeric puzzle: Fill cells, find missing number based on arithmetic.",
            "desc": "An Arithmagon puzzle involves a geometric shape divided into cells, each containing a number. The challenge is to determine the missing number by applying arithmetic operations to adjacent cell values.",
            "category": "math puzzles"
        },
        {
            "id": "88937015",
            "name": "masyu",
            "status": "active",
            "img": "/web/assets/maysu.jpg",
            "short_desc": "Number puzzle: Fill grid, ensure each row/column contains consecutive digits.",
            "desc": "A masyu puzzle tasks solvers with populating a grid with consecutive numbers. Each row and column must contain a series of consecutive digits, adding a spatial logic challenge to the number puzzle.",
            "category": "logic puzzles"
        },
        {
            "id": "5770951815",
            "name": "binary",
            "status": "active",
            "img": "/web/assets/binary.jpg",
            "short_desc": "Logic puzzle: Fill grid with 0s and 1s, following placement rules.",
            "desc": "A binary puzzle involves a grid where cells must be filled with either 0 or 1. Each row and column should adhere to specific rules, creating a logical challenge of deduction and elimination.",
            "category": "logic puzzles"
        },
        {
            "id": "2599404314",
            "name": "kakuro",
            "status": "active",
            "img": "/web/assets/kakuro.jpg",
            "short_desc": "Number puzzle: Fill grid with digits, meeting sum constraints horizontally/vertically.",
            "desc": "A Kakuro puzzle involves a grid where players fill in cells with numbers, aiming to meet sum constraints given for each horizontal or vertical group of cells. It combines math and logic skills.",
            "category": "math puzzles"
        },
        {
            "name": "cryptic crossword",
            "id": "6770951816",
            "status": "active",
            "img": "/web/assets/cryptic.png",
            "short_desc": "A crossword puzzle with clues that require clever, wordplay-based solving.",
            "desc": "A cryptic crossword is a word puzzle that features clues with hidden or indirect meanings, often requiring creative thinking and wordplay to solve.",
            "category": "word puzzles"
        },
        {
            "name": "hitori",
            "id": "67708761816",
            "status": "active",
            "img": "/web/assets/hitori.png",
            "short_desc": "Eliminate numbers by shading squares so no duplicates in each row/column.",
            "desc": "A Hitori puzzle involves eliminating numbers by shading squares so that no duplicates exist in each row or column.",
            "category": "logic puzzles"
        },
        {
            "name": "kakurasu",
            "id": "677009012816",
            "status": "active",
            "img": "/web/assets/kakurasu.png",
            "short_desc": "Fill a grid, summing numbered squares in rows and columns accurately.",
            "desc": "Kakurasu involves filling a grid, with sums in rows and columns matching target values, using logic to place the right numbers.",
            "category": "logic puzzles"
        },
        {
            "name": "nonogram",
            "id": "901829309012816",
            "status": "active",
            "img": "/web/assets/nonogram.png",
            "short_desc": "A grid puzzle where cells are filled or left empty strategically.",
            "desc": "In a Nonogram puzzle, you fill a grid by strategically shading or leaving squares blank to reveal a hidden picture based on numerical clues.",
            "category": "math puzzles"
        },
        {
            "name": "math squares",
            "id": "9482930901212",
            "status": "active",
            "img": "/web/assets/math_squares.png",
            "short_desc": "Fill a grid with numbers, ensuring each row/column adds up correctly.",
            "desc": "A Math Square puzzle requires filling a grid with numbers to ensure that each row and column adds up correctly to a specified total.",
            "category": "math puzzles"
        },
        {
            "name": "nurikabe",
            "id": "99273201212",
            "status": "active",
            "img": "/web/assets/nurikabe.png",
            "short_desc": "Connect islands in a grid, following specific rules to solve the puzzle.",
            "desc": "A Nurikabe puzzle involves connecting islands in a grid while following specific rules to ensure that no islands touch, and the numbers on the islands indicate the number of connected cells.",
            "category": "logic puzzles"
        },
        {
            "name": "reverse word search",
            "id": "1239273201290",
            "status": "active",
            "img": "/web/assets/rws.png",
            "short_desc": "Find listed words in grid, but unused letters reveal a message.",
            "desc": "In a Reverse Word Search puzzle, you find hidden words within a grid, and the unused letters reveal a message or phrase.",
            "category": "word puzzles"
        },
        {
            "name": "shakashaka",
            "id": "123927320172",
            "status": "active",
            "img": "/web/assets/shakashaka.png",
            "short_desc": "Fill grid, numbers indicate group size, no touching orthogonally or diagonally.",
            "desc": "In a Shakashaka puzzle, you must fill a grid by placing numbers that indicate the size of connected groups while ensuring that no cells touch each other orthogonally or diagonally.",
            "category": "logic puzzles"
        },
        {
            "name": "shikaku",
            "id": "713927320172",
            "status": "active",
            "img": "/web/assets/shikaku.png",
            "short_desc": "Divide grid into rectangles, each containing the indicated number of cells.",
            "desc": "A Shikaku puzzle tasks you with dividing a grid into rectangles, with each rectangle containing a specified number of cells, without overlapping.",
            "category": "logic puzzles"
        },
        {
            "name": "shingoki",
            "id": "713927320852",
            "status": "active",
            "img": "/web/assets/shingoki.png",
            "short_desc": "Connect circles with lines, ensuring each number has the right connections.",
            "desc": "A Shingoki puzzle involves connecting circles with lines while ensuring that each number on the grid has the correct number of connections.",
            "category": "math puzzles"
        },
        {
            "name": "slitherLink",
            "id": "32043927320852",
            "status": "active",
            "img": "/web/assets/slitherlink.png",
            "short_desc": "Connect dots with a single loop; numbers indicate adjacent connections.",
            "desc": "A Slitherlink puzzle requires connecting dots with a single loop while adhering to specific number-based connectivity rules, resulting in a closed loop without any crossings.",
            "category": "logic puzzles"
        },
        {
            "name": "stitches",
            "id": "32471920320852",
            "status": "active",
            "img": "/web/assets/stitches.png",
            "short_desc": "Connect numbered dots using straight lines, following set connectivity rules.",
            "desc": "A Stitches puzzle involves connecting numbered dots using straight lines while following specific connectivity rules, creating a pattern without any intersections.",
            "category": "logic puzzles"
        }
    ]
/*
1. check if logged in to main site
2. if not logged in, show log in button pointing to the auth page
3. if logged in, show the generate button pointing to catalog page
*/

function openTab(url) {
    chrome.tabs.create({
        url: url
    })
}

function RenderPuzzleListHTML() {
    let html = ""

    for (let i in puzzleObj) {
        html += `
        <li id = "${puzzleObj[i].id}">${puzzleObj[i].name}</li>
        `
    }

    mainCont.innerHTML = `
    <ul id="puzzleList">
        ${html}
    </ul>

    `
}
(async () => {
    let res = await chrome.runtime.sendMessage({
        message: "from-popup-checkauth"
    })

    if (res.status) {
        //logged in so render the generate button

        RenderPuzzleListHTML()



        btnDivCont.innerHTML = `
            <p>generate a puzzle book</p>
            <button id="generate">generate</button>
            `
    }

    else if (!res.status) {
        //not logged in so render the login button
        mainCont.innerHTML = `
            <p>1. click the login button below</p>
            <p>2. after login into the website, </p>
            <p>come back to this extension</p>
            <button id="login">login</button>
            
            `

        btnDivCont.remove()

    }

})()


document.addEventListener("click", function (e) {
    const gentarget = e.target.closest("#generate"); // Or any other selector.
    const logintarget = e.target.closest("#login"); // Or any other selector.
    const puzzleListtarget = e.target.closest("#puzzleList"); // Or any other selector.
    const backtarget = e.target.closest("#back"); // Or any other selector.


    if (gentarget) {
        openTab("https://puzzlebook-creator-online.onrender.com/catalog")
    }

    else if (logintarget) {
        openTab("https://puzzlebook-creator-online.onrender.com/login")
    }

    else if (backtarget) {
        RenderPuzzleListHTML()

    }

    else if (puzzleListtarget) {
        console.log("single puzzle clicked", e.target.id);
        let sPuzzle = {}

        for (let i in puzzleObj) {
            if (puzzleObj[i].id === e.target.id) {
                sPuzzle = puzzleObj[i]
                break
            }
        }


        mainCont.innerHTML = `
        <button id="back">back</button>

        <p> <b>puzzle name:</b> ${sPuzzle.name}</p>
        
        <p> <b>puzzle status:</b> ${sPuzzle.status}</p>
        
        <p><b>description:</b> ${sPuzzle.desc}</p>
        
        `
    }

})
