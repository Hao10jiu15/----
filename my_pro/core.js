// core.js
import {
    processIO
} from './io.js';
import {
    updateState
} from './variable.js';
import {
    visualize
} from './visualization.js';

export function execute(code) {
    const syntaxTree = parseCode(code); // 解析代码成语法树
    const vars = {};

    syntaxTree.forEach((node, index) => {
        const currentLine = index + 1;
        executeNode(node, vars);
        updateState(vars, getControlFlow(node));
        visualize(currentLine);
    });

    // 输出最终变量状态
    processIO(`程序运行结束，最终变量状态:\n${JSON.stringify(vars, null, 2)}`);
}

function parseCode(code) {
    // 简单的语法树解析（按行拆分）
    const lines = code.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('//'));
    // 去除函数声明和括号
    return lines.filter(line => !line.startsWith('int main') && line !== '{' && line !== '}');
}

function executeNode(node, vars) {
    if (node.startsWith('int')) {
        const match = /int\s+(\w+)\s*=\s*(.+);/.exec(node);
        if (match) {
            const [, name, value] = match;
            vars[name] = evaluateExpression(value, vars);
        }
    } else if (node.startsWith('return')) {
        // 处理 return 语句（简单模拟）
        // 这里可以扩展更多功能
    }
    // 其他语句逻辑...
}

function evaluateExpression(expr, vars) {
    // 简单的表达式评估（支持加法）
    if (expr.includes('+')) {
        const [a, b] = expr.split('+').map(part => part.trim());
        return (parseInt(vars[a] || a) + parseInt(vars[b] || b));
    }
    return parseInt(vars[expr] || expr);
}

function getControlFlow(node) {
    // 简单模拟控制流获取
    if (node.startsWith('if')) {
        return '条件判断';
    }
    return '普通语句';
}