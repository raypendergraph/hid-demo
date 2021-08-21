
# Intro
This toy project is to demonstrate how to interact with a HID device using React. The specific device used here is a Mag-Tek DynaMag card reader.

# Preliminary
The Mag-Tek DynaMag (and others) come configured as a Keyboard device. This will not work as cleanly in a browser due to how the OS and browser interpret
input from keyboards. In order for the device to work with [WebHID](https://developer.mozilla.org/en-US/docs/Web/API/WebHID_API) you will need to adjust the internal settings of the device to set it into HID mode. 
Follow the instruction in [this manual](https://www.magtek.com/content/documentationfiles/d998200076.pdf) to download the settings program for the device. The 
manual is not clear on this but after launching the configurator, under the top section `Reader Config Options` select `MODE_HID` from the dropdown and click the
`Change Config` button. After this the reader can be used by the WebHID API for Windows, MacOS and linux.

It's worth noting here that the device in Keyboard emulation mode binds with a  **productId** of `0x0001` but after it's switched over to HID mode it binds with `0x0002`.

Similarly the Symbol DS9208 barcode scanner needs to be switched from it's default mode to a UDB HID mode where it doesn't also send keystrokes to the web browser.  To accomplish this, set the DS9208 to IBM HAND-HELD USB mode which will change the **productId**  to `0x1300` and the **vendorId** will remain the same.  This can be accomplished by scanned the included quick refernce sheet with the appropriate mode barcode.

# Topaz signature tablet
The Topaz signature tablet will work if installed. You must have already installed the SigWeb binary available [here](https://topazsystems.com/sdks/sigweb.html). Once installed the page should be able to interact with the tablet. This device is **not** using the WebHID interface as the USB API for the devices are proprietary and require drivers. You must follow the instructions in the above link to properly install the binary driver and configure it for your specific tablet. 

# Running
`npm i && npm start`

If the device is previously unpaired then you can click the `Request Device` button to pair and open the device. Browsers only allow the pairing of devices directly inside a user gesture like a button click. So, somewhere in the app this will have to be done but it doesn't have to be done on this screen. Once opened the green light on the top of the reader will illuminate. If it has been paired already a react effect in the App component should pick up the previously paired device and make sure it's opened with no user interaction. Once the device is ready it will continue to read card swipes until the session is closed. 