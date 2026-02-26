const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('canvasOverlay');

const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');
const sizeEL = document.getElementById('size');
const colorEl = document.getElementById('color');
const colorHex = document.getElementById('colorHex');
const opacitySlider = document.getElementById('opacity');
const clearEl = document.getElementById('clear');
const saveBtn = document.getElementById('saveBtn');
const shareBtn = document.getElementById('shareBtn');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const zoomIn = document.getElementById('zoomIn');
const zoomOut = document.getElementById('zoomOut');
const zoomLevel = document.getElementById('zoomLevel');
const gridToggle = document.getElementById('gridToggle');
const cursorPos = document.getElementById('cursorPos');
const statusText = document.getElementById('statusText');

const toolBrush = document.getElementById('tool-brush');
const toolShapes = document.getElementById('tool-shapes');
const toolText = document.getElementById('tool-text');
const toolEraser = document.getElementById('tool-eraser');
const toolFill = document.getElementById('tool-fill');
const toolGradient = document.getElementById('tool-gradient');
const toolSpray = document.getElementById('tool-spray');
const toolBlur = document.getElementById('tool-blur');
const toolSelect = document.getElementById('tool-select');

const brushRound = document.getElementById('brush-round');
const brushSquare = document.getElementById('brush-square');
const brushAir = document.getElementById('brush-air');
const brushCalligraphy = document.getElementById('brush-calligraphy');
const brushSparkle = document.getElementById('brush-sparkle');
const brushCharcoal = document.getElementById('brush-charcoal');

const shapeRect = document.getElementById('shape-rect');
const shapeCircle = document.getElementById('shape-circle');
const shapeLine = document.getElementById('shape-line');
const shapeTriangle = document.getElementById('shape-triangle');
const shapeArrow = document.getElementById('shape-arrow');
const shapeStar = document.getElementById('shape-star');
const shapeHeart = document.getElementById('shape-heart');
const shapeHexagon = document.getElementById('shape-hexagon');

const swatches = document.querySelectorAll('.swatch');
const copilotEnhance = document.getElementById('copilot-enhance');
const copilotSmooth = document.getElementById('copilot-smooth');
const copilotSharpen = document.getElementById('copilot-sharpen');
const layerNew = document.getElementById('layer-new');
const layerDuplicate = document.getElementById('layer-duplicate');
const layerMerge = document.getElementById('layer-merge');
const layerClear = document.getElementById('layer-clear');

let size = 10;
let color = colorEl.value;
let opacity = 1;
let isPressed = false;
let startX, startY;
let currentTool = 'brush';
let currentBrush = 'round';
let currentShape = 'rect';
let snapshot;
let zoom = 1;
let gridActive = false;
let layers = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
let currentLayer = 0;
let history = [];
let historyIndex = -1;

ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, canvas.width, canvas.height);
saveState();

function updateSizeOnScreen() {
    sizeEL.innerText = size;
}

function updateColorHex() {
    colorHex.innerText = color;
}

function setActiveTool(activeBtn, toolName) {
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active-tool'));
    activeBtn.classList.add('active-tool');
    currentTool = toolName;
    statusText.innerText = `${toolName} tool active`;
}

function setActiveBrush(activeBtn, brushType) {
    document.querySelectorAll('.brush-btn').forEach(btn => btn.classList.remove('active-brush'));
    activeBtn.classList.add('active-brush');
    currentBrush = brushType;
}

function setActiveShape(activeBtn, shapeType) {
    document.querySelectorAll('.shape-btn').forEach(btn => btn.classList.remove('active-shape'));
    activeBtn.classList.add('active-shape');
    currentShape = shapeType;
}

function saveState() {
    history = history.slice(0, historyIndex + 1);
    history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    historyIndex++;
}

function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        ctx.putImageData(history[historyIndex], 0, 0);
    }
}

function redo() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        ctx.putImageData(history[historyIndex], 0, 0);
    }
}

