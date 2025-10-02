// SignalR connection manager for real-time messaging
class SignalRManager {
    constructor() {
        this.connection = null;
        this.isConnected = false;
        this.currentRoom = null;
        this.currentUser = null;
        this.onMessageReceived = null;
        this.onUserJoined = null;
        this.onUserLeft = null;
        this.onConnectionChanged = null;
        this.onKeyExchange = null;
    }

    /**
     * Initialize SignalR connection
     * For local development, this will simulate the connection
     * For Azure deployment, use Azure SignalR Service connection string
     */
    async initialize(hubUrl = null) {
        // For now, we'll create a mock connection for demonstration
        // In production, you would use:
        // this.connection = new signalR.HubConnectionBuilder()
        //     .withUrl(hubUrl || "YOUR_AZURE_SIGNALR_URL")
        //     .withAutomaticReconnect()
        //     .build();

        this.connection = this.createMockConnection();
        this.setupEventHandlers();
        
        try {
            await this.connect();
        } catch (error) {
            console.error("Failed to initialize SignalR:", error);
            throw error;
        }
    }

    /**
     * Create a mock connection for local testing
     * This simulates SignalR behavior using localStorage and polling
     */
    createMockConnection() {
        return {
            state: 'Disconnected',
            on: (eventName, handler) => {
                if (!this._handlers) this._handlers = {};
                if (!this._handlers[eventName]) this._handlers[eventName] = [];
                this._handlers[eventName].push(handler);
            },
            start: async () => {
                this.connection.state = 'Connected';
                this.startPolling();
                return Promise.resolve();
            },
            stop: async () => {
                this.connection.state = 'Disconnected';
                this.stopPolling();
                return Promise.resolve();
            },
            invoke: async (methodName, ...args) => {
                // Simulate server-side processing
                return this.handleInvoke(methodName, ...args);
            },
            _handlers: {}
        };
    }

    /**
     * Setup event handlers for SignalR events
     */
    setupEventHandlers() {
        if (!this.connection) return;

        this.connection.on('ReceiveMessage', (username, message, timestamp) => {
            if (this.onMessageReceived) {
                this.onMessageReceived(username, message, timestamp);
            }
        });

        this.connection.on('UserJoined', (username) => {
            if (this.onUserJoined) {
                this.onUserJoined(username);
            }
        });

        this.connection.on('UserLeft', (username) => {
            if (this.onUserLeft) {
                this.onUserLeft(username);
            }
        });

        this.connection.on('KeyExchange', (fromUser, publicKey) => {
            if (this.onKeyExchange) {
                this.onKeyExchange(fromUser, publicKey);
            }
        });
    }

    /**
     * Connect to the SignalR hub
     */
    async connect() {
        try {
            await this.connection.start();
            this.isConnected = true;
            if (this.onConnectionChanged) {
                this.onConnectionChanged(true);
            }
        } catch (error) {
            console.error("Connection failed:", error);
            this.isConnected = false;
            if (this.onConnectionChanged) {
                this.onConnectionChanged(false);
            }
            throw error;
        }
    }

    /**
     * Disconnect from the SignalR hub
     */
    async disconnect() {
        if (this.connection) {
            await this.connection.stop();
            this.isConnected = false;
            if (this.onConnectionChanged) {
                this.onConnectionChanged(false);
            }
        }
    }

    /**
     * Join a chat room
     */
    async joinRoom(username, roomName) {
        if (!this.isConnected) {
            throw new Error("Not connected to SignalR");
        }

        this.currentUser = username;
        this.currentRoom = roomName;

        await this.connection.invoke('JoinRoom', username, roomName);
    }

    /**
     * Leave the current chat room
     */
    async leaveRoom() {
        if (!this.isConnected || !this.currentRoom) {
            return;
        }

        await this.connection.invoke('LeaveRoom', this.currentUser, this.currentRoom);
        this.currentRoom = null;
        this.currentUser = null;
    }

    /**
     * Send an encrypted message to the room
     */
    async sendMessage(encryptedMessage) {
        if (!this.isConnected || !this.currentRoom) {
            throw new Error("Not connected or not in a room");
        }

        await this.connection.invoke('SendMessage', this.currentRoom, this.currentUser, encryptedMessage);
    }

    /**
     * Exchange public keys with other users in the room
     */
    async exchangePublicKey(publicKey) {
        if (!this.isConnected || !this.currentRoom) {
            throw new Error("Not connected or not in a room");
        }

        await this.connection.invoke('ExchangePublicKey', this.currentRoom, this.currentUser, publicKey);
    }

    /**
     * Mock implementation: Handle method invocations
     */
    async handleInvoke(methodName, ...args) {
        const roomKey = `spectergram_room_${args[methodName === 'JoinRoom' ? 1 : 0]}`;
        
        switch (methodName) {
            case 'JoinRoom':
                const [username, roomName] = args;
                // Store user in room
                const room = JSON.parse(localStorage.getItem(roomKey) || '{"users": [], "messages": []}');
                if (!room.users.includes(username)) {
                    room.users.push(username);
                    localStorage.setItem(roomKey, JSON.stringify(room));
                }
                // Notify other users
                this.broadcastToRoom(roomKey, 'UserJoined', username);
                break;

            case 'LeaveRoom':
                const [user, room_name] = args;
                const roomData = JSON.parse(localStorage.getItem(roomKey) || '{"users": [], "messages": []}');
                roomData.users = roomData.users.filter(u => u !== user);
                localStorage.setItem(roomKey, JSON.stringify(roomData));
                this.broadcastToRoom(roomKey, 'UserLeft', user);
                break;

            case 'SendMessage':
                const [room_id, sender, message] = args;
                const timestamp = new Date().toISOString();
                this.broadcastToRoom(roomKey, 'ReceiveMessage', sender, message, timestamp);
                break;

            case 'ExchangePublicKey':
                const [roomId, fromUser, publicKey] = args;
                this.broadcastToRoom(roomKey, 'KeyExchange', fromUser, publicKey);
                break;
        }

        return Promise.resolve();
    }

    /**
     * Mock implementation: Broadcast events to room
     */
    broadcastToRoom(roomKey, eventName, ...args) {
        // Store event for polling
        const events = JSON.parse(localStorage.getItem(`${roomKey}_events`) || '[]');
        events.push({
            eventName,
            args,
            timestamp: Date.now()
        });
        localStorage.setItem(`${roomKey}_events`, JSON.stringify(events));
    }

    /**
     * Mock implementation: Poll for new events
     */
    startPolling() {
        this._pollInterval = setInterval(() => {
            if (!this.currentRoom) return;
            
            const roomKey = `spectergram_room_${this.currentRoom}`;
            const events = JSON.parse(localStorage.getItem(`${roomKey}_events`) || '[]');
            
            if (events.length > 0) {
                events.forEach(event => {
                    if (this.connection._handlers[event.eventName]) {
                        this.connection._handlers[event.eventName].forEach(handler => {
                            handler(...event.args);
                        });
                    }
                });
                // Clear processed events
                localStorage.setItem(`${roomKey}_events`, '[]');
            }
        }, 500);
    }

    /**
     * Mock implementation: Stop polling
     */
    stopPolling() {
        if (this._pollInterval) {
            clearInterval(this._pollInterval);
            this._pollInterval = null;
        }
    }
}
