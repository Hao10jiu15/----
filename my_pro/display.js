// display.js (Display 类)
import {
    getState
} from './variable.js';

export function visualize(currentLine) {
    const state = getState();
    highlightCurrentLine(currentLine);
    updateVariableMonitor(state.variables);
    draw_graph(state.controlFlow);
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
    ctx.font = '16px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText(`当前控制流: ${controlFlow}`, 10, 50);

    // 简单的控制流示意图
    if (controlFlow === '条件判断') {
        ctx.beginPath();
        ctx.moveTo(50, 100);
        ctx.lineTo(150, 100);
        ctx.stroke();
    } else if (controlFlow === '普通语句') {
        ctx.beginPath();
        ctx.arc(200, 100, 50, 0, 2 * Math.PI);
        ctx.stroke();
    }
}