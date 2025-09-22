function wifi_connect (ssid: string, password: string) {
    serial.writeString("AT+CWMODE=1" + String.fromCharCode(13) + String.fromCharCode(10))
    read_list = wait_repsonse(1000)
    print_response(read_list, 1)
    serial.writeString("AT+CWJAP=\"" + ssid + "\",\"" + password + "\"" + String.fromCharCode(13) + String.fromCharCode(10))
    read_list = wait_repsonse(10000)
    print_response(read_list, 0)
    j = includes_response(read_list, "WIFI GOT IP")
    lcd20x4.writeLCD(lcd20x4.lcd20x4_eADDR(lcd20x4.eADDR.LCD_20x4), j)
    return j >= 0
}
input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    wifi_connect("TXT4.0-sWp6", "ozvTwHC7")
})
function wait_repsonse (timeout: number) {
    read_list = []
    end_zeit = input.runningTime() + timeout
    while (input.runningTime() < end_zeit) {
        read_string = serial.readString()
        if (read_string.length > 0) {
            let list: string[] = []
            list.push(read_string)
        }
        basic.pause(100)
    }
    return read_list
}
function mqtt_publish (topic: string, msg: string) {
    serial.writeString("AT+MQTTPUB=0,\"" + topic + "\",\"" + msg + "\",0,0" + String.fromCharCode(13) + String.fromCharCode(10))
    read_list = wait_repsonse(5000)
    print_response(read_list, 0)
}
function includes_response (read_list: any[], text: string) {
    for (let i = 0; i <= read_list.length - 1; i++) {
        if (("" + read_list[i]).includes(text)) {
            return i
        }
    }
    return -1
}
input.onButtonEvent(Button.AB, input.buttonEventClick(), function () {
    mqtt_publish("topic", "Hallo")
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    mqtt_connect("192.168.8.2", "1883")
})
function print_response (read_list: any[], zeile: number) {
    if (zeile == 0) {
        lcd20x4.clearScreen(lcd20x4.lcd20x4_eADDR(lcd20x4.eADDR.LCD_20x4), lcd20x4.eLCD_CLEARDISPLAY.LCD_CLEARDISPLAY)
    }
    lcd20x4.setCursor(lcd20x4.lcd20x4_eADDR(lcd20x4.eADDR.LCD_20x4), zeile, 0)
    lcd20x4.writeLCD(lcd20x4.lcd20x4_eADDR(lcd20x4.eADDR.LCD_20x4), "" + read_list.length + "~")
    for (let text of read_list) {
        lcd20x4.writeLCD(lcd20x4.lcd20x4_eADDR(lcd20x4.eADDR.LCD_20x4), "" + text + "$")
    }
}
function mqtt_connect (host: string, port: string) {
    serial.writeString("AT+CIPSTART=\"TCP\",\"" + host + "\"," + port + String.fromCharCode(13) + String.fromCharCode(10))
    read_list = wait_repsonse(5000)
    print_response(read_list, 0)
    at = "AT+MQTTUSERCFG=0,1,\"" + "calliope" + "\",\"\",\"\",0,0,\"\"" + String.fromCharCode(13) + String.fromCharCode(10)
    serial.writeString(at)
    read_list = wait_repsonse(2000)
    print_response(read_list, 1)
    at = "AT+MQTTCONN=0,\"" + host + "\"," + port + ",0" + String.fromCharCode(13) + String.fromCharCode(10)
    serial.writeString(at)
    read_list = wait_repsonse(5000)
    print_response(read_list, 2)
}
let at = ""
let read_string = ""
let end_zeit = 0
let j = 0
let read_list: number[] = []
lcd20x4.initLCD(lcd20x4.lcd20x4_eADDR(lcd20x4.eADDR.LCD_20x4))
serial.redirect(
SerialPin.C17,
SerialPin.C16,
BaudRate.BaudRate115200
)
serial.writeString("AT+GMR" + String.fromCharCode(13) + String.fromCharCode(10))
read_list = wait_repsonse(1000)
print_response(read_list, 0)
