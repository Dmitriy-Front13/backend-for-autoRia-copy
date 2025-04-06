import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo'
import { join } from 'path'

export function getGraphQLConfig(): ApolloDriverConfig {
	return {
		driver: ApolloDriver,
		playground: false,
		autoSchemaFile: join(process.cwd(), 'src/core/graphql/schema.gql'),
		sortSchema: true,
		context: ({ req, res }) => ({ req, res }),
		plugins: [ApolloServerPluginLandingPageLocalDefault()]
	}
}
