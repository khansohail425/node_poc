import { SessionTokenDBAccess } from '../app/Authorization/SessionTokenDBAccess';
import { SessionToken } from '../app/Models/ServerModels'
import * as Nedb from 'nedb'


describe('SessionTokenDB access suits', () => {

    let someToken: SessionToken;
    let sessionTokenDBAccess: SessionTokenDBAccess
    const randamString = Math.random().toString(36).substring(7);

    beforeAll(() => {
        sessionTokenDBAccess = new SessionTokenDBAccess();
        someToken = {
            accessRights: [1, 2, 3],
            expirationTime: new Date(),
            tokenId: 'someTokenId' + randamString,
            userName: 'someUser',
            valid: true
        }
    })

    it('store and retrive SessionToken', async () => {
        await sessionTokenDBAccess.storeSessionToken(someToken);
        const resultToken = await sessionTokenDBAccess.getToken(someToken.tokenId);
        expect(resultToken).toMatchObject(someToken);
    })

    it('delete SessionToken', async () => {
        await sessionTokenDBAccess.deleteToken(someToken.tokenId);
        const resultToken = await sessionTokenDBAccess.getToken(someToken.tokenId);
        expect(resultToken).toBeUndefined();
    })

    it('delete missing SessionToken throw error', async () => {
        try {
            await sessionTokenDBAccess.deleteToken(someToken.tokenId);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'SessionToken not deleted!')
        }
    })
})