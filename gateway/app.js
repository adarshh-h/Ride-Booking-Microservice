const express = require('express');
const proxy = require('express-http-proxy');

const app = express();

app.use('/api/users', proxy('http://localhost:3001', {
    proxyReqPathResolver: function (req) {
        return '/api/users' + req.url;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers = srcReq.headers;
        return proxyReqOpts;
    }
}));

// captain
app.use('/api/captains', proxy('http://localhost:3002', {
    proxyReqPathResolver: (req) => {
        return '/api/captains' + req.url;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers = srcReq.headers;
        return proxyReqOpts;
    }
}));

// ride
app.use('/api/rides', proxy('http://localhost:3003', {
    proxyReqPathResolver: (req) => {
        return '/api/rides' + req.url;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers = srcReq.headers;
        return proxyReqOpts;
    }
}));

app.listen(3000, () => {
    console.log('Gateway running on port 3000');
});