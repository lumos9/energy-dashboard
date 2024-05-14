// server.js
const { createHttpServer } = require("http");
const { createServer } = require("https");
const next = require("next");
const { Server } = require("socket.io");
const async = require("async");
const sharedsession = require("express-socket.io-session");
const crypto = require("crypto");
const axios = require("axios");
const express = require("express");
const fs = require("fs");
const cors = require("cors");

//require("console-stamp")(console, "[HH:MM:ss.l]");
//const morgan = require("morgan");

// since logger only returns a UTC version of date, I'm defining my own date format - using an internal module from console-stamp
// express.logger.format("mydate", function () {
//     var df = require("console-stamp/node_modules/dateformat");
//     return df(new Date(), "HH:MM:ss.l");
// });

// Custom error class for missing environment variables
class MissingEnvVariableError extends Error {
    constructor(variable) {
        super(`Environment variable "${variable}" is required but not set.`);
        this.name = this.constructor.name;
    }
}

// Function to check if an environment variable is set
function requireEnv(variable) {
    if (!(variable in process.env)) {
        throw new MissingEnvVariableError(variable);
    }
    return process.env[variable];
}

function formatCurrentDateTime() {
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    // Create a new Date object for the current time
    let now = new Date();

    // Convert to PST if needed, considering PST is UTC-8
    // Note: This example does not handle daylight saving time
    const offsetInHours = -8;
    now = new Date(
        now.getTime() +
        now.getTimezoneOffset() * 60000 +
        offsetInHours * 3600000
    );

    const year = now.getFullYear();
    const month = months[now.getMonth()];
    const date = now.getDate().toString().padStart(2, "0");
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const milliseconds = now.getMilliseconds().toString().padStart(3, "0");

    // Determine AM or PM suffix
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const hoursFormatted = hours.toString().padStart(2, "0");

    // Construct the formatted string
    const formattedDateTime = `${date}-${month}-${year} ${hoursFormatted}:${minutes}:${seconds}.${milliseconds} ${ampm} PST`;

    return formattedDateTime;
}

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

let http_port = 3000;
let https_port = 4000;
if (process.env.HTTP_PORT) {
    http_port = process.env.HTTP_PORT;
    console.log(
        `${formatCurrentDateTime()} - 'HTTP_PORT' env variable is set to '${http_port}'. Launching http with port ${http_port}`
    );
} else {
    console.warn(
        `${formatCurrentDateTime()} - 'HTTP_PORT' env variable is not set. Launching http with default port ${http_port}`
    );
}

if (process.env.HTTPS_PORT) {
    https_port = process.env.HTTPS_PORT;
    console.log(
        `${formatCurrentDateTime()} - 'HTTPS_PORT' env variable is set to '${https_port}'. Launching http with port ${https_port}`
    );
} else {
    console.warn(
        `${formatCurrentDateTime()} - 'HTTPS_PORT' env variable is not set. Launching https with default port ${https_port}`
    );
}

const gitlab_private_access_token = ""//requireEnv("GITLAB_PRIVATE_ACCESS_TOKEN");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";
process.env.UV_THREADPOOL_SIZE = 128;
process.setMaxListeners(100);

global.store = {
    webSocket: null,
    prodServers: [],
    uatServers: [],
    preprodServers: [],
    cache: new Map(),
    clients: new Map(), // Store clients with an identifier
    gitlab_private_access_token: gitlab_private_access_token,
};

async function getValuesWithPattern(key) {
    try {
        const result = await redisClient.HGETALL(key);
        //console.log(result);
        const releases = Object.values(result).reduce((acc, curr) => {
            const parsedData = JSON.parse(curr);
            acc.push(...parsedData);
            return acc;
        }, []);

        // Sort releases by datetime field in reverse chronological order
        releases.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

        //console.log("Flattened and sorted releases:", releases);

        return releases;
    } catch (error) {
        console.error("Error occurred:", error);
        throw error;
    }
}