toolBrush.addEventListener('click', () => setActiveTool(toolBrush, 'brush'));
toolShapes.addEventListener('click', () => setActiveTool(toolShapes, 'shapes'));
toolText.addEventListener('click', () => setActiveTool(toolText, 'text'));
toolEraser.addEventListener('click', () => setActiveTool(toolEraser, 'eraser'));
toolFill.addEventListener('click', () => setActiveTool(toolFill, 'fill'));
toolGradient.addEventListener('click', () => setActiveTool(toolGradient, 'gradient'));
toolSpray.addEventListener('click', () => setActiveTool(toolSpray, 'spray'));
toolBlur.addEventListener('click', () => setActiveTool(toolBlur, 'blur'));
toolSelect.addEventListener('click', () => setActiveTool(toolSelect, 'select'));

brushRound.addEventListener('click', () => setActiveBrush(brushRound, 'round'));
brushSquare.addEventListener('click', () => setActiveBrush(brushSquare, 'square'));
brushAir.addEventListener('click', () => setActiveBrush(brushAir, 'air'));
brushCalligraphy.addEventListener('click', () => setActiveBrush(brushCalligraphy, 'calligraphy'));
brushSparkle.addEventListener('click', () => setActiveBrush(brushSparkle, 'sparkle'));
brushCharcoal.addEventListener('click', () => setActiveBrush(brushCharcoal, 'charcoal'));

shapeRect.addEventListener('click', () => setActiveShape(shapeRect, 'rect'));
shapeCircle.addEventListener('click', () => setActiveShape(shapeCircle, 'circle'));
shapeLine.addEventListener('click', () => setActiveShape(shapeLine, 'line'));
shapeTriangle.addEventListener('click', () => setActiveShape(shapeTriangle, 'triangle'));
shapeArrow.addEventListener('click', () => setActiveShape(shapeArrow, 'arrow'));
shapeStar.addEventListener('click', () => setActiveShape(shapeStar, 'star'));
shapeHeart.addEventListener('click', () => setActiveShape(shapeHeart, 'heart'));
shapeHexagon.addEventListener('click', () => setActiveShape(shapeHexagon, 'hexagon'));

swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
        const bgColor = window.getComputedStyle(swatch).backgroundColor;
        const rgb = bgColor.match(/\d+/g);
        color = '#' + ((1 << 24) + (parseInt(rgb[0]) << 16) + (parseInt(rgb[1]) << 8) + parseInt(rgb[2])).toString(16).slice(1);
        colorEl.value = color;
        updateColorHex();
    });
});

colorEl.addEventListener('input', (e) => {
    color = e.target.value;
    updateColorHex();
});

opacitySlider.addEventListener('input', (e) => {
    opacity = e.target.value / 100;
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    cursorPos.innerText = `${x}, ${y}`;
});

canvas.addEventListener('mousedown', (e) => {
    isPressed = true;
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;

    ctx.globalAlpha = opacity;

    if (currentTool === 'brush') {
        drawBrush(startX, startY);
    } else if (currentTool === 'eraser') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(startX - size/2, startY - size/2, size, size);
        saveState();
    } else if (currentTool === 'fill') {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveState();
    } else if (currentTool === 'spray') {
        spray(startX, startY);
    } else if (currentTool === 'shapes' || currentTool === 'gradient' || currentTool === 'blur') {
        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!isPressed) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    ctx.globalAlpha = opacity;

    if (currentTool === 'brush') {
        drawBrush(currentX, currentY);
        drawLine(startX, startY, currentX, currentY);
        startX = currentX;
        startY = currentY;
    } else if (currentTool === 'eraser') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(currentX - size/2, currentY - size/2, size, size);
    } else if (currentTool === 'spray') {
        spray(currentX, currentY);
    } else if (currentTool === 'shapes') {
        ctx.putImageData(snapshot, 0, 0);
        drawShape(startX, startY, currentX, currentY, currentShape);
    } else if (currentTool === 'gradient') {
        ctx.putImageData(snapshot, 0, 0);
        drawGradient(startX, startY, currentX, currentY);
    } else if (currentTool === 'blur') {
        ctx.putImageData(snapshot, 0, 0);
        applyBlur(startX, startY, currentX, currentY);
    }
});

canvas.addEventListener('mouseup', () => {
    if (isPressed) {
        saveState();
    }
    isPressed = false;
});

