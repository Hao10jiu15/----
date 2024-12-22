// main.js
import {
    Core
} from './core.js'; // 核心逻辑模块
import {
    IO
} from './io.js'; // 终端输入输出模块

// 创建核心逻辑模块和输入输出模块的实例
const core = new Core();
const io = new IO();

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
    const userCode = io.input(); // 从终端模块接收用户输入的代码
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
        executeStep();
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
    document.getElementById('output').textContent = '';
    document.getElementById('variable-monitor').innerHTML = '';
    const ctx = document.getElementById('control-flow-canvas').getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    core.reset(); // 如果Core类有reset方法
}

// 执行单步
async function executeStep() {
    if (currentStep < syntaxTree.length) {
        const line = syntaxTree[currentStep];
        try {
            await core.executeLine(line, vars); // 执行当前行，可能涉及异步操作（如scanf）
            currentStep++;
            io.output(`执行第 ${currentStep} 步: ${line}`);
        } catch (error) {
            io.output(`执行出错在第 ${currentStep + 1} 步: ${error.message}`);
        }
    }
}