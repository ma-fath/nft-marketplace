import { nft1, nft2, nft3, nft4 } from "../model/nft-class.js";
import { createNftCard } from "../view/nft-card.js";
import { createNftModal } from "../view/nft-modal.js";
import {
  creator1,
  creator2,
  creator3,
  creator4,
} from "../model/creator-class.js";
import { createCreatorCard } from "../view/creator-card.js";
import { createCreatorModal, createCharts } from "../view/creator-modal.js";

//////////////////////////////////////////////////
// GLOBAL VARIABLES
//////////////////////////////////////////////////

// DOM ELEMENTS
const body = document.querySelector("body");
const allLinks = document.querySelectorAll("a:link");
const heroSection = document.querySelector(".hero-section");
const year = document.querySelector(".year");
const linkToTop = document.querySelector(".link-to-top");

const btnLogin = document.querySelector(".btn-login");
const btnSignup = document.querySelector(".btn-signup");
const modalAuthentication = document.querySelector(".authentication-modal");
const formLogin = document.querySelector("#form-login");
const formSignup = document.querySelector("#form-signup");

const nftsGrid = document.querySelector(".nfts-grid");
const creatorsGrid = document.querySelector(".creators-grid");

// OTHER VARIABLES
const nfts = [nft1, nft2, nft3, nft4];
const creators = [creator1, creator2, creator3, creator4];
let nftButtons = null;
let creatorButtons = null;
let dataModal = null;
let hours = 23;
let minutes = 59;
let seconds = 59;

//////////////////////////////////////////////////
// MISCELLANEOUS FUNCTIONS
//////////////////////////////////////////////////

// 1. SET CURRENT YEAR
const currentYear = new Date().getFullYear();
year.textContent = currentYear.toString();

//////////////////////////////////////////////////
// FUNCTIONS FOR PAGE NAVIGATION
//////////////////////////////////////////////////

