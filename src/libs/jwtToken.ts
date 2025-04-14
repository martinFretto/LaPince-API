import jwt from 'jsonwebtoken';
import { TokenPayloadType } from "../types/TokenPayloadType";

export function generateToken(tokenPayload: TokenPayloadType): string {

	const token = jwt.sign(
		{
			user: {
				email: tokenPayload.email,
				id: tokenPayload.id,
			},
		},
		process.env.JWT_SECRET!,
		{
			expiresIn: "20m",
		},
	);
	return token as string;
}