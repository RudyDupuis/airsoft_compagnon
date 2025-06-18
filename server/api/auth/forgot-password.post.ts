import { TypeORM } from '~/server/db/config'
import { User } from '~/server/db/entities/User'
import { isNotBlankString, isNotNull, isNullOrUndefined } from '~/utils/types/typeGuards'
import { emailRegex } from '~/utils/validations/regex'

function generateRandomPassword() {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*?&'
  const length = 20
  let password = ''

  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }

  return password
}

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event)

  if (isNullOrUndefined(email)) {
    throw createError({
      statusCode: 400,
      data: {
        errorKey: 'common.form.errors.all-fields-required'
      }
    })
  }

  if (isNotBlankString(email) && !emailRegex.test(email)) {
    throw createError({
      statusCode: 400,
      data: {
        errorKey: 'common.form.errors.rules-not-respected'
      }
    })
  }

  const userRepository = TypeORM.getRepository(User)
  const user = await userRepository.findOne({ where: { email } })

  if (isNotNull(user)) {
    // IMPROVE : use a link to reset password instead of generating a new one
    const newPasswordGenerated = generateRandomPassword()

    user.passwordHash = await hashPassword(newPasswordGenerated)
    await userRepository.save(user)

    // TODO : send email with the new password
    // Warning: Tell to change password at next login and watch out for form spam
    // Remove that
    console.log(`New password for ${email}: ${newPasswordGenerated}`)
  }

  return {
    status: 'ok'
  }
})
