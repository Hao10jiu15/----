// variable.js (M 类)
const state = {
    variables: {}
};

export function updateState(newVars) {
    state.variables = {
        ...state.variables,
        ...newVars
    }; // 更新变量状态
}

export function getState() {
    return state.variables; // 返回当前变量状态
}