import { Component, OnInit } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable'
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
    constructor(http : HttpClient){ 
        this.http = http;
    }
    // toggle webcam on/off
    public showWebcam = true;
    public allowCameraSwitch = true;
    public multipleWebcamsAvailable = false;
    public deviceId: string;
    public videoOptions: MediaTrackConstraints = {
       width: {ideal: 1024},
       height: {ideal: 576}
    };
    public errors: WebcamInitError[] = [];
    http : HttpClient;
    data : Object;

    // latest snapshot
    public webcamImage: WebcamImage = null;

    // webcam snapshot trigger
    private trigger: Subject<void> = new Subject<void>();
    // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
    private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

    public ngOnInit(): void {
      WebcamUtil.getAvailableVideoInputs()
        .then((mediaDevices: MediaDeviceInfo[]) => {
          this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
        });
    }

    public triggerSnapshot(): void {
        this.trigger.next();
        //var content: HttpHeaders =  new HttpHeaders({
        //    'Content-Type':  'application/json'
        //});
        //this.http.get("http://127.0.0.1:5000/");
        this.http.post(
            'http://127.0.0.1:5000/detect',
            JSON.stringify({
                image: this.webcamImage.imageAsBase64,
                //image: "asdfasdfasdf"
            })
        ).subscribe(data => {
            console.log(data);
        });
    }

    public toggleWebcam(): void {
      this.showWebcam = !this.showWebcam;
    }

    public handleInitError(error: WebcamInitError): void {
      this.errors.push(error);
    }

    public showNextWebcam(directionOrDeviceId: boolean|string): void {
      // true => move forward through devices
      // false => move backwards through devices
      // string => move to device with given deviceId
      this.nextWebcam.next(directionOrDeviceId);
    }

    public handleImage(webcamImage: WebcamImage): void {
      //console.info('received webcam image', webcamImage);
      this.webcamImage = webcamImage;
    }

    public cameraWasSwitched(deviceId: string): void {
      console.log('active device: ' + deviceId);
      this.deviceId = deviceId;
    }

    public get triggerObservable(): Observable<void> {
      return this.trigger.asObservable();
    }

    public get nextWebcamObservable(): Observable<boolean|string> {
      return this.nextWebcam.asObservable();
    }
}
