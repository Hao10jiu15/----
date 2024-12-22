// display.js (Display 类)
import {
    getState
} from './variable.js';

export function visualize(currentLine) {
    const state = getState();
    highlightCurrentLine(currentLine);
    updateVariableMonitor(state.variables);
}

function highlightCurrentLine(line) {
    const codeLines = document.querySelectorAll('.code-line');
    codeLines.forEach((el, index) => {
        if (line > 0 && index === line - 1) {
            el.classList.add('highlight');
        } else {
            el.classList.remove('highlight');
        }
    });
}

function updateVariableMonitor(vars) {
    const monitor = document.getElementById('variable-monitor-content');
    monitor.innerHTML = Object.entries(vars)
        .map(([name, value]) => `<div>${name}: ${value}</div>`)
        .join('');
}