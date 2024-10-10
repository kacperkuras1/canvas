//Zmienne
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let colors = document.querySelectorAll('[name="color"]');
let size = document.querySelector("#size");
let clear_btn = document.querySelector("#clear");
let undo_btn = document.querySelector("#undo");
let save_btn = document.querySelector("#save");
let tools = document.querySelectorAll('[name="tool"]');
let brush_type = "brush";
let brush_color = "black";
let brush_size = size.value;
let is_drawing = false;
let history = [];
let previewDiv = document.createElement("div");

document.body.appendChild(previewDiv);
console.log(tools);

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);
history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
console.log(history);

//Ustawianie Listenerów
canvas.addEventListener("mousedown", start_drawing);
canvas.addEventListener("mousemove", draw);

canvas.addEventListener("mouseup", stop_drawing);
canvas.addEventListener("mouseout", stop_drawing);
canvas.addEventListener("mousemove", updatePreview);

canvas.addEventListener("mouseover", () => {
    previewDiv.classList.add("cursor-preview");
    previewDiv.style.display = "block";
});

canvas.addEventListener("mouseout", () => {
    previewDiv.classList.remove("cursor-preview");
    previewDiv.style.display = "none";
});

tools.forEach((tool) => {
    tool.addEventListener("input", () => {
        brush_type = tool.value;
        // console.log(tool.value);
    });
});

clear_btn.addEventListener("click", () => {
    ctx.fillStyle = "white";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    history = [];
    history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
});

undo_btn.addEventListener("click", () => {
    if (history.length > 1) {
        history.pop();
        ctx.putImageData(history[history.length - 1], 0, 0);
    }
    console.log(history);
});

save_btn.addEventListener("click", () => {
    let link = document.createElement("a");
    link.download = "zdjecie.png";
    link.href = canvas.toDataURL();
    link.click();
    link.delete;
});

colors.forEach((color) => {
    color.addEventListener("input", () => {
        brush_color = color.value;
    });
});

size.addEventListener("input", (event) => {
    brush_size = size.value;
    event.preventDefault();
});

function start_drawing(event) {
    is_drawing = true;
    ctx.beginPath();
    ctx.moveTo(
        event.clientX - canvas.offsetLeft,
        event.clientY - canvas.offsetTop
    );
    draw(event);
    event.preventDefault();
}

function stop_drawing(event) {
    if (is_drawing) {
        ctx.stroke();
        ctx.closePath();
        is_drawing = false;
        history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        console.log(history);
    }
    event.preventDefault();
}

function draw(event) {
    if (is_drawing) {
        switch (brush_type) {
            case "brush":
                brush(event);
                break;
            case "pencil":
                pencil(event);
                break;
            case "spray":
                spray(event);
                break;
            case "eraser":
                eraser(event);
                break;
            // case "circle":
            //     circle(event);
            //     break;
            // case "rectangle":
            //     rectangle(event);
            //     break;
            // case "triangle":
            //     triangle(event);
            //     break;
        }
    }
    event.preventDefault();
}

function brush(event) {
    ctx.lineTo(
        event.clientX - canvas.offsetLeft,
        event.clientY - canvas.offsetTop
    );
    ctx.strokeStyle = brush_color;
    ctx.lineWidth = brush_size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
}

function pencil(event) {
    x = event.clientX - canvas.offsetLeft;
    y = event.clientY - canvas.offsetTop;

    ctx.fillStyle = brush_color;

    ctx.fillRect(
        x - brush_size / 2,
        y - brush_size / 2,
        brush_size,
        brush_size
    );
}

function spray(event) {
    x = event.clientX - canvas.offsetLeft;
    y = event.clientY - canvas.offsetTop;

    ctx.fillStyle = brush_color;

    for (let i = 0; i < 20 * brush_size; i++) {
        angle = Math.random() * 2 * Math.PI;
        radius = Math.random() * brush_size;

        offsetX = Math.cos(angle) * radius;
        offsetY = Math.sin(angle) * radius;

        ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
    }
}

function eraser(event) {
    ctx.lineTo(
        event.clientX - canvas.offsetLeft,
        event.clientY - canvas.offsetTop
    );
    ctx.strokeStyle = "white";
    ctx.lineWidth = brush_size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
}
// function circle(event) {
//     console.log("circle");
// }

// function rectangle(event) {
//     console.log("rectangle");
// }

// function triangle(event) {
//     console.log("triangle");
// }

function updatePreview(event) {
    previewDiv.innerHTML = "";
    const x = event.clientX;
    const y = event.clientY;

    previewDiv.style.left = x - brush_size / 2 + "px";
    previewDiv.style.top = y - brush_size / 2 + "px";

    switch (brush_type) {
        case "brush":
            previewDiv.style.width = brush_size + "px";
            previewDiv.style.height = brush_size + "px";
            previewDiv.style.backgroundColor = brush_color;
            previewDiv.style.borderRadius = "50%";
            previewDiv.style.opacity = "0.7";
            break;
        case "pencil":
            previewDiv.style.width = brush_size + "px";
            previewDiv.style.height = brush_size + "px";
            previewDiv.style.backgroundColor = brush_color;
            previewDiv.style.borderRadius = "0";
            previewDiv.style.opacity = "1";
            break;
        case "eraser":
            previewDiv.style.width = brush_size + "px";
            previewDiv.style.height = brush_size + "px";
            previewDiv.style.backgroundColor = "white";
            previewDiv.style.borderRadius = "50%";
            previewDiv.style.opacity = "1";
            previewDiv.style.border = "1px solid grey";
            break;
        case "spray":
            previewDiv.style.left = x - brush_size + "px";
            previewDiv.style.top = y - brush_size + "px";
            previewDiv.style.width = brush_size * 2 + "px";
            previewDiv.style.height = brush_size * 2 + "px";
            previewDiv.style.borderRadius = "50%";
            previewDiv.style.backgroundColor = "transparent";
            previewDiv.style.opacity = "1";
            previewDiv.style.border = `1px solid ${brush_color}`;
            break;
    }
}
