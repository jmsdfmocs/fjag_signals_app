//=============================================================================
// RPGツクールMZ - LL_StandingPicture.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc メッセージウィンドウ表示時に立ち絵を自動表示します。
 * @author ルルの教会
 * @url https://nine-yusha.com/plugin
 *
 * @help LL_StandingPicture.js
 *
 * メッセージ内に専用の制御文字を入力することで、
 * 立ち絵を自動表示できます。
 * 
 * 専用制御文字: \F[n]  立ち絵n番を表示します。
 * 
 * プラグインコマンド:
 * 　立ち絵表示ON・OFF: 立ち絵の表示・非表示を一括制御します。
 * 　色調変更: 立ち絵の色調を変更します。
 * 
 * 作者: ルルの教会
 * 作成日: 2020/9/5
 * 
 * このプラグインはMITライセンスで配布します。
 * ご自由にお使いくださいませ。
 * https://opensource.org/licenses/mit-license.php
 *
 * @command setEnabled
 * @text 立ち絵表示ON・OFF
 * @desc 立ち絵の表示・非表示を一括制御します。
 *
 * @arg enabled
 * @text 立ち絵表示
 * @desc OFFにすると立ち絵が表示されなくなります。
  *@default true
 * @type boolean
 *
 * @command setTone
 * @text 色調変更
 * @desc 立ち絵の色調を変更します。
 *
 * @arg toneR
 * @text 赤
 * @desc 色調のR成分です。 (-255～255)
 * @default 0
 * @type number
 * @min -255
 * @max 255
 * 
 * @arg toneG
 * @text 緑
 * @desc 色調のG成分です。 (-255～255)
 * @default 0
 * @type number
 * @min -255
 * @max 255
 * 
 * @arg toneB
 * @text 青
 * @desc 色調のB成分です。 (-255～255)
 * @default 0
 * @type number
 * @min -255
 * @max 255
 * 
 * @arg toneC
 * @text グレー
 * @desc グレースケールの強さです。 (0～255)
 * @default 0
 * @type number
 * @min 0
 * @max 255
 * 
 * @param sPictures
 * @text 立ち絵リスト
 * @desc メッセージウィンドウに表示する立ち絵を定義します。
 * @default []
 * @type struct<sPictures>[]
 *
 * @param sPictureId
 * @text ピクチャ番号
 * @desc 立ち絵を表示するために使用するピクチャ番号です。
 * @default 50
 * @type number
 * @min 1
 * @max 100
 *
 * @param transition
 * @text 切替効果
 * @desc 立ち絵が表示されるときの切替効果を指定できます。
 * @type select
 * @default 1
 * @option なし
 * @value 0
 * @option フェード
 * @value 1
 * @option フロート左
 * @value 2
 * @option フロート右
 * @value 3
 * @option フロート下
 * @value 4
 * @option フロート上
 * @value 5
 */

/*~struct~sPictures:
 * 
 * @param id
 * @text ID
 * @desc IDです。立ち絵を制御文字で呼び出す際に使用します。
 * @type number
 *
 * @param imageName
 * @text 画像ファイル名
 * @desc 立ち絵として表示する画像ファイルを選択してください。
 * @dir img/pictures
 * @type file
 *
 * @param origin
 * @text 原点
 * @desc 立ち絵の原点です。
 * @default 0
 * @type select
 * @option 左上
 * @value 0
 * @option 中央
 * @value 1
 *
 * @param x
 * @text X座標
 * @desc 立ち絵の表示位置(X)です。
 * @default 464
 * @type number
 *
 * @param y
 * @text Y座標
 * @desc 立ち絵の表示位置(Y)です。
 * @default 96
 * @type number
 *
 * @param scaleX
 * @text X拡大率
 * @desc 立ち絵の拡大率(X)です。
 * @default 100
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param scaleY
 * @text Y拡大率
 * @desc 立ち絵の拡大率(Y)です。
 * @default 100
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param opacity
 * @text 不透明度
 * @desc 立ち絵の不透明度(0～255)です。
 * @default 255
 * @type number
 * @min 0
 * @max 255
 *
 * @param blendMode
 * @text 合成方法
 * @desc 立ち絵の合成方法です。
 * @default 0
 * @type select
 * @option 通常
 * @value 0
 * @option 加算
 * @value 1
 * @option 除算
 * @value 2
 * @option スクリーン
 * @value 3
 */

