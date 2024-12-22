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
    io.clearOutput();
    io.clearVariables();
    core.reset(); // 重置核心逻辑
    visualize(0); // 重置执行指示符和变量监视器
    // 重新启用“下一步”按钮
    nextButton.disabled = false;
}

// 执行单步
async function executeStep(isBack = false) {
    if (isBack) {
        // 实现回退执行步骤逻辑
        // 当前示例中，仅更新高亮和变量监视器
        visualize(currentStep);
        console.log(`回退到步骤 ${currentStep}`);
        return;
    }

    while (currentStep < syntaxTree.length) {
        const line = syntaxTree[currentStep];
        console.log(`执行步骤 ${currentStep + 1}: ${line}`);
        try {
            const executed = await core.executeLine(line);
            if (executed) {
                visualize(currentStep + 1); // 高亮当前行并更新变量监视器
            }
            currentStep++;
            console.log(`已执行步骤 ${currentStep}`);
            if (executed) {
                break; // 只执行一条可执行的代码
            }
        } catch (error) {
            io.output(`执行出错在第 ${currentStep + 1} 步: ${error.message}`);
            console.error(`执行出错在第 ${currentStep + 1} 步:`, error);
            break;
        }
    }

    if (currentStep >= syntaxTree.length) {
        io.output("代码执行完毕。");
        nextButton.disabled = true;
    }
}