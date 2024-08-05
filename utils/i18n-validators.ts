import * as validators from "@vuelidate/validators";

const { createI18nMessage, helpers } = validators;

export const required = validators.required;

export const email = validators.email;

// validate phone number of vietnam
export const phone = validators.helpers.regex(
  /((84|0[2|3|5|6|7|8|9])+([0-9]{8})\b)|(84|0[2])+([0-9]{9})\b/
);

export const maxLength = validators.maxLength;

export const ipAddress = validators.ipAddress;

export const url = validators.url;
