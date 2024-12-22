// display.js (显示模块)
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
        // 移除所有行的 'current-exec' 类
        el.classList.remove('current-exec');
    });
    if (line > 0 && line <= codeLines.length) {
        const currentLineElement = codeLines[line - 1];
        currentLineElement.classList.add('current-exec');
    }
}

function updateVariableMonitor(vars) {
    const monitor = document.getElementById('variable-monitor-content');
    monitor.innerHTML = Object.entries(vars)
        .map(([name, varObj]) => `
            <div class="variable-box">
                <div class="var-name">${name}</div>
                <div class="var-type">类型: ${varObj.type}</div>
                <div class="var-value">值: ${varObj.value}</div>
                <div class="var-address">地址: ${varObj.address}</div>
            </div>
        `).join('');
}