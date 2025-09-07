import crypto from "node:crypto";
import util from "node:util";

export class PasswordService {
    public async scryptHash(pass: string, salt?: string): Promise<string> {
        const saltInUse = salt || crypto.randomBytes(16).toString("hex");
        const hashBuffer = (await util.promisify(crypto.scrypt)(pass, saltInUse, 32)) as Buffer;
        return `${hashBuffer.toString("hex")}:${saltInUse}`;
    }

    public async scryptVerify(unverifiedPassword: string, hashedPassword: string) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, salt] = hashedPassword.split(":");
        return (await this.scryptHash(unverifiedPassword, salt)) === hashedPassword;
    }
}
