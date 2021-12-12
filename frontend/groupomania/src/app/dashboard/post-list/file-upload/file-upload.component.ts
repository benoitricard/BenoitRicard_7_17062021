import { Component, Injectable, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
@Injectable()
export class FileUploadComponent implements OnInit {
  postCreationForm = new FormGroup({
    content: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    attachment: new FormControl(''),
    attachmentSource: new FormControl(''),
  });

  get f() {
    return this.postCreationForm.controls;
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const attachment = event.target.files[0];
      this.postCreationForm.patchValue({
        attachmentSource: attachment,
      });
    }
  }

  onPostCreation() {
    const formData = new FormData();
    formData.append(
      'attachment',
      this.postCreationForm.get('attachmentSource')?.value
    );
    formData.append('content', this.postCreationForm.get('content')?.value);

    this.httpClient
      .post('http://localhost:3000/api/post', formData)
      .subscribe(() => {});
  }

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {}
}
