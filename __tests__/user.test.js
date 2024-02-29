const {
  signUp,
  login,
  getLoginUser,
} = require("../controllers/userController");
const { middleware } = require("../middlewares/userMiddleware");
const userModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotEnv = require("dotenv");
dotEnv.config();
let SECRET_KEY = process.env.SECRET_KEY;

describe("User Controller", () => {
  const mockRequest = () => {
    return {
      body: {
        name: "gopi",
        email: "gopi@gmail.com",
        password: "hashedPassword",
        number: "999999",
      },
    };
  };

  const mockResponse = () => {
    let responseData = {};
    return {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockImplementation((data) => {
        responseData = { body: data };
      }),
      getResponseData: () => responseData,
    };
  };

  const mockUser = {
    _id: "65dec8aa38da965e883f3990",
    name: "gopi",
    email: "gopi@gmail.com",
    password: "hashedPassword",
    number: "999999",
  };

  const mockTokenRequest = (token) => {
    return {
      headers: {
        authorization: token ? `Bearer ${token}` : undefined,
      },
    };
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("Create user", () => {
    it("signUp/Post", async () => {
      jest.spyOn(bcrypt, "hash").mockResolvedValueOnce("hashedPassword");
      jest.spyOn(userModel, "findOne").mockResolvedValueOnce(undefined);
      jest.spyOn(userModel, "create").mockResolvedValueOnce(mockUser);

      const mockReq = mockRequest();
      const mockRes = mockResponse();
      await signUp(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.getResponseData()).toEqual({
        body: { message: "User Created Successfully" },
      });
    });

    it("signUp Existing User", async () => {
      jest.spyOn(userModel, "findOne").mockResolvedValueOnce(mockUser);
      const mockReq = mockRequest();
      const mockRes = mockResponse();
      await signUp(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.getResponseData()).toEqual({
        body: { error: "User Exists Already" },
      });
    });
  });

  describe("Login user", () => {
    it("should return 404 for non-existing user", async () => {
      jest.spyOn(userModel, "findOne").mockResolvedValueOnce(undefined);
      const mockReq = mockRequest();
      const mockRes = mockResponse();

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.getResponseData()).toEqual({
        body: { error: "User not found" },
      });
    });

    it("should return 400 for incorrect password", async () => {
      jest.spyOn(userModel, "findOne").mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(false);
      const mockReq = mockRequest();
      const mockRes = mockResponse();

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.getResponseData()).toEqual({
        body: { error: "Incorrect Password" },
      });
    });

    it("should return JWT token for successful login", async () => {
      jest.spyOn(userModel, "findOne").mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(true);
      jest.spyOn(jwt, "sign").mockReturnValueOnce("mockedJWTToken");
      const mockReq = mockRequest();
      const mockRes = mockResponse();

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.getResponseData()).toEqual({
        body: { jwtToken: "mockedJWTToken" },
      });
    });

    it("should handle internal server error", async () => {
      jest
        .spyOn(userModel, "findOne")
        .mockRejectedValueOnce(new Error("Mocked internal server error"));
      const mockReq = mockRequest();
      const mockRes = mockResponse();

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.getResponseData()).toEqual({
        body: { error: "Internal Server Error" },
      });
    });
  });
});
