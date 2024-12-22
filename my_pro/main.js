import {
    Core
} from './core.js'; // 核心逻辑模块
import {
    IO
} from './io.js'; // 终端输入输出模块

// 创建核心逻辑模块和输入输出模块的实例
const core = new Core();
const io = new IO();

function main() {
    // Step 1: 获取用户输入代码
    const userCode = io.input(); // 从终端模块接收用户输入的代码
    if (!userCode) {
        console.error("输入代码为空，程序终止。");
        return;
    }

    // Step 2: 核心逻辑模块处理代码
    try {
        core.recv_input(userCode); // 接收代码并格式化
        core.execute(); // 解析并执行代码
    } catch (error) {
        console.error("程序运行时出现错误:", error.message);
        return;
    }

    // Step 3: 程序运行结果输出
    const result = io.get_output("运行完成！");
    io.output(result); // 在终端输出运行结果
}

// 启动程序
main();