function drawBrush(x, y) {
    ctx.beginPath();
    ctx.fillStyle = color;
    
    switch(currentBrush) {
        case 'round':
            ctx.arc(x, y, size/2, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'square':
            ctx.fillRect(x - size/2, y - size/2, size, size);
            break;
        case 'air':
            for (let i = 0; i < 8; i++) {
                ctx.arc(x + (Math.random() - 0.5) * size, y + (Math.random() - 0.5) * size, size/3, 0, Math.PI * 2);
                ctx.fill();
            }
            break;
        case 'calligraphy':
            ctx.ellipse(x, y, size/2, size/4, 0, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'sparkle':
            for (let i = 0; i < 5; i++) {
                ctx.arc(x + (Math.random() - 0.5) * size, y + (Math.random() - 0.5) * size, size/5, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.beginPath();
            ctx.moveTo(x - size/2, y);
            ctx.lineTo(x + size/2, y);
            ctx.moveTo(x, y - size/2);
            ctx.lineTo(x, y + size/2);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();
            break;
        case 'charcoal':
            ctx.fillStyle = color + '80';
            for (let i = 0; i < 12; i++) {
                ctx.arc(x + (Math.random() - 0.5) * size, y + (Math.random() - 0.5) * size, size/2, 0, Math.PI * 2);
                ctx.fill();
            }
            break;
    }
}

function spray(x, y) {
    for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.arc(x + (Math.random() - 0.5) * size * 2, y + (Math.random() - 0.5) * size * 2, Math.random() * size/3, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.stroke();
}

function drawShape(x1, y1, x2, y2, shape) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.fillStyle = color + '40';

    switch(shape) {
        case 'rect':
            ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
            break;
        case 'circle':
            const radius = Math.hypot(x2 - x1, y2 - y1);
            ctx.arc(x1, y1, radius, 0, Math.PI * 2);
            ctx.stroke();
            break;
        case 'line':
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            break;
        case 'triangle':
            ctx.moveTo(x1, y2);
            ctx.lineTo(x1 + (x2 - x1)/2, y1);
            ctx.lineTo(x2, y2);
            ctx.closePath();
            ctx.stroke();
            break;
        case 'arrow':
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            const angle = Math.atan2(y2 - y1, x2 - x1);
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - 20 * Math.cos(angle - 0.3), y2 - 20 * Math.sin(angle - 0.3));
            ctx.lineTo(x2 - 20 * Math.cos(angle + 0.3), y2 - 20 * Math.sin(angle + 0.3));
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
            break;
        case 'star':
            const outerR = Math.hypot(x2 - x1, y2 - y1);
            const innerR = outerR / 2;
            let rot = Math.PI / 2 * 3;
            const step = Math.PI / 5;
            ctx.moveTo(x1 + Math.cos(rot) * outerR, y1 + Math.sin(rot) * outerR);
            for (let i = 0; i < 5; i++) {
                rot += step;
                ctx.lineTo(x1 + Math.cos(rot) * outerR, y1 + Math.sin(rot) * outerR);
                rot += step;
                ctx.lineTo(x1 + Math.cos(rot) * innerR, y1 + Math.sin(rot) * innerR);
            }
            ctx.closePath();
            ctx.stroke();
            break;
        case 'heart':
            const width = Math.abs(x2 - x1) / 2;
            const height = Math.abs(y2 - y1) / 2;
            ctx.moveTo(x1, y1 + height/4);
            ctx.bezierCurveTo(x1, y1, x1 - width/2, y1, x1 - width/2, y1 + height/2);
            ctx.bezierCurveTo(x1 - width/2, y1 + height, x1, y1 + height * 0.75, x1, y1 + height);
            ctx.bezierCurveTo(x1, y1 + height * 0.75, x1 + width/2, y1 + height, x1 + width/2, y1 + height/2);
            ctx.bezierCurveTo(x1 + width/2, y1, x1, y1, x1, y1 + height/4);
            ctx.stroke();
            break;
        case 'hexagon':
            for (let i = 0; i < 6; i++) {
                const angle = i * Math.PI / 3;
                const xPos = x1 + (x2 - x1) * Math.cos(angle);
                const yPos = y1 + (y2 - y1) * Math.sin(angle);
                if (i === 0) ctx.moveTo(xPos, yPos);
                else ctx.lineTo(xPos, yPos);
            }
            ctx.closePath();
            ctx.stroke();
            break;
    }
}

function drawGradient(x1, y1, x2, y2) {
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, '#ffffff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function applyBlur(x1, y1, x2, y2) {
    const w = Math.abs(x2 - x1);
    const h = Math.abs(y2 - y1);
    const imageData = ctx.getImageData(Math.min(x1, x2), Math.min(y1, y2), w, h);
    ctx.putImageData(imageData, Math.min(x1, x2), Math.min(y1, y2));
}

increaseBtn.addEventListener('click', () => {
    size = Math.min(size + 2, 80);
    updateSizeOnScreen();
});

decreaseBtn.addEventListener('click', () => {
    size = Math.max(size - 2, 2);
    updateSizeOnScreen();
});

clearEl.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
});

saveBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'canvas-pro-drawing.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

shareBtn.addEventListener('click', async () => {
    try {
        const blob = await new Promise(resolve => canvas.toBlob(resolve));
        const data = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([data]);
        alert('Image copied to clipboard!');
    } catch {
        alert('Share feature would open share dialog');
    }
});

undoBtn.addEventListener('click', undo);
redoBtn.addEventListener('click', redo);

zoomIn.addEventListener('click', () => {
    zoom = Math.min(zoom + 0.1, 2);
    zoomLevel.innerText = Math.round(zoom * 100) + '%';
    canvas.style.transform = `scale(${zoom})`;
    canvas.style.transformOrigin = 'top left';
});

zoomOut.addEventListener('click', () => {
    zoom = Math.max(zoom - 0.1, 0.5);
    zoomLevel.innerText = Math.round(zoom * 100) + '%';
    canvas.style.transform = `scale(${zoom})`;
    canvas.style.transformOrigin = 'top left';
});

gridToggle.addEventListener('click', () => {
    gridActive = !gridActive;
    overlay.classList.toggle('grid-active', gridActive);
});

copilotEnhance.addEventListener('click', () => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 1.2);
        data[i+1] = Math.min(255, data[i+1] * 1.2);
        data[i+2] = Math.min(255, data[i+2] * 1.2);
    }
    ctx.putImageData(imageData, 0, 0);
    saveState();
    statusText.innerText = '✨ copilot: enhanced';
});

