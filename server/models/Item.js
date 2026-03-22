const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema(
  {
    ItemName: {
      type: String,
      required: true,
      index: true
    },
    Material: {
      type: String,
      required: true
    },
    EcologicalFootprint: {
      type: String,
      required: true
    },
    PathwayA: {
      type: String,
      required: true
    },
    PathwayB: {
      type: String,
      required: true
    },
    EcoMetric: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Item = mongoose.model('Item', itemSchema)
module.exports = Item
