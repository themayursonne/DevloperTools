import { Routes } from '@angular/router';
import { JsonEditorComponent } from './json-editor/json-editor.component';
import { TextUtilitiesComponent } from './text-utilities/text-utilities.component';
import { CodeBeautifierComponent } from './code-beautifier/code-beautifier.component';
import { ImageSizeConverterComponent } from './image-size-convertor/image-size-converter.component';
import { ColumnToRowComponent } from './columntorow/columntorow.component';
import { Base64ToolComponent } from './base64-tool/base64-tool.component';


export const routes: Routes = [
  { path: '', redirectTo: 'json-editor', pathMatch: 'full' },
  { path: 'json-editor', component: JsonEditorComponent },
  { path: 'text-utilities', component: TextUtilitiesComponent },
  { path: 'code-beautifier', component: CodeBeautifierComponent },
  { path: 'image-size-converter', component: ImageSizeConverterComponent },
  { path: 'columntorow', component: ColumnToRowComponent },
  { path: '', redirectTo: 'base64-tool', pathMatch: 'full' },
  { path: 'base64-tool', component: Base64ToolComponent },
<<<<<<< HEAD
  { path: '**', redirectTo: 'base64-tool' } 
=======
  { path: 'columntorow', component: ColumnToRowComponent },
  { path: '**', redirectTo: 'json-editor' }
>>>>>>> 0b92b67c01e79391a3e4bcd29e938937ef764443
];