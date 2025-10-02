// Main application logic
class SpectrogramApp {
    constructor() {
        this.cryptoManager = new CryptoManager();
        this.signalRManager = new SignalRManager();
        this.currentUser = null;
        this.currentRoom = null;
        this.roomSharedKey = null;
        this.initializeEventListeners();
    }

    /**
     * Initialize the application
     */
    async initialize() {
        try {
            // Generate encryption keys
            await this.cryptoManager.generateKeyPair();
            
            // Initialize SignalR connection
            await this.signalRManager.initialize();
            
            // Setup SignalR event handlers
            this.setupSignalRHandlers();
            
            // Register service worker for PWA
            this.registerServiceWorker();
            
            console.log("Application initialized successfully");
        } catch (error) {
            console.error("Failed to initialize application:", error);
            this.showError("Failed to initialize the application. Please refresh the page.");
        }
    }

    /**
     * Initialize UI event listeners
     */
    initializeEventListeners() {
        // Join room button
        document.getElementById('joinButton').addEventListener('click', () => {
            this.handleJoinRoom();
        });

        // Enter key to join room
        document.getElementById('roomInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleJoinRoom();
            }
        });

        document.getElementById('usernameInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleJoinRoom();
            }
        });

        // Send message button
        document.getElementById('sendButton').addEventListener('click', () => {
            this.handleSendMessage();
        });

        // Enter key to send message
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSendMessage();
            }
        });

        // Leave room button
        document.getElementById('leaveButton').addEventListener('click', () => {
            this.handleLeaveRoom();
        });
    }

    /**
     * Setup SignalR event handlers
     */
    setupSignalRHandlers() {
        // Connection status changed
        this.signalRManager.onConnectionChanged = (isConnected) => {
            this.updateConnectionStatus(isConnected);
        };

        // Message received
        this.signalRManager.onMessageReceived = async (username, encryptedMessage, timestamp) => {
            await this.handleMessageReceived(username, encryptedMessage, timestamp);
        };

        // User joined
        this.signalRManager.onUserJoined = (username) => {
            if (username !== this.currentUser) {
                this.addSystemMessage(`${username} joined the room`);
                // Exchange public keys
                this.exchangeKeys();
            }
        };

        // User left
        this.signalRManager.onUserLeft = (username) => {
            this.addSystemMessage(`${username} left the room`);
        };

        // Key exchange
        this.signalRManager.onKeyExchange = async (fromUser, publicKey) => {
            if (fromUser !== this.currentUser) {
                await this.handleKeyExchange(fromUser, publicKey);
            }
        };
    }

    /**
     * Handle joining a room
     */
    async handleJoinRoom() {
        const username = document.getElementById('usernameInput').value.trim();
        const roomName = document.getElementById('roomInput').value.trim();

        if (!username || !roomName) {
            alert('Please enter both username and room name');
            return;
        }

        try {
            // Join the room
            await this.signalRManager.joinRoom(username, roomName);
            
            this.currentUser = username;
            this.currentRoom = roomName;

            // Generate and share room encryption key
            this.roomSharedKey = await this.cryptoManager.generateSharedKey();

            // Update UI
            document.getElementById('currentUser').textContent = username;
            document.getElementById('currentRoom').textContent = roomName;
            
            this.switchToScreen('chatScreen');

            // Exchange public keys with other users
            await this.exchangeKeys();

        } catch (error) {
            console.error("Failed to join room:", error);
            alert('Failed to join room. Please try again.');
        }
    }

    /**
     * Handle leaving a room
     */
    async handleLeaveRoom() {
        try {
            await this.signalRManager.leaveRoom();
            
            // Clear encryption keys
            this.cryptoManager.clearSharedKeys();
            this.roomSharedKey = null;

            // Clear messages
            const messagesContainer = document.getElementById('messagesContainer');
            messagesContainer.innerHTML = `
                <div class="welcome-message">
                    <p>🔐 End-to-end encrypted chat</p>
                    <p>Messages are ephemeral and not saved anywhere</p>
                </div>
            `;

            // Clear input fields
            document.getElementById('usernameInput').value = '';
            document.getElementById('roomInput').value = '';
            document.getElementById('messageInput').value = '';

            this.currentUser = null;
            this.currentRoom = null;

            this.switchToScreen('setupScreen');

        } catch (error) {
            console.error("Failed to leave room:", error);
        }
    }

    /**
     * Handle sending a message
     */
    async handleSendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();

        if (!message) {
            return;
        }

        try {
            // Encrypt the message
            const encryptedMessage = await this.cryptoManager.encryptMessage(
                message,
                this.roomSharedKey
            );

            // Send encrypted message
            await this.signalRManager.sendMessage(encryptedMessage);

            // Display own message
            this.addMessage(this.currentUser, message, new Date().toISOString(), true);

            // Clear input
            messageInput.value = '';

        } catch (error) {
            console.error("Failed to send message:", error);
            alert('Failed to send message. Please try again.');
        }
    }

    /**
     * Handle receiving a message
     */
    async handleMessageReceived(username, encryptedMessage, timestamp) {
        if (username === this.currentUser) {
            // Don't display our own messages again
            return;
        }

        try {
            // Decrypt the message
            const decryptedMessage = await this.cryptoManager.decryptMessage(
                encryptedMessage,
                this.roomSharedKey
            );

            // Display the message
            this.addMessage(username, decryptedMessage, timestamp, false);

        } catch (error) {
            console.error("Failed to decrypt message:", error);
            this.addMessage(username, "[Encrypted message]", timestamp, false);
        }
    }

    /**
     * Exchange encryption keys with other users
     */
    async exchangeKeys() {
        try {
            const publicKey = await this.cryptoManager.exportPublicKey();
            await this.signalRManager.exchangePublicKey(publicKey);
        } catch (error) {
            console.error("Failed to exchange keys:", error);
        }
    }

    /**
     * Handle key exchange from another user
     */
    async handleKeyExchange(fromUser, publicKeyString) {
        try {
            const publicKey = await this.cryptoManager.importPublicKey(publicKeyString);
            // Store for future use if needed
            console.log(`Received public key from ${fromUser}`);
        } catch (error) {
            console.error("Failed to handle key exchange:", error);
        }
    }

    /**
     * Add a message to the chat
     */
    addMessage(username, message, timestamp, isOwn) {
        const messagesContainer = document.getElementById('messagesContainer');
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${isOwn ? 'own' : 'other'}`;
        
        const time = new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        messageElement.innerHTML = `
            ${!isOwn ? `<div class="message-sender">${username}</div>` : ''}
            <div class="message-text">${this.escapeHtml(message)}</div>
            <div class="message-time">${time}</div>
        `;

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    /**
     * Add a system message to the chat
     */
    addSystemMessage(message) {
        const messagesContainer = document.getElementById('messagesContainer');
        
        const messageElement = document.createElement('div');
        messageElement.className = 'message system-message';
        messageElement.textContent = message;

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    /**
     * Update connection status indicator
     */
    updateConnectionStatus(isConnected) {
        const statusDot = document.getElementById('connectionStatus');
        const statusText = document.getElementById('connectionText');

        if (isConnected) {
            statusDot.classList.remove('offline');
            statusDot.classList.add('online');
            statusText.textContent = 'Connected';
        } else {
            statusDot.classList.remove('online');
            statusDot.classList.add('offline');
            statusText.textContent = 'Disconnected';
        }
    }

    /**
     * Switch between screens
     */
    switchToScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    /**
     * Register service worker for PWA functionality
     */
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/service-worker.js');
                console.log('Service Worker registered:', registration);
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        alert(message);
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', async () => {
    app = new SpectrogramApp();
    await app.initialize();
});
