/** Schema: シート・RDB・IndexedDB・CSV/TSVで扱うデータベース構造定義のユーティリティ集
 * @typedef {Object} schemaDef
 * @property {string} [dbName] - データベース名(IndexedDB上ではストア名)
 * @property {string} [note] - データベースに関する備考
 * @property {Object.<string, tableDef>} tableDef - テーブル構造定義名をメンバ名とするテーブル構造定義
 * @property {Object.<string, Object>} tableMap - 実テーブル名をメンバ名とする実テーブルのマップ
 * @property {Object.<string, string>} [custom]
 *
 * @typedef {Object} schemaDefEx
 * @property {string} original
 * @property {string} [created]
 * @property {Function} expand
 */
class Schema {
  static ColumnDef = class {
    constructor(arg = {}) {
      this.name = typeof arg.name === 'string' ? arg.name : '';
      this.note = typeof arg.note === 'string' ? arg.note : undefined;
      this.label = typeof arg.label === 'string' ? arg.label : this.name;
      this.type = ['string', 'number', 'boolean'].includes(arg.type) ? arg.type : 'string';
      this.alias = Array.isArray(arg.alias) && arg.alias.every(a => typeof a === 'string') ? arg.alias : [];
      this.default = arg.default ?? null;
      this.printf = typeof arg.printf === 'string' ? arg.printf : null;
    }
  }

  static ColumnDefEx = class extends Schema.ColumnDef {
    constructor(arg = {}) {
      super(arg);
      this.seq = typeof arg.seq === 'number' ? arg.seq : 0;
    }
  }

  static TableDef = class {
    constructor(arg = {}) {
      this.note = typeof arg.note === 'string' ? arg.note : '';
      this.primaryKey = typeof arg.primaryKey === 'string' ? [arg.primaryKey]
        : Array.isArray(arg.primaryKey) ? arg.primaryKey : [];
      this.unique = typeof arg.unique === 'string' ? [arg.unique]
        : Array.isArray(arg.unique) ? arg.unique : [];
      this.colDef = Array.isArray(arg.colDef)
        ? arg.colDef.map((c, i) => new Schema.ColumnDefEx({ ...c, seq: i }))
        : [];
      this.top = typeof arg.top === 'number' ? arg.top : 1;
      this.left = typeof arg.left === 'number' ? arg.left : 1;
      this.startingRowNumber = typeof arg.startingRowNumber === 'number' ? arg.startingRowNumber : 2;
    }
  }

  static TableDefEx = class extends Schema.TableDef {
    constructor(arg = {}, name = '') {
      super(arg);
      this.name = name;
      this.header = this.colDef.map(col => col.label || col.name);
      this.colMap = {};
      this.colDef.forEach((col, i) => {
        const keys = Array.from(new Set([col.name, col.label, ...col.alias, i]));
        keys.forEach(k => this.colMap[k] = col);
      });
    }
  }

  constructor(schema = {}) {
    /** @type {schemaDefEx} */
    this.schema = Schema.mergeDeeply(schema, JSON.parse(Schema.defaults.schemaDef));
    this.schema.original = JSON.stringify(schema);
    this.schema.created = new Date().toLocaleString();
    this.schema.expand = this.expand.bind(this);

    for (const fn in this.schema.custom) {
      if (typeof this.schema.custom[fn] !== 'function') {
        this.schema.custom[fn] = new Function('return ' + this.schema.custom[fn])();
      }
    }

    for (const [name, table] of Object.entries(this.schema.tableMap)) {
      const defName = table.def || name;
      const baseDef = this.schema.tableDef[defName] || {};
      const merged = Schema.mergeDeeply(table, Schema.mergeDeeply(baseDef, JSON.parse(Schema.defaults.tableDef)));
      const tableEx = new Schema.TableDefEx(merged, name);

      if (typeof tableEx.data === 'string') {
        tableEx.data = Schema.parseCSVorTSV(tableEx.data);
        if (tableEx.startingRowNumber > 0 && tableEx.data.length > 0 && typeof tableEx.data[0].RowNumber === 'undefined') {
          tableEx.data.forEach((row, i) => row.RowNumber = i + tableEx.startingRowNumber);
        }
        tableEx.data.forEach(row => {
          tableEx.colDef.forEach(col => {
            const val = row[col.name];
            switch (col.type) {
              case 'number': row[col.name] = Number(val); break;
              case 'boolean': row[col.name] = val === '' ? '' : String(val).toLowerCase() === 'true'; break;
            }
          });
        });
      }

      tableEx.colDef.forEach(col => {
        ['default', 'printf'].forEach(key => {
          if (col[key] !== null && typeof col[key] !== 'function') {
            col[key] = new Function('return ' + col[key])();
          }
        });
      });

      this.schema.tableMap[name] = tableEx;
    }
  }

  /**
   * schemaを再展開する
   * @param {schemaDef} patch
   * @returns {schemaDefEx}
   */
  expand(patch = {}) {
    return new Schema(Schema.mergeDeeply(this.schema, patch)).schema;
  }

  /**
   * CSV/TSV文字列をオブジェクト配列に変換
   * @param {string} text
   * @param {object} [options]
   * @returns {Object[]}
   */
  static parseCSVorTSV(text, options = {}) {
    const { headers = true, trim = true } = options;
    if (typeof text !== 'string') throw new TypeError('text must be a string');
    if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

    const firstLine = text.split(/\r?\n/)[0];
    const delimiter = (firstLine.match(/\t/g) || []).length > (firstLine.match(/,/g) || []).length ? '\t' : ',';

    const rows = [];
    let cur = '', row = [], inQuotes = false, i = 0;

    while (i < text.length) {
      const ch = text[i];
      if (ch === '"') {
        if (!inQuotes) inQuotes = true;
        else if (text[i + 1] === '"') { cur += '"'; i++; }
        else inQuotes = false;
        i++; continue;
      }
      if (!inQuotes && ch === delimiter) { row.push(trim ? cur.trim() : cur); cur = ''; i++; continue; }
      if (!inQuotes && (ch === '\n' || ch === '\r')) {
        row.push(trim ? cur.trim() : cur); rows.push(row); row = []; cur = '';
        if (ch === '\r' && text[i + 1] === '\n') i++;
        i++; continue;
      }
      cur += ch; i++;
    }
    row.push(trim ? cur.trim() : cur); rows.push(row);
    if (!headers) return rows;
    const headerRow = rows.shift() || [];
    return rows.map(r => Object.fromEntries(headerRow.map((h, j) => [h || `col${j}`, r[j] ?? ''])));
  }

  /**
   * 深いマージ処理（既存のmergeDeeplyを使用）
   * @param {Object} target
   * @param {Object} source
   * @returns {Object}
   */
  static mergeDeeply(target, source) {
    // 既存の mergeDeeply 実装を前提とする
    return mergeDeeply(target, source);
  }

  static defaults = {
    schemaDef: '{"dbName":"","note":"","tableDef":{},"tableMap":{},"custom":{}}',
    tableDef: '{"def":"","data":[],"note":"","primaryKey":[],"unique":[],"colDef":[],"top":1,"left":1,"startingRowNumber":2,"name":"","header":[],"colMap":{}}',
    columnDef: '{"name":"","seq":0,"note":"","label":"","type":"string","alias":[],"default":null,"printf":null}'
  };
}
