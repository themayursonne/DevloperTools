import { Routes } from '@angular/router';
import { JsonEditorComponent } from './json-editor/json-editor.component';
import { TextUtilitiesComponent } from './text-utilities/text-utilities.component';
import { CodeBeautifierComponent } from './code-beautifier/code-beautifier.component';
import { ImageSizeConverterComponent } from './image-size-convertor/image-size-converter.component';
import { ColumnToRowComponent } from './columntorow/columntorow.component';
import { Base64ToolComponent } from './base64-tool/base64-tool.component';

export const routes: Routes = [
  { path: '', redirectTo: 'base64-tool', pathMatch: 'full' }, // default route
  { path: 'json-editor', component: JsonEditorComponent },
  { path: 'text-utilities', component: TextUtilitiesComponent },
  { path: 'code-beautifier', component: CodeBeautifierComponent },
  { path: 'image-size-converter', component: ImageSizeConverterComponent },
  { path: 'columntorow', component: ColumnToRowComponent },
  { path: 'base64-tool', component: Base64ToolComponent },
  { path: '**', redirectTo: 'base64-tool' } // wildcard route
];