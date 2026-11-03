"use strict";
importScripts("engine.js");

self.onmessage = function (event) {
  var id = event.data.id;
  try {
    var job = ArmaturEngine.validateJob(event.data.job);
    var result = ArmaturEngine.solve(job, {
      exactMaxPieces: 26, heuristicMaxPieces: 1800,
      nodeLimit: 250000, timeLimitMs: 1100
    });
    self.postMessage({ id: id, result: result });
  } catch (error) {
    self.postMessage({ id: id, error: error.message || String(error) });
  }
};
