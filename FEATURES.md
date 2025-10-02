# Spectergram Feature Documentation

## Overview

Spectergram is a privacy-focused, end-to-end encrypted messaging Progressive Web App designed for ephemeral, secure communication.

## Core Features

### 1. End-to-End Encryption

**Encryption Methods:**
- **RSA-OAEP (2048-bit)**: Used for secure key exchange between users
- **AES-GCM (256-bit)**: Used for encrypting message content
- **Random IV**: Each message uses a unique initialization vector for added security

**How It Works:**
1. When a user joins a room, they generate a unique RSA key pair
2. Public keys are exchanged with other users in the room
3. A shared AES key is generated for the room
4. All messages are encrypted using AES-GCM before transmission
5. Only users in the room can decrypt messages
6. The server never has access to encryption keys or decrypted messages

**Security Guarantees:**
- Server cannot read message content
- Messages are encrypted in the browser before transmission
- Keys are generated locally and never leave the device in unencrypted form
- Each session generates new keys

### 2. Ephemeral Messaging

**No Persistence:**
- Messages exist only in browser memory
- No database storage on the server
- No local storage of message content
- Messages disappear when the user leaves the room or closes the browser

**Benefits:**
- Maximum privacy - no conversation history can be recovered
- No need for manual deletion
- Reduces data breach risk to zero
- Complies with privacy-first principles

### 3. Progressive Web App (PWA)

**Installability:**
- Can be installed on mobile devices like a native app
- Works on desktop browsers with app-like experience
- Appears on home screen without app store

**Offline Capabilities:**
- Service worker caches app files
- App shell loads even without internet
- Graceful degradation when offline

**Features:**
- App icons in multiple resolutions
- Splash screen support
- Standalone display mode
- Theme color customization

### 4. Real-Time Communication

**SignalR Integration:**
- Real-time message delivery
- Presence detection (user join/leave notifications)
- Key exchange signaling
- Connection state management

**Local Development Mode:**
- Mock SignalR using localStorage
- Allows testing without Azure setup
- Simulates real-time behavior with polling

### 5. Modern UI/UX

**Design Features:**
- Dark theme optimized for readability
- Responsive layout for all screen sizes
- Clean, minimal interface
- Visual feedback for all actions
- Accessibility considerations

**User Experience:**
- Simple onboarding (username + room name)
- Clear encryption indicators
- Timestamp for each message
- Visual distinction between sent/received messages
- Connection status indicator

## Technical Architecture

### Frontend Stack
- Pure JavaScript (ES6+) - No framework dependencies
- HTML5 with semantic markup
- CSS3 with CSS variables for theming
- Web Crypto API for encryption
- Service Workers for PWA functionality

### Communication Layer
- Azure SignalR Service (production)
- WebSocket-based real-time messaging
- Automatic reconnection handling
- Message queuing during disconnection

### Security Layer
- Web Crypto API (browser-native encryption)
- No external encryption libraries
- Content Security Policy ready
- XSS protection through HTML escaping

## Usage Scenarios

### 1. Private Conversations
Two or more people who want to have a secure conversation without leaving any trace.

### 2. Temporary Group Chat
Teams collaborating on sensitive information that shouldn't be recorded.

### 3. Anonymous Communication
Users who want to communicate without creating accounts or leaving identifying information.

### 4. Zero-Trust Environments
Organizations that require end-to-end encryption and don't trust server-side storage.

## Limitations

### Current Limitations
1. **No Message History**: Messages cannot be retrieved after leaving the room
2. **No File Sharing**: Only text messages are supported
3. **No User Authentication**: Anyone with the room name can join
4. **No Moderation**: No built-in tools for managing inappropriate content
5. **Browser-Dependent**: Requires a modern browser with Web Crypto API support

### By Design
- Messages are not stored (feature, not bug)
- No user accounts (privacy by design)
- No server-side encryption (client-side only)

## Deployment Options

### Azure Static Web Apps + Azure SignalR Service
**Recommended for production use**

**Advantages:**
- Automatic HTTPS
- Global CDN distribution
- Serverless pricing model
- Integrated authentication (if needed in future)
- Built-in staging environments

**Free Tier Limits:**
- Azure Static Web Apps: 100 GB bandwidth/month
- Azure SignalR Service: 20 concurrent connections

### Self-Hosted
**For advanced users**

**Requirements:**
- HTTPS certificate (required for Web Crypto API)
- SignalR-compatible backend
- Static file hosting

## Future Enhancements

### Planned Features
- [ ] Voice/Video calling with WebRTC
- [ ] File sharing with end-to-end encryption
- [ ] Screen sharing
- [ ] Message reactions
- [ ] Typing indicators
- [ ] Read receipts (optional)
- [ ] Room passwords
- [ ] Invite links with expiration
- [ ] Multi-device sync (while preserving E2E encryption)

### Potential Improvements
- [ ] Mobile app versions (React Native/Flutter)
- [ ] Push notifications
- [ ] Image/GIF support
- [ ] Code snippet formatting
- [ ] Markdown support
- [ ] Dark/Light theme toggle
- [ ] Custom themes
- [ ] Localization/i18n

## Privacy & Security

### What We Collect
- **Nothing**: No analytics, no tracking, no user data

### What The Server Knows
- Active connections count
- Room names (in memory only)
- Encrypted message data (can't decrypt)
- Approximate message timestamps

### What The Server Doesn't Know
- Message content
- User identities (beyond chosen usernames)
- Conversation history
- Encryption keys

### Best Practices for Users
1. Choose unique, unpredictable room names
2. Share room names through secure channels only
3. Verify participants through out-of-band communication
4. Close the app when done to clear all data
5. Use on trusted devices only
6. Keep browser updated for latest security patches

## Troubleshooting

### Common Issues

**Service Worker Not Registering:**
- Ensure you're using HTTPS (or localhost)
- Clear browser cache and try again
- Check browser console for errors

**Messages Not Sending:**
- Check connection status indicator
- Verify internet connectivity
- Refresh the page

**Cannot Decrypt Messages:**
- Ensure you joined the room properly
- Try leaving and rejoining the room
- Check browser console for errors

**PWA Not Installing:**
- Ensure HTTPS is enabled
- Try using Chrome or Edge browser
- Check that manifest.json is loading correctly

### Browser Compatibility

**Fully Supported:**
- Chrome 60+
- Edge 79+
- Firefox 57+
- Safari 11.1+
- Opera 47+

**Not Supported:**
- Internet Explorer (all versions)
- Legacy Edge (pre-Chromium)
- Mobile browsers without Web Crypto API

## Contributing

We welcome contributions! Areas where help is needed:

1. **Security Audits**: Review encryption implementation
2. **Accessibility**: Improve ARIA labels and keyboard navigation
3. **Testing**: Comprehensive unit and integration tests
4. **Documentation**: Expand user guides and API docs
5. **Localization**: Translate to other languages
6. **Features**: Implement planned enhancements

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or feature requests, please use the GitHub Issues page.

---

*Last Updated: 2025*
