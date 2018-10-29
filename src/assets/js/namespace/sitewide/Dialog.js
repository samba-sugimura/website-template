/**
 * A11yに対応したダイアログ（モーダル）です。
 * 複数のダイアログを使う場合は`data-a11y-dialog-show="sw-Dialog1"`とid="sw-Dialog1"の値を
 * `sw-Dialog2`や`sw-Dialog3`のように連番で指定してください。
 * https://github.com/edenspiekermann/a11y-dialog
 * 例：
 * <div id="main">
 *   <button class="sw-Dialog_Link" data-a11y-dialog-show="sw-Dialog1">ダイアログを開く</button>
 * </div>
 *
 * <div class="sw-Dialog_Dialog" id="sw-Dialog1">
 *   <div class="sw-Dialog_Overlay" tabindex="-1" data-a11y-dialog-hide></div>
 *   <dialog class="sw-Dialog_Content" role="dialog" aria-labelledby="dialog-title" aria-describedby="dialogDescription">
 *     <div class="sw-Dialog_Inner">
 *       <div class="sw-Dialog_Head">
 *         <button class="sw-Dialog_Close" type="button" data-a11y-dialog-hide="data-a11y-dialog-hide" aria-label="この画面を閉じる">
 *           <svg role="img" class="sw-Dialog_CloseIcon">
 *             <use xlink:href="/assets/svg/sprite.svg#close1"></use>
 *           </svg>
 *         </button>
 *       </div>
 *       <div class="sw-Dialog_Body">
 *         <h3 id="dialog-title">ダイアログ1のタイトル</h3>
 *         <p id="dialogDescription">ダイアログ1の概要</p>
 *         <p><code>aria-labelledby</code>と<code>aria-describedby</code>で、タイアログのタイトルと概要を紐づけています。</p>
 *       </div>
 *     </div>
 *   </dialog>
 * </div>
 */
import A11yDialog from 'a11y-dialog';
import {scrollingElement} from '../../util';
export default function swDialog() {
  const Selector = {
    BASE_NAME: 'sw-Dialog', // IDとカスタムデータ属性値で使用する名前。
    FIXED_CLASS: 'sw-Dialog_Fixed', // 画面を固定するときに指定するクラス名。
    CONTAINER_ID: 'main' // メインコンテンツのID名。ダイアログはこのID要素と兄弟関係にする。
  };

  const container = document.getElementById(Selector.CONTAINER_ID);
  // `baseName`+1桁以上の連番。
  const regexp = new RegExp(`${Selector.BASE_NAME}[0-9]{1,}`);
  const allSelector = document.querySelectorAll(`[data-a11y-dialog-show*=${Selector.BASE_NAME}]`);
  const html = document.getElementsByTagName('html')[0];
  const body = document.getElementsByTagName('body')[0];
  const scrollElement = scrollingElement();
  // ダイアログを開く直前のスクロール位置。
  let openBeforeLocation = 0;
  let targets = [];

  // 該当する要素のクラス名を`targets`に格納する。
  for (const selector of allSelector) {
    const attributeName = selector.getAttribute('data-a11y-dialog-show');
    const itemName = attributeName.match(regexp)[0];
    targets.push(itemName);
  }

  for (const target of targets) {
    // 該当する要素のIDを渡してインスタンス化する。
    const targetID = document.getElementById(target);
    const targetName = new A11yDialog(targetID, container);

    // ダイアログを表示したときは画面を固定する。
    targetName.on('show', function (dialogEl, event) {
      openBeforeLocation = window.pageYOffset;
      html.classList.add(Selector.FIXED_CLASS);
      body.classList.add(Selector.FIXED_CLASS);
    });

    // ダイアログを非表示にしたときは画面の固定を解除して、スクロール位置を戻す。
    targetName.on('hide', function (dialogEl, event) {
      html.classList.remove(Selector.FIXED_CLASS);
      body.classList.remove(Selector.FIXED_CLASS);
      scrollElement.scrollTop = openBeforeLocation;
    });
  }

};