const cv = require('opencv4nodejs');

try {
    const camera = new cv.VideoCapture(0);
    const delay = 10;

    while(true) {
        let frame = camera.read();
        //loop back to start on end of stream reached
        if (frame.empty) {
            camera.reset();
            frame = camera.read();
        }

        //let flipFrame = cv.flp
        cv.imshow('Camera feed', frame);

        const key = cv.waitKey(delay); 
        // press esc to quit
        if (key == 27) {
            break;
        }
    }
}
catch (e) {
    console.log("Could not start camera: ", e);
}