nextApp.prepare().then(() => {
    const server = express();
    server.enable("trust proxy");
    // Custom middleware to log the details
    server.use((req, res, next) => {
        // const start = Date.now();

        // // Override the end method to capture when the response is done
        // const originalEnd = res.end;
        // res.end = (...args) => {
        //     const responseTime = Date.now() - start;
        //     // IP address from the request
        //     const ipAddr =
        //         req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        //     // Log the details
        //     console.log(
        //         `${formatCurrentDateTime()} - ${ipAddr} - ${req.method} - ${
        //             res.statusCode
        //         } - ${responseTime}ms - ${req.originalUrl} - ${
        //             res.get("Content-Length") || 0
        //         }b`
        //     );
        //     originalEnd.apply(res, args);
        // };

        next();
    });
    //server.use(morgan("dev"));

    // Enable CORS for all routes
    // server.use(
    //     cors({
    //         origin: "*", // or use '*' to allow all origins
    //         methods: ["GET", "POST"], // allowed request methods
    //         allowedHeaders: ["Content-Type", "Authorization"], // allowed headers
    //         credentials: true, // to allow cookies to be sent
    //     })
    // );

    // server.use(
    //     express.logger(
    //         "[:mydate] - :remote-addr - :method :url :status :res[content-length] - :response-time ms"
    //     )
    // );
    server.use(cors());
    server.use((req, res, next) => {
        if (req.secure) {
            next();
        } else {
            https_url =
                "https://" +
                req.headers.host.split(":")[0] +
                ":" +
                https_port +
                req.url;
            console.log(
                `${formatCurrentDateTime()} - Redirecting to Https Url: ${https_url}`
            );
            res.redirect(https_url);
        }
    });
    var options = {
        key: fs.readFileSync("cert/server.key"),
        cert: fs.readFileSync("cert/server.crt"),
    };
    const httpsServer = createServer(options, server);

    var connectedUsers = {};
    const webSocketClients = new Set();
    const wsServer = new Server(httpsServer, {
        transports: ["websocket", "polling"],
        cors: {
            origin: "*", // Allows all origins
            methods: ["GET", "POST"], // Allows only GET and POST requests
        },
    });
    var session = require("express-session")({
        secret: crypto.randomBytes(64).toString("hex"),
        resave: true,
        saveUninitialized: true,
        httpOnly: true, // Don't let browser javascript access cookies.
        secure: true, // Only use cookies over https.
    });
    // Share session with io sockets
    wsServer.use(sharedsession(session));

    // Setup Redis adapter for Socket.IO
    wsServer.adapter(createAdapter(redisClient, redisSubscriber));

    wsServer.on("connection", (socket) => {
        console.log(
            `${formatCurrentDateTime()} - socket connected with id: ${socket.id
            }`
        );
        webSocketClients.add(socket);
        connectedUsers[socket.handshake.sessionID] = socket;
        //console.log(socket);
        global.store.clients.set(socket.handshake.sessionID, socket);
        socket.on("init", async () => {
            console.log(
                `${formatCurrentDateTime()} - \t${socket.id
                } - frontend client to socket server - 'init' event - session id : ${socket.handshake.sessionID
                }. Getting latest releases...`
            );
            wsServer.to(socket.id).emit("initComplete", "done");
        });

        socket.on("disconnect", () => {
            if (connectedUsers[socket.handshake.sessionID]) {
                delete connectedUsers[socket.handshake.sessionID];
                global.store.clients.delete(socket.handshake.sessionID);
                console.log(
                    `${formatCurrentDateTime()} - socket disconnected with id: ${socket.id
                    }. Deleted session: ${socket.handshake.sessionID}`
                );
            }
            webSocketClients.delete(socket);
        });
    });

    global.store.webSocket = wsServer;

    // Handling requests for Next.js
    server.all("*", (req, res) => {
        return handle(req, res);
    });

    const httpServer = server.listen(http_port, (err) => {
        if (err) throw err;
        var host = httpServer.address().address;
        var port = httpServer.address().port;

        console.log(
            `${formatCurrentDateTime()} - app listening at http://%s:%s`,
            host,
            port
        );
    });

    // This line is from the Node.js HTTPS documentation.
    httpsServer.listen(https_port, function (err) {
        if (err) throw err;
        var host = httpsServer.address().address;
        var port = httpsServer.address().port;

        console.log(
            `${formatCurrentDateTime()} - app listening at https://%s:%s`,
            host,
            port
        );
    });
});
