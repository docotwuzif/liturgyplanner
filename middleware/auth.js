export default function({ redirect, store, route }) {
    if (!route.path.match(/^\/login/) && !store.state.auth.signedIn) {
        redirect('/login');
    }
}