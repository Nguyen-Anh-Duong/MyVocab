import { Schema, model, Types } from 'mongoose'

const exampleSchema = new Schema({
  sentence: {
    type: String,
    required: true
  },
  translation: String
})

//regular structure
const phraseSchema = new Schema({
  phrase: { type: String, required: true },
  meaning: String
})

const meaningSchema = new Schema({
  meaning: { type: String, required: true },
  context: String,
  partOfSpeech: {
    type: String,
    enum: [
      'noun',
      'verb',
      'adjective',
      'adverb',
      'pronoun',
      'preposition',
      'conjunction',
      'interjection',
      'determiner',
      'exclamation',
      'phrase'
    ]
  },
  examples: [exampleSchema],
  commonPhrases: [phraseSchema],
  note: { type: String }
})

const vocabularySchema = new Schema(
  {
    word: {
      type: String,
      required: true,
      trim: true
    },
    phonetic: {
      text: String,
      audio: String
    },
    meanings: [meaningSchema],
    createdBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: true
    },
    categories: [
      {
        type: Types.ObjectId,
        ref: 'Category'
      }
    ]
  },
  {
    timestamps: true
  }
)

export const VocabularyModel = model('Vocabulary', vocabularySchema)

/* 
example for vocabulary:

{
  "word": "volume",
  "phonetic": "/ˈvɒl.juːm/",
  "meanings": [
    {
      "meaning": "Âm lượng (Mức độ âm thanh)",
      "context": "Dùng khi nói về độ lớn của âm thanh",
      "examples": [
        { "sentence": "Please turn down the volume.", "translation": "Làm ơn vặn nhỏ âm lượng." },
        { "sentence": "He turned up the volume to hear the music better.", "translation": "Anh ấy tăng âm lượng để nghe nhạc rõ hơn." }
      ],
      "commonPhrases": [
        { "phrase": "Turn up/down the volume" },
        { "phrase": "Adjust the volume" }
      ]
    },
    ...
  ]
}

*/
