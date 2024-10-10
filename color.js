let color_picker = document.getElementById("color-picker");
let colors_border = document.querySelectorAll(".colors");

let color_picker_event_handler = () => {
    color_picker.classList.add("color-picker-checked");
    colors_border.forEach((color) => {
        color.checked = false;
    });
};

colors_border.forEach((color) => {
    color.addEventListener("click", () => {
        color_picker.classList.remove("color-picker-checked");
    });
});

color_picker.addEventListener("click", color_picker_event_handler);
color_picker.addEventListener("input", color_picker_event_handler);
