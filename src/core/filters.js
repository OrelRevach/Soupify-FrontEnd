import Vue from "vue";

Vue.filter("timeString", function(value) {
  if (!value || value < 5) return "A few Minutes";
  if (value >= 60) {
    if (value >= 120) return "Over " + parseInt(value / 60) + " hours";
    return "Over an hour";
  }
  return parseInt(value / 5) * 5 + " minutes";
});

// Returns fraction representation of a decimal
var getFraction = decimal => {
  for (var denominator = 1; (decimal * denominator) % 1 !== 0; denominator++);
  return [decimal * denominator, denominator];
};

Vue.filter("fraction", function(value) {
  value = value.toString().replace(/^0\./, ".");

  value = value.toString().replace(/\.33+/, " 1&frasl;3");
  value = value.toString().replace(/\.66+/, " 1&frasl;6");

  if (value.includes(".")) {
    let [numerator, denominator] = getFraction("." + value.split(".")[1]);
    value = value
      .toString()
      .replace(/\..*/, ` ${numerator}&frasl;${denominator}`);
  }

  value = value.toString().trim();
  return value;
});
