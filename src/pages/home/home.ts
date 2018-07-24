import {Component, ElementRef, ViewChild} from '@angular/core';
import {ActionSheetController} from 'ionic-angular';
import {HttpClient, HttpEvent, HttpEventType, HttpRequest} from "@angular/common/http";
import {catchError, tap,map,last} from "rxjs/operators";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('file')  public file:ElementRef;
  public files:{blob:any,url:string}={blob:{},url:null};
  public response:string='';
  public percentage=0;

  constructor(public http:HttpClient,public actionSheetCtrl:ActionSheetController) {

  }

  //click on file input
  public toggleSelector(){
    if(this.file && this.file.nativeElement){
      this.file.nativeElement.click();
    }
  }


  public openActionSheet(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select a file',
      buttons: [
        {
          text: 'Browse',
          role: 'destructive',
          handler: () => {
           this.toggleSelector();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

  //we are using upload test server - this should be installed on packages,'npm run start-server' to start. Uploaded files are in media-upload dir
  private upload(){
    let form=new FormData();
    form.append('file',this.files.blob)
    const req = new HttpRequest('POST', 'http://127.0.0.1:8989/upload', form, {
      reportProgress: true
    });
    let server=this.http.request(req).pipe(
      map(event=>this.getEventMessage(event)),
    tap(message =>(message)=>{this.showProgress(message)} ),
      last(),
      catchError((error)=>{
        throw new Error(error);
      })
    );
      server.subscribe(r=>{
    },error=>{
      console.log(error);
    });

  }


  private showProgress(message){
    this.response=message;
  }

  private getEventMessage(event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.Sent:
        this.response=`Uploading file "${this.files.blob.name}" of size ${this.files.blob.size}bytes.`
        return this.response;

      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        this.percentage = Math.round(100 * event.loaded / event.total);
        this.response=`"${this.files.blob.name}" is ${this.percentage}% uploaded.`;
        return this.response;

      case HttpEventType.Response:
        this.response=`"${this.files.blob.name}" was completely uploaded!`;
        this.files={blob:null,url:null};

        return this.response;

      default:
        this.response=`"${this.files.blob.name}" upload failed.`;
        return this.response;
    }
  }


  public selectFile(event){
    if(event.target && event.target.files && event.target.files.length){
      this.files.blob=event.target.files[0];
      this.files.url=URL.createObjectURL(this.files.blob);
    }
  }


  public isFileImage(){
    return  this.files.url && this.files.blob.type.indexOf('image')>-1;
  }
}
