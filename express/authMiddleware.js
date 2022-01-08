export default function(req, _, next) {
    if (!req.session.auth || !req.session.auth.signedIn) {
        const err = new Error('Not authorized. Session data:' + JSON.stringify(req.session));
        err.status = 401;
        return next(err);
    } else {
        return next();
    }
}