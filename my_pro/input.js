// input.js
import {
    execute
} from './core.js';

document.getElementById('run-button').addEventListener('click', () => {
    const code = document.getElementById('code-input').value;
    try {
        const formattedCode = formatCode(code);
        document.getElementById('code-display').innerHTML = formatCodeForDisplay(formattedCode);
        execute(formattedCode);
    } catch (error) {
        document.getElementById('output').textContent = error.message;
    }
});

export function formatCode(code) {
    if (!code) throw new Error("代码不能为空");

    // 简单的语法检查（可扩展为 AST）
    if (!isValidSyntax(code)) throw new Error("语法错误");

    // 格式化处理
    return code
        .replace(/\s+/g, ' ') // 去除多余空格
        .replace(/;\s*/g, ';\n'); // 按语句换行
}

function isValidSyntax(code) {
    // 基本检查：代码是否以 "{" 开始、以 "}" 结束
    return code.includes('{') && code.includes('}');
}

function formatCodeForDisplay(code) {
    const lines = code.split('\n');
    return lines.map(line => `<span class="code-line">${escapeHtml(line)}</span>`).join('\n');
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
    };
    return text.replace(/[&<>]/g, m => map[m]);
}