// core.js (P 类)
import {
    visualize
} from './display.js';
import {
    formatCode
} from './input.js';
import {
    getState,
    updateState
} from './variable.js';

export class Core {
    recv_input(code) {
        this.code = formatCode(code); // 调用代码模块
    }

    analysis_code() {
        // 模拟解析代码生成语法树
        return this.code.split(';').map(line => line.trim());
    }

    execute() {
        const syntaxTree = this.analysis_code(); // 解析代码
        const vars = {}; // 初始化变量
        syntaxTree.forEach(line => {
            this.executeLine(line, vars); // 执行每行代码
            const state = getState(); // 获取当前变量状态
            visualize(state); // 调用展示模块
        });
    }

    executeLine(line, vars) {
        if (line.startsWith('int')) {
            const [_, name, value] = /int\s+(\w+)\s*=\s*(\d+)/.exec(line);
            vars[name] = parseInt(value);
            updateState({
                [name]: vars[name]
            }); // 更新变量状态
        }
        // 其他语句逻辑...
    }
}