"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
MongoServerError: E11000 duplicate key error collection: cs-university.users index: email_1 dup key: { email: "njohn@gmail.com" }
    at InsertOneOperation.execute (/home/johnpaul/Desktop/Projects/CS-University/node_modules/mongodb/lib/operations/insert.js:48:19)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async executeOperationAsync (/home/johnpaul/Desktop/Projects/CS-University/node_modules/mongodb/lib/operations/execute_operation.js:106:16) {
  index: 0,
  code: 11000,
  keyPattern: { email: 1 },
  keyValue: { email: 'njohn@gmail.com' },
  statusCode: 500,
  status: 'fail',
  [Symbol(errorLabels)]: Set(0) {}
} */
