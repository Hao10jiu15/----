// main.js
import {
    Core
} from './core.js'; // 核心逻辑模块
import {
    visualize
} from './display.js';
import {
    IO
} from './io.js'; // 终端输入输出模块

// 创建IO实例
const io = new IO();

// 创建核心逻辑模块实例，传入IO实例
const core = new Core(io);

// 记录当前执行步骤
let currentStep = 0;
let syntaxTree = [];
let vars = {};

// 获取按钮元素
const runButton = document.getElementById('run_button');
const prevButton = document.getElementById('prev_button');
const nextButton = document.getElementById('next_button');

// 运行按钮事件
runButton.addEventListener('click', () => {
    resetExecution();
    const userCode = io.getCode(); // 从代码显示区域获取代码
    if (!userCode) {
        io.output("输入代码为空，程序终止。");
        return;
    }

    try {
        syntaxTree = core.recv_input(userCode); // 接收代码并格式化
        io.output("代码已接收并格式化。点击“下一步”开始执行。");
    } catch (error) {
        io.output("代码格式化错误: " + error.message);
    }
});

// 上一步按钮事件
prevButton.addEventListener('click', () => {
    if (currentStep > 0) {
        currentStep--;
        executeStep(true); // true 表示回退
    } else {
        io.output("已经是第一步。");
    }
});

// 下一步按钮事件
nextButton.addEventListener('click', () => {
    if (currentStep < syntaxTree.length) {
        executeStep();
    } else {
        io.output("代码执行完毕。");
    }
});

// 重置执行状态
function resetExecution() {
    currentStep = 0;
    syntaxTree = [];
    vars = {};
    io.clearOutput();
    io.clearVariables();
    core.reset(); // 重置核心逻辑
    visualize(0); // 重置高亮
    // 重新启用“下一步”按钮
    nextButton.disabled = false;
}

// 执行单步
async function executeStep(isBack = false) {
    if (isBack) {
        // 回退执行步骤
        // 实现回退逻辑，当前示例未实现
        // 可以根据需要进行扩展
        io.output(`回退到第 ${currentStep} 步。`);
        return;
    }

    if (currentStep < syntaxTree.length) {
        const line = syntaxTree[currentStep];
        try {
            await core.executeLine(line, vars);
            currentStep++;
            io.output(`执行第 ${currentStep} 步: ${line}`);
        } catch (error) {
            io.output(`执行出错在第 ${currentStep + 1} 步: ${error.message}`);
        }
    } else {
        io.output("代码执行完毕。");
        // 禁用“下一步”按钮
        nextButton.disabled = true;
    }
}