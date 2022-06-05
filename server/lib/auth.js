const createError = require('http-errors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const {getUserById, getUserByNamePassword} = require('./users.js');

function setAuthorize(app) {
	app.use(passport.initialize());
	app.use(passport.session());

	app.get('/login', (req, res) => {
		res.render('login');
	});

	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/login');
	});

	app.post('/login', function (req, res, next) {
		passport.authenticate('local', function (err, user, info) {
			if (err) return next(err);

			if (!user) return res.redirect('/');

			req.login(user, (err) => {
				if (err) return next(err);

				req.session.save((err) => {
					if (err) return next(err);

					res.redirect('/');
				});
			});
		})(req, res, next);
	});

	passport.use(
		new LocalStrategy((username, password, done) => {
			(async () => {
				const user = await getUserByNamePassword(username, password);
				if (user) return done(null, user);
				done(null, false);
			})().catch((err) => done(err));
		})
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		(async () => {
			const user = await getUserById(id);
			if (user) return done(null, user);
			return done(null, false);
		})().catch((err) => done(err));
	});
}

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	if (req.xhr) return next(createError(403));

	res.redirect('/login');
}

module.exports = {setAuthorize, isLoggedIn};