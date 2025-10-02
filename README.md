# Spectergram 🔐

A secure, end-to-end encrypted Progressive Web App (PWA) for ephemeral messaging. Built for Azure hosting with privacy and security as top priorities.

## Features

- 🔒 **End-to-End Encryption**: All messages are encrypted using Web Crypto API (AES-GCM + RSA-OAEP)
- 💨 **Ephemeral Messages**: No conversation history is saved - messages exist only in memory
- 🌐 **Online Only**: Real-time communication without persistent storage
- 📱 **Progressive Web App**: Installable on mobile and desktop devices
- ☁️ **Azure Ready**: Configured for deployment on Azure Static Web Apps and Azure SignalR Service
- 🎨 **Modern UI**: Clean, responsive interface with dark mode

## Security Architecture

### Encryption
- **RSA-OAEP (2048-bit)** for key exchange
- **AES-GCM (256-bit)** for message encryption
- **Random IV** for each message
- **No server-side decryption** - keys never leave client devices

### Privacy
- Messages are never stored on servers
- No user authentication or tracking
- No message history or logs
- Communication ends when users leave the room

## Quick Start

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/redbeardmeric/Spectergram.git
   cd Spectergram
   ```

2. Serve the application using any static web server:
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

4. For testing, open multiple browser windows/tabs to simulate different users

### Usage

1. Enter a username and room name
2. Click "Join Room"
3. Share the room name with others
4. Start sending encrypted messages
5. Messages disappear when you leave the room

## Azure Deployment

See [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md) for detailed deployment instructions.

### Quick Azure Deployment

```bash
# Create Azure Static Web App
az staticwebapp create \
  --name spectergram \
  --resource-group your-resource-group \
  --source https://github.com/your-username/Spectergram \
  --location "Central US" \
  --branch main \
  --app-location "/" \
  --output-location "/"

# Create Azure SignalR Service (for production)
az signalr create \
  --name spectergram-signalr \
  --resource-group your-resource-group \
  --sku Free_F1 \
  --location "Central US"
```

## Technology Stack

- **Frontend**: Pure JavaScript (ES6+), HTML5, CSS3
- **Encryption**: Web Crypto API
- **Real-time Communication**: Azure SignalR Service (or localStorage mock for local development)
- **PWA**: Service Workers, Web App Manifest
- **Hosting**: Azure Static Web Apps

## Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   User Device   │         │   User Device   │
│                 │         │                 │
│  ┌───────────┐  │         │  ┌───────────┐  │
│  │  Browser  │  │         │  │  Browser  │  │
│  │           │  │         │  │           │  │
│  │  Crypto   │  │         │  │  Crypto   │  │
│  │  Engine   │  │         │  │  Engine   │  │
│  └─────┬─────┘  │         │  └─────┬─────┘  │
│        │        │         │        │        │
└────────┼────────┘         └────────┼────────┘
         │                           │
         │    Encrypted Messages     │
         └───────────┬───────────────┘
                     │
              ┌──────▼──────┐
              │    Azure    │
              │   SignalR   │
              │   Service   │
              └─────────────┘
              (Message relay
               only - cannot
               decrypt)
```

## File Structure

```
Spectergram/
├── index.html              # Main application HTML
├── styles.css              # Application styles
├── app.js                  # Main application logic
├── crypto.js               # Encryption/decryption utilities
├── signalr.js              # Real-time messaging manager
├── service-worker.js       # PWA service worker
├── manifest.json           # PWA manifest
├── staticwebapp.config.json # Azure Static Web Apps config
├── icons/                  # App icons (various sizes)
├── screenshots/            # App screenshots
├── AZURE_DEPLOYMENT.md     # Azure deployment guide
└── README.md              # This file
```

## Browser Support

- Chrome 60+
- Firefox 57+
- Safari 11.1+
- Edge 79+

**Note**: Web Crypto API is required and only works over HTTPS (or localhost for development).

## Development

### Local Testing

The application includes a mock SignalR implementation for local development that uses localStorage to simulate real-time messaging. This allows you to test the full functionality without setting up Azure services.

To test with multiple users:
1. Open the app in multiple browser windows/tabs
2. Use different usernames but the same room name
3. Send messages between windows

### Production Deployment

For production use with real Azure SignalR:
1. Follow the [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md) guide
2. Update `signalr.js` to use the real Azure SignalR connection
3. Configure environment variables in Azure

## Security Considerations

### What's Protected
- ✅ Message content (end-to-end encrypted)
- ✅ Communication privacy (no server-side storage)
- ✅ User anonymity (no authentication required)

### What's Not Protected
- ⚠️ Metadata (who's in which room, message timestamps)
- ⚠️ Room names (transmitted in plaintext)
- ⚠️ User presence (visible to all room members)

### Best Practices
- Use unique, hard-to-guess room names
- Don't share sensitive room names over insecure channels
- Verify users through out-of-band communication
- Close the app when done to clear all keys and messages

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with modern web standards
- Designed for Azure cloud services
- Inspired by privacy-focused messaging apps

---

**Note**: This is a demonstration application. For production use with sensitive data, additional security measures and auditing are recommended.