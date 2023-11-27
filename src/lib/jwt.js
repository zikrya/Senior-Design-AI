import { headers } from "next/headers";
import * as jwt from "jsonwebtoken";

/**
 *
 * @returns {Promise<{userId: string}>}
 */
export const authenticate = () => {
    const authHeader = headers().get("authorization");

    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return null;

    return new Promise((resolve) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) resolve(null);
            else resolve(user);
        });
    });
};
