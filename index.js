const puppeteer = require('puppeteer');
const config = require('./config.json');

const SAVE_MODE = true;
const HEADLESS_MODE = false;

const waitUntilDocumentLoadedOption = { waitUntil: "domcontentloaded" };

const data = [];



// データ追加
[...Array(5)].forEach((_, i) => {
  // 2桁数字で連番を作る
  const num = (i + 1).toString().padStart(2, '0');
  data.push({
    obj_type: 'entry',
    name: `テキスト{num}`,
    description: `ID: _txt${num}`,
    type: 'textarea',
    basename: `txt${num}` // tagnameと共通
  })
});


(async()=>{

  const option = {};

  if (HEADLESS_MODE) {
    option.slowMo = 10;
    option.headless = false
  }

  const browser = await puppeteer.launch(option);
  const page = await browser.newPage();
  await page.authenticate(config.basic_auth);
  await page.goto(config.login_url, waitUntilDocumentLoadedOption);
  await page.type("#username", config.mt_auth.username);
  await page.type("#password", config.mt_auth.password);

  page.click('#sign-in-button');
  //ページ遷移完了を待つ
  await page.waitForNavigation({timeout: 60000, waitUntil: "domcontentloaded"});

  //ログイン完了

  // CF作成
  for(targ of data){
    // 新規作成ページへ遷移
    await page.goto(config.repeat_page_url, waitUntilDocumentLoadedOption);

    //各種入力
    await page.select('#obj_type', targ.obj_type);
    await page.type("#name", targ.name);
    await page.type("#description", targ.description);
    await page.select('#type', targ.type);
    await page.evaluate(function() {
      // 初期値が入っている場合があるのでクリア
      document.querySelector('#basename').value = '';
      document.querySelector('#tag').value = '';
    })
    await page.type("#basename", targ.basename);
    await page.type("#tag", targ.basename);

    if(SAVE_MODE){
      // 保存ボタンをクリック
      await page.click('button.save[type="submit"]');
      await page.waitFor('.msg-success', {timeout: 120000});
    } else {
      await page.waitFor(1000);
    }

    console.log(`COMPLETE: ${targ.name}`);
  }

  // 一覧表示、スクショ作成
  await page.goto(config.result_page_url, waitUntilDocumentLoadedOption);
  await page.waitFor('tbody.ui-selectable tr', {timeout: 120000});
  await page.screenshot({path: 'screenshot.png'});

  await browser.close();
})();
