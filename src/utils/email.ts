import { Resend } from 'resend'
import { RESEND_API_KEY } from '~/config/index.js'

const resend = new Resend(RESEND_API_KEY)

export const sendEmail = async ({ to, subject, html }) => {
  await resend.emails.send({
    from: 'verify@myapp12345.tk', // domain verified
    to,
    subject,
    html
  })
}
