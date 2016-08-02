(function() {
    var google = 'http://google.com/images?q=',
        totalWaifus = 0,
        gifName = 'waifu.gif'; // Add the gif name you want to play for a special waifu. Add +1 in the lang for a special waifus.

    /**
    * @function loadWaifus
    */
    function loadWaifus() {
        var i;
        for (i = 1; $.lang.exists('waifucommand.waifu.' + i); i++) {
            totalWaifus++;
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
    * @function unlockWaifu
    * @param username
    */
    function unlockWaifu(username) {
        var random = $.randRange(0, totalWaifus),
            waifu = String(getRandomWaifu(random)),
            link = (google + waifu.split('=').join('+').split('!').join('').split(' ').join('+').split('*').join('').split(';').join('+').replace('\+\1','').replace('\+\+', '+')),
            unlock = $.randRange(1, 2),
            rare = '';

        if (waifu.includes('+1')) {
            $.panelsocketserver.alertImage(gifName+',5');
            waifu = waifu.replace('\+1', '[RARE]');
            rare = '/me +500 Energy ';
            $.inidb.incr('points', username, 500);
        }

        if (getUserWaifu(username, random)) {
            $.say(rare + $.userPrefix(username, true) + 'you caught (+' + unlock + ') of ' + replace(waifu) + ' #' + random + '. ' + link + '!');
            $.inidb.incr(username, 'waifu_' + random, parseInt(unlock));
        } else {
            $.say(rare + $.userPrefix(username, true) + 'caught [New] (+' + unlock + ') of ' + replace(waifu) + ' #' + random + '. ' + link);
            $.inidb.incr(username, 'waifu_' + random, parseInt(unlock));
            $.inidb.set(username + '_list', (getUserListWaifus(username) + 1), random);
        }
    };

    /**
    * @function waifuRange
    * @param username
    * @param {number} range
    */
    function waifuRange(username, range) {
        var random = $.randRange(0, range),
            waifu = getRandomWaifu(random),
            unlock = $.randRange(1, 3),
            link,
            rare = '';

        if (range < 0 || !range) {
            $.say($.whisperPrefix(username) + 'you can not select a number lower then 0.');
            return;
        }

        if (waifu.includes('+1')) {
            $.panelsocketserver.alertImage(gifName+',5');
            waifu = waifu.replace('\+1', '[RARE]');
            rare = '/me ';
        }

        link = (google + waifu.split('=').join('+').split('!').join('').split(' ').join('+').split('*').join('').split(';').join('+').replace('\+\1','').replace('\+\+', '+'));

        if (getUserWaifu(username, random)) {
            $.say(rare + $.userPrefix(username, true) + 'you caught (+' + unlock + ') of ' + replace(waifu) + ' #' + random + '. ' + link + '!');
            $.inidb.incr(username, 'waifu_' + random, unlock);
        } else {
            $.say(rare + $.userPrefix(username, true) + 'caught [New] (+' + unlock + ') of ' + replace(waifu) + ' #' + random + '. ' + link);
            $.inidb.incr(username, 'waifu_' + random, unlock);
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
            waifu = waifu.replace('\+1', '[RARE]');
            rare = '/me ';
        }

        if (!getUserListWaifus(username)) {
            $.say(rare + $.whisperPrefix(username) + 'you don\'t have any waifus. Start collecting waifus with !unlockwaifu');
        } else {
            if (!getWowners(username)) {
                $.say($.userPrefix(username, true) + 'your waifu is ' + replace(waifu) + ' #' + random + '. ' + link);
            } else {
                waifu = getWaifu($.inidb.get('wowners', username));
                link = (google + waifu.split('=').join('+').split('!').join('').split(' ').join('+').split('*').join('').split(';').join('+').replace('\+\1','').replace('\+\+', '+'));
                $.say(rare + $.userPrefix(username, true) + 'you are married to ' + replace(waifu).replace('\+\1', '[RARE]') + '. ' + link);
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
            $.say($.whisperPrefix(username) + 'you must specify a user to send the waifu to.');
            return;
        }

        var keys = $.inidb.GetKeyList(username + '_list', ''),
            waifu = getWaifu(waifuid),
            link,
            i;

            if (waifu.includes('+1')) {
                waifu = waifu.replace('\+1', '[RARE]');
                rare = '/me ';
            }

        if ($.inidb.get(username, 'waifu_' + waifuid) >= 1 && waifu) {
            link = (google + waifu.split('=').join('+').split('\ =').join('+').split(' ').join('+').split('*').join('').split(';').join('+').replace('[RARE]',''));
            for (i in keys) {
                if ($.inidb.get(username, 'waifu_' + waifu) < 1) {
                    $.inidb.del(username + '_list', keys[i]);
                    break;
                }
            }
            $.say($.userPrefix(username, true) + 'you have sent waifu: ' + replace(waifu) + ' to ' + $.userPrefix(receiver) + '. ' + link);
            $.inidb.set(receiver + '_list', (getUserListWaifus(receiver) + 1), waifuid);
            $.inidb.decr(username, 'waifu_' + waifuid, 1);
            $.inidb.incr(receiver, 'waifu_' + waifuid, 1);
        } else {
            $.say($.userPrefix(username, true) + 'you don\'t own enough of that waifu or it does not exists.');
        }
    };

    /**
    * @function forceWaifu
    * @param username
    * @param receiver
    * @param {number} waifuid
    */
    function forceWaifu(event, username, receiver, waifuid) {
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
            $.say($.whisperPrefix(username) + 'that waifu does not exist.');
            return;
        }

        if (waifu.includes('+1')) {
            $.panelsocketserver.alertImage(gifName+',5');
            waifu = waifu.replace('\+1', '[RARE]');
            rare = '/me ';
        }

        link = (google + waifu.split('=').join('+').split('\ =').join('+').split(' ').join('+').split('*').join('').replace('[RARE]',''));

        if ($.inidb.exists(receiver, 'waifu_' + waifu) && waifu) {
            $.say(rare + $.userPrefix(receiver, true) + 'you caught (+' + unlock + ') of ' + replace(waifu) + ' #' + waifuid + '. ' + link + '!');
            $.inidb.incr(receiver, 'waifu_' + waifuid, 1);
        } else {
            $.say(rare + $.userPrefix(receiver, true) + 'caught [New] (+' + unlock + ') of ' + replace(waifu) + ' #' + waifuid + '. ' + link);
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
                waifu = waifu.replace('\+1', '[RARE]');
                rare = '/me ';
            }
            $.say(rare + $.userPrefix(username, true) + 'waifu: ' + replace(waifu) + ' #' + waifuid  + '. You have (' + getAmount(username, parseInt(waifuid)) +'). ' + link);
        } else {
            $.say($.whisperPrefix(username) + 'that waifu does not exist.');
        }
    };

    /**
    * @function checkWaifus
    * @param username
    * @return {string}
    */
    function checkWaifus(username) {
        $.say($.whisperPrefix(username) + 'you have ' + getUserWaifus(username) + ' out of ' + totalWaifus + ' waifus.');
    };

    /**
    * @function setWaifu
    * @param username
    * @param {number} waifuid
    * @return {string}
    */
    function setWaifu(username, waifuid) {
        if (!waifuid) {
            $.say($.whisperPrefix(sender) + 'you must specify a waifu id.');
            return;
        }

        if (getWaifu(waifuid) && getUserWaifu(username, waifuid)) {
            $.say($.userPrefix(username, true) + 'you married ' + replace(getWaifu(waifuid)).replace('\+\1', '[RARE]') + '!');
            $.inidb.set('wowners', username, waifuid);
        } else {
            $.say($.whisperPrefix(username) + 'that waifu does not exist.');
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

        if (command.equalsIgnoreCase('unlockwaifu')) {
            unlockWaifu(sender);
        }

        if (command.equalsIgnoreCase('unpackwaifu')) {
            waifuRange(sender, parseInt(action));
        }

        if (command.equalsIgnoreCase('sendwaifu')) {
            sendWaifu(sender, action, parseInt(subAction))
        }

        if (command.equalsIgnoreCase('forcewaifu')) {
            forceWaifu(event, sender, action, subAction);
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
                $.say($.whisperPrefix(sender) + 'you are now single.');
                return;
            }
            $.say($.whisperPrefix(sender) + 'you are not married, yet.');
        }

        if (command.equalsIgnoreCase('waifuhelp')) {
            $.say($.whisperPrefix(sender)
            + '!waifu - for a random waifu you own | !unlockwaifu - adds a random waifu to your list | '
            + '!setwaifu - sets a waifu on your list to default for when you use !waifu | '
            + '!waifu <id#> - checks for waifu data on that number and shows if you have it | !sendwaifu <id#> <person> - sends a waifu to specified target.');
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
            $.registerChatCommand('./commands/waifuCommand.js', 'unlockwaifu');
            $.registerChatCommand('./commands/waifuCommand.js', 'unpackwaifu');
            $.registerChatCommand('./commands/waifuCommand.js', 'sendwaifu');
            $.registerChatCommand('./commands/waifuCommand.js', 'splitwaifu');
            $.registerChatCommand('./commands/waifuCommand.js', 'setwaifu');
            $.registerChatCommand('./commands/waifuCommand.js', 'forcewaifu', 1);
            $.registerChatCommand('./commands/waifuCommand.js', 'waifuhelp');
        }
    });
})();
