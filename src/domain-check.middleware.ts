import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DomainCheckMiddleware implements NestMiddleware {
    private logger = new Logger(DomainCheckMiddleware.name);
    private domains = ['groupbuy.hutsaio.com', 'groupbuy.stage.hutsaio.com'];

    use(req: Request, res: Response, next: NextFunction) {
        if (this.domains.includes(req.hostname)){
            this.logger.verbose('Redirected groupbuy request to Discohook');
            res.redirect('https://discohook.org/?data=eyJtZXNzYWdlcyI6W3siZGF0YSI6eyJjb250ZW50IjpudWxsLCJlbWJlZHMiOlt7InRpdGxlIjoiSHV0c0FJTyAyLjAgSW50ZXJlc3QgQ2hlY2siLCJkZXNjcmlwdGlvbiI6IlRoZSBtb3N0IGFkdmFuY2VkIENocm9tZSBBdXRvbWF0aW9uXG5cbioqU2l0ZWxpc3QqKlxuLSBTbmlwZXNcbi0gU29sZWJveFxuLSBaYWxhbmRvXG4tIEx1aXNhdmlhcm9tYVxuLSBTdXByZW1lXG4tIE5ldyBCYWxhbmNlXG5cbioqVG9vbHMgYW5kIGZlYXR1cmVzKipcbi0gQXV0byB1cGRhdGVzXG4tIERlc2t0b3AgYXBwXG4tIENocm9tZSBpbnN0YW5jZSBzcGF3bmVyXG4tIFByb2ZpbGVzIGFuZCB3ZWJob29rIHN5bmNocm9uaXplZCBpbiB0aGUgY2xvdWRcbi0gUmVsZWFzZSBndWlkZXNcblxuKipQcmljaW5nKipcbn5-4oKsMzksOTUgaW5pdGlhbCwgdGhlbiDigqwxOSw5NSAvbW9-flxuKioxNC1kYXkgZnJlZSB0cmlhbCwgdGhlbiDigqwxOSw5NSAvbW8qKiIsInVybCI6Imh0dHBzOi8vdHdpdHRlci5jb20vaHV0c2FpbyIsImNvbG9yIjo2NTE0NDE3LCJmb290ZXIiOnsidGV4dCI6Ikh1dHNBSU8iLCJpY29uX3VybCI6Imh0dHBzOi8vaS5pbWd1ci5jb20vY3pweTRCcS5wbmcifSwidGltZXN0YW1wIjoiMjAyMi0wOC0xMlQwNzo1MzowMC4wMDBaIiwiaW1hZ2UiOnsidXJsIjoiaHR0cHM6Ly9pLmltZ3VyLmNvbS9MREdobGdmLnBuZyJ9fV0sImF0dGFjaG1lbnRzIjpbXX19XX0');
        }
    }
}
