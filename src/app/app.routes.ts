import { Routes } from '@angular/router';
import { JsonEditorComponent } from './json-editor/json-editor.component';
import { TextUtilitiesComponent } from './text-utilities/text-utilities.component';
import { CodeBeautifierComponent } from './code-beautifier/code-beautifier.component';
import { ImageSizeConverterComponent } from './image-size-convertor/image-size-converter.component';

export const routes: Routes = [
  { path: '/', redirectTo: 'json-editor', pathMatch: 'full' },
  { path: 'json-editor', component: JsonEditorComponent },
  { path: 'text-utilities', component: TextUtilitiesComponent },
  { path: 'code-beautifier', component: CodeBeautifierComponent },
  { path: 'image-size-converter', component: ImageSizeConverterComponent }
];