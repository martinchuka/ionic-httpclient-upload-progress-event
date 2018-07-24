import { NgModule } from '@angular/core';
import { UrlSanitizerPipe } from './url-sanitizer/url-sanitizer';
@NgModule({
	declarations: [UrlSanitizerPipe],
	imports: [],
	exports: [UrlSanitizerPipe]
})
export class PipesModule {}
