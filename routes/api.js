'use strict';

const express = require('express');
const router = express.Router();
const Translator = require('../components/translator.js');

router.post('/translate', (req, res) => {
  const { text, locale } = req.body;
  if (text === undefined || locale === undefined) {
    return res.json({ error: 'Required field(s) missing' });
  }
  if (text === '') {
    return res.json({ error: 'No text to translate' });
  }
  if (locale !== 'american-to-british' && locale !== 'british-to-american') {
    return res.json({ error: 'Invalid value for locale field' });
  }
  const translator = new Translator();
  const result = translator.translate(text, locale);
  return res.json(result);
});

module.exports = router;
