// input.js (S 类)
export function formatCode(code) {
    if (!code) throw new Error("代码不能为空");

    // 检查基本语法（可扩展为 AST）
    if (!isValidSyntax(code)) throw new Error("语法错误");

    // 格式化代码
    return code
        .replace(/\s+/g, ' ') // 去除多余空格
        .replace(/;\s*/g, ';\n'); // 按语句换行
}

function isValidSyntax(code) {
    // 简单语法规则检查
    return code.includes('{') && code.includes('}');
}
