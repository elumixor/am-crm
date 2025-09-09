import { tokenRefreshThreshold } from "@am-crm/shared";
import { jwtDecode } from "jwt-decode";
import { client, validJson } from "../../services/http";

/** Encapsulates token management logic */
export class Token {
  private _token = "";
  private exp = 0;
  private _userId = "";

  constructor(token: string) {
    this._token = token;
    this.value = token; // trigger jwt decode
  }

  get value() {
    return this._token;
  }

  set value(token: string) {
    this._token = token;
    const { exp, sub } = jwtDecode(token);
    if (!sub) throw new Error("Token is missing subject (sub) claim");
    if (!exp) throw new Error("Token is missing expiration (exp) claim");
    this.exp = exp;
    this._userId = sub;
  }

  get userId() {
    return this._userId;
  }

  get isExpired() {
    const now = Math.floor(Date.now() / 1000);
    return this.exp < now;
  }

  get isCloseToExpiry() {
    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = this.exp - now;
    return timeUntilExpiry <= tokenRefreshThreshold;
  }

  /**
   * @returns New valid token. This will either throw, or always return a new valid token
   * @throws If refresh fails
   */
  async refresh() {
    const response = await client.auth.refresh.$post({ json: { token: this.value } });
    const { token: newToken } = await validJson(response);
    this.value = newToken;
  }

  /**
   * Validate and refresh token if necessary
   * @throws If token is expired or invalid
   */
  async validateAndRefresh() {
    if (this.isExpired) throw new Error("Token is expired");

    // If token is expired or close to expiration, refresh it
    if (this.isCloseToExpiry) {
      await this.refresh();
      return;
    }

    // Token is not expiring, validate with backend
    const response = await client.auth.validate.$post({ json: { token: this.value } });
    const { valid } = await response.json();

    if (!valid) throw new Error("Token is invalid");
  }
}
