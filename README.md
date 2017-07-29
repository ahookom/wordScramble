# WordScramble

WordScramble is a game build with ReactNative where players create new English words from old ones by adding/removing/swapping single letters.
It has two modes: "standard" and "path." In "standard" mode, the player maintains a hand of 10 new letters to pick from to alter the current word, and goes as long as she can stay alive.
In "path" mode, the player is given a specific starting word and target word, and a limited number of letters to use to reach the target word.

To get started developing wordScramble, clone the repo:

```
git clone https://github.com/ahookom/wordScramble.git
```

navigate into the parent directory and install the node dependencies:

``` 
cd Slam
npm install 
```

You'll also need to install the react-native command-line interface. One way to do so is like this:

```
npm install -g react-native-cli
```

To run the code, you'll need to either hook an actual iOS or Android phone up to your computer via USB OR you can use an emulator.
If you are using an Android phone, you'll need to set it to "debugging mode." (Instructions here: https://www.kingoapp.com/root-tutorials/how-to-enable-usb-debugging-mode-on-android.htm)

The Android emulator has a reputation for being buggy, so I recommend the iPhone emulator that comes with xCode in macOS if you want to use an emulator.

Once you have a device or an emulator, the react-native CLI will automatically detect it, so you can run the code easily:

```
react-native run-android
```
or
```
react-native run-ios
```

That will both open the application itself as well as a terminal that will serve up debugging information to localhost:8081. To see that debugging information, navigate to localhost:8081 inside a web browser and open the developer console to see any console.log outputs that get generated as you use your application in the emulator/phone.
