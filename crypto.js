// Crypto utilities for end-to-end encryption
class CryptoManager {
    constructor() {
        this.keyPair = null;
        this.sharedKeys = new Map(); // Store shared keys per user
    }

    /**
     * Generate a new RSA key pair for this user
     */
    async generateKeyPair() {
        try {
            this.keyPair = await window.crypto.subtle.generateKey(
                {
                    name: "RSA-OAEP",
                    modulusLength: 2048,
                    publicExponent: new Uint8Array([1, 0, 1]),
                    hash: "SHA-256",
                },
                true,
                ["encrypt", "decrypt"]
            );
            return this.keyPair;
        } catch (error) {
            console.error("Error generating key pair:", error);
            throw error;
        }
    }

    /**
     * Export public key to base64 string
     */
    async exportPublicKey() {
        if (!this.keyPair) {
            throw new Error("Key pair not generated");
        }
        
        const exported = await window.crypto.subtle.exportKey(
            "spki",
            this.keyPair.publicKey
        );
        
        const exportedAsString = this.arrayBufferToBase64(exported);
        return exportedAsString;
    }

    /**
     * Import a public key from base64 string
     */
    async importPublicKey(keyString) {
        try {
            const keyBuffer = this.base64ToArrayBuffer(keyString);
            
            const publicKey = await window.crypto.subtle.importKey(
                "spki",
                keyBuffer,
                {
                    name: "RSA-OAEP",
                    hash: "SHA-256",
                },
                true,
                ["encrypt"]
            );
            
            return publicKey;
        } catch (error) {
            console.error("Error importing public key:", error);
            throw error;
        }
    }

    /**
     * Generate a shared AES key for symmetric encryption
     */
    async generateSharedKey() {
        const key = await window.crypto.subtle.generateKey(
            {
                name: "AES-GCM",
                length: 256,
            },
            true,
            ["encrypt", "decrypt"]
        );
        return key;
    }

    /**
     * Encrypt a message using AES-GCM
     */
    async encryptMessage(message, sharedKey) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(message);
            
            // Generate a random IV for each message
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            
            const encrypted = await window.crypto.subtle.encrypt(
                {
                    name: "AES-GCM",
                    iv: iv,
                },
                sharedKey,
                data
            );
            
            // Combine IV and encrypted data
            const combined = new Uint8Array(iv.length + encrypted.byteLength);
            combined.set(iv, 0);
            combined.set(new Uint8Array(encrypted), iv.length);
            
            return this.arrayBufferToBase64(combined);
        } catch (error) {
            console.error("Error encrypting message:", error);
            throw error;
        }
    }

    /**
     * Decrypt a message using AES-GCM
     */
    async decryptMessage(encryptedMessage, sharedKey) {
        try {
            const combined = this.base64ToArrayBuffer(encryptedMessage);
            
            // Extract IV and encrypted data
            const iv = combined.slice(0, 12);
            const data = combined.slice(12);
            
            const decrypted = await window.crypto.subtle.decrypt(
                {
                    name: "AES-GCM",
                    iv: iv,
                },
                sharedKey,
                data
            );
            
            const decoder = new TextDecoder();
            return decoder.decode(decrypted);
        } catch (error) {
            console.error("Error decrypting message:", error);
            return "[Decryption failed]";
        }
    }

    /**
     * Encrypt the shared AES key with a user's public RSA key
     */
    async encryptSharedKey(sharedKey, recipientPublicKey) {
        try {
            const exportedKey = await window.crypto.subtle.exportKey("raw", sharedKey);
            
            const encrypted = await window.crypto.subtle.encrypt(
                {
                    name: "RSA-OAEP",
                },
                recipientPublicKey,
                exportedKey
            );
            
            return this.arrayBufferToBase64(encrypted);
        } catch (error) {
            console.error("Error encrypting shared key:", error);
            throw error;
        }
    }

    /**
     * Decrypt a shared AES key with our private RSA key
     */
    async decryptSharedKey(encryptedKey) {
        try {
            const encryptedBuffer = this.base64ToArrayBuffer(encryptedKey);
            
            const decrypted = await window.crypto.subtle.decrypt(
                {
                    name: "RSA-OAEP",
                },
                this.keyPair.privateKey,
                encryptedBuffer
            );
            
            const sharedKey = await window.crypto.subtle.importKey(
                "raw",
                decrypted,
                {
                    name: "AES-GCM",
                },
                true,
                ["encrypt", "decrypt"]
            );
            
            return sharedKey;
        } catch (error) {
            console.error("Error decrypting shared key:", error);
            throw error;
        }
    }

    /**
     * Store a shared key for a specific user
     */
    storeSharedKey(userId, sharedKey) {
        this.sharedKeys.set(userId, sharedKey);
    }

    /**
     * Get a shared key for a specific user
     */
    getSharedKey(userId) {
        return this.sharedKeys.get(userId);
    }

    /**
     * Clear all shared keys (when leaving room)
     */
    clearSharedKeys() {
        this.sharedKeys.clear();
    }

    // Helper methods
    arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    base64ToArrayBuffer(base64) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
    }
}
