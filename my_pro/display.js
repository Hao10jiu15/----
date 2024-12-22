// display.js (Display 类)
export function visualize(vars) {
    highlightCurrentLine(vars.currentLine);
    updateVariableMonitor(vars);
    draw_graph(vars.controlFlow);
}

function highlightCurrentLine(line) {
    const codeLines = document.querySelectorAll('.code-line');
    codeLines.forEach((el, index) => {
        el.classList.toggle('highlight', index === line - 1);
    });
}

function updateVariableMonitor(vars) {
    const monitor = document.getElementById('variable-monitor');
    monitor.innerHTML = Object.entries(vars)
        .map(([name, value]) => `${name}: ${value}`)
        .join('<br>');
}

export function draw_graph(controlFlow) {
    const canvas = document.getElementById('control-flow-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText(`当前控制流: ${controlFlow}`, 10, 50);
}