(() => {
	"use strict";
	const pluginName = "LL_StandingPicture";

	const parameters = PluginManager.parameters(pluginName);
	const sPictureId = Number(parameters['sPictureId'] || 50);
	const transition = Number(parameters['transition'] || 1);
	const sPictures = JSON.parse(parameters['sPictures'] || []);
	let sPictureLists = [];
	sPictures.forEach((elm) => {
		sPictureLists.push(JSON.parse(elm));
	});

	PluginManager.registerCommand(pluginName, "setEnabled", args => {
		const enabled = args.enabled;
		$gameSystem._StandingPictureDisabled = enabled == "false" ? true : false;
	});

	PluginManager.registerCommand(pluginName, "setTone", args => {
		const pictureTone = [Number(args.toneR), Number(args.toneG), Number(args.toneB), Number(args.toneC)];
		$gameSystem._StandingPictureTone = pictureTone;
	});	
	
	// 現在立ち絵が表示中か判定用
	let activePicture = null;

	// 切替効果定義
	let startX = 0;
	let startY = 0;
	let duration = 1;
	switch (transition) {
		case 1:  // フェード
			duration = 24;
			break;
		case 2:  // フロート左
			startX = -30;
			duration = 24;
			break;
		case 3:  // フロート右
			startX = 30;
			duration = 24;
			break;
		case 4:  // フロート下
			startY = 30;
			duration = 24;
			break;
		case 5:  // フロート上
			startY = -30;
			duration = 24;
			break;
	}

	// 立ち絵を表示
	const showStandingPicture = (picture) => {
		// 立ち絵を非表示に設定している場合、処理を中断
		if ($gameSystem._StandingPictureDisabled) {
			return;
		}
		// 表示する立ち絵の情報を取得
		let pictureName = String(picture.imageName);
		let origin = Number(picture.origin);
		let x = Number(picture.x);
		let y = Number(picture.y);
		let scaleX = Number(picture.scaleX);
		let scaleY = Number(picture.scaleY);
		let opacity = Number(picture.opacity);
		let blendMode = Number(picture.blendMode);
		let pictureTone = $gameSystem._StandingPictureTone ? $gameSystem._StandingPictureTone : [0, 0, 0, 0];
		// 画像ファイル存在チェック
		let picturePath = 'img/pictures/' + pictureName + '.png';
		let img = new Image();
		img.onload = function() {
			// ピクチャ表示
			if (!activePicture) {
				$gameScreen.showPicture(sPictureId, pictureName, origin, x + startX, y + startY, scaleX, scaleY, 0, blendMode);
				$gameScreen.tintPicture(sPictureId, pictureTone, 0);
				$gameScreen.movePicture(sPictureId, origin, x, y, scaleX, scaleY, opacity, blendMode, duration, 0);
			} else {
				$gameScreen.showPicture(sPictureId, pictureName, origin, x, y, scaleX, scaleY, opacity, blendMode);
				$gameScreen.tintPicture(sPictureId, pictureTone, 0);
			}
			activePicture = picture;
		}
		img.onerror = function() {
			//console.log('LL_StandingPicture: 画像ファイルの読み込みに失敗');
			hideStandingPicture();
		}
		img.src = picturePath;
	};

	// 立ち絵を消去
	const hideStandingPicture = () => {
		// 立ち絵を非表示に設定している場合、処理を中断
		if ($gameSystem._StandingPictureDisabled) {
			//return;
		}
		// ピクチャ消去
		if (activePicture) {
			$gameScreen.movePicture(sPictureId, Number(activePicture.origin), Number(activePicture.x) + startX, Number(activePicture.y) + startY, Number(activePicture.scaleX), Number(activePicture.scaleY), 0, Number(activePicture.blendMode), duration, 0);
			activePicture= null;
		}
	};

	Window_Message.prototype.updateClose = function() {		
	    if (this._closing) {
	    	// ピクチャ削除判定
			if (this.openness == 255) {
	    		// ピクチャ消去
				hideStandingPicture();
	    	}	    	
	        this.openness -= 32;
	        if (this.isClosed()) {
	            this._closing = false;
	        }
	    }
	};

	const _Window_Message_startMessage = Window_Message.prototype.startMessage;
	Window_Message.prototype.startMessage = function() {
		// 専用制御文字を取得 (\F[n])
		let sPictureNumber = null;
		let processEscapeNumber = $gameMessage.allText().match(/\\F\[(\d+)\]/);
		if (processEscapeNumber) {
			if (processEscapeNumber[1]) {
				sPictureNumber = processEscapeNumber[1];
			}
		}
		// 立ち絵を更新
		if (sPictureNumber) {
			let sPicture = sPictureLists.filter(function(item, index) {
				if (parseInt(item.id) == sPictureNumber) return true;
			});
			if (sPicture[0]) {
				showStandingPicture(sPicture[0]);
			} else {
				hideStandingPicture();
			}
		} else {
			hideStandingPicture();
		}
		
		_Window_Message_startMessage.apply(this, arguments);
	};

	Window_Base.prototype.convertEscapeCharacters = function(text) {
		/* eslint no-control-regex: 0 */
		text = text.replace(/\\/g, "\x1b");
		text = text.replace(/\x1b\x1b/g, "\\");
		text = text.replace(/\x1bV\[(\d+)\]/gi, (_, p1) =>
			$gameVariables.value(parseInt(p1))
		);
		text = text.replace(/\x1bV\[(\d+)\]/gi, (_, p1) =>
			$gameVariables.value(parseInt(p1))
		);
		text = text.replace(/\x1bN\[(\d+)\]/gi, (_, p1) =>
			this.actorName(parseInt(p1))
		);
		text = text.replace(/\x1bP\[(\d+)\]/gi, (_, p1) =>
			this.partyMemberName(parseInt(p1))
		);
		text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
		// 立ち絵呼び出し用の制御文字を追加 F[n]
		text = text.replace(/\x1bF\[(\d+)\]/gi, (_, p1) =>
			''
		);
		return text;
	};
})();
