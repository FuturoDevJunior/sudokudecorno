const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
  constructor() {
    this.americanOnly = americanOnly;
    this.americanToBritishSpelling = americanToBritishSpelling;
    this.americanToBritishTitles = americanToBritishTitles;
    this.britishOnly = britishOnly;
    this.britishToAmericanSpelling = {};
    Object.keys(americanToBritishSpelling).forEach(function(key) {
      var value = americanToBritishSpelling[key];
      this.britishToAmericanSpelling[value] = key;
    }, this);
    this.britishToAmericanTitles = {};
    for (const [am, br] of Object.entries(americanToBritishTitles)) {
      this.britishToAmericanTitles[br] = am;
      this.britishToAmericanTitles[br.replace('.', '')] = am;
    }
    this.britishOnlyToAmerican = britishOnly;
    this.americanOnlyToBritish = americanOnly;
  }

  translate(text, locale) {
    if (typeof text !== 'string' || !text) return { error: 'No text to translate' };
    if (!locale) return { error: 'Required field(s) missing' };
    if (locale !== 'american-to-british' && locale !== 'british-to-american') {
      return { error: 'Invalid value for locale field' };
    }
    let translation = text;
    let changes = [];
    if (locale === 'american-to-british') {
      translation = this._translateTime(translation, 'american-to-british', changes);
      translation = this._translateTitles(translation, this.americanToBritishTitles, changes, false);
      translation = this._translateTerms(translation, this.americanOnly, changes);
      translation = this._translateSpelling(translation, this.americanToBritishSpelling, changes);
    } else {
      translation = this._translateTime(translation, 'british-to-american', changes);
      translation = this._translateTitles(translation, this.britishToAmericanTitles, changes, true);
      translation = this._translateTerms(translation, this.britishOnly, changes);
      translation = this._translateSpelling(translation, this.britishToAmericanSpelling, changes);
    }
    // Remove spans for comparison
    if (changes.length === 0) {
      return { text, translation: 'Everything looks good to me!' };
    }
    return { text, translation };
  }

  _translateTerms(text, dict, changes) {
    const terms = Object.keys(dict).sort((a, b) => b.length - a.length);
    for (let term of terms) {
      let regex;
      if (term.includes(' ')) {
        // Frases: busca direta, case-insensitive
        regex = new RegExp(this._escapeRegExp(term), 'gi');
      } else {
        // Palavras: usa \b para garantir palavra inteira
        regex = new RegExp(`\\b${this._escapeRegExp(term)}\\b`, 'gi');
      }
      text = text.replace(regex, (match) => {
        changes.push({ from: match, to: dict[term] });
        return `<span class=\"highlight\">${dict[term]}</span>`;
      });
    }
    return text;
  }

  _translateSpelling(text, dict, changes) {
    const words = Object.keys(dict).sort((a, b) => b.length - a.length);
    for (let word of words) {
      let regex;
      if (word.includes(' ')) {
        regex = new RegExp(this._escapeRegExp(word), 'gi');
      } else {
        regex = new RegExp(`\\b${this._escapeRegExp(word)}\\b`, 'gi');
      }
      text = text.replace(regex, (match) => {
        changes.push({ from: match, to: dict[word] });
        return `<span class=\"highlight\">${dict[word]}</span>`;
      });
    }
    return text;
  }

  _translateTitles(text, dict, changes, addDot) {
    const titles = Object.keys(dict)
      .map(t => t.replace('.', ''))
      .sort((a, b) => b.length - a.length)
      .map(t => this._escapeRegExp(t))
      .join('|');
    const regex = new RegExp(`\\b(${titles})(\\.)?`, 'gi');
    return text.replace(regex, (match, p1, p2) => {
      let key = p1.toLowerCase();
      let keyWithDot = key + '.';
      let to = dict[keyWithDot] || dict[key];
      if (!to) return match;
      let replacement = to.charAt(0).toUpperCase() + to.slice(1);
      if (addDot && !replacement.endsWith('.')) replacement += '.';
      if (!addDot && replacement.endsWith('.')) replacement = replacement.slice(0, -1);
      changes.push({ from: match, to: replacement });
      if (!addDot && p2) {
        return `<span class=\"highlight\">${replacement}</span>`;
      }
      return `<span class=\"highlight\">${replacement}</span>${p2 ? p2 : ''}`;
    });
  }

  _translateTime(text, locale, changes) {
    if (locale === 'american-to-british') {
      // 12:15 -> 12.15
      return text.replace(/(\d{1,2}):(\d{2})/g, (match) => {
        changes.push({ from: match, to: match.replace(':', '.') });
        return `<span class="highlight">${match.replace(':', '.')}</span>`;
      });
    } else {
      // 12.15 -> 12:15
      return text.replace(/(\d{1,2})\.(\d{2})/g, (match) => {
        changes.push({ from: match, to: match.replace('.', ':') });
        return `<span class="highlight">${match.replace('.', ':')}</span>`;
      });
    }
  }

  _escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

module.exports = Translator;