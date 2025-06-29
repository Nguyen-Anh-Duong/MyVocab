import { Resend } from 'resend'
import { RESEND_API_KEY } from '~/config/index.js'

const resend = new Resend(RESEND_API_KEY)

export const sendEmail = async ({ to, subject, html }) => {
  const { data, error } = await resend.emails.send({
    from: 'Duong <myvocab@duongdev.dpdns.org>', // domain verified
    to,
    subject,
    html
  })
  // console.log('Email sent:', data)
  if (error) {
    throw new Error(`Failed to send email: ${error.message}`)
  }
}
