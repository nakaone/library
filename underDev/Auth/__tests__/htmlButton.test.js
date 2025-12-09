/**
 * @jest-environment jsdom
 */

//import fs from "fs";
//import path from "path";
const fs = require("fs");
const path = require("path");

describe("HTML button test", () => {
  let html;

  beforeEach(() => {
    // HTML を読み込み
    html = fs.readFileSync(
      path.resolve(__dirname, "../deploy/index.html"),
      "utf8"
    );

    // JSDOM に流し込む
    document.documentElement.innerHTML = html;

    // script タグを JSDOM では自動実行しないため、
    // <script> 中身を抽出して順に評価する
    const dom = new DOMParser().parseFromString(html, "text/html");
    const scripts = dom.querySelectorAll("script");

    scripts.forEach((s) => {
      if (s.textContent.trim()) {
        eval(s.textContent); // ここで devTools, authClient, localFunc などが定義される
      }
    });

    // DOMContentLoaded を手動で発火
    document.dispatchEvent(new Event("DOMContentLoaded"));
  });

  test("「テスト」ボタンをクリックすると localFunc → auth.exec が呼ばれる", () => {
    // console.log をモック
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    // ボタンを取得
    const btn = document.querySelector("button");
    expect(btn).not.toBeNull();

    // ボタンクリック
    btn.click();

    // auth.exec('abc') がログ出力する内容を確認
    const calls = logSpy.mock.calls.flat().join("");

    expect(calls).toContain("localFunc abc");

    // 後始末
    logSpy.mockRestore();
  });
});
