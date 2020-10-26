(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[65],{

/***/ "dfh3":
/*!***********************************************!*\
  !*** ./node_modules/codemirror/keymap/vim.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

/**
 * Supported keybindings:
 *   Too many to list. Refer to defaultKeymap below.
 *
 * Supported Ex commands:
 *   Refer to defaultExCommandMap below.
 *
 * Registers: unnamed, -, a-z, A-Z, 0-9
 *   (Does not respect the special case for number registers when delete
 *    operator is made with these commands: %, (, ),  , /, ?, n, N, {, } )
 *   TODO: Implement the remaining registers.
 *
 * Marks: a-z, A-Z, and 0-9
 *   TODO: Implement the remaining special marks. They have more complex
 *       behavior.
 *
 * Events:
 *  'vim-mode-change' - raised on the editor anytime the current mode changes,
 *                      Event object: {mode: "visual", subMode: "linewise"}
 *
 * Code structure:
 *  1. Default keymap
 *  2. Variable declarations and short basic helpers
 *  3. Instance (External API) implementation
 *  4. Internal state tracking objects (input state, counter) implementation
 *     and instantiation
 *  5. Key handler (the main command dispatcher) implementation
 *  6. Motion, operator, and action implementations
 *  7. Helper functions for the key handler, motions, operators, and actions
 *  8. Set up Vim to work as a keymap for CodeMirror.
 *  9. Ex command implementations.
 */

(function(mod) {
  if (true) // CommonJS
    mod(__webpack_require__(/*! ../lib/codemirror */ "VrN/"), __webpack_require__(/*! ../addon/search/searchcursor */ "uTOq"), __webpack_require__(/*! ../addon/dialog/dialog */ "Ku0u"), __webpack_require__(/*! ../addon/edit/matchbrackets.js */ "jDMi"));
  else {}
})(function(CodeMirror) {
  'use strict';

  var defaultKeymap = [
    // Key to key mapping. This goes first to make it possible to override
    // existing mappings.
    { keys: '<Left>', type: 'keyToKey', toKeys: 'h' },
    { keys: '<Right>', type: 'keyToKey', toKeys: 'l' },
    { keys: '<Up>', type: 'keyToKey', toKeys: 'k' },
    { keys: '<Down>', type: 'keyToKey', toKeys: 'j' },
    { keys: '<Space>', type: 'keyToKey', toKeys: 'l' },
    { keys: '<BS>', type: 'keyToKey', toKeys: 'h', context: 'normal'},
    { keys: '<Del>', type: 'keyToKey', toKeys: 'x', context: 'normal'},
    { keys: '<C-Space>', type: 'keyToKey', toKeys: 'W' },
    { keys: '<C-BS>', type: 'keyToKey', toKeys: 'B', context: 'normal' },
    { keys: '<S-Space>', type: 'keyToKey', toKeys: 'w' },
    { keys: '<S-BS>', type: 'keyToKey', toKeys: 'b', context: 'normal' },
    { keys: '<C-n>', type: 'keyToKey', toKeys: 'j' },
    { keys: '<C-p>', type: 'keyToKey', toKeys: 'k' },
    { keys: '<C-[>', type: 'keyToKey', toKeys: '<Esc>' },
    { keys: '<C-c>', type: 'keyToKey', toKeys: '<Esc>' },
    { keys: '<C-[>', type: 'keyToKey', toKeys: '<Esc>', context: 'insert' },
    { keys: '<C-c>', type: 'keyToKey', toKeys: '<Esc>', context: 'insert' },
    { keys: 's', type: 'keyToKey', toKeys: 'cl', context: 'normal' },
    { keys: 's', type: 'keyToKey', toKeys: 'c', context: 'visual'},
    { keys: 'S', type: 'keyToKey', toKeys: 'cc', context: 'normal' },
    { keys: 'S', type: 'keyToKey', toKeys: 'VdO', context: 'visual' },
    { keys: '<Home>', type: 'keyToKey', toKeys: '0' },
    { keys: '<End>', type: 'keyToKey', toKeys: '$' },
    { keys: '<PageUp>', type: 'keyToKey', toKeys: '<C-b>' },
    { keys: '<PageDown>', type: 'keyToKey', toKeys: '<C-f>' },
    { keys: '<CR>', type: 'keyToKey', toKeys: 'j^', context: 'normal' },
    { keys: '<Ins>', type: 'action', action: 'toggleOverwrite', context: 'insert' },
    // Motions
    { keys: 'H', type: 'motion', motion: 'moveToTopLine', motionArgs: { linewise: true, toJumplist: true }},
    { keys: 'M', type: 'motion', motion: 'moveToMiddleLine', motionArgs: { linewise: true, toJumplist: true }},
    { keys: 'L', type: 'motion', motion: 'moveToBottomLine', motionArgs: { linewise: true, toJumplist: true }},
    { keys: 'h', type: 'motion', motion: 'moveByCharacters', motionArgs: { forward: false }},
    { keys: 'l', type: 'motion', motion: 'moveByCharacters', motionArgs: { forward: true }},
    { keys: 'j', type: 'motion', motion: 'moveByLines', motionArgs: { forward: true, linewise: true }},
    { keys: 'k', type: 'motion', motion: 'moveByLines', motionArgs: { forward: false, linewise: true }},
    { keys: 'gj', type: 'motion', motion: 'moveByDisplayLines', motionArgs: { forward: true }},
    { keys: 'gk', type: 'motion', motion: 'moveByDisplayLines', motionArgs: { forward: false }},
    { keys: 'w', type: 'motion', motion: 'moveByWords', motionArgs: { forward: true, wordEnd: false }},
    { keys: 'W', type: 'motion', motion: 'moveByWords', motionArgs: { forward: true, wordEnd: false, bigWord: true }},
    { keys: 'e', type: 'motion', motion: 'moveByWords', motionArgs: { forward: true, wordEnd: true, inclusive: true }},
    { keys: 'E', type: 'motion', motion: 'moveByWords', motionArgs: { forward: true, wordEnd: true, bigWord: true, inclusive: true }},
    { keys: 'b', type: 'motion', motion: 'moveByWords', motionArgs: { forward: false, wordEnd: false }},
    { keys: 'B', type: 'motion', motion: 'moveByWords', motionArgs: { forward: false, wordEnd: false, bigWord: true }},
    { keys: 'ge', type: 'motion', motion: 'moveByWords', motionArgs: { forward: false, wordEnd: true, inclusive: true }},
    { keys: 'gE', type: 'motion', motion: 'moveByWords', motionArgs: { forward: false, wordEnd: true, bigWord: true, inclusive: true }},
    { keys: '{', type: 'motion', motion: 'moveByParagraph', motionArgs: { forward: false, toJumplist: true }},
    { keys: '}', type: 'motion', motion: 'moveByParagraph', motionArgs: { forward: true, toJumplist: true }},
    { keys: '(', type: 'motion', motion: 'moveBySentence', motionArgs: { forward: false }},
    { keys: ')', type: 'motion', motion: 'moveBySentence', motionArgs: { forward: true }},
    { keys: '<C-f>', type: 'motion', motion: 'moveByPage', motionArgs: { forward: true }},
    { keys: '<C-b>', type: 'motion', motion: 'moveByPage', motionArgs: { forward: false }},
    { keys: '<C-d>', type: 'motion', motion: 'moveByScroll', motionArgs: { forward: true, explicitRepeat: true }},
    { keys: '<C-u>', type: 'motion', motion: 'moveByScroll', motionArgs: { forward: false, explicitRepeat: true }},
    { keys: 'gg', type: 'motion', motion: 'moveToLineOrEdgeOfDocument', motionArgs: { forward: false, explicitRepeat: true, linewise: true, toJumplist: true }},
    { keys: 'G', type: 'motion', motion: 'moveToLineOrEdgeOfDocument', motionArgs: { forward: true, explicitRepeat: true, linewise: true, toJumplist: true }},
    { keys: '0', type: 'motion', motion: 'moveToStartOfLine' },
    { keys: '^', type: 'motion', motion: 'moveToFirstNonWhiteSpaceCharacter' },
    { keys: '+', type: 'motion', motion: 'moveByLines', motionArgs: { forward: true, toFirstChar:true }},
    { keys: '-', type: 'motion', motion: 'moveByLines', motionArgs: { forward: false, toFirstChar:true }},
    { keys: '_', type: 'motion', motion: 'moveByLines', motionArgs: { forward: true, toFirstChar:true, repeatOffset:-1 }},
    { keys: '$', type: 'motion', motion: 'moveToEol', motionArgs: { inclusive: true }},
    { keys: '%', type: 'motion', motion: 'moveToMatchedSymbol', motionArgs: { inclusive: true, toJumplist: true }},
    { keys: 'f<character>', type: 'motion', motion: 'moveToCharacter', motionArgs: { forward: true , inclusive: true }},
    { keys: 'F<character>', type: 'motion', motion: 'moveToCharacter', motionArgs: { forward: false }},
    { keys: 't<character>', type: 'motion', motion: 'moveTillCharacter', motionArgs: { forward: true, inclusive: true }},
    { keys: 'T<character>', type: 'motion', motion: 'moveTillCharacter', motionArgs: { forward: false }},
    { keys: ';', type: 'motion', motion: 'repeatLastCharacterSearch', motionArgs: { forward: true }},
    { keys: ',', type: 'motion', motion: 'repeatLastCharacterSearch', motionArgs: { forward: false }},
    { keys: '\'<character>', type: 'motion', motion: 'goToMark', motionArgs: {toJumplist: true, linewise: true}},
    { keys: '`<character>', type: 'motion', motion: 'goToMark', motionArgs: {toJumplist: true}},
    { keys: ']`', type: 'motion', motion: 'jumpToMark', motionArgs: { forward: true } },
    { keys: '[`', type: 'motion', motion: 'jumpToMark', motionArgs: { forward: false } },
    { keys: ']\'', type: 'motion', motion: 'jumpToMark', motionArgs: { forward: true, linewise: true } },
    { keys: '[\'', type: 'motion', motion: 'jumpToMark', motionArgs: { forward: false, linewise: true } },
    // the next two aren't motions but must come before more general motion declarations
    { keys: ']p', type: 'action', action: 'paste', isEdit: true, actionArgs: { after: true, isEdit: true, matchIndent: true}},
    { keys: '[p', type: 'action', action: 'paste', isEdit: true, actionArgs: { after: false, isEdit: true, matchIndent: true}},
    { keys: ']<character>', type: 'motion', motion: 'moveToSymbol', motionArgs: { forward: true, toJumplist: true}},
    { keys: '[<character>', type: 'motion', motion: 'moveToSymbol', motionArgs: { forward: false, toJumplist: true}},
    { keys: '|', type: 'motion', motion: 'moveToColumn'},
    { keys: 'o', type: 'motion', motion: 'moveToOtherHighlightedEnd', context:'visual'},
    { keys: 'O', type: 'motion', motion: 'moveToOtherHighlightedEnd', motionArgs: {sameLine: true}, context:'visual'},
    // Operators
    { keys: 'd', type: 'operator', operator: 'delete' },
    { keys: 'y', type: 'operator', operator: 'yank' },
    { keys: 'c', type: 'operator', operator: 'change' },
    { keys: '=', type: 'operator', operator: 'indentAuto' },
    { keys: '>', type: 'operator', operator: 'indent', operatorArgs: { indentRight: true }},
    { keys: '<', type: 'operator', operator: 'indent', operatorArgs: { indentRight: false }},
    { keys: 'g~', type: 'operator', operator: 'changeCase' },
    { keys: 'gu', type: 'operator', operator: 'changeCase', operatorArgs: {toLower: true}, isEdit: true },
    { keys: 'gU', type: 'operator', operator: 'changeCase', operatorArgs: {toLower: false}, isEdit: true },
    { keys: 'n', type: 'motion', motion: 'findNext', motionArgs: { forward: true, toJumplist: true }},
    { keys: 'N', type: 'motion', motion: 'findNext', motionArgs: { forward: false, toJumplist: true }},
    // Operator-Motion dual commands
    { keys: 'x', type: 'operatorMotion', operator: 'delete', motion: 'moveByCharacters', motionArgs: { forward: true }, operatorMotionArgs: { visualLine: false }},
    { keys: 'X', type: 'operatorMotion', operator: 'delete', motion: 'moveByCharacters', motionArgs: { forward: false }, operatorMotionArgs: { visualLine: true }},
    { keys: 'D', type: 'operatorMotion', operator: 'delete', motion: 'moveToEol', motionArgs: { inclusive: true }, context: 'normal'},
    { keys: 'D', type: 'operator', operator: 'delete', operatorArgs: { linewise: true }, context: 'visual'},
    { keys: 'Y', type: 'operatorMotion', operator: 'yank', motion: 'expandToLine', motionArgs: { linewise: true }, context: 'normal'},
    { keys: 'Y', type: 'operator', operator: 'yank', operatorArgs: { linewise: true }, context: 'visual'},
    { keys: 'C', type: 'operatorMotion', operator: 'change', motion: 'moveToEol', motionArgs: { inclusive: true }, context: 'normal'},
    { keys: 'C', type: 'operator', operator: 'change', operatorArgs: { linewise: true }, context: 'visual'},
    { keys: '~', type: 'operatorMotion', operator: 'changeCase', motion: 'moveByCharacters', motionArgs: { forward: true }, operatorArgs: { shouldMoveCursor: true }, context: 'normal'},
    { keys: '~', type: 'operator', operator: 'changeCase', context: 'visual'},
    { keys: '<C-w>', type: 'operatorMotion', operator: 'delete', motion: 'moveByWords', motionArgs: { forward: false, wordEnd: false }, context: 'insert' },
    //ignore C-w in normal mode
    { keys: '<C-w>', type: 'idle', context: 'normal' },
    // Actions
    { keys: '<C-i>', type: 'action', action: 'jumpListWalk', actionArgs: { forward: true }},
    { keys: '<C-o>', type: 'action', action: 'jumpListWalk', actionArgs: { forward: false }},
    { keys: '<C-e>', type: 'action', action: 'scroll', actionArgs: { forward: true, linewise: true }},
    { keys: '<C-y>', type: 'action', action: 'scroll', actionArgs: { forward: false, linewise: true }},
    { keys: 'a', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'charAfter' }, context: 'normal' },
    { keys: 'A', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'eol' }, context: 'normal' },
    { keys: 'A', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'endOfSelectedArea' }, context: 'visual' },
    { keys: 'i', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'inplace' }, context: 'normal' },
    { keys: 'gi', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'lastEdit' }, context: 'normal' },
    { keys: 'I', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'firstNonBlank'}, context: 'normal' },
    { keys: 'gI', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'bol'}, context: 'normal' },
    { keys: 'I', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'startOfSelectedArea' }, context: 'visual' },
    { keys: 'o', type: 'action', action: 'newLineAndEnterInsertMode', isEdit: true, interlaceInsertRepeat: true, actionArgs: { after: true }, context: 'normal' },
    { keys: 'O', type: 'action', action: 'newLineAndEnterInsertMode', isEdit: true, interlaceInsertRepeat: true, actionArgs: { after: false }, context: 'normal' },
    { keys: 'v', type: 'action', action: 'toggleVisualMode' },
    { keys: 'V', type: 'action', action: 'toggleVisualMode', actionArgs: { linewise: true }},
    { keys: '<C-v>', type: 'action', action: 'toggleVisualMode', actionArgs: { blockwise: true }},
    { keys: '<C-q>', type: 'action', action: 'toggleVisualMode', actionArgs: { blockwise: true }},
    { keys: 'gv', type: 'action', action: 'reselectLastSelection' },
    { keys: 'J', type: 'action', action: 'joinLines', isEdit: true },
    { keys: 'gJ', type: 'action', action: 'joinLines', actionArgs: { keepSpaces: true }, isEdit: true },
    { keys: 'p', type: 'action', action: 'paste', isEdit: true, actionArgs: { after: true, isEdit: true }},
    { keys: 'P', type: 'action', action: 'paste', isEdit: true, actionArgs: { after: false, isEdit: true }},
    { keys: 'r<character>', type: 'action', action: 'replace', isEdit: true },
    { keys: '@<character>', type: 'action', action: 'replayMacro' },
    { keys: 'q<character>', type: 'action', action: 'enterMacroRecordMode' },
    // Handle Replace-mode as a special case of insert mode.
    { keys: 'R', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { replace: true }, context: 'normal'},
    { keys: 'R', type: 'operator', operator: 'change', operatorArgs: { linewise: true, fullLine: true }, context: 'visual', exitVisualBlock: true},
    { keys: 'u', type: 'action', action: 'undo', context: 'normal' },
    { keys: 'u', type: 'operator', operator: 'changeCase', operatorArgs: {toLower: true}, context: 'visual', isEdit: true },
    { keys: 'U', type: 'operator', operator: 'changeCase', operatorArgs: {toLower: false}, context: 'visual', isEdit: true },
    { keys: '<C-r>', type: 'action', action: 'redo' },
    { keys: 'm<character>', type: 'action', action: 'setMark' },
    { keys: '"<character>', type: 'action', action: 'setRegister' },
    { keys: 'zz', type: 'action', action: 'scrollToCursor', actionArgs: { position: 'center' }},
    { keys: 'z.', type: 'action', action: 'scrollToCursor', actionArgs: { position: 'center' }, motion: 'moveToFirstNonWhiteSpaceCharacter' },
    { keys: 'zt', type: 'action', action: 'scrollToCursor', actionArgs: { position: 'top' }},
    { keys: 'z<CR>', type: 'action', action: 'scrollToCursor', actionArgs: { position: 'top' }, motion: 'moveToFirstNonWhiteSpaceCharacter' },
    { keys: 'z-', type: 'action', action: 'scrollToCursor', actionArgs: { position: 'bottom' }},
    { keys: 'zb', type: 'action', action: 'scrollToCursor', actionArgs: { position: 'bottom' }, motion: 'moveToFirstNonWhiteSpaceCharacter' },
    { keys: '.', type: 'action', action: 'repeatLastEdit' },
    { keys: '<C-a>', type: 'action', action: 'incrementNumberToken', isEdit: true, actionArgs: {increase: true, backtrack: false}},
    { keys: '<C-x>', type: 'action', action: 'incrementNumberToken', isEdit: true, actionArgs: {increase: false, backtrack: false}},
    { keys: '<C-t>', type: 'action', action: 'indent', actionArgs: { indentRight: true }, context: 'insert' },
    { keys: '<C-d>', type: 'action', action: 'indent', actionArgs: { indentRight: false }, context: 'insert' },
    // Text object motions
    { keys: 'a<character>', type: 'motion', motion: 'textObjectManipulation' },
    { keys: 'i<character>', type: 'motion', motion: 'textObjectManipulation', motionArgs: { textObjectInner: true }},
    // Search
    { keys: '/', type: 'search', searchArgs: { forward: true, querySrc: 'prompt', toJumplist: true }},
    { keys: '?', type: 'search', searchArgs: { forward: false, querySrc: 'prompt', toJumplist: true }},
    { keys: '*', type: 'search', searchArgs: { forward: true, querySrc: 'wordUnderCursor', wholeWordOnly: true, toJumplist: true }},
    { keys: '#', type: 'search', searchArgs: { forward: false, querySrc: 'wordUnderCursor', wholeWordOnly: true, toJumplist: true }},
    { keys: 'g*', type: 'search', searchArgs: { forward: true, querySrc: 'wordUnderCursor', toJumplist: true }},
    { keys: 'g#', type: 'search', searchArgs: { forward: false, querySrc: 'wordUnderCursor', toJumplist: true }},
    // Ex command
    { keys: ':', type: 'ex' }
  ];
  var defaultKeymapLength = defaultKeymap.length;

  /**
   * Ex commands
   * Care must be taken when adding to the default Ex command map. For any
   * pair of commands that have a shared prefix, at least one of their
   * shortNames must not match the prefix of the other command.
   */
  var defaultExCommandMap = [
    { name: 'colorscheme', shortName: 'colo' },
    { name: 'map' },
    { name: 'imap', shortName: 'im' },
    { name: 'nmap', shortName: 'nm' },
    { name: 'vmap', shortName: 'vm' },
    { name: 'unmap' },
    { name: 'write', shortName: 'w' },
    { name: 'undo', shortName: 'u' },
    { name: 'redo', shortName: 'red' },
    { name: 'set', shortName: 'se' },
    { name: 'set', shortName: 'se' },
    { name: 'setlocal', shortName: 'setl' },
    { name: 'setglobal', shortName: 'setg' },
    { name: 'sort', shortName: 'sor' },
    { name: 'substitute', shortName: 's', possiblyAsync: true },
    { name: 'nohlsearch', shortName: 'noh' },
    { name: 'yank', shortName: 'y' },
    { name: 'delmarks', shortName: 'delm' },
    { name: 'registers', shortName: 'reg', excludeFromCommandHistory: true },
    { name: 'global', shortName: 'g' }
  ];

  var Pos = CodeMirror.Pos;

  var Vim = function() {
    function enterVimMode(cm) {
      cm.setOption('disableInput', true);
      cm.setOption('showCursorWhenSelecting', false);
      CodeMirror.signal(cm, "vim-mode-change", {mode: "normal"});
      cm.on('cursorActivity', onCursorActivity);
      maybeInitVimState(cm);
      CodeMirror.on(cm.getInputField(), 'paste', getOnPasteFn(cm));
    }

    function leaveVimMode(cm) {
      cm.setOption('disableInput', false);
      cm.off('cursorActivity', onCursorActivity);
      CodeMirror.off(cm.getInputField(), 'paste', getOnPasteFn(cm));
      cm.state.vim = null;
    }

    function detachVimMap(cm, next) {
      if (this == CodeMirror.keyMap.vim) {
        CodeMirror.rmClass(cm.getWrapperElement(), "cm-fat-cursor");
        if (cm.getOption("inputStyle") == "contenteditable" && document.body.style.caretColor != null) {
          disableFatCursorMark(cm);
          cm.getInputField().style.caretColor = "";
        }
      }

      if (!next || next.attach != attachVimMap)
        leaveVimMode(cm);
    }
    function attachVimMap(cm, prev) {
      if (this == CodeMirror.keyMap.vim) {
        CodeMirror.addClass(cm.getWrapperElement(), "cm-fat-cursor");
        if (cm.getOption("inputStyle") == "contenteditable" && document.body.style.caretColor != null) {
          enableFatCursorMark(cm);
          cm.getInputField().style.caretColor = "transparent";
        }
      }

      if (!prev || prev.attach != attachVimMap)
        enterVimMode(cm);
    }

    function updateFatCursorMark(cm) {
      if (!cm.state.fatCursorMarks) return;
      clearFatCursorMark(cm);
      var ranges = cm.listSelections(), result = []
      for (var i = 0; i < ranges.length; i++) {
        var range = ranges[i];
        if (range.empty()) {
          var lineLength = cm.getLine(range.anchor.line).length;
          if (range.anchor.ch < lineLength) {
            result.push(cm.markText(range.anchor, Pos(range.anchor.line, range.anchor.ch + 1),
                                    {className: "cm-fat-cursor-mark"}));
          } else {
            result.push(cm.markText(Pos(range.anchor.line, lineLength - 1),
                                    Pos(range.anchor.line, lineLength),
                                    {className: "cm-fat-cursor-mark"}));
          }
        }
      }
      cm.state.fatCursorMarks = result;
    }

    function clearFatCursorMark(cm) {
      var marks = cm.state.fatCursorMarks;
      if (marks) for (var i = 0; i < marks.length; i++) marks[i].clear();
    }

    function enableFatCursorMark(cm) {
      cm.state.fatCursorMarks = [];
      updateFatCursorMark(cm)
      cm.on("cursorActivity", updateFatCursorMark)
    }

    function disableFatCursorMark(cm) {
      clearFatCursorMark(cm);
      cm.off("cursorActivity", updateFatCursorMark);
      // explicitly set fatCursorMarks to null because event listener above
      // can be invoke after removing it, if off is called from operation
      cm.state.fatCursorMarks = null;
    }

    // Deprecated, simply setting the keymap works again.
    CodeMirror.defineOption('vimMode', false, function(cm, val, prev) {
      if (val && cm.getOption("keyMap") != "vim")
        cm.setOption("keyMap", "vim");
      else if (!val && prev != CodeMirror.Init && /^vim/.test(cm.getOption("keyMap")))
        cm.setOption("keyMap", "default");
    });

    function cmKey(key, cm) {
      if (!cm) { return undefined; }
      if (this[key]) { return this[key]; }
      var vimKey = cmKeyToVimKey(key);
      if (!vimKey) {
        return false;
      }
      var cmd = CodeMirror.Vim.findKey(cm, vimKey);
      if (typeof cmd == 'function') {
        CodeMirror.signal(cm, 'vim-keypress', vimKey);
      }
      return cmd;
    }

    var modifiers = {'Shift': 'S', 'Ctrl': 'C', 'Alt': 'A', 'Cmd': 'D', 'Mod': 'A'};
    var specialKeys = {Enter:'CR',Backspace:'BS',Delete:'Del',Insert:'Ins'};
    function cmKeyToVimKey(key) {
      if (key.charAt(0) == '\'') {
        // Keypress character binding of format "'a'"
        return key.charAt(1);
      }
      var pieces = key.split(/-(?!$)/);
      var lastPiece = pieces[pieces.length - 1];
      if (pieces.length == 1 && pieces[0].length == 1) {
        // No-modifier bindings use literal character bindings above. Skip.
        return false;
      } else if (pieces.length == 2 && pieces[0] == 'Shift' && lastPiece.length == 1) {
        // Ignore Shift+char bindings as they should be handled by literal character.
        return false;
      }
      var hasCharacter = false;
      for (var i = 0; i < pieces.length; i++) {
        var piece = pieces[i];
        if (piece in modifiers) { pieces[i] = modifiers[piece]; }
        else { hasCharacter = true; }
        if (piece in specialKeys) { pieces[i] = specialKeys[piece]; }
      }
      if (!hasCharacter) {
        // Vim does not support modifier only keys.
        return false;
      }
      // TODO: Current bindings expect the character to be lower case, but
      // it looks like vim key notation uses upper case.
      if (isUpperCase(lastPiece)) {
        pieces[pieces.length - 1] = lastPiece.toLowerCase();
      }
      return '<' + pieces.join('-') + '>';
    }

    function getOnPasteFn(cm) {
      var vim = cm.state.vim;
      if (!vim.onPasteFn) {
        vim.onPasteFn = function() {
          if (!vim.insertMode) {
            cm.setCursor(offsetCursor(cm.getCursor(), 0, 1));
            actions.enterInsertMode(cm, {}, vim);
          }
        };
      }
      return vim.onPasteFn;
    }

    var numberRegex = /[\d]/;
    var wordCharTest = [CodeMirror.isWordChar, function(ch) {
      return ch && !CodeMirror.isWordChar(ch) && !/\s/.test(ch);
    }], bigWordCharTest = [function(ch) {
      return /\S/.test(ch);
    }];
    function makeKeyRange(start, size) {
      var keys = [];
      for (var i = start; i < start + size; i++) {
        keys.push(String.fromCharCode(i));
      }
      return keys;
    }
    var upperCaseAlphabet = makeKeyRange(65, 26);
    var lowerCaseAlphabet = makeKeyRange(97, 26);
    var numbers = makeKeyRange(48, 10);
    var validMarks = [].concat(upperCaseAlphabet, lowerCaseAlphabet, numbers, ['<', '>']);
    var validRegisters = [].concat(upperCaseAlphabet, lowerCaseAlphabet, numbers, ['-', '"', '.', ':', '/']);

    function isLine(cm, line) {
      return line >= cm.firstLine() && line <= cm.lastLine();
    }
    function isLowerCase(k) {
      return (/^[a-z]$/).test(k);
    }
    function isMatchableSymbol(k) {
      return '()[]{}'.indexOf(k) != -1;
    }
    function isNumber(k) {
      return numberRegex.test(k);
    }
    function isUpperCase(k) {
      return (/^[A-Z]$/).test(k);
    }
    function isWhiteSpaceString(k) {
      return (/^\s*$/).test(k);
    }
    function isEndOfSentenceSymbol(k) {
      return '.?!'.indexOf(k) != -1;
    }
    function inArray(val, arr) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
          return true;
        }
      }
      return false;
    }

    var options = {};
    function defineOption(name, defaultValue, type, aliases, callback) {
      if (defaultValue === undefined && !callback) {
        throw Error('defaultValue is required unless callback is provided');
      }
      if (!type) { type = 'string'; }
      options[name] = {
        type: type,
        defaultValue: defaultValue,
        callback: callback
      };
      if (aliases) {
        for (var i = 0; i < aliases.length; i++) {
          options[aliases[i]] = options[name];
        }
      }
      if (defaultValue) {
        setOption(name, defaultValue);
      }
    }

    function setOption(name, value, cm, cfg) {
      var option = options[name];
      cfg = cfg || {};
      var scope = cfg.scope;
      if (!option) {
        return new Error('Unknown option: ' + name);
      }
      if (option.type == 'boolean') {
        if (value && value !== true) {
          return new Error('Invalid argument: ' + name + '=' + value);
        } else if (value !== false) {
          // Boolean options are set to true if value is not defined.
          value = true;
        }
      }
      if (option.callback) {
        if (scope !== 'local') {
          option.callback(value, undefined);
        }
        if (scope !== 'global' && cm) {
          option.callback(value, cm);
        }
      } else {
        if (scope !== 'local') {
          option.value = option.type == 'boolean' ? !!value : value;
        }
        if (scope !== 'global' && cm) {
          cm.state.vim.options[name] = {value: value};
        }
      }
    }

    function getOption(name, cm, cfg) {
      var option = options[name];
      cfg = cfg || {};
      var scope = cfg.scope;
      if (!option) {
        return new Error('Unknown option: ' + name);
      }
      if (option.callback) {
        var local = cm && option.callback(undefined, cm);
        if (scope !== 'global' && local !== undefined) {
          return local;
        }
        if (scope !== 'local') {
          return option.callback();
        }
        return;
      } else {
        var local = (scope !== 'global') && (cm && cm.state.vim.options[name]);
        return (local || (scope !== 'local') && option || {}).value;
      }
    }

    defineOption('filetype', undefined, 'string', ['ft'], function(name, cm) {
      // Option is local. Do nothing for global.
      if (cm === undefined) {
        return;
      }
      // The 'filetype' option proxies to the CodeMirror 'mode' option.
      if (name === undefined) {
        var mode = cm.getOption('mode');
        return mode == 'null' ? '' : mode;
      } else {
        var mode = name == '' ? 'null' : name;
        cm.setOption('mode', mode);
      }
    });

    var createCircularJumpList = function() {
      var size = 100;
      var pointer = -1;
      var head = 0;
      var tail = 0;
      var buffer = new Array(size);
      function add(cm, oldCur, newCur) {
        var current = pointer % size;
        var curMark = buffer[current];
        function useNextSlot(cursor) {
          var next = ++pointer % size;
          var trashMark = buffer[next];
          if (trashMark) {
            trashMark.clear();
          }
          buffer[next] = cm.setBookmark(cursor);
        }
        if (curMark) {
          var markPos = curMark.find();
          // avoid recording redundant cursor position
          if (markPos && !cursorEqual(markPos, oldCur)) {
            useNextSlot(oldCur);
          }
        } else {
          useNextSlot(oldCur);
        }
        useNextSlot(newCur);
        head = pointer;
        tail = pointer - size + 1;
        if (tail < 0) {
          tail = 0;
        }
      }
      function move(cm, offset) {
        pointer += offset;
        if (pointer > head) {
          pointer = head;
        } else if (pointer < tail) {
          pointer = tail;
        }
        var mark = buffer[(size + pointer) % size];
        // skip marks that are temporarily removed from text buffer
        if (mark && !mark.find()) {
          var inc = offset > 0 ? 1 : -1;
          var newCur;
          var oldCur = cm.getCursor();
          do {
            pointer += inc;
            mark = buffer[(size + pointer) % size];
            // skip marks that are the same as current position
            if (mark &&
                (newCur = mark.find()) &&
                !cursorEqual(oldCur, newCur)) {
              break;
            }
          } while (pointer < head && pointer > tail);
        }
        return mark;
      }
      function find(cm, offset) {
        var oldPointer = pointer;
        var mark = move(cm, offset);
        pointer = oldPointer;
        return mark && mark.find();
      }
      return {
        cachedCursor: undefined, //used for # and * jumps
        add: add,
        find: find,
        move: move
      };
    };

    // Returns an object to track the changes associated insert mode.  It
    // clones the object that is passed in, or creates an empty object one if
    // none is provided.
    var createInsertModeChanges = function(c) {
      if (c) {
        // Copy construction
        return {
          changes: c.changes,
          expectCursorActivityForChange: c.expectCursorActivityForChange
        };
      }
      return {
        // Change list
        changes: [],
        // Set to true on change, false on cursorActivity.
        expectCursorActivityForChange: false
      };
    };

    function MacroModeState() {
      this.latestRegister = undefined;
      this.isPlaying = false;
      this.isRecording = false;
      this.replaySearchQueries = [];
      this.onRecordingDone = undefined;
      this.lastInsertModeChanges = createInsertModeChanges();
    }
    MacroModeState.prototype = {
      exitMacroRecordMode: function() {
        var macroModeState = vimGlobalState.macroModeState;
        if (macroModeState.onRecordingDone) {
          macroModeState.onRecordingDone(); // close dialog
        }
        macroModeState.onRecordingDone = undefined;
        macroModeState.isRecording = false;
      },
      enterMacroRecordMode: function(cm, registerName) {
        var register =
            vimGlobalState.registerController.getRegister(registerName);
        if (register) {
          register.clear();
          this.latestRegister = registerName;
          if (cm.openDialog) {
            this.onRecordingDone = cm.openDialog(
                '(recording)['+registerName+']', null, {bottom:true});
          }
          this.isRecording = true;
        }
      }
    };

    function maybeInitVimState(cm) {
      if (!cm.state.vim) {
        // Store instance state in the CodeMirror object.
        cm.state.vim = {
          inputState: new InputState(),
          // Vim's input state that triggered the last edit, used to repeat
          // motions and operators with '.'.
          lastEditInputState: undefined,
          // Vim's action command before the last edit, used to repeat actions
          // with '.' and insert mode repeat.
          lastEditActionCommand: undefined,
          // When using jk for navigation, if you move from a longer line to a
          // shorter line, the cursor may clip to the end of the shorter line.
          // If j is pressed again and cursor goes to the next line, the
          // cursor should go back to its horizontal position on the longer
          // line if it can. This is to keep track of the horizontal position.
          lastHPos: -1,
          // Doing the same with screen-position for gj/gk
          lastHSPos: -1,
          // The last motion command run. Cleared if a non-motion command gets
          // executed in between.
          lastMotion: null,
          marks: {},
          // Mark for rendering fake cursor for visual mode.
          fakeCursor: null,
          insertMode: false,
          // Repeat count for changes made in insert mode, triggered by key
          // sequences like 3,i. Only exists when insertMode is true.
          insertModeRepeat: undefined,
          visualMode: false,
          // If we are in visual line mode. No effect if visualMode is false.
          visualLine: false,
          visualBlock: false,
          lastSelection: null,
          lastPastedText: null,
          sel: {},
          // Buffer-local/window-local values of vim options.
          options: {}
        };
      }
      return cm.state.vim;
    }
    var vimGlobalState;
    function resetVimGlobalState() {
      vimGlobalState = {
        // The current search query.
        searchQuery: null,
        // Whether we are searching backwards.
        searchIsReversed: false,
        // Replace part of the last substituted pattern
        lastSubstituteReplacePart: undefined,
        jumpList: createCircularJumpList(),
        macroModeState: new MacroModeState,
        // Recording latest f, t, F or T motion command.
        lastCharacterSearch: {increment:0, forward:true, selectedCharacter:''},
        registerController: new RegisterController({}),
        // search history buffer
        searchHistoryController: new HistoryController(),
        // ex Command history buffer
        exCommandHistoryController : new HistoryController()
      };
      for (var optionName in options) {
        var option = options[optionName];
        option.value = option.defaultValue;
      }
    }

    var lastInsertModeKeyTimer;
    var vimApi= {
      buildKeyMap: function() {
        // TODO: Convert keymap into dictionary format for fast lookup.
      },
      // Testing hook, though it might be useful to expose the register
      // controller anyways.
      getRegisterController: function() {
        return vimGlobalState.registerController;
      },
      // Testing hook.
      resetVimGlobalState_: resetVimGlobalState,

      // Testing hook.
      getVimGlobalState_: function() {
        return vimGlobalState;
      },

      // Testing hook.
      maybeInitVimState_: maybeInitVimState,

      suppressErrorLogging: false,

      InsertModeKey: InsertModeKey,
      map: function(lhs, rhs, ctx) {
        // Add user defined key bindings.
        exCommandDispatcher.map(lhs, rhs, ctx);
      },
      unmap: function(lhs, ctx) {
        exCommandDispatcher.unmap(lhs, ctx);
      },
      // Non-recursive map function.
      // NOTE: This will not create mappings to key maps that aren't present
      // in the default key map. See TODO at bottom of function.
      noremap: function(lhs, rhs, ctx) {
        function toCtxArray(ctx) {
          return ctx ? [ctx] : ['normal', 'insert', 'visual'];
        }
        var ctxsToMap = toCtxArray(ctx);
        // Look through all actual defaults to find a map candidate.
        var actualLength = defaultKeymap.length, origLength = defaultKeymapLength;
        for (var i = actualLength - origLength;
             i < actualLength && ctxsToMap.length;
             i++) {
          var mapping = defaultKeymap[i];
          // Omit mappings that operate in the wrong context(s) and those of invalid type.
          if (mapping.keys == rhs &&
              (!ctx || !mapping.context || mapping.context === ctx) &&
              mapping.type.substr(0, 2) !== 'ex' &&
              mapping.type.substr(0, 3) !== 'key') {
            // Make a shallow copy of the original keymap entry.
            var newMapping = {};
            for (var key in mapping) {
              newMapping[key] = mapping[key];
            }
            // Modify it point to the new mapping with the proper context.
            newMapping.keys = lhs;
            if (ctx && !newMapping.context) {
              newMapping.context = ctx;
            }
            // Add it to the keymap with a higher priority than the original.
            this._mapCommand(newMapping);
            // Record the mapped contexts as complete.
            var mappedCtxs = toCtxArray(mapping.context);
            ctxsToMap = ctxsToMap.filter(function(el) { return mappedCtxs.indexOf(el) === -1; });
          }
        }
        // TODO: Create non-recursive keyToKey mappings for the unmapped contexts once those exist.
      },
      // Remove all user-defined mappings for the provided context.
      mapclear: function(ctx) {
        // Partition the existing keymap into user-defined and true defaults.
        var actualLength = defaultKeymap.length,
            origLength = defaultKeymapLength;
        var userKeymap = defaultKeymap.slice(0, actualLength - origLength);
        defaultKeymap = defaultKeymap.slice(actualLength - origLength);
        if (ctx) {
          // If a specific context is being cleared, we need to keep mappings
          // from all other contexts.
          for (var i = userKeymap.length - 1; i >= 0; i--) {
            var mapping = userKeymap[i];
            if (ctx !== mapping.context) {
              if (mapping.context) {
                this._mapCommand(mapping);
              } else {
                // `mapping` applies to all contexts so create keymap copies
                // for each context except the one being cleared.
                var contexts = ['normal', 'insert', 'visual'];
                for (var j in contexts) {
                  if (contexts[j] !== ctx) {
                    var newMapping = {};
                    for (var key in mapping) {
                      newMapping[key] = mapping[key];
                    }
                    newMapping.context = contexts[j];
                    this._mapCommand(newMapping);
                  }
                }
              }
            }
          }
        }
      },
      // TODO: Expose setOption and getOption as instance methods. Need to decide how to namespace
      // them, or somehow make them work with the existing CodeMirror setOption/getOption API.
      setOption: setOption,
      getOption: getOption,
      defineOption: defineOption,
      defineEx: function(name, prefix, func){
        if (!prefix) {
          prefix = name;
        } else if (name.indexOf(prefix) !== 0) {
          throw new Error('(Vim.defineEx) "'+prefix+'" is not a prefix of "'+name+'", command not registered');
        }
        exCommands[name]=func;
        exCommandDispatcher.commandMap_[prefix]={name:name, shortName:prefix, type:'api'};
      },
      handleKey: function (cm, key, origin) {
        var command = this.findKey(cm, key, origin);
        if (typeof command === 'function') {
          return command();
        }
      },
      /**
       * This is the outermost function called by CodeMirror, after keys have
       * been mapped to their Vim equivalents.
       *
       * Finds a command based on the key (and cached keys if there is a
       * multi-key sequence). Returns `undefined` if no key is matched, a noop
       * function if a partial match is found (multi-key), and a function to
       * execute the bound command if a a key is matched. The function always
       * returns true.
       */
      findKey: function(cm, key, origin) {
        var vim = maybeInitVimState(cm);
        function handleMacroRecording() {
          var macroModeState = vimGlobalState.macroModeState;
          if (macroModeState.isRecording) {
            if (key == 'q') {
              macroModeState.exitMacroRecordMode();
              clearInputState(cm);
              return true;
            }
            if (origin != 'mapping') {
              logKey(macroModeState, key);
            }
          }
        }
        function handleEsc() {
          if (key == '<Esc>') {
            // Clear input state and get back to normal mode.
            clearInputState(cm);
            if (vim.visualMode) {
              exitVisualMode(cm);
            } else if (vim.insertMode) {
              exitInsertMode(cm);
            }
            return true;
          }
        }
        function doKeyToKey(keys) {
          // TODO: prevent infinite recursion.
          var match;
          while (keys) {
            // Pull off one command key, which is either a single character
            // or a special sequence wrapped in '<' and '>', e.g. '<Space>'.
            match = (/<\w+-.+?>|<\w+>|./).exec(keys);
            key = match[0];
            keys = keys.substring(match.index + key.length);
            CodeMirror.Vim.handleKey(cm, key, 'mapping');
          }
        }

        function handleKeyInsertMode() {
          if (handleEsc()) { return true; }
          var keys = vim.inputState.keyBuffer = vim.inputState.keyBuffer + key;
          var keysAreChars = key.length == 1;
          var match = commandDispatcher.matchCommand(keys, defaultKeymap, vim.inputState, 'insert');
          // Need to check all key substrings in insert mode.
          while (keys.length > 1 && match.type != 'full') {
            var keys = vim.inputState.keyBuffer = keys.slice(1);
            var thisMatch = commandDispatcher.matchCommand(keys, defaultKeymap, vim.inputState, 'insert');
            if (thisMatch.type != 'none') { match = thisMatch; }
          }
          if (match.type == 'none') { clearInputState(cm); return false; }
          else if (match.type == 'partial') {
            if (lastInsertModeKeyTimer) { window.clearTimeout(lastInsertModeKeyTimer); }
            lastInsertModeKeyTimer = window.setTimeout(
              function() { if (vim.insertMode && vim.inputState.keyBuffer) { clearInputState(cm); } },
              getOption('insertModeEscKeysTimeout'));
            return !keysAreChars;
          }

          if (lastInsertModeKeyTimer) { window.clearTimeout(lastInsertModeKeyTimer); }
          if (keysAreChars) {
            var selections = cm.listSelections();
            for (var i = 0; i < selections.length; i++) {
              var here = selections[i].head;
              cm.replaceRange('', offsetCursor(here, 0, -(keys.length - 1)), here, '+input');
            }
            vimGlobalState.macroModeState.lastInsertModeChanges.changes.pop();
          }
          clearInputState(cm);
          return match.command;
        }

        function handleKeyNonInsertMode() {
          if (handleMacroRecording() || handleEsc()) { return true; }

          var keys = vim.inputState.keyBuffer = vim.inputState.keyBuffer + key;
          if (/^[1-9]\d*$/.test(keys)) { return true; }

          var keysMatcher = /^(\d*)(.*)$/.exec(keys);
          if (!keysMatcher) { clearInputState(cm); return false; }
          var context = vim.visualMode ? 'visual' :
                                         'normal';
          var match = commandDispatcher.matchCommand(keysMatcher[2] || keysMatcher[1], defaultKeymap, vim.inputState, context);
          if (match.type == 'none') { clearInputState(cm); return false; }
          else if (match.type == 'partial') { return true; }

          vim.inputState.keyBuffer = '';
          var keysMatcher = /^(\d*)(.*)$/.exec(keys);
          if (keysMatcher[1] && keysMatcher[1] != '0') {
            vim.inputState.pushRepeatDigit(keysMatcher[1]);
          }
          return match.command;
        }

        var command;
        if (vim.insertMode) { command = handleKeyInsertMode(); }
        else { command = handleKeyNonInsertMode(); }
        if (command === false) {
          return !vim.insertMode && key.length === 1 ? function() { return true; } : undefined;
        } else if (command === true) {
          // TODO: Look into using CodeMirror's multi-key handling.
          // Return no-op since we are caching the key. Counts as handled, but
          // don't want act on it just yet.
          return function() { return true; };
        } else {
          return function() {
            return cm.operation(function() {
              cm.curOp.isVimOp = true;
              try {
                if (command.type == 'keyToKey') {
                  doKeyToKey(command.toKeys);
                } else {
                  commandDispatcher.processCommand(cm, vim, command);
                }
              } catch (e) {
                // clear VIM state in case it's in a bad state.
                cm.state.vim = undefined;
                maybeInitVimState(cm);
                if (!CodeMirror.Vim.suppressErrorLogging) {
                  console['log'](e);
                }
                throw e;
              }
              return true;
            });
          };
        }
      },
      handleEx: function(cm, input) {
        exCommandDispatcher.processCommand(cm, input);
      },

      defineMotion: defineMotion,
      defineAction: defineAction,
      defineOperator: defineOperator,
      mapCommand: mapCommand,
      _mapCommand: _mapCommand,

      defineRegister: defineRegister,

      exitVisualMode: exitVisualMode,
      exitInsertMode: exitInsertMode
    };

    // Represents the current input state.
    function InputState() {
      this.prefixRepeat = [];
      this.motionRepeat = [];

      this.operator = null;
      this.operatorArgs = null;
      this.motion = null;
      this.motionArgs = null;
      this.keyBuffer = []; // For matching multi-key commands.
      this.registerName = null; // Defaults to the unnamed register.
    }
    InputState.prototype.pushRepeatDigit = function(n) {
      if (!this.operator) {
        this.prefixRepeat = this.prefixRepeat.concat(n);
      } else {
        this.motionRepeat = this.motionRepeat.concat(n);
      }
    };
    InputState.prototype.getRepeat = function() {
      var repeat = 0;
      if (this.prefixRepeat.length > 0 || this.motionRepeat.length > 0) {
        repeat = 1;
        if (this.prefixRepeat.length > 0) {
          repeat *= parseInt(this.prefixRepeat.join(''), 10);
        }
        if (this.motionRepeat.length > 0) {
          repeat *= parseInt(this.motionRepeat.join(''), 10);
        }
      }
      return repeat;
    };

    function clearInputState(cm, reason) {
      cm.state.vim.inputState = new InputState();
      CodeMirror.signal(cm, 'vim-command-done', reason);
    }

    /*
     * Register stores information about copy and paste registers.  Besides
     * text, a register must store whether it is linewise (i.e., when it is
     * pasted, should it insert itself into a new line, or should the text be
     * inserted at the cursor position.)
     */
    function Register(text, linewise, blockwise) {
      this.clear();
      this.keyBuffer = [text || ''];
      this.insertModeChanges = [];
      this.searchQueries = [];
      this.linewise = !!linewise;
      this.blockwise = !!blockwise;
    }
    Register.prototype = {
      setText: function(text, linewise, blockwise) {
        this.keyBuffer = [text || ''];
        this.linewise = !!linewise;
        this.blockwise = !!blockwise;
      },
      pushText: function(text, linewise) {
        // if this register has ever been set to linewise, use linewise.
        if (linewise) {
          if (!this.linewise) {
            this.keyBuffer.push('\n');
          }
          this.linewise = true;
        }
        this.keyBuffer.push(text);
      },
      pushInsertModeChanges: function(changes) {
        this.insertModeChanges.push(createInsertModeChanges(changes));
      },
      pushSearchQuery: function(query) {
        this.searchQueries.push(query);
      },
      clear: function() {
        this.keyBuffer = [];
        this.insertModeChanges = [];
        this.searchQueries = [];
        this.linewise = false;
      },
      toString: function() {
        return this.keyBuffer.join('');
      }
    };

    /**
     * Defines an external register.
     *
     * The name should be a single character that will be used to reference the register.
     * The register should support setText, pushText, clear, and toString(). See Register
     * for a reference implementation.
     */
    function defineRegister(name, register) {
      var registers = vimGlobalState.registerController.registers;
      if (!name || name.length != 1) {
        throw Error('Register name must be 1 character');
      }
      if (registers[name]) {
        throw Error('Register already defined ' + name);
      }
      registers[name] = register;
      validRegisters.push(name);
    }

    /*
     * vim registers allow you to keep many independent copy and paste buffers.
     * See http://usevim.com/2012/04/13/registers/ for an introduction.
     *
     * RegisterController keeps the state of all the registers.  An initial
     * state may be passed in.  The unnamed register '"' will always be
     * overridden.
     */
    function RegisterController(registers) {
      this.registers = registers;
      this.unnamedRegister = registers['"'] = new Register();
      registers['.'] = new Register();
      registers[':'] = new Register();
      registers['/'] = new Register();
    }
    RegisterController.prototype = {
      pushText: function(registerName, operator, text, linewise, blockwise) {
        if (linewise && text.charAt(text.length - 1) !== '\n'){
          text += '\n';
        }
        // Lowercase and uppercase registers refer to the same register.
        // Uppercase just means append.
        var register = this.isValidRegister(registerName) ?
            this.getRegister(registerName) : null;
        // if no register/an invalid register was specified, things go to the
        // default registers
        if (!register) {
          switch (operator) {
            case 'yank':
              // The 0 register contains the text from the most recent yank.
              this.registers['0'] = new Register(text, linewise, blockwise);
              break;
            case 'delete':
            case 'change':
              if (text.indexOf('\n') == -1) {
                // Delete less than 1 line. Update the small delete register.
                this.registers['-'] = new Register(text, linewise);
              } else {
                // Shift down the contents of the numbered registers and put the
                // deleted text into register 1.
                this.shiftNumericRegisters_();
                this.registers['1'] = new Register(text, linewise);
              }
              break;
          }
          // Make sure the unnamed register is set to what just happened
          this.unnamedRegister.setText(text, linewise, blockwise);
          return;
        }

        // If we've gotten to this point, we've actually specified a register
        var append = isUpperCase(registerName);
        if (append) {
          register.pushText(text, linewise);
        } else {
          register.setText(text, linewise, blockwise);
        }
        // The unnamed register always has the same value as the last used
        // register.
        this.unnamedRegister.setText(register.toString(), linewise);
      },
      // Gets the register named @name.  If one of @name doesn't already exist,
      // create it.  If @name is invalid, return the unnamedRegister.
      getRegister: function(name) {
        if (!this.isValidRegister(name)) {
          return this.unnamedRegister;
        }
        name = name.toLowerCase();
        if (!this.registers[name]) {
          this.registers[name] = new Register();
        }
        return this.registers[name];
      },
      isValidRegister: function(name) {
        return name && inArray(name, validRegisters);
      },
      shiftNumericRegisters_: function() {
        for (var i = 9; i >= 2; i--) {
          this.registers[i] = this.getRegister('' + (i - 1));
        }
      }
    };
    function HistoryController() {
        this.historyBuffer = [];
        this.iterator = 0;
        this.initialPrefix = null;
    }
    HistoryController.prototype = {
      // the input argument here acts a user entered prefix for a small time
      // until we start autocompletion in which case it is the autocompleted.
      nextMatch: function (input, up) {
        var historyBuffer = this.historyBuffer;
        var dir = up ? -1 : 1;
        if (this.initialPrefix === null) this.initialPrefix = input;
        for (var i = this.iterator + dir; up ? i >= 0 : i < historyBuffer.length; i+= dir) {
          var element = historyBuffer[i];
          for (var j = 0; j <= element.length; j++) {
            if (this.initialPrefix == element.substring(0, j)) {
              this.iterator = i;
              return element;
            }
          }
        }
        // should return the user input in case we reach the end of buffer.
        if (i >= historyBuffer.length) {
          this.iterator = historyBuffer.length;
          return this.initialPrefix;
        }
        // return the last autocompleted query or exCommand as it is.
        if (i < 0 ) return input;
      },
      pushInput: function(input) {
        var index = this.historyBuffer.indexOf(input);
        if (index > -1) this.historyBuffer.splice(index, 1);
        if (input.length) this.historyBuffer.push(input);
      },
      reset: function() {
        this.initialPrefix = null;
        this.iterator = this.historyBuffer.length;
      }
    };
    var commandDispatcher = {
      matchCommand: function(keys, keyMap, inputState, context) {
        var matches = commandMatches(keys, keyMap, context, inputState);
        if (!matches.full && !matches.partial) {
          return {type: 'none'};
        } else if (!matches.full && matches.partial) {
          return {type: 'partial'};
        }

        var bestMatch;
        for (var i = 0; i < matches.full.length; i++) {
          var match = matches.full[i];
          if (!bestMatch) {
            bestMatch = match;
          }
        }
        if (bestMatch.keys.slice(-11) == '<character>') {
          var character = lastChar(keys);
          if (!character) return {type: 'none'};
          inputState.selectedCharacter = character;
        }
        return {type: 'full', command: bestMatch};
      },
      processCommand: function(cm, vim, command) {
        vim.inputState.repeatOverride = command.repeatOverride;
        switch (command.type) {
          case 'motion':
            this.processMotion(cm, vim, command);
            break;
          case 'operator':
            this.processOperator(cm, vim, command);
            break;
          case 'operatorMotion':
            this.processOperatorMotion(cm, vim, command);
            break;
          case 'action':
            this.processAction(cm, vim, command);
            break;
          case 'search':
            this.processSearch(cm, vim, command);
            break;
          case 'ex':
          case 'keyToEx':
            this.processEx(cm, vim, command);
            break;
          default:
            break;
        }
      },
      processMotion: function(cm, vim, command) {
        vim.inputState.motion = command.motion;
        vim.inputState.motionArgs = copyArgs(command.motionArgs);
        this.evalInput(cm, vim);
      },
      processOperator: function(cm, vim, command) {
        var inputState = vim.inputState;
        if (inputState.operator) {
          if (inputState.operator == command.operator) {
            // Typing an operator twice like 'dd' makes the operator operate
            // linewise
            inputState.motion = 'expandToLine';
            inputState.motionArgs = { linewise: true };
            this.evalInput(cm, vim);
            return;
          } else {
            // 2 different operators in a row doesn't make sense.
            clearInputState(cm);
          }
        }
        inputState.operator = command.operator;
        inputState.operatorArgs = copyArgs(command.operatorArgs);
        if (command.exitVisualBlock) {
            vim.visualBlock = false;
            updateCmSelection(cm);
        }
        if (vim.visualMode) {
          // Operating on a selection in visual mode. We don't need a motion.
          this.evalInput(cm, vim);
        }
      },
      processOperatorMotion: function(cm, vim, command) {
        var visualMode = vim.visualMode;
        var operatorMotionArgs = copyArgs(command.operatorMotionArgs);
        if (operatorMotionArgs) {
          // Operator motions may have special behavior in visual mode.
          if (visualMode && operatorMotionArgs.visualLine) {
            vim.visualLine = true;
          }
        }
        this.processOperator(cm, vim, command);
        if (!visualMode) {
          this.processMotion(cm, vim, command);
        }
      },
      processAction: function(cm, vim, command) {
        var inputState = vim.inputState;
        var repeat = inputState.getRepeat();
        var repeatIsExplicit = !!repeat;
        var actionArgs = copyArgs(command.actionArgs) || {};
        if (inputState.selectedCharacter) {
          actionArgs.selectedCharacter = inputState.selectedCharacter;
        }
        // Actions may or may not have motions and operators. Do these first.
        if (command.operator) {
          this.processOperator(cm, vim, command);
        }
        if (command.motion) {
          this.processMotion(cm, vim, command);
        }
        if (command.motion || command.operator) {
          this.evalInput(cm, vim);
        }
        actionArgs.repeat = repeat || 1;
        actionArgs.repeatIsExplicit = repeatIsExplicit;
        actionArgs.registerName = inputState.registerName;
        clearInputState(cm);
        vim.lastMotion = null;
        if (command.isEdit) {
          this.recordLastEdit(vim, inputState, command);
        }
        actions[command.action](cm, actionArgs, vim);
      },
      processSearch: function(cm, vim, command) {
        if (!cm.getSearchCursor) {
          // Search depends on SearchCursor.
          return;
        }
        var forward = command.searchArgs.forward;
        var wholeWordOnly = command.searchArgs.wholeWordOnly;
        getSearchState(cm).setReversed(!forward);
        var promptPrefix = (forward) ? '/' : '?';
        var originalQuery = getSearchState(cm).getQuery();
        var originalScrollPos = cm.getScrollInfo();
        function handleQuery(query, ignoreCase, smartCase) {
          vimGlobalState.searchHistoryController.pushInput(query);
          vimGlobalState.searchHistoryController.reset();
          try {
            updateSearchQuery(cm, query, ignoreCase, smartCase);
          } catch (e) {
            showConfirm(cm, 'Invalid regex: ' + query);
            clearInputState(cm);
            return;
          }
          commandDispatcher.processMotion(cm, vim, {
            type: 'motion',
            motion: 'findNext',
            motionArgs: { forward: true, toJumplist: command.searchArgs.toJumplist }
          });
        }
        function onPromptClose(query) {
          cm.scrollTo(originalScrollPos.left, originalScrollPos.top);
          handleQuery(query, true /** ignoreCase */, true /** smartCase */);
          var macroModeState = vimGlobalState.macroModeState;
          if (macroModeState.isRecording) {
            logSearchQuery(macroModeState, query);
          }
        }
        function onPromptKeyUp(e, query, close) {
          var keyName = CodeMirror.keyName(e), up, offset;
          if (keyName == 'Up' || keyName == 'Down') {
            up = keyName == 'Up' ? true : false;
            offset = e.target ? e.target.selectionEnd : 0;
            query = vimGlobalState.searchHistoryController.nextMatch(query, up) || '';
            close(query);
            if (offset && e.target) e.target.selectionEnd = e.target.selectionStart = Math.min(offset, e.target.value.length);
          } else {
            if ( keyName != 'Left' && keyName != 'Right' && keyName != 'Ctrl' && keyName != 'Alt' && keyName != 'Shift')
              vimGlobalState.searchHistoryController.reset();
          }
          var parsedQuery;
          try {
            parsedQuery = updateSearchQuery(cm, query,
                true /** ignoreCase */, true /** smartCase */);
          } catch (e) {
            // Swallow bad regexes for incremental search.
          }
          if (parsedQuery) {
            cm.scrollIntoView(findNext(cm, !forward, parsedQuery), 30);
          } else {
            clearSearchHighlight(cm);
            cm.scrollTo(originalScrollPos.left, originalScrollPos.top);
          }
        }
        function onPromptKeyDown(e, query, close) {
          var keyName = CodeMirror.keyName(e);
          if (keyName == 'Esc' || keyName == 'Ctrl-C' || keyName == 'Ctrl-[' ||
              (keyName == 'Backspace' && query == '')) {
            vimGlobalState.searchHistoryController.pushInput(query);
            vimGlobalState.searchHistoryController.reset();
            updateSearchQuery(cm, originalQuery);
            clearSearchHighlight(cm);
            cm.scrollTo(originalScrollPos.left, originalScrollPos.top);
            CodeMirror.e_stop(e);
            clearInputState(cm);
            close();
            cm.focus();
          } else if (keyName == 'Up' || keyName == 'Down') {
            CodeMirror.e_stop(e);
          } else if (keyName == 'Ctrl-U') {
            // Ctrl-U clears input.
            CodeMirror.e_stop(e);
            close('');
          }
        }
        switch (command.searchArgs.querySrc) {
          case 'prompt':
            var macroModeState = vimGlobalState.macroModeState;
            if (macroModeState.isPlaying) {
              var query = macroModeState.replaySearchQueries.shift();
              handleQuery(query, true /** ignoreCase */, false /** smartCase */);
            } else {
              showPrompt(cm, {
                  onClose: onPromptClose,
                  prefix: promptPrefix,
                  desc: searchPromptDesc,
                  onKeyUp: onPromptKeyUp,
                  onKeyDown: onPromptKeyDown
              });
            }
            break;
          case 'wordUnderCursor':
            var word = expandWordUnderCursor(cm, false /** inclusive */,
                true /** forward */, false /** bigWord */,
                true /** noSymbol */);
            var isKeyword = true;
            if (!word) {
              word = expandWordUnderCursor(cm, false /** inclusive */,
                  true /** forward */, false /** bigWord */,
                  false /** noSymbol */);
              isKeyword = false;
            }
            if (!word) {
              return;
            }
            var query = cm.getLine(word.start.line).substring(word.start.ch,
                word.end.ch);
            if (isKeyword && wholeWordOnly) {
                query = '\\b' + query + '\\b';
            } else {
              query = escapeRegex(query);
            }

            // cachedCursor is used to save the old position of the cursor
            // when * or # causes vim to seek for the nearest word and shift
            // the cursor before entering the motion.
            vimGlobalState.jumpList.cachedCursor = cm.getCursor();
            cm.setCursor(word.start);

            handleQuery(query, true /** ignoreCase */, false /** smartCase */);
            break;
        }
      },
      processEx: function(cm, vim, command) {
        function onPromptClose(input) {
          // Give the prompt some time to close so that if processCommand shows
          // an error, the elements don't overlap.
          vimGlobalState.exCommandHistoryController.pushInput(input);
          vimGlobalState.exCommandHistoryController.reset();
          exCommandDispatcher.processCommand(cm, input);
        }
        function onPromptKeyDown(e, input, close) {
          var keyName = CodeMirror.keyName(e), up, offset;
          if (keyName == 'Esc' || keyName == 'Ctrl-C' || keyName == 'Ctrl-[' ||
              (keyName == 'Backspace' && input == '')) {
            vimGlobalState.exCommandHistoryController.pushInput(input);
            vimGlobalState.exCommandHistoryController.reset();
            CodeMirror.e_stop(e);
            clearInputState(cm);
            close();
            cm.focus();
          }
          if (keyName == 'Up' || keyName == 'Down') {
            CodeMirror.e_stop(e);
            up = keyName == 'Up' ? true : false;
            offset = e.target ? e.target.selectionEnd : 0;
            input = vimGlobalState.exCommandHistoryController.nextMatch(input, up) || '';
            close(input);
            if (offset && e.target) e.target.selectionEnd = e.target.selectionStart = Math.min(offset, e.target.value.length);
          } else if (keyName == 'Ctrl-U') {
            // Ctrl-U clears input.
            CodeMirror.e_stop(e);
            close('');
          } else {
            if ( keyName != 'Left' && keyName != 'Right' && keyName != 'Ctrl' && keyName != 'Alt' && keyName != 'Shift')
              vimGlobalState.exCommandHistoryController.reset();
          }
        }
        if (command.type == 'keyToEx') {
          // Handle user defined Ex to Ex mappings
          exCommandDispatcher.processCommand(cm, command.exArgs.input);
        } else {
          if (vim.visualMode) {
            showPrompt(cm, { onClose: onPromptClose, prefix: ':', value: '\'<,\'>',
                onKeyDown: onPromptKeyDown, selectValueOnOpen: false});
          } else {
            showPrompt(cm, { onClose: onPromptClose, prefix: ':',
                onKeyDown: onPromptKeyDown});
          }
        }
      },
      evalInput: function(cm, vim) {
        // If the motion command is set, execute both the operator and motion.
        // Otherwise return.
        var inputState = vim.inputState;
        var motion = inputState.motion;
        var motionArgs = inputState.motionArgs || {};
        var operator = inputState.operator;
        var operatorArgs = inputState.operatorArgs || {};
        var registerName = inputState.registerName;
        var sel = vim.sel;
        // TODO: Make sure cm and vim selections are identical outside visual mode.
        var origHead = copyCursor(vim.visualMode ? clipCursorToContent(cm, sel.head): cm.getCursor('head'));
        var origAnchor = copyCursor(vim.visualMode ? clipCursorToContent(cm, sel.anchor) : cm.getCursor('anchor'));
        var oldHead = copyCursor(origHead);
        var oldAnchor = copyCursor(origAnchor);
        var newHead, newAnchor;
        var repeat;
        if (operator) {
          this.recordLastEdit(vim, inputState);
        }
        if (inputState.repeatOverride !== undefined) {
          // If repeatOverride is specified, that takes precedence over the
          // input state's repeat. Used by Ex mode and can be user defined.
          repeat = inputState.repeatOverride;
        } else {
          repeat = inputState.getRepeat();
        }
        if (repeat > 0 && motionArgs.explicitRepeat) {
          motionArgs.repeatIsExplicit = true;
        } else if (motionArgs.noRepeat ||
            (!motionArgs.explicitRepeat && repeat === 0)) {
          repeat = 1;
          motionArgs.repeatIsExplicit = false;
        }
        if (inputState.selectedCharacter) {
          // If there is a character input, stick it in all of the arg arrays.
          motionArgs.selectedCharacter = operatorArgs.selectedCharacter =
              inputState.selectedCharacter;
        }
        motionArgs.repeat = repeat;
        clearInputState(cm);
        if (motion) {
          var motionResult = motions[motion](cm, origHead, motionArgs, vim);
          vim.lastMotion = motions[motion];
          if (!motionResult) {
            return;
          }
          if (motionArgs.toJumplist) {
            var jumpList = vimGlobalState.jumpList;
            // if the current motion is # or *, use cachedCursor
            var cachedCursor = jumpList.cachedCursor;
            if (cachedCursor) {
              recordJumpPosition(cm, cachedCursor, motionResult);
              delete jumpList.cachedCursor;
            } else {
              recordJumpPosition(cm, origHead, motionResult);
            }
          }
          if (motionResult instanceof Array) {
            newAnchor = motionResult[0];
            newHead = motionResult[1];
          } else {
            newHead = motionResult;
          }
          // TODO: Handle null returns from motion commands better.
          if (!newHead) {
            newHead = copyCursor(origHead);
          }
          if (vim.visualMode) {
            if (!(vim.visualBlock && newHead.ch === Infinity)) {
              newHead = clipCursorToContent(cm, newHead);
            }
            if (newAnchor) {
              newAnchor = clipCursorToContent(cm, newAnchor);
            }
            newAnchor = newAnchor || oldAnchor;
            sel.anchor = newAnchor;
            sel.head = newHead;
            updateCmSelection(cm);
            updateMark(cm, vim, '<',
                cursorIsBefore(newAnchor, newHead) ? newAnchor
                    : newHead);
            updateMark(cm, vim, '>',
                cursorIsBefore(newAnchor, newHead) ? newHead
                    : newAnchor);
          } else if (!operator) {
            newHead = clipCursorToContent(cm, newHead);
            cm.setCursor(newHead.line, newHead.ch);
          }
        }
        if (operator) {
          if (operatorArgs.lastSel) {
            // Replaying a visual mode operation
            newAnchor = oldAnchor;
            var lastSel = operatorArgs.lastSel;
            var lineOffset = Math.abs(lastSel.head.line - lastSel.anchor.line);
            var chOffset = Math.abs(lastSel.head.ch - lastSel.anchor.ch);
            if (lastSel.visualLine) {
              // Linewise Visual mode: The same number of lines.
              newHead = Pos(oldAnchor.line + lineOffset, oldAnchor.ch);
            } else if (lastSel.visualBlock) {
              // Blockwise Visual mode: The same number of lines and columns.
              newHead = Pos(oldAnchor.line + lineOffset, oldAnchor.ch + chOffset);
            } else if (lastSel.head.line == lastSel.anchor.line) {
              // Normal Visual mode within one line: The same number of characters.
              newHead = Pos(oldAnchor.line, oldAnchor.ch + chOffset);
            } else {
              // Normal Visual mode with several lines: The same number of lines, in the
              // last line the same number of characters as in the last line the last time.
              newHead = Pos(oldAnchor.line + lineOffset, oldAnchor.ch);
            }
            vim.visualMode = true;
            vim.visualLine = lastSel.visualLine;
            vim.visualBlock = lastSel.visualBlock;
            sel = vim.sel = {
              anchor: newAnchor,
              head: newHead
            };
            updateCmSelection(cm);
          } else if (vim.visualMode) {
            operatorArgs.lastSel = {
              anchor: copyCursor(sel.anchor),
              head: copyCursor(sel.head),
              visualBlock: vim.visualBlock,
              visualLine: vim.visualLine
            };
          }
          var curStart, curEnd, linewise, mode;
          var cmSel;
          if (vim.visualMode) {
            // Init visual op
            curStart = cursorMin(sel.head, sel.anchor);
            curEnd = cursorMax(sel.head, sel.anchor);
            linewise = vim.visualLine || operatorArgs.linewise;
            mode = vim.visualBlock ? 'block' :
                   linewise ? 'line' :
                   'char';
            cmSel = makeCmSelection(cm, {
              anchor: curStart,
              head: curEnd
            }, mode);
            if (linewise) {
              var ranges = cmSel.ranges;
              if (mode == 'block') {
                // Linewise operators in visual block mode extend to end of line
                for (var i = 0; i < ranges.length; i++) {
                  ranges[i].head.ch = lineLength(cm, ranges[i].head.line);
                }
              } else if (mode == 'line') {
                ranges[0].head = Pos(ranges[0].head.line + 1, 0);
              }
            }
          } else {
            // Init motion op
            curStart = copyCursor(newAnchor || oldAnchor);
            curEnd = copyCursor(newHead || oldHead);
            if (cursorIsBefore(curEnd, curStart)) {
              var tmp = curStart;
              curStart = curEnd;
              curEnd = tmp;
            }
            linewise = motionArgs.linewise || operatorArgs.linewise;
            if (linewise) {
              // Expand selection to entire line.
              expandSelectionToLine(cm, curStart, curEnd);
            } else if (motionArgs.forward) {
              // Clip to trailing newlines only if the motion goes forward.
              clipToLine(cm, curStart, curEnd);
            }
            mode = 'char';
            var exclusive = !motionArgs.inclusive || linewise;
            cmSel = makeCmSelection(cm, {
              anchor: curStart,
              head: curEnd
            }, mode, exclusive);
          }
          cm.setSelections(cmSel.ranges, cmSel.primary);
          vim.lastMotion = null;
          operatorArgs.repeat = repeat; // For indent in visual mode.
          operatorArgs.registerName = registerName;
          // Keep track of linewise as it affects how paste and change behave.
          operatorArgs.linewise = linewise;
          var operatorMoveTo = operators[operator](
            cm, operatorArgs, cmSel.ranges, oldAnchor, newHead);
          if (vim.visualMode) {
            exitVisualMode(cm, operatorMoveTo != null);
          }
          if (operatorMoveTo) {
            cm.setCursor(operatorMoveTo);
          }
        }
      },
      recordLastEdit: function(vim, inputState, actionCommand) {
        var macroModeState = vimGlobalState.macroModeState;
        if (macroModeState.isPlaying) { return; }
        vim.lastEditInputState = inputState;
        vim.lastEditActionCommand = actionCommand;
        macroModeState.lastInsertModeChanges.changes = [];
        macroModeState.lastInsertModeChanges.expectCursorActivityForChange = false;
        macroModeState.lastInsertModeChanges.visualBlock = vim.visualBlock ? vim.sel.head.line - vim.sel.anchor.line : 0;
      }
    };

    /**
     * typedef {Object{line:number,ch:number}} Cursor An object containing the
     *     position of the cursor.
     */
    // All of the functions below return Cursor objects.
    var motions = {
      moveToTopLine: function(cm, _head, motionArgs) {
        var line = getUserVisibleLines(cm).top + motionArgs.repeat -1;
        return Pos(line, findFirstNonWhiteSpaceCharacter(cm.getLine(line)));
      },
      moveToMiddleLine: function(cm) {
        var range = getUserVisibleLines(cm);
        var line = Math.floor((range.top + range.bottom) * 0.5);
        return Pos(line, findFirstNonWhiteSpaceCharacter(cm.getLine(line)));
      },
      moveToBottomLine: function(cm, _head, motionArgs) {
        var line = getUserVisibleLines(cm).bottom - motionArgs.repeat +1;
        return Pos(line, findFirstNonWhiteSpaceCharacter(cm.getLine(line)));
      },
      expandToLine: function(_cm, head, motionArgs) {
        // Expands forward to end of line, and then to next line if repeat is
        // >1. Does not handle backward motion!
        var cur = head;
        return Pos(cur.line + motionArgs.repeat - 1, Infinity);
      },
      findNext: function(cm, _head, motionArgs) {
        var state = getSearchState(cm);
        var query = state.getQuery();
        if (!query) {
          return;
        }
        var prev = !motionArgs.forward;
        // If search is initiated with ? instead of /, negate direction.
        prev = (state.isReversed()) ? !prev : prev;
        highlightSearchMatches(cm, query);
        return findNext(cm, prev/** prev */, query, motionArgs.repeat);
      },
      goToMark: function(cm, _head, motionArgs, vim) {
        var pos = getMarkPos(cm, vim, motionArgs.selectedCharacter);
        if (pos) {
          return motionArgs.linewise ? { line: pos.line, ch: findFirstNonWhiteSpaceCharacter(cm.getLine(pos.line)) } : pos;
        }
        return null;
      },
      moveToOtherHighlightedEnd: function(cm, _head, motionArgs, vim) {
        if (vim.visualBlock && motionArgs.sameLine) {
          var sel = vim.sel;
          return [
            clipCursorToContent(cm, Pos(sel.anchor.line, sel.head.ch)),
            clipCursorToContent(cm, Pos(sel.head.line, sel.anchor.ch))
          ];
        } else {
          return ([vim.sel.head, vim.sel.anchor]);
        }
      },
      jumpToMark: function(cm, head, motionArgs, vim) {
        var best = head;
        for (var i = 0; i < motionArgs.repeat; i++) {
          var cursor = best;
          for (var key in vim.marks) {
            if (!isLowerCase(key)) {
              continue;
            }
            var mark = vim.marks[key].find();
            var isWrongDirection = (motionArgs.forward) ?
              cursorIsBefore(mark, cursor) : cursorIsBefore(cursor, mark);

            if (isWrongDirection) {
              continue;
            }
            if (motionArgs.linewise && (mark.line == cursor.line)) {
              continue;
            }

            var equal = cursorEqual(cursor, best);
            var between = (motionArgs.forward) ?
              cursorIsBetween(cursor, mark, best) :
              cursorIsBetween(best, mark, cursor);

            if (equal || between) {
              best = mark;
            }
          }
        }

        if (motionArgs.linewise) {
          // Vim places the cursor on the first non-whitespace character of
          // the line if there is one, else it places the cursor at the end
          // of the line, regardless of whether a mark was found.
          best = Pos(best.line, findFirstNonWhiteSpaceCharacter(cm.getLine(best.line)));
        }
        return best;
      },
      moveByCharacters: function(_cm, head, motionArgs) {
        var cur = head;
        var repeat = motionArgs.repeat;
        var ch = motionArgs.forward ? cur.ch + repeat : cur.ch - repeat;
        return Pos(cur.line, ch);
      },
      moveByLines: function(cm, head, motionArgs, vim) {
        var cur = head;
        var endCh = cur.ch;
        // Depending what our last motion was, we may want to do different
        // things. If our last motion was moving vertically, we want to
        // preserve the HPos from our last horizontal move.  If our last motion
        // was going to the end of a line, moving vertically we should go to
        // the end of the line, etc.
        switch (vim.lastMotion) {
          case this.moveByLines:
          case this.moveByDisplayLines:
          case this.moveByScroll:
          case this.moveToColumn:
          case this.moveToEol:
            endCh = vim.lastHPos;
            break;
          default:
            vim.lastHPos = endCh;
        }
        var repeat = motionArgs.repeat+(motionArgs.repeatOffset||0);
        var line = motionArgs.forward ? cur.line + repeat : cur.line - repeat;
        var first = cm.firstLine();
        var last = cm.lastLine();
        var posV = cm.findPosV(cur, (motionArgs.forward ? repeat : -repeat), 'line', vim.lastHSPos);
        var hasMarkedText = motionArgs.forward ? posV.line > line : posV.line < line;
        if (hasMarkedText) {
          line = posV.line;
          endCh = posV.ch;
        }
        // Vim go to line begin or line end when cursor at first/last line and
        // move to previous/next line is triggered.
        if (line < first && cur.line == first){
          return this.moveToStartOfLine(cm, head, motionArgs, vim);
        }else if (line > last && cur.line == last){
            return this.moveToEol(cm, head, motionArgs, vim, true);
        }
        if (motionArgs.toFirstChar){
          endCh=findFirstNonWhiteSpaceCharacter(cm.getLine(line));
          vim.lastHPos = endCh;
        }
        vim.lastHSPos = cm.charCoords(Pos(line, endCh),'div').left;
        return Pos(line, endCh);
      },
      moveByDisplayLines: function(cm, head, motionArgs, vim) {
        var cur = head;
        switch (vim.lastMotion) {
          case this.moveByDisplayLines:
          case this.moveByScroll:
          case this.moveByLines:
          case this.moveToColumn:
          case this.moveToEol:
            break;
          default:
            vim.lastHSPos = cm.charCoords(cur,'div').left;
        }
        var repeat = motionArgs.repeat;
        var res=cm.findPosV(cur,(motionArgs.forward ? repeat : -repeat),'line',vim.lastHSPos);
        if (res.hitSide) {
          if (motionArgs.forward) {
            var lastCharCoords = cm.charCoords(res, 'div');
            var goalCoords = { top: lastCharCoords.top + 8, left: vim.lastHSPos };
            var res = cm.coordsChar(goalCoords, 'div');
          } else {
            var resCoords = cm.charCoords(Pos(cm.firstLine(), 0), 'div');
            resCoords.left = vim.lastHSPos;
            res = cm.coordsChar(resCoords, 'div');
          }
        }
        vim.lastHPos = res.ch;
        return res;
      },
      moveByPage: function(cm, head, motionArgs) {
        // CodeMirror only exposes functions that move the cursor page down, so
        // doing this bad hack to move the cursor and move it back. evalInput
        // will move the cursor to where it should be in the end.
        var curStart = head;
        var repeat = motionArgs.repeat;
        return cm.findPosV(curStart, (motionArgs.forward ? repeat : -repeat), 'page');
      },
      moveByParagraph: function(cm, head, motionArgs) {
        var dir = motionArgs.forward ? 1 : -1;
        return findParagraph(cm, head, motionArgs.repeat, dir);
      },
      moveBySentence: function(cm, head, motionArgs) {
        var dir = motionArgs.forward ? 1 : -1;
        return findSentence(cm, head, motionArgs.repeat, dir);
      },
      moveByScroll: function(cm, head, motionArgs, vim) {
        var scrollbox = cm.getScrollInfo();
        var curEnd = null;
        var repeat = motionArgs.repeat;
        if (!repeat) {
          repeat = scrollbox.clientHeight / (2 * cm.defaultTextHeight());
        }
        var orig = cm.charCoords(head, 'local');
        motionArgs.repeat = repeat;
        var curEnd = motions.moveByDisplayLines(cm, head, motionArgs, vim);
        if (!curEnd) {
          return null;
        }
        var dest = cm.charCoords(curEnd, 'local');
        cm.scrollTo(null, scrollbox.top + dest.top - orig.top);
        return curEnd;
      },
      moveByWords: function(cm, head, motionArgs) {
        return moveToWord(cm, head, motionArgs.repeat, !!motionArgs.forward,
            !!motionArgs.wordEnd, !!motionArgs.bigWord);
      },
      moveTillCharacter: function(cm, _head, motionArgs) {
        var repeat = motionArgs.repeat;
        var curEnd = moveToCharacter(cm, repeat, motionArgs.forward,
            motionArgs.selectedCharacter);
        var increment = motionArgs.forward ? -1 : 1;
        recordLastCharacterSearch(increment, motionArgs);
        if (!curEnd) return null;
        curEnd.ch += increment;
        return curEnd;
      },
      moveToCharacter: function(cm, head, motionArgs) {
        var repeat = motionArgs.repeat;
        recordLastCharacterSearch(0, motionArgs);
        return moveToCharacter(cm, repeat, motionArgs.forward,
            motionArgs.selectedCharacter) || head;
      },
      moveToSymbol: function(cm, head, motionArgs) {
        var repeat = motionArgs.repeat;
        return findSymbol(cm, repeat, motionArgs.forward,
            motionArgs.selectedCharacter) || head;
      },
      moveToColumn: function(cm, head, motionArgs, vim) {
        var repeat = motionArgs.repeat;
        // repeat is equivalent to which column we want to move to!
        vim.lastHPos = repeat - 1;
        vim.lastHSPos = cm.charCoords(head,'div').left;
        return moveToColumn(cm, repeat);
      },
      moveToEol: function(cm, head, motionArgs, vim, keepHPos) {
        var cur = head;
        var retval= Pos(cur.line + motionArgs.repeat - 1, Infinity);
        var end=cm.clipPos(retval);
        end.ch--;
        if (!keepHPos) {
          vim.lastHPos = Infinity;
          vim.lastHSPos = cm.charCoords(end,'div').left;
        }
        return retval;
      },
      moveToFirstNonWhiteSpaceCharacter: function(cm, head) {
        // Go to the start of the line where the text begins, or the end for
        // whitespace-only lines
        var cursor = head;
        return Pos(cursor.line,
                   findFirstNonWhiteSpaceCharacter(cm.getLine(cursor.line)));
      },
      moveToMatchedSymbol: function(cm, head) {
        var cursor = head;
        var line = cursor.line;
        var ch = cursor.ch;
        var lineText = cm.getLine(line);
        var symbol;
        for (; ch < lineText.length; ch++) {
          symbol = lineText.charAt(ch);
          if (symbol && isMatchableSymbol(symbol)) {
            var style = cm.getTokenTypeAt(Pos(line, ch + 1));
            if (style !== "string" && style !== "comment") {
              break;
            }
          }
        }
        if (ch < lineText.length) {
          // Only include angle brackets in analysis if they are being matched.
          var re = (ch === '<' || ch === '>') ? /[(){}[\]<>]/ : /[(){}[\]]/;
          var matched = cm.findMatchingBracket(Pos(line, ch), {bracketRegex: re});
          return matched.to;
        } else {
          return cursor;
        }
      },
      moveToStartOfLine: function(_cm, head) {
        return Pos(head.line, 0);
      },
      moveToLineOrEdgeOfDocument: function(cm, _head, motionArgs) {
        var lineNum = motionArgs.forward ? cm.lastLine() : cm.firstLine();
        if (motionArgs.repeatIsExplicit) {
          lineNum = motionArgs.repeat - cm.getOption('firstLineNumber');
        }
        return Pos(lineNum,
                   findFirstNonWhiteSpaceCharacter(cm.getLine(lineNum)));
      },
      textObjectManipulation: function(cm, head, motionArgs, vim) {
        // TODO: lots of possible exceptions that can be thrown here. Try da(
        //     outside of a () block.
        var mirroredPairs = {'(': ')', ')': '(',
                             '{': '}', '}': '{',
                             '[': ']', ']': '[',
                             '<': '>', '>': '<'};
        var selfPaired = {'\'': true, '"': true, '`': true};

        var character = motionArgs.selectedCharacter;
        // 'b' refers to  '()' block.
        // 'B' refers to  '{}' block.
        if (character == 'b') {
          character = '(';
        } else if (character == 'B') {
          character = '{';
        }

        // Inclusive is the difference between a and i
        // TODO: Instead of using the additional text object map to perform text
        //     object operations, merge the map into the defaultKeyMap and use
        //     motionArgs to define behavior. Define separate entries for 'aw',
        //     'iw', 'a[', 'i[', etc.
        var inclusive = !motionArgs.textObjectInner;

        var tmp;
        if (mirroredPairs[character]) {
          tmp = selectCompanionObject(cm, head, character, inclusive);
        } else if (selfPaired[character]) {
          tmp = findBeginningAndEnd(cm, head, character, inclusive);
        } else if (character === 'W') {
          tmp = expandWordUnderCursor(cm, inclusive, true /** forward */,
                                                     true /** bigWord */);
        } else if (character === 'w') {
          tmp = expandWordUnderCursor(cm, inclusive, true /** forward */,
                                                     false /** bigWord */);
        } else if (character === 'p') {
          tmp = findParagraph(cm, head, motionArgs.repeat, 0, inclusive);
          motionArgs.linewise = true;
          if (vim.visualMode) {
            if (!vim.visualLine) { vim.visualLine = true; }
          } else {
            var operatorArgs = vim.inputState.operatorArgs;
            if (operatorArgs) { operatorArgs.linewise = true; }
            tmp.end.line--;
          }
        } else {
          // No text object defined for this, don't move.
          return null;
        }

        if (!cm.state.vim.visualMode) {
          return [tmp.start, tmp.end];
        } else {
          return expandSelection(cm, tmp.start, tmp.end);
        }
      },

      repeatLastCharacterSearch: function(cm, head, motionArgs) {
        var lastSearch = vimGlobalState.lastCharacterSearch;
        var repeat = motionArgs.repeat;
        var forward = motionArgs.forward === lastSearch.forward;
        var increment = (lastSearch.increment ? 1 : 0) * (forward ? -1 : 1);
        cm.moveH(-increment, 'char');
        motionArgs.inclusive = forward ? true : false;
        var curEnd = moveToCharacter(cm, repeat, forward, lastSearch.selectedCharacter);
        if (!curEnd) {
          cm.moveH(increment, 'char');
          return head;
        }
        curEnd.ch += increment;
        return curEnd;
      }
    };

    function defineMotion(name, fn) {
      motions[name] = fn;
    }

    function fillArray(val, times) {
      var arr = [];
      for (var i = 0; i < times; i++) {
        arr.push(val);
      }
      return arr;
    }
    /**
     * An operator acts on a text selection. It receives the list of selections
     * as input. The corresponding CodeMirror selection is guaranteed to
    * match the input selection.
     */
    var operators = {
      change: function(cm, args, ranges) {
        var finalHead, text;
        var vim = cm.state.vim;
        var anchor = ranges[0].anchor,
            head = ranges[0].head;
        if (!vim.visualMode) {
          text = cm.getRange(anchor, head);
          var lastState = vim.lastEditInputState || {};
          if (lastState.motion == "moveByWords" && !isWhiteSpaceString(text)) {
            // Exclude trailing whitespace if the range is not all whitespace.
            var match = (/\s+$/).exec(text);
            if (match && lastState.motionArgs && lastState.motionArgs.forward) {
              head = offsetCursor(head, 0, - match[0].length);
              text = text.slice(0, - match[0].length);
            }
          }
          var prevLineEnd = new Pos(anchor.line - 1, Number.MAX_VALUE);
          var wasLastLine = cm.firstLine() == cm.lastLine();
          if (head.line > cm.lastLine() && args.linewise && !wasLastLine) {
            cm.replaceRange('', prevLineEnd, head);
          } else {
            cm.replaceRange('', anchor, head);
          }
          if (args.linewise) {
            // Push the next line back down, if there is a next line.
            if (!wasLastLine) {
              cm.setCursor(prevLineEnd);
              CodeMirror.commands.newlineAndIndent(cm);
            }
            // make sure cursor ends up at the end of the line.
            anchor.ch = Number.MAX_VALUE;
          }
          finalHead = anchor;
        } else if (args.fullLine) {
            head.ch = Number.MAX_VALUE;
            head.line--;
            cm.setSelection(anchor, head)
            text = cm.getSelection();
            cm.replaceSelection("");
            finalHead = anchor;
        } else {
          text = cm.getSelection();
          var replacement = fillArray('', ranges.length);
          cm.replaceSelections(replacement);
          finalHead = cursorMin(ranges[0].head, ranges[0].anchor);
        }
        vimGlobalState.registerController.pushText(
            args.registerName, 'change', text,
            args.linewise, ranges.length > 1);
        actions.enterInsertMode(cm, {head: finalHead}, cm.state.vim);
      },
      // delete is a javascript keyword.
      'delete': function(cm, args, ranges) {
        var finalHead, text;
        var vim = cm.state.vim;
        if (!vim.visualBlock) {
          var anchor = ranges[0].anchor,
              head = ranges[0].head;
          if (args.linewise &&
              head.line != cm.firstLine() &&
              anchor.line == cm.lastLine() &&
              anchor.line == head.line - 1) {
            // Special case for dd on last line (and first line).
            if (anchor.line == cm.firstLine()) {
              anchor.ch = 0;
            } else {
              anchor = Pos(anchor.line - 1, lineLength(cm, anchor.line - 1));
            }
          }
          text = cm.getRange(anchor, head);
          cm.replaceRange('', anchor, head);
          finalHead = anchor;
          if (args.linewise) {
            finalHead = motions.moveToFirstNonWhiteSpaceCharacter(cm, anchor);
          }
        } else {
          text = cm.getSelection();
          var replacement = fillArray('', ranges.length);
          cm.replaceSelections(replacement);
          finalHead = ranges[0].anchor;
        }
        vimGlobalState.registerController.pushText(
            args.registerName, 'delete', text,
            args.linewise, vim.visualBlock);
        return clipCursorToContent(cm, finalHead);
      },
      indent: function(cm, args, ranges) {
        var vim = cm.state.vim;
        var startLine = ranges[0].anchor.line;
        var endLine = vim.visualBlock ?
          ranges[ranges.length - 1].anchor.line :
          ranges[0].head.line;
        // In visual mode, n> shifts the selection right n times, instead of
        // shifting n lines right once.
        var repeat = (vim.visualMode) ? args.repeat : 1;
        if (args.linewise) {
          // The only way to delete a newline is to delete until the start of
          // the next line, so in linewise mode evalInput will include the next
          // line. We don't want this in indent, so we go back a line.
          endLine--;
        }
        for (var i = startLine; i <= endLine; i++) {
          for (var j = 0; j < repeat; j++) {
            cm.indentLine(i, args.indentRight);
          }
        }
        return motions.moveToFirstNonWhiteSpaceCharacter(cm, ranges[0].anchor);
      },
      indentAuto: function(cm, _args, ranges) {
        cm.execCommand("indentAuto");
        return motions.moveToFirstNonWhiteSpaceCharacter(cm, ranges[0].anchor);
      },
      changeCase: function(cm, args, ranges, oldAnchor, newHead) {
        var selections = cm.getSelections();
        var swapped = [];
        var toLower = args.toLower;
        for (var j = 0; j < selections.length; j++) {
          var toSwap = selections[j];
          var text = '';
          if (toLower === true) {
            text = toSwap.toLowerCase();
          } else if (toLower === false) {
            text = toSwap.toUpperCase();
          } else {
            for (var i = 0; i < toSwap.length; i++) {
              var character = toSwap.charAt(i);
              text += isUpperCase(character) ? character.toLowerCase() :
                  character.toUpperCase();
            }
          }
          swapped.push(text);
        }
        cm.replaceSelections(swapped);
        if (args.shouldMoveCursor){
          return newHead;
        } else if (!cm.state.vim.visualMode && args.linewise && ranges[0].anchor.line + 1 == ranges[0].head.line) {
          return motions.moveToFirstNonWhiteSpaceCharacter(cm, oldAnchor);
        } else if (args.linewise){
          return oldAnchor;
        } else {
          return cursorMin(ranges[0].anchor, ranges[0].head);
        }
      },
      yank: function(cm, args, ranges, oldAnchor) {
        var vim = cm.state.vim;
        var text = cm.getSelection();
        var endPos = vim.visualMode
          ? cursorMin(vim.sel.anchor, vim.sel.head, ranges[0].head, ranges[0].anchor)
          : oldAnchor;
        vimGlobalState.registerController.pushText(
            args.registerName, 'yank',
            text, args.linewise, vim.visualBlock);
        return endPos;
      }
    };

    function defineOperator(name, fn) {
      operators[name] = fn;
    }

    var actions = {
      jumpListWalk: function(cm, actionArgs, vim) {
        if (vim.visualMode) {
          return;
        }
        var repeat = actionArgs.repeat;
        var forward = actionArgs.forward;
        var jumpList = vimGlobalState.jumpList;

        var mark = jumpList.move(cm, forward ? repeat : -repeat);
        var markPos = mark ? mark.find() : undefined;
        markPos = markPos ? markPos : cm.getCursor();
        cm.setCursor(markPos);
      },
      scroll: function(cm, actionArgs, vim) {
        if (vim.visualMode) {
          return;
        }
        var repeat = actionArgs.repeat || 1;
        var lineHeight = cm.defaultTextHeight();
        var top = cm.getScrollInfo().top;
        var delta = lineHeight * repeat;
        var newPos = actionArgs.forward ? top + delta : top - delta;
        var cursor = copyCursor(cm.getCursor());
        var cursorCoords = cm.charCoords(cursor, 'local');
        if (actionArgs.forward) {
          if (newPos > cursorCoords.top) {
             cursor.line += (newPos - cursorCoords.top) / lineHeight;
             cursor.line = Math.ceil(cursor.line);
             cm.setCursor(cursor);
             cursorCoords = cm.charCoords(cursor, 'local');
             cm.scrollTo(null, cursorCoords.top);
          } else {
             // Cursor stays within bounds.  Just reposition the scroll window.
             cm.scrollTo(null, newPos);
          }
        } else {
          var newBottom = newPos + cm.getScrollInfo().clientHeight;
          if (newBottom < cursorCoords.bottom) {
             cursor.line -= (cursorCoords.bottom - newBottom) / lineHeight;
             cursor.line = Math.floor(cursor.line);
             cm.setCursor(cursor);
             cursorCoords = cm.charCoords(cursor, 'local');
             cm.scrollTo(
                 null, cursorCoords.bottom - cm.getScrollInfo().clientHeight);
          } else {
             // Cursor stays within bounds.  Just reposition the scroll window.
             cm.scrollTo(null, newPos);
          }
        }
      },
      scrollToCursor: function(cm, actionArgs) {
        var lineNum = cm.getCursor().line;
        var charCoords = cm.charCoords(Pos(lineNum, 0), 'local');
        var height = cm.getScrollInfo().clientHeight;
        var y = charCoords.top;
        var lineHeight = charCoords.bottom - y;
        switch (actionArgs.position) {
          case 'center': y = y - (height / 2) + lineHeight;
            break;
          case 'bottom': y = y - height + lineHeight;
            break;
        }
        cm.scrollTo(null, y);
      },
      replayMacro: function(cm, actionArgs, vim) {
        var registerName = actionArgs.selectedCharacter;
        var repeat = actionArgs.repeat;
        var macroModeState = vimGlobalState.macroModeState;
        if (registerName == '@') {
          registerName = macroModeState.latestRegister;
        } else {
          macroModeState.latestRegister = registerName;
        }
        while(repeat--){
          executeMacroRegister(cm, vim, macroModeState, registerName);
        }
      },
      enterMacroRecordMode: function(cm, actionArgs) {
        var macroModeState = vimGlobalState.macroModeState;
        var registerName = actionArgs.selectedCharacter;
        if (vimGlobalState.registerController.isValidRegister(registerName)) {
          macroModeState.enterMacroRecordMode(cm, registerName);
        }
      },
      toggleOverwrite: function(cm) {
        if (!cm.state.overwrite) {
          cm.toggleOverwrite(true);
          cm.setOption('keyMap', 'vim-replace');
          CodeMirror.signal(cm, "vim-mode-change", {mode: "replace"});
        } else {
          cm.toggleOverwrite(false);
          cm.setOption('keyMap', 'vim-insert');
          CodeMirror.signal(cm, "vim-mode-change", {mode: "insert"});
        }
      },
      enterInsertMode: function(cm, actionArgs, vim) {
        if (cm.getOption('readOnly')) { return; }
        vim.insertMode = true;
        vim.insertModeRepeat = actionArgs && actionArgs.repeat || 1;
        var insertAt = (actionArgs) ? actionArgs.insertAt : null;
        var sel = vim.sel;
        var head = actionArgs.head || cm.getCursor('head');
        var height = cm.listSelections().length;
        if (insertAt == 'eol') {
          head = Pos(head.line, lineLength(cm, head.line));
        } else if (insertAt == 'bol') {
          head = Pos(head.line, 0);
        } else if (insertAt == 'charAfter') {
          head = offsetCursor(head, 0, 1);
        } else if (insertAt == 'firstNonBlank') {
          head = motions.moveToFirstNonWhiteSpaceCharacter(cm, head);
        } else if (insertAt == 'startOfSelectedArea') {
          if (!vim.visualMode)
              return;
          if (!vim.visualBlock) {
            if (sel.head.line < sel.anchor.line) {
              head = sel.head;
            } else {
              head = Pos(sel.anchor.line, 0);
            }
          } else {
            head = Pos(
                Math.min(sel.head.line, sel.anchor.line),
                Math.min(sel.head.ch, sel.anchor.ch));
            height = Math.abs(sel.head.line - sel.anchor.line) + 1;
          }
        } else if (insertAt == 'endOfSelectedArea') {
            if (!vim.visualMode)
              return;
          if (!vim.visualBlock) {
            if (sel.head.line >= sel.anchor.line) {
              head = offsetCursor(sel.head, 0, 1);
            } else {
              head = Pos(sel.anchor.line, 0);
            }
          } else {
            head = Pos(
                Math.min(sel.head.line, sel.anchor.line),
                Math.max(sel.head.ch + 1, sel.anchor.ch));
            height = Math.abs(sel.head.line - sel.anchor.line) + 1;
          }
        } else if (insertAt == 'inplace') {
          if (vim.visualMode){
            return;
          }
        } else if (insertAt == 'lastEdit') {
          head = getLastEditPos(cm) || head;
        }
        cm.setOption('disableInput', false);
        if (actionArgs && actionArgs.replace) {
          // Handle Replace-mode as a special case of insert mode.
          cm.toggleOverwrite(true);
          cm.setOption('keyMap', 'vim-replace');
          CodeMirror.signal(cm, "vim-mode-change", {mode: "replace"});
        } else {
          cm.toggleOverwrite(false);
          cm.setOption('keyMap', 'vim-insert');
          CodeMirror.signal(cm, "vim-mode-change", {mode: "insert"});
        }
        if (!vimGlobalState.macroModeState.isPlaying) {
          // Only record if not replaying.
          cm.on('change', onChange);
          CodeMirror.on(cm.getInputField(), 'keydown', onKeyEventTargetKeyDown);
        }
        if (vim.visualMode) {
          exitVisualMode(cm);
        }
        selectForInsert(cm, head, height);
      },
      toggleVisualMode: function(cm, actionArgs, vim) {
        var repeat = actionArgs.repeat;
        var anchor = cm.getCursor();
        var head;
        // TODO: The repeat should actually select number of characters/lines
        //     equal to the repeat times the size of the previous visual
        //     operation.
        if (!vim.visualMode) {
          // Entering visual mode
          vim.visualMode = true;
          vim.visualLine = !!actionArgs.linewise;
          vim.visualBlock = !!actionArgs.blockwise;
          head = clipCursorToContent(
              cm, Pos(anchor.line, anchor.ch + repeat - 1));
          vim.sel = {
            anchor: anchor,
            head: head
          };
          CodeMirror.signal(cm, "vim-mode-change", {mode: "visual", subMode: vim.visualLine ? "linewise" : vim.visualBlock ? "blockwise" : ""});
          updateCmSelection(cm);
          updateMark(cm, vim, '<', cursorMin(anchor, head));
          updateMark(cm, vim, '>', cursorMax(anchor, head));
        } else if (vim.visualLine ^ actionArgs.linewise ||
            vim.visualBlock ^ actionArgs.blockwise) {
          // Toggling between modes
          vim.visualLine = !!actionArgs.linewise;
          vim.visualBlock = !!actionArgs.blockwise;
          CodeMirror.signal(cm, "vim-mode-change", {mode: "visual", subMode: vim.visualLine ? "linewise" : vim.visualBlock ? "blockwise" : ""});
          updateCmSelection(cm);
        } else {
          exitVisualMode(cm);
        }
      },
      reselectLastSelection: function(cm, _actionArgs, vim) {
        var lastSelection = vim.lastSelection;
        if (vim.visualMode) {
          updateLastSelection(cm, vim);
        }
        if (lastSelection) {
          var anchor = lastSelection.anchorMark.find();
          var head = lastSelection.headMark.find();
          if (!anchor || !head) {
            // If the marks have been destroyed due to edits, do nothing.
            return;
          }
          vim.sel = {
            anchor: anchor,
            head: head
          };
          vim.visualMode = true;
          vim.visualLine = lastSelection.visualLine;
          vim.visualBlock = lastSelection.visualBlock;
          updateCmSelection(cm);
          updateMark(cm, vim, '<', cursorMin(anchor, head));
          updateMark(cm, vim, '>', cursorMax(anchor, head));
          CodeMirror.signal(cm, 'vim-mode-change', {
            mode: 'visual',
            subMode: vim.visualLine ? 'linewise' :
                     vim.visualBlock ? 'blockwise' : ''});
        }
      },
      joinLines: function(cm, actionArgs, vim) {
        var curStart, curEnd;
        if (vim.visualMode) {
          curStart = cm.getCursor('anchor');
          curEnd = cm.getCursor('head');
          if (cursorIsBefore(curEnd, curStart)) {
            var tmp = curEnd;
            curEnd = curStart;
            curStart = tmp;
          }
          curEnd.ch = lineLength(cm, curEnd.line) - 1;
        } else {
          // Repeat is the number of lines to join. Minimum 2 lines.
          var repeat = Math.max(actionArgs.repeat, 2);
          curStart = cm.getCursor();
          curEnd = clipCursorToContent(cm, Pos(curStart.line + repeat - 1,
                                               Infinity));
        }
        var finalCh = 0;
        for (var i = curStart.line; i < curEnd.line; i++) {
          finalCh = lineLength(cm, curStart.line);
          var tmp = Pos(curStart.line + 1,
                        lineLength(cm, curStart.line + 1));
          var text = cm.getRange(curStart, tmp);
          text = actionArgs.keepSpaces
            ? text.replace(/\n\r?/g, '')
            : text.replace(/\n\s*/g, ' ');
          cm.replaceRange(text, curStart, tmp);
        }
        var curFinalPos = Pos(curStart.line, finalCh);
        if (vim.visualMode) {
          exitVisualMode(cm, false);
        }
        cm.setCursor(curFinalPos);
      },
      newLineAndEnterInsertMode: function(cm, actionArgs, vim) {
        vim.insertMode = true;
        var insertAt = copyCursor(cm.getCursor());
        if (insertAt.line === cm.firstLine() && !actionArgs.after) {
          // Special case for inserting newline before start of document.
          cm.replaceRange('\n', Pos(cm.firstLine(), 0));
          cm.setCursor(cm.firstLine(), 0);
        } else {
          insertAt.line = (actionArgs.after) ? insertAt.line :
              insertAt.line - 1;
          insertAt.ch = lineLength(cm, insertAt.line);
          cm.setCursor(insertAt);
          var newlineFn = CodeMirror.commands.newlineAndIndentContinueComment ||
              CodeMirror.commands.newlineAndIndent;
          newlineFn(cm);
        }
        this.enterInsertMode(cm, { repeat: actionArgs.repeat }, vim);
      },
      paste: function(cm, actionArgs, vim) {
        var cur = copyCursor(cm.getCursor());
        var register = vimGlobalState.registerController.getRegister(
            actionArgs.registerName);
        var text = register.toString();
        if (!text) {
          return;
        }
        if (actionArgs.matchIndent) {
          var tabSize = cm.getOption("tabSize");
          // length that considers tabs and tabSize
          var whitespaceLength = function(str) {
            var tabs = (str.split("\t").length - 1);
            var spaces = (str.split(" ").length - 1);
            return tabs * tabSize + spaces * 1;
          };
          var currentLine = cm.getLine(cm.getCursor().line);
          var indent = whitespaceLength(currentLine.match(/^\s*/)[0]);
          // chomp last newline b/c don't want it to match /^\s*/gm
          var chompedText = text.replace(/\n$/, '');
          var wasChomped = text !== chompedText;
          var firstIndent = whitespaceLength(text.match(/^\s*/)[0]);
          var text = chompedText.replace(/^\s*/gm, function(wspace) {
            var newIndent = indent + (whitespaceLength(wspace) - firstIndent);
            if (newIndent < 0) {
              return "";
            }
            else if (cm.getOption("indentWithTabs")) {
              var quotient = Math.floor(newIndent / tabSize);
              return Array(quotient + 1).join('\t');
            }
            else {
              return Array(newIndent + 1).join(' ');
            }
          });
          text += wasChomped ? "\n" : "";
        }
        if (actionArgs.repeat > 1) {
          var text = Array(actionArgs.repeat + 1).join(text);
        }
        var linewise = register.linewise;
        var blockwise = register.blockwise;
        if (blockwise) {
          text = text.split('\n');
          if (linewise) {
              text.pop();
          }
          for (var i = 0; i < text.length; i++) {
            text[i] = (text[i] == '') ? ' ' : text[i];
          }
          cur.ch += actionArgs.after ? 1 : 0;
          cur.ch = Math.min(lineLength(cm, cur.line), cur.ch);
        } else if (linewise) {
          if(vim.visualMode) {
            text = vim.visualLine ? text.slice(0, -1) : '\n' + text.slice(0, text.length - 1) + '\n';
          } else if (actionArgs.after) {
            // Move the newline at the end to the start instead, and paste just
            // before the newline character of the line we are on right now.
            text = '\n' + text.slice(0, text.length - 1);
            cur.ch = lineLength(cm, cur.line);
          } else {
            cur.ch = 0;
          }
        } else {
          cur.ch += actionArgs.after ? 1 : 0;
        }
        var curPosFinal;
        var idx;
        if (vim.visualMode) {
          //  save the pasted text for reselection if the need arises
          vim.lastPastedText = text;
          var lastSelectionCurEnd;
          var selectedArea = getSelectedAreaRange(cm, vim);
          var selectionStart = selectedArea[0];
          var selectionEnd = selectedArea[1];
          var selectedText = cm.getSelection();
          var selections = cm.listSelections();
          var emptyStrings = new Array(selections.length).join('1').split('1');
          // save the curEnd marker before it get cleared due to cm.replaceRange.
          if (vim.lastSelection) {
            lastSelectionCurEnd = vim.lastSelection.headMark.find();
          }
          // push the previously selected text to unnamed register
          vimGlobalState.registerController.unnamedRegister.setText(selectedText);
          if (blockwise) {
            // first delete the selected text
            cm.replaceSelections(emptyStrings);
            // Set new selections as per the block length of the yanked text
            selectionEnd = Pos(selectionStart.line + text.length-1, selectionStart.ch);
            cm.setCursor(selectionStart);
            selectBlock(cm, selectionEnd);
            cm.replaceSelections(text);
            curPosFinal = selectionStart;
          } else if (vim.visualBlock) {
            cm.replaceSelections(emptyStrings);
            cm.setCursor(selectionStart);
            cm.replaceRange(text, selectionStart, selectionStart);
            curPosFinal = selectionStart;
          } else {
            cm.replaceRange(text, selectionStart, selectionEnd);
            curPosFinal = cm.posFromIndex(cm.indexFromPos(selectionStart) + text.length - 1);
          }
          // restore the the curEnd marker
          if(lastSelectionCurEnd) {
            vim.lastSelection.headMark = cm.setBookmark(lastSelectionCurEnd);
          }
          if (linewise) {
            curPosFinal.ch=0;
          }
        } else {
          if (blockwise) {
            cm.setCursor(cur);
            for (var i = 0; i < text.length; i++) {
              var line = cur.line+i;
              if (line > cm.lastLine()) {
                cm.replaceRange('\n',  Pos(line, 0));
              }
              var lastCh = lineLength(cm, line);
              if (lastCh < cur.ch) {
                extendLineToColumn(cm, line, cur.ch);
              }
            }
            cm.setCursor(cur);
            selectBlock(cm, Pos(cur.line + text.length-1, cur.ch));
            cm.replaceSelections(text);
            curPosFinal = cur;
          } else {
            cm.replaceRange(text, cur);
            // Now fine tune the cursor to where we want it.
            if (linewise && actionArgs.after) {
              curPosFinal = Pos(
              cur.line + 1,
              findFirstNonWhiteSpaceCharacter(cm.getLine(cur.line + 1)));
            } else if (linewise && !actionArgs.after) {
              curPosFinal = Pos(
                cur.line,
                findFirstNonWhiteSpaceCharacter(cm.getLine(cur.line)));
            } else if (!linewise && actionArgs.after) {
              idx = cm.indexFromPos(cur);
              curPosFinal = cm.posFromIndex(idx + text.length - 1);
            } else {
              idx = cm.indexFromPos(cur);
              curPosFinal = cm.posFromIndex(idx + text.length);
            }
          }
        }
        if (vim.visualMode) {
          exitVisualMode(cm, false);
        }
        cm.setCursor(curPosFinal);
      },
      undo: function(cm, actionArgs) {
        cm.operation(function() {
          repeatFn(cm, CodeMirror.commands.undo, actionArgs.repeat)();
          cm.setCursor(cm.getCursor('anchor'));
        });
      },
      redo: function(cm, actionArgs) {
        repeatFn(cm, CodeMirror.commands.redo, actionArgs.repeat)();
      },
      setRegister: function(_cm, actionArgs, vim) {
        vim.inputState.registerName = actionArgs.selectedCharacter;
      },
      setMark: function(cm, actionArgs, vim) {
        var markName = actionArgs.selectedCharacter;
        updateMark(cm, vim, markName, cm.getCursor());
      },
      replace: function(cm, actionArgs, vim) {
        var replaceWith = actionArgs.selectedCharacter;
        var curStart = cm.getCursor();
        var replaceTo;
        var curEnd;
        var selections = cm.listSelections();
        if (vim.visualMode) {
          curStart = cm.getCursor('start');
          curEnd = cm.getCursor('end');
        } else {
          var line = cm.getLine(curStart.line);
          replaceTo = curStart.ch + actionArgs.repeat;
          if (replaceTo > line.length) {
            replaceTo=line.length;
          }
          curEnd = Pos(curStart.line, replaceTo);
        }
        if (replaceWith=='\n') {
          if (!vim.visualMode) cm.replaceRange('', curStart, curEnd);
          // special case, where vim help says to replace by just one line-break
          (CodeMirror.commands.newlineAndIndentContinueComment || CodeMirror.commands.newlineAndIndent)(cm);
        } else {
          var replaceWithStr = cm.getRange(curStart, curEnd);
          //replace all characters in range by selected, but keep linebreaks
          replaceWithStr = replaceWithStr.replace(/[^\n]/g, replaceWith);
          if (vim.visualBlock) {
            // Tabs are split in visua block before replacing
            var spaces = new Array(cm.getOption("tabSize")+1).join(' ');
            replaceWithStr = cm.getSelection();
            replaceWithStr = replaceWithStr.replace(/\t/g, spaces).replace(/[^\n]/g, replaceWith).split('\n');
            cm.replaceSelections(replaceWithStr);
          } else {
            cm.replaceRange(replaceWithStr, curStart, curEnd);
          }
          if (vim.visualMode) {
            curStart = cursorIsBefore(selections[0].anchor, selections[0].head) ?
                         selections[0].anchor : selections[0].head;
            cm.setCursor(curStart);
            exitVisualMode(cm, false);
          } else {
            cm.setCursor(offsetCursor(curEnd, 0, -1));
          }
        }
      },
      incrementNumberToken: function(cm, actionArgs) {
        var cur = cm.getCursor();
        var lineStr = cm.getLine(cur.line);
        var re = /(-?)(?:(0x)([\da-f]+)|(0b|0|)(\d+))/gi;
        var match;
        var start;
        var end;
        var numberStr;
        while ((match = re.exec(lineStr)) !== null) {
          start = match.index;
          end = start + match[0].length;
          if (cur.ch < end)break;
        }
        if (!actionArgs.backtrack && (end <= cur.ch))return;
        if (match) {
          var baseStr = match[2] || match[4]
          var digits = match[3] || match[5]
          var increment = actionArgs.increase ? 1 : -1;
          var base = {'0b': 2, '0': 8, '': 10, '0x': 16}[baseStr.toLowerCase()];
          var number = parseInt(match[1] + digits, base) + (increment * actionArgs.repeat);
          numberStr = number.toString(base);
          var zeroPadding = baseStr ? new Array(digits.length - numberStr.length + 1 + match[1].length).join('0') : ''
          if (numberStr.charAt(0) === '-') {
            numberStr = '-' + baseStr + zeroPadding + numberStr.substr(1);
          } else {
            numberStr = baseStr + zeroPadding + numberStr;
          }
          var from = Pos(cur.line, start);
          var to = Pos(cur.line, end);
          cm.replaceRange(numberStr, from, to);
        } else {
          return;
        }
        cm.setCursor(Pos(cur.line, start + numberStr.length - 1));
      },
      repeatLastEdit: function(cm, actionArgs, vim) {
        var lastEditInputState = vim.lastEditInputState;
        if (!lastEditInputState) { return; }
        var repeat = actionArgs.repeat;
        if (repeat && actionArgs.repeatIsExplicit) {
          vim.lastEditInputState.repeatOverride = repeat;
        } else {
          repeat = vim.lastEditInputState.repeatOverride || repeat;
        }
        repeatLastEdit(cm, vim, repeat, false /** repeatForInsert */);
      },
      indent: function(cm, actionArgs) {
        cm.indentLine(cm.getCursor().line, actionArgs.indentRight);
      },
      exitInsertMode: exitInsertMode
    };

    function defineAction(name, fn) {
      actions[name] = fn;
    }

    /*
     * Below are miscellaneous utility functions used by vim.js
     */

    /**
     * Clips cursor to ensure that line is within the buffer's range
     * If includeLineBreak is true, then allow cur.ch == lineLength.
     */
    function clipCursorToContent(cm, cur) {
      var vim = cm.state.vim;
      var includeLineBreak = vim.insertMode || vim.visualMode;
      var line = Math.min(Math.max(cm.firstLine(), cur.line), cm.lastLine() );
      var maxCh = lineLength(cm, line) - 1 + !!includeLineBreak;
      var ch = Math.min(Math.max(0, cur.ch), maxCh);
      return Pos(line, ch);
    }
    function copyArgs(args) {
      var ret = {};
      for (var prop in args) {
        if (args.hasOwnProperty(prop)) {
          ret[prop] = args[prop];
        }
      }
      return ret;
    }
    function offsetCursor(cur, offsetLine, offsetCh) {
      if (typeof offsetLine === 'object') {
        offsetCh = offsetLine.ch;
        offsetLine = offsetLine.line;
      }
      return Pos(cur.line + offsetLine, cur.ch + offsetCh);
    }
    function commandMatches(keys, keyMap, context, inputState) {
      // Partial matches are not applied. They inform the key handler
      // that the current key sequence is a subsequence of a valid key
      // sequence, so that the key buffer is not cleared.
      var match, partial = [], full = [];
      for (var i = 0; i < keyMap.length; i++) {
        var command = keyMap[i];
        if (context == 'insert' && command.context != 'insert' ||
            command.context && command.context != context ||
            inputState.operator && command.type == 'action' ||
            !(match = commandMatch(keys, command.keys))) { continue; }
        if (match == 'partial') { partial.push(command); }
        if (match == 'full') { full.push(command); }
      }
      return {
        partial: partial.length && partial,
        full: full.length && full
      };
    }
    function commandMatch(pressed, mapped) {
      if (mapped.slice(-11) == '<character>') {
        // Last character matches anything.
        var prefixLen = mapped.length - 11;
        var pressedPrefix = pressed.slice(0, prefixLen);
        var mappedPrefix = mapped.slice(0, prefixLen);
        return pressedPrefix == mappedPrefix && pressed.length > prefixLen ? 'full' :
               mappedPrefix.indexOf(pressedPrefix) == 0 ? 'partial' : false;
      } else {
        return pressed == mapped ? 'full' :
               mapped.indexOf(pressed) == 0 ? 'partial' : false;
      }
    }
    function lastChar(keys) {
      var match = /^.*(<[^>]+>)$/.exec(keys);
      var selectedCharacter = match ? match[1] : keys.slice(-1);
      if (selectedCharacter.length > 1){
        switch(selectedCharacter){
          case '<CR>':
            selectedCharacter='\n';
            break;
          case '<Space>':
            selectedCharacter=' ';
            break;
          default:
            selectedCharacter='';
            break;
        }
      }
      return selectedCharacter;
    }
    function repeatFn(cm, fn, repeat) {
      return function() {
        for (var i = 0; i < repeat; i++) {
          fn(cm);
        }
      };
    }
    function copyCursor(cur) {
      return Pos(cur.line, cur.ch);
    }
    function cursorEqual(cur1, cur2) {
      return cur1.ch == cur2.ch && cur1.line == cur2.line;
    }
    function cursorIsBefore(cur1, cur2) {
      if (cur1.line < cur2.line) {
        return true;
      }
      if (cur1.line == cur2.line && cur1.ch < cur2.ch) {
        return true;
      }
      return false;
    }
    function cursorMin(cur1, cur2) {
      if (arguments.length > 2) {
        cur2 = cursorMin.apply(undefined, Array.prototype.slice.call(arguments, 1));
      }
      return cursorIsBefore(cur1, cur2) ? cur1 : cur2;
    }
    function cursorMax(cur1, cur2) {
      if (arguments.length > 2) {
        cur2 = cursorMax.apply(undefined, Array.prototype.slice.call(arguments, 1));
      }
      return cursorIsBefore(cur1, cur2) ? cur2 : cur1;
    }
    function cursorIsBetween(cur1, cur2, cur3) {
      // returns true if cur2 is between cur1 and cur3.
      var cur1before2 = cursorIsBefore(cur1, cur2);
      var cur2before3 = cursorIsBefore(cur2, cur3);
      return cur1before2 && cur2before3;
    }
    function lineLength(cm, lineNum) {
      return cm.getLine(lineNum).length;
    }
    function trim(s) {
      if (s.trim) {
        return s.trim();
      }
      return s.replace(/^\s+|\s+$/g, '');
    }
    function escapeRegex(s) {
      return s.replace(/([.?*+$\[\]\/\\(){}|\-])/g, '\\$1');
    }
    function extendLineToColumn(cm, lineNum, column) {
      var endCh = lineLength(cm, lineNum);
      var spaces = new Array(column-endCh+1).join(' ');
      cm.setCursor(Pos(lineNum, endCh));
      cm.replaceRange(spaces, cm.getCursor());
    }
    // This functions selects a rectangular block
    // of text with selectionEnd as any of its corner
    // Height of block:
    // Difference in selectionEnd.line and first/last selection.line
    // Width of the block:
    // Distance between selectionEnd.ch and any(first considered here) selection.ch
    function selectBlock(cm, selectionEnd) {
      var selections = [], ranges = cm.listSelections();
      var head = copyCursor(cm.clipPos(selectionEnd));
      var isClipped = !cursorEqual(selectionEnd, head);
      var curHead = cm.getCursor('head');
      var primIndex = getIndex(ranges, curHead);
      var wasClipped = cursorEqual(ranges[primIndex].head, ranges[primIndex].anchor);
      var max = ranges.length - 1;
      var index = max - primIndex > primIndex ? max : 0;
      var base = ranges[index].anchor;

      var firstLine = Math.min(base.line, head.line);
      var lastLine = Math.max(base.line, head.line);
      var baseCh = base.ch, headCh = head.ch;

      var dir = ranges[index].head.ch - baseCh;
      var newDir = headCh - baseCh;
      if (dir > 0 && newDir <= 0) {
        baseCh++;
        if (!isClipped) { headCh--; }
      } else if (dir < 0 && newDir >= 0) {
        baseCh--;
        if (!wasClipped) { headCh++; }
      } else if (dir < 0 && newDir == -1) {
        baseCh--;
        headCh++;
      }
      for (var line = firstLine; line <= lastLine; line++) {
        var range = {anchor: new Pos(line, baseCh), head: new Pos(line, headCh)};
        selections.push(range);
      }
      cm.setSelections(selections);
      selectionEnd.ch = headCh;
      base.ch = baseCh;
      return base;
    }
    function selectForInsert(cm, head, height) {
      var sel = [];
      for (var i = 0; i < height; i++) {
        var lineHead = offsetCursor(head, i, 0);
        sel.push({anchor: lineHead, head: lineHead});
      }
      cm.setSelections(sel, 0);
    }
    // getIndex returns the index of the cursor in the selections.
    function getIndex(ranges, cursor, end) {
      for (var i = 0; i < ranges.length; i++) {
        var atAnchor = end != 'head' && cursorEqual(ranges[i].anchor, cursor);
        var atHead = end != 'anchor' && cursorEqual(ranges[i].head, cursor);
        if (atAnchor || atHead) {
          return i;
        }
      }
      return -1;
    }
    function getSelectedAreaRange(cm, vim) {
      var lastSelection = vim.lastSelection;
      var getCurrentSelectedAreaRange = function() {
        var selections = cm.listSelections();
        var start =  selections[0];
        var end = selections[selections.length-1];
        var selectionStart = cursorIsBefore(start.anchor, start.head) ? start.anchor : start.head;
        var selectionEnd = cursorIsBefore(end.anchor, end.head) ? end.head : end.anchor;
        return [selectionStart, selectionEnd];
      };
      var getLastSelectedAreaRange = function() {
        var selectionStart = cm.getCursor();
        var selectionEnd = cm.getCursor();
        var block = lastSelection.visualBlock;
        if (block) {
          var width = block.width;
          var height = block.height;
          selectionEnd = Pos(selectionStart.line + height, selectionStart.ch + width);
          var selections = [];
          // selectBlock creates a 'proper' rectangular block.
          // We do not want that in all cases, so we manually set selections.
          for (var i = selectionStart.line; i < selectionEnd.line; i++) {
            var anchor = Pos(i, selectionStart.ch);
            var head = Pos(i, selectionEnd.ch);
            var range = {anchor: anchor, head: head};
            selections.push(range);
          }
          cm.setSelections(selections);
        } else {
          var start = lastSelection.anchorMark.find();
          var end = lastSelection.headMark.find();
          var line = end.line - start.line;
          var ch = end.ch - start.ch;
          selectionEnd = {line: selectionEnd.line + line, ch: line ? selectionEnd.ch : ch + selectionEnd.ch};
          if (lastSelection.visualLine) {
            selectionStart = Pos(selectionStart.line, 0);
            selectionEnd = Pos(selectionEnd.line, lineLength(cm, selectionEnd.line));
          }
          cm.setSelection(selectionStart, selectionEnd);
        }
        return [selectionStart, selectionEnd];
      };
      if (!vim.visualMode) {
      // In case of replaying the action.
        return getLastSelectedAreaRange();
      } else {
        return getCurrentSelectedAreaRange();
      }
    }
    // Updates the previous selection with the current selection's values. This
    // should only be called in visual mode.
    function updateLastSelection(cm, vim) {
      var anchor = vim.sel.anchor;
      var head = vim.sel.head;
      // To accommodate the effect of lastPastedText in the last selection
      if (vim.lastPastedText) {
        head = cm.posFromIndex(cm.indexFromPos(anchor) + vim.lastPastedText.length);
        vim.lastPastedText = null;
      }
      vim.lastSelection = {'anchorMark': cm.setBookmark(anchor),
                           'headMark': cm.setBookmark(head),
                           'anchor': copyCursor(anchor),
                           'head': copyCursor(head),
                           'visualMode': vim.visualMode,
                           'visualLine': vim.visualLine,
                           'visualBlock': vim.visualBlock};
    }
    function expandSelection(cm, start, end) {
      var sel = cm.state.vim.sel;
      var head = sel.head;
      var anchor = sel.anchor;
      var tmp;
      if (cursorIsBefore(end, start)) {
        tmp = end;
        end = start;
        start = tmp;
      }
      if (cursorIsBefore(head, anchor)) {
        head = cursorMin(start, head);
        anchor = cursorMax(anchor, end);
      } else {
        anchor = cursorMin(start, anchor);
        head = cursorMax(head, end);
        head = offsetCursor(head, 0, -1);
        if (head.ch == -1 && head.line != cm.firstLine()) {
          head = Pos(head.line - 1, lineLength(cm, head.line - 1));
        }
      }
      return [anchor, head];
    }
    /**
     * Updates the CodeMirror selection to match the provided vim selection.
     * If no arguments are given, it uses the current vim selection state.
     */
    function updateCmSelection(cm, sel, mode) {
      var vim = cm.state.vim;
      sel = sel || vim.sel;
      var mode = mode ||
        vim.visualLine ? 'line' : vim.visualBlock ? 'block' : 'char';
      var cmSel = makeCmSelection(cm, sel, mode);
      cm.setSelections(cmSel.ranges, cmSel.primary);
      updateFakeCursor(cm);
    }
    function makeCmSelection(cm, sel, mode, exclusive) {
      var head = copyCursor(sel.head);
      var anchor = copyCursor(sel.anchor);
      if (mode == 'char') {
        var headOffset = !exclusive && !cursorIsBefore(sel.head, sel.anchor) ? 1 : 0;
        var anchorOffset = cursorIsBefore(sel.head, sel.anchor) ? 1 : 0;
        head = offsetCursor(sel.head, 0, headOffset);
        anchor = offsetCursor(sel.anchor, 0, anchorOffset);
        return {
          ranges: [{anchor: anchor, head: head}],
          primary: 0
        };
      } else if (mode == 'line') {
        if (!cursorIsBefore(sel.head, sel.anchor)) {
          anchor.ch = 0;

          var lastLine = cm.lastLine();
          if (head.line > lastLine) {
            head.line = lastLine;
          }
          head.ch = lineLength(cm, head.line);
        } else {
          head.ch = 0;
          anchor.ch = lineLength(cm, anchor.line);
        }
        return {
          ranges: [{anchor: anchor, head: head}],
          primary: 0
        };
      } else if (mode == 'block') {
        var top = Math.min(anchor.line, head.line),
            left = Math.min(anchor.ch, head.ch),
            bottom = Math.max(anchor.line, head.line),
            right = Math.max(anchor.ch, head.ch) + 1;
        var height = bottom - top + 1;
        var primary = head.line == top ? 0 : height - 1;
        var ranges = [];
        for (var i = 0; i < height; i++) {
          ranges.push({
            anchor: Pos(top + i, left),
            head: Pos(top + i, right)
          });
        }
        return {
          ranges: ranges,
          primary: primary
        };
      }
    }
    function getHead(cm) {
      var cur = cm.getCursor('head');
      if (cm.getSelection().length == 1) {
        // Small corner case when only 1 character is selected. The "real"
        // head is the left of head and anchor.
        cur = cursorMin(cur, cm.getCursor('anchor'));
      }
      return cur;
    }

    /**
     * If moveHead is set to false, the CodeMirror selection will not be
     * touched. The caller assumes the responsibility of putting the cursor
    * in the right place.
     */
    function exitVisualMode(cm, moveHead) {
      var vim = cm.state.vim;
      if (moveHead !== false) {
        cm.setCursor(clipCursorToContent(cm, vim.sel.head));
      }
      updateLastSelection(cm, vim);
      vim.visualMode = false;
      vim.visualLine = false;
      vim.visualBlock = false;
      CodeMirror.signal(cm, "vim-mode-change", {mode: "normal"});
      clearFakeCursor(vim);
    }

    // Remove any trailing newlines from the selection. For
    // example, with the caret at the start of the last word on the line,
    // 'dw' should word, but not the newline, while 'w' should advance the
    // caret to the first character of the next line.
    function clipToLine(cm, curStart, curEnd) {
      var selection = cm.getRange(curStart, curEnd);
      // Only clip if the selection ends with trailing newline + whitespace
      if (/\n\s*$/.test(selection)) {
        var lines = selection.split('\n');
        // We know this is all whitespace.
        lines.pop();

        // Cases:
        // 1. Last word is an empty line - do not clip the trailing '\n'
        // 2. Last word is not an empty line - clip the trailing '\n'
        var line;
        // Find the line containing the last word, and clip all whitespace up
        // to it.
        for (var line = lines.pop(); lines.length > 0 && line && isWhiteSpaceString(line); line = lines.pop()) {
          curEnd.line--;
          curEnd.ch = 0;
        }
        // If the last word is not an empty line, clip an additional newline
        if (line) {
          curEnd.line--;
          curEnd.ch = lineLength(cm, curEnd.line);
        } else {
          curEnd.ch = 0;
        }
      }
    }

    // Expand the selection to line ends.
    function expandSelectionToLine(_cm, curStart, curEnd) {
      curStart.ch = 0;
      curEnd.ch = 0;
      curEnd.line++;
    }

    function findFirstNonWhiteSpaceCharacter(text) {
      if (!text) {
        return 0;
      }
      var firstNonWS = text.search(/\S/);
      return firstNonWS == -1 ? text.length : firstNonWS;
    }

    function expandWordUnderCursor(cm, inclusive, _forward, bigWord, noSymbol) {
      var cur = getHead(cm);
      var line = cm.getLine(cur.line);
      var idx = cur.ch;

      // Seek to first word or non-whitespace character, depending on if
      // noSymbol is true.
      var test = noSymbol ? wordCharTest[0] : bigWordCharTest [0];
      while (!test(line.charAt(idx))) {
        idx++;
        if (idx >= line.length) { return null; }
      }

      if (bigWord) {
        test = bigWordCharTest[0];
      } else {
        test = wordCharTest[0];
        if (!test(line.charAt(idx))) {
          test = wordCharTest[1];
        }
      }

      var end = idx, start = idx;
      while (test(line.charAt(end)) && end < line.length) { end++; }
      while (test(line.charAt(start)) && start >= 0) { start--; }
      start++;

      if (inclusive) {
        // If present, include all whitespace after word.
        // Otherwise, include all whitespace before word, except indentation.
        var wordEnd = end;
        while (/\s/.test(line.charAt(end)) && end < line.length) { end++; }
        if (wordEnd == end) {
          var wordStart = start;
          while (/\s/.test(line.charAt(start - 1)) && start > 0) { start--; }
          if (!start) { start = wordStart; }
        }
      }
      return { start: Pos(cur.line, start), end: Pos(cur.line, end) };
    }

    function recordJumpPosition(cm, oldCur, newCur) {
      if (!cursorEqual(oldCur, newCur)) {
        vimGlobalState.jumpList.add(cm, oldCur, newCur);
      }
    }

    function recordLastCharacterSearch(increment, args) {
        vimGlobalState.lastCharacterSearch.increment = increment;
        vimGlobalState.lastCharacterSearch.forward = args.forward;
        vimGlobalState.lastCharacterSearch.selectedCharacter = args.selectedCharacter;
    }

    var symbolToMode = {
        '(': 'bracket', ')': 'bracket', '{': 'bracket', '}': 'bracket',
        '[': 'section', ']': 'section',
        '*': 'comment', '/': 'comment',
        'm': 'method', 'M': 'method',
        '#': 'preprocess'
    };
    var findSymbolModes = {
      bracket: {
        isComplete: function(state) {
          if (state.nextCh === state.symb) {
            state.depth++;
            if (state.depth >= 1)return true;
          } else if (state.nextCh === state.reverseSymb) {
            state.depth--;
          }
          return false;
        }
      },
      section: {
        init: function(state) {
          state.curMoveThrough = true;
          state.symb = (state.forward ? ']' : '[') === state.symb ? '{' : '}';
        },
        isComplete: function(state) {
          return state.index === 0 && state.nextCh === state.symb;
        }
      },
      comment: {
        isComplete: function(state) {
          var found = state.lastCh === '*' && state.nextCh === '/';
          state.lastCh = state.nextCh;
          return found;
        }
      },
      // TODO: The original Vim implementation only operates on level 1 and 2.
      // The current implementation doesn't check for code block level and
      // therefore it operates on any levels.
      method: {
        init: function(state) {
          state.symb = (state.symb === 'm' ? '{' : '}');
          state.reverseSymb = state.symb === '{' ? '}' : '{';
        },
        isComplete: function(state) {
          if (state.nextCh === state.symb)return true;
          return false;
        }
      },
      preprocess: {
        init: function(state) {
          state.index = 0;
        },
        isComplete: function(state) {
          if (state.nextCh === '#') {
            var token = state.lineText.match(/#(\w+)/)[1];
            if (token === 'endif') {
              if (state.forward && state.depth === 0) {
                return true;
              }
              state.depth++;
            } else if (token === 'if') {
              if (!state.forward && state.depth === 0) {
                return true;
              }
              state.depth--;
            }
            if (token === 'else' && state.depth === 0)return true;
          }
          return false;
        }
      }
    };
    function findSymbol(cm, repeat, forward, symb) {
      var cur = copyCursor(cm.getCursor());
      var increment = forward ? 1 : -1;
      var endLine = forward ? cm.lineCount() : -1;
      var curCh = cur.ch;
      var line = cur.line;
      var lineText = cm.getLine(line);
      var state = {
        lineText: lineText,
        nextCh: lineText.charAt(curCh),
        lastCh: null,
        index: curCh,
        symb: symb,
        reverseSymb: (forward ?  { ')': '(', '}': '{' } : { '(': ')', '{': '}' })[symb],
        forward: forward,
        depth: 0,
        curMoveThrough: false
      };
      var mode = symbolToMode[symb];
      if (!mode)return cur;
      var init = findSymbolModes[mode].init;
      var isComplete = findSymbolModes[mode].isComplete;
      if (init) { init(state); }
      while (line !== endLine && repeat) {
        state.index += increment;
        state.nextCh = state.lineText.charAt(state.index);
        if (!state.nextCh) {
          line += increment;
          state.lineText = cm.getLine(line) || '';
          if (increment > 0) {
            state.index = 0;
          } else {
            var lineLen = state.lineText.length;
            state.index = (lineLen > 0) ? (lineLen-1) : 0;
          }
          state.nextCh = state.lineText.charAt(state.index);
        }
        if (isComplete(state)) {
          cur.line = line;
          cur.ch = state.index;
          repeat--;
        }
      }
      if (state.nextCh || state.curMoveThrough) {
        return Pos(line, state.index);
      }
      return cur;
    }

    /*
     * Returns the boundaries of the next word. If the cursor in the middle of
     * the word, then returns the boundaries of the current word, starting at
     * the cursor. If the cursor is at the start/end of a word, and we are going
     * forward/backward, respectively, find the boundaries of the next word.
     *
     * @param {CodeMirror} cm CodeMirror object.
     * @param {Cursor} cur The cursor position.
     * @param {boolean} forward True to search forward. False to search
     *     backward.
     * @param {boolean} bigWord True if punctuation count as part of the word.
     *     False if only [a-zA-Z0-9] characters count as part of the word.
     * @param {boolean} emptyLineIsWord True if empty lines should be treated
     *     as words.
     * @return {Object{from:number, to:number, line: number}} The boundaries of
     *     the word, or null if there are no more words.
     */
    function findWord(cm, cur, forward, bigWord, emptyLineIsWord) {
      var lineNum = cur.line;
      var pos = cur.ch;
      var line = cm.getLine(lineNum);
      var dir = forward ? 1 : -1;
      var charTests = bigWord ? bigWordCharTest: wordCharTest;

      if (emptyLineIsWord && line == '') {
        lineNum += dir;
        line = cm.getLine(lineNum);
        if (!isLine(cm, lineNum)) {
          return null;
        }
        pos = (forward) ? 0 : line.length;
      }

      while (true) {
        if (emptyLineIsWord && line == '') {
          return { from: 0, to: 0, line: lineNum };
        }
        var stop = (dir > 0) ? line.length : -1;
        var wordStart = stop, wordEnd = stop;
        // Find bounds of next word.
        while (pos != stop) {
          var foundWord = false;
          for (var i = 0; i < charTests.length && !foundWord; ++i) {
            if (charTests[i](line.charAt(pos))) {
              wordStart = pos;
              // Advance to end of word.
              while (pos != stop && charTests[i](line.charAt(pos))) {
                pos += dir;
              }
              wordEnd = pos;
              foundWord = wordStart != wordEnd;
              if (wordStart == cur.ch && lineNum == cur.line &&
                  wordEnd == wordStart + dir) {
                // We started at the end of a word. Find the next one.
                continue;
              } else {
                return {
                  from: Math.min(wordStart, wordEnd + 1),
                  to: Math.max(wordStart, wordEnd),
                  line: lineNum };
              }
            }
          }
          if (!foundWord) {
            pos += dir;
          }
        }
        // Advance to next/prev line.
        lineNum += dir;
        if (!isLine(cm, lineNum)) {
          return null;
        }
        line = cm.getLine(lineNum);
        pos = (dir > 0) ? 0 : line.length;
      }
    }

    /**
     * @param {CodeMirror} cm CodeMirror object.
     * @param {Pos} cur The position to start from.
     * @param {int} repeat Number of words to move past.
     * @param {boolean} forward True to search forward. False to search
     *     backward.
     * @param {boolean} wordEnd True to move to end of word. False to move to
     *     beginning of word.
     * @param {boolean} bigWord True if punctuation count as part of the word.
     *     False if only alphabet characters count as part of the word.
     * @return {Cursor} The position the cursor should move to.
     */
    function moveToWord(cm, cur, repeat, forward, wordEnd, bigWord) {
      var curStart = copyCursor(cur);
      var words = [];
      if (forward && !wordEnd || !forward && wordEnd) {
        repeat++;
      }
      // For 'e', empty lines are not considered words, go figure.
      var emptyLineIsWord = !(forward && wordEnd);
      for (var i = 0; i < repeat; i++) {
        var word = findWord(cm, cur, forward, bigWord, emptyLineIsWord);
        if (!word) {
          var eodCh = lineLength(cm, cm.lastLine());
          words.push(forward
              ? {line: cm.lastLine(), from: eodCh, to: eodCh}
              : {line: 0, from: 0, to: 0});
          break;
        }
        words.push(word);
        cur = Pos(word.line, forward ? (word.to - 1) : word.from);
      }
      var shortCircuit = words.length != repeat;
      var firstWord = words[0];
      var lastWord = words.pop();
      if (forward && !wordEnd) {
        // w
        if (!shortCircuit && (firstWord.from != curStart.ch || firstWord.line != curStart.line)) {
          // We did not start in the middle of a word. Discard the extra word at the end.
          lastWord = words.pop();
        }
        return Pos(lastWord.line, lastWord.from);
      } else if (forward && wordEnd) {
        return Pos(lastWord.line, lastWord.to - 1);
      } else if (!forward && wordEnd) {
        // ge
        if (!shortCircuit && (firstWord.to != curStart.ch || firstWord.line != curStart.line)) {
          // We did not start in the middle of a word. Discard the extra word at the end.
          lastWord = words.pop();
        }
        return Pos(lastWord.line, lastWord.to);
      } else {
        // b
        return Pos(lastWord.line, lastWord.from);
      }
    }

    function moveToCharacter(cm, repeat, forward, character) {
      var cur = cm.getCursor();
      var start = cur.ch;
      var idx;
      for (var i = 0; i < repeat; i ++) {
        var line = cm.getLine(cur.line);
        idx = charIdxInLine(start, line, character, forward, true);
        if (idx == -1) {
          return null;
        }
        start = idx;
      }
      return Pos(cm.getCursor().line, idx);
    }

    function moveToColumn(cm, repeat) {
      // repeat is always >= 1, so repeat - 1 always corresponds
      // to the column we want to go to.
      var line = cm.getCursor().line;
      return clipCursorToContent(cm, Pos(line, repeat - 1));
    }

    function updateMark(cm, vim, markName, pos) {
      if (!inArray(markName, validMarks)) {
        return;
      }
      if (vim.marks[markName]) {
        vim.marks[markName].clear();
      }
      vim.marks[markName] = cm.setBookmark(pos);
    }

    function charIdxInLine(start, line, character, forward, includeChar) {
      // Search for char in line.
      // motion_options: {forward, includeChar}
      // If includeChar = true, include it too.
      // If forward = true, search forward, else search backwards.
      // If char is not found on this line, do nothing
      var idx;
      if (forward) {
        idx = line.indexOf(character, start + 1);
        if (idx != -1 && !includeChar) {
          idx -= 1;
        }
      } else {
        idx = line.lastIndexOf(character, start - 1);
        if (idx != -1 && !includeChar) {
          idx += 1;
        }
      }
      return idx;
    }

    function findParagraph(cm, head, repeat, dir, inclusive) {
      var line = head.line;
      var min = cm.firstLine();
      var max = cm.lastLine();
      var start, end, i = line;
      function isEmpty(i) { return !cm.getLine(i); }
      function isBoundary(i, dir, any) {
        if (any) { return isEmpty(i) != isEmpty(i + dir); }
        return !isEmpty(i) && isEmpty(i + dir);
      }
      if (dir) {
        while (min <= i && i <= max && repeat > 0) {
          if (isBoundary(i, dir)) { repeat--; }
          i += dir;
        }
        return new Pos(i, 0);
      }

      var vim = cm.state.vim;
      if (vim.visualLine && isBoundary(line, 1, true)) {
        var anchor = vim.sel.anchor;
        if (isBoundary(anchor.line, -1, true)) {
          if (!inclusive || anchor.line != line) {
            line += 1;
          }
        }
      }
      var startState = isEmpty(line);
      for (i = line; i <= max && repeat; i++) {
        if (isBoundary(i, 1, true)) {
          if (!inclusive || isEmpty(i) != startState) {
            repeat--;
          }
        }
      }
      end = new Pos(i, 0);
      // select boundary before paragraph for the last one
      if (i > max && !startState) { startState = true; }
      else { inclusive = false; }
      for (i = line; i > min; i--) {
        if (!inclusive || isEmpty(i) == startState || i == line) {
          if (isBoundary(i, -1, true)) { break; }
        }
      }
      start = new Pos(i, 0);
      return { start: start, end: end };
    }

    function findSentence(cm, cur, repeat, dir) {

      /*
        Takes an index object
        {
          line: the line string,
          ln: line number,
          pos: index in line,
          dir: direction of traversal (-1 or 1)
        }
        and modifies the line, ln, and pos members to represent the
        next valid position or sets them to null if there are
        no more valid positions.
       */
      function nextChar(cm, idx) {
        if (idx.pos + idx.dir < 0 || idx.pos + idx.dir >= idx.line.length) {
          idx.ln += idx.dir;
          if (!isLine(cm, idx.ln)) {
            idx.line = null;
            idx.ln = null;
            idx.pos = null;
            return;
          }
          idx.line = cm.getLine(idx.ln);
          idx.pos = (idx.dir > 0) ? 0 : idx.line.length - 1;
        }
        else {
          idx.pos += idx.dir;
        }
      }

      /*
        Performs one iteration of traversal in forward direction
        Returns an index object of the new location
       */
      function forward(cm, ln, pos, dir) {
        var line = cm.getLine(ln);
        var stop = (line === "");

        var curr = {
          line: line,
          ln: ln,
          pos: pos,
          dir: dir,
        }

        var last_valid = {
          ln: curr.ln,
          pos: curr.pos,
        }

        var skip_empty_lines = (curr.line === "");

        // Move one step to skip character we start on
        nextChar(cm, curr);

        while (curr.line !== null) {
          last_valid.ln = curr.ln;
          last_valid.pos = curr.pos;

          if (curr.line === "" && !skip_empty_lines) {
            return { ln: curr.ln, pos: curr.pos, };
          }
          else if (stop && curr.line !== "" && !isWhiteSpaceString(curr.line[curr.pos])) {
            return { ln: curr.ln, pos: curr.pos, };
          }
          else if (isEndOfSentenceSymbol(curr.line[curr.pos])
            && !stop
            && (curr.pos === curr.line.length - 1
              || isWhiteSpaceString(curr.line[curr.pos + 1]))) {
            stop = true;
          }

          nextChar(cm, curr);
        }

        /*
          Set the position to the last non whitespace character on the last
          valid line in the case that we reach the end of the document.
        */
        var line = cm.getLine(last_valid.ln);
        last_valid.pos = 0;
        for(var i = line.length - 1; i >= 0; --i) {
          if (!isWhiteSpaceString(line[i])) {
            last_valid.pos = i;
            break;
          }
        }

        return last_valid;

      }

      /*
        Performs one iteration of traversal in reverse direction
        Returns an index object of the new location
       */
      function reverse(cm, ln, pos, dir) {
        var line = cm.getLine(ln);

        var curr = {
          line: line,
          ln: ln,
          pos: pos,
          dir: dir,
        }

        var last_valid = {
          ln: curr.ln,
          pos: null,
        };

        var skip_empty_lines = (curr.line === "");

        // Move one step to skip character we start on
        nextChar(cm, curr);

        while (curr.line !== null) {

          if (curr.line === "" && !skip_empty_lines) {
            if (last_valid.pos !== null) {
              return last_valid;
            }
            else {
              return { ln: curr.ln, pos: curr.pos };
            }
          }
          else if (isEndOfSentenceSymbol(curr.line[curr.pos])
              && last_valid.pos !== null
              && !(curr.ln === last_valid.ln && curr.pos + 1 === last_valid.pos)) {
            return last_valid;
          }
          else if (curr.line !== "" && !isWhiteSpaceString(curr.line[curr.pos])) {
            skip_empty_lines = false;
            last_valid = { ln: curr.ln, pos: curr.pos }
          }

          nextChar(cm, curr);
        }

        /*
          Set the position to the first non whitespace character on the last
          valid line in the case that we reach the beginning of the document.
        */
        var line = cm.getLine(last_valid.ln);
        last_valid.pos = 0;
        for(var i = 0; i < line.length; ++i) {
          if (!isWhiteSpaceString(line[i])) {
            last_valid.pos = i;
            break;
          }
        }
        return last_valid;
      }

      var curr_index = {
        ln: cur.line,
        pos: cur.ch,
      };

      while (repeat > 0) {
        if (dir < 0) {
          curr_index = reverse(cm, curr_index.ln, curr_index.pos, dir);
        }
        else {
          curr_index = forward(cm, curr_index.ln, curr_index.pos, dir);
        }
        repeat--;
      }

      return Pos(curr_index.ln, curr_index.pos);
    }

    // TODO: perhaps this finagling of start and end positions belonds
    // in codemirror/replaceRange?
    function selectCompanionObject(cm, head, symb, inclusive) {
      var cur = head, start, end;

      var bracketRegexp = ({
        '(': /[()]/, ')': /[()]/,
        '[': /[[\]]/, ']': /[[\]]/,
        '{': /[{}]/, '}': /[{}]/,
        '<': /[<>]/, '>': /[<>]/})[symb];
      var openSym = ({
        '(': '(', ')': '(',
        '[': '[', ']': '[',
        '{': '{', '}': '{',
        '<': '<', '>': '<'})[symb];
      var curChar = cm.getLine(cur.line).charAt(cur.ch);
      // Due to the behavior of scanForBracket, we need to add an offset if the
      // cursor is on a matching open bracket.
      var offset = curChar === openSym ? 1 : 0;

      start = cm.scanForBracket(Pos(cur.line, cur.ch + offset), -1, undefined, {'bracketRegex': bracketRegexp});
      end = cm.scanForBracket(Pos(cur.line, cur.ch + offset), 1, undefined, {'bracketRegex': bracketRegexp});

      if (!start || !end) {
        return { start: cur, end: cur };
      }

      start = start.pos;
      end = end.pos;

      if ((start.line == end.line && start.ch > end.ch)
          || (start.line > end.line)) {
        var tmp = start;
        start = end;
        end = tmp;
      }

      if (inclusive) {
        end.ch += 1;
      } else {
        start.ch += 1;
      }

      return { start: start, end: end };
    }

    // Takes in a symbol and a cursor and tries to simulate text objects that
    // have identical opening and closing symbols
    // TODO support across multiple lines
    function findBeginningAndEnd(cm, head, symb, inclusive) {
      var cur = copyCursor(head);
      var line = cm.getLine(cur.line);
      var chars = line.split('');
      var start, end, i, len;
      var firstIndex = chars.indexOf(symb);

      // the decision tree is to always look backwards for the beginning first,
      // but if the cursor is in front of the first instance of the symb,
      // then move the cursor forward
      if (cur.ch < firstIndex) {
        cur.ch = firstIndex;
        // Why is this line even here???
        // cm.setCursor(cur.line, firstIndex+1);
      }
      // otherwise if the cursor is currently on the closing symbol
      else if (firstIndex < cur.ch && chars[cur.ch] == symb) {
        end = cur.ch; // assign end to the current cursor
        --cur.ch; // make sure to look backwards
      }

      // if we're currently on the symbol, we've got a start
      if (chars[cur.ch] == symb && !end) {
        start = cur.ch + 1; // assign start to ahead of the cursor
      } else {
        // go backwards to find the start
        for (i = cur.ch; i > -1 && !start; i--) {
          if (chars[i] == symb) {
            start = i + 1;
          }
        }
      }

      // look forwards for the end symbol
      if (start && !end) {
        for (i = start, len = chars.length; i < len && !end; i++) {
          if (chars[i] == symb) {
            end = i;
          }
        }
      }

      // nothing found
      if (!start || !end) {
        return { start: cur, end: cur };
      }

      // include the symbols
      if (inclusive) {
        --start; ++end;
      }

      return {
        start: Pos(cur.line, start),
        end: Pos(cur.line, end)
      };
    }

    // Search functions
    defineOption('pcre', true, 'boolean');
    function SearchState() {}
    SearchState.prototype = {
      getQuery: function() {
        return vimGlobalState.query;
      },
      setQuery: function(query) {
        vimGlobalState.query = query;
      },
      getOverlay: function() {
        return this.searchOverlay;
      },
      setOverlay: function(overlay) {
        this.searchOverlay = overlay;
      },
      isReversed: function() {
        return vimGlobalState.isReversed;
      },
      setReversed: function(reversed) {
        vimGlobalState.isReversed = reversed;
      },
      getScrollbarAnnotate: function() {
        return this.annotate;
      },
      setScrollbarAnnotate: function(annotate) {
        this.annotate = annotate;
      }
    };
    function getSearchState(cm) {
      var vim = cm.state.vim;
      return vim.searchState_ || (vim.searchState_ = new SearchState());
    }
    function dialog(cm, template, shortText, onClose, options) {
      if (cm.openDialog) {
        cm.openDialog(template, onClose, { bottom: true, value: options.value,
            onKeyDown: options.onKeyDown, onKeyUp: options.onKeyUp,
            selectValueOnOpen: false});
      }
      else {
        onClose(prompt(shortText, ''));
      }
    }
    function splitBySlash(argString) {
      return splitBySeparator(argString, '/');
    }

    function findUnescapedSlashes(argString) {
      return findUnescapedSeparators(argString, '/');
    }

    function splitBySeparator(argString, separator) {
      var slashes = findUnescapedSeparators(argString, separator) || [];
      if (!slashes.length) return [];
      var tokens = [];
      // in case of strings like foo/bar
      if (slashes[0] !== 0) return;
      for (var i = 0; i < slashes.length; i++) {
        if (typeof slashes[i] == 'number')
          tokens.push(argString.substring(slashes[i] + 1, slashes[i+1]));
      }
      return tokens;
    }

    function findUnescapedSeparators(str, separator) {
      if (!separator)
        separator = '/';

      var escapeNextChar = false;
      var slashes = [];
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i);
        if (!escapeNextChar && c == separator) {
          slashes.push(i);
        }
        escapeNextChar = !escapeNextChar && (c == '\\');
      }
      return slashes;
    }

    // Translates a search string from ex (vim) syntax into javascript form.
    function translateRegex(str) {
      // When these match, add a '\' if unescaped or remove one if escaped.
      var specials = '|(){';
      // Remove, but never add, a '\' for these.
      var unescape = '}';
      var escapeNextChar = false;
      var out = [];
      for (var i = -1; i < str.length; i++) {
        var c = str.charAt(i) || '';
        var n = str.charAt(i+1) || '';
        var specialComesNext = (n && specials.indexOf(n) != -1);
        if (escapeNextChar) {
          if (c !== '\\' || !specialComesNext) {
            out.push(c);
          }
          escapeNextChar = false;
        } else {
          if (c === '\\') {
            escapeNextChar = true;
            // Treat the unescape list as special for removing, but not adding '\'.
            if (n && unescape.indexOf(n) != -1) {
              specialComesNext = true;
            }
            // Not passing this test means removing a '\'.
            if (!specialComesNext || n === '\\') {
              out.push(c);
            }
          } else {
            out.push(c);
            if (specialComesNext && n !== '\\') {
              out.push('\\');
            }
          }
        }
      }
      return out.join('');
    }

    // Translates the replace part of a search and replace from ex (vim) syntax into
    // javascript form.  Similar to translateRegex, but additionally fixes back references
    // (translates '\[0..9]' to '$[0..9]') and follows different rules for escaping '$'.
    var charUnescapes = {'\\n': '\n', '\\r': '\r', '\\t': '\t'};
    function translateRegexReplace(str) {
      var escapeNextChar = false;
      var out = [];
      for (var i = -1; i < str.length; i++) {
        var c = str.charAt(i) || '';
        var n = str.charAt(i+1) || '';
        if (charUnescapes[c + n]) {
          out.push(charUnescapes[c+n]);
          i++;
        } else if (escapeNextChar) {
          // At any point in the loop, escapeNextChar is true if the previous
          // character was a '\' and was not escaped.
          out.push(c);
          escapeNextChar = false;
        } else {
          if (c === '\\') {
            escapeNextChar = true;
            if ((isNumber(n) || n === '$')) {
              out.push('$');
            } else if (n !== '/' && n !== '\\') {
              out.push('\\');
            }
          } else {
            if (c === '$') {
              out.push('$');
            }
            out.push(c);
            if (n === '/') {
              out.push('\\');
            }
          }
        }
      }
      return out.join('');
    }

    // Unescape \ and / in the replace part, for PCRE mode.
    var unescapes = {'\\/': '/', '\\\\': '\\', '\\n': '\n', '\\r': '\r', '\\t': '\t', '\\&':'&'};
    function unescapeRegexReplace(str) {
      var stream = new CodeMirror.StringStream(str);
      var output = [];
      while (!stream.eol()) {
        // Search for \.
        while (stream.peek() && stream.peek() != '\\') {
          output.push(stream.next());
        }
        var matched = false;
        for (var matcher in unescapes) {
          if (stream.match(matcher, true)) {
            matched = true;
            output.push(unescapes[matcher]);
            break;
          }
        }
        if (!matched) {
          // Don't change anything
          output.push(stream.next());
        }
      }
      return output.join('');
    }

    /**
     * Extract the regular expression from the query and return a Regexp object.
     * Returns null if the query is blank.
     * If ignoreCase is passed in, the Regexp object will have the 'i' flag set.
     * If smartCase is passed in, and the query contains upper case letters,
     *   then ignoreCase is overridden, and the 'i' flag will not be set.
     * If the query contains the /i in the flag part of the regular expression,
     *   then both ignoreCase and smartCase are ignored, and 'i' will be passed
     *   through to the Regex object.
     */
    function parseQuery(query, ignoreCase, smartCase) {
      // First update the last search register
      var lastSearchRegister = vimGlobalState.registerController.getRegister('/');
      lastSearchRegister.setText(query);
      // Check if the query is already a regex.
      if (query instanceof RegExp) { return query; }
      // First try to extract regex + flags from the input. If no flags found,
      // extract just the regex. IE does not accept flags directly defined in
      // the regex string in the form /regex/flags
      var slashes = findUnescapedSlashes(query);
      var regexPart;
      var forceIgnoreCase;
      if (!slashes.length) {
        // Query looks like 'regexp'
        regexPart = query;
      } else {
        // Query looks like 'regexp/...'
        regexPart = query.substring(0, slashes[0]);
        var flagsPart = query.substring(slashes[0]);
        forceIgnoreCase = (flagsPart.indexOf('i') != -1);
      }
      if (!regexPart) {
        return null;
      }
      if (!getOption('pcre')) {
        regexPart = translateRegex(regexPart);
      }
      if (smartCase) {
        ignoreCase = (/^[^A-Z]*$/).test(regexPart);
      }
      var regexp = new RegExp(regexPart,
          (ignoreCase || forceIgnoreCase) ? 'i' : undefined);
      return regexp;
    }
    function showConfirm(cm, text) {
      if (cm.openNotification) {
        cm.openNotification('<span style="color: red">' + text + '</span>',
                            {bottom: true, duration: 5000});
      } else {
        alert(text);
      }
    }
    function makePrompt(prefix, desc) {
      var raw = '<span style="font-family: monospace; white-space: pre">' +
          (prefix || "") + '<input type="text" autocorrect="off" ' +
          'autocapitalize="off" spellcheck="false"></span>';
      if (desc)
        raw += ' <span style="color: #888">' + desc + '</span>';
      return raw;
    }
    var searchPromptDesc = '(Javascript regexp)';
    function showPrompt(cm, options) {
      var shortText = (options.prefix || '') + ' ' + (options.desc || '');
      var prompt = makePrompt(options.prefix, options.desc);
      dialog(cm, prompt, shortText, options.onClose, options);
    }
    function regexEqual(r1, r2) {
      if (r1 instanceof RegExp && r2 instanceof RegExp) {
          var props = ['global', 'multiline', 'ignoreCase', 'source'];
          for (var i = 0; i < props.length; i++) {
              var prop = props[i];
              if (r1[prop] !== r2[prop]) {
                  return false;
              }
          }
          return true;
      }
      return false;
    }
    // Returns true if the query is valid.
    function updateSearchQuery(cm, rawQuery, ignoreCase, smartCase) {
      if (!rawQuery) {
        return;
      }
      var state = getSearchState(cm);
      var query = parseQuery(rawQuery, !!ignoreCase, !!smartCase);
      if (!query) {
        return;
      }
      highlightSearchMatches(cm, query);
      if (regexEqual(query, state.getQuery())) {
        return query;
      }
      state.setQuery(query);
      return query;
    }
    function searchOverlay(query) {
      if (query.source.charAt(0) == '^') {
        var matchSol = true;
      }
      return {
        token: function(stream) {
          if (matchSol && !stream.sol()) {
            stream.skipToEnd();
            return;
          }
          var match = stream.match(query, false);
          if (match) {
            if (match[0].length == 0) {
              // Matched empty string, skip to next.
              stream.next();
              return 'searching';
            }
            if (!stream.sol()) {
              // Backtrack 1 to match \b
              stream.backUp(1);
              if (!query.exec(stream.next() + match[0])) {
                stream.next();
                return null;
              }
            }
            stream.match(query);
            return 'searching';
          }
          while (!stream.eol()) {
            stream.next();
            if (stream.match(query, false)) break;
          }
        },
        query: query
      };
    }
    var highlightTimeout = 0;
    function highlightSearchMatches(cm, query) {
      clearTimeout(highlightTimeout);
      highlightTimeout = setTimeout(function() {
        var searchState = getSearchState(cm);
        var overlay = searchState.getOverlay();
        if (!overlay || query != overlay.query) {
          if (overlay) {
            cm.removeOverlay(overlay);
          }
          overlay = searchOverlay(query);
          cm.addOverlay(overlay);
          if (cm.showMatchesOnScrollbar) {
            if (searchState.getScrollbarAnnotate()) {
              searchState.getScrollbarAnnotate().clear();
            }
            searchState.setScrollbarAnnotate(cm.showMatchesOnScrollbar(query));
          }
          searchState.setOverlay(overlay);
        }
      }, 50);
    }
    function findNext(cm, prev, query, repeat) {
      if (repeat === undefined) { repeat = 1; }
      return cm.operation(function() {
        var pos = cm.getCursor();
        var cursor = cm.getSearchCursor(query, pos);
        for (var i = 0; i < repeat; i++) {
          var found = cursor.find(prev);
          if (i == 0 && found && cursorEqual(cursor.from(), pos)) { found = cursor.find(prev); }
          if (!found) {
            // SearchCursor may have returned null because it hit EOF, wrap
            // around and try again.
            cursor = cm.getSearchCursor(query,
                (prev) ? Pos(cm.lastLine()) : Pos(cm.firstLine(), 0) );
            if (!cursor.find(prev)) {
              return;
            }
          }
        }
        return cursor.from();
      });
    }
    function clearSearchHighlight(cm) {
      var state = getSearchState(cm);
      cm.removeOverlay(getSearchState(cm).getOverlay());
      state.setOverlay(null);
      if (state.getScrollbarAnnotate()) {
        state.getScrollbarAnnotate().clear();
        state.setScrollbarAnnotate(null);
      }
    }
    /**
     * Check if pos is in the specified range, INCLUSIVE.
     * Range can be specified with 1 or 2 arguments.
     * If the first range argument is an array, treat it as an array of line
     * numbers. Match pos against any of the lines.
     * If the first range argument is a number,
     *   if there is only 1 range argument, check if pos has the same line
     *       number
     *   if there are 2 range arguments, then check if pos is in between the two
     *       range arguments.
     */
    function isInRange(pos, start, end) {
      if (typeof pos != 'number') {
        // Assume it is a cursor position. Get the line number.
        pos = pos.line;
      }
      if (start instanceof Array) {
        return inArray(pos, start);
      } else {
        if (end) {
          return (pos >= start && pos <= end);
        } else {
          return pos == start;
        }
      }
    }
    function getUserVisibleLines(cm) {
      var scrollInfo = cm.getScrollInfo();
      var occludeToleranceTop = 6;
      var occludeToleranceBottom = 10;
      var from = cm.coordsChar({left:0, top: occludeToleranceTop + scrollInfo.top}, 'local');
      var bottomY = scrollInfo.clientHeight - occludeToleranceBottom + scrollInfo.top;
      var to = cm.coordsChar({left:0, top: bottomY}, 'local');
      return {top: from.line, bottom: to.line};
    }

    function getMarkPos(cm, vim, markName) {
      if (markName == '\'' || markName == '`') {
        return vimGlobalState.jumpList.find(cm, -1) || Pos(0, 0);
      } else if (markName == '.') {
        return getLastEditPos(cm);
      }

      var mark = vim.marks[markName];
      return mark && mark.find();
    }

    function getLastEditPos(cm) {
      var done = cm.doc.history.done;
      for (var i = done.length; i--;) {
        if (done[i].changes) {
          return copyCursor(done[i].changes[0].to);
        }
      }
    }

    var ExCommandDispatcher = function() {
      this.buildCommandMap_();
    };
    ExCommandDispatcher.prototype = {
      processCommand: function(cm, input, opt_params) {
        var that = this;
        cm.operation(function () {
          cm.curOp.isVimOp = true;
          that._processCommand(cm, input, opt_params);
        });
      },
      _processCommand: function(cm, input, opt_params) {
        var vim = cm.state.vim;
        var commandHistoryRegister = vimGlobalState.registerController.getRegister(':');
        var previousCommand = commandHistoryRegister.toString();
        if (vim.visualMode) {
          exitVisualMode(cm);
        }
        var inputStream = new CodeMirror.StringStream(input);
        // update ": with the latest command whether valid or invalid
        commandHistoryRegister.setText(input);
        var params = opt_params || {};
        params.input = input;
        try {
          this.parseInput_(cm, inputStream, params);
        } catch(e) {
          showConfirm(cm, e);
          throw e;
        }
        var command;
        var commandName;
        if (!params.commandName) {
          // If only a line range is defined, move to the line.
          if (params.line !== undefined) {
            commandName = 'move';
          }
        } else {
          command = this.matchCommand_(params.commandName);
          if (command) {
            commandName = command.name;
            if (command.excludeFromCommandHistory) {
              commandHistoryRegister.setText(previousCommand);
            }
            this.parseCommandArgs_(inputStream, params, command);
            if (command.type == 'exToKey') {
              // Handle Ex to Key mapping.
              for (var i = 0; i < command.toKeys.length; i++) {
                CodeMirror.Vim.handleKey(cm, command.toKeys[i], 'mapping');
              }
              return;
            } else if (command.type == 'exToEx') {
              // Handle Ex to Ex mapping.
              this.processCommand(cm, command.toInput);
              return;
            }
          }
        }
        if (!commandName) {
          showConfirm(cm, 'Not an editor command ":' + input + '"');
          return;
        }
        try {
          exCommands[commandName](cm, params);
          // Possibly asynchronous commands (e.g. substitute, which might have a
          // user confirmation), are responsible for calling the callback when
          // done. All others have it taken care of for them here.
          if ((!command || !command.possiblyAsync) && params.callback) {
            params.callback();
          }
        } catch(e) {
          showConfirm(cm, e);
          throw e;
        }
      },
      parseInput_: function(cm, inputStream, result) {
        inputStream.eatWhile(':');
        // Parse range.
        if (inputStream.eat('%')) {
          result.line = cm.firstLine();
          result.lineEnd = cm.lastLine();
        } else {
          result.line = this.parseLineSpec_(cm, inputStream);
          if (result.line !== undefined && inputStream.eat(',')) {
            result.lineEnd = this.parseLineSpec_(cm, inputStream);
          }
        }

        // Parse command name.
        var commandMatch = inputStream.match(/^(\w+)/);
        if (commandMatch) {
          result.commandName = commandMatch[1];
        } else {
          result.commandName = inputStream.match(/.*/)[0];
        }

        return result;
      },
      parseLineSpec_: function(cm, inputStream) {
        var numberMatch = inputStream.match(/^(\d+)/);
        if (numberMatch) {
          // Absolute line number plus offset (N+M or N-M) is probably a typo,
          // not something the user actually wanted. (NB: vim does allow this.)
          return parseInt(numberMatch[1], 10) - 1;
        }
        switch (inputStream.next()) {
          case '.':
            return this.parseLineSpecOffset_(inputStream, cm.getCursor().line);
          case '$':
            return this.parseLineSpecOffset_(inputStream, cm.lastLine());
          case '\'':
            var markName = inputStream.next();
            var markPos = getMarkPos(cm, cm.state.vim, markName);
            if (!markPos) throw new Error('Mark not set');
            return this.parseLineSpecOffset_(inputStream, markPos.line);
          case '-':
          case '+':
            inputStream.backUp(1);
            // Offset is relative to current line if not otherwise specified.
            return this.parseLineSpecOffset_(inputStream, cm.getCursor().line);
          default:
            inputStream.backUp(1);
            return undefined;
        }
      },
      parseLineSpecOffset_: function(inputStream, line) {
        var offsetMatch = inputStream.match(/^([+-])?(\d+)/);
        if (offsetMatch) {
          var offset = parseInt(offsetMatch[2], 10);
          if (offsetMatch[1] == "-") {
            line -= offset;
          } else {
            line += offset;
          }
        }
        return line;
      },
      parseCommandArgs_: function(inputStream, params, command) {
        if (inputStream.eol()) {
          return;
        }
        params.argString = inputStream.match(/.*/)[0];
        // Parse command-line arguments
        var delim = command.argDelimiter || /\s+/;
        var args = trim(params.argString).split(delim);
        if (args.length && args[0]) {
          params.args = args;
        }
      },
      matchCommand_: function(commandName) {
        // Return the command in the command map that matches the shortest
        // prefix of the passed in command name. The match is guaranteed to be
        // unambiguous if the defaultExCommandMap's shortNames are set up
        // correctly. (see @code{defaultExCommandMap}).
        for (var i = commandName.length; i > 0; i--) {
          var prefix = commandName.substring(0, i);
          if (this.commandMap_[prefix]) {
            var command = this.commandMap_[prefix];
            if (command.name.indexOf(commandName) === 0) {
              return command;
            }
          }
        }
        return null;
      },
      buildCommandMap_: function() {
        this.commandMap_ = {};
        for (var i = 0; i < defaultExCommandMap.length; i++) {
          var command = defaultExCommandMap[i];
          var key = command.shortName || command.name;
          this.commandMap_[key] = command;
        }
      },
      map: function(lhs, rhs, ctx) {
        if (lhs != ':' && lhs.charAt(0) == ':') {
          if (ctx) { throw Error('Mode not supported for ex mappings'); }
          var commandName = lhs.substring(1);
          if (rhs != ':' && rhs.charAt(0) == ':') {
            // Ex to Ex mapping
            this.commandMap_[commandName] = {
              name: commandName,
              type: 'exToEx',
              toInput: rhs.substring(1),
              user: true
            };
          } else {
            // Ex to key mapping
            this.commandMap_[commandName] = {
              name: commandName,
              type: 'exToKey',
              toKeys: rhs,
              user: true
            };
          }
        } else {
          if (rhs != ':' && rhs.charAt(0) == ':') {
            // Key to Ex mapping.
            var mapping = {
              keys: lhs,
              type: 'keyToEx',
              exArgs: { input: rhs.substring(1) }
            };
            if (ctx) { mapping.context = ctx; }
            defaultKeymap.unshift(mapping);
          } else {
            // Key to key mapping
            var mapping = {
              keys: lhs,
              type: 'keyToKey',
              toKeys: rhs
            };
            if (ctx) { mapping.context = ctx; }
            defaultKeymap.unshift(mapping);
          }
        }
      },
      unmap: function(lhs, ctx) {
        if (lhs != ':' && lhs.charAt(0) == ':') {
          // Ex to Ex or Ex to key mapping
          if (ctx) { throw Error('Mode not supported for ex mappings'); }
          var commandName = lhs.substring(1);
          if (this.commandMap_[commandName] && this.commandMap_[commandName].user) {
            delete this.commandMap_[commandName];
            return;
          }
        } else {
          // Key to Ex or key to key mapping
          var keys = lhs;
          for (var i = 0; i < defaultKeymap.length; i++) {
            if (keys == defaultKeymap[i].keys
                && defaultKeymap[i].context === ctx) {
              defaultKeymap.splice(i, 1);
              return;
            }
          }
        }
        throw Error('No such mapping.');
      }
    };

    var exCommands = {
      colorscheme: function(cm, params) {
        if (!params.args || params.args.length < 1) {
          showConfirm(cm, cm.getOption('theme'));
          return;
        }
        cm.setOption('theme', params.args[0]);
      },
      map: function(cm, params, ctx) {
        var mapArgs = params.args;
        if (!mapArgs || mapArgs.length < 2) {
          if (cm) {
            showConfirm(cm, 'Invalid mapping: ' + params.input);
          }
          return;
        }
        exCommandDispatcher.map(mapArgs[0], mapArgs[1], ctx);
      },
      imap: function(cm, params) { this.map(cm, params, 'insert'); },
      nmap: function(cm, params) { this.map(cm, params, 'normal'); },
      vmap: function(cm, params) { this.map(cm, params, 'visual'); },
      unmap: function(cm, params, ctx) {
        var mapArgs = params.args;
        if (!mapArgs || mapArgs.length < 1) {
          if (cm) {
            showConfirm(cm, 'No such mapping: ' + params.input);
          }
          return;
        }
        exCommandDispatcher.unmap(mapArgs[0], ctx);
      },
      move: function(cm, params) {
        commandDispatcher.processCommand(cm, cm.state.vim, {
            type: 'motion',
            motion: 'moveToLineOrEdgeOfDocument',
            motionArgs: { forward: false, explicitRepeat: true,
              linewise: true },
            repeatOverride: params.line+1});
      },
      set: function(cm, params) {
        var setArgs = params.args;
        // Options passed through to the setOption/getOption calls. May be passed in by the
        // local/global versions of the set command
        var setCfg = params.setCfg || {};
        if (!setArgs || setArgs.length < 1) {
          if (cm) {
            showConfirm(cm, 'Invalid mapping: ' + params.input);
          }
          return;
        }
        var expr = setArgs[0].split('=');
        var optionName = expr[0];
        var value = expr[1];
        var forceGet = false;

        if (optionName.charAt(optionName.length - 1) == '?') {
          // If post-fixed with ?, then the set is actually a get.
          if (value) { throw Error('Trailing characters: ' + params.argString); }
          optionName = optionName.substring(0, optionName.length - 1);
          forceGet = true;
        }
        if (value === undefined && optionName.substring(0, 2) == 'no') {
          // To set boolean options to false, the option name is prefixed with
          // 'no'.
          optionName = optionName.substring(2);
          value = false;
        }

        var optionIsBoolean = options[optionName] && options[optionName].type == 'boolean';
        if (optionIsBoolean && value == undefined) {
          // Calling set with a boolean option sets it to true.
          value = true;
        }
        // If no value is provided, then we assume this is a get.
        if (!optionIsBoolean && value === undefined || forceGet) {
          var oldValue = getOption(optionName, cm, setCfg);
          if (oldValue instanceof Error) {
            showConfirm(cm, oldValue.message);
          } else if (oldValue === true || oldValue === false) {
            showConfirm(cm, ' ' + (oldValue ? '' : 'no') + optionName);
          } else {
            showConfirm(cm, '  ' + optionName + '=' + oldValue);
          }
        } else {
          var setOptionReturn = setOption(optionName, value, cm, setCfg);
          if (setOptionReturn instanceof Error) {
            showConfirm(cm, setOptionReturn.message);
          }
        }
      },
      setlocal: function (cm, params) {
        // setCfg is passed through to setOption
        params.setCfg = {scope: 'local'};
        this.set(cm, params);
      },
      setglobal: function (cm, params) {
        // setCfg is passed through to setOption
        params.setCfg = {scope: 'global'};
        this.set(cm, params);
      },
      registers: function(cm, params) {
        var regArgs = params.args;
        var registers = vimGlobalState.registerController.registers;
        var regInfo = '----------Registers----------<br><br>';
        if (!regArgs) {
          for (var registerName in registers) {
            var text = registers[registerName].toString();
            if (text.length) {
              regInfo += '"' + registerName + '    ' + text + '<br>';
            }
          }
        } else {
          var registerName;
          regArgs = regArgs.join('');
          for (var i = 0; i < regArgs.length; i++) {
            registerName = regArgs.charAt(i);
            if (!vimGlobalState.registerController.isValidRegister(registerName)) {
              continue;
            }
            var register = registers[registerName] || new Register();
            regInfo += '"' + registerName + '    ' + register.toString() + '<br>';
          }
        }
        showConfirm(cm, regInfo);
      },
      sort: function(cm, params) {
        var reverse, ignoreCase, unique, number, pattern;
        function parseArgs() {
          if (params.argString) {
            var args = new CodeMirror.StringStream(params.argString);
            if (args.eat('!')) { reverse = true; }
            if (args.eol()) { return; }
            if (!args.eatSpace()) { return 'Invalid arguments'; }
            var opts = args.match(/([dinuox]+)?\s*(\/.+\/)?\s*/);
            if (!opts && !args.eol()) { return 'Invalid arguments'; }
            if (opts[1]) {
              ignoreCase = opts[1].indexOf('i') != -1;
              unique = opts[1].indexOf('u') != -1;
              var decimal = opts[1].indexOf('d') != -1 || opts[1].indexOf('n') != -1 && 1;
              var hex = opts[1].indexOf('x') != -1 && 1;
              var octal = opts[1].indexOf('o') != -1 && 1;
              if (decimal + hex + octal > 1) { return 'Invalid arguments'; }
              number = decimal && 'decimal' || hex && 'hex' || octal && 'octal';
            }
            if (opts[2]) {
              pattern = new RegExp(opts[2].substr(1, opts[2].length - 2), ignoreCase ? 'i' : '');
            }
          }
        }
        var err = parseArgs();
        if (err) {
          showConfirm(cm, err + ': ' + params.argString);
          return;
        }
        var lineStart = params.line || cm.firstLine();
        var lineEnd = params.lineEnd || params.line || cm.lastLine();
        if (lineStart == lineEnd) { return; }
        var curStart = Pos(lineStart, 0);
        var curEnd = Pos(lineEnd, lineLength(cm, lineEnd));
        var text = cm.getRange(curStart, curEnd).split('\n');
        var numberRegex = pattern ? pattern :
           (number == 'decimal') ? /(-?)([\d]+)/ :
           (number == 'hex') ? /(-?)(?:0x)?([0-9a-f]+)/i :
           (number == 'octal') ? /([0-7]+)/ : null;
        var radix = (number == 'decimal') ? 10 : (number == 'hex') ? 16 : (number == 'octal') ? 8 : null;
        var numPart = [], textPart = [];
        if (number || pattern) {
          for (var i = 0; i < text.length; i++) {
            var matchPart = pattern ? text[i].match(pattern) : null;
            if (matchPart && matchPart[0] != '') {
              numPart.push(matchPart);
            } else if (!pattern && numberRegex.exec(text[i])) {
              numPart.push(text[i]);
            } else {
              textPart.push(text[i]);
            }
          }
        } else {
          textPart = text;
        }
        function compareFn(a, b) {
          if (reverse) { var tmp; tmp = a; a = b; b = tmp; }
          if (ignoreCase) { a = a.toLowerCase(); b = b.toLowerCase(); }
          var anum = number && numberRegex.exec(a);
          var bnum = number && numberRegex.exec(b);
          if (!anum) { return a < b ? -1 : 1; }
          anum = parseInt((anum[1] + anum[2]).toLowerCase(), radix);
          bnum = parseInt((bnum[1] + bnum[2]).toLowerCase(), radix);
          return anum - bnum;
        }
        function comparePatternFn(a, b) {
          if (reverse) { var tmp; tmp = a; a = b; b = tmp; }
          if (ignoreCase) { a[0] = a[0].toLowerCase(); b[0] = b[0].toLowerCase(); }
          return (a[0] < b[0]) ? -1 : 1;
        }
        numPart.sort(pattern ? comparePatternFn : compareFn);
        if (pattern) {
          for (var i = 0; i < numPart.length; i++) {
            numPart[i] = numPart[i].input;
          }
        } else if (!number) { textPart.sort(compareFn); }
        text = (!reverse) ? textPart.concat(numPart) : numPart.concat(textPart);
        if (unique) { // Remove duplicate lines
          var textOld = text;
          var lastLine;
          text = [];
          for (var i = 0; i < textOld.length; i++) {
            if (textOld[i] != lastLine) {
              text.push(textOld[i]);
            }
            lastLine = textOld[i];
          }
        }
        cm.replaceRange(text.join('\n'), curStart, curEnd);
      },
      global: function(cm, params) {
        // a global command is of the form
        // :[range]g/pattern/[cmd]
        // argString holds the string /pattern/[cmd]
        var argString = params.argString;
        if (!argString) {
          showConfirm(cm, 'Regular Expression missing from global');
          return;
        }
        // range is specified here
        var lineStart = (params.line !== undefined) ? params.line : cm.firstLine();
        var lineEnd = params.lineEnd || params.line || cm.lastLine();
        // get the tokens from argString
        var tokens = splitBySlash(argString);
        var regexPart = argString, cmd;
        if (tokens.length) {
          regexPart = tokens[0];
          cmd = tokens.slice(1, tokens.length).join('/');
        }
        if (regexPart) {
          // If regex part is empty, then use the previous query. Otherwise
          // use the regex part as the new query.
          try {
           updateSearchQuery(cm, regexPart, true /** ignoreCase */,
             true /** smartCase */);
          } catch (e) {
           showConfirm(cm, 'Invalid regex: ' + regexPart);
           return;
          }
        }
        // now that we have the regexPart, search for regex matches in the
        // specified range of lines
        var query = getSearchState(cm).getQuery();
        var matchedLines = [], content = '';
        for (var i = lineStart; i <= lineEnd; i++) {
          var matched = query.test(cm.getLine(i));
          if (matched) {
            matchedLines.push(i+1);
            content+= cm.getLine(i) + '<br>';
          }
        }
        // if there is no [cmd], just display the list of matched lines
        if (!cmd) {
          showConfirm(cm, content);
          return;
        }
        var index = 0;
        var nextCommand = function() {
          if (index < matchedLines.length) {
            var command = matchedLines[index] + cmd;
            exCommandDispatcher.processCommand(cm, command, {
              callback: nextCommand
            });
          }
          index++;
        };
        nextCommand();
      },
      substitute: function(cm, params) {
        if (!cm.getSearchCursor) {
          throw new Error('Search feature not available. Requires searchcursor.js or ' +
              'any other getSearchCursor implementation.');
        }
        var argString = params.argString;
        var tokens = argString ? splitBySeparator(argString, argString[0]) : [];
        var regexPart, replacePart = '', trailing, flagsPart, count;
        var confirm = false; // Whether to confirm each replace.
        var global = false; // True to replace all instances on a line, false to replace only 1.
        if (tokens.length) {
          regexPart = tokens[0];
          if (getOption('pcre') && regexPart !== '') {
              regexPart = new RegExp(regexPart).source; //normalize not escaped characters
          }
          replacePart = tokens[1];
          if (regexPart && regexPart[regexPart.length - 1] === '$') {
            regexPart = regexPart.slice(0, regexPart.length - 1) + '\\n';
            replacePart = replacePart ? replacePart + '\n' : '\n';
          }
          if (replacePart !== undefined) {
            if (getOption('pcre')) {
              replacePart = unescapeRegexReplace(replacePart.replace(/([^\\])&/g,"$1$$&"));
            } else {
              replacePart = translateRegexReplace(replacePart);
            }
            vimGlobalState.lastSubstituteReplacePart = replacePart;
          }
          trailing = tokens[2] ? tokens[2].split(' ') : [];
        } else {
          // either the argString is empty or its of the form ' hello/world'
          // actually splitBySlash returns a list of tokens
          // only if the string starts with a '/'
          if (argString && argString.length) {
            showConfirm(cm, 'Substitutions should be of the form ' +
                ':s/pattern/replace/');
            return;
          }
        }
        // After the 3rd slash, we can have flags followed by a space followed
        // by count.
        if (trailing) {
          flagsPart = trailing[0];
          count = parseInt(trailing[1]);
          if (flagsPart) {
            if (flagsPart.indexOf('c') != -1) {
              confirm = true;
              flagsPart.replace('c', '');
            }
            if (flagsPart.indexOf('g') != -1) {
              global = true;
              flagsPart.replace('g', '');
            }
            if (getOption('pcre')) {
               regexPart = regexPart + '/' + flagsPart;
            } else {
               regexPart = regexPart.replace(/\//g, "\\/") + '/' + flagsPart;
            }
          }
        }
        if (regexPart) {
          // If regex part is empty, then use the previous query. Otherwise use
          // the regex part as the new query.
          try {
            updateSearchQuery(cm, regexPart, true /** ignoreCase */,
              true /** smartCase */);
          } catch (e) {
            showConfirm(cm, 'Invalid regex: ' + regexPart);
            return;
          }
        }
        replacePart = replacePart || vimGlobalState.lastSubstituteReplacePart;
        if (replacePart === undefined) {
          showConfirm(cm, 'No previous substitute regular expression');
          return;
        }
        var state = getSearchState(cm);
        var query = state.getQuery();
        var lineStart = (params.line !== undefined) ? params.line : cm.getCursor().line;
        var lineEnd = params.lineEnd || lineStart;
        if (lineStart == cm.firstLine() && lineEnd == cm.lastLine()) {
          lineEnd = Infinity;
        }
        if (count) {
          lineStart = lineEnd;
          lineEnd = lineStart + count - 1;
        }
        var startPos = clipCursorToContent(cm, Pos(lineStart, 0));
        var cursor = cm.getSearchCursor(query, startPos);
        doReplace(cm, confirm, global, lineStart, lineEnd, cursor, query, replacePart, params.callback);
      },
      redo: CodeMirror.commands.redo,
      undo: CodeMirror.commands.undo,
      write: function(cm) {
        if (CodeMirror.commands.save) {
          // If a save command is defined, call it.
          CodeMirror.commands.save(cm);
        } else if (cm.save) {
          // Saves to text area if no save command is defined and cm.save() is available.
          cm.save();
        }
      },
      nohlsearch: function(cm) {
        clearSearchHighlight(cm);
      },
      yank: function (cm) {
        var cur = copyCursor(cm.getCursor());
        var line = cur.line;
        var lineText = cm.getLine(line);
        vimGlobalState.registerController.pushText(
          '0', 'yank', lineText, true, true);
      },
      delmarks: function(cm, params) {
        if (!params.argString || !trim(params.argString)) {
          showConfirm(cm, 'Argument required');
          return;
        }

        var state = cm.state.vim;
        var stream = new CodeMirror.StringStream(trim(params.argString));
        while (!stream.eol()) {
          stream.eatSpace();

          // Record the streams position at the beginning of the loop for use
          // in error messages.
          var count = stream.pos;

          if (!stream.match(/[a-zA-Z]/, false)) {
            showConfirm(cm, 'Invalid argument: ' + params.argString.substring(count));
            return;
          }

          var sym = stream.next();
          // Check if this symbol is part of a range
          if (stream.match('-', true)) {
            // This symbol is part of a range.

            // The range must terminate at an alphabetic character.
            if (!stream.match(/[a-zA-Z]/, false)) {
              showConfirm(cm, 'Invalid argument: ' + params.argString.substring(count));
              return;
            }

            var startMark = sym;
            var finishMark = stream.next();
            // The range must terminate at an alphabetic character which
            // shares the same case as the start of the range.
            if (isLowerCase(startMark) && isLowerCase(finishMark) ||
                isUpperCase(startMark) && isUpperCase(finishMark)) {
              var start = startMark.charCodeAt(0);
              var finish = finishMark.charCodeAt(0);
              if (start >= finish) {
                showConfirm(cm, 'Invalid argument: ' + params.argString.substring(count));
                return;
              }

              // Because marks are always ASCII values, and we have
              // determined that they are the same case, we can use
              // their char codes to iterate through the defined range.
              for (var j = 0; j <= finish - start; j++) {
                var mark = String.fromCharCode(start + j);
                delete state.marks[mark];
              }
            } else {
              showConfirm(cm, 'Invalid argument: ' + startMark + '-');
              return;
            }
          } else {
            // This symbol is a valid mark, and is not part of a range.
            delete state.marks[sym];
          }
        }
      }
    };

    var exCommandDispatcher = new ExCommandDispatcher();

    /**
    * @param {CodeMirror} cm CodeMirror instance we are in.
    * @param {boolean} confirm Whether to confirm each replace.
    * @param {Cursor} lineStart Line to start replacing from.
    * @param {Cursor} lineEnd Line to stop replacing at.
    * @param {RegExp} query Query for performing matches with.
    * @param {string} replaceWith Text to replace matches with. May contain $1,
    *     $2, etc for replacing captured groups using Javascript replace.
    * @param {function()} callback A callback for when the replace is done.
    */
    function doReplace(cm, confirm, global, lineStart, lineEnd, searchCursor, query,
        replaceWith, callback) {
      // Set up all the functions.
      cm.state.vim.exMode = true;
      var done = false;
      var lastPos = searchCursor.from();
      function replaceAll() {
        cm.operation(function() {
          while (!done) {
            replace();
            next();
          }
          stop();
        });
      }
      function replace() {
        var text = cm.getRange(searchCursor.from(), searchCursor.to());
        var newText = text.replace(query, replaceWith);
        searchCursor.replace(newText);
      }
      function next() {
        // The below only loops to skip over multiple occurrences on the same
        // line when 'global' is not true.
        while(searchCursor.findNext() &&
              isInRange(searchCursor.from(), lineStart, lineEnd)) {
          if (!global && lastPos && searchCursor.from().line == lastPos.line) {
            continue;
          }
          cm.scrollIntoView(searchCursor.from(), 30);
          cm.setSelection(searchCursor.from(), searchCursor.to());
          lastPos = searchCursor.from();
          done = false;
          return;
        }
        done = true;
      }
      function stop(close) {
        if (close) { close(); }
        cm.focus();
        if (lastPos) {
          cm.setCursor(lastPos);
          var vim = cm.state.vim;
          vim.exMode = false;
          vim.lastHPos = vim.lastHSPos = lastPos.ch;
        }
        if (callback) { callback(); }
      }
      function onPromptKeyDown(e, _value, close) {
        // Swallow all keys.
        CodeMirror.e_stop(e);
        var keyName = CodeMirror.keyName(e);
        switch (keyName) {
          case 'Y':
            replace(); next(); break;
          case 'N':
            next(); break;
          case 'A':
            // replaceAll contains a call to close of its own. We don't want it
            // to fire too early or multiple times.
            var savedCallback = callback;
            callback = undefined;
            cm.operation(replaceAll);
            callback = savedCallback;
            break;
          case 'L':
            replace();
            // fall through and exit.
          case 'Q':
          case 'Esc':
          case 'Ctrl-C':
          case 'Ctrl-[':
            stop(close);
            break;
        }
        if (done) { stop(close); }
        return true;
      }

      // Actually do replace.
      next();
      if (done) {
        showConfirm(cm, 'No matches for ' + query.source);
        return;
      }
      if (!confirm) {
        replaceAll();
        if (callback) { callback(); }
        return;
      }
      showPrompt(cm, {
        prefix: 'replace with <strong>' + replaceWith + '</strong> (y/n/a/q/l)',
        onKeyDown: onPromptKeyDown
      });
    }

    CodeMirror.keyMap.vim = {
      attach: attachVimMap,
      detach: detachVimMap,
      call: cmKey
    };

    function exitInsertMode(cm) {
      var vim = cm.state.vim;
      var macroModeState = vimGlobalState.macroModeState;
      var insertModeChangeRegister = vimGlobalState.registerController.getRegister('.');
      var isPlaying = macroModeState.isPlaying;
      var lastChange = macroModeState.lastInsertModeChanges;
      if (!isPlaying) {
        cm.off('change', onChange);
        CodeMirror.off(cm.getInputField(), 'keydown', onKeyEventTargetKeyDown);
      }
      if (!isPlaying && vim.insertModeRepeat > 1) {
        // Perform insert mode repeat for commands like 3,a and 3,o.
        repeatLastEdit(cm, vim, vim.insertModeRepeat - 1,
            true /** repeatForInsert */);
        vim.lastEditInputState.repeatOverride = vim.insertModeRepeat;
      }
      delete vim.insertModeRepeat;
      vim.insertMode = false;
      cm.setCursor(cm.getCursor().line, cm.getCursor().ch-1);
      cm.setOption('keyMap', 'vim');
      cm.setOption('disableInput', true);
      cm.toggleOverwrite(false); // exit replace mode if we were in it.
      // update the ". register before exiting insert mode
      insertModeChangeRegister.setText(lastChange.changes.join(''));
      CodeMirror.signal(cm, "vim-mode-change", {mode: "normal"});
      if (macroModeState.isRecording) {
        logInsertModeChange(macroModeState);
      }
    }

    function _mapCommand(command) {
      defaultKeymap.unshift(command);
    }

    function mapCommand(keys, type, name, args, extra) {
      var command = {keys: keys, type: type};
      command[type] = name;
      command[type + "Args"] = args;
      for (var key in extra)
        command[key] = extra[key];
      _mapCommand(command);
    }

    // The timeout in milliseconds for the two-character ESC keymap should be
    // adjusted according to your typing speed to prevent false positives.
    defineOption('insertModeEscKeysTimeout', 200, 'number');

    CodeMirror.keyMap['vim-insert'] = {
      // TODO: override navigation keys so that Esc will cancel automatic
      // indentation from o, O, i_<CR>
      fallthrough: ['default'],
      attach: attachVimMap,
      detach: detachVimMap,
      call: cmKey
    };

    CodeMirror.keyMap['vim-replace'] = {
      'Backspace': 'goCharLeft',
      fallthrough: ['vim-insert'],
      attach: attachVimMap,
      detach: detachVimMap,
      call: cmKey
    };

    function executeMacroRegister(cm, vim, macroModeState, registerName) {
      var register = vimGlobalState.registerController.getRegister(registerName);
      if (registerName == ':') {
        // Read-only register containing last Ex command.
        if (register.keyBuffer[0]) {
          exCommandDispatcher.processCommand(cm, register.keyBuffer[0]);
        }
        macroModeState.isPlaying = false;
        return;
      }
      var keyBuffer = register.keyBuffer;
      var imc = 0;
      macroModeState.isPlaying = true;
      macroModeState.replaySearchQueries = register.searchQueries.slice(0);
      for (var i = 0; i < keyBuffer.length; i++) {
        var text = keyBuffer[i];
        var match, key;
        while (text) {
          // Pull off one command key, which is either a single character
          // or a special sequence wrapped in '<' and '>', e.g. '<Space>'.
          match = (/<\w+-.+?>|<\w+>|./).exec(text);
          key = match[0];
          text = text.substring(match.index + key.length);
          CodeMirror.Vim.handleKey(cm, key, 'macro');
          if (vim.insertMode) {
            var changes = register.insertModeChanges[imc++].changes;
            vimGlobalState.macroModeState.lastInsertModeChanges.changes =
                changes;
            repeatInsertModeChanges(cm, changes, 1);
            exitInsertMode(cm);
          }
        }
      }
      macroModeState.isPlaying = false;
    }

    function logKey(macroModeState, key) {
      if (macroModeState.isPlaying) { return; }
      var registerName = macroModeState.latestRegister;
      var register = vimGlobalState.registerController.getRegister(registerName);
      if (register) {
        register.pushText(key);
      }
    }

    function logInsertModeChange(macroModeState) {
      if (macroModeState.isPlaying) { return; }
      var registerName = macroModeState.latestRegister;
      var register = vimGlobalState.registerController.getRegister(registerName);
      if (register && register.pushInsertModeChanges) {
        register.pushInsertModeChanges(macroModeState.lastInsertModeChanges);
      }
    }

    function logSearchQuery(macroModeState, query) {
      if (macroModeState.isPlaying) { return; }
      var registerName = macroModeState.latestRegister;
      var register = vimGlobalState.registerController.getRegister(registerName);
      if (register && register.pushSearchQuery) {
        register.pushSearchQuery(query);
      }
    }

    /**
     * Listens for changes made in insert mode.
     * Should only be active in insert mode.
     */
    function onChange(cm, changeObj) {
      var macroModeState = vimGlobalState.macroModeState;
      var lastChange = macroModeState.lastInsertModeChanges;
      if (!macroModeState.isPlaying) {
        while(changeObj) {
          lastChange.expectCursorActivityForChange = true;
          if (lastChange.ignoreCount > 1) {
            lastChange.ignoreCount--;
          } else if (changeObj.origin == '+input' || changeObj.origin == 'paste'
              || changeObj.origin === undefined /* only in testing */) {
            var selectionCount = cm.listSelections().length;
            if (selectionCount > 1)
              lastChange.ignoreCount = selectionCount;
            var text = changeObj.text.join('\n');
            if (lastChange.maybeReset) {
              lastChange.changes = [];
              lastChange.maybeReset = false;
            }
            if (text) {
              if (cm.state.overwrite && !/\n/.test(text)) {
                lastChange.changes.push([text]);
              } else {
                lastChange.changes.push(text);
              }
            }
          }
          // Change objects may be chained with next.
          changeObj = changeObj.next;
        }
      }
    }

    /**
    * Listens for any kind of cursor activity on CodeMirror.
    */
    function onCursorActivity(cm) {
      var vim = cm.state.vim;
      if (vim.insertMode) {
        // Tracking cursor activity in insert mode (for macro support).
        var macroModeState = vimGlobalState.macroModeState;
        if (macroModeState.isPlaying) { return; }
        var lastChange = macroModeState.lastInsertModeChanges;
        if (lastChange.expectCursorActivityForChange) {
          lastChange.expectCursorActivityForChange = false;
        } else {
          // Cursor moved outside the context of an edit. Reset the change.
          lastChange.maybeReset = true;
        }
      } else if (!cm.curOp.isVimOp) {
        handleExternalSelection(cm, vim);
      }
      if (vim.visualMode) {
        updateFakeCursor(cm);
      }
    }
    /**
     * Keeps track of a fake cursor to support visual mode cursor behavior.
     */
    function updateFakeCursor(cm) {
      var className = 'cm-animate-fat-cursor';
      var vim = cm.state.vim;
      var from = clipCursorToContent(cm, copyCursor(vim.sel.head));
      var to = offsetCursor(from, 0, 1);
      clearFakeCursor(vim);
      // In visual mode, the cursor may be positioned over EOL.
      if (from.ch == cm.getLine(from.line).length) {
        var widget = document.createElement("span");
        widget.textContent = "\u00a0";
        widget.className = className;
        vim.fakeCursorBookmark = cm.setBookmark(from, {widget: widget});
      } else {
        vim.fakeCursor = cm.markText(from, to, {className: className});
      }
    }
    function clearFakeCursor(vim) {
      if (vim.fakeCursor) {
        vim.fakeCursor.clear();
        vim.fakeCursor = null;
      }
      if (vim.fakeCursorBookmark) {
        vim.fakeCursorBookmark.clear();
        vim.fakeCursorBookmark = null;
      }
    }
    function handleExternalSelection(cm, vim) {
      var anchor = cm.getCursor('anchor');
      var head = cm.getCursor('head');
      // Enter or exit visual mode to match mouse selection.
      if (vim.visualMode && !cm.somethingSelected()) {
        exitVisualMode(cm, false);
      } else if (!vim.visualMode && !vim.insertMode && cm.somethingSelected()) {
        vim.visualMode = true;
        vim.visualLine = false;
        CodeMirror.signal(cm, "vim-mode-change", {mode: "visual"});
      }
      if (vim.visualMode) {
        // Bind CodeMirror selection model to vim selection model.
        // Mouse selections are considered visual characterwise.
        var headOffset = !cursorIsBefore(head, anchor) ? -1 : 0;
        var anchorOffset = cursorIsBefore(head, anchor) ? -1 : 0;
        head = offsetCursor(head, 0, headOffset);
        anchor = offsetCursor(anchor, 0, anchorOffset);
        vim.sel = {
          anchor: anchor,
          head: head
        };
        updateMark(cm, vim, '<', cursorMin(head, anchor));
        updateMark(cm, vim, '>', cursorMax(head, anchor));
      } else if (!vim.insertMode) {
        // Reset lastHPos if selection was modified by something outside of vim mode e.g. by mouse.
        vim.lastHPos = cm.getCursor().ch;
      }
    }

    /** Wrapper for special keys pressed in insert mode */
    function InsertModeKey(keyName) {
      this.keyName = keyName;
    }

    /**
    * Handles raw key down events from the text area.
    * - Should only be active in insert mode.
    * - For recording deletes in insert mode.
    */
    function onKeyEventTargetKeyDown(e) {
      var macroModeState = vimGlobalState.macroModeState;
      var lastChange = macroModeState.lastInsertModeChanges;
      var keyName = CodeMirror.keyName(e);
      if (!keyName) { return; }
      function onKeyFound() {
        if (lastChange.maybeReset) {
          lastChange.changes = [];
          lastChange.maybeReset = false;
        }
        lastChange.changes.push(new InsertModeKey(keyName));
        return true;
      }
      if (keyName.indexOf('Delete') != -1 || keyName.indexOf('Backspace') != -1) {
        CodeMirror.lookupKey(keyName, 'vim-insert', onKeyFound);
      }
    }

    /**
     * Repeats the last edit, which includes exactly 1 command and at most 1
     * insert. Operator and motion commands are read from lastEditInputState,
     * while action commands are read from lastEditActionCommand.
     *
     * If repeatForInsert is true, then the function was called by
     * exitInsertMode to repeat the insert mode changes the user just made. The
     * corresponding enterInsertMode call was made with a count.
     */
    function repeatLastEdit(cm, vim, repeat, repeatForInsert) {
      var macroModeState = vimGlobalState.macroModeState;
      macroModeState.isPlaying = true;
      var isAction = !!vim.lastEditActionCommand;
      var cachedInputState = vim.inputState;
      function repeatCommand() {
        if (isAction) {
          commandDispatcher.processAction(cm, vim, vim.lastEditActionCommand);
        } else {
          commandDispatcher.evalInput(cm, vim);
        }
      }
      function repeatInsert(repeat) {
        if (macroModeState.lastInsertModeChanges.changes.length > 0) {
          // For some reason, repeat cw in desktop VIM does not repeat
          // insert mode changes. Will conform to that behavior.
          repeat = !vim.lastEditActionCommand ? 1 : repeat;
          var changeObject = macroModeState.lastInsertModeChanges;
          repeatInsertModeChanges(cm, changeObject.changes, repeat);
        }
      }
      vim.inputState = vim.lastEditInputState;
      if (isAction && vim.lastEditActionCommand.interlaceInsertRepeat) {
        // o and O repeat have to be interlaced with insert repeats so that the
        // insertions appear on separate lines instead of the last line.
        for (var i = 0; i < repeat; i++) {
          repeatCommand();
          repeatInsert(1);
        }
      } else {
        if (!repeatForInsert) {
          // Hack to get the cursor to end up at the right place. If I is
          // repeated in insert mode repeat, cursor will be 1 insert
          // change set left of where it should be.
          repeatCommand();
        }
        repeatInsert(repeat);
      }
      vim.inputState = cachedInputState;
      if (vim.insertMode && !repeatForInsert) {
        // Don't exit insert mode twice. If repeatForInsert is set, then we
        // were called by an exitInsertMode call lower on the stack.
        exitInsertMode(cm);
      }
      macroModeState.isPlaying = false;
    }

    function repeatInsertModeChanges(cm, changes, repeat) {
      function keyHandler(binding) {
        if (typeof binding == 'string') {
          CodeMirror.commands[binding](cm);
        } else {
          binding(cm);
        }
        return true;
      }
      var head = cm.getCursor('head');
      var visualBlock = vimGlobalState.macroModeState.lastInsertModeChanges.visualBlock;
      if (visualBlock) {
        // Set up block selection again for repeating the changes.
        selectForInsert(cm, head, visualBlock + 1);
        repeat = cm.listSelections().length;
        cm.setCursor(head);
      }
      for (var i = 0; i < repeat; i++) {
        if (visualBlock) {
          cm.setCursor(offsetCursor(head, i, 0));
        }
        for (var j = 0; j < changes.length; j++) {
          var change = changes[j];
          if (change instanceof InsertModeKey) {
            CodeMirror.lookupKey(change.keyName, 'vim-insert', keyHandler);
          } else if (typeof change == "string") {
            var cur = cm.getCursor();
            cm.replaceRange(change, cur, cur);
          } else {
            var start = cm.getCursor();
            var end = offsetCursor(start, 0, change[0].length);
            cm.replaceRange(change[0], start, end);
          }
        }
      }
      if (visualBlock) {
        cm.setCursor(offsetCursor(head, 0, 1));
      }
    }

    resetVimGlobalState();
    return vimApi;
  };
  // Initialize Vim and make it available as an API.
  CodeMirror.Vim = Vim();
});


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29kZW1pcnJvci9rZXltYXAvdmltLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUVBQXFFLEdBQUc7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE1BQU0sSUFBdUQ7QUFDN0QsUUFBUSxtQkFBTyxDQUFDLCtCQUFtQixHQUFHLG1CQUFPLENBQUMsMENBQThCLEdBQUcsbUJBQU8sQ0FBQyxvQ0FBd0IsR0FBRyxtQkFBTyxDQUFDLDRDQUFnQztBQUMxSixPQUFPLEVBR2E7QUFDcEIsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUssZ0RBQWdEO0FBQ3JELEtBQUssaURBQWlEO0FBQ3RELEtBQUssOENBQThDO0FBQ25ELEtBQUssZ0RBQWdEO0FBQ3JELEtBQUssaURBQWlEO0FBQ3RELEtBQUssZ0VBQWdFO0FBQ3JFLEtBQUssaUVBQWlFO0FBQ3RFLEtBQUssbURBQW1EO0FBQ3hELEtBQUssbUVBQW1FO0FBQ3hFLEtBQUssbURBQW1EO0FBQ3hELEtBQUssbUVBQW1FO0FBQ3hFLEtBQUssK0NBQStDO0FBQ3BELEtBQUssK0NBQStDO0FBQ3BELEtBQUssbURBQW1EO0FBQ3hELEtBQUssbURBQW1EO0FBQ3hELEtBQUssc0VBQXNFO0FBQzNFLEtBQUssc0VBQXNFO0FBQzNFLEtBQUssK0RBQStEO0FBQ3BFLEtBQUssNkRBQTZEO0FBQ2xFLEtBQUssK0RBQStEO0FBQ3BFLEtBQUssZ0VBQWdFO0FBQ3JFLEtBQUssZ0RBQWdEO0FBQ3JELEtBQUssK0NBQStDO0FBQ3BELEtBQUssc0RBQXNE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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsNERBQTREO0FBQzVEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3REFBd0QsWUFBWTtBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUMxQyxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLHVCQUF1QixRQUFRO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLHdDQUF3QztBQUNqRjtBQUNBLHlCQUF5QixxQkFBcUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCLFNBQVM7QUFDVCxrQkFBa0I7QUFDbEI7O0FBRUE7QUFDQSx1QkFBdUIseUJBQXlCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEIsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSw0QkFBNEI7QUFDNUIscUVBQXFFO0FBQ3JFLFdBQVc7QUFDWCw0QkFBNEI7QUFDNUIsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixtQkFBbUI7QUFDbEQ7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsdUNBQXVDLFFBQVE7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBZ0IsT0FBTyx1QkFBdUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsNEVBQTRFO0FBQ3BIO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsdUJBQXVCLHVCQUF1QjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFlBQVk7QUFDbkM7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixZQUFZO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixvQkFBb0I7QUFDM0M7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMiLCJmaWxlIjoiNjUuYjc3MzU4ZTgwNmFiM2E1YjY4YjcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb2RlTWlycm9yLCBjb3B5cmlnaHQgKGMpIGJ5IE1hcmlqbiBIYXZlcmJla2UgYW5kIG90aGVyc1xuLy8gRGlzdHJpYnV0ZWQgdW5kZXIgYW4gTUlUIGxpY2Vuc2U6IGh0dHBzOi8vY29kZW1pcnJvci5uZXQvTElDRU5TRVxuXG4vKipcbiAqIFN1cHBvcnRlZCBrZXliaW5kaW5nczpcbiAqICAgVG9vIG1hbnkgdG8gbGlzdC4gUmVmZXIgdG8gZGVmYXVsdEtleW1hcCBiZWxvdy5cbiAqXG4gKiBTdXBwb3J0ZWQgRXggY29tbWFuZHM6XG4gKiAgIFJlZmVyIHRvIGRlZmF1bHRFeENvbW1hbmRNYXAgYmVsb3cuXG4gKlxuICogUmVnaXN0ZXJzOiB1bm5hbWVkLCAtLCBhLXosIEEtWiwgMC05XG4gKiAgIChEb2VzIG5vdCByZXNwZWN0IHRoZSBzcGVjaWFsIGNhc2UgZm9yIG51bWJlciByZWdpc3RlcnMgd2hlbiBkZWxldGVcbiAqICAgIG9wZXJhdG9yIGlzIG1hZGUgd2l0aCB0aGVzZSBjb21tYW5kczogJSwgKCwgKSwgICwgLywgPywgbiwgTiwgeywgfSApXG4gKiAgIFRPRE86IEltcGxlbWVudCB0aGUgcmVtYWluaW5nIHJlZ2lzdGVycy5cbiAqXG4gKiBNYXJrczogYS16LCBBLVosIGFuZCAwLTlcbiAqICAgVE9ETzogSW1wbGVtZW50IHRoZSByZW1haW5pbmcgc3BlY2lhbCBtYXJrcy4gVGhleSBoYXZlIG1vcmUgY29tcGxleFxuICogICAgICAgYmVoYXZpb3IuXG4gKlxuICogRXZlbnRzOlxuICogICd2aW0tbW9kZS1jaGFuZ2UnIC0gcmFpc2VkIG9uIHRoZSBlZGl0b3IgYW55dGltZSB0aGUgY3VycmVudCBtb2RlIGNoYW5nZXMsXG4gKiAgICAgICAgICAgICAgICAgICAgICBFdmVudCBvYmplY3Q6IHttb2RlOiBcInZpc3VhbFwiLCBzdWJNb2RlOiBcImxpbmV3aXNlXCJ9XG4gKlxuICogQ29kZSBzdHJ1Y3R1cmU6XG4gKiAgMS4gRGVmYXVsdCBrZXltYXBcbiAqICAyLiBWYXJpYWJsZSBkZWNsYXJhdGlvbnMgYW5kIHNob3J0IGJhc2ljIGhlbHBlcnNcbiAqICAzLiBJbnN0YW5jZSAoRXh0ZXJuYWwgQVBJKSBpbXBsZW1lbnRhdGlvblxuICogIDQuIEludGVybmFsIHN0YXRlIHRyYWNraW5nIG9iamVjdHMgKGlucHV0IHN0YXRlLCBjb3VudGVyKSBpbXBsZW1lbnRhdGlvblxuICogICAgIGFuZCBpbnN0YW50aWF0aW9uXG4gKiAgNS4gS2V5IGhhbmRsZXIgKHRoZSBtYWluIGNvbW1hbmQgZGlzcGF0Y2hlcikgaW1wbGVtZW50YXRpb25cbiAqICA2LiBNb3Rpb24sIG9wZXJhdG9yLCBhbmQgYWN0aW9uIGltcGxlbWVudGF0aW9uc1xuICogIDcuIEhlbHBlciBmdW5jdGlvbnMgZm9yIHRoZSBrZXkgaGFuZGxlciwgbW90aW9ucywgb3BlcmF0b3JzLCBhbmQgYWN0aW9uc1xuICogIDguIFNldCB1cCBWaW0gdG8gd29yayBhcyBhIGtleW1hcCBmb3IgQ29kZU1pcnJvci5cbiAqICA5LiBFeCBjb21tYW5kIGltcGxlbWVudGF0aW9ucy5cbiAqL1xuXG4oZnVuY3Rpb24obW9kKSB7XG4gIGlmICh0eXBlb2YgZXhwb3J0cyA9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBtb2R1bGUgPT0gXCJvYmplY3RcIikgLy8gQ29tbW9uSlNcbiAgICBtb2QocmVxdWlyZShcIi4uL2xpYi9jb2RlbWlycm9yXCIpLCByZXF1aXJlKFwiLi4vYWRkb24vc2VhcmNoL3NlYXJjaGN1cnNvclwiKSwgcmVxdWlyZShcIi4uL2FkZG9uL2RpYWxvZy9kaWFsb2dcIiksIHJlcXVpcmUoXCIuLi9hZGRvbi9lZGl0L21hdGNoYnJhY2tldHMuanNcIikpO1xuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSAvLyBBTURcbiAgICBkZWZpbmUoW1wiLi4vbGliL2NvZGVtaXJyb3JcIiwgXCIuLi9hZGRvbi9zZWFyY2gvc2VhcmNoY3Vyc29yXCIsIFwiLi4vYWRkb24vZGlhbG9nL2RpYWxvZ1wiLCBcIi4uL2FkZG9uL2VkaXQvbWF0Y2hicmFja2V0c1wiXSwgbW9kKTtcbiAgZWxzZSAvLyBQbGFpbiBicm93c2VyIGVudlxuICAgIG1vZChDb2RlTWlycm9yKTtcbn0pKGZ1bmN0aW9uKENvZGVNaXJyb3IpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBkZWZhdWx0S2V5bWFwID0gW1xuICAgIC8vIEtleSB0byBrZXkgbWFwcGluZy4gVGhpcyBnb2VzIGZpcnN0IHRvIG1ha2UgaXQgcG9zc2libGUgdG8gb3ZlcnJpZGVcbiAgICAvLyBleGlzdGluZyBtYXBwaW5ncy5cbiAgICB7IGtleXM6ICc8TGVmdD4nLCB0eXBlOiAna2V5VG9LZXknLCB0b0tleXM6ICdoJyB9LFxuICAgIHsga2V5czogJzxSaWdodD4nLCB0eXBlOiAna2V5VG9LZXknLCB0b0tleXM6ICdsJyB9LFxuICAgIHsga2V5czogJzxVcD4nLCB0eXBlOiAna2V5VG9LZXknLCB0b0tleXM6ICdrJyB9LFxuICAgIHsga2V5czogJzxEb3duPicsIHR5cGU6ICdrZXlUb0tleScsIHRvS2V5czogJ2onIH0sXG4gICAgeyBrZXlzOiAnPFNwYWNlPicsIHR5cGU6ICdrZXlUb0tleScsIHRvS2V5czogJ2wnIH0sXG4gICAgeyBrZXlzOiAnPEJTPicsIHR5cGU6ICdrZXlUb0tleScsIHRvS2V5czogJ2gnLCBjb250ZXh0OiAnbm9ybWFsJ30sXG4gICAgeyBrZXlzOiAnPERlbD4nLCB0eXBlOiAna2V5VG9LZXknLCB0b0tleXM6ICd4JywgY29udGV4dDogJ25vcm1hbCd9LFxuICAgIHsga2V5czogJzxDLVNwYWNlPicsIHR5cGU6ICdrZXlUb0tleScsIHRvS2V5czogJ1cnIH0sXG4gICAgeyBrZXlzOiAnPEMtQlM+JywgdHlwZTogJ2tleVRvS2V5JywgdG9LZXlzOiAnQicsIGNvbnRleHQ6ICdub3JtYWwnIH0sXG4gICAgeyBrZXlzOiAnPFMtU3BhY2U+JywgdHlwZTogJ2tleVRvS2V5JywgdG9LZXlzOiAndycgfSxcbiAgICB7IGtleXM6ICc8Uy1CUz4nLCB0eXBlOiAna2V5VG9LZXknLCB0b0tleXM6ICdiJywgY29udGV4dDogJ25vcm1hbCcgfSxcbiAgICB7IGtleXM6ICc8Qy1uPicsIHR5cGU6ICdrZXlUb0tleScsIHRvS2V5czogJ2onIH0sXG4gICAgeyBrZXlzOiAnPEMtcD4nLCB0eXBlOiAna2V5VG9LZXknLCB0b0tleXM6ICdrJyB9LFxuICAgIHsga2V5czogJzxDLVs+JywgdHlwZTogJ2tleVRvS2V5JywgdG9LZXlzOiAnPEVzYz4nIH0sXG4gICAgeyBrZXlzOiAnPEMtYz4nLCB0eXBlOiAna2V5VG9LZXknLCB0b0tleXM6ICc8RXNjPicgfSxcbiAgICB7IGtleXM6ICc8Qy1bPicsIHR5cGU6ICdrZXlUb0tleScsIHRvS2V5czogJzxFc2M+JywgY29udGV4dDogJ2luc2VydCcgfSxcbiAgICB7IGtleXM6ICc8Qy1jPicsIHR5cGU6ICdrZXlUb0tleScsIHRvS2V5czogJzxFc2M+JywgY29udGV4dDogJ2luc2VydCcgfSxcbiAgICB7IGtleXM6ICdzJywgdHlwZTogJ2tleVRvS2V5JywgdG9LZXlzOiAnY2wnLCBjb250ZXh0OiAnbm9ybWFsJyB9LFxuICAgIHsga2V5czogJ3MnLCB0eXBlOiAna2V5VG9LZXknLCB0b0tleXM6ICdjJywgY29udGV4dDogJ3Zpc3VhbCd9LFxuICAgIHsga2V5czogJ1MnLCB0eXBlOiAna2V5VG9LZXknLCB0b0tleXM6ICdjYycsIGNvbnRleHQ6ICdub3JtYWwnIH0sXG4gICAgeyBrZXlzOiAnUycsIHR5cGU6ICdrZXlUb0tleScsIHRvS2V5czogJ1ZkTycsIGNvbnRleHQ6ICd2aXN1YWwnIH0sXG4gICAgeyBrZXlzOiAnPEhvbWU+JywgdHlwZTogJ2tleVRvS2V5JywgdG9LZXlzOiAnMCcgfSxcbiAgICB7IGtleXM6ICc8RW5kPicsIHR5cGU6ICdrZXlUb0tleScsIHRvS2V5czogJyQnIH0sXG4gICAgeyBrZXlzOiAnPFBhZ2VVcD4nLCB0eXBlOiAna2V5VG9LZXknLCB0b0tleXM6ICc8Qy1iPicgfSxcbiAgICB7IGtleXM6ICc8UGFnZURvd24+JywgdHlwZTogJ2tleVRvS2V5JywgdG9LZXlzOiAnPEMtZj4nIH0sXG4gICAgeyBrZXlzOiAnPENSPicsIHR5cGU6ICdrZXlUb0tleScsIHRvS2V5czogJ2peJywgY29udGV4dDogJ25vcm1hbCcgfSxcbiAgICB7IGtleXM6ICc8SW5zPicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICd0b2dnbGVPdmVyd3JpdGUnLCBjb250ZXh0OiAnaW5zZXJ0JyB9LFxuICAgIC8vIE1vdGlvbnNcbiAgICB7IGtleXM6ICdIJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVUb1RvcExpbmUnLCBtb3Rpb25BcmdzOiB7IGxpbmV3aXNlOiB0cnVlLCB0b0p1bXBsaXN0OiB0cnVlIH19LFxuICAgIHsga2V5czogJ00nLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZVRvTWlkZGxlTGluZScsIG1vdGlvbkFyZ3M6IHsgbGluZXdpc2U6IHRydWUsIHRvSnVtcGxpc3Q6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnTCcsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlVG9Cb3R0b21MaW5lJywgbW90aW9uQXJnczogeyBsaW5ld2lzZTogdHJ1ZSwgdG9KdW1wbGlzdDogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICdoJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVCeUNoYXJhY3RlcnMnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IGZhbHNlIH19LFxuICAgIHsga2V5czogJ2wnLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZUJ5Q2hhcmFjdGVycycsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICdqJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVCeUxpbmVzJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiB0cnVlLCBsaW5ld2lzZTogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICdrJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVCeUxpbmVzJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiBmYWxzZSwgbGluZXdpc2U6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnZ2onLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZUJ5RGlzcGxheUxpbmVzJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiB0cnVlIH19LFxuICAgIHsga2V5czogJ2drJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVCeURpc3BsYXlMaW5lcycsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogZmFsc2UgfX0sXG4gICAgeyBrZXlzOiAndycsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlQnlXb3JkcycsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogdHJ1ZSwgd29yZEVuZDogZmFsc2UgfX0sXG4gICAgeyBrZXlzOiAnVycsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlQnlXb3JkcycsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogdHJ1ZSwgd29yZEVuZDogZmFsc2UsIGJpZ1dvcmQ6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnZScsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlQnlXb3JkcycsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogdHJ1ZSwgd29yZEVuZDogdHJ1ZSwgaW5jbHVzaXZlOiB0cnVlIH19LFxuICAgIHsga2V5czogJ0UnLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZUJ5V29yZHMnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IHRydWUsIHdvcmRFbmQ6IHRydWUsIGJpZ1dvcmQ6IHRydWUsIGluY2x1c2l2ZTogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICdiJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVCeVdvcmRzJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiBmYWxzZSwgd29yZEVuZDogZmFsc2UgfX0sXG4gICAgeyBrZXlzOiAnQicsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlQnlXb3JkcycsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogZmFsc2UsIHdvcmRFbmQ6IGZhbHNlLCBiaWdXb3JkOiB0cnVlIH19LFxuICAgIHsga2V5czogJ2dlJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVCeVdvcmRzJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiBmYWxzZSwgd29yZEVuZDogdHJ1ZSwgaW5jbHVzaXZlOiB0cnVlIH19LFxuICAgIHsga2V5czogJ2dFJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVCeVdvcmRzJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiBmYWxzZSwgd29yZEVuZDogdHJ1ZSwgYmlnV29yZDogdHJ1ZSwgaW5jbHVzaXZlOiB0cnVlIH19LFxuICAgIHsga2V5czogJ3snLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZUJ5UGFyYWdyYXBoJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiBmYWxzZSwgdG9KdW1wbGlzdDogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICd9JywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVCeVBhcmFncmFwaCcsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogdHJ1ZSwgdG9KdW1wbGlzdDogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICcoJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVCeVNlbnRlbmNlJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiBmYWxzZSB9fSxcbiAgICB7IGtleXM6ICcpJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVCeVNlbnRlbmNlJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiB0cnVlIH19LFxuICAgIHsga2V5czogJzxDLWY+JywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVCeVBhZ2UnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnPEMtYj4nLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZUJ5UGFnZScsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogZmFsc2UgfX0sXG4gICAgeyBrZXlzOiAnPEMtZD4nLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZUJ5U2Nyb2xsJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiB0cnVlLCBleHBsaWNpdFJlcGVhdDogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICc8Qy11PicsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlQnlTY3JvbGwnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IGZhbHNlLCBleHBsaWNpdFJlcGVhdDogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICdnZycsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlVG9MaW5lT3JFZGdlT2ZEb2N1bWVudCcsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogZmFsc2UsIGV4cGxpY2l0UmVwZWF0OiB0cnVlLCBsaW5ld2lzZTogdHJ1ZSwgdG9KdW1wbGlzdDogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICdHJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVUb0xpbmVPckVkZ2VPZkRvY3VtZW50JywgbW90aW9uQXJnczogeyBmb3J3YXJkOiB0cnVlLCBleHBsaWNpdFJlcGVhdDogdHJ1ZSwgbGluZXdpc2U6IHRydWUsIHRvSnVtcGxpc3Q6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnMCcsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlVG9TdGFydE9mTGluZScgfSxcbiAgICB7IGtleXM6ICdeJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVUb0ZpcnN0Tm9uV2hpdGVTcGFjZUNoYXJhY3RlcicgfSxcbiAgICB7IGtleXM6ICcrJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVCeUxpbmVzJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiB0cnVlLCB0b0ZpcnN0Q2hhcjp0cnVlIH19LFxuICAgIHsga2V5czogJy0nLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZUJ5TGluZXMnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IGZhbHNlLCB0b0ZpcnN0Q2hhcjp0cnVlIH19LFxuICAgIHsga2V5czogJ18nLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZUJ5TGluZXMnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IHRydWUsIHRvRmlyc3RDaGFyOnRydWUsIHJlcGVhdE9mZnNldDotMSB9fSxcbiAgICB7IGtleXM6ICckJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVUb0VvbCcsIG1vdGlvbkFyZ3M6IHsgaW5jbHVzaXZlOiB0cnVlIH19LFxuICAgIHsga2V5czogJyUnLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZVRvTWF0Y2hlZFN5bWJvbCcsIG1vdGlvbkFyZ3M6IHsgaW5jbHVzaXZlOiB0cnVlLCB0b0p1bXBsaXN0OiB0cnVlIH19LFxuICAgIHsga2V5czogJ2Y8Y2hhcmFjdGVyPicsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlVG9DaGFyYWN0ZXInLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IHRydWUgLCBpbmNsdXNpdmU6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnRjxjaGFyYWN0ZXI+JywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVUb0NoYXJhY3RlcicsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogZmFsc2UgfX0sXG4gICAgeyBrZXlzOiAndDxjaGFyYWN0ZXI+JywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVUaWxsQ2hhcmFjdGVyJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiB0cnVlLCBpbmNsdXNpdmU6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnVDxjaGFyYWN0ZXI+JywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVUaWxsQ2hhcmFjdGVyJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiBmYWxzZSB9fSxcbiAgICB7IGtleXM6ICc7JywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ3JlcGVhdExhc3RDaGFyYWN0ZXJTZWFyY2gnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnLCcsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdyZXBlYXRMYXN0Q2hhcmFjdGVyU2VhcmNoJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiBmYWxzZSB9fSxcbiAgICB7IGtleXM6ICdcXCc8Y2hhcmFjdGVyPicsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdnb1RvTWFyaycsIG1vdGlvbkFyZ3M6IHt0b0p1bXBsaXN0OiB0cnVlLCBsaW5ld2lzZTogdHJ1ZX19LFxuICAgIHsga2V5czogJ2A8Y2hhcmFjdGVyPicsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdnb1RvTWFyaycsIG1vdGlvbkFyZ3M6IHt0b0p1bXBsaXN0OiB0cnVlfX0sXG4gICAgeyBrZXlzOiAnXWAnLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnanVtcFRvTWFyaycsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogdHJ1ZSB9IH0sXG4gICAgeyBrZXlzOiAnW2AnLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnanVtcFRvTWFyaycsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogZmFsc2UgfSB9LFxuICAgIHsga2V5czogJ11cXCcnLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnanVtcFRvTWFyaycsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogdHJ1ZSwgbGluZXdpc2U6IHRydWUgfSB9LFxuICAgIHsga2V5czogJ1tcXCcnLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnanVtcFRvTWFyaycsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogZmFsc2UsIGxpbmV3aXNlOiB0cnVlIH0gfSxcbiAgICAvLyB0aGUgbmV4dCB0d28gYXJlbid0IG1vdGlvbnMgYnV0IG11c3QgY29tZSBiZWZvcmUgbW9yZSBnZW5lcmFsIG1vdGlvbiBkZWNsYXJhdGlvbnNcbiAgICB7IGtleXM6ICddcCcsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdwYXN0ZScsIGlzRWRpdDogdHJ1ZSwgYWN0aW9uQXJnczogeyBhZnRlcjogdHJ1ZSwgaXNFZGl0OiB0cnVlLCBtYXRjaEluZGVudDogdHJ1ZX19LFxuICAgIHsga2V5czogJ1twJywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ3Bhc3RlJywgaXNFZGl0OiB0cnVlLCBhY3Rpb25BcmdzOiB7IGFmdGVyOiBmYWxzZSwgaXNFZGl0OiB0cnVlLCBtYXRjaEluZGVudDogdHJ1ZX19LFxuICAgIHsga2V5czogJ108Y2hhcmFjdGVyPicsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlVG9TeW1ib2wnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IHRydWUsIHRvSnVtcGxpc3Q6IHRydWV9fSxcbiAgICB7IGtleXM6ICdbPGNoYXJhY3Rlcj4nLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZVRvU3ltYm9sJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiBmYWxzZSwgdG9KdW1wbGlzdDogdHJ1ZX19LFxuICAgIHsga2V5czogJ3wnLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZVRvQ29sdW1uJ30sXG4gICAgeyBrZXlzOiAnbycsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlVG9PdGhlckhpZ2hsaWdodGVkRW5kJywgY29udGV4dDondmlzdWFsJ30sXG4gICAgeyBrZXlzOiAnTycsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlVG9PdGhlckhpZ2hsaWdodGVkRW5kJywgbW90aW9uQXJnczoge3NhbWVMaW5lOiB0cnVlfSwgY29udGV4dDondmlzdWFsJ30sXG4gICAgLy8gT3BlcmF0b3JzXG4gICAgeyBrZXlzOiAnZCcsIHR5cGU6ICdvcGVyYXRvcicsIG9wZXJhdG9yOiAnZGVsZXRlJyB9LFxuICAgIHsga2V5czogJ3knLCB0eXBlOiAnb3BlcmF0b3InLCBvcGVyYXRvcjogJ3lhbmsnIH0sXG4gICAgeyBrZXlzOiAnYycsIHR5cGU6ICdvcGVyYXRvcicsIG9wZXJhdG9yOiAnY2hhbmdlJyB9LFxuICAgIHsga2V5czogJz0nLCB0eXBlOiAnb3BlcmF0b3InLCBvcGVyYXRvcjogJ2luZGVudEF1dG8nIH0sXG4gICAgeyBrZXlzOiAnPicsIHR5cGU6ICdvcGVyYXRvcicsIG9wZXJhdG9yOiAnaW5kZW50Jywgb3BlcmF0b3JBcmdzOiB7IGluZGVudFJpZ2h0OiB0cnVlIH19LFxuICAgIHsga2V5czogJzwnLCB0eXBlOiAnb3BlcmF0b3InLCBvcGVyYXRvcjogJ2luZGVudCcsIG9wZXJhdG9yQXJnczogeyBpbmRlbnRSaWdodDogZmFsc2UgfX0sXG4gICAgeyBrZXlzOiAnZ34nLCB0eXBlOiAnb3BlcmF0b3InLCBvcGVyYXRvcjogJ2NoYW5nZUNhc2UnIH0sXG4gICAgeyBrZXlzOiAnZ3UnLCB0eXBlOiAnb3BlcmF0b3InLCBvcGVyYXRvcjogJ2NoYW5nZUNhc2UnLCBvcGVyYXRvckFyZ3M6IHt0b0xvd2VyOiB0cnVlfSwgaXNFZGl0OiB0cnVlIH0sXG4gICAgeyBrZXlzOiAnZ1UnLCB0eXBlOiAnb3BlcmF0b3InLCBvcGVyYXRvcjogJ2NoYW5nZUNhc2UnLCBvcGVyYXRvckFyZ3M6IHt0b0xvd2VyOiBmYWxzZX0sIGlzRWRpdDogdHJ1ZSB9LFxuICAgIHsga2V5czogJ24nLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnZmluZE5leHQnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IHRydWUsIHRvSnVtcGxpc3Q6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnTicsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdmaW5kTmV4dCcsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogZmFsc2UsIHRvSnVtcGxpc3Q6IHRydWUgfX0sXG4gICAgLy8gT3BlcmF0b3ItTW90aW9uIGR1YWwgY29tbWFuZHNcbiAgICB7IGtleXM6ICd4JywgdHlwZTogJ29wZXJhdG9yTW90aW9uJywgb3BlcmF0b3I6ICdkZWxldGUnLCBtb3Rpb246ICdtb3ZlQnlDaGFyYWN0ZXJzJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiB0cnVlIH0sIG9wZXJhdG9yTW90aW9uQXJnczogeyB2aXN1YWxMaW5lOiBmYWxzZSB9fSxcbiAgICB7IGtleXM6ICdYJywgdHlwZTogJ29wZXJhdG9yTW90aW9uJywgb3BlcmF0b3I6ICdkZWxldGUnLCBtb3Rpb246ICdtb3ZlQnlDaGFyYWN0ZXJzJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiBmYWxzZSB9LCBvcGVyYXRvck1vdGlvbkFyZ3M6IHsgdmlzdWFsTGluZTogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICdEJywgdHlwZTogJ29wZXJhdG9yTW90aW9uJywgb3BlcmF0b3I6ICdkZWxldGUnLCBtb3Rpb246ICdtb3ZlVG9Fb2wnLCBtb3Rpb25BcmdzOiB7IGluY2x1c2l2ZTogdHJ1ZSB9LCBjb250ZXh0OiAnbm9ybWFsJ30sXG4gICAgeyBrZXlzOiAnRCcsIHR5cGU6ICdvcGVyYXRvcicsIG9wZXJhdG9yOiAnZGVsZXRlJywgb3BlcmF0b3JBcmdzOiB7IGxpbmV3aXNlOiB0cnVlIH0sIGNvbnRleHQ6ICd2aXN1YWwnfSxcbiAgICB7IGtleXM6ICdZJywgdHlwZTogJ29wZXJhdG9yTW90aW9uJywgb3BlcmF0b3I6ICd5YW5rJywgbW90aW9uOiAnZXhwYW5kVG9MaW5lJywgbW90aW9uQXJnczogeyBsaW5ld2lzZTogdHJ1ZSB9LCBjb250ZXh0OiAnbm9ybWFsJ30sXG4gICAgeyBrZXlzOiAnWScsIHR5cGU6ICdvcGVyYXRvcicsIG9wZXJhdG9yOiAneWFuaycsIG9wZXJhdG9yQXJnczogeyBsaW5ld2lzZTogdHJ1ZSB9LCBjb250ZXh0OiAndmlzdWFsJ30sXG4gICAgeyBrZXlzOiAnQycsIHR5cGU6ICdvcGVyYXRvck1vdGlvbicsIG9wZXJhdG9yOiAnY2hhbmdlJywgbW90aW9uOiAnbW92ZVRvRW9sJywgbW90aW9uQXJnczogeyBpbmNsdXNpdmU6IHRydWUgfSwgY29udGV4dDogJ25vcm1hbCd9LFxuICAgIHsga2V5czogJ0MnLCB0eXBlOiAnb3BlcmF0b3InLCBvcGVyYXRvcjogJ2NoYW5nZScsIG9wZXJhdG9yQXJnczogeyBsaW5ld2lzZTogdHJ1ZSB9LCBjb250ZXh0OiAndmlzdWFsJ30sXG4gICAgeyBrZXlzOiAnficsIHR5cGU6ICdvcGVyYXRvck1vdGlvbicsIG9wZXJhdG9yOiAnY2hhbmdlQ2FzZScsIG1vdGlvbjogJ21vdmVCeUNoYXJhY3RlcnMnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IHRydWUgfSwgb3BlcmF0b3JBcmdzOiB7IHNob3VsZE1vdmVDdXJzb3I6IHRydWUgfSwgY29udGV4dDogJ25vcm1hbCd9LFxuICAgIHsga2V5czogJ34nLCB0eXBlOiAnb3BlcmF0b3InLCBvcGVyYXRvcjogJ2NoYW5nZUNhc2UnLCBjb250ZXh0OiAndmlzdWFsJ30sXG4gICAgeyBrZXlzOiAnPEMtdz4nLCB0eXBlOiAnb3BlcmF0b3JNb3Rpb24nLCBvcGVyYXRvcjogJ2RlbGV0ZScsIG1vdGlvbjogJ21vdmVCeVdvcmRzJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiBmYWxzZSwgd29yZEVuZDogZmFsc2UgfSwgY29udGV4dDogJ2luc2VydCcgfSxcbiAgICAvL2lnbm9yZSBDLXcgaW4gbm9ybWFsIG1vZGVcbiAgICB7IGtleXM6ICc8Qy13PicsIHR5cGU6ICdpZGxlJywgY29udGV4dDogJ25vcm1hbCcgfSxcbiAgICAvLyBBY3Rpb25zXG4gICAgeyBrZXlzOiAnPEMtaT4nLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAnanVtcExpc3RXYWxrJywgYWN0aW9uQXJnczogeyBmb3J3YXJkOiB0cnVlIH19LFxuICAgIHsga2V5czogJzxDLW8+JywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ2p1bXBMaXN0V2FsaycsIGFjdGlvbkFyZ3M6IHsgZm9yd2FyZDogZmFsc2UgfX0sXG4gICAgeyBrZXlzOiAnPEMtZT4nLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAnc2Nyb2xsJywgYWN0aW9uQXJnczogeyBmb3J3YXJkOiB0cnVlLCBsaW5ld2lzZTogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICc8Qy15PicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdzY3JvbGwnLCBhY3Rpb25BcmdzOiB7IGZvcndhcmQ6IGZhbHNlLCBsaW5ld2lzZTogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICdhJywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ2VudGVySW5zZXJ0TW9kZScsIGlzRWRpdDogdHJ1ZSwgYWN0aW9uQXJnczogeyBpbnNlcnRBdDogJ2NoYXJBZnRlcicgfSwgY29udGV4dDogJ25vcm1hbCcgfSxcbiAgICB7IGtleXM6ICdBJywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ2VudGVySW5zZXJ0TW9kZScsIGlzRWRpdDogdHJ1ZSwgYWN0aW9uQXJnczogeyBpbnNlcnRBdDogJ2VvbCcgfSwgY29udGV4dDogJ25vcm1hbCcgfSxcbiAgICB7IGtleXM6ICdBJywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ2VudGVySW5zZXJ0TW9kZScsIGlzRWRpdDogdHJ1ZSwgYWN0aW9uQXJnczogeyBpbnNlcnRBdDogJ2VuZE9mU2VsZWN0ZWRBcmVhJyB9LCBjb250ZXh0OiAndmlzdWFsJyB9LFxuICAgIHsga2V5czogJ2knLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAnZW50ZXJJbnNlcnRNb2RlJywgaXNFZGl0OiB0cnVlLCBhY3Rpb25BcmdzOiB7IGluc2VydEF0OiAnaW5wbGFjZScgfSwgY29udGV4dDogJ25vcm1hbCcgfSxcbiAgICB7IGtleXM6ICdnaScsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdlbnRlckluc2VydE1vZGUnLCBpc0VkaXQ6IHRydWUsIGFjdGlvbkFyZ3M6IHsgaW5zZXJ0QXQ6ICdsYXN0RWRpdCcgfSwgY29udGV4dDogJ25vcm1hbCcgfSxcbiAgICB7IGtleXM6ICdJJywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ2VudGVySW5zZXJ0TW9kZScsIGlzRWRpdDogdHJ1ZSwgYWN0aW9uQXJnczogeyBpbnNlcnRBdDogJ2ZpcnN0Tm9uQmxhbmsnfSwgY29udGV4dDogJ25vcm1hbCcgfSxcbiAgICB7IGtleXM6ICdnSScsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdlbnRlckluc2VydE1vZGUnLCBpc0VkaXQ6IHRydWUsIGFjdGlvbkFyZ3M6IHsgaW5zZXJ0QXQ6ICdib2wnfSwgY29udGV4dDogJ25vcm1hbCcgfSxcbiAgICB7IGtleXM6ICdJJywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ2VudGVySW5zZXJ0TW9kZScsIGlzRWRpdDogdHJ1ZSwgYWN0aW9uQXJnczogeyBpbnNlcnRBdDogJ3N0YXJ0T2ZTZWxlY3RlZEFyZWEnIH0sIGNvbnRleHQ6ICd2aXN1YWwnIH0sXG4gICAgeyBrZXlzOiAnbycsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICduZXdMaW5lQW5kRW50ZXJJbnNlcnRNb2RlJywgaXNFZGl0OiB0cnVlLCBpbnRlcmxhY2VJbnNlcnRSZXBlYXQ6IHRydWUsIGFjdGlvbkFyZ3M6IHsgYWZ0ZXI6IHRydWUgfSwgY29udGV4dDogJ25vcm1hbCcgfSxcbiAgICB7IGtleXM6ICdPJywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ25ld0xpbmVBbmRFbnRlckluc2VydE1vZGUnLCBpc0VkaXQ6IHRydWUsIGludGVybGFjZUluc2VydFJlcGVhdDogdHJ1ZSwgYWN0aW9uQXJnczogeyBhZnRlcjogZmFsc2UgfSwgY29udGV4dDogJ25vcm1hbCcgfSxcbiAgICB7IGtleXM6ICd2JywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ3RvZ2dsZVZpc3VhbE1vZGUnIH0sXG4gICAgeyBrZXlzOiAnVicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICd0b2dnbGVWaXN1YWxNb2RlJywgYWN0aW9uQXJnczogeyBsaW5ld2lzZTogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICc8Qy12PicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICd0b2dnbGVWaXN1YWxNb2RlJywgYWN0aW9uQXJnczogeyBibG9ja3dpc2U6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnPEMtcT4nLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAndG9nZ2xlVmlzdWFsTW9kZScsIGFjdGlvbkFyZ3M6IHsgYmxvY2t3aXNlOiB0cnVlIH19LFxuICAgIHsga2V5czogJ2d2JywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ3Jlc2VsZWN0TGFzdFNlbGVjdGlvbicgfSxcbiAgICB7IGtleXM6ICdKJywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ2pvaW5MaW5lcycsIGlzRWRpdDogdHJ1ZSB9LFxuICAgIHsga2V5czogJ2dKJywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ2pvaW5MaW5lcycsIGFjdGlvbkFyZ3M6IHsga2VlcFNwYWNlczogdHJ1ZSB9LCBpc0VkaXQ6IHRydWUgfSxcbiAgICB7IGtleXM6ICdwJywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ3Bhc3RlJywgaXNFZGl0OiB0cnVlLCBhY3Rpb25BcmdzOiB7IGFmdGVyOiB0cnVlLCBpc0VkaXQ6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnUCcsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdwYXN0ZScsIGlzRWRpdDogdHJ1ZSwgYWN0aW9uQXJnczogeyBhZnRlcjogZmFsc2UsIGlzRWRpdDogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICdyPGNoYXJhY3Rlcj4nLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAncmVwbGFjZScsIGlzRWRpdDogdHJ1ZSB9LFxuICAgIHsga2V5czogJ0A8Y2hhcmFjdGVyPicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdyZXBsYXlNYWNybycgfSxcbiAgICB7IGtleXM6ICdxPGNoYXJhY3Rlcj4nLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAnZW50ZXJNYWNyb1JlY29yZE1vZGUnIH0sXG4gICAgLy8gSGFuZGxlIFJlcGxhY2UtbW9kZSBhcyBhIHNwZWNpYWwgY2FzZSBvZiBpbnNlcnQgbW9kZS5cbiAgICB7IGtleXM6ICdSJywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ2VudGVySW5zZXJ0TW9kZScsIGlzRWRpdDogdHJ1ZSwgYWN0aW9uQXJnczogeyByZXBsYWNlOiB0cnVlIH0sIGNvbnRleHQ6ICdub3JtYWwnfSxcbiAgICB7IGtleXM6ICdSJywgdHlwZTogJ29wZXJhdG9yJywgb3BlcmF0b3I6ICdjaGFuZ2UnLCBvcGVyYXRvckFyZ3M6IHsgbGluZXdpc2U6IHRydWUsIGZ1bGxMaW5lOiB0cnVlIH0sIGNvbnRleHQ6ICd2aXN1YWwnLCBleGl0VmlzdWFsQmxvY2s6IHRydWV9LFxuICAgIHsga2V5czogJ3UnLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAndW5kbycsIGNvbnRleHQ6ICdub3JtYWwnIH0sXG4gICAgeyBrZXlzOiAndScsIHR5cGU6ICdvcGVyYXRvcicsIG9wZXJhdG9yOiAnY2hhbmdlQ2FzZScsIG9wZXJhdG9yQXJnczoge3RvTG93ZXI6IHRydWV9LCBjb250ZXh0OiAndmlzdWFsJywgaXNFZGl0OiB0cnVlIH0sXG4gICAgeyBrZXlzOiAnVScsIHR5cGU6ICdvcGVyYXRvcicsIG9wZXJhdG9yOiAnY2hhbmdlQ2FzZScsIG9wZXJhdG9yQXJnczoge3RvTG93ZXI6IGZhbHNlfSwgY29udGV4dDogJ3Zpc3VhbCcsIGlzRWRpdDogdHJ1ZSB9LFxuICAgIHsga2V5czogJzxDLXI+JywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ3JlZG8nIH0sXG4gICAgeyBrZXlzOiAnbTxjaGFyYWN0ZXI+JywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ3NldE1hcmsnIH0sXG4gICAgeyBrZXlzOiAnXCI8Y2hhcmFjdGVyPicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdzZXRSZWdpc3RlcicgfSxcbiAgICB7IGtleXM6ICd6eicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdzY3JvbGxUb0N1cnNvcicsIGFjdGlvbkFyZ3M6IHsgcG9zaXRpb246ICdjZW50ZXInIH19LFxuICAgIHsga2V5czogJ3ouJywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ3Njcm9sbFRvQ3Vyc29yJywgYWN0aW9uQXJnczogeyBwb3NpdGlvbjogJ2NlbnRlcicgfSwgbW90aW9uOiAnbW92ZVRvRmlyc3ROb25XaGl0ZVNwYWNlQ2hhcmFjdGVyJyB9LFxuICAgIHsga2V5czogJ3p0JywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ3Njcm9sbFRvQ3Vyc29yJywgYWN0aW9uQXJnczogeyBwb3NpdGlvbjogJ3RvcCcgfX0sXG4gICAgeyBrZXlzOiAnejxDUj4nLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAnc2Nyb2xsVG9DdXJzb3InLCBhY3Rpb25BcmdzOiB7IHBvc2l0aW9uOiAndG9wJyB9LCBtb3Rpb246ICdtb3ZlVG9GaXJzdE5vbldoaXRlU3BhY2VDaGFyYWN0ZXInIH0sXG4gICAgeyBrZXlzOiAnei0nLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAnc2Nyb2xsVG9DdXJzb3InLCBhY3Rpb25BcmdzOiB7IHBvc2l0aW9uOiAnYm90dG9tJyB9fSxcbiAgICB7IGtleXM6ICd6YicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdzY3JvbGxUb0N1cnNvcicsIGFjdGlvbkFyZ3M6IHsgcG9zaXRpb246ICdib3R0b20nIH0sIG1vdGlvbjogJ21vdmVUb0ZpcnN0Tm9uV2hpdGVTcGFjZUNoYXJhY3RlcicgfSxcbiAgICB7IGtleXM6ICcuJywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ3JlcGVhdExhc3RFZGl0JyB9LFxuICAgIHsga2V5czogJzxDLWE+JywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ2luY3JlbWVudE51bWJlclRva2VuJywgaXNFZGl0OiB0cnVlLCBhY3Rpb25BcmdzOiB7aW5jcmVhc2U6IHRydWUsIGJhY2t0cmFjazogZmFsc2V9fSxcbiAgICB7IGtleXM6ICc8Qy14PicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdpbmNyZW1lbnROdW1iZXJUb2tlbicsIGlzRWRpdDogdHJ1ZSwgYWN0aW9uQXJnczoge2luY3JlYXNlOiBmYWxzZSwgYmFja3RyYWNrOiBmYWxzZX19LFxuICAgIHsga2V5czogJzxDLXQ+JywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ2luZGVudCcsIGFjdGlvbkFyZ3M6IHsgaW5kZW50UmlnaHQ6IHRydWUgfSwgY29udGV4dDogJ2luc2VydCcgfSxcbiAgICB7IGtleXM6ICc8Qy1kPicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdpbmRlbnQnLCBhY3Rpb25BcmdzOiB7IGluZGVudFJpZ2h0OiBmYWxzZSB9LCBjb250ZXh0OiAnaW5zZXJ0JyB9LFxuICAgIC8vIFRleHQgb2JqZWN0IG1vdGlvbnNcbiAgICB7IGtleXM6ICdhPGNoYXJhY3Rlcj4nLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAndGV4dE9iamVjdE1hbmlwdWxhdGlvbicgfSxcbiAgICB7IGtleXM6ICdpPGNoYXJhY3Rlcj4nLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAndGV4dE9iamVjdE1hbmlwdWxhdGlvbicsIG1vdGlvbkFyZ3M6IHsgdGV4dE9iamVjdElubmVyOiB0cnVlIH19LFxuICAgIC8vIFNlYXJjaFxuICAgIHsga2V5czogJy8nLCB0eXBlOiAnc2VhcmNoJywgc2VhcmNoQXJnczogeyBmb3J3YXJkOiB0cnVlLCBxdWVyeVNyYzogJ3Byb21wdCcsIHRvSnVtcGxpc3Q6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnPycsIHR5cGU6ICdzZWFyY2gnLCBzZWFyY2hBcmdzOiB7IGZvcndhcmQ6IGZhbHNlLCBxdWVyeVNyYzogJ3Byb21wdCcsIHRvSnVtcGxpc3Q6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnKicsIHR5cGU6ICdzZWFyY2gnLCBzZWFyY2hBcmdzOiB7IGZvcndhcmQ6IHRydWUsIHF1ZXJ5U3JjOiAnd29yZFVuZGVyQ3Vyc29yJywgd2hvbGVXb3JkT25seTogdHJ1ZSwgdG9KdW1wbGlzdDogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICcjJywgdHlwZTogJ3NlYXJjaCcsIHNlYXJjaEFyZ3M6IHsgZm9yd2FyZDogZmFsc2UsIHF1ZXJ5U3JjOiAnd29yZFVuZGVyQ3Vyc29yJywgd2hvbGVXb3JkT25seTogdHJ1ZSwgdG9KdW1wbGlzdDogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICdnKicsIHR5cGU6ICdzZWFyY2gnLCBzZWFyY2hBcmdzOiB7IGZvcndhcmQ6IHRydWUsIHF1ZXJ5U3JjOiAnd29yZFVuZGVyQ3Vyc29yJywgdG9KdW1wbGlzdDogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICdnIycsIHR5cGU6ICdzZWFyY2gnLCBzZWFyY2hBcmdzOiB7IGZvcndhcmQ6IGZhbHNlLCBxdWVyeVNyYzogJ3dvcmRVbmRlckN1cnNvcicsIHRvSnVtcGxpc3Q6IHRydWUgfX0sXG4gICAgLy8gRXggY29tbWFuZFxuICAgIHsga2V5czogJzonLCB0eXBlOiAnZXgnIH1cbiAgXTtcbiAgdmFyIGRlZmF1bHRLZXltYXBMZW5ndGggPSBkZWZhdWx0S2V5bWFwLmxlbmd0aDtcblxuICAvKipcbiAgICogRXggY29tbWFuZHNcbiAgICogQ2FyZSBtdXN0IGJlIHRha2VuIHdoZW4gYWRkaW5nIHRvIHRoZSBkZWZhdWx0IEV4IGNvbW1hbmQgbWFwLiBGb3IgYW55XG4gICAqIHBhaXIgb2YgY29tbWFuZHMgdGhhdCBoYXZlIGEgc2hhcmVkIHByZWZpeCwgYXQgbGVhc3Qgb25lIG9mIHRoZWlyXG4gICAqIHNob3J0TmFtZXMgbXVzdCBub3QgbWF0Y2ggdGhlIHByZWZpeCBvZiB0aGUgb3RoZXIgY29tbWFuZC5cbiAgICovXG4gIHZhciBkZWZhdWx0RXhDb21tYW5kTWFwID0gW1xuICAgIHsgbmFtZTogJ2NvbG9yc2NoZW1lJywgc2hvcnROYW1lOiAnY29sbycgfSxcbiAgICB7IG5hbWU6ICdtYXAnIH0sXG4gICAgeyBuYW1lOiAnaW1hcCcsIHNob3J0TmFtZTogJ2ltJyB9LFxuICAgIHsgbmFtZTogJ25tYXAnLCBzaG9ydE5hbWU6ICdubScgfSxcbiAgICB7IG5hbWU6ICd2bWFwJywgc2hvcnROYW1lOiAndm0nIH0sXG4gICAgeyBuYW1lOiAndW5tYXAnIH0sXG4gICAgeyBuYW1lOiAnd3JpdGUnLCBzaG9ydE5hbWU6ICd3JyB9LFxuICAgIHsgbmFtZTogJ3VuZG8nLCBzaG9ydE5hbWU6ICd1JyB9LFxuICAgIHsgbmFtZTogJ3JlZG8nLCBzaG9ydE5hbWU6ICdyZWQnIH0sXG4gICAgeyBuYW1lOiAnc2V0Jywgc2hvcnROYW1lOiAnc2UnIH0sXG4gICAgeyBuYW1lOiAnc2V0Jywgc2hvcnROYW1lOiAnc2UnIH0sXG4gICAgeyBuYW1lOiAnc2V0bG9jYWwnLCBzaG9ydE5hbWU6ICdzZXRsJyB9LFxuICAgIHsgbmFtZTogJ3NldGdsb2JhbCcsIHNob3J0TmFtZTogJ3NldGcnIH0sXG4gICAgeyBuYW1lOiAnc29ydCcsIHNob3J0TmFtZTogJ3NvcicgfSxcbiAgICB7IG5hbWU6ICdzdWJzdGl0dXRlJywgc2hvcnROYW1lOiAncycsIHBvc3NpYmx5QXN5bmM6IHRydWUgfSxcbiAgICB7IG5hbWU6ICdub2hsc2VhcmNoJywgc2hvcnROYW1lOiAnbm9oJyB9LFxuICAgIHsgbmFtZTogJ3lhbmsnLCBzaG9ydE5hbWU6ICd5JyB9LFxuICAgIHsgbmFtZTogJ2RlbG1hcmtzJywgc2hvcnROYW1lOiAnZGVsbScgfSxcbiAgICB7IG5hbWU6ICdyZWdpc3RlcnMnLCBzaG9ydE5hbWU6ICdyZWcnLCBleGNsdWRlRnJvbUNvbW1hbmRIaXN0b3J5OiB0cnVlIH0sXG4gICAgeyBuYW1lOiAnZ2xvYmFsJywgc2hvcnROYW1lOiAnZycgfVxuICBdO1xuXG4gIHZhciBQb3MgPSBDb2RlTWlycm9yLlBvcztcblxuICB2YXIgVmltID0gZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gZW50ZXJWaW1Nb2RlKGNtKSB7XG4gICAgICBjbS5zZXRPcHRpb24oJ2Rpc2FibGVJbnB1dCcsIHRydWUpO1xuICAgICAgY20uc2V0T3B0aW9uKCdzaG93Q3Vyc29yV2hlblNlbGVjdGluZycsIGZhbHNlKTtcbiAgICAgIENvZGVNaXJyb3Iuc2lnbmFsKGNtLCBcInZpbS1tb2RlLWNoYW5nZVwiLCB7bW9kZTogXCJub3JtYWxcIn0pO1xuICAgICAgY20ub24oJ2N1cnNvckFjdGl2aXR5Jywgb25DdXJzb3JBY3Rpdml0eSk7XG4gICAgICBtYXliZUluaXRWaW1TdGF0ZShjbSk7XG4gICAgICBDb2RlTWlycm9yLm9uKGNtLmdldElucHV0RmllbGQoKSwgJ3Bhc3RlJywgZ2V0T25QYXN0ZUZuKGNtKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGVhdmVWaW1Nb2RlKGNtKSB7XG4gICAgICBjbS5zZXRPcHRpb24oJ2Rpc2FibGVJbnB1dCcsIGZhbHNlKTtcbiAgICAgIGNtLm9mZignY3Vyc29yQWN0aXZpdHknLCBvbkN1cnNvckFjdGl2aXR5KTtcbiAgICAgIENvZGVNaXJyb3Iub2ZmKGNtLmdldElucHV0RmllbGQoKSwgJ3Bhc3RlJywgZ2V0T25QYXN0ZUZuKGNtKSk7XG4gICAgICBjbS5zdGF0ZS52aW0gPSBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRldGFjaFZpbU1hcChjbSwgbmV4dCkge1xuICAgICAgaWYgKHRoaXMgPT0gQ29kZU1pcnJvci5rZXlNYXAudmltKSB7XG4gICAgICAgIENvZGVNaXJyb3Iucm1DbGFzcyhjbS5nZXRXcmFwcGVyRWxlbWVudCgpLCBcImNtLWZhdC1jdXJzb3JcIik7XG4gICAgICAgIGlmIChjbS5nZXRPcHRpb24oXCJpbnB1dFN0eWxlXCIpID09IFwiY29udGVudGVkaXRhYmxlXCIgJiYgZG9jdW1lbnQuYm9keS5zdHlsZS5jYXJldENvbG9yICE9IG51bGwpIHtcbiAgICAgICAgICBkaXNhYmxlRmF0Q3Vyc29yTWFyayhjbSk7XG4gICAgICAgICAgY20uZ2V0SW5wdXRGaWVsZCgpLnN0eWxlLmNhcmV0Q29sb3IgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghbmV4dCB8fCBuZXh0LmF0dGFjaCAhPSBhdHRhY2hWaW1NYXApXG4gICAgICAgIGxlYXZlVmltTW9kZShjbSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGF0dGFjaFZpbU1hcChjbSwgcHJldikge1xuICAgICAgaWYgKHRoaXMgPT0gQ29kZU1pcnJvci5rZXlNYXAudmltKSB7XG4gICAgICAgIENvZGVNaXJyb3IuYWRkQ2xhc3MoY20uZ2V0V3JhcHBlckVsZW1lbnQoKSwgXCJjbS1mYXQtY3Vyc29yXCIpO1xuICAgICAgICBpZiAoY20uZ2V0T3B0aW9uKFwiaW5wdXRTdHlsZVwiKSA9PSBcImNvbnRlbnRlZGl0YWJsZVwiICYmIGRvY3VtZW50LmJvZHkuc3R5bGUuY2FyZXRDb2xvciAhPSBudWxsKSB7XG4gICAgICAgICAgZW5hYmxlRmF0Q3Vyc29yTWFyayhjbSk7XG4gICAgICAgICAgY20uZ2V0SW5wdXRGaWVsZCgpLnN0eWxlLmNhcmV0Q29sb3IgPSBcInRyYW5zcGFyZW50XCI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFwcmV2IHx8IHByZXYuYXR0YWNoICE9IGF0dGFjaFZpbU1hcClcbiAgICAgICAgZW50ZXJWaW1Nb2RlKGNtKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVGYXRDdXJzb3JNYXJrKGNtKSB7XG4gICAgICBpZiAoIWNtLnN0YXRlLmZhdEN1cnNvck1hcmtzKSByZXR1cm47XG4gICAgICBjbGVhckZhdEN1cnNvck1hcmsoY20pO1xuICAgICAgdmFyIHJhbmdlcyA9IGNtLmxpc3RTZWxlY3Rpb25zKCksIHJlc3VsdCA9IFtdXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJhbmdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcmFuZ2UgPSByYW5nZXNbaV07XG4gICAgICAgIGlmIChyYW5nZS5lbXB0eSgpKSB7XG4gICAgICAgICAgdmFyIGxpbmVMZW5ndGggPSBjbS5nZXRMaW5lKHJhbmdlLmFuY2hvci5saW5lKS5sZW5ndGg7XG4gICAgICAgICAgaWYgKHJhbmdlLmFuY2hvci5jaCA8IGxpbmVMZW5ndGgpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGNtLm1hcmtUZXh0KHJhbmdlLmFuY2hvciwgUG9zKHJhbmdlLmFuY2hvci5saW5lLCByYW5nZS5hbmNob3IuY2ggKyAxKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtjbGFzc05hbWU6IFwiY20tZmF0LWN1cnNvci1tYXJrXCJ9KSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGNtLm1hcmtUZXh0KFBvcyhyYW5nZS5hbmNob3IubGluZSwgbGluZUxlbmd0aCAtIDEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUG9zKHJhbmdlLmFuY2hvci5saW5lLCBsaW5lTGVuZ3RoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtjbGFzc05hbWU6IFwiY20tZmF0LWN1cnNvci1tYXJrXCJ9KSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjbS5zdGF0ZS5mYXRDdXJzb3JNYXJrcyA9IHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckZhdEN1cnNvck1hcmsoY20pIHtcbiAgICAgIHZhciBtYXJrcyA9IGNtLnN0YXRlLmZhdEN1cnNvck1hcmtzO1xuICAgICAgaWYgKG1hcmtzKSBmb3IgKHZhciBpID0gMDsgaSA8IG1hcmtzLmxlbmd0aDsgaSsrKSBtYXJrc1tpXS5jbGVhcigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVuYWJsZUZhdEN1cnNvck1hcmsoY20pIHtcbiAgICAgIGNtLnN0YXRlLmZhdEN1cnNvck1hcmtzID0gW107XG4gICAgICB1cGRhdGVGYXRDdXJzb3JNYXJrKGNtKVxuICAgICAgY20ub24oXCJjdXJzb3JBY3Rpdml0eVwiLCB1cGRhdGVGYXRDdXJzb3JNYXJrKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRpc2FibGVGYXRDdXJzb3JNYXJrKGNtKSB7XG4gICAgICBjbGVhckZhdEN1cnNvck1hcmsoY20pO1xuICAgICAgY20ub2ZmKFwiY3Vyc29yQWN0aXZpdHlcIiwgdXBkYXRlRmF0Q3Vyc29yTWFyayk7XG4gICAgICAvLyBleHBsaWNpdGx5IHNldCBmYXRDdXJzb3JNYXJrcyB0byBudWxsIGJlY2F1c2UgZXZlbnQgbGlzdGVuZXIgYWJvdmVcbiAgICAgIC8vIGNhbiBiZSBpbnZva2UgYWZ0ZXIgcmVtb3ZpbmcgaXQsIGlmIG9mZiBpcyBjYWxsZWQgZnJvbSBvcGVyYXRpb25cbiAgICAgIGNtLnN0YXRlLmZhdEN1cnNvck1hcmtzID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBEZXByZWNhdGVkLCBzaW1wbHkgc2V0dGluZyB0aGUga2V5bWFwIHdvcmtzIGFnYWluLlxuICAgIENvZGVNaXJyb3IuZGVmaW5lT3B0aW9uKCd2aW1Nb2RlJywgZmFsc2UsIGZ1bmN0aW9uKGNtLCB2YWwsIHByZXYpIHtcbiAgICAgIGlmICh2YWwgJiYgY20uZ2V0T3B0aW9uKFwia2V5TWFwXCIpICE9IFwidmltXCIpXG4gICAgICAgIGNtLnNldE9wdGlvbihcImtleU1hcFwiLCBcInZpbVwiKTtcbiAgICAgIGVsc2UgaWYgKCF2YWwgJiYgcHJldiAhPSBDb2RlTWlycm9yLkluaXQgJiYgL152aW0vLnRlc3QoY20uZ2V0T3B0aW9uKFwia2V5TWFwXCIpKSlcbiAgICAgICAgY20uc2V0T3B0aW9uKFwia2V5TWFwXCIsIFwiZGVmYXVsdFwiKTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGNtS2V5KGtleSwgY20pIHtcbiAgICAgIGlmICghY20pIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuICAgICAgaWYgKHRoaXNba2V5XSkgeyByZXR1cm4gdGhpc1trZXldOyB9XG4gICAgICB2YXIgdmltS2V5ID0gY21LZXlUb1ZpbUtleShrZXkpO1xuICAgICAgaWYgKCF2aW1LZXkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgdmFyIGNtZCA9IENvZGVNaXJyb3IuVmltLmZpbmRLZXkoY20sIHZpbUtleSk7XG4gICAgICBpZiAodHlwZW9mIGNtZCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIENvZGVNaXJyb3Iuc2lnbmFsKGNtLCAndmltLWtleXByZXNzJywgdmltS2V5KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjbWQ7XG4gICAgfVxuXG4gICAgdmFyIG1vZGlmaWVycyA9IHsnU2hpZnQnOiAnUycsICdDdHJsJzogJ0MnLCAnQWx0JzogJ0EnLCAnQ21kJzogJ0QnLCAnTW9kJzogJ0EnfTtcbiAgICB2YXIgc3BlY2lhbEtleXMgPSB7RW50ZXI6J0NSJyxCYWNrc3BhY2U6J0JTJyxEZWxldGU6J0RlbCcsSW5zZXJ0OidJbnMnfTtcbiAgICBmdW5jdGlvbiBjbUtleVRvVmltS2V5KGtleSkge1xuICAgICAgaWYgKGtleS5jaGFyQXQoMCkgPT0gJ1xcJycpIHtcbiAgICAgICAgLy8gS2V5cHJlc3MgY2hhcmFjdGVyIGJpbmRpbmcgb2YgZm9ybWF0IFwiJ2EnXCJcbiAgICAgICAgcmV0dXJuIGtleS5jaGFyQXQoMSk7XG4gICAgICB9XG4gICAgICB2YXIgcGllY2VzID0ga2V5LnNwbGl0KC8tKD8hJCkvKTtcbiAgICAgIHZhciBsYXN0UGllY2UgPSBwaWVjZXNbcGllY2VzLmxlbmd0aCAtIDFdO1xuICAgICAgaWYgKHBpZWNlcy5sZW5ndGggPT0gMSAmJiBwaWVjZXNbMF0ubGVuZ3RoID09IDEpIHtcbiAgICAgICAgLy8gTm8tbW9kaWZpZXIgYmluZGluZ3MgdXNlIGxpdGVyYWwgY2hhcmFjdGVyIGJpbmRpbmdzIGFib3ZlLiBTa2lwLlxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYgKHBpZWNlcy5sZW5ndGggPT0gMiAmJiBwaWVjZXNbMF0gPT0gJ1NoaWZ0JyAmJiBsYXN0UGllY2UubGVuZ3RoID09IDEpIHtcbiAgICAgICAgLy8gSWdub3JlIFNoaWZ0K2NoYXIgYmluZGluZ3MgYXMgdGhleSBzaG91bGQgYmUgaGFuZGxlZCBieSBsaXRlcmFsIGNoYXJhY3Rlci5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgdmFyIGhhc0NoYXJhY3RlciA9IGZhbHNlO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwaWVjZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBpZWNlID0gcGllY2VzW2ldO1xuICAgICAgICBpZiAocGllY2UgaW4gbW9kaWZpZXJzKSB7IHBpZWNlc1tpXSA9IG1vZGlmaWVyc1twaWVjZV07IH1cbiAgICAgICAgZWxzZSB7IGhhc0NoYXJhY3RlciA9IHRydWU7IH1cbiAgICAgICAgaWYgKHBpZWNlIGluIHNwZWNpYWxLZXlzKSB7IHBpZWNlc1tpXSA9IHNwZWNpYWxLZXlzW3BpZWNlXTsgfVxuICAgICAgfVxuICAgICAgaWYgKCFoYXNDaGFyYWN0ZXIpIHtcbiAgICAgICAgLy8gVmltIGRvZXMgbm90IHN1cHBvcnQgbW9kaWZpZXIgb25seSBrZXlzLlxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyBUT0RPOiBDdXJyZW50IGJpbmRpbmdzIGV4cGVjdCB0aGUgY2hhcmFjdGVyIHRvIGJlIGxvd2VyIGNhc2UsIGJ1dFxuICAgICAgLy8gaXQgbG9va3MgbGlrZSB2aW0ga2V5IG5vdGF0aW9uIHVzZXMgdXBwZXIgY2FzZS5cbiAgICAgIGlmIChpc1VwcGVyQ2FzZShsYXN0UGllY2UpKSB7XG4gICAgICAgIHBpZWNlc1twaWVjZXMubGVuZ3RoIC0gMV0gPSBsYXN0UGllY2UudG9Mb3dlckNhc2UoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAnPCcgKyBwaWVjZXMuam9pbignLScpICsgJz4nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE9uUGFzdGVGbihjbSkge1xuICAgICAgdmFyIHZpbSA9IGNtLnN0YXRlLnZpbTtcbiAgICAgIGlmICghdmltLm9uUGFzdGVGbikge1xuICAgICAgICB2aW0ub25QYXN0ZUZuID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKCF2aW0uaW5zZXJ0TW9kZSkge1xuICAgICAgICAgICAgY20uc2V0Q3Vyc29yKG9mZnNldEN1cnNvcihjbS5nZXRDdXJzb3IoKSwgMCwgMSkpO1xuICAgICAgICAgICAgYWN0aW9ucy5lbnRlckluc2VydE1vZGUoY20sIHt9LCB2aW0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2aW0ub25QYXN0ZUZuO1xuICAgIH1cblxuICAgIHZhciBudW1iZXJSZWdleCA9IC9bXFxkXS87XG4gICAgdmFyIHdvcmRDaGFyVGVzdCA9IFtDb2RlTWlycm9yLmlzV29yZENoYXIsIGZ1bmN0aW9uKGNoKSB7XG4gICAgICByZXR1cm4gY2ggJiYgIUNvZGVNaXJyb3IuaXNXb3JkQ2hhcihjaCkgJiYgIS9cXHMvLnRlc3QoY2gpO1xuICAgIH1dLCBiaWdXb3JkQ2hhclRlc3QgPSBbZnVuY3Rpb24oY2gpIHtcbiAgICAgIHJldHVybiAvXFxTLy50ZXN0KGNoKTtcbiAgICB9XTtcbiAgICBmdW5jdGlvbiBtYWtlS2V5UmFuZ2Uoc3RhcnQsIHNpemUpIHtcbiAgICAgIHZhciBrZXlzID0gW107XG4gICAgICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBzdGFydCArIHNpemU7IGkrKykge1xuICAgICAgICBrZXlzLnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZShpKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4ga2V5cztcbiAgICB9XG4gICAgdmFyIHVwcGVyQ2FzZUFscGhhYmV0ID0gbWFrZUtleVJhbmdlKDY1LCAyNik7XG4gICAgdmFyIGxvd2VyQ2FzZUFscGhhYmV0ID0gbWFrZUtleVJhbmdlKDk3LCAyNik7XG4gICAgdmFyIG51bWJlcnMgPSBtYWtlS2V5UmFuZ2UoNDgsIDEwKTtcbiAgICB2YXIgdmFsaWRNYXJrcyA9IFtdLmNvbmNhdCh1cHBlckNhc2VBbHBoYWJldCwgbG93ZXJDYXNlQWxwaGFiZXQsIG51bWJlcnMsIFsnPCcsICc+J10pO1xuICAgIHZhciB2YWxpZFJlZ2lzdGVycyA9IFtdLmNvbmNhdCh1cHBlckNhc2VBbHBoYWJldCwgbG93ZXJDYXNlQWxwaGFiZXQsIG51bWJlcnMsIFsnLScsICdcIicsICcuJywgJzonLCAnLyddKTtcblxuICAgIGZ1bmN0aW9uIGlzTGluZShjbSwgbGluZSkge1xuICAgICAgcmV0dXJuIGxpbmUgPj0gY20uZmlyc3RMaW5lKCkgJiYgbGluZSA8PSBjbS5sYXN0TGluZSgpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc0xvd2VyQ2FzZShrKSB7XG4gICAgICByZXR1cm4gKC9eW2Etel0kLykudGVzdChrKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNNYXRjaGFibGVTeW1ib2woaykge1xuICAgICAgcmV0dXJuICcoKVtde30nLmluZGV4T2YoaykgIT0gLTE7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzTnVtYmVyKGspIHtcbiAgICAgIHJldHVybiBudW1iZXJSZWdleC50ZXN0KGspO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc1VwcGVyQ2FzZShrKSB7XG4gICAgICByZXR1cm4gKC9eW0EtWl0kLykudGVzdChrKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNXaGl0ZVNwYWNlU3RyaW5nKGspIHtcbiAgICAgIHJldHVybiAoL15cXHMqJC8pLnRlc3Qoayk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzRW5kT2ZTZW50ZW5jZVN5bWJvbChrKSB7XG4gICAgICByZXR1cm4gJy4/IScuaW5kZXhPZihrKSAhPSAtMTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaW5BcnJheSh2YWwsIGFycikge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGFycltpXSA9PSB2YWwpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBvcHRpb25zID0ge307XG4gICAgZnVuY3Rpb24gZGVmaW5lT3B0aW9uKG5hbWUsIGRlZmF1bHRWYWx1ZSwgdHlwZSwgYWxpYXNlcywgY2FsbGJhY2spIHtcbiAgICAgIGlmIChkZWZhdWx0VmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhY2FsbGJhY2spIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ2RlZmF1bHRWYWx1ZSBpcyByZXF1aXJlZCB1bmxlc3MgY2FsbGJhY2sgaXMgcHJvdmlkZWQnKTtcbiAgICAgIH1cbiAgICAgIGlmICghdHlwZSkgeyB0eXBlID0gJ3N0cmluZyc7IH1cbiAgICAgIG9wdGlvbnNbbmFtZV0gPSB7XG4gICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogZGVmYXVsdFZhbHVlLFxuICAgICAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgICAgIH07XG4gICAgICBpZiAoYWxpYXNlcykge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsaWFzZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBvcHRpb25zW2FsaWFzZXNbaV1dID0gb3B0aW9uc1tuYW1lXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGRlZmF1bHRWYWx1ZSkge1xuICAgICAgICBzZXRPcHRpb24obmFtZSwgZGVmYXVsdFZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRPcHRpb24obmFtZSwgdmFsdWUsIGNtLCBjZmcpIHtcbiAgICAgIHZhciBvcHRpb24gPSBvcHRpb25zW25hbWVdO1xuICAgICAgY2ZnID0gY2ZnIHx8IHt9O1xuICAgICAgdmFyIHNjb3BlID0gY2ZnLnNjb3BlO1xuICAgICAgaWYgKCFvcHRpb24pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignVW5rbm93biBvcHRpb246ICcgKyBuYW1lKTtcbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb24udHlwZSA9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlICE9PSB0cnVlKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignSW52YWxpZCBhcmd1bWVudDogJyArIG5hbWUgKyAnPScgKyB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgLy8gQm9vbGVhbiBvcHRpb25zIGFyZSBzZXQgdG8gdHJ1ZSBpZiB2YWx1ZSBpcyBub3QgZGVmaW5lZC5cbiAgICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb24uY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKHNjb3BlICE9PSAnbG9jYWwnKSB7XG4gICAgICAgICAgb3B0aW9uLmNhbGxiYWNrKHZhbHVlLCB1bmRlZmluZWQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzY29wZSAhPT0gJ2dsb2JhbCcgJiYgY20pIHtcbiAgICAgICAgICBvcHRpb24uY2FsbGJhY2sodmFsdWUsIGNtKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHNjb3BlICE9PSAnbG9jYWwnKSB7XG4gICAgICAgICAgb3B0aW9uLnZhbHVlID0gb3B0aW9uLnR5cGUgPT0gJ2Jvb2xlYW4nID8gISF2YWx1ZSA6IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzY29wZSAhPT0gJ2dsb2JhbCcgJiYgY20pIHtcbiAgICAgICAgICBjbS5zdGF0ZS52aW0ub3B0aW9uc1tuYW1lXSA9IHt2YWx1ZTogdmFsdWV9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0T3B0aW9uKG5hbWUsIGNtLCBjZmcpIHtcbiAgICAgIHZhciBvcHRpb24gPSBvcHRpb25zW25hbWVdO1xuICAgICAgY2ZnID0gY2ZnIHx8IHt9O1xuICAgICAgdmFyIHNjb3BlID0gY2ZnLnNjb3BlO1xuICAgICAgaWYgKCFvcHRpb24pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignVW5rbm93biBvcHRpb246ICcgKyBuYW1lKTtcbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb24uY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGxvY2FsID0gY20gJiYgb3B0aW9uLmNhbGxiYWNrKHVuZGVmaW5lZCwgY20pO1xuICAgICAgICBpZiAoc2NvcGUgIT09ICdnbG9iYWwnICYmIGxvY2FsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZXR1cm4gbG9jYWw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNjb3BlICE9PSAnbG9jYWwnKSB7XG4gICAgICAgICAgcmV0dXJuIG9wdGlvbi5jYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBsb2NhbCA9IChzY29wZSAhPT0gJ2dsb2JhbCcpICYmIChjbSAmJiBjbS5zdGF0ZS52aW0ub3B0aW9uc1tuYW1lXSk7XG4gICAgICAgIHJldHVybiAobG9jYWwgfHwgKHNjb3BlICE9PSAnbG9jYWwnKSAmJiBvcHRpb24gfHwge30pLnZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGRlZmluZU9wdGlvbignZmlsZXR5cGUnLCB1bmRlZmluZWQsICdzdHJpbmcnLCBbJ2Z0J10sIGZ1bmN0aW9uKG5hbWUsIGNtKSB7XG4gICAgICAvLyBPcHRpb24gaXMgbG9jYWwuIERvIG5vdGhpbmcgZm9yIGdsb2JhbC5cbiAgICAgIGlmIChjbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIFRoZSAnZmlsZXR5cGUnIG9wdGlvbiBwcm94aWVzIHRvIHRoZSBDb2RlTWlycm9yICdtb2RlJyBvcHRpb24uXG4gICAgICBpZiAobmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHZhciBtb2RlID0gY20uZ2V0T3B0aW9uKCdtb2RlJyk7XG4gICAgICAgIHJldHVybiBtb2RlID09ICdudWxsJyA/ICcnIDogbW9kZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBtb2RlID0gbmFtZSA9PSAnJyA/ICdudWxsJyA6IG5hbWU7XG4gICAgICAgIGNtLnNldE9wdGlvbignbW9kZScsIG1vZGUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGNyZWF0ZUNpcmN1bGFySnVtcExpc3QgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzaXplID0gMTAwO1xuICAgICAgdmFyIHBvaW50ZXIgPSAtMTtcbiAgICAgIHZhciBoZWFkID0gMDtcbiAgICAgIHZhciB0YWlsID0gMDtcbiAgICAgIHZhciBidWZmZXIgPSBuZXcgQXJyYXkoc2l6ZSk7XG4gICAgICBmdW5jdGlvbiBhZGQoY20sIG9sZEN1ciwgbmV3Q3VyKSB7XG4gICAgICAgIHZhciBjdXJyZW50ID0gcG9pbnRlciAlIHNpemU7XG4gICAgICAgIHZhciBjdXJNYXJrID0gYnVmZmVyW2N1cnJlbnRdO1xuICAgICAgICBmdW5jdGlvbiB1c2VOZXh0U2xvdChjdXJzb3IpIHtcbiAgICAgICAgICB2YXIgbmV4dCA9ICsrcG9pbnRlciAlIHNpemU7XG4gICAgICAgICAgdmFyIHRyYXNoTWFyayA9IGJ1ZmZlcltuZXh0XTtcbiAgICAgICAgICBpZiAodHJhc2hNYXJrKSB7XG4gICAgICAgICAgICB0cmFzaE1hcmsuY2xlYXIoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnVmZmVyW25leHRdID0gY20uc2V0Qm9va21hcmsoY3Vyc29yKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY3VyTWFyaykge1xuICAgICAgICAgIHZhciBtYXJrUG9zID0gY3VyTWFyay5maW5kKCk7XG4gICAgICAgICAgLy8gYXZvaWQgcmVjb3JkaW5nIHJlZHVuZGFudCBjdXJzb3IgcG9zaXRpb25cbiAgICAgICAgICBpZiAobWFya1BvcyAmJiAhY3Vyc29yRXF1YWwobWFya1Bvcywgb2xkQ3VyKSkge1xuICAgICAgICAgICAgdXNlTmV4dFNsb3Qob2xkQ3VyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdXNlTmV4dFNsb3Qob2xkQ3VyKTtcbiAgICAgICAgfVxuICAgICAgICB1c2VOZXh0U2xvdChuZXdDdXIpO1xuICAgICAgICBoZWFkID0gcG9pbnRlcjtcbiAgICAgICAgdGFpbCA9IHBvaW50ZXIgLSBzaXplICsgMTtcbiAgICAgICAgaWYgKHRhaWwgPCAwKSB7XG4gICAgICAgICAgdGFpbCA9IDA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIG1vdmUoY20sIG9mZnNldCkge1xuICAgICAgICBwb2ludGVyICs9IG9mZnNldDtcbiAgICAgICAgaWYgKHBvaW50ZXIgPiBoZWFkKSB7XG4gICAgICAgICAgcG9pbnRlciA9IGhlYWQ7XG4gICAgICAgIH0gZWxzZSBpZiAocG9pbnRlciA8IHRhaWwpIHtcbiAgICAgICAgICBwb2ludGVyID0gdGFpbDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbWFyayA9IGJ1ZmZlclsoc2l6ZSArIHBvaW50ZXIpICUgc2l6ZV07XG4gICAgICAgIC8vIHNraXAgbWFya3MgdGhhdCBhcmUgdGVtcG9yYXJpbHkgcmVtb3ZlZCBmcm9tIHRleHQgYnVmZmVyXG4gICAgICAgIGlmIChtYXJrICYmICFtYXJrLmZpbmQoKSkge1xuICAgICAgICAgIHZhciBpbmMgPSBvZmZzZXQgPiAwID8gMSA6IC0xO1xuICAgICAgICAgIHZhciBuZXdDdXI7XG4gICAgICAgICAgdmFyIG9sZEN1ciA9IGNtLmdldEN1cnNvcigpO1xuICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgIHBvaW50ZXIgKz0gaW5jO1xuICAgICAgICAgICAgbWFyayA9IGJ1ZmZlclsoc2l6ZSArIHBvaW50ZXIpICUgc2l6ZV07XG4gICAgICAgICAgICAvLyBza2lwIG1hcmtzIHRoYXQgYXJlIHRoZSBzYW1lIGFzIGN1cnJlbnQgcG9zaXRpb25cbiAgICAgICAgICAgIGlmIChtYXJrICYmXG4gICAgICAgICAgICAgICAgKG5ld0N1ciA9IG1hcmsuZmluZCgpKSAmJlxuICAgICAgICAgICAgICAgICFjdXJzb3JFcXVhbChvbGRDdXIsIG5ld0N1cikpIHtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSB3aGlsZSAocG9pbnRlciA8IGhlYWQgJiYgcG9pbnRlciA+IHRhaWwpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXJrO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gZmluZChjbSwgb2Zmc2V0KSB7XG4gICAgICAgIHZhciBvbGRQb2ludGVyID0gcG9pbnRlcjtcbiAgICAgICAgdmFyIG1hcmsgPSBtb3ZlKGNtLCBvZmZzZXQpO1xuICAgICAgICBwb2ludGVyID0gb2xkUG9pbnRlcjtcbiAgICAgICAgcmV0dXJuIG1hcmsgJiYgbWFyay5maW5kKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjYWNoZWRDdXJzb3I6IHVuZGVmaW5lZCwgLy91c2VkIGZvciAjIGFuZCAqIGp1bXBzXG4gICAgICAgIGFkZDogYWRkLFxuICAgICAgICBmaW5kOiBmaW5kLFxuICAgICAgICBtb3ZlOiBtb3ZlXG4gICAgICB9O1xuICAgIH07XG5cbiAgICAvLyBSZXR1cm5zIGFuIG9iamVjdCB0byB0cmFjayB0aGUgY2hhbmdlcyBhc3NvY2lhdGVkIGluc2VydCBtb2RlLiAgSXRcbiAgICAvLyBjbG9uZXMgdGhlIG9iamVjdCB0aGF0IGlzIHBhc3NlZCBpbiwgb3IgY3JlYXRlcyBhbiBlbXB0eSBvYmplY3Qgb25lIGlmXG4gICAgLy8gbm9uZSBpcyBwcm92aWRlZC5cbiAgICB2YXIgY3JlYXRlSW5zZXJ0TW9kZUNoYW5nZXMgPSBmdW5jdGlvbihjKSB7XG4gICAgICBpZiAoYykge1xuICAgICAgICAvLyBDb3B5IGNvbnN0cnVjdGlvblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNoYW5nZXM6IGMuY2hhbmdlcyxcbiAgICAgICAgICBleHBlY3RDdXJzb3JBY3Rpdml0eUZvckNoYW5nZTogYy5leHBlY3RDdXJzb3JBY3Rpdml0eUZvckNoYW5nZVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLy8gQ2hhbmdlIGxpc3RcbiAgICAgICAgY2hhbmdlczogW10sXG4gICAgICAgIC8vIFNldCB0byB0cnVlIG9uIGNoYW5nZSwgZmFsc2Ugb24gY3Vyc29yQWN0aXZpdHkuXG4gICAgICAgIGV4cGVjdEN1cnNvckFjdGl2aXR5Rm9yQ2hhbmdlOiBmYWxzZVxuICAgICAgfTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gTWFjcm9Nb2RlU3RhdGUoKSB7XG4gICAgICB0aGlzLmxhdGVzdFJlZ2lzdGVyID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5pc1BsYXlpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMuaXNSZWNvcmRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMucmVwbGF5U2VhcmNoUXVlcmllcyA9IFtdO1xuICAgICAgdGhpcy5vblJlY29yZGluZ0RvbmUgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmxhc3RJbnNlcnRNb2RlQ2hhbmdlcyA9IGNyZWF0ZUluc2VydE1vZGVDaGFuZ2VzKCk7XG4gICAgfVxuICAgIE1hY3JvTW9kZVN0YXRlLnByb3RvdHlwZSA9IHtcbiAgICAgIGV4aXRNYWNyb1JlY29yZE1vZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbWFjcm9Nb2RlU3RhdGUgPSB2aW1HbG9iYWxTdGF0ZS5tYWNyb01vZGVTdGF0ZTtcbiAgICAgICAgaWYgKG1hY3JvTW9kZVN0YXRlLm9uUmVjb3JkaW5nRG9uZSkge1xuICAgICAgICAgIG1hY3JvTW9kZVN0YXRlLm9uUmVjb3JkaW5nRG9uZSgpOyAvLyBjbG9zZSBkaWFsb2dcbiAgICAgICAgfVxuICAgICAgICBtYWNyb01vZGVTdGF0ZS5vblJlY29yZGluZ0RvbmUgPSB1bmRlZmluZWQ7XG4gICAgICAgIG1hY3JvTW9kZVN0YXRlLmlzUmVjb3JkaW5nID0gZmFsc2U7XG4gICAgICB9LFxuICAgICAgZW50ZXJNYWNyb1JlY29yZE1vZGU6IGZ1bmN0aW9uKGNtLCByZWdpc3Rlck5hbWUpIHtcbiAgICAgICAgdmFyIHJlZ2lzdGVyID1cbiAgICAgICAgICAgIHZpbUdsb2JhbFN0YXRlLnJlZ2lzdGVyQ29udHJvbGxlci5nZXRSZWdpc3RlcihyZWdpc3Rlck5hbWUpO1xuICAgICAgICBpZiAocmVnaXN0ZXIpIHtcbiAgICAgICAgICByZWdpc3Rlci5jbGVhcigpO1xuICAgICAgICAgIHRoaXMubGF0ZXN0UmVnaXN0ZXIgPSByZWdpc3Rlck5hbWU7XG4gICAgICAgICAgaWYgKGNtLm9wZW5EaWFsb2cpIHtcbiAgICAgICAgICAgIHRoaXMub25SZWNvcmRpbmdEb25lID0gY20ub3BlbkRpYWxvZyhcbiAgICAgICAgICAgICAgICAnKHJlY29yZGluZylbJytyZWdpc3Rlck5hbWUrJ10nLCBudWxsLCB7Ym90dG9tOnRydWV9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5pc1JlY29yZGluZyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gbWF5YmVJbml0VmltU3RhdGUoY20pIHtcbiAgICAgIGlmICghY20uc3RhdGUudmltKSB7XG4gICAgICAgIC8vIFN0b3JlIGluc3RhbmNlIHN0YXRlIGluIHRoZSBDb2RlTWlycm9yIG9iamVjdC5cbiAgICAgICAgY20uc3RhdGUudmltID0ge1xuICAgICAgICAgIGlucHV0U3RhdGU6IG5ldyBJbnB1dFN0YXRlKCksXG4gICAgICAgICAgLy8gVmltJ3MgaW5wdXQgc3RhdGUgdGhhdCB0cmlnZ2VyZWQgdGhlIGxhc3QgZWRpdCwgdXNlZCB0byByZXBlYXRcbiAgICAgICAgICAvLyBtb3Rpb25zIGFuZCBvcGVyYXRvcnMgd2l0aCAnLicuXG4gICAgICAgICAgbGFzdEVkaXRJbnB1dFN0YXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgLy8gVmltJ3MgYWN0aW9uIGNvbW1hbmQgYmVmb3JlIHRoZSBsYXN0IGVkaXQsIHVzZWQgdG8gcmVwZWF0IGFjdGlvbnNcbiAgICAgICAgICAvLyB3aXRoICcuJyBhbmQgaW5zZXJ0IG1vZGUgcmVwZWF0LlxuICAgICAgICAgIGxhc3RFZGl0QWN0aW9uQ29tbWFuZDogdW5kZWZpbmVkLFxuICAgICAgICAgIC8vIFdoZW4gdXNpbmcgamsgZm9yIG5hdmlnYXRpb24sIGlmIHlvdSBtb3ZlIGZyb20gYSBsb25nZXIgbGluZSB0byBhXG4gICAgICAgICAgLy8gc2hvcnRlciBsaW5lLCB0aGUgY3Vyc29yIG1heSBjbGlwIHRvIHRoZSBlbmQgb2YgdGhlIHNob3J0ZXIgbGluZS5cbiAgICAgICAgICAvLyBJZiBqIGlzIHByZXNzZWQgYWdhaW4gYW5kIGN1cnNvciBnb2VzIHRvIHRoZSBuZXh0IGxpbmUsIHRoZVxuICAgICAgICAgIC8vIGN1cnNvciBzaG91bGQgZ28gYmFjayB0byBpdHMgaG9yaXpvbnRhbCBwb3NpdGlvbiBvbiB0aGUgbG9uZ2VyXG4gICAgICAgICAgLy8gbGluZSBpZiBpdCBjYW4uIFRoaXMgaXMgdG8ga2VlcCB0cmFjayBvZiB0aGUgaG9yaXpvbnRhbCBwb3NpdGlvbi5cbiAgICAgICAgICBsYXN0SFBvczogLTEsXG4gICAgICAgICAgLy8gRG9pbmcgdGhlIHNhbWUgd2l0aCBzY3JlZW4tcG9zaXRpb24gZm9yIGdqL2drXG4gICAgICAgICAgbGFzdEhTUG9zOiAtMSxcbiAgICAgICAgICAvLyBUaGUgbGFzdCBtb3Rpb24gY29tbWFuZCBydW4uIENsZWFyZWQgaWYgYSBub24tbW90aW9uIGNvbW1hbmQgZ2V0c1xuICAgICAgICAgIC8vIGV4ZWN1dGVkIGluIGJldHdlZW4uXG4gICAgICAgICAgbGFzdE1vdGlvbjogbnVsbCxcbiAgICAgICAgICBtYXJrczoge30sXG4gICAgICAgICAgLy8gTWFyayBmb3IgcmVuZGVyaW5nIGZha2UgY3Vyc29yIGZvciB2aXN1YWwgbW9kZS5cbiAgICAgICAgICBmYWtlQ3Vyc29yOiBudWxsLFxuICAgICAgICAgIGluc2VydE1vZGU6IGZhbHNlLFxuICAgICAgICAgIC8vIFJlcGVhdCBjb3VudCBmb3IgY2hhbmdlcyBtYWRlIGluIGluc2VydCBtb2RlLCB0cmlnZ2VyZWQgYnkga2V5XG4gICAgICAgICAgLy8gc2VxdWVuY2VzIGxpa2UgMyxpLiBPbmx5IGV4aXN0cyB3aGVuIGluc2VydE1vZGUgaXMgdHJ1ZS5cbiAgICAgICAgICBpbnNlcnRNb2RlUmVwZWF0OiB1bmRlZmluZWQsXG4gICAgICAgICAgdmlzdWFsTW9kZTogZmFsc2UsXG4gICAgICAgICAgLy8gSWYgd2UgYXJlIGluIHZpc3VhbCBsaW5lIG1vZGUuIE5vIGVmZmVjdCBpZiB2aXN1YWxNb2RlIGlzIGZhbHNlLlxuICAgICAgICAgIHZpc3VhbExpbmU6IGZhbHNlLFxuICAgICAgICAgIHZpc3VhbEJsb2NrOiBmYWxzZSxcbiAgICAgICAgICBsYXN0U2VsZWN0aW9uOiBudWxsLFxuICAgICAgICAgIGxhc3RQYXN0ZWRUZXh0OiBudWxsLFxuICAgICAgICAgIHNlbDoge30sXG4gICAgICAgICAgLy8gQnVmZmVyLWxvY2FsL3dpbmRvdy1sb2NhbCB2YWx1ZXMgb2YgdmltIG9wdGlvbnMuXG4gICAgICAgICAgb3B0aW9uczoge31cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjbS5zdGF0ZS52aW07XG4gICAgfVxuICAgIHZhciB2aW1HbG9iYWxTdGF0ZTtcbiAgICBmdW5jdGlvbiByZXNldFZpbUdsb2JhbFN0YXRlKCkge1xuICAgICAgdmltR2xvYmFsU3RhdGUgPSB7XG4gICAgICAgIC8vIFRoZSBjdXJyZW50IHNlYXJjaCBxdWVyeS5cbiAgICAgICAgc2VhcmNoUXVlcnk6IG51bGwsXG4gICAgICAgIC8vIFdoZXRoZXIgd2UgYXJlIHNlYXJjaGluZyBiYWNrd2FyZHMuXG4gICAgICAgIHNlYXJjaElzUmV2ZXJzZWQ6IGZhbHNlLFxuICAgICAgICAvLyBSZXBsYWNlIHBhcnQgb2YgdGhlIGxhc3Qgc3Vic3RpdHV0ZWQgcGF0dGVyblxuICAgICAgICBsYXN0U3Vic3RpdHV0ZVJlcGxhY2VQYXJ0OiB1bmRlZmluZWQsXG4gICAgICAgIGp1bXBMaXN0OiBjcmVhdGVDaXJjdWxhckp1bXBMaXN0KCksXG4gICAgICAgIG1hY3JvTW9kZVN0YXRlOiBuZXcgTWFjcm9Nb2RlU3RhdGUsXG4gICAgICAgIC8vIFJlY29yZGluZyBsYXRlc3QgZiwgdCwgRiBvciBUIG1vdGlvbiBjb21tYW5kLlxuICAgICAgICBsYXN0Q2hhcmFjdGVyU2VhcmNoOiB7aW5jcmVtZW50OjAsIGZvcndhcmQ6dHJ1ZSwgc2VsZWN0ZWRDaGFyYWN0ZXI6Jyd9LFxuICAgICAgICByZWdpc3RlckNvbnRyb2xsZXI6IG5ldyBSZWdpc3RlckNvbnRyb2xsZXIoe30pLFxuICAgICAgICAvLyBzZWFyY2ggaGlzdG9yeSBidWZmZXJcbiAgICAgICAgc2VhcmNoSGlzdG9yeUNvbnRyb2xsZXI6IG5ldyBIaXN0b3J5Q29udHJvbGxlcigpLFxuICAgICAgICAvLyBleCBDb21tYW5kIGhpc3RvcnkgYnVmZmVyXG4gICAgICAgIGV4Q29tbWFuZEhpc3RvcnlDb250cm9sbGVyIDogbmV3IEhpc3RvcnlDb250cm9sbGVyKClcbiAgICAgIH07XG4gICAgICBmb3IgKHZhciBvcHRpb25OYW1lIGluIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIG9wdGlvbiA9IG9wdGlvbnNbb3B0aW9uTmFtZV07XG4gICAgICAgIG9wdGlvbi52YWx1ZSA9IG9wdGlvbi5kZWZhdWx0VmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGxhc3RJbnNlcnRNb2RlS2V5VGltZXI7XG4gICAgdmFyIHZpbUFwaT0ge1xuICAgICAgYnVpbGRLZXlNYXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBUT0RPOiBDb252ZXJ0IGtleW1hcCBpbnRvIGRpY3Rpb25hcnkgZm9ybWF0IGZvciBmYXN0IGxvb2t1cC5cbiAgICAgIH0sXG4gICAgICAvLyBUZXN0aW5nIGhvb2ssIHRob3VnaCBpdCBtaWdodCBiZSB1c2VmdWwgdG8gZXhwb3NlIHRoZSByZWdpc3RlclxuICAgICAgLy8gY29udHJvbGxlciBhbnl3YXlzLlxuICAgICAgZ2V0UmVnaXN0ZXJDb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHZpbUdsb2JhbFN0YXRlLnJlZ2lzdGVyQ29udHJvbGxlcjtcbiAgICAgIH0sXG4gICAgICAvLyBUZXN0aW5nIGhvb2suXG4gICAgICByZXNldFZpbUdsb2JhbFN0YXRlXzogcmVzZXRWaW1HbG9iYWxTdGF0ZSxcblxuICAgICAgLy8gVGVzdGluZyBob29rLlxuICAgICAgZ2V0VmltR2xvYmFsU3RhdGVfOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHZpbUdsb2JhbFN0YXRlO1xuICAgICAgfSxcblxuICAgICAgLy8gVGVzdGluZyBob29rLlxuICAgICAgbWF5YmVJbml0VmltU3RhdGVfOiBtYXliZUluaXRWaW1TdGF0ZSxcblxuICAgICAgc3VwcHJlc3NFcnJvckxvZ2dpbmc6IGZhbHNlLFxuXG4gICAgICBJbnNlcnRNb2RlS2V5OiBJbnNlcnRNb2RlS2V5LFxuICAgICAgbWFwOiBmdW5jdGlvbihsaHMsIHJocywgY3R4KSB7XG4gICAgICAgIC8vIEFkZCB1c2VyIGRlZmluZWQga2V5IGJpbmRpbmdzLlxuICAgICAgICBleENvbW1hbmREaXNwYXRjaGVyLm1hcChsaHMsIHJocywgY3R4KTtcbiAgICAgIH0sXG4gICAgICB1bm1hcDogZnVuY3Rpb24obGhzLCBjdHgpIHtcbiAgICAgICAgZXhDb21tYW5kRGlzcGF0Y2hlci51bm1hcChsaHMsIGN0eCk7XG4gICAgICB9LFxuICAgICAgLy8gTm9uLXJlY3Vyc2l2ZSBtYXAgZnVuY3Rpb24uXG4gICAgICAvLyBOT1RFOiBUaGlzIHdpbGwgbm90IGNyZWF0ZSBtYXBwaW5ncyB0byBrZXkgbWFwcyB0aGF0IGFyZW4ndCBwcmVzZW50XG4gICAgICAvLyBpbiB0aGUgZGVmYXVsdCBrZXkgbWFwLiBTZWUgVE9ETyBhdCBib3R0b20gb2YgZnVuY3Rpb24uXG4gICAgICBub3JlbWFwOiBmdW5jdGlvbihsaHMsIHJocywgY3R4KSB7XG4gICAgICAgIGZ1bmN0aW9uIHRvQ3R4QXJyYXkoY3R4KSB7XG4gICAgICAgICAgcmV0dXJuIGN0eCA/IFtjdHhdIDogWydub3JtYWwnLCAnaW5zZXJ0JywgJ3Zpc3VhbCddO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjdHhzVG9NYXAgPSB0b0N0eEFycmF5KGN0eCk7XG4gICAgICAgIC8vIExvb2sgdGhyb3VnaCBhbGwgYWN0dWFsIGRlZmF1bHRzIHRvIGZpbmQgYSBtYXAgY2FuZGlkYXRlLlxuICAgICAgICB2YXIgYWN0dWFsTGVuZ3RoID0gZGVmYXVsdEtleW1hcC5sZW5ndGgsIG9yaWdMZW5ndGggPSBkZWZhdWx0S2V5bWFwTGVuZ3RoO1xuICAgICAgICBmb3IgKHZhciBpID0gYWN0dWFsTGVuZ3RoIC0gb3JpZ0xlbmd0aDtcbiAgICAgICAgICAgICBpIDwgYWN0dWFsTGVuZ3RoICYmIGN0eHNUb01hcC5sZW5ndGg7XG4gICAgICAgICAgICAgaSsrKSB7XG4gICAgICAgICAgdmFyIG1hcHBpbmcgPSBkZWZhdWx0S2V5bWFwW2ldO1xuICAgICAgICAgIC8vIE9taXQgbWFwcGluZ3MgdGhhdCBvcGVyYXRlIGluIHRoZSB3cm9uZyBjb250ZXh0KHMpIGFuZCB0aG9zZSBvZiBpbnZhbGlkIHR5cGUuXG4gICAgICAgICAgaWYgKG1hcHBpbmcua2V5cyA9PSByaHMgJiZcbiAgICAgICAgICAgICAgKCFjdHggfHwgIW1hcHBpbmcuY29udGV4dCB8fCBtYXBwaW5nLmNvbnRleHQgPT09IGN0eCkgJiZcbiAgICAgICAgICAgICAgbWFwcGluZy50eXBlLnN1YnN0cigwLCAyKSAhPT0gJ2V4JyAmJlxuICAgICAgICAgICAgICBtYXBwaW5nLnR5cGUuc3Vic3RyKDAsIDMpICE9PSAna2V5Jykge1xuICAgICAgICAgICAgLy8gTWFrZSBhIHNoYWxsb3cgY29weSBvZiB0aGUgb3JpZ2luYWwga2V5bWFwIGVudHJ5LlxuICAgICAgICAgICAgdmFyIG5ld01hcHBpbmcgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBtYXBwaW5nKSB7XG4gICAgICAgICAgICAgIG5ld01hcHBpbmdba2V5XSA9IG1hcHBpbmdba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIE1vZGlmeSBpdCBwb2ludCB0byB0aGUgbmV3IG1hcHBpbmcgd2l0aCB0aGUgcHJvcGVyIGNvbnRleHQuXG4gICAgICAgICAgICBuZXdNYXBwaW5nLmtleXMgPSBsaHM7XG4gICAgICAgICAgICBpZiAoY3R4ICYmICFuZXdNYXBwaW5nLmNvbnRleHQpIHtcbiAgICAgICAgICAgICAgbmV3TWFwcGluZy5jb250ZXh0ID0gY3R4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gQWRkIGl0IHRvIHRoZSBrZXltYXAgd2l0aCBhIGhpZ2hlciBwcmlvcml0eSB0aGFuIHRoZSBvcmlnaW5hbC5cbiAgICAgICAgICAgIHRoaXMuX21hcENvbW1hbmQobmV3TWFwcGluZyk7XG4gICAgICAgICAgICAvLyBSZWNvcmQgdGhlIG1hcHBlZCBjb250ZXh0cyBhcyBjb21wbGV0ZS5cbiAgICAgICAgICAgIHZhciBtYXBwZWRDdHhzID0gdG9DdHhBcnJheShtYXBwaW5nLmNvbnRleHQpO1xuICAgICAgICAgICAgY3R4c1RvTWFwID0gY3R4c1RvTWFwLmZpbHRlcihmdW5jdGlvbihlbCkgeyByZXR1cm4gbWFwcGVkQ3R4cy5pbmRleE9mKGVsKSA9PT0gLTE7IH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBUT0RPOiBDcmVhdGUgbm9uLXJlY3Vyc2l2ZSBrZXlUb0tleSBtYXBwaW5ncyBmb3IgdGhlIHVubWFwcGVkIGNvbnRleHRzIG9uY2UgdGhvc2UgZXhpc3QuXG4gICAgICB9LFxuICAgICAgLy8gUmVtb3ZlIGFsbCB1c2VyLWRlZmluZWQgbWFwcGluZ3MgZm9yIHRoZSBwcm92aWRlZCBjb250ZXh0LlxuICAgICAgbWFwY2xlYXI6IGZ1bmN0aW9uKGN0eCkge1xuICAgICAgICAvLyBQYXJ0aXRpb24gdGhlIGV4aXN0aW5nIGtleW1hcCBpbnRvIHVzZXItZGVmaW5lZCBhbmQgdHJ1ZSBkZWZhdWx0cy5cbiAgICAgICAgdmFyIGFjdHVhbExlbmd0aCA9IGRlZmF1bHRLZXltYXAubGVuZ3RoLFxuICAgICAgICAgICAgb3JpZ0xlbmd0aCA9IGRlZmF1bHRLZXltYXBMZW5ndGg7XG4gICAgICAgIHZhciB1c2VyS2V5bWFwID0gZGVmYXVsdEtleW1hcC5zbGljZSgwLCBhY3R1YWxMZW5ndGggLSBvcmlnTGVuZ3RoKTtcbiAgICAgICAgZGVmYXVsdEtleW1hcCA9IGRlZmF1bHRLZXltYXAuc2xpY2UoYWN0dWFsTGVuZ3RoIC0gb3JpZ0xlbmd0aCk7XG4gICAgICAgIGlmIChjdHgpIHtcbiAgICAgICAgICAvLyBJZiBhIHNwZWNpZmljIGNvbnRleHQgaXMgYmVpbmcgY2xlYXJlZCwgd2UgbmVlZCB0byBrZWVwIG1hcHBpbmdzXG4gICAgICAgICAgLy8gZnJvbSBhbGwgb3RoZXIgY29udGV4dHMuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IHVzZXJLZXltYXAubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIHZhciBtYXBwaW5nID0gdXNlcktleW1hcFtpXTtcbiAgICAgICAgICAgIGlmIChjdHggIT09IG1hcHBpbmcuY29udGV4dCkge1xuICAgICAgICAgICAgICBpZiAobWFwcGluZy5jb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFwQ29tbWFuZChtYXBwaW5nKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBgbWFwcGluZ2AgYXBwbGllcyB0byBhbGwgY29udGV4dHMgc28gY3JlYXRlIGtleW1hcCBjb3BpZXNcbiAgICAgICAgICAgICAgICAvLyBmb3IgZWFjaCBjb250ZXh0IGV4Y2VwdCB0aGUgb25lIGJlaW5nIGNsZWFyZWQuXG4gICAgICAgICAgICAgICAgdmFyIGNvbnRleHRzID0gWydub3JtYWwnLCAnaW5zZXJ0JywgJ3Zpc3VhbCddO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogaW4gY29udGV4dHMpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChjb250ZXh0c1tqXSAhPT0gY3R4KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdNYXBwaW5nID0ge307XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBtYXBwaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgbmV3TWFwcGluZ1trZXldID0gbWFwcGluZ1trZXldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5ld01hcHBpbmcuY29udGV4dCA9IGNvbnRleHRzW2pdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tYXBDb21tYW5kKG5ld01hcHBpbmcpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIFRPRE86IEV4cG9zZSBzZXRPcHRpb24gYW5kIGdldE9wdGlvbiBhcyBpbnN0YW5jZSBtZXRob2RzLiBOZWVkIHRvIGRlY2lkZSBob3cgdG8gbmFtZXNwYWNlXG4gICAgICAvLyB0aGVtLCBvciBzb21laG93IG1ha2UgdGhlbSB3b3JrIHdpdGggdGhlIGV4aXN0aW5nIENvZGVNaXJyb3Igc2V0T3B0aW9uL2dldE9wdGlvbiBBUEkuXG4gICAgICBzZXRPcHRpb246IHNldE9wdGlvbixcbiAgICAgIGdldE9wdGlvbjogZ2V0T3B0aW9uLFxuICAgICAgZGVmaW5lT3B0aW9uOiBkZWZpbmVPcHRpb24sXG4gICAgICBkZWZpbmVFeDogZnVuY3Rpb24obmFtZSwgcHJlZml4LCBmdW5jKXtcbiAgICAgICAgaWYgKCFwcmVmaXgpIHtcbiAgICAgICAgICBwcmVmaXggPSBuYW1lO1xuICAgICAgICB9IGVsc2UgaWYgKG5hbWUuaW5kZXhPZihwcmVmaXgpICE9PSAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCcoVmltLmRlZmluZUV4KSBcIicrcHJlZml4KydcIiBpcyBub3QgYSBwcmVmaXggb2YgXCInK25hbWUrJ1wiLCBjb21tYW5kIG5vdCByZWdpc3RlcmVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgZXhDb21tYW5kc1tuYW1lXT1mdW5jO1xuICAgICAgICBleENvbW1hbmREaXNwYXRjaGVyLmNvbW1hbmRNYXBfW3ByZWZpeF09e25hbWU6bmFtZSwgc2hvcnROYW1lOnByZWZpeCwgdHlwZTonYXBpJ307XG4gICAgICB9LFxuICAgICAgaGFuZGxlS2V5OiBmdW5jdGlvbiAoY20sIGtleSwgb3JpZ2luKSB7XG4gICAgICAgIHZhciBjb21tYW5kID0gdGhpcy5maW5kS2V5KGNtLCBrZXksIG9yaWdpbik7XG4gICAgICAgIGlmICh0eXBlb2YgY29tbWFuZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHJldHVybiBjb21tYW5kKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvKipcbiAgICAgICAqIFRoaXMgaXMgdGhlIG91dGVybW9zdCBmdW5jdGlvbiBjYWxsZWQgYnkgQ29kZU1pcnJvciwgYWZ0ZXIga2V5cyBoYXZlXG4gICAgICAgKiBiZWVuIG1hcHBlZCB0byB0aGVpciBWaW0gZXF1aXZhbGVudHMuXG4gICAgICAgKlxuICAgICAgICogRmluZHMgYSBjb21tYW5kIGJhc2VkIG9uIHRoZSBrZXkgKGFuZCBjYWNoZWQga2V5cyBpZiB0aGVyZSBpcyBhXG4gICAgICAgKiBtdWx0aS1rZXkgc2VxdWVuY2UpLiBSZXR1cm5zIGB1bmRlZmluZWRgIGlmIG5vIGtleSBpcyBtYXRjaGVkLCBhIG5vb3BcbiAgICAgICAqIGZ1bmN0aW9uIGlmIGEgcGFydGlhbCBtYXRjaCBpcyBmb3VuZCAobXVsdGkta2V5KSwgYW5kIGEgZnVuY3Rpb24gdG9cbiAgICAgICAqIGV4ZWN1dGUgdGhlIGJvdW5kIGNvbW1hbmQgaWYgYSBhIGtleSBpcyBtYXRjaGVkLiBUaGUgZnVuY3Rpb24gYWx3YXlzXG4gICAgICAgKiByZXR1cm5zIHRydWUuXG4gICAgICAgKi9cbiAgICAgIGZpbmRLZXk6IGZ1bmN0aW9uKGNtLCBrZXksIG9yaWdpbikge1xuICAgICAgICB2YXIgdmltID0gbWF5YmVJbml0VmltU3RhdGUoY20pO1xuICAgICAgICBmdW5jdGlvbiBoYW5kbGVNYWNyb1JlY29yZGluZygpIHtcbiAgICAgICAgICB2YXIgbWFjcm9Nb2RlU3RhdGUgPSB2aW1HbG9iYWxTdGF0ZS5tYWNyb01vZGVTdGF0ZTtcbiAgICAgICAgICBpZiAobWFjcm9Nb2RlU3RhdGUuaXNSZWNvcmRpbmcpIHtcbiAgICAgICAgICAgIGlmIChrZXkgPT0gJ3EnKSB7XG4gICAgICAgICAgICAgIG1hY3JvTW9kZVN0YXRlLmV4aXRNYWNyb1JlY29yZE1vZGUoKTtcbiAgICAgICAgICAgICAgY2xlYXJJbnB1dFN0YXRlKGNtKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3JpZ2luICE9ICdtYXBwaW5nJykge1xuICAgICAgICAgICAgICBsb2dLZXkobWFjcm9Nb2RlU3RhdGUsIGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUVzYygpIHtcbiAgICAgICAgICBpZiAoa2V5ID09ICc8RXNjPicpIHtcbiAgICAgICAgICAgIC8vIENsZWFyIGlucHV0IHN0YXRlIGFuZCBnZXQgYmFjayB0byBub3JtYWwgbW9kZS5cbiAgICAgICAgICAgIGNsZWFySW5wdXRTdGF0ZShjbSk7XG4gICAgICAgICAgICBpZiAodmltLnZpc3VhbE1vZGUpIHtcbiAgICAgICAgICAgICAgZXhpdFZpc3VhbE1vZGUoY20pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2aW0uaW5zZXJ0TW9kZSkge1xuICAgICAgICAgICAgICBleGl0SW5zZXJ0TW9kZShjbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZG9LZXlUb0tleShrZXlzKSB7XG4gICAgICAgICAgLy8gVE9ETzogcHJldmVudCBpbmZpbml0ZSByZWN1cnNpb24uXG4gICAgICAgICAgdmFyIG1hdGNoO1xuICAgICAgICAgIHdoaWxlIChrZXlzKSB7XG4gICAgICAgICAgICAvLyBQdWxsIG9mZiBvbmUgY29tbWFuZCBrZXksIHdoaWNoIGlzIGVpdGhlciBhIHNpbmdsZSBjaGFyYWN0ZXJcbiAgICAgICAgICAgIC8vIG9yIGEgc3BlY2lhbCBzZXF1ZW5jZSB3cmFwcGVkIGluICc8JyBhbmQgJz4nLCBlLmcuICc8U3BhY2U+Jy5cbiAgICAgICAgICAgIG1hdGNoID0gKC88XFx3Ky0uKz8+fDxcXHcrPnwuLykuZXhlYyhrZXlzKTtcbiAgICAgICAgICAgIGtleSA9IG1hdGNoWzBdO1xuICAgICAgICAgICAga2V5cyA9IGtleXMuc3Vic3RyaW5nKG1hdGNoLmluZGV4ICsga2V5Lmxlbmd0aCk7XG4gICAgICAgICAgICBDb2RlTWlycm9yLlZpbS5oYW5kbGVLZXkoY20sIGtleSwgJ21hcHBpbmcnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVLZXlJbnNlcnRNb2RlKCkge1xuICAgICAgICAgIGlmIChoYW5kbGVFc2MoKSkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgICAgIHZhciBrZXlzID0gdmltLmlucHV0U3RhdGUua2V5QnVmZmVyID0gdmltLmlucHV0U3RhdGUua2V5QnVmZmVyICsga2V5O1xuICAgICAgICAgIHZhciBrZXlzQXJlQ2hhcnMgPSBrZXkubGVuZ3RoID09IDE7XG4gICAgICAgICAgdmFyIG1hdGNoID0gY29tbWFuZERpc3BhdGNoZXIubWF0Y2hDb21tYW5kKGtleXMsIGRlZmF1bHRLZXltYXAsIHZpbS5pbnB1dFN0YXRlLCAnaW5zZXJ0Jyk7XG4gICAgICAgICAgLy8gTmVlZCB0byBjaGVjayBhbGwga2V5IHN1YnN0cmluZ3MgaW4gaW5zZXJ0IG1vZGUuXG4gICAgICAgICAgd2hpbGUgKGtleXMubGVuZ3RoID4gMSAmJiBtYXRjaC50eXBlICE9ICdmdWxsJykge1xuICAgICAgICAgICAgdmFyIGtleXMgPSB2aW0uaW5wdXRTdGF0ZS5rZXlCdWZmZXIgPSBrZXlzLnNsaWNlKDEpO1xuICAgICAgICAgICAgdmFyIHRoaXNNYXRjaCA9IGNvbW1hbmREaXNwYXRjaGVyLm1hdGNoQ29tbWFuZChrZXlzLCBkZWZhdWx0S2V5bWFwLCB2aW0uaW5wdXRTdGF0ZSwgJ2luc2VydCcpO1xuICAgICAgICAgICAgaWYgKHRoaXNNYXRjaC50eXBlICE9ICdub25lJykgeyBtYXRjaCA9IHRoaXNNYXRjaDsgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobWF0Y2gudHlwZSA9PSAnbm9uZScpIHsgY2xlYXJJbnB1dFN0YXRlKGNtKTsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICAgICAgZWxzZSBpZiAobWF0Y2gudHlwZSA9PSAncGFydGlhbCcpIHtcbiAgICAgICAgICAgIGlmIChsYXN0SW5zZXJ0TW9kZUtleVRpbWVyKSB7IHdpbmRvdy5jbGVhclRpbWVvdXQobGFzdEluc2VydE1vZGVLZXlUaW1lcik7IH1cbiAgICAgICAgICAgIGxhc3RJbnNlcnRNb2RlS2V5VGltZXIgPSB3aW5kb3cuc2V0VGltZW91dChcbiAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7IGlmICh2aW0uaW5zZXJ0TW9kZSAmJiB2aW0uaW5wdXRTdGF0ZS5rZXlCdWZmZXIpIHsgY2xlYXJJbnB1dFN0YXRlKGNtKTsgfSB9LFxuICAgICAgICAgICAgICBnZXRPcHRpb24oJ2luc2VydE1vZGVFc2NLZXlzVGltZW91dCcpKTtcbiAgICAgICAgICAgIHJldHVybiAha2V5c0FyZUNoYXJzO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChsYXN0SW5zZXJ0TW9kZUtleVRpbWVyKSB7IHdpbmRvdy5jbGVhclRpbWVvdXQobGFzdEluc2VydE1vZGVLZXlUaW1lcik7IH1cbiAgICAgICAgICBpZiAoa2V5c0FyZUNoYXJzKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0aW9ucyA9IGNtLmxpc3RTZWxlY3Rpb25zKCk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGVjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgdmFyIGhlcmUgPSBzZWxlY3Rpb25zW2ldLmhlYWQ7XG4gICAgICAgICAgICAgIGNtLnJlcGxhY2VSYW5nZSgnJywgb2Zmc2V0Q3Vyc29yKGhlcmUsIDAsIC0oa2V5cy5sZW5ndGggLSAxKSksIGhlcmUsICcraW5wdXQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZpbUdsb2JhbFN0YXRlLm1hY3JvTW9kZVN0YXRlLmxhc3RJbnNlcnRNb2RlQ2hhbmdlcy5jaGFuZ2VzLnBvcCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjbGVhcklucHV0U3RhdGUoY20pO1xuICAgICAgICAgIHJldHVybiBtYXRjaC5jb21tYW5kO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlS2V5Tm9uSW5zZXJ0TW9kZSgpIHtcbiAgICAgICAgICBpZiAoaGFuZGxlTWFjcm9SZWNvcmRpbmcoKSB8fCBoYW5kbGVFc2MoKSkgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gICAgICAgICAgdmFyIGtleXMgPSB2aW0uaW5wdXRTdGF0ZS5rZXlCdWZmZXIgPSB2aW0uaW5wdXRTdGF0ZS5rZXlCdWZmZXIgKyBrZXk7XG4gICAgICAgICAgaWYgKC9eWzEtOV1cXGQqJC8udGVzdChrZXlzKSkgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gICAgICAgICAgdmFyIGtleXNNYXRjaGVyID0gL14oXFxkKikoLiopJC8uZXhlYyhrZXlzKTtcbiAgICAgICAgICBpZiAoIWtleXNNYXRjaGVyKSB7IGNsZWFySW5wdXRTdGF0ZShjbSk7IHJldHVybiBmYWxzZTsgfVxuICAgICAgICAgIHZhciBjb250ZXh0ID0gdmltLnZpc3VhbE1vZGUgPyAndmlzdWFsJyA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdub3JtYWwnO1xuICAgICAgICAgIHZhciBtYXRjaCA9IGNvbW1hbmREaXNwYXRjaGVyLm1hdGNoQ29tbWFuZChrZXlzTWF0Y2hlclsyXSB8fCBrZXlzTWF0Y2hlclsxXSwgZGVmYXVsdEtleW1hcCwgdmltLmlucHV0U3RhdGUsIGNvbnRleHQpO1xuICAgICAgICAgIGlmIChtYXRjaC50eXBlID09ICdub25lJykgeyBjbGVhcklucHV0U3RhdGUoY20pOyByZXR1cm4gZmFsc2U7IH1cbiAgICAgICAgICBlbHNlIGlmIChtYXRjaC50eXBlID09ICdwYXJ0aWFsJykgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gICAgICAgICAgdmltLmlucHV0U3RhdGUua2V5QnVmZmVyID0gJyc7XG4gICAgICAgICAgdmFyIGtleXNNYXRjaGVyID0gL14oXFxkKikoLiopJC8uZXhlYyhrZXlzKTtcbiAgICAgICAgICBpZiAoa2V5c01hdGNoZXJbMV0gJiYga2V5c01hdGNoZXJbMV0gIT0gJzAnKSB7XG4gICAgICAgICAgICB2aW0uaW5wdXRTdGF0ZS5wdXNoUmVwZWF0RGlnaXQoa2V5c01hdGNoZXJbMV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbWF0Y2guY29tbWFuZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjb21tYW5kO1xuICAgICAgICBpZiAodmltLmluc2VydE1vZGUpIHsgY29tbWFuZCA9IGhhbmRsZUtleUluc2VydE1vZGUoKTsgfVxuICAgICAgICBlbHNlIHsgY29tbWFuZCA9IGhhbmRsZUtleU5vbkluc2VydE1vZGUoKTsgfVxuICAgICAgICBpZiAoY29tbWFuZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm4gIXZpbS5pbnNlcnRNb2RlICYmIGtleS5sZW5ndGggPT09IDEgPyBmdW5jdGlvbigpIHsgcmV0dXJuIHRydWU7IH0gOiB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgIC8vIFRPRE86IExvb2sgaW50byB1c2luZyBDb2RlTWlycm9yJ3MgbXVsdGkta2V5IGhhbmRsaW5nLlxuICAgICAgICAgIC8vIFJldHVybiBuby1vcCBzaW5jZSB3ZSBhcmUgY2FjaGluZyB0aGUga2V5LiBDb3VudHMgYXMgaGFuZGxlZCwgYnV0XG4gICAgICAgICAgLy8gZG9uJ3Qgd2FudCBhY3Qgb24gaXQganVzdCB5ZXQuXG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkgeyByZXR1cm4gdHJ1ZTsgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gY20ub3BlcmF0aW9uKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBjbS5jdXJPcC5pc1ZpbU9wID0gdHJ1ZTtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAoY29tbWFuZC50eXBlID09ICdrZXlUb0tleScpIHtcbiAgICAgICAgICAgICAgICAgIGRvS2V5VG9LZXkoY29tbWFuZC50b0tleXMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBjb21tYW5kRGlzcGF0Y2hlci5wcm9jZXNzQ29tbWFuZChjbSwgdmltLCBjb21tYW5kKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAvLyBjbGVhciBWSU0gc3RhdGUgaW4gY2FzZSBpdCdzIGluIGEgYmFkIHN0YXRlLlxuICAgICAgICAgICAgICAgIGNtLnN0YXRlLnZpbSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBtYXliZUluaXRWaW1TdGF0ZShjbSk7XG4gICAgICAgICAgICAgICAgaWYgKCFDb2RlTWlycm9yLlZpbS5zdXBwcmVzc0Vycm9yTG9nZ2luZykge1xuICAgICAgICAgICAgICAgICAgY29uc29sZVsnbG9nJ10oZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaGFuZGxlRXg6IGZ1bmN0aW9uKGNtLCBpbnB1dCkge1xuICAgICAgICBleENvbW1hbmREaXNwYXRjaGVyLnByb2Nlc3NDb21tYW5kKGNtLCBpbnB1dCk7XG4gICAgICB9LFxuXG4gICAgICBkZWZpbmVNb3Rpb246IGRlZmluZU1vdGlvbixcbiAgICAgIGRlZmluZUFjdGlvbjogZGVmaW5lQWN0aW9uLFxuICAgICAgZGVmaW5lT3BlcmF0b3I6IGRlZmluZU9wZXJhdG9yLFxuICAgICAgbWFwQ29tbWFuZDogbWFwQ29tbWFuZCxcbiAgICAgIF9tYXBDb21tYW5kOiBfbWFwQ29tbWFuZCxcblxuICAgICAgZGVmaW5lUmVnaXN0ZXI6IGRlZmluZVJlZ2lzdGVyLFxuXG4gICAgICBleGl0VmlzdWFsTW9kZTogZXhpdFZpc3VhbE1vZGUsXG4gICAgICBleGl0SW5zZXJ0TW9kZTogZXhpdEluc2VydE1vZGVcbiAgICB9O1xuXG4gICAgLy8gUmVwcmVzZW50cyB0aGUgY3VycmVudCBpbnB1dCBzdGF0ZS5cbiAgICBmdW5jdGlvbiBJbnB1dFN0YXRlKCkge1xuICAgICAgdGhpcy5wcmVmaXhSZXBlYXQgPSBbXTtcbiAgICAgIHRoaXMubW90aW9uUmVwZWF0ID0gW107XG5cbiAgICAgIHRoaXMub3BlcmF0b3IgPSBudWxsO1xuICAgICAgdGhpcy5vcGVyYXRvckFyZ3MgPSBudWxsO1xuICAgICAgdGhpcy5tb3Rpb24gPSBudWxsO1xuICAgICAgdGhpcy5tb3Rpb25BcmdzID0gbnVsbDtcbiAgICAgIHRoaXMua2V5QnVmZmVyID0gW107IC8vIEZvciBtYXRjaGluZyBtdWx0aS1rZXkgY29tbWFuZHMuXG4gICAgICB0aGlzLnJlZ2lzdGVyTmFtZSA9IG51bGw7IC8vIERlZmF1bHRzIHRvIHRoZSB1bm5hbWVkIHJlZ2lzdGVyLlxuICAgIH1cbiAgICBJbnB1dFN0YXRlLnByb3RvdHlwZS5wdXNoUmVwZWF0RGlnaXQgPSBmdW5jdGlvbihuKSB7XG4gICAgICBpZiAoIXRoaXMub3BlcmF0b3IpIHtcbiAgICAgICAgdGhpcy5wcmVmaXhSZXBlYXQgPSB0aGlzLnByZWZpeFJlcGVhdC5jb25jYXQobik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm1vdGlvblJlcGVhdCA9IHRoaXMubW90aW9uUmVwZWF0LmNvbmNhdChuKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIElucHV0U3RhdGUucHJvdG90eXBlLmdldFJlcGVhdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlcGVhdCA9IDA7XG4gICAgICBpZiAodGhpcy5wcmVmaXhSZXBlYXQubGVuZ3RoID4gMCB8fCB0aGlzLm1vdGlvblJlcGVhdC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJlcGVhdCA9IDE7XG4gICAgICAgIGlmICh0aGlzLnByZWZpeFJlcGVhdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmVwZWF0ICo9IHBhcnNlSW50KHRoaXMucHJlZml4UmVwZWF0LmpvaW4oJycpLCAxMCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubW90aW9uUmVwZWF0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXBlYXQgKj0gcGFyc2VJbnQodGhpcy5tb3Rpb25SZXBlYXQuam9pbignJyksIDEwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcGVhdDtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gY2xlYXJJbnB1dFN0YXRlKGNtLCByZWFzb24pIHtcbiAgICAgIGNtLnN0YXRlLnZpbS5pbnB1dFN0YXRlID0gbmV3IElucHV0U3RhdGUoKTtcbiAgICAgIENvZGVNaXJyb3Iuc2lnbmFsKGNtLCAndmltLWNvbW1hbmQtZG9uZScsIHJlYXNvbik7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZWdpc3RlciBzdG9yZXMgaW5mb3JtYXRpb24gYWJvdXQgY29weSBhbmQgcGFzdGUgcmVnaXN0ZXJzLiAgQmVzaWRlc1xuICAgICAqIHRleHQsIGEgcmVnaXN0ZXIgbXVzdCBzdG9yZSB3aGV0aGVyIGl0IGlzIGxpbmV3aXNlIChpLmUuLCB3aGVuIGl0IGlzXG4gICAgICogcGFzdGVkLCBzaG91bGQgaXQgaW5zZXJ0IGl0c2VsZiBpbnRvIGEgbmV3IGxpbmUsIG9yIHNob3VsZCB0aGUgdGV4dCBiZVxuICAgICAqIGluc2VydGVkIGF0IHRoZSBjdXJzb3IgcG9zaXRpb24uKVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFJlZ2lzdGVyKHRleHQsIGxpbmV3aXNlLCBibG9ja3dpc2UpIHtcbiAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgIHRoaXMua2V5QnVmZmVyID0gW3RleHQgfHwgJyddO1xuICAgICAgdGhpcy5pbnNlcnRNb2RlQ2hhbmdlcyA9IFtdO1xuICAgICAgdGhpcy5zZWFyY2hRdWVyaWVzID0gW107XG4gICAgICB0aGlzLmxpbmV3aXNlID0gISFsaW5ld2lzZTtcbiAgICAgIHRoaXMuYmxvY2t3aXNlID0gISFibG9ja3dpc2U7XG4gICAgfVxuICAgIFJlZ2lzdGVyLnByb3RvdHlwZSA9IHtcbiAgICAgIHNldFRleHQ6IGZ1bmN0aW9uKHRleHQsIGxpbmV3aXNlLCBibG9ja3dpc2UpIHtcbiAgICAgICAgdGhpcy5rZXlCdWZmZXIgPSBbdGV4dCB8fCAnJ107XG4gICAgICAgIHRoaXMubGluZXdpc2UgPSAhIWxpbmV3aXNlO1xuICAgICAgICB0aGlzLmJsb2Nrd2lzZSA9ICEhYmxvY2t3aXNlO1xuICAgICAgfSxcbiAgICAgIHB1c2hUZXh0OiBmdW5jdGlvbih0ZXh0LCBsaW5ld2lzZSkge1xuICAgICAgICAvLyBpZiB0aGlzIHJlZ2lzdGVyIGhhcyBldmVyIGJlZW4gc2V0IHRvIGxpbmV3aXNlLCB1c2UgbGluZXdpc2UuXG4gICAgICAgIGlmIChsaW5ld2lzZSkge1xuICAgICAgICAgIGlmICghdGhpcy5saW5ld2lzZSkge1xuICAgICAgICAgICAgdGhpcy5rZXlCdWZmZXIucHVzaCgnXFxuJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMubGluZXdpc2UgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMua2V5QnVmZmVyLnB1c2godGV4dCk7XG4gICAgICB9LFxuICAgICAgcHVzaEluc2VydE1vZGVDaGFuZ2VzOiBmdW5jdGlvbihjaGFuZ2VzKSB7XG4gICAgICAgIHRoaXMuaW5zZXJ0TW9kZUNoYW5nZXMucHVzaChjcmVhdGVJbnNlcnRNb2RlQ2hhbmdlcyhjaGFuZ2VzKSk7XG4gICAgICB9LFxuICAgICAgcHVzaFNlYXJjaFF1ZXJ5OiBmdW5jdGlvbihxdWVyeSkge1xuICAgICAgICB0aGlzLnNlYXJjaFF1ZXJpZXMucHVzaChxdWVyeSk7XG4gICAgICB9LFxuICAgICAgY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmtleUJ1ZmZlciA9IFtdO1xuICAgICAgICB0aGlzLmluc2VydE1vZGVDaGFuZ2VzID0gW107XG4gICAgICAgIHRoaXMuc2VhcmNoUXVlcmllcyA9IFtdO1xuICAgICAgICB0aGlzLmxpbmV3aXNlID0gZmFsc2U7XG4gICAgICB9LFxuICAgICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5rZXlCdWZmZXIuam9pbignJyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIERlZmluZXMgYW4gZXh0ZXJuYWwgcmVnaXN0ZXIuXG4gICAgICpcbiAgICAgKiBUaGUgbmFtZSBzaG91bGQgYmUgYSBzaW5nbGUgY2hhcmFjdGVyIHRoYXQgd2lsbCBiZSB1c2VkIHRvIHJlZmVyZW5jZSB0aGUgcmVnaXN0ZXIuXG4gICAgICogVGhlIHJlZ2lzdGVyIHNob3VsZCBzdXBwb3J0IHNldFRleHQsIHB1c2hUZXh0LCBjbGVhciwgYW5kIHRvU3RyaW5nKCkuIFNlZSBSZWdpc3RlclxuICAgICAqIGZvciBhIHJlZmVyZW5jZSBpbXBsZW1lbnRhdGlvbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkZWZpbmVSZWdpc3RlcihuYW1lLCByZWdpc3Rlcikge1xuICAgICAgdmFyIHJlZ2lzdGVycyA9IHZpbUdsb2JhbFN0YXRlLnJlZ2lzdGVyQ29udHJvbGxlci5yZWdpc3RlcnM7XG4gICAgICBpZiAoIW5hbWUgfHwgbmFtZS5sZW5ndGggIT0gMSkge1xuICAgICAgICB0aHJvdyBFcnJvcignUmVnaXN0ZXIgbmFtZSBtdXN0IGJlIDEgY2hhcmFjdGVyJyk7XG4gICAgICB9XG4gICAgICBpZiAocmVnaXN0ZXJzW25hbWVdKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdSZWdpc3RlciBhbHJlYWR5IGRlZmluZWQgJyArIG5hbWUpO1xuICAgICAgfVxuICAgICAgcmVnaXN0ZXJzW25hbWVdID0gcmVnaXN0ZXI7XG4gICAgICB2YWxpZFJlZ2lzdGVycy5wdXNoKG5hbWUpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogdmltIHJlZ2lzdGVycyBhbGxvdyB5b3UgdG8ga2VlcCBtYW55IGluZGVwZW5kZW50IGNvcHkgYW5kIHBhc3RlIGJ1ZmZlcnMuXG4gICAgICogU2VlIGh0dHA6Ly91c2V2aW0uY29tLzIwMTIvMDQvMTMvcmVnaXN0ZXJzLyBmb3IgYW4gaW50cm9kdWN0aW9uLlxuICAgICAqXG4gICAgICogUmVnaXN0ZXJDb250cm9sbGVyIGtlZXBzIHRoZSBzdGF0ZSBvZiBhbGwgdGhlIHJlZ2lzdGVycy4gIEFuIGluaXRpYWxcbiAgICAgKiBzdGF0ZSBtYXkgYmUgcGFzc2VkIGluLiAgVGhlIHVubmFtZWQgcmVnaXN0ZXIgJ1wiJyB3aWxsIGFsd2F5cyBiZVxuICAgICAqIG92ZXJyaWRkZW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gUmVnaXN0ZXJDb250cm9sbGVyKHJlZ2lzdGVycykge1xuICAgICAgdGhpcy5yZWdpc3RlcnMgPSByZWdpc3RlcnM7XG4gICAgICB0aGlzLnVubmFtZWRSZWdpc3RlciA9IHJlZ2lzdGVyc1snXCInXSA9IG5ldyBSZWdpc3RlcigpO1xuICAgICAgcmVnaXN0ZXJzWycuJ10gPSBuZXcgUmVnaXN0ZXIoKTtcbiAgICAgIHJlZ2lzdGVyc1snOiddID0gbmV3IFJlZ2lzdGVyKCk7XG4gICAgICByZWdpc3RlcnNbJy8nXSA9IG5ldyBSZWdpc3RlcigpO1xuICAgIH1cbiAgICBSZWdpc3RlckNvbnRyb2xsZXIucHJvdG90eXBlID0ge1xuICAgICAgcHVzaFRleHQ6IGZ1bmN0aW9uKHJlZ2lzdGVyTmFtZSwgb3BlcmF0b3IsIHRleHQsIGxpbmV3aXNlLCBibG9ja3dpc2UpIHtcbiAgICAgICAgaWYgKGxpbmV3aXNlICYmIHRleHQuY2hhckF0KHRleHQubGVuZ3RoIC0gMSkgIT09ICdcXG4nKXtcbiAgICAgICAgICB0ZXh0ICs9ICdcXG4nO1xuICAgICAgICB9XG4gICAgICAgIC8vIExvd2VyY2FzZSBhbmQgdXBwZXJjYXNlIHJlZ2lzdGVycyByZWZlciB0byB0aGUgc2FtZSByZWdpc3Rlci5cbiAgICAgICAgLy8gVXBwZXJjYXNlIGp1c3QgbWVhbnMgYXBwZW5kLlxuICAgICAgICB2YXIgcmVnaXN0ZXIgPSB0aGlzLmlzVmFsaWRSZWdpc3RlcihyZWdpc3Rlck5hbWUpID9cbiAgICAgICAgICAgIHRoaXMuZ2V0UmVnaXN0ZXIocmVnaXN0ZXJOYW1lKSA6IG51bGw7XG4gICAgICAgIC8vIGlmIG5vIHJlZ2lzdGVyL2FuIGludmFsaWQgcmVnaXN0ZXIgd2FzIHNwZWNpZmllZCwgdGhpbmdzIGdvIHRvIHRoZVxuICAgICAgICAvLyBkZWZhdWx0IHJlZ2lzdGVyc1xuICAgICAgICBpZiAoIXJlZ2lzdGVyKSB7XG4gICAgICAgICAgc3dpdGNoIChvcGVyYXRvcikge1xuICAgICAgICAgICAgY2FzZSAneWFuayc6XG4gICAgICAgICAgICAgIC8vIFRoZSAwIHJlZ2lzdGVyIGNvbnRhaW5zIHRoZSB0ZXh0IGZyb20gdGhlIG1vc3QgcmVjZW50IHlhbmsuXG4gICAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJzWycwJ10gPSBuZXcgUmVnaXN0ZXIodGV4dCwgbGluZXdpc2UsIGJsb2Nrd2lzZSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZGVsZXRlJzpcbiAgICAgICAgICAgIGNhc2UgJ2NoYW5nZSc6XG4gICAgICAgICAgICAgIGlmICh0ZXh0LmluZGV4T2YoJ1xcbicpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gRGVsZXRlIGxlc3MgdGhhbiAxIGxpbmUuIFVwZGF0ZSB0aGUgc21hbGwgZGVsZXRlIHJlZ2lzdGVyLlxuICAgICAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJzWyctJ10gPSBuZXcgUmVnaXN0ZXIodGV4dCwgbGluZXdpc2UpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFNoaWZ0IGRvd24gdGhlIGNvbnRlbnRzIG9mIHRoZSBudW1iZXJlZCByZWdpc3RlcnMgYW5kIHB1dCB0aGVcbiAgICAgICAgICAgICAgICAvLyBkZWxldGVkIHRleHQgaW50byByZWdpc3RlciAxLlxuICAgICAgICAgICAgICAgIHRoaXMuc2hpZnROdW1lcmljUmVnaXN0ZXJzXygpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJzWycxJ10gPSBuZXcgUmVnaXN0ZXIodGV4dCwgbGluZXdpc2UpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIHVubmFtZWQgcmVnaXN0ZXIgaXMgc2V0IHRvIHdoYXQganVzdCBoYXBwZW5lZFxuICAgICAgICAgIHRoaXMudW5uYW1lZFJlZ2lzdGVyLnNldFRleHQodGV4dCwgbGluZXdpc2UsIGJsb2Nrd2lzZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgd2UndmUgZ290dGVuIHRvIHRoaXMgcG9pbnQsIHdlJ3ZlIGFjdHVhbGx5IHNwZWNpZmllZCBhIHJlZ2lzdGVyXG4gICAgICAgIHZhciBhcHBlbmQgPSBpc1VwcGVyQ2FzZShyZWdpc3Rlck5hbWUpO1xuICAgICAgICBpZiAoYXBwZW5kKSB7XG4gICAgICAgICAgcmVnaXN0ZXIucHVzaFRleHQodGV4dCwgbGluZXdpc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlZ2lzdGVyLnNldFRleHQodGV4dCwgbGluZXdpc2UsIGJsb2Nrd2lzZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVGhlIHVubmFtZWQgcmVnaXN0ZXIgYWx3YXlzIGhhcyB0aGUgc2FtZSB2YWx1ZSBhcyB0aGUgbGFzdCB1c2VkXG4gICAgICAgIC8vIHJlZ2lzdGVyLlxuICAgICAgICB0aGlzLnVubmFtZWRSZWdpc3Rlci5zZXRUZXh0KHJlZ2lzdGVyLnRvU3RyaW5nKCksIGxpbmV3aXNlKTtcbiAgICAgIH0sXG4gICAgICAvLyBHZXRzIHRoZSByZWdpc3RlciBuYW1lZCBAbmFtZS4gIElmIG9uZSBvZiBAbmFtZSBkb2Vzbid0IGFscmVhZHkgZXhpc3QsXG4gICAgICAvLyBjcmVhdGUgaXQuICBJZiBAbmFtZSBpcyBpbnZhbGlkLCByZXR1cm4gdGhlIHVubmFtZWRSZWdpc3Rlci5cbiAgICAgIGdldFJlZ2lzdGVyOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkUmVnaXN0ZXIobmFtZSkpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy51bm5hbWVkUmVnaXN0ZXI7XG4gICAgICAgIH1cbiAgICAgICAgbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKCF0aGlzLnJlZ2lzdGVyc1tuYW1lXSkge1xuICAgICAgICAgIHRoaXMucmVnaXN0ZXJzW25hbWVdID0gbmV3IFJlZ2lzdGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucmVnaXN0ZXJzW25hbWVdO1xuICAgICAgfSxcbiAgICAgIGlzVmFsaWRSZWdpc3RlcjogZnVuY3Rpb24obmFtZSkge1xuICAgICAgICByZXR1cm4gbmFtZSAmJiBpbkFycmF5KG5hbWUsIHZhbGlkUmVnaXN0ZXJzKTtcbiAgICAgIH0sXG4gICAgICBzaGlmdE51bWVyaWNSZWdpc3RlcnNfOiBmdW5jdGlvbigpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDk7IGkgPj0gMjsgaS0tKSB7XG4gICAgICAgICAgdGhpcy5yZWdpc3RlcnNbaV0gPSB0aGlzLmdldFJlZ2lzdGVyKCcnICsgKGkgLSAxKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIGZ1bmN0aW9uIEhpc3RvcnlDb250cm9sbGVyKCkge1xuICAgICAgICB0aGlzLmhpc3RvcnlCdWZmZXIgPSBbXTtcbiAgICAgICAgdGhpcy5pdGVyYXRvciA9IDA7XG4gICAgICAgIHRoaXMuaW5pdGlhbFByZWZpeCA9IG51bGw7XG4gICAgfVxuICAgIEhpc3RvcnlDb250cm9sbGVyLnByb3RvdHlwZSA9IHtcbiAgICAgIC8vIHRoZSBpbnB1dCBhcmd1bWVudCBoZXJlIGFjdHMgYSB1c2VyIGVudGVyZWQgcHJlZml4IGZvciBhIHNtYWxsIHRpbWVcbiAgICAgIC8vIHVudGlsIHdlIHN0YXJ0IGF1dG9jb21wbGV0aW9uIGluIHdoaWNoIGNhc2UgaXQgaXMgdGhlIGF1dG9jb21wbGV0ZWQuXG4gICAgICBuZXh0TWF0Y2g6IGZ1bmN0aW9uIChpbnB1dCwgdXApIHtcbiAgICAgICAgdmFyIGhpc3RvcnlCdWZmZXIgPSB0aGlzLmhpc3RvcnlCdWZmZXI7XG4gICAgICAgIHZhciBkaXIgPSB1cCA/IC0xIDogMTtcbiAgICAgICAgaWYgKHRoaXMuaW5pdGlhbFByZWZpeCA9PT0gbnVsbCkgdGhpcy5pbml0aWFsUHJlZml4ID0gaW5wdXQ7XG4gICAgICAgIGZvciAodmFyIGkgPSB0aGlzLml0ZXJhdG9yICsgZGlyOyB1cCA/IGkgPj0gMCA6IGkgPCBoaXN0b3J5QnVmZmVyLmxlbmd0aDsgaSs9IGRpcikge1xuICAgICAgICAgIHZhciBlbGVtZW50ID0gaGlzdG9yeUJ1ZmZlcltpXTtcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8PSBlbGVtZW50Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbml0aWFsUHJlZml4ID09IGVsZW1lbnQuc3Vic3RyaW5nKDAsIGopKSB7XG4gICAgICAgICAgICAgIHRoaXMuaXRlcmF0b3IgPSBpO1xuICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2hvdWxkIHJldHVybiB0aGUgdXNlciBpbnB1dCBpbiBjYXNlIHdlIHJlYWNoIHRoZSBlbmQgb2YgYnVmZmVyLlxuICAgICAgICBpZiAoaSA+PSBoaXN0b3J5QnVmZmVyLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMuaXRlcmF0b3IgPSBoaXN0b3J5QnVmZmVyLmxlbmd0aDtcbiAgICAgICAgICByZXR1cm4gdGhpcy5pbml0aWFsUHJlZml4O1xuICAgICAgICB9XG4gICAgICAgIC8vIHJldHVybiB0aGUgbGFzdCBhdXRvY29tcGxldGVkIHF1ZXJ5IG9yIGV4Q29tbWFuZCBhcyBpdCBpcy5cbiAgICAgICAgaWYgKGkgPCAwICkgcmV0dXJuIGlucHV0O1xuICAgICAgfSxcbiAgICAgIHB1c2hJbnB1dDogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5oaXN0b3J5QnVmZmVyLmluZGV4T2YoaW5wdXQpO1xuICAgICAgICBpZiAoaW5kZXggPiAtMSkgdGhpcy5oaXN0b3J5QnVmZmVyLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIGlmIChpbnB1dC5sZW5ndGgpIHRoaXMuaGlzdG9yeUJ1ZmZlci5wdXNoKGlucHV0KTtcbiAgICAgIH0sXG4gICAgICByZXNldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbFByZWZpeCA9IG51bGw7XG4gICAgICAgIHRoaXMuaXRlcmF0b3IgPSB0aGlzLmhpc3RvcnlCdWZmZXIubGVuZ3RoO1xuICAgICAgfVxuICAgIH07XG4gICAgdmFyIGNvbW1hbmREaXNwYXRjaGVyID0ge1xuICAgICAgbWF0Y2hDb21tYW5kOiBmdW5jdGlvbihrZXlzLCBrZXlNYXAsIGlucHV0U3RhdGUsIGNvbnRleHQpIHtcbiAgICAgICAgdmFyIG1hdGNoZXMgPSBjb21tYW5kTWF0Y2hlcyhrZXlzLCBrZXlNYXAsIGNvbnRleHQsIGlucHV0U3RhdGUpO1xuICAgICAgICBpZiAoIW1hdGNoZXMuZnVsbCAmJiAhbWF0Y2hlcy5wYXJ0aWFsKSB7XG4gICAgICAgICAgcmV0dXJuIHt0eXBlOiAnbm9uZSd9O1xuICAgICAgICB9IGVsc2UgaWYgKCFtYXRjaGVzLmZ1bGwgJiYgbWF0Y2hlcy5wYXJ0aWFsKSB7XG4gICAgICAgICAgcmV0dXJuIHt0eXBlOiAncGFydGlhbCd9O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGJlc3RNYXRjaDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXRjaGVzLmZ1bGwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgbWF0Y2ggPSBtYXRjaGVzLmZ1bGxbaV07XG4gICAgICAgICAgaWYgKCFiZXN0TWF0Y2gpIHtcbiAgICAgICAgICAgIGJlc3RNYXRjaCA9IG1hdGNoO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoYmVzdE1hdGNoLmtleXMuc2xpY2UoLTExKSA9PSAnPGNoYXJhY3Rlcj4nKSB7XG4gICAgICAgICAgdmFyIGNoYXJhY3RlciA9IGxhc3RDaGFyKGtleXMpO1xuICAgICAgICAgIGlmICghY2hhcmFjdGVyKSByZXR1cm4ge3R5cGU6ICdub25lJ307XG4gICAgICAgICAgaW5wdXRTdGF0ZS5zZWxlY3RlZENoYXJhY3RlciA9IGNoYXJhY3RlcjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge3R5cGU6ICdmdWxsJywgY29tbWFuZDogYmVzdE1hdGNofTtcbiAgICAgIH0sXG4gICAgICBwcm9jZXNzQ29tbWFuZDogZnVuY3Rpb24oY20sIHZpbSwgY29tbWFuZCkge1xuICAgICAgICB2aW0uaW5wdXRTdGF0ZS5yZXBlYXRPdmVycmlkZSA9IGNvbW1hbmQucmVwZWF0T3ZlcnJpZGU7XG4gICAgICAgIHN3aXRjaCAoY29tbWFuZC50eXBlKSB7XG4gICAgICAgICAgY2FzZSAnbW90aW9uJzpcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc01vdGlvbihjbSwgdmltLCBjb21tYW5kKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ29wZXJhdG9yJzpcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc09wZXJhdG9yKGNtLCB2aW0sIGNvbW1hbmQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnb3BlcmF0b3JNb3Rpb24nOlxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzT3BlcmF0b3JNb3Rpb24oY20sIHZpbSwgY29tbWFuZCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdhY3Rpb24nOlxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzQWN0aW9uKGNtLCB2aW0sIGNvbW1hbmQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnc2VhcmNoJzpcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc1NlYXJjaChjbSwgdmltLCBjb21tYW5kKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2V4JzpcbiAgICAgICAgICBjYXNlICdrZXlUb0V4JzpcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0V4KGNtLCB2aW0sIGNvbW1hbmQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcHJvY2Vzc01vdGlvbjogZnVuY3Rpb24oY20sIHZpbSwgY29tbWFuZCkge1xuICAgICAgICB2aW0uaW5wdXRTdGF0ZS5tb3Rpb24gPSBjb21tYW5kLm1vdGlvbjtcbiAgICAgICAgdmltLmlucHV0U3RhdGUubW90aW9uQXJncyA9IGNvcHlBcmdzKGNvbW1hbmQubW90aW9uQXJncyk7XG4gICAgICAgIHRoaXMuZXZhbElucHV0KGNtLCB2aW0pO1xuICAgICAgfSxcbiAgICAgIHByb2Nlc3NPcGVyYXRvcjogZnVuY3Rpb24oY20sIHZpbSwgY29tbWFuZCkge1xuICAgICAgICB2YXIgaW5wdXRTdGF0ZSA9IHZpbS5pbnB1dFN0YXRlO1xuICAgICAgICBpZiAoaW5wdXRTdGF0ZS5vcGVyYXRvcikge1xuICAgICAgICAgIGlmIChpbnB1dFN0YXRlLm9wZXJhdG9yID09IGNvbW1hbmQub3BlcmF0b3IpIHtcbiAgICAgICAgICAgIC8vIFR5cGluZyBhbiBvcGVyYXRvciB0d2ljZSBsaWtlICdkZCcgbWFrZXMgdGhlIG9wZXJhdG9yIG9wZXJhdGVcbiAgICAgICAgICAgIC8vIGxpbmV3aXNlXG4gICAgICAgICAgICBpbnB1dFN0YXRlLm1vdGlvbiA9ICdleHBhbmRUb0xpbmUnO1xuICAgICAgICAgICAgaW5wdXRTdGF0ZS5tb3Rpb25BcmdzID0geyBsaW5ld2lzZTogdHJ1ZSB9O1xuICAgICAgICAgICAgdGhpcy5ldmFsSW5wdXQoY20sIHZpbSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIDIgZGlmZmVyZW50IG9wZXJhdG9ycyBpbiBhIHJvdyBkb2Vzbid0IG1ha2Ugc2Vuc2UuXG4gICAgICAgICAgICBjbGVhcklucHV0U3RhdGUoY20pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpbnB1dFN0YXRlLm9wZXJhdG9yID0gY29tbWFuZC5vcGVyYXRvcjtcbiAgICAgICAgaW5wdXRTdGF0ZS5vcGVyYXRvckFyZ3MgPSBjb3B5QXJncyhjb21tYW5kLm9wZXJhdG9yQXJncyk7XG4gICAgICAgIGlmIChjb21tYW5kLmV4aXRWaXN1YWxCbG9jaykge1xuICAgICAgICAgICAgdmltLnZpc3VhbEJsb2NrID0gZmFsc2U7XG4gICAgICAgICAgICB1cGRhdGVDbVNlbGVjdGlvbihjbSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgICAgLy8gT3BlcmF0aW5nIG9uIGEgc2VsZWN0aW9uIGluIHZpc3VhbCBtb2RlLiBXZSBkb24ndCBuZWVkIGEgbW90aW9uLlxuICAgICAgICAgIHRoaXMuZXZhbElucHV0KGNtLCB2aW0pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcHJvY2Vzc09wZXJhdG9yTW90aW9uOiBmdW5jdGlvbihjbSwgdmltLCBjb21tYW5kKSB7XG4gICAgICAgIHZhciB2aXN1YWxNb2RlID0gdmltLnZpc3VhbE1vZGU7XG4gICAgICAgIHZhciBvcGVyYXRvck1vdGlvbkFyZ3MgPSBjb3B5QXJncyhjb21tYW5kLm9wZXJhdG9yTW90aW9uQXJncyk7XG4gICAgICAgIGlmIChvcGVyYXRvck1vdGlvbkFyZ3MpIHtcbiAgICAgICAgICAvLyBPcGVyYXRvciBtb3Rpb25zIG1heSBoYXZlIHNwZWNpYWwgYmVoYXZpb3IgaW4gdmlzdWFsIG1vZGUuXG4gICAgICAgICAgaWYgKHZpc3VhbE1vZGUgJiYgb3BlcmF0b3JNb3Rpb25BcmdzLnZpc3VhbExpbmUpIHtcbiAgICAgICAgICAgIHZpbS52aXN1YWxMaW5lID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcm9jZXNzT3BlcmF0b3IoY20sIHZpbSwgY29tbWFuZCk7XG4gICAgICAgIGlmICghdmlzdWFsTW9kZSkge1xuICAgICAgICAgIHRoaXMucHJvY2Vzc01vdGlvbihjbSwgdmltLCBjb21tYW5kKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHByb2Nlc3NBY3Rpb246IGZ1bmN0aW9uKGNtLCB2aW0sIGNvbW1hbmQpIHtcbiAgICAgICAgdmFyIGlucHV0U3RhdGUgPSB2aW0uaW5wdXRTdGF0ZTtcbiAgICAgICAgdmFyIHJlcGVhdCA9IGlucHV0U3RhdGUuZ2V0UmVwZWF0KCk7XG4gICAgICAgIHZhciByZXBlYXRJc0V4cGxpY2l0ID0gISFyZXBlYXQ7XG4gICAgICAgIHZhciBhY3Rpb25BcmdzID0gY29weUFyZ3MoY29tbWFuZC5hY3Rpb25BcmdzKSB8fCB7fTtcbiAgICAgICAgaWYgKGlucHV0U3RhdGUuc2VsZWN0ZWRDaGFyYWN0ZXIpIHtcbiAgICAgICAgICBhY3Rpb25BcmdzLnNlbGVjdGVkQ2hhcmFjdGVyID0gaW5wdXRTdGF0ZS5zZWxlY3RlZENoYXJhY3RlcjtcbiAgICAgICAgfVxuICAgICAgICAvLyBBY3Rpb25zIG1heSBvciBtYXkgbm90IGhhdmUgbW90aW9ucyBhbmQgb3BlcmF0b3JzLiBEbyB0aGVzZSBmaXJzdC5cbiAgICAgICAgaWYgKGNvbW1hbmQub3BlcmF0b3IpIHtcbiAgICAgICAgICB0aGlzLnByb2Nlc3NPcGVyYXRvcihjbSwgdmltLCBjb21tYW5kKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29tbWFuZC5tb3Rpb24pIHtcbiAgICAgICAgICB0aGlzLnByb2Nlc3NNb3Rpb24oY20sIHZpbSwgY29tbWFuZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbW1hbmQubW90aW9uIHx8IGNvbW1hbmQub3BlcmF0b3IpIHtcbiAgICAgICAgICB0aGlzLmV2YWxJbnB1dChjbSwgdmltKTtcbiAgICAgICAgfVxuICAgICAgICBhY3Rpb25BcmdzLnJlcGVhdCA9IHJlcGVhdCB8fCAxO1xuICAgICAgICBhY3Rpb25BcmdzLnJlcGVhdElzRXhwbGljaXQgPSByZXBlYXRJc0V4cGxpY2l0O1xuICAgICAgICBhY3Rpb25BcmdzLnJlZ2lzdGVyTmFtZSA9IGlucHV0U3RhdGUucmVnaXN0ZXJOYW1lO1xuICAgICAgICBjbGVhcklucHV0U3RhdGUoY20pO1xuICAgICAgICB2aW0ubGFzdE1vdGlvbiA9IG51bGw7XG4gICAgICAgIGlmIChjb21tYW5kLmlzRWRpdCkge1xuICAgICAgICAgIHRoaXMucmVjb3JkTGFzdEVkaXQodmltLCBpbnB1dFN0YXRlLCBjb21tYW5kKTtcbiAgICAgICAgfVxuICAgICAgICBhY3Rpb25zW2NvbW1hbmQuYWN0aW9uXShjbSwgYWN0aW9uQXJncywgdmltKTtcbiAgICAgIH0sXG4gICAgICBwcm9jZXNzU2VhcmNoOiBmdW5jdGlvbihjbSwgdmltLCBjb21tYW5kKSB7XG4gICAgICAgIGlmICghY20uZ2V0U2VhcmNoQ3Vyc29yKSB7XG4gICAgICAgICAgLy8gU2VhcmNoIGRlcGVuZHMgb24gU2VhcmNoQ3Vyc29yLlxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZm9yd2FyZCA9IGNvbW1hbmQuc2VhcmNoQXJncy5mb3J3YXJkO1xuICAgICAgICB2YXIgd2hvbGVXb3JkT25seSA9IGNvbW1hbmQuc2VhcmNoQXJncy53aG9sZVdvcmRPbmx5O1xuICAgICAgICBnZXRTZWFyY2hTdGF0ZShjbSkuc2V0UmV2ZXJzZWQoIWZvcndhcmQpO1xuICAgICAgICB2YXIgcHJvbXB0UHJlZml4ID0gKGZvcndhcmQpID8gJy8nIDogJz8nO1xuICAgICAgICB2YXIgb3JpZ2luYWxRdWVyeSA9IGdldFNlYXJjaFN0YXRlKGNtKS5nZXRRdWVyeSgpO1xuICAgICAgICB2YXIgb3JpZ2luYWxTY3JvbGxQb3MgPSBjbS5nZXRTY3JvbGxJbmZvKCk7XG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVF1ZXJ5KHF1ZXJ5LCBpZ25vcmVDYXNlLCBzbWFydENhc2UpIHtcbiAgICAgICAgICB2aW1HbG9iYWxTdGF0ZS5zZWFyY2hIaXN0b3J5Q29udHJvbGxlci5wdXNoSW5wdXQocXVlcnkpO1xuICAgICAgICAgIHZpbUdsb2JhbFN0YXRlLnNlYXJjaEhpc3RvcnlDb250cm9sbGVyLnJlc2V0KCk7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHVwZGF0ZVNlYXJjaFF1ZXJ5KGNtLCBxdWVyeSwgaWdub3JlQ2FzZSwgc21hcnRDYXNlKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBzaG93Q29uZmlybShjbSwgJ0ludmFsaWQgcmVnZXg6ICcgKyBxdWVyeSk7XG4gICAgICAgICAgICBjbGVhcklucHV0U3RhdGUoY20pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb21tYW5kRGlzcGF0Y2hlci5wcm9jZXNzTW90aW9uKGNtLCB2aW0sIHtcbiAgICAgICAgICAgIHR5cGU6ICdtb3Rpb24nLFxuICAgICAgICAgICAgbW90aW9uOiAnZmluZE5leHQnLFxuICAgICAgICAgICAgbW90aW9uQXJnczogeyBmb3J3YXJkOiB0cnVlLCB0b0p1bXBsaXN0OiBjb21tYW5kLnNlYXJjaEFyZ3MudG9KdW1wbGlzdCB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gb25Qcm9tcHRDbG9zZShxdWVyeSkge1xuICAgICAgICAgIGNtLnNjcm9sbFRvKG9yaWdpbmFsU2Nyb2xsUG9zLmxlZnQsIG9yaWdpbmFsU2Nyb2xsUG9zLnRvcCk7XG4gICAgICAgICAgaGFuZGxlUXVlcnkocXVlcnksIHRydWUgLyoqIGlnbm9yZUNhc2UgKi8sIHRydWUgLyoqIHNtYXJ0Q2FzZSAqLyk7XG4gICAgICAgICAgdmFyIG1hY3JvTW9kZVN0YXRlID0gdmltR2xvYmFsU3RhdGUubWFjcm9Nb2RlU3RhdGU7XG4gICAgICAgICAgaWYgKG1hY3JvTW9kZVN0YXRlLmlzUmVjb3JkaW5nKSB7XG4gICAgICAgICAgICBsb2dTZWFyY2hRdWVyeShtYWNyb01vZGVTdGF0ZSwgcXVlcnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBvblByb21wdEtleVVwKGUsIHF1ZXJ5LCBjbG9zZSkge1xuICAgICAgICAgIHZhciBrZXlOYW1lID0gQ29kZU1pcnJvci5rZXlOYW1lKGUpLCB1cCwgb2Zmc2V0O1xuICAgICAgICAgIGlmIChrZXlOYW1lID09ICdVcCcgfHwga2V5TmFtZSA9PSAnRG93bicpIHtcbiAgICAgICAgICAgIHVwID0ga2V5TmFtZSA9PSAnVXAnID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgb2Zmc2V0ID0gZS50YXJnZXQgPyBlLnRhcmdldC5zZWxlY3Rpb25FbmQgOiAwO1xuICAgICAgICAgICAgcXVlcnkgPSB2aW1HbG9iYWxTdGF0ZS5zZWFyY2hIaXN0b3J5Q29udHJvbGxlci5uZXh0TWF0Y2gocXVlcnksIHVwKSB8fCAnJztcbiAgICAgICAgICAgIGNsb3NlKHF1ZXJ5KTtcbiAgICAgICAgICAgIGlmIChvZmZzZXQgJiYgZS50YXJnZXQpIGUudGFyZ2V0LnNlbGVjdGlvbkVuZCA9IGUudGFyZ2V0LnNlbGVjdGlvblN0YXJ0ID0gTWF0aC5taW4ob2Zmc2V0LCBlLnRhcmdldC52YWx1ZS5sZW5ndGgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIGtleU5hbWUgIT0gJ0xlZnQnICYmIGtleU5hbWUgIT0gJ1JpZ2h0JyAmJiBrZXlOYW1lICE9ICdDdHJsJyAmJiBrZXlOYW1lICE9ICdBbHQnICYmIGtleU5hbWUgIT0gJ1NoaWZ0JylcbiAgICAgICAgICAgICAgdmltR2xvYmFsU3RhdGUuc2VhcmNoSGlzdG9yeUNvbnRyb2xsZXIucmVzZXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHBhcnNlZFF1ZXJ5O1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBwYXJzZWRRdWVyeSA9IHVwZGF0ZVNlYXJjaFF1ZXJ5KGNtLCBxdWVyeSxcbiAgICAgICAgICAgICAgICB0cnVlIC8qKiBpZ25vcmVDYXNlICovLCB0cnVlIC8qKiBzbWFydENhc2UgKi8pO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8vIFN3YWxsb3cgYmFkIHJlZ2V4ZXMgZm9yIGluY3JlbWVudGFsIHNlYXJjaC5cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHBhcnNlZFF1ZXJ5KSB7XG4gICAgICAgICAgICBjbS5zY3JvbGxJbnRvVmlldyhmaW5kTmV4dChjbSwgIWZvcndhcmQsIHBhcnNlZFF1ZXJ5KSwgMzApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjbGVhclNlYXJjaEhpZ2hsaWdodChjbSk7XG4gICAgICAgICAgICBjbS5zY3JvbGxUbyhvcmlnaW5hbFNjcm9sbFBvcy5sZWZ0LCBvcmlnaW5hbFNjcm9sbFBvcy50b3ApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBvblByb21wdEtleURvd24oZSwgcXVlcnksIGNsb3NlKSB7XG4gICAgICAgICAgdmFyIGtleU5hbWUgPSBDb2RlTWlycm9yLmtleU5hbWUoZSk7XG4gICAgICAgICAgaWYgKGtleU5hbWUgPT0gJ0VzYycgfHwga2V5TmFtZSA9PSAnQ3RybC1DJyB8fCBrZXlOYW1lID09ICdDdHJsLVsnIHx8XG4gICAgICAgICAgICAgIChrZXlOYW1lID09ICdCYWNrc3BhY2UnICYmIHF1ZXJ5ID09ICcnKSkge1xuICAgICAgICAgICAgdmltR2xvYmFsU3RhdGUuc2VhcmNoSGlzdG9yeUNvbnRyb2xsZXIucHVzaElucHV0KHF1ZXJ5KTtcbiAgICAgICAgICAgIHZpbUdsb2JhbFN0YXRlLnNlYXJjaEhpc3RvcnlDb250cm9sbGVyLnJlc2V0KCk7XG4gICAgICAgICAgICB1cGRhdGVTZWFyY2hRdWVyeShjbSwgb3JpZ2luYWxRdWVyeSk7XG4gICAgICAgICAgICBjbGVhclNlYXJjaEhpZ2hsaWdodChjbSk7XG4gICAgICAgICAgICBjbS5zY3JvbGxUbyhvcmlnaW5hbFNjcm9sbFBvcy5sZWZ0LCBvcmlnaW5hbFNjcm9sbFBvcy50b3ApO1xuICAgICAgICAgICAgQ29kZU1pcnJvci5lX3N0b3AoZSk7XG4gICAgICAgICAgICBjbGVhcklucHV0U3RhdGUoY20pO1xuICAgICAgICAgICAgY2xvc2UoKTtcbiAgICAgICAgICAgIGNtLmZvY3VzKCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChrZXlOYW1lID09ICdVcCcgfHwga2V5TmFtZSA9PSAnRG93bicpIHtcbiAgICAgICAgICAgIENvZGVNaXJyb3IuZV9zdG9wKGUpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoa2V5TmFtZSA9PSAnQ3RybC1VJykge1xuICAgICAgICAgICAgLy8gQ3RybC1VIGNsZWFycyBpbnB1dC5cbiAgICAgICAgICAgIENvZGVNaXJyb3IuZV9zdG9wKGUpO1xuICAgICAgICAgICAgY2xvc2UoJycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKGNvbW1hbmQuc2VhcmNoQXJncy5xdWVyeVNyYykge1xuICAgICAgICAgIGNhc2UgJ3Byb21wdCc6XG4gICAgICAgICAgICB2YXIgbWFjcm9Nb2RlU3RhdGUgPSB2aW1HbG9iYWxTdGF0ZS5tYWNyb01vZGVTdGF0ZTtcbiAgICAgICAgICAgIGlmIChtYWNyb01vZGVTdGF0ZS5pc1BsYXlpbmcpIHtcbiAgICAgICAgICAgICAgdmFyIHF1ZXJ5ID0gbWFjcm9Nb2RlU3RhdGUucmVwbGF5U2VhcmNoUXVlcmllcy5zaGlmdCgpO1xuICAgICAgICAgICAgICBoYW5kbGVRdWVyeShxdWVyeSwgdHJ1ZSAvKiogaWdub3JlQ2FzZSAqLywgZmFsc2UgLyoqIHNtYXJ0Q2FzZSAqLyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzaG93UHJvbXB0KGNtLCB7XG4gICAgICAgICAgICAgICAgICBvbkNsb3NlOiBvblByb21wdENsb3NlLFxuICAgICAgICAgICAgICAgICAgcHJlZml4OiBwcm9tcHRQcmVmaXgsXG4gICAgICAgICAgICAgICAgICBkZXNjOiBzZWFyY2hQcm9tcHREZXNjLFxuICAgICAgICAgICAgICAgICAgb25LZXlVcDogb25Qcm9tcHRLZXlVcCxcbiAgICAgICAgICAgICAgICAgIG9uS2V5RG93bjogb25Qcm9tcHRLZXlEb3duXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnd29yZFVuZGVyQ3Vyc29yJzpcbiAgICAgICAgICAgIHZhciB3b3JkID0gZXhwYW5kV29yZFVuZGVyQ3Vyc29yKGNtLCBmYWxzZSAvKiogaW5jbHVzaXZlICovLFxuICAgICAgICAgICAgICAgIHRydWUgLyoqIGZvcndhcmQgKi8sIGZhbHNlIC8qKiBiaWdXb3JkICovLFxuICAgICAgICAgICAgICAgIHRydWUgLyoqIG5vU3ltYm9sICovKTtcbiAgICAgICAgICAgIHZhciBpc0tleXdvcmQgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKCF3b3JkKSB7XG4gICAgICAgICAgICAgIHdvcmQgPSBleHBhbmRXb3JkVW5kZXJDdXJzb3IoY20sIGZhbHNlIC8qKiBpbmNsdXNpdmUgKi8sXG4gICAgICAgICAgICAgICAgICB0cnVlIC8qKiBmb3J3YXJkICovLCBmYWxzZSAvKiogYmlnV29yZCAqLyxcbiAgICAgICAgICAgICAgICAgIGZhbHNlIC8qKiBub1N5bWJvbCAqLyk7XG4gICAgICAgICAgICAgIGlzS2V5d29yZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF3b3JkKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBxdWVyeSA9IGNtLmdldExpbmUod29yZC5zdGFydC5saW5lKS5zdWJzdHJpbmcod29yZC5zdGFydC5jaCxcbiAgICAgICAgICAgICAgICB3b3JkLmVuZC5jaCk7XG4gICAgICAgICAgICBpZiAoaXNLZXl3b3JkICYmIHdob2xlV29yZE9ubHkpIHtcbiAgICAgICAgICAgICAgICBxdWVyeSA9ICdcXFxcYicgKyBxdWVyeSArICdcXFxcYic7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBxdWVyeSA9IGVzY2FwZVJlZ2V4KHF1ZXJ5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY2FjaGVkQ3Vyc29yIGlzIHVzZWQgdG8gc2F2ZSB0aGUgb2xkIHBvc2l0aW9uIG9mIHRoZSBjdXJzb3JcbiAgICAgICAgICAgIC8vIHdoZW4gKiBvciAjIGNhdXNlcyB2aW0gdG8gc2VlayBmb3IgdGhlIG5lYXJlc3Qgd29yZCBhbmQgc2hpZnRcbiAgICAgICAgICAgIC8vIHRoZSBjdXJzb3IgYmVmb3JlIGVudGVyaW5nIHRoZSBtb3Rpb24uXG4gICAgICAgICAgICB2aW1HbG9iYWxTdGF0ZS5qdW1wTGlzdC5jYWNoZWRDdXJzb3IgPSBjbS5nZXRDdXJzb3IoKTtcbiAgICAgICAgICAgIGNtLnNldEN1cnNvcih3b3JkLnN0YXJ0KTtcblxuICAgICAgICAgICAgaGFuZGxlUXVlcnkocXVlcnksIHRydWUgLyoqIGlnbm9yZUNhc2UgKi8sIGZhbHNlIC8qKiBzbWFydENhc2UgKi8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBwcm9jZXNzRXg6IGZ1bmN0aW9uKGNtLCB2aW0sIGNvbW1hbmQpIHtcbiAgICAgICAgZnVuY3Rpb24gb25Qcm9tcHRDbG9zZShpbnB1dCkge1xuICAgICAgICAgIC8vIEdpdmUgdGhlIHByb21wdCBzb21lIHRpbWUgdG8gY2xvc2Ugc28gdGhhdCBpZiBwcm9jZXNzQ29tbWFuZCBzaG93c1xuICAgICAgICAgIC8vIGFuIGVycm9yLCB0aGUgZWxlbWVudHMgZG9uJ3Qgb3ZlcmxhcC5cbiAgICAgICAgICB2aW1HbG9iYWxTdGF0ZS5leENvbW1hbmRIaXN0b3J5Q29udHJvbGxlci5wdXNoSW5wdXQoaW5wdXQpO1xuICAgICAgICAgIHZpbUdsb2JhbFN0YXRlLmV4Q29tbWFuZEhpc3RvcnlDb250cm9sbGVyLnJlc2V0KCk7XG4gICAgICAgICAgZXhDb21tYW5kRGlzcGF0Y2hlci5wcm9jZXNzQ29tbWFuZChjbSwgaW5wdXQpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG9uUHJvbXB0S2V5RG93bihlLCBpbnB1dCwgY2xvc2UpIHtcbiAgICAgICAgICB2YXIga2V5TmFtZSA9IENvZGVNaXJyb3Iua2V5TmFtZShlKSwgdXAsIG9mZnNldDtcbiAgICAgICAgICBpZiAoa2V5TmFtZSA9PSAnRXNjJyB8fCBrZXlOYW1lID09ICdDdHJsLUMnIHx8IGtleU5hbWUgPT0gJ0N0cmwtWycgfHxcbiAgICAgICAgICAgICAgKGtleU5hbWUgPT0gJ0JhY2tzcGFjZScgJiYgaW5wdXQgPT0gJycpKSB7XG4gICAgICAgICAgICB2aW1HbG9iYWxTdGF0ZS5leENvbW1hbmRIaXN0b3J5Q29udHJvbGxlci5wdXNoSW5wdXQoaW5wdXQpO1xuICAgICAgICAgICAgdmltR2xvYmFsU3RhdGUuZXhDb21tYW5kSGlzdG9yeUNvbnRyb2xsZXIucmVzZXQoKTtcbiAgICAgICAgICAgIENvZGVNaXJyb3IuZV9zdG9wKGUpO1xuICAgICAgICAgICAgY2xlYXJJbnB1dFN0YXRlKGNtKTtcbiAgICAgICAgICAgIGNsb3NlKCk7XG4gICAgICAgICAgICBjbS5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoa2V5TmFtZSA9PSAnVXAnIHx8IGtleU5hbWUgPT0gJ0Rvd24nKSB7XG4gICAgICAgICAgICBDb2RlTWlycm9yLmVfc3RvcChlKTtcbiAgICAgICAgICAgIHVwID0ga2V5TmFtZSA9PSAnVXAnID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgb2Zmc2V0ID0gZS50YXJnZXQgPyBlLnRhcmdldC5zZWxlY3Rpb25FbmQgOiAwO1xuICAgICAgICAgICAgaW5wdXQgPSB2aW1HbG9iYWxTdGF0ZS5leENvbW1hbmRIaXN0b3J5Q29udHJvbGxlci5uZXh0TWF0Y2goaW5wdXQsIHVwKSB8fCAnJztcbiAgICAgICAgICAgIGNsb3NlKGlucHV0KTtcbiAgICAgICAgICAgIGlmIChvZmZzZXQgJiYgZS50YXJnZXQpIGUudGFyZ2V0LnNlbGVjdGlvbkVuZCA9IGUudGFyZ2V0LnNlbGVjdGlvblN0YXJ0ID0gTWF0aC5taW4ob2Zmc2V0LCBlLnRhcmdldC52YWx1ZS5sZW5ndGgpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoa2V5TmFtZSA9PSAnQ3RybC1VJykge1xuICAgICAgICAgICAgLy8gQ3RybC1VIGNsZWFycyBpbnB1dC5cbiAgICAgICAgICAgIENvZGVNaXJyb3IuZV9zdG9wKGUpO1xuICAgICAgICAgICAgY2xvc2UoJycpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIGtleU5hbWUgIT0gJ0xlZnQnICYmIGtleU5hbWUgIT0gJ1JpZ2h0JyAmJiBrZXlOYW1lICE9ICdDdHJsJyAmJiBrZXlOYW1lICE9ICdBbHQnICYmIGtleU5hbWUgIT0gJ1NoaWZ0JylcbiAgICAgICAgICAgICAgdmltR2xvYmFsU3RhdGUuZXhDb21tYW5kSGlzdG9yeUNvbnRyb2xsZXIucmVzZXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbW1hbmQudHlwZSA9PSAna2V5VG9FeCcpIHtcbiAgICAgICAgICAvLyBIYW5kbGUgdXNlciBkZWZpbmVkIEV4IHRvIEV4IG1hcHBpbmdzXG4gICAgICAgICAgZXhDb21tYW5kRGlzcGF0Y2hlci5wcm9jZXNzQ29tbWFuZChjbSwgY29tbWFuZC5leEFyZ3MuaW5wdXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh2aW0udmlzdWFsTW9kZSkge1xuICAgICAgICAgICAgc2hvd1Byb21wdChjbSwgeyBvbkNsb3NlOiBvblByb21wdENsb3NlLCBwcmVmaXg6ICc6JywgdmFsdWU6ICdcXCc8LFxcJz4nLFxuICAgICAgICAgICAgICAgIG9uS2V5RG93bjogb25Qcm9tcHRLZXlEb3duLCBzZWxlY3RWYWx1ZU9uT3BlbjogZmFsc2V9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2hvd1Byb21wdChjbSwgeyBvbkNsb3NlOiBvblByb21wdENsb3NlLCBwcmVmaXg6ICc6JyxcbiAgICAgICAgICAgICAgICBvbktleURvd246IG9uUHJvbXB0S2V5RG93bn0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGV2YWxJbnB1dDogZnVuY3Rpb24oY20sIHZpbSkge1xuICAgICAgICAvLyBJZiB0aGUgbW90aW9uIGNvbW1hbmQgaXMgc2V0LCBleGVjdXRlIGJvdGggdGhlIG9wZXJhdG9yIGFuZCBtb3Rpb24uXG4gICAgICAgIC8vIE90aGVyd2lzZSByZXR1cm4uXG4gICAgICAgIHZhciBpbnB1dFN0YXRlID0gdmltLmlucHV0U3RhdGU7XG4gICAgICAgIHZhciBtb3Rpb24gPSBpbnB1dFN0YXRlLm1vdGlvbjtcbiAgICAgICAgdmFyIG1vdGlvbkFyZ3MgPSBpbnB1dFN0YXRlLm1vdGlvbkFyZ3MgfHwge307XG4gICAgICAgIHZhciBvcGVyYXRvciA9IGlucHV0U3RhdGUub3BlcmF0b3I7XG4gICAgICAgIHZhciBvcGVyYXRvckFyZ3MgPSBpbnB1dFN0YXRlLm9wZXJhdG9yQXJncyB8fCB7fTtcbiAgICAgICAgdmFyIHJlZ2lzdGVyTmFtZSA9IGlucHV0U3RhdGUucmVnaXN0ZXJOYW1lO1xuICAgICAgICB2YXIgc2VsID0gdmltLnNlbDtcbiAgICAgICAgLy8gVE9ETzogTWFrZSBzdXJlIGNtIGFuZCB2aW0gc2VsZWN0aW9ucyBhcmUgaWRlbnRpY2FsIG91dHNpZGUgdmlzdWFsIG1vZGUuXG4gICAgICAgIHZhciBvcmlnSGVhZCA9IGNvcHlDdXJzb3IodmltLnZpc3VhbE1vZGUgPyBjbGlwQ3Vyc29yVG9Db250ZW50KGNtLCBzZWwuaGVhZCk6IGNtLmdldEN1cnNvcignaGVhZCcpKTtcbiAgICAgICAgdmFyIG9yaWdBbmNob3IgPSBjb3B5Q3Vyc29yKHZpbS52aXN1YWxNb2RlID8gY2xpcEN1cnNvclRvQ29udGVudChjbSwgc2VsLmFuY2hvcikgOiBjbS5nZXRDdXJzb3IoJ2FuY2hvcicpKTtcbiAgICAgICAgdmFyIG9sZEhlYWQgPSBjb3B5Q3Vyc29yKG9yaWdIZWFkKTtcbiAgICAgICAgdmFyIG9sZEFuY2hvciA9IGNvcHlDdXJzb3Iob3JpZ0FuY2hvcik7XG4gICAgICAgIHZhciBuZXdIZWFkLCBuZXdBbmNob3I7XG4gICAgICAgIHZhciByZXBlYXQ7XG4gICAgICAgIGlmIChvcGVyYXRvcikge1xuICAgICAgICAgIHRoaXMucmVjb3JkTGFzdEVkaXQodmltLCBpbnB1dFN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5wdXRTdGF0ZS5yZXBlYXRPdmVycmlkZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgLy8gSWYgcmVwZWF0T3ZlcnJpZGUgaXMgc3BlY2lmaWVkLCB0aGF0IHRha2VzIHByZWNlZGVuY2Ugb3ZlciB0aGVcbiAgICAgICAgICAvLyBpbnB1dCBzdGF0ZSdzIHJlcGVhdC4gVXNlZCBieSBFeCBtb2RlIGFuZCBjYW4gYmUgdXNlciBkZWZpbmVkLlxuICAgICAgICAgIHJlcGVhdCA9IGlucHV0U3RhdGUucmVwZWF0T3ZlcnJpZGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVwZWF0ID0gaW5wdXRTdGF0ZS5nZXRSZXBlYXQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVwZWF0ID4gMCAmJiBtb3Rpb25BcmdzLmV4cGxpY2l0UmVwZWF0KSB7XG4gICAgICAgICAgbW90aW9uQXJncy5yZXBlYXRJc0V4cGxpY2l0ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChtb3Rpb25BcmdzLm5vUmVwZWF0IHx8XG4gICAgICAgICAgICAoIW1vdGlvbkFyZ3MuZXhwbGljaXRSZXBlYXQgJiYgcmVwZWF0ID09PSAwKSkge1xuICAgICAgICAgIHJlcGVhdCA9IDE7XG4gICAgICAgICAgbW90aW9uQXJncy5yZXBlYXRJc0V4cGxpY2l0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlucHV0U3RhdGUuc2VsZWN0ZWRDaGFyYWN0ZXIpIHtcbiAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBhIGNoYXJhY3RlciBpbnB1dCwgc3RpY2sgaXQgaW4gYWxsIG9mIHRoZSBhcmcgYXJyYXlzLlxuICAgICAgICAgIG1vdGlvbkFyZ3Muc2VsZWN0ZWRDaGFyYWN0ZXIgPSBvcGVyYXRvckFyZ3Muc2VsZWN0ZWRDaGFyYWN0ZXIgPVxuICAgICAgICAgICAgICBpbnB1dFN0YXRlLnNlbGVjdGVkQ2hhcmFjdGVyO1xuICAgICAgICB9XG4gICAgICAgIG1vdGlvbkFyZ3MucmVwZWF0ID0gcmVwZWF0O1xuICAgICAgICBjbGVhcklucHV0U3RhdGUoY20pO1xuICAgICAgICBpZiAobW90aW9uKSB7XG4gICAgICAgICAgdmFyIG1vdGlvblJlc3VsdCA9IG1vdGlvbnNbbW90aW9uXShjbSwgb3JpZ0hlYWQsIG1vdGlvbkFyZ3MsIHZpbSk7XG4gICAgICAgICAgdmltLmxhc3RNb3Rpb24gPSBtb3Rpb25zW21vdGlvbl07XG4gICAgICAgICAgaWYgKCFtb3Rpb25SZXN1bHQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG1vdGlvbkFyZ3MudG9KdW1wbGlzdCkge1xuICAgICAgICAgICAgdmFyIGp1bXBMaXN0ID0gdmltR2xvYmFsU3RhdGUuanVtcExpc3Q7XG4gICAgICAgICAgICAvLyBpZiB0aGUgY3VycmVudCBtb3Rpb24gaXMgIyBvciAqLCB1c2UgY2FjaGVkQ3Vyc29yXG4gICAgICAgICAgICB2YXIgY2FjaGVkQ3Vyc29yID0ganVtcExpc3QuY2FjaGVkQ3Vyc29yO1xuICAgICAgICAgICAgaWYgKGNhY2hlZEN1cnNvcikge1xuICAgICAgICAgICAgICByZWNvcmRKdW1wUG9zaXRpb24oY20sIGNhY2hlZEN1cnNvciwgbW90aW9uUmVzdWx0KTtcbiAgICAgICAgICAgICAgZGVsZXRlIGp1bXBMaXN0LmNhY2hlZEN1cnNvcjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlY29yZEp1bXBQb3NpdGlvbihjbSwgb3JpZ0hlYWQsIG1vdGlvblJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChtb3Rpb25SZXN1bHQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgbmV3QW5jaG9yID0gbW90aW9uUmVzdWx0WzBdO1xuICAgICAgICAgICAgbmV3SGVhZCA9IG1vdGlvblJlc3VsdFsxXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3SGVhZCA9IG1vdGlvblJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gVE9ETzogSGFuZGxlIG51bGwgcmV0dXJucyBmcm9tIG1vdGlvbiBjb21tYW5kcyBiZXR0ZXIuXG4gICAgICAgICAgaWYgKCFuZXdIZWFkKSB7XG4gICAgICAgICAgICBuZXdIZWFkID0gY29weUN1cnNvcihvcmlnSGVhZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh2aW0udmlzdWFsTW9kZSkge1xuICAgICAgICAgICAgaWYgKCEodmltLnZpc3VhbEJsb2NrICYmIG5ld0hlYWQuY2ggPT09IEluZmluaXR5KSkge1xuICAgICAgICAgICAgICBuZXdIZWFkID0gY2xpcEN1cnNvclRvQ29udGVudChjbSwgbmV3SGVhZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobmV3QW5jaG9yKSB7XG4gICAgICAgICAgICAgIG5ld0FuY2hvciA9IGNsaXBDdXJzb3JUb0NvbnRlbnQoY20sIG5ld0FuY2hvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdBbmNob3IgPSBuZXdBbmNob3IgfHwgb2xkQW5jaG9yO1xuICAgICAgICAgICAgc2VsLmFuY2hvciA9IG5ld0FuY2hvcjtcbiAgICAgICAgICAgIHNlbC5oZWFkID0gbmV3SGVhZDtcbiAgICAgICAgICAgIHVwZGF0ZUNtU2VsZWN0aW9uKGNtKTtcbiAgICAgICAgICAgIHVwZGF0ZU1hcmsoY20sIHZpbSwgJzwnLFxuICAgICAgICAgICAgICAgIGN1cnNvcklzQmVmb3JlKG5ld0FuY2hvciwgbmV3SGVhZCkgPyBuZXdBbmNob3JcbiAgICAgICAgICAgICAgICAgICAgOiBuZXdIZWFkKTtcbiAgICAgICAgICAgIHVwZGF0ZU1hcmsoY20sIHZpbSwgJz4nLFxuICAgICAgICAgICAgICAgIGN1cnNvcklzQmVmb3JlKG5ld0FuY2hvciwgbmV3SGVhZCkgPyBuZXdIZWFkXG4gICAgICAgICAgICAgICAgICAgIDogbmV3QW5jaG9yKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKCFvcGVyYXRvcikge1xuICAgICAgICAgICAgbmV3SGVhZCA9IGNsaXBDdXJzb3JUb0NvbnRlbnQoY20sIG5ld0hlYWQpO1xuICAgICAgICAgICAgY20uc2V0Q3Vyc29yKG5ld0hlYWQubGluZSwgbmV3SGVhZC5jaCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChvcGVyYXRvcikge1xuICAgICAgICAgIGlmIChvcGVyYXRvckFyZ3MubGFzdFNlbCkge1xuICAgICAgICAgICAgLy8gUmVwbGF5aW5nIGEgdmlzdWFsIG1vZGUgb3BlcmF0aW9uXG4gICAgICAgICAgICBuZXdBbmNob3IgPSBvbGRBbmNob3I7XG4gICAgICAgICAgICB2YXIgbGFzdFNlbCA9IG9wZXJhdG9yQXJncy5sYXN0U2VsO1xuICAgICAgICAgICAgdmFyIGxpbmVPZmZzZXQgPSBNYXRoLmFicyhsYXN0U2VsLmhlYWQubGluZSAtIGxhc3RTZWwuYW5jaG9yLmxpbmUpO1xuICAgICAgICAgICAgdmFyIGNoT2Zmc2V0ID0gTWF0aC5hYnMobGFzdFNlbC5oZWFkLmNoIC0gbGFzdFNlbC5hbmNob3IuY2gpO1xuICAgICAgICAgICAgaWYgKGxhc3RTZWwudmlzdWFsTGluZSkge1xuICAgICAgICAgICAgICAvLyBMaW5ld2lzZSBWaXN1YWwgbW9kZTogVGhlIHNhbWUgbnVtYmVyIG9mIGxpbmVzLlxuICAgICAgICAgICAgICBuZXdIZWFkID0gUG9zKG9sZEFuY2hvci5saW5lICsgbGluZU9mZnNldCwgb2xkQW5jaG9yLmNoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobGFzdFNlbC52aXN1YWxCbG9jaykge1xuICAgICAgICAgICAgICAvLyBCbG9ja3dpc2UgVmlzdWFsIG1vZGU6IFRoZSBzYW1lIG51bWJlciBvZiBsaW5lcyBhbmQgY29sdW1ucy5cbiAgICAgICAgICAgICAgbmV3SGVhZCA9IFBvcyhvbGRBbmNob3IubGluZSArIGxpbmVPZmZzZXQsIG9sZEFuY2hvci5jaCArIGNoT2Zmc2V0KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobGFzdFNlbC5oZWFkLmxpbmUgPT0gbGFzdFNlbC5hbmNob3IubGluZSkge1xuICAgICAgICAgICAgICAvLyBOb3JtYWwgVmlzdWFsIG1vZGUgd2l0aGluIG9uZSBsaW5lOiBUaGUgc2FtZSBudW1iZXIgb2YgY2hhcmFjdGVycy5cbiAgICAgICAgICAgICAgbmV3SGVhZCA9IFBvcyhvbGRBbmNob3IubGluZSwgb2xkQW5jaG9yLmNoICsgY2hPZmZzZXQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gTm9ybWFsIFZpc3VhbCBtb2RlIHdpdGggc2V2ZXJhbCBsaW5lczogVGhlIHNhbWUgbnVtYmVyIG9mIGxpbmVzLCBpbiB0aGVcbiAgICAgICAgICAgICAgLy8gbGFzdCBsaW5lIHRoZSBzYW1lIG51bWJlciBvZiBjaGFyYWN0ZXJzIGFzIGluIHRoZSBsYXN0IGxpbmUgdGhlIGxhc3QgdGltZS5cbiAgICAgICAgICAgICAgbmV3SGVhZCA9IFBvcyhvbGRBbmNob3IubGluZSArIGxpbmVPZmZzZXQsIG9sZEFuY2hvci5jaCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2aW0udmlzdWFsTW9kZSA9IHRydWU7XG4gICAgICAgICAgICB2aW0udmlzdWFsTGluZSA9IGxhc3RTZWwudmlzdWFsTGluZTtcbiAgICAgICAgICAgIHZpbS52aXN1YWxCbG9jayA9IGxhc3RTZWwudmlzdWFsQmxvY2s7XG4gICAgICAgICAgICBzZWwgPSB2aW0uc2VsID0ge1xuICAgICAgICAgICAgICBhbmNob3I6IG5ld0FuY2hvcixcbiAgICAgICAgICAgICAgaGVhZDogbmV3SGVhZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHVwZGF0ZUNtU2VsZWN0aW9uKGNtKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgICAgICBvcGVyYXRvckFyZ3MubGFzdFNlbCA9IHtcbiAgICAgICAgICAgICAgYW5jaG9yOiBjb3B5Q3Vyc29yKHNlbC5hbmNob3IpLFxuICAgICAgICAgICAgICBoZWFkOiBjb3B5Q3Vyc29yKHNlbC5oZWFkKSxcbiAgICAgICAgICAgICAgdmlzdWFsQmxvY2s6IHZpbS52aXN1YWxCbG9jayxcbiAgICAgICAgICAgICAgdmlzdWFsTGluZTogdmltLnZpc3VhbExpbmVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBjdXJTdGFydCwgY3VyRW5kLCBsaW5ld2lzZSwgbW9kZTtcbiAgICAgICAgICB2YXIgY21TZWw7XG4gICAgICAgICAgaWYgKHZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgICAgICAvLyBJbml0IHZpc3VhbCBvcFxuICAgICAgICAgICAgY3VyU3RhcnQgPSBjdXJzb3JNaW4oc2VsLmhlYWQsIHNlbC5hbmNob3IpO1xuICAgICAgICAgICAgY3VyRW5kID0gY3Vyc29yTWF4KHNlbC5oZWFkLCBzZWwuYW5jaG9yKTtcbiAgICAgICAgICAgIGxpbmV3aXNlID0gdmltLnZpc3VhbExpbmUgfHwgb3BlcmF0b3JBcmdzLmxpbmV3aXNlO1xuICAgICAgICAgICAgbW9kZSA9IHZpbS52aXN1YWxCbG9jayA/ICdibG9jaycgOlxuICAgICAgICAgICAgICAgICAgIGxpbmV3aXNlID8gJ2xpbmUnIDpcbiAgICAgICAgICAgICAgICAgICAnY2hhcic7XG4gICAgICAgICAgICBjbVNlbCA9IG1ha2VDbVNlbGVjdGlvbihjbSwge1xuICAgICAgICAgICAgICBhbmNob3I6IGN1clN0YXJ0LFxuICAgICAgICAgICAgICBoZWFkOiBjdXJFbmRcbiAgICAgICAgICAgIH0sIG1vZGUpO1xuICAgICAgICAgICAgaWYgKGxpbmV3aXNlKSB7XG4gICAgICAgICAgICAgIHZhciByYW5nZXMgPSBjbVNlbC5yYW5nZXM7XG4gICAgICAgICAgICAgIGlmIChtb2RlID09ICdibG9jaycpIHtcbiAgICAgICAgICAgICAgICAvLyBMaW5ld2lzZSBvcGVyYXRvcnMgaW4gdmlzdWFsIGJsb2NrIG1vZGUgZXh0ZW5kIHRvIGVuZCBvZiBsaW5lXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByYW5nZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgIHJhbmdlc1tpXS5oZWFkLmNoID0gbGluZUxlbmd0aChjbSwgcmFuZ2VzW2ldLmhlYWQubGluZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1vZGUgPT0gJ2xpbmUnKSB7XG4gICAgICAgICAgICAgICAgcmFuZ2VzWzBdLmhlYWQgPSBQb3MocmFuZ2VzWzBdLmhlYWQubGluZSArIDEsIDApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEluaXQgbW90aW9uIG9wXG4gICAgICAgICAgICBjdXJTdGFydCA9IGNvcHlDdXJzb3IobmV3QW5jaG9yIHx8IG9sZEFuY2hvcik7XG4gICAgICAgICAgICBjdXJFbmQgPSBjb3B5Q3Vyc29yKG5ld0hlYWQgfHwgb2xkSGVhZCk7XG4gICAgICAgICAgICBpZiAoY3Vyc29ySXNCZWZvcmUoY3VyRW5kLCBjdXJTdGFydCkpIHtcbiAgICAgICAgICAgICAgdmFyIHRtcCA9IGN1clN0YXJ0O1xuICAgICAgICAgICAgICBjdXJTdGFydCA9IGN1ckVuZDtcbiAgICAgICAgICAgICAgY3VyRW5kID0gdG1wO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGluZXdpc2UgPSBtb3Rpb25BcmdzLmxpbmV3aXNlIHx8IG9wZXJhdG9yQXJncy5saW5ld2lzZTtcbiAgICAgICAgICAgIGlmIChsaW5ld2lzZSkge1xuICAgICAgICAgICAgICAvLyBFeHBhbmQgc2VsZWN0aW9uIHRvIGVudGlyZSBsaW5lLlxuICAgICAgICAgICAgICBleHBhbmRTZWxlY3Rpb25Ub0xpbmUoY20sIGN1clN0YXJ0LCBjdXJFbmQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChtb3Rpb25BcmdzLmZvcndhcmQpIHtcbiAgICAgICAgICAgICAgLy8gQ2xpcCB0byB0cmFpbGluZyBuZXdsaW5lcyBvbmx5IGlmIHRoZSBtb3Rpb24gZ29lcyBmb3J3YXJkLlxuICAgICAgICAgICAgICBjbGlwVG9MaW5lKGNtLCBjdXJTdGFydCwgY3VyRW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1vZGUgPSAnY2hhcic7XG4gICAgICAgICAgICB2YXIgZXhjbHVzaXZlID0gIW1vdGlvbkFyZ3MuaW5jbHVzaXZlIHx8IGxpbmV3aXNlO1xuICAgICAgICAgICAgY21TZWwgPSBtYWtlQ21TZWxlY3Rpb24oY20sIHtcbiAgICAgICAgICAgICAgYW5jaG9yOiBjdXJTdGFydCxcbiAgICAgICAgICAgICAgaGVhZDogY3VyRW5kXG4gICAgICAgICAgICB9LCBtb2RlLCBleGNsdXNpdmUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjbS5zZXRTZWxlY3Rpb25zKGNtU2VsLnJhbmdlcywgY21TZWwucHJpbWFyeSk7XG4gICAgICAgICAgdmltLmxhc3RNb3Rpb24gPSBudWxsO1xuICAgICAgICAgIG9wZXJhdG9yQXJncy5yZXBlYXQgPSByZXBlYXQ7IC8vIEZvciBpbmRlbnQgaW4gdmlzdWFsIG1vZGUuXG4gICAgICAgICAgb3BlcmF0b3JBcmdzLnJlZ2lzdGVyTmFtZSA9IHJlZ2lzdGVyTmFtZTtcbiAgICAgICAgICAvLyBLZWVwIHRyYWNrIG9mIGxpbmV3aXNlIGFzIGl0IGFmZmVjdHMgaG93IHBhc3RlIGFuZCBjaGFuZ2UgYmVoYXZlLlxuICAgICAgICAgIG9wZXJhdG9yQXJncy5saW5ld2lzZSA9IGxpbmV3aXNlO1xuICAgICAgICAgIHZhciBvcGVyYXRvck1vdmVUbyA9IG9wZXJhdG9yc1tvcGVyYXRvcl0oXG4gICAgICAgICAgICBjbSwgb3BlcmF0b3JBcmdzLCBjbVNlbC5yYW5nZXMsIG9sZEFuY2hvciwgbmV3SGVhZCk7XG4gICAgICAgICAgaWYgKHZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgICAgICBleGl0VmlzdWFsTW9kZShjbSwgb3BlcmF0b3JNb3ZlVG8gIT0gbnVsbCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChvcGVyYXRvck1vdmVUbykge1xuICAgICAgICAgICAgY20uc2V0Q3Vyc29yKG9wZXJhdG9yTW92ZVRvKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICByZWNvcmRMYXN0RWRpdDogZnVuY3Rpb24odmltLCBpbnB1dFN0YXRlLCBhY3Rpb25Db21tYW5kKSB7XG4gICAgICAgIHZhciBtYWNyb01vZGVTdGF0ZSA9IHZpbUdsb2JhbFN0YXRlLm1hY3JvTW9kZVN0YXRlO1xuICAgICAgICBpZiAobWFjcm9Nb2RlU3RhdGUuaXNQbGF5aW5nKSB7IHJldHVybjsgfVxuICAgICAgICB2aW0ubGFzdEVkaXRJbnB1dFN0YXRlID0gaW5wdXRTdGF0ZTtcbiAgICAgICAgdmltLmxhc3RFZGl0QWN0aW9uQ29tbWFuZCA9IGFjdGlvbkNvbW1hbmQ7XG4gICAgICAgIG1hY3JvTW9kZVN0YXRlLmxhc3RJbnNlcnRNb2RlQ2hhbmdlcy5jaGFuZ2VzID0gW107XG4gICAgICAgIG1hY3JvTW9kZVN0YXRlLmxhc3RJbnNlcnRNb2RlQ2hhbmdlcy5leHBlY3RDdXJzb3JBY3Rpdml0eUZvckNoYW5nZSA9IGZhbHNlO1xuICAgICAgICBtYWNyb01vZGVTdGF0ZS5sYXN0SW5zZXJ0TW9kZUNoYW5nZXMudmlzdWFsQmxvY2sgPSB2aW0udmlzdWFsQmxvY2sgPyB2aW0uc2VsLmhlYWQubGluZSAtIHZpbS5zZWwuYW5jaG9yLmxpbmUgOiAwO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiB0eXBlZGVmIHtPYmplY3R7bGluZTpudW1iZXIsY2g6bnVtYmVyfX0gQ3Vyc29yIEFuIG9iamVjdCBjb250YWluaW5nIHRoZVxuICAgICAqICAgICBwb3NpdGlvbiBvZiB0aGUgY3Vyc29yLlxuICAgICAqL1xuICAgIC8vIEFsbCBvZiB0aGUgZnVuY3Rpb25zIGJlbG93IHJldHVybiBDdXJzb3Igb2JqZWN0cy5cbiAgICB2YXIgbW90aW9ucyA9IHtcbiAgICAgIG1vdmVUb1RvcExpbmU6IGZ1bmN0aW9uKGNtLCBfaGVhZCwgbW90aW9uQXJncykge1xuICAgICAgICB2YXIgbGluZSA9IGdldFVzZXJWaXNpYmxlTGluZXMoY20pLnRvcCArIG1vdGlvbkFyZ3MucmVwZWF0IC0xO1xuICAgICAgICByZXR1cm4gUG9zKGxpbmUsIGZpbmRGaXJzdE5vbldoaXRlU3BhY2VDaGFyYWN0ZXIoY20uZ2V0TGluZShsaW5lKSkpO1xuICAgICAgfSxcbiAgICAgIG1vdmVUb01pZGRsZUxpbmU6IGZ1bmN0aW9uKGNtKSB7XG4gICAgICAgIHZhciByYW5nZSA9IGdldFVzZXJWaXNpYmxlTGluZXMoY20pO1xuICAgICAgICB2YXIgbGluZSA9IE1hdGguZmxvb3IoKHJhbmdlLnRvcCArIHJhbmdlLmJvdHRvbSkgKiAwLjUpO1xuICAgICAgICByZXR1cm4gUG9zKGxpbmUsIGZpbmRGaXJzdE5vbldoaXRlU3BhY2VDaGFyYWN0ZXIoY20uZ2V0TGluZShsaW5lKSkpO1xuICAgICAgfSxcbiAgICAgIG1vdmVUb0JvdHRvbUxpbmU6IGZ1bmN0aW9uKGNtLCBfaGVhZCwgbW90aW9uQXJncykge1xuICAgICAgICB2YXIgbGluZSA9IGdldFVzZXJWaXNpYmxlTGluZXMoY20pLmJvdHRvbSAtIG1vdGlvbkFyZ3MucmVwZWF0ICsxO1xuICAgICAgICByZXR1cm4gUG9zKGxpbmUsIGZpbmRGaXJzdE5vbldoaXRlU3BhY2VDaGFyYWN0ZXIoY20uZ2V0TGluZShsaW5lKSkpO1xuICAgICAgfSxcbiAgICAgIGV4cGFuZFRvTGluZTogZnVuY3Rpb24oX2NtLCBoZWFkLCBtb3Rpb25BcmdzKSB7XG4gICAgICAgIC8vIEV4cGFuZHMgZm9yd2FyZCB0byBlbmQgb2YgbGluZSwgYW5kIHRoZW4gdG8gbmV4dCBsaW5lIGlmIHJlcGVhdCBpc1xuICAgICAgICAvLyA+MS4gRG9lcyBub3QgaGFuZGxlIGJhY2t3YXJkIG1vdGlvbiFcbiAgICAgICAgdmFyIGN1ciA9IGhlYWQ7XG4gICAgICAgIHJldHVybiBQb3MoY3VyLmxpbmUgKyBtb3Rpb25BcmdzLnJlcGVhdCAtIDEsIEluZmluaXR5KTtcbiAgICAgIH0sXG4gICAgICBmaW5kTmV4dDogZnVuY3Rpb24oY20sIF9oZWFkLCBtb3Rpb25BcmdzKSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IGdldFNlYXJjaFN0YXRlKGNtKTtcbiAgICAgICAgdmFyIHF1ZXJ5ID0gc3RhdGUuZ2V0UXVlcnkoKTtcbiAgICAgICAgaWYgKCFxdWVyeSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcHJldiA9ICFtb3Rpb25BcmdzLmZvcndhcmQ7XG4gICAgICAgIC8vIElmIHNlYXJjaCBpcyBpbml0aWF0ZWQgd2l0aCA/IGluc3RlYWQgb2YgLywgbmVnYXRlIGRpcmVjdGlvbi5cbiAgICAgICAgcHJldiA9IChzdGF0ZS5pc1JldmVyc2VkKCkpID8gIXByZXYgOiBwcmV2O1xuICAgICAgICBoaWdobGlnaHRTZWFyY2hNYXRjaGVzKGNtLCBxdWVyeSk7XG4gICAgICAgIHJldHVybiBmaW5kTmV4dChjbSwgcHJldi8qKiBwcmV2ICovLCBxdWVyeSwgbW90aW9uQXJncy5yZXBlYXQpO1xuICAgICAgfSxcbiAgICAgIGdvVG9NYXJrOiBmdW5jdGlvbihjbSwgX2hlYWQsIG1vdGlvbkFyZ3MsIHZpbSkge1xuICAgICAgICB2YXIgcG9zID0gZ2V0TWFya1BvcyhjbSwgdmltLCBtb3Rpb25BcmdzLnNlbGVjdGVkQ2hhcmFjdGVyKTtcbiAgICAgICAgaWYgKHBvcykge1xuICAgICAgICAgIHJldHVybiBtb3Rpb25BcmdzLmxpbmV3aXNlID8geyBsaW5lOiBwb3MubGluZSwgY2g6IGZpbmRGaXJzdE5vbldoaXRlU3BhY2VDaGFyYWN0ZXIoY20uZ2V0TGluZShwb3MubGluZSkpIH0gOiBwb3M7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9LFxuICAgICAgbW92ZVRvT3RoZXJIaWdobGlnaHRlZEVuZDogZnVuY3Rpb24oY20sIF9oZWFkLCBtb3Rpb25BcmdzLCB2aW0pIHtcbiAgICAgICAgaWYgKHZpbS52aXN1YWxCbG9jayAmJiBtb3Rpb25BcmdzLnNhbWVMaW5lKSB7XG4gICAgICAgICAgdmFyIHNlbCA9IHZpbS5zZWw7XG4gICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIGNsaXBDdXJzb3JUb0NvbnRlbnQoY20sIFBvcyhzZWwuYW5jaG9yLmxpbmUsIHNlbC5oZWFkLmNoKSksXG4gICAgICAgICAgICBjbGlwQ3Vyc29yVG9Db250ZW50KGNtLCBQb3Moc2VsLmhlYWQubGluZSwgc2VsLmFuY2hvci5jaCkpXG4gICAgICAgICAgXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gKFt2aW0uc2VsLmhlYWQsIHZpbS5zZWwuYW5jaG9yXSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBqdW1wVG9NYXJrOiBmdW5jdGlvbihjbSwgaGVhZCwgbW90aW9uQXJncywgdmltKSB7XG4gICAgICAgIHZhciBiZXN0ID0gaGVhZDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtb3Rpb25BcmdzLnJlcGVhdDsgaSsrKSB7XG4gICAgICAgICAgdmFyIGN1cnNvciA9IGJlc3Q7XG4gICAgICAgICAgZm9yICh2YXIga2V5IGluIHZpbS5tYXJrcykge1xuICAgICAgICAgICAgaWYgKCFpc0xvd2VyQ2FzZShrZXkpKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG1hcmsgPSB2aW0ubWFya3Nba2V5XS5maW5kKCk7XG4gICAgICAgICAgICB2YXIgaXNXcm9uZ0RpcmVjdGlvbiA9IChtb3Rpb25BcmdzLmZvcndhcmQpID9cbiAgICAgICAgICAgICAgY3Vyc29ySXNCZWZvcmUobWFyaywgY3Vyc29yKSA6IGN1cnNvcklzQmVmb3JlKGN1cnNvciwgbWFyayk7XG5cbiAgICAgICAgICAgIGlmIChpc1dyb25nRGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1vdGlvbkFyZ3MubGluZXdpc2UgJiYgKG1hcmsubGluZSA9PSBjdXJzb3IubGluZSkpIHtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBlcXVhbCA9IGN1cnNvckVxdWFsKGN1cnNvciwgYmVzdCk7XG4gICAgICAgICAgICB2YXIgYmV0d2VlbiA9IChtb3Rpb25BcmdzLmZvcndhcmQpID9cbiAgICAgICAgICAgICAgY3Vyc29ySXNCZXR3ZWVuKGN1cnNvciwgbWFyaywgYmVzdCkgOlxuICAgICAgICAgICAgICBjdXJzb3JJc0JldHdlZW4oYmVzdCwgbWFyaywgY3Vyc29yKTtcblxuICAgICAgICAgICAgaWYgKGVxdWFsIHx8IGJldHdlZW4pIHtcbiAgICAgICAgICAgICAgYmVzdCA9IG1hcms7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1vdGlvbkFyZ3MubGluZXdpc2UpIHtcbiAgICAgICAgICAvLyBWaW0gcGxhY2VzIHRoZSBjdXJzb3Igb24gdGhlIGZpcnN0IG5vbi13aGl0ZXNwYWNlIGNoYXJhY3RlciBvZlxuICAgICAgICAgIC8vIHRoZSBsaW5lIGlmIHRoZXJlIGlzIG9uZSwgZWxzZSBpdCBwbGFjZXMgdGhlIGN1cnNvciBhdCB0aGUgZW5kXG4gICAgICAgICAgLy8gb2YgdGhlIGxpbmUsIHJlZ2FyZGxlc3Mgb2Ygd2hldGhlciBhIG1hcmsgd2FzIGZvdW5kLlxuICAgICAgICAgIGJlc3QgPSBQb3MoYmVzdC5saW5lLCBmaW5kRmlyc3ROb25XaGl0ZVNwYWNlQ2hhcmFjdGVyKGNtLmdldExpbmUoYmVzdC5saW5lKSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBiZXN0O1xuICAgICAgfSxcbiAgICAgIG1vdmVCeUNoYXJhY3RlcnM6IGZ1bmN0aW9uKF9jbSwgaGVhZCwgbW90aW9uQXJncykge1xuICAgICAgICB2YXIgY3VyID0gaGVhZDtcbiAgICAgICAgdmFyIHJlcGVhdCA9IG1vdGlvbkFyZ3MucmVwZWF0O1xuICAgICAgICB2YXIgY2ggPSBtb3Rpb25BcmdzLmZvcndhcmQgPyBjdXIuY2ggKyByZXBlYXQgOiBjdXIuY2ggLSByZXBlYXQ7XG4gICAgICAgIHJldHVybiBQb3MoY3VyLmxpbmUsIGNoKTtcbiAgICAgIH0sXG4gICAgICBtb3ZlQnlMaW5lczogZnVuY3Rpb24oY20sIGhlYWQsIG1vdGlvbkFyZ3MsIHZpbSkge1xuICAgICAgICB2YXIgY3VyID0gaGVhZDtcbiAgICAgICAgdmFyIGVuZENoID0gY3VyLmNoO1xuICAgICAgICAvLyBEZXBlbmRpbmcgd2hhdCBvdXIgbGFzdCBtb3Rpb24gd2FzLCB3ZSBtYXkgd2FudCB0byBkbyBkaWZmZXJlbnRcbiAgICAgICAgLy8gdGhpbmdzLiBJZiBvdXIgbGFzdCBtb3Rpb24gd2FzIG1vdmluZyB2ZXJ0aWNhbGx5LCB3ZSB3YW50IHRvXG4gICAgICAgIC8vIHByZXNlcnZlIHRoZSBIUG9zIGZyb20gb3VyIGxhc3QgaG9yaXpvbnRhbCBtb3ZlLiAgSWYgb3VyIGxhc3QgbW90aW9uXG4gICAgICAgIC8vIHdhcyBnb2luZyB0byB0aGUgZW5kIG9mIGEgbGluZSwgbW92aW5nIHZlcnRpY2FsbHkgd2Ugc2hvdWxkIGdvIHRvXG4gICAgICAgIC8vIHRoZSBlbmQgb2YgdGhlIGxpbmUsIGV0Yy5cbiAgICAgICAgc3dpdGNoICh2aW0ubGFzdE1vdGlvbikge1xuICAgICAgICAgIGNhc2UgdGhpcy5tb3ZlQnlMaW5lczpcbiAgICAgICAgICBjYXNlIHRoaXMubW92ZUJ5RGlzcGxheUxpbmVzOlxuICAgICAgICAgIGNhc2UgdGhpcy5tb3ZlQnlTY3JvbGw6XG4gICAgICAgICAgY2FzZSB0aGlzLm1vdmVUb0NvbHVtbjpcbiAgICAgICAgICBjYXNlIHRoaXMubW92ZVRvRW9sOlxuICAgICAgICAgICAgZW5kQ2ggPSB2aW0ubGFzdEhQb3M7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdmltLmxhc3RIUG9zID0gZW5kQ2g7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlcGVhdCA9IG1vdGlvbkFyZ3MucmVwZWF0Kyhtb3Rpb25BcmdzLnJlcGVhdE9mZnNldHx8MCk7XG4gICAgICAgIHZhciBsaW5lID0gbW90aW9uQXJncy5mb3J3YXJkID8gY3VyLmxpbmUgKyByZXBlYXQgOiBjdXIubGluZSAtIHJlcGVhdDtcbiAgICAgICAgdmFyIGZpcnN0ID0gY20uZmlyc3RMaW5lKCk7XG4gICAgICAgIHZhciBsYXN0ID0gY20ubGFzdExpbmUoKTtcbiAgICAgICAgdmFyIHBvc1YgPSBjbS5maW5kUG9zVihjdXIsIChtb3Rpb25BcmdzLmZvcndhcmQgPyByZXBlYXQgOiAtcmVwZWF0KSwgJ2xpbmUnLCB2aW0ubGFzdEhTUG9zKTtcbiAgICAgICAgdmFyIGhhc01hcmtlZFRleHQgPSBtb3Rpb25BcmdzLmZvcndhcmQgPyBwb3NWLmxpbmUgPiBsaW5lIDogcG9zVi5saW5lIDwgbGluZTtcbiAgICAgICAgaWYgKGhhc01hcmtlZFRleHQpIHtcbiAgICAgICAgICBsaW5lID0gcG9zVi5saW5lO1xuICAgICAgICAgIGVuZENoID0gcG9zVi5jaDtcbiAgICAgICAgfVxuICAgICAgICAvLyBWaW0gZ28gdG8gbGluZSBiZWdpbiBvciBsaW5lIGVuZCB3aGVuIGN1cnNvciBhdCBmaXJzdC9sYXN0IGxpbmUgYW5kXG4gICAgICAgIC8vIG1vdmUgdG8gcHJldmlvdXMvbmV4dCBsaW5lIGlzIHRyaWdnZXJlZC5cbiAgICAgICAgaWYgKGxpbmUgPCBmaXJzdCAmJiBjdXIubGluZSA9PSBmaXJzdCl7XG4gICAgICAgICAgcmV0dXJuIHRoaXMubW92ZVRvU3RhcnRPZkxpbmUoY20sIGhlYWQsIG1vdGlvbkFyZ3MsIHZpbSk7XG4gICAgICAgIH1lbHNlIGlmIChsaW5lID4gbGFzdCAmJiBjdXIubGluZSA9PSBsYXN0KXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1vdmVUb0VvbChjbSwgaGVhZCwgbW90aW9uQXJncywgdmltLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobW90aW9uQXJncy50b0ZpcnN0Q2hhcil7XG4gICAgICAgICAgZW5kQ2g9ZmluZEZpcnN0Tm9uV2hpdGVTcGFjZUNoYXJhY3RlcihjbS5nZXRMaW5lKGxpbmUpKTtcbiAgICAgICAgICB2aW0ubGFzdEhQb3MgPSBlbmRDaDtcbiAgICAgICAgfVxuICAgICAgICB2aW0ubGFzdEhTUG9zID0gY20uY2hhckNvb3JkcyhQb3MobGluZSwgZW5kQ2gpLCdkaXYnKS5sZWZ0O1xuICAgICAgICByZXR1cm4gUG9zKGxpbmUsIGVuZENoKTtcbiAgICAgIH0sXG4gICAgICBtb3ZlQnlEaXNwbGF5TGluZXM6IGZ1bmN0aW9uKGNtLCBoZWFkLCBtb3Rpb25BcmdzLCB2aW0pIHtcbiAgICAgICAgdmFyIGN1ciA9IGhlYWQ7XG4gICAgICAgIHN3aXRjaCAodmltLmxhc3RNb3Rpb24pIHtcbiAgICAgICAgICBjYXNlIHRoaXMubW92ZUJ5RGlzcGxheUxpbmVzOlxuICAgICAgICAgIGNhc2UgdGhpcy5tb3ZlQnlTY3JvbGw6XG4gICAgICAgICAgY2FzZSB0aGlzLm1vdmVCeUxpbmVzOlxuICAgICAgICAgIGNhc2UgdGhpcy5tb3ZlVG9Db2x1bW46XG4gICAgICAgICAgY2FzZSB0aGlzLm1vdmVUb0VvbDpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB2aW0ubGFzdEhTUG9zID0gY20uY2hhckNvb3JkcyhjdXIsJ2RpdicpLmxlZnQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlcGVhdCA9IG1vdGlvbkFyZ3MucmVwZWF0O1xuICAgICAgICB2YXIgcmVzPWNtLmZpbmRQb3NWKGN1ciwobW90aW9uQXJncy5mb3J3YXJkID8gcmVwZWF0IDogLXJlcGVhdCksJ2xpbmUnLHZpbS5sYXN0SFNQb3MpO1xuICAgICAgICBpZiAocmVzLmhpdFNpZGUpIHtcbiAgICAgICAgICBpZiAobW90aW9uQXJncy5mb3J3YXJkKSB7XG4gICAgICAgICAgICB2YXIgbGFzdENoYXJDb29yZHMgPSBjbS5jaGFyQ29vcmRzKHJlcywgJ2RpdicpO1xuICAgICAgICAgICAgdmFyIGdvYWxDb29yZHMgPSB7IHRvcDogbGFzdENoYXJDb29yZHMudG9wICsgOCwgbGVmdDogdmltLmxhc3RIU1BvcyB9O1xuICAgICAgICAgICAgdmFyIHJlcyA9IGNtLmNvb3Jkc0NoYXIoZ29hbENvb3JkcywgJ2RpdicpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgcmVzQ29vcmRzID0gY20uY2hhckNvb3JkcyhQb3MoY20uZmlyc3RMaW5lKCksIDApLCAnZGl2Jyk7XG4gICAgICAgICAgICByZXNDb29yZHMubGVmdCA9IHZpbS5sYXN0SFNQb3M7XG4gICAgICAgICAgICByZXMgPSBjbS5jb29yZHNDaGFyKHJlc0Nvb3JkcywgJ2RpdicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2aW0ubGFzdEhQb3MgPSByZXMuY2g7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9LFxuICAgICAgbW92ZUJ5UGFnZTogZnVuY3Rpb24oY20sIGhlYWQsIG1vdGlvbkFyZ3MpIHtcbiAgICAgICAgLy8gQ29kZU1pcnJvciBvbmx5IGV4cG9zZXMgZnVuY3Rpb25zIHRoYXQgbW92ZSB0aGUgY3Vyc29yIHBhZ2UgZG93biwgc29cbiAgICAgICAgLy8gZG9pbmcgdGhpcyBiYWQgaGFjayB0byBtb3ZlIHRoZSBjdXJzb3IgYW5kIG1vdmUgaXQgYmFjay4gZXZhbElucHV0XG4gICAgICAgIC8vIHdpbGwgbW92ZSB0aGUgY3Vyc29yIHRvIHdoZXJlIGl0IHNob3VsZCBiZSBpbiB0aGUgZW5kLlxuICAgICAgICB2YXIgY3VyU3RhcnQgPSBoZWFkO1xuICAgICAgICB2YXIgcmVwZWF0ID0gbW90aW9uQXJncy5yZXBlYXQ7XG4gICAgICAgIHJldHVybiBjbS5maW5kUG9zVihjdXJTdGFydCwgKG1vdGlvbkFyZ3MuZm9yd2FyZCA/IHJlcGVhdCA6IC1yZXBlYXQpLCAncGFnZScpO1xuICAgICAgfSxcbiAgICAgIG1vdmVCeVBhcmFncmFwaDogZnVuY3Rpb24oY20sIGhlYWQsIG1vdGlvbkFyZ3MpIHtcbiAgICAgICAgdmFyIGRpciA9IG1vdGlvbkFyZ3MuZm9yd2FyZCA/IDEgOiAtMTtcbiAgICAgICAgcmV0dXJuIGZpbmRQYXJhZ3JhcGgoY20sIGhlYWQsIG1vdGlvbkFyZ3MucmVwZWF0LCBkaXIpO1xuICAgICAgfSxcbiAgICAgIG1vdmVCeVNlbnRlbmNlOiBmdW5jdGlvbihjbSwgaGVhZCwgbW90aW9uQXJncykge1xuICAgICAgICB2YXIgZGlyID0gbW90aW9uQXJncy5mb3J3YXJkID8gMSA6IC0xO1xuICAgICAgICByZXR1cm4gZmluZFNlbnRlbmNlKGNtLCBoZWFkLCBtb3Rpb25BcmdzLnJlcGVhdCwgZGlyKTtcbiAgICAgIH0sXG4gICAgICBtb3ZlQnlTY3JvbGw6IGZ1bmN0aW9uKGNtLCBoZWFkLCBtb3Rpb25BcmdzLCB2aW0pIHtcbiAgICAgICAgdmFyIHNjcm9sbGJveCA9IGNtLmdldFNjcm9sbEluZm8oKTtcbiAgICAgICAgdmFyIGN1ckVuZCA9IG51bGw7XG4gICAgICAgIHZhciByZXBlYXQgPSBtb3Rpb25BcmdzLnJlcGVhdDtcbiAgICAgICAgaWYgKCFyZXBlYXQpIHtcbiAgICAgICAgICByZXBlYXQgPSBzY3JvbGxib3guY2xpZW50SGVpZ2h0IC8gKDIgKiBjbS5kZWZhdWx0VGV4dEhlaWdodCgpKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgb3JpZyA9IGNtLmNoYXJDb29yZHMoaGVhZCwgJ2xvY2FsJyk7XG4gICAgICAgIG1vdGlvbkFyZ3MucmVwZWF0ID0gcmVwZWF0O1xuICAgICAgICB2YXIgY3VyRW5kID0gbW90aW9ucy5tb3ZlQnlEaXNwbGF5TGluZXMoY20sIGhlYWQsIG1vdGlvbkFyZ3MsIHZpbSk7XG4gICAgICAgIGlmICghY3VyRW5kKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRlc3QgPSBjbS5jaGFyQ29vcmRzKGN1ckVuZCwgJ2xvY2FsJyk7XG4gICAgICAgIGNtLnNjcm9sbFRvKG51bGwsIHNjcm9sbGJveC50b3AgKyBkZXN0LnRvcCAtIG9yaWcudG9wKTtcbiAgICAgICAgcmV0dXJuIGN1ckVuZDtcbiAgICAgIH0sXG4gICAgICBtb3ZlQnlXb3JkczogZnVuY3Rpb24oY20sIGhlYWQsIG1vdGlvbkFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIG1vdmVUb1dvcmQoY20sIGhlYWQsIG1vdGlvbkFyZ3MucmVwZWF0LCAhIW1vdGlvbkFyZ3MuZm9yd2FyZCxcbiAgICAgICAgICAgICEhbW90aW9uQXJncy53b3JkRW5kLCAhIW1vdGlvbkFyZ3MuYmlnV29yZCk7XG4gICAgICB9LFxuICAgICAgbW92ZVRpbGxDaGFyYWN0ZXI6IGZ1bmN0aW9uKGNtLCBfaGVhZCwgbW90aW9uQXJncykge1xuICAgICAgICB2YXIgcmVwZWF0ID0gbW90aW9uQXJncy5yZXBlYXQ7XG4gICAgICAgIHZhciBjdXJFbmQgPSBtb3ZlVG9DaGFyYWN0ZXIoY20sIHJlcGVhdCwgbW90aW9uQXJncy5mb3J3YXJkLFxuICAgICAgICAgICAgbW90aW9uQXJncy5zZWxlY3RlZENoYXJhY3Rlcik7XG4gICAgICAgIHZhciBpbmNyZW1lbnQgPSBtb3Rpb25BcmdzLmZvcndhcmQgPyAtMSA6IDE7XG4gICAgICAgIHJlY29yZExhc3RDaGFyYWN0ZXJTZWFyY2goaW5jcmVtZW50LCBtb3Rpb25BcmdzKTtcbiAgICAgICAgaWYgKCFjdXJFbmQpIHJldHVybiBudWxsO1xuICAgICAgICBjdXJFbmQuY2ggKz0gaW5jcmVtZW50O1xuICAgICAgICByZXR1cm4gY3VyRW5kO1xuICAgICAgfSxcbiAgICAgIG1vdmVUb0NoYXJhY3RlcjogZnVuY3Rpb24oY20sIGhlYWQsIG1vdGlvbkFyZ3MpIHtcbiAgICAgICAgdmFyIHJlcGVhdCA9IG1vdGlvbkFyZ3MucmVwZWF0O1xuICAgICAgICByZWNvcmRMYXN0Q2hhcmFjdGVyU2VhcmNoKDAsIG1vdGlvbkFyZ3MpO1xuICAgICAgICByZXR1cm4gbW92ZVRvQ2hhcmFjdGVyKGNtLCByZXBlYXQsIG1vdGlvbkFyZ3MuZm9yd2FyZCxcbiAgICAgICAgICAgIG1vdGlvbkFyZ3Muc2VsZWN0ZWRDaGFyYWN0ZXIpIHx8IGhlYWQ7XG4gICAgICB9LFxuICAgICAgbW92ZVRvU3ltYm9sOiBmdW5jdGlvbihjbSwgaGVhZCwgbW90aW9uQXJncykge1xuICAgICAgICB2YXIgcmVwZWF0ID0gbW90aW9uQXJncy5yZXBlYXQ7XG4gICAgICAgIHJldHVybiBmaW5kU3ltYm9sKGNtLCByZXBlYXQsIG1vdGlvbkFyZ3MuZm9yd2FyZCxcbiAgICAgICAgICAgIG1vdGlvbkFyZ3Muc2VsZWN0ZWRDaGFyYWN0ZXIpIHx8IGhlYWQ7XG4gICAgICB9LFxuICAgICAgbW92ZVRvQ29sdW1uOiBmdW5jdGlvbihjbSwgaGVhZCwgbW90aW9uQXJncywgdmltKSB7XG4gICAgICAgIHZhciByZXBlYXQgPSBtb3Rpb25BcmdzLnJlcGVhdDtcbiAgICAgICAgLy8gcmVwZWF0IGlzIGVxdWl2YWxlbnQgdG8gd2hpY2ggY29sdW1uIHdlIHdhbnQgdG8gbW92ZSB0byFcbiAgICAgICAgdmltLmxhc3RIUG9zID0gcmVwZWF0IC0gMTtcbiAgICAgICAgdmltLmxhc3RIU1BvcyA9IGNtLmNoYXJDb29yZHMoaGVhZCwnZGl2JykubGVmdDtcbiAgICAgICAgcmV0dXJuIG1vdmVUb0NvbHVtbihjbSwgcmVwZWF0KTtcbiAgICAgIH0sXG4gICAgICBtb3ZlVG9Fb2w6IGZ1bmN0aW9uKGNtLCBoZWFkLCBtb3Rpb25BcmdzLCB2aW0sIGtlZXBIUG9zKSB7XG4gICAgICAgIHZhciBjdXIgPSBoZWFkO1xuICAgICAgICB2YXIgcmV0dmFsPSBQb3MoY3VyLmxpbmUgKyBtb3Rpb25BcmdzLnJlcGVhdCAtIDEsIEluZmluaXR5KTtcbiAgICAgICAgdmFyIGVuZD1jbS5jbGlwUG9zKHJldHZhbCk7XG4gICAgICAgIGVuZC5jaC0tO1xuICAgICAgICBpZiAoIWtlZXBIUG9zKSB7XG4gICAgICAgICAgdmltLmxhc3RIUG9zID0gSW5maW5pdHk7XG4gICAgICAgICAgdmltLmxhc3RIU1BvcyA9IGNtLmNoYXJDb29yZHMoZW5kLCdkaXYnKS5sZWZ0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXR2YWw7XG4gICAgICB9LFxuICAgICAgbW92ZVRvRmlyc3ROb25XaGl0ZVNwYWNlQ2hhcmFjdGVyOiBmdW5jdGlvbihjbSwgaGVhZCkge1xuICAgICAgICAvLyBHbyB0byB0aGUgc3RhcnQgb2YgdGhlIGxpbmUgd2hlcmUgdGhlIHRleHQgYmVnaW5zLCBvciB0aGUgZW5kIGZvclxuICAgICAgICAvLyB3aGl0ZXNwYWNlLW9ubHkgbGluZXNcbiAgICAgICAgdmFyIGN1cnNvciA9IGhlYWQ7XG4gICAgICAgIHJldHVybiBQb3MoY3Vyc29yLmxpbmUsXG4gICAgICAgICAgICAgICAgICAgZmluZEZpcnN0Tm9uV2hpdGVTcGFjZUNoYXJhY3RlcihjbS5nZXRMaW5lKGN1cnNvci5saW5lKSkpO1xuICAgICAgfSxcbiAgICAgIG1vdmVUb01hdGNoZWRTeW1ib2w6IGZ1bmN0aW9uKGNtLCBoZWFkKSB7XG4gICAgICAgIHZhciBjdXJzb3IgPSBoZWFkO1xuICAgICAgICB2YXIgbGluZSA9IGN1cnNvci5saW5lO1xuICAgICAgICB2YXIgY2ggPSBjdXJzb3IuY2g7XG4gICAgICAgIHZhciBsaW5lVGV4dCA9IGNtLmdldExpbmUobGluZSk7XG4gICAgICAgIHZhciBzeW1ib2w7XG4gICAgICAgIGZvciAoOyBjaCA8IGxpbmVUZXh0Lmxlbmd0aDsgY2grKykge1xuICAgICAgICAgIHN5bWJvbCA9IGxpbmVUZXh0LmNoYXJBdChjaCk7XG4gICAgICAgICAgaWYgKHN5bWJvbCAmJiBpc01hdGNoYWJsZVN5bWJvbChzeW1ib2wpKSB7XG4gICAgICAgICAgICB2YXIgc3R5bGUgPSBjbS5nZXRUb2tlblR5cGVBdChQb3MobGluZSwgY2ggKyAxKSk7XG4gICAgICAgICAgICBpZiAoc3R5bGUgIT09IFwic3RyaW5nXCIgJiYgc3R5bGUgIT09IFwiY29tbWVudFwiKSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoY2ggPCBsaW5lVGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAvLyBPbmx5IGluY2x1ZGUgYW5nbGUgYnJhY2tldHMgaW4gYW5hbHlzaXMgaWYgdGhleSBhcmUgYmVpbmcgbWF0Y2hlZC5cbiAgICAgICAgICB2YXIgcmUgPSAoY2ggPT09ICc8JyB8fCBjaCA9PT0gJz4nKSA/IC9bKCl7fVtcXF08Pl0vIDogL1soKXt9W1xcXV0vO1xuICAgICAgICAgIHZhciBtYXRjaGVkID0gY20uZmluZE1hdGNoaW5nQnJhY2tldChQb3MobGluZSwgY2gpLCB7YnJhY2tldFJlZ2V4OiByZX0pO1xuICAgICAgICAgIHJldHVybiBtYXRjaGVkLnRvO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBjdXJzb3I7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBtb3ZlVG9TdGFydE9mTGluZTogZnVuY3Rpb24oX2NtLCBoZWFkKSB7XG4gICAgICAgIHJldHVybiBQb3MoaGVhZC5saW5lLCAwKTtcbiAgICAgIH0sXG4gICAgICBtb3ZlVG9MaW5lT3JFZGdlT2ZEb2N1bWVudDogZnVuY3Rpb24oY20sIF9oZWFkLCBtb3Rpb25BcmdzKSB7XG4gICAgICAgIHZhciBsaW5lTnVtID0gbW90aW9uQXJncy5mb3J3YXJkID8gY20ubGFzdExpbmUoKSA6IGNtLmZpcnN0TGluZSgpO1xuICAgICAgICBpZiAobW90aW9uQXJncy5yZXBlYXRJc0V4cGxpY2l0KSB7XG4gICAgICAgICAgbGluZU51bSA9IG1vdGlvbkFyZ3MucmVwZWF0IC0gY20uZ2V0T3B0aW9uKCdmaXJzdExpbmVOdW1iZXInKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUG9zKGxpbmVOdW0sXG4gICAgICAgICAgICAgICAgICAgZmluZEZpcnN0Tm9uV2hpdGVTcGFjZUNoYXJhY3RlcihjbS5nZXRMaW5lKGxpbmVOdW0pKSk7XG4gICAgICB9LFxuICAgICAgdGV4dE9iamVjdE1hbmlwdWxhdGlvbjogZnVuY3Rpb24oY20sIGhlYWQsIG1vdGlvbkFyZ3MsIHZpbSkge1xuICAgICAgICAvLyBUT0RPOiBsb3RzIG9mIHBvc3NpYmxlIGV4Y2VwdGlvbnMgdGhhdCBjYW4gYmUgdGhyb3duIGhlcmUuIFRyeSBkYShcbiAgICAgICAgLy8gICAgIG91dHNpZGUgb2YgYSAoKSBibG9jay5cbiAgICAgICAgdmFyIG1pcnJvcmVkUGFpcnMgPSB7JygnOiAnKScsICcpJzogJygnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAneyc6ICd9JywgJ30nOiAneycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICdbJzogJ10nLCAnXSc6ICdbJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwnOiAnPicsICc+JzogJzwnfTtcbiAgICAgICAgdmFyIHNlbGZQYWlyZWQgPSB7J1xcJyc6IHRydWUsICdcIic6IHRydWUsICdgJzogdHJ1ZX07XG5cbiAgICAgICAgdmFyIGNoYXJhY3RlciA9IG1vdGlvbkFyZ3Muc2VsZWN0ZWRDaGFyYWN0ZXI7XG4gICAgICAgIC8vICdiJyByZWZlcnMgdG8gICcoKScgYmxvY2suXG4gICAgICAgIC8vICdCJyByZWZlcnMgdG8gICd7fScgYmxvY2suXG4gICAgICAgIGlmIChjaGFyYWN0ZXIgPT0gJ2InKSB7XG4gICAgICAgICAgY2hhcmFjdGVyID0gJygnO1xuICAgICAgICB9IGVsc2UgaWYgKGNoYXJhY3RlciA9PSAnQicpIHtcbiAgICAgICAgICBjaGFyYWN0ZXIgPSAneyc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbmNsdXNpdmUgaXMgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiBhIGFuZCBpXG4gICAgICAgIC8vIFRPRE86IEluc3RlYWQgb2YgdXNpbmcgdGhlIGFkZGl0aW9uYWwgdGV4dCBvYmplY3QgbWFwIHRvIHBlcmZvcm0gdGV4dFxuICAgICAgICAvLyAgICAgb2JqZWN0IG9wZXJhdGlvbnMsIG1lcmdlIHRoZSBtYXAgaW50byB0aGUgZGVmYXVsdEtleU1hcCBhbmQgdXNlXG4gICAgICAgIC8vICAgICBtb3Rpb25BcmdzIHRvIGRlZmluZSBiZWhhdmlvci4gRGVmaW5lIHNlcGFyYXRlIGVudHJpZXMgZm9yICdhdycsXG4gICAgICAgIC8vICAgICAnaXcnLCAnYVsnLCAnaVsnLCBldGMuXG4gICAgICAgIHZhciBpbmNsdXNpdmUgPSAhbW90aW9uQXJncy50ZXh0T2JqZWN0SW5uZXI7XG5cbiAgICAgICAgdmFyIHRtcDtcbiAgICAgICAgaWYgKG1pcnJvcmVkUGFpcnNbY2hhcmFjdGVyXSkge1xuICAgICAgICAgIHRtcCA9IHNlbGVjdENvbXBhbmlvbk9iamVjdChjbSwgaGVhZCwgY2hhcmFjdGVyLCBpbmNsdXNpdmUpO1xuICAgICAgICB9IGVsc2UgaWYgKHNlbGZQYWlyZWRbY2hhcmFjdGVyXSkge1xuICAgICAgICAgIHRtcCA9IGZpbmRCZWdpbm5pbmdBbmRFbmQoY20sIGhlYWQsIGNoYXJhY3RlciwgaW5jbHVzaXZlKTtcbiAgICAgICAgfSBlbHNlIGlmIChjaGFyYWN0ZXIgPT09ICdXJykge1xuICAgICAgICAgIHRtcCA9IGV4cGFuZFdvcmRVbmRlckN1cnNvcihjbSwgaW5jbHVzaXZlLCB0cnVlIC8qKiBmb3J3YXJkICovLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlIC8qKiBiaWdXb3JkICovKTtcbiAgICAgICAgfSBlbHNlIGlmIChjaGFyYWN0ZXIgPT09ICd3Jykge1xuICAgICAgICAgIHRtcCA9IGV4cGFuZFdvcmRVbmRlckN1cnNvcihjbSwgaW5jbHVzaXZlLCB0cnVlIC8qKiBmb3J3YXJkICovLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSAvKiogYmlnV29yZCAqLyk7XG4gICAgICAgIH0gZWxzZSBpZiAoY2hhcmFjdGVyID09PSAncCcpIHtcbiAgICAgICAgICB0bXAgPSBmaW5kUGFyYWdyYXBoKGNtLCBoZWFkLCBtb3Rpb25BcmdzLnJlcGVhdCwgMCwgaW5jbHVzaXZlKTtcbiAgICAgICAgICBtb3Rpb25BcmdzLmxpbmV3aXNlID0gdHJ1ZTtcbiAgICAgICAgICBpZiAodmltLnZpc3VhbE1vZGUpIHtcbiAgICAgICAgICAgIGlmICghdmltLnZpc3VhbExpbmUpIHsgdmltLnZpc3VhbExpbmUgPSB0cnVlOyB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBvcGVyYXRvckFyZ3MgPSB2aW0uaW5wdXRTdGF0ZS5vcGVyYXRvckFyZ3M7XG4gICAgICAgICAgICBpZiAob3BlcmF0b3JBcmdzKSB7IG9wZXJhdG9yQXJncy5saW5ld2lzZSA9IHRydWU7IH1cbiAgICAgICAgICAgIHRtcC5lbmQubGluZS0tO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBObyB0ZXh0IG9iamVjdCBkZWZpbmVkIGZvciB0aGlzLCBkb24ndCBtb3ZlLlxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjbS5zdGF0ZS52aW0udmlzdWFsTW9kZSkge1xuICAgICAgICAgIHJldHVybiBbdG1wLnN0YXJ0LCB0bXAuZW5kXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZXhwYW5kU2VsZWN0aW9uKGNtLCB0bXAuc3RhcnQsIHRtcC5lbmQpO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICByZXBlYXRMYXN0Q2hhcmFjdGVyU2VhcmNoOiBmdW5jdGlvbihjbSwgaGVhZCwgbW90aW9uQXJncykge1xuICAgICAgICB2YXIgbGFzdFNlYXJjaCA9IHZpbUdsb2JhbFN0YXRlLmxhc3RDaGFyYWN0ZXJTZWFyY2g7XG4gICAgICAgIHZhciByZXBlYXQgPSBtb3Rpb25BcmdzLnJlcGVhdDtcbiAgICAgICAgdmFyIGZvcndhcmQgPSBtb3Rpb25BcmdzLmZvcndhcmQgPT09IGxhc3RTZWFyY2guZm9yd2FyZDtcbiAgICAgICAgdmFyIGluY3JlbWVudCA9IChsYXN0U2VhcmNoLmluY3JlbWVudCA/IDEgOiAwKSAqIChmb3J3YXJkID8gLTEgOiAxKTtcbiAgICAgICAgY20ubW92ZUgoLWluY3JlbWVudCwgJ2NoYXInKTtcbiAgICAgICAgbW90aW9uQXJncy5pbmNsdXNpdmUgPSBmb3J3YXJkID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICB2YXIgY3VyRW5kID0gbW92ZVRvQ2hhcmFjdGVyKGNtLCByZXBlYXQsIGZvcndhcmQsIGxhc3RTZWFyY2guc2VsZWN0ZWRDaGFyYWN0ZXIpO1xuICAgICAgICBpZiAoIWN1ckVuZCkge1xuICAgICAgICAgIGNtLm1vdmVIKGluY3JlbWVudCwgJ2NoYXInKTtcbiAgICAgICAgICByZXR1cm4gaGVhZDtcbiAgICAgICAgfVxuICAgICAgICBjdXJFbmQuY2ggKz0gaW5jcmVtZW50O1xuICAgICAgICByZXR1cm4gY3VyRW5kO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBkZWZpbmVNb3Rpb24obmFtZSwgZm4pIHtcbiAgICAgIG1vdGlvbnNbbmFtZV0gPSBmbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaWxsQXJyYXkodmFsLCB0aW1lcykge1xuICAgICAgdmFyIGFyciA9IFtdO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aW1lczsgaSsrKSB7XG4gICAgICAgIGFyci5wdXNoKHZhbCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYXJyO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBbiBvcGVyYXRvciBhY3RzIG9uIGEgdGV4dCBzZWxlY3Rpb24uIEl0IHJlY2VpdmVzIHRoZSBsaXN0IG9mIHNlbGVjdGlvbnNcbiAgICAgKiBhcyBpbnB1dC4gVGhlIGNvcnJlc3BvbmRpbmcgQ29kZU1pcnJvciBzZWxlY3Rpb24gaXMgZ3VhcmFudGVlZCB0b1xuICAgICogbWF0Y2ggdGhlIGlucHV0IHNlbGVjdGlvbi5cbiAgICAgKi9cbiAgICB2YXIgb3BlcmF0b3JzID0ge1xuICAgICAgY2hhbmdlOiBmdW5jdGlvbihjbSwgYXJncywgcmFuZ2VzKSB7XG4gICAgICAgIHZhciBmaW5hbEhlYWQsIHRleHQ7XG4gICAgICAgIHZhciB2aW0gPSBjbS5zdGF0ZS52aW07XG4gICAgICAgIHZhciBhbmNob3IgPSByYW5nZXNbMF0uYW5jaG9yLFxuICAgICAgICAgICAgaGVhZCA9IHJhbmdlc1swXS5oZWFkO1xuICAgICAgICBpZiAoIXZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgICAgdGV4dCA9IGNtLmdldFJhbmdlKGFuY2hvciwgaGVhZCk7XG4gICAgICAgICAgdmFyIGxhc3RTdGF0ZSA9IHZpbS5sYXN0RWRpdElucHV0U3RhdGUgfHwge307XG4gICAgICAgICAgaWYgKGxhc3RTdGF0ZS5tb3Rpb24gPT0gXCJtb3ZlQnlXb3Jkc1wiICYmICFpc1doaXRlU3BhY2VTdHJpbmcodGV4dCkpIHtcbiAgICAgICAgICAgIC8vIEV4Y2x1ZGUgdHJhaWxpbmcgd2hpdGVzcGFjZSBpZiB0aGUgcmFuZ2UgaXMgbm90IGFsbCB3aGl0ZXNwYWNlLlxuICAgICAgICAgICAgdmFyIG1hdGNoID0gKC9cXHMrJC8pLmV4ZWModGV4dCk7XG4gICAgICAgICAgICBpZiAobWF0Y2ggJiYgbGFzdFN0YXRlLm1vdGlvbkFyZ3MgJiYgbGFzdFN0YXRlLm1vdGlvbkFyZ3MuZm9yd2FyZCkge1xuICAgICAgICAgICAgICBoZWFkID0gb2Zmc2V0Q3Vyc29yKGhlYWQsIDAsIC0gbWF0Y2hbMF0ubGVuZ3RoKTtcbiAgICAgICAgICAgICAgdGV4dCA9IHRleHQuc2xpY2UoMCwgLSBtYXRjaFswXS5sZW5ndGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgcHJldkxpbmVFbmQgPSBuZXcgUG9zKGFuY2hvci5saW5lIC0gMSwgTnVtYmVyLk1BWF9WQUxVRSk7XG4gICAgICAgICAgdmFyIHdhc0xhc3RMaW5lID0gY20uZmlyc3RMaW5lKCkgPT0gY20ubGFzdExpbmUoKTtcbiAgICAgICAgICBpZiAoaGVhZC5saW5lID4gY20ubGFzdExpbmUoKSAmJiBhcmdzLmxpbmV3aXNlICYmICF3YXNMYXN0TGluZSkge1xuICAgICAgICAgICAgY20ucmVwbGFjZVJhbmdlKCcnLCBwcmV2TGluZUVuZCwgaGVhZCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNtLnJlcGxhY2VSYW5nZSgnJywgYW5jaG9yLCBoZWFkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGFyZ3MubGluZXdpc2UpIHtcbiAgICAgICAgICAgIC8vIFB1c2ggdGhlIG5leHQgbGluZSBiYWNrIGRvd24sIGlmIHRoZXJlIGlzIGEgbmV4dCBsaW5lLlxuICAgICAgICAgICAgaWYgKCF3YXNMYXN0TGluZSkge1xuICAgICAgICAgICAgICBjbS5zZXRDdXJzb3IocHJldkxpbmVFbmQpO1xuICAgICAgICAgICAgICBDb2RlTWlycm9yLmNvbW1hbmRzLm5ld2xpbmVBbmRJbmRlbnQoY20pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gbWFrZSBzdXJlIGN1cnNvciBlbmRzIHVwIGF0IHRoZSBlbmQgb2YgdGhlIGxpbmUuXG4gICAgICAgICAgICBhbmNob3IuY2ggPSBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmaW5hbEhlYWQgPSBhbmNob3I7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJncy5mdWxsTGluZSkge1xuICAgICAgICAgICAgaGVhZC5jaCA9IE51bWJlci5NQVhfVkFMVUU7XG4gICAgICAgICAgICBoZWFkLmxpbmUtLTtcbiAgICAgICAgICAgIGNtLnNldFNlbGVjdGlvbihhbmNob3IsIGhlYWQpXG4gICAgICAgICAgICB0ZXh0ID0gY20uZ2V0U2VsZWN0aW9uKCk7XG4gICAgICAgICAgICBjbS5yZXBsYWNlU2VsZWN0aW9uKFwiXCIpO1xuICAgICAgICAgICAgZmluYWxIZWFkID0gYW5jaG9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRleHQgPSBjbS5nZXRTZWxlY3Rpb24oKTtcbiAgICAgICAgICB2YXIgcmVwbGFjZW1lbnQgPSBmaWxsQXJyYXkoJycsIHJhbmdlcy5sZW5ndGgpO1xuICAgICAgICAgIGNtLnJlcGxhY2VTZWxlY3Rpb25zKHJlcGxhY2VtZW50KTtcbiAgICAgICAgICBmaW5hbEhlYWQgPSBjdXJzb3JNaW4ocmFuZ2VzWzBdLmhlYWQsIHJhbmdlc1swXS5hbmNob3IpO1xuICAgICAgICB9XG4gICAgICAgIHZpbUdsb2JhbFN0YXRlLnJlZ2lzdGVyQ29udHJvbGxlci5wdXNoVGV4dChcbiAgICAgICAgICAgIGFyZ3MucmVnaXN0ZXJOYW1lLCAnY2hhbmdlJywgdGV4dCxcbiAgICAgICAgICAgIGFyZ3MubGluZXdpc2UsIHJhbmdlcy5sZW5ndGggPiAxKTtcbiAgICAgICAgYWN0aW9ucy5lbnRlckluc2VydE1vZGUoY20sIHtoZWFkOiBmaW5hbEhlYWR9LCBjbS5zdGF0ZS52aW0pO1xuICAgICAgfSxcbiAgICAgIC8vIGRlbGV0ZSBpcyBhIGphdmFzY3JpcHQga2V5d29yZC5cbiAgICAgICdkZWxldGUnOiBmdW5jdGlvbihjbSwgYXJncywgcmFuZ2VzKSB7XG4gICAgICAgIHZhciBmaW5hbEhlYWQsIHRleHQ7XG4gICAgICAgIHZhciB2aW0gPSBjbS5zdGF0ZS52aW07XG4gICAgICAgIGlmICghdmltLnZpc3VhbEJsb2NrKSB7XG4gICAgICAgICAgdmFyIGFuY2hvciA9IHJhbmdlc1swXS5hbmNob3IsXG4gICAgICAgICAgICAgIGhlYWQgPSByYW5nZXNbMF0uaGVhZDtcbiAgICAgICAgICBpZiAoYXJncy5saW5ld2lzZSAmJlxuICAgICAgICAgICAgICBoZWFkLmxpbmUgIT0gY20uZmlyc3RMaW5lKCkgJiZcbiAgICAgICAgICAgICAgYW5jaG9yLmxpbmUgPT0gY20ubGFzdExpbmUoKSAmJlxuICAgICAgICAgICAgICBhbmNob3IubGluZSA9PSBoZWFkLmxpbmUgLSAxKSB7XG4gICAgICAgICAgICAvLyBTcGVjaWFsIGNhc2UgZm9yIGRkIG9uIGxhc3QgbGluZSAoYW5kIGZpcnN0IGxpbmUpLlxuICAgICAgICAgICAgaWYgKGFuY2hvci5saW5lID09IGNtLmZpcnN0TGluZSgpKSB7XG4gICAgICAgICAgICAgIGFuY2hvci5jaCA9IDA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhbmNob3IgPSBQb3MoYW5jaG9yLmxpbmUgLSAxLCBsaW5lTGVuZ3RoKGNtLCBhbmNob3IubGluZSAtIDEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgdGV4dCA9IGNtLmdldFJhbmdlKGFuY2hvciwgaGVhZCk7XG4gICAgICAgICAgY20ucmVwbGFjZVJhbmdlKCcnLCBhbmNob3IsIGhlYWQpO1xuICAgICAgICAgIGZpbmFsSGVhZCA9IGFuY2hvcjtcbiAgICAgICAgICBpZiAoYXJncy5saW5ld2lzZSkge1xuICAgICAgICAgICAgZmluYWxIZWFkID0gbW90aW9ucy5tb3ZlVG9GaXJzdE5vbldoaXRlU3BhY2VDaGFyYWN0ZXIoY20sIGFuY2hvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRleHQgPSBjbS5nZXRTZWxlY3Rpb24oKTtcbiAgICAgICAgICB2YXIgcmVwbGFjZW1lbnQgPSBmaWxsQXJyYXkoJycsIHJhbmdlcy5sZW5ndGgpO1xuICAgICAgICAgIGNtLnJlcGxhY2VTZWxlY3Rpb25zKHJlcGxhY2VtZW50KTtcbiAgICAgICAgICBmaW5hbEhlYWQgPSByYW5nZXNbMF0uYW5jaG9yO1xuICAgICAgICB9XG4gICAgICAgIHZpbUdsb2JhbFN0YXRlLnJlZ2lzdGVyQ29udHJvbGxlci5wdXNoVGV4dChcbiAgICAgICAgICAgIGFyZ3MucmVnaXN0ZXJOYW1lLCAnZGVsZXRlJywgdGV4dCxcbiAgICAgICAgICAgIGFyZ3MubGluZXdpc2UsIHZpbS52aXN1YWxCbG9jayk7XG4gICAgICAgIHJldHVybiBjbGlwQ3Vyc29yVG9Db250ZW50KGNtLCBmaW5hbEhlYWQpO1xuICAgICAgfSxcbiAgICAgIGluZGVudDogZnVuY3Rpb24oY20sIGFyZ3MsIHJhbmdlcykge1xuICAgICAgICB2YXIgdmltID0gY20uc3RhdGUudmltO1xuICAgICAgICB2YXIgc3RhcnRMaW5lID0gcmFuZ2VzWzBdLmFuY2hvci5saW5lO1xuICAgICAgICB2YXIgZW5kTGluZSA9IHZpbS52aXN1YWxCbG9jayA/XG4gICAgICAgICAgcmFuZ2VzW3Jhbmdlcy5sZW5ndGggLSAxXS5hbmNob3IubGluZSA6XG4gICAgICAgICAgcmFuZ2VzWzBdLmhlYWQubGluZTtcbiAgICAgICAgLy8gSW4gdmlzdWFsIG1vZGUsIG4+IHNoaWZ0cyB0aGUgc2VsZWN0aW9uIHJpZ2h0IG4gdGltZXMsIGluc3RlYWQgb2ZcbiAgICAgICAgLy8gc2hpZnRpbmcgbiBsaW5lcyByaWdodCBvbmNlLlxuICAgICAgICB2YXIgcmVwZWF0ID0gKHZpbS52aXN1YWxNb2RlKSA/IGFyZ3MucmVwZWF0IDogMTtcbiAgICAgICAgaWYgKGFyZ3MubGluZXdpc2UpIHtcbiAgICAgICAgICAvLyBUaGUgb25seSB3YXkgdG8gZGVsZXRlIGEgbmV3bGluZSBpcyB0byBkZWxldGUgdW50aWwgdGhlIHN0YXJ0IG9mXG4gICAgICAgICAgLy8gdGhlIG5leHQgbGluZSwgc28gaW4gbGluZXdpc2UgbW9kZSBldmFsSW5wdXQgd2lsbCBpbmNsdWRlIHRoZSBuZXh0XG4gICAgICAgICAgLy8gbGluZS4gV2UgZG9uJ3Qgd2FudCB0aGlzIGluIGluZGVudCwgc28gd2UgZ28gYmFjayBhIGxpbmUuXG4gICAgICAgICAgZW5kTGluZS0tO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSBzdGFydExpbmU7IGkgPD0gZW5kTGluZTsgaSsrKSB7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCByZXBlYXQ7IGorKykge1xuICAgICAgICAgICAgY20uaW5kZW50TGluZShpLCBhcmdzLmluZGVudFJpZ2h0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1vdGlvbnMubW92ZVRvRmlyc3ROb25XaGl0ZVNwYWNlQ2hhcmFjdGVyKGNtLCByYW5nZXNbMF0uYW5jaG9yKTtcbiAgICAgIH0sXG4gICAgICBpbmRlbnRBdXRvOiBmdW5jdGlvbihjbSwgX2FyZ3MsIHJhbmdlcykge1xuICAgICAgICBjbS5leGVjQ29tbWFuZChcImluZGVudEF1dG9cIik7XG4gICAgICAgIHJldHVybiBtb3Rpb25zLm1vdmVUb0ZpcnN0Tm9uV2hpdGVTcGFjZUNoYXJhY3RlcihjbSwgcmFuZ2VzWzBdLmFuY2hvcik7XG4gICAgICB9LFxuICAgICAgY2hhbmdlQ2FzZTogZnVuY3Rpb24oY20sIGFyZ3MsIHJhbmdlcywgb2xkQW5jaG9yLCBuZXdIZWFkKSB7XG4gICAgICAgIHZhciBzZWxlY3Rpb25zID0gY20uZ2V0U2VsZWN0aW9ucygpO1xuICAgICAgICB2YXIgc3dhcHBlZCA9IFtdO1xuICAgICAgICB2YXIgdG9Mb3dlciA9IGFyZ3MudG9Mb3dlcjtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzZWxlY3Rpb25zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgdmFyIHRvU3dhcCA9IHNlbGVjdGlvbnNbal07XG4gICAgICAgICAgdmFyIHRleHQgPSAnJztcbiAgICAgICAgICBpZiAodG9Mb3dlciA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGV4dCA9IHRvU3dhcC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgIH0gZWxzZSBpZiAodG9Mb3dlciA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRleHQgPSB0b1N3YXAudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b1N3YXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgdmFyIGNoYXJhY3RlciA9IHRvU3dhcC5jaGFyQXQoaSk7XG4gICAgICAgICAgICAgIHRleHQgKz0gaXNVcHBlckNhc2UoY2hhcmFjdGVyKSA/IGNoYXJhY3Rlci50b0xvd2VyQ2FzZSgpIDpcbiAgICAgICAgICAgICAgICAgIGNoYXJhY3Rlci50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBzd2FwcGVkLnB1c2godGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgY20ucmVwbGFjZVNlbGVjdGlvbnMoc3dhcHBlZCk7XG4gICAgICAgIGlmIChhcmdzLnNob3VsZE1vdmVDdXJzb3Ipe1xuICAgICAgICAgIHJldHVybiBuZXdIZWFkO1xuICAgICAgICB9IGVsc2UgaWYgKCFjbS5zdGF0ZS52aW0udmlzdWFsTW9kZSAmJiBhcmdzLmxpbmV3aXNlICYmIHJhbmdlc1swXS5hbmNob3IubGluZSArIDEgPT0gcmFuZ2VzWzBdLmhlYWQubGluZSkge1xuICAgICAgICAgIHJldHVybiBtb3Rpb25zLm1vdmVUb0ZpcnN0Tm9uV2hpdGVTcGFjZUNoYXJhY3RlcihjbSwgb2xkQW5jaG9yKTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmdzLmxpbmV3aXNlKXtcbiAgICAgICAgICByZXR1cm4gb2xkQW5jaG9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBjdXJzb3JNaW4ocmFuZ2VzWzBdLmFuY2hvciwgcmFuZ2VzWzBdLmhlYWQpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgeWFuazogZnVuY3Rpb24oY20sIGFyZ3MsIHJhbmdlcywgb2xkQW5jaG9yKSB7XG4gICAgICAgIHZhciB2aW0gPSBjbS5zdGF0ZS52aW07XG4gICAgICAgIHZhciB0ZXh0ID0gY20uZ2V0U2VsZWN0aW9uKCk7XG4gICAgICAgIHZhciBlbmRQb3MgPSB2aW0udmlzdWFsTW9kZVxuICAgICAgICAgID8gY3Vyc29yTWluKHZpbS5zZWwuYW5jaG9yLCB2aW0uc2VsLmhlYWQsIHJhbmdlc1swXS5oZWFkLCByYW5nZXNbMF0uYW5jaG9yKVxuICAgICAgICAgIDogb2xkQW5jaG9yO1xuICAgICAgICB2aW1HbG9iYWxTdGF0ZS5yZWdpc3RlckNvbnRyb2xsZXIucHVzaFRleHQoXG4gICAgICAgICAgICBhcmdzLnJlZ2lzdGVyTmFtZSwgJ3lhbmsnLFxuICAgICAgICAgICAgdGV4dCwgYXJncy5saW5ld2lzZSwgdmltLnZpc3VhbEJsb2NrKTtcbiAgICAgICAgcmV0dXJuIGVuZFBvcztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZGVmaW5lT3BlcmF0b3IobmFtZSwgZm4pIHtcbiAgICAgIG9wZXJhdG9yc1tuYW1lXSA9IGZuO1xuICAgIH1cblxuICAgIHZhciBhY3Rpb25zID0ge1xuICAgICAganVtcExpc3RXYWxrOiBmdW5jdGlvbihjbSwgYWN0aW9uQXJncywgdmltKSB7XG4gICAgICAgIGlmICh2aW0udmlzdWFsTW9kZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVwZWF0ID0gYWN0aW9uQXJncy5yZXBlYXQ7XG4gICAgICAgIHZhciBmb3J3YXJkID0gYWN0aW9uQXJncy5mb3J3YXJkO1xuICAgICAgICB2YXIganVtcExpc3QgPSB2aW1HbG9iYWxTdGF0ZS5qdW1wTGlzdDtcblxuICAgICAgICB2YXIgbWFyayA9IGp1bXBMaXN0Lm1vdmUoY20sIGZvcndhcmQgPyByZXBlYXQgOiAtcmVwZWF0KTtcbiAgICAgICAgdmFyIG1hcmtQb3MgPSBtYXJrID8gbWFyay5maW5kKCkgOiB1bmRlZmluZWQ7XG4gICAgICAgIG1hcmtQb3MgPSBtYXJrUG9zID8gbWFya1BvcyA6IGNtLmdldEN1cnNvcigpO1xuICAgICAgICBjbS5zZXRDdXJzb3IobWFya1Bvcyk7XG4gICAgICB9LFxuICAgICAgc2Nyb2xsOiBmdW5jdGlvbihjbSwgYWN0aW9uQXJncywgdmltKSB7XG4gICAgICAgIGlmICh2aW0udmlzdWFsTW9kZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVwZWF0ID0gYWN0aW9uQXJncy5yZXBlYXQgfHwgMTtcbiAgICAgICAgdmFyIGxpbmVIZWlnaHQgPSBjbS5kZWZhdWx0VGV4dEhlaWdodCgpO1xuICAgICAgICB2YXIgdG9wID0gY20uZ2V0U2Nyb2xsSW5mbygpLnRvcDtcbiAgICAgICAgdmFyIGRlbHRhID0gbGluZUhlaWdodCAqIHJlcGVhdDtcbiAgICAgICAgdmFyIG5ld1BvcyA9IGFjdGlvbkFyZ3MuZm9yd2FyZCA/IHRvcCArIGRlbHRhIDogdG9wIC0gZGVsdGE7XG4gICAgICAgIHZhciBjdXJzb3IgPSBjb3B5Q3Vyc29yKGNtLmdldEN1cnNvcigpKTtcbiAgICAgICAgdmFyIGN1cnNvckNvb3JkcyA9IGNtLmNoYXJDb29yZHMoY3Vyc29yLCAnbG9jYWwnKTtcbiAgICAgICAgaWYgKGFjdGlvbkFyZ3MuZm9yd2FyZCkge1xuICAgICAgICAgIGlmIChuZXdQb3MgPiBjdXJzb3JDb29yZHMudG9wKSB7XG4gICAgICAgICAgICAgY3Vyc29yLmxpbmUgKz0gKG5ld1BvcyAtIGN1cnNvckNvb3Jkcy50b3ApIC8gbGluZUhlaWdodDtcbiAgICAgICAgICAgICBjdXJzb3IubGluZSA9IE1hdGguY2VpbChjdXJzb3IubGluZSk7XG4gICAgICAgICAgICAgY20uc2V0Q3Vyc29yKGN1cnNvcik7XG4gICAgICAgICAgICAgY3Vyc29yQ29vcmRzID0gY20uY2hhckNvb3JkcyhjdXJzb3IsICdsb2NhbCcpO1xuICAgICAgICAgICAgIGNtLnNjcm9sbFRvKG51bGwsIGN1cnNvckNvb3Jkcy50b3ApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgLy8gQ3Vyc29yIHN0YXlzIHdpdGhpbiBib3VuZHMuICBKdXN0IHJlcG9zaXRpb24gdGhlIHNjcm9sbCB3aW5kb3cuXG4gICAgICAgICAgICAgY20uc2Nyb2xsVG8obnVsbCwgbmV3UG9zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIG5ld0JvdHRvbSA9IG5ld1BvcyArIGNtLmdldFNjcm9sbEluZm8oKS5jbGllbnRIZWlnaHQ7XG4gICAgICAgICAgaWYgKG5ld0JvdHRvbSA8IGN1cnNvckNvb3Jkcy5ib3R0b20pIHtcbiAgICAgICAgICAgICBjdXJzb3IubGluZSAtPSAoY3Vyc29yQ29vcmRzLmJvdHRvbSAtIG5ld0JvdHRvbSkgLyBsaW5lSGVpZ2h0O1xuICAgICAgICAgICAgIGN1cnNvci5saW5lID0gTWF0aC5mbG9vcihjdXJzb3IubGluZSk7XG4gICAgICAgICAgICAgY20uc2V0Q3Vyc29yKGN1cnNvcik7XG4gICAgICAgICAgICAgY3Vyc29yQ29vcmRzID0gY20uY2hhckNvb3JkcyhjdXJzb3IsICdsb2NhbCcpO1xuICAgICAgICAgICAgIGNtLnNjcm9sbFRvKFxuICAgICAgICAgICAgICAgICBudWxsLCBjdXJzb3JDb29yZHMuYm90dG9tIC0gY20uZ2V0U2Nyb2xsSW5mbygpLmNsaWVudEhlaWdodCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAvLyBDdXJzb3Igc3RheXMgd2l0aGluIGJvdW5kcy4gIEp1c3QgcmVwb3NpdGlvbiB0aGUgc2Nyb2xsIHdpbmRvdy5cbiAgICAgICAgICAgICBjbS5zY3JvbGxUbyhudWxsLCBuZXdQb3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHNjcm9sbFRvQ3Vyc29yOiBmdW5jdGlvbihjbSwgYWN0aW9uQXJncykge1xuICAgICAgICB2YXIgbGluZU51bSA9IGNtLmdldEN1cnNvcigpLmxpbmU7XG4gICAgICAgIHZhciBjaGFyQ29vcmRzID0gY20uY2hhckNvb3JkcyhQb3MobGluZU51bSwgMCksICdsb2NhbCcpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gY20uZ2V0U2Nyb2xsSW5mbygpLmNsaWVudEhlaWdodDtcbiAgICAgICAgdmFyIHkgPSBjaGFyQ29vcmRzLnRvcDtcbiAgICAgICAgdmFyIGxpbmVIZWlnaHQgPSBjaGFyQ29vcmRzLmJvdHRvbSAtIHk7XG4gICAgICAgIHN3aXRjaCAoYWN0aW9uQXJncy5wb3NpdGlvbikge1xuICAgICAgICAgIGNhc2UgJ2NlbnRlcic6IHkgPSB5IC0gKGhlaWdodCAvIDIpICsgbGluZUhlaWdodDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2JvdHRvbSc6IHkgPSB5IC0gaGVpZ2h0ICsgbGluZUhlaWdodDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNtLnNjcm9sbFRvKG51bGwsIHkpO1xuICAgICAgfSxcbiAgICAgIHJlcGxheU1hY3JvOiBmdW5jdGlvbihjbSwgYWN0aW9uQXJncywgdmltKSB7XG4gICAgICAgIHZhciByZWdpc3Rlck5hbWUgPSBhY3Rpb25BcmdzLnNlbGVjdGVkQ2hhcmFjdGVyO1xuICAgICAgICB2YXIgcmVwZWF0ID0gYWN0aW9uQXJncy5yZXBlYXQ7XG4gICAgICAgIHZhciBtYWNyb01vZGVTdGF0ZSA9IHZpbUdsb2JhbFN0YXRlLm1hY3JvTW9kZVN0YXRlO1xuICAgICAgICBpZiAocmVnaXN0ZXJOYW1lID09ICdAJykge1xuICAgICAgICAgIHJlZ2lzdGVyTmFtZSA9IG1hY3JvTW9kZVN0YXRlLmxhdGVzdFJlZ2lzdGVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1hY3JvTW9kZVN0YXRlLmxhdGVzdFJlZ2lzdGVyID0gcmVnaXN0ZXJOYW1lO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlKHJlcGVhdC0tKXtcbiAgICAgICAgICBleGVjdXRlTWFjcm9SZWdpc3RlcihjbSwgdmltLCBtYWNyb01vZGVTdGF0ZSwgcmVnaXN0ZXJOYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGVudGVyTWFjcm9SZWNvcmRNb2RlOiBmdW5jdGlvbihjbSwgYWN0aW9uQXJncykge1xuICAgICAgICB2YXIgbWFjcm9Nb2RlU3RhdGUgPSB2aW1HbG9iYWxTdGF0ZS5tYWNyb01vZGVTdGF0ZTtcbiAgICAgICAgdmFyIHJlZ2lzdGVyTmFtZSA9IGFjdGlvbkFyZ3Muc2VsZWN0ZWRDaGFyYWN0ZXI7XG4gICAgICAgIGlmICh2aW1HbG9iYWxTdGF0ZS5yZWdpc3RlckNvbnRyb2xsZXIuaXNWYWxpZFJlZ2lzdGVyKHJlZ2lzdGVyTmFtZSkpIHtcbiAgICAgICAgICBtYWNyb01vZGVTdGF0ZS5lbnRlck1hY3JvUmVjb3JkTW9kZShjbSwgcmVnaXN0ZXJOYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHRvZ2dsZU92ZXJ3cml0ZTogZnVuY3Rpb24oY20pIHtcbiAgICAgICAgaWYgKCFjbS5zdGF0ZS5vdmVyd3JpdGUpIHtcbiAgICAgICAgICBjbS50b2dnbGVPdmVyd3JpdGUodHJ1ZSk7XG4gICAgICAgICAgY20uc2V0T3B0aW9uKCdrZXlNYXAnLCAndmltLXJlcGxhY2UnKTtcbiAgICAgICAgICBDb2RlTWlycm9yLnNpZ25hbChjbSwgXCJ2aW0tbW9kZS1jaGFuZ2VcIiwge21vZGU6IFwicmVwbGFjZVwifSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY20udG9nZ2xlT3ZlcndyaXRlKGZhbHNlKTtcbiAgICAgICAgICBjbS5zZXRPcHRpb24oJ2tleU1hcCcsICd2aW0taW5zZXJ0Jyk7XG4gICAgICAgICAgQ29kZU1pcnJvci5zaWduYWwoY20sIFwidmltLW1vZGUtY2hhbmdlXCIsIHttb2RlOiBcImluc2VydFwifSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBlbnRlckluc2VydE1vZGU6IGZ1bmN0aW9uKGNtLCBhY3Rpb25BcmdzLCB2aW0pIHtcbiAgICAgICAgaWYgKGNtLmdldE9wdGlvbigncmVhZE9ubHknKSkgeyByZXR1cm47IH1cbiAgICAgICAgdmltLmluc2VydE1vZGUgPSB0cnVlO1xuICAgICAgICB2aW0uaW5zZXJ0TW9kZVJlcGVhdCA9IGFjdGlvbkFyZ3MgJiYgYWN0aW9uQXJncy5yZXBlYXQgfHwgMTtcbiAgICAgICAgdmFyIGluc2VydEF0ID0gKGFjdGlvbkFyZ3MpID8gYWN0aW9uQXJncy5pbnNlcnRBdCA6IG51bGw7XG4gICAgICAgIHZhciBzZWwgPSB2aW0uc2VsO1xuICAgICAgICB2YXIgaGVhZCA9IGFjdGlvbkFyZ3MuaGVhZCB8fCBjbS5nZXRDdXJzb3IoJ2hlYWQnKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IGNtLmxpc3RTZWxlY3Rpb25zKCkubGVuZ3RoO1xuICAgICAgICBpZiAoaW5zZXJ0QXQgPT0gJ2VvbCcpIHtcbiAgICAgICAgICBoZWFkID0gUG9zKGhlYWQubGluZSwgbGluZUxlbmd0aChjbSwgaGVhZC5saW5lKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5zZXJ0QXQgPT0gJ2JvbCcpIHtcbiAgICAgICAgICBoZWFkID0gUG9zKGhlYWQubGluZSwgMCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5zZXJ0QXQgPT0gJ2NoYXJBZnRlcicpIHtcbiAgICAgICAgICBoZWFkID0gb2Zmc2V0Q3Vyc29yKGhlYWQsIDAsIDEpO1xuICAgICAgICB9IGVsc2UgaWYgKGluc2VydEF0ID09ICdmaXJzdE5vbkJsYW5rJykge1xuICAgICAgICAgIGhlYWQgPSBtb3Rpb25zLm1vdmVUb0ZpcnN0Tm9uV2hpdGVTcGFjZUNoYXJhY3RlcihjbSwgaGVhZCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5zZXJ0QXQgPT0gJ3N0YXJ0T2ZTZWxlY3RlZEFyZWEnKSB7XG4gICAgICAgICAgaWYgKCF2aW0udmlzdWFsTW9kZSlcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIGlmICghdmltLnZpc3VhbEJsb2NrKSB7XG4gICAgICAgICAgICBpZiAoc2VsLmhlYWQubGluZSA8IHNlbC5hbmNob3IubGluZSkge1xuICAgICAgICAgICAgICBoZWFkID0gc2VsLmhlYWQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBoZWFkID0gUG9zKHNlbC5hbmNob3IubGluZSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhlYWQgPSBQb3MoXG4gICAgICAgICAgICAgICAgTWF0aC5taW4oc2VsLmhlYWQubGluZSwgc2VsLmFuY2hvci5saW5lKSxcbiAgICAgICAgICAgICAgICBNYXRoLm1pbihzZWwuaGVhZC5jaCwgc2VsLmFuY2hvci5jaCkpO1xuICAgICAgICAgICAgaGVpZ2h0ID0gTWF0aC5hYnMoc2VsLmhlYWQubGluZSAtIHNlbC5hbmNob3IubGluZSkgKyAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChpbnNlcnRBdCA9PSAnZW5kT2ZTZWxlY3RlZEFyZWEnKSB7XG4gICAgICAgICAgICBpZiAoIXZpbS52aXN1YWxNb2RlKVxuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgaWYgKCF2aW0udmlzdWFsQmxvY2spIHtcbiAgICAgICAgICAgIGlmIChzZWwuaGVhZC5saW5lID49IHNlbC5hbmNob3IubGluZSkge1xuICAgICAgICAgICAgICBoZWFkID0gb2Zmc2V0Q3Vyc29yKHNlbC5oZWFkLCAwLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGhlYWQgPSBQb3Moc2VsLmFuY2hvci5saW5lLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGVhZCA9IFBvcyhcbiAgICAgICAgICAgICAgICBNYXRoLm1pbihzZWwuaGVhZC5saW5lLCBzZWwuYW5jaG9yLmxpbmUpLFxuICAgICAgICAgICAgICAgIE1hdGgubWF4KHNlbC5oZWFkLmNoICsgMSwgc2VsLmFuY2hvci5jaCkpO1xuICAgICAgICAgICAgaGVpZ2h0ID0gTWF0aC5hYnMoc2VsLmhlYWQubGluZSAtIHNlbC5hbmNob3IubGluZSkgKyAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChpbnNlcnRBdCA9PSAnaW5wbGFjZScpIHtcbiAgICAgICAgICBpZiAodmltLnZpc3VhbE1vZGUpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChpbnNlcnRBdCA9PSAnbGFzdEVkaXQnKSB7XG4gICAgICAgICAgaGVhZCA9IGdldExhc3RFZGl0UG9zKGNtKSB8fCBoZWFkO1xuICAgICAgICB9XG4gICAgICAgIGNtLnNldE9wdGlvbignZGlzYWJsZUlucHV0JywgZmFsc2UpO1xuICAgICAgICBpZiAoYWN0aW9uQXJncyAmJiBhY3Rpb25BcmdzLnJlcGxhY2UpIHtcbiAgICAgICAgICAvLyBIYW5kbGUgUmVwbGFjZS1tb2RlIGFzIGEgc3BlY2lhbCBjYXNlIG9mIGluc2VydCBtb2RlLlxuICAgICAgICAgIGNtLnRvZ2dsZU92ZXJ3cml0ZSh0cnVlKTtcbiAgICAgICAgICBjbS5zZXRPcHRpb24oJ2tleU1hcCcsICd2aW0tcmVwbGFjZScpO1xuICAgICAgICAgIENvZGVNaXJyb3Iuc2lnbmFsKGNtLCBcInZpbS1tb2RlLWNoYW5nZVwiLCB7bW9kZTogXCJyZXBsYWNlXCJ9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjbS50b2dnbGVPdmVyd3JpdGUoZmFsc2UpO1xuICAgICAgICAgIGNtLnNldE9wdGlvbigna2V5TWFwJywgJ3ZpbS1pbnNlcnQnKTtcbiAgICAgICAgICBDb2RlTWlycm9yLnNpZ25hbChjbSwgXCJ2aW0tbW9kZS1jaGFuZ2VcIiwge21vZGU6IFwiaW5zZXJ0XCJ9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXZpbUdsb2JhbFN0YXRlLm1hY3JvTW9kZVN0YXRlLmlzUGxheWluZykge1xuICAgICAgICAgIC8vIE9ubHkgcmVjb3JkIGlmIG5vdCByZXBsYXlpbmcuXG4gICAgICAgICAgY20ub24oJ2NoYW5nZScsIG9uQ2hhbmdlKTtcbiAgICAgICAgICBDb2RlTWlycm9yLm9uKGNtLmdldElucHV0RmllbGQoKSwgJ2tleWRvd24nLCBvbktleUV2ZW50VGFyZ2V0S2V5RG93bik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgICAgZXhpdFZpc3VhbE1vZGUoY20pO1xuICAgICAgICB9XG4gICAgICAgIHNlbGVjdEZvckluc2VydChjbSwgaGVhZCwgaGVpZ2h0KTtcbiAgICAgIH0sXG4gICAgICB0b2dnbGVWaXN1YWxNb2RlOiBmdW5jdGlvbihjbSwgYWN0aW9uQXJncywgdmltKSB7XG4gICAgICAgIHZhciByZXBlYXQgPSBhY3Rpb25BcmdzLnJlcGVhdDtcbiAgICAgICAgdmFyIGFuY2hvciA9IGNtLmdldEN1cnNvcigpO1xuICAgICAgICB2YXIgaGVhZDtcbiAgICAgICAgLy8gVE9ETzogVGhlIHJlcGVhdCBzaG91bGQgYWN0dWFsbHkgc2VsZWN0IG51bWJlciBvZiBjaGFyYWN0ZXJzL2xpbmVzXG4gICAgICAgIC8vICAgICBlcXVhbCB0byB0aGUgcmVwZWF0IHRpbWVzIHRoZSBzaXplIG9mIHRoZSBwcmV2aW91cyB2aXN1YWxcbiAgICAgICAgLy8gICAgIG9wZXJhdGlvbi5cbiAgICAgICAgaWYgKCF2aW0udmlzdWFsTW9kZSkge1xuICAgICAgICAgIC8vIEVudGVyaW5nIHZpc3VhbCBtb2RlXG4gICAgICAgICAgdmltLnZpc3VhbE1vZGUgPSB0cnVlO1xuICAgICAgICAgIHZpbS52aXN1YWxMaW5lID0gISFhY3Rpb25BcmdzLmxpbmV3aXNlO1xuICAgICAgICAgIHZpbS52aXN1YWxCbG9jayA9ICEhYWN0aW9uQXJncy5ibG9ja3dpc2U7XG4gICAgICAgICAgaGVhZCA9IGNsaXBDdXJzb3JUb0NvbnRlbnQoXG4gICAgICAgICAgICAgIGNtLCBQb3MoYW5jaG9yLmxpbmUsIGFuY2hvci5jaCArIHJlcGVhdCAtIDEpKTtcbiAgICAgICAgICB2aW0uc2VsID0ge1xuICAgICAgICAgICAgYW5jaG9yOiBhbmNob3IsXG4gICAgICAgICAgICBoZWFkOiBoZWFkXG4gICAgICAgICAgfTtcbiAgICAgICAgICBDb2RlTWlycm9yLnNpZ25hbChjbSwgXCJ2aW0tbW9kZS1jaGFuZ2VcIiwge21vZGU6IFwidmlzdWFsXCIsIHN1Yk1vZGU6IHZpbS52aXN1YWxMaW5lID8gXCJsaW5ld2lzZVwiIDogdmltLnZpc3VhbEJsb2NrID8gXCJibG9ja3dpc2VcIiA6IFwiXCJ9KTtcbiAgICAgICAgICB1cGRhdGVDbVNlbGVjdGlvbihjbSk7XG4gICAgICAgICAgdXBkYXRlTWFyayhjbSwgdmltLCAnPCcsIGN1cnNvck1pbihhbmNob3IsIGhlYWQpKTtcbiAgICAgICAgICB1cGRhdGVNYXJrKGNtLCB2aW0sICc+JywgY3Vyc29yTWF4KGFuY2hvciwgaGVhZCkpO1xuICAgICAgICB9IGVsc2UgaWYgKHZpbS52aXN1YWxMaW5lIF4gYWN0aW9uQXJncy5saW5ld2lzZSB8fFxuICAgICAgICAgICAgdmltLnZpc3VhbEJsb2NrIF4gYWN0aW9uQXJncy5ibG9ja3dpc2UpIHtcbiAgICAgICAgICAvLyBUb2dnbGluZyBiZXR3ZWVuIG1vZGVzXG4gICAgICAgICAgdmltLnZpc3VhbExpbmUgPSAhIWFjdGlvbkFyZ3MubGluZXdpc2U7XG4gICAgICAgICAgdmltLnZpc3VhbEJsb2NrID0gISFhY3Rpb25BcmdzLmJsb2Nrd2lzZTtcbiAgICAgICAgICBDb2RlTWlycm9yLnNpZ25hbChjbSwgXCJ2aW0tbW9kZS1jaGFuZ2VcIiwge21vZGU6IFwidmlzdWFsXCIsIHN1Yk1vZGU6IHZpbS52aXN1YWxMaW5lID8gXCJsaW5ld2lzZVwiIDogdmltLnZpc3VhbEJsb2NrID8gXCJibG9ja3dpc2VcIiA6IFwiXCJ9KTtcbiAgICAgICAgICB1cGRhdGVDbVNlbGVjdGlvbihjbSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXhpdFZpc3VhbE1vZGUoY20pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcmVzZWxlY3RMYXN0U2VsZWN0aW9uOiBmdW5jdGlvbihjbSwgX2FjdGlvbkFyZ3MsIHZpbSkge1xuICAgICAgICB2YXIgbGFzdFNlbGVjdGlvbiA9IHZpbS5sYXN0U2VsZWN0aW9uO1xuICAgICAgICBpZiAodmltLnZpc3VhbE1vZGUpIHtcbiAgICAgICAgICB1cGRhdGVMYXN0U2VsZWN0aW9uKGNtLCB2aW0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsYXN0U2VsZWN0aW9uKSB7XG4gICAgICAgICAgdmFyIGFuY2hvciA9IGxhc3RTZWxlY3Rpb24uYW5jaG9yTWFyay5maW5kKCk7XG4gICAgICAgICAgdmFyIGhlYWQgPSBsYXN0U2VsZWN0aW9uLmhlYWRNYXJrLmZpbmQoKTtcbiAgICAgICAgICBpZiAoIWFuY2hvciB8fCAhaGVhZCkge1xuICAgICAgICAgICAgLy8gSWYgdGhlIG1hcmtzIGhhdmUgYmVlbiBkZXN0cm95ZWQgZHVlIHRvIGVkaXRzLCBkbyBub3RoaW5nLlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2aW0uc2VsID0ge1xuICAgICAgICAgICAgYW5jaG9yOiBhbmNob3IsXG4gICAgICAgICAgICBoZWFkOiBoZWFkXG4gICAgICAgICAgfTtcbiAgICAgICAgICB2aW0udmlzdWFsTW9kZSA9IHRydWU7XG4gICAgICAgICAgdmltLnZpc3VhbExpbmUgPSBsYXN0U2VsZWN0aW9uLnZpc3VhbExpbmU7XG4gICAgICAgICAgdmltLnZpc3VhbEJsb2NrID0gbGFzdFNlbGVjdGlvbi52aXN1YWxCbG9jaztcbiAgICAgICAgICB1cGRhdGVDbVNlbGVjdGlvbihjbSk7XG4gICAgICAgICAgdXBkYXRlTWFyayhjbSwgdmltLCAnPCcsIGN1cnNvck1pbihhbmNob3IsIGhlYWQpKTtcbiAgICAgICAgICB1cGRhdGVNYXJrKGNtLCB2aW0sICc+JywgY3Vyc29yTWF4KGFuY2hvciwgaGVhZCkpO1xuICAgICAgICAgIENvZGVNaXJyb3Iuc2lnbmFsKGNtLCAndmltLW1vZGUtY2hhbmdlJywge1xuICAgICAgICAgICAgbW9kZTogJ3Zpc3VhbCcsXG4gICAgICAgICAgICBzdWJNb2RlOiB2aW0udmlzdWFsTGluZSA/ICdsaW5ld2lzZScgOlxuICAgICAgICAgICAgICAgICAgICAgdmltLnZpc3VhbEJsb2NrID8gJ2Jsb2Nrd2lzZScgOiAnJ30pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgam9pbkxpbmVzOiBmdW5jdGlvbihjbSwgYWN0aW9uQXJncywgdmltKSB7XG4gICAgICAgIHZhciBjdXJTdGFydCwgY3VyRW5kO1xuICAgICAgICBpZiAodmltLnZpc3VhbE1vZGUpIHtcbiAgICAgICAgICBjdXJTdGFydCA9IGNtLmdldEN1cnNvcignYW5jaG9yJyk7XG4gICAgICAgICAgY3VyRW5kID0gY20uZ2V0Q3Vyc29yKCdoZWFkJyk7XG4gICAgICAgICAgaWYgKGN1cnNvcklzQmVmb3JlKGN1ckVuZCwgY3VyU3RhcnQpKSB7XG4gICAgICAgICAgICB2YXIgdG1wID0gY3VyRW5kO1xuICAgICAgICAgICAgY3VyRW5kID0gY3VyU3RhcnQ7XG4gICAgICAgICAgICBjdXJTdGFydCA9IHRtcDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VyRW5kLmNoID0gbGluZUxlbmd0aChjbSwgY3VyRW5kLmxpbmUpIC0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBSZXBlYXQgaXMgdGhlIG51bWJlciBvZiBsaW5lcyB0byBqb2luLiBNaW5pbXVtIDIgbGluZXMuXG4gICAgICAgICAgdmFyIHJlcGVhdCA9IE1hdGgubWF4KGFjdGlvbkFyZ3MucmVwZWF0LCAyKTtcbiAgICAgICAgICBjdXJTdGFydCA9IGNtLmdldEN1cnNvcigpO1xuICAgICAgICAgIGN1ckVuZCA9IGNsaXBDdXJzb3JUb0NvbnRlbnQoY20sIFBvcyhjdXJTdGFydC5saW5lICsgcmVwZWF0IC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5maW5pdHkpKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZmluYWxDaCA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgPSBjdXJTdGFydC5saW5lOyBpIDwgY3VyRW5kLmxpbmU7IGkrKykge1xuICAgICAgICAgIGZpbmFsQ2ggPSBsaW5lTGVuZ3RoKGNtLCBjdXJTdGFydC5saW5lKTtcbiAgICAgICAgICB2YXIgdG1wID0gUG9zKGN1clN0YXJ0LmxpbmUgKyAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZUxlbmd0aChjbSwgY3VyU3RhcnQubGluZSArIDEpKTtcbiAgICAgICAgICB2YXIgdGV4dCA9IGNtLmdldFJhbmdlKGN1clN0YXJ0LCB0bXApO1xuICAgICAgICAgIHRleHQgPSBhY3Rpb25BcmdzLmtlZXBTcGFjZXNcbiAgICAgICAgICAgID8gdGV4dC5yZXBsYWNlKC9cXG5cXHI/L2csICcnKVxuICAgICAgICAgICAgOiB0ZXh0LnJlcGxhY2UoL1xcblxccyovZywgJyAnKTtcbiAgICAgICAgICBjbS5yZXBsYWNlUmFuZ2UodGV4dCwgY3VyU3RhcnQsIHRtcCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGN1ckZpbmFsUG9zID0gUG9zKGN1clN0YXJ0LmxpbmUsIGZpbmFsQ2gpO1xuICAgICAgICBpZiAodmltLnZpc3VhbE1vZGUpIHtcbiAgICAgICAgICBleGl0VmlzdWFsTW9kZShjbSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIGNtLnNldEN1cnNvcihjdXJGaW5hbFBvcyk7XG4gICAgICB9LFxuICAgICAgbmV3TGluZUFuZEVudGVySW5zZXJ0TW9kZTogZnVuY3Rpb24oY20sIGFjdGlvbkFyZ3MsIHZpbSkge1xuICAgICAgICB2aW0uaW5zZXJ0TW9kZSA9IHRydWU7XG4gICAgICAgIHZhciBpbnNlcnRBdCA9IGNvcHlDdXJzb3IoY20uZ2V0Q3Vyc29yKCkpO1xuICAgICAgICBpZiAoaW5zZXJ0QXQubGluZSA9PT0gY20uZmlyc3RMaW5lKCkgJiYgIWFjdGlvbkFyZ3MuYWZ0ZXIpIHtcbiAgICAgICAgICAvLyBTcGVjaWFsIGNhc2UgZm9yIGluc2VydGluZyBuZXdsaW5lIGJlZm9yZSBzdGFydCBvZiBkb2N1bWVudC5cbiAgICAgICAgICBjbS5yZXBsYWNlUmFuZ2UoJ1xcbicsIFBvcyhjbS5maXJzdExpbmUoKSwgMCkpO1xuICAgICAgICAgIGNtLnNldEN1cnNvcihjbS5maXJzdExpbmUoKSwgMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW5zZXJ0QXQubGluZSA9IChhY3Rpb25BcmdzLmFmdGVyKSA/IGluc2VydEF0LmxpbmUgOlxuICAgICAgICAgICAgICBpbnNlcnRBdC5saW5lIC0gMTtcbiAgICAgICAgICBpbnNlcnRBdC5jaCA9IGxpbmVMZW5ndGgoY20sIGluc2VydEF0LmxpbmUpO1xuICAgICAgICAgIGNtLnNldEN1cnNvcihpbnNlcnRBdCk7XG4gICAgICAgICAgdmFyIG5ld2xpbmVGbiA9IENvZGVNaXJyb3IuY29tbWFuZHMubmV3bGluZUFuZEluZGVudENvbnRpbnVlQ29tbWVudCB8fFxuICAgICAgICAgICAgICBDb2RlTWlycm9yLmNvbW1hbmRzLm5ld2xpbmVBbmRJbmRlbnQ7XG4gICAgICAgICAgbmV3bGluZUZuKGNtKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVudGVySW5zZXJ0TW9kZShjbSwgeyByZXBlYXQ6IGFjdGlvbkFyZ3MucmVwZWF0IH0sIHZpbSk7XG4gICAgICB9LFxuICAgICAgcGFzdGU6IGZ1bmN0aW9uKGNtLCBhY3Rpb25BcmdzLCB2aW0pIHtcbiAgICAgICAgdmFyIGN1ciA9IGNvcHlDdXJzb3IoY20uZ2V0Q3Vyc29yKCkpO1xuICAgICAgICB2YXIgcmVnaXN0ZXIgPSB2aW1HbG9iYWxTdGF0ZS5yZWdpc3RlckNvbnRyb2xsZXIuZ2V0UmVnaXN0ZXIoXG4gICAgICAgICAgICBhY3Rpb25BcmdzLnJlZ2lzdGVyTmFtZSk7XG4gICAgICAgIHZhciB0ZXh0ID0gcmVnaXN0ZXIudG9TdHJpbmcoKTtcbiAgICAgICAgaWYgKCF0ZXh0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhY3Rpb25BcmdzLm1hdGNoSW5kZW50KSB7XG4gICAgICAgICAgdmFyIHRhYlNpemUgPSBjbS5nZXRPcHRpb24oXCJ0YWJTaXplXCIpO1xuICAgICAgICAgIC8vIGxlbmd0aCB0aGF0IGNvbnNpZGVycyB0YWJzIGFuZCB0YWJTaXplXG4gICAgICAgICAgdmFyIHdoaXRlc3BhY2VMZW5ndGggPSBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgICAgIHZhciB0YWJzID0gKHN0ci5zcGxpdChcIlxcdFwiKS5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIHZhciBzcGFjZXMgPSAoc3RyLnNwbGl0KFwiIFwiKS5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIHJldHVybiB0YWJzICogdGFiU2l6ZSArIHNwYWNlcyAqIDE7XG4gICAgICAgICAgfTtcbiAgICAgICAgICB2YXIgY3VycmVudExpbmUgPSBjbS5nZXRMaW5lKGNtLmdldEN1cnNvcigpLmxpbmUpO1xuICAgICAgICAgIHZhciBpbmRlbnQgPSB3aGl0ZXNwYWNlTGVuZ3RoKGN1cnJlbnRMaW5lLm1hdGNoKC9eXFxzKi8pWzBdKTtcbiAgICAgICAgICAvLyBjaG9tcCBsYXN0IG5ld2xpbmUgYi9jIGRvbid0IHdhbnQgaXQgdG8gbWF0Y2ggL15cXHMqL2dtXG4gICAgICAgICAgdmFyIGNob21wZWRUZXh0ID0gdGV4dC5yZXBsYWNlKC9cXG4kLywgJycpO1xuICAgICAgICAgIHZhciB3YXNDaG9tcGVkID0gdGV4dCAhPT0gY2hvbXBlZFRleHQ7XG4gICAgICAgICAgdmFyIGZpcnN0SW5kZW50ID0gd2hpdGVzcGFjZUxlbmd0aCh0ZXh0Lm1hdGNoKC9eXFxzKi8pWzBdKTtcbiAgICAgICAgICB2YXIgdGV4dCA9IGNob21wZWRUZXh0LnJlcGxhY2UoL15cXHMqL2dtLCBmdW5jdGlvbih3c3BhY2UpIHtcbiAgICAgICAgICAgIHZhciBuZXdJbmRlbnQgPSBpbmRlbnQgKyAod2hpdGVzcGFjZUxlbmd0aCh3c3BhY2UpIC0gZmlyc3RJbmRlbnQpO1xuICAgICAgICAgICAgaWYgKG5ld0luZGVudCA8IDApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjbS5nZXRPcHRpb24oXCJpbmRlbnRXaXRoVGFic1wiKSkge1xuICAgICAgICAgICAgICB2YXIgcXVvdGllbnQgPSBNYXRoLmZsb29yKG5ld0luZGVudCAvIHRhYlNpemUpO1xuICAgICAgICAgICAgICByZXR1cm4gQXJyYXkocXVvdGllbnQgKyAxKS5qb2luKCdcXHQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gQXJyYXkobmV3SW5kZW50ICsgMSkuam9pbignICcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRleHQgKz0gd2FzQ2hvbXBlZCA/IFwiXFxuXCIgOiBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhY3Rpb25BcmdzLnJlcGVhdCA+IDEpIHtcbiAgICAgICAgICB2YXIgdGV4dCA9IEFycmF5KGFjdGlvbkFyZ3MucmVwZWF0ICsgMSkuam9pbih0ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbGluZXdpc2UgPSByZWdpc3Rlci5saW5ld2lzZTtcbiAgICAgICAgdmFyIGJsb2Nrd2lzZSA9IHJlZ2lzdGVyLmJsb2Nrd2lzZTtcbiAgICAgICAgaWYgKGJsb2Nrd2lzZSkge1xuICAgICAgICAgIHRleHQgPSB0ZXh0LnNwbGl0KCdcXG4nKTtcbiAgICAgICAgICBpZiAobGluZXdpc2UpIHtcbiAgICAgICAgICAgICAgdGV4dC5wb3AoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0ZXh0W2ldID0gKHRleHRbaV0gPT0gJycpID8gJyAnIDogdGV4dFtpXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VyLmNoICs9IGFjdGlvbkFyZ3MuYWZ0ZXIgPyAxIDogMDtcbiAgICAgICAgICBjdXIuY2ggPSBNYXRoLm1pbihsaW5lTGVuZ3RoKGNtLCBjdXIubGluZSksIGN1ci5jaCk7XG4gICAgICAgIH0gZWxzZSBpZiAobGluZXdpc2UpIHtcbiAgICAgICAgICBpZih2aW0udmlzdWFsTW9kZSkge1xuICAgICAgICAgICAgdGV4dCA9IHZpbS52aXN1YWxMaW5lID8gdGV4dC5zbGljZSgwLCAtMSkgOiAnXFxuJyArIHRleHQuc2xpY2UoMCwgdGV4dC5sZW5ndGggLSAxKSArICdcXG4nO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYWN0aW9uQXJncy5hZnRlcikge1xuICAgICAgICAgICAgLy8gTW92ZSB0aGUgbmV3bGluZSBhdCB0aGUgZW5kIHRvIHRoZSBzdGFydCBpbnN0ZWFkLCBhbmQgcGFzdGUganVzdFxuICAgICAgICAgICAgLy8gYmVmb3JlIHRoZSBuZXdsaW5lIGNoYXJhY3RlciBvZiB0aGUgbGluZSB3ZSBhcmUgb24gcmlnaHQgbm93LlxuICAgICAgICAgICAgdGV4dCA9ICdcXG4nICsgdGV4dC5zbGljZSgwLCB0ZXh0Lmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgY3VyLmNoID0gbGluZUxlbmd0aChjbSwgY3VyLmxpbmUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjdXIuY2ggPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjdXIuY2ggKz0gYWN0aW9uQXJncy5hZnRlciA/IDEgOiAwO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjdXJQb3NGaW5hbDtcbiAgICAgICAgdmFyIGlkeDtcbiAgICAgICAgaWYgKHZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgICAgLy8gIHNhdmUgdGhlIHBhc3RlZCB0ZXh0IGZvciByZXNlbGVjdGlvbiBpZiB0aGUgbmVlZCBhcmlzZXNcbiAgICAgICAgICB2aW0ubGFzdFBhc3RlZFRleHQgPSB0ZXh0O1xuICAgICAgICAgIHZhciBsYXN0U2VsZWN0aW9uQ3VyRW5kO1xuICAgICAgICAgIHZhciBzZWxlY3RlZEFyZWEgPSBnZXRTZWxlY3RlZEFyZWFSYW5nZShjbSwgdmltKTtcbiAgICAgICAgICB2YXIgc2VsZWN0aW9uU3RhcnQgPSBzZWxlY3RlZEFyZWFbMF07XG4gICAgICAgICAgdmFyIHNlbGVjdGlvbkVuZCA9IHNlbGVjdGVkQXJlYVsxXTtcbiAgICAgICAgICB2YXIgc2VsZWN0ZWRUZXh0ID0gY20uZ2V0U2VsZWN0aW9uKCk7XG4gICAgICAgICAgdmFyIHNlbGVjdGlvbnMgPSBjbS5saXN0U2VsZWN0aW9ucygpO1xuICAgICAgICAgIHZhciBlbXB0eVN0cmluZ3MgPSBuZXcgQXJyYXkoc2VsZWN0aW9ucy5sZW5ndGgpLmpvaW4oJzEnKS5zcGxpdCgnMScpO1xuICAgICAgICAgIC8vIHNhdmUgdGhlIGN1ckVuZCBtYXJrZXIgYmVmb3JlIGl0IGdldCBjbGVhcmVkIGR1ZSB0byBjbS5yZXBsYWNlUmFuZ2UuXG4gICAgICAgICAgaWYgKHZpbS5sYXN0U2VsZWN0aW9uKSB7XG4gICAgICAgICAgICBsYXN0U2VsZWN0aW9uQ3VyRW5kID0gdmltLmxhc3RTZWxlY3Rpb24uaGVhZE1hcmsuZmluZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBwdXNoIHRoZSBwcmV2aW91c2x5IHNlbGVjdGVkIHRleHQgdG8gdW5uYW1lZCByZWdpc3RlclxuICAgICAgICAgIHZpbUdsb2JhbFN0YXRlLnJlZ2lzdGVyQ29udHJvbGxlci51bm5hbWVkUmVnaXN0ZXIuc2V0VGV4dChzZWxlY3RlZFRleHQpO1xuICAgICAgICAgIGlmIChibG9ja3dpc2UpIHtcbiAgICAgICAgICAgIC8vIGZpcnN0IGRlbGV0ZSB0aGUgc2VsZWN0ZWQgdGV4dFxuICAgICAgICAgICAgY20ucmVwbGFjZVNlbGVjdGlvbnMoZW1wdHlTdHJpbmdzKTtcbiAgICAgICAgICAgIC8vIFNldCBuZXcgc2VsZWN0aW9ucyBhcyBwZXIgdGhlIGJsb2NrIGxlbmd0aCBvZiB0aGUgeWFua2VkIHRleHRcbiAgICAgICAgICAgIHNlbGVjdGlvbkVuZCA9IFBvcyhzZWxlY3Rpb25TdGFydC5saW5lICsgdGV4dC5sZW5ndGgtMSwgc2VsZWN0aW9uU3RhcnQuY2gpO1xuICAgICAgICAgICAgY20uc2V0Q3Vyc29yKHNlbGVjdGlvblN0YXJ0KTtcbiAgICAgICAgICAgIHNlbGVjdEJsb2NrKGNtLCBzZWxlY3Rpb25FbmQpO1xuICAgICAgICAgICAgY20ucmVwbGFjZVNlbGVjdGlvbnModGV4dCk7XG4gICAgICAgICAgICBjdXJQb3NGaW5hbCA9IHNlbGVjdGlvblN0YXJ0O1xuICAgICAgICAgIH0gZWxzZSBpZiAodmltLnZpc3VhbEJsb2NrKSB7XG4gICAgICAgICAgICBjbS5yZXBsYWNlU2VsZWN0aW9ucyhlbXB0eVN0cmluZ3MpO1xuICAgICAgICAgICAgY20uc2V0Q3Vyc29yKHNlbGVjdGlvblN0YXJ0KTtcbiAgICAgICAgICAgIGNtLnJlcGxhY2VSYW5nZSh0ZXh0LCBzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uU3RhcnQpO1xuICAgICAgICAgICAgY3VyUG9zRmluYWwgPSBzZWxlY3Rpb25TdGFydDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY20ucmVwbGFjZVJhbmdlKHRleHQsIHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQpO1xuICAgICAgICAgICAgY3VyUG9zRmluYWwgPSBjbS5wb3NGcm9tSW5kZXgoY20uaW5kZXhGcm9tUG9zKHNlbGVjdGlvblN0YXJ0KSArIHRleHQubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIHJlc3RvcmUgdGhlIHRoZSBjdXJFbmQgbWFya2VyXG4gICAgICAgICAgaWYobGFzdFNlbGVjdGlvbkN1ckVuZCkge1xuICAgICAgICAgICAgdmltLmxhc3RTZWxlY3Rpb24uaGVhZE1hcmsgPSBjbS5zZXRCb29rbWFyayhsYXN0U2VsZWN0aW9uQ3VyRW5kKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGxpbmV3aXNlKSB7XG4gICAgICAgICAgICBjdXJQb3NGaW5hbC5jaD0wO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoYmxvY2t3aXNlKSB7XG4gICAgICAgICAgICBjbS5zZXRDdXJzb3IoY3VyKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICB2YXIgbGluZSA9IGN1ci5saW5lK2k7XG4gICAgICAgICAgICAgIGlmIChsaW5lID4gY20ubGFzdExpbmUoKSkge1xuICAgICAgICAgICAgICAgIGNtLnJlcGxhY2VSYW5nZSgnXFxuJywgIFBvcyhsaW5lLCAwKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdmFyIGxhc3RDaCA9IGxpbmVMZW5ndGgoY20sIGxpbmUpO1xuICAgICAgICAgICAgICBpZiAobGFzdENoIDwgY3VyLmNoKSB7XG4gICAgICAgICAgICAgICAgZXh0ZW5kTGluZVRvQ29sdW1uKGNtLCBsaW5lLCBjdXIuY2gpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjbS5zZXRDdXJzb3IoY3VyKTtcbiAgICAgICAgICAgIHNlbGVjdEJsb2NrKGNtLCBQb3MoY3VyLmxpbmUgKyB0ZXh0Lmxlbmd0aC0xLCBjdXIuY2gpKTtcbiAgICAgICAgICAgIGNtLnJlcGxhY2VTZWxlY3Rpb25zKHRleHQpO1xuICAgICAgICAgICAgY3VyUG9zRmluYWwgPSBjdXI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNtLnJlcGxhY2VSYW5nZSh0ZXh0LCBjdXIpO1xuICAgICAgICAgICAgLy8gTm93IGZpbmUgdHVuZSB0aGUgY3Vyc29yIHRvIHdoZXJlIHdlIHdhbnQgaXQuXG4gICAgICAgICAgICBpZiAobGluZXdpc2UgJiYgYWN0aW9uQXJncy5hZnRlcikge1xuICAgICAgICAgICAgICBjdXJQb3NGaW5hbCA9IFBvcyhcbiAgICAgICAgICAgICAgY3VyLmxpbmUgKyAxLFxuICAgICAgICAgICAgICBmaW5kRmlyc3ROb25XaGl0ZVNwYWNlQ2hhcmFjdGVyKGNtLmdldExpbmUoY3VyLmxpbmUgKyAxKSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChsaW5ld2lzZSAmJiAhYWN0aW9uQXJncy5hZnRlcikge1xuICAgICAgICAgICAgICBjdXJQb3NGaW5hbCA9IFBvcyhcbiAgICAgICAgICAgICAgICBjdXIubGluZSxcbiAgICAgICAgICAgICAgICBmaW5kRmlyc3ROb25XaGl0ZVNwYWNlQ2hhcmFjdGVyKGNtLmdldExpbmUoY3VyLmxpbmUpKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFsaW5ld2lzZSAmJiBhY3Rpb25BcmdzLmFmdGVyKSB7XG4gICAgICAgICAgICAgIGlkeCA9IGNtLmluZGV4RnJvbVBvcyhjdXIpO1xuICAgICAgICAgICAgICBjdXJQb3NGaW5hbCA9IGNtLnBvc0Zyb21JbmRleChpZHggKyB0ZXh0Lmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWR4ID0gY20uaW5kZXhGcm9tUG9zKGN1cik7XG4gICAgICAgICAgICAgIGN1clBvc0ZpbmFsID0gY20ucG9zRnJvbUluZGV4KGlkeCArIHRleHQubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgICAgZXhpdFZpc3VhbE1vZGUoY20sIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICBjbS5zZXRDdXJzb3IoY3VyUG9zRmluYWwpO1xuICAgICAgfSxcbiAgICAgIHVuZG86IGZ1bmN0aW9uKGNtLCBhY3Rpb25BcmdzKSB7XG4gICAgICAgIGNtLm9wZXJhdGlvbihmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXBlYXRGbihjbSwgQ29kZU1pcnJvci5jb21tYW5kcy51bmRvLCBhY3Rpb25BcmdzLnJlcGVhdCkoKTtcbiAgICAgICAgICBjbS5zZXRDdXJzb3IoY20uZ2V0Q3Vyc29yKCdhbmNob3InKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIHJlZG86IGZ1bmN0aW9uKGNtLCBhY3Rpb25BcmdzKSB7XG4gICAgICAgIHJlcGVhdEZuKGNtLCBDb2RlTWlycm9yLmNvbW1hbmRzLnJlZG8sIGFjdGlvbkFyZ3MucmVwZWF0KSgpO1xuICAgICAgfSxcbiAgICAgIHNldFJlZ2lzdGVyOiBmdW5jdGlvbihfY20sIGFjdGlvbkFyZ3MsIHZpbSkge1xuICAgICAgICB2aW0uaW5wdXRTdGF0ZS5yZWdpc3Rlck5hbWUgPSBhY3Rpb25BcmdzLnNlbGVjdGVkQ2hhcmFjdGVyO1xuICAgICAgfSxcbiAgICAgIHNldE1hcms6IGZ1bmN0aW9uKGNtLCBhY3Rpb25BcmdzLCB2aW0pIHtcbiAgICAgICAgdmFyIG1hcmtOYW1lID0gYWN0aW9uQXJncy5zZWxlY3RlZENoYXJhY3RlcjtcbiAgICAgICAgdXBkYXRlTWFyayhjbSwgdmltLCBtYXJrTmFtZSwgY20uZ2V0Q3Vyc29yKCkpO1xuICAgICAgfSxcbiAgICAgIHJlcGxhY2U6IGZ1bmN0aW9uKGNtLCBhY3Rpb25BcmdzLCB2aW0pIHtcbiAgICAgICAgdmFyIHJlcGxhY2VXaXRoID0gYWN0aW9uQXJncy5zZWxlY3RlZENoYXJhY3RlcjtcbiAgICAgICAgdmFyIGN1clN0YXJ0ID0gY20uZ2V0Q3Vyc29yKCk7XG4gICAgICAgIHZhciByZXBsYWNlVG87XG4gICAgICAgIHZhciBjdXJFbmQ7XG4gICAgICAgIHZhciBzZWxlY3Rpb25zID0gY20ubGlzdFNlbGVjdGlvbnMoKTtcbiAgICAgICAgaWYgKHZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgICAgY3VyU3RhcnQgPSBjbS5nZXRDdXJzb3IoJ3N0YXJ0Jyk7XG4gICAgICAgICAgY3VyRW5kID0gY20uZ2V0Q3Vyc29yKCdlbmQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgbGluZSA9IGNtLmdldExpbmUoY3VyU3RhcnQubGluZSk7XG4gICAgICAgICAgcmVwbGFjZVRvID0gY3VyU3RhcnQuY2ggKyBhY3Rpb25BcmdzLnJlcGVhdDtcbiAgICAgICAgICBpZiAocmVwbGFjZVRvID4gbGluZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJlcGxhY2VUbz1saW5lLmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VyRW5kID0gUG9zKGN1clN0YXJ0LmxpbmUsIHJlcGxhY2VUbyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlcGxhY2VXaXRoPT0nXFxuJykge1xuICAgICAgICAgIGlmICghdmltLnZpc3VhbE1vZGUpIGNtLnJlcGxhY2VSYW5nZSgnJywgY3VyU3RhcnQsIGN1ckVuZCk7XG4gICAgICAgICAgLy8gc3BlY2lhbCBjYXNlLCB3aGVyZSB2aW0gaGVscCBzYXlzIHRvIHJlcGxhY2UgYnkganVzdCBvbmUgbGluZS1icmVha1xuICAgICAgICAgIChDb2RlTWlycm9yLmNvbW1hbmRzLm5ld2xpbmVBbmRJbmRlbnRDb250aW51ZUNvbW1lbnQgfHwgQ29kZU1pcnJvci5jb21tYW5kcy5uZXdsaW5lQW5kSW5kZW50KShjbSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHJlcGxhY2VXaXRoU3RyID0gY20uZ2V0UmFuZ2UoY3VyU3RhcnQsIGN1ckVuZCk7XG4gICAgICAgICAgLy9yZXBsYWNlIGFsbCBjaGFyYWN0ZXJzIGluIHJhbmdlIGJ5IHNlbGVjdGVkLCBidXQga2VlcCBsaW5lYnJlYWtzXG4gICAgICAgICAgcmVwbGFjZVdpdGhTdHIgPSByZXBsYWNlV2l0aFN0ci5yZXBsYWNlKC9bXlxcbl0vZywgcmVwbGFjZVdpdGgpO1xuICAgICAgICAgIGlmICh2aW0udmlzdWFsQmxvY2spIHtcbiAgICAgICAgICAgIC8vIFRhYnMgYXJlIHNwbGl0IGluIHZpc3VhIGJsb2NrIGJlZm9yZSByZXBsYWNpbmdcbiAgICAgICAgICAgIHZhciBzcGFjZXMgPSBuZXcgQXJyYXkoY20uZ2V0T3B0aW9uKFwidGFiU2l6ZVwiKSsxKS5qb2luKCcgJyk7XG4gICAgICAgICAgICByZXBsYWNlV2l0aFN0ciA9IGNtLmdldFNlbGVjdGlvbigpO1xuICAgICAgICAgICAgcmVwbGFjZVdpdGhTdHIgPSByZXBsYWNlV2l0aFN0ci5yZXBsYWNlKC9cXHQvZywgc3BhY2VzKS5yZXBsYWNlKC9bXlxcbl0vZywgcmVwbGFjZVdpdGgpLnNwbGl0KCdcXG4nKTtcbiAgICAgICAgICAgIGNtLnJlcGxhY2VTZWxlY3Rpb25zKHJlcGxhY2VXaXRoU3RyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY20ucmVwbGFjZVJhbmdlKHJlcGxhY2VXaXRoU3RyLCBjdXJTdGFydCwgY3VyRW5kKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgICAgICBjdXJTdGFydCA9IGN1cnNvcklzQmVmb3JlKHNlbGVjdGlvbnNbMF0uYW5jaG9yLCBzZWxlY3Rpb25zWzBdLmhlYWQpID9cbiAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25zWzBdLmFuY2hvciA6IHNlbGVjdGlvbnNbMF0uaGVhZDtcbiAgICAgICAgICAgIGNtLnNldEN1cnNvcihjdXJTdGFydCk7XG4gICAgICAgICAgICBleGl0VmlzdWFsTW9kZShjbSwgZmFsc2UpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjbS5zZXRDdXJzb3Iob2Zmc2V0Q3Vyc29yKGN1ckVuZCwgMCwgLTEpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBpbmNyZW1lbnROdW1iZXJUb2tlbjogZnVuY3Rpb24oY20sIGFjdGlvbkFyZ3MpIHtcbiAgICAgICAgdmFyIGN1ciA9IGNtLmdldEN1cnNvcigpO1xuICAgICAgICB2YXIgbGluZVN0ciA9IGNtLmdldExpbmUoY3VyLmxpbmUpO1xuICAgICAgICB2YXIgcmUgPSAvKC0/KSg/OigweCkoW1xcZGEtZl0rKXwoMGJ8MHwpKFxcZCspKS9naTtcbiAgICAgICAgdmFyIG1hdGNoO1xuICAgICAgICB2YXIgc3RhcnQ7XG4gICAgICAgIHZhciBlbmQ7XG4gICAgICAgIHZhciBudW1iZXJTdHI7XG4gICAgICAgIHdoaWxlICgobWF0Y2ggPSByZS5leGVjKGxpbmVTdHIpKSAhPT0gbnVsbCkge1xuICAgICAgICAgIHN0YXJ0ID0gbWF0Y2guaW5kZXg7XG4gICAgICAgICAgZW5kID0gc3RhcnQgKyBtYXRjaFswXS5sZW5ndGg7XG4gICAgICAgICAgaWYgKGN1ci5jaCA8IGVuZClicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWFjdGlvbkFyZ3MuYmFja3RyYWNrICYmIChlbmQgPD0gY3VyLmNoKSlyZXR1cm47XG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgIHZhciBiYXNlU3RyID0gbWF0Y2hbMl0gfHwgbWF0Y2hbNF1cbiAgICAgICAgICB2YXIgZGlnaXRzID0gbWF0Y2hbM10gfHwgbWF0Y2hbNV1cbiAgICAgICAgICB2YXIgaW5jcmVtZW50ID0gYWN0aW9uQXJncy5pbmNyZWFzZSA/IDEgOiAtMTtcbiAgICAgICAgICB2YXIgYmFzZSA9IHsnMGInOiAyLCAnMCc6IDgsICcnOiAxMCwgJzB4JzogMTZ9W2Jhc2VTdHIudG9Mb3dlckNhc2UoKV07XG4gICAgICAgICAgdmFyIG51bWJlciA9IHBhcnNlSW50KG1hdGNoWzFdICsgZGlnaXRzLCBiYXNlKSArIChpbmNyZW1lbnQgKiBhY3Rpb25BcmdzLnJlcGVhdCk7XG4gICAgICAgICAgbnVtYmVyU3RyID0gbnVtYmVyLnRvU3RyaW5nKGJhc2UpO1xuICAgICAgICAgIHZhciB6ZXJvUGFkZGluZyA9IGJhc2VTdHIgPyBuZXcgQXJyYXkoZGlnaXRzLmxlbmd0aCAtIG51bWJlclN0ci5sZW5ndGggKyAxICsgbWF0Y2hbMV0ubGVuZ3RoKS5qb2luKCcwJykgOiAnJ1xuICAgICAgICAgIGlmIChudW1iZXJTdHIuY2hhckF0KDApID09PSAnLScpIHtcbiAgICAgICAgICAgIG51bWJlclN0ciA9ICctJyArIGJhc2VTdHIgKyB6ZXJvUGFkZGluZyArIG51bWJlclN0ci5zdWJzdHIoMSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG51bWJlclN0ciA9IGJhc2VTdHIgKyB6ZXJvUGFkZGluZyArIG51bWJlclN0cjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIGZyb20gPSBQb3MoY3VyLmxpbmUsIHN0YXJ0KTtcbiAgICAgICAgICB2YXIgdG8gPSBQb3MoY3VyLmxpbmUsIGVuZCk7XG4gICAgICAgICAgY20ucmVwbGFjZVJhbmdlKG51bWJlclN0ciwgZnJvbSwgdG8pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjbS5zZXRDdXJzb3IoUG9zKGN1ci5saW5lLCBzdGFydCArIG51bWJlclN0ci5sZW5ndGggLSAxKSk7XG4gICAgICB9LFxuICAgICAgcmVwZWF0TGFzdEVkaXQ6IGZ1bmN0aW9uKGNtLCBhY3Rpb25BcmdzLCB2aW0pIHtcbiAgICAgICAgdmFyIGxhc3RFZGl0SW5wdXRTdGF0ZSA9IHZpbS5sYXN0RWRpdElucHV0U3RhdGU7XG4gICAgICAgIGlmICghbGFzdEVkaXRJbnB1dFN0YXRlKSB7IHJldHVybjsgfVxuICAgICAgICB2YXIgcmVwZWF0ID0gYWN0aW9uQXJncy5yZXBlYXQ7XG4gICAgICAgIGlmIChyZXBlYXQgJiYgYWN0aW9uQXJncy5yZXBlYXRJc0V4cGxpY2l0KSB7XG4gICAgICAgICAgdmltLmxhc3RFZGl0SW5wdXRTdGF0ZS5yZXBlYXRPdmVycmlkZSA9IHJlcGVhdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXBlYXQgPSB2aW0ubGFzdEVkaXRJbnB1dFN0YXRlLnJlcGVhdE92ZXJyaWRlIHx8IHJlcGVhdDtcbiAgICAgICAgfVxuICAgICAgICByZXBlYXRMYXN0RWRpdChjbSwgdmltLCByZXBlYXQsIGZhbHNlIC8qKiByZXBlYXRGb3JJbnNlcnQgKi8pO1xuICAgICAgfSxcbiAgICAgIGluZGVudDogZnVuY3Rpb24oY20sIGFjdGlvbkFyZ3MpIHtcbiAgICAgICAgY20uaW5kZW50TGluZShjbS5nZXRDdXJzb3IoKS5saW5lLCBhY3Rpb25BcmdzLmluZGVudFJpZ2h0KTtcbiAgICAgIH0sXG4gICAgICBleGl0SW5zZXJ0TW9kZTogZXhpdEluc2VydE1vZGVcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZGVmaW5lQWN0aW9uKG5hbWUsIGZuKSB7XG4gICAgICBhY3Rpb25zW25hbWVdID0gZm47XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBCZWxvdyBhcmUgbWlzY2VsbGFuZW91cyB1dGlsaXR5IGZ1bmN0aW9ucyB1c2VkIGJ5IHZpbS5qc1xuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQ2xpcHMgY3Vyc29yIHRvIGVuc3VyZSB0aGF0IGxpbmUgaXMgd2l0aGluIHRoZSBidWZmZXIncyByYW5nZVxuICAgICAqIElmIGluY2x1ZGVMaW5lQnJlYWsgaXMgdHJ1ZSwgdGhlbiBhbGxvdyBjdXIuY2ggPT0gbGluZUxlbmd0aC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjbGlwQ3Vyc29yVG9Db250ZW50KGNtLCBjdXIpIHtcbiAgICAgIHZhciB2aW0gPSBjbS5zdGF0ZS52aW07XG4gICAgICB2YXIgaW5jbHVkZUxpbmVCcmVhayA9IHZpbS5pbnNlcnRNb2RlIHx8IHZpbS52aXN1YWxNb2RlO1xuICAgICAgdmFyIGxpbmUgPSBNYXRoLm1pbihNYXRoLm1heChjbS5maXJzdExpbmUoKSwgY3VyLmxpbmUpLCBjbS5sYXN0TGluZSgpICk7XG4gICAgICB2YXIgbWF4Q2ggPSBsaW5lTGVuZ3RoKGNtLCBsaW5lKSAtIDEgKyAhIWluY2x1ZGVMaW5lQnJlYWs7XG4gICAgICB2YXIgY2ggPSBNYXRoLm1pbihNYXRoLm1heCgwLCBjdXIuY2gpLCBtYXhDaCk7XG4gICAgICByZXR1cm4gUG9zKGxpbmUsIGNoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY29weUFyZ3MoYXJncykge1xuICAgICAgdmFyIHJldCA9IHt9O1xuICAgICAgZm9yICh2YXIgcHJvcCBpbiBhcmdzKSB7XG4gICAgICAgIGlmIChhcmdzLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgcmV0W3Byb3BdID0gYXJnc1twcm9wXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgZnVuY3Rpb24gb2Zmc2V0Q3Vyc29yKGN1ciwgb2Zmc2V0TGluZSwgb2Zmc2V0Q2gpIHtcbiAgICAgIGlmICh0eXBlb2Ygb2Zmc2V0TGluZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgb2Zmc2V0Q2ggPSBvZmZzZXRMaW5lLmNoO1xuICAgICAgICBvZmZzZXRMaW5lID0gb2Zmc2V0TGluZS5saW5lO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFBvcyhjdXIubGluZSArIG9mZnNldExpbmUsIGN1ci5jaCArIG9mZnNldENoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY29tbWFuZE1hdGNoZXMoa2V5cywga2V5TWFwLCBjb250ZXh0LCBpbnB1dFN0YXRlKSB7XG4gICAgICAvLyBQYXJ0aWFsIG1hdGNoZXMgYXJlIG5vdCBhcHBsaWVkLiBUaGV5IGluZm9ybSB0aGUga2V5IGhhbmRsZXJcbiAgICAgIC8vIHRoYXQgdGhlIGN1cnJlbnQga2V5IHNlcXVlbmNlIGlzIGEgc3Vic2VxdWVuY2Ugb2YgYSB2YWxpZCBrZXlcbiAgICAgIC8vIHNlcXVlbmNlLCBzbyB0aGF0IHRoZSBrZXkgYnVmZmVyIGlzIG5vdCBjbGVhcmVkLlxuICAgICAgdmFyIG1hdGNoLCBwYXJ0aWFsID0gW10sIGZ1bGwgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5TWFwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjb21tYW5kID0ga2V5TWFwW2ldO1xuICAgICAgICBpZiAoY29udGV4dCA9PSAnaW5zZXJ0JyAmJiBjb21tYW5kLmNvbnRleHQgIT0gJ2luc2VydCcgfHxcbiAgICAgICAgICAgIGNvbW1hbmQuY29udGV4dCAmJiBjb21tYW5kLmNvbnRleHQgIT0gY29udGV4dCB8fFxuICAgICAgICAgICAgaW5wdXRTdGF0ZS5vcGVyYXRvciAmJiBjb21tYW5kLnR5cGUgPT0gJ2FjdGlvbicgfHxcbiAgICAgICAgICAgICEobWF0Y2ggPSBjb21tYW5kTWF0Y2goa2V5cywgY29tbWFuZC5rZXlzKSkpIHsgY29udGludWU7IH1cbiAgICAgICAgaWYgKG1hdGNoID09ICdwYXJ0aWFsJykgeyBwYXJ0aWFsLnB1c2goY29tbWFuZCk7IH1cbiAgICAgICAgaWYgKG1hdGNoID09ICdmdWxsJykgeyBmdWxsLnB1c2goY29tbWFuZCk7IH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBhcnRpYWw6IHBhcnRpYWwubGVuZ3RoICYmIHBhcnRpYWwsXG4gICAgICAgIGZ1bGw6IGZ1bGwubGVuZ3RoICYmIGZ1bGxcbiAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNvbW1hbmRNYXRjaChwcmVzc2VkLCBtYXBwZWQpIHtcbiAgICAgIGlmIChtYXBwZWQuc2xpY2UoLTExKSA9PSAnPGNoYXJhY3Rlcj4nKSB7XG4gICAgICAgIC8vIExhc3QgY2hhcmFjdGVyIG1hdGNoZXMgYW55dGhpbmcuXG4gICAgICAgIHZhciBwcmVmaXhMZW4gPSBtYXBwZWQubGVuZ3RoIC0gMTE7XG4gICAgICAgIHZhciBwcmVzc2VkUHJlZml4ID0gcHJlc3NlZC5zbGljZSgwLCBwcmVmaXhMZW4pO1xuICAgICAgICB2YXIgbWFwcGVkUHJlZml4ID0gbWFwcGVkLnNsaWNlKDAsIHByZWZpeExlbik7XG4gICAgICAgIHJldHVybiBwcmVzc2VkUHJlZml4ID09IG1hcHBlZFByZWZpeCAmJiBwcmVzc2VkLmxlbmd0aCA+IHByZWZpeExlbiA/ICdmdWxsJyA6XG4gICAgICAgICAgICAgICBtYXBwZWRQcmVmaXguaW5kZXhPZihwcmVzc2VkUHJlZml4KSA9PSAwID8gJ3BhcnRpYWwnIDogZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcHJlc3NlZCA9PSBtYXBwZWQgPyAnZnVsbCcgOlxuICAgICAgICAgICAgICAgbWFwcGVkLmluZGV4T2YocHJlc3NlZCkgPT0gMCA/ICdwYXJ0aWFsJyA6IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBsYXN0Q2hhcihrZXlzKSB7XG4gICAgICB2YXIgbWF0Y2ggPSAvXi4qKDxbXj5dKz4pJC8uZXhlYyhrZXlzKTtcbiAgICAgIHZhciBzZWxlY3RlZENoYXJhY3RlciA9IG1hdGNoID8gbWF0Y2hbMV0gOiBrZXlzLnNsaWNlKC0xKTtcbiAgICAgIGlmIChzZWxlY3RlZENoYXJhY3Rlci5sZW5ndGggPiAxKXtcbiAgICAgICAgc3dpdGNoKHNlbGVjdGVkQ2hhcmFjdGVyKXtcbiAgICAgICAgICBjYXNlICc8Q1I+JzpcbiAgICAgICAgICAgIHNlbGVjdGVkQ2hhcmFjdGVyPSdcXG4nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnPFNwYWNlPic6XG4gICAgICAgICAgICBzZWxlY3RlZENoYXJhY3Rlcj0nICc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgc2VsZWN0ZWRDaGFyYWN0ZXI9Jyc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbGVjdGVkQ2hhcmFjdGVyO1xuICAgIH1cbiAgICBmdW5jdGlvbiByZXBlYXRGbihjbSwgZm4sIHJlcGVhdCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlcGVhdDsgaSsrKSB7XG4gICAgICAgICAgZm4oY20pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBjb3B5Q3Vyc29yKGN1cikge1xuICAgICAgcmV0dXJuIFBvcyhjdXIubGluZSwgY3VyLmNoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY3Vyc29yRXF1YWwoY3VyMSwgY3VyMikge1xuICAgICAgcmV0dXJuIGN1cjEuY2ggPT0gY3VyMi5jaCAmJiBjdXIxLmxpbmUgPT0gY3VyMi5saW5lO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjdXJzb3JJc0JlZm9yZShjdXIxLCBjdXIyKSB7XG4gICAgICBpZiAoY3VyMS5saW5lIDwgY3VyMi5saW5lKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKGN1cjEubGluZSA9PSBjdXIyLmxpbmUgJiYgY3VyMS5jaCA8IGN1cjIuY2gpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGN1cnNvck1pbihjdXIxLCBjdXIyKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgY3VyMiA9IGN1cnNvck1pbi5hcHBseSh1bmRlZmluZWQsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGN1cnNvcklzQmVmb3JlKGN1cjEsIGN1cjIpID8gY3VyMSA6IGN1cjI7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGN1cnNvck1heChjdXIxLCBjdXIyKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgY3VyMiA9IGN1cnNvck1heC5hcHBseSh1bmRlZmluZWQsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGN1cnNvcklzQmVmb3JlKGN1cjEsIGN1cjIpID8gY3VyMiA6IGN1cjE7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGN1cnNvcklzQmV0d2VlbihjdXIxLCBjdXIyLCBjdXIzKSB7XG4gICAgICAvLyByZXR1cm5zIHRydWUgaWYgY3VyMiBpcyBiZXR3ZWVuIGN1cjEgYW5kIGN1cjMuXG4gICAgICB2YXIgY3VyMWJlZm9yZTIgPSBjdXJzb3JJc0JlZm9yZShjdXIxLCBjdXIyKTtcbiAgICAgIHZhciBjdXIyYmVmb3JlMyA9IGN1cnNvcklzQmVmb3JlKGN1cjIsIGN1cjMpO1xuICAgICAgcmV0dXJuIGN1cjFiZWZvcmUyICYmIGN1cjJiZWZvcmUzO1xuICAgIH1cbiAgICBmdW5jdGlvbiBsaW5lTGVuZ3RoKGNtLCBsaW5lTnVtKSB7XG4gICAgICByZXR1cm4gY20uZ2V0TGluZShsaW5lTnVtKS5sZW5ndGg7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHRyaW0ocykge1xuICAgICAgaWYgKHMudHJpbSkge1xuICAgICAgICByZXR1cm4gcy50cmltKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGVzY2FwZVJlZ2V4KHMpIHtcbiAgICAgIHJldHVybiBzLnJlcGxhY2UoLyhbLj8qKyRcXFtcXF1cXC9cXFxcKCl7fXxcXC1dKS9nLCAnXFxcXCQxJyk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGV4dGVuZExpbmVUb0NvbHVtbihjbSwgbGluZU51bSwgY29sdW1uKSB7XG4gICAgICB2YXIgZW5kQ2ggPSBsaW5lTGVuZ3RoKGNtLCBsaW5lTnVtKTtcbiAgICAgIHZhciBzcGFjZXMgPSBuZXcgQXJyYXkoY29sdW1uLWVuZENoKzEpLmpvaW4oJyAnKTtcbiAgICAgIGNtLnNldEN1cnNvcihQb3MobGluZU51bSwgZW5kQ2gpKTtcbiAgICAgIGNtLnJlcGxhY2VSYW5nZShzcGFjZXMsIGNtLmdldEN1cnNvcigpKTtcbiAgICB9XG4gICAgLy8gVGhpcyBmdW5jdGlvbnMgc2VsZWN0cyBhIHJlY3Rhbmd1bGFyIGJsb2NrXG4gICAgLy8gb2YgdGV4dCB3aXRoIHNlbGVjdGlvbkVuZCBhcyBhbnkgb2YgaXRzIGNvcm5lclxuICAgIC8vIEhlaWdodCBvZiBibG9jazpcbiAgICAvLyBEaWZmZXJlbmNlIGluIHNlbGVjdGlvbkVuZC5saW5lIGFuZCBmaXJzdC9sYXN0IHNlbGVjdGlvbi5saW5lXG4gICAgLy8gV2lkdGggb2YgdGhlIGJsb2NrOlxuICAgIC8vIERpc3RhbmNlIGJldHdlZW4gc2VsZWN0aW9uRW5kLmNoIGFuZCBhbnkoZmlyc3QgY29uc2lkZXJlZCBoZXJlKSBzZWxlY3Rpb24uY2hcbiAgICBmdW5jdGlvbiBzZWxlY3RCbG9jayhjbSwgc2VsZWN0aW9uRW5kKSB7XG4gICAgICB2YXIgc2VsZWN0aW9ucyA9IFtdLCByYW5nZXMgPSBjbS5saXN0U2VsZWN0aW9ucygpO1xuICAgICAgdmFyIGhlYWQgPSBjb3B5Q3Vyc29yKGNtLmNsaXBQb3Moc2VsZWN0aW9uRW5kKSk7XG4gICAgICB2YXIgaXNDbGlwcGVkID0gIWN1cnNvckVxdWFsKHNlbGVjdGlvbkVuZCwgaGVhZCk7XG4gICAgICB2YXIgY3VySGVhZCA9IGNtLmdldEN1cnNvcignaGVhZCcpO1xuICAgICAgdmFyIHByaW1JbmRleCA9IGdldEluZGV4KHJhbmdlcywgY3VySGVhZCk7XG4gICAgICB2YXIgd2FzQ2xpcHBlZCA9IGN1cnNvckVxdWFsKHJhbmdlc1twcmltSW5kZXhdLmhlYWQsIHJhbmdlc1twcmltSW5kZXhdLmFuY2hvcik7XG4gICAgICB2YXIgbWF4ID0gcmFuZ2VzLmxlbmd0aCAtIDE7XG4gICAgICB2YXIgaW5kZXggPSBtYXggLSBwcmltSW5kZXggPiBwcmltSW5kZXggPyBtYXggOiAwO1xuICAgICAgdmFyIGJhc2UgPSByYW5nZXNbaW5kZXhdLmFuY2hvcjtcblxuICAgICAgdmFyIGZpcnN0TGluZSA9IE1hdGgubWluKGJhc2UubGluZSwgaGVhZC5saW5lKTtcbiAgICAgIHZhciBsYXN0TGluZSA9IE1hdGgubWF4KGJhc2UubGluZSwgaGVhZC5saW5lKTtcbiAgICAgIHZhciBiYXNlQ2ggPSBiYXNlLmNoLCBoZWFkQ2ggPSBoZWFkLmNoO1xuXG4gICAgICB2YXIgZGlyID0gcmFuZ2VzW2luZGV4XS5oZWFkLmNoIC0gYmFzZUNoO1xuICAgICAgdmFyIG5ld0RpciA9IGhlYWRDaCAtIGJhc2VDaDtcbiAgICAgIGlmIChkaXIgPiAwICYmIG5ld0RpciA8PSAwKSB7XG4gICAgICAgIGJhc2VDaCsrO1xuICAgICAgICBpZiAoIWlzQ2xpcHBlZCkgeyBoZWFkQ2gtLTsgfVxuICAgICAgfSBlbHNlIGlmIChkaXIgPCAwICYmIG5ld0RpciA+PSAwKSB7XG4gICAgICAgIGJhc2VDaC0tO1xuICAgICAgICBpZiAoIXdhc0NsaXBwZWQpIHsgaGVhZENoKys7IH1cbiAgICAgIH0gZWxzZSBpZiAoZGlyIDwgMCAmJiBuZXdEaXIgPT0gLTEpIHtcbiAgICAgICAgYmFzZUNoLS07XG4gICAgICAgIGhlYWRDaCsrO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIgbGluZSA9IGZpcnN0TGluZTsgbGluZSA8PSBsYXN0TGluZTsgbGluZSsrKSB7XG4gICAgICAgIHZhciByYW5nZSA9IHthbmNob3I6IG5ldyBQb3MobGluZSwgYmFzZUNoKSwgaGVhZDogbmV3IFBvcyhsaW5lLCBoZWFkQ2gpfTtcbiAgICAgICAgc2VsZWN0aW9ucy5wdXNoKHJhbmdlKTtcbiAgICAgIH1cbiAgICAgIGNtLnNldFNlbGVjdGlvbnMoc2VsZWN0aW9ucyk7XG4gICAgICBzZWxlY3Rpb25FbmQuY2ggPSBoZWFkQ2g7XG4gICAgICBiYXNlLmNoID0gYmFzZUNoO1xuICAgICAgcmV0dXJuIGJhc2U7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNlbGVjdEZvckluc2VydChjbSwgaGVhZCwgaGVpZ2h0KSB7XG4gICAgICB2YXIgc2VsID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhlaWdodDsgaSsrKSB7XG4gICAgICAgIHZhciBsaW5lSGVhZCA9IG9mZnNldEN1cnNvcihoZWFkLCBpLCAwKTtcbiAgICAgICAgc2VsLnB1c2goe2FuY2hvcjogbGluZUhlYWQsIGhlYWQ6IGxpbmVIZWFkfSk7XG4gICAgICB9XG4gICAgICBjbS5zZXRTZWxlY3Rpb25zKHNlbCwgMCk7XG4gICAgfVxuICAgIC8vIGdldEluZGV4IHJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBjdXJzb3IgaW4gdGhlIHNlbGVjdGlvbnMuXG4gICAgZnVuY3Rpb24gZ2V0SW5kZXgocmFuZ2VzLCBjdXJzb3IsIGVuZCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByYW5nZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGF0QW5jaG9yID0gZW5kICE9ICdoZWFkJyAmJiBjdXJzb3JFcXVhbChyYW5nZXNbaV0uYW5jaG9yLCBjdXJzb3IpO1xuICAgICAgICB2YXIgYXRIZWFkID0gZW5kICE9ICdhbmNob3InICYmIGN1cnNvckVxdWFsKHJhbmdlc1tpXS5oZWFkLCBjdXJzb3IpO1xuICAgICAgICBpZiAoYXRBbmNob3IgfHwgYXRIZWFkKSB7XG4gICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0U2VsZWN0ZWRBcmVhUmFuZ2UoY20sIHZpbSkge1xuICAgICAgdmFyIGxhc3RTZWxlY3Rpb24gPSB2aW0ubGFzdFNlbGVjdGlvbjtcbiAgICAgIHZhciBnZXRDdXJyZW50U2VsZWN0ZWRBcmVhUmFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGVjdGlvbnMgPSBjbS5saXN0U2VsZWN0aW9ucygpO1xuICAgICAgICB2YXIgc3RhcnQgPSAgc2VsZWN0aW9uc1swXTtcbiAgICAgICAgdmFyIGVuZCA9IHNlbGVjdGlvbnNbc2VsZWN0aW9ucy5sZW5ndGgtMV07XG4gICAgICAgIHZhciBzZWxlY3Rpb25TdGFydCA9IGN1cnNvcklzQmVmb3JlKHN0YXJ0LmFuY2hvciwgc3RhcnQuaGVhZCkgPyBzdGFydC5hbmNob3IgOiBzdGFydC5oZWFkO1xuICAgICAgICB2YXIgc2VsZWN0aW9uRW5kID0gY3Vyc29ySXNCZWZvcmUoZW5kLmFuY2hvciwgZW5kLmhlYWQpID8gZW5kLmhlYWQgOiBlbmQuYW5jaG9yO1xuICAgICAgICByZXR1cm4gW3NlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmRdO1xuICAgICAgfTtcbiAgICAgIHZhciBnZXRMYXN0U2VsZWN0ZWRBcmVhUmFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGVjdGlvblN0YXJ0ID0gY20uZ2V0Q3Vyc29yKCk7XG4gICAgICAgIHZhciBzZWxlY3Rpb25FbmQgPSBjbS5nZXRDdXJzb3IoKTtcbiAgICAgICAgdmFyIGJsb2NrID0gbGFzdFNlbGVjdGlvbi52aXN1YWxCbG9jaztcbiAgICAgICAgaWYgKGJsb2NrKSB7XG4gICAgICAgICAgdmFyIHdpZHRoID0gYmxvY2sud2lkdGg7XG4gICAgICAgICAgdmFyIGhlaWdodCA9IGJsb2NrLmhlaWdodDtcbiAgICAgICAgICBzZWxlY3Rpb25FbmQgPSBQb3Moc2VsZWN0aW9uU3RhcnQubGluZSArIGhlaWdodCwgc2VsZWN0aW9uU3RhcnQuY2ggKyB3aWR0aCk7XG4gICAgICAgICAgdmFyIHNlbGVjdGlvbnMgPSBbXTtcbiAgICAgICAgICAvLyBzZWxlY3RCbG9jayBjcmVhdGVzIGEgJ3Byb3BlcicgcmVjdGFuZ3VsYXIgYmxvY2suXG4gICAgICAgICAgLy8gV2UgZG8gbm90IHdhbnQgdGhhdCBpbiBhbGwgY2FzZXMsIHNvIHdlIG1hbnVhbGx5IHNldCBzZWxlY3Rpb25zLlxuICAgICAgICAgIGZvciAodmFyIGkgPSBzZWxlY3Rpb25TdGFydC5saW5lOyBpIDwgc2VsZWN0aW9uRW5kLmxpbmU7IGkrKykge1xuICAgICAgICAgICAgdmFyIGFuY2hvciA9IFBvcyhpLCBzZWxlY3Rpb25TdGFydC5jaCk7XG4gICAgICAgICAgICB2YXIgaGVhZCA9IFBvcyhpLCBzZWxlY3Rpb25FbmQuY2gpO1xuICAgICAgICAgICAgdmFyIHJhbmdlID0ge2FuY2hvcjogYW5jaG9yLCBoZWFkOiBoZWFkfTtcbiAgICAgICAgICAgIHNlbGVjdGlvbnMucHVzaChyYW5nZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNtLnNldFNlbGVjdGlvbnMoc2VsZWN0aW9ucyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHN0YXJ0ID0gbGFzdFNlbGVjdGlvbi5hbmNob3JNYXJrLmZpbmQoKTtcbiAgICAgICAgICB2YXIgZW5kID0gbGFzdFNlbGVjdGlvbi5oZWFkTWFyay5maW5kKCk7XG4gICAgICAgICAgdmFyIGxpbmUgPSBlbmQubGluZSAtIHN0YXJ0LmxpbmU7XG4gICAgICAgICAgdmFyIGNoID0gZW5kLmNoIC0gc3RhcnQuY2g7XG4gICAgICAgICAgc2VsZWN0aW9uRW5kID0ge2xpbmU6IHNlbGVjdGlvbkVuZC5saW5lICsgbGluZSwgY2g6IGxpbmUgPyBzZWxlY3Rpb25FbmQuY2ggOiBjaCArIHNlbGVjdGlvbkVuZC5jaH07XG4gICAgICAgICAgaWYgKGxhc3RTZWxlY3Rpb24udmlzdWFsTGluZSkge1xuICAgICAgICAgICAgc2VsZWN0aW9uU3RhcnQgPSBQb3Moc2VsZWN0aW9uU3RhcnQubGluZSwgMCk7XG4gICAgICAgICAgICBzZWxlY3Rpb25FbmQgPSBQb3Moc2VsZWN0aW9uRW5kLmxpbmUsIGxpbmVMZW5ndGgoY20sIHNlbGVjdGlvbkVuZC5saW5lKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNtLnNldFNlbGVjdGlvbihzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3NlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmRdO1xuICAgICAgfTtcbiAgICAgIGlmICghdmltLnZpc3VhbE1vZGUpIHtcbiAgICAgIC8vIEluIGNhc2Ugb2YgcmVwbGF5aW5nIHRoZSBhY3Rpb24uXG4gICAgICAgIHJldHVybiBnZXRMYXN0U2VsZWN0ZWRBcmVhUmFuZ2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBnZXRDdXJyZW50U2VsZWN0ZWRBcmVhUmFuZ2UoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gVXBkYXRlcyB0aGUgcHJldmlvdXMgc2VsZWN0aW9uIHdpdGggdGhlIGN1cnJlbnQgc2VsZWN0aW9uJ3MgdmFsdWVzLiBUaGlzXG4gICAgLy8gc2hvdWxkIG9ubHkgYmUgY2FsbGVkIGluIHZpc3VhbCBtb2RlLlxuICAgIGZ1bmN0aW9uIHVwZGF0ZUxhc3RTZWxlY3Rpb24oY20sIHZpbSkge1xuICAgICAgdmFyIGFuY2hvciA9IHZpbS5zZWwuYW5jaG9yO1xuICAgICAgdmFyIGhlYWQgPSB2aW0uc2VsLmhlYWQ7XG4gICAgICAvLyBUbyBhY2NvbW1vZGF0ZSB0aGUgZWZmZWN0IG9mIGxhc3RQYXN0ZWRUZXh0IGluIHRoZSBsYXN0IHNlbGVjdGlvblxuICAgICAgaWYgKHZpbS5sYXN0UGFzdGVkVGV4dCkge1xuICAgICAgICBoZWFkID0gY20ucG9zRnJvbUluZGV4KGNtLmluZGV4RnJvbVBvcyhhbmNob3IpICsgdmltLmxhc3RQYXN0ZWRUZXh0Lmxlbmd0aCk7XG4gICAgICAgIHZpbS5sYXN0UGFzdGVkVGV4dCA9IG51bGw7XG4gICAgICB9XG4gICAgICB2aW0ubGFzdFNlbGVjdGlvbiA9IHsnYW5jaG9yTWFyayc6IGNtLnNldEJvb2ttYXJrKGFuY2hvciksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAnaGVhZE1hcmsnOiBjbS5zZXRCb29rbWFyayhoZWFkKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICdhbmNob3InOiBjb3B5Q3Vyc29yKGFuY2hvciksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAnaGVhZCc6IGNvcHlDdXJzb3IoaGVhZCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAndmlzdWFsTW9kZSc6IHZpbS52aXN1YWxNb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Zpc3VhbExpbmUnOiB2aW0udmlzdWFsTGluZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICd2aXN1YWxCbG9jayc6IHZpbS52aXN1YWxCbG9ja307XG4gICAgfVxuICAgIGZ1bmN0aW9uIGV4cGFuZFNlbGVjdGlvbihjbSwgc3RhcnQsIGVuZCkge1xuICAgICAgdmFyIHNlbCA9IGNtLnN0YXRlLnZpbS5zZWw7XG4gICAgICB2YXIgaGVhZCA9IHNlbC5oZWFkO1xuICAgICAgdmFyIGFuY2hvciA9IHNlbC5hbmNob3I7XG4gICAgICB2YXIgdG1wO1xuICAgICAgaWYgKGN1cnNvcklzQmVmb3JlKGVuZCwgc3RhcnQpKSB7XG4gICAgICAgIHRtcCA9IGVuZDtcbiAgICAgICAgZW5kID0gc3RhcnQ7XG4gICAgICAgIHN0YXJ0ID0gdG1wO1xuICAgICAgfVxuICAgICAgaWYgKGN1cnNvcklzQmVmb3JlKGhlYWQsIGFuY2hvcikpIHtcbiAgICAgICAgaGVhZCA9IGN1cnNvck1pbihzdGFydCwgaGVhZCk7XG4gICAgICAgIGFuY2hvciA9IGN1cnNvck1heChhbmNob3IsIGVuZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbmNob3IgPSBjdXJzb3JNaW4oc3RhcnQsIGFuY2hvcik7XG4gICAgICAgIGhlYWQgPSBjdXJzb3JNYXgoaGVhZCwgZW5kKTtcbiAgICAgICAgaGVhZCA9IG9mZnNldEN1cnNvcihoZWFkLCAwLCAtMSk7XG4gICAgICAgIGlmIChoZWFkLmNoID09IC0xICYmIGhlYWQubGluZSAhPSBjbS5maXJzdExpbmUoKSkge1xuICAgICAgICAgIGhlYWQgPSBQb3MoaGVhZC5saW5lIC0gMSwgbGluZUxlbmd0aChjbSwgaGVhZC5saW5lIC0gMSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gW2FuY2hvciwgaGVhZF07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIENvZGVNaXJyb3Igc2VsZWN0aW9uIHRvIG1hdGNoIHRoZSBwcm92aWRlZCB2aW0gc2VsZWN0aW9uLlxuICAgICAqIElmIG5vIGFyZ3VtZW50cyBhcmUgZ2l2ZW4sIGl0IHVzZXMgdGhlIGN1cnJlbnQgdmltIHNlbGVjdGlvbiBzdGF0ZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1cGRhdGVDbVNlbGVjdGlvbihjbSwgc2VsLCBtb2RlKSB7XG4gICAgICB2YXIgdmltID0gY20uc3RhdGUudmltO1xuICAgICAgc2VsID0gc2VsIHx8IHZpbS5zZWw7XG4gICAgICB2YXIgbW9kZSA9IG1vZGUgfHxcbiAgICAgICAgdmltLnZpc3VhbExpbmUgPyAnbGluZScgOiB2aW0udmlzdWFsQmxvY2sgPyAnYmxvY2snIDogJ2NoYXInO1xuICAgICAgdmFyIGNtU2VsID0gbWFrZUNtU2VsZWN0aW9uKGNtLCBzZWwsIG1vZGUpO1xuICAgICAgY20uc2V0U2VsZWN0aW9ucyhjbVNlbC5yYW5nZXMsIGNtU2VsLnByaW1hcnkpO1xuICAgICAgdXBkYXRlRmFrZUN1cnNvcihjbSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG1ha2VDbVNlbGVjdGlvbihjbSwgc2VsLCBtb2RlLCBleGNsdXNpdmUpIHtcbiAgICAgIHZhciBoZWFkID0gY29weUN1cnNvcihzZWwuaGVhZCk7XG4gICAgICB2YXIgYW5jaG9yID0gY29weUN1cnNvcihzZWwuYW5jaG9yKTtcbiAgICAgIGlmIChtb2RlID09ICdjaGFyJykge1xuICAgICAgICB2YXIgaGVhZE9mZnNldCA9ICFleGNsdXNpdmUgJiYgIWN1cnNvcklzQmVmb3JlKHNlbC5oZWFkLCBzZWwuYW5jaG9yKSA/IDEgOiAwO1xuICAgICAgICB2YXIgYW5jaG9yT2Zmc2V0ID0gY3Vyc29ySXNCZWZvcmUoc2VsLmhlYWQsIHNlbC5hbmNob3IpID8gMSA6IDA7XG4gICAgICAgIGhlYWQgPSBvZmZzZXRDdXJzb3Ioc2VsLmhlYWQsIDAsIGhlYWRPZmZzZXQpO1xuICAgICAgICBhbmNob3IgPSBvZmZzZXRDdXJzb3Ioc2VsLmFuY2hvciwgMCwgYW5jaG9yT2Zmc2V0KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByYW5nZXM6IFt7YW5jaG9yOiBhbmNob3IsIGhlYWQ6IGhlYWR9XSxcbiAgICAgICAgICBwcmltYXJ5OiAwXG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKG1vZGUgPT0gJ2xpbmUnKSB7XG4gICAgICAgIGlmICghY3Vyc29ySXNCZWZvcmUoc2VsLmhlYWQsIHNlbC5hbmNob3IpKSB7XG4gICAgICAgICAgYW5jaG9yLmNoID0gMDtcblxuICAgICAgICAgIHZhciBsYXN0TGluZSA9IGNtLmxhc3RMaW5lKCk7XG4gICAgICAgICAgaWYgKGhlYWQubGluZSA+IGxhc3RMaW5lKSB7XG4gICAgICAgICAgICBoZWFkLmxpbmUgPSBsYXN0TGluZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaGVhZC5jaCA9IGxpbmVMZW5ndGgoY20sIGhlYWQubGluZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaGVhZC5jaCA9IDA7XG4gICAgICAgICAgYW5jaG9yLmNoID0gbGluZUxlbmd0aChjbSwgYW5jaG9yLmxpbmUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcmFuZ2VzOiBbe2FuY2hvcjogYW5jaG9yLCBoZWFkOiBoZWFkfV0sXG4gICAgICAgICAgcHJpbWFyeTogMFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIGlmIChtb2RlID09ICdibG9jaycpIHtcbiAgICAgICAgdmFyIHRvcCA9IE1hdGgubWluKGFuY2hvci5saW5lLCBoZWFkLmxpbmUpLFxuICAgICAgICAgICAgbGVmdCA9IE1hdGgubWluKGFuY2hvci5jaCwgaGVhZC5jaCksXG4gICAgICAgICAgICBib3R0b20gPSBNYXRoLm1heChhbmNob3IubGluZSwgaGVhZC5saW5lKSxcbiAgICAgICAgICAgIHJpZ2h0ID0gTWF0aC5tYXgoYW5jaG9yLmNoLCBoZWFkLmNoKSArIDE7XG4gICAgICAgIHZhciBoZWlnaHQgPSBib3R0b20gLSB0b3AgKyAxO1xuICAgICAgICB2YXIgcHJpbWFyeSA9IGhlYWQubGluZSA9PSB0b3AgPyAwIDogaGVpZ2h0IC0gMTtcbiAgICAgICAgdmFyIHJhbmdlcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhlaWdodDsgaSsrKSB7XG4gICAgICAgICAgcmFuZ2VzLnB1c2goe1xuICAgICAgICAgICAgYW5jaG9yOiBQb3ModG9wICsgaSwgbGVmdCksXG4gICAgICAgICAgICBoZWFkOiBQb3ModG9wICsgaSwgcmlnaHQpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByYW5nZXM6IHJhbmdlcyxcbiAgICAgICAgICBwcmltYXJ5OiBwcmltYXJ5XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldEhlYWQoY20pIHtcbiAgICAgIHZhciBjdXIgPSBjbS5nZXRDdXJzb3IoJ2hlYWQnKTtcbiAgICAgIGlmIChjbS5nZXRTZWxlY3Rpb24oKS5sZW5ndGggPT0gMSkge1xuICAgICAgICAvLyBTbWFsbCBjb3JuZXIgY2FzZSB3aGVuIG9ubHkgMSBjaGFyYWN0ZXIgaXMgc2VsZWN0ZWQuIFRoZSBcInJlYWxcIlxuICAgICAgICAvLyBoZWFkIGlzIHRoZSBsZWZ0IG9mIGhlYWQgYW5kIGFuY2hvci5cbiAgICAgICAgY3VyID0gY3Vyc29yTWluKGN1ciwgY20uZ2V0Q3Vyc29yKCdhbmNob3InKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY3VyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElmIG1vdmVIZWFkIGlzIHNldCB0byBmYWxzZSwgdGhlIENvZGVNaXJyb3Igc2VsZWN0aW9uIHdpbGwgbm90IGJlXG4gICAgICogdG91Y2hlZC4gVGhlIGNhbGxlciBhc3N1bWVzIHRoZSByZXNwb25zaWJpbGl0eSBvZiBwdXR0aW5nIHRoZSBjdXJzb3JcbiAgICAqIGluIHRoZSByaWdodCBwbGFjZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBleGl0VmlzdWFsTW9kZShjbSwgbW92ZUhlYWQpIHtcbiAgICAgIHZhciB2aW0gPSBjbS5zdGF0ZS52aW07XG4gICAgICBpZiAobW92ZUhlYWQgIT09IGZhbHNlKSB7XG4gICAgICAgIGNtLnNldEN1cnNvcihjbGlwQ3Vyc29yVG9Db250ZW50KGNtLCB2aW0uc2VsLmhlYWQpKTtcbiAgICAgIH1cbiAgICAgIHVwZGF0ZUxhc3RTZWxlY3Rpb24oY20sIHZpbSk7XG4gICAgICB2aW0udmlzdWFsTW9kZSA9IGZhbHNlO1xuICAgICAgdmltLnZpc3VhbExpbmUgPSBmYWxzZTtcbiAgICAgIHZpbS52aXN1YWxCbG9jayA9IGZhbHNlO1xuICAgICAgQ29kZU1pcnJvci5zaWduYWwoY20sIFwidmltLW1vZGUtY2hhbmdlXCIsIHttb2RlOiBcIm5vcm1hbFwifSk7XG4gICAgICBjbGVhckZha2VDdXJzb3IodmltKTtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgYW55IHRyYWlsaW5nIG5ld2xpbmVzIGZyb20gdGhlIHNlbGVjdGlvbi4gRm9yXG4gICAgLy8gZXhhbXBsZSwgd2l0aCB0aGUgY2FyZXQgYXQgdGhlIHN0YXJ0IG9mIHRoZSBsYXN0IHdvcmQgb24gdGhlIGxpbmUsXG4gICAgLy8gJ2R3JyBzaG91bGQgd29yZCwgYnV0IG5vdCB0aGUgbmV3bGluZSwgd2hpbGUgJ3cnIHNob3VsZCBhZHZhbmNlIHRoZVxuICAgIC8vIGNhcmV0IHRvIHRoZSBmaXJzdCBjaGFyYWN0ZXIgb2YgdGhlIG5leHQgbGluZS5cbiAgICBmdW5jdGlvbiBjbGlwVG9MaW5lKGNtLCBjdXJTdGFydCwgY3VyRW5kKSB7XG4gICAgICB2YXIgc2VsZWN0aW9uID0gY20uZ2V0UmFuZ2UoY3VyU3RhcnQsIGN1ckVuZCk7XG4gICAgICAvLyBPbmx5IGNsaXAgaWYgdGhlIHNlbGVjdGlvbiBlbmRzIHdpdGggdHJhaWxpbmcgbmV3bGluZSArIHdoaXRlc3BhY2VcbiAgICAgIGlmICgvXFxuXFxzKiQvLnRlc3Qoc2VsZWN0aW9uKSkge1xuICAgICAgICB2YXIgbGluZXMgPSBzZWxlY3Rpb24uc3BsaXQoJ1xcbicpO1xuICAgICAgICAvLyBXZSBrbm93IHRoaXMgaXMgYWxsIHdoaXRlc3BhY2UuXG4gICAgICAgIGxpbmVzLnBvcCgpO1xuXG4gICAgICAgIC8vIENhc2VzOlxuICAgICAgICAvLyAxLiBMYXN0IHdvcmQgaXMgYW4gZW1wdHkgbGluZSAtIGRvIG5vdCBjbGlwIHRoZSB0cmFpbGluZyAnXFxuJ1xuICAgICAgICAvLyAyLiBMYXN0IHdvcmQgaXMgbm90IGFuIGVtcHR5IGxpbmUgLSBjbGlwIHRoZSB0cmFpbGluZyAnXFxuJ1xuICAgICAgICB2YXIgbGluZTtcbiAgICAgICAgLy8gRmluZCB0aGUgbGluZSBjb250YWluaW5nIHRoZSBsYXN0IHdvcmQsIGFuZCBjbGlwIGFsbCB3aGl0ZXNwYWNlIHVwXG4gICAgICAgIC8vIHRvIGl0LlxuICAgICAgICBmb3IgKHZhciBsaW5lID0gbGluZXMucG9wKCk7IGxpbmVzLmxlbmd0aCA+IDAgJiYgbGluZSAmJiBpc1doaXRlU3BhY2VTdHJpbmcobGluZSk7IGxpbmUgPSBsaW5lcy5wb3AoKSkge1xuICAgICAgICAgIGN1ckVuZC5saW5lLS07XG4gICAgICAgICAgY3VyRW5kLmNoID0gMDtcbiAgICAgICAgfVxuICAgICAgICAvLyBJZiB0aGUgbGFzdCB3b3JkIGlzIG5vdCBhbiBlbXB0eSBsaW5lLCBjbGlwIGFuIGFkZGl0aW9uYWwgbmV3bGluZVxuICAgICAgICBpZiAobGluZSkge1xuICAgICAgICAgIGN1ckVuZC5saW5lLS07XG4gICAgICAgICAgY3VyRW5kLmNoID0gbGluZUxlbmd0aChjbSwgY3VyRW5kLmxpbmUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGN1ckVuZC5jaCA9IDA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBFeHBhbmQgdGhlIHNlbGVjdGlvbiB0byBsaW5lIGVuZHMuXG4gICAgZnVuY3Rpb24gZXhwYW5kU2VsZWN0aW9uVG9MaW5lKF9jbSwgY3VyU3RhcnQsIGN1ckVuZCkge1xuICAgICAgY3VyU3RhcnQuY2ggPSAwO1xuICAgICAgY3VyRW5kLmNoID0gMDtcbiAgICAgIGN1ckVuZC5saW5lKys7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmluZEZpcnN0Tm9uV2hpdGVTcGFjZUNoYXJhY3Rlcih0ZXh0KSB7XG4gICAgICBpZiAoIXRleHQpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG4gICAgICB2YXIgZmlyc3ROb25XUyA9IHRleHQuc2VhcmNoKC9cXFMvKTtcbiAgICAgIHJldHVybiBmaXJzdE5vbldTID09IC0xID8gdGV4dC5sZW5ndGggOiBmaXJzdE5vbldTO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4cGFuZFdvcmRVbmRlckN1cnNvcihjbSwgaW5jbHVzaXZlLCBfZm9yd2FyZCwgYmlnV29yZCwgbm9TeW1ib2wpIHtcbiAgICAgIHZhciBjdXIgPSBnZXRIZWFkKGNtKTtcbiAgICAgIHZhciBsaW5lID0gY20uZ2V0TGluZShjdXIubGluZSk7XG4gICAgICB2YXIgaWR4ID0gY3VyLmNoO1xuXG4gICAgICAvLyBTZWVrIHRvIGZpcnN0IHdvcmQgb3Igbm9uLXdoaXRlc3BhY2UgY2hhcmFjdGVyLCBkZXBlbmRpbmcgb24gaWZcbiAgICAgIC8vIG5vU3ltYm9sIGlzIHRydWUuXG4gICAgICB2YXIgdGVzdCA9IG5vU3ltYm9sID8gd29yZENoYXJUZXN0WzBdIDogYmlnV29yZENoYXJUZXN0IFswXTtcbiAgICAgIHdoaWxlICghdGVzdChsaW5lLmNoYXJBdChpZHgpKSkge1xuICAgICAgICBpZHgrKztcbiAgICAgICAgaWYgKGlkeCA+PSBsaW5lLmxlbmd0aCkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgfVxuXG4gICAgICBpZiAoYmlnV29yZCkge1xuICAgICAgICB0ZXN0ID0gYmlnV29yZENoYXJUZXN0WzBdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGVzdCA9IHdvcmRDaGFyVGVzdFswXTtcbiAgICAgICAgaWYgKCF0ZXN0KGxpbmUuY2hhckF0KGlkeCkpKSB7XG4gICAgICAgICAgdGVzdCA9IHdvcmRDaGFyVGVzdFsxXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgZW5kID0gaWR4LCBzdGFydCA9IGlkeDtcbiAgICAgIHdoaWxlICh0ZXN0KGxpbmUuY2hhckF0KGVuZCkpICYmIGVuZCA8IGxpbmUubGVuZ3RoKSB7IGVuZCsrOyB9XG4gICAgICB3aGlsZSAodGVzdChsaW5lLmNoYXJBdChzdGFydCkpICYmIHN0YXJ0ID49IDApIHsgc3RhcnQtLTsgfVxuICAgICAgc3RhcnQrKztcblxuICAgICAgaWYgKGluY2x1c2l2ZSkge1xuICAgICAgICAvLyBJZiBwcmVzZW50LCBpbmNsdWRlIGFsbCB3aGl0ZXNwYWNlIGFmdGVyIHdvcmQuXG4gICAgICAgIC8vIE90aGVyd2lzZSwgaW5jbHVkZSBhbGwgd2hpdGVzcGFjZSBiZWZvcmUgd29yZCwgZXhjZXB0IGluZGVudGF0aW9uLlxuICAgICAgICB2YXIgd29yZEVuZCA9IGVuZDtcbiAgICAgICAgd2hpbGUgKC9cXHMvLnRlc3QobGluZS5jaGFyQXQoZW5kKSkgJiYgZW5kIDwgbGluZS5sZW5ndGgpIHsgZW5kKys7IH1cbiAgICAgICAgaWYgKHdvcmRFbmQgPT0gZW5kKSB7XG4gICAgICAgICAgdmFyIHdvcmRTdGFydCA9IHN0YXJ0O1xuICAgICAgICAgIHdoaWxlICgvXFxzLy50ZXN0KGxpbmUuY2hhckF0KHN0YXJ0IC0gMSkpICYmIHN0YXJ0ID4gMCkgeyBzdGFydC0tOyB9XG4gICAgICAgICAgaWYgKCFzdGFydCkgeyBzdGFydCA9IHdvcmRTdGFydDsgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4geyBzdGFydDogUG9zKGN1ci5saW5lLCBzdGFydCksIGVuZDogUG9zKGN1ci5saW5lLCBlbmQpIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVjb3JkSnVtcFBvc2l0aW9uKGNtLCBvbGRDdXIsIG5ld0N1cikge1xuICAgICAgaWYgKCFjdXJzb3JFcXVhbChvbGRDdXIsIG5ld0N1cikpIHtcbiAgICAgICAgdmltR2xvYmFsU3RhdGUuanVtcExpc3QuYWRkKGNtLCBvbGRDdXIsIG5ld0N1cik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVjb3JkTGFzdENoYXJhY3RlclNlYXJjaChpbmNyZW1lbnQsIGFyZ3MpIHtcbiAgICAgICAgdmltR2xvYmFsU3RhdGUubGFzdENoYXJhY3RlclNlYXJjaC5pbmNyZW1lbnQgPSBpbmNyZW1lbnQ7XG4gICAgICAgIHZpbUdsb2JhbFN0YXRlLmxhc3RDaGFyYWN0ZXJTZWFyY2guZm9yd2FyZCA9IGFyZ3MuZm9yd2FyZDtcbiAgICAgICAgdmltR2xvYmFsU3RhdGUubGFzdENoYXJhY3RlclNlYXJjaC5zZWxlY3RlZENoYXJhY3RlciA9IGFyZ3Muc2VsZWN0ZWRDaGFyYWN0ZXI7XG4gICAgfVxuXG4gICAgdmFyIHN5bWJvbFRvTW9kZSA9IHtcbiAgICAgICAgJygnOiAnYnJhY2tldCcsICcpJzogJ2JyYWNrZXQnLCAneyc6ICdicmFja2V0JywgJ30nOiAnYnJhY2tldCcsXG4gICAgICAgICdbJzogJ3NlY3Rpb24nLCAnXSc6ICdzZWN0aW9uJyxcbiAgICAgICAgJyonOiAnY29tbWVudCcsICcvJzogJ2NvbW1lbnQnLFxuICAgICAgICAnbSc6ICdtZXRob2QnLCAnTSc6ICdtZXRob2QnLFxuICAgICAgICAnIyc6ICdwcmVwcm9jZXNzJ1xuICAgIH07XG4gICAgdmFyIGZpbmRTeW1ib2xNb2RlcyA9IHtcbiAgICAgIGJyYWNrZXQ6IHtcbiAgICAgICAgaXNDb21wbGV0ZTogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgICAgICBpZiAoc3RhdGUubmV4dENoID09PSBzdGF0ZS5zeW1iKSB7XG4gICAgICAgICAgICBzdGF0ZS5kZXB0aCsrO1xuICAgICAgICAgICAgaWYgKHN0YXRlLmRlcHRoID49IDEpcmV0dXJuIHRydWU7XG4gICAgICAgICAgfSBlbHNlIGlmIChzdGF0ZS5uZXh0Q2ggPT09IHN0YXRlLnJldmVyc2VTeW1iKSB7XG4gICAgICAgICAgICBzdGF0ZS5kZXB0aC0tO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBzZWN0aW9uOiB7XG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICAgICAgc3RhdGUuY3VyTW92ZVRocm91Z2ggPSB0cnVlO1xuICAgICAgICAgIHN0YXRlLnN5bWIgPSAoc3RhdGUuZm9yd2FyZCA/ICddJyA6ICdbJykgPT09IHN0YXRlLnN5bWIgPyAneycgOiAnfSc7XG4gICAgICAgIH0sXG4gICAgICAgIGlzQ29tcGxldGU6IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICAgICAgcmV0dXJuIHN0YXRlLmluZGV4ID09PSAwICYmIHN0YXRlLm5leHRDaCA9PT0gc3RhdGUuc3ltYjtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNvbW1lbnQ6IHtcbiAgICAgICAgaXNDb21wbGV0ZTogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgICAgICB2YXIgZm91bmQgPSBzdGF0ZS5sYXN0Q2ggPT09ICcqJyAmJiBzdGF0ZS5uZXh0Q2ggPT09ICcvJztcbiAgICAgICAgICBzdGF0ZS5sYXN0Q2ggPSBzdGF0ZS5uZXh0Q2g7XG4gICAgICAgICAgcmV0dXJuIGZvdW5kO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gVE9ETzogVGhlIG9yaWdpbmFsIFZpbSBpbXBsZW1lbnRhdGlvbiBvbmx5IG9wZXJhdGVzIG9uIGxldmVsIDEgYW5kIDIuXG4gICAgICAvLyBUaGUgY3VycmVudCBpbXBsZW1lbnRhdGlvbiBkb2Vzbid0IGNoZWNrIGZvciBjb2RlIGJsb2NrIGxldmVsIGFuZFxuICAgICAgLy8gdGhlcmVmb3JlIGl0IG9wZXJhdGVzIG9uIGFueSBsZXZlbHMuXG4gICAgICBtZXRob2Q6IHtcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgICAgICBzdGF0ZS5zeW1iID0gKHN0YXRlLnN5bWIgPT09ICdtJyA/ICd7JyA6ICd9Jyk7XG4gICAgICAgICAgc3RhdGUucmV2ZXJzZVN5bWIgPSBzdGF0ZS5zeW1iID09PSAneycgPyAnfScgOiAneyc7XG4gICAgICAgIH0sXG4gICAgICAgIGlzQ29tcGxldGU6IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICAgICAgaWYgKHN0YXRlLm5leHRDaCA9PT0gc3RhdGUuc3ltYilyZXR1cm4gdHJ1ZTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBwcmVwcm9jZXNzOiB7XG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICAgICAgc3RhdGUuaW5kZXggPSAwO1xuICAgICAgICB9LFxuICAgICAgICBpc0NvbXBsZXRlOiBmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgICAgIGlmIChzdGF0ZS5uZXh0Q2ggPT09ICcjJykge1xuICAgICAgICAgICAgdmFyIHRva2VuID0gc3RhdGUubGluZVRleHQubWF0Y2goLyMoXFx3KykvKVsxXTtcbiAgICAgICAgICAgIGlmICh0b2tlbiA9PT0gJ2VuZGlmJykge1xuICAgICAgICAgICAgICBpZiAoc3RhdGUuZm9yd2FyZCAmJiBzdGF0ZS5kZXB0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHN0YXRlLmRlcHRoKys7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRva2VuID09PSAnaWYnKSB7XG4gICAgICAgICAgICAgIGlmICghc3RhdGUuZm9yd2FyZCAmJiBzdGF0ZS5kZXB0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHN0YXRlLmRlcHRoLS07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodG9rZW4gPT09ICdlbHNlJyAmJiBzdGF0ZS5kZXB0aCA9PT0gMClyZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBmdW5jdGlvbiBmaW5kU3ltYm9sKGNtLCByZXBlYXQsIGZvcndhcmQsIHN5bWIpIHtcbiAgICAgIHZhciBjdXIgPSBjb3B5Q3Vyc29yKGNtLmdldEN1cnNvcigpKTtcbiAgICAgIHZhciBpbmNyZW1lbnQgPSBmb3J3YXJkID8gMSA6IC0xO1xuICAgICAgdmFyIGVuZExpbmUgPSBmb3J3YXJkID8gY20ubGluZUNvdW50KCkgOiAtMTtcbiAgICAgIHZhciBjdXJDaCA9IGN1ci5jaDtcbiAgICAgIHZhciBsaW5lID0gY3VyLmxpbmU7XG4gICAgICB2YXIgbGluZVRleHQgPSBjbS5nZXRMaW5lKGxpbmUpO1xuICAgICAgdmFyIHN0YXRlID0ge1xuICAgICAgICBsaW5lVGV4dDogbGluZVRleHQsXG4gICAgICAgIG5leHRDaDogbGluZVRleHQuY2hhckF0KGN1ckNoKSxcbiAgICAgICAgbGFzdENoOiBudWxsLFxuICAgICAgICBpbmRleDogY3VyQ2gsXG4gICAgICAgIHN5bWI6IHN5bWIsXG4gICAgICAgIHJldmVyc2VTeW1iOiAoZm9yd2FyZCA/ICB7ICcpJzogJygnLCAnfSc6ICd7JyB9IDogeyAnKCc6ICcpJywgJ3snOiAnfScgfSlbc3ltYl0sXG4gICAgICAgIGZvcndhcmQ6IGZvcndhcmQsXG4gICAgICAgIGRlcHRoOiAwLFxuICAgICAgICBjdXJNb3ZlVGhyb3VnaDogZmFsc2VcbiAgICAgIH07XG4gICAgICB2YXIgbW9kZSA9IHN5bWJvbFRvTW9kZVtzeW1iXTtcbiAgICAgIGlmICghbW9kZSlyZXR1cm4gY3VyO1xuICAgICAgdmFyIGluaXQgPSBmaW5kU3ltYm9sTW9kZXNbbW9kZV0uaW5pdDtcbiAgICAgIHZhciBpc0NvbXBsZXRlID0gZmluZFN5bWJvbE1vZGVzW21vZGVdLmlzQ29tcGxldGU7XG4gICAgICBpZiAoaW5pdCkgeyBpbml0KHN0YXRlKTsgfVxuICAgICAgd2hpbGUgKGxpbmUgIT09IGVuZExpbmUgJiYgcmVwZWF0KSB7XG4gICAgICAgIHN0YXRlLmluZGV4ICs9IGluY3JlbWVudDtcbiAgICAgICAgc3RhdGUubmV4dENoID0gc3RhdGUubGluZVRleHQuY2hhckF0KHN0YXRlLmluZGV4KTtcbiAgICAgICAgaWYgKCFzdGF0ZS5uZXh0Q2gpIHtcbiAgICAgICAgICBsaW5lICs9IGluY3JlbWVudDtcbiAgICAgICAgICBzdGF0ZS5saW5lVGV4dCA9IGNtLmdldExpbmUobGluZSkgfHwgJyc7XG4gICAgICAgICAgaWYgKGluY3JlbWVudCA+IDApIHtcbiAgICAgICAgICAgIHN0YXRlLmluZGV4ID0gMDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGxpbmVMZW4gPSBzdGF0ZS5saW5lVGV4dC5sZW5ndGg7XG4gICAgICAgICAgICBzdGF0ZS5pbmRleCA9IChsaW5lTGVuID4gMCkgPyAobGluZUxlbi0xKSA6IDA7XG4gICAgICAgICAgfVxuICAgICAgICAgIHN0YXRlLm5leHRDaCA9IHN0YXRlLmxpbmVUZXh0LmNoYXJBdChzdGF0ZS5pbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQ29tcGxldGUoc3RhdGUpKSB7XG4gICAgICAgICAgY3VyLmxpbmUgPSBsaW5lO1xuICAgICAgICAgIGN1ci5jaCA9IHN0YXRlLmluZGV4O1xuICAgICAgICAgIHJlcGVhdC0tO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3RhdGUubmV4dENoIHx8IHN0YXRlLmN1ck1vdmVUaHJvdWdoKSB7XG4gICAgICAgIHJldHVybiBQb3MobGluZSwgc3RhdGUuaW5kZXgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGN1cjtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgdGhlIGJvdW5kYXJpZXMgb2YgdGhlIG5leHQgd29yZC4gSWYgdGhlIGN1cnNvciBpbiB0aGUgbWlkZGxlIG9mXG4gICAgICogdGhlIHdvcmQsIHRoZW4gcmV0dXJucyB0aGUgYm91bmRhcmllcyBvZiB0aGUgY3VycmVudCB3b3JkLCBzdGFydGluZyBhdFxuICAgICAqIHRoZSBjdXJzb3IuIElmIHRoZSBjdXJzb3IgaXMgYXQgdGhlIHN0YXJ0L2VuZCBvZiBhIHdvcmQsIGFuZCB3ZSBhcmUgZ29pbmdcbiAgICAgKiBmb3J3YXJkL2JhY2t3YXJkLCByZXNwZWN0aXZlbHksIGZpbmQgdGhlIGJvdW5kYXJpZXMgb2YgdGhlIG5leHQgd29yZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Q29kZU1pcnJvcn0gY20gQ29kZU1pcnJvciBvYmplY3QuXG4gICAgICogQHBhcmFtIHtDdXJzb3J9IGN1ciBUaGUgY3Vyc29yIHBvc2l0aW9uLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yd2FyZCBUcnVlIHRvIHNlYXJjaCBmb3J3YXJkLiBGYWxzZSB0byBzZWFyY2hcbiAgICAgKiAgICAgYmFja3dhcmQuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBiaWdXb3JkIFRydWUgaWYgcHVuY3R1YXRpb24gY291bnQgYXMgcGFydCBvZiB0aGUgd29yZC5cbiAgICAgKiAgICAgRmFsc2UgaWYgb25seSBbYS16QS1aMC05XSBjaGFyYWN0ZXJzIGNvdW50IGFzIHBhcnQgb2YgdGhlIHdvcmQuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBlbXB0eUxpbmVJc1dvcmQgVHJ1ZSBpZiBlbXB0eSBsaW5lcyBzaG91bGQgYmUgdHJlYXRlZFxuICAgICAqICAgICBhcyB3b3Jkcy5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R7ZnJvbTpudW1iZXIsIHRvOm51bWJlciwgbGluZTogbnVtYmVyfX0gVGhlIGJvdW5kYXJpZXMgb2ZcbiAgICAgKiAgICAgdGhlIHdvcmQsIG9yIG51bGwgaWYgdGhlcmUgYXJlIG5vIG1vcmUgd29yZHMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZmluZFdvcmQoY20sIGN1ciwgZm9yd2FyZCwgYmlnV29yZCwgZW1wdHlMaW5lSXNXb3JkKSB7XG4gICAgICB2YXIgbGluZU51bSA9IGN1ci5saW5lO1xuICAgICAgdmFyIHBvcyA9IGN1ci5jaDtcbiAgICAgIHZhciBsaW5lID0gY20uZ2V0TGluZShsaW5lTnVtKTtcbiAgICAgIHZhciBkaXIgPSBmb3J3YXJkID8gMSA6IC0xO1xuICAgICAgdmFyIGNoYXJUZXN0cyA9IGJpZ1dvcmQgPyBiaWdXb3JkQ2hhclRlc3Q6IHdvcmRDaGFyVGVzdDtcblxuICAgICAgaWYgKGVtcHR5TGluZUlzV29yZCAmJiBsaW5lID09ICcnKSB7XG4gICAgICAgIGxpbmVOdW0gKz0gZGlyO1xuICAgICAgICBsaW5lID0gY20uZ2V0TGluZShsaW5lTnVtKTtcbiAgICAgICAgaWYgKCFpc0xpbmUoY20sIGxpbmVOdW0pKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcG9zID0gKGZvcndhcmQpID8gMCA6IGxpbmUubGVuZ3RoO1xuICAgICAgfVxuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBpZiAoZW1wdHlMaW5lSXNXb3JkICYmIGxpbmUgPT0gJycpIHtcbiAgICAgICAgICByZXR1cm4geyBmcm9tOiAwLCB0bzogMCwgbGluZTogbGluZU51bSB9O1xuICAgICAgICB9XG4gICAgICAgIHZhciBzdG9wID0gKGRpciA+IDApID8gbGluZS5sZW5ndGggOiAtMTtcbiAgICAgICAgdmFyIHdvcmRTdGFydCA9IHN0b3AsIHdvcmRFbmQgPSBzdG9wO1xuICAgICAgICAvLyBGaW5kIGJvdW5kcyBvZiBuZXh0IHdvcmQuXG4gICAgICAgIHdoaWxlIChwb3MgIT0gc3RvcCkge1xuICAgICAgICAgIHZhciBmb3VuZFdvcmQgPSBmYWxzZTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYXJUZXN0cy5sZW5ndGggJiYgIWZvdW5kV29yZDsgKytpKSB7XG4gICAgICAgICAgICBpZiAoY2hhclRlc3RzW2ldKGxpbmUuY2hhckF0KHBvcykpKSB7XG4gICAgICAgICAgICAgIHdvcmRTdGFydCA9IHBvcztcbiAgICAgICAgICAgICAgLy8gQWR2YW5jZSB0byBlbmQgb2Ygd29yZC5cbiAgICAgICAgICAgICAgd2hpbGUgKHBvcyAhPSBzdG9wICYmIGNoYXJUZXN0c1tpXShsaW5lLmNoYXJBdChwb3MpKSkge1xuICAgICAgICAgICAgICAgIHBvcyArPSBkaXI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgd29yZEVuZCA9IHBvcztcbiAgICAgICAgICAgICAgZm91bmRXb3JkID0gd29yZFN0YXJ0ICE9IHdvcmRFbmQ7XG4gICAgICAgICAgICAgIGlmICh3b3JkU3RhcnQgPT0gY3VyLmNoICYmIGxpbmVOdW0gPT0gY3VyLmxpbmUgJiZcbiAgICAgICAgICAgICAgICAgIHdvcmRFbmQgPT0gd29yZFN0YXJ0ICsgZGlyKSB7XG4gICAgICAgICAgICAgICAgLy8gV2Ugc3RhcnRlZCBhdCB0aGUgZW5kIG9mIGEgd29yZC4gRmluZCB0aGUgbmV4dCBvbmUuXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgIGZyb206IE1hdGgubWluKHdvcmRTdGFydCwgd29yZEVuZCArIDEpLFxuICAgICAgICAgICAgICAgICAgdG86IE1hdGgubWF4KHdvcmRTdGFydCwgd29yZEVuZCksXG4gICAgICAgICAgICAgICAgICBsaW5lOiBsaW5lTnVtIH07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFmb3VuZFdvcmQpIHtcbiAgICAgICAgICAgIHBvcyArPSBkaXI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEFkdmFuY2UgdG8gbmV4dC9wcmV2IGxpbmUuXG4gICAgICAgIGxpbmVOdW0gKz0gZGlyO1xuICAgICAgICBpZiAoIWlzTGluZShjbSwgbGluZU51bSkpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBsaW5lID0gY20uZ2V0TGluZShsaW5lTnVtKTtcbiAgICAgICAgcG9zID0gKGRpciA+IDApID8gMCA6IGxpbmUubGVuZ3RoO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7Q29kZU1pcnJvcn0gY20gQ29kZU1pcnJvciBvYmplY3QuXG4gICAgICogQHBhcmFtIHtQb3N9IGN1ciBUaGUgcG9zaXRpb24gdG8gc3RhcnQgZnJvbS5cbiAgICAgKiBAcGFyYW0ge2ludH0gcmVwZWF0IE51bWJlciBvZiB3b3JkcyB0byBtb3ZlIHBhc3QuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBmb3J3YXJkIFRydWUgdG8gc2VhcmNoIGZvcndhcmQuIEZhbHNlIHRvIHNlYXJjaFxuICAgICAqICAgICBiYWNrd2FyZC5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHdvcmRFbmQgVHJ1ZSB0byBtb3ZlIHRvIGVuZCBvZiB3b3JkLiBGYWxzZSB0byBtb3ZlIHRvXG4gICAgICogICAgIGJlZ2lubmluZyBvZiB3b3JkLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gYmlnV29yZCBUcnVlIGlmIHB1bmN0dWF0aW9uIGNvdW50IGFzIHBhcnQgb2YgdGhlIHdvcmQuXG4gICAgICogICAgIEZhbHNlIGlmIG9ubHkgYWxwaGFiZXQgY2hhcmFjdGVycyBjb3VudCBhcyBwYXJ0IG9mIHRoZSB3b3JkLlxuICAgICAqIEByZXR1cm4ge0N1cnNvcn0gVGhlIHBvc2l0aW9uIHRoZSBjdXJzb3Igc2hvdWxkIG1vdmUgdG8uXG4gICAgICovXG4gICAgZnVuY3Rpb24gbW92ZVRvV29yZChjbSwgY3VyLCByZXBlYXQsIGZvcndhcmQsIHdvcmRFbmQsIGJpZ1dvcmQpIHtcbiAgICAgIHZhciBjdXJTdGFydCA9IGNvcHlDdXJzb3IoY3VyKTtcbiAgICAgIHZhciB3b3JkcyA9IFtdO1xuICAgICAgaWYgKGZvcndhcmQgJiYgIXdvcmRFbmQgfHwgIWZvcndhcmQgJiYgd29yZEVuZCkge1xuICAgICAgICByZXBlYXQrKztcbiAgICAgIH1cbiAgICAgIC8vIEZvciAnZScsIGVtcHR5IGxpbmVzIGFyZSBub3QgY29uc2lkZXJlZCB3b3JkcywgZ28gZmlndXJlLlxuICAgICAgdmFyIGVtcHR5TGluZUlzV29yZCA9ICEoZm9yd2FyZCAmJiB3b3JkRW5kKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVwZWF0OyBpKyspIHtcbiAgICAgICAgdmFyIHdvcmQgPSBmaW5kV29yZChjbSwgY3VyLCBmb3J3YXJkLCBiaWdXb3JkLCBlbXB0eUxpbmVJc1dvcmQpO1xuICAgICAgICBpZiAoIXdvcmQpIHtcbiAgICAgICAgICB2YXIgZW9kQ2ggPSBsaW5lTGVuZ3RoKGNtLCBjbS5sYXN0TGluZSgpKTtcbiAgICAgICAgICB3b3Jkcy5wdXNoKGZvcndhcmRcbiAgICAgICAgICAgICAgPyB7bGluZTogY20ubGFzdExpbmUoKSwgZnJvbTogZW9kQ2gsIHRvOiBlb2RDaH1cbiAgICAgICAgICAgICAgOiB7bGluZTogMCwgZnJvbTogMCwgdG86IDB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB3b3Jkcy5wdXNoKHdvcmQpO1xuICAgICAgICBjdXIgPSBQb3Mod29yZC5saW5lLCBmb3J3YXJkID8gKHdvcmQudG8gLSAxKSA6IHdvcmQuZnJvbSk7XG4gICAgICB9XG4gICAgICB2YXIgc2hvcnRDaXJjdWl0ID0gd29yZHMubGVuZ3RoICE9IHJlcGVhdDtcbiAgICAgIHZhciBmaXJzdFdvcmQgPSB3b3Jkc1swXTtcbiAgICAgIHZhciBsYXN0V29yZCA9IHdvcmRzLnBvcCgpO1xuICAgICAgaWYgKGZvcndhcmQgJiYgIXdvcmRFbmQpIHtcbiAgICAgICAgLy8gd1xuICAgICAgICBpZiAoIXNob3J0Q2lyY3VpdCAmJiAoZmlyc3RXb3JkLmZyb20gIT0gY3VyU3RhcnQuY2ggfHwgZmlyc3RXb3JkLmxpbmUgIT0gY3VyU3RhcnQubGluZSkpIHtcbiAgICAgICAgICAvLyBXZSBkaWQgbm90IHN0YXJ0IGluIHRoZSBtaWRkbGUgb2YgYSB3b3JkLiBEaXNjYXJkIHRoZSBleHRyYSB3b3JkIGF0IHRoZSBlbmQuXG4gICAgICAgICAgbGFzdFdvcmQgPSB3b3Jkcy5wb3AoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUG9zKGxhc3RXb3JkLmxpbmUsIGxhc3RXb3JkLmZyb20pO1xuICAgICAgfSBlbHNlIGlmIChmb3J3YXJkICYmIHdvcmRFbmQpIHtcbiAgICAgICAgcmV0dXJuIFBvcyhsYXN0V29yZC5saW5lLCBsYXN0V29yZC50byAtIDEpO1xuICAgICAgfSBlbHNlIGlmICghZm9yd2FyZCAmJiB3b3JkRW5kKSB7XG4gICAgICAgIC8vIGdlXG4gICAgICAgIGlmICghc2hvcnRDaXJjdWl0ICYmIChmaXJzdFdvcmQudG8gIT0gY3VyU3RhcnQuY2ggfHwgZmlyc3RXb3JkLmxpbmUgIT0gY3VyU3RhcnQubGluZSkpIHtcbiAgICAgICAgICAvLyBXZSBkaWQgbm90IHN0YXJ0IGluIHRoZSBtaWRkbGUgb2YgYSB3b3JkLiBEaXNjYXJkIHRoZSBleHRyYSB3b3JkIGF0IHRoZSBlbmQuXG4gICAgICAgICAgbGFzdFdvcmQgPSB3b3Jkcy5wb3AoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUG9zKGxhc3RXb3JkLmxpbmUsIGxhc3RXb3JkLnRvKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGJcbiAgICAgICAgcmV0dXJuIFBvcyhsYXN0V29yZC5saW5lLCBsYXN0V29yZC5mcm9tKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb3ZlVG9DaGFyYWN0ZXIoY20sIHJlcGVhdCwgZm9yd2FyZCwgY2hhcmFjdGVyKSB7XG4gICAgICB2YXIgY3VyID0gY20uZ2V0Q3Vyc29yKCk7XG4gICAgICB2YXIgc3RhcnQgPSBjdXIuY2g7XG4gICAgICB2YXIgaWR4O1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXBlYXQ7IGkgKyspIHtcbiAgICAgICAgdmFyIGxpbmUgPSBjbS5nZXRMaW5lKGN1ci5saW5lKTtcbiAgICAgICAgaWR4ID0gY2hhcklkeEluTGluZShzdGFydCwgbGluZSwgY2hhcmFjdGVyLCBmb3J3YXJkLCB0cnVlKTtcbiAgICAgICAgaWYgKGlkeCA9PSAtMSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHN0YXJ0ID0gaWR4O1xuICAgICAgfVxuICAgICAgcmV0dXJuIFBvcyhjbS5nZXRDdXJzb3IoKS5saW5lLCBpZHgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vdmVUb0NvbHVtbihjbSwgcmVwZWF0KSB7XG4gICAgICAvLyByZXBlYXQgaXMgYWx3YXlzID49IDEsIHNvIHJlcGVhdCAtIDEgYWx3YXlzIGNvcnJlc3BvbmRzXG4gICAgICAvLyB0byB0aGUgY29sdW1uIHdlIHdhbnQgdG8gZ28gdG8uXG4gICAgICB2YXIgbGluZSA9IGNtLmdldEN1cnNvcigpLmxpbmU7XG4gICAgICByZXR1cm4gY2xpcEN1cnNvclRvQ29udGVudChjbSwgUG9zKGxpbmUsIHJlcGVhdCAtIDEpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVNYXJrKGNtLCB2aW0sIG1hcmtOYW1lLCBwb3MpIHtcbiAgICAgIGlmICghaW5BcnJheShtYXJrTmFtZSwgdmFsaWRNYXJrcykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHZpbS5tYXJrc1ttYXJrTmFtZV0pIHtcbiAgICAgICAgdmltLm1hcmtzW21hcmtOYW1lXS5jbGVhcigpO1xuICAgICAgfVxuICAgICAgdmltLm1hcmtzW21hcmtOYW1lXSA9IGNtLnNldEJvb2ttYXJrKHBvcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hhcklkeEluTGluZShzdGFydCwgbGluZSwgY2hhcmFjdGVyLCBmb3J3YXJkLCBpbmNsdWRlQ2hhcikge1xuICAgICAgLy8gU2VhcmNoIGZvciBjaGFyIGluIGxpbmUuXG4gICAgICAvLyBtb3Rpb25fb3B0aW9uczoge2ZvcndhcmQsIGluY2x1ZGVDaGFyfVxuICAgICAgLy8gSWYgaW5jbHVkZUNoYXIgPSB0cnVlLCBpbmNsdWRlIGl0IHRvby5cbiAgICAgIC8vIElmIGZvcndhcmQgPSB0cnVlLCBzZWFyY2ggZm9yd2FyZCwgZWxzZSBzZWFyY2ggYmFja3dhcmRzLlxuICAgICAgLy8gSWYgY2hhciBpcyBub3QgZm91bmQgb24gdGhpcyBsaW5lLCBkbyBub3RoaW5nXG4gICAgICB2YXIgaWR4O1xuICAgICAgaWYgKGZvcndhcmQpIHtcbiAgICAgICAgaWR4ID0gbGluZS5pbmRleE9mKGNoYXJhY3Rlciwgc3RhcnQgKyAxKTtcbiAgICAgICAgaWYgKGlkeCAhPSAtMSAmJiAhaW5jbHVkZUNoYXIpIHtcbiAgICAgICAgICBpZHggLT0gMTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWR4ID0gbGluZS5sYXN0SW5kZXhPZihjaGFyYWN0ZXIsIHN0YXJ0IC0gMSk7XG4gICAgICAgIGlmIChpZHggIT0gLTEgJiYgIWluY2x1ZGVDaGFyKSB7XG4gICAgICAgICAgaWR4ICs9IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBpZHg7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmluZFBhcmFncmFwaChjbSwgaGVhZCwgcmVwZWF0LCBkaXIsIGluY2x1c2l2ZSkge1xuICAgICAgdmFyIGxpbmUgPSBoZWFkLmxpbmU7XG4gICAgICB2YXIgbWluID0gY20uZmlyc3RMaW5lKCk7XG4gICAgICB2YXIgbWF4ID0gY20ubGFzdExpbmUoKTtcbiAgICAgIHZhciBzdGFydCwgZW5kLCBpID0gbGluZTtcbiAgICAgIGZ1bmN0aW9uIGlzRW1wdHkoaSkgeyByZXR1cm4gIWNtLmdldExpbmUoaSk7IH1cbiAgICAgIGZ1bmN0aW9uIGlzQm91bmRhcnkoaSwgZGlyLCBhbnkpIHtcbiAgICAgICAgaWYgKGFueSkgeyByZXR1cm4gaXNFbXB0eShpKSAhPSBpc0VtcHR5KGkgKyBkaXIpOyB9XG4gICAgICAgIHJldHVybiAhaXNFbXB0eShpKSAmJiBpc0VtcHR5KGkgKyBkaXIpO1xuICAgICAgfVxuICAgICAgaWYgKGRpcikge1xuICAgICAgICB3aGlsZSAobWluIDw9IGkgJiYgaSA8PSBtYXggJiYgcmVwZWF0ID4gMCkge1xuICAgICAgICAgIGlmIChpc0JvdW5kYXJ5KGksIGRpcikpIHsgcmVwZWF0LS07IH1cbiAgICAgICAgICBpICs9IGRpcjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFBvcyhpLCAwKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHZpbSA9IGNtLnN0YXRlLnZpbTtcbiAgICAgIGlmICh2aW0udmlzdWFsTGluZSAmJiBpc0JvdW5kYXJ5KGxpbmUsIDEsIHRydWUpKSB7XG4gICAgICAgIHZhciBhbmNob3IgPSB2aW0uc2VsLmFuY2hvcjtcbiAgICAgICAgaWYgKGlzQm91bmRhcnkoYW5jaG9yLmxpbmUsIC0xLCB0cnVlKSkge1xuICAgICAgICAgIGlmICghaW5jbHVzaXZlIHx8IGFuY2hvci5saW5lICE9IGxpbmUpIHtcbiAgICAgICAgICAgIGxpbmUgKz0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhciBzdGFydFN0YXRlID0gaXNFbXB0eShsaW5lKTtcbiAgICAgIGZvciAoaSA9IGxpbmU7IGkgPD0gbWF4ICYmIHJlcGVhdDsgaSsrKSB7XG4gICAgICAgIGlmIChpc0JvdW5kYXJ5KGksIDEsIHRydWUpKSB7XG4gICAgICAgICAgaWYgKCFpbmNsdXNpdmUgfHwgaXNFbXB0eShpKSAhPSBzdGFydFN0YXRlKSB7XG4gICAgICAgICAgICByZXBlYXQtLTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVuZCA9IG5ldyBQb3MoaSwgMCk7XG4gICAgICAvLyBzZWxlY3QgYm91bmRhcnkgYmVmb3JlIHBhcmFncmFwaCBmb3IgdGhlIGxhc3Qgb25lXG4gICAgICBpZiAoaSA+IG1heCAmJiAhc3RhcnRTdGF0ZSkgeyBzdGFydFN0YXRlID0gdHJ1ZTsgfVxuICAgICAgZWxzZSB7IGluY2x1c2l2ZSA9IGZhbHNlOyB9XG4gICAgICBmb3IgKGkgPSBsaW5lOyBpID4gbWluOyBpLS0pIHtcbiAgICAgICAgaWYgKCFpbmNsdXNpdmUgfHwgaXNFbXB0eShpKSA9PSBzdGFydFN0YXRlIHx8IGkgPT0gbGluZSkge1xuICAgICAgICAgIGlmIChpc0JvdW5kYXJ5KGksIC0xLCB0cnVlKSkgeyBicmVhazsgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzdGFydCA9IG5ldyBQb3MoaSwgMCk7XG4gICAgICByZXR1cm4geyBzdGFydDogc3RhcnQsIGVuZDogZW5kIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmluZFNlbnRlbmNlKGNtLCBjdXIsIHJlcGVhdCwgZGlyKSB7XG5cbiAgICAgIC8qXG4gICAgICAgIFRha2VzIGFuIGluZGV4IG9iamVjdFxuICAgICAgICB7XG4gICAgICAgICAgbGluZTogdGhlIGxpbmUgc3RyaW5nLFxuICAgICAgICAgIGxuOiBsaW5lIG51bWJlcixcbiAgICAgICAgICBwb3M6IGluZGV4IGluIGxpbmUsXG4gICAgICAgICAgZGlyOiBkaXJlY3Rpb24gb2YgdHJhdmVyc2FsICgtMSBvciAxKVxuICAgICAgICB9XG4gICAgICAgIGFuZCBtb2RpZmllcyB0aGUgbGluZSwgbG4sIGFuZCBwb3MgbWVtYmVycyB0byByZXByZXNlbnQgdGhlXG4gICAgICAgIG5leHQgdmFsaWQgcG9zaXRpb24gb3Igc2V0cyB0aGVtIHRvIG51bGwgaWYgdGhlcmUgYXJlXG4gICAgICAgIG5vIG1vcmUgdmFsaWQgcG9zaXRpb25zLlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBuZXh0Q2hhcihjbSwgaWR4KSB7XG4gICAgICAgIGlmIChpZHgucG9zICsgaWR4LmRpciA8IDAgfHwgaWR4LnBvcyArIGlkeC5kaXIgPj0gaWR4LmxpbmUubGVuZ3RoKSB7XG4gICAgICAgICAgaWR4LmxuICs9IGlkeC5kaXI7XG4gICAgICAgICAgaWYgKCFpc0xpbmUoY20sIGlkeC5sbikpIHtcbiAgICAgICAgICAgIGlkeC5saW5lID0gbnVsbDtcbiAgICAgICAgICAgIGlkeC5sbiA9IG51bGw7XG4gICAgICAgICAgICBpZHgucG9zID0gbnVsbDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWR4LmxpbmUgPSBjbS5nZXRMaW5lKGlkeC5sbik7XG4gICAgICAgICAgaWR4LnBvcyA9IChpZHguZGlyID4gMCkgPyAwIDogaWR4LmxpbmUubGVuZ3RoIC0gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZHgucG9zICs9IGlkeC5kaXI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLypcbiAgICAgICAgUGVyZm9ybXMgb25lIGl0ZXJhdGlvbiBvZiB0cmF2ZXJzYWwgaW4gZm9yd2FyZCBkaXJlY3Rpb25cbiAgICAgICAgUmV0dXJucyBhbiBpbmRleCBvYmplY3Qgb2YgdGhlIG5ldyBsb2NhdGlvblxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBmb3J3YXJkKGNtLCBsbiwgcG9zLCBkaXIpIHtcbiAgICAgICAgdmFyIGxpbmUgPSBjbS5nZXRMaW5lKGxuKTtcbiAgICAgICAgdmFyIHN0b3AgPSAobGluZSA9PT0gXCJcIik7XG5cbiAgICAgICAgdmFyIGN1cnIgPSB7XG4gICAgICAgICAgbGluZTogbGluZSxcbiAgICAgICAgICBsbjogbG4sXG4gICAgICAgICAgcG9zOiBwb3MsXG4gICAgICAgICAgZGlyOiBkaXIsXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbGFzdF92YWxpZCA9IHtcbiAgICAgICAgICBsbjogY3Vyci5sbixcbiAgICAgICAgICBwb3M6IGN1cnIucG9zLFxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNraXBfZW1wdHlfbGluZXMgPSAoY3Vyci5saW5lID09PSBcIlwiKTtcblxuICAgICAgICAvLyBNb3ZlIG9uZSBzdGVwIHRvIHNraXAgY2hhcmFjdGVyIHdlIHN0YXJ0IG9uXG4gICAgICAgIG5leHRDaGFyKGNtLCBjdXJyKTtcblxuICAgICAgICB3aGlsZSAoY3Vyci5saW5lICE9PSBudWxsKSB7XG4gICAgICAgICAgbGFzdF92YWxpZC5sbiA9IGN1cnIubG47XG4gICAgICAgICAgbGFzdF92YWxpZC5wb3MgPSBjdXJyLnBvcztcblxuICAgICAgICAgIGlmIChjdXJyLmxpbmUgPT09IFwiXCIgJiYgIXNraXBfZW1wdHlfbGluZXMpIHtcbiAgICAgICAgICAgIHJldHVybiB7IGxuOiBjdXJyLmxuLCBwb3M6IGN1cnIucG9zLCB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChzdG9wICYmIGN1cnIubGluZSAhPT0gXCJcIiAmJiAhaXNXaGl0ZVNwYWNlU3RyaW5nKGN1cnIubGluZVtjdXJyLnBvc10pKSB7XG4gICAgICAgICAgICByZXR1cm4geyBsbjogY3Vyci5sbiwgcG9zOiBjdXJyLnBvcywgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAoaXNFbmRPZlNlbnRlbmNlU3ltYm9sKGN1cnIubGluZVtjdXJyLnBvc10pXG4gICAgICAgICAgICAmJiAhc3RvcFxuICAgICAgICAgICAgJiYgKGN1cnIucG9zID09PSBjdXJyLmxpbmUubGVuZ3RoIC0gMVxuICAgICAgICAgICAgICB8fCBpc1doaXRlU3BhY2VTdHJpbmcoY3Vyci5saW5lW2N1cnIucG9zICsgMV0pKSkge1xuICAgICAgICAgICAgc3RvcCA9IHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dENoYXIoY20sIGN1cnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICBTZXQgdGhlIHBvc2l0aW9uIHRvIHRoZSBsYXN0IG5vbiB3aGl0ZXNwYWNlIGNoYXJhY3RlciBvbiB0aGUgbGFzdFxuICAgICAgICAgIHZhbGlkIGxpbmUgaW4gdGhlIGNhc2UgdGhhdCB3ZSByZWFjaCB0aGUgZW5kIG9mIHRoZSBkb2N1bWVudC5cbiAgICAgICAgKi9cbiAgICAgICAgdmFyIGxpbmUgPSBjbS5nZXRMaW5lKGxhc3RfdmFsaWQubG4pO1xuICAgICAgICBsYXN0X3ZhbGlkLnBvcyA9IDA7XG4gICAgICAgIGZvcih2YXIgaSA9IGxpbmUubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgICBpZiAoIWlzV2hpdGVTcGFjZVN0cmluZyhsaW5lW2ldKSkge1xuICAgICAgICAgICAgbGFzdF92YWxpZC5wb3MgPSBpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxhc3RfdmFsaWQ7XG5cbiAgICAgIH1cblxuICAgICAgLypcbiAgICAgICAgUGVyZm9ybXMgb25lIGl0ZXJhdGlvbiBvZiB0cmF2ZXJzYWwgaW4gcmV2ZXJzZSBkaXJlY3Rpb25cbiAgICAgICAgUmV0dXJucyBhbiBpbmRleCBvYmplY3Qgb2YgdGhlIG5ldyBsb2NhdGlvblxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiByZXZlcnNlKGNtLCBsbiwgcG9zLCBkaXIpIHtcbiAgICAgICAgdmFyIGxpbmUgPSBjbS5nZXRMaW5lKGxuKTtcblxuICAgICAgICB2YXIgY3VyciA9IHtcbiAgICAgICAgICBsaW5lOiBsaW5lLFxuICAgICAgICAgIGxuOiBsbixcbiAgICAgICAgICBwb3M6IHBvcyxcbiAgICAgICAgICBkaXI6IGRpcixcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsYXN0X3ZhbGlkID0ge1xuICAgICAgICAgIGxuOiBjdXJyLmxuLFxuICAgICAgICAgIHBvczogbnVsbCxcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgc2tpcF9lbXB0eV9saW5lcyA9IChjdXJyLmxpbmUgPT09IFwiXCIpO1xuXG4gICAgICAgIC8vIE1vdmUgb25lIHN0ZXAgdG8gc2tpcCBjaGFyYWN0ZXIgd2Ugc3RhcnQgb25cbiAgICAgICAgbmV4dENoYXIoY20sIGN1cnIpO1xuXG4gICAgICAgIHdoaWxlIChjdXJyLmxpbmUgIT09IG51bGwpIHtcblxuICAgICAgICAgIGlmIChjdXJyLmxpbmUgPT09IFwiXCIgJiYgIXNraXBfZW1wdHlfbGluZXMpIHtcbiAgICAgICAgICAgIGlmIChsYXN0X3ZhbGlkLnBvcyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXR1cm4gbGFzdF92YWxpZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4geyBsbjogY3Vyci5sbiwgcG9zOiBjdXJyLnBvcyB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChpc0VuZE9mU2VudGVuY2VTeW1ib2woY3Vyci5saW5lW2N1cnIucG9zXSlcbiAgICAgICAgICAgICAgJiYgbGFzdF92YWxpZC5wb3MgIT09IG51bGxcbiAgICAgICAgICAgICAgJiYgIShjdXJyLmxuID09PSBsYXN0X3ZhbGlkLmxuICYmIGN1cnIucG9zICsgMSA9PT0gbGFzdF92YWxpZC5wb3MpKSB7XG4gICAgICAgICAgICByZXR1cm4gbGFzdF92YWxpZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAoY3Vyci5saW5lICE9PSBcIlwiICYmICFpc1doaXRlU3BhY2VTdHJpbmcoY3Vyci5saW5lW2N1cnIucG9zXSkpIHtcbiAgICAgICAgICAgIHNraXBfZW1wdHlfbGluZXMgPSBmYWxzZTtcbiAgICAgICAgICAgIGxhc3RfdmFsaWQgPSB7IGxuOiBjdXJyLmxuLCBwb3M6IGN1cnIucG9zIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXh0Q2hhcihjbSwgY3Vycik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgIFNldCB0aGUgcG9zaXRpb24gdG8gdGhlIGZpcnN0IG5vbiB3aGl0ZXNwYWNlIGNoYXJhY3RlciBvbiB0aGUgbGFzdFxuICAgICAgICAgIHZhbGlkIGxpbmUgaW4gdGhlIGNhc2UgdGhhdCB3ZSByZWFjaCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBkb2N1bWVudC5cbiAgICAgICAgKi9cbiAgICAgICAgdmFyIGxpbmUgPSBjbS5nZXRMaW5lKGxhc3RfdmFsaWQubG4pO1xuICAgICAgICBsYXN0X3ZhbGlkLnBvcyA9IDA7XG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBsaW5lLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgaWYgKCFpc1doaXRlU3BhY2VTdHJpbmcobGluZVtpXSkpIHtcbiAgICAgICAgICAgIGxhc3RfdmFsaWQucG9zID0gaTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGFzdF92YWxpZDtcbiAgICAgIH1cblxuICAgICAgdmFyIGN1cnJfaW5kZXggPSB7XG4gICAgICAgIGxuOiBjdXIubGluZSxcbiAgICAgICAgcG9zOiBjdXIuY2gsXG4gICAgICB9O1xuXG4gICAgICB3aGlsZSAocmVwZWF0ID4gMCkge1xuICAgICAgICBpZiAoZGlyIDwgMCkge1xuICAgICAgICAgIGN1cnJfaW5kZXggPSByZXZlcnNlKGNtLCBjdXJyX2luZGV4LmxuLCBjdXJyX2luZGV4LnBvcywgZGlyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBjdXJyX2luZGV4ID0gZm9yd2FyZChjbSwgY3Vycl9pbmRleC5sbiwgY3Vycl9pbmRleC5wb3MsIGRpcik7XG4gICAgICAgIH1cbiAgICAgICAgcmVwZWF0LS07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBQb3MoY3Vycl9pbmRleC5sbiwgY3Vycl9pbmRleC5wb3MpO1xuICAgIH1cblxuICAgIC8vIFRPRE86IHBlcmhhcHMgdGhpcyBmaW5hZ2xpbmcgb2Ygc3RhcnQgYW5kIGVuZCBwb3NpdGlvbnMgYmVsb25kc1xuICAgIC8vIGluIGNvZGVtaXJyb3IvcmVwbGFjZVJhbmdlP1xuICAgIGZ1bmN0aW9uIHNlbGVjdENvbXBhbmlvbk9iamVjdChjbSwgaGVhZCwgc3ltYiwgaW5jbHVzaXZlKSB7XG4gICAgICB2YXIgY3VyID0gaGVhZCwgc3RhcnQsIGVuZDtcblxuICAgICAgdmFyIGJyYWNrZXRSZWdleHAgPSAoe1xuICAgICAgICAnKCc6IC9bKCldLywgJyknOiAvWygpXS8sXG4gICAgICAgICdbJzogL1tbXFxdXS8sICddJzogL1tbXFxdXS8sXG4gICAgICAgICd7JzogL1t7fV0vLCAnfSc6IC9be31dLyxcbiAgICAgICAgJzwnOiAvWzw+XS8sICc+JzogL1s8Pl0vfSlbc3ltYl07XG4gICAgICB2YXIgb3BlblN5bSA9ICh7XG4gICAgICAgICcoJzogJygnLCAnKSc6ICcoJyxcbiAgICAgICAgJ1snOiAnWycsICddJzogJ1snLFxuICAgICAgICAneyc6ICd7JywgJ30nOiAneycsXG4gICAgICAgICc8JzogJzwnLCAnPic6ICc8J30pW3N5bWJdO1xuICAgICAgdmFyIGN1ckNoYXIgPSBjbS5nZXRMaW5lKGN1ci5saW5lKS5jaGFyQXQoY3VyLmNoKTtcbiAgICAgIC8vIER1ZSB0byB0aGUgYmVoYXZpb3Igb2Ygc2NhbkZvckJyYWNrZXQsIHdlIG5lZWQgdG8gYWRkIGFuIG9mZnNldCBpZiB0aGVcbiAgICAgIC8vIGN1cnNvciBpcyBvbiBhIG1hdGNoaW5nIG9wZW4gYnJhY2tldC5cbiAgICAgIHZhciBvZmZzZXQgPSBjdXJDaGFyID09PSBvcGVuU3ltID8gMSA6IDA7XG5cbiAgICAgIHN0YXJ0ID0gY20uc2NhbkZvckJyYWNrZXQoUG9zKGN1ci5saW5lLCBjdXIuY2ggKyBvZmZzZXQpLCAtMSwgdW5kZWZpbmVkLCB7J2JyYWNrZXRSZWdleCc6IGJyYWNrZXRSZWdleHB9KTtcbiAgICAgIGVuZCA9IGNtLnNjYW5Gb3JCcmFja2V0KFBvcyhjdXIubGluZSwgY3VyLmNoICsgb2Zmc2V0KSwgMSwgdW5kZWZpbmVkLCB7J2JyYWNrZXRSZWdleCc6IGJyYWNrZXRSZWdleHB9KTtcblxuICAgICAgaWYgKCFzdGFydCB8fCAhZW5kKSB7XG4gICAgICAgIHJldHVybiB7IHN0YXJ0OiBjdXIsIGVuZDogY3VyIH07XG4gICAgICB9XG5cbiAgICAgIHN0YXJ0ID0gc3RhcnQucG9zO1xuICAgICAgZW5kID0gZW5kLnBvcztcblxuICAgICAgaWYgKChzdGFydC5saW5lID09IGVuZC5saW5lICYmIHN0YXJ0LmNoID4gZW5kLmNoKVxuICAgICAgICAgIHx8IChzdGFydC5saW5lID4gZW5kLmxpbmUpKSB7XG4gICAgICAgIHZhciB0bXAgPSBzdGFydDtcbiAgICAgICAgc3RhcnQgPSBlbmQ7XG4gICAgICAgIGVuZCA9IHRtcDtcbiAgICAgIH1cblxuICAgICAgaWYgKGluY2x1c2l2ZSkge1xuICAgICAgICBlbmQuY2ggKz0gMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXJ0LmNoICs9IDE7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7IHN0YXJ0OiBzdGFydCwgZW5kOiBlbmQgfTtcbiAgICB9XG5cbiAgICAvLyBUYWtlcyBpbiBhIHN5bWJvbCBhbmQgYSBjdXJzb3IgYW5kIHRyaWVzIHRvIHNpbXVsYXRlIHRleHQgb2JqZWN0cyB0aGF0XG4gICAgLy8gaGF2ZSBpZGVudGljYWwgb3BlbmluZyBhbmQgY2xvc2luZyBzeW1ib2xzXG4gICAgLy8gVE9ETyBzdXBwb3J0IGFjcm9zcyBtdWx0aXBsZSBsaW5lc1xuICAgIGZ1bmN0aW9uIGZpbmRCZWdpbm5pbmdBbmRFbmQoY20sIGhlYWQsIHN5bWIsIGluY2x1c2l2ZSkge1xuICAgICAgdmFyIGN1ciA9IGNvcHlDdXJzb3IoaGVhZCk7XG4gICAgICB2YXIgbGluZSA9IGNtLmdldExpbmUoY3VyLmxpbmUpO1xuICAgICAgdmFyIGNoYXJzID0gbGluZS5zcGxpdCgnJyk7XG4gICAgICB2YXIgc3RhcnQsIGVuZCwgaSwgbGVuO1xuICAgICAgdmFyIGZpcnN0SW5kZXggPSBjaGFycy5pbmRleE9mKHN5bWIpO1xuXG4gICAgICAvLyB0aGUgZGVjaXNpb24gdHJlZSBpcyB0byBhbHdheXMgbG9vayBiYWNrd2FyZHMgZm9yIHRoZSBiZWdpbm5pbmcgZmlyc3QsXG4gICAgICAvLyBidXQgaWYgdGhlIGN1cnNvciBpcyBpbiBmcm9udCBvZiB0aGUgZmlyc3QgaW5zdGFuY2Ugb2YgdGhlIHN5bWIsXG4gICAgICAvLyB0aGVuIG1vdmUgdGhlIGN1cnNvciBmb3J3YXJkXG4gICAgICBpZiAoY3VyLmNoIDwgZmlyc3RJbmRleCkge1xuICAgICAgICBjdXIuY2ggPSBmaXJzdEluZGV4O1xuICAgICAgICAvLyBXaHkgaXMgdGhpcyBsaW5lIGV2ZW4gaGVyZT8/P1xuICAgICAgICAvLyBjbS5zZXRDdXJzb3IoY3VyLmxpbmUsIGZpcnN0SW5kZXgrMSk7XG4gICAgICB9XG4gICAgICAvLyBvdGhlcndpc2UgaWYgdGhlIGN1cnNvciBpcyBjdXJyZW50bHkgb24gdGhlIGNsb3Npbmcgc3ltYm9sXG4gICAgICBlbHNlIGlmIChmaXJzdEluZGV4IDwgY3VyLmNoICYmIGNoYXJzW2N1ci5jaF0gPT0gc3ltYikge1xuICAgICAgICBlbmQgPSBjdXIuY2g7IC8vIGFzc2lnbiBlbmQgdG8gdGhlIGN1cnJlbnQgY3Vyc29yXG4gICAgICAgIC0tY3VyLmNoOyAvLyBtYWtlIHN1cmUgdG8gbG9vayBiYWNrd2FyZHNcbiAgICAgIH1cblxuICAgICAgLy8gaWYgd2UncmUgY3VycmVudGx5IG9uIHRoZSBzeW1ib2wsIHdlJ3ZlIGdvdCBhIHN0YXJ0XG4gICAgICBpZiAoY2hhcnNbY3VyLmNoXSA9PSBzeW1iICYmICFlbmQpIHtcbiAgICAgICAgc3RhcnQgPSBjdXIuY2ggKyAxOyAvLyBhc3NpZ24gc3RhcnQgdG8gYWhlYWQgb2YgdGhlIGN1cnNvclxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZ28gYmFja3dhcmRzIHRvIGZpbmQgdGhlIHN0YXJ0XG4gICAgICAgIGZvciAoaSA9IGN1ci5jaDsgaSA+IC0xICYmICFzdGFydDsgaS0tKSB7XG4gICAgICAgICAgaWYgKGNoYXJzW2ldID09IHN5bWIpIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gaSArIDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGxvb2sgZm9yd2FyZHMgZm9yIHRoZSBlbmQgc3ltYm9sXG4gICAgICBpZiAoc3RhcnQgJiYgIWVuZCkge1xuICAgICAgICBmb3IgKGkgPSBzdGFydCwgbGVuID0gY2hhcnMubGVuZ3RoOyBpIDwgbGVuICYmICFlbmQ7IGkrKykge1xuICAgICAgICAgIGlmIChjaGFyc1tpXSA9PSBzeW1iKSB7XG4gICAgICAgICAgICBlbmQgPSBpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBub3RoaW5nIGZvdW5kXG4gICAgICBpZiAoIXN0YXJ0IHx8ICFlbmQpIHtcbiAgICAgICAgcmV0dXJuIHsgc3RhcnQ6IGN1ciwgZW5kOiBjdXIgfTtcbiAgICAgIH1cblxuICAgICAgLy8gaW5jbHVkZSB0aGUgc3ltYm9sc1xuICAgICAgaWYgKGluY2x1c2l2ZSkge1xuICAgICAgICAtLXN0YXJ0OyArK2VuZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnQ6IFBvcyhjdXIubGluZSwgc3RhcnQpLFxuICAgICAgICBlbmQ6IFBvcyhjdXIubGluZSwgZW5kKVxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBTZWFyY2ggZnVuY3Rpb25zXG4gICAgZGVmaW5lT3B0aW9uKCdwY3JlJywgdHJ1ZSwgJ2Jvb2xlYW4nKTtcbiAgICBmdW5jdGlvbiBTZWFyY2hTdGF0ZSgpIHt9XG4gICAgU2VhcmNoU3RhdGUucHJvdG90eXBlID0ge1xuICAgICAgZ2V0UXVlcnk6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdmltR2xvYmFsU3RhdGUucXVlcnk7XG4gICAgICB9LFxuICAgICAgc2V0UXVlcnk6IGZ1bmN0aW9uKHF1ZXJ5KSB7XG4gICAgICAgIHZpbUdsb2JhbFN0YXRlLnF1ZXJ5ID0gcXVlcnk7XG4gICAgICB9LFxuICAgICAgZ2V0T3ZlcmxheTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlYXJjaE92ZXJsYXk7XG4gICAgICB9LFxuICAgICAgc2V0T3ZlcmxheTogZnVuY3Rpb24ob3ZlcmxheSkge1xuICAgICAgICB0aGlzLnNlYXJjaE92ZXJsYXkgPSBvdmVybGF5O1xuICAgICAgfSxcbiAgICAgIGlzUmV2ZXJzZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdmltR2xvYmFsU3RhdGUuaXNSZXZlcnNlZDtcbiAgICAgIH0sXG4gICAgICBzZXRSZXZlcnNlZDogZnVuY3Rpb24ocmV2ZXJzZWQpIHtcbiAgICAgICAgdmltR2xvYmFsU3RhdGUuaXNSZXZlcnNlZCA9IHJldmVyc2VkO1xuICAgICAgfSxcbiAgICAgIGdldFNjcm9sbGJhckFubm90YXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5ub3RhdGU7XG4gICAgICB9LFxuICAgICAgc2V0U2Nyb2xsYmFyQW5ub3RhdGU6IGZ1bmN0aW9uKGFubm90YXRlKSB7XG4gICAgICAgIHRoaXMuYW5ub3RhdGUgPSBhbm5vdGF0ZTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGZ1bmN0aW9uIGdldFNlYXJjaFN0YXRlKGNtKSB7XG4gICAgICB2YXIgdmltID0gY20uc3RhdGUudmltO1xuICAgICAgcmV0dXJuIHZpbS5zZWFyY2hTdGF0ZV8gfHwgKHZpbS5zZWFyY2hTdGF0ZV8gPSBuZXcgU2VhcmNoU3RhdGUoKSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRpYWxvZyhjbSwgdGVtcGxhdGUsIHNob3J0VGV4dCwgb25DbG9zZSwgb3B0aW9ucykge1xuICAgICAgaWYgKGNtLm9wZW5EaWFsb2cpIHtcbiAgICAgICAgY20ub3BlbkRpYWxvZyh0ZW1wbGF0ZSwgb25DbG9zZSwgeyBib3R0b206IHRydWUsIHZhbHVlOiBvcHRpb25zLnZhbHVlLFxuICAgICAgICAgICAgb25LZXlEb3duOiBvcHRpb25zLm9uS2V5RG93biwgb25LZXlVcDogb3B0aW9ucy5vbktleVVwLFxuICAgICAgICAgICAgc2VsZWN0VmFsdWVPbk9wZW46IGZhbHNlfSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgb25DbG9zZShwcm9tcHQoc2hvcnRUZXh0LCAnJykpO1xuICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBzcGxpdEJ5U2xhc2goYXJnU3RyaW5nKSB7XG4gICAgICByZXR1cm4gc3BsaXRCeVNlcGFyYXRvcihhcmdTdHJpbmcsICcvJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmluZFVuZXNjYXBlZFNsYXNoZXMoYXJnU3RyaW5nKSB7XG4gICAgICByZXR1cm4gZmluZFVuZXNjYXBlZFNlcGFyYXRvcnMoYXJnU3RyaW5nLCAnLycpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNwbGl0QnlTZXBhcmF0b3IoYXJnU3RyaW5nLCBzZXBhcmF0b3IpIHtcbiAgICAgIHZhciBzbGFzaGVzID0gZmluZFVuZXNjYXBlZFNlcGFyYXRvcnMoYXJnU3RyaW5nLCBzZXBhcmF0b3IpIHx8IFtdO1xuICAgICAgaWYgKCFzbGFzaGVzLmxlbmd0aCkgcmV0dXJuIFtdO1xuICAgICAgdmFyIHRva2VucyA9IFtdO1xuICAgICAgLy8gaW4gY2FzZSBvZiBzdHJpbmdzIGxpa2UgZm9vL2JhclxuICAgICAgaWYgKHNsYXNoZXNbMF0gIT09IDApIHJldHVybjtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xhc2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodHlwZW9mIHNsYXNoZXNbaV0gPT0gJ251bWJlcicpXG4gICAgICAgICAgdG9rZW5zLnB1c2goYXJnU3RyaW5nLnN1YnN0cmluZyhzbGFzaGVzW2ldICsgMSwgc2xhc2hlc1tpKzFdKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdG9rZW5zO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbmRVbmVzY2FwZWRTZXBhcmF0b3JzKHN0ciwgc2VwYXJhdG9yKSB7XG4gICAgICBpZiAoIXNlcGFyYXRvcilcbiAgICAgICAgc2VwYXJhdG9yID0gJy8nO1xuXG4gICAgICB2YXIgZXNjYXBlTmV4dENoYXIgPSBmYWxzZTtcbiAgICAgIHZhciBzbGFzaGVzID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgYyA9IHN0ci5jaGFyQXQoaSk7XG4gICAgICAgIGlmICghZXNjYXBlTmV4dENoYXIgJiYgYyA9PSBzZXBhcmF0b3IpIHtcbiAgICAgICAgICBzbGFzaGVzLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgICAgZXNjYXBlTmV4dENoYXIgPSAhZXNjYXBlTmV4dENoYXIgJiYgKGMgPT0gJ1xcXFwnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzbGFzaGVzO1xuICAgIH1cblxuICAgIC8vIFRyYW5zbGF0ZXMgYSBzZWFyY2ggc3RyaW5nIGZyb20gZXggKHZpbSkgc3ludGF4IGludG8gamF2YXNjcmlwdCBmb3JtLlxuICAgIGZ1bmN0aW9uIHRyYW5zbGF0ZVJlZ2V4KHN0cikge1xuICAgICAgLy8gV2hlbiB0aGVzZSBtYXRjaCwgYWRkIGEgJ1xcJyBpZiB1bmVzY2FwZWQgb3IgcmVtb3ZlIG9uZSBpZiBlc2NhcGVkLlxuICAgICAgdmFyIHNwZWNpYWxzID0gJ3woKXsnO1xuICAgICAgLy8gUmVtb3ZlLCBidXQgbmV2ZXIgYWRkLCBhICdcXCcgZm9yIHRoZXNlLlxuICAgICAgdmFyIHVuZXNjYXBlID0gJ30nO1xuICAgICAgdmFyIGVzY2FwZU5leHRDaGFyID0gZmFsc2U7XG4gICAgICB2YXIgb3V0ID0gW107XG4gICAgICBmb3IgKHZhciBpID0gLTE7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGMgPSBzdHIuY2hhckF0KGkpIHx8ICcnO1xuICAgICAgICB2YXIgbiA9IHN0ci5jaGFyQXQoaSsxKSB8fCAnJztcbiAgICAgICAgdmFyIHNwZWNpYWxDb21lc05leHQgPSAobiAmJiBzcGVjaWFscy5pbmRleE9mKG4pICE9IC0xKTtcbiAgICAgICAgaWYgKGVzY2FwZU5leHRDaGFyKSB7XG4gICAgICAgICAgaWYgKGMgIT09ICdcXFxcJyB8fCAhc3BlY2lhbENvbWVzTmV4dCkge1xuICAgICAgICAgICAgb3V0LnB1c2goYyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVzY2FwZU5leHRDaGFyID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGMgPT09ICdcXFxcJykge1xuICAgICAgICAgICAgZXNjYXBlTmV4dENoYXIgPSB0cnVlO1xuICAgICAgICAgICAgLy8gVHJlYXQgdGhlIHVuZXNjYXBlIGxpc3QgYXMgc3BlY2lhbCBmb3IgcmVtb3ZpbmcsIGJ1dCBub3QgYWRkaW5nICdcXCcuXG4gICAgICAgICAgICBpZiAobiAmJiB1bmVzY2FwZS5pbmRleE9mKG4pICE9IC0xKSB7XG4gICAgICAgICAgICAgIHNwZWNpYWxDb21lc05leHQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTm90IHBhc3NpbmcgdGhpcyB0ZXN0IG1lYW5zIHJlbW92aW5nIGEgJ1xcJy5cbiAgICAgICAgICAgIGlmICghc3BlY2lhbENvbWVzTmV4dCB8fCBuID09PSAnXFxcXCcpIHtcbiAgICAgICAgICAgICAgb3V0LnB1c2goYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dC5wdXNoKGMpO1xuICAgICAgICAgICAgaWYgKHNwZWNpYWxDb21lc05leHQgJiYgbiAhPT0gJ1xcXFwnKSB7XG4gICAgICAgICAgICAgIG91dC5wdXNoKCdcXFxcJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0LmpvaW4oJycpO1xuICAgIH1cblxuICAgIC8vIFRyYW5zbGF0ZXMgdGhlIHJlcGxhY2UgcGFydCBvZiBhIHNlYXJjaCBhbmQgcmVwbGFjZSBmcm9tIGV4ICh2aW0pIHN5bnRheCBpbnRvXG4gICAgLy8gamF2YXNjcmlwdCBmb3JtLiAgU2ltaWxhciB0byB0cmFuc2xhdGVSZWdleCwgYnV0IGFkZGl0aW9uYWxseSBmaXhlcyBiYWNrIHJlZmVyZW5jZXNcbiAgICAvLyAodHJhbnNsYXRlcyAnXFxbMC4uOV0nIHRvICckWzAuLjldJykgYW5kIGZvbGxvd3MgZGlmZmVyZW50IHJ1bGVzIGZvciBlc2NhcGluZyAnJCcuXG4gICAgdmFyIGNoYXJVbmVzY2FwZXMgPSB7J1xcXFxuJzogJ1xcbicsICdcXFxccic6ICdcXHInLCAnXFxcXHQnOiAnXFx0J307XG4gICAgZnVuY3Rpb24gdHJhbnNsYXRlUmVnZXhSZXBsYWNlKHN0cikge1xuICAgICAgdmFyIGVzY2FwZU5leHRDaGFyID0gZmFsc2U7XG4gICAgICB2YXIgb3V0ID0gW107XG4gICAgICBmb3IgKHZhciBpID0gLTE7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGMgPSBzdHIuY2hhckF0KGkpIHx8ICcnO1xuICAgICAgICB2YXIgbiA9IHN0ci5jaGFyQXQoaSsxKSB8fCAnJztcbiAgICAgICAgaWYgKGNoYXJVbmVzY2FwZXNbYyArIG5dKSB7XG4gICAgICAgICAgb3V0LnB1c2goY2hhclVuZXNjYXBlc1tjK25dKTtcbiAgICAgICAgICBpKys7XG4gICAgICAgIH0gZWxzZSBpZiAoZXNjYXBlTmV4dENoYXIpIHtcbiAgICAgICAgICAvLyBBdCBhbnkgcG9pbnQgaW4gdGhlIGxvb3AsIGVzY2FwZU5leHRDaGFyIGlzIHRydWUgaWYgdGhlIHByZXZpb3VzXG4gICAgICAgICAgLy8gY2hhcmFjdGVyIHdhcyBhICdcXCcgYW5kIHdhcyBub3QgZXNjYXBlZC5cbiAgICAgICAgICBvdXQucHVzaChjKTtcbiAgICAgICAgICBlc2NhcGVOZXh0Q2hhciA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChjID09PSAnXFxcXCcpIHtcbiAgICAgICAgICAgIGVzY2FwZU5leHRDaGFyID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmICgoaXNOdW1iZXIobikgfHwgbiA9PT0gJyQnKSkge1xuICAgICAgICAgICAgICBvdXQucHVzaCgnJCcpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuICE9PSAnLycgJiYgbiAhPT0gJ1xcXFwnKSB7XG4gICAgICAgICAgICAgIG91dC5wdXNoKCdcXFxcJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChjID09PSAnJCcpIHtcbiAgICAgICAgICAgICAgb3V0LnB1c2goJyQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG91dC5wdXNoKGMpO1xuICAgICAgICAgICAgaWYgKG4gPT09ICcvJykge1xuICAgICAgICAgICAgICBvdXQucHVzaCgnXFxcXCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG91dC5qb2luKCcnKTtcbiAgICB9XG5cbiAgICAvLyBVbmVzY2FwZSBcXCBhbmQgLyBpbiB0aGUgcmVwbGFjZSBwYXJ0LCBmb3IgUENSRSBtb2RlLlxuICAgIHZhciB1bmVzY2FwZXMgPSB7J1xcXFwvJzogJy8nLCAnXFxcXFxcXFwnOiAnXFxcXCcsICdcXFxcbic6ICdcXG4nLCAnXFxcXHInOiAnXFxyJywgJ1xcXFx0JzogJ1xcdCcsICdcXFxcJic6JyYnfTtcbiAgICBmdW5jdGlvbiB1bmVzY2FwZVJlZ2V4UmVwbGFjZShzdHIpIHtcbiAgICAgIHZhciBzdHJlYW0gPSBuZXcgQ29kZU1pcnJvci5TdHJpbmdTdHJlYW0oc3RyKTtcbiAgICAgIHZhciBvdXRwdXQgPSBbXTtcbiAgICAgIHdoaWxlICghc3RyZWFtLmVvbCgpKSB7XG4gICAgICAgIC8vIFNlYXJjaCBmb3IgXFwuXG4gICAgICAgIHdoaWxlIChzdHJlYW0ucGVlaygpICYmIHN0cmVhbS5wZWVrKCkgIT0gJ1xcXFwnKSB7XG4gICAgICAgICAgb3V0cHV0LnB1c2goc3RyZWFtLm5leHQoKSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG1hdGNoZWQgPSBmYWxzZTtcbiAgICAgICAgZm9yICh2YXIgbWF0Y2hlciBpbiB1bmVzY2FwZXMpIHtcbiAgICAgICAgICBpZiAoc3RyZWFtLm1hdGNoKG1hdGNoZXIsIHRydWUpKSB7XG4gICAgICAgICAgICBtYXRjaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIG91dHB1dC5wdXNoKHVuZXNjYXBlc1ttYXRjaGVyXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFtYXRjaGVkKSB7XG4gICAgICAgICAgLy8gRG9uJ3QgY2hhbmdlIGFueXRoaW5nXG4gICAgICAgICAgb3V0cHV0LnB1c2goc3RyZWFtLm5leHQoKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXRwdXQuam9pbignJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXh0cmFjdCB0aGUgcmVndWxhciBleHByZXNzaW9uIGZyb20gdGhlIHF1ZXJ5IGFuZCByZXR1cm4gYSBSZWdleHAgb2JqZWN0LlxuICAgICAqIFJldHVybnMgbnVsbCBpZiB0aGUgcXVlcnkgaXMgYmxhbmsuXG4gICAgICogSWYgaWdub3JlQ2FzZSBpcyBwYXNzZWQgaW4sIHRoZSBSZWdleHAgb2JqZWN0IHdpbGwgaGF2ZSB0aGUgJ2knIGZsYWcgc2V0LlxuICAgICAqIElmIHNtYXJ0Q2FzZSBpcyBwYXNzZWQgaW4sIGFuZCB0aGUgcXVlcnkgY29udGFpbnMgdXBwZXIgY2FzZSBsZXR0ZXJzLFxuICAgICAqICAgdGhlbiBpZ25vcmVDYXNlIGlzIG92ZXJyaWRkZW4sIGFuZCB0aGUgJ2knIGZsYWcgd2lsbCBub3QgYmUgc2V0LlxuICAgICAqIElmIHRoZSBxdWVyeSBjb250YWlucyB0aGUgL2kgaW4gdGhlIGZsYWcgcGFydCBvZiB0aGUgcmVndWxhciBleHByZXNzaW9uLFxuICAgICAqICAgdGhlbiBib3RoIGlnbm9yZUNhc2UgYW5kIHNtYXJ0Q2FzZSBhcmUgaWdub3JlZCwgYW5kICdpJyB3aWxsIGJlIHBhc3NlZFxuICAgICAqICAgdGhyb3VnaCB0byB0aGUgUmVnZXggb2JqZWN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHBhcnNlUXVlcnkocXVlcnksIGlnbm9yZUNhc2UsIHNtYXJ0Q2FzZSkge1xuICAgICAgLy8gRmlyc3QgdXBkYXRlIHRoZSBsYXN0IHNlYXJjaCByZWdpc3RlclxuICAgICAgdmFyIGxhc3RTZWFyY2hSZWdpc3RlciA9IHZpbUdsb2JhbFN0YXRlLnJlZ2lzdGVyQ29udHJvbGxlci5nZXRSZWdpc3RlcignLycpO1xuICAgICAgbGFzdFNlYXJjaFJlZ2lzdGVyLnNldFRleHQocXVlcnkpO1xuICAgICAgLy8gQ2hlY2sgaWYgdGhlIHF1ZXJ5IGlzIGFscmVhZHkgYSByZWdleC5cbiAgICAgIGlmIChxdWVyeSBpbnN0YW5jZW9mIFJlZ0V4cCkgeyByZXR1cm4gcXVlcnk7IH1cbiAgICAgIC8vIEZpcnN0IHRyeSB0byBleHRyYWN0IHJlZ2V4ICsgZmxhZ3MgZnJvbSB0aGUgaW5wdXQuIElmIG5vIGZsYWdzIGZvdW5kLFxuICAgICAgLy8gZXh0cmFjdCBqdXN0IHRoZSByZWdleC4gSUUgZG9lcyBub3QgYWNjZXB0IGZsYWdzIGRpcmVjdGx5IGRlZmluZWQgaW5cbiAgICAgIC8vIHRoZSByZWdleCBzdHJpbmcgaW4gdGhlIGZvcm0gL3JlZ2V4L2ZsYWdzXG4gICAgICB2YXIgc2xhc2hlcyA9IGZpbmRVbmVzY2FwZWRTbGFzaGVzKHF1ZXJ5KTtcbiAgICAgIHZhciByZWdleFBhcnQ7XG4gICAgICB2YXIgZm9yY2VJZ25vcmVDYXNlO1xuICAgICAgaWYgKCFzbGFzaGVzLmxlbmd0aCkge1xuICAgICAgICAvLyBRdWVyeSBsb29rcyBsaWtlICdyZWdleHAnXG4gICAgICAgIHJlZ2V4UGFydCA9IHF1ZXJ5O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gUXVlcnkgbG9va3MgbGlrZSAncmVnZXhwLy4uLidcbiAgICAgICAgcmVnZXhQYXJ0ID0gcXVlcnkuc3Vic3RyaW5nKDAsIHNsYXNoZXNbMF0pO1xuICAgICAgICB2YXIgZmxhZ3NQYXJ0ID0gcXVlcnkuc3Vic3RyaW5nKHNsYXNoZXNbMF0pO1xuICAgICAgICBmb3JjZUlnbm9yZUNhc2UgPSAoZmxhZ3NQYXJ0LmluZGV4T2YoJ2knKSAhPSAtMSk7XG4gICAgICB9XG4gICAgICBpZiAoIXJlZ2V4UGFydCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmICghZ2V0T3B0aW9uKCdwY3JlJykpIHtcbiAgICAgICAgcmVnZXhQYXJ0ID0gdHJhbnNsYXRlUmVnZXgocmVnZXhQYXJ0KTtcbiAgICAgIH1cbiAgICAgIGlmIChzbWFydENhc2UpIHtcbiAgICAgICAgaWdub3JlQ2FzZSA9ICgvXlteQS1aXSokLykudGVzdChyZWdleFBhcnQpO1xuICAgICAgfVxuICAgICAgdmFyIHJlZ2V4cCA9IG5ldyBSZWdFeHAocmVnZXhQYXJ0LFxuICAgICAgICAgIChpZ25vcmVDYXNlIHx8IGZvcmNlSWdub3JlQ2FzZSkgPyAnaScgOiB1bmRlZmluZWQpO1xuICAgICAgcmV0dXJuIHJlZ2V4cDtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2hvd0NvbmZpcm0oY20sIHRleHQpIHtcbiAgICAgIGlmIChjbS5vcGVuTm90aWZpY2F0aW9uKSB7XG4gICAgICAgIGNtLm9wZW5Ob3RpZmljYXRpb24oJzxzcGFuIHN0eWxlPVwiY29sb3I6IHJlZFwiPicgKyB0ZXh0ICsgJzwvc3Bhbj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtib3R0b206IHRydWUsIGR1cmF0aW9uOiA1MDAwfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbGVydCh0ZXh0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gbWFrZVByb21wdChwcmVmaXgsIGRlc2MpIHtcbiAgICAgIHZhciByYXcgPSAnPHNwYW4gc3R5bGU9XCJmb250LWZhbWlseTogbW9ub3NwYWNlOyB3aGl0ZS1zcGFjZTogcHJlXCI+JyArXG4gICAgICAgICAgKHByZWZpeCB8fCBcIlwiKSArICc8aW5wdXQgdHlwZT1cInRleHRcIiBhdXRvY29ycmVjdD1cIm9mZlwiICcgK1xuICAgICAgICAgICdhdXRvY2FwaXRhbGl6ZT1cIm9mZlwiIHNwZWxsY2hlY2s9XCJmYWxzZVwiPjwvc3Bhbj4nO1xuICAgICAgaWYgKGRlc2MpXG4gICAgICAgIHJhdyArPSAnIDxzcGFuIHN0eWxlPVwiY29sb3I6ICM4ODhcIj4nICsgZGVzYyArICc8L3NwYW4+JztcbiAgICAgIHJldHVybiByYXc7XG4gICAgfVxuICAgIHZhciBzZWFyY2hQcm9tcHREZXNjID0gJyhKYXZhc2NyaXB0IHJlZ2V4cCknO1xuICAgIGZ1bmN0aW9uIHNob3dQcm9tcHQoY20sIG9wdGlvbnMpIHtcbiAgICAgIHZhciBzaG9ydFRleHQgPSAob3B0aW9ucy5wcmVmaXggfHwgJycpICsgJyAnICsgKG9wdGlvbnMuZGVzYyB8fCAnJyk7XG4gICAgICB2YXIgcHJvbXB0ID0gbWFrZVByb21wdChvcHRpb25zLnByZWZpeCwgb3B0aW9ucy5kZXNjKTtcbiAgICAgIGRpYWxvZyhjbSwgcHJvbXB0LCBzaG9ydFRleHQsIG9wdGlvbnMub25DbG9zZSwgb3B0aW9ucyk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlZ2V4RXF1YWwocjEsIHIyKSB7XG4gICAgICBpZiAocjEgaW5zdGFuY2VvZiBSZWdFeHAgJiYgcjIgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICB2YXIgcHJvcHMgPSBbJ2dsb2JhbCcsICdtdWx0aWxpbmUnLCAnaWdub3JlQ2FzZScsICdzb3VyY2UnXTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIHZhciBwcm9wID0gcHJvcHNbaV07XG4gICAgICAgICAgICAgIGlmIChyMVtwcm9wXSAhPT0gcjJbcHJvcF0pIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gUmV0dXJucyB0cnVlIGlmIHRoZSBxdWVyeSBpcyB2YWxpZC5cbiAgICBmdW5jdGlvbiB1cGRhdGVTZWFyY2hRdWVyeShjbSwgcmF3UXVlcnksIGlnbm9yZUNhc2UsIHNtYXJ0Q2FzZSkge1xuICAgICAgaWYgKCFyYXdRdWVyeSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgc3RhdGUgPSBnZXRTZWFyY2hTdGF0ZShjbSk7XG4gICAgICB2YXIgcXVlcnkgPSBwYXJzZVF1ZXJ5KHJhd1F1ZXJ5LCAhIWlnbm9yZUNhc2UsICEhc21hcnRDYXNlKTtcbiAgICAgIGlmICghcXVlcnkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaGlnaGxpZ2h0U2VhcmNoTWF0Y2hlcyhjbSwgcXVlcnkpO1xuICAgICAgaWYgKHJlZ2V4RXF1YWwocXVlcnksIHN0YXRlLmdldFF1ZXJ5KCkpKSB7XG4gICAgICAgIHJldHVybiBxdWVyeTtcbiAgICAgIH1cbiAgICAgIHN0YXRlLnNldFF1ZXJ5KHF1ZXJ5KTtcbiAgICAgIHJldHVybiBxdWVyeTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2VhcmNoT3ZlcmxheShxdWVyeSkge1xuICAgICAgaWYgKHF1ZXJ5LnNvdXJjZS5jaGFyQXQoMCkgPT0gJ14nKSB7XG4gICAgICAgIHZhciBtYXRjaFNvbCA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0b2tlbjogZnVuY3Rpb24oc3RyZWFtKSB7XG4gICAgICAgICAgaWYgKG1hdGNoU29sICYmICFzdHJlYW0uc29sKCkpIHtcbiAgICAgICAgICAgIHN0cmVhbS5za2lwVG9FbmQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIG1hdGNoID0gc3RyZWFtLm1hdGNoKHF1ZXJ5LCBmYWxzZSk7XG4gICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICBpZiAobWF0Y2hbMF0ubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgLy8gTWF0Y2hlZCBlbXB0eSBzdHJpbmcsIHNraXAgdG8gbmV4dC5cbiAgICAgICAgICAgICAgc3RyZWFtLm5leHQoKTtcbiAgICAgICAgICAgICAgcmV0dXJuICdzZWFyY2hpbmcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFzdHJlYW0uc29sKCkpIHtcbiAgICAgICAgICAgICAgLy8gQmFja3RyYWNrIDEgdG8gbWF0Y2ggXFxiXG4gICAgICAgICAgICAgIHN0cmVhbS5iYWNrVXAoMSk7XG4gICAgICAgICAgICAgIGlmICghcXVlcnkuZXhlYyhzdHJlYW0ubmV4dCgpICsgbWF0Y2hbMF0pKSB7XG4gICAgICAgICAgICAgICAgc3RyZWFtLm5leHQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RyZWFtLm1hdGNoKHF1ZXJ5KTtcbiAgICAgICAgICAgIHJldHVybiAnc2VhcmNoaW5nJztcbiAgICAgICAgICB9XG4gICAgICAgICAgd2hpbGUgKCFzdHJlYW0uZW9sKCkpIHtcbiAgICAgICAgICAgIHN0cmVhbS5uZXh0KCk7XG4gICAgICAgICAgICBpZiAoc3RyZWFtLm1hdGNoKHF1ZXJ5LCBmYWxzZSkpIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcXVlcnk6IHF1ZXJ5XG4gICAgICB9O1xuICAgIH1cbiAgICB2YXIgaGlnaGxpZ2h0VGltZW91dCA9IDA7XG4gICAgZnVuY3Rpb24gaGlnaGxpZ2h0U2VhcmNoTWF0Y2hlcyhjbSwgcXVlcnkpIHtcbiAgICAgIGNsZWFyVGltZW91dChoaWdobGlnaHRUaW1lb3V0KTtcbiAgICAgIGhpZ2hsaWdodFRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VhcmNoU3RhdGUgPSBnZXRTZWFyY2hTdGF0ZShjbSk7XG4gICAgICAgIHZhciBvdmVybGF5ID0gc2VhcmNoU3RhdGUuZ2V0T3ZlcmxheSgpO1xuICAgICAgICBpZiAoIW92ZXJsYXkgfHwgcXVlcnkgIT0gb3ZlcmxheS5xdWVyeSkge1xuICAgICAgICAgIGlmIChvdmVybGF5KSB7XG4gICAgICAgICAgICBjbS5yZW1vdmVPdmVybGF5KG92ZXJsYXkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvdmVybGF5ID0gc2VhcmNoT3ZlcmxheShxdWVyeSk7XG4gICAgICAgICAgY20uYWRkT3ZlcmxheShvdmVybGF5KTtcbiAgICAgICAgICBpZiAoY20uc2hvd01hdGNoZXNPblNjcm9sbGJhcikge1xuICAgICAgICAgICAgaWYgKHNlYXJjaFN0YXRlLmdldFNjcm9sbGJhckFubm90YXRlKCkpIHtcbiAgICAgICAgICAgICAgc2VhcmNoU3RhdGUuZ2V0U2Nyb2xsYmFyQW5ub3RhdGUoKS5jbGVhcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VhcmNoU3RhdGUuc2V0U2Nyb2xsYmFyQW5ub3RhdGUoY20uc2hvd01hdGNoZXNPblNjcm9sbGJhcihxdWVyeSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZWFyY2hTdGF0ZS5zZXRPdmVybGF5KG92ZXJsYXkpO1xuICAgICAgICB9XG4gICAgICB9LCA1MCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGZpbmROZXh0KGNtLCBwcmV2LCBxdWVyeSwgcmVwZWF0KSB7XG4gICAgICBpZiAocmVwZWF0ID09PSB1bmRlZmluZWQpIHsgcmVwZWF0ID0gMTsgfVxuICAgICAgcmV0dXJuIGNtLm9wZXJhdGlvbihmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHBvcyA9IGNtLmdldEN1cnNvcigpO1xuICAgICAgICB2YXIgY3Vyc29yID0gY20uZ2V0U2VhcmNoQ3Vyc29yKHF1ZXJ5LCBwb3MpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlcGVhdDsgaSsrKSB7XG4gICAgICAgICAgdmFyIGZvdW5kID0gY3Vyc29yLmZpbmQocHJldik7XG4gICAgICAgICAgaWYgKGkgPT0gMCAmJiBmb3VuZCAmJiBjdXJzb3JFcXVhbChjdXJzb3IuZnJvbSgpLCBwb3MpKSB7IGZvdW5kID0gY3Vyc29yLmZpbmQocHJldik7IH1cbiAgICAgICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgICAvLyBTZWFyY2hDdXJzb3IgbWF5IGhhdmUgcmV0dXJuZWQgbnVsbCBiZWNhdXNlIGl0IGhpdCBFT0YsIHdyYXBcbiAgICAgICAgICAgIC8vIGFyb3VuZCBhbmQgdHJ5IGFnYWluLlxuICAgICAgICAgICAgY3Vyc29yID0gY20uZ2V0U2VhcmNoQ3Vyc29yKHF1ZXJ5LFxuICAgICAgICAgICAgICAgIChwcmV2KSA/IFBvcyhjbS5sYXN0TGluZSgpKSA6IFBvcyhjbS5maXJzdExpbmUoKSwgMCkgKTtcbiAgICAgICAgICAgIGlmICghY3Vyc29yLmZpbmQocHJldikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3Vyc29yLmZyb20oKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjbGVhclNlYXJjaEhpZ2hsaWdodChjbSkge1xuICAgICAgdmFyIHN0YXRlID0gZ2V0U2VhcmNoU3RhdGUoY20pO1xuICAgICAgY20ucmVtb3ZlT3ZlcmxheShnZXRTZWFyY2hTdGF0ZShjbSkuZ2V0T3ZlcmxheSgpKTtcbiAgICAgIHN0YXRlLnNldE92ZXJsYXkobnVsbCk7XG4gICAgICBpZiAoc3RhdGUuZ2V0U2Nyb2xsYmFyQW5ub3RhdGUoKSkge1xuICAgICAgICBzdGF0ZS5nZXRTY3JvbGxiYXJBbm5vdGF0ZSgpLmNsZWFyKCk7XG4gICAgICAgIHN0YXRlLnNldFNjcm9sbGJhckFubm90YXRlKG51bGwpO1xuICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiBwb3MgaXMgaW4gdGhlIHNwZWNpZmllZCByYW5nZSwgSU5DTFVTSVZFLlxuICAgICAqIFJhbmdlIGNhbiBiZSBzcGVjaWZpZWQgd2l0aCAxIG9yIDIgYXJndW1lbnRzLlxuICAgICAqIElmIHRoZSBmaXJzdCByYW5nZSBhcmd1bWVudCBpcyBhbiBhcnJheSwgdHJlYXQgaXQgYXMgYW4gYXJyYXkgb2YgbGluZVxuICAgICAqIG51bWJlcnMuIE1hdGNoIHBvcyBhZ2FpbnN0IGFueSBvZiB0aGUgbGluZXMuXG4gICAgICogSWYgdGhlIGZpcnN0IHJhbmdlIGFyZ3VtZW50IGlzIGEgbnVtYmVyLFxuICAgICAqICAgaWYgdGhlcmUgaXMgb25seSAxIHJhbmdlIGFyZ3VtZW50LCBjaGVjayBpZiBwb3MgaGFzIHRoZSBzYW1lIGxpbmVcbiAgICAgKiAgICAgICBudW1iZXJcbiAgICAgKiAgIGlmIHRoZXJlIGFyZSAyIHJhbmdlIGFyZ3VtZW50cywgdGhlbiBjaGVjayBpZiBwb3MgaXMgaW4gYmV0d2VlbiB0aGUgdHdvXG4gICAgICogICAgICAgcmFuZ2UgYXJndW1lbnRzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzSW5SYW5nZShwb3MsIHN0YXJ0LCBlbmQpIHtcbiAgICAgIGlmICh0eXBlb2YgcG9zICE9ICdudW1iZXInKSB7XG4gICAgICAgIC8vIEFzc3VtZSBpdCBpcyBhIGN1cnNvciBwb3NpdGlvbi4gR2V0IHRoZSBsaW5lIG51bWJlci5cbiAgICAgICAgcG9zID0gcG9zLmxpbmU7XG4gICAgICB9XG4gICAgICBpZiAoc3RhcnQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICByZXR1cm4gaW5BcnJheShwb3MsIHN0YXJ0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChlbmQpIHtcbiAgICAgICAgICByZXR1cm4gKHBvcyA+PSBzdGFydCAmJiBwb3MgPD0gZW5kKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcG9zID09IHN0YXJ0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldFVzZXJWaXNpYmxlTGluZXMoY20pIHtcbiAgICAgIHZhciBzY3JvbGxJbmZvID0gY20uZ2V0U2Nyb2xsSW5mbygpO1xuICAgICAgdmFyIG9jY2x1ZGVUb2xlcmFuY2VUb3AgPSA2O1xuICAgICAgdmFyIG9jY2x1ZGVUb2xlcmFuY2VCb3R0b20gPSAxMDtcbiAgICAgIHZhciBmcm9tID0gY20uY29vcmRzQ2hhcih7bGVmdDowLCB0b3A6IG9jY2x1ZGVUb2xlcmFuY2VUb3AgKyBzY3JvbGxJbmZvLnRvcH0sICdsb2NhbCcpO1xuICAgICAgdmFyIGJvdHRvbVkgPSBzY3JvbGxJbmZvLmNsaWVudEhlaWdodCAtIG9jY2x1ZGVUb2xlcmFuY2VCb3R0b20gKyBzY3JvbGxJbmZvLnRvcDtcbiAgICAgIHZhciB0byA9IGNtLmNvb3Jkc0NoYXIoe2xlZnQ6MCwgdG9wOiBib3R0b21ZfSwgJ2xvY2FsJyk7XG4gICAgICByZXR1cm4ge3RvcDogZnJvbS5saW5lLCBib3R0b206IHRvLmxpbmV9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE1hcmtQb3MoY20sIHZpbSwgbWFya05hbWUpIHtcbiAgICAgIGlmIChtYXJrTmFtZSA9PSAnXFwnJyB8fCBtYXJrTmFtZSA9PSAnYCcpIHtcbiAgICAgICAgcmV0dXJuIHZpbUdsb2JhbFN0YXRlLmp1bXBMaXN0LmZpbmQoY20sIC0xKSB8fCBQb3MoMCwgMCk7XG4gICAgICB9IGVsc2UgaWYgKG1hcmtOYW1lID09ICcuJykge1xuICAgICAgICByZXR1cm4gZ2V0TGFzdEVkaXRQb3MoY20pO1xuICAgICAgfVxuXG4gICAgICB2YXIgbWFyayA9IHZpbS5tYXJrc1ttYXJrTmFtZV07XG4gICAgICByZXR1cm4gbWFyayAmJiBtYXJrLmZpbmQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRMYXN0RWRpdFBvcyhjbSkge1xuICAgICAgdmFyIGRvbmUgPSBjbS5kb2MuaGlzdG9yeS5kb25lO1xuICAgICAgZm9yICh2YXIgaSA9IGRvbmUubGVuZ3RoOyBpLS07KSB7XG4gICAgICAgIGlmIChkb25lW2ldLmNoYW5nZXMpIHtcbiAgICAgICAgICByZXR1cm4gY29weUN1cnNvcihkb25lW2ldLmNoYW5nZXNbMF0udG8pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIEV4Q29tbWFuZERpc3BhdGNoZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuYnVpbGRDb21tYW5kTWFwXygpO1xuICAgIH07XG4gICAgRXhDb21tYW5kRGlzcGF0Y2hlci5wcm90b3R5cGUgPSB7XG4gICAgICBwcm9jZXNzQ29tbWFuZDogZnVuY3Rpb24oY20sIGlucHV0LCBvcHRfcGFyYW1zKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgY20ub3BlcmF0aW9uKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjbS5jdXJPcC5pc1ZpbU9wID0gdHJ1ZTtcbiAgICAgICAgICB0aGF0Ll9wcm9jZXNzQ29tbWFuZChjbSwgaW5wdXQsIG9wdF9wYXJhbXMpO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBfcHJvY2Vzc0NvbW1hbmQ6IGZ1bmN0aW9uKGNtLCBpbnB1dCwgb3B0X3BhcmFtcykge1xuICAgICAgICB2YXIgdmltID0gY20uc3RhdGUudmltO1xuICAgICAgICB2YXIgY29tbWFuZEhpc3RvcnlSZWdpc3RlciA9IHZpbUdsb2JhbFN0YXRlLnJlZ2lzdGVyQ29udHJvbGxlci5nZXRSZWdpc3RlcignOicpO1xuICAgICAgICB2YXIgcHJldmlvdXNDb21tYW5kID0gY29tbWFuZEhpc3RvcnlSZWdpc3Rlci50b1N0cmluZygpO1xuICAgICAgICBpZiAodmltLnZpc3VhbE1vZGUpIHtcbiAgICAgICAgICBleGl0VmlzdWFsTW9kZShjbSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGlucHV0U3RyZWFtID0gbmV3IENvZGVNaXJyb3IuU3RyaW5nU3RyZWFtKGlucHV0KTtcbiAgICAgICAgLy8gdXBkYXRlIFwiOiB3aXRoIHRoZSBsYXRlc3QgY29tbWFuZCB3aGV0aGVyIHZhbGlkIG9yIGludmFsaWRcbiAgICAgICAgY29tbWFuZEhpc3RvcnlSZWdpc3Rlci5zZXRUZXh0KGlucHV0KTtcbiAgICAgICAgdmFyIHBhcmFtcyA9IG9wdF9wYXJhbXMgfHwge307XG4gICAgICAgIHBhcmFtcy5pbnB1dCA9IGlucHV0O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoaXMucGFyc2VJbnB1dF8oY20sIGlucHV0U3RyZWFtLCBwYXJhbXMpO1xuICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICBzaG93Q29uZmlybShjbSwgZSk7XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY29tbWFuZDtcbiAgICAgICAgdmFyIGNvbW1hbmROYW1lO1xuICAgICAgICBpZiAoIXBhcmFtcy5jb21tYW5kTmFtZSkge1xuICAgICAgICAgIC8vIElmIG9ubHkgYSBsaW5lIHJhbmdlIGlzIGRlZmluZWQsIG1vdmUgdG8gdGhlIGxpbmUuXG4gICAgICAgICAgaWYgKHBhcmFtcy5saW5lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbW1hbmROYW1lID0gJ21vdmUnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb21tYW5kID0gdGhpcy5tYXRjaENvbW1hbmRfKHBhcmFtcy5jb21tYW5kTmFtZSk7XG4gICAgICAgICAgaWYgKGNvbW1hbmQpIHtcbiAgICAgICAgICAgIGNvbW1hbmROYW1lID0gY29tbWFuZC5uYW1lO1xuICAgICAgICAgICAgaWYgKGNvbW1hbmQuZXhjbHVkZUZyb21Db21tYW5kSGlzdG9yeSkge1xuICAgICAgICAgICAgICBjb21tYW5kSGlzdG9yeVJlZ2lzdGVyLnNldFRleHQocHJldmlvdXNDb21tYW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucGFyc2VDb21tYW5kQXJnc18oaW5wdXRTdHJlYW0sIHBhcmFtcywgY29tbWFuZCk7XG4gICAgICAgICAgICBpZiAoY29tbWFuZC50eXBlID09ICdleFRvS2V5Jykge1xuICAgICAgICAgICAgICAvLyBIYW5kbGUgRXggdG8gS2V5IG1hcHBpbmcuXG4gICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29tbWFuZC50b0tleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBDb2RlTWlycm9yLlZpbS5oYW5kbGVLZXkoY20sIGNvbW1hbmQudG9LZXlzW2ldLCAnbWFwcGluZycpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC50eXBlID09ICdleFRvRXgnKSB7XG4gICAgICAgICAgICAgIC8vIEhhbmRsZSBFeCB0byBFeCBtYXBwaW5nLlxuICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NDb21tYW5kKGNtLCBjb21tYW5kLnRvSW5wdXQpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghY29tbWFuZE5hbWUpIHtcbiAgICAgICAgICBzaG93Q29uZmlybShjbSwgJ05vdCBhbiBlZGl0b3IgY29tbWFuZCBcIjonICsgaW5wdXQgKyAnXCInKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBleENvbW1hbmRzW2NvbW1hbmROYW1lXShjbSwgcGFyYW1zKTtcbiAgICAgICAgICAvLyBQb3NzaWJseSBhc3luY2hyb25vdXMgY29tbWFuZHMgKGUuZy4gc3Vic3RpdHV0ZSwgd2hpY2ggbWlnaHQgaGF2ZSBhXG4gICAgICAgICAgLy8gdXNlciBjb25maXJtYXRpb24pLCBhcmUgcmVzcG9uc2libGUgZm9yIGNhbGxpbmcgdGhlIGNhbGxiYWNrIHdoZW5cbiAgICAgICAgICAvLyBkb25lLiBBbGwgb3RoZXJzIGhhdmUgaXQgdGFrZW4gY2FyZSBvZiBmb3IgdGhlbSBoZXJlLlxuICAgICAgICAgIGlmICgoIWNvbW1hbmQgfHwgIWNvbW1hbmQucG9zc2libHlBc3luYykgJiYgcGFyYW1zLmNhbGxiYWNrKSB7XG4gICAgICAgICAgICBwYXJhbXMuY2FsbGJhY2soKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgIHNob3dDb25maXJtKGNtLCBlKTtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcGFyc2VJbnB1dF86IGZ1bmN0aW9uKGNtLCBpbnB1dFN0cmVhbSwgcmVzdWx0KSB7XG4gICAgICAgIGlucHV0U3RyZWFtLmVhdFdoaWxlKCc6Jyk7XG4gICAgICAgIC8vIFBhcnNlIHJhbmdlLlxuICAgICAgICBpZiAoaW5wdXRTdHJlYW0uZWF0KCclJykpIHtcbiAgICAgICAgICByZXN1bHQubGluZSA9IGNtLmZpcnN0TGluZSgpO1xuICAgICAgICAgIHJlc3VsdC5saW5lRW5kID0gY20ubGFzdExpbmUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQubGluZSA9IHRoaXMucGFyc2VMaW5lU3BlY18oY20sIGlucHV0U3RyZWFtKTtcbiAgICAgICAgICBpZiAocmVzdWx0LmxpbmUgIT09IHVuZGVmaW5lZCAmJiBpbnB1dFN0cmVhbS5lYXQoJywnKSkge1xuICAgICAgICAgICAgcmVzdWx0LmxpbmVFbmQgPSB0aGlzLnBhcnNlTGluZVNwZWNfKGNtLCBpbnB1dFN0cmVhbSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUGFyc2UgY29tbWFuZCBuYW1lLlxuICAgICAgICB2YXIgY29tbWFuZE1hdGNoID0gaW5wdXRTdHJlYW0ubWF0Y2goL14oXFx3KykvKTtcbiAgICAgICAgaWYgKGNvbW1hbmRNYXRjaCkge1xuICAgICAgICAgIHJlc3VsdC5jb21tYW5kTmFtZSA9IGNvbW1hbmRNYXRjaFsxXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQuY29tbWFuZE5hbWUgPSBpbnB1dFN0cmVhbS5tYXRjaCgvLiovKVswXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9LFxuICAgICAgcGFyc2VMaW5lU3BlY186IGZ1bmN0aW9uKGNtLCBpbnB1dFN0cmVhbSkge1xuICAgICAgICB2YXIgbnVtYmVyTWF0Y2ggPSBpbnB1dFN0cmVhbS5tYXRjaCgvXihcXGQrKS8pO1xuICAgICAgICBpZiAobnVtYmVyTWF0Y2gpIHtcbiAgICAgICAgICAvLyBBYnNvbHV0ZSBsaW5lIG51bWJlciBwbHVzIG9mZnNldCAoTitNIG9yIE4tTSkgaXMgcHJvYmFibHkgYSB0eXBvLFxuICAgICAgICAgIC8vIG5vdCBzb21ldGhpbmcgdGhlIHVzZXIgYWN0dWFsbHkgd2FudGVkLiAoTkI6IHZpbSBkb2VzIGFsbG93IHRoaXMuKVxuICAgICAgICAgIHJldHVybiBwYXJzZUludChudW1iZXJNYXRjaFsxXSwgMTApIC0gMTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKGlucHV0U3RyZWFtLm5leHQoKSkge1xuICAgICAgICAgIGNhc2UgJy4nOlxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VMaW5lU3BlY09mZnNldF8oaW5wdXRTdHJlYW0sIGNtLmdldEN1cnNvcigpLmxpbmUpO1xuICAgICAgICAgIGNhc2UgJyQnOlxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VMaW5lU3BlY09mZnNldF8oaW5wdXRTdHJlYW0sIGNtLmxhc3RMaW5lKCkpO1xuICAgICAgICAgIGNhc2UgJ1xcJyc6XG4gICAgICAgICAgICB2YXIgbWFya05hbWUgPSBpbnB1dFN0cmVhbS5uZXh0KCk7XG4gICAgICAgICAgICB2YXIgbWFya1BvcyA9IGdldE1hcmtQb3MoY20sIGNtLnN0YXRlLnZpbSwgbWFya05hbWUpO1xuICAgICAgICAgICAgaWYgKCFtYXJrUG9zKSB0aHJvdyBuZXcgRXJyb3IoJ01hcmsgbm90IHNldCcpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VMaW5lU3BlY09mZnNldF8oaW5wdXRTdHJlYW0sIG1hcmtQb3MubGluZSk7XG4gICAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICBpbnB1dFN0cmVhbS5iYWNrVXAoMSk7XG4gICAgICAgICAgICAvLyBPZmZzZXQgaXMgcmVsYXRpdmUgdG8gY3VycmVudCBsaW5lIGlmIG5vdCBvdGhlcndpc2Ugc3BlY2lmaWVkLlxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VMaW5lU3BlY09mZnNldF8oaW5wdXRTdHJlYW0sIGNtLmdldEN1cnNvcigpLmxpbmUpO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBpbnB1dFN0cmVhbS5iYWNrVXAoMSk7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcGFyc2VMaW5lU3BlY09mZnNldF86IGZ1bmN0aW9uKGlucHV0U3RyZWFtLCBsaW5lKSB7XG4gICAgICAgIHZhciBvZmZzZXRNYXRjaCA9IGlucHV0U3RyZWFtLm1hdGNoKC9eKFsrLV0pPyhcXGQrKS8pO1xuICAgICAgICBpZiAob2Zmc2V0TWF0Y2gpIHtcbiAgICAgICAgICB2YXIgb2Zmc2V0ID0gcGFyc2VJbnQob2Zmc2V0TWF0Y2hbMl0sIDEwKTtcbiAgICAgICAgICBpZiAob2Zmc2V0TWF0Y2hbMV0gPT0gXCItXCIpIHtcbiAgICAgICAgICAgIGxpbmUgLT0gb2Zmc2V0O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsaW5lICs9IG9mZnNldDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxpbmU7XG4gICAgICB9LFxuICAgICAgcGFyc2VDb21tYW5kQXJnc186IGZ1bmN0aW9uKGlucHV0U3RyZWFtLCBwYXJhbXMsIGNvbW1hbmQpIHtcbiAgICAgICAgaWYgKGlucHV0U3RyZWFtLmVvbCgpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHBhcmFtcy5hcmdTdHJpbmcgPSBpbnB1dFN0cmVhbS5tYXRjaCgvLiovKVswXTtcbiAgICAgICAgLy8gUGFyc2UgY29tbWFuZC1saW5lIGFyZ3VtZW50c1xuICAgICAgICB2YXIgZGVsaW0gPSBjb21tYW5kLmFyZ0RlbGltaXRlciB8fCAvXFxzKy87XG4gICAgICAgIHZhciBhcmdzID0gdHJpbShwYXJhbXMuYXJnU3RyaW5nKS5zcGxpdChkZWxpbSk7XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCAmJiBhcmdzWzBdKSB7XG4gICAgICAgICAgcGFyYW1zLmFyZ3MgPSBhcmdzO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgbWF0Y2hDb21tYW5kXzogZnVuY3Rpb24oY29tbWFuZE5hbWUpIHtcbiAgICAgICAgLy8gUmV0dXJuIHRoZSBjb21tYW5kIGluIHRoZSBjb21tYW5kIG1hcCB0aGF0IG1hdGNoZXMgdGhlIHNob3J0ZXN0XG4gICAgICAgIC8vIHByZWZpeCBvZiB0aGUgcGFzc2VkIGluIGNvbW1hbmQgbmFtZS4gVGhlIG1hdGNoIGlzIGd1YXJhbnRlZWQgdG8gYmVcbiAgICAgICAgLy8gdW5hbWJpZ3VvdXMgaWYgdGhlIGRlZmF1bHRFeENvbW1hbmRNYXAncyBzaG9ydE5hbWVzIGFyZSBzZXQgdXBcbiAgICAgICAgLy8gY29ycmVjdGx5LiAoc2VlIEBjb2Rle2RlZmF1bHRFeENvbW1hbmRNYXB9KS5cbiAgICAgICAgZm9yICh2YXIgaSA9IGNvbW1hbmROYW1lLmxlbmd0aDsgaSA+IDA7IGktLSkge1xuICAgICAgICAgIHZhciBwcmVmaXggPSBjb21tYW5kTmFtZS5zdWJzdHJpbmcoMCwgaSk7XG4gICAgICAgICAgaWYgKHRoaXMuY29tbWFuZE1hcF9bcHJlZml4XSkge1xuICAgICAgICAgICAgdmFyIGNvbW1hbmQgPSB0aGlzLmNvbW1hbmRNYXBfW3ByZWZpeF07XG4gICAgICAgICAgICBpZiAoY29tbWFuZC5uYW1lLmluZGV4T2YoY29tbWFuZE5hbWUpID09PSAwKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0sXG4gICAgICBidWlsZENvbW1hbmRNYXBfOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5jb21tYW5kTWFwXyA9IHt9O1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRlZmF1bHRFeENvbW1hbmRNYXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgY29tbWFuZCA9IGRlZmF1bHRFeENvbW1hbmRNYXBbaV07XG4gICAgICAgICAgdmFyIGtleSA9IGNvbW1hbmQuc2hvcnROYW1lIHx8IGNvbW1hbmQubmFtZTtcbiAgICAgICAgICB0aGlzLmNvbW1hbmRNYXBfW2tleV0gPSBjb21tYW5kO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgbWFwOiBmdW5jdGlvbihsaHMsIHJocywgY3R4KSB7XG4gICAgICAgIGlmIChsaHMgIT0gJzonICYmIGxocy5jaGFyQXQoMCkgPT0gJzonKSB7XG4gICAgICAgICAgaWYgKGN0eCkgeyB0aHJvdyBFcnJvcignTW9kZSBub3Qgc3VwcG9ydGVkIGZvciBleCBtYXBwaW5ncycpOyB9XG4gICAgICAgICAgdmFyIGNvbW1hbmROYW1lID0gbGhzLnN1YnN0cmluZygxKTtcbiAgICAgICAgICBpZiAocmhzICE9ICc6JyAmJiByaHMuY2hhckF0KDApID09ICc6Jykge1xuICAgICAgICAgICAgLy8gRXggdG8gRXggbWFwcGluZ1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kTWFwX1tjb21tYW5kTmFtZV0gPSB7XG4gICAgICAgICAgICAgIG5hbWU6IGNvbW1hbmROYW1lLFxuICAgICAgICAgICAgICB0eXBlOiAnZXhUb0V4JyxcbiAgICAgICAgICAgICAgdG9JbnB1dDogcmhzLnN1YnN0cmluZygxKSxcbiAgICAgICAgICAgICAgdXNlcjogdHJ1ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gRXggdG8ga2V5IG1hcHBpbmdcbiAgICAgICAgICAgIHRoaXMuY29tbWFuZE1hcF9bY29tbWFuZE5hbWVdID0ge1xuICAgICAgICAgICAgICBuYW1lOiBjb21tYW5kTmFtZSxcbiAgICAgICAgICAgICAgdHlwZTogJ2V4VG9LZXknLFxuICAgICAgICAgICAgICB0b0tleXM6IHJocyxcbiAgICAgICAgICAgICAgdXNlcjogdHJ1ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHJocyAhPSAnOicgJiYgcmhzLmNoYXJBdCgwKSA9PSAnOicpIHtcbiAgICAgICAgICAgIC8vIEtleSB0byBFeCBtYXBwaW5nLlxuICAgICAgICAgICAgdmFyIG1hcHBpbmcgPSB7XG4gICAgICAgICAgICAgIGtleXM6IGxocyxcbiAgICAgICAgICAgICAgdHlwZTogJ2tleVRvRXgnLFxuICAgICAgICAgICAgICBleEFyZ3M6IHsgaW5wdXQ6IHJocy5zdWJzdHJpbmcoMSkgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChjdHgpIHsgbWFwcGluZy5jb250ZXh0ID0gY3R4OyB9XG4gICAgICAgICAgICBkZWZhdWx0S2V5bWFwLnVuc2hpZnQobWFwcGluZyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEtleSB0byBrZXkgbWFwcGluZ1xuICAgICAgICAgICAgdmFyIG1hcHBpbmcgPSB7XG4gICAgICAgICAgICAgIGtleXM6IGxocyxcbiAgICAgICAgICAgICAgdHlwZTogJ2tleVRvS2V5JyxcbiAgICAgICAgICAgICAgdG9LZXlzOiByaHNcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoY3R4KSB7IG1hcHBpbmcuY29udGV4dCA9IGN0eDsgfVxuICAgICAgICAgICAgZGVmYXVsdEtleW1hcC51bnNoaWZ0KG1hcHBpbmcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHVubWFwOiBmdW5jdGlvbihsaHMsIGN0eCkge1xuICAgICAgICBpZiAobGhzICE9ICc6JyAmJiBsaHMuY2hhckF0KDApID09ICc6Jykge1xuICAgICAgICAgIC8vIEV4IHRvIEV4IG9yIEV4IHRvIGtleSBtYXBwaW5nXG4gICAgICAgICAgaWYgKGN0eCkgeyB0aHJvdyBFcnJvcignTW9kZSBub3Qgc3VwcG9ydGVkIGZvciBleCBtYXBwaW5ncycpOyB9XG4gICAgICAgICAgdmFyIGNvbW1hbmROYW1lID0gbGhzLnN1YnN0cmluZygxKTtcbiAgICAgICAgICBpZiAodGhpcy5jb21tYW5kTWFwX1tjb21tYW5kTmFtZV0gJiYgdGhpcy5jb21tYW5kTWFwX1tjb21tYW5kTmFtZV0udXNlcikge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuY29tbWFuZE1hcF9bY29tbWFuZE5hbWVdO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBLZXkgdG8gRXggb3Iga2V5IHRvIGtleSBtYXBwaW5nXG4gICAgICAgICAgdmFyIGtleXMgPSBsaHM7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkZWZhdWx0S2V5bWFwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoa2V5cyA9PSBkZWZhdWx0S2V5bWFwW2ldLmtleXNcbiAgICAgICAgICAgICAgICAmJiBkZWZhdWx0S2V5bWFwW2ldLmNvbnRleHQgPT09IGN0eCkge1xuICAgICAgICAgICAgICBkZWZhdWx0S2V5bWFwLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBFcnJvcignTm8gc3VjaCBtYXBwaW5nLicpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgZXhDb21tYW5kcyA9IHtcbiAgICAgIGNvbG9yc2NoZW1lOiBmdW5jdGlvbihjbSwgcGFyYW1zKSB7XG4gICAgICAgIGlmICghcGFyYW1zLmFyZ3MgfHwgcGFyYW1zLmFyZ3MubGVuZ3RoIDwgMSkge1xuICAgICAgICAgIHNob3dDb25maXJtKGNtLCBjbS5nZXRPcHRpb24oJ3RoZW1lJykpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjbS5zZXRPcHRpb24oJ3RoZW1lJywgcGFyYW1zLmFyZ3NbMF0pO1xuICAgICAgfSxcbiAgICAgIG1hcDogZnVuY3Rpb24oY20sIHBhcmFtcywgY3R4KSB7XG4gICAgICAgIHZhciBtYXBBcmdzID0gcGFyYW1zLmFyZ3M7XG4gICAgICAgIGlmICghbWFwQXJncyB8fCBtYXBBcmdzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICBpZiAoY20pIHtcbiAgICAgICAgICAgIHNob3dDb25maXJtKGNtLCAnSW52YWxpZCBtYXBwaW5nOiAnICsgcGFyYW1zLmlucHV0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGV4Q29tbWFuZERpc3BhdGNoZXIubWFwKG1hcEFyZ3NbMF0sIG1hcEFyZ3NbMV0sIGN0eCk7XG4gICAgICB9LFxuICAgICAgaW1hcDogZnVuY3Rpb24oY20sIHBhcmFtcykgeyB0aGlzLm1hcChjbSwgcGFyYW1zLCAnaW5zZXJ0Jyk7IH0sXG4gICAgICBubWFwOiBmdW5jdGlvbihjbSwgcGFyYW1zKSB7IHRoaXMubWFwKGNtLCBwYXJhbXMsICdub3JtYWwnKTsgfSxcbiAgICAgIHZtYXA6IGZ1bmN0aW9uKGNtLCBwYXJhbXMpIHsgdGhpcy5tYXAoY20sIHBhcmFtcywgJ3Zpc3VhbCcpOyB9LFxuICAgICAgdW5tYXA6IGZ1bmN0aW9uKGNtLCBwYXJhbXMsIGN0eCkge1xuICAgICAgICB2YXIgbWFwQXJncyA9IHBhcmFtcy5hcmdzO1xuICAgICAgICBpZiAoIW1hcEFyZ3MgfHwgbWFwQXJncy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgaWYgKGNtKSB7XG4gICAgICAgICAgICBzaG93Q29uZmlybShjbSwgJ05vIHN1Y2ggbWFwcGluZzogJyArIHBhcmFtcy5pbnB1dCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBleENvbW1hbmREaXNwYXRjaGVyLnVubWFwKG1hcEFyZ3NbMF0sIGN0eCk7XG4gICAgICB9LFxuICAgICAgbW92ZTogZnVuY3Rpb24oY20sIHBhcmFtcykge1xuICAgICAgICBjb21tYW5kRGlzcGF0Y2hlci5wcm9jZXNzQ29tbWFuZChjbSwgY20uc3RhdGUudmltLCB7XG4gICAgICAgICAgICB0eXBlOiAnbW90aW9uJyxcbiAgICAgICAgICAgIG1vdGlvbjogJ21vdmVUb0xpbmVPckVkZ2VPZkRvY3VtZW50JyxcbiAgICAgICAgICAgIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogZmFsc2UsIGV4cGxpY2l0UmVwZWF0OiB0cnVlLFxuICAgICAgICAgICAgICBsaW5ld2lzZTogdHJ1ZSB9LFxuICAgICAgICAgICAgcmVwZWF0T3ZlcnJpZGU6IHBhcmFtcy5saW5lKzF9KTtcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uKGNtLCBwYXJhbXMpIHtcbiAgICAgICAgdmFyIHNldEFyZ3MgPSBwYXJhbXMuYXJncztcbiAgICAgICAgLy8gT3B0aW9ucyBwYXNzZWQgdGhyb3VnaCB0byB0aGUgc2V0T3B0aW9uL2dldE9wdGlvbiBjYWxscy4gTWF5IGJlIHBhc3NlZCBpbiBieSB0aGVcbiAgICAgICAgLy8gbG9jYWwvZ2xvYmFsIHZlcnNpb25zIG9mIHRoZSBzZXQgY29tbWFuZFxuICAgICAgICB2YXIgc2V0Q2ZnID0gcGFyYW1zLnNldENmZyB8fCB7fTtcbiAgICAgICAgaWYgKCFzZXRBcmdzIHx8IHNldEFyZ3MubGVuZ3RoIDwgMSkge1xuICAgICAgICAgIGlmIChjbSkge1xuICAgICAgICAgICAgc2hvd0NvbmZpcm0oY20sICdJbnZhbGlkIG1hcHBpbmc6ICcgKyBwYXJhbXMuaW5wdXQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGV4cHIgPSBzZXRBcmdzWzBdLnNwbGl0KCc9Jyk7XG4gICAgICAgIHZhciBvcHRpb25OYW1lID0gZXhwclswXTtcbiAgICAgICAgdmFyIHZhbHVlID0gZXhwclsxXTtcbiAgICAgICAgdmFyIGZvcmNlR2V0ID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKG9wdGlvbk5hbWUuY2hhckF0KG9wdGlvbk5hbWUubGVuZ3RoIC0gMSkgPT0gJz8nKSB7XG4gICAgICAgICAgLy8gSWYgcG9zdC1maXhlZCB3aXRoID8sIHRoZW4gdGhlIHNldCBpcyBhY3R1YWxseSBhIGdldC5cbiAgICAgICAgICBpZiAodmFsdWUpIHsgdGhyb3cgRXJyb3IoJ1RyYWlsaW5nIGNoYXJhY3RlcnM6ICcgKyBwYXJhbXMuYXJnU3RyaW5nKTsgfVxuICAgICAgICAgIG9wdGlvbk5hbWUgPSBvcHRpb25OYW1lLnN1YnN0cmluZygwLCBvcHRpb25OYW1lLmxlbmd0aCAtIDEpO1xuICAgICAgICAgIGZvcmNlR2V0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiBvcHRpb25OYW1lLnN1YnN0cmluZygwLCAyKSA9PSAnbm8nKSB7XG4gICAgICAgICAgLy8gVG8gc2V0IGJvb2xlYW4gb3B0aW9ucyB0byBmYWxzZSwgdGhlIG9wdGlvbiBuYW1lIGlzIHByZWZpeGVkIHdpdGhcbiAgICAgICAgICAvLyAnbm8nLlxuICAgICAgICAgIG9wdGlvbk5hbWUgPSBvcHRpb25OYW1lLnN1YnN0cmluZygyKTtcbiAgICAgICAgICB2YWx1ZSA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG9wdGlvbklzQm9vbGVhbiA9IG9wdGlvbnNbb3B0aW9uTmFtZV0gJiYgb3B0aW9uc1tvcHRpb25OYW1lXS50eXBlID09ICdib29sZWFuJztcbiAgICAgICAgaWYgKG9wdGlvbklzQm9vbGVhbiAmJiB2YWx1ZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAvLyBDYWxsaW5nIHNldCB3aXRoIGEgYm9vbGVhbiBvcHRpb24gc2V0cyBpdCB0byB0cnVlLlxuICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJZiBubyB2YWx1ZSBpcyBwcm92aWRlZCwgdGhlbiB3ZSBhc3N1bWUgdGhpcyBpcyBhIGdldC5cbiAgICAgICAgaWYgKCFvcHRpb25Jc0Jvb2xlYW4gJiYgdmFsdWUgPT09IHVuZGVmaW5lZCB8fCBmb3JjZUdldCkge1xuICAgICAgICAgIHZhciBvbGRWYWx1ZSA9IGdldE9wdGlvbihvcHRpb25OYW1lLCBjbSwgc2V0Q2ZnKTtcbiAgICAgICAgICBpZiAob2xkVmFsdWUgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgc2hvd0NvbmZpcm0oY20sIG9sZFZhbHVlLm1lc3NhZ2UpO1xuICAgICAgICAgIH0gZWxzZSBpZiAob2xkVmFsdWUgPT09IHRydWUgfHwgb2xkVmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBzaG93Q29uZmlybShjbSwgJyAnICsgKG9sZFZhbHVlID8gJycgOiAnbm8nKSArIG9wdGlvbk5hbWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzaG93Q29uZmlybShjbSwgJyAgJyArIG9wdGlvbk5hbWUgKyAnPScgKyBvbGRWYWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBzZXRPcHRpb25SZXR1cm4gPSBzZXRPcHRpb24ob3B0aW9uTmFtZSwgdmFsdWUsIGNtLCBzZXRDZmcpO1xuICAgICAgICAgIGlmIChzZXRPcHRpb25SZXR1cm4gaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgc2hvd0NvbmZpcm0oY20sIHNldE9wdGlvblJldHVybi5tZXNzYWdlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBzZXRsb2NhbDogZnVuY3Rpb24gKGNtLCBwYXJhbXMpIHtcbiAgICAgICAgLy8gc2V0Q2ZnIGlzIHBhc3NlZCB0aHJvdWdoIHRvIHNldE9wdGlvblxuICAgICAgICBwYXJhbXMuc2V0Q2ZnID0ge3Njb3BlOiAnbG9jYWwnfTtcbiAgICAgICAgdGhpcy5zZXQoY20sIHBhcmFtcyk7XG4gICAgICB9LFxuICAgICAgc2V0Z2xvYmFsOiBmdW5jdGlvbiAoY20sIHBhcmFtcykge1xuICAgICAgICAvLyBzZXRDZmcgaXMgcGFzc2VkIHRocm91Z2ggdG8gc2V0T3B0aW9uXG4gICAgICAgIHBhcmFtcy5zZXRDZmcgPSB7c2NvcGU6ICdnbG9iYWwnfTtcbiAgICAgICAgdGhpcy5zZXQoY20sIHBhcmFtcyk7XG4gICAgICB9LFxuICAgICAgcmVnaXN0ZXJzOiBmdW5jdGlvbihjbSwgcGFyYW1zKSB7XG4gICAgICAgIHZhciByZWdBcmdzID0gcGFyYW1zLmFyZ3M7XG4gICAgICAgIHZhciByZWdpc3RlcnMgPSB2aW1HbG9iYWxTdGF0ZS5yZWdpc3RlckNvbnRyb2xsZXIucmVnaXN0ZXJzO1xuICAgICAgICB2YXIgcmVnSW5mbyA9ICctLS0tLS0tLS0tUmVnaXN0ZXJzLS0tLS0tLS0tLTxicj48YnI+JztcbiAgICAgICAgaWYgKCFyZWdBcmdzKSB7XG4gICAgICAgICAgZm9yICh2YXIgcmVnaXN0ZXJOYW1lIGluIHJlZ2lzdGVycykge1xuICAgICAgICAgICAgdmFyIHRleHQgPSByZWdpc3RlcnNbcmVnaXN0ZXJOYW1lXS50b1N0cmluZygpO1xuICAgICAgICAgICAgaWYgKHRleHQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHJlZ0luZm8gKz0gJ1wiJyArIHJlZ2lzdGVyTmFtZSArICcgICAgJyArIHRleHQgKyAnPGJyPic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciByZWdpc3Rlck5hbWU7XG4gICAgICAgICAgcmVnQXJncyA9IHJlZ0FyZ3Muam9pbignJyk7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZWdBcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICByZWdpc3Rlck5hbWUgPSByZWdBcmdzLmNoYXJBdChpKTtcbiAgICAgICAgICAgIGlmICghdmltR2xvYmFsU3RhdGUucmVnaXN0ZXJDb250cm9sbGVyLmlzVmFsaWRSZWdpc3RlcihyZWdpc3Rlck5hbWUpKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHJlZ2lzdGVyID0gcmVnaXN0ZXJzW3JlZ2lzdGVyTmFtZV0gfHwgbmV3IFJlZ2lzdGVyKCk7XG4gICAgICAgICAgICByZWdJbmZvICs9ICdcIicgKyByZWdpc3Rlck5hbWUgKyAnICAgICcgKyByZWdpc3Rlci50b1N0cmluZygpICsgJzxicj4nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzaG93Q29uZmlybShjbSwgcmVnSW5mbyk7XG4gICAgICB9LFxuICAgICAgc29ydDogZnVuY3Rpb24oY20sIHBhcmFtcykge1xuICAgICAgICB2YXIgcmV2ZXJzZSwgaWdub3JlQ2FzZSwgdW5pcXVlLCBudW1iZXIsIHBhdHRlcm47XG4gICAgICAgIGZ1bmN0aW9uIHBhcnNlQXJncygpIHtcbiAgICAgICAgICBpZiAocGFyYW1zLmFyZ1N0cmluZykge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBuZXcgQ29kZU1pcnJvci5TdHJpbmdTdHJlYW0ocGFyYW1zLmFyZ1N0cmluZyk7XG4gICAgICAgICAgICBpZiAoYXJncy5lYXQoJyEnKSkgeyByZXZlcnNlID0gdHJ1ZTsgfVxuICAgICAgICAgICAgaWYgKGFyZ3MuZW9sKCkpIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICBpZiAoIWFyZ3MuZWF0U3BhY2UoKSkgeyByZXR1cm4gJ0ludmFsaWQgYXJndW1lbnRzJzsgfVxuICAgICAgICAgICAgdmFyIG9wdHMgPSBhcmdzLm1hdGNoKC8oW2RpbnVveF0rKT9cXHMqKFxcLy4rXFwvKT9cXHMqLyk7XG4gICAgICAgICAgICBpZiAoIW9wdHMgJiYgIWFyZ3MuZW9sKCkpIHsgcmV0dXJuICdJbnZhbGlkIGFyZ3VtZW50cyc7IH1cbiAgICAgICAgICAgIGlmIChvcHRzWzFdKSB7XG4gICAgICAgICAgICAgIGlnbm9yZUNhc2UgPSBvcHRzWzFdLmluZGV4T2YoJ2knKSAhPSAtMTtcbiAgICAgICAgICAgICAgdW5pcXVlID0gb3B0c1sxXS5pbmRleE9mKCd1JykgIT0gLTE7XG4gICAgICAgICAgICAgIHZhciBkZWNpbWFsID0gb3B0c1sxXS5pbmRleE9mKCdkJykgIT0gLTEgfHwgb3B0c1sxXS5pbmRleE9mKCduJykgIT0gLTEgJiYgMTtcbiAgICAgICAgICAgICAgdmFyIGhleCA9IG9wdHNbMV0uaW5kZXhPZigneCcpICE9IC0xICYmIDE7XG4gICAgICAgICAgICAgIHZhciBvY3RhbCA9IG9wdHNbMV0uaW5kZXhPZignbycpICE9IC0xICYmIDE7XG4gICAgICAgICAgICAgIGlmIChkZWNpbWFsICsgaGV4ICsgb2N0YWwgPiAxKSB7IHJldHVybiAnSW52YWxpZCBhcmd1bWVudHMnOyB9XG4gICAgICAgICAgICAgIG51bWJlciA9IGRlY2ltYWwgJiYgJ2RlY2ltYWwnIHx8IGhleCAmJiAnaGV4JyB8fCBvY3RhbCAmJiAnb2N0YWwnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdHNbMl0pIHtcbiAgICAgICAgICAgICAgcGF0dGVybiA9IG5ldyBSZWdFeHAob3B0c1syXS5zdWJzdHIoMSwgb3B0c1syXS5sZW5ndGggLSAyKSwgaWdub3JlQ2FzZSA/ICdpJyA6ICcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVyciA9IHBhcnNlQXJncygpO1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgc2hvd0NvbmZpcm0oY20sIGVyciArICc6ICcgKyBwYXJhbXMuYXJnU3RyaW5nKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxpbmVTdGFydCA9IHBhcmFtcy5saW5lIHx8IGNtLmZpcnN0TGluZSgpO1xuICAgICAgICB2YXIgbGluZUVuZCA9IHBhcmFtcy5saW5lRW5kIHx8IHBhcmFtcy5saW5lIHx8IGNtLmxhc3RMaW5lKCk7XG4gICAgICAgIGlmIChsaW5lU3RhcnQgPT0gbGluZUVuZCkgeyByZXR1cm47IH1cbiAgICAgICAgdmFyIGN1clN0YXJ0ID0gUG9zKGxpbmVTdGFydCwgMCk7XG4gICAgICAgIHZhciBjdXJFbmQgPSBQb3MobGluZUVuZCwgbGluZUxlbmd0aChjbSwgbGluZUVuZCkpO1xuICAgICAgICB2YXIgdGV4dCA9IGNtLmdldFJhbmdlKGN1clN0YXJ0LCBjdXJFbmQpLnNwbGl0KCdcXG4nKTtcbiAgICAgICAgdmFyIG51bWJlclJlZ2V4ID0gcGF0dGVybiA/IHBhdHRlcm4gOlxuICAgICAgICAgICAobnVtYmVyID09ICdkZWNpbWFsJykgPyAvKC0/KShbXFxkXSspLyA6XG4gICAgICAgICAgIChudW1iZXIgPT0gJ2hleCcpID8gLygtPykoPzoweCk/KFswLTlhLWZdKykvaSA6XG4gICAgICAgICAgIChudW1iZXIgPT0gJ29jdGFsJykgPyAvKFswLTddKykvIDogbnVsbDtcbiAgICAgICAgdmFyIHJhZGl4ID0gKG51bWJlciA9PSAnZGVjaW1hbCcpID8gMTAgOiAobnVtYmVyID09ICdoZXgnKSA/IDE2IDogKG51bWJlciA9PSAnb2N0YWwnKSA/IDggOiBudWxsO1xuICAgICAgICB2YXIgbnVtUGFydCA9IFtdLCB0ZXh0UGFydCA9IFtdO1xuICAgICAgICBpZiAobnVtYmVyIHx8IHBhdHRlcm4pIHtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBtYXRjaFBhcnQgPSBwYXR0ZXJuID8gdGV4dFtpXS5tYXRjaChwYXR0ZXJuKSA6IG51bGw7XG4gICAgICAgICAgICBpZiAobWF0Y2hQYXJ0ICYmIG1hdGNoUGFydFswXSAhPSAnJykge1xuICAgICAgICAgICAgICBudW1QYXJ0LnB1c2gobWF0Y2hQYXJ0KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXBhdHRlcm4gJiYgbnVtYmVyUmVnZXguZXhlYyh0ZXh0W2ldKSkge1xuICAgICAgICAgICAgICBudW1QYXJ0LnB1c2godGV4dFtpXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0ZXh0UGFydC5wdXNoKHRleHRbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0ZXh0UGFydCA9IHRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY29tcGFyZUZuKGEsIGIpIHtcbiAgICAgICAgICBpZiAocmV2ZXJzZSkgeyB2YXIgdG1wOyB0bXAgPSBhOyBhID0gYjsgYiA9IHRtcDsgfVxuICAgICAgICAgIGlmIChpZ25vcmVDYXNlKSB7IGEgPSBhLnRvTG93ZXJDYXNlKCk7IGIgPSBiLnRvTG93ZXJDYXNlKCk7IH1cbiAgICAgICAgICB2YXIgYW51bSA9IG51bWJlciAmJiBudW1iZXJSZWdleC5leGVjKGEpO1xuICAgICAgICAgIHZhciBibnVtID0gbnVtYmVyICYmIG51bWJlclJlZ2V4LmV4ZWMoYik7XG4gICAgICAgICAgaWYgKCFhbnVtKSB7IHJldHVybiBhIDwgYiA/IC0xIDogMTsgfVxuICAgICAgICAgIGFudW0gPSBwYXJzZUludCgoYW51bVsxXSArIGFudW1bMl0pLnRvTG93ZXJDYXNlKCksIHJhZGl4KTtcbiAgICAgICAgICBibnVtID0gcGFyc2VJbnQoKGJudW1bMV0gKyBibnVtWzJdKS50b0xvd2VyQ2FzZSgpLCByYWRpeCk7XG4gICAgICAgICAgcmV0dXJuIGFudW0gLSBibnVtO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNvbXBhcmVQYXR0ZXJuRm4oYSwgYikge1xuICAgICAgICAgIGlmIChyZXZlcnNlKSB7IHZhciB0bXA7IHRtcCA9IGE7IGEgPSBiOyBiID0gdG1wOyB9XG4gICAgICAgICAgaWYgKGlnbm9yZUNhc2UpIHsgYVswXSA9IGFbMF0udG9Mb3dlckNhc2UoKTsgYlswXSA9IGJbMF0udG9Mb3dlckNhc2UoKTsgfVxuICAgICAgICAgIHJldHVybiAoYVswXSA8IGJbMF0pID8gLTEgOiAxO1xuICAgICAgICB9XG4gICAgICAgIG51bVBhcnQuc29ydChwYXR0ZXJuID8gY29tcGFyZVBhdHRlcm5GbiA6IGNvbXBhcmVGbik7XG4gICAgICAgIGlmIChwYXR0ZXJuKSB7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1QYXJ0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBudW1QYXJ0W2ldID0gbnVtUGFydFtpXS5pbnB1dDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIW51bWJlcikgeyB0ZXh0UGFydC5zb3J0KGNvbXBhcmVGbik7IH1cbiAgICAgICAgdGV4dCA9ICghcmV2ZXJzZSkgPyB0ZXh0UGFydC5jb25jYXQobnVtUGFydCkgOiBudW1QYXJ0LmNvbmNhdCh0ZXh0UGFydCk7XG4gICAgICAgIGlmICh1bmlxdWUpIHsgLy8gUmVtb3ZlIGR1cGxpY2F0ZSBsaW5lc1xuICAgICAgICAgIHZhciB0ZXh0T2xkID0gdGV4dDtcbiAgICAgICAgICB2YXIgbGFzdExpbmU7XG4gICAgICAgICAgdGV4dCA9IFtdO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dE9sZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRleHRPbGRbaV0gIT0gbGFzdExpbmUpIHtcbiAgICAgICAgICAgICAgdGV4dC5wdXNoKHRleHRPbGRbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGFzdExpbmUgPSB0ZXh0T2xkW2ldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjbS5yZXBsYWNlUmFuZ2UodGV4dC5qb2luKCdcXG4nKSwgY3VyU3RhcnQsIGN1ckVuZCk7XG4gICAgICB9LFxuICAgICAgZ2xvYmFsOiBmdW5jdGlvbihjbSwgcGFyYW1zKSB7XG4gICAgICAgIC8vIGEgZ2xvYmFsIGNvbW1hbmQgaXMgb2YgdGhlIGZvcm1cbiAgICAgICAgLy8gOltyYW5nZV1nL3BhdHRlcm4vW2NtZF1cbiAgICAgICAgLy8gYXJnU3RyaW5nIGhvbGRzIHRoZSBzdHJpbmcgL3BhdHRlcm4vW2NtZF1cbiAgICAgICAgdmFyIGFyZ1N0cmluZyA9IHBhcmFtcy5hcmdTdHJpbmc7XG4gICAgICAgIGlmICghYXJnU3RyaW5nKSB7XG4gICAgICAgICAgc2hvd0NvbmZpcm0oY20sICdSZWd1bGFyIEV4cHJlc3Npb24gbWlzc2luZyBmcm9tIGdsb2JhbCcpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyByYW5nZSBpcyBzcGVjaWZpZWQgaGVyZVxuICAgICAgICB2YXIgbGluZVN0YXJ0ID0gKHBhcmFtcy5saW5lICE9PSB1bmRlZmluZWQpID8gcGFyYW1zLmxpbmUgOiBjbS5maXJzdExpbmUoKTtcbiAgICAgICAgdmFyIGxpbmVFbmQgPSBwYXJhbXMubGluZUVuZCB8fCBwYXJhbXMubGluZSB8fCBjbS5sYXN0TGluZSgpO1xuICAgICAgICAvLyBnZXQgdGhlIHRva2VucyBmcm9tIGFyZ1N0cmluZ1xuICAgICAgICB2YXIgdG9rZW5zID0gc3BsaXRCeVNsYXNoKGFyZ1N0cmluZyk7XG4gICAgICAgIHZhciByZWdleFBhcnQgPSBhcmdTdHJpbmcsIGNtZDtcbiAgICAgICAgaWYgKHRva2Vucy5sZW5ndGgpIHtcbiAgICAgICAgICByZWdleFBhcnQgPSB0b2tlbnNbMF07XG4gICAgICAgICAgY21kID0gdG9rZW5zLnNsaWNlKDEsIHRva2Vucy5sZW5ndGgpLmpvaW4oJy8nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVnZXhQYXJ0KSB7XG4gICAgICAgICAgLy8gSWYgcmVnZXggcGFydCBpcyBlbXB0eSwgdGhlbiB1c2UgdGhlIHByZXZpb3VzIHF1ZXJ5LiBPdGhlcndpc2VcbiAgICAgICAgICAvLyB1c2UgdGhlIHJlZ2V4IHBhcnQgYXMgdGhlIG5ldyBxdWVyeS5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICB1cGRhdGVTZWFyY2hRdWVyeShjbSwgcmVnZXhQYXJ0LCB0cnVlIC8qKiBpZ25vcmVDYXNlICovLFxuICAgICAgICAgICAgIHRydWUgLyoqIHNtYXJ0Q2FzZSAqLyk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICBzaG93Q29uZmlybShjbSwgJ0ludmFsaWQgcmVnZXg6ICcgKyByZWdleFBhcnQpO1xuICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIG5vdyB0aGF0IHdlIGhhdmUgdGhlIHJlZ2V4UGFydCwgc2VhcmNoIGZvciByZWdleCBtYXRjaGVzIGluIHRoZVxuICAgICAgICAvLyBzcGVjaWZpZWQgcmFuZ2Ugb2YgbGluZXNcbiAgICAgICAgdmFyIHF1ZXJ5ID0gZ2V0U2VhcmNoU3RhdGUoY20pLmdldFF1ZXJ5KCk7XG4gICAgICAgIHZhciBtYXRjaGVkTGluZXMgPSBbXSwgY29udGVudCA9ICcnO1xuICAgICAgICBmb3IgKHZhciBpID0gbGluZVN0YXJ0OyBpIDw9IGxpbmVFbmQ7IGkrKykge1xuICAgICAgICAgIHZhciBtYXRjaGVkID0gcXVlcnkudGVzdChjbS5nZXRMaW5lKGkpKTtcbiAgICAgICAgICBpZiAobWF0Y2hlZCkge1xuICAgICAgICAgICAgbWF0Y2hlZExpbmVzLnB1c2goaSsxKTtcbiAgICAgICAgICAgIGNvbnRlbnQrPSBjbS5nZXRMaW5lKGkpICsgJzxicj4nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBpZiB0aGVyZSBpcyBubyBbY21kXSwganVzdCBkaXNwbGF5IHRoZSBsaXN0IG9mIG1hdGNoZWQgbGluZXNcbiAgICAgICAgaWYgKCFjbWQpIHtcbiAgICAgICAgICBzaG93Q29uZmlybShjbSwgY29udGVudCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpbmRleCA9IDA7XG4gICAgICAgIHZhciBuZXh0Q29tbWFuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChpbmRleCA8IG1hdGNoZWRMaW5lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHZhciBjb21tYW5kID0gbWF0Y2hlZExpbmVzW2luZGV4XSArIGNtZDtcbiAgICAgICAgICAgIGV4Q29tbWFuZERpc3BhdGNoZXIucHJvY2Vzc0NvbW1hbmQoY20sIGNvbW1hbmQsIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2s6IG5leHRDb21tYW5kXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgfTtcbiAgICAgICAgbmV4dENvbW1hbmQoKTtcbiAgICAgIH0sXG4gICAgICBzdWJzdGl0dXRlOiBmdW5jdGlvbihjbSwgcGFyYW1zKSB7XG4gICAgICAgIGlmICghY20uZ2V0U2VhcmNoQ3Vyc29yKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTZWFyY2ggZmVhdHVyZSBub3QgYXZhaWxhYmxlLiBSZXF1aXJlcyBzZWFyY2hjdXJzb3IuanMgb3IgJyArXG4gICAgICAgICAgICAgICdhbnkgb3RoZXIgZ2V0U2VhcmNoQ3Vyc29yIGltcGxlbWVudGF0aW9uLicpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhcmdTdHJpbmcgPSBwYXJhbXMuYXJnU3RyaW5nO1xuICAgICAgICB2YXIgdG9rZW5zID0gYXJnU3RyaW5nID8gc3BsaXRCeVNlcGFyYXRvcihhcmdTdHJpbmcsIGFyZ1N0cmluZ1swXSkgOiBbXTtcbiAgICAgICAgdmFyIHJlZ2V4UGFydCwgcmVwbGFjZVBhcnQgPSAnJywgdHJhaWxpbmcsIGZsYWdzUGFydCwgY291bnQ7XG4gICAgICAgIHZhciBjb25maXJtID0gZmFsc2U7IC8vIFdoZXRoZXIgdG8gY29uZmlybSBlYWNoIHJlcGxhY2UuXG4gICAgICAgIHZhciBnbG9iYWwgPSBmYWxzZTsgLy8gVHJ1ZSB0byByZXBsYWNlIGFsbCBpbnN0YW5jZXMgb24gYSBsaW5lLCBmYWxzZSB0byByZXBsYWNlIG9ubHkgMS5cbiAgICAgICAgaWYgKHRva2Vucy5sZW5ndGgpIHtcbiAgICAgICAgICByZWdleFBhcnQgPSB0b2tlbnNbMF07XG4gICAgICAgICAgaWYgKGdldE9wdGlvbigncGNyZScpICYmIHJlZ2V4UGFydCAhPT0gJycpIHtcbiAgICAgICAgICAgICAgcmVnZXhQYXJ0ID0gbmV3IFJlZ0V4cChyZWdleFBhcnQpLnNvdXJjZTsgLy9ub3JtYWxpemUgbm90IGVzY2FwZWQgY2hhcmFjdGVyc1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXBsYWNlUGFydCA9IHRva2Vuc1sxXTtcbiAgICAgICAgICBpZiAocmVnZXhQYXJ0ICYmIHJlZ2V4UGFydFtyZWdleFBhcnQubGVuZ3RoIC0gMV0gPT09ICckJykge1xuICAgICAgICAgICAgcmVnZXhQYXJ0ID0gcmVnZXhQYXJ0LnNsaWNlKDAsIHJlZ2V4UGFydC5sZW5ndGggLSAxKSArICdcXFxcbic7XG4gICAgICAgICAgICByZXBsYWNlUGFydCA9IHJlcGxhY2VQYXJ0ID8gcmVwbGFjZVBhcnQgKyAnXFxuJyA6ICdcXG4nO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVwbGFjZVBhcnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKGdldE9wdGlvbigncGNyZScpKSB7XG4gICAgICAgICAgICAgIHJlcGxhY2VQYXJ0ID0gdW5lc2NhcGVSZWdleFJlcGxhY2UocmVwbGFjZVBhcnQucmVwbGFjZSgvKFteXFxcXF0pJi9nLFwiJDEkJCZcIikpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVwbGFjZVBhcnQgPSB0cmFuc2xhdGVSZWdleFJlcGxhY2UocmVwbGFjZVBhcnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmltR2xvYmFsU3RhdGUubGFzdFN1YnN0aXR1dGVSZXBsYWNlUGFydCA9IHJlcGxhY2VQYXJ0O1xuICAgICAgICAgIH1cbiAgICAgICAgICB0cmFpbGluZyA9IHRva2Vuc1syXSA/IHRva2Vuc1syXS5zcGxpdCgnICcpIDogW107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZWl0aGVyIHRoZSBhcmdTdHJpbmcgaXMgZW1wdHkgb3IgaXRzIG9mIHRoZSBmb3JtICcgaGVsbG8vd29ybGQnXG4gICAgICAgICAgLy8gYWN0dWFsbHkgc3BsaXRCeVNsYXNoIHJldHVybnMgYSBsaXN0IG9mIHRva2Vuc1xuICAgICAgICAgIC8vIG9ubHkgaWYgdGhlIHN0cmluZyBzdGFydHMgd2l0aCBhICcvJ1xuICAgICAgICAgIGlmIChhcmdTdHJpbmcgJiYgYXJnU3RyaW5nLmxlbmd0aCkge1xuICAgICAgICAgICAgc2hvd0NvbmZpcm0oY20sICdTdWJzdGl0dXRpb25zIHNob3VsZCBiZSBvZiB0aGUgZm9ybSAnICtcbiAgICAgICAgICAgICAgICAnOnMvcGF0dGVybi9yZXBsYWNlLycpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBBZnRlciB0aGUgM3JkIHNsYXNoLCB3ZSBjYW4gaGF2ZSBmbGFncyBmb2xsb3dlZCBieSBhIHNwYWNlIGZvbGxvd2VkXG4gICAgICAgIC8vIGJ5IGNvdW50LlxuICAgICAgICBpZiAodHJhaWxpbmcpIHtcbiAgICAgICAgICBmbGFnc1BhcnQgPSB0cmFpbGluZ1swXTtcbiAgICAgICAgICBjb3VudCA9IHBhcnNlSW50KHRyYWlsaW5nWzFdKTtcbiAgICAgICAgICBpZiAoZmxhZ3NQYXJ0KSB7XG4gICAgICAgICAgICBpZiAoZmxhZ3NQYXJ0LmluZGV4T2YoJ2MnKSAhPSAtMSkge1xuICAgICAgICAgICAgICBjb25maXJtID0gdHJ1ZTtcbiAgICAgICAgICAgICAgZmxhZ3NQYXJ0LnJlcGxhY2UoJ2MnLCAnJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZmxhZ3NQYXJ0LmluZGV4T2YoJ2cnKSAhPSAtMSkge1xuICAgICAgICAgICAgICBnbG9iYWwgPSB0cnVlO1xuICAgICAgICAgICAgICBmbGFnc1BhcnQucmVwbGFjZSgnZycsICcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChnZXRPcHRpb24oJ3BjcmUnKSkge1xuICAgICAgICAgICAgICAgcmVnZXhQYXJ0ID0gcmVnZXhQYXJ0ICsgJy8nICsgZmxhZ3NQYXJ0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgIHJlZ2V4UGFydCA9IHJlZ2V4UGFydC5yZXBsYWNlKC9cXC8vZywgXCJcXFxcL1wiKSArICcvJyArIGZsYWdzUGFydDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlZ2V4UGFydCkge1xuICAgICAgICAgIC8vIElmIHJlZ2V4IHBhcnQgaXMgZW1wdHksIHRoZW4gdXNlIHRoZSBwcmV2aW91cyBxdWVyeS4gT3RoZXJ3aXNlIHVzZVxuICAgICAgICAgIC8vIHRoZSByZWdleCBwYXJ0IGFzIHRoZSBuZXcgcXVlcnkuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHVwZGF0ZVNlYXJjaFF1ZXJ5KGNtLCByZWdleFBhcnQsIHRydWUgLyoqIGlnbm9yZUNhc2UgKi8sXG4gICAgICAgICAgICAgIHRydWUgLyoqIHNtYXJ0Q2FzZSAqLyk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgc2hvd0NvbmZpcm0oY20sICdJbnZhbGlkIHJlZ2V4OiAnICsgcmVnZXhQYXJ0KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVwbGFjZVBhcnQgPSByZXBsYWNlUGFydCB8fCB2aW1HbG9iYWxTdGF0ZS5sYXN0U3Vic3RpdHV0ZVJlcGxhY2VQYXJ0O1xuICAgICAgICBpZiAocmVwbGFjZVBhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHNob3dDb25maXJtKGNtLCAnTm8gcHJldmlvdXMgc3Vic3RpdHV0ZSByZWd1bGFyIGV4cHJlc3Npb24nKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN0YXRlID0gZ2V0U2VhcmNoU3RhdGUoY20pO1xuICAgICAgICB2YXIgcXVlcnkgPSBzdGF0ZS5nZXRRdWVyeSgpO1xuICAgICAgICB2YXIgbGluZVN0YXJ0ID0gKHBhcmFtcy5saW5lICE9PSB1bmRlZmluZWQpID8gcGFyYW1zLmxpbmUgOiBjbS5nZXRDdXJzb3IoKS5saW5lO1xuICAgICAgICB2YXIgbGluZUVuZCA9IHBhcmFtcy5saW5lRW5kIHx8IGxpbmVTdGFydDtcbiAgICAgICAgaWYgKGxpbmVTdGFydCA9PSBjbS5maXJzdExpbmUoKSAmJiBsaW5lRW5kID09IGNtLmxhc3RMaW5lKCkpIHtcbiAgICAgICAgICBsaW5lRW5kID0gSW5maW5pdHk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvdW50KSB7XG4gICAgICAgICAgbGluZVN0YXJ0ID0gbGluZUVuZDtcbiAgICAgICAgICBsaW5lRW5kID0gbGluZVN0YXJ0ICsgY291bnQgLSAxO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzdGFydFBvcyA9IGNsaXBDdXJzb3JUb0NvbnRlbnQoY20sIFBvcyhsaW5lU3RhcnQsIDApKTtcbiAgICAgICAgdmFyIGN1cnNvciA9IGNtLmdldFNlYXJjaEN1cnNvcihxdWVyeSwgc3RhcnRQb3MpO1xuICAgICAgICBkb1JlcGxhY2UoY20sIGNvbmZpcm0sIGdsb2JhbCwgbGluZVN0YXJ0LCBsaW5lRW5kLCBjdXJzb3IsIHF1ZXJ5LCByZXBsYWNlUGFydCwgcGFyYW1zLmNhbGxiYWNrKTtcbiAgICAgIH0sXG4gICAgICByZWRvOiBDb2RlTWlycm9yLmNvbW1hbmRzLnJlZG8sXG4gICAgICB1bmRvOiBDb2RlTWlycm9yLmNvbW1hbmRzLnVuZG8sXG4gICAgICB3cml0ZTogZnVuY3Rpb24oY20pIHtcbiAgICAgICAgaWYgKENvZGVNaXJyb3IuY29tbWFuZHMuc2F2ZSkge1xuICAgICAgICAgIC8vIElmIGEgc2F2ZSBjb21tYW5kIGlzIGRlZmluZWQsIGNhbGwgaXQuXG4gICAgICAgICAgQ29kZU1pcnJvci5jb21tYW5kcy5zYXZlKGNtKTtcbiAgICAgICAgfSBlbHNlIGlmIChjbS5zYXZlKSB7XG4gICAgICAgICAgLy8gU2F2ZXMgdG8gdGV4dCBhcmVhIGlmIG5vIHNhdmUgY29tbWFuZCBpcyBkZWZpbmVkIGFuZCBjbS5zYXZlKCkgaXMgYXZhaWxhYmxlLlxuICAgICAgICAgIGNtLnNhdmUoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG5vaGxzZWFyY2g6IGZ1bmN0aW9uKGNtKSB7XG4gICAgICAgIGNsZWFyU2VhcmNoSGlnaGxpZ2h0KGNtKTtcbiAgICAgIH0sXG4gICAgICB5YW5rOiBmdW5jdGlvbiAoY20pIHtcbiAgICAgICAgdmFyIGN1ciA9IGNvcHlDdXJzb3IoY20uZ2V0Q3Vyc29yKCkpO1xuICAgICAgICB2YXIgbGluZSA9IGN1ci5saW5lO1xuICAgICAgICB2YXIgbGluZVRleHQgPSBjbS5nZXRMaW5lKGxpbmUpO1xuICAgICAgICB2aW1HbG9iYWxTdGF0ZS5yZWdpc3RlckNvbnRyb2xsZXIucHVzaFRleHQoXG4gICAgICAgICAgJzAnLCAneWFuaycsIGxpbmVUZXh0LCB0cnVlLCB0cnVlKTtcbiAgICAgIH0sXG4gICAgICBkZWxtYXJrczogZnVuY3Rpb24oY20sIHBhcmFtcykge1xuICAgICAgICBpZiAoIXBhcmFtcy5hcmdTdHJpbmcgfHwgIXRyaW0ocGFyYW1zLmFyZ1N0cmluZykpIHtcbiAgICAgICAgICBzaG93Q29uZmlybShjbSwgJ0FyZ3VtZW50IHJlcXVpcmVkJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN0YXRlID0gY20uc3RhdGUudmltO1xuICAgICAgICB2YXIgc3RyZWFtID0gbmV3IENvZGVNaXJyb3IuU3RyaW5nU3RyZWFtKHRyaW0ocGFyYW1zLmFyZ1N0cmluZykpO1xuICAgICAgICB3aGlsZSAoIXN0cmVhbS5lb2woKSkge1xuICAgICAgICAgIHN0cmVhbS5lYXRTcGFjZSgpO1xuXG4gICAgICAgICAgLy8gUmVjb3JkIHRoZSBzdHJlYW1zIHBvc2l0aW9uIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGxvb3AgZm9yIHVzZVxuICAgICAgICAgIC8vIGluIGVycm9yIG1lc3NhZ2VzLlxuICAgICAgICAgIHZhciBjb3VudCA9IHN0cmVhbS5wb3M7XG5cbiAgICAgICAgICBpZiAoIXN0cmVhbS5tYXRjaCgvW2EtekEtWl0vLCBmYWxzZSkpIHtcbiAgICAgICAgICAgIHNob3dDb25maXJtKGNtLCAnSW52YWxpZCBhcmd1bWVudDogJyArIHBhcmFtcy5hcmdTdHJpbmcuc3Vic3RyaW5nKGNvdW50KSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHN5bSA9IHN0cmVhbS5uZXh0KCk7XG4gICAgICAgICAgLy8gQ2hlY2sgaWYgdGhpcyBzeW1ib2wgaXMgcGFydCBvZiBhIHJhbmdlXG4gICAgICAgICAgaWYgKHN0cmVhbS5tYXRjaCgnLScsIHRydWUpKSB7XG4gICAgICAgICAgICAvLyBUaGlzIHN5bWJvbCBpcyBwYXJ0IG9mIGEgcmFuZ2UuXG5cbiAgICAgICAgICAgIC8vIFRoZSByYW5nZSBtdXN0IHRlcm1pbmF0ZSBhdCBhbiBhbHBoYWJldGljIGNoYXJhY3Rlci5cbiAgICAgICAgICAgIGlmICghc3RyZWFtLm1hdGNoKC9bYS16QS1aXS8sIGZhbHNlKSkge1xuICAgICAgICAgICAgICBzaG93Q29uZmlybShjbSwgJ0ludmFsaWQgYXJndW1lbnQ6ICcgKyBwYXJhbXMuYXJnU3RyaW5nLnN1YnN0cmluZyhjb3VudCkpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzdGFydE1hcmsgPSBzeW07XG4gICAgICAgICAgICB2YXIgZmluaXNoTWFyayA9IHN0cmVhbS5uZXh0KCk7XG4gICAgICAgICAgICAvLyBUaGUgcmFuZ2UgbXVzdCB0ZXJtaW5hdGUgYXQgYW4gYWxwaGFiZXRpYyBjaGFyYWN0ZXIgd2hpY2hcbiAgICAgICAgICAgIC8vIHNoYXJlcyB0aGUgc2FtZSBjYXNlIGFzIHRoZSBzdGFydCBvZiB0aGUgcmFuZ2UuXG4gICAgICAgICAgICBpZiAoaXNMb3dlckNhc2Uoc3RhcnRNYXJrKSAmJiBpc0xvd2VyQ2FzZShmaW5pc2hNYXJrKSB8fFxuICAgICAgICAgICAgICAgIGlzVXBwZXJDYXNlKHN0YXJ0TWFyaykgJiYgaXNVcHBlckNhc2UoZmluaXNoTWFyaykpIHtcbiAgICAgICAgICAgICAgdmFyIHN0YXJ0ID0gc3RhcnRNYXJrLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgICAgICAgIHZhciBmaW5pc2ggPSBmaW5pc2hNYXJrLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgICAgICAgIGlmIChzdGFydCA+PSBmaW5pc2gpIHtcbiAgICAgICAgICAgICAgICBzaG93Q29uZmlybShjbSwgJ0ludmFsaWQgYXJndW1lbnQ6ICcgKyBwYXJhbXMuYXJnU3RyaW5nLnN1YnN0cmluZyhjb3VudCkpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIC8vIEJlY2F1c2UgbWFya3MgYXJlIGFsd2F5cyBBU0NJSSB2YWx1ZXMsIGFuZCB3ZSBoYXZlXG4gICAgICAgICAgICAgIC8vIGRldGVybWluZWQgdGhhdCB0aGV5IGFyZSB0aGUgc2FtZSBjYXNlLCB3ZSBjYW4gdXNlXG4gICAgICAgICAgICAgIC8vIHRoZWlyIGNoYXIgY29kZXMgdG8gaXRlcmF0ZSB0aHJvdWdoIHRoZSBkZWZpbmVkIHJhbmdlLlxuICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8PSBmaW5pc2ggLSBzdGFydDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1hcmsgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHN0YXJ0ICsgaik7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHN0YXRlLm1hcmtzW21hcmtdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzaG93Q29uZmlybShjbSwgJ0ludmFsaWQgYXJndW1lbnQ6ICcgKyBzdGFydE1hcmsgKyAnLScpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFRoaXMgc3ltYm9sIGlzIGEgdmFsaWQgbWFyaywgYW5kIGlzIG5vdCBwYXJ0IG9mIGEgcmFuZ2UuXG4gICAgICAgICAgICBkZWxldGUgc3RhdGUubWFya3Nbc3ltXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGV4Q29tbWFuZERpc3BhdGNoZXIgPSBuZXcgRXhDb21tYW5kRGlzcGF0Y2hlcigpO1xuXG4gICAgLyoqXG4gICAgKiBAcGFyYW0ge0NvZGVNaXJyb3J9IGNtIENvZGVNaXJyb3IgaW5zdGFuY2Ugd2UgYXJlIGluLlxuICAgICogQHBhcmFtIHtib29sZWFufSBjb25maXJtIFdoZXRoZXIgdG8gY29uZmlybSBlYWNoIHJlcGxhY2UuXG4gICAgKiBAcGFyYW0ge0N1cnNvcn0gbGluZVN0YXJ0IExpbmUgdG8gc3RhcnQgcmVwbGFjaW5nIGZyb20uXG4gICAgKiBAcGFyYW0ge0N1cnNvcn0gbGluZUVuZCBMaW5lIHRvIHN0b3AgcmVwbGFjaW5nIGF0LlxuICAgICogQHBhcmFtIHtSZWdFeHB9IHF1ZXJ5IFF1ZXJ5IGZvciBwZXJmb3JtaW5nIG1hdGNoZXMgd2l0aC5cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSByZXBsYWNlV2l0aCBUZXh0IHRvIHJlcGxhY2UgbWF0Y2hlcyB3aXRoLiBNYXkgY29udGFpbiAkMSxcbiAgICAqICAgICAkMiwgZXRjIGZvciByZXBsYWNpbmcgY2FwdHVyZWQgZ3JvdXBzIHVzaW5nIEphdmFzY3JpcHQgcmVwbGFjZS5cbiAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oKX0gY2FsbGJhY2sgQSBjYWxsYmFjayBmb3Igd2hlbiB0aGUgcmVwbGFjZSBpcyBkb25lLlxuICAgICovXG4gICAgZnVuY3Rpb24gZG9SZXBsYWNlKGNtLCBjb25maXJtLCBnbG9iYWwsIGxpbmVTdGFydCwgbGluZUVuZCwgc2VhcmNoQ3Vyc29yLCBxdWVyeSxcbiAgICAgICAgcmVwbGFjZVdpdGgsIGNhbGxiYWNrKSB7XG4gICAgICAvLyBTZXQgdXAgYWxsIHRoZSBmdW5jdGlvbnMuXG4gICAgICBjbS5zdGF0ZS52aW0uZXhNb2RlID0gdHJ1ZTtcbiAgICAgIHZhciBkb25lID0gZmFsc2U7XG4gICAgICB2YXIgbGFzdFBvcyA9IHNlYXJjaEN1cnNvci5mcm9tKCk7XG4gICAgICBmdW5jdGlvbiByZXBsYWNlQWxsKCkge1xuICAgICAgICBjbS5vcGVyYXRpb24oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgd2hpbGUgKCFkb25lKSB7XG4gICAgICAgICAgICByZXBsYWNlKCk7XG4gICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHN0b3AoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiByZXBsYWNlKCkge1xuICAgICAgICB2YXIgdGV4dCA9IGNtLmdldFJhbmdlKHNlYXJjaEN1cnNvci5mcm9tKCksIHNlYXJjaEN1cnNvci50bygpKTtcbiAgICAgICAgdmFyIG5ld1RleHQgPSB0ZXh0LnJlcGxhY2UocXVlcnksIHJlcGxhY2VXaXRoKTtcbiAgICAgICAgc2VhcmNoQ3Vyc29yLnJlcGxhY2UobmV3VGV4dCk7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAvLyBUaGUgYmVsb3cgb25seSBsb29wcyB0byBza2lwIG92ZXIgbXVsdGlwbGUgb2NjdXJyZW5jZXMgb24gdGhlIHNhbWVcbiAgICAgICAgLy8gbGluZSB3aGVuICdnbG9iYWwnIGlzIG5vdCB0cnVlLlxuICAgICAgICB3aGlsZShzZWFyY2hDdXJzb3IuZmluZE5leHQoKSAmJlxuICAgICAgICAgICAgICBpc0luUmFuZ2Uoc2VhcmNoQ3Vyc29yLmZyb20oKSwgbGluZVN0YXJ0LCBsaW5lRW5kKSkge1xuICAgICAgICAgIGlmICghZ2xvYmFsICYmIGxhc3RQb3MgJiYgc2VhcmNoQ3Vyc29yLmZyb20oKS5saW5lID09IGxhc3RQb3MubGluZSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNtLnNjcm9sbEludG9WaWV3KHNlYXJjaEN1cnNvci5mcm9tKCksIDMwKTtcbiAgICAgICAgICBjbS5zZXRTZWxlY3Rpb24oc2VhcmNoQ3Vyc29yLmZyb20oKSwgc2VhcmNoQ3Vyc29yLnRvKCkpO1xuICAgICAgICAgIGxhc3RQb3MgPSBzZWFyY2hDdXJzb3IuZnJvbSgpO1xuICAgICAgICAgIGRvbmUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBzdG9wKGNsb3NlKSB7XG4gICAgICAgIGlmIChjbG9zZSkgeyBjbG9zZSgpOyB9XG4gICAgICAgIGNtLmZvY3VzKCk7XG4gICAgICAgIGlmIChsYXN0UG9zKSB7XG4gICAgICAgICAgY20uc2V0Q3Vyc29yKGxhc3RQb3MpO1xuICAgICAgICAgIHZhciB2aW0gPSBjbS5zdGF0ZS52aW07XG4gICAgICAgICAgdmltLmV4TW9kZSA9IGZhbHNlO1xuICAgICAgICAgIHZpbS5sYXN0SFBvcyA9IHZpbS5sYXN0SFNQb3MgPSBsYXN0UG9zLmNoO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjYWxsYmFjaykgeyBjYWxsYmFjaygpOyB9XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBvblByb21wdEtleURvd24oZSwgX3ZhbHVlLCBjbG9zZSkge1xuICAgICAgICAvLyBTd2FsbG93IGFsbCBrZXlzLlxuICAgICAgICBDb2RlTWlycm9yLmVfc3RvcChlKTtcbiAgICAgICAgdmFyIGtleU5hbWUgPSBDb2RlTWlycm9yLmtleU5hbWUoZSk7XG4gICAgICAgIHN3aXRjaCAoa2V5TmFtZSkge1xuICAgICAgICAgIGNhc2UgJ1knOlxuICAgICAgICAgICAgcmVwbGFjZSgpOyBuZXh0KCk7IGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ04nOlxuICAgICAgICAgICAgbmV4dCgpOyBicmVhaztcbiAgICAgICAgICBjYXNlICdBJzpcbiAgICAgICAgICAgIC8vIHJlcGxhY2VBbGwgY29udGFpbnMgYSBjYWxsIHRvIGNsb3NlIG9mIGl0cyBvd24uIFdlIGRvbid0IHdhbnQgaXRcbiAgICAgICAgICAgIC8vIHRvIGZpcmUgdG9vIGVhcmx5IG9yIG11bHRpcGxlIHRpbWVzLlxuICAgICAgICAgICAgdmFyIHNhdmVkQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgICAgIGNhbGxiYWNrID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY20ub3BlcmF0aW9uKHJlcGxhY2VBbGwpO1xuICAgICAgICAgICAgY2FsbGJhY2sgPSBzYXZlZENhbGxiYWNrO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnTCc6XG4gICAgICAgICAgICByZXBsYWNlKCk7XG4gICAgICAgICAgICAvLyBmYWxsIHRocm91Z2ggYW5kIGV4aXQuXG4gICAgICAgICAgY2FzZSAnUSc6XG4gICAgICAgICAgY2FzZSAnRXNjJzpcbiAgICAgICAgICBjYXNlICdDdHJsLUMnOlxuICAgICAgICAgIGNhc2UgJ0N0cmwtWyc6XG4gICAgICAgICAgICBzdG9wKGNsb3NlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkb25lKSB7IHN0b3AoY2xvc2UpOyB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBBY3R1YWxseSBkbyByZXBsYWNlLlxuICAgICAgbmV4dCgpO1xuICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgc2hvd0NvbmZpcm0oY20sICdObyBtYXRjaGVzIGZvciAnICsgcXVlcnkuc291cmNlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCFjb25maXJtKSB7XG4gICAgICAgIHJlcGxhY2VBbGwoKTtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7IGNhbGxiYWNrKCk7IH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc2hvd1Byb21wdChjbSwge1xuICAgICAgICBwcmVmaXg6ICdyZXBsYWNlIHdpdGggPHN0cm9uZz4nICsgcmVwbGFjZVdpdGggKyAnPC9zdHJvbmc+ICh5L24vYS9xL2wpJyxcbiAgICAgICAgb25LZXlEb3duOiBvblByb21wdEtleURvd25cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIENvZGVNaXJyb3Iua2V5TWFwLnZpbSA9IHtcbiAgICAgIGF0dGFjaDogYXR0YWNoVmltTWFwLFxuICAgICAgZGV0YWNoOiBkZXRhY2hWaW1NYXAsXG4gICAgICBjYWxsOiBjbUtleVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBleGl0SW5zZXJ0TW9kZShjbSkge1xuICAgICAgdmFyIHZpbSA9IGNtLnN0YXRlLnZpbTtcbiAgICAgIHZhciBtYWNyb01vZGVTdGF0ZSA9IHZpbUdsb2JhbFN0YXRlLm1hY3JvTW9kZVN0YXRlO1xuICAgICAgdmFyIGluc2VydE1vZGVDaGFuZ2VSZWdpc3RlciA9IHZpbUdsb2JhbFN0YXRlLnJlZ2lzdGVyQ29udHJvbGxlci5nZXRSZWdpc3RlcignLicpO1xuICAgICAgdmFyIGlzUGxheWluZyA9IG1hY3JvTW9kZVN0YXRlLmlzUGxheWluZztcbiAgICAgIHZhciBsYXN0Q2hhbmdlID0gbWFjcm9Nb2RlU3RhdGUubGFzdEluc2VydE1vZGVDaGFuZ2VzO1xuICAgICAgaWYgKCFpc1BsYXlpbmcpIHtcbiAgICAgICAgY20ub2ZmKCdjaGFuZ2UnLCBvbkNoYW5nZSk7XG4gICAgICAgIENvZGVNaXJyb3Iub2ZmKGNtLmdldElucHV0RmllbGQoKSwgJ2tleWRvd24nLCBvbktleUV2ZW50VGFyZ2V0S2V5RG93bik7XG4gICAgICB9XG4gICAgICBpZiAoIWlzUGxheWluZyAmJiB2aW0uaW5zZXJ0TW9kZVJlcGVhdCA+IDEpIHtcbiAgICAgICAgLy8gUGVyZm9ybSBpbnNlcnQgbW9kZSByZXBlYXQgZm9yIGNvbW1hbmRzIGxpa2UgMyxhIGFuZCAzLG8uXG4gICAgICAgIHJlcGVhdExhc3RFZGl0KGNtLCB2aW0sIHZpbS5pbnNlcnRNb2RlUmVwZWF0IC0gMSxcbiAgICAgICAgICAgIHRydWUgLyoqIHJlcGVhdEZvckluc2VydCAqLyk7XG4gICAgICAgIHZpbS5sYXN0RWRpdElucHV0U3RhdGUucmVwZWF0T3ZlcnJpZGUgPSB2aW0uaW5zZXJ0TW9kZVJlcGVhdDtcbiAgICAgIH1cbiAgICAgIGRlbGV0ZSB2aW0uaW5zZXJ0TW9kZVJlcGVhdDtcbiAgICAgIHZpbS5pbnNlcnRNb2RlID0gZmFsc2U7XG4gICAgICBjbS5zZXRDdXJzb3IoY20uZ2V0Q3Vyc29yKCkubGluZSwgY20uZ2V0Q3Vyc29yKCkuY2gtMSk7XG4gICAgICBjbS5zZXRPcHRpb24oJ2tleU1hcCcsICd2aW0nKTtcbiAgICAgIGNtLnNldE9wdGlvbignZGlzYWJsZUlucHV0JywgdHJ1ZSk7XG4gICAgICBjbS50b2dnbGVPdmVyd3JpdGUoZmFsc2UpOyAvLyBleGl0IHJlcGxhY2UgbW9kZSBpZiB3ZSB3ZXJlIGluIGl0LlxuICAgICAgLy8gdXBkYXRlIHRoZSBcIi4gcmVnaXN0ZXIgYmVmb3JlIGV4aXRpbmcgaW5zZXJ0IG1vZGVcbiAgICAgIGluc2VydE1vZGVDaGFuZ2VSZWdpc3Rlci5zZXRUZXh0KGxhc3RDaGFuZ2UuY2hhbmdlcy5qb2luKCcnKSk7XG4gICAgICBDb2RlTWlycm9yLnNpZ25hbChjbSwgXCJ2aW0tbW9kZS1jaGFuZ2VcIiwge21vZGU6IFwibm9ybWFsXCJ9KTtcbiAgICAgIGlmIChtYWNyb01vZGVTdGF0ZS5pc1JlY29yZGluZykge1xuICAgICAgICBsb2dJbnNlcnRNb2RlQ2hhbmdlKG1hY3JvTW9kZVN0YXRlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfbWFwQ29tbWFuZChjb21tYW5kKSB7XG4gICAgICBkZWZhdWx0S2V5bWFwLnVuc2hpZnQoY29tbWFuZCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFwQ29tbWFuZChrZXlzLCB0eXBlLCBuYW1lLCBhcmdzLCBleHRyYSkge1xuICAgICAgdmFyIGNvbW1hbmQgPSB7a2V5czoga2V5cywgdHlwZTogdHlwZX07XG4gICAgICBjb21tYW5kW3R5cGVdID0gbmFtZTtcbiAgICAgIGNvbW1hbmRbdHlwZSArIFwiQXJnc1wiXSA9IGFyZ3M7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gZXh0cmEpXG4gICAgICAgIGNvbW1hbmRba2V5XSA9IGV4dHJhW2tleV07XG4gICAgICBfbWFwQ29tbWFuZChjb21tYW5kKTtcbiAgICB9XG5cbiAgICAvLyBUaGUgdGltZW91dCBpbiBtaWxsaXNlY29uZHMgZm9yIHRoZSB0d28tY2hhcmFjdGVyIEVTQyBrZXltYXAgc2hvdWxkIGJlXG4gICAgLy8gYWRqdXN0ZWQgYWNjb3JkaW5nIHRvIHlvdXIgdHlwaW5nIHNwZWVkIHRvIHByZXZlbnQgZmFsc2UgcG9zaXRpdmVzLlxuICAgIGRlZmluZU9wdGlvbignaW5zZXJ0TW9kZUVzY0tleXNUaW1lb3V0JywgMjAwLCAnbnVtYmVyJyk7XG5cbiAgICBDb2RlTWlycm9yLmtleU1hcFsndmltLWluc2VydCddID0ge1xuICAgICAgLy8gVE9ETzogb3ZlcnJpZGUgbmF2aWdhdGlvbiBrZXlzIHNvIHRoYXQgRXNjIHdpbGwgY2FuY2VsIGF1dG9tYXRpY1xuICAgICAgLy8gaW5kZW50YXRpb24gZnJvbSBvLCBPLCBpXzxDUj5cbiAgICAgIGZhbGx0aHJvdWdoOiBbJ2RlZmF1bHQnXSxcbiAgICAgIGF0dGFjaDogYXR0YWNoVmltTWFwLFxuICAgICAgZGV0YWNoOiBkZXRhY2hWaW1NYXAsXG4gICAgICBjYWxsOiBjbUtleVxuICAgIH07XG5cbiAgICBDb2RlTWlycm9yLmtleU1hcFsndmltLXJlcGxhY2UnXSA9IHtcbiAgICAgICdCYWNrc3BhY2UnOiAnZ29DaGFyTGVmdCcsXG4gICAgICBmYWxsdGhyb3VnaDogWyd2aW0taW5zZXJ0J10sXG4gICAgICBhdHRhY2g6IGF0dGFjaFZpbU1hcCxcbiAgICAgIGRldGFjaDogZGV0YWNoVmltTWFwLFxuICAgICAgY2FsbDogY21LZXlcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZXhlY3V0ZU1hY3JvUmVnaXN0ZXIoY20sIHZpbSwgbWFjcm9Nb2RlU3RhdGUsIHJlZ2lzdGVyTmFtZSkge1xuICAgICAgdmFyIHJlZ2lzdGVyID0gdmltR2xvYmFsU3RhdGUucmVnaXN0ZXJDb250cm9sbGVyLmdldFJlZ2lzdGVyKHJlZ2lzdGVyTmFtZSk7XG4gICAgICBpZiAocmVnaXN0ZXJOYW1lID09ICc6Jykge1xuICAgICAgICAvLyBSZWFkLW9ubHkgcmVnaXN0ZXIgY29udGFpbmluZyBsYXN0IEV4IGNvbW1hbmQuXG4gICAgICAgIGlmIChyZWdpc3Rlci5rZXlCdWZmZXJbMF0pIHtcbiAgICAgICAgICBleENvbW1hbmREaXNwYXRjaGVyLnByb2Nlc3NDb21tYW5kKGNtLCByZWdpc3Rlci5rZXlCdWZmZXJbMF0pO1xuICAgICAgICB9XG4gICAgICAgIG1hY3JvTW9kZVN0YXRlLmlzUGxheWluZyA9IGZhbHNlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIga2V5QnVmZmVyID0gcmVnaXN0ZXIua2V5QnVmZmVyO1xuICAgICAgdmFyIGltYyA9IDA7XG4gICAgICBtYWNyb01vZGVTdGF0ZS5pc1BsYXlpbmcgPSB0cnVlO1xuICAgICAgbWFjcm9Nb2RlU3RhdGUucmVwbGF5U2VhcmNoUXVlcmllcyA9IHJlZ2lzdGVyLnNlYXJjaFF1ZXJpZXMuc2xpY2UoMCk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleUJ1ZmZlci5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgdGV4dCA9IGtleUJ1ZmZlcltpXTtcbiAgICAgICAgdmFyIG1hdGNoLCBrZXk7XG4gICAgICAgIHdoaWxlICh0ZXh0KSB7XG4gICAgICAgICAgLy8gUHVsbCBvZmYgb25lIGNvbW1hbmQga2V5LCB3aGljaCBpcyBlaXRoZXIgYSBzaW5nbGUgY2hhcmFjdGVyXG4gICAgICAgICAgLy8gb3IgYSBzcGVjaWFsIHNlcXVlbmNlIHdyYXBwZWQgaW4gJzwnIGFuZCAnPicsIGUuZy4gJzxTcGFjZT4nLlxuICAgICAgICAgIG1hdGNoID0gKC88XFx3Ky0uKz8+fDxcXHcrPnwuLykuZXhlYyh0ZXh0KTtcbiAgICAgICAgICBrZXkgPSBtYXRjaFswXTtcbiAgICAgICAgICB0ZXh0ID0gdGV4dC5zdWJzdHJpbmcobWF0Y2guaW5kZXggKyBrZXkubGVuZ3RoKTtcbiAgICAgICAgICBDb2RlTWlycm9yLlZpbS5oYW5kbGVLZXkoY20sIGtleSwgJ21hY3JvJyk7XG4gICAgICAgICAgaWYgKHZpbS5pbnNlcnRNb2RlKSB7XG4gICAgICAgICAgICB2YXIgY2hhbmdlcyA9IHJlZ2lzdGVyLmluc2VydE1vZGVDaGFuZ2VzW2ltYysrXS5jaGFuZ2VzO1xuICAgICAgICAgICAgdmltR2xvYmFsU3RhdGUubWFjcm9Nb2RlU3RhdGUubGFzdEluc2VydE1vZGVDaGFuZ2VzLmNoYW5nZXMgPVxuICAgICAgICAgICAgICAgIGNoYW5nZXM7XG4gICAgICAgICAgICByZXBlYXRJbnNlcnRNb2RlQ2hhbmdlcyhjbSwgY2hhbmdlcywgMSk7XG4gICAgICAgICAgICBleGl0SW5zZXJ0TW9kZShjbSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBtYWNyb01vZGVTdGF0ZS5pc1BsYXlpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2dLZXkobWFjcm9Nb2RlU3RhdGUsIGtleSkge1xuICAgICAgaWYgKG1hY3JvTW9kZVN0YXRlLmlzUGxheWluZykgeyByZXR1cm47IH1cbiAgICAgIHZhciByZWdpc3Rlck5hbWUgPSBtYWNyb01vZGVTdGF0ZS5sYXRlc3RSZWdpc3RlcjtcbiAgICAgIHZhciByZWdpc3RlciA9IHZpbUdsb2JhbFN0YXRlLnJlZ2lzdGVyQ29udHJvbGxlci5nZXRSZWdpc3RlcihyZWdpc3Rlck5hbWUpO1xuICAgICAgaWYgKHJlZ2lzdGVyKSB7XG4gICAgICAgIHJlZ2lzdGVyLnB1c2hUZXh0KGtleSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9nSW5zZXJ0TW9kZUNoYW5nZShtYWNyb01vZGVTdGF0ZSkge1xuICAgICAgaWYgKG1hY3JvTW9kZVN0YXRlLmlzUGxheWluZykgeyByZXR1cm47IH1cbiAgICAgIHZhciByZWdpc3Rlck5hbWUgPSBtYWNyb01vZGVTdGF0ZS5sYXRlc3RSZWdpc3RlcjtcbiAgICAgIHZhciByZWdpc3RlciA9IHZpbUdsb2JhbFN0YXRlLnJlZ2lzdGVyQ29udHJvbGxlci5nZXRSZWdpc3RlcihyZWdpc3Rlck5hbWUpO1xuICAgICAgaWYgKHJlZ2lzdGVyICYmIHJlZ2lzdGVyLnB1c2hJbnNlcnRNb2RlQ2hhbmdlcykge1xuICAgICAgICByZWdpc3Rlci5wdXNoSW5zZXJ0TW9kZUNoYW5nZXMobWFjcm9Nb2RlU3RhdGUubGFzdEluc2VydE1vZGVDaGFuZ2VzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2dTZWFyY2hRdWVyeShtYWNyb01vZGVTdGF0ZSwgcXVlcnkpIHtcbiAgICAgIGlmIChtYWNyb01vZGVTdGF0ZS5pc1BsYXlpbmcpIHsgcmV0dXJuOyB9XG4gICAgICB2YXIgcmVnaXN0ZXJOYW1lID0gbWFjcm9Nb2RlU3RhdGUubGF0ZXN0UmVnaXN0ZXI7XG4gICAgICB2YXIgcmVnaXN0ZXIgPSB2aW1HbG9iYWxTdGF0ZS5yZWdpc3RlckNvbnRyb2xsZXIuZ2V0UmVnaXN0ZXIocmVnaXN0ZXJOYW1lKTtcbiAgICAgIGlmIChyZWdpc3RlciAmJiByZWdpc3Rlci5wdXNoU2VhcmNoUXVlcnkpIHtcbiAgICAgICAgcmVnaXN0ZXIucHVzaFNlYXJjaFF1ZXJ5KHF1ZXJ5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMaXN0ZW5zIGZvciBjaGFuZ2VzIG1hZGUgaW4gaW5zZXJ0IG1vZGUuXG4gICAgICogU2hvdWxkIG9ubHkgYmUgYWN0aXZlIGluIGluc2VydCBtb2RlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG9uQ2hhbmdlKGNtLCBjaGFuZ2VPYmopIHtcbiAgICAgIHZhciBtYWNyb01vZGVTdGF0ZSA9IHZpbUdsb2JhbFN0YXRlLm1hY3JvTW9kZVN0YXRlO1xuICAgICAgdmFyIGxhc3RDaGFuZ2UgPSBtYWNyb01vZGVTdGF0ZS5sYXN0SW5zZXJ0TW9kZUNoYW5nZXM7XG4gICAgICBpZiAoIW1hY3JvTW9kZVN0YXRlLmlzUGxheWluZykge1xuICAgICAgICB3aGlsZShjaGFuZ2VPYmopIHtcbiAgICAgICAgICBsYXN0Q2hhbmdlLmV4cGVjdEN1cnNvckFjdGl2aXR5Rm9yQ2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgICBpZiAobGFzdENoYW5nZS5pZ25vcmVDb3VudCA+IDEpIHtcbiAgICAgICAgICAgIGxhc3RDaGFuZ2UuaWdub3JlQ291bnQtLTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNoYW5nZU9iai5vcmlnaW4gPT0gJytpbnB1dCcgfHwgY2hhbmdlT2JqLm9yaWdpbiA9PSAncGFzdGUnXG4gICAgICAgICAgICAgIHx8IGNoYW5nZU9iai5vcmlnaW4gPT09IHVuZGVmaW5lZCAvKiBvbmx5IGluIHRlc3RpbmcgKi8pIHtcbiAgICAgICAgICAgIHZhciBzZWxlY3Rpb25Db3VudCA9IGNtLmxpc3RTZWxlY3Rpb25zKCkubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKHNlbGVjdGlvbkNvdW50ID4gMSlcbiAgICAgICAgICAgICAgbGFzdENoYW5nZS5pZ25vcmVDb3VudCA9IHNlbGVjdGlvbkNvdW50O1xuICAgICAgICAgICAgdmFyIHRleHQgPSBjaGFuZ2VPYmoudGV4dC5qb2luKCdcXG4nKTtcbiAgICAgICAgICAgIGlmIChsYXN0Q2hhbmdlLm1heWJlUmVzZXQpIHtcbiAgICAgICAgICAgICAgbGFzdENoYW5nZS5jaGFuZ2VzID0gW107XG4gICAgICAgICAgICAgIGxhc3RDaGFuZ2UubWF5YmVSZXNldCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRleHQpIHtcbiAgICAgICAgICAgICAgaWYgKGNtLnN0YXRlLm92ZXJ3cml0ZSAmJiAhL1xcbi8udGVzdCh0ZXh0KSkge1xuICAgICAgICAgICAgICAgIGxhc3RDaGFuZ2UuY2hhbmdlcy5wdXNoKFt0ZXh0XSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGFzdENoYW5nZS5jaGFuZ2VzLnB1c2godGV4dCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gQ2hhbmdlIG9iamVjdHMgbWF5IGJlIGNoYWluZWQgd2l0aCBuZXh0LlxuICAgICAgICAgIGNoYW5nZU9iaiA9IGNoYW5nZU9iai5uZXh0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBMaXN0ZW5zIGZvciBhbnkga2luZCBvZiBjdXJzb3IgYWN0aXZpdHkgb24gQ29kZU1pcnJvci5cbiAgICAqL1xuICAgIGZ1bmN0aW9uIG9uQ3Vyc29yQWN0aXZpdHkoY20pIHtcbiAgICAgIHZhciB2aW0gPSBjbS5zdGF0ZS52aW07XG4gICAgICBpZiAodmltLmluc2VydE1vZGUpIHtcbiAgICAgICAgLy8gVHJhY2tpbmcgY3Vyc29yIGFjdGl2aXR5IGluIGluc2VydCBtb2RlIChmb3IgbWFjcm8gc3VwcG9ydCkuXG4gICAgICAgIHZhciBtYWNyb01vZGVTdGF0ZSA9IHZpbUdsb2JhbFN0YXRlLm1hY3JvTW9kZVN0YXRlO1xuICAgICAgICBpZiAobWFjcm9Nb2RlU3RhdGUuaXNQbGF5aW5nKSB7IHJldHVybjsgfVxuICAgICAgICB2YXIgbGFzdENoYW5nZSA9IG1hY3JvTW9kZVN0YXRlLmxhc3RJbnNlcnRNb2RlQ2hhbmdlcztcbiAgICAgICAgaWYgKGxhc3RDaGFuZ2UuZXhwZWN0Q3Vyc29yQWN0aXZpdHlGb3JDaGFuZ2UpIHtcbiAgICAgICAgICBsYXN0Q2hhbmdlLmV4cGVjdEN1cnNvckFjdGl2aXR5Rm9yQ2hhbmdlID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gQ3Vyc29yIG1vdmVkIG91dHNpZGUgdGhlIGNvbnRleHQgb2YgYW4gZWRpdC4gUmVzZXQgdGhlIGNoYW5nZS5cbiAgICAgICAgICBsYXN0Q2hhbmdlLm1heWJlUmVzZXQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCFjbS5jdXJPcC5pc1ZpbU9wKSB7XG4gICAgICAgIGhhbmRsZUV4dGVybmFsU2VsZWN0aW9uKGNtLCB2aW0pO1xuICAgICAgfVxuICAgICAgaWYgKHZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgIHVwZGF0ZUZha2VDdXJzb3IoY20pO1xuICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBLZWVwcyB0cmFjayBvZiBhIGZha2UgY3Vyc29yIHRvIHN1cHBvcnQgdmlzdWFsIG1vZGUgY3Vyc29yIGJlaGF2aW9yLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVwZGF0ZUZha2VDdXJzb3IoY20pIHtcbiAgICAgIHZhciBjbGFzc05hbWUgPSAnY20tYW5pbWF0ZS1mYXQtY3Vyc29yJztcbiAgICAgIHZhciB2aW0gPSBjbS5zdGF0ZS52aW07XG4gICAgICB2YXIgZnJvbSA9IGNsaXBDdXJzb3JUb0NvbnRlbnQoY20sIGNvcHlDdXJzb3IodmltLnNlbC5oZWFkKSk7XG4gICAgICB2YXIgdG8gPSBvZmZzZXRDdXJzb3IoZnJvbSwgMCwgMSk7XG4gICAgICBjbGVhckZha2VDdXJzb3IodmltKTtcbiAgICAgIC8vIEluIHZpc3VhbCBtb2RlLCB0aGUgY3Vyc29yIG1heSBiZSBwb3NpdGlvbmVkIG92ZXIgRU9MLlxuICAgICAgaWYgKGZyb20uY2ggPT0gY20uZ2V0TGluZShmcm9tLmxpbmUpLmxlbmd0aCkge1xuICAgICAgICB2YXIgd2lkZ2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgIHdpZGdldC50ZXh0Q29udGVudCA9IFwiXFx1MDBhMFwiO1xuICAgICAgICB3aWRnZXQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgICAgICB2aW0uZmFrZUN1cnNvckJvb2ttYXJrID0gY20uc2V0Qm9va21hcmsoZnJvbSwge3dpZGdldDogd2lkZ2V0fSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2aW0uZmFrZUN1cnNvciA9IGNtLm1hcmtUZXh0KGZyb20sIHRvLCB7Y2xhc3NOYW1lOiBjbGFzc05hbWV9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gY2xlYXJGYWtlQ3Vyc29yKHZpbSkge1xuICAgICAgaWYgKHZpbS5mYWtlQ3Vyc29yKSB7XG4gICAgICAgIHZpbS5mYWtlQ3Vyc29yLmNsZWFyKCk7XG4gICAgICAgIHZpbS5mYWtlQ3Vyc29yID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmICh2aW0uZmFrZUN1cnNvckJvb2ttYXJrKSB7XG4gICAgICAgIHZpbS5mYWtlQ3Vyc29yQm9va21hcmsuY2xlYXIoKTtcbiAgICAgICAgdmltLmZha2VDdXJzb3JCb29rbWFyayA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGhhbmRsZUV4dGVybmFsU2VsZWN0aW9uKGNtLCB2aW0pIHtcbiAgICAgIHZhciBhbmNob3IgPSBjbS5nZXRDdXJzb3IoJ2FuY2hvcicpO1xuICAgICAgdmFyIGhlYWQgPSBjbS5nZXRDdXJzb3IoJ2hlYWQnKTtcbiAgICAgIC8vIEVudGVyIG9yIGV4aXQgdmlzdWFsIG1vZGUgdG8gbWF0Y2ggbW91c2Ugc2VsZWN0aW9uLlxuICAgICAgaWYgKHZpbS52aXN1YWxNb2RlICYmICFjbS5zb21ldGhpbmdTZWxlY3RlZCgpKSB7XG4gICAgICAgIGV4aXRWaXN1YWxNb2RlKGNtLCBmYWxzZSk7XG4gICAgICB9IGVsc2UgaWYgKCF2aW0udmlzdWFsTW9kZSAmJiAhdmltLmluc2VydE1vZGUgJiYgY20uc29tZXRoaW5nU2VsZWN0ZWQoKSkge1xuICAgICAgICB2aW0udmlzdWFsTW9kZSA9IHRydWU7XG4gICAgICAgIHZpbS52aXN1YWxMaW5lID0gZmFsc2U7XG4gICAgICAgIENvZGVNaXJyb3Iuc2lnbmFsKGNtLCBcInZpbS1tb2RlLWNoYW5nZVwiLCB7bW9kZTogXCJ2aXN1YWxcIn0pO1xuICAgICAgfVxuICAgICAgaWYgKHZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgIC8vIEJpbmQgQ29kZU1pcnJvciBzZWxlY3Rpb24gbW9kZWwgdG8gdmltIHNlbGVjdGlvbiBtb2RlbC5cbiAgICAgICAgLy8gTW91c2Ugc2VsZWN0aW9ucyBhcmUgY29uc2lkZXJlZCB2aXN1YWwgY2hhcmFjdGVyd2lzZS5cbiAgICAgICAgdmFyIGhlYWRPZmZzZXQgPSAhY3Vyc29ySXNCZWZvcmUoaGVhZCwgYW5jaG9yKSA/IC0xIDogMDtcbiAgICAgICAgdmFyIGFuY2hvck9mZnNldCA9IGN1cnNvcklzQmVmb3JlKGhlYWQsIGFuY2hvcikgPyAtMSA6IDA7XG4gICAgICAgIGhlYWQgPSBvZmZzZXRDdXJzb3IoaGVhZCwgMCwgaGVhZE9mZnNldCk7XG4gICAgICAgIGFuY2hvciA9IG9mZnNldEN1cnNvcihhbmNob3IsIDAsIGFuY2hvck9mZnNldCk7XG4gICAgICAgIHZpbS5zZWwgPSB7XG4gICAgICAgICAgYW5jaG9yOiBhbmNob3IsXG4gICAgICAgICAgaGVhZDogaGVhZFxuICAgICAgICB9O1xuICAgICAgICB1cGRhdGVNYXJrKGNtLCB2aW0sICc8JywgY3Vyc29yTWluKGhlYWQsIGFuY2hvcikpO1xuICAgICAgICB1cGRhdGVNYXJrKGNtLCB2aW0sICc+JywgY3Vyc29yTWF4KGhlYWQsIGFuY2hvcikpO1xuICAgICAgfSBlbHNlIGlmICghdmltLmluc2VydE1vZGUpIHtcbiAgICAgICAgLy8gUmVzZXQgbGFzdEhQb3MgaWYgc2VsZWN0aW9uIHdhcyBtb2RpZmllZCBieSBzb21ldGhpbmcgb3V0c2lkZSBvZiB2aW0gbW9kZSBlLmcuIGJ5IG1vdXNlLlxuICAgICAgICB2aW0ubGFzdEhQb3MgPSBjbS5nZXRDdXJzb3IoKS5jaDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogV3JhcHBlciBmb3Igc3BlY2lhbCBrZXlzIHByZXNzZWQgaW4gaW5zZXJ0IG1vZGUgKi9cbiAgICBmdW5jdGlvbiBJbnNlcnRNb2RlS2V5KGtleU5hbWUpIHtcbiAgICAgIHRoaXMua2V5TmFtZSA9IGtleU5hbWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBIYW5kbGVzIHJhdyBrZXkgZG93biBldmVudHMgZnJvbSB0aGUgdGV4dCBhcmVhLlxuICAgICogLSBTaG91bGQgb25seSBiZSBhY3RpdmUgaW4gaW5zZXJ0IG1vZGUuXG4gICAgKiAtIEZvciByZWNvcmRpbmcgZGVsZXRlcyBpbiBpbnNlcnQgbW9kZS5cbiAgICAqL1xuICAgIGZ1bmN0aW9uIG9uS2V5RXZlbnRUYXJnZXRLZXlEb3duKGUpIHtcbiAgICAgIHZhciBtYWNyb01vZGVTdGF0ZSA9IHZpbUdsb2JhbFN0YXRlLm1hY3JvTW9kZVN0YXRlO1xuICAgICAgdmFyIGxhc3RDaGFuZ2UgPSBtYWNyb01vZGVTdGF0ZS5sYXN0SW5zZXJ0TW9kZUNoYW5nZXM7XG4gICAgICB2YXIga2V5TmFtZSA9IENvZGVNaXJyb3Iua2V5TmFtZShlKTtcbiAgICAgIGlmICgha2V5TmFtZSkgeyByZXR1cm47IH1cbiAgICAgIGZ1bmN0aW9uIG9uS2V5Rm91bmQoKSB7XG4gICAgICAgIGlmIChsYXN0Q2hhbmdlLm1heWJlUmVzZXQpIHtcbiAgICAgICAgICBsYXN0Q2hhbmdlLmNoYW5nZXMgPSBbXTtcbiAgICAgICAgICBsYXN0Q2hhbmdlLm1heWJlUmVzZXQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBsYXN0Q2hhbmdlLmNoYW5nZXMucHVzaChuZXcgSW5zZXJ0TW9kZUtleShrZXlOYW1lKSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKGtleU5hbWUuaW5kZXhPZignRGVsZXRlJykgIT0gLTEgfHwga2V5TmFtZS5pbmRleE9mKCdCYWNrc3BhY2UnKSAhPSAtMSkge1xuICAgICAgICBDb2RlTWlycm9yLmxvb2t1cEtleShrZXlOYW1lLCAndmltLWluc2VydCcsIG9uS2V5Rm91bmQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlcGVhdHMgdGhlIGxhc3QgZWRpdCwgd2hpY2ggaW5jbHVkZXMgZXhhY3RseSAxIGNvbW1hbmQgYW5kIGF0IG1vc3QgMVxuICAgICAqIGluc2VydC4gT3BlcmF0b3IgYW5kIG1vdGlvbiBjb21tYW5kcyBhcmUgcmVhZCBmcm9tIGxhc3RFZGl0SW5wdXRTdGF0ZSxcbiAgICAgKiB3aGlsZSBhY3Rpb24gY29tbWFuZHMgYXJlIHJlYWQgZnJvbSBsYXN0RWRpdEFjdGlvbkNvbW1hbmQuXG4gICAgICpcbiAgICAgKiBJZiByZXBlYXRGb3JJbnNlcnQgaXMgdHJ1ZSwgdGhlbiB0aGUgZnVuY3Rpb24gd2FzIGNhbGxlZCBieVxuICAgICAqIGV4aXRJbnNlcnRNb2RlIHRvIHJlcGVhdCB0aGUgaW5zZXJ0IG1vZGUgY2hhbmdlcyB0aGUgdXNlciBqdXN0IG1hZGUuIFRoZVxuICAgICAqIGNvcnJlc3BvbmRpbmcgZW50ZXJJbnNlcnRNb2RlIGNhbGwgd2FzIG1hZGUgd2l0aCBhIGNvdW50LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlcGVhdExhc3RFZGl0KGNtLCB2aW0sIHJlcGVhdCwgcmVwZWF0Rm9ySW5zZXJ0KSB7XG4gICAgICB2YXIgbWFjcm9Nb2RlU3RhdGUgPSB2aW1HbG9iYWxTdGF0ZS5tYWNyb01vZGVTdGF0ZTtcbiAgICAgIG1hY3JvTW9kZVN0YXRlLmlzUGxheWluZyA9IHRydWU7XG4gICAgICB2YXIgaXNBY3Rpb24gPSAhIXZpbS5sYXN0RWRpdEFjdGlvbkNvbW1hbmQ7XG4gICAgICB2YXIgY2FjaGVkSW5wdXRTdGF0ZSA9IHZpbS5pbnB1dFN0YXRlO1xuICAgICAgZnVuY3Rpb24gcmVwZWF0Q29tbWFuZCgpIHtcbiAgICAgICAgaWYgKGlzQWN0aW9uKSB7XG4gICAgICAgICAgY29tbWFuZERpc3BhdGNoZXIucHJvY2Vzc0FjdGlvbihjbSwgdmltLCB2aW0ubGFzdEVkaXRBY3Rpb25Db21tYW5kKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb21tYW5kRGlzcGF0Y2hlci5ldmFsSW5wdXQoY20sIHZpbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIHJlcGVhdEluc2VydChyZXBlYXQpIHtcbiAgICAgICAgaWYgKG1hY3JvTW9kZVN0YXRlLmxhc3RJbnNlcnRNb2RlQ2hhbmdlcy5jaGFuZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAvLyBGb3Igc29tZSByZWFzb24sIHJlcGVhdCBjdyBpbiBkZXNrdG9wIFZJTSBkb2VzIG5vdCByZXBlYXRcbiAgICAgICAgICAvLyBpbnNlcnQgbW9kZSBjaGFuZ2VzLiBXaWxsIGNvbmZvcm0gdG8gdGhhdCBiZWhhdmlvci5cbiAgICAgICAgICByZXBlYXQgPSAhdmltLmxhc3RFZGl0QWN0aW9uQ29tbWFuZCA/IDEgOiByZXBlYXQ7XG4gICAgICAgICAgdmFyIGNoYW5nZU9iamVjdCA9IG1hY3JvTW9kZVN0YXRlLmxhc3RJbnNlcnRNb2RlQ2hhbmdlcztcbiAgICAgICAgICByZXBlYXRJbnNlcnRNb2RlQ2hhbmdlcyhjbSwgY2hhbmdlT2JqZWN0LmNoYW5nZXMsIHJlcGVhdCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZpbS5pbnB1dFN0YXRlID0gdmltLmxhc3RFZGl0SW5wdXRTdGF0ZTtcbiAgICAgIGlmIChpc0FjdGlvbiAmJiB2aW0ubGFzdEVkaXRBY3Rpb25Db21tYW5kLmludGVybGFjZUluc2VydFJlcGVhdCkge1xuICAgICAgICAvLyBvIGFuZCBPIHJlcGVhdCBoYXZlIHRvIGJlIGludGVybGFjZWQgd2l0aCBpbnNlcnQgcmVwZWF0cyBzbyB0aGF0IHRoZVxuICAgICAgICAvLyBpbnNlcnRpb25zIGFwcGVhciBvbiBzZXBhcmF0ZSBsaW5lcyBpbnN0ZWFkIG9mIHRoZSBsYXN0IGxpbmUuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVwZWF0OyBpKyspIHtcbiAgICAgICAgICByZXBlYXRDb21tYW5kKCk7XG4gICAgICAgICAgcmVwZWF0SW5zZXJ0KDEpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIXJlcGVhdEZvckluc2VydCkge1xuICAgICAgICAgIC8vIEhhY2sgdG8gZ2V0IHRoZSBjdXJzb3IgdG8gZW5kIHVwIGF0IHRoZSByaWdodCBwbGFjZS4gSWYgSSBpc1xuICAgICAgICAgIC8vIHJlcGVhdGVkIGluIGluc2VydCBtb2RlIHJlcGVhdCwgY3Vyc29yIHdpbGwgYmUgMSBpbnNlcnRcbiAgICAgICAgICAvLyBjaGFuZ2Ugc2V0IGxlZnQgb2Ygd2hlcmUgaXQgc2hvdWxkIGJlLlxuICAgICAgICAgIHJlcGVhdENvbW1hbmQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXBlYXRJbnNlcnQocmVwZWF0KTtcbiAgICAgIH1cbiAgICAgIHZpbS5pbnB1dFN0YXRlID0gY2FjaGVkSW5wdXRTdGF0ZTtcbiAgICAgIGlmICh2aW0uaW5zZXJ0TW9kZSAmJiAhcmVwZWF0Rm9ySW5zZXJ0KSB7XG4gICAgICAgIC8vIERvbid0IGV4aXQgaW5zZXJ0IG1vZGUgdHdpY2UuIElmIHJlcGVhdEZvckluc2VydCBpcyBzZXQsIHRoZW4gd2VcbiAgICAgICAgLy8gd2VyZSBjYWxsZWQgYnkgYW4gZXhpdEluc2VydE1vZGUgY2FsbCBsb3dlciBvbiB0aGUgc3RhY2suXG4gICAgICAgIGV4aXRJbnNlcnRNb2RlKGNtKTtcbiAgICAgIH1cbiAgICAgIG1hY3JvTW9kZVN0YXRlLmlzUGxheWluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlcGVhdEluc2VydE1vZGVDaGFuZ2VzKGNtLCBjaGFuZ2VzLCByZXBlYXQpIHtcbiAgICAgIGZ1bmN0aW9uIGtleUhhbmRsZXIoYmluZGluZykge1xuICAgICAgICBpZiAodHlwZW9mIGJpbmRpbmcgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBDb2RlTWlycm9yLmNvbW1hbmRzW2JpbmRpbmddKGNtKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBiaW5kaW5nKGNtKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHZhciBoZWFkID0gY20uZ2V0Q3Vyc29yKCdoZWFkJyk7XG4gICAgICB2YXIgdmlzdWFsQmxvY2sgPSB2aW1HbG9iYWxTdGF0ZS5tYWNyb01vZGVTdGF0ZS5sYXN0SW5zZXJ0TW9kZUNoYW5nZXMudmlzdWFsQmxvY2s7XG4gICAgICBpZiAodmlzdWFsQmxvY2spIHtcbiAgICAgICAgLy8gU2V0IHVwIGJsb2NrIHNlbGVjdGlvbiBhZ2FpbiBmb3IgcmVwZWF0aW5nIHRoZSBjaGFuZ2VzLlxuICAgICAgICBzZWxlY3RGb3JJbnNlcnQoY20sIGhlYWQsIHZpc3VhbEJsb2NrICsgMSk7XG4gICAgICAgIHJlcGVhdCA9IGNtLmxpc3RTZWxlY3Rpb25zKCkubGVuZ3RoO1xuICAgICAgICBjbS5zZXRDdXJzb3IoaGVhZCk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlcGVhdDsgaSsrKSB7XG4gICAgICAgIGlmICh2aXN1YWxCbG9jaykge1xuICAgICAgICAgIGNtLnNldEN1cnNvcihvZmZzZXRDdXJzb3IoaGVhZCwgaSwgMCkpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY2hhbmdlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIHZhciBjaGFuZ2UgPSBjaGFuZ2VzW2pdO1xuICAgICAgICAgIGlmIChjaGFuZ2UgaW5zdGFuY2VvZiBJbnNlcnRNb2RlS2V5KSB7XG4gICAgICAgICAgICBDb2RlTWlycm9yLmxvb2t1cEtleShjaGFuZ2Uua2V5TmFtZSwgJ3ZpbS1pbnNlcnQnLCBrZXlIYW5kbGVyKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjaGFuZ2UgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdmFyIGN1ciA9IGNtLmdldEN1cnNvcigpO1xuICAgICAgICAgICAgY20ucmVwbGFjZVJhbmdlKGNoYW5nZSwgY3VyLCBjdXIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgc3RhcnQgPSBjbS5nZXRDdXJzb3IoKTtcbiAgICAgICAgICAgIHZhciBlbmQgPSBvZmZzZXRDdXJzb3Ioc3RhcnQsIDAsIGNoYW5nZVswXS5sZW5ndGgpO1xuICAgICAgICAgICAgY20ucmVwbGFjZVJhbmdlKGNoYW5nZVswXSwgc3RhcnQsIGVuZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodmlzdWFsQmxvY2spIHtcbiAgICAgICAgY20uc2V0Q3Vyc29yKG9mZnNldEN1cnNvcihoZWFkLCAwLCAxKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmVzZXRWaW1HbG9iYWxTdGF0ZSgpO1xuICAgIHJldHVybiB2aW1BcGk7XG4gIH07XG4gIC8vIEluaXRpYWxpemUgVmltIGFuZCBtYWtlIGl0IGF2YWlsYWJsZSBhcyBhbiBBUEkuXG4gIENvZGVNaXJyb3IuVmltID0gVmltKCk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiIn0=