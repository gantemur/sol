/*
 * Corrected legacy longest-first calculator. This preserves the old greedy
 * pattern choices (no saw kerf), but uses integer lengths and validates input.
 * It is independent of the new Armatur engine.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.LegacyArmatur = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  var units = { mm: 10, cm: 100, m: 10000 };

  function lengthTicks(value, unit, name) {
    if (value === "" || value === undefined || value === null) throw new Error(name + ": утга оруулна уу.");
    var number = Number(value), scaled = number * units[unit], result = Math.round(scaled);
    if (!Number.isFinite(number) || number <= 0 || result === 0 || !Number.isSafeInteger(result) ||
        Math.abs(scaled - result) > 0.0000001) {
      throw new Error(name + ": 0.1 мм-ийн нарийвчлалтай эерэг урт оруулна уу.");
    }
    return result;
  }

  function compute(raw) {
    var unit = raw.unit || "mm";
    if (!units[unit]) throw new Error("Уртын нэгж буруу байна.");
    var stock = lengthTicks(raw.stockLength, unit, "Стандарт урт");
    if (stock > 1000000000) throw new Error("Стандарт урт хэт их байна.");
    var diameter = Number(raw.diameter);
    if (raw.diameter === "" || !Number.isFinite(diameter) || diameter <= 0) {
      throw new Error("Диаметр эерэг тоо байх ёстой.");
    }
    if (!Array.isArray(raw.items) || raw.items.length < 1 || raw.items.length > 60) {
      throw new Error("1–60 төрлийн урт оруулна уу.");
    }
    var items = raw.items.map(function (entry, i) {
      var length = lengthTicks(entry.length, unit, (i + 1) + "-р урт");
      var quantity = Number(entry.quantity);
      if (entry.quantity === "" || !Number.isSafeInteger(quantity) ||
          quantity <= 0 || quantity > 1000000) {
        throw new Error((i + 1) + "-р тоо ширхэг эерэг бүхэл тоо байх ёстой.");
      }
      if (length > stock) throw new Error((i + 1) + "-р урт стандартаас их байна.");
      return { length: length, quantity: quantity };
    }).sort(function (a, b) { return b.length - a.length; });
    var remainingCount = items.reduce(function (sum, item) { return sum + item.quantity; }, 0);
    if (!Number.isSafeInteger(remainingCount) || remainingCount > 1000000) {
      throw new Error("Нийт 1,000,000-аас олон ширхэгийг тооцохгүй.");
    }
    var totalLength = items.reduce(function (sum, item) {
      return sum + item.length * item.quantity;
    }, 0);
    if (!Number.isSafeInteger(totalLength)) throw new Error("Нийт урт хэт их байна.");
    var patterns = [], stockCount = 0;
    while (remainingCount > 0) {
      var counts = [], occupied = 0, pieces = 0, repeats = Infinity;
      for (var i = 0; i < items.length; i++) {
        var number = Math.min(items[i].quantity, Math.floor((stock - occupied) / items[i].length));
        counts.push(number);
        occupied += number * items[i].length;
        pieces += number;
      }
      if (!pieces) throw new Error("Таслах төлөвлөгөө үүсгэж чадсангүй.");
      for (var j = 0; j < items.length; j++) {
        if (counts[j]) repeats = Math.min(repeats, Math.floor(items[j].quantity / counts[j]));
      }
      if (!Number.isSafeInteger(repeats) || repeats <= 0) {
        throw new Error("Төлөвлөгөөний давталт буруу байна.");
      }
      for (var k = 0; k < items.length; k++) items[k].quantity -= repeats * counts[k];
      remainingCount -= repeats * pieces;
      stockCount += repeats;
      patterns.push({
        cuts: counts.map(function (count, type) {
          return { length: items[type].length, count: count };
        }).filter(function (cut) { return cut.count > 0; }),
        repeats: repeats, offcut: stock - occupied
      });
    }
    return {
      patterns: patterns, stockCount: stockCount, stockLength: stock,
      totalLength: totalLength, waste: stockCount * stock - totalLength,
      wastePercent: 100 * (stockCount * stock - totalLength) / (stockCount * stock),
      massKg: 0.888 * Math.pow(diameter / 12, 2) * stockCount * stock / 10000,
      unit: unit, diameter: diameter, factor: units[unit]
    };
  }
  return { compute: compute };
});
