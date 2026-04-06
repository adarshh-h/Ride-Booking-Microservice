const userModel = require('../models/user.model');
const blacklisttokenModel = require('../models/blacklisttoken.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { subscribeToQueue } = require('../service/rabbit')
const EventEmitter = require('events');
const rideEventEmitter = new EventEmitter();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '8h' });
};


module.exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hash
    });

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // change to true in production
      sameSite: 'lax'
    });

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    // res.cookie('token', token, {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: 'lax'
    // });
    res.cookie('token', token, {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  maxAge: 8 * 60 * 60 * 1000 // ✅ Add this: 8 hours in ms (matches JWT expiry)
});

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports.logout = async (req, res) => {
  try {
    const token =
      req.cookies.token ||
      (req.headers.authorization &&
        req.headers.authorization.split(' ')[1]);

    if (!token) {
      return res.status(400).json({ message: 'No token provided' });
    }

    await blacklisttokenModel.create({ token });

    res.clearCookie('token');

    res.json({ message: 'Logged out successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports.profile = async (req, res) => {
 try {
        res.send(req.user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// module.exports.acceptedRide = async (req, res) => {
//     // Long polling: wait for 'ride-accepted' event
//     rideEventEmitter.once('ride-accepted', (data) => {
//         res.send(data);
//     });

//     // Set timeout for long polling (e.g., 30 seconds)
//     setTimeout(() => {
//         res.status(204).send();
//     }, 30000);
// }
module.exports.acceptedRide = async (req, res) => {

    let isResponded = false; // ✅ track response

    const handler = (data) => {
        if (!isResponded) {
            isResponded = true;
            res.json(data);
        }
    };

    // listen once
    rideEventEmitter.once('ride-accepted', handler);

    // timeout
    setTimeout(() => {
        if (!isResponded) {
            isResponded = true;
            res.status(204).send();
        }
    }, 30000);
};

subscribeToQueue('ride-accepted', async (msg) => {
    const data = JSON.parse(msg);
    rideEventEmitter.emit('ride-accepted', data);
});