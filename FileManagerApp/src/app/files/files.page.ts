import { Component, OnInit } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.page.html',
  styleUrls: ['./files.page.scss'],
  standalone: false,
})
export class FilesPage implements OnInit {
  fileList: { name: string, content: string | Blob }[] = [];

  constructor(private stateManagement: StateService) { }

  async ngOnInit() {
    this.fileList = await this.stateManagement.getState('fileList') || [];
    this.loadFileList();
  }

  async loadFileList() {
    try {
      const result = await Filesystem.readdir({
        path: '',
        directory: Directory.Documents
      });
      for (const file of result.files) {
        const contents = await Filesystem.readFile({
          path: file.name,
          directory: Directory.Documents,
        });
        this.fileList.push({ name: file.name, content: contents.data });
      }
    } catch (error) {
      console.error('Error reading directory', error);
    }
  }

  async updateFileList(newFileList: any) {
    this.fileList = newFileList;
    await this.stateManagement.setState('fileList', newFileList);
  }
}
