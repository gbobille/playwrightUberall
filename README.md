# Basic Framework using Playwright wish TS
Running basic tests on our storelocators which includes
- Visual tests
- Accessibility tests


## Setup
Install [Node](https://nodejs.org/) project dependencies:

```sh
npm install
npx playwright install
```


## Run tests
- To run single file
`npx playwright test ${filename}`
- To run visual tests
`npx playwright test --grep "@visualtests"`
`npx playwright test --workers=$PLAYWRIGHT_WORKERS --project="$PROJECT" --grep "$TEST_FILTER"`
- To open HTML report
`npx playwright show-report`

## Extract steps for documentation
- to extract the steps of your tests you can run the below command with the folder in which you would like to document
`ts-node utils/generateDoc.ts ./tests/websites/locatorBuilder`
