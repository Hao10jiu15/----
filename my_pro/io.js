// io.js (IO 类)
export class IO {
    constructor() {
        this.outputElement = document.getElementById('output');
        this.inputElement = document.getElementById('input');
        this.submitButton = document.getElementById('submit_input');

        this.inputResolver = null;

        // 绑定提交按钮事件
        this.submitButton.addEventListener('click', () => {
            if (this.inputResolver) {
                const userInput = this.inputElement.value.trim();
                if (userInput === '') {
                    this.output("输入不能为空，请重新输入。");
                    return;
                }
                this.output(`> ${userInput}`);
                this.inputElement.value = '';
                this.inputResolver(userInput);
                this.inputResolver = null;
            }
        });

        // 允许按下Enter键提交输入
        this.inputElement.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitButton.click();
            }
        });
    }

    // 将文本追加到终端输出区域
    output(text) {
        this.outputElement.textContent += text + '\n';
        this.scrollToEnd();
    }

    // 清空终端输出区域
    clearOutput() {
        this.outputElement.textContent = '';
    }

    // 清空变量监视器区域
    clearVariables() {
        const varMonitor = document.getElementById('variable-monitor-content');
        varMonitor.innerHTML = '';
    }

    // 从代码显示区域获取代码文本
    getCode() {
        const codeDisplay = document.getElementById('codeDisplay');
        return codeDisplay.innerText;
    }

    // 请求用户输入，返回一个Promise，等待用户提交输入
    requestInput(promptText) {
        return new Promise((resolve) => {
            this.output(`请输入 ${promptText}（用空格分隔多个输入）:`);
            this.inputResolver = resolve;
            // 聚焦到输入框
            this.inputElement.focus();
        });
    }

    // 滚动到终端输出区域的底部
    scrollToEnd() {
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
    }
}