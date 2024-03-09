import { CallbackTypes } from "vue3-google-login";

export type CredentialCallback = CallbackTypes.CredentialCallback;
export type Credentials = Parameters<CallbackTypes.CodeResponseCallback>[0];
