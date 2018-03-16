/* global TrelloPowerUp */

var GLITCH_ICON = "./images/glitch.svg";
var WHITE_ICON = "./images/icon-white.svg";
var GRAY_ICON = "./images/icon-gray.svg";

const BUGZILLA_API = "https://bugzilla.mozilla.org/rest/bug?";

//this doesn't work since there is no CORS.... need to figure out a solution
function getBugStatus(bugNumber) {
  fetch(`${BUGZILLA_API}?id=${bugNumber}&include_fields=status,resolution'`)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.bugs && data.bugs.length === 1) {
        return data.bugs[0];
      } else {
        console.log(`No data when retrieving bug data for ${bugNumber}.`);
        return { resolution: "", status: "" };
      }
    });
}

var getBadges = function(t) {
  return t.get("card", "shared", "secbug")
  .then(async function(secbug) {
    console.log("secbug: " + secbug);
    var status = await getBugStatus(secbug);
    if (!secbug) {
      secbug = "None";
    }

    return [
      {
        text: `SecReview:${secbug}`,
        icon: GRAY_ICON, // for card front badges only
        callback: function(context) {
          return context.popup({
            title: "Security Bug",
            url: "./settings.html",
            height: 184
          });
        }
      }
    ];
  });
};

TrelloPowerUp.initialize({
  "card-badges": function(t, options) {
    return getBadges(t);
  },
  "card-detail-badges": function(t, options) {
    return getBadges(t);
  }
});

console.log("Loaded by: " + document.referrer);
