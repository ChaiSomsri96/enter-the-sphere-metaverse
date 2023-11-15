
.PHONY: test

build:

test:
	NODE_ENV=test npm run db:reset
	NODE_ENV=test npm run db:migrate
	NODE_ENV=test npm run test:bitcoin
