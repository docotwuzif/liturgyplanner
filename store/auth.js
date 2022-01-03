export const state = () => ({
    signedIn: false,
    userData: null
})

export const mutations = {
    setUserSignedIn(state, userData) {
        state.signedIn = true;
        state.userData = userData;
    },
    setUserSignedOut(state) {
        state.signedIn = false;
        state.userData = null;
    }
}