# ArduKIT Knowledge Base

This document serves as a comprehensive reference for the ArduKIT (Arduino & Raspberry Pi Development Kit) to be used by LLMs and developers.

## Hardware Overview
ArduKIT is based on the **Arduino Mega 2560** platform, providing a wide range of onboard peripherals for physical computing and IoT experiments.

## Pin Mapping Table

| Component | Arduino Mega Pin(s) | Type | Notes / Usage |
| :--- | :--- | :--- | :--- |
| **System LEDs** | 43, 44, 45, 46 | DO | LED 1 to 4. Logic HIGH = ON. |
| **RGB LED** | 3 (Red), 4 (Green), 2 (Blue) | PWM | Common cathode assumed. |
| **Buzzer** | 5 | PWM | Piezo buzzer for audio feedback. |
| **Relay** | 6 | DO | Active-high relay control. |
| **DC Motor 1** | 7 (1A), 8 (1B) | PWM | Typical H-Bridge (L293D/L298N) control. |
| **User Buttons** | 38, 39, 40, 41 | DI | Button 1 to 4. Active-high logic. |
| **Potentiometer** | A8 | AI | 10K Ohm linear potentiometer (0-1023). |
| **LM35 (Temp)** | A4 | AI | Linear temperature sensor (10mV/°C). |
| **PTC / NTC** | A9 / A10 | AI | Thermal resistors for temperature sensing. |
| **LDR (Light)** | A11 | AI | Photoresistor for light intensity. |
| **Character LCD** | **36**(RS), 37(E), **26**(D4), **27**(D5), **28**(D6), **29**(D7) | Bus | 16x2 Hitachi HD44780 compatible. |
| **Graphic LCD** | 31 (BL), 32 (RST) | Bus | 128x64 GLCD (KS0108). standard Mega pins for data. |
| **7-Segment Display** | Segs: 22-29, Digs: 33-**36** | Bus | 4-Digit multiplexed display. CC/CA depends on GND pins. |
| **Rotary Encoder** | 48 (Phase A), 49 (Phase B) | DI | Quadrature encoder for menu navigation. |
| **RTC (DS1307)** | 20 (SDA), 21 (SCL) | I2C | Real-time clock for timestamping. |
| **EEPROM (24C)** | 20 (SDA), 21 (SCL) | I2C | External memory (Addr: 0x50). |
| **SD Card Slot** | 51(MOSI), 50(MISO), 52(SCK), 53(CS) | SPI | Standard Mega SPI pins for data logging. |
| **GSM Module** | Serial 1 (Pins 18 TX, 19 RX) | UART | AT command interface for SMS/Calls. |
| **GPS Module** | Serial 2 (Pins 16 TX, 17 RX) | UART | NMEA data stream (usually 9600 or 115200 baud). |
| **Bluetooth / HMI** | Serial 3 (Pins 14 TX, 15 RX) | UART | Nextion HMI or HC-05/06 modules. |

## Critical Hardware Constraints & Conflicts

> [!IMPORTANT]
> **Pin Multiplexing / Conflicts:**
> - **Pin 36** is shared between the **Character LCD (RS)** and the **7-Segment Display (Digit 4)**.
> - **Pins 26, 27, 28, 29** are shared between the **Character LCD (D4-D7)** and the **7-Segment Display (Segments E, F, G, DP)**.
> 
> Parallel use of these components requires switching logic (jumpers/DIP switches) on the ArduKIT board or careful time-multiplexing in software.

## Common Software Logic Patterns

### 1. Multiplexed 7-Segment Display Logic
The 4-digit display shares segment pins (22-29) across all digits. To display a 4-digit number:
1.  Set the segment pattern for the desired number.
2.  Pull the specific Digit Common Pin (`GND1` to `GND4`, Pins 33-36) **HIGH** to enable that digit.
3.  Wait for a short duration (`DTime`, typically 4-5ms).
4.  Pull the Digit Common Pin **LOW** to disable.
5.  Repeat rapidly for all digits to create the illusion of a continuous display (Persistence of Vision).

### 2. Multi-Serial Handling (Mega 2560)
ArduKIT uses the Mega's multiple UARTS for concurrent communication:
-   **Serial0 (USB):** Debugging and PC control.
-   **Serial1 (GSM):** AT commands for telephony.
-   **Serial2 (GPS):** NMEA sentence streaming.
-   **Serial3 (HMI/Bluetooth):** GUI or remote data.
Typical logic uses `serialEventX()` functions to asynchronously capture strings into buffers for later processing in `loop()`.

### 3. GSM/GPRS AT Command Flow
Communication with the GSM module follows a strict sequence:
1.  **Text Mode:** `AT+CMGF=1\r`
2.  **Destination:** `AT+CMGS = "+90xxxxxxxxxx"`
3.  **Payload:** The SMS text.
4.  **Termination:** Sending the ASCII character `26` (Ctrl+Z) to trigger transmission.

### 4. GPS NMEA Parsing
The GPS module streams `.GPRMC` and `.GPGGA` sentences. Common logic involves:
-   Using `indexOf(',')` to find field separators.
-   `substring()` or `remove()` to extract Time, Latitude, Longitude, and Speed.

