// variable.js (M 类)
const state = {
    variables: {},
    currentLine: 0
};

export function updateState(newVars) {
    state.variables = {
        ...state.variables,
        ...newVars
    }; // 更新变量状态
}

export function getState() {
    return state;
}