import { Strategy as jws }  from 'passport-jwt';
import { Extract as jwe } from 'passport-jwt';
import User from './user.js';
import env from 'dotenv';

env.config();

export default (passport) => {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload._id}, function(err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  }));
};
