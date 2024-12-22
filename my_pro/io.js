// io.js (IO 类)
export class IO {
    input() {
        const userInput = prompt("请输入数据：");
        return userInput;
    }

    get_output(result) {
        return result;
    }

    output(result) {
        console.log("程序输出:", result);
    }
}
