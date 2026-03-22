const Item = require('../models/Item')

const searchItem = async (req, res) => {
  try {
    const { q } = req.query

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      })
    }

    // Case-insensitive regex search on ItemName
    const item = await Item.findOne({
      ItemName: {
        $regex: new RegExp(q, 'i')
      }
    })

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in database'
      })
    }

    return res.status(200).json({
      success: true,
      data: item
    })
  } catch (error) {
    console.error('Search error:', error)
    return res.status(500).json({
      success: false,
      message: 'Database search failed',
      error: error.message
    })
  }
}

module.exports = { searchItem }
