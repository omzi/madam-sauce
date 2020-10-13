const router = require('express').Router();

router.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Shows all foods' })
})

router.get('/:id', (req, res) => {
  res.status(200).json({ success: true, message: `Shows food ${req.params.id}` })
})

router.post('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Adds new food' })
})

router.put('/:id', (req, res) => {
  res.status(200).json({ success: true, message: `Updates food ${req.params.id}` })
})

router.delete('/:id', (req, res) => {
  res.status(200).json({ success: true, message: `Deletes food ${req.params.id}` })
})

module.exports = router;