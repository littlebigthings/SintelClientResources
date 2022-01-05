
const container = document.querySelector(".feature-plan-container");
const featureContent = document.querySelectorAll(".feature-content");
const featureTab = document.querySelectorAll(".feature-tab");
const featureArrow = document.querySelectorAll(".feature-arrow");

container.addEventListener("click", function (e) {
  const clicked = e.target.closest(".feature-tab");

  if (!clicked) return;

  featureContent.forEach((tab) => {
    tab.style.maxHeight = "0em";
    tab.style.marginTop = "0em";
  });

  const content = clicked.querySelector(".feature-content");

  featureTab.forEach((tab) => {
    tab.style.color = "#5f95fc";
  });

  featureArrow.forEach((arrow) => {
    arrow.style.transform = "rotate(-90deg)";
  });

  if (!content) return;

  content.style.marginTop = "1.3em";
  content.style.maxHeight = "5em";
  
  clicked.style.color = "#340D45";
  
  const arrow = clicked.querySelector(".feature-arrow");
  arrow.style.transform = "rotate(0deg)";
});
