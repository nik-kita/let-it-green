const example = {
  "payload": {
    "iss": "https://accounts.google.com",
    "azp":
      "456894138702-b1hkcu9caadps4nv7bih3sr4v2c3tmtg.apps.googleusercontent.com",
    "aud":
      "456894138702-b1hkcu9caadps4nv7bih3sr4v2c3tmtg.apps.googleusercontent.com",
    "sub": "105490088593563678762",
    "email": "nik.moiseienko@gmail.com",
    "email_verified": true,
    "nbf": 1710382848,
    "name": "Nikita Moiseienko",
    "picture":
      "https://lh3.googleusercontent.com/a/ACg8ocKu6WegsrRAV2SohV94mhjCaARIwstMJbK5lnRGz1J3VA=s96-c",
    "given_name": "Nikita",
    "family_name": "Moiseienko",
    "locale": "en",
    "iat": 1710383148,
    "exp": 1710386748,
    "jti": "df5f6ea6210ddcad812d05bce4f8b782258b375e",
  },
  "protectedHeader": {
    "alg": "RS256",
    "kid": "09bcf8028e06537d4d3ae4d84f5c5babcf2c0f0a",
    "typ": "JWT",
  },
  "key": {},
};

export type SuccessGoogleVerifyRes = typeof example;
