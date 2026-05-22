
import { json } from 'sequelize';
import { WebSocket, WebSocketServer } from 'ws'

//for comments we only give to the scokets who are subcribed
// creating a map which will track match_id with socket

const matchSubcribers = new Map();

function subcribe(matchId, socket) {
    if (!matchSubcribers.has(matchId)) {
        matchSubcribers.set(matchId, new Set());
    }

    matchSubcribers.get(matchId).add(socket);
}


//when manually disconnected
function unsubcribe(matchId, socket) {
    if (!matchSubcribers.has(matchId)) {
        return;
    }
    matchSubcribers.get(matchId).delete(socket);
    if (matchSubcribers.get(matchId).size === 0) {
        matchSubcribers.delete(matchId);
    }
}

//when disconnected randomly
function cleanup_subscrptions(socket) {

    for (const matchId of socket.subcriptions) {
        unsubcribe(matchId, socket);
    }
}

function broadcastToMatch(matchId, payload) {

    const subcribers = matchSubcribers.get(matchId);
    if (!subcribers || subcribers.size === 0) {
        return;
    }

    const message = JSON.stringify(payload);
    for (const clint of subcribers) {
        if (clint.readyState === WebSocket.OPEN) {
            clint.send(message);
        }
    }
}


function handelMessage(socket, data) {

    let message;
    try {
        message = JSON.parse(data.toString());
    } catch (error) {
        sendJson(socket, { type: "error", message: "invalid data" })
    }

    if (message.type === "success" && Number.isInteger(message.matchId)) {
        subcribe(message.matchId, socket);
        socket.subcriptions.add(message.matchId)
        sendJson(socket, { type: "subcribed", matchId: message.matchId });
        return
    }
    if (message.type === "unsubcribe" && Number.isInteger(message.matchId)) {
        unsubcribe(message.matchId, socket);
        socket.subcriptions.delete(message.matchId)
        sendJson(socket, { type: "unsubcribe", matchId: message.matchId });
        return
    }
}

function sendJson(socket, payload) {
    if (socket.readyState !== WebSocket.OPEN) {
        return;
    }
    socket.send(JSON.stringify(payload));
}

function broadcast(wss, payload) {
    for (const client of wss.clients) {
        if (client.readyState !== WebSocket.OPEN) {
            continue;
        }
        client.send(JSON.stringify(payload));
    }
}

export function attachWebsocketServer(server) {

    const wss = new WebSocketServer({
        server,
        path: '/ws',
        maxPayload: 1024 * 1024
    })

    wss.on('connection', (socket) => {

        socket.subcriptions = new Set();
        sendJson(socket, { message: "socket connection established" });

        socket.on('message', (data) => {
            handelMessage(socket, data)
        })

        socket.on('error', () => {
            socket.terminate();
        })

        socket.on('close', () => {
            cleanup_subscrptions(socket)
        })
    })

    wss.on('error', (error) => {
        console.log(error);
    });

    function broadcastMatchCreated(match) {
        broadcast(wss, {
            type: 'match_created',
            data: match
        });
    }

    function broadcastComments(matchId, payload) {

        const normalizedMatchId = Number(matchId);

        console.log(
            'broadcasting commentary to:',
            normalizedMatchId,
            typeof normalizedMatchId
        );

        console.log('payload:', payload);

        broadcastToMatch(normalizedMatchId, {
            type: 'commentary',
            data: payload
        });
    }

    return {
        broadcastMatchCreated,
        broadcastComments
    };
}


