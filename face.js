const { settings } = require('cluster');
const { Point2 } = require('opencv4nodejs');
const cv = require('opencv4nodejs');

try {
    const faceClass = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

    const camera = new cv.VideoCapture(0);
    const delay = 10;

    const getFaceImage = (grayImg) => {
        const faceRects = faceClass.detectMultiScale(grayImg).objects;
        if (!faceRects.length) {
            //throw new Error('failed to detect faces');
            return null;
        }
        return faceRects[0];
    };

    while(true) {
        let frame = camera.read();
        //loop back to start on end of stream reached
        if (frame.empty) {
            camera.reset();
            frame = camera.read();
        }

        let grayImg = frame.bgrToGray();
        let faceRect = getFaceImage(grayImg);

        // draw rectangle on face or show text no face
        if(faceRect) {
            frame.drawRectangle(
                new cv.Point(faceRect.x, faceRect.y), 
                new cv.Point(faceRect.x + faceRect.width, faceRect.y + faceRect.height), 
                new cv.Vec3(0, 0, 255));
        }
        else {
            frame.putText('Face NOT Detected', new Point2(10, 50),cv.FONT_HERSHEY_PLAIN, 3, new cv.Vec3(255, 0, 0), 2, cv.LINE_AA);
        }
        
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