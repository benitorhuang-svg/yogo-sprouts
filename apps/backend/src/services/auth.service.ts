import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

/**
 * 📦 AuthService (勞動者)
 * 負責純粹的 LINE 認證邏輯
 */
export class AuthService {
  private static auth = admin.auth();

  static async verifyLineLogin(code: string, redirectUri: string) {
    const channelId = functions.config().line?.channel_id || process.env.LINE_CHANNEL_ID;
    const channelSecret =
      functions.config().line?.channel_secret || process.env.LINE_CHANNEL_SECRET;

    // 1. 交換 Token
    const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: channelId!,
        client_secret: channelSecret!,
      }),
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok)
      throw new Error(tokenData.error_description || 'LINE Token Exchange Failed');

    // 2. 獲取 Profile
    const profileResponse = await fetch('https://api.line.me/v2/profile', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileResponse.json();

    // 3. 同步 Firebase User
    const uid = `line:${profile.userId}`;
    try {
      await this.auth.updateUser(uid, {
        displayName: profile.displayName,
        photoURL: profile.pictureUrl,
      });
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        await this.auth.createUser({
          uid,
          displayName: profile.displayName,
          photoURL: profile.pictureUrl,
        });
      } else {
        throw error;
      }
    }

    // 4. 簽發 Custom Token
    const customToken = await this.auth.createCustomToken(uid);
    return { customToken, profile };
  }
}
