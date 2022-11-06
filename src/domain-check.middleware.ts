import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DomainCheckMiddleware implements NestMiddleware {
    private logger = new Logger(DomainCheckMiddleware.name);
    private domains = ['groupbuy.hutsaio.com', 'groupbuy.stage.hutsaio.com'];

    use(req: Request, res: Response, next: NextFunction) {
        if (this.domains.includes(req.hostname)){
            this.logger.verbose('Redirected groupbuy request to Discohook');
            res.redirect('https://discohook.org/?data=eyJtZXNzYWdlcyI6W3siZGF0YSI6eyJjb250ZW50IjpudWxsLCJlbWJlZHMiOlt7InRpdGxlIjoiSHV0c0FJTyAyLjAgSW50ZXJlc3QgQ2hlY2siLCJkZXNjcmlwdGlvbiI6IlRoZSBtb3N0IGFkdmFuY2VkIENocm9tZSBBdXRvbWF0aW9uXG5cbioqU2l0ZWxpc3QqKlxuLSBTbmlwZXMgKDQwNCBieXBhc3MpXG4tIFNvbGVib3hcbi0gWmFsYW5kb1xuLSBMdWlzYXZpYXJvbWFcbi0gU3VwcmVtZVxuLSBOZXcgQmFsYW5jZVxuLSBTaG9waWZ5XG5cbioqVG9vbHMgYW5kIGZlYXR1cmVzKiotXG4tIEF1dG8gdXBkYXRlc1xuLSBEZXNrdG9wIGFwcFxuLSBDaHJvbWUgaW5zdGFuY2Ugc3Bhd25lclxuLSBCZXN0IFVJIG9uIHRoZSBtYXJrZXRcbi0gUHJvZmlsZXMgYW5kIHdlYmhvb2sgc3luY2hyb25pemVkIGluIHRoZSBjbG91ZFxuLSBSZWxlYXNlIGd1aWRlc1xuXG4qKlByaWNpbmcqKlxufn7igqwxOSw5NSAvbW9udGgsIOKCrDM5LDk1IGluaXRpYWwgZmVlfn5cbioqMTQgZGF5cyBmcmVlIHRyaWFsIC0gdGhlbiDigqwxOSw5NSAvbW9udGgqKiIsInVybCI6Imh0dHBzOi8vdHdpdHRlci5jb20vaHV0c2FpbyIsImNvbG9yIjo2NTE0NDE3LCJmb290ZXIiOnsidGV4dCI6Ikh1dHNBSU8iLCJpY29uX3VybCI6Imh0dHBzOi8vaS5pbWd1ci5jb20vY3pweTRCcS5wbmcifSwidGltZXN0YW1wIjoiMjAyMi0wOC0xMlQwNzo1MzowMC4wMDBaIiwiaW1hZ2UiOnsidXJsIjoiaHR0cHM6Ly9pLmltZ3VyLmNvbS9MREdobGdmLnBuZyJ9fV0sImF0dGFjaG1lbnRzIjpbXX19XX0');
        }else{
            next();
        }
    }
}