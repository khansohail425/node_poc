import { IncomingMessage } from 'node:http';
import { Utils } from '../../app/Utils/Utils'


describe('Utils test suits', () => {

    test('url test with throw error using arrov function', () => {
        expect(() => {
            Utils.parseUrl('');
        }).toThrow('Empty url');
    })

    test('getBasePath valid request', () => {

        const request = {
            url: 'http://localhost:8080/login'
        } as IncomingMessage;

        const resultPath = Utils.getRequestBasePath(request);

        expect(resultPath).toBe('login')

    })

    test('getBasePath valid request with no path name', () => {

        const request = {
            url: ''
        } as IncomingMessage;



        const resultPath = Utils.getRequestBasePath(request);

        expect(resultPath).toBeFalsy()

    })

    test('getBasePath valid request with no path', () => {

        const request = {
            url: 'http://localhost:8080'
        } as IncomingMessage;

        const resultPath = Utils.getRequestBasePath(request);

        expect(resultPath).toBeFalsy();

    })
})