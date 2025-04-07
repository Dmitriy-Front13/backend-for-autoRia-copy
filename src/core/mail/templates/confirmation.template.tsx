import { Body, Container, Hr, Img, Section, Tailwind, Text } from "@react-email/components"
import { Html } from "@react-email/html"
import * as React from 'react'

interface ConfirmationTemplateProps {
	token: string,
  
}

export function ConfirmationTemplate({
	token
}: ConfirmationTemplateProps) {
	return (
		<Tailwind>
			<Html>
			<Body className="bg-gray-100 font-sans">
        <Container className="bg-white p-5 rounded-md max-w-xl mx-auto">
          <Img
            src="https://i.imgur.com/B9EcmlU.png"
            width="80"
            alt="RIA.com"
            className="mb-4"
          />

          <Text className="text-lg font-bold text-gray-700 mb-2">
            Код реєстрації на RIA.com.
          </Text>

          <Text className="text-base text-gray-700">Доброго дня</Text>

          <Text className="text-sm text-gray-700 leading-relaxed">
            Ви отримали цей лист, тому що реєструєтесь на сайтах <a href="https://auto.ria.com">AUTO.ria.com</a>,{' '}
            <a href="https://dim.ria.com">DIM.ria.com</a>.
          </Text>

          <Text className="text-base font-bold mt-5 text-gray-900">
            Код реєстрації:
          </Text>

          <Text className="text-2xl font-bold text-black mb-4">{token}</Text>

          <Text className="text-sm text-gray-700">
            Для підтвердження коду введіть його у полі "Введіть код із листа:" на формі реєстрації.
          </Text>

          <Section className="mt-8 p-4 bg-yellow-100 rounded-md">
            <Text className="font-bold text-yellow-600 text-sm mb-1">
              ⚠️ Важливо!
            </Text>
            <Text className="text-sm text-yellow-900">
              Не передавайте код нікому для безпеки вашого облікового запису. Ви в будь-який момент можете змінити пароль у "Моє меню".
            </Text>
          </Section>

          <Hr className="my-8" />
        </Container>
      </Body>
			</Html>
		</Tailwind>
	)
}
