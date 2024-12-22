// variable.js (变量管理模块)
const state = {
    variables: {},
    currentLine: 0
};

let addressCounter = 1; // 从1开始，避免地址0x00000000

// Function to generate a fake hex address
function generateHexAddress() {
    const address = `0x${(addressCounter++).toString(16).padStart(8, '0')}`;
    return address;
}

export function updateState(newVars) {
    state.variables = {
        ...state.variables,
        ...newVars
    }; // 更新变量状态
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
}