---

## Core Arduino Language & API Reference

Arduino uses a specialized dialect of **C++**. The environment abstracts away much of the boilerplate code (like the `main()` function) and provides a high-level API for hardware interaction.

### 1. Program Structure
Every Arduino program (`.ino`) must have these two functions:
-   **`void setup()`**: Runs once when the board is powered on or reset. Used for initializing pins, serial ports, or libraries.
-   **`void loop()`**: Runs continuously after `setup()`. This is where the main logic of the application resides.
-   **Preprocessor Commands**: Lines starting with `#` (e.g., `#include <Wire.h>` or `#define LED_PIN 13`) are handled before compilation.

### 2. Standard Digital I/O
-   **`pinMode(pin, mode)`**: Configures a pin as `INPUT`, `OUTPUT`, or `INPUT_PULLUP`.
-   **`digitalWrite(pin, value)`**: Sets a pin to `HIGH` (5V/3.3V) or `LOW` (0V).
-   **`digitalRead(pin)`**: Returns the current logic level of a pin (`HIGH` or `LOW`).

### 3. Standard Analog I/O
-   **`analogRead(pin)`**: Reads the voltage on an Analog-to-Digital Converter (ADC) pin. Returns an integer from `0` to `1023` (for 10-bit resolution).
-   **`analogWrite(pin, value)`**: Outputs a "Pseudo-Analog" signal using Pulse Width Modulation (PWM). Value ranges from `0` (off) to `255` (full duty cycle).

### 4. Serial Communication
-   **`Serial.begin(baud)`**: Initializes the serial port (e.g., `Serial.begin(9600)`).
-   **`Serial.print(value)` / `Serial.println(value)`**: Sends data to the computer as human-readable text.
-   **`Serial.available()`**: Returns the number of bytes available to read.
-   **`Serial.read()`**: Reads a single byte from the serial buffer.

### 5. Time and Control
-   **`delay(ms)`**: Pauses the program execution for a specified number of milliseconds (Blocking).
-   **`millis()`**: Returns the number of milliseconds passed since the program started (Non-blocking timing).

### 6. Common Data Types
-   **`int`**: 16-bit signed integer (approx. -32,768 to 32,767).
-   **`long`**: 32-bit signed integer.
-   **`byte`**: 8-bit unsigned integer (0 to 255).
-   **`char`**: 8-bit signed value, typically stores an ASCII character.
-   **`String`**: A class providing easier text manipulation (though use with caution due to memory fragmentation).
-   **`boolean`**: Stores `true` or `false`.

---

## Utility Function Registry

| Function | Origin File | Purpose |
| :--- | :--- | :--- |
| `pickNumber(int x)` | `7SEGMENT...` | Maps value 0-9 to high/low states for Pins 22-29. |
| `one()`, `two()`... | `7SEGMENT...` | Individual digit pattern helper functions. |
| `SendTextMessage()` | `GNDphone.ino` | Handles the AT command handshake to send an SMS. |
| `DialVoiceCall()` | `GNDphone.ino` | Initiates a voice call using `ATD`. |
| `GLCD.Init()` | `openGLCD` | Initializes the 128x64 pixels and control lines. |
| `rtc.adjust(DateTime)`| `RTClib` | Sets the DS1307 time (usually to `__DATE__` and `__TIME__`). |
| `SD.open(file, mode)`| `SD.h` | Opens a file on the FAT filesystem for logging. |
| `eeprom.writeBytes()` | `Eeprom24C` | Writes a byte array to external I2C memory. |

---

## External Libraries & Dependencies
The following libraries are essential for ArduKIT experiments:
-   **`LiquidCrystal.h`**: For 16x2 Character LCDs.
-   **`openGLCD.h`**: For KS0108-based Graphic LCDs.
-   **`Wire.h` / `RTClib.h`**: For I2C communication and RTC management.
-   **`SD.h` / `SPI.h`**: For SD card data logging.
-   **`Eeprom24C04_16.h`**: For specific external EEPROM chips used on the kit.

---

## Usage Recommendations for other LLMs
When generating code for ArduKIT:
1.  **Pin Conflict Awareness:** Be extremely careful with **Pin 36** (shared between LCD RS and 7-Segment Dig4) and **Pins 26-29** (shared between LCD Data and 7-Segment Segments). Simultaneous use requires board-level configuration or software-level timing management.
2.  **Serial Baud Rates:**
    -   PC Debug: 19200 (standard in examples) or 9600.
    -   GSM: 19200.
    -   GPS: 9600 or 115200 (check `setup()` in `GNDphone.ino`).
    -   HMI: 9600.
3.  **Interrupts:** Although the Mega has dedicated interrupt pins, many ArduKIT examples use polling (`digitalRead`) or `serialEventX()`. For mission-critical timing, recommend using `attachInterrupt()` on Pins 2, 3, 18, 19, 20, or 21 (if available/not in use).
4.  **Libraries:** Always include `Wire.h` when using RTC or EEPROM, and ensure `openGLCD.h` is configured for the specific pinout if using customized libraries.
