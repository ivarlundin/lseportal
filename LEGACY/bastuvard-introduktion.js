let step = 1;
let elementID;

function triggerNextStep() {
    elementID = "step" + step;
    document.getElementById(elementID).classList.remove("active");

    step++;

    elementID = "step" + step;
    document.getElementById(elementID).classList.add("active");
}
