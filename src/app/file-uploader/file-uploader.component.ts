import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit {

  private apiURL = environment.apiURL + "/FileUploader";
  constructor(private http: HttpClient) { }
  message: string = "";
  progress: number = 0;

  @Output()
  onUploadFinished = new EventEmitter();

  ngOnInit(): void {
  }

  uploadFile(event: Event) {

    const element = event.currentTarget as HTMLInputElement;
    let files: FileList | null = element.files;

    if (files?.length === 0) {
      return;
    }
    const formData = new FormData();
    for (var i = 0; i < (files?.length || false) ; i++) {
      let file = <File>files?.item(i);
      formData.append('files', file, file.name);
  }


    this.http.post(this.apiURL, formData, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / (event.total || 0));
        } else if (event.type === HttpEventType.Response) {
          this.message = "Upload Finished!";
          this.onUploadFinished.emit(event.body);
        }
      });
  }
}
