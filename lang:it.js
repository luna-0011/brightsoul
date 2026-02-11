import en from "./en.js";

export default {
  ui: {
    appTitle: "Flashcard di Saggezza Islamica",
    appSubtitle: "Tocca un tema/categoria → tocca la carta per girarla → nessuna ripetizione finché il mazzo non è finito.",
    frontHint: "Tocca per girare • Scegli un bottone per pescare la prossima carta",
    footerTip: "Suggerimento: i progressi sono salvati per categoria e lingua (niente ripetizioni finché non completi il mazzo).",
    selectPrompt: "Seleziona una categoria",
    noContent: "Nessun contenuto ancora per questo mazzo.",
    methodTitle: "Metodo pratico",
  },

  labels: {
    topics: {
      "Prophet Muhammad ﷺ Wisdom": "Saggezza del Profeta Muhammad ﷺ",
      "Quran": "Corano",
      "Dhikr & Dua": "Dhikr & Duʿā’",
      "Salah": "Ṣalāh",
      "Ramadan": "Ramaḍān",
      "Poison of the Heart": "Veleni del Cuore",
      "Tricks of Shaytan": "Trucchi di Shayṭān",
    },
    categories: {
      "Anger":"Rabbia",
      "Anxiety":"Ansia",
      "Envy/Hasad":"Invidia/Ḥasad",
      "Jealousy":"Gelosia",
      "Tongue":"Lingua (parole)",
      "Pride/Kibr":"Orgoglio/Kibr",
      "Greed":"Avidità",
      "Fear":"Paura",
      "Sadness & Grief":"Tristezza & Lutto",
      "Loneliness":"Solitudine",
      "Sabr":"Ṣabr (Pazienza)",
      "Tawakkul":"Tawakkul (Affidamento)",
      "Aqeedah":"ʿAqīdah (Credo)",
      "Adab":"Adab (Buone maniere)",
      "Dawah":"Daʿwah",
      "Akhira":"Ākhirah (Aldilà)",
      "Family & Spouse":"Famiglia & Coniuge",
      "Children":"Figli",
      "Women in Islam":"Donne nell’Islam",
      "Sahaba & Parables":"Ṣaḥābah & Parabole",
    }
  },

  // Fallback decks: translate progressively by replacing en.decks with Italian versions
  decks: en.decks
};
