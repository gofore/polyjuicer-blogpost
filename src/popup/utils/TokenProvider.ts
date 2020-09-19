import { IUser } from '../models/User';
import { JWT_AUTH_SERVICE } from '../../environment';

export interface AuthServiceResponse {
    token: string;
}

export class TokenProvier {

    public static getToken(user: IUser): Promise<AuthServiceResponse> {
        console.log('getting Token', user);
        return new Promise((resolve: any, reject: any) => {

            $.ajax({
                url: JWT_AUTH_SERVICE,
                type: 'POST',
                data: JSON.stringify(user),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            }).then((result: any) => {
                console.log(result);
                resolve(result as AuthServiceResponse);
            })
                .catch((error: any) => {
                    console.log(`errors: ${error.statusCode()} and ${error.state()}`);
                    console.log(error);
                    reject(error);
                });
        });
    }
}