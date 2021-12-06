import { Component, Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
@Injectable()
export class FileUploadComponent implements OnInit {
  onCreatePost(form: any) {
    this.httpClient.post('http://localhost:3000/api/post', form).subscribe(
      () => {
        window.location.reload();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  constructor(
    private httpClient: HttpClient,
    private uploadService: FileUploadService
  ) {}

  ngOnInit(): void {}
}
