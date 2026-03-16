import { Request, Response, NextFunction } from 'express';
import * as AuthService from './auth.service';

const isProduction = process.env.NODE_ENV === 'production';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }
    const { accessToken, refreshToken, user } = await AuthService.registerUser(email, password, name);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(201).json({ accessToken, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error: any) {
    if (error.message.includes('already registered')) {
      return res.status(409).json({ error: error.message });
    }
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { accessToken, refreshToken, user } = await AuthService.loginUser(email, password);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.json({ accessToken, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error: any) {
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ error: error.message });
    }
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({ error: 'No refresh token provided' });
    }

    const { accessToken, newRefreshToken } = await AuthService.refreshUserToken(refreshToken);

    // Provide token rotation
    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.json({ accessToken });
  } catch (error: any) {
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (refreshToken) {
      await AuthService.logoutUser(refreshToken);
    }
    res.clearCookie('refresh_token');
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
