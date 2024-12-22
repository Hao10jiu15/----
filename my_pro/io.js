// io.js (IO 类)
export class IO {
    input() {
        // 使用文本区域作为输入来源，无需prompt
        const textarea = document.getElementById('myTextarea');
        return textarea.value.trim();
    }

    get_output(result) {
        return result;
    }

    output(result) {
        const outputElement = document.getElementById('output');
        outputElement.textContent += result + '\n'; // 追加输出
    }

    // 异步提示用户输入，用于 scanf
    promptUser(formatStr) {
        return new Promise((resolve) => {
            const userInput = prompt(`请输入 ${formatStr}:`);
            resolve(userInput);
        });
    }
}