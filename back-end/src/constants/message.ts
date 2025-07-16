export const USER_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_IS_INVALID: 'Email is invalid',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_STRING: 'Name must be a string',
  NAME_MUST_BE_BETWEEN_1_AND_20_CHARACTERS: 'Name must be between 1 and 20 characters',
  PASS_IS_REQUIRED: 'Password is required',
  PASS_MUST_BE_STRING: 'Password must be a string',
  PASS_MUST_BE_BETWEEN_6_AND_20_CHARACTERS: 'Password must be between 6 and 20 characters',
  PASS_MUST_BE_STRONG: 'Password must be strong',
  PASS_IS_INCORRECT: 'Password is incorrect',
  CONFIRM_PASS_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASS_MUST_BE_STRING: 'Confirm password must be a string',
  USER_NOT_FOUND: 'User not found',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_IN_VALID: 'Refresh in valid',
  REFRESH_TOKEN_NOT_FOUND: 'Refresh token not found',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  EMAIL_IS_VERIFY_BEFORE: 'Email is verify before',
  EMAIL_VERIFY_SUCCESS: 'Email verify success',
  RESEND_VERIFY_EMAIL_SUCCESS: 'Resend verify email success',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check email to reset password',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password is required',
  VERIFY_PASSWORD_SUCCESS: 'Verify password success',
  INVALID_FORGOT_PASSWORD: 'Invalid forgot password',
  FORGOT_PASSWORD_TOKEN_IS_VALID: 'Forgot password token is valid',
  RESET_PASSWORD_SUCCESS: 'Reset password success',
  USER_NOT_VERIFY: 'User not verify',
  BIO_MUST_BE_BETWEEN_1_AND_150_CHARACTERS: 'Bio must be between 1 and 150 characters',
  BIO_MUST_BE_STRING: 'Bio must be string',
  PROFILEPICTURE_MUST_BE_STRING: 'Profile picture must be string',
  GENDER_MUST_BE_STRING: 'Gender must be string',
  UPDATE_PROFILE_SUCCESS: 'Update profile success',
  FOLLOW_SUCCESS: 'Follow success',
  FOLLOWED: 'User has already been followed',
  INVALID_USER_ID: 'User id invalid',
  UNFOLLOW_SUCCESS: 'Unfollow success',
  UNFOLLOW_FAIL: 'Unfollow fail',
  CONFIRM_PASSWORD_MUST_BE_SAME_PASSWORD: 'Confirm password must be same password',
  OLD_PASSWORD_NOT_MATCH: 'Old password not match',
  CHANGE_PASSWORD_SUCCESS: 'Change password success',
  UPLOAD_AVATAR_SUCCESS: 'Upload image success',
  LOGIN_SUCCESS: 'Login successfully',
  LOGOUT_SUCCESS: 'Logout successfully',
  REGISTER_SUCCESS: 'Account create successfully'
} as const

export const POST_MESSAGES = {
  CAPTIONS_MUST_BE_STRING: 'Captions must be string',
  CAPTION_MUST_BE_BETWEEN_0_AND_2000_CHARACTERS: 'Password must be between 0 and 2000 characters',
  HASHTAGS_MUST_BE_STRING: 'Hashtag must be an array of user id',
  MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID: 'Mentions must be an array of user id',
  INVALID_POST_ID: 'Invalid post id',
  GET_POST_SUCCESS: 'Get post detail success',
  POST_SUCCESS: 'Post success'
} as const

export const BOOKMARK_MESSAGES = {
  BOOKMARK_SUCCESS: 'Bookmark success',
  UNBOOKMARK_SUCCESS: 'Unbookmark success'
} as const

export const LIKE_MESSAGES = {
  LIKE_SUCCESS: 'Like success',
  UNLIKE_SUCCESS: 'Unlike success'
} as const

export const MEDIA_MESSAGES = {
  UPLOAD_IMAGE_SUCCESS: 'Upload image success',
  UPLOAD_VIDEO_SUCCESS: 'Upload video success'
}
