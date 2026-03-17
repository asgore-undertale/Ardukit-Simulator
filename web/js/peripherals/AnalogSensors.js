import { eventBus } from '../core/EventBus.js';

/**
 * AnalogSensors.js
 * 
 * Manages the UI sliders for Potentiometer, LDR, and LM35.
 * Publishes changes to the VirtualBoard.
 */
export class AnalogSensors {
    constructor() {
        this.sensors = [
            { id: 'sensor-a8', labelId: 'label-a8', pin: 62, name: 'Potentiometer', unit: '' }, // A8 = 54 + 8 = 62
            { id: 'sensor-a11', labelId: 'label-a11', pin: 65, name: 'LDR', unit: '' },      // A11 = 54 + 11 = 65
            { id: 'sensor-a4', labelId: 'label-a4', pin: 58, name: 'LM35', unit: '°C' },      // A4 = 54 + 4 = 58
            { id: 'sensor-d30', labelId: 'label-d30', pin: 30, name: 'DS18B20', unit: '°C_RAW' } 
        ];

        this.sensors.forEach(sensor => {
            const slider = document.getElementById(sensor.id);
            const label = document.getElementById(sensor.labelId);
            
            if (slider) {
                slider.addEventListener('input', () => {
                    const val = parseInt(slider.value);
                    let displayVal = val;
                    
                    if (sensor.unit === '°C') {
                        displayVal = Math.round(val / 10) + '°C'; 
                    } else if (sensor.unit === '°C_RAW') {
                        displayVal = val + '°C';
                    }
                    
                    if (label) label.textContent = displayVal;
                    
                    // Notify board
                    if (sensor.unit === '°C_RAW') {
                        // For DS18B20, we just store the raw temperature in the states array
                        eventBus.emit('external:analogUpdate', { pin: sensor.pin, value: val });
                    } else {
                        eventBus.emit('external:analogUpdate', { pin: sensor.pin, value: val });
                    }
                });
                
                // Trigger initial state
                eventBus.emit('external:analogUpdate', { pin: sensor.pin, value: parseInt(slider.value) });
            }
        });
    }
}
