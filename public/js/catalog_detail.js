
let selectedPlatform = ""
let includeTutorial = ""
let page_size = ""
let pageNum = ""

const currentUrl = window.location.href

const generateBtn = document.getElementById("generate_manu_final");
const errorEl = document.getElementById("error");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const closeModalBtn = document.querySelector(".close-modal")

const sidebarEl = document.getElementById("manuscript_sidebar")

let detailEL = document.getElementById("detail_container")

const optionMenu = document.querySelector(".select-menu"),
  selectBtn = optionMenu.querySelector(".select-btn"),
  options = optionMenu.querySelectorAll(".option"),
  sBtn_text = optionMenu.querySelector(".sBtn-text");

let modeSwitch = document.querySelector('.mode-switch');

let pageInfoEl = document.getElementById("pageInfo")

modeSwitch.addEventListener('click', function () {
  document.documentElement.classList.toggle('light');
  modeSwitch.classList.toggle('active');
});



function toggleModalAndOverlay() {
  modal.classList.toggle("hidden")
  overlay.classList.toggle("hidden")

}

closeModalBtn.addEventListener("click", toggleModalAndOverlay)
overlay.addEventListener("click", toggleModalAndOverlay)


function showErrorMessage(message) {
  detailEL.innerHTML = `
  <div class="flexbox">
  <div>
    <div class="nb-danger"></div>
  </div>
  <br>
  <p>
    ${message}
  </p>
  </div>
  
  `
  errorEl.textContent = message

  errorEl.style.opacity = 1
  setTimeout(() => {
    errorEl.style.opacity = 0

  }, 15000);
}


generateBtn.addEventListener("click", async function (e) {

  console.log("hit the endpoint with the details");
  // console.log(selectedPlatform);
  // console.log(pageNum);
  // console.log(page_size);
  // console.log(includeTutorial);

  document.getElementById("gen_manu_btn").style.display = "none"

  pageInfoEl.innerText = "ATTENTION: please don't close this tab as the document is being generated"
  toggleModalAndOverlay()


  detailEL.innerHTML = `
  <div class="flexbox">
  <!--  NO BORDER SPINNER  -->
  <div>
    <div class="nb-spinner"></div>
  </div>
  <br>
  <p>
    your manuscript is being created. It should take about 5 minutes. Please wait...
  </p>
  </div>
  
  `

  const selectedPuzzleIdList = currentUrl.split("detail/").pop().split(",");

  try {

    const res = await axios({
      method: "POST",
      url: "/man/generate",
      data: {
        selectedPlatform: selectedPlatform,
        pageNum: pageNum,
        page_size: page_size,
        includeTutorial: includeTutorial,
        selectedPuzzleIdList: selectedPuzzleIdList
      }

    })


    // 
    if (res.status === 200) {

      location.assign("/catalog-result")

    }

    else {
      showErrorMessage("something went wrong");
    }
  } catch (error) {
    console.log(error);
    showErrorMessage(error.response.data.message)

  }


})


selectBtn.addEventListener("click", () => {
  optionMenu.classList.toggle("active")
}
);


