void setup() {
  // put your setup code here, to run once:

  // OUTPUT pin to send "launch" signal
  pinMode(13, OUTPUT);

  // Input pin to read button press
  pinMode(5, INPUT);


  //   +5V
  //   |
  //   |
  //   o
  //  (button) 
  //   o------------------|
  //   |                  W
  //   |                  W (pull down resistor, 10k ohm)
  //   o (pin 5)          W
  //                      |
  //                      |
  //                    _____
  //                     ___
  //                      _
}

void loop() {
  // put your main code here, to run repeatedly:
  if (digitalRead(5) == HIGH){
    digitalWrite(LED_BUILTIN, HIGH);   // turn the LED on (HIGH is the voltage level)  
  }else{
    digitalWrite(LED_BUILTIN, LOW);    // turn the LED off by making the voltage LOW
  }
}
