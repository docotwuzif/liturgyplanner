export const actions = {
    async nuxtServerInit({ dispatch }, { app }) {
        await dispatch('auth/refreshAuthData', app);
    }
}