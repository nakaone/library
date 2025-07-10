/**
 * 全角英数記号は半角、半角カナは全角に変換
 * @param {string} str - 変換対象文字列
 * @param {string} kana=null - true:ひらがなに統一、false:カタカナに統一、null:ひらがな・カタカナ変換はしない
 * @returns {string} 変換結果
 *
 * - [全角ひらがな⇔全角カタカナの文字列変換](https://neko-note.org/javascript-hiragana-katakana/1024)
 * - [全角⇔半角の変換を行う（英数字、カタカナ）](https://www.yoheim.net/blog.php?q=20191101)
 */
function convertCharacters(str='',kana=null) {
  const v = { whois: 'convertCharacters', rv: null,
    alphabet: str => {  // 全角英数字 -> 半角英数字
      return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) - 65248);
      });
    },
    symbol: str => {  // 記号
      return str.replace(/[！-～]/g, function(s) {
          return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
      })
    },
    hankaku: str => { // 半角カタカナ -> 全角カタカナ
      const kanaMap = {
        'ｶﾞ': 'ガ', 'ｷﾞ': 'ギ', 'ｸﾞ': 'グ', 'ｹﾞ': 'ゲ', 'ｺﾞ': 'ゴ',
        'ｻﾞ': 'ザ', 'ｼﾞ': 'ジ', 'ｽﾞ': 'ズ', 'ｾﾞ': 'ゼ', 'ｿﾞ': 'ゾ',
        'ﾀﾞ': 'ダ', 'ﾁﾞ': 'ヂ', 'ﾂﾞ': 'ヅ', 'ﾃﾞ': 'デ', 'ﾄﾞ': 'ド',
        'ﾊﾞ': 'バ', 'ﾋﾞ': 'ビ', 'ﾌﾞ': 'ブ', 'ﾍﾞ': 'ベ', 'ﾎﾞ': 'ボ',
        'ﾊﾟ': 'パ', 'ﾋﾟ': 'ピ', 'ﾌﾟ': 'プ', 'ﾍﾟ': 'ペ', 'ﾎﾟ': 'ポ',
        'ｳﾞ': 'ヴ', 'ﾜﾞ': 'ヷ', 'ｦﾞ': 'ヺ',
        'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ',
        'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ',
        'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ',
        'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト',
        'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ',
        'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ',
        'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ',
        'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ',
        'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ',
        'ﾜ': 'ワ', 'ｦ': 'ヲ', 'ﾝ': 'ン',
        'ｧ': 'ァ', 'ｨ': 'ィ', 'ｩ': 'ゥ', 'ｪ': 'ェ', 'ｫ': 'ォ',
        'ｯ': 'ッ', 'ｬ': 'ャ', 'ｭ': 'ュ', 'ｮ': 'ョ',
        'ｰ': 'ー', 'ｰ': 'ー', // 長音記号、ハイフン
        '｡': '。', '､': '、', '｢': '「', '｣': '」', '･': '・'
      };

      const reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g');
      return str
        .replace(reg, function (match) {
            return kanaMap[match];
        })
        .replace(/ﾞ/g, '゛')
        .replace(/ﾟ/g, '゜');
    },
    kanaToHira: str => {  // 全角カタカナ -> ひらがな
      return str.replace(/[\u30a1-\u30f6]/g, function(match) {
        var chr = match.charCodeAt(0) - 0x60;
        return String.fromCharCode(chr);
      });
    },
    hiraToKana: str => {  // ひらがな -> 全角カタカナ
      return str.replace(/[\u3041-\u3096]/g, function(match) {
        var chr = match.charCodeAt(0) + 0x60;
        return String.fromCharCode(chr);
      });
    },
  };

  try {

    v.rv = v.alphabet(str);
    if( v.rv instanceof Error ) throw v.rv;
    v.rv = v.symbol(v.rv);
    if( v.rv instanceof Error ) throw v.rv;
    v.rv = v.hankaku(v.rv);
    if( v.rv instanceof Error ) throw v.rv;
    if( kana !== null ){
      v.rv = kana ? v.hiraToKana(v.rv) : v.kanaToHira(v.rv);
      if( v.rv instanceof Error ) throw v.rv;
    }

    return v.rv;

  } catch (e) { return e; }
}
