/**
 * EventBus.js
 * 
 * Provides decoupled communication between VirtualBoard and visual Peripherals.
 * Implements the Architecture Guardian's requirement for Event-Driven Feature Communication.
 */

class EventBus {
    constructor() {
        this.listeners = {};
    }

    /**
     * Subscribe to an event
     * @param {string} eventName 
     * @param {function} callback 
     */
    on(eventName, callback) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(callback);
    }

    /**
     * Unsubscribe from an event
     * @param {string} eventName 
     * @param {function} callback 
     */
    off(eventName, callback) {
        if (!this.listeners[eventName]) return;
        this.listeners[eventName] = this.listeners[eventName].filter(cb => cb !== callback);
    }

    /**
     * Publish an event to all subscribers
     * @param {string} eventName 
     * @param {any} payload 
     */
    emit(eventName, payload) {
        if (!this.listeners[eventName]) return;
        this.listeners[eventName].forEach(callback => callback(payload));
    }
}

// Export a singleton instance
export const eventBus = new EventBus();
