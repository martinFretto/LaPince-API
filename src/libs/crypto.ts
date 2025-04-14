import argon2 from 'argon2';


export async function hash(password: string): Promise<string> {
    try {
        const hash = await argon2.hash(password);
        console.log("hash")
        return hash;
    } catch (err) {
        return "error";
    }
}