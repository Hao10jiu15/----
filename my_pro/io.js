// // io.js (输入输出模块)
// export class IO {
//     constructor() {
//         this.outputElement = document.getElementById('output');
//         this.inputElement = document.getElementById('input');
//         this.submitButton = document.getElementById('submit_input');
//         this.codeDisplay = document.getElementById('codeDisplay');
//         this.inputCallback = null;

//         // 处理提交按钮
//         this.submitButton.addEventListener('click', () => {
//             const userInput = this.inputElement.value;
//             this.inputElement.value = '';
//             if (this.inputCallback) {
//                 this.inputCallback(userInput);
//                 this.inputCallback = null;
//             }
//         });

//         // 处理回车键
//         this.inputElement.addEventListener('keypress', (e) => {
//             if (e.key === 'Enter') {
//                 e.preventDefault();
//                 this.submitButton.click();
//             }
//         });
//     }

//     getCode() {
//         // 从 codeDisplay 中获取每个 .code-line 的文本，并按换行符分隔
//         const lines = Array.from(this.codeDisplay.querySelectorAll('.code-line'))
//             .map(line => line.textContent.trim())
//             .filter(line => line !== '');
//         const code = lines.join('\n');
//         console.log("获取的代码:", code); // 调试日志
//         return code;
//     }

//     output(text) {
//         this.outputElement.textContent += text + '\n';
//         this.outputElement.scrollTop = this.outputElement.scrollHeight;
//     }

//     clearOutput() {
//         this.outputElement.textContent = '';
//     }

//     clearVariables() {
//         // 清空变量监视器
//         const monitor = document.getElementById('variable-monitor-content');
//         monitor.innerHTML = '';
//     }

//     requestInput(promptText) {
//         this.output(promptText + ' ');
//         return new Promise(resolve => {
//             this.inputCallback = resolve;
//         });
//     }
// }

// io.js (输入输出模块)
export class IO {
    constructor() {
        this.outputElement = document.getElementById('output');
        this.inputElement = document.getElementById('input');
        this.submitButton = document.getElementById('submit_input');
        this.codeDisplay = document.getElementById('codeDisplay');
        this.inputCallback = null;

        // 处理提交按钮
        this.submitButton.addEventListener('click', () => {
            const userInput = this.inputElement.value;
            this.inputElement.value = '';
            if (this.inputCallback) {
                this.inputCallback(userInput);
                this.inputCallback = null;
            }
        });

        // 处理回车键
        this.inputElement.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.submitButton.click();
            }
        });
    }

    getCode() {
        // 从 codeDisplay 中获取每个 .code-line 的文本，并按换行符分隔
        const lines = Array.from(this.codeDisplay.querySelectorAll('.code-line'))
            .map(line => line.textContent.trim())
            .filter(line => line !== '');
        const code = lines.join('\n');
        console.log("获取的代码:", code); // 调试日志
        return code;
    }

    output(text) {
        this.outputElement.textContent += text + '\n';
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
    }

    clearOutput() {
        this.outputElement.textContent = '';
    }

    clearVariables() {
        // 清空变量监视器
        const monitor = document.getElementById('variable-monitor-content');
        monitor.innerHTML = '';
    }

    requestInput(promptText) {
        this.output(promptText + ' ');
        return new Promise(resolve => {
            this.inputCallback = resolve;
        });
    }
}