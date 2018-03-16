/* global TrelloPowerUp */

// we can access Bluebird Promises as follows
var Promise = TrelloPowerUp.Promise;

/*

Trello Data Access

The following methods show all allowed fields, you only need to include those you want.
They all return promises that resolve to an object with the requested fields.

Get information about the current board
t.board('id', 'name', 'url', 'shortLink', 'members')

Get information about the current list (only available when a specific list is in context)
So for example available inside 'attachment-sections' or 'card-badges' but not 'show-settings' or 'board-buttons'
t.list('id', 'name', 'cards')

Get information about all open lists on the current board
t.lists('id', 'name', 'cards')

Get information about the current card (only available when a specific card is in context)
So for example available inside 'attachment-sections' or 'card-badges' but not 'show-settings' or 'board-buttons'
t.card('id', 'name', 'desc', 'due', 'closed', 'cover', 'attachments', 'members', 'labels', 'url', 'shortLink', 'idList')

Get information about all open cards on the current board
t.cards('id', 'name', 'desc', 'due', 'closed', 'cover', 'attachments', 'members', 'labels', 'url', 'shortLink', 'idList')

Get information about the current active Trello member
t.member('id', 'fullName', 'username')

For access to the rest of Trello's data, you'll need to use the RESTful API. This will require you to ask the
user to authorize your Power-Up to access Trello on their behalf. We've included an example of how to
do this in the `🔑 Authorization Capabilities 🗝` section at the bottom.

*/

/*

Storing/Retrieving Your Own Data

Your Power-Up is afforded 4096 chars of space per scope/visibility
The following methods return Promises.

Storing data follows the format: t.set('scope', 'visibility', 'key', 'value')
With the scopes, you can only store data at the 'card' scope when a card is in scope
So for example in the context of 'card-badges' or 'attachment-sections', but not 'board-badges' or 'show-settings'
Also keep in mind storing at the 'organization' scope will only work if the active user is a member of the team

Information that is private to the current user, such as tokens should be stored using 'private' at the 'member' scope

t.set('organization', 'private', 'key', 'value');
t.set('board', 'private', 'key', 'value');
t.set('card', 'private', 'key', 'value');
t.set('member', 'private', 'key', 'value');

Information that should be available to all users of the Power-Up should be stored as 'shared'

t.set('organization', 'shared', 'key', 'value');
t.set('board', 'shared', 'key', 'value');
t.set('card', 'shared', 'key', 'value');
t.set('member', 'shared', 'key', 'value');

If you want to set multiple keys at once you can do that like so

t.set('board', 'shared', { key: value, extra: extraValue });

Reading back your data is as simple as

t.get('organization', 'shared', 'key');

Or want all in scope data at once?

t.getAll();

*/

var GLITCH_ICON = "./images/glitch.svg";
var WHITE_ICON = "./images/icon-white.svg";
var GRAY_ICON = "./images/icon-gray.svg";

const BUGZILLA_API = "https://bugzilla.mozilla.org/rest/bug?";

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
        title: "Popup Detail Badge", // for detail badges only
        text: `SecReview:${secbug}`,
        icon: GRAY_ICON, // for card front badges only
        callback: function(context) {
          return context.popup({
            title: "Card Detail Badge Popup",
            url: "./settings.html",
            height: 184
          });
        }
      }
    ];
  });
};

// We need to call initialize to get all of our capability handles set up and registered with Trello
TrelloPowerUp.initialize({
  "card-badges": function(t, options) {
    return getBadges(t);
  },
  "card-detail-badges": function(t, options) {
    return getBadges(t);
  }
});

console.log("Loaded by: " + document.referrer);
