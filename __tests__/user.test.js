const { signUp, login } = require('../controllers/userController');
const userModel = require('../models/User');
const bcrypt = require('bcrypt');

describe('User Controller', () => {
    const mockRequest = () => {
        return {
            body: {
                name: 'gopi',
                email: 'gopi@gmail.com',
                password: 'hashedPassword',
                number: '999999',
            },
        };
    };
    const mockResponse = () => {
        return {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        };
    };

    const mockUser = {
        _id: '65dec8aa38da965e883f3990',
        name: 'gopi',
        email: 'gopi@gmail.com',
        password: 'hashedPassword',
        number: '999999',
    };

    describe('Create user', () => {
        it('signUp/Post', async () => {
            jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedPassword');
            jest.spyOn(userModel,'findOne').mockResolvedValueOnce(undefined)
            jest.spyOn(userModel, 'create').mockResolvedValueOnce(mockUser);

            const mockReq = mockRequest();
            const mockRes = mockResponse();
            await signUp(mockReq, mockRes);
            
            expect(mockRes.status).toHaveBeenCalledWith(201);
            // expect(mockRes.body).toEqual({message:"User Created Successfully"})
        });
    });
    describe('login User',()=>{
        it('Not Registered User',async()=>{
            jest.spyOn(userModel,'findOne').mockResolvedValueOnce(undefined)
            // jest.spyOn(bcrypt,'compare').mockResolvedValueOnce('hashedPassword')
            const mockReq=mockRequest()
            const mockRes=mockResponse()

            await login(mockReq,mockRes)
            expect(mockRes.status).toHaveBeenCalledWith(404)
            
        })
        
    })
});