options.forEach((option) => {
  option.addEventListener("click", () => {
    selectedPlatform = option.querySelector(".option-text").innerText;
    sBtn_text.innerText = selectedPlatform;

    if (selectedPlatform === "Amazon KDP") {

      document.getElementById("title")?.remove()
      document.getElementById("size_form")?.remove()
      document.getElementById("gen_manu_btn")?.remove()
      sidebarEl.insertAdjacentHTML("beforeend", `
            
            <label for="pageNum" id="title">SELECT PAGE SIZE (in cm)</label>
            <form  id="size_form">
            <p>
            <input id="kdp_dim0" type="radio" name="radio-group" checked=""/>
            <label for="kdp_dim1">10.16x15.24</label>
          </p>
              <p>
                <input id="kdp_dim1" type="radio" name="radio-group"/>
                <label for="kdp_dim1">12.7x20.32</label>
              </p>
              <p>
                <input id="kdp_dim2" type="radio" name="radio-group"/>
                <label for="kdp_dim2">13.34x20.32</label>
              </p>
              <p>
                <input id="kdp_dim3" type="radio" name="radio-group"/>
                <label for="kdp_dim3">13.97x21.59</label>
              </p>
              <p>
              <input id="kdp_dim4" type="radio" name="radio-group"/>
              <label for="kdp_dim4">15.24x22.86</label>
            </p>
            </form>
            <a id="gen_manu_btn" class="btn btn-border-3" >Generate Manuscript</a>
            `)

    }

    else if (selectedPlatform === "LULU") {
      document.getElementById("title")?.remove()
      document.getElementById("size_form")?.remove()
      document.getElementById("gen_manu_btn")?.remove()
      sidebarEl.insertAdjacentHTML("beforeend", `
            <label for="pageNum" id="title">SELECT PAGE SIZE</label>
            <form  id="size_form">
              <p>
                <input id="lulu_dim1" type="radio" name="radio-group" checked=""/>
                <label for="lulu_dim1">Pocket Book (4.25 x 6.875 in / 108 x 175 mm)</label>
              </p>
              <p>
                <input id="lulu_dim2" type="radio" name="radio-group"/>
                <label for="lulu_dim2">Novella (5 x 8 in / 127 x 203 mm)</label>
              </p>
              <p>
                <input id="lulu_dim3" type="radio" name="radio-group"/>
                <label for="lulu_dim3">Digest (5.5 x 8.5 in / 140 x 216 mm)</label>
              </p>
              <p>
                <input id="lulu_dim4" type="radio" name="radio-group"/>
                <label for="lulu_dim4">A5 (5.83 x 8.27 in / 148 x 210 mm)</label>
              </p>
              <p>
                <input id="lulu_dim5" type="radio" name="radio-group"/>
                <label for="lulu_dim5">US Trade (6 x 9 in / 152 x 229 mm)</label>
              </p>
              <p>
                <input id="lulu_dim6" type="radio" name="radio-group"/>
                <label for="lulu_dim6">Royal (6.14 x 9.21 in / 156 x 234 mm)</label>
              </p>
              <p>
                <input id="lulu_dim7" type="radio" name="radio-group"/>
                <label for="lulu_dim7">Executive (7 x 10 in / 178 x 254 mm)</label>
              </p>
              <p>
                <input id="lulu_dim8" type="radio" name="radio-group"/>
                <label for="lulu_dim8">Crown Quarto (7.44 x 9.68 in / 189 x 246 mm)</label>
              </p>                              
            </form>
            <a id="gen_manu_btn" class="btn btn-border-3" >Generate Manuscript</a>
            `)

    }

    optionMenu.classList.remove("active");
  });
});

document.body.addEventListener('click', function (event) {
  if (event.target.id == 'gen_manu_btn') {
    //show a dialog box that then hits the api with the extracted metadata

    pageNum = document.getElementById("pageNum").value


    if (pageNum < 100 || pageNum > 400) {
      console.log("please enter value between 50 and 400");
    }


    const yesRadio = document.getElementById("yes").checked
    const noRadio = document.getElementById("no").checked

    if (yesRadio) includeTutorial = "yes"
    if (noRadio) includeTutorial = "no"



    if (selectedPlatform === "Amazon KDP") {

      const kdpdim0Val = document.getElementById("kdp_dim0").checked
      const kdpdim1Val = document.getElementById("kdp_dim1").checked
      const kdpdim2Val = document.getElementById("kdp_dim2").checked
      const kdpdim3Val = document.getElementById("kdp_dim3").checked
      const kdpdim4Val = document.getElementById("kdp_dim4").checked

      if (kdpdim0Val) page_size = "10.16x15.24"
      if (kdpdim1Val) page_size = "12.7x20.32"
      if (kdpdim2Val) page_size = "13.34x20.32"
      if (kdpdim3Val) page_size = "13.97x21.59"
      if (kdpdim4Val) page_size = "15.24x22.86"

    }

    else if (selectedPlatform === "LULU") {

      const luludim1Val = document.getElementById("lulu_dim1").checked
      const luludim2Val = document.getElementById("lulu_dim2").checked
      const luludim3Val = document.getElementById("lulu_dim3").checked

      if (luludim1Val) page_size = "1*1"
      if (luludim2Val) page_size = "2*2"
      if (luludim3Val) page_size = "3*3"

    }

    console.log("manuscript size: ", pageNum);
    console.log("include tutorial", includeTutorial);
    console.log("platform:", selectedPlatform, " PAGE SIZE? ", page_size);

    const modalParagragh = document.getElementById("manuscript_details")

    modalParagragh.innerText = `
    platform: ${selectedPlatform}\n
    number of pages: ${pageNum}\n
    page size: ${page_size}\n
    include tutorial: ${includeTutorial}\n
    `

    toggleModalAndOverlay()


  };
});


const testGenBtn = document.getElementById("generate_manu_test")

testGenBtn.addEventListener("click", async function (e) {

  const selectedPuzzleIdList = currentUrl.split("detail/").pop().split(",");
  console.log(selectedPuzzleIdList);

  try {

    const res1 = await axios({
      method: "POST",
      url: "/man/test-generate",
      data: {
        selectedPlatform: "Amazon KDP",
        pageNum: 500,
        page_size: "15.24x22.86",
        includeTutorial: "NO",
        selectedPuzzleIdList: selectedPuzzleIdList
      }
    })


    if (res1.status === 200) {
      window.location.href = "/catalog-result/"
    }
    else {
      console.log("something went wrong");
    }
  } catch (error) {
    console.log(error);

    showErrorMessage(error.response.data.message)

  }



})