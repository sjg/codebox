#include <Servo.h>

int incomingByte = 0;   // for incoming serial data
int ledPin = 13;
int servoPin = 10;

//Colour Strip inside Box
#define REDPIN 5
#define GREENPIN 6
#define BLUEPIN 3

int r, g, b;

Servo servoMain; 

void setup() {
        Serial.begin(9600);     // opens serial port, sets data rate to 9600 bps
        pinMode(ledPin, OUTPUT);
        digitalWrite(ledPin, LOW);
        servoMain.attach(servoPin);
        
        //Set Servo to default -- open
        servoMain.write(180);
        
        //Set the Pins for the LED Strip
        pinMode(REDPIN, OUTPUT);
        pinMode(GREENPIN, OUTPUT);
        pinMode(BLUEPIN, OUTPUT);
        
        r = 0;
        g = 0;
        b = 255;
                  
        analogWrite(REDPIN, r);
        analogWrite(GREENPIN, g);
        analogWrite(BLUEPIN, b);

        Serial.println("Ready");
}

void loop() {
        // send data only when you receive data:
        if (Serial.available() > 0) {
                // read the incoming byte:
                incomingByte = Serial.read();
                
                // say what you got:
                Serial.print("I received: ");
                Serial.println(incomingByte, DEC);
                
                if(incomingByte == 111){               // "wait till serial o"
                  //Set Strip Colour to Green
                  r = 0;
                  g = 255;
                  b = 0;
                  
                  analogWrite(REDPIN, r);
                  analogWrite(GREENPIN, g);
                  analogWrite(BLUEPIN, b);
                  
                  Serial.println("Opening the Box ....");
                  digitalWrite(ledPin, HIGH);
                  servoMain.write(180);
                }else if(incomingByte == 99){          // "wait till serial c"
                   //Set Strip Colour to Red                   
                   r = 255;
                   g = 0;
                   b = 0;
                  
                   analogWrite(REDPIN, r);
                   analogWrite(GREENPIN, g);
                   analogWrite(BLUEPIN, b);
                
                   Serial.println("Locking the Box ....");
                   digitalWrite(ledPin, LOW);
                   servoMain.write(128);
                }else{
                  //No valid input so set led to low
                  digitalWrite(ledPin, LOW);
                }              
        }
        
}
