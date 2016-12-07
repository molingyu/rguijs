BABEL := node_modules/.bin/babel
TESTPATH := test/runner.js

npm_install: node_modules
	npm install

lib: npm_install
	npm run build

start_test: lib
	@echo -e '\e[36m==========================Test Start============================\e[0m'
	node $(TESTPATH)

end_test:
	@echo -e '\e[36m===========================Test End=============================\e[0m'

test: start_test end_test

	
