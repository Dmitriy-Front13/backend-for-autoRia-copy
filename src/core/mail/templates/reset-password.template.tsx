import { Body, Button, Container, Head, Preview, Section, Text, Link } from "@react-email/components"
import { Html } from "@react-email/html"
import { Tailwind } from "@react-email/tailwind"
import * as React from 'react'

interface PasswordResetEmailProps {
  domain: string,
  token: string
}

export function ResetPasswordTemplate({
  domain, token}: PasswordResetEmailProps){
    const resetUrl = `${domain}/reset-password?token=${token}`
  return (
    <Html>
      <Head />
      <Preview>Запит на відновлення пароля</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="bg-white mx-auto p-6 max-w-xl">
            <Section>
              <Text className="text-2xl font-bold mt-8 mb-4 text-gray-800">Вітаємо!</Text>

              <div className="flex mb-6">
                <div className="w-12 h-12 flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z"
                      stroke="#CCCCCC"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 11V7C7 5.93913 7.42143 4.92172 8.17157 4.17157C8.92172 3.42143 9.93913 3 11 3H13C14.0609 3 15.0783 3.42143 15.8284 4.17157C16.5786 4.92172 17 5.93913 17 7V11"
                      stroke="#CCCCCC"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <Text className="text-base leading-6 text-gray-800 mb-4">
                Ви отримали цей лист, тому що запросили відновлення пароля на сайті RIA.com.
              </Text>

              <Text className="text-base leading-6 text-gray-800 mb-4">
                Натисніть на кнопку нижче, і ви потрапите на сторінку відновлення пароля.
              </Text>

              <Button
                className="bg-green-500 rounded px-5 py-3 text-white font-bold text-center block w-full mb-6"
                href={resetUrl}
              >
                Відновити пароль
              </Button>

              <Text className="text-base leading-6 text-gray-800 mb-4">
                Якщо при натисканні на кнопку не відбувся перехід, скористайтеся цим посиланням:
              </Text>

              <Link href={resetUrl} className="text-blue-600 no-underline text-sm break-all">
                {resetUrl}
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}


