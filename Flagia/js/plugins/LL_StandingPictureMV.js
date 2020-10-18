//=============================================================================
// RPGツクールMV - LL_StandingPictureMV.js
//=============================================================================

/*:
 * @target MV
 * @plugindesc メッセージウィンドウ表示時に立ち絵を自動表示します。
 * @author ルルの教会
 * @url https://nine-yusha.com/plugin-spicture/
 *
 * @help LL_StandingPictureMV.js
 *
 * メッセージ内に専用の制御文字を入力することで、
 * 立ち絵を自動表示できます。
 *
 * 専用制御文字:
 * 　\F[n]   立ち絵n番を表示します。 【入力例】\F[1]
 * 　\M[s]　 立ち絵モーションsを再生します。 【入力例】\M[yes]
 * 　\FF[n]　二枚目の立ち絵n番を表示します。
 * 　\MM[s]　二枚目の立ち絵モーションsを再生します。
 * 　\AA[n]　立ち絵n枚目を明るくし、もう一方を暗く表示します。
 *
 * 立ち絵モーション一覧:
 * 　yes(頷く)、yesyes(二回頷く)、no(横に揺れる)、noslow(ゆっくり横に揺れる)
 * 　jump(跳ねる)、jumpjump(二回跳ねる)、jumploop(跳ね続ける)
 * 　shake(ガクガク)、shakeloop(ガクガクし続ける)
 * 　runleft(画面左へ走り去る)、runright(画面右へ走り去る)
 *
 * プラグインコマンド:
 * 　LL_StandingPictureMV setEnabled true       # 立ち絵を表示に設定します。
 * 　LL_StandingPictureMV setEnabled false      # 立ち絵を非表示に設定します。
 * 　LL_StandingPictureMV setTone 68,-34,-34,0  # 立ち絵の色調を夕暮れに変更します。
 * 　LL_StandingPictureMV setTone -68,-68,68,0  # 立ち絵の色調を夜に変更します。
 * 　LL_StandingPictureMV setTone 0,0,0,255     # 立ち絵の色調を白黒に変更します。
 * 　LL_StandingPictureMV setTone 0,0,0,0       # 立ち絵の色調を通常に戻します。
 *
 * 作者: ルルの教会
 * 作成日: 2020/9/11
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
 * @param transition
 * @text 切替効果 (立ち絵1)
 * @desc 立ち絵1(F)が表示されるときの切替効果を指定できます。
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
 *
 * @param transition2
 * @text 切替効果 (立ち絵2)
 * @desc 立ち絵2(FF)が表示されるときの切替効果を指定できます。
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
 * @require 1
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
 * @text X座標 (立ち絵1)
 * @desc 立ち絵1(F)で呼び出された時の表示位置(X)です。
 * @default 464
 * @type number
 *
 * @param y
 * @text Y座標 (立ち絵1)
 * @desc 立ち絵1(F)で呼び出された時の表示位置(Y)です。
 * @default 96
 * @type number
 *
 * @param x2
 * @text X座標 (立ち絵2)
 * @desc 立ち絵2(FF)で呼び出された時の表示位置(X)です。
 * @default 20
 * @type number
 *
 * @param y2
 * @text Y座標 (立ち絵2)
 * @desc 立ち絵2(FF)で呼び出された時の表示位置(Y)です。
 * @default 96
 * @type number
 *
 * @param reverse
 * @text 立ち絵2の左右反転
 * @desc 立ち絵2(FF)で呼び出された時の表示方法です。
 * @default 1
 * @type select
 * @option 左右反転しない
 * @value 1
 * @option 左右反転する
 * @value -1
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
	const pluginName = "LL_StandingPictureMV";

	const parameters = PluginManager.parameters(pluginName);
	const transition = Number(parameters["transition"] || 1);
	const transition2 = Number(parameters["transition2"] || 1);
	const sPictures = JSON.parse(parameters["sPictures"] || []);
	let sPictureLists = [];
	sPictures.forEach((elm) => {
		sPictureLists.push(JSON.parse(elm));
	});

	//-----------------------------------------------------------------------------
	// PluginCommand (for MV)
    //

    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === pluginName) {
            switch (args[0]) {
				case 'setEnabled':
					const enabled = eval(args[1] || "true");
					$gameSystem._StandingPictureDisabled = !enabled;
					break;
				case 'setTone':
					const setTone = args[1].split(',');
					const pictureTone = [Number(setTone[0]), Number(setTone[1]), Number(setTone[2]), Number(setTone[3])];
					$gameSystem._StandingPictureTone = pictureTone;
					break;
            }
        }
	};

	// 独自変数定義
	let animationCount = 0;
	let spriteSPicture = null;
	let showSPicture = false;
	let refSPicture = false;
	let motionSPicture = "";
	let animationCount2 = 0;
	let spriteSPicture2 = null;
	let showSPicture2 = false;
	let refSPicture2 = false;
	let motionSPicture2 = "";
	let focusSPicture = null;

	// アニメーションフレーム数定義
	const animationFrame = {
		"yes":       24,
		"yesyes":    48,
		"no":        24,
		"noslow":    48,
		"jump":      24,
		"jumpjump":  48,
		"jumploop":  48,
		"shake":     1,
		"shakeloop": 1,
		"runleft":   1,
		"runright":  1,
		"none":      0
	};

	//-----------------------------------------------------------------------------
	// ExStandingPicture
	//
	// 立ち絵を表示する独自のクラスを追加定義します。

	class ExStandingPicture {

		static create (elm) {
			// 立ち絵1
			elm._spSprite = new Sprite();
			elm._spSprite.bitmap = null;
			elm._spSprite.opacity = 0;
			elm._spSprite.opening = false;
			elm._spSprite.closing = false;
			// 立ち絵2
			elm._spSprite2 = new Sprite();
			elm._spSprite2.bitmap = null;
			elm._spSprite2.opacity = 0;
			elm._spSprite2.opening = false;
			elm._spSprite2.closing = false;
			// 重なり順を指定
			elm.addChild(elm._spSprite2);
			elm.addChild(elm._spSprite);
		}

		static update (elm) {
			// 立ち絵を非表示に設定している場合、処理を中断
			if ($gameSystem._StandingPictureDisabled) {
				elm._spSprite.opacity = 0;
				elm._spSprite2.opacity = 0;
				return;
			}
			// 立ち絵1ピクチャ作成
			if (spriteSPicture && refSPicture) {
				this.refresh(elm._spSprite, spriteSPicture, 1);
				refSPicture = false;
			}
			// 立ち絵2ピクチャ作成
			if (spriteSPicture2 && refSPicture2) {
				this.refresh(elm._spSprite2, spriteSPicture2, 2);
				refSPicture2 = false;
			}

			// フォーカス処理
			if (focusSPicture == 1) {
				elm._spSprite2.setColorTone([
					$gameSystem._StandingPictureTone ? $gameSystem._StandingPictureTone[0] - 96 : -96,
					$gameSystem._StandingPictureTone ? $gameSystem._StandingPictureTone[1] - 96 : -96,
					$gameSystem._StandingPictureTone ? $gameSystem._StandingPictureTone[2] - 96 : -96,
					$gameSystem._StandingPictureTone ? $gameSystem._StandingPictureTone[3] : 0
				]);
			} else if (focusSPicture == 2) {
				elm._spSprite.setColorTone([
					$gameSystem._StandingPictureTone ? $gameSystem._StandingPictureTone[0] - 96 : -96,
					$gameSystem._StandingPictureTone ? $gameSystem._StandingPictureTone[1] - 96 : -96,
					$gameSystem._StandingPictureTone ? $gameSystem._StandingPictureTone[2] - 96 : -96,
					$gameSystem._StandingPictureTone ? $gameSystem._StandingPictureTone[3] : 0
				]);
			}

			// フェード処理
			if (showSPicture) {
				this.fadeIn(elm._spSprite, spriteSPicture, 1);
			} else {
				this.fadeOut(elm._spSprite, spriteSPicture, 1);
			}
			if (showSPicture2) {
				this.fadeIn(elm._spSprite2, spriteSPicture2, 2);
			} else {
				this.fadeOut(elm._spSprite2, spriteSPicture2, 2);
			}

			// 立ち絵モーション再生
			if (!elm._spSprite.opening && !elm._spSprite.closing && animationCount > 0) {
				animationCount = this.animation(elm._spSprite, motionSPicture, animationCount);
			}
			if (!elm._spSprite2.opening && !elm._spSprite2.closing && animationCount2 > 0) {
				animationCount2 = this.animation(elm._spSprite2, motionSPicture2, animationCount2);
			}

			//console.log("[1] x:" + elm._spSprite.x + " y:" + elm._spSprite.y + " opacity:" + elm._spSprite.opacity + " motion: " + motionSPicture + " opening: " + elm._spSprite.opening + " closing: " + elm._spSprite.closing + " scaleX: " + elm._spSprite.scale.x);
			//console.log("[2] x:" + elm._spSprite2.x + " y:" + elm._spSprite2.y + " opacity:" + elm._spSprite2.opacity + " motion: " + motionSPicture2 + " opening: " + elm._spSprite2.opening + " closing: " + elm._spSprite2.closing + " scaleX: " + elm._spSprite2.scale.x);
		}

		static refresh (sSprite, sPicture, sNumber) {
			sSprite.bitmap = null;
			sSprite.bitmap = ImageManager.loadPicture(sPicture.imageName);
			if (Number(sPicture.origin) == 0) {
				// 原点
				if (sNumber == 1) {
					sSprite.x = Number(sPicture.x);
					sSprite.y = Number(sPicture.y);
				}
				if (sNumber == 2) {
					sSprite.x = Number(sPicture.x2);
					sSprite.y = Number(sPicture.y2);
				}
			} else {
				// 中心
				if (sNumber == 1) {
					sSprite.x = Number(sPicture.x) - sSprite.width / 2;
					sSprite.y = Number(sPicture.y) - sSprite.height / 2;
				}
				if (sNumber == 2) {
					sSprite.x = Number(sPicture.x2) - sSprite.width / 2;
					sSprite.y = Number(sPicture.y2) - sSprite.height / 2;
				}
			}
			// 切替効果
			if (sSprite.opacity == 0) {
				if (sNumber == 1) {
					if (transition == 0) sSprite.opacity = Number(sPicture.opacity);
					if (transition == 2) sSprite.x -= 30;
					if (transition == 3) sSprite.x += 30;
					if (transition == 4) sSprite.y += 30;
					if (transition == 5) sSprite.y -= 30;
				}
				if (sNumber == 2) {
					if (transition2 == 0) sSprite.opacity = Number(sPicture.opacity);
					if (transition2 == 2) sSprite.x -= 30;
					if (transition2 == 3) sSprite.x += 30;
					if (transition2 == 4) sSprite.y += 30;
					if (transition2 == 5) sSprite.y -= 30;
				}
			}
			sSprite.blendMode = Number(sPicture.blendMode);
			sSprite.setColorTone($gameSystem._StandingPictureTone ? $gameSystem._StandingPictureTone : [0, 0, 0, 0]);
			sSprite.scale.x = Number(sPicture.scaleX) / 100;
			sSprite.scale.y = Number(sPicture.scaleY) / 100;
			// 左右反転させる場合 (立ち絵2)
			if (sNumber == 2) sSprite.scale.x *= Number(sPicture.reverse);
		}

		static fadeIn (sSprite, sPicture, sNumber) {
			if (sSprite.opacity >= Number(sPicture.opacity)) {
				sSprite.opening = false;
				sSprite.opacity = Number(sPicture.opacity);
				return;
			}
			sSprite.opening = true;
			sSprite.closing = false;
			// 切替効果
			if (sNumber == 1) {
				if (sPicture.x > sSprite.x) sSprite.x += 2;
				if (sPicture.x < sSprite.x) sSprite.x -= 2;
				if (sPicture.y < sSprite.y) sSprite.y -= 2;
				if (sPicture.y > sSprite.y) sSprite.y += 2;
			}
			if (sNumber == 2) {
				if (sPicture.x2 > sSprite.x) sSprite.x += 2;
				if (sPicture.x2 < sSprite.x) sSprite.x -= 2;
				if (sPicture.y2 < sSprite.y) sSprite.y -= 2;
				if (sPicture.y2 > sSprite.y) sSprite.y += 2;
			}
			sSprite.opacity += Number(sPicture.opacity) / 15;
		}

		static fadeOut (sSprite, sPicture, sNumber) {
			if (sSprite.opacity == 0) {
				sSprite.closing = false;
				return;
			}
			sSprite.closing = true;
			if (!sPicture) {
				sSprite.opacity = 0;
				return;
			}
			sSprite.opacity -= Number(sPicture.opacity) / 15;
			// 切替効果
			if (transition == 0) sSprite.opacity = 0;
			if (sNumber == 1) {
				if (transition == 2 && sPicture.x - 30 < sSprite.x) sSprite.x -= 2;
				if (transition == 3 && sPicture.x + 30 > sSprite.x) sSprite.x += 2;
				if (transition == 4 && sPicture.y + 30 > sSprite.y) sSprite.y += 2;
				if (transition == 5 && sPicture.y - 30 < sSprite.y) sSprite.y -= 2;
			}
			if (sNumber == 2) {
				if (transition2 == 2 && sPicture.x2 - 30 < sSprite.x) sSprite.x -= 2;
				if (transition2 == 3 && sPicture.x2 + 30 > sSprite.x) sSprite.x += 2;
				if (transition2 == 4 && sPicture.y2 + 30 > sSprite.y) sSprite.y += 2;
				if (transition2 == 5 && sPicture.y2 - 30 < sSprite.y) sSprite.y -= 2;
			}
		}

		static animation (sSprite, sMotion, animationCount) {
			if (sMotion == "yes") {
				if (animationCount > 12) {
					sSprite.y += 2;
				} else {
					sSprite.y -= 2;
				}
				animationCount -= 1;
			}
			if (sMotion == "yesyes") {
				if (animationCount > 36) {
					sSprite.y += 2;
				} else if (animationCount > 24) {
					sSprite.y -= 2;
				} else if (animationCount > 12) {
					sSprite.y += 2;
				} else {
					sSprite.y -= 2;
				}
				animationCount -= 1;
			}
			if (sMotion == "no") {
				if (animationCount > 18) {
					sSprite.x += 2;
				} else if (animationCount > 6) {
					sSprite.x -= 2;
				} else {
					sSprite.x += 2;
				}
				animationCount -= 1;
			}
			if (sMotion == "noslow") {
				if (animationCount > 36) {
					sSprite.x += 1;
				} else if (animationCount > 12) {
					sSprite.x -= 1;
				} else {
					sSprite.x += 1;
				}
				animationCount -= 1;
			}
			if (sMotion == "jump") {
				if (animationCount > 12) {
					sSprite.y -= 2;
				} else {
					sSprite.y += 2;
				}
				animationCount -= 1;
			}
			if (sMotion == "jumpjump") {
				if (animationCount > 36) {
					sSprite.y -= 2;
				} else if (animationCount > 24) {
					sSprite.y += 2;
				} else if (animationCount > 12) {
					sSprite.y -= 2;
				} else {
					sSprite.y += 2;
				}
				animationCount -= 1;
			}
			if (sMotion == "jumploop") {
				if (animationCount > 36) {
					sSprite.y -= 2;
				} else if (animationCount > 24) {
					sSprite.y += 2;
				}
				animationCount -= 1;
				if (animationCount == 0) animationCount = 48;
			}
			if (sMotion == "shake") {
				if (animationCount <= 2) {
					sSprite.x -= 2;
					animationCount += 1;
				} else if (animationCount <= 4) {
					sSprite.y -= 2;
					animationCount += 1;
				} else if (animationCount <= 6) {
					sSprite.x += 4;
					sSprite.y += 4;
					animationCount += 1;
				} else if (animationCount <= 8) {
					sSprite.y -= 2;
					animationCount += 1;
				} else if (animationCount == 9) {
					sSprite.x -= 2;
					animationCount += 1;
				} else if (animationCount == 10) {
					sSprite.x -= 2;
					animationCount = 0;
				}
			}
			if (sMotion == "shakeloop") {
				if (animationCount <= 2) {
					sSprite.x -= 1;
					animationCount += 1;
				} else if (animationCount <= 4) {
					sSprite.y -= 1;
					animationCount += 1;
				} else if (animationCount <= 6) {
					sSprite.x += 2;
					sSprite.y += 2;
					animationCount += 1;
				} else if (animationCount <= 8) {
					sSprite.y -= 1;
					animationCount += 1;
				} else if (animationCount <= 10) {
					sSprite.x -= 1;
					animationCount += 1;
				}
				if (animationCount > 10) animationCount = 1;
			}
			if (sMotion == "runleft") {
				sSprite.x -= 16;
				if (sSprite.x < -2000) animationCount = 0;
			}
			if (sMotion == "runright") {
				sSprite.x += 16;
				if (sSprite.x > 2000) animationCount = 0;
			}
			return animationCount;
		}
	}

	const _Scene_Map_update = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function() {
		_Scene_Map_update.apply(this, arguments);
		ExStandingPicture.update(this);
	};

	const _Scene_Map_createSpriteset = Scene_Map.prototype.createSpriteset;
	Scene_Map.prototype.createSpriteset = function() {
		_Scene_Map_createSpriteset.apply(this, arguments);
		ExStandingPicture.create(this);
	};

	const _Scene_Battle_update = Scene_Battle.prototype.update;
	Scene_Battle.prototype.update = function() {
		_Scene_Battle_update.apply(this, arguments);
		ExStandingPicture.update(this);
	};

	const _Scene_Battle_createSpriteset = Scene_Battle.prototype.createSpriteset;
	Scene_Battle.prototype.createSpriteset = function() {
		_Scene_Battle_createSpriteset.apply(this, arguments);
		ExStandingPicture.create(this);
	};

	const _Window_Message_updateClose = Window_Message.prototype.updateClose;
	Window_Message.prototype.updateClose = function() {
		// ピクチャ消去判定
		if (this._closing && this.openness == 255) {
			showSPicture = false;
			showSPicture2 = false;
			motionSPicture = "";
			motionSPicture2 = "";
	    }
		_Window_Message_updateClose.apply(this, arguments);
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
		// 専用制御文字を取得 (\FF[n])
		let sPictureNumber2 = null;
		processEscapeNumber = $gameMessage.allText().match(/\\FF\[(\d+)\]/);
		if (processEscapeNumber) {
			if (processEscapeNumber[1]) {
				sPictureNumber2 = processEscapeNumber[1];
			}
		}
		// 専用制御文字を取得 (\M[s])
		let sPictureMotion = null;
		processEscapeNumber = $gameMessage.allText().match(/\\M\[(\w+)\]/);
		if (processEscapeNumber) {
			if (processEscapeNumber[1]) {
				sPictureMotion = processEscapeNumber[1];
			}
		}
		// 専用制御文字を取得 (\MM[s])
		let sPictureMotion2 = null;
		processEscapeNumber = $gameMessage.allText().match(/\\MM\[(\w+)\]/);
		if (processEscapeNumber) {
			if (processEscapeNumber[1]) {
				sPictureMotion2 = processEscapeNumber[1];
			}
		}
		// 専用制御文字を取得 (\AA[n])
		focusSPicture = null;
		processEscapeNumber = $gameMessage.allText().match(/\\AA\[(\d+)\]/);
		if (processEscapeNumber) {
			if (processEscapeNumber[1]) {
				focusSPicture = processEscapeNumber[1];
			}
		}
		// 立ち絵1を更新
		if (sPictureNumber) {
			let sPicture = sPictureLists.find(function(item, index) {
				if (parseInt(item.id) == sPictureNumber) return true;
			});
			spriteSPicture = sPicture;
			// spriteSPicture = JSON.stringify(sPicture);
			// spriteSPicture = JSON.parse(spriteSPicture);
			if (sPicture) {
				showSPicture = true;
				refSPicture = true;
			} else {
				showSPicture = false;
				refSPicture = false;
			}
			// 再生モーション定義
			motionSPicture = sPictureMotion ? sPictureMotion : "none";
			animationCount = animationFrame[motionSPicture];
		} else {
			showSPicture = false;
			motionSPicture = "";
		}
		// 立ち絵2を更新
		if (sPictureNumber2) {
			let sPicture2 = sPictureLists.find(function(item, index) {
				if (parseInt(item.id) == sPictureNumber2) return true;
			});
			spriteSPicture2 = sPicture2;
			// spriteSPicture2 = JSON.stringify(sPicture2);
			// spriteSPicture2 = JSON.parse(spriteSPicture2);
			if (sPicture2) {
				showSPicture2 = true;
				refSPicture2 = true;
			} else {
				showSPicture2 = false;
				refSPicture2 = false;
			}
			// 再生モーション定義
			motionSPicture2 = sPictureMotion2 ? sPictureMotion2 : "none";
			animationCount2 = animationFrame[motionSPicture2];
		} else {
			showSPicture2 = false;
			motionSPicture2 = "";
		}

		_Window_Message_startMessage.apply(this, arguments);
	};

	const _Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
	Window_Base.prototype.convertEscapeCharacters = function(text) {
		// 立ち絵呼び出し用の制御文字を追加
		text = text.replace(/\\F\[(\d+)\]/gi, "");
		text = text.replace(/\\FF\[(\d+)\]/gi, "");
		text = text.replace(/\\M\[(\w+)\]/gi, "");
		text = text.replace(/\\MM\[(\w+)\]/gi, "");
		text = text.replace(/\\AA\[(\d+)\]/gi, "");

		return _Window_Base_convertEscapeCharacters.call(this, text);
	};
})();
