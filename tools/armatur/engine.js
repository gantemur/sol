/*
 * Armatur 1D cutting engine. No DOM or package dependencies.
 * Lengths are integer tenths of a millimetre throughout the solver.
 */
/* SPDX-FileCopyrightText: 2026 Tsogt Gantumur
 * SPDX-License-Identifier: MIT */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ArmaturEngine = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var TICKS_PER_MM = 10;
  var UNIT_FACTORS = { mm: 10, cm: 100, m: 10000 };

  function fail(message) { throw new Error(message); }

  function toTicks(value, unit, label, allowZero) {
    var factor = UNIT_FACTORS[unit];
    if (!factor) fail("Unknown length unit: " + unit);
    if (value === "" || value === null || value === undefined) {
      fail(label + ": enter a length.");
    }
    var number = Number(value);
    if (!Number.isFinite(number) || (allowZero ? number < 0 : number <= 0)) {
      fail(label + ": enter a finite " + (allowZero ? "nonnegative" : "positive") + " length.");
    }
    var scaled = number * factor;
    var ticks = Math.round(scaled);
    if (!Number.isSafeInteger(ticks) || (!allowZero && ticks === 0) ||
        (ticks === 0 && number > 0) || Math.abs(scaled - ticks) > 0.0000001) {
      fail(label + ": precision is limited to 0.1 mm.");
    }
    return ticks;
  }

  function validateJob(raw) {
    if (!raw || typeof raw !== "object") fail("Missing cutting order.");
    var unit = raw.unit || "mm";
    var stockLength = toTicks(raw.stockLength, unit, "Stock length", false);
    if (stockLength > 1000000000) fail("Stock length is too large.");
    var kerf = toTicks(raw.kerf === undefined ? 0 : raw.kerf, "mm", "Kerf", true);
    var diameter = Number(raw.diameter);
    if (raw.diameter === "" || !Number.isFinite(diameter) || diameter <= 0 || diameter > 1000) {
      fail("Diameter must be a positive number in millimetres.");
    }
    if (!Array.isArray(raw.items) || raw.items.length === 0 || raw.items.length > 60) {
      fail("Enter between 1 and 60 requested lengths.");
    }
    var byLength = new Map();
    var totalCount = 0;
    for (var i = 0; i < raw.items.length; i++) {
      var input = raw.items[i];
      var length = toTicks(input.length, unit, "Length in row " + (i + 1), false);
      var quantity = Number(input.quantity);
      if (input.quantity === "" || !Number.isSafeInteger(quantity) || quantity <= 0 || quantity > 1000000) {
        fail("Quantity in row " + (i + 1) + " must be a positive whole number (at most 1,000,000).");
      }
      if (length > stockLength) {
        fail("Length in row " + (i + 1) + " exceeds the stock length.");
      }
      // A single shorter piece needs one cut, hence room for the blade.
      if (length < stockLength && length + kerf > stockLength) {
        fail("Length in row " + (i + 1) + " leaves insufficient room for the cut width.");
      }
      byLength.set(length, (byLength.get(length) || 0) + quantity);
      totalCount += quantity;
      if (!Number.isSafeInteger(totalCount) || totalCount > 1000000) {
        fail("The order is limited to 1,000,000 pieces.");
      }
    }
    var items = Array.from(byLength, function (entry) {
      return { length: entry[0], quantity: entry[1] };
    }).sort(function (a, b) { return b.length - a.length; });
    var totalLength = items.reduce(function (sum, item) {
      return sum + item.length * item.quantity;
    }, 0);
    if (!Number.isSafeInteger(totalLength)) fail("Total length exceeds safe integer precision.");
    return {
      stockLength: stockLength, kerf: kerf, diameter: diameter,
      unit: unit, items: items, totalCount: totalCount, totalLength: totalLength
    };
  }

  function fits(sum, count, stockLength, kerf) {
    if (count === 0) return true;
    // With an offcut: one sawcut per product. If stock is used exactly,
    // the final piece is the uncut end, saving the last sawcut.
    return sum + count * kerf <= stockLength ||
      sum + (count - 1) * kerf === stockLength;
  }

  function describeCounts(job, counts) {
    var sum = 0, count = 0;
    for (var i = 0; i < counts.length; i++) {
      sum += counts[i] * job.items[i].length;
      count += counts[i];
    }
    if (count <= 0 || !fits(sum, count, job.stockLength, job.kerf)) {
      fail("Internal error: an invalid cutting pattern was generated.");
    }
    var exactEnd = sum + (count - 1) * job.kerf === job.stockLength;
    var cuts = exactEnd ? count - 1 : count;
    var offcut = job.stockLength - sum - cuts * job.kerf;
    if (offcut < 0) fail("Internal error: negative offcut.");
    return { counts: counts.slice(), pieceLength: sum, pieceCount: count,
      cuts: cuts, offcut: offcut, kerfLoss: cuts * job.kerf };
  }

  function makePlan(job, patterns, algorithm) {
    var bars = 0, offcutTotal = 0, kerfTotal = 0, cutsTotal = 0;
    var patternList = patterns.map(function (pattern) {
      var details = describeCounts(job, pattern.counts);
      var repeats = pattern.repeats || 1;
      bars += repeats;
      offcutTotal += repeats * details.offcut;
      kerfTotal += repeats * details.kerfLoss;
      cutsTotal += repeats * details.cuts;
      details.repeats = repeats;
      return details;
    });
    var waste = bars * job.stockLength - job.totalLength;
    if (offcutTotal + kerfTotal !== waste) {
      fail("Internal error: length conservation failed.");
    }
    return {
      algorithm: algorithm, patterns: patternList, stockCount: bars,
      pieceCount: job.totalCount, requestedLength: job.totalLength,
      offcutTotal: offcutTotal, kerfTotal: kerfTotal, cutsTotal: cutsTotal,
      waste: waste, wastePercent: 100 * waste / (bars * job.stockLength),
      massKg: 0.888 * Math.pow(job.diameter / 12, 2) *
        (bars * job.stockLength / TICKS_PER_MM / 1000)
    };
  }

  function maxFittingCount(job, sum, count, length, available) {
    var lo = 0, hi = Math.min(available, Math.floor(job.stockLength / length));
    while (lo < hi) {
      var middle = Math.ceil((lo + hi) / 2);
      if (fits(sum + middle * length, count + middle, job.stockLength, job.kerf)) lo = middle;
      else hi = middle - 1;
    }
    return lo;
  }

  function greedyPlan(job) {
    var remaining = job.items.map(function (item) { return item.quantity; });
    var patterns = [], left = job.totalCount;
    while (left > 0) {
      var sum = 0, count = 0, counts = new Array(job.items.length).fill(0);
      for (var i = 0; i < job.items.length; i++) {
        var number = maxFittingCount(job, sum, count, job.items[i].length, remaining[i]);
        counts[i] = number;
        sum += number * job.items[i].length;
        count += number;
      }
      if (count === 0) fail("Internal error: greedy calculation made no progress.");
      var repeats = Infinity;
      for (var j = 0; j < counts.length; j++) {
        if (counts[j] > 0) repeats = Math.min(repeats, Math.floor(remaining[j] / counts[j]));
      }
      if (!Number.isSafeInteger(repeats) || repeats <= 0) {
        fail("Internal error: invalid repeated cutting pattern.");
      }
      for (var k = 0; k < counts.length; k++) remaining[k] -= repeats * counts[k];
      left -= repeats * count;
      patterns.push({ counts: counts, repeats: repeats });
    }
    return makePlan(job, patterns, "greedy");
  }

  function groupBins(job, bins, algorithm) {
    var groups = new Map();
    bins.forEach(function (bin) {
      var key = bin.counts.join(",");
      if (groups.has(key)) groups.get(key).repeats++;
      else groups.set(key, { counts: bin.counts.slice(), repeats: 1 });
    });
    return makePlan(job, Array.from(groups.values()), algorithm);
  }

  function fitHeuristic(job, method, ascending) {
    var pieces = [];
    job.items.forEach(function (item, type) {
      for (var k = 0; k < item.quantity; k++) pieces.push(type);
    });
    if (ascending) pieces.reverse();
    var bins = [];
    for (var i = 0; i < pieces.length; i++) {
      var type = pieces[i], length = job.items[type].length;
      var chosen = -1, score = Infinity;
      for (var j = 0; j < bins.length; j++) {
        var bin = bins[j];
        if (!fits(bin.sum + length, bin.count + 1, job.stockLength, job.kerf)) continue;
        if (method === "first") { chosen = j; break; }
        var newSum = bin.sum + length, newCount = bin.count + 1;
        var exactEnd = newSum + (newCount - 1) * job.kerf === job.stockLength;
        var leftover = exactEnd ? 0 : job.stockLength - newSum - newCount * job.kerf;
        if (leftover < score) { score = leftover; chosen = j; }
      }
      if (chosen < 0) {
        var counts = new Array(job.items.length).fill(0);
        counts[type] = 1;
        bins.push({ counts: counts, sum: length, count: 1 });
      } else {
        bins[chosen].counts[type]++;
        bins[chosen].sum += length;
        bins[chosen].count++;
      }
    }
    return groupBins(job, bins, method + (ascending ? "-ascending" : "-descending"));
  }

  function exactImprove(job, incumbent, lowerBound, options) {
    var pieces = [];
    job.items.forEach(function (item, type) {
      for (var i = 0; i < item.quantity; i++) pieces.push(type);
    });
    var bins = [], best = incumbent, bestCount = incumbent.stockCount;
    var limit = options.nodeLimit || 200000;
    var deadline = Date.now() + (options.timeLimitMs || 900);
    var nodes = 0, exhausted = false, reachedBound = false;

    function dfs(position) {
      nodes++;
      if (nodes > limit || (nodes % 128 === 0 && Date.now() > deadline)) {
        exhausted = true;
        return;
      }
      if (bestCount === lowerBound) { reachedBound = true; return; }
      if (position === pieces.length) {
        if (bins.length < bestCount) {
          best = groupBins(job, bins, "exact-search");
          bestCount = best.stockCount;
        }
        return;
      }
      if (bins.length >= bestCount) return;
      var type = pieces[position], length = job.items[type].length;
      var seen = new Set(), candidates = [];
      for (var i = 0; i < bins.length; i++) {
        var bin = bins[i], signature = bin.sum + ":" + bin.count;
        if (seen.has(signature)) continue;
        seen.add(signature);
        if (fits(bin.sum + length, bin.count + 1, job.stockLength, job.kerf)) {
          candidates.push(i);
        }
      }
      candidates.sort(function (a, b) { return bins[b].sum - bins[a].sum; });
      for (var j = 0; j < candidates.length; j++) {
        var index = candidates[j], target = bins[index];
        target.counts[type]++; target.sum += length; target.count++;
        dfs(position + 1);
        target.count--; target.sum -= length; target.counts[type]--;
        if (exhausted || reachedBound) return;
      }
      if (bins.length + 1 < bestCount) {
        var counts = new Array(job.items.length).fill(0);
        counts[type] = 1;
        bins.push({ counts: counts, sum: length, count: 1 });
        dfs(position + 1);
        bins.pop();
      }
    }
    dfs(0);
    return { plan: best, completed: !exhausted || reachedBound, nodes: nodes };
  }

  function solve(job, options) {
    options = options || {};
    var greedy = greedyPlan(job);
    var best = greedy;
    var lowerBound = Math.ceil(job.totalLength / job.stockLength);
    if (job.totalCount <= (options.heuristicMaxPieces || 1800)) {
      ["first", "best"].forEach(function (method) {
        [false, true].forEach(function (ascending) {
          var candidate = fitHeuristic(job, method, ascending);
          if (candidate.stockCount < best.stockCount) best = candidate;
        });
      });
    }
    var searched = false, completed = false, nodes = 0;
    if (best.stockCount === lowerBound) completed = true;
    else if (job.totalCount <= (options.exactMaxPieces || 26)) {
      searched = true;
      var result = exactImprove(job, best, lowerBound, options);
      best = result.plan;
      completed = result.completed;
      nodes = result.nodes;
    }
    return {
      greedy: greedy, best: best, lowerBound: lowerBound,
      optimal: completed, searched: searched, nodes: nodes
    };
  }

  return {
    TICKS_PER_MM: TICKS_PER_MM, UNIT_FACTORS: UNIT_FACTORS, toTicks: toTicks,
    validateJob: validateJob, fits: fits, greedyPlan: greedyPlan,
    makePlan: makePlan, solve: solve
  };
});
