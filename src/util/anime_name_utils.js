
const ANIME_NAMES_ = [
  'Angel Beats',
  'Ansatsu Kyoushitsu',
  'Akagami Shirayuki-hime',
  'Boku dake ga Inai Machi',
  'Charlotte',
  'Chuunibyou',
  'Clannad',
  'Evergarden',
  'Fruits Basket',
  'Gabriel',
  'Grimgar',
  'Hakushaku',
  'Hamatora',
  'Hanayamata',
  'Hataraku Maou-sama',
  'Hyouka',
  'Jikkyouchuu',
  'Joukamachi',
  'K-On',
  'Kaguya-sama',
  'Kaichou',
  'Kamisama',
  'Kemono',
  'Kiniro',
  'Kokoro',
  'Kyoukai',
  'Lucky',
  'Madoka',
  'Masamune-kun',
  'Mikagura',
  'Mikochi',
  'Mondaiji-tachi',
  'Nisemonogatari',
  'Nisekoi',
  'Noragami',
  'Ookami',
  'Ouran',
  'ReLIFE',
  'Revue Starlight',
  'Saenai',
  'Shigatsu',
  'Steins Gate',
  'Suzumiya',
  'Takunomi',
  'Tate no Yuusha no Nariagari',
  'Toaru Kagaku',
  'Toradora',
  'Umaru-chan',
  'Yahari',
  'Yakuindomo',
  'Yuru',
  'Zestiria',
  '盾勇者',
];

const AVERAGE_CHANCE = 0.5;

const QUERY_ADORABLE = 'adorable';
const QUERY_CUTE = 'cute';
const QUERY_GIF = 'gif';
const QUERY_KAWAII = 'kawaii';
const QUERY_WALLPAPER = 'wallpaper';
const QUERY_YURU = 'yuru';

/* String */ function getRandomAnimeName_() {
  const index = Math.floor(ANIME_NAMES_.length * Math.random());
  return ANIME_NAMES_[index];
}

/* String */ function getExtraSearchQuery_() {
  let queries = [QUERY_GIF];
  if (Math.random() >= AVERAGE_CHANCE) {
    queries.push(QUERY_ADORABLE);
  }
  if (Math.random() >= AVERAGE_CHANCE) {
    queries.push(QUERY_CUTE);
  }
  if (Math.random() >= QUERY_KAWAII) {
    queries.push(QUERY_CUTE);
  }
  if (Math.random() >= AVERAGE_CHANCE) {
    queries.push(QUERY_WALLPAPER);
  }
  if (Math.random() >= AVERAGE_CHANCE) {
    queries.push(QUERY_YURU);
  }
  return queries.join(' ');
}

module.exports = {
  NAME: ANIME_NAMES_,
  getExtraSearchQuery: getExtraSearchQuery_,
  getRandomAnimeName: getRandomAnimeName_,
};