// 2. SMOOTH SCROLLING ANIMATION
allLinks.forEach(function (link) {
  // Following conditional allows github.com anchor link to be functional
  if (link.hostname !== "github.com") {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const href = link.getAttribute("href");

      // Scroll back to top
      if (href === "#")
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

      // Scroll to other links
      if (href !== "#" && href.startsWith("#")) {
        const sectionEl = document.querySelector(href);
        sectionEl.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
});

// 3. STICKY NAVIGATION
const obs = new IntersectionObserver(
  function (entries) {
    const ent = entries[0];

    if (ent.isIntersecting === false) {
      document.body.classList.add("sticky");
    }

    if (ent.isIntersecting === true) {
      document.body.classList.remove("sticky");
    }
  },
  {
    root: null,
    threshold: 0,
    rootMargin: "-100%",
  }
);
obs.observe(heroSection);

// 4. SHOW LINK-TO-TOP BUTTON (500PX FROM TOP OF DOCUMENT)
window.onscroll = function () {
  if (
    document.body.scrollTop > 500 ||
    document.documentElement.scrollTop > 500
  ) {
    linkToTop.style.display = "block";
  } else {
    linkToTop.style.display = "none";
  }
};

//////////////////////////////////////////////////
// COMMON FUNCTIONS FOR ALL MODALS
//////////////////////////////////////////////////

// 5. CLOSE MODAL WHEN USER CLICKS OUTSIDE OF IT
window.onclick = function (event) {
  const currentModal = event.target;
  if (currentModal === modalAuthentication) {
    resetForm();
    currentModal.style.display = "none";
    body.style.overflowY = "scroll";
  }
  if (currentModal === dataModal) {
    currentModal.remove();
    body.style.overflowY = "scroll";
  }
};

// 6. WHEN USER CLICKS ON X, CLOSE THE MODAL
document.body.onclick = function (event) {
  const currentButton = event.target;
  if (currentButton.getAttribute("name") === "close-outline") {
    if (currentButton.closest(".authentication-modal")) {
      resetForm();
      modalAuthentication.style.display = "none";
      body.style.overflowY = "scroll";
    }
    if (currentButton.closest(".data-modal")) {
      dataModal.remove();
      body.style.overflowY = "scroll";
    }
  }
};

//////////////////////////////////////////////////
// FUNCTIONS FOR AUTHENTICATION MODALS
//////////////////////////////////////////////////

// 7. ENABLE MODAL FORM INTERACTION - LOGIN
btnLogin.onclick = function (event) {
  document.querySelector("#chk").checked = true;
  const currentButton = event.target;
  setModalOrigin(modalAuthentication, currentButton);
  showModal("AUTHENTICATION", modalAuthentication);
};

// 8. ENABLE MODAL FORM INTERACTION - SIGN UP
btnSignup.onclick = function (event) {
  document.querySelector("#chk").checked = false;
  const currentButton = event.target;
  setModalOrigin(modalAuthentication, currentButton);
  showModal("AUTHENTICATION", modalAuthentication);
};

//////////////////////////////////////////////////
// FUNCTIONS FOR NFT/CREATOR MODALS
//////////////////////////////////////////////////

// 9. AUTOMATE TIMER IMMEDIATELY WHEN MAIN WINDOW LOADS
window.onload = function () {
  setInterval(function () {
    let timer = document.querySelector(".timer");
    // Add leading 0 for numbers smaller than 10
    if (seconds < 10 && seconds.toString().length == 1) seconds = `0${seconds}`;
    if (minutes < 10 && minutes.toString().length == 1) minutes = `0${minutes}`;
    if (hours < 10 && hours.toString().length == 1) hours = `0${hours}`;
    // Update timer when modal HTML is loaded
    if (timer !== null)
      timer.textContent = hours + " : " + minutes + " : " + seconds;
    seconds--;
    if (seconds < 0) {
      minutes--;
      seconds = 59;
      if (minutes < 0) {
        hours--;
        minutes = 59;
      }
      if (hours < 0) {
        hours = 23;
      }
    }
  }, 1000);
};

// 10. ENABLE FLIP FUNCTIONALITY
const enableFlip = function (currentNFT) {
  const flipCard = document.querySelector(".flip-card");
  const nftModalContent = document.querySelector(".nft-modal-content");
  const currentCreator = creators.find((creator) => {
    return creator.name === currentNFT.creator;
  });
  // Insert HTML code
  flipCard.insertAdjacentHTML("beforeend", createCreatorModal(currentCreator));
  createCharts(currentCreator);
  // Remove unnecessary parent element card content
  const parent = flipCard.lastElementChild;
  parent.replaceWith(...parent.childNodes);
  // Add CSS style to enable flip
  const modalCreatorContent = document.querySelector(".modal-creator-content");
  modalCreatorContent.style.transform = "rotateY(180deg)";
  // Enable flip effect
  const modalCreatorLink = document.querySelector(".modal-creator-link");
  const modalGoBack = document.querySelector(".modal-go-back");
  modalCreatorLink.onclick = function () {
    flipCard.classList.toggle("is-flipped");
    modalGoBack.classList.remove("hidden");
  };
  modalGoBack.onclick = function () {
    flipCard.classList.toggle("is-flipped");
  };
};

// 11. SHOW MODAL WINDOW
const showModal = function (currentType, currentModal, currentNFT) {
  currentModal.style.display = "flex";
  body.style.overflow = "hidden";
  if (currentType === "NFT") enableFlip(currentNFT);
};

// 12. SET ORIGIN OF MODAL POPUP ANIMATION
const setModalOrigin = function (currentModal, currentButton) {
  const xPosition = currentButton.getBoundingClientRect().left;
  const yPosition = currentButton.getBoundingClientRect().top;
  currentModal.style.transformOrigin = `${xPosition}px ${yPosition}px`;
};

// 13. RESET FORMS WHEN CLOSING THEM
const resetForm = function () {
  document.getElementById(formLogin.id).reset();
  document.getElementById(formSignup.id).reset();
};

// 14. ENABLE MODAL FORM INTERACTION
const enableViewButtons = function (
  type,
  buttons,
  objectsArray,
  place,
  createModal
) {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].onclick = function (event) {
      const currentButton = event.target;
      // Add HTML code for modals - synchronous code
      place.insertAdjacentHTML("beforeend", createModal(objectsArray[i]));
      // Specify from where modal should appear
      dataModal = document.querySelector(".data-modal");
      setModalOrigin(dataModal, currentButton);
      // Add specific HTML code based on type of current modal
      if (type === "NFT") {
        document.querySelector(".timer").textContent =
          hours + " : " + minutes + " : " + seconds;
        showModal(type, dataModal, objectsArray[i]);
      }
      if (type === "CREATOR") {
        createCharts(objectsArray[i]);
        showModal(type, dataModal);
      }
    };
  }
};

// 15. ADD CARDS ON MAIN PAGE (2 TYPES: NFT AND CREATOR)
const createCards = function (objectsArray, place, createCard) {
  objectsArray.forEach((item) =>
    place.insertAdjacentHTML("beforeend", createCard(item))
  );
};

// 16. CONVERT ETH TO CAD
const convertETHtoCAD = async function () {
  try {
    const fromCurrency = "ethereum";
    const toCurrency = "cad";
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${fromCurrency}&vs_currencies=${toCurrency}`;
    const response = await fetch(url);
    const json = await response.json();
    return await json[fromCurrency][toCurrency];
  } catch (err) {
    console.error(`${err}`);
  }
};

// 17. ASYNCHRONOUS CODE
convertETHtoCAD()
  .then((oneETHprice) => {
    const numberFormatter = Intl.NumberFormat("en-US");
    nfts.forEach(function (nft) {
      const dollarValue = (oneETHprice * nft.ethereum).toFixed(2);
      nft.dollar = numberFormatter.format(dollarValue);
    });
  })
  .then(() => {
    createCards(nfts, nftsGrid, createNftCard);
    nftButtons = document.querySelectorAll(".nft-button");
    enableViewButtons("NFT", nftButtons, nfts, nftsGrid, createNftModal);
    createCards(creators, creatorsGrid, createCreatorCard);
    creatorButtons = document.querySelectorAll(".creator-button");
    enableViewButtons(
      "CREATOR",
      creatorButtons,
      creators,
      creatorsGrid,
      createCreatorModal
    );
  });
