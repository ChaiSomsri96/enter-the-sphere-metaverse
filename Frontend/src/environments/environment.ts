// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const browserWindow = window || {};
const browserWindowEnv = browserWindow['__env'] || {};

	
export const environment={
	apiUrl:  browserWindowEnv.apiUrl,
	enableDebug: browserWindowEnv.enableDebug,
	sentryTracesSampleRate: browserWindowEnv.sentryTracesSampleRate,
	sentryDsn: browserWindowEnv.sentryDsn,
	telegramBot: browserWindowEnv.telegramBot,
	NFTMarketplace: 'https://www.juungle.net/#/collection/500e1d23ffd8138e50750007f9c8aabb09feba6826773786e143ee1d97803b96',
	stripe: browserWindowEnv.stripePublic,
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
