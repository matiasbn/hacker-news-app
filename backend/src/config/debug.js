import debug from 'debug'

// Set debug namespace for our app
// https://github.com/visionmedia/debug/issues/117
const debugControllers = debug('Hackernews::controllers')
const debugExpress = debug('Hackernews::express')
const debugMongo = debug('Hackernews::mongo')
const debugStart = debug('Hackernews::start')
const debugTest = debug('HackernewsTest::test')

export {
  debugControllers,
  debugMongo,
  debugExpress,
  debugStart,
  debugTest,
}
