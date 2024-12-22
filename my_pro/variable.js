// variable.js
const state = {
    variables: {},
    controlFlow: null,
};

export function updateState(newVars, newFlow) {
    state.variables = {
        ...state.variables,
        ...newVars
    };
    state.controlFlow = newFlow;
}

export function getState() {
    return state;
}