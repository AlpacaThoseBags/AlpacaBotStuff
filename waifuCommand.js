(function() {
    var google = 'http://google.com/images?q=',
        totalWaifus = 0,
        gifName = 'waifu.gif'; // Add the gif name you want to play for a special waifu. Add +1 in the lang for a special waifus.

    /**
    * @function loadWaifus
    */
    function loadWaifus() {
        var i,
            data = "";
        for (i = 0; $.lang.exists('waifucommand.waifu.' + i); i++) {
            data += 'Waifu #' + totalWaifus + ' ' + replace($.lang.get('waifucommand.waifu.' + totalWaifus).replace(/\+1/, "[RARE]")) + '\r\n';
            totalWaifus++;
        }
        $.writeToFile(data, './addons/waifus.txt', false);
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
          if ($.lang.get('waifucommand.waifu.' + waifuId).indexOf('+1') > -1) {
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
          if ($.lang.get('waifucommand.waifu.' + waifuId).indexOf('+1') > -1) {
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
    function catchwaifu(username) {
        var random = $.randRange(0, totalWaifus),
            waifu = String(getRandomWaifu(random)),
            link = (google + waifu.split('=').join('+').split('!').join('').split(' ').join('+').split('*').join('').split(';').join('+').replace('\+\1','').replace('\+\+', '+')),
            unlock = $.randRange(1, 2),
            rare = '';

        if (waifu.includes('+1')) {
            $.panelsocketserver.alertImage(gifName+',5');
            waifu = waifu.replace('\+1', $.lang.get('waifucommand.rare'));
            rare = $.lang.get('waifucommand.reward');
            $.inidb.incr('points', username, 500);
        }

        if (getUserWaifu(username, random)) {
            $.say($.lang.get('waifucommand.catch.own', rare + $.userPrefix(username, true), unlock, replace(waifu), random, link));
            $.inidb.incr(username, 'waifu_' + random, parseInt(unlock));
        } else {
            $.say($.lang.get('waifucommand.catch.new', rare + $.userPrefix(username, true), unlock, replace(waifu), random, link));
            $.inidb.incr(username, 'waifu_' + random, parseInt(unlock));
            $.inidb.set(username + '_list', (getUserListWaifus(username) + 1), random);
        }
    };

    /**
    * @function randomWaifu
    * @param username
    */
    function randomWaifu(username) {
        var random = $.randRange(0, getUserListWaifus(username)),
            waifu = getWaifu(random),
            link = (google + waifu.split('=').join('+').split('!').join('').split(' ').join('+').split('*').join('').split(';').join('+').replace('\+\1','').replace('\+\+', '+')),
            rare = '';

        if (waifu.includes('+1')) {
            waifu = waifu.replace('\+1', $.lang.get('waifucommand.rare'));
            rare = $.lang.get('waifucommand.rarecheck');

        }

        if (!getUserListWaifus(username)) {
            $.say($.lang.get('waifucommand.random.0', $.whisperPrefix(username)));
        } else {
                var myLevel = getUserWaifuLevel(username);
            if (!getWowners(username)) {
                $.say($.lang.get('waifucommand.random.success', $.userPrefix(username, true), replace(waifu), random, link, myLevel));
            } else {
                waifu = getWaifu($.inidb.get('wowners', username));
                link = (google + waifu.split('=').join('+').split('!').join('').split(' ').join('+').split('*').join('').split(';').join('+').replace('\+\1','').replace('\+\+', '+'));
                $.say($.lang.get('waifucommand.random.married', $.userPrefix(username, true), replace(waifu).replace('\+\1', $.lang.get('waifucommand.rare')), random, link, myLevel));
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

            if (waifu.includes('+1')) {
                waifu = waifu.replace('\+1', $.lang.get('waifucommand.rare'));
                rare = $.lang.get('waifucommand.rarecheck');
            }

        if ($.inidb.get(username, 'waifu_' + waifuid) >= 1 && waifu) {
            link = (google + waifu.split('=').join('+').split('\ =').join('+').split(' ').join('+').split('*').join('').split(';').join('+').replace($.lang.get('waifucommand.rare'),''));
            for (i in keys) {
                if ($.inidb.get(username, 'waifu_' + waifu) < 1) {
                    $.inidb.del(username + '_list', keys[i]);
                    break;
                }
            }
            $.say($.lang.get('waifucommand.sendwaifu.success', $.userPrefix(username, true), replace(waifu), $.userPrefix(receiver), link));
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

        if (waifu.includes('+1')) {
            $.panelsocketserver.alertImage(gifName+',5');
            waifu = waifu.replace('\+1', $.lang.get('waifucommand.rare'));
            rare = $.lang.get('waifucommand.rarecheck');
        }

        link = (google + waifu.split('=').join('+').split('\ =').join('+').split(' ').join('+').split('*').join('').replace($.lang.get('waifucommand.rare'),''));

        if ($.inidb.exists(receiver, 'waifu_' + waifu) && waifu) {
            $.say($.lang.get('waifucommand.buywaifu.own', rare + $.userPrefix(receiver, true), unlock, replace(waifu), waifuid, link));
            $.inidb.incr(receiver, 'waifu_' + waifuid, 1);
        } else {
            $.say($.lang.get('waifucommand.buywaifu.new', rare + $.userPrefix(receiver, true), unlock, replace(waifu), waifuid, link));
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
            link = (google + waifu.split('=').join('+').split('!').join('').split(' ').join('+').split('*').join('').split(';').join('+').replace('\+\1','').replace('\+\+', '+'));
            if (waifu.includes('+1')) {
                waifu = waifu.replace('\+1', $.lang.get('waifucommand.rare'));
                rare = $.lang.get('waifucommand.rarecheck');
            }
            $.say($.lang.get('waifucommand.checkwaifu.success', rare + $.userPrefix(username, true), replace(waifu), waifuid, getAmount(username, parseInt(waifuid)), link));
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
            $.say($.lang.get('waifucommand.marry.success', $.userPrefix(username, true), replace(getWaifu(waifuid)).replace('\+\1', $.lang.get('waifucommand.rare'))));
            $.inidb.set('wowners', username, waifuid);
        } else {
            $.say($.lang.get('waifucommand.exist.404', $.whisperPrefix(username)));
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
    }

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

        if (command.equalsIgnoreCase('catchwaifu')) {
            catchwaifu(sender);
        }

        if (command.equalsIgnoreCase('unpackwaifu')) {
            waifuRange(sender, parseInt(action));
        }

        if (command.equalsIgnoreCase('sendwaifu')) {
            sendWaifu(sender, action, parseInt(subAction))
        }

        if (command.equalsIgnoreCase('buywaifu')) {
            buyWaifu(event, sender, action, subAction);
        }

        if (command.equalsIgnoreCase('mywaifus')) {
            checkWaifus(sender);
        }

        if (command.equalsIgnoreCase('setwaifu')) {
            setWaifu(sender, action);
        }

        if (command.equalsIgnoreCase('splitwaifu')) {
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
        if ($.bot.isModuleEnabled('./commands/waifuCommand.js')) {
            loadWaifus();
            $.registerChatCommand('./commands/waifuCommand.js', 'waifu');
            $.registerChatCommand('./commands/waifuCommand.js', 'mywaifus');
            $.registerChatCommand('./commands/waifuCommand.js', 'catchwaifu');
            $.registerChatCommand('./commands/waifuCommand.js', 'sendwaifu');
            $.registerChatCommand('./commands/waifuCommand.js', 'splitwaifu');
            $.registerChatCommand('./commands/waifuCommand.js', 'setwaifu');
            $.registerChatCommand('./commands/waifuCommand.js', 'buywaifu');
            $.registerChatCommand('./commands/waifuCommand.js', 'waifuhelp');
        }
    });
})();
