// main.js (主控制模块)
import {
    Core
} from './core.js'; // 核心逻辑模块
import {
    IO
} from './io.js'; // 输入输出模块
import {
    visualize
} from './display.js';
import {
    clearVariables,
    restoreState,
    getHistoryLength
} from './variable.js';

// 创建IO实例
const io = new IO();

// 创建核心逻辑模块实例，传入IO实例
const core = new Core(io);

// 记录当前执行步骤（对应于 syntaxTree index）
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
        restoreState(currentStep); // 恢复到当前Step

        if (currentStep > 0) {
            const prevLine = syntaxTree[currentStep - 1].line;
            visualize(prevLine);
        } else {
            visualize(null); // 初始状态，无高亮
        }
        console.log(`回退到步骤 ${currentStep}`);
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
    clearVariables(); // 清空变量监视器和变量状态
    visualize(null); // 重置执行指示符和变量监视器
    // 重新启用“下一步”按钮
    nextButton.disabled = false;
}

// 执行单步
async function executeStep() {
    if (currentStep >= syntaxTree.length) {
        io.output("代码执行完毕。");
        nextButton.disabled = true;
        return;
    }

    const lineObj = syntaxTree[currentStep];
    const lineNumber = lineObj.line;
    const lineCode = lineObj.code;
    console.log(`执行步骤 ${currentStep + 1}: ${lineCode}`);

    try {
        const executed = await core.executeLine(lineObj);
        console.log(`执行结果: ${executed}`); // 调试日志
        if (executed) {
            visualize(lineNumber); // 高亮当前行并更新变量监视器
            console.log(`是否执行: ${executed}`); // 调试日志
        }
        currentStep++;
        console.log(`已执行步骤 ${currentStep}`);
    } catch (error) {
        io.output(`执行出错在第 ${currentStep + 1} 步: ${error.message}`);
        console.error(`执行出错在第 ${currentStep + 1} 步:`, error);
    }

    if (currentStep >= syntaxTree.length) {
        io.output("代码执行完毕。");
        nextButton.disabled = true;
    }
}
