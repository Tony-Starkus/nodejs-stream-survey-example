declare module 'stream-concat' {
  import { ReadStream } from 'fs';

  export default class StreamConcat {
    constructor(streams: ReadStream[]) {}
  }
}
