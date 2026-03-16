import { supabase } from '../../config/supabase';
import { hashPassword, comparePassword } from '../../utils/hash';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt';

export const registerUser = async (email: string, password: string, name: string) => {
  // Check if user exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    throw new Error('User already registered');
  }

  const hashedPassword = await hashPassword(password);

  // Insert user
  const { data: user, error } = await supabase
    .from('users')
    .insert({ email, password_hash: hashedPassword, name })
    .select()
    .single();

  if (error) throw new Error(error.message);

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // Store refresh token (just store hash or literal in basic case, we'll store literal per spec)
  // Spec: token_hash (text, not null)
  const hashedRefreshToken = await hashPassword(refreshToken);
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

  await supabase.from('refresh_tokens').insert({
    user_id: user.id,
    token_hash: hashedRefreshToken,
    expires_at: expiresAt
  });

  return { accessToken, refreshToken, user };
};

export const loginUser = async (email: string, password: string) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  const hashedRefreshToken = await hashPassword(refreshToken);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await supabase.from('refresh_tokens').insert({
    user_id: user.id,
    token_hash: hashedRefreshToken,
    expires_at: expiresAt
  });

  return { accessToken, refreshToken, user };
};

export const refreshUserToken = async (oldRefreshToken: string) => {
  const decoded = verifyRefreshToken(oldRefreshToken);
  const userId = decoded.userId;

  // We should ideally search for the un-revoked token for this user
  // Since we hash them, we'd need to compare. A simpler approach if we store hashed tokens:
  // Fetch active tokens for user
  const { data: activeTokens, error } = await supabase
    .from('refresh_tokens')
    .select('*')
    .eq('user_id', userId)
    .is('revoked_at', null)
    .gt('expires_at', new Date().toISOString());

  if (error || !activeTokens || activeTokens.length === 0) {
    throw new Error('Invalid refresh token');
  }

  // Find matching token
  let tokenRecord = null;
  for (const record of activeTokens) {
    const isMatch = await comparePassword(oldRefreshToken, record.token_hash);
    if (isMatch) {
      tokenRecord = record;
      break;
    }
  }

  if (!tokenRecord) {
    throw new Error('Invalid refresh token');
  }

  // Revoke old token
  await supabase
    .from('refresh_tokens')
    .update({ revoked_at: new Date() })
    .eq('id', tokenRecord.id);

  // Generate new tokens
  const accessToken = generateAccessToken(userId);
  const newRefreshToken = generateRefreshToken(userId);

  const hashedRefreshToken = await hashPassword(newRefreshToken);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await supabase.from('refresh_tokens').insert({
    user_id: userId,
    token_hash: hashedRefreshToken,
    expires_at: expiresAt
  });

  return { accessToken, newRefreshToken };
};

export const logoutUser = async (refreshToken: string) => {
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const userId = decoded.userId;

    const { data: activeTokens } = await supabase
      .from('refresh_tokens')
      .select('*')
      .eq('user_id', userId)
      .is('revoked_at', null);

    if (activeTokens) {
      for (const record of activeTokens) {
        const isMatch = await comparePassword(refreshToken, record.token_hash);
        if (isMatch) {
          await supabase
            .from('refresh_tokens')
            .update({ revoked_at: new Date() })
            .eq('id', record.id);
          break;
        }
      }
    }
  } catch (e) {
    // Ignore invalid tokens on logout
  }
};
