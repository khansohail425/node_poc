import * as axios from 'axios'
import { UserCredentialsDbAccess } from '../app/Authorization/UserCredentialsDbAccess';
import { HTTP_CODES, SessionToken, UserCredentials } from '../app/Models/ServerModels';


axios.default.defaults.validateStatus = () => {
    return true;
}
const serverUrl = 'http://localhost:8080';

const itestUserCredentials: UserCredentials = {
    accessRights: [1, 2, 3],
    password: 'iTestPassword',
    username: 'iTestUser'
}

let sessionToken: SessionToken;

let userCredentialsDbAccess: UserCredentialsDbAccess;

beforeAll(() => {
    userCredentialsDbAccess = new UserCredentialsDbAccess();
})

async function serverReachable(): Promise<boolean> {
    try {
        await axios.default.get(serverUrl)
    } catch (error) {
        console.log('Server not reachable');
        return false;
    }

    console.log('Server rechable');
    return true;
}


describe('Server Intregation test', () => {

    test('server reachable', async () => {
        const response =
            expect(axios.default.get(serverUrl).then(response => expect(response.status).toBe(HTTP_CODES.OK)));
    }
    )


    test('put credentials inside databases', async () => {
        await userCredentialsDbAccess.putUserCredential(itestUserCredentials);
    }
    )


    test('reject invalid user credentials', async () => {
        const response = await axios.default.post(`${serverUrl}/login`, {
            "username": "someWrongCred",
            "password": "someWorngCred"
        })

        await expect(response.status).toBe(HTTP_CODES.NOT_fOUND);
    }
    )

    test('login successfully with valid user credentials ', async () => {
        const response = await axios.default.post(`${serverUrl}/login`, {
            "username": itestUserCredentials.username,
            "password": itestUserCredentials.password
        })

        expect(response.status).toBe(HTTP_CODES.CREATED);
        sessionToken = await response.data;
    }
    )


    test('query data with invalid token', async () => {
        const response = await axios.default.get(`${serverUrl}/users?name=some`, {
            headers: {
                Authorization: sessionToken.tokenId
            }
        })

       await expect(response.status).toBe(HTTP_CODES.OK);
    }
    )

    test('query data with invalid token', async () => {
        const response = await axios.default.get(`${serverUrl}/users?name=some`, {
            headers: {
                Authorization: sessionToken.tokenId+'someWorngString'
            }
        })

       await expect(response.status).toBe(HTTP_CODES.UNAUTHORIZED);
    }
    )
})

