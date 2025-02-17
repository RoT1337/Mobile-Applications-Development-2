import { Component } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  fileName: string = '';
  fileContent: string | Blob = '';
  fileList: string[] = [];

  constructor(private stateManagement: StateService) {
    this.refreshFileList();
  }

  async createFile() {
    try {
      await Filesystem.writeFile({
        path: this.fileName,
        data: this.fileContent,
        directory: Directory.Documents,
      });
      alert('File created successfully!');
      this.refreshFileList();
    } catch (error) {
      console.error('Error creating file', error);
      alert('File has not be created. Check the console');
    }
  }

  async readFile() {
    try {
      const contents = await Filesystem.readFile({
        path: this.fileName,
        directory: Directory.Documents,
      });
      this.fileContent = contents.data;
      alert('File content loaded!');
    } catch (error) {
      console.error('Error reading file', error);
      alert('Error reading files. Check the console');
    }
  }

  async deleteFile() {
    try {
        await Filesystem.deleteFile({
        path: this.fileName,
        directory: Directory.Documents,
      });
      alert('File deleted successfully');
      this.refreshFileList();
    } catch (error) {
      console.error('Error deleting files', error);
      alert('Error deleting files. Check the console');
    }
  }

  async refreshFileList() {
    try {
      const result = await Filesystem.readdir({
        path: '',
        directory: Directory.Documents
      });
      this.fileList = result.files.map(file => file.name);
      await this.stateManagement.setState('fileList', this.fileList);
    } catch (error) {
      console.error('Error reading directory', error);
    }
  }
}
