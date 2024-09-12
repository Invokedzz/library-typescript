import { Request, Response, NextFunction } from "express";

import { z, ZodError } from "zod";

export const validatebody = (schema: z.ZodSchema <void>) => {

    return (req: Request, res: Response, next: NextFunction): any => {
    
        try {

            schema.parse(req.body);
            
            next();

        } catch (e) {

            if (e instanceof ZodError) return res.status(400).json({ errors: e.errors });

            next(e);

        };
    
    };

};