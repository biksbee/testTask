import {Injectable, NestMiddleware} from '@nestjs/common'
import {NextFunction, Request, Response} from 'express'
import * as fingerprint from 'express-fingerprint'

@Injectable()
export class FingerprintMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    fingerprint({
      parameters: [
        // Defaults
        // @ts-ignore
        fingerprint.useragent,
        // @ts-ignore
        fingerprint.acceptHeaders,
        // @ts-ignore
        fingerprint.geoip,
      ],
      // @ts-ignore
    })(req, res, next)
  }
}
