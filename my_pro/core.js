// core.js (P 类)
import {
    visualize
} from './display.js';
import {
    formatCode
} from './input.js';
import {
    updateState
} from './variable.js';

export class Core {
    constructor(ioInstance) {
        this.io = ioInstance;
        this.code = '';
        this.syntaxTree = [];
    }

    // 接收并格式化代码，返回语法树
    recv_input(code) {
        this.code = formatCode(code); // 调用代码模块
        this.syntaxTree = this.analysis_code();
        console.log("语法树:", this.syntaxTree); // 调试日志
        return this.syntaxTree;
    }

    // 解析代码生成语法树
    analysis_code() {
        // 模拟解析代码生成语法树
        return this.code.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#include') && !line.startsWith('int main') && line !== '{' && line !== '}');
    }

    // 执行单行代码
    async executeLine(line, vars) {
        console.log("执行行:", line); // 调试日志
        if (line.startsWith('int')) {
            const match = /int\s+(\w+)\s*=\s*(.+);/.exec(line);
            if (match) {
                const [, name, value] = match;
                vars[name] = this.evaluateExpression(value, vars);
                updateState({
                    [name]: vars[name]
                }); // 更新变量状态
                visualize(vars.currentLine = this.syntaxTree.indexOf(line) + 1); // 可视化
            } else {
                throw new Error(`无法解析变量声明: ${line}`);
            }
        } else if (line.startsWith('printf')) {
            const match = /printf\s*\(\s*"(.*)"\s*,\s*(.*)\s*\);/.exec(line);
            if (match) {
                const [, formatStr, varsStr] = match;
                const varNames = varsStr.split(',').map(v => v.trim());
                const varValues = varNames.map(name => {
                    if (name.startsWith('&')) {
                        // 地址符号，忽略
                        return vars[name.substring(1)];
                    }
                    return vars[name];
                });
                const formattedOutput = formatStr.replace(/%d/g, () => varValues.shift());
                this.io.output(formattedOutput);
                visualize(vars.currentLine = this.syntaxTree.indexOf(line) + 1); // 可视化
            } else {
                throw new Error(`无法解析 printf 语句: ${line}`);
            }
        } else if (line.startsWith('scanf')) {
            const match = /scanf\s*\(\s*"(.*)"\s*,\s*(.*)\s*\);/.exec(line);
            if (match) {
                const [, formatStr, varsStr] = match;
                const varNames = varsStr.split(',').map(v => v.trim().replace('&', ''));
                const userInput = await this.io.requestInput(formatStr); // 异步等待用户输入
                const inputValues = userInput.split(' ').map(input => parseInt(input));
                varNames.forEach((name, index) => {
                    vars[name] = inputValues[index];
                    updateState({
                        [name]: vars[name]
                    }); // 更新变量状态
                });
                visualize(vars.currentLine = this.syntaxTree.indexOf(line) + 1); // 可视化
            } else {
                throw new Error(`无法解析 scanf 语句: ${line}`);
            }
        } else if (line.startsWith('return')) {
            // 处理 return 语句（简单模拟）
            visualize(vars.currentLine = this.syntaxTree.indexOf(line) + 1);
        } else {
            throw new Error(`未支持的语句: ${line}`);
        }
        // 其他语句逻辑...
    }

    evaluateExpression(expr, vars) {
        // 简单的表达式评估（支持加法）
        if (expr.includes('+')) {
            const [a, b] = expr.split('+').map(part => part.trim());
            return (parseInt(vars[a] || a) + parseInt(vars[b] || b));
        }
        return parseInt(vars[expr] || expr);
    }

    // 重置核心逻辑（可选）
    reset() {
        this.code = '';
        this.syntaxTree = [];
    }
}