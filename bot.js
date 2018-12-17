var Discord = require('discord.js');
var auth = require('./auth.json');
var Package = require('./package.json');
//Initialize Bot Vars
const defaultChannel = '523918772185333785';
const commandToken = '!';
let serverUsers = new Map();
let adminUsers = [];
const ghostimage = '|o_o|';

// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
 });

//start up
bot.once('ready', () => {
    horizontalRule();
    console.log(ghostimage);
    console.log('GhostBot is Ready!');
    horizontalRule();
   });

bot.on('ready', ()=>{
    refreshUsers();
})

bot.login(auth.token);

 //Accept Commands
 bot.on('message', function (message) {
    
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.content.substring(0, 1) == commandToken) {
        handleCommand(message);
         }else{
        //if the message was not a command
        //Update user that sent a message in the user list
            refreshUser(message.author);
         }
});

bot.on('presenceUpdate', function(oldMember, newMember){
    //Add or update user to local list       
      refreshUser(newMember.user);
    
    //If we are coming online, capture information
    if(newMember.presence.status === 'online'){
        console.log('User Login with name: ' + oldMember.displayName);
        horizontalRule();

        console.log('Check Admin for user ' + newMember.user.username);
        if(adminUsers.indexOf(newMember.user.username) > -1){
            //if the user is a registered admin, send them a message detailing who has read their last message
            console.log('User is admin');
            console.log('Sending report to ' + newMember.user.username)
            var result = '';
            for (const [key, value] of serverUsers.entries()) {
                var one_day_ms=1000*60*60*24;
                var one_hour_ms = 1000*60*60;
                var one_minute_ms = 1000*60;

                var messageDate_ms = newMember.user.lastMessage.createdAt.getTime();
                var userLogoffDate_ms = value.getTime();
                var now_ms = new Date().getTime();

                var timeDiff = userLogoffDate_ms - messageDate_ms;

                if(timeDiff > 0){
                    //they saw your message
                    var lastSeenDays = Math.round((now_ms - userLogoffDate_ms)/one_day_ms);
                    var lastSeenHours = Math.round((now_ms - userLogoffDate_ms)/one_hour_ms);
                    var lastSeenMinutes = Math.round((now_ms-userLogoffDate_ms)/one_minute_ms);

                    var lastSeen = ' Seconds';
                    if (lastSeenDays === 0){
                        if(lastSeenHours === 0){
                            if(lastSeenMinutes === 0){
                                lastSeen = ' Seconds';
                            }else{
                            lastSeen = lastSeenMinutes + ' Minutes';
                            }
                        }else{
                            lastSeen = lastSeenHours + ' Hours';
                        }
                    }else{
                        lastSeenDays + ' Days';
                    }
                    result += '| Name: ' + key + ' | Last Seen: ~' + lastSeen + ' ago' + ' |\n'
                }
            }

            if(result === ''){
              newMember.user.send('Normally I would show you a snazzy report of people that have seen your messages but there is nothing to Show! Everyone is all caught up!')
            }else{
                newMember.user.send("Hello! Here is a list of all the users that were active since you sent your last message: ");
                newMember.user.send(result);
            }
            
            newMember.user.send();
        }else{
            console.log('User not Admin');
            console.log('Admin Users: ' + adminUsers);
            horizontalRule();
        }
        
   }
});

function handleCommand(msg){
    var args = msg.content.substring(1).split(' ');
    var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ghostTest
            case 'scare':
            msg.channel.send('BOO!')
            break;
            //!ghostSubscribe
                case 'haunt':
                adminUsers.push(msg.author.username);
                msg.channel.send('OoooOOooo I am now haunting ' + msg.author.username)
                msg.author.send('BOO! You will now get a report when you come online of all users that saw your most recent message while you were away.');
            break;
            //!ghostGetLocalUsersList
                case 'ghostGetLocalUsersList' :
                
                let results =''
                for (const [key, value] of serverUsers.entries()) {
                    console.log(key, value);
                    results +=  '*User*: ' + key + ' | *Last Seen*: ' + value + '\n';

                }
                if(results === ''){
                    results = 'Hmmm... There do not seem to be any users. You must have logged in while I was asleep! Try again and I will add you :)';
                }else{
                    msg.channel.send('Here are the current local users: ');
                }
                    console.log('Results: ' + results);
                    horizontalRule();
                    msg.channel.send(results);
            break;
            //!escape
                case 'escape' :
                adminUsers.splice(adminUsers.indexOf(msg.author.username));
                msg.channel.send('NOOOOOOOOOOOOOooooooooo.... ' + msg.author.username + ' Has escaped my clutches!');
                msg.author.send("I'll get you next time...");
            break;
}
}

function refreshUser(u){
    if(u.username !== bot.user.username){
    serverUsers.set(u.username, new Date());
        console.log('Added or Updated ' + u.username + ' to serverUsers list');
        horizontalRule();
    }
}

function refreshUsers(){
    bot.users.forEach(u => {
        if(u.username !== bot.user.username){
        serverUsers.set(u.username, new Date());
        console.log('Added or Updated ' + u.username + ' to serverUsers list');
        horizontalRule();
        }
    });
}

function horizontalRule(){
    console.log('-----------------------------------------------');
}