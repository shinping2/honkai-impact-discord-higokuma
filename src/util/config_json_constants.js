const CONFIGURATION_JSON_STRING = `
{
  "reminder_events":{
    "abyss":{
      "days_in_week":[
        "Thu",
        "Sun"
      ],
      "hour_of_day":22,
      "reminder_time_ahead_in_hours":10,
      "image_queries":[
        "Bronya Zaychik",
        "Seele Vollerei",
        "Honkai Abyss"
      ],
      "messages":[
        "$\{role} There are $\{hours} hours left in Abyss. Have you checked your position in Abyss :thinking:?",
        "$\{role} Abyss will close in $\{hours} hours. Time to interfere with some unfortunate souls in Abyss :sunglasses:.",
        "$\{role} Although it is over 1,000 C° in Abyss, I wouldn't want to miss the crystal rewards :yum:.",
        "$\{role} Abyss / Q-Singularis will end in $\{hours} hours. ||*Our Q-Singularis event is better than the Singularity event from Girls Frontline :smirk:*||",
        "$\{role} Time to leave the Howling/Rusty tier and promote to the Sinful tier in Abyss :thinking:."
      ]
    },
    "dinner time":{
      "days_in_week":[
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
      ],
      "hour_of_day":23,
      "reminder_time_ahead_in_hours":3,
      "image_queries":[
        "Raiden Mei",
        "Cooking with Valkyries"
      ],
      "messages":[
        "Did Mei nee-san make A5 filet mignon for dinner? I will have all the steak all for myself :yum:. $\{role} can have the instant cup noodle instead :laughing:.",
        "We are having hot pot tonight. Don’t you touch my shrimps, $\{role}. I reserve all the shrimps :yum:.",
        "Mei nee-san has prepared Korean BBQ for Higo chan. $\{role} can have the leftover vegetable.",
        "Here are some savory crepes from Mei nee-san. Bon appetit, $\{role}.",
        "Mei nee-san made ramen tonight. $\{role} should be grateful. Itadakimasu *(Thanks for the food)*",
        "~~Mei nee-san~~ *Ahem*, I made unagi (Japanese eel) tonight. Cry me a river of joy, $\{role}.",
        "Mei nee-san has prepared a delicious meal for $\{role}.",
        "$\{role} Mei nee-san's cooking is better than Michelin 4-star gourmet food. I wouldn't mind finishing your plate for you :yum:.",
        "$\{role} Heroes can't fight without a taste of Mei nee-san's yummy meal.",
        "$\{role} I can smell the savory aroma from the kitchen. I better grab my food before Kiana arrives :laughing:.",
        "$\{role} Mei nee-san's cooking is scrumptious. How do I know that you ask? I swear to Sakura nee-san I didn't nibble at your food :kissing:."
      ]
    },
    "open world":{
      "days_in_week":[
        "Mon",
        "Thu",
        "Sat"
      ],
      "hour_of_day":5,
      "reminder_time_ahead_in_hours":12,
      "image_queries":[
        "Higokumaru",
        "Post Honkai Odyssey"
      ],
      "messages":[
        "$\{role} Higo chan is waiting for Sakura nee-san to visit Sakura Samsara's Village :smiley:.",
        "$\{role} open world will close in $\{hours} hours. You won't be able to loot the barrels of food after it is closed.",
        "$\{role} Time to infiltrate Schicksal HQ before Higo chan forces you to take a break.",
        "$\{role} Have you finished your Open World quests? If you slack off, Higo chan won't let you touch Higo chan's fluffy tail."
      ]
    }
  },
  "interactions":{
    "awoo":[
      "$\{author} went awoo",
      "$\{author} went awoo at $\{user}"
    ],
    "blush":[
      "$\{author} is blushing",
      "$\{user} makes $\{author} blushing"
    ],
    "confused":[
      "$\{author} is confused",
      "$\{user} makes $\{author} confused"
    ],
    "cuddle":[
      "$\{author} wants to cuddle",
      "$\{author} wants to cuddle $\{user}"
    ],
    "dance":[
      "$\{author} wants to dance (^○^)",
      "$\{author} wants to dance with $\{user} (^○^)"
    ],
    "howl":[
      "$\{author} wants to howl",
      "$\{author} wants to howl with $\{user}"
    ],
    "hug":[
      "$\{author} wants to hug",
      "$\{author} wants to hug $\{user}"
    ],
    "idk":[
      "$\{author} shrugs",
      "$\{author} shrugs at $\{user}"
    ],
    "insult":[
      "$\{author} is insulting at air (>皿<)",
      "$\{author} wants to insult $\{user} (>皿<)"
    ],
    "neko":[
      "$\{author} went neko 🐱",
      "$\{author} wants to shows a neko 🐱 to $\{user}"
    ],
    "nyan":[
      "$\{author} went ＾○ ⋏ ○＾",
      "$\{author} greets $\{user} with a ＾○ ⋏ ○＾"
    ],
    "pat":[
      "$\{author} wants to pat someone",
      "$\{author} wants to pat $\{user}"
    ],
    "poke":[
      "$\{author} wants to poke at air",
      "$\{author} wants to poke $\{user}"
    ],
    "punch":[
      "$\{author} is doing air boxing",
      "$\{author} wants to punch $\{user}"
    ],
    "pout":[
      "$\{author} is pouting",
      "$\{user} makes $\{author} pout"
    ],
    "sleepy":[
      "$\{author} is sleepy (´〜｀*) zzz",
      "$\{author} wants to dance with $\{user}"
    ],
    "shrug":[
      "$\{author} shrugs",
      "$\{author} shrugs at $\{user}"
    ],
    "teehee":[
      "$\{author} shows ๑╹U╹)",
      "$\{author} shows ๑╹U╹) to $\{user}"
    ],
    "triggered":[
      "$\{author} is triggered (>皿<)",
      "$\{user} triggered $\{author} (>皿<)"
    ],
    "smile":[
      "$\{author} is smiling (^○^)",
      "$\{user} made $\{author} smiles (^○^)"
    ],
    "slap":[
      "$\{author} wants to slap at air",
      "$\{author} wants to slap $\{user}"
    ],
    "stare":[
      "$\{author} is staring at air",
      "$\{author} is staring at $\{user}"
    ],
    "wasted":[
      "$\{author} wants to waste something",
      "$\{author} wants to make $\{user} wasted"
    ]
  },
  "welcome_messages":[
    "Aloha Captain $\{member}! Here is a lei for you 🌺",
    "Greeting Captain $\{member}. Thanks for coming 😀",
    "Warmest welcome, Captain $\{member} 😍",
    "Hello Captain $\{member}. Glad to see you here 🎉",
    "Welcome to our hyperion, Captain $\{member}. Have a free cookie on us 🍪",
    "Thanks for visiting our hyperion, Captain $\{member} 😊",
    "Oh Captain $\{member}, welcome to our humble hyperion 😎"
  ]
}
`;

module.exports = {
  CONFIGURATION_JSON: CONFIGURATION_JSON_STRING,
};
