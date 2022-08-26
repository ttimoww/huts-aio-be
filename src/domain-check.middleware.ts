import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DomainCheckMiddleware implements NestMiddleware {
    private logger = new Logger(DomainCheckMiddleware.name);
    private domains = ['groupbuy.hutsaio.com', 'groupbuy.stage.hutsaio.com'];

    use(req: Request, res: Response, next: NextFunction) {
        if (this.domains.includes(req.hostname)){
            this.logger.verbose('Redirected groupbuy request to Discohook');
            res.redirect('https://discohook.org/?data=eyJtZXNzYWdlcyI6W3siZGF0YSI6eyJjb250ZW50IjpudWxsLCJlbWJlZHMiOlt7InRpdGxlIjoiSHV0c0FJTyAyLjAgSW50ZXJlc3QgQ2hlY2siLCJkZXNjcmlwdGlvbiI6IlRoZSBtb3N0IGFkdmFuY2VkIENocm9tZSBBdXRvbWF0aW9uXG5cbioqU2l0ZWxpc3QqKlxuLSBTbmlwZXNcbi0gU29sZWJveFxuLSBaYWxhbmRvXG4tIEx1aXNhdmlhcm9tYVxuLSBTdXByZW1lXG4tIE5ldyBCYWxhbmNlXG5cbioqVG9vbHMgYW5kIGZlYXR1cmVzKipcbi0gQXV0byB1cGRhdGVzXG4tIERlc2t0b3AgYXBwXG4tIENocm9tZSBpbnN0YW5jZSBzcGF3bmVyXG4tIFByb2ZpbGVzIGFuZCB3ZWJob29rIHN5bmNocm9uaXplZCBpbiB0aGUgY2xvdWRcbi0gUmVsZWFzZSBndWlkZXNcblxuKipQcmljaW5nKipcbn5-4oKsMTksOTUgL21vbnRoLCDigqwzOSw5NSBpbml0aWFsIGZlZX5-XG4qKuKCrDE5LDk1IC9tb250aCwgIG5vIGluaXRpYWwgZmVlKioiLCJ1cmwiOiJodHRwczovL3R3aXR0ZXIuY29tL2h1dHNhaW8iLCJjb2xvciI6NjUxNDQxNywiZm9vdGVyIjp7InRleHQiOiJIdXRzQUlPIiwiaWNvbl91cmwiOiJodHRwczovL2kuaW1ndXIuY29tL2N6cHk0QnEucG5nIn0sInRpbWVzdGFtcCI6IjIwMjItMDgtMTJUMDc6NTM6MDAuMDAwWiIsImltYWdlIjp7InVybCI6Imh0dHBzOi8vaS5pbWd1ci5jb20vTERHaGxnZi5wbmcifX1dLCJhdHRhY2htZW50cyI6W119fV19');
        }else{
            next();
        }
    }
}