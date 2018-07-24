import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

/**
 * Generated class for the UrlSanitizerPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'urlSanitizer',
})
export class UrlSanitizerPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  constructor(public dom:DomSanitizer){}
  transform(value: string, ...args) {
    return this.dom.bypassSecurityTrustResourceUrl(value);
  }
}
