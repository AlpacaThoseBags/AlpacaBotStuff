(function() {
    var google = 'http://google.com/images?q=',
        totalWaifus = 0,
        responseCounts = {
            win: 0,
            stalemate: 0,
            lost: 0,
        },
        gifName = 'waifu.gif'; // Add the gif name you want to play for a special waifu. Add +1 in the lang for a special waifus.

    /**
    * @function loadWaifus
    */
    function loadWaifus() {
        var i,
            data = "";
        for (i = 0; $.lang.exists('waifucommand.waifu.' + i); i++) {
            data += 'Waifu #' + totalWaifus + ' ' + replace($.lang.get('waifucommand.waifu.' + totalWaifus)) + '\r\n';
            totalWaifus++;
        }
        $.writeToFile(data, './addons/waifus.txt', false);
    };

    /**
    * @function loadBattles
    */
    function loadResponses() {
        var i;
        for (i = 1; $.lang.exists('waifucommand.win.' + i); i++) {
            responseCounts.win++;
        }

        for (i = 1; $.lang.exists('waifucommand.stalemate.' + i); i++) {
            responseCounts.stalemate++;
        }

        for (i = 1; $.lang.exists('waifucommand.lose.' + i); i++) {
            responseCounts.lost++;
        }
    };

    /**
    * @function getWaifu
    * @param waifu
    * @return waifu with that id
    */
    function getWaifu(waifu) {
        if ($.lang.exists('waifucommand.waifu.' + waifu)) {
            return $.lang.get('waifucommand.waifu.' + waifu);
        } else {
            return false;
        }
    };

    /**
    * @function getRandomWaifu
    * @param waifu
    * @return random waifu
    */
    function getRandomWaifu(waifu) {
        return $.lang.get('waifucommand.waifu.' + waifu);
    };

    /**
    * @function getUserWaifu
    * @param username
    * @param waifu
    * @return boolean
    */
    function getUserWaifu(username, waifu) {
        return $.inidb.exists(username.toLowerCase(), 'waifu_' + waifu);
    };

    /**
    * @function getUserWaifus
    * @param username
    * @return amount of waifus the user has
    */
    function getUserWaifus(username) {
        return ($.inidb.GetKeyList(username.toLowerCase(), '').length ? $.inidb.GetKeyList(username.toLowerCase(), '').length : 0);
    };

    /**
    * @function getUserListWaifus
    * @param username
    * @return amount of waifus the user has
    */
    function getUserListWaifus(username) {
        return ($.inidb.GetKeyList(username.toLowerCase() + '_list', '').length ? $.inidb.GetKeyList(username.toLowerCase() + '_list', '').length : 0);
    };

    /**
    * @function getUserAmountWaifus
    * @param username
    * @return amount of waifus the user has
    */
    function getUserAmountWaifus(username, waifuid) {
        return ($.inidb.exists(username.toLowerCase(), 'waifu_' + waifuid) ? $.inidb.get(username.toLowerCase(), 'waifu_' + waifuid) : false);
    };
    function getUserWaifuLevel(username) {
        var waifuKeys = $.inidb.GetKeyList(username.toLowerCase(), ''),
            level = Math.ceil(getUserListWaifus(username) / 5);

        if (waifuKeys.length === 0) {
            return level;
        }
        for (i in waifuKeys) {
          var waifuId = waifuKeys[i].split('_')[1];
          if ($.lang.get('waifucommand.waifu.' + waifuId).indexOf('[Rare]') > -1) {
                level++;
            }
        }
        return level;
    }

    /**
    * @function getUserAmountRares
    * @param username
    * @return amount of rare waifus the user has
    */
    function getUserAmountRares(username, waifuid) {

      var waifuKeys = $.inidb.GetKeyList(username.toLowerCase(), ''),
          rares = 0;

        for (i in waifuKeys) {
          var waifuId = waifuKeys[i].split('_')[1];
          if ($.lang.get('waifucommand.waifu.' + waifuId).indexOf('[Rare]') > -1) {
                rares++;
            }
        }
        return rares;
    }
    /**
    * @function getUserAmountList
    * @param username
    * @param waifu
    * @return number
    */
    function getUserAmountList(username, waifu) {
        if ($.inidb.exists(username.toLowerCase() + '_list', waifu)) {
            var keys = $.inidb.GetKeyList(username + '_list'),
                amount = 0,
                i;

            for (i in keys) {
                if (keys[i].equals(waifu)) {
                    amount++;
                }
            }
            return amount;
        } else {
            return 0;
        }
    };

    /**
    * @function getAmount
    * @param username
    * @param waifu
    * @return {number}
    */
    function getAmount(username, waifu) {
        return ($.inidb.exists(username.toLowerCase(), 'waifu_' + waifu) ? $.inidb.get(username.toLowerCase(), 'waifu_' + waifu) : 0);
    };

    /**
    * @function catchWaifu
    * @param username
    */
    function catchWaifu(username) {
        var random = $.randRange(0, totalWaifus),
            waifu = String(getRandomWaifu(random)),
            link = (google + url(waifu)),
            unlock = $.randRange(1, 2),
            rare = '';

        if (waifu.includes('[Rare]') && !getUserWaifu(username, random)) {
            rare = '/me [Rare] +' + $.getPointsString(500) + ' ';
            waifu = waifu.replace('[Rare]', '');
            $.panelsocketserver.alertImage(gifName+',5');
            $.inidb.incr('points', username, 500);
        }

        if (getUserWaifu(username, random)) {
            $.say($.lang.get('waifucommand.catch.own', rare + $.userPrefix(username, true), unlock, replace(waifu), random, $.shortenURL.getShortURL(link)));
            $.inidb.incr(username, 'waifu_' + random, parseInt(unlock));
            return;
        } else {
            $.say($.lang.get('waifucommand.catch.new', rare + $.userPrefix(username, true), unlock, replace(waifu), random, $.shortenURL.getShortURL(link)));
            $.inidb.set(username + '_list', (getUserListWaifus(username) + 1), random);
            $.inidb.incr(username, 'waifu_' + random, parseInt(unlock));
            return;
        }
    };

    /**
    * @function randomWaifu
    * @param username
    */
    function randomWaifu(username) {
        var random = $.randRange(0, getUserListWaifus(username)),
            waifu = getWaifu(random),
            link = (google + url(waifu)),
            rare = '';

        if (!getUserListWaifus(username)) {
            $.say($.lang.get('waifucommand.random.0', $.whisperPrefix(username)));
        } else {
                var myLevel = getUserWaifuLevel(username);
            if (!getWowners(username)) {
                $.say($.lang.get('waifucommand.random.success', $.userPrefix(username, true), replace(waifu), random, $.shortenURL.getShortURL(link), myLevel));
            } else {
                waifu = getWaifu($.inidb.get('wowners', username));
                link = (google + waifu.split('=').join('+').split('!').join('').split(' ').join('+').split('*').join('').split(';').join('+').replace('\+\+', '+'));
                $.say($.lang.get('waifucommand.random.married', $.userPrefix(username, true), replace(waifu), random, $.shortenURL.getShortURL(link), myLevel));
            }
        }
    };

    /**
    * @function sendWaifu
    * @param username
    * @param receiver
    * @param {number} waifuid
    */
    function sendWaifu(username, receiver, waifuid) {
        if (!waifuid) {
            $.say($.lang.get('waifucommand.sendwaifu.nouser', $.whisperPrefix(username)));
            return;
        }

        var keys = $.inidb.GetKeyList(username + '_list', ''),
            waifu = getWaifu(waifuid),
            link,
            i;

        if ($.inidb.get(username, 'waifu_' + waifuid) >= 1 && waifu) {
            link = (google + url(waifu));
            for (i in keys) {
                if ($.inidb.get(username, 'waifu_' + waifu) < 1) {
                    $.inidb.del(username + '_list', keys[i]);
                    break;
                }
            }
            $.say($.lang.get('waifucommand.sendwaifu.success', $.userPrefix(username, true), replace(waifu), $.userPrefix(receiver), $.shortenURL.getShortURL(link)));
            $.inidb.set(receiver + '_list', (getUserListWaifus(receiver) + 1), waifuid);
            $.inidb.decr(username, 'waifu_' + waifuid, 1);
            $.inidb.incr(receiver, 'waifu_' + waifuid, 1);
        } else {
            $.say($.lang.get('waifucommand.sendwaifu.404', $.userPrefix(username, true)));
        }
    };

    /**
    * @function buyWaifu
    * @param username
    * @param receiver
    * @param {number} waifuid
    */
    function buyWaifu(event, username, receiver, waifuid) {
        if (!waifuid) {
            receiver = event.getSender();
            waifuid = event.getArgs()[0];
        }

        var waifu = getWaifu(waifuid),
            amount = getUserWaifus(receiver),
            unlock = 1,
            link,
            rare = '';

        if (!waifu) {
            $.say($.lang.get('waifucommand.exist.404', $.whisperPrefix(username)));
            return;
        }

        if (waifu.includes('[Rare]')) {
            $.panelsocketserver.alertImage(gifName+',5');
        }

        link = (google + url(waifu));

        if ($.inidb.exists(receiver, 'waifu_' + waifu) && waifu) {
            $.say($.lang.get('waifucommand.buywaifu.own', rare + $.userPrefix(receiver, true), unlock, replace(waifu), waifuid, $.shortenURL.getShortURL(link)));
            $.inidb.incr(receiver, 'waifu_' + waifuid, 1);
        } else {
            $.say($.lang.get('waifucommand.buywaifu.new', rare + $.userPrefix(receiver, true), unlock, replace(waifu), waifuid, $.shortenURL.getShortURL(link)));
            $.inidb.incr(receiver, 'waifu_' + waifuid, 1);
            $.inidb.set(receiver + '_list', (getUserListWaifus(receiver) + 1), waifuid);
        }
    };

    /**
    * @function checkWaifu
    * @param username
    * @param {number} waifuid
    * @return {string}
    */
    function checkWaifu(username, waifuid) {
        var waifu = getWaifu(waifuid),
            link,
            rare = '';

        if (waifu) {
            link = (google + url(waifu));

            $.say($.lang.get('waifucommand.checkwaifu.success', rare + $.userPrefix(username, true), replace(waifu), waifuid, getAmount(username, parseInt(waifuid)), $.shortenURL.getShortURL(link)));
        } else {
            $.say($.lang.get('waifucommand.exist.404', $.whisperPrefix(username)));
        }
    };

    /**
    * @function checkWaifus
    * @param username
    * @return {string}
    */
    function checkWaifus(username) {
      var myLevel = getUserWaifuLevel(username);
        $.say($.lang.get('waifucommand.mywaifus.success', $.whisperPrefix(username), getUserWaifus(username), totalWaifus, myLevel, getUserAmountRares(username)));
    };

    /**
    * @function setWaifu
    * @param username
    * @param {number} waifuid
    * @return {string}
    */
    function setWaifu(username, waifuid) {
        if (!waifuid) {
            $.say($.lang.get('waifucommand.marry.null', $.whisperPrefix(sender)));
            return;
        }

        if (getWaifu(waifuid) && getUserWaifu(username, waifuid)) {
            $.say($.lang.get('waifucommand.marry.success', $.userPrefix(username, true), replace(getWaifu(waifuid))));
            $.inidb.set('wowners', username, waifuid);
        } else {
            $.say($.lang.get('waifucommand.exist.404', $.whisperPrefix(username)));
        }
    };
    /**
    * @function addHarem
    * @param username
    * @param {number} waifuid
    * @return {string}
    */
    function addHarem(sender, waifuid) {
      var harem = $.inidb.GetKeyList('harem', sender);
        if (!waifuid) {
            $.say($.lang.get('waifucommand.harem.null', $.whisperPrefix(sender)));
            return;
        }

        if (getWaifu(waifuid) && getUserWaifu(sender, waifuid)) {
          if (harem.length > 6) {
            $.say($.lang.get('waifucommand.harem.denied'));
            return;
          } else {
            $.say($.lang.get('waifucommand.harem.success', $.userPrefix(sender, true), replace(getWaifu(waifuid))));
            $.inidb.SetString('harem', sender, waifuid, waifuid);
          }

        } else {
          if (harem.length <= 0){
              $.say($.lang.get('waifucommand.harem.404', $.whisperPrefix(sender)));
          } else if (!getUserWaifu(sender, waifuid)) {
              $.say($.lang.get('waifucommand.harem.nostock', $.whisperPrefix(sender)));
          }

        }
    };

    /**
    * @function getHarem
    * @param waifu
    * @return waifu with that id
    */
    function getHarem(username) {
    var harem = $.inidb.GetKeyList('harem', username);
    var girls = [];
      for (i in harem) {
        girls.push(replace2($.lang.get('waifucommand.waifu.' + harem[i])));
      }
    var theharem = harem.join(', ');
          if (harem.length >= 1) {
          $.say($.lang.get('waifucommand.harem.get',  $.whisperPrefix(username), girls.join(', ')));
          return;
      } else {
          $.say($.lang.get('waifucommand.harem.404'));
          return;
      }
  };
  /**
  * @function delHarem
  * @param waifu
  * @return remove a waifu with an id
  */
  function delHarem(sender, action) {
    if (!$.inidb.HasKey('harem', sender, action)) {
      $.say($.whisperPrefix(sender) + $.lang.get('waifucommand.harem.kick404'));
      return;
    } else {
      $.inidb.RemoveKey('harem', sender, action);
      $.say($.whisperPrefix(sender) + $.lang.get('waifucommand.harem.kick', replace(getWaifu(action))));
      return;
    }
  };

  /**
  * @function battle
  * @param opponent
  * @return Battle with another waifu
  */
  function startBattle(username, opponent) {
    var random1 = $.randRange(1, responseCounts.win),
    random2 = $.randRange(1, responseCounts.stalemate),
    random3 = $.randRange(1, responseCounts.lost),
    results =  $.randRange(1, 10),
    harem = $.inidb.GetKeyList('harem', username),
    harem2,
    battlewaifu,
    battlewaifu2,
    attacked,
    attacker = $.userPrefix(username);

    if (opponent === undefined) {
        $.say($.lang.get('waifucommand.fight.usage'));
        return;
    }

    if (opponent.startsWith('@')) {
        attacked = opponent;
        opponent = opponent.substring(1).toLowerCase();
    } else {
        attacked = $.userPrefix(opponent);
    }

    harem2 = $.inidb.GetKeyList('harem', opponent.toLowerCase());
    battlewaifu = getWaifu($.randElement(harem));
    battlewaifu2 = getWaifu($.randElement(harem2));

        if (opponent == username) {
           $.say($.lang.get('waifucommand.harem.same'));
           return;
         }

        if (harem.length > 0 && harem2.length > 0) {
          if (results > 5) {
            $.say($.lang.get('waifucommand.win.' + random1, replace2(battlewaifu), replace2(battlewaifu2), attacker, attacked, $.pointNameMultiple));
            $.inidb.incr('points', username, 25);
            return;
          } else if (results == 5){
            $.say($.lang.get('waifucommand.stalemate.' + random2, replace2(battlewaifu), replace2(battlewaifu2), attacker, attacked, $.pointNameMultiple));
            return;
          } else {
            $.say($.lang.get('waifucommand.lose.' + random3, replace2(battlewaifu), replace2(battlewaifu2), attacker, attacked, $.pointNameMultiple));
            $.inidb.incr('points', opponent, 25);
            return;
          }

    } else if (!harem2.length > 0){
        $.say($.lang.get('waifucommand.harem.fight4042'));
        return;
    } else {
        $.say($.lang.get('waifucommand.harem.fight404'));
        return;
    }
};

    /**
    * @function getWowners
    * @param username
    * @return {boolean}
    */
    function getWowners(username) {
        return $.inidb.exists('wowners', username.toLowerCase());
    };

    /**
    * @function replace
    * @param string
    * @return string
    */
    function replace(string) {
        return (string.replace(/=/, '(').replace(/=/g, ')'));
    };

    /**
    * @function replace2
    * @param string
    * @return string
    */
    function replace2(string) {
        return (string.split(/ =/)[0].replace('[Rare] ', ''));
    };

    /**
    * @function url
    * @param string
    * @return string
    */
    function url(string) {
        return (string.split(/=/).join('+').split('!').join('').split(' ').join('+').split('*').join('').split(';').join('+').split(':').join('+').split(/'/).join('').replace('\+\+', '+').replace('[Rare]', ''));
    };

    /**
    * @event command
    */
    $.bind('command', function(event) {
        var sender = event.getSender(),
            command = event.getCommand(),
            args = event.getArgs(),
            action = args[0],
            subAction = args[1];

        if (command.equalsIgnoreCase('waifu')) {
            if (!action) {
                randomWaifu(sender);
                return;
            }
            checkWaifu(sender, action);
        }

        if (command.equalsIgnoreCase('keijo')) {
            startBattle(sender, action);
        }

        if (command.equalsIgnoreCase('harem')) {
            getHarem(sender);
        }

        if (command.equalsIgnoreCase('addharem')) {
            if (action === undefined) {
                $.say($.lang.get('waifucommand.addharem.usage'));
                return;
            } else {
              addHarem(sender, action);
            }
        }
        if (command.equalsIgnoreCase('kickharem')) {
            if (action === undefined) {
                $.say($.lang.get('waifucommand.kickharem.usage'));
                return;
            } else {
              delHarem(sender, action);
            }
        }
        if (command.equalsIgnoreCase('resetharem')) {
            $.inidb.RemoveSection('harem', sender);
            $.say($.whisperPrefix(sender) + $.lang.get('waifucommand.harem.reset'));
            return;
        }
        if (command.equalsIgnoreCase('catchwaifu')) {
            catchWaifu(sender);
        }

        if (command.equalsIgnoreCase('giftwaifu')) {
            sendWaifu(sender, action, parseInt(subAction))
        }

        if (command.equalsIgnoreCase('buywaifu')) {
            buyWaifu(event, sender, action, subAction);
        }

        if (command.equalsIgnoreCase('waifus')) {
            checkWaifus(sender);
        }

        if (command.equalsIgnoreCase('setwaifu')) {
            setWaifu(sender, action);
        }

        if (command.equalsIgnoreCase('resetwaifu')) {
            if (getWowners(sender)) {
                $.inidb.del('wowners', sender);
                $.say($.lang.get('waifucommand.split.success', $.whisperPrefix(sender)));
                return;
            }
            $.say($.lang.get('waifucommand.split.404', $.whisperPrefix(sender)));
        }

        if (command.equalsIgnoreCase('waifuhelp')) {
            $.say($.whisperPrefix(sender) + $.lang.exists('waifucommand.waifuhelp'));
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./commands/waifucommand.js')) {
            loadWaifus(),
            loadResponses();
            $.registerChatCommand('./commands/waifucommand.js', 'waifu');
            $.registerChatCommand('./commands/waifucommand.js', 'waifus');
            $.registerChatCommand('./commands/waifucommand.js', 'keijo');
            $.registerChatCommand('./commands/waifucommand.js', 'catchwaifu');
            $.registerChatCommand('./commands/waifucommand.js', 'giftwaifu');
            $.registerChatCommand('./commands/waifucommand.js', 'resetwaifu');
            $.registerChatCommand('./commands/waifucommand.js', 'setwaifu');
            $.registerChatCommand('./commands/waifucommand.js', 'buywaifu');
            $.registerChatCommand('./commands/waifucommand.js', 'harem');
            $.registerChatCommand('./commands/waifucommand.js', 'addharem');
            $.registerChatCommand('./commands/waifucommand.js', 'kickharem');
            $.registerChatCommand('./commands/waifucommand.js', 'resetharem');
            $.registerChatCommand('./commands/waifucommand.js', 'waifuhelp');
        }
    });
})();
