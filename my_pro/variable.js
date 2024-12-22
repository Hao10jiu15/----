// variable.js (变量管理模块)
const state = {
    variables: {}
};

let addressCounter = 1; // 从1开始，避免地址0x00000000
let history = []; // 用于保存变量状态历史

// Function to generate a fake hex address
function generateHexAddress() {
    const address = `0x${(addressCounter++).toString(16).padStart(8, '0')}`;
    return address;
}

export function getState() {
    return state;
}

export function addVariable(name, type, value) {
    if (!state.variables[name]) {
        state.variables[name] = {
            type: type,
            value: value,
            address: generateHexAddress()
        };
        console.log(`添加变量: ${name} = ${value}, 地址: ${state.variables[name].address}`); // 调试日志
    } else {
        state.variables[name].value = value;
        console.log(`更新变量: ${name} = ${value}`); // 调试日志
    }
    saveState(); // 每次变量更新后保存状态
}

export function saveState() {
    // 深拷贝变量对象
    const variablesCopy = JSON.parse(JSON.stringify(state.variables));
    history.push(variablesCopy);
    console.log(`保存变量状态，当前历史长度: ${history.length}`); // 调试日志
}

export function restoreState(step) {
    if (step < 0 || step >= history.length) {
        console.warn(`无法恢复到步骤 ${step}`);
        return;
    }
    state.variables = JSON.parse(JSON.stringify(history[step]));
    console.log(`恢复到步骤 ${step}，变量状态:`, state.variables); // 调试日志
}

export function clearVariables() {
    state.variables = {};
    clearHistory();
}

export function clearHistory() {
    history = [];
    console.log("清空变量历史"); // 调试日志
    saveState(); // 保存初始空状态
}

export function getHistoryLength() {
    return history.length;
}