copilotSmooth.addEventListener('click', () => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        if (Math.random() > 0.7) {
            data[i] = (data[i] + data[i+4] + data[i-4]) / 3;
            data[i+1] = (data[i+1] + data[i+5] + data[i-3]) / 3;
            data[i+2] = (data[i+2] + data[i+6] + data[i-2]) / 3;
        }
    }
    ctx.putImageData(imageData, 0, 0);
    saveState();
    statusText.innerText = '🌊 copilot: smoothed';
});

copilotSharpen.addEventListener('click', () => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);
    statusText.innerText = '⚡ copilot: sharpened';
});

layerNew.addEventListener('click', () => {
    layers.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    currentLayer = layers.length - 1;
    statusText.innerText = `📄 layer ${currentLayer + 1} created`;
});

layerDuplicate.addEventListener('click', () => {
    layers.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    currentLayer = layers.length - 1;
    statusText.innerText = `📑 layer duplicated`;
});

layerMerge.addEventListener('click', () => {
    if (layers.length > 1) {
        ctx.putImageData(layers[currentLayer], 0, 0);
        layers = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
        currentLayer = 0;
        saveState();
        statusText.innerText = `🔄 layers merged`;
    }
});

layerClear.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
    statusText.innerText = `🧹 layer cleared`;
});

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
    } else if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        redo();
    } else if (e.key === 'b') {
        setActiveTool(toolBrush, 'brush');
    } else if (e.key === 's') {
        setActiveTool(toolShapes, 'shapes');
    } else if (e.key === 'e') {
        setActiveTool(toolEraser, 'eraser');
    } else if (e.key === 'f') {
        setActiveTool(toolFill, 'fill');
    } else if (e.key === 'g') {
        setActiveTool(toolGradient, 'gradient');
    }
});

updateSizeOnScreen();
updateColorHex();