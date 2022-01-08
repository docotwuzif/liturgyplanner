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

export const actions = {
    async refreshAuthData({ commit }, app) {
        const res = await app.context.$axios.get('/api/auth/status')
        if (res.data.auth && res.data.auth.signedIn && res.data.auth.user)
            commit('setUserSignedIn', res.data.auth.user);


    }
}