// core.js (P 类)
import {
    formatCode
} from './input.js';
import {
    addVariable,
    getState
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
        // 包含所有非空行
        return this.code.split('\n').map(line => line.trim()).filter(line => line !== '');
    }

    // 执行单行代码
    async executeLine(line) {
        console.log("执行行:", line); // 调试日志

        if (line.startsWith('#include')) {
            // 无需执行，跳过
            console.log("跳过行: " + line);
            return;
        }
        if (line.startsWith('int main')) {
            // 无需执行，跳过
            console.log("跳过行: " + line);
            return;
        }
        if (line === '{' || line === '}') {
            // 无需执行，跳过
            console.log("跳过行: " + line);
            return;
        }

        if (line.startsWith('int')) {
            const match = /int\s+(\w+)\s*=\s*(.+);/.exec(line);
            if (match) {
                const [, name, value] = match;
                const evaluatedValue = this.evaluateExpression(value);
                addVariable(name, 'int', evaluatedValue); // Add variable with type, value, and address
                console.log(`变量赋值: ${name} = ${evaluatedValue}`); // 调试日志
            } else {
                throw new Error(`无法解析变量声明: ${line}`);
            }
        } else if (line.startsWith('printf')) {
            const match = /printf\s*\(\s*"([^"]*)"\s*,\s*(.*)\s*\);/.exec(line);
            if (match) {
                const [, formatStr, varsStr] = match;
                const varNames = this.parseVarNames(varsStr);
                const varValues = varNames.map(name => {
                    // Remove '&' if present
                    const cleanName = name.replace('&', '');
                    const value = getState().variables[cleanName]?.value;
                    console.log(`获取变量: ${cleanName} = ${value}`); // 调试日志
                    return value;
                });

                let formattedOutput = formatStr;
                let varIndex = 0;
                formattedOutput = formattedOutput.replace(/%d/g, () => {
                    const value = varValues[varIndex++];
                    return value !== undefined ? value : 'undefined';
                });

                // Handle escaped characters like \n
                formattedOutput = formattedOutput.replace(/\\n/g, '\n');

                this.io.output(formattedOutput);
                console.log(`输出: ${formattedOutput}`); // 调试日志
            } else {
                throw new Error(`无法解析 printf 语句: ${line}`);
            }
        } else if (line.startsWith('scanf')) {
            const match = /scanf\s*\(\s*"([^"]*)"\s*,\s*(.*)\s*\);/.exec(line);
            if (match) {
                const [, formatStr, varsStr] = match;
                const varNames = this.parseVarNames(varsStr);
                const userInput = await this.io.requestInput(formatStr); // 异步等待用户输入
                const inputValues = userInput.split(' ').map(input => parseInt(input));
                varNames.forEach((name, index) => {
                    const cleanName = name.replace('&', '');
                    const value = inputValues[index];
                    addVariable(cleanName, 'int', value); // Update variable value
                    console.log(`变量更新: ${cleanName} = ${value}`); // 调试日志
                });
            } else {
                throw new Error(`无法解析 scanf 语句: ${line}`);
            }
        } else if (line.startsWith('return')) {
            // 处理 return 语句（简单模拟）
            console.log("执行 return 语句");
            return;
        } else {
            // 未知语句，跳过
            console.log("跳过未知行: " + line);
            return;
            // throw new Error(`未支持的语句: ${line}`);
        }
    }

    // 解析变量名，处理多变量和指针符号
    parseVarNames(varsStr) {
        return varsStr.split(',').map(v => v.trim());
    }

    evaluateExpression(expr) {
        // 简单的表达式评估（支持加法）
        if (expr.includes('+')) {
            const [a, b] = expr.split('+').map(part => part.trim());
            const valA = parseInt(getState().variables[a]?.value) || 0;
            const valB = parseInt(getState().variables[b]?.value) || 0;
            console.log(`计算表达式: ${a} + ${b} = ${valA + valB}`); // 调试日志
            return valA + valB;
        }
        // Direct integer assignment or variable reference
        if (/^\d+$/.test(expr)) {
            const num = parseInt(expr);
            console.log(`解析整数: ${expr} = ${num}`); // 调试日志
            return num;
        }
        const val = parseInt(getState().variables[expr]?.value) || 0;
        console.log(`解析变量: ${expr} = ${val}`); // 调试日志
        return val;
    }

    // 重置核心逻辑（可选）
    reset() {
        this.code = '';
        this.syntaxTree = [];
    }
}