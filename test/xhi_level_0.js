/**
 *    xhi_level_0.js
 *    Node unit test suite for xhi.util.js and xhi.utilb.js
 *
 *    Michael S. Mikowski - mike.mikowski@gmail.com
*/
/*jslint           node   : true, continue : true,
   devel  : true,  indent : 2,    maxerr   : 50,
   newcap : true,  nomen  : true, plusplus : true,
   regexp : true,  sloppy : true, vars     : false,
   white  : true,  todo   : true, unparam  : true
*/
/*global xhi, module, process, window, console */

// ================= BEGIN MODULE SCOPE VARIABLES ===================
'use strict';
//noinspection JSUnusedLocalSymbols
var
  __ns    = 'xhi',
  libDir  = '../js/',
  nuFn    = function () { console.log( __ns + this , arguments ); },
  mockTestObj = {
    deepEqual : nuFn.bind( 'deepEqual' ),
    done      : nuFn.bind( 'done'      ),
    expect    : nuFn.bind( 'expect'    ),
    ok        : nuFn.bind( 'ok'        ),
    test      : nuFn.bind( 'test'      )
  },
  jsdomObj = require( 'jsdom' ),
  docRef   = jsdomObj.jsdom(),
  winRef   = docRef.defaultView,
  jQuery   = require( 'jquery' )( winRef ),

  __NS, nMap, vMap, __Str, __blank, __false,
  __null, __true, __undef, __util, __utilb,
  __n1, __0, __1, __2, __3, __4
  ;

global.window   = winRef;
global.document = docRef;
global.jQuery   = jQuery;
global.$        = jQuery;

global.pcss = require( libDir + 'vendor/pcss-1.3.5.js' ).pcss;
require( libDir + 'vendor/pcss.cfg-1.3.5.js' );

global[ __ns ]  = require( libDir + __ns + '.js' )[ __ns ];
require( libDir + __ns + '.util.js'  );
require( libDir + __ns + '.utilb.js' );

__NS = global[ __ns ];
vMap = __NS._vMap_;
nMap = __NS._nMap_;

__util  = __NS._util_;
__utilb = __NS._utilb_;
__blank = vMap._blank_;
__false = vMap._false_;
__null  = vMap._null_;
__Str   = vMap._String_;
__true  = vMap._true_;
__undef = vMap._undef_;

__n1 = nMap._n1_;
__0  = nMap._0_;
__1  = nMap._1_;
__2  = nMap._2_;
__3  = nMap._3_;
__4  = nMap._4_;
// ================== END MODULE SCOPE VARIABLES ====================

// ==================== BEGIN UTILITY METHODS =======================
// ===================== END UTILITY METHODS ========================

// ================ BEGIN NODEUNIT TEST FUNCTIONS ===================
function setLogLevel ( test_obj ) {
  var
    assert_list = [
      [ ['_warn_'],                   '_warn_' ],
      [ [],                           '_warn_' ],
      [ [ __null ],                   '_warn_' ],
      [ [ __undef ],                  '_warn_' ],
      [ [ '_emerg_' ],               '_emerg_' ],
      [ [ ],                         '_emerg_' ],
      [ [ __null ],                  '_emerg_' ],
      [ [ __undef ],                 '_emerg_' ],
      [ [ 'str', {}, 29 ],           '_emerg_' ],
      [ [ '_crit_', __false ],        '_crit_' ],
      [ [ '_error_', 'betty' ],      '_error_' ],
      [ [ '_warn_', 3e6, 'string' ],  '_warn_' ],
      [ [ 0, 3e6, 'string' ],         '_warn_' ],
      [ [ ],                          '_warn_' ],
      [ [ '_notice_' ],             '_notice_' ],
      [ [ '_info_' ],                 '_info_' ],
      [ [ '_debug_' ],               '_debug_' ],
      [ [ __undef ],                 '_debug_' ],
      [ [ '_error_' ],               '_error_' ],
      [ [ '_wtf_', 'this', 'that' ], '_error_' ],
      [ [ '_info_' ],                 '_info_' ],
      [ [ '_wtf_', 'this', 'that' ],  '_info_' ],
      [ [ '_error_' ],               '_error_' ]
    ],

    assert_count = assert_list.length,
    log_obj      = __util._getLogObj_(),

    idx,        expect_list, arg_list,
    expect_str, solve_str,   msg_str
    ;

  test_obj.expect( assert_count * __2 + __2 );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_list[ idx ];
    arg_list   = expect_list[ __0 ];
    expect_str = expect_list[ __1 ];
    solve_str  = log_obj._setLogLevel_.apply( __undef, arg_list );
    msg_str    = __Str( idx ) + '. arg_list: '
      + JSON.stringify( arg_list ) + '\n solve_str: ' + solve_str
      + '\n expect_str: ' + expect_str;
    test_obj.ok( solve_str === expect_str, msg_str );
    test_obj.ok( log_obj._getLogLevel_() === expect_str, msg_str );
  }
  log_obj._logIt_( 'bodus', '_this_should_default_to_error_' );
  test_obj.ok( log_obj._logIt_( 'bodus' ) === __false, 'no log on 1 arg' );
  test_obj.ok( log_obj._logIt_() === __false, 'no log on 0 arg' );

  test_obj.done();
}

function castJQ ( test_obj ) {
  var
    cast_jq = __util._castJQ_,
    $jq     = global.$('<div/>')
    ;

  test_obj.expect( __4 );

  test_obj.ok( cast_jq( {}         ) === undefined, '0' );
  test_obj.ok( cast_jq( {},  'bob' ) ===     'bob', '1' );
  test_obj.ok( cast_jq( $jq        ) ===       $jq, '2' );
  test_obj.ok( cast_jq( $jq, 'bob' ) ===       $jq, '3' );

  test_obj.done();
}

function castStr ( test_obj ) {
  var
    assert_list = [
      // arg_list, expect_data
      [ [],                         __undef ],
      [ [ __undef ],                __undef ],
      [ [ __null  ],                __undef ],
      [ [ {}  ],                    __undef ],
      [ [ []  ],                    __undef ],
      [ [ __0 ],                        '0' ],
      [ [ 25  ],                       '25' ],
      [ [ __blank,  'bob' ],        __blank ],
      [ [ __undef,  'bob' ],          'bob' ],
      [ [ 5.062e12, 'bob' ], '5062000000000'],
      [ [ /regex/ ],                __undef ],
      [ [ new Date() ],             __undef ]
    ],
    assert_count = assert_list.length,
    test_fn      = __util._castStr_,

    msg_str,  idx,         expect_list,
    arg_list, expect_str,  solve_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_list[ idx ];
    arg_list    = expect_list[ __0 ];
    expect_str  = expect_list[ __1 ];
    solve_str   = test_fn[ vMap._apply_ ]( __undef, arg_list );
    msg_str = __Str( idx ) + '. arg_list: '
      + JSON.stringify( arg_list ) + '\n solve_str: ' + solve_str
      + '\n expect_str: ' + expect_str;
    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function clearMap( test_obj ) {
  //noinspection JSUnusedGlobalSymbols
  var
    proto = { callback_fn : function () { return 1; } },
    complex_obj = Object.create( proto ),
    assert_list = [
      // arg_data, expect_data
      [ __1,        __undef ],
      [ -694567,    __undef ],
      [ __blank,    __undef ],
      [ __null,     __undef ],
      [ __undef,    __undef ],
      [ 5.062e12,   __undef ],
      [ __0,        __undef ],
      [ /regex/,    __undef ],
      [ 'string',   __undef ],
      [ [ 1,2,3 ],  __undef ],
      [ complex_obj, proto  ],
      [ new Date(), __undef ],
      [ [ 'a', { complex : 'array' } ], __undef ],
      [ { a : 'simple', b : 'map' }, {} ],
      [ { a : 'complex', map : { this : 'that' },
        name_list : [ 'tim', 'bob' ] }, {} ]
    ],
    assert_count = assert_list.length,
    test_fn      = __util._clearMap_,

    msg_str,  idx,         expect_list,
    arg_data, expect_data, solve_data
    ;

  complex_obj.this = '1';
  complex_obj.that = '2';

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_list[ idx ];
    arg_data    = expect_list[ __0 ];
    expect_data = expect_list[ __1 ];
    solve_data  = test_fn( arg_data );
    msg_str = __Str( idx ) + '. arg_list: '
      + JSON.stringify( arg_data ) + '\n solve_map: '
      + JSON.stringify( solve_data )
      + '\n expect_map: ' + JSON.stringify( expect_data )
    ;
    test_obj.ok(
      JSON.stringify( solve_data ) === JSON.stringify( expect_data ), msg_str
    );
  }
  test_obj.done();
}

function cloneData( test_obj ) {
  var
    assert_list = [
      __1, -694567, __blank, __0, __null, __undef, 5.062e12,
      'A string',
      /a regex object/,
      [ 'a', 'simple', 'array' ],
      { a : 'simple', b : 'map' },
      [ 'a', { complex : 'array' } ],
      { a : 'complex', name_list : [ 'tim', 'bob' ], map: { this : 'that' } }
    ],
    assert_count = assert_list.length,
    clone_fn     = __util._cloneData_,

    msg_str, idx, assert_data, cloned_data
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    assert_data = assert_list[ idx ];
    cloned_data = clone_fn( assert_data );
    msg_str = __Str( idx ) + '. '
      + JSON.stringify( assert_data ) + ' <<==>> '
      + JSON.stringify( cloned_data );
    test_obj.deepEqual(  assert_data, cloned_data, msg_str );
  }
  test_obj.done();
}

function encodeHtml ( test_obj ) {
  var
    assert_list  = [
      // [ arg_map, expect_str ]
      [ [],            __blank ],
      [ [ __null ],    __blank ],
      [ [ __undef ],   __blank ],
      [ [ 'fred'  ],   'fred'  ],
      [ [1,2,3,4],     '1'     ],
      [ [ "<h1>'Help me!'</h1> she said." ],
        '&#60;h1&#62;&#39;Help me!&#39;&#60;/h1&#62; she said.'
      ],
      [ [ "<h1>'Help me!'</h1> & fast!" ],
        '&#60;h1&#62;&#39;Help me!&#39;&#60;/h1&#62; &#38; fast!'
      ],
      [ [ "<h1>'Help me!'</h1> & fast!", __false ],
        '&#60;h1&#62;&#39;Help me!&#39;&#60;/h1&#62; &#38; fast!'
      ],
      [ [ "<h1>'Help me!'</h1> & fast!", __true ],
        '&#60;h1&#62;&#39;Help me!&#39;&#60;/h1&#62; & fast!'
      ],
      [ [ '<p>"And so began, ...",'
          + " she 'said' with her eyes & mouth...</p>" ],
        '&#60;p&#62;&#34;And so began, ...&#34;,'
        + " she &#39;said&#39; with her eyes &#38; mouth..."
        + '&#60;/p&#62;'
      ],
      [ [ '<p>"And so began, ...",'
      + " she 'said' with her eyes & mouth...</p>", __true ],
        '&#60;p&#62;&#34;And so began, ...&#34;,'
        + " she &#39;said&#39; with her eyes & mouth..."
        + '&#60;/p&#62;'
      ],
      [ [ '& start and end &', __false ], '&#38; start and end &#38;' ],
      [ [ '& start and end &', __true ], '& start and end &' ]
    ],

    assert_count = assert_list.length,
    encode_fn    = __util._encodeHtml_,

    idx, expect_list, arg_list, expect_str, solve_str, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_list[ idx ];
    arg_list    = expect_list[ __0 ];
    expect_str  = expect_list[ __1 ];
    solve_str   = encode_fn[ vMap._apply_ ]( __undef, arg_list );
    msg_str     = __Str( idx ) + '. ' + solve_str + ' === ' + expect_str;
    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function getBasename ( test_obj ) {
  var
    assert_list = [
      // [ arg_list, basename, dirname ]
      [ [], __blank, __blank ],
      [ [ __undef ], __blank, __blank ],
      [ [ __null  ], __blank, __blank ],
      [ [ 'default_delim' ], 'default_delim', __blank ],
      [ [ 'no/slash/word' ], 'word', 'no/slash/' ],
      [ [ '/slash/word'   ], 'word', '/slash/' ],
      [ [ 'no/slash/word', ',' ], 'no/slash/word', __blank ],
      [ [ 'no,slash,word', ',' ], 'word', 'no,slash,' ],
      [ [ ':colon:word:',  ',' ], ':colon:word:', __blank ],
      [ [ ':colon:word:',  ':' ], __blank, ':colon:word:' ],
      [ [ ':colon:word',   ':' ], 'word', ':colon:' ]
    ],
    assert_count = assert_list.length,
    basename_fn  = __util._getBasename_,
    dirname_fn   = __util._getDirname_,

    idx, expect_list, arg_list, expect_basename, expect_dirname,
    msg_str, solve_basename, solve_dirname
    ;

  test_obj.expect( assert_count * __2 );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_list[ idx ];
    arg_list  = expect_list[ __0 ];
    expect_basename = expect_list[ __1 ];
    expect_dirname  = expect_list[ __2 ];

    solve_basename = basename_fn.apply( __undef, arg_list );
    msg_str = __Str( idx ) + '. ' + solve_basename + ' === ' + expect_basename;
    test_obj.ok( solve_basename === expect_basename, msg_str );

    solve_dirname = dirname_fn.apply( __undef, arg_list );
    msg_str = __Str( idx ) + '. ' + solve_dirname + ' === ' + expect_dirname;
    test_obj.ok( solve_dirname === expect_dirname, msg_str );
  }
  test_obj.done();
}

function getStructData ( test_obj ) {
  var
    deep0_map   = { foo : { bar : __1 } },
    deep1_map   = { bing : { bang : 'string' }, list : [ __1, __2 ] },
    deep0_list  = [ 0,1,2,3,{ car : { size : 'lg' } },
      [ 0,1, [ 'kitty', 'cat'] ] ],
    deepest_map  = {},
    deepest_list = [],
    assert_list  = [
      // [ arg_list, expect_data ]
      [ [ __null,  [ 'foo', 'bar' ] ], __undef ],
      [ [ __undef, [ 'foo', 'bar' ] ], __undef ],
      [ [ 'foofy', [ 'foo', 'bar' ] ], __undef ],
      [ [ deep0_list, [ 4, 'car','size' ] ], 'lg' ],
      [ [ deep0_list, [ 4, 'car','smut' ] ],  __undef ],
      [ [ deep0_list, [ 0 ] ], 0 ],
      [ [ deep0_list, [ 5, 2, 0 ] ], 'kitty' ],
      [ [ deep0_list, [ 5, 2, 1 ] ],   'cat' ],
      [ [ deep0_map, [ 'foo', 'chaz_bono' ]  ], __undef ],
      [ [ deep0_map, [ 'foo', 'bar' ] ], __1 ],
      [ [ deep0_map, [ 'foo' ] ], deep0_map.foo ],
      [ [ deep0_map, [] ], deep0_map ],
      [ [ deep1_map, [ 'bing' ] ], deep1_map.bing ],
      [ [ deep1_map, [ 'bing', 'bang' ] ], 'string' ],
      [ [ deep1_map, [ 'list'] ], deep1_map.list  ],
      [ [ deep1_map, [] ], deep1_map ],
      [ [ deep1_map, [ 'list', __1 ] ], __2 ],
      [ [ deepest_map, deepest_list ], __undef ]
    ],
    assert_count = assert_list.length,
    deep_fn      = __util._getStructData_,

    idx,         expect_list, arg_list,
    expect_data, solve_data,  msg_str,
    walk_map,    walk_key
    ;

  // Load up very deep map to test recursion limits
  walk_map = deepest_map;
  for ( idx = __0; idx < 102; idx++ ) {
    walk_key = 'foo' + __Str( idx );
    deepest_list[ vMap._push_ ]( walk_key );

    walk_map[ walk_key ] = {};
    walk_map = walk_map[ walk_key ];
  }

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_list[ idx ];
    arg_list     = expect_list[ __0 ];
    expect_data  = expect_list[ __1 ];
    solve_data = deep_fn.apply( __undef, arg_list );
    msg_str     = __Str( idx ) + '. '
      + __Str( solve_data ) + ' <===> ' + __Str( expect_data );
    test_obj.deepEqual( solve_data, expect_data, msg_str );
  }
  test_obj.done();
}

function getListAttrIdx ( test_obj ) {
  var
    map_list  = [
      { foo : __1, bar : 'string' },
      { foo : __2, bar : 'foofy' },
      __undef,
      { biz : 'cart',  bang: __null },
      { biz : __undef, bang: __null }
    ],
    assert_list  = [
      // [ arg_list, expect_data ]
      [ [ map_list, 'foo', __1 ], __0 ],
      [ [ map_list, 'foo', __2 ], __1 ],
      [ [ map_list, 'foo', __3 ], __n1  ],
      [ [ map_list, 'bar', 'string' ], __0 ],
      [ [ map_list, 'bar', 'foofy' ], __1 ],
      [ [ map_list, 'bar', 'poopy' ], __n1 ],
      [ [ map_list, 'bang', __null ], __3  ],
      [ [ map_list, 'bang', __undef ], __n1 ],
      [ [ map_list, 'biz',  __undef ], __4 ]
    ],

    assert_count = assert_list.length,
    get_idx_fn   = __util._getListAttrIdx_,
    get_map_fn   = __util._getListAttrMap_,
    check_count  = __0,

    idx,          expect_list,  arg_list,
    expect_idx,   msg_str,      solve_idx,

    expect_map,   solve_map
    ;

  test_obj.expect( assert_count * __2 );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_list[ idx ];
    arg_list     = expect_list[ __0 ];
    expect_idx   = expect_list[ __1 ];

    solve_idx = get_idx_fn.apply( __undef, arg_list );
    msg_str    = __Str( check_count ) + '. '
      + __Str( solve_idx ) + ' === ' + __Str( expect_idx );
    test_obj.ok( solve_idx === expect_idx, msg_str );
    check_count++;

    expect_map = map_list[ expect_idx ];
    solve_map  = get_map_fn.apply( __undef, arg_list );
    msg_str    = __Str( check_count ) + '. '
      + JSON.stringify( solve_map ) + ' === '
      + JSON.stringify( expect_map )
    ;
    test_obj.ok( solve_map === expect_map, msg_str );
    check_count++;
  }
  test_obj.done();
}

function getListDiff ( test_obj ) {
  var
    map_01  = { boo: 'bob'   },
    map_02  = { bar: 'frank' },

    list_01 = [ 1, 2, 3, 4 ],
    list_02 = [ 'fred', 1, 2, 3, 4 ],
    list_03 = [ 1, 2, 3, 4, 'fred'],
    list_04 = [ map_01, 1, 2, 3, 4 ],
    list_05 = [ 1, 2, 3, 4, map_01 ],
    list_06 = [ map_01 ],
    list_07 = [ map_02 ],
    list_08 = [ 1,2,3, map_02 ],
    list_09 = [ 1,2,3, map_01 ],
    assert_list  = [
      // [ arg_list, expect_data ]
      [ [ list_01, list_01 ], [] ],
      [ [ list_01, list_02 ], [ 'fred' ] ],
      [ [ list_02, list_03 ], [] ],
      [ [ list_03, list_04 ], [ 'fred', map_01 ] ],
      [ [ list_04, list_05 ], [] ],
      [ [ list_05, list_06 ], [ 1,2,3,4 ] ],
      [ [ list_06, list_07 ], [ map_01, map_02] ],
      [ [ list_07, list_08 ], [ 1,2,3 ] ],
      [ [ list_08, list_09 ], [ map_02, map_01 ] ],
      [ [ list_09, list_09 ], [] ]
    ],

    assert_count = assert_list.length,
    get_diff_fn   = __util._getListDiff_,

    idx, expect_list, arg_list, expect_data, solve_data, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_list[ idx ];
    arg_list     = expect_list[ __0 ];
    expect_data  = expect_list[ __1 ];
    solve_data = get_diff_fn.apply( __undef, arg_list );
    msg_str    = __Str( idx ) + '. '
      + JSON.stringify( solve_data ) + ' <===> '
      + JSON.stringify( expect_data );

    test_obj.deepEqual( solve_data, expect_data, msg_str );
  }
  test_obj.done();
}

function getListValCount ( test_obj ) {
  var
    map_01  = { boo: 'bob'   },
    map_02  = { bar: 'frank' },

    list_01 = [ 1, 2, 1, 4, 'dog' ],
    list_02 = [ 'fred', 1, 2, 3, 4, 'fred' ],
    list_03 = [ __null, __null, 3, map_01, __null, map_01 ],
    assert_list  = [
      // [ arg_list, expect_data ]
      [ [], __0  ],
      [ [ list_01 ], __0 ],
      [ [ list_01, 'cow' ],   __0 ],
      [ [ list_01, __1   ],   __2 ],
      [ [ list_01, 'dog' ],   __1 ],
      [ [ list_02, __undef ], __0 ],
      [ [ list_02, 'fred' ],  __2 ],
      [ [ list_03, __null ],  __3 ],
      [ [ list_03, map_01 ],  __2 ],
      [ [ list_03, map_02 ],  __0 ]
    ],

    assert_count = assert_list.length,
    get_count_fn = __util._getListValCount_,

    idx,          expect_list,   arg_list,
    expect_data,  solve_data,    msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_list[ idx ];
    arg_list     = expect_list[ __0 ];
    expect_data  = expect_list[ __1 ];
    solve_data = get_count_fn.apply( __undef, arg_list );
    msg_str    = __Str( idx ) + '. '
      + JSON.stringify( solve_data ) + ' <===> '
      + JSON.stringify( expect_data );

    test_obj.deepEqual( solve_data, expect_data, msg_str );
  }
  test_obj.done();
}

function getNowMs ( test_obj ) {
  var
    now_ms = __util._getNowMs_(),
    rx     = /^[\d]{13}$/;

  test_obj.expect( __1 );
  test_obj.ok( rx.test( now_ms.toString() ), 'Timestamp has 13 digits');
  test_obj.done();
}

function getNumSign ( test_obj ) {
  var
    assert_list  = [
      // [ arg_list, expect_data ]
      [ [ __0 ],       __1  ],
      [ [ __1 ],       __1  ],
      [ [ __n1],       __n1 ],
      [ [ 25  ],       __1  ],
      [ [ 3.28e24 ],   __1  ],
      [ [ -4562 ],     __n1 ],
      [ [ -0.000001 ], __n1 ],
      [ [ 2e5 - 2e4 ], __1  ],
      [ [ 2e4 - 2e5 ], __n1 ],
      [ [ 'fred'    ], __1  ]
    ],

    assert_count = assert_list.length,
    get_sign_fn   = __util._getNumSign_,

    idx,        expect_list,  arg_list,
    expect_int, solve_int,    msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_list[ idx ];
    arg_list     = expect_list[ __0 ];
    expect_int   = expect_list[ __1 ];

    solve_int = get_sign_fn.apply( __undef, arg_list );
    msg_str    = __Str( idx ) + '. '
      + __Str( solve_int ) + ' === ' + __Str( expect_int );

    test_obj.ok( solve_int === expect_int, msg_str );
  }
  test_obj.done();
}

function getTzCode ( test_obj ) {
  var tz_code = __util._getTzCode_();
  test_obj.expect( __1 );

  test_obj.ok( tz_code.match( /^[A-Z]+$/ ),
    'Code looks good'
  );
  test_obj.done();
}

function getTzOffsetMs ( test_obj ) {
  var
    assert_list  = [
      // [ arg_list, expect_data ]
      [],
      [ __0       ],
      [ __true    ],
      [ __false   ],
      [ __n1      ],
      [ 25        ],
      [ 3.28e24   ],
      [ -4562     ],
      [ -0.000001 ],
      [ 2e5 - 2e4 ],
      [ 2e4 - 2e5 ],
      [ 'fred'    ]
    ],

    assert_count  = assert_list.length,
    get_offset_fn = __util._getTzOffsetMs_,

    idx,        arg_list,
    solve_int,    msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    arg_list  = assert_list[ idx ];

    solve_int = get_offset_fn.apply( __undef, arg_list );
    msg_str    = __Str( idx ) + '. '
      + __Str( solve_int ) + ' === /^\\d\\d*$/';

    test_obj.ok( __Str(solve_int).match( /^\d\d*$/ ), msg_str );
  }
  test_obj.done();
}

function getVarType( test_obj ) {
  var
    // this is a hack to get around jslint warnings
    ob = Boolean, oa = Array, os = String,
    on = Number,  // oo = Object,

    und1 = __undef,
    msg_str,

    bool1 = __true,
    list1 = [ 'a','b','c' ],
    null1 = __null,
    num1  = 25,
    str1  = 'cde',
    obj1  = { length : 12 },

    bool2 = new ob(),
    list2 = new oa(),
    num2  = new on(),
    str2  = new os(),
    d_obj = new Date(),

    get_type_fn = __util._getVarType_;

  test_obj.expect( 12 );

  msg_str = 'Should match expected type';

  test_obj.ok( get_type_fn( und1  ) === '_Undefined_', msg_str );
  test_obj.ok( get_type_fn( null1 ) === '_Null_',      msg_str );
  test_obj.ok( get_type_fn( bool1 ) === '_Boolean_',   msg_str );
  test_obj.ok( get_type_fn( str1  ) === '_String_',    msg_str );
  test_obj.ok( get_type_fn( num1  ) === '_Number_',    msg_str );
  test_obj.ok( get_type_fn( list1 ) === '_Array_',     msg_str );
  test_obj.ok( get_type_fn( obj1  ) === '_Object_',    msg_str );
  test_obj.ok( get_type_fn( bool2 ) === '_Boolean_',   msg_str );
  test_obj.ok( get_type_fn( str2  ) === '_String_',    msg_str );
  test_obj.ok( get_type_fn( num2  ) === '_Number_',    msg_str );
  test_obj.ok( get_type_fn( list2 ) === '_Array_',     msg_str );
  test_obj.ok( get_type_fn( d_obj ) ===  'Date',       msg_str );

  test_obj.done();
}

function makeArgList ( test_obj ) {
  var
    assert_list  = [
      // Single arg var types
      [ __undef  ],
      [ __blank  ],
      [ __null   ],
      [ 'fred'   ],
      [ 3.248e24 ],
      [ { map : 'string' } ],
      [ [ 'a','list','words' ] ],

      // Permutations
      [ __undef, __blank ],
      [ __undef, __null  ],
      [ __undef, 'fred'  ],
      [ __undef, 3.248e24 ],
      [ __undef, { map : 'string' } ],
      [ __undef, [ 'a','list','words' ] ],

      [ __blank, __undef ],
      [ __blank, __null  ],
      [ __blank, 'fred'  ],
      [ __blank, 3.248e24 ],
      [ __blank, { map : 'string' } ],
      [ __blank, [ 'a','list','words' ] ],

      [ __null, __undef  ],
      [ __null, __blank  ],
      [ __null, 'fred'   ],
      [ __null, 3.248e24 ],
      [ __null, { map : 'string' } ],
      [ __null, [ 'a','list','words' ] ],

      [ 'fred', __undef  ],
      [ 'fred', __blank  ],
      [ 'fred', __null   ],
      [ 'fred', 3.248e24  ],
      [ 'fred', { map : 'string' } ],
      [ 'fred', [ 'a','list','words' ] ],

      [ 3.248e24, __undef  ],
      [ 3.248e24, __blank  ],
      [ 3.248e24, __null   ],
      [ 3.248e24, 'fred'   ],
      [ 3.248e24, { map : 'string' } ],
      [ 3.248e24, [ 'a','list','words' ] ],

      [ { map : 'string' }, __undef  ],
      [ { map : 'string' }, __blank  ],
      [ { map : 'string' }, __null   ],
      [ { map : 'string' }, 'fred'   ],
      [ { map : 'string' }, 3.248e24 ],
      [ { map : 'string' }, [ 'a','list','words' ] ],

      [ [ 'a','list','words' ], __undef  ],
      [ [ 'a','list','words' ], __blank  ],
      [ [ 'a','list','words' ], __null   ],
      [ [ 'a','list','words' ], 'fred'   ],
      [ [ 'a','list','words' ], 3.248e24 ],
      [ [ 'a','list','words' ], { map : 'string' } ],

      [ __1 , 'fred' ],
      [ { name: 'fred', list : [1,2,3] }, __undef ],
      [ 3.28e24, { a : 'map'}, [ 'list','of','words'] ],
      [ { param_1 : 'one', param_2 : { a : 'map'} } ]
    ],

    assert_count = assert_list.length,
    get_args_fn  = function () {
      return __util._makeArgList_( arguments );
    },

    idx, expect_list, solve_list, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_list[ idx ];
    solve_list   = get_args_fn.apply( __undef, expect_list );
    msg_str    = __Str( idx ) + '. '
      + JSON.stringify( solve_list ) + ' <===> '
      + JSON.stringify( expect_list );

    test_obj.deepEqual( solve_list, expect_list, msg_str );
  }
  test_obj.done();
}

function makeClockStr ( test_obj ) {
  var
    assert_list  = [
      // [ arg_list, expect_data ]
      [ [ 1473980001000    ], '22:53:21' ],
      [ [ 1473980001000, 1 ], '22:53' ],
      [ [ 1473980001000, 2 ], '22' ],
      [ [ 1474832093000    ], '19:34:53' ],
      [ [ 1474832093000, 1 ], '19:34' ],
      [ [ 1474832093000, 2 ], '19' ]
    ],

    assert_count = assert_list.length,
    make_str_fn   = __util._makeClockStr_,

    idx, expect_list, arg_list, expect_str, solve_str, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_list[ idx ];
    arg_list     = expect_list[ __0 ];
    expect_str   = expect_list[ __1 ];
    solve_str   = make_str_fn.apply( __undef, arg_list );
    msg_str    = __Str( idx ) + '. '
      + __Str( solve_str ) + ' === ' + __Str( expect_str );

    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function makeCommaNumStr ( test_obj ) {
  var
    assert_list  = [
      // [ arg_map, expect_data ]
      [ { _input_num_ :        10 },        '10' ],
      [ { _input_num_ :       100 },       '100' ],
      [ { _input_num_ :      1000 },      '1.0k' ],
      [ { _input_num_ :      1950 },      '1.9k' ],
      [ { _input_num_ :      1951 },      '2.0k' ],
      [ { _input_num_ :      1999 },      '2.0k' ],
      [ { _input_num_ :   1000000 },  '1,000.0k' ],
      [ { _input_num_ :       -10 },       '-10' ],
      [ { _input_num_ :      -100 },      '-100' ],
      [ { _input_num_ :     -1000 },     '-1.0k' ],
      [ { _input_num_ :  -1000000 }, '-1,000.0k' ],

      [ { _round_limit_exp_: 6, _round_unit_exp_ : 6,
        _round_unit_str_ : 'm', _round_dec_count_ : 3,
        _input_num_ : 10 }, '10' ],
      [ { _round_limit_exp_: 6, _round_unit_exp_ : 6,
        _round_unit_str_ : 'm', _round_dec_count_ : 3,
        _input_num_ : 1234000 }, '1.234m' ]
    ],

    assert_count = assert_list.length,
    make_str_fn  = __util._makeCommaNumStr_,

    idx, expect_list, arg_map, expect_str, solve_str, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_list[ idx ];
    arg_map      = expect_list[ __0 ];
    expect_str   = expect_list[ __1 ];

    solve_str   = make_str_fn.apply( __undef, [ arg_map ] );
    msg_str    = __Str( idx ) + '. '
      + __Str( solve_str ) + ' === ' + __Str( expect_str );

    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function makeDateStr( test_obj ) {
  var
    date_obj     = new Date(),
    assert_list  = [
      // [ arg_map, expect_data ]
      [ __null, __blank ],
      [ { foo : '_bar_' }, __blank ],
      [ { _date_ms_ : 1474323404010 }, '2016-09-19' ],
      [ { _date_ms_ : 1474323404020, _do_time_ : __false },
        '2016-09-19' ],
      [ { _date_ms_ : 1474323404498, _do_time_ : __true  },
        '2016-09-19 15:16:44' ],
      [ { _date_ms_ : 1274323404500 }, '2010-05-19' ],
      [ { _date_ms_ : 1274323404999, _do_time_ : __false }, '2010-05-19' ],
      [ { _date_ms_ : 1274323405000, _do_time_ : __true  },
        '2010-05-19 19:43:25' ],
      [ { _date_ms_  : 1374323405099}, '2013-07-20' ],
      [ { _date_obj_ : date_obj },     '2013-07-20' ],
      [ { _date_ms_ : 1374323405099, _do_time_ : __false  }, '2013-07-20' ],
      [ { _date_obj_ : date_obj,     _do_time_ : __false  }, '2013-07-20' ],
      [ { _date_ms_ : 1374323405099, _do_time_ : __true  },
        '2013-07-20 05:30:05'
      ],
      [ { _date_obj_ : date_obj,     _do_time_ : __true  },
        '2013-07-20 05:30:05'
      ]
    ],

    assert_count = assert_list.length,
    make_str_fn   = __util._makeDateStr_,

    idx, expect_list, arg_map, expect_str, solve_str, msg_str
    ;

  date_obj.setTime( 1374323405099 );
  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_list[ idx ];
    arg_map      = expect_list[ __0 ];
    expect_str   = expect_list[ __1 ];

    solve_str   = make_str_fn( arg_map );
    msg_str     = __Str( idx ) + '. '
      + __Str( solve_str ) + ' === ' + __Str( expect_str );

    test_obj.ok( solve_str === expect_str, msg_str );
  }

  test_obj.done();
}

function makeEllipsisStr( test_obj ) {
  var
    str0 = 'Georgey', //7
    str1 = 'Hee haw and the boys', // 20
    str2 = 'Tim knickers and the fem-fatale chicks', // 38
    str3 = '<br>This is by far the longest string. <b>It contains html '
      + 'markup</b> which makes it especially sucky, parse-wise',
    assert_list  = [
      // [ arg_map, expect_str ]
      [ { _input_str_ : __undef }, __blank ],
      [ { _input_str_ : __null  }, __blank ],
      [ { _input_str_ : str1    }, __blank ],
      [ { _input_str_ : str2, _char_limit_int_ : __undef  }, __blank ],
      [ { _input_str_ : __undef, _do_word_break_ : __undef }, __blank ],
      [ { _input_str_ : __null, _do_word_break_ : __false  }, __blank ],
      [ { _input_str_ : str1, _do_word_break_ : __0 }, __blank ],
      [ { _input_str_ : str2, _do_word_break_ : __true,
        _char_limit_int_ : __undef  }, __blank ],
      [ { _input_str_ : str2, _char_limit_int_ : __undef  }, __blank ],
      [ { _input_str_ : str2, _char_limit_int_ : __null  }, __blank ],
      [ { _input_str_ : str2, _char_limit_int_ : __n1  }, __blank ],
      [ { _input_str_ : str2, _char_limit_int_ : __0  }, __blank ],
      [ { _input_str_ : str2, _char_limit_int_ : 'string'  }, __blank ],
      [ { _input_str_ : str0, _char_limit_int_ : 5  }, '...' ],
      [ { _input_str_ : str1, _char_limit_int_ : 5  }, '...' ],
      [ { _input_str_ : str2, _char_limit_int_ : 5  }, '...' ],
      [ { _input_str_ : str3, _char_limit_int_ : 5  }, '...' ],
      [ { _input_str_ : str0, _char_limit_int_ : 10  }, 'Georgey' ],
      [ { _input_str_ : str1, _char_limit_int_ : 10  }, 'Hee ...' ],
      [ { _input_str_ : str2, _char_limit_int_ : 10  }, 'Tim ...' ],
      [ { _input_str_ : str3, _char_limit_int_ : 10  }, 'This ...' ],
      [ { _input_str_ : str0, _char_limit_int_ : 25  }, 'Georgey' ],
      [ { _input_str_ : str1, _char_limit_int_ : 25  },
        'Hee haw and the boys' ],
      [ { _input_str_ : str2, _char_limit_int_ : 25  },
        'Tim knickers and the ...' ],
      [ { _input_str_ : str3, _char_limit_int_ : 25  },
        'This is by far the ...' ],
      [ { _input_str_ : str0, _char_limit_int_ : 40  },
        'Georgey' ],
      [ { _input_str_ : str1, _char_limit_int_ : 40  },
        'Hee haw and the boys' ],
      [ { _input_str_ : str2, _char_limit_int_ : 40  },
        'Tim knickers and the fem-fatale chicks' ],
      [ { _input_str_ : str3, _char_limit_int_ : 40  },
        'This is by far the longest string. ...' ],
      [ { _input_str_ : str3, _char_limit_int_ : 2e2 },
        'This is by far the longest string. It contains html '
        + 'markup which makes it especially sucky, parse-wise'
      ],
      [ { _input_str_ : str0, _do_word_break_ : __false,
        _char_limit_int_ : 5  }, 'Ge...' ],
      [ { _input_str_ : str1, _do_word_break_ : __false,
        _char_limit_int_ : 5  }, 'He...' ],
      [ { _input_str_ : str2, _do_word_break_ : __false,
        _char_limit_int_ : 5  }, 'Ti...' ],
      [ { _input_str_ : str3, _do_word_break_ : __false,
        _char_limit_int_ : 5  }, 'Th...' ],
      [ { _input_str_ : str0, _do_word_break_ : __false,
        _char_limit_int_ : 10  }, 'Georgey' ],
      [ { _input_str_ : str1, _do_word_break_ : __false,
        _char_limit_int_ : 10  }, 'Hee haw...' ],
      [ { _input_str_ : str2, _do_word_break_ : __false,
        _char_limit_int_ : 10  }, 'Tim kni...' ],
      [ { _input_str_ : str3, _do_word_break_ : __false,
        _char_limit_int_ : 10  }, 'This is...' ],
      [ { _input_str_ : str0, _do_word_break_ : __false,
        _char_limit_int_ : 25  }, 'Georgey' ],
      [ { _input_str_ : str1, _do_word_break_ : __false,
        _char_limit_int_ : 25  }, 'Hee haw and the boys' ],
      [ { _input_str_ : str2, _do_word_break_ : __false,
        _char_limit_int_ : 25  }, 'Tim knickers and the f...' ],
      [ { _input_str_ : str3, _do_word_break_ : __false,
        _char_limit_int_ : 25  }, 'This is by far the lon...' ],
      [ { _input_str_ : str0, _do_word_break_ : __false,
        _char_limit_int_ : 40  }, 'Georgey' ],
      [ { _input_str_ : str1, _do_word_break_ : __false,
        _char_limit_int_ : 40  }, 'Hee haw and the boys' ],
      [ { _input_str_ : str2, _do_word_break_ : __false,
        _char_limit_int_ : 40  },
        'Tim knickers and the fem-fatale chicks' ],
      [ { _input_str_ : str3, _do_word_break_ : __false,
        _char_limit_int_ : 40  },
        'This is by far the longest string. It...' ],
      [ { _input_str_ : str3, _do_word_break_ : __false,
        _char_limit_int_ : 2e2 },
        'This is by far the longest string. It contains html '
        + 'markup which makes it especially sucky, parse-wise'
      ]
    ],

    assert_count = assert_list.length,
    make_str_fn   = __util._makeEllipsisStr_,

    idx, expect_list, arg_map, expect_str, solve_str, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_list[ idx ];
    arg_map      = expect_list[ __0 ];
    expect_str   = expect_list[ __1 ];

    solve_str = make_str_fn( arg_map );
    msg_str   = __Str( idx ) + '. '
      + __Str( solve_str ) + ' === ' + __Str( expect_str );
    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function makeErrorObj ( test_obj ) {
  var
    key_list     = [ 'name', 'description', 'data' ],
    default_list = [ __ns + ':error', __blank, __undef ],
    assert_list = [
      // [ arg_list, expect_list ]
      [ [], default_list ],
      [ [ __0 ], default_list ],
      [ [ __undef ], default_list ],
      [ [ __0, __0 ], default_list ],
      [ [ __undef, __undef ], default_list ],
      [ [ __null, __undef ], default_list ],
      [ [ __null, __null ], default_list ],
      [ [ __null, __null, __undef ], default_list ],
      [ [ __null, __0, __undef ], default_list ],
      [ [ __undef, __null, __null ], default_list ],
      [ [ '' ], default_list ],
      [ [ '_bad_data_' ], [ __ns + ':_bad_data_', __blank, __undef ] ],
      [ [ __1 ], [ __ns + ':1', __blank, __undef ] ],
      [ [ '_bad_data_', '_the_list_is_missing_' ],
        [ __ns + ':_bad_data_', '_the_list_is_missing_', __undef ]
      ],
      [ [ '_bad_data_', '_the_list_is_missing_', { is : __true } ],
        [ __ns + ':_bad_data_', '_the_list_is_missing_', { is : __true } ]
      ]
    ],

    key_count    = key_list.length,
    assert_count = assert_list.length,
    make_fn      = __util._makeErrorObj_,
    test_count   = __0,

    idx, expect_list, arg_list, expect_obj, solve_obj,
    idj, expect_key, expect_data, solve_data, msg_str
    ;

  test_obj.expect( assert_count * key_count );

  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_list[ idx ];
    arg_list    = expect_list[ __0 ];
    expect_obj = expect_list[ __1 ];
    solve_obj   = make_fn.apply( __undef, arg_list );

    for ( idj = __0; idj < key_count; idj++ ) {
      expect_key = key_list[ idj ];
      expect_data = expect_obj[ idj ];
      solve_data  = solve_obj[ expect_key ];
      msg_str    = __Str( test_count ) + '. '
        + JSON.stringify( expect_list )
        + expect_key + ': '
        + JSON.stringify( solve_data ) + ' <==> '
        + JSON.stringify( expect_data );
      test_obj.deepEqual( solve_data, expect_data, msg_str );
      test_count++;
    }
  }
  test_obj.done();
}

function makeGuidStr( test_obj ) {
  var
    seen_map     = {},
    assert_count = 100,
    make_str_fn  = __util._makeGuidStr_,
    guid_rx      = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/,
    idx, solve_str;


  test_obj.expect( assert_count * __3 );
  for ( idx = __0; idx < assert_count; idx++ ) {
    solve_str = make_str_fn();
    test_obj.ok( ! seen_map[ solve_str ], solve_str + ' is unique' );
    test_obj.ok( solve_str.length === 36, solve_str + ' is correct length' );
    test_obj.ok( guid_rx.test( solve_str ), solve_str + ' matches regex' );
  }

  test_obj.done();
}
function makeMapUtilObj( test_obj ) {
  var
    map_util_obj = __util._makeMapUtilObj_(),
    arg_list   = [ [ 'cows', 'donkeys', 'sheep' ] ],
    field_list = [ 'moo', 'garaaah', 'bahbah' ],
    clone_list = __util._cloneData_( field_list ),
    map_fn   = function ( field_data, idx, list, arg_list ) {
      var
        name_list  = arg_list[  __0 ],
        field_key  = name_list[ idx ],
        field_str  = String( field_data )
        ;
      if ( field_key ) {
        return [ field_key, field_str ];
      }
    },
    result_map = {}
    ;

  test_obj.expect( 5 );

  field_list.map( map_util_obj._invokeFn_ );
  test_obj.deepEqual( field_list, clone_list );

  map_util_obj._setArgList_(     arg_list );
  map_util_obj._setMapFn_(         map_fn );
  map_util_obj._setResultMap_( result_map );

  test_obj.deepEqual( map_util_obj._getArgList_(),   arg_list,   'check' );
  test_obj.deepEqual( map_util_obj._getMapFn_(),     map_fn,     'check' );
  test_obj.deepEqual( map_util_obj._getResultMap_(), result_map, 'check' );

  field_list.map( map_util_obj._invokeFn_ );
  test_obj.deepEqual( result_map,
    { cows : 'moo', donkeys : 'garaaah', sheep : 'bahbah'}
  );

  test_obj.done();
}

function makeOptionHtml ( test_obj ) {
  var
    assert_list  = [
      // [ arg_map, expect_data ]
      [ __undef,     __blank ],
      [ __null,      __blank ],
      [ -35,         __blank ],
      [ [],          __blank ],
      [ [ 1,2,3,4],  __blank ],
      [ {},          __blank ],
      [ { _val_list_ : [ 1 ] }, '<option value="1">1</option>' ],
      [ { _val_list_ : [ 1 ], _label_map_ : { 1 : 'One' } },
        '<option value="1">One</option>'
      ],
      [ { _val_list_  : [ 'rosey', 'betty' ],
        _label_map_   : { 'rosey' : 'The Rose' },
        _select_list_ : [ 'betty' ]
      },
        '<option value="rosey">The Rose</option>'
        + '<option value="betty" selected="selected">Betty</option>'
      ],
      [ { _val_list_  : [ 'rosey', 'betty', 'debauch',
          { cow: null }, [ 32 ], __undef, 99, 865, -22, __null
         ],
          _label_map_   : { 'debauch' : 'De Bauch Airy' },
          _select_list_ : [ 'debauch', -22 ]
        },
        '<option value="rosey">Rosey</option>'
        + '<option value="betty">Betty</option>'
        + '<option value="debauch" selected="selected">De Bauch Airy</option>'
        + '<option value="99">99</option>'
        + '<option value="865">865</option>'
        + '<option value="-22" selected="selected">-22</option>'
      ]
    ],

    assert_count = assert_list.length,
    make_str_fn  = __util._makeOptionHtml_,

    idx,        expect_list, arg_map,
    expect_str, solve_str,   msg_str
    ;

  test_obj.expect( assert_count );

  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_list[ idx ];
    arg_map     = expect_list[ __0 ];
    expect_str  = expect_list[ __1 ];
    solve_str   = make_str_fn( arg_map );
    msg_str    = __Str( idx ) + '. '
      + __Str( solve_str ) + ' === ' + __Str( expect_str );

    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function makePadNumStr( test_obj ) {
  var
    assert_list  = [
      [ [ __undef       ], __blank ],
      [ [ __undef, __0  ], __blank ],
      [ [ __null,  __n1 ], __blank ],
      [ [ 'frank'       ], __blank ],
      [ [ '   25', __n1 ],    '25' ],
      [ [ '   25', __1  ],    '25' ],
      [ [ '   25', __2  ],    '25' ],
      [ [ '   25', __3  ],   '025' ],
      [ [ '   25', __4  ],  '0025' ],
      [ [ '00025', __n1 ],    '25' ],
      [ [ '00025', __1  ],    '25' ],
      [ [ '00025', __2  ],    '25' ],
      [ [ '00025', __3  ],   '025' ],
      [ [ '00025', __4  ],  '0025' ],
      [ [      25, __n1 ],    '25' ],
      [ [      25, __1  ],    '25' ],
      [ [      25, __2  ],    '25' ],
      [ [      25, __3  ],   '025' ],
      [ [      25, __4  ],  '0025' ],
      [ [ '-025', __n1 ],   '-25'  ],
      [ [ '-025', __1  ],   '-25'  ],
      [ [ '-025', __2  ],   '-25'  ],
      [ [ '-025', __3  ],   '-25'  ],
      [ [ '-025', __4  ],  '-025'  ],
      [ [ '-025',   5  ], '-0025'  ]
    ],
    assert_count = assert_list.length,
    make_str_fn  = __util._makePadNumStr_,

    idx, expect_list, arg_list, expect_str,
    solve_str, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_list[ idx ];
    arg_list    = expect_list[ __0 ];
    expect_str  = expect_list[ __1 ];
    solve_str = make_str_fn.apply( __undef, arg_list );
    msg_str    = __Str( idx ) + '. ' + solve_str + ' === ' + expect_str;
    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function makePctStr ( test_obj ) {
  var
    assert_list  = [
      // [ arg_list, expect_str ]
      [ [ __undef       ], '0%'       ],
      [ [ __undef, __0  ], '0%'       ],
      [ [ __null,  __n1 ], '0%'       ],
      [ [ 'frank'       ], '0%'       ],
      [ [ {},      __n1 ], '0%'       ],
      [ [ [],      __1  ], '0.0%'     ],
      [ [ '00.25', __n1 ], '25%'      ],
      [ [ ' 0.25', __0  ], '25%'      ],
      [ [ '  .25', __1  ], '25.0%'    ],
      [ [ '  .25', __3  ], '25.000%'  ],
      [ [    0.25, __n1 ], '25%'      ],
      [ [    0.25, __0  ], '25%'      ],
      [ [    0.25, __1  ], '25.0%'    ],
      [ [    0.25, __3  ], '25.000%'  ],
      [ [  '-.25', __n1 ], '-25%'     ],
      [ [ '-0.25', __0  ], '-25%'     ],
      [ [ '-0.25', __1  ], '-25.0%'   ],
      [ ['-00.25', __3  ], '-25.000%' ],
      [ [ (1/3),   __0  ], '33%'      ],
      [ [ (2/3),   __0  ], '67%'      ]
    ],
    assert_count = assert_list.length,
    make_str_fn  = __util._makePctStr_,

    idx, expect_list, arg_list, expect_str, solve_str, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_list[ idx ];
    arg_list    = expect_list[ __0 ];
    expect_str  = expect_list[ __1 ];
    solve_str = make_str_fn.apply( __undef, arg_list );
    msg_str    = __Str( idx ) + '. ' + solve_str + ' === ' + expect_str;
    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function makeRadioHtml ( test_obj ) {
  var
    assert_list  = [
      // [ arg_map, expect_data ]
      [ __undef,     __blank ],
      [ __null,      __blank ],
      [ -35,         __blank ],
      [ [],          __blank ],
      [ [ 1,2,3,4],  __blank ],
      [ {},          __blank ],
      [ { _group_name_ : 'fred', _match_str_:1, _val_list_: [1,2,3]},
        '<label>'
        + '<input type="radio" name="fred" value="1" checked="checked"/>'
        + '1</label>'
        + '<label><input type="radio" name="fred" value="2"/>2</label>'
        + '<label><input type="radio" name="fred" value="3"/>3</label>'
      ],
      [ { _group_name_ : 'bs', _match_str_: __null,
          _val_list_: [ [ 'foolish' ], { some: 'map', count: 22 }, __null,
            '6', 'gal', 'pal', __undef ]
          },
        '<label><input type="radio" name="bs" value="6"/>6</label>'
        + '<label><input type="radio" name="bs" value="gal"/>Gal</label>'
        + '<label><input type="radio" name="bs" value="pal"/>Pal</label>'
      ],
      [ { _group_name_ : 'bs', _match_str_: 'gal',
          _val_list_: [ '6', 'gal', 'pal' ],
          _label_map_ : { 6 : 'Six', gal: 'Girl', pal : 'Friend' }
      },
        '<label><input type="radio" name="bs" value="6"/>Six</label>'
        + '<label><input type="radio" name="bs" value="gal" '
          + 'checked="checked"/>Girl</label>'
        + '<label><input type="radio" name="bs" value="pal"/>Friend</label>'
      ]
    ],

    assert_count = assert_list.length,
    make_str_fn  = __util._makeRadioHtml_,

    idx,        expect_list, arg_map,
    expect_str, solve_str,   msg_str
    ;

  test_obj.expect( assert_count );

  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_list[ idx ];
    arg_map     = expect_list[ __0 ];
    expect_str  = expect_list[ __1 ];
    solve_str   = make_str_fn( arg_map );
    msg_str    = __Str( idx ) + '. '
      + __Str( solve_str ) + ' === ' + __Str( expect_str );

    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function makeScrubStr ( test_obj ) {
  var
    assert_list  = [
      // [ arg_list, expect_data ]
      [ [ __undef       ], __blank  ],
      [ [ __undef, __0  ], __blank  ],
      [ [ __null,  __n1 ], __blank  ],
      [ [ [],      __1  ], __blank  ],
      [ [ {}            ], __blank  ],
      [ [ 'hello' ], 'hello' ],
      [ [ '<h1>hello</h1>' ], 'hello' ],
      [ [ '<div>hello</div>' ], 'hello' ],
      [ [ '<div><h1>hello</h1><p>This is lc.</p></div>' ],
          'helloThis is lc.' ],
      [ [ '<div><h1>Hello! </h1><p>This is lc.</p></div>' ],
        'Hello! This is lc.' ],
      [ [ '<ul><li>Fred</li><li>Barney</li><li>Wilma</li><li>Betty</li>' ],
        'FredBarneyWilmaBetty' ],
      [ [ 'hello', __false ], 'hello' ],
      [ [ '<h1>hello</h1>', 'freddy' ], 'hello' ],
      [ [ '<div>hello</div>', 12 ], 'hello' ],
      [ [ '<div><h1>hello</h1><p>This is lc.</p></div>', __undef ],
        'helloThis is lc.' ],
      [ [ '<div><h1>Hello! </h1><p>This is lc.</p></div>', __null ],
        'Hello! This is lc.' ],
      [ [ '<ul><li>Fred</li><li>Barney</li><li>Wilma</li><li>Betty</li>', __0 ],
        'FredBarneyWilmaBetty' ],
      [ [ 'hello', __true ], 'hello' ],
      [ [ '<h1>hello</h1>', 'freddy' ], 'hello' ],
      [ [ '<div>hello</div>', __true ], 'hello' ],
      [ [ '<div><h1>hello</h1><p>This is lc.</p></div>', __1 ],
        'hello This is lc.' ],
      [ [ '<div><h1>Hello!</h1><p>This is lc.</p></div>', __1 ],
        'Hello! This is lc.' ],
      [ [ '<ul><li>Fred</li><li>Barney</li><li>Wilma</li><li>Betty</li></ul>',
        __true ],
        'Fred Barney Wilma Betty' ]
    ],

    assert_count = assert_list.length,
    make_str_fn   = __util._makeScrubStr_,

    idx,        expect_list, arg_list,
    expect_str, solve_str,   msg_str
    ;

  test_obj.expect( assert_count );

  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_list[ idx ];
    arg_list     = expect_list[ __0 ];
    expect_str   = expect_list[ __1 ];
    solve_str   = make_str_fn.apply( __undef, arg_list );
    msg_str    = __Str( idx ) + '. '
      + __Str( solve_str ) + ' === ' + __Str( expect_str );

    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function makeSeenMap ( test_obj ) {
  var
    data_map     = { _foo_ : 'bar', _baz_ : 22 },
    assert_list  = [
      // [ arg_list, expect_data ]
      [ [ [1,2,3,4] ], {1:__true,2:__true,3:__true,4:__true} ],
      [ [ {} ], {} ],
      [ [ 'fred' ], {} ],
      [ [], {} ],
      [ [ __0, __0 ], {} ],
      [ [ [3,2,1], __0 ], {3:__0,2:__0,1:__0} ],
      [ [ ['red','green','blue'] ],
        {red:__true,green:__true,blue:__true} ],
      [ [ ['red','green','blue'], __false ],
        {red:__false,green:__false,blue:__false} ],
      [ [ ['red','green','blue'], __0 ],
        {red:__0,green:__0,blue:__0} ],
      [ [ ['red','green','blue'], data_map ],
        {red:data_map,green:data_map,blue:data_map} ]
    ],
    assert_count = assert_list.length,
    make_map_fn  = __util._makeSeenMap_,

    idx, expect_list, arg_list, expect_map, solve_map, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_list[ idx ];
    arg_list    = expect_list[ __0 ];
    expect_map  = expect_list[ __1 ];
    solve_map   = make_map_fn.apply( __undef, arg_list );
    msg_str     = __Str( idx ) + '. arg_map: '
      + JSON.stringify( arg_list ) + ' solve_map: '
      + JSON.stringify( solve_map )
      + ' expect_map: ' + JSON.stringify( expect_map );
    test_obj.deepEqual( solve_map, expect_map, msg_str );
  }
  test_obj.done();
}

function makeSeriesMap ( test_obj ) {
  var
    start_ms = 1465452840000,
    delta_list = [
      1000,         // 1s
      5000,         // 5s
      20000,        // 20s
      40000,        // 40s
      140000,       // 2.3m
      3540000,      // 5.9m
      7140000,      // 11.9m
      14280000,     // 3.97hr
      28560000,     // 7.93hr
      57440000,     // 15.96hr
      114080000,    // 31.69hr
      231360000,    // 2.68d
      460800000,    // 5.33d
      928000000,    // 10.74d
      1840640000    // 21.30d

      // These need some love to improve larger date-size presentation
      // 3769600000,   // 43.67d
      // 7354419200,   // 85.12d
      // 14708838400   // 170.24d
    ],
    intvl_list = [ 2,3,4,5,6,7,9,11,13,15,17,21 ],
    expect_map_list = [
      // begin 1s expect list
      {"_show_idx_":0,"_unit_count_":2,"_unit_ms_":500,"_unit_name_":"0.5s","_left_ratio_":0.5,"_unit_ratio_":0.5,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:01"]},
      {"_show_idx_":0,"_unit_count_":4,"_unit_ms_":250,"_unit_name_":"0.25s","_left_ratio_":0.25,"_unit_ratio_":0.25,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:00","23:14:01","23:14:01"]},
      {"_show_idx_":0,"_unit_count_":4,"_unit_ms_":250,"_unit_name_":"0.25s","_left_ratio_":0.25,"_unit_ratio_":0.25,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:00","23:14:01","23:14:01"]},
      {"_show_idx_":0,"_unit_count_":4,"_unit_ms_":250,"_unit_name_":"0.25s","_left_ratio_":0.25,"_unit_ratio_":0.25,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:00","23:14:01","23:14:01"]},
      {"_show_idx_":0,"_unit_count_":4,"_unit_ms_":250,"_unit_name_":"0.25s","_left_ratio_":0.25,"_unit_ratio_":0.25,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:00","23:14:01","23:14:01"]},
      {"_show_idx_":0,"_unit_count_":4,"_unit_ms_":250,"_unit_name_":"0.25s","_left_ratio_":0.25,"_unit_ratio_":0.25,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:00","23:14:01","23:14:01"]},
      // these can not be solve with our current config
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,

      // begin 5s expect list
      {"_show_idx_":0,"_unit_count_":2,"_unit_ms_":2500,"_unit_name_":"2.5s","_left_ratio_":0.5,"_unit_ratio_":0.5,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:03"]},
      {"_show_idx_":0,"_unit_count_":2,"_unit_ms_":2500,"_unit_name_":"2.5s","_left_ratio_":0.5,"_unit_ratio_":0.5,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:03"]},
      {"_show_idx_":0,"_unit_count_":5,"_unit_ms_":1000,"_unit_name_":"1s","_left_ratio_":0.2,"_unit_ratio_":0.2,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:01","23:14:02","23:14:03","23:14:04"]},
      {"_show_idx_":0,"_unit_count_":5,"_unit_ms_":1000,"_unit_name_":"1s","_left_ratio_":0.2,"_unit_ratio_":0.2,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:01","23:14:02","23:14:03","23:14:04"]},
      {"_show_idx_":0,"_unit_count_":5,"_unit_ms_":1000,"_unit_name_":"1s","_left_ratio_":0.2,"_unit_ratio_":0.2,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:01","23:14:02","23:14:03","23:14:04"]},
      {"_show_idx_":0,"_unit_count_":5,"_unit_ms_":1000,"_unit_name_":"1s","_left_ratio_":0.2,"_unit_ratio_":0.2,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:01","23:14:02","23:14:03","23:14:04"]},
      {"_show_idx_":0,"_unit_count_":10,"_unit_ms_":500,"_unit_name_":"0.5s","_left_ratio_":0.1,"_unit_ratio_":0.1,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:01","23:14:01","23:14:02","23:14:02","23:14:03","23:14:03","23:14:04","23:14:04","23:14:05","23:14:05"]},
      {"_show_idx_":0,"_unit_count_":10,"_unit_ms_":500,"_unit_name_":"0.5s","_left_ratio_":0.1,"_unit_ratio_":0.1,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:01","23:14:01","23:14:02","23:14:02","23:14:03","23:14:03","23:14:04","23:14:04","23:14:05","23:14:05"]},
      {"_show_idx_":0,"_unit_count_":10,"_unit_ms_":500,"_unit_name_":"0.5s","_left_ratio_":0.1,"_unit_ratio_":0.1,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:01","23:14:01","23:14:02","23:14:02","23:14:03","23:14:03","23:14:04","23:14:04","23:14:05","23:14:05"]},
      {"_show_idx_":0,"_unit_count_":20,"_unit_ms_":250,"_unit_name_":"0.25s","_left_ratio_":0.05,"_unit_ratio_":0.05,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:00","23:14:01","23:14:01","23:14:01","23:14:01","23:14:02","23:14:02","23:14:02","23:14:02","23:14:02","23:14:03","23:14:03","23:14:03","23:14:04","23:14:04","23:14:04","23:14:04","23:14:05","23:14:05"]},
      {"_show_idx_":0,"_unit_count_":20,"_unit_ms_":250,"_unit_name_":"0.25s","_left_ratio_":0.05,"_unit_ratio_":0.05,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:00","23:14:01","23:14:01","23:14:01","23:14:01","23:14:02","23:14:02","23:14:02","23:14:02","23:14:02","23:14:03","23:14:03","23:14:03","23:14:04","23:14:04","23:14:04","23:14:04","23:14:05","23:14:05"]},
      {"_show_idx_":0,"_unit_count_":20,"_unit_ms_":250,"_unit_name_":"0.25s","_left_ratio_":0.05,"_unit_ratio_":0.05,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:00","23:14:01","23:14:01","23:14:01","23:14:01","23:14:02","23:14:02","23:14:02","23:14:02","23:14:02","23:14:03","23:14:03","23:14:03","23:14:04","23:14:04","23:14:04","23:14:04","23:14:05","23:14:05"]},
      // end 5s expect list

      // begin 20s expect list
      {"_show_idx_":0,"_unit_count_":2,"_unit_ms_":10000,"_unit_name_":"10s","_left_ratio_":0.5,"_unit_ratio_":0.5,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:10"]},
      {"_show_idx_":0,"_unit_count_":4,"_unit_ms_":5000,"_unit_name_":"5s","_left_ratio_":0.25,"_unit_ratio_":0.25,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:05","23:14:10","23:14:15"]},
      {"_show_idx_":0,"_unit_count_":4,"_unit_ms_":5000,"_unit_name_":"5s","_left_ratio_":0.25,"_unit_ratio_":0.25,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:05","23:14:10","23:14:15"]},
      {"_show_idx_":0,"_unit_count_":4,"_unit_ms_":5000,"_unit_name_":"5s","_left_ratio_":0.25,"_unit_ratio_":0.25,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:05","23:14:10","23:14:15"]},
      {"_show_idx_":0,"_unit_count_":8,"_unit_ms_":2500,"_unit_name_":"2.5s","_left_ratio_":0.125,"_unit_ratio_":0.125,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:03","23:14:05","23:14:08","23:14:10","23:14:13","23:14:15","23:14:18"]},
      {"_show_idx_":0,"_unit_count_":8,"_unit_ms_":2500,"_unit_name_":"2.5s","_left_ratio_":0.125,"_unit_ratio_":0.125,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:03","23:14:05","23:14:08","23:14:10","23:14:13","23:14:15","23:14:18"]},
      {"_show_idx_":0,"_unit_count_":8,"_unit_ms_":2500,"_unit_name_":"2.5s","_left_ratio_":0.125,"_unit_ratio_":0.125,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:03","23:14:05","23:14:08","23:14:10","23:14:13","23:14:15","23:14:18"]},
      {"_show_idx_":0,"_unit_count_":8,"_unit_ms_":2500,"_unit_name_":"2.5s","_left_ratio_":0.125,"_unit_ratio_":0.125,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:03","23:14:05","23:14:08","23:14:10","23:14:13","23:14:15","23:14:18"]},
      {"_show_idx_":0,"_unit_count_":20,"_unit_ms_":1000,"_unit_name_":"1s","_left_ratio_":0.05,"_unit_ratio_":0.05,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:01","23:14:02","23:14:03","23:14:04","23:14:05","23:14:06","23:14:07","23:14:08","23:14:09","23:14:10","23:14:11","23:14:12","23:14:13","23:14:14","23:14:15","23:14:16","23:14:17","23:14:18","23:14:19"]},
      {"_show_idx_":0,"_unit_count_":20,"_unit_ms_":1000,"_unit_name_":"1s","_left_ratio_":0.05,"_unit_ratio_":0.05,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:01","23:14:02","23:14:03","23:14:04","23:14:05","23:14:06","23:14:07","23:14:08","23:14:09","23:14:10","23:14:11","23:14:12","23:14:13","23:14:14","23:14:15","23:14:16","23:14:17","23:14:18","23:14:19"]},
      {"_show_idx_":0,"_unit_count_":20,"_unit_ms_":1000,"_unit_name_":"1s","_left_ratio_":0.05,"_unit_ratio_":0.05,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:01","23:14:02","23:14:03","23:14:04","23:14:05","23:14:06","23:14:07","23:14:08","23:14:09","23:14:10","23:14:11","23:14:12","23:14:13","23:14:14","23:14:15","23:14:16","23:14:17","23:14:18","23:14:19"]},
      {"_show_idx_":0,"_unit_count_":20,"_unit_ms_":1000,"_unit_name_":"1s","_left_ratio_":0.05,"_unit_ratio_":0.05,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:01","23:14:02","23:14:03","23:14:04","23:14:05","23:14:06","23:14:07","23:14:08","23:14:09","23:14:10","23:14:11","23:14:12","23:14:13","23:14:14","23:14:15","23:14:16","23:14:17","23:14:18","23:14:19"]},
      // end 20s expect list

      // begin 40s expect list
      {"_show_idx_":0,"_unit_count_":3,"_unit_ms_":15000,"_unit_name_":"15s","_left_ratio_":0.375,"_unit_ratio_":0.375,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:15","23:14:30"]},
      {"_show_idx_":0,"_unit_count_":3,"_unit_ms_":15000,"_unit_name_":"15s","_left_ratio_":0.375,"_unit_ratio_":0.375,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:15","23:14:30"]},
      {"_show_idx_":0,"_unit_count_":4,"_unit_ms_":10000,"_unit_name_":"10s","_left_ratio_":0.25,"_unit_ratio_":0.25,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:10","23:14:20","23:14:30"]},
      {"_show_idx_":0,"_unit_count_":4,"_unit_ms_":10000,"_unit_name_":"10s","_left_ratio_":0.25,"_unit_ratio_":0.25,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:10","23:14:20","23:14:30"]},
      {"_show_idx_":0,"_unit_count_":8,"_unit_ms_":5000,"_unit_name_":"5s","_left_ratio_":0.125,"_unit_ratio_":0.125,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:05","23:14:10","23:14:15","23:14:20","23:14:25","23:14:30","23:14:35"]},
      {"_show_idx_":0,"_unit_count_":8,"_unit_ms_":5000,"_unit_name_":"5s","_left_ratio_":0.125,"_unit_ratio_":0.125,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:05","23:14:10","23:14:15","23:14:20","23:14:25","23:14:30","23:14:35"]},
      {"_show_idx_":0,"_unit_count_":8,"_unit_ms_":5000,"_unit_name_":"5s","_left_ratio_":0.125,"_unit_ratio_":0.125,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:05","23:14:10","23:14:15","23:14:20","23:14:25","23:14:30","23:14:35"]},
      {"_show_idx_":0,"_unit_count_":8,"_unit_ms_":5000,"_unit_name_":"5s","_left_ratio_":0.125,"_unit_ratio_":0.125,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:05","23:14:10","23:14:15","23:14:20","23:14:25","23:14:30","23:14:35"]},
      {"_show_idx_":0,"_unit_count_":16,"_unit_ms_":2500,"_unit_name_":"2.5s","_left_ratio_":0.0625,"_unit_ratio_":0.0625,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:03","23:14:05","23:14:08","23:14:10","23:14:13","23:14:15","23:14:18","23:14:20","23:14:23","23:14:25","23:14:28","23:14:30","23:14:33","23:14:35","23:14:38"]},
      {"_show_idx_":0,"_unit_count_":16,"_unit_ms_":2500,"_unit_name_":"2.5s","_left_ratio_":0.0625,"_unit_ratio_":0.0625,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:03","23:14:05","23:14:08","23:14:10","23:14:13","23:14:15","23:14:18","23:14:20","23:14:23","23:14:25","23:14:28","23:14:30","23:14:33","23:14:35","23:14:38"]},
      {"_show_idx_":0,"_unit_count_":16,"_unit_ms_":2500,"_unit_name_":"2.5s","_left_ratio_":0.0625,"_unit_ratio_":0.0625,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:03","23:14:05","23:14:08","23:14:10","23:14:13","23:14:15","23:14:18","23:14:20","23:14:23","23:14:25","23:14:28","23:14:30","23:14:33","23:14:35","23:14:38"]},
      {"_show_idx_":0,"_unit_count_":16,"_unit_ms_":2500,"_unit_name_":"2.5s","_left_ratio_":0.0625,"_unit_ratio_":0.0625,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:03","23:14:05","23:14:08","23:14:10","23:14:13","23:14:15","23:14:18","23:14:20","23:14:23","23:14:25","23:14:28","23:14:30","23:14:33","23:14:35","23:14:38"]},
      // end 40s expect list

      // begin 2.3m expect list
      {"_show_idx_":1,"_unit_count_":2,"_unit_ms_":60000,"_unit_name_":"1m","_left_ratio_":0.42857142857142855,"_unit_ratio_":0.42857142857142855,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:15","23:16"]},
      {"_show_idx_":1,"_unit_count_":2,"_unit_ms_":60000,"_unit_name_":"1m","_left_ratio_":0.42857142857142855,"_unit_ratio_":0.42857142857142855,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:15","23:16"]},
      {"_show_idx_":0,"_unit_count_":5,"_unit_ms_":30000,"_unit_name_":"30s","_left_ratio_":0.21428571428571427,"_unit_ratio_":0.21428571428571427,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:30","23:15:00","23:15:30","23:16:00"]},
      {"_show_idx_":0,"_unit_count_":5,"_unit_ms_":30000,"_unit_name_":"30s","_left_ratio_":0.21428571428571427,"_unit_ratio_":0.21428571428571427,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:30","23:15:00","23:15:30","23:16:00"]},
      {"_show_idx_":0,"_unit_count_":5,"_unit_ms_":30000,"_unit_name_":"30s","_left_ratio_":0.21428571428571427,"_unit_ratio_":0.21428571428571427,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:30","23:15:00","23:15:30","23:16:00"]},
      {"_show_idx_":0,"_unit_count_":9,"_unit_ms_":15000,"_unit_name_":"15s","_left_ratio_":0.10714285714285714,"_unit_ratio_":0.10714285714285714,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:15","23:14:30","23:14:45","23:15:00","23:15:15","23:15:30","23:15:45","23:16:00","23:16:15"]},
      {"_show_idx_":0,"_unit_count_":9,"_unit_ms_":15000,"_unit_name_":"15s","_left_ratio_":0.10714285714285714,"_unit_ratio_":0.10714285714285714,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:15","23:14:30","23:14:45","23:15:00","23:15:15","23:15:30","23:15:45","23:16:00","23:16:15"]},
      {"_show_idx_":0,"_unit_count_":14,"_unit_ms_":10000,"_unit_name_":"10s","_left_ratio_":0.07142857142857142,"_unit_ratio_":0.07142857142857142,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:10","23:14:20","23:14:30","23:14:40","23:14:50","23:15:00","23:15:10","23:15:20","23:15:30","23:15:40","23:15:50","23:16:00","23:16:10","23:16:20"]},
      {"_show_idx_":0,"_unit_count_":14,"_unit_ms_":10000,"_unit_name_":"10s","_left_ratio_":0.07142857142857142,"_unit_ratio_":0.07142857142857142,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:10","23:14:20","23:14:30","23:14:40","23:14:50","23:15:00","23:15:10","23:15:20","23:15:30","23:15:40","23:15:50","23:16:00","23:16:10","23:16:20"]},
      {"_show_idx_":0,"_unit_count_":14,"_unit_ms_":10000,"_unit_name_":"10s","_left_ratio_":0.07142857142857142,"_unit_ratio_":0.07142857142857142,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:10","23:14:20","23:14:30","23:14:40","23:14:50","23:15:00","23:15:10","23:15:20","23:15:30","23:15:40","23:15:50","23:16:00","23:16:10","23:16:20"]},
      {"_show_idx_":0,"_unit_count_":14,"_unit_ms_":10000,"_unit_name_":"10s","_left_ratio_":0.07142857142857142,"_unit_ratio_":0.07142857142857142,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:10","23:14:20","23:14:30","23:14:40","23:14:50","23:15:00","23:15:10","23:15:20","23:15:30","23:15:40","23:15:50","23:16:00","23:16:10","23:16:20"]},
      {"_show_idx_":0,"_unit_count_":28,"_unit_ms_":5000,"_unit_name_":"5s","_left_ratio_":0.03571428571428571,"_unit_ratio_":0.03571428571428571,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":1}],"_time_list_":["23:14:05","23:14:10","23:14:15","23:14:20","23:14:25","23:14:30","23:14:35","23:14:40","23:14:45","23:14:50","23:14:55","23:15:00","23:15:05","23:15:10","23:15:15","23:15:20","23:15:25","23:15:30","23:15:35","23:15:40","23:15:45","23:15:50","23:15:55","23:16:00","23:16:05","23:16:10","23:16:15","23:16:20"]},
      // end 2.3m expect list

      //  begin 5.9m expect list
      {"_show_idx_":1,"_unit_count_":2,"_unit_ms_":1800000,"_unit_name_":"30m","_left_ratio_":0.2711864406779661,"_unit_ratio_":0.5084745762711864,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.7796610169491526},{"_date_str_":"2016-06-08","_width_ratio_":0.22033898305084776}],"_time_list_":["23:30","00:00"]},
      {"_show_idx_":1,"_unit_count_":4,"_unit_ms_":900000,"_unit_name_":"15m","_left_ratio_":0.01694915254237288,"_unit_ratio_":0.2542372881355932,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.7796610169491526},{"_date_str_":"2016-06-08","_width_ratio_":0.22033898305084776}],"_time_list_":["23:15","23:30","23:45","00:00"]},
      {"_show_idx_":1,"_unit_count_":4,"_unit_ms_":900000,"_unit_name_":"15m","_left_ratio_":0.01694915254237288,"_unit_ratio_":0.2542372881355932,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.7796610169491526},{"_date_str_":"2016-06-08","_width_ratio_":0.22033898305084776}],"_time_list_":["23:15","23:30","23:45","00:00"]},
      {"_show_idx_":1,"_unit_count_":6,"_unit_ms_":600000,"_unit_name_":"10m","_left_ratio_":0.1016949152542373,"_unit_ratio_":0.1694915254237288,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.7796610169491526},{"_date_str_":"2016-06-08","_width_ratio_":0.22033898305084776}],"_time_list_":["23:20","23:30","23:40","23:50","00:00","00:10"]},
      {"_show_idx_":1,"_unit_count_":6,"_unit_ms_":600000,"_unit_name_":"10m","_left_ratio_":0.1016949152542373,"_unit_ratio_":0.1694915254237288,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.7796610169491526},{"_date_str_":"2016-06-08","_width_ratio_":0.22033898305084776}],"_time_list_":["23:20","23:30","23:40","23:50","00:00","00:10"]},
      {"_show_idx_":1,"_unit_count_":6,"_unit_ms_":600000,"_unit_name_":"10m","_left_ratio_":0.1016949152542373,"_unit_ratio_":0.1694915254237288,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.7796610169491526},{"_date_str_":"2016-06-08","_width_ratio_":0.22033898305084776}],"_time_list_":["23:20","23:30","23:40","23:50","00:00","00:10"]},
      {"_show_idx_":1,"_unit_count_":12,"_unit_ms_":300000,"_unit_name_":"5m","_left_ratio_":0.01694915254237288,"_unit_ratio_":0.0847457627118644,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.7796610169491526},{"_date_str_":"2016-06-08","_width_ratio_":0.22033898305084776}],"_time_list_":["23:15","23:20","23:25","23:30","23:35","23:40","23:45","23:50","23:55","00:00","00:05","00:10"]},
      {"_show_idx_":1,"_unit_count_":12,"_unit_ms_":300000,"_unit_name_":"5m","_left_ratio_":0.01694915254237288,"_unit_ratio_":0.0847457627118644,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.7796610169491526},{"_date_str_":"2016-06-08","_width_ratio_":0.22033898305084776}],"_time_list_":["23:15","23:20","23:25","23:30","23:35","23:40","23:45","23:50","23:55","00:00","00:05","00:10"]},
      {"_show_idx_":1,"_unit_count_":12,"_unit_ms_":300000,"_unit_name_":"5m","_left_ratio_":0.01694915254237288,"_unit_ratio_":0.0847457627118644,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.7796610169491526},{"_date_str_":"2016-06-08","_width_ratio_":0.22033898305084776}],"_time_list_":["23:15","23:20","23:25","23:30","23:35","23:40","23:45","23:50","23:55","00:00","00:05","00:10"]},
      {"_show_idx_":1,"_unit_count_":12,"_unit_ms_":300000,"_unit_name_":"5m","_left_ratio_":0.01694915254237288,"_unit_ratio_":0.0847457627118644,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.7796610169491526},{"_date_str_":"2016-06-08","_width_ratio_":0.22033898305084776}],"_time_list_":["23:15","23:20","23:25","23:30","23:35","23:40","23:45","23:50","23:55","00:00","00:05","00:10"]},
      {"_show_idx_":1,"_unit_count_":12,"_unit_ms_":300000,"_unit_name_":"5m","_left_ratio_":0.01694915254237288,"_unit_ratio_":0.0847457627118644,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.7796610169491526},{"_date_str_":"2016-06-08","_width_ratio_":0.22033898305084776}],"_time_list_":["23:15","23:20","23:25","23:30","23:35","23:40","23:45","23:50","23:55","00:00","00:05","00:10"]},
      {"_show_idx_":0,"_unit_count_":24,"_unit_ms_":150000,"_unit_name_":"2.5m","_left_ratio_":0.01694915254237288,"_unit_ratio_":0.0423728813559322,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.7796610169491526},{"_date_str_":"2016-06-08","_width_ratio_":0.22033898305084776}],"_time_list_":["23:15:00","23:17:30","23:20:00","23:22:30","23:25:00","23:27:30","23:30:00","23:32:30","23:35:00","23:37:30","23:40:00","23:42:30","23:45:00","23:47:30","23:50:00","23:52:30","23:55:00","23:57:30","00:00:00","00:02:30","00:05:00","00:07:30","00:10:00","00:12:30"]},
      //  end 5.9m expect list

      //  begin 11.9m expect list
      {"_show_idx_":1,"_unit_count_":2,"_unit_ms_":3600000,"_unit_name_":"1hr","_left_ratio_":0.3865546218487395,"_unit_ratio_":0.5042016806722689,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.3865546218487395},{"_date_str_":"2016-06-08","_width_ratio_":0.6134453781512601}],"_time_list_":["00:00","01:00"]},
      {"_show_idx_":1,"_unit_count_":4,"_unit_ms_":1800000,"_unit_name_":"30m","_left_ratio_":0.13445378151260504,"_unit_ratio_":0.25210084033613445,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.3865546218487395},{"_date_str_":"2016-06-08","_width_ratio_":0.6134453781512601}],"_time_list_":["23:30","00:00","00:30","01:00"]},
      {"_show_idx_":1,"_unit_count_":4,"_unit_ms_":1800000,"_unit_name_":"30m","_left_ratio_":0.13445378151260504,"_unit_ratio_":0.25210084033613445,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.3865546218487395},{"_date_str_":"2016-06-08","_width_ratio_":0.6134453781512601}],"_time_list_":["23:30","00:00","00:30","01:00"]},
      {"_show_idx_":1,"_unit_count_":4,"_unit_ms_":1800000,"_unit_name_":"30m","_left_ratio_":0.13445378151260504,"_unit_ratio_":0.25210084033613445,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.3865546218487395},{"_date_str_":"2016-06-08","_width_ratio_":0.6134453781512601}],"_time_list_":["23:30","00:00","00:30","01:00"]},
      {"_show_idx_":1,"_unit_count_":8,"_unit_ms_":900000,"_unit_name_":"15m","_left_ratio_":0.008403361344537815,"_unit_ratio_":0.12605042016806722,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.3865546218487395},{"_date_str_":"2016-06-08","_width_ratio_":0.6134453781512601}],"_time_list_":["23:15","23:30","23:45","00:00","00:15","00:30","00:45","01:00"]},
      {"_show_idx_":1,"_unit_count_":8,"_unit_ms_":900000,"_unit_name_":"15m","_left_ratio_":0.008403361344537815,"_unit_ratio_":0.12605042016806722,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.3865546218487395},{"_date_str_":"2016-06-08","_width_ratio_":0.6134453781512601}],"_time_list_":["23:15","23:30","23:45","00:00","00:15","00:30","00:45","01:00"]},
      {"_show_idx_":1,"_unit_count_":8,"_unit_ms_":900000,"_unit_name_":"15m","_left_ratio_":0.008403361344537815,"_unit_ratio_":0.12605042016806722,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.3865546218487395},{"_date_str_":"2016-06-08","_width_ratio_":0.6134453781512601}],"_time_list_":["23:15","23:30","23:45","00:00","00:15","00:30","00:45","01:00"]},
      {"_show_idx_":1,"_unit_count_":12,"_unit_ms_":600000,"_unit_name_":"10m","_left_ratio_":0.05042016806722689,"_unit_ratio_":0.08403361344537816,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.3865546218487395},{"_date_str_":"2016-06-08","_width_ratio_":0.6134453781512601}],"_time_list_":["23:20","23:30","23:40","23:50","00:00","00:10","00:20","00:30","00:40","00:50","01:00","01:10"]},
      {"_show_idx_":1,"_unit_count_":12,"_unit_ms_":600000,"_unit_name_":"10m","_left_ratio_":0.05042016806722689,"_unit_ratio_":0.08403361344537816,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.3865546218487395},{"_date_str_":"2016-06-08","_width_ratio_":0.6134453781512601}],"_time_list_":["23:20","23:30","23:40","23:50","00:00","00:10","00:20","00:30","00:40","00:50","01:00","01:10"]},
      {"_show_idx_":1,"_unit_count_":12,"_unit_ms_":600000,"_unit_name_":"10m","_left_ratio_":0.05042016806722689,"_unit_ratio_":0.08403361344537816,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.3865546218487395},{"_date_str_":"2016-06-08","_width_ratio_":0.6134453781512601}],"_time_list_":["23:20","23:30","23:40","23:50","00:00","00:10","00:20","00:30","00:40","00:50","01:00","01:10"]},
      {"_show_idx_":1,"_unit_count_":12,"_unit_ms_":600000,"_unit_name_":"10m","_left_ratio_":0.05042016806722689,"_unit_ratio_":0.08403361344537816,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.3865546218487395},{"_date_str_":"2016-06-08","_width_ratio_":0.6134453781512601}],"_time_list_":["23:20","23:30","23:40","23:50","00:00","00:10","00:20","00:30","00:40","00:50","01:00","01:10"]},
      {"_show_idx_":1,"_unit_count_":24,"_unit_ms_":300000,"_unit_name_":"5m","_left_ratio_":0.008403361344537815,"_unit_ratio_":0.04201680672268908,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.3865546218487395},{"_date_str_":"2016-06-08","_width_ratio_":0.6134453781512601}],"_time_list_":["23:15","23:20","23:25","23:30","23:35","23:40","23:45","23:50","23:55","00:00","00:05","00:10","00:15","00:20","00:25","00:30","00:35","00:40","00:45","00:50","00:55","01:00","01:05","01:10"]},
      //  end 11.9m expect list

      //  begin 3.97hr expect list
      {"_show_idx_":1,"_unit_count_":2,"_unit_ms_":7200000,"_unit_name_":"2hr","_left_ratio_":0.19327731092436976,"_unit_ratio_":0.5042016806722689,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.19327731092436976},{"_date_str_":"2016-06-08","_width_ratio_":0.80672268907563}],"_time_list_":["00:00","02:00"]},
      {"_show_idx_":1,"_unit_count_":4,"_unit_ms_":3600000,"_unit_name_":"1hr","_left_ratio_":0.19327731092436976,"_unit_ratio_":0.25210084033613445,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.19327731092436976},{"_date_str_":"2016-06-08","_width_ratio_":0.80672268907563}],"_time_list_":["00:00","01:00","02:00","03:00"]},
      {"_show_idx_":1,"_unit_count_":4,"_unit_ms_":3600000,"_unit_name_":"1hr","_left_ratio_":0.19327731092436976,"_unit_ratio_":0.25210084033613445,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.19327731092436976},{"_date_str_":"2016-06-08","_width_ratio_":0.80672268907563}],"_time_list_":["00:00","01:00","02:00","03:00"]},
      {"_show_idx_":1,"_unit_count_":4,"_unit_ms_":3600000,"_unit_name_":"1hr","_left_ratio_":0.19327731092436976,"_unit_ratio_":0.25210084033613445,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.19327731092436976},{"_date_str_":"2016-06-08","_width_ratio_":0.80672268907563}],"_time_list_":["00:00","01:00","02:00","03:00"]},
      {"_show_idx_":1,"_unit_count_":8,"_unit_ms_":1800000,"_unit_name_":"30m","_left_ratio_":0.06722689075630252,"_unit_ratio_":0.12605042016806722,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.19327731092436976},{"_date_str_":"2016-06-08","_width_ratio_":0.80672268907563}],"_time_list_":["23:30","00:00","00:30","01:00","01:30","02:00","02:30","03:00"]},
      {"_show_idx_":1,"_unit_count_":8,"_unit_ms_":1800000,"_unit_name_":"30m","_left_ratio_":0.06722689075630252,"_unit_ratio_":0.12605042016806722,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.19327731092436976},{"_date_str_":"2016-06-08","_width_ratio_":0.80672268907563}],"_time_list_":["23:30","00:00","00:30","01:00","01:30","02:00","02:30","03:00"]},
      {"_show_idx_":1,"_unit_count_":8,"_unit_ms_":1800000,"_unit_name_":"30m","_left_ratio_":0.06722689075630252,"_unit_ratio_":0.12605042016806722,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.19327731092436976},{"_date_str_":"2016-06-08","_width_ratio_":0.80672268907563}],"_time_list_":["23:30","00:00","00:30","01:00","01:30","02:00","02:30","03:00"]},
      {"_show_idx_":1,"_unit_count_":8,"_unit_ms_":1800000,"_unit_name_":"30m","_left_ratio_":0.06722689075630252,"_unit_ratio_":0.12605042016806722,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.19327731092436976},{"_date_str_":"2016-06-08","_width_ratio_":0.80672268907563}],"_time_list_":["23:30","00:00","00:30","01:00","01:30","02:00","02:30","03:00"]},
      {"_show_idx_":1,"_unit_count_":16,"_unit_ms_":900000,"_unit_name_":"15m","_left_ratio_":0.004201680672268907,"_unit_ratio_":0.06302521008403361,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.19327731092436976},{"_date_str_":"2016-06-08","_width_ratio_":0.80672268907563}],"_time_list_":["23:15","23:30","23:45","00:00","00:15","00:30","00:45","01:00","01:15","01:30","01:45","02:00","02:15","02:30","02:45","03:00"]},
      {"_show_idx_":1,"_unit_count_":16,"_unit_ms_":900000,"_unit_name_":"15m","_left_ratio_":0.004201680672268907,"_unit_ratio_":0.06302521008403361,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.19327731092436976},{"_date_str_":"2016-06-08","_width_ratio_":0.80672268907563}],"_time_list_":["23:15","23:30","23:45","00:00","00:15","00:30","00:45","01:00","01:15","01:30","01:45","02:00","02:15","02:30","02:45","03:00"]},
      {"_show_idx_":1,"_unit_count_":16,"_unit_ms_":900000,"_unit_name_":"15m","_left_ratio_":0.004201680672268907,"_unit_ratio_":0.06302521008403361,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.19327731092436976},{"_date_str_":"2016-06-08","_width_ratio_":0.80672268907563}],"_time_list_":["23:15","23:30","23:45","00:00","00:15","00:30","00:45","01:00","01:15","01:30","01:45","02:00","02:15","02:30","02:45","03:00"]},
      {"_show_idx_":1,"_unit_count_":24,"_unit_ms_":600000,"_unit_name_":"10m","_left_ratio_":0.025210084033613446,"_unit_ratio_":0.04201680672268908,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.19327731092436976},{"_date_str_":"2016-06-08","_width_ratio_":0.80672268907563}],"_time_list_":["23:20","23:30","23:40","23:50","00:00","00:10","00:20","00:30","00:40","00:50","01:00","01:10","01:20","01:30","01:40","01:50","02:00","02:10","02:20","02:30","02:40","02:50","03:00","03:10"]},
      //  end 3.97hr expect list

      //  begin 7.93hr expect list
      {"_show_idx_":1,"_unit_count_":2,"_unit_ms_":14400000,"_unit_name_":"4hr","_left_ratio_":0.09663865546218488,"_unit_ratio_":0.5042016806722689,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.09663865546218488},{"_date_str_":"2016-06-08","_width_ratio_":0.903361344537815}],"_time_list_":["00:00","04:00"]},
      {"_show_idx_":1,"_unit_count_":4,"_unit_ms_":7200000,"_unit_name_":"2hr","_left_ratio_":0.09663865546218488,"_unit_ratio_":0.25210084033613445,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.09663865546218488},{"_date_str_":"2016-06-08","_width_ratio_":0.903361344537815}],"_time_list_":["00:00","02:00","04:00","06:00"]},
      {"_show_idx_":1,"_unit_count_":4,"_unit_ms_":7200000,"_unit_name_":"2hr","_left_ratio_":0.09663865546218488,"_unit_ratio_":0.25210084033613445,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.09663865546218488},{"_date_str_":"2016-06-08","_width_ratio_":0.903361344537815}],"_time_list_":["00:00","02:00","04:00","06:00"]},
      {"_show_idx_":1,"_unit_count_":4,"_unit_ms_":7200000,"_unit_name_":"2hr","_left_ratio_":0.09663865546218488,"_unit_ratio_":0.25210084033613445,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.09663865546218488},{"_date_str_":"2016-06-08","_width_ratio_":0.903361344537815}],"_time_list_":["00:00","02:00","04:00","06:00"]},
      {"_show_idx_":1,"_unit_count_":8,"_unit_ms_":3600000,"_unit_name_":"1hr","_left_ratio_":0.09663865546218488,"_unit_ratio_":0.12605042016806722,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.09663865546218488},{"_date_str_":"2016-06-08","_width_ratio_":0.903361344537815}],"_time_list_":["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00"]},
      {"_show_idx_":1,"_unit_count_":8,"_unit_ms_":3600000,"_unit_name_":"1hr","_left_ratio_":0.09663865546218488,"_unit_ratio_":0.12605042016806722,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.09663865546218488},{"_date_str_":"2016-06-08","_width_ratio_":0.903361344537815}],"_time_list_":["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00"]},
      {"_show_idx_":1,"_unit_count_":8,"_unit_ms_":3600000,"_unit_name_":"1hr","_left_ratio_":0.09663865546218488,"_unit_ratio_":0.12605042016806722,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.09663865546218488},{"_date_str_":"2016-06-08","_width_ratio_":0.903361344537815}],"_time_list_":["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00"]},
      {"_show_idx_":1,"_unit_count_":8,"_unit_ms_":3600000,"_unit_name_":"1hr","_left_ratio_":0.09663865546218488,"_unit_ratio_":0.12605042016806722,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.09663865546218488},{"_date_str_":"2016-06-08","_width_ratio_":0.903361344537815}],"_time_list_":["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00"]},
      {"_show_idx_":1,"_unit_count_":16,"_unit_ms_":1800000,"_unit_name_":"30m","_left_ratio_":0.03361344537815126,"_unit_ratio_":0.06302521008403361,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.09663865546218488},{"_date_str_":"2016-06-08","_width_ratio_":0.903361344537815}],"_time_list_":["23:30","00:00","00:30","01:00","01:30","02:00","02:30","03:00","03:30","04:00","04:30","05:00","05:30","06:00","06:30","07:00"]},
      {"_show_idx_":1,"_unit_count_":16,"_unit_ms_":1800000,"_unit_name_":"30m","_left_ratio_":0.03361344537815126,"_unit_ratio_":0.06302521008403361,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.09663865546218488},{"_date_str_":"2016-06-08","_width_ratio_":0.903361344537815}],"_time_list_":["23:30","00:00","00:30","01:00","01:30","02:00","02:30","03:00","03:30","04:00","04:30","05:00","05:30","06:00","06:30","07:00"]},
      {"_show_idx_":1,"_unit_count_":16,"_unit_ms_":1800000,"_unit_name_":"30m","_left_ratio_":0.03361344537815126,"_unit_ratio_":0.06302521008403361,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.09663865546218488},{"_date_str_":"2016-06-08","_width_ratio_":0.903361344537815}],"_time_list_":["23:30","00:00","00:30","01:00","01:30","02:00","02:30","03:00","03:30","04:00","04:30","05:00","05:30","06:00","06:30","07:00"]},
      {"_show_idx_":1,"_unit_count_":16,"_unit_ms_":1800000,"_unit_name_":"30m","_left_ratio_":0.03361344537815126,"_unit_ratio_":0.06302521008403361,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.09663865546218488},{"_date_str_":"2016-06-08","_width_ratio_":0.903361344537815}],"_time_list_":["23:30","00:00","00:30","01:00","01:30","02:00","02:30","03:00","03:30","04:00","04:30","05:00","05:30","06:00","06:30","07:00"]},
      //  end 7.93hr expect list

      //  begin 15.96hr expect list
      {"_show_idx_":1,"_unit_count_":2,"_unit_ms_":28800000,"_unit_name_":"8hr","_left_ratio_":0.04805013927576602,"_unit_ratio_":0.5013927576601671,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.04805013927576602},{"_date_str_":"2016-06-08","_width_ratio_":0.951949860724234}],"_time_list_":["00:00","08:00"]},
      {"_show_idx_":1,"_unit_count_":3,"_unit_ms_":21600000,"_unit_name_":"6hr","_left_ratio_":0.04805013927576602,"_unit_ratio_":0.37604456824512533,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.04805013927576602},{"_date_str_":"2016-06-08","_width_ratio_":0.951949860724234}],"_time_list_":["00:00","06:00","12:00"]},
      {"_show_idx_":1,"_unit_count_":4,"_unit_ms_":14400000,"_unit_name_":"4hr","_left_ratio_":0.04805013927576602,"_unit_ratio_":0.25069637883008355,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.04805013927576602},{"_date_str_":"2016-06-08","_width_ratio_":0.951949860724234}],"_time_list_":["00:00","04:00","08:00","12:00"]},
      {"_show_idx_":1,"_unit_count_":4,"_unit_ms_":14400000,"_unit_name_":"4hr","_left_ratio_":0.04805013927576602,"_unit_ratio_":0.25069637883008355,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.04805013927576602},{"_date_str_":"2016-06-08","_width_ratio_":0.951949860724234}],"_time_list_":["00:00","04:00","08:00","12:00"]},
      {"_show_idx_":1,"_unit_count_":8,"_unit_ms_":7200000,"_unit_name_":"2hr","_left_ratio_":0.04805013927576602,"_unit_ratio_":0.12534818941504178,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.04805013927576602},{"_date_str_":"2016-06-08","_width_ratio_":0.951949860724234}],"_time_list_":["00:00","02:00","04:00","06:00","08:00","10:00","12:00","14:00"]},
      {"_show_idx_":1,"_unit_count_":8,"_unit_ms_":7200000,"_unit_name_":"2hr","_left_ratio_":0.04805013927576602,"_unit_ratio_":0.12534818941504178,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.04805013927576602},{"_date_str_":"2016-06-08","_width_ratio_":0.951949860724234}],"_time_list_":["00:00","02:00","04:00","06:00","08:00","10:00","12:00","14:00"]},
      {"_show_idx_":1,"_unit_count_":8,"_unit_ms_":7200000,"_unit_name_":"2hr","_left_ratio_":0.04805013927576602,"_unit_ratio_":0.12534818941504178,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.04805013927576602},{"_date_str_":"2016-06-08","_width_ratio_":0.951949860724234}],"_time_list_":["00:00","02:00","04:00","06:00","08:00","10:00","12:00","14:00"]},
      {"_show_idx_":1,"_unit_count_":8,"_unit_ms_":7200000,"_unit_name_":"2hr","_left_ratio_":0.04805013927576602,"_unit_ratio_":0.12534818941504178,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.04805013927576602},{"_date_str_":"2016-06-08","_width_ratio_":0.951949860724234}],"_time_list_":["00:00","02:00","04:00","06:00","08:00","10:00","12:00","14:00"]},
      {"_show_idx_":1,"_unit_count_":16,"_unit_ms_":3600000,"_unit_name_":"1hr","_left_ratio_":0.04805013927576602,"_unit_ratio_":0.06267409470752089,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.04805013927576602},{"_date_str_":"2016-06-08","_width_ratio_":0.951949860724234}],"_time_list_":["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00"]},
      {"_show_idx_":1,"_unit_count_":16,"_unit_ms_":3600000,"_unit_name_":"1hr","_left_ratio_":0.04805013927576602,"_unit_ratio_":0.06267409470752089,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.04805013927576602},{"_date_str_":"2016-06-08","_width_ratio_":0.951949860724234}],"_time_list_":["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00"]},
      {"_show_idx_":1,"_unit_count_":16,"_unit_ms_":3600000,"_unit_name_":"1hr","_left_ratio_":0.04805013927576602,"_unit_ratio_":0.06267409470752089,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.04805013927576602},{"_date_str_":"2016-06-08","_width_ratio_":0.951949860724234}],"_time_list_":["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00"]},
      {"_show_idx_":1,"_unit_count_":16,"_unit_ms_":3600000,"_unit_name_":"1hr","_left_ratio_":0.04805013927576602,"_unit_ratio_":0.06267409470752089,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.04805013927576602},{"_date_str_":"2016-06-08","_width_ratio_":0.951949860724234}],"_time_list_":["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00"]},
      //  end 15.96hr expect list

      //  begin 31.69hr expect list
      {"_show_idx_":2,"_unit_count_":3,"_unit_ms_":43200000,"_unit_name_":"12hr","_left_ratio_":0.024193548387096774,"_unit_ratio_":0.37868162692847124,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.024193548387096774},{"_date_str_":"2016-06-08","_width_ratio_":0.7573632538569425},{"_date_str_":"2016-06-09","_width_ratio_":0.21844319775596077}],"_time_list_":["00","12","00"]},
      {"_show_idx_":2,"_unit_count_":3,"_unit_ms_":43200000,"_unit_name_":"12hr","_left_ratio_":0.024193548387096774,"_unit_ratio_":0.37868162692847124,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.024193548387096774},{"_date_str_":"2016-06-08","_width_ratio_":0.7573632538569425},{"_date_str_":"2016-06-09","_width_ratio_":0.21844319775596077}],"_time_list_":["00","12","00"]},
      {"_show_idx_":1,"_unit_count_":4,"_unit_ms_":28800000,"_unit_name_":"8hr","_left_ratio_":0.024193548387096774,"_unit_ratio_":0.25245441795231416,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.024193548387096774},{"_date_str_":"2016-06-08","_width_ratio_":0.7573632538569425},{"_date_str_":"2016-06-09","_width_ratio_":0.21844319775596077}],"_time_list_":["00:00","08:00","16:00","00:00"]},
      {"_show_idx_":1,"_unit_count_":5,"_unit_ms_":21600000,"_unit_name_":"6hr","_left_ratio_":0.024193548387096774,"_unit_ratio_":0.18934081346423562,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.024193548387096774},{"_date_str_":"2016-06-08","_width_ratio_":0.7573632538569425},{"_date_str_":"2016-06-09","_width_ratio_":0.21844319775596077}],"_time_list_":["00:00","06:00","12:00","18:00","00:00","06:00"]},
      {"_show_idx_":1,"_unit_count_":5,"_unit_ms_":21600000,"_unit_name_":"6hr","_left_ratio_":0.024193548387096774,"_unit_ratio_":0.18934081346423562,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.024193548387096774},{"_date_str_":"2016-06-08","_width_ratio_":0.7573632538569425},{"_date_str_":"2016-06-09","_width_ratio_":0.21844319775596077}],"_time_list_":["00:00","06:00","12:00","18:00","00:00","06:00"]},
      {"_show_idx_":1,"_unit_count_":8,"_unit_ms_":14400000,"_unit_name_":"4hr","_left_ratio_":0.024193548387096774,"_unit_ratio_":0.12622720897615708,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.024193548387096774},{"_date_str_":"2016-06-08","_width_ratio_":0.7573632538569425},{"_date_str_":"2016-06-09","_width_ratio_":0.21844319775596077}],"_time_list_":["00:00","04:00","08:00","12:00","16:00","20:00","00:00","04:00"]},
      {"_show_idx_":1,"_unit_count_":8,"_unit_ms_":14400000,"_unit_name_":"4hr","_left_ratio_":0.024193548387096774,"_unit_ratio_":0.12622720897615708,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.024193548387096774},{"_date_str_":"2016-06-08","_width_ratio_":0.7573632538569425},{"_date_str_":"2016-06-09","_width_ratio_":0.21844319775596077}],"_time_list_":["00:00","04:00","08:00","12:00","16:00","20:00","00:00","04:00"]},
      {"_show_idx_":1,"_unit_count_":8,"_unit_ms_":14400000,"_unit_name_":"4hr","_left_ratio_":0.024193548387096774,"_unit_ratio_":0.12622720897615708,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.024193548387096774},{"_date_str_":"2016-06-08","_width_ratio_":0.7573632538569425},{"_date_str_":"2016-06-09","_width_ratio_":0.21844319775596077}],"_time_list_":["00:00","04:00","08:00","12:00","16:00","20:00","00:00","04:00"]},
      {"_show_idx_":1,"_unit_count_":16,"_unit_ms_":7200000,"_unit_name_":"2hr","_left_ratio_":0.024193548387096774,"_unit_ratio_":0.06311360448807854,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.024193548387096774},{"_date_str_":"2016-06-08","_width_ratio_":0.7573632538569425},{"_date_str_":"2016-06-09","_width_ratio_":0.21844319775596077}],"_time_list_":["00:00","02:00","04:00","06:00","08:00","10:00","12:00","14:00","16:00","18:00","20:00","22:00","00:00","02:00","04:00","06:00"]},
      {"_show_idx_":1,"_unit_count_":16,"_unit_ms_":7200000,"_unit_name_":"2hr","_left_ratio_":0.024193548387096774,"_unit_ratio_":0.06311360448807854,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.024193548387096774},{"_date_str_":"2016-06-08","_width_ratio_":0.7573632538569425},{"_date_str_":"2016-06-09","_width_ratio_":0.21844319775596077}],"_time_list_":["00:00","02:00","04:00","06:00","08:00","10:00","12:00","14:00","16:00","18:00","20:00","22:00","00:00","02:00","04:00","06:00"]},
      {"_show_idx_":1,"_unit_count_":16,"_unit_ms_":7200000,"_unit_name_":"2hr","_left_ratio_":0.024193548387096774,"_unit_ratio_":0.06311360448807854,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.024193548387096774},{"_date_str_":"2016-06-08","_width_ratio_":0.7573632538569425},{"_date_str_":"2016-06-09","_width_ratio_":0.21844319775596077}],"_time_list_":["00:00","02:00","04:00","06:00","08:00","10:00","12:00","14:00","16:00","18:00","20:00","22:00","00:00","02:00","04:00","06:00"]},
      {"_show_idx_":1,"_unit_count_":16,"_unit_ms_":7200000,"_unit_name_":"2hr","_left_ratio_":0.024193548387096774,"_unit_ratio_":0.06311360448807854,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.024193548387096774},{"_date_str_":"2016-06-08","_width_ratio_":0.7573632538569425},{"_date_str_":"2016-06-09","_width_ratio_":0.21844319775596077}],"_time_list_":["00:00","02:00","04:00","06:00","08:00","10:00","12:00","14:00","16:00","18:00","20:00","22:00","00:00","02:00","04:00","06:00"]},
      //  end 31.69hr expect list

      //  begin 2.68d expect list
      {"_show_idx_":2,"_unit_count_":3,"_unit_ms_":86400000,"_unit_name_":"1d","_left_ratio_":0.011929460580912862,"_unit_ratio_":0.37344398340248963,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.011929460580912862},{"_date_str_":"2016-06-08","_width_ratio_":0.37344398340248963},{"_date_str_":"2016-06-09","_width_ratio_":0.37344398340248963},{"_date_str_":"2016-06-10","_width_ratio_":0.24118257261410792}],"_time_list_":["00","00","00"]},
      {"_show_idx_":2,"_unit_count_":3,"_unit_ms_":86400000,"_unit_name_":"1d","_left_ratio_":0.011929460580912862,"_unit_ratio_":0.37344398340248963,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.011929460580912862},{"_date_str_":"2016-06-08","_width_ratio_":0.37344398340248963},{"_date_str_":"2016-06-09","_width_ratio_":0.37344398340248963},{"_date_str_":"2016-06-10","_width_ratio_":0.24118257261410792}],"_time_list_":["00","00","00"]},
      {"_show_idx_":2,"_unit_count_":5,"_unit_ms_":43200000,"_unit_name_":"12hr","_left_ratio_":0.011929460580912862,"_unit_ratio_":0.18672199170124482,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.011929460580912862},{"_date_str_":"2016-06-08","_width_ratio_":0.37344398340248963},{"_date_str_":"2016-06-09","_width_ratio_":0.37344398340248963},{"_date_str_":"2016-06-10","_width_ratio_":0.24118257261410792}],"_time_list_":["00","12","00","12","00","12"]},
      {"_show_idx_":2,"_unit_count_":5,"_unit_ms_":43200000,"_unit_name_":"12hr","_left_ratio_":0.011929460580912862,"_unit_ratio_":0.18672199170124482,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.011929460580912862},{"_date_str_":"2016-06-08","_width_ratio_":0.37344398340248963},{"_date_str_":"2016-06-09","_width_ratio_":0.37344398340248963},{"_date_str_":"2016-06-10","_width_ratio_":0.24118257261410792}],"_time_list_":["00","12","00","12","00","12"]},
      {"_show_idx_":2,"_unit_count_":5,"_unit_ms_":43200000,"_unit_name_":"12hr","_left_ratio_":0.011929460580912862,"_unit_ratio_":0.18672199170124482,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.011929460580912862},{"_date_str_":"2016-06-08","_width_ratio_":0.37344398340248963},{"_date_str_":"2016-06-09","_width_ratio_":0.37344398340248963},{"_date_str_":"2016-06-10","_width_ratio_":0.24118257261410792}],"_time_list_":["00","12","00","12","00","12"]},
      {"_show_idx_":1,"_unit_count_":8,"_unit_ms_":28800000,"_unit_name_":"8hr","_left_ratio_":0.011929460580912862,"_unit_ratio_":0.12448132780082988,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.011929460580912862},{"_date_str_":"2016-06-08","_width_ratio_":0.37344398340248963},{"_date_str_":"2016-06-09","_width_ratio_":0.37344398340248963},{"_date_str_":"2016-06-10","_width_ratio_":0.24118257261410792}],"_time_list_":["00:00","08:00","16:00","00:00","08:00","16:00","00:00","08:00"]},
      {"_show_idx_":1,"_unit_count_":8,"_unit_ms_":28800000,"_unit_name_":"8hr","_left_ratio_":0.011929460580912862,"_unit_ratio_":0.12448132780082988,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.011929460580912862},{"_date_str_":"2016-06-08","_width_ratio_":0.37344398340248963},{"_date_str_":"2016-06-09","_width_ratio_":0.37344398340248963},{"_date_str_":"2016-06-10","_width_ratio_":0.24118257261410792}],"_time_list_":["00:00","08:00","16:00","00:00","08:00","16:00","00:00","08:00"]},
      {"_show_idx_":1,"_unit_count_":11,"_unit_ms_":21600000,"_unit_name_":"6hr","_left_ratio_":0.011929460580912862,"_unit_ratio_":0.09336099585062241,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.011929460580912862},{"_date_str_":"2016-06-08","_width_ratio_":0.37344398340248963},{"_date_str_":"2016-06-09","_width_ratio_":0.37344398340248963},{"_date_str_":"2016-06-10","_width_ratio_":0.24118257261410792}],"_time_list_":["00:00","06:00","12:00","18:00","00:00","06:00","12:00","18:00","00:00","06:00","12:00"]},
      {"_show_idx_":1,"_unit_count_":11,"_unit_ms_":21600000,"_unit_name_":"6hr","_left_ratio_":0.011929460580912862,"_unit_ratio_":0.09336099585062241,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.011929460580912862},{"_date_str_":"2016-06-08","_width_ratio_":0.37344398340248963},{"_date_str_":"2016-06-09","_width_ratio_":0.37344398340248963},{"_date_str_":"2016-06-10","_width_ratio_":0.24118257261410792}],"_time_list_":["00:00","06:00","12:00","18:00","00:00","06:00","12:00","18:00","00:00","06:00","12:00"]},
      {"_show_idx_":1,"_unit_count_":16,"_unit_ms_":14400000,"_unit_name_":"4hr","_left_ratio_":0.011929460580912862,"_unit_ratio_":0.06224066390041494,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.011929460580912862},{"_date_str_":"2016-06-08","_width_ratio_":0.37344398340248963},{"_date_str_":"2016-06-09","_width_ratio_":0.37344398340248963},{"_date_str_":"2016-06-10","_width_ratio_":0.24118257261410792}],"_time_list_":["00:00","04:00","08:00","12:00","16:00","20:00","00:00","04:00","08:00","12:00","16:00","20:00","00:00","04:00","08:00","12:00"]},
      {"_show_idx_":1,"_unit_count_":16,"_unit_ms_":14400000,"_unit_name_":"4hr","_left_ratio_":0.011929460580912862,"_unit_ratio_":0.06224066390041494,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.011929460580912862},{"_date_str_":"2016-06-08","_width_ratio_":0.37344398340248963},{"_date_str_":"2016-06-09","_width_ratio_":0.37344398340248963},{"_date_str_":"2016-06-10","_width_ratio_":0.24118257261410792}],"_time_list_":["00:00","04:00","08:00","12:00","16:00","20:00","00:00","04:00","08:00","12:00","16:00","20:00","00:00","04:00","08:00","12:00"]},
      {"_show_idx_":1,"_unit_count_":16,"_unit_ms_":14400000,"_unit_name_":"4hr","_left_ratio_":0.011929460580912862,"_unit_ratio_":0.06224066390041494,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.011929460580912862},{"_date_str_":"2016-06-08","_width_ratio_":0.37344398340248963},{"_date_str_":"2016-06-09","_width_ratio_":0.37344398340248963},{"_date_str_":"2016-06-10","_width_ratio_":0.24118257261410792}],"_time_list_":["00:00","04:00","08:00","12:00","16:00","20:00","00:00","04:00","08:00","12:00","16:00","20:00","00:00","04:00","08:00","12:00"]},
      //  end 2.68d expect list

      // begin 5.33d expect list
      {"_show_idx_":2,"_unit_count_":3,"_unit_ms_":172800000,"_unit_name_":"2d","_left_ratio_":0.19348958333333333,"_unit_ratio_":0.375,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.005989583333333334},{"_date_str_":"2016-06-08","_width_ratio_":0.1875},{"_date_str_":"2016-06-09","_width_ratio_":0.1875},{"_date_str_":"2016-06-10","_width_ratio_":0.1875},{"_date_str_":"2016-06-11","_width_ratio_":0.1875},{"_date_str_":"2016-06-12","_width_ratio_":0.1875},{"_date_str_":"2016-06-13","_width_ratio_":0.056510416666666785}],"_time_list_":["00","00","00"]},
      {"_show_idx_":2,"_unit_count_":3,"_unit_ms_":172800000,"_unit_name_":"2d","_left_ratio_":0.19348958333333333,"_unit_ratio_":0.375,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.005989583333333334},{"_date_str_":"2016-06-08","_width_ratio_":0.1875},{"_date_str_":"2016-06-09","_width_ratio_":0.1875},{"_date_str_":"2016-06-10","_width_ratio_":0.1875},{"_date_str_":"2016-06-11","_width_ratio_":0.1875},{"_date_str_":"2016-06-12","_width_ratio_":0.1875},{"_date_str_":"2016-06-13","_width_ratio_":0.056510416666666785}],"_time_list_":["00","00","00"]},
      {"_show_idx_":2,"_unit_count_":5,"_unit_ms_":86400000,"_unit_name_":"1d","_left_ratio_":0.005989583333333334,"_unit_ratio_":0.1875,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.005989583333333334},{"_date_str_":"2016-06-08","_width_ratio_":0.1875},{"_date_str_":"2016-06-09","_width_ratio_":0.1875},{"_date_str_":"2016-06-10","_width_ratio_":0.1875},{"_date_str_":"2016-06-11","_width_ratio_":0.1875},{"_date_str_":"2016-06-12","_width_ratio_":0.1875},{"_date_str_":"2016-06-13","_width_ratio_":0.056510416666666785}],"_time_list_":["00","00","00","00","00","00"]},
      {"_show_idx_":2,"_unit_count_":5,"_unit_ms_":86400000,"_unit_name_":"1d","_left_ratio_":0.005989583333333334,"_unit_ratio_":0.1875,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.005989583333333334},{"_date_str_":"2016-06-08","_width_ratio_":0.1875},{"_date_str_":"2016-06-09","_width_ratio_":0.1875},{"_date_str_":"2016-06-10","_width_ratio_":0.1875},{"_date_str_":"2016-06-11","_width_ratio_":0.1875},{"_date_str_":"2016-06-12","_width_ratio_":0.1875},{"_date_str_":"2016-06-13","_width_ratio_":0.056510416666666785}],"_time_list_":["00","00","00","00","00","00"]},
      {"_show_idx_":2,"_unit_count_":5,"_unit_ms_":86400000,"_unit_name_":"1d","_left_ratio_":0.005989583333333334,"_unit_ratio_":0.1875,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.005989583333333334},{"_date_str_":"2016-06-08","_width_ratio_":0.1875},{"_date_str_":"2016-06-09","_width_ratio_":0.1875},{"_date_str_":"2016-06-10","_width_ratio_":0.1875},{"_date_str_":"2016-06-11","_width_ratio_":0.1875},{"_date_str_":"2016-06-12","_width_ratio_":0.1875},{"_date_str_":"2016-06-13","_width_ratio_":0.056510416666666785}],"_time_list_":["00","00","00","00","00","00"]},
      {"_show_idx_":2,"_unit_count_":5,"_unit_ms_":86400000,"_unit_name_":"1d","_left_ratio_":0.005989583333333334,"_unit_ratio_":0.1875,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.005989583333333334},{"_date_str_":"2016-06-08","_width_ratio_":0.1875},{"_date_str_":"2016-06-09","_width_ratio_":0.1875},{"_date_str_":"2016-06-10","_width_ratio_":0.1875},{"_date_str_":"2016-06-11","_width_ratio_":0.1875},{"_date_str_":"2016-06-12","_width_ratio_":0.1875},{"_date_str_":"2016-06-13","_width_ratio_":0.056510416666666785}],"_time_list_":["00","00","00","00","00","00"]},
      {"_show_idx_":2,"_unit_count_":11,"_unit_ms_":43200000,"_unit_name_":"12hr","_left_ratio_":0.005989583333333334,"_unit_ratio_":0.09375,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.005989583333333334},{"_date_str_":"2016-06-08","_width_ratio_":0.1875},{"_date_str_":"2016-06-09","_width_ratio_":0.1875},{"_date_str_":"2016-06-10","_width_ratio_":0.1875},{"_date_str_":"2016-06-11","_width_ratio_":0.1875},{"_date_str_":"2016-06-12","_width_ratio_":0.1875},{"_date_str_":"2016-06-13","_width_ratio_":0.056510416666666785}],"_time_list_":["00","12","00","12","00","12","00","12","00","12","00"]},
      {"_show_idx_":2,"_unit_count_":11,"_unit_ms_":43200000,"_unit_name_":"12hr","_left_ratio_":0.005989583333333334,"_unit_ratio_":0.09375,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.005989583333333334},{"_date_str_":"2016-06-08","_width_ratio_":0.1875},{"_date_str_":"2016-06-09","_width_ratio_":0.1875},{"_date_str_":"2016-06-10","_width_ratio_":0.1875},{"_date_str_":"2016-06-11","_width_ratio_":0.1875},{"_date_str_":"2016-06-12","_width_ratio_":0.1875},{"_date_str_":"2016-06-13","_width_ratio_":0.056510416666666785}],"_time_list_":["00","12","00","12","00","12","00","12","00","12","00"]},
      {"_show_idx_":2,"_unit_count_":11,"_unit_ms_":43200000,"_unit_name_":"12hr","_left_ratio_":0.005989583333333334,"_unit_ratio_":0.09375,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.005989583333333334},{"_date_str_":"2016-06-08","_width_ratio_":0.1875},{"_date_str_":"2016-06-09","_width_ratio_":0.1875},{"_date_str_":"2016-06-10","_width_ratio_":0.1875},{"_date_str_":"2016-06-11","_width_ratio_":0.1875},{"_date_str_":"2016-06-12","_width_ratio_":0.1875},{"_date_str_":"2016-06-13","_width_ratio_":0.056510416666666785}],"_time_list_":["00","12","00","12","00","12","00","12","00","12","00"]},
      {"_show_idx_":1,"_unit_count_":16,"_unit_ms_":28800000,"_unit_name_":"8hr","_left_ratio_":0.005989583333333334,"_unit_ratio_":0.0625,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.005989583333333334},{"_date_str_":"2016-06-08","_width_ratio_":0.1875},{"_date_str_":"2016-06-09","_width_ratio_":0.1875},{"_date_str_":"2016-06-10","_width_ratio_":0.1875},{"_date_str_":"2016-06-11","_width_ratio_":0.1875},{"_date_str_":"2016-06-12","_width_ratio_":0.1875},{"_date_str_":"2016-06-13","_width_ratio_":0.056510416666666785}],"_time_list_":["00:00","08:00","16:00","00:00","08:00","16:00","00:00","08:00","16:00","00:00","08:00","16:00","00:00","08:00","16:00","00:00"]},
      {"_show_idx_":1,"_unit_count_":16,"_unit_ms_":28800000,"_unit_name_":"8hr","_left_ratio_":0.005989583333333334,"_unit_ratio_":0.0625,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.005989583333333334},{"_date_str_":"2016-06-08","_width_ratio_":0.1875},{"_date_str_":"2016-06-09","_width_ratio_":0.1875},{"_date_str_":"2016-06-10","_width_ratio_":0.1875},{"_date_str_":"2016-06-11","_width_ratio_":0.1875},{"_date_str_":"2016-06-12","_width_ratio_":0.1875},{"_date_str_":"2016-06-13","_width_ratio_":0.056510416666666785}],"_time_list_":["00:00","08:00","16:00","00:00","08:00","16:00","00:00","08:00","16:00","00:00","08:00","16:00","00:00","08:00","16:00","00:00"]},
      {"_show_idx_":1,"_unit_count_":21,"_unit_ms_":21600000,"_unit_name_":"6hr","_left_ratio_":0.005989583333333334,"_unit_ratio_":0.046875,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.005989583333333334},{"_date_str_":"2016-06-08","_width_ratio_":0.1875},{"_date_str_":"2016-06-09","_width_ratio_":0.1875},{"_date_str_":"2016-06-10","_width_ratio_":0.1875},{"_date_str_":"2016-06-11","_width_ratio_":0.1875},{"_date_str_":"2016-06-12","_width_ratio_":0.1875},{"_date_str_":"2016-06-13","_width_ratio_":0.056510416666666785}],"_time_list_":["00:00","06:00","12:00","18:00","00:00","06:00","12:00","18:00","00:00","06:00","12:00","18:00","00:00","06:00","12:00","18:00","00:00","06:00","12:00","18:00","00:00","06:00"]},
      // end 5.33d expect list

      // begin 10.74d expect list
      {"_show_idx_":2,"_unit_count_":2,"_unit_ms_":604800000,"_unit_name_":"1wk","_left_ratio_":0.0029741379310344825,"_unit_ratio_":0.6517241379310345,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.0029741379310344825},{"_date_str_":"2016-06-08","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-09","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-10","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-11","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-12","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-13","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-14","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-15","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-16","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-17","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-18","_width_ratio_":0.06599137931034497}],"_time_list_":["00","00"]},
      {"_show_idx_":2,"_unit_count_":3,"_unit_ms_":345600000,"_unit_name_":"4d","_left_ratio_":0.28228448275862067,"_unit_ratio_":0.3724137931034483,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.0029741379310344825},{"_date_str_":"2016-06-08","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-09","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-10","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-11","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-12","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-13","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-14","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-15","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-16","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-17","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-18","_width_ratio_":0.06599137931034497}],"_time_list_":["00","00"]},
      {"_show_idx_":2,"_unit_count_":5,"_unit_ms_":172800000,"_unit_name_":"2d","_left_ratio_":0.09607758620689655,"_unit_ratio_":0.18620689655172415,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.0029741379310344825},{"_date_str_":"2016-06-08","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-09","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-10","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-11","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-12","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-13","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-14","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-15","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-16","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-17","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-18","_width_ratio_":0.06599137931034497}],"_time_list_":["00","00","00","00","00"]},
      {"_show_idx_":2,"_unit_count_":5,"_unit_ms_":172800000,"_unit_name_":"2d","_left_ratio_":0.09607758620689655,"_unit_ratio_":0.18620689655172415,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.0029741379310344825},{"_date_str_":"2016-06-08","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-09","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-10","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-11","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-12","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-13","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-14","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-15","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-16","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-17","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-18","_width_ratio_":0.06599137931034497}],"_time_list_":["00","00","00","00","00"]},
      {"_show_idx_":2,"_unit_count_":5,"_unit_ms_":172800000,"_unit_name_":"2d","_left_ratio_":0.09607758620689655,"_unit_ratio_":0.18620689655172415,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.0029741379310344825},{"_date_str_":"2016-06-08","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-09","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-10","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-11","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-12","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-13","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-14","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-15","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-16","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-17","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-18","_width_ratio_":0.06599137931034497}],"_time_list_":["00","00","00","00","00"]},
      {"_show_idx_":2,"_unit_count_":5,"_unit_ms_":172800000,"_unit_name_":"2d","_left_ratio_":0.09607758620689655,"_unit_ratio_":0.18620689655172415,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.0029741379310344825},{"_date_str_":"2016-06-08","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-09","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-10","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-11","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-12","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-13","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-14","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-15","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-16","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-17","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-18","_width_ratio_":0.06599137931034497}],"_time_list_":["00","00","00","00","00"]},
      {"_show_idx_":2,"_unit_count_":11,"_unit_ms_":86400000,"_unit_name_":"1d","_left_ratio_":0.0029741379310344825,"_unit_ratio_":0.09310344827586207,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.0029741379310344825},{"_date_str_":"2016-06-08","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-09","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-10","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-11","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-12","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-13","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-14","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-15","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-16","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-17","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-18","_width_ratio_":0.06599137931034497}],"_time_list_":["00","00","00","00","00","00","00","00","00","00","00"]},
      {"_show_idx_":2,"_unit_count_":11,"_unit_ms_":86400000,"_unit_name_":"1d","_left_ratio_":0.0029741379310344825,"_unit_ratio_":0.09310344827586207,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.0029741379310344825},{"_date_str_":"2016-06-08","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-09","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-10","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-11","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-12","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-13","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-14","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-15","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-16","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-17","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-18","_width_ratio_":0.06599137931034497}],"_time_list_":["00","00","00","00","00","00","00","00","00","00","00"]},
      {"_show_idx_":2,"_unit_count_":11,"_unit_ms_":86400000,"_unit_name_":"1d","_left_ratio_":0.0029741379310344825,"_unit_ratio_":0.09310344827586207,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.0029741379310344825},{"_date_str_":"2016-06-08","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-09","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-10","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-11","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-12","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-13","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-14","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-15","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-16","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-17","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-18","_width_ratio_":0.06599137931034497}],"_time_list_":["00","00","00","00","00","00","00","00","00","00","00"]},
      {"_show_idx_":2,"_unit_count_":11,"_unit_ms_":86400000,"_unit_name_":"1d","_left_ratio_":0.0029741379310344825,"_unit_ratio_":0.09310344827586207,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.0029741379310344825},{"_date_str_":"2016-06-08","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-09","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-10","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-11","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-12","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-13","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-14","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-15","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-16","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-17","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-18","_width_ratio_":0.06599137931034497}],"_time_list_":["00","00","00","00","00","00","00","00","00","00","00"]},
      {"_show_idx_":2,"_unit_count_":21,"_unit_ms_":43200000,"_unit_name_":"12hr","_left_ratio_":0.0029741379310344825,"_unit_ratio_":0.04655172413793104,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.0029741379310344825},{"_date_str_":"2016-06-08","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-09","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-10","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-11","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-12","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-13","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-14","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-15","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-16","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-17","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-18","_width_ratio_":0.06599137931034497}],"_time_list_":["00","12","00","12","00","12","00","12","00","12","00","12","00","12","00","12","00","12","00","12","00","12"]},
      {"_show_idx_":2,"_unit_count_":21,"_unit_ms_":43200000,"_unit_name_":"12hr","_left_ratio_":0.0029741379310344825,"_unit_ratio_":0.04655172413793104,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.0029741379310344825},{"_date_str_":"2016-06-08","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-09","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-10","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-11","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-12","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-13","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-14","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-15","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-16","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-17","_width_ratio_":0.09310344827586207},{"_date_str_":"2016-06-18","_width_ratio_":0.06599137931034497}],"_time_list_":["00","12","00","12","00","12","00","12","00","12","00","12","00","12","00","12","00","12","00","12","00","12"]},
      // end 10.74d expect list

      // begin 21.30d expect list
      {"_show_idx_":2,"_unit_count_":3,"_unit_ms_":604800000,"_unit_name_":"1wk","_left_ratio_":0.0014994784422809459,"_unit_ratio_":0.32858136300417246,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.0014994784422809459},{"_date_str_":"2016-06-08","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-09","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-10","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-11","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-12","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-13","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-14","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-15","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-16","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-17","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-18","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-19","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-20","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-21","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-22","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-23","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-24","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-25","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-26","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-27","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-28","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-29","_width_ratio_":0.012756432545201896}],"_time_list_":["00","00","00","00"]},
      {"_show_idx_":2,"_unit_count_":3,"_unit_ms_":604800000,"_unit_name_":"1wk","_left_ratio_":0.0014994784422809459,"_unit_ratio_":0.32858136300417246,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.0014994784422809459},{"_date_str_":"2016-06-08","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-09","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-10","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-11","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-12","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-13","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-14","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-15","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-16","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-17","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-18","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-19","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-20","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-21","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-22","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-23","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-24","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-25","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-26","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-27","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-28","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-29","_width_ratio_":0.012756432545201896}],"_time_list_":["00","00","00","00"]},
      {"_show_idx_":2,"_unit_count_":5,"_unit_ms_":345600000,"_unit_name_":"4d","_left_ratio_":0.14232006258692628,"_unit_ratio_":0.18776077885952713,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.0014994784422809459},{"_date_str_":"2016-06-08","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-09","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-10","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-11","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-12","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-13","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-14","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-15","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-16","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-17","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-18","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-19","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-20","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-21","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-22","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-23","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-24","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-25","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-26","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-27","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-28","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-29","_width_ratio_":0.012756432545201896}],"_time_list_":["00","00","00","00","00"]},
      {"_show_idx_":2,"_unit_count_":5,"_unit_ms_":345600000,"_unit_name_":"4d","_left_ratio_":0.14232006258692628,"_unit_ratio_":0.18776077885952713,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.0014994784422809459},{"_date_str_":"2016-06-08","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-09","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-10","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-11","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-12","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-13","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-14","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-15","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-16","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-17","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-18","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-19","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-20","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-21","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-22","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-23","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-24","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-25","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-26","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-27","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-28","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-29","_width_ratio_":0.012756432545201896}],"_time_list_":["00","00","00","00","00"]},
      {"_show_idx_":2,"_unit_count_":5,"_unit_ms_":345600000,"_unit_name_":"4d","_left_ratio_":0.14232006258692628,"_unit_ratio_":0.18776077885952713,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.0014994784422809459},{"_date_str_":"2016-06-08","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-09","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-10","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-11","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-12","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-13","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-14","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-15","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-16","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-17","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-18","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-19","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-20","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-21","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-22","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-23","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-24","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-25","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-26","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-27","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-28","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-29","_width_ratio_":0.012756432545201896}],"_time_list_":["00","00","00","00","00"]},
      {"_show_idx_":2,"_unit_count_":5,"_unit_ms_":345600000,"_unit_name_":"4d","_left_ratio_":0.14232006258692628,"_unit_ratio_":0.18776077885952713,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.0014994784422809459},{"_date_str_":"2016-06-08","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-09","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-10","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-11","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-12","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-13","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-14","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-15","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-16","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-17","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-18","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-19","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-20","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-21","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-22","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-23","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-24","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-25","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-26","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-27","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-28","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-29","_width_ratio_":0.012756432545201896}],"_time_list_":["00","00","00","00","00"]},
      {"_show_idx_":2,"_unit_count_":11,"_unit_ms_":172800000,"_unit_name_":"2d","_left_ratio_":0.04843967315716272,"_unit_ratio_":0.09388038942976357,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.0014994784422809459},{"_date_str_":"2016-06-08","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-09","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-10","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-11","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-12","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-13","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-14","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-15","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-16","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-17","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-18","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-19","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-20","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-21","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-22","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-23","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-24","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-25","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-26","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-27","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-28","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-29","_width_ratio_":0.012756432545201896}],"_time_list_":["00","00","00","00","00","00","00","00","00","00","00"]},
      {"_show_idx_":2,"_unit_count_":11,"_unit_ms_":172800000,"_unit_name_":"2d","_left_ratio_":0.04843967315716272,"_unit_ratio_":0.09388038942976357,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.0014994784422809459},{"_date_str_":"2016-06-08","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-09","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-10","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-11","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-12","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-13","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-14","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-15","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-16","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-17","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-18","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-19","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-20","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-21","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-22","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-23","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-24","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-25","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-26","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-27","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-28","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-29","_width_ratio_":0.012756432545201896}],"_time_list_":["00","00","00","00","00","00","00","00","00","00","00"]},
      {"_show_idx_":2,"_unit_count_":11,"_unit_ms_":172800000,"_unit_name_":"2d","_left_ratio_":0.04843967315716272,"_unit_ratio_":0.09388038942976357,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.0014994784422809459},{"_date_str_":"2016-06-08","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-09","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-10","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-11","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-12","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-13","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-14","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-15","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-16","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-17","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-18","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-19","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-20","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-21","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-22","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-23","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-24","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-25","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-26","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-27","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-28","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-29","_width_ratio_":0.012756432545201896}],"_time_list_":["00","00","00","00","00","00","00","00","00","00","00"]},
      {"_show_idx_":2,"_unit_count_":21,"_unit_ms_":86400000,"_unit_name_":"1d","_left_ratio_":0.0014994784422809459,"_unit_ratio_":0.04694019471488178,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.0014994784422809459},{"_date_str_":"2016-06-08","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-09","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-10","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-11","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-12","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-13","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-14","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-15","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-16","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-17","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-18","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-19","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-20","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-21","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-22","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-23","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-24","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-25","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-26","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-27","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-28","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-29","_width_ratio_":0.012756432545201896}],"_time_list_":["00","00","00","00","00","00","00","00","00","00","00","00","00","00","00","00","00","00","00","00","00","00"]},
      {"_show_idx_":2,"_unit_count_":21,"_unit_ms_":86400000,"_unit_name_":"1d","_left_ratio_":0.0014994784422809459,"_unit_ratio_":0.04694019471488178,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.0014994784422809459},{"_date_str_":"2016-06-08","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-09","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-10","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-11","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-12","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-13","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-14","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-15","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-16","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-17","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-18","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-19","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-20","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-21","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-22","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-23","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-24","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-25","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-26","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-27","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-28","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-29","_width_ratio_":0.012756432545201896}],"_time_list_":["00","00","00","00","00","00","00","00","00","00","00","00","00","00","00","00","00","00","00","00","00","00"]},
      {"_show_idx_":2,"_unit_count_":21,"_unit_ms_":86400000,"_unit_name_":"1d","_left_ratio_":0.0014994784422809459,"_unit_ratio_":0.04694019471488178,"_date_list_":[{"_date_str_":"2016-06-07","_width_ratio_":0.0014994784422809459},{"_date_str_":"2016-06-08","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-09","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-10","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-11","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-12","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-13","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-14","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-15","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-16","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-17","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-18","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-19","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-20","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-21","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-22","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-23","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-24","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-25","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-26","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-27","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-28","_width_ratio_":0.04694019471488178},{"_date_str_":"2016-06-29","_width_ratio_":0.012756432545201896}],"_time_list_":["00","00","00","00","00","00","00","00","00","00","00","00","00","00","00","00","00","00","00","00","00","00"]}
      // end 21.30d expect list
    ],
    expect_count = __0,
    delta_count  = delta_list.length,
    intvl_count  = intvl_list.length,
    make_map_fn  = __util._makeSeriesMap_,

    delta_idx, delta_ms, intvl_idx, intvl_int,
    arg_map, expect_map, solve_map, msg_str
    ;

  test_obj.expect( delta_count * intvl_count );

  for ( delta_idx = __0; delta_idx < delta_count; delta_idx ++ ) {
    delta_ms = delta_list[ delta_idx ];
    for ( intvl_idx = __0; intvl_idx < intvl_count; intvl_idx ++ ) {
      intvl_int = intvl_list[ intvl_idx ];
      arg_map = {
        _max_ms_       : start_ms + delta_ms,
        _min_ms_       : start_ms,
        _tgt_count_    : intvl_int,
        _tz_offset_ms_ : 25200000
      };
      solve_map  = make_map_fn( arg_map );
      expect_map = expect_map_list[ expect_count ];
      msg_str     = __Str( expect_count ) + '. arg_map: '
        + JSON.stringify( arg_map ) + '\n solve_map: '
        + JSON.stringify( solve_map )
        + '\n expect_map: ' + JSON.stringify( expect_map );
      test_obj.deepEqual( solve_map, expect_map, msg_str );
      expect_count++;
    }
  }
  test_obj.done();
}

function makeStrFromMap( test_obj ) {
  var
    prop01_map = {
      _name_ : 'fred', _state_code_: 'LA', _country_code_ : 'US'
    },
    prop02_map = {
      _first_name_ : 'Wilma', _last_name_ : 'Rubble', _age_num_ : 48,
      _mole_count_ : __0
    },
    prop01_list = Object.keys( prop01_map ),
    prop02_list = Object.keys( prop02_map ),
    prop01a_list = [ '_name_', '_missing_', __undef, __null, {} ],
    prop02a_list = [ {}, __null, __undef, '_first_name_', '_unseen_', '_age_num_' ],
    label01_map = { _name_ : 'Name', _state_code_ : 'State Code',
      _country_code_ : 'Country Code'
    },
    label02_map = { _first_name_ : 'First', _last_name_ : 'Last',
      _age_num_ : 'Age', _mole_count_ : 'Number of moles'
    },

    assert_list  = [
      // [ arg_map, expect_str ]
      [ { _prop_map_ : prop01_map }, __blank ],
      [ { _prop_map_ : prop01_map, _key_list_ : prop01_list }, 'fred LA US' ],
      [ { _prop_map_ : prop01_map, _key_list_ : prop01_list,
        _delim_str_ : ',' }, 'fred,LA,US' ],
      [ { _prop_map_ : prop01_map, _key_list_ : prop01_list,
        _do_label_ : __true, _delim_str_ : ', ' },
        '_name_: fred, _state_code_: LA, _country_code_: US' ],
      [ { _prop_map_ : prop01_map, _key_list_ : prop01_list,
        _delim_str_ : ', ', _label_map_ : label01_map },
        'Name: fred, State Code: LA, Country Code: US'
      ],
      [ { _prop_map_ : prop02_map }, __blank ],
      [ { _prop_map_ : prop02_map, _key_list_ : prop02_list },
        'Wilma Rubble 48 0' ],
      [ { _prop_map_ : prop02_map, _key_list_ : prop02_list,
        _delim_str_ : ',' }, 'Wilma,Rubble,48,0' ],
      [ { _prop_map_ : prop02_map, _key_list_ : prop02_list,
        _do_label_ : __true, _delim_str_ : ', ' },
        '_first_name_: Wilma, _last_name_: Rubble, _age_num_: 48,'
        + ' _mole_count_: 0' ],
      [ { _prop_map_ : prop02_map, _key_list_ : prop02_list,
        _delim_str_ : ', ', _label_map_ : label02_map },
        'First: Wilma, Last: Rubble, Age: 48, Number of moles: 0'
      ],
      [ { _prop_map_ : prop01_map }, __blank ],
      [ { _prop_map_ : prop01_map, _key_list_ : prop01a_list }, 'fred' ],
      [ { _prop_map_ : prop01_map, _key_list_ : prop01a_list,
        _delim_str_ : ',' }, 'fred' ],
      [ { _prop_map_ : prop01_map, _key_list_ : prop01a_list,
        _do_label_ : __true, _delim_str_ : ', ' }, '_name_: fred' ],
      [ { _prop_map_ : prop01_map, _key_list_ : prop01a_list,
        _delim_str_ : ', ', _label_map_ : label01_map }, 'Name: fred'
      ],
      [ { _prop_map_ : prop02_map }, __blank ],
      [ { _prop_map_ : prop02_map, _key_list_ : prop02a_list },
        'Wilma 48' ],
      [ { _prop_map_ : prop02_map, _key_list_ : prop02a_list,
        _do_label_ : __true }, '_first_name_: Wilma _age_num_: 48' ],
      [ { _prop_map_ : prop02_map, _key_list_ : prop02a_list,
        _do_label_ : __true, _delim_str_ : ' | ' },
        '_first_name_: Wilma | _age_num_: 48' ],
      [ { _prop_map_ : prop02_map, _key_list_ : prop02a_list,
        _do_label_ : __true, _delim_str_ : ' | ', _label_map_ : {
          _first_name_ : 'fff' , _age_num_ : 'isss' }
      }, 'fff: Wilma | isss: 48' ],
      [ { _prop_map_ : prop02_map, _key_list_ : prop02a_list,
        _delim_str_ : ' | ', _label_map_ : {
          _first_name_ : 'fff' , _age_num_ : 'isss' }
      }, 'fff: Wilma | isss: 48' ],
      [ { _prop_map_ : prop02_map, _key_list_ : prop02a_list,
        _delim_str_ : ' | ', _label_delim_str_ : ' === ', _label_map_ : {
          _first_name_ : 'fff' , _age_num_ : 'isss' }
      }, 'fff === Wilma | isss === 48' ]
    ],
    assert_count = assert_list.length,
    make_str_fn  = __util._makeStrFromMap_,

    idx, expect_list, arg_map, expect_str, solve_str, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_list[ idx ];
    arg_map     = expect_list[ __0 ];
    expect_str  = expect_list[ __1 ];
    solve_str   = make_str_fn( arg_map );
    msg_str     = __Str( idx ) + '. arg_map: '
      + JSON.stringify( arg_map ) + ' solve_str: >>'
      + solve_str + '<< expect_str: >>' + expect_str + '<<';
    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function makeTmpltStr ( test_obj ) {
  var
    t1_str  = 'some {_test_}',
    t2_str  = 'I told {_name_} some {_thing_._name_}s have {_thing_._part_}s',
    t3_str  = 'I wonder about {_thing_}s',
    t4_str  = '{_thing_} and {_thing_._name_} and {_thing_._part_} '
      + 'and {_thing_._foo_} and {_foo_} and {_foo_._bar_}.',
    assert_list  = [
      // [ arg_map, expect_str ]
      [ [],        __blank ],
      [ __null,    __blank ],
      [ __undef,   __blank ],
      [ 'fred',    __blank ],
      [ [1,2,3,4], __blank ],
      [ {},        __blank ],
      [ { _input_str_ : t1_str }, 'some ' ],
      [ { _input_str_ : t1_str, _lookup_map_ : { _test_ : 'bobby'}},
        'some bobby' ],
      [ { _input_str_ : t1_str, _lookup_map_ : { _test_ : 'Frank'}},
        'some Frank' ],
      [ { _input_str_ : t2_str }, 'I told  some s have s' ],
      [ { _input_str_ : t2_str, _lookup_map_ : { thing: {} } },
        'I told  some s have s' ],
      [ { _input_str_ : t2_str, _lookup_map_ : { _thing_: { _part_ : 'udder'} } },
        'I told  some s have udders' ],
      [ { _input_str_ : t2_str, _lookup_map_ : { _name_ : 'Frank',
        _thing_: { _part_ : 'udder' } } }, 'I told Frank some s have udders' ],
      [ { _input_str_ : t2_str, _lookup_map_ : { _name_ : 'Frank',
        _thing_: { _part_ : 'udder', _name_: 'cow' } } },
        'I told Frank some cows have udders' ],
      [ { _input_str_ : t3_str, _lookup_map_ : { _thing_: {
        _part_ : 'udder', _name_: 'cow' } } }, 'I wonder about s' ],
      [ { _input_str_ : t3_str, _lookup_map_ : { _thing_: 'Big Foot' } },
        'I wonder about Big Foots' ],
      [ { _input_str_ : t4_str }, ' and  and  and  and  and .' ],
      [ { _input_str_ : t4_str, _lookup_map_ : {} }, ' and  and  and  and  and .' ],
      [ { _input_str_ : t4_str, _lookup_map_ : { _thing_ : {} } },
        ' and  and  and  and  and .' ],
      [ { _input_str_ : t4_str, _lookup_map_ : { _thing_ : 'Tommy' } },
        'Tommy and  and  and  and  and .' ],
      [ { _input_str_ : t4_str, _lookup_map_ : { _thing_ : { _name_ : 'testy' }}},
        ' and testy and  and  and  and .' ],
      [ { _input_str_ : t4_str, _lookup_map_ : { _thing_ : { _name_ : 'testy',
        _part_ : 'part' }} }, ' and testy and part and  and  and .' ],
      [ { _input_str_ : t4_str, _lookup_map_ : { _thing_ : { _name_ : 'testy',
        _part_ : 'part' }, _foo_ : 'Bobby' } },
        ' and testy and part and  and Bobby and .' ],
      [ { _input_str_ : t4_str, _lookup_map_ : { _thing_ : { _name_ : 'testy',
        _part_ : 'part' }, _foo_ : { _bar_: 'Bat' } } },
        ' and testy and part and  and  and Bat.' ]
    ],

    assert_count = assert_list.length,
    make_str_fn  = __util._makeTmpltStr_,

    idx, expect_list, arg_map, expect_str, solve_str, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_list[ idx ];
    arg_map     = expect_list[ __0 ];
    expect_str  = expect_list[ __1 ];
    solve_str = make_str_fn( arg_map );
    msg_str    = __Str( idx ) + '. ' + solve_str + ' === ' + expect_str;
    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function makeUcFirstStr ( test_obj ) {
  var
    assert_list  = [
      // [ arg_map, expect_str ]
      [ [],        __blank ],
      [ __null,    __blank ],
      [ __undef,   __blank ],
      [ 'fred',    'Fred'  ],
      [ [1,2,3,4], __blank ],
      [ {},        __blank ],
      [ 'a long sentence.', 'A long sentence.' ],
      [ 'oNE sENTENCE', 'ONE sENTENCE']
    ],

    assert_count = assert_list.length,
    make_str_fn  = __util._makeUcFirstStr_,

    idx, expect_list, arg_map, expect_str, solve_str, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_list[ idx ];
    arg_map     = expect_list[ __0 ];
    expect_str  = expect_list[ __1 ];
    solve_str = make_str_fn( arg_map );
    msg_str    = __Str( idx ) + '. ' + solve_str + ' === ' + expect_str;
    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function mergeMaps ( test_obj ) {
  //noinspection JSUnusedGlobalSymbols
  var
    base0_map = { attr1 : 'val1', attr2 : 'val2' },
    base1_map = { attr3 : 10,     attr4 : 20     },
    base2_map = { fn : function () { console.log( arguments ); } },
    out0_map  = {
      attr1 : 'val1', attr2 : 'val2', attr3 : 10, attr4 : 20
    },
    out1_map  = { attr1 : 'val1', attr2  : 'val2', list : [] },
    out2_map  = { attr3 : 10, attr4 : 20, list : [] },
    out3_map  = { attr1 : 'val1', attr2 : 'val2' },
    out4_map  = { attr1 : 'val1', attr2 : 'val2', attr3 : 10 },

    attr0_list  = [ 'attr3' ],
    assert_list = [
      // [ arg_list, expect_data ]
      [ [],                 {} ],
      [ [ {}],              {} ],
      [ [ __null ],         {} ],
      [ [ __undef ],        {} ],
      [ [ 1,2,3,4 ],        {} ],
      [ [ __0,            __undef ],         {} ],
      [ [ __blank,             {} ],         {} ],
      [ [ base0_map,      __null  ],  base0_map ],
      [ [ base0_map,           {} ],  base0_map ],
      [ [ base0_map,    base1_map ],   out0_map ],
      [ [ base0_map,    base1_map ],   out0_map ],
      [ [ base0_map, { list: [] } ],   out1_map ],
      [ [ base0_map, { list: [] } ],   out1_map ],
      [ [ base1_map, { list: [] } ],   out2_map ],
      [ [ base1_map, { list: [] } ],   out2_map ],
      [ [ base0_map,    base2_map ],   out3_map ],

      // Using a restricted list of key
      [ [ [],[],[] ],          {} ],
      [ [ [],[],__null ],      {} ],
      [ [ __0,'fred',__null ], {} ],
      [ [ base0_map, 'fred',__null ], base0_map ],
      [ [ base0_map,__undef, attr0_list ], base0_map ],
      [ [ base0_map,__undef,'fred' ], base0_map ],
      [ [ base0_map, base1_map, attr0_list ], out4_map ]
    ],

    assert_count  = assert_list.length,
    merge_maps_fn = __util._mergeMaps_,

    idx, expect_list, arg_list,
    expect_map, solve_map, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_list[ idx ];
    arg_list    = __util._cloneData_( expect_list[ __0 ] );
    expect_map  = expect_list[ __1 ];
    solve_map   = merge_maps_fn.apply( __undef, arg_list );
    msg_str = __Str( idx ) + '. arg_list: '
      + JSON.stringify( arg_list ) + '\r solve_map: '
      + JSON.stringify( solve_map )
      + '\r expect_map: ' + JSON.stringify( expect_map );
    test_obj.deepEqual( solve_map, expect_map, msg_str );
  }
  test_obj.done();
}

function pushUniqListVal ( test_obj ) {
  var
    base0_map  = { attr1 : 'val1', attr2 : 'val2' },
    base0_list = [ 'ding', __undef ],
    assert_list  = [
      [ [], [] ],
      [ [ 1, 2, 1, 4, 'dog' ], [ 1,2,4,'dog' ] ],
      [ [ 3, 8, 'dog', 3, 'dog', __null ], [ 3,8,'dog',__null ] ],
      [ [ __true, __true, __0, __false, __true ],
        [ __true, __0, __false ] ],
      [ [ __undef, __true, __0, __null, 'bob' ],
        [ __undef, __true, __0, __null, 'bob' ] ],
      [ [ 'patch', base0_map, __1, base0_map, base0_list, base0_list ],
        [ 'patch', base0_map, __1, base0_list ] ],
      [ [ 'string', 1.23456, -467.88, 0, 'string', 1.23456, -467.88, 0 ],
        [ 'string', 1.23456, -467.88, 0 ]
      ],
      [ [ __null  ], [ __null  ] ],
      [ [ __undef ], [ __undef ] ]
    ],

    assert_count = assert_list.length,
    push_uniq_fn = __util._pushUniqListVal_,

    idx, jdx,     val_list,     val_count,
    expect_list,  expect_data,  solve_list,
    push_val,     msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_list[ idx ];
    val_list     = expect_list[ __0 ];
    expect_data  = expect_list[ __1 ];
    val_count    = val_list.length;
    solve_list   = [];

    for ( jdx = __0; jdx < val_count; jdx++ ) {
      push_val = val_list[ jdx ];
      push_uniq_fn( solve_list, push_val );
    }

    msg_str    = __Str( idx ) + '. '
      + JSON.stringify( solve_list  ) + ' <===> '
      + JSON.stringify( expect_data );

    test_obj.deepEqual( solve_list, expect_data, msg_str );
  }
  test_obj.done();
}

function rmListVal ( test_obj ) {
  var
    base0_map  = { attr1 : 'val1', attr2 : 'val2' },
    base0_list = [ 'ding', __undef ],
    test0_list = [
      'string', 1.23456, -467.88, 0, 'string', 1.23456, -467.88,
      base0_map, base0_list, base0_map, base0_list
    ],
    expect0_list = [
      'string', 1.23456, -467.88, 0, 'string', 1.23456, -467.88,
      base0_list, base0_list
    ],
    expect1_list = [
      'string', 1.23456, -467.88, 0, 'string', 1.23456, -467.88 ],
    expect2_list = [ 1.23456, -467.88, 0, 1.23456, -467.88 ],
    expect3_list = [ 1.23456, -467.88, 1.23456, -467.88 ],
    assert_list  = [
      [ [],          __undef, __0 ],
      [ [ __undef ], __undef, __0 ],
      [ [ __null  ], __undef, __0 ],
      [ [ __true  ], __undef, __0 ],
      [ [ test0_list ], test0_list, __0 ],
      [ [ test0_list, base0_map  ], expect0_list, __2 ],
      [ [ test0_list, base0_list ], expect1_list, __2 ],
      [ [ test0_list, 'string'   ], expect2_list, __2 ],
      [ [ test0_list, 'fetzer'   ], expect2_list, __0 ],
      [ [ test0_list, '0'        ], expect2_list, __0 ],
      [ [ test0_list, __0        ], expect3_list, __1 ]
    ],

    assert_count = assert_list.length,
    rm_val_fn    = __util._rmListVal_,

    idx,          expect_list,  arg_list,
    expect_data,  expect_count, solve_list,
    solve_count,  msg_str
    ;

  test_obj.expect( assert_count  * __2 );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list  = assert_list[ idx ];
    arg_list     = expect_list[ __0 ];
    expect_data  = expect_list[ __1 ];
    expect_count = expect_list[ __2 ];

    solve_list = ( arg_list[ __0 ] && Array.isArray( arg_list[ __0 ] ) )
      ? arg_list[ __0 ] : __undef;
    solve_count = rm_val_fn.apply( __undef, arg_list );

    msg_str    = __Str( idx ) + '. '
      + JSON.stringify( solve_list  ) + ' <===> '
      + JSON.stringify( expect_data );

    test_obj.deepEqual( solve_list,  expect_data,  msg_str );
    test_obj.deepEqual( solve_count, expect_count, msg_str );
  }
  test_obj.done();
}

function pollFunction ( test_obj ) {
  var
    test_list = [],
    test_fn   = function ( idx ) { test_list.push( idx ); return __true; },
    finish_fn = function () {
      test_obj.deepEqual( test_list, [ 0,1,2,3 ], 'fn runs 4 times' );
      test_obj.done();
    };

  test_obj.expect( __3 );
  test_obj.ok( ! __util._pollFunction_ ( __undef, __0, 29, finish_fn ),
    'no fn should fail ' );
  test_obj.ok( __util._pollFunction_( test_fn, __0, 4, finish_fn ),
    'proper call should return true.' );
}

function setStructData ( test_obj ) {
  var
    base0_map = { attr1 : 'val1', attr2 : 'val2', sub_map : {} },
    expect0_map = { attr1 : 'val1', attr2 : 'val2', sub_map : {
      dakota : [ 'hello', 'world' ]
    } },
    assert_list = [
      [ [],                 __undef ],
      [ [ __null ],         __null  ],
      [ [ __null, __null ], __null  ],
      [ [ 'liz', 'mary'  ],   'liz' ],
      [ [ { ad_lib: 'julie' }, []   ], { ad_lib:'julie'} ],
      [ [ base0_map, __undef ], base0_map ],
      [ [ base0_map, [ 'sub_map', 'dakota' ],
          [ 'hello', 'world' ] ], expect0_map
      ],
      [ [ [], [ __null, 'car', __null ], 'tyres' ],
        [ { car : [ 'tyres' ] } ]
      ],
      [ [ { foo:{ bar:1 }}, [ 'foo','bar' ], 99 ],
        { foo : { bar : 99 } }
      ],
      [ [ [ { car : [ 'seats', 'tyres' ] } ], [ 0, 'car', 1 ], 'Meyers!' ],
        [ { car : [ 'seats', 'Meyers!' ] } ]
      ],
      [ [ [],  [ null, 'car', null ], 'Meyers!' ],
        [ { car : [ 'Meyers!' ] } ]
      ],
      [ [ [], [ 'car', null ], 'Meyers!'  ], [] ],
      [ [ [ 'power' ],  [ null, 'car', null ], 'Meyers!' ],
        [ 'power', { car : [ 'Meyers!' ] } ]
      ],
      [ [ { cat : 'power' },  [ null, 'car', null ], 'Meyers!' ],
        { cat : 'power' }
      ],
      [ [ { cat : 'power' },  [ '', 'car', null ], 'Meyers!' ],
        { cat : 'power' }
      ]
    ],

    assert_count  = assert_list.length,
    set_deep_fn = __util._setStructData_,

    idx, expect_list, arg_list,
    expect_data, solve_data, msg_str
    ;

  test_obj.expect( assert_count );
  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_list[ idx ];
    arg_list    = __util._cloneData_( expect_list[ __0 ] );
    expect_data = expect_list[ __1 ];
    solve_data  = arg_list[ __0 ];
    set_deep_fn.apply( __undef, arg_list );
    msg_str = __Str( idx ) + '. arg_list: '
      + JSON.stringify( arg_list ) + '\n solve_data: '
      + JSON.stringify( solve_data )
      + '\n expect_data: ' + JSON.stringify( expect_data );
    test_obj.ok(
      JSON.stringify( solve_data ) ===  JSON.stringify( expect_data ),
      msg_str
    );
  }
  test_obj.done();
}

// ===== UTILB
function decodeHtml ( test_obj ) {
  var
    assert_list = [
      [ [ ],                          __blank ],
      [ [ 'text'  ],                   'text' ],
      [ [ __blank ],                  __blank ],
      [ [ __null  ],                  __blank ],
      [ [ __undef ],                  __blank ],
      [ [ '<div>text</div>' ],         'text' ]
    ],
    assert_count = assert_list.length,
    test_fn      = __utilb._decodeHtml_,

    idx,        expect_list, arg_list,
    expect_str, solve_str,   msg_str
  ;

  test_obj.expect( assert_count );

  for ( idx = __0; idx < assert_count; idx++ ) {
    expect_list = assert_list[ idx ];
    arg_list    = expect_list[ __0 ];
    expect_str  = expect_list[ __1 ];
    solve_str   = test_fn[ vMap._apply_ ]( __undef, arg_list );
    msg_str = __Str( idx ) + '. arg_list: '
      + JSON.stringify( arg_list ) + '\n solve_str: ' + solve_str
      + '\n expect_str: ' + expect_str;
    test_obj.ok( solve_str === expect_str, msg_str );
  }
  test_obj.done();
}

function fillForm ( test_obj ) {
  var
    form_01_html = '<form><input type="text" name="attr1" value=""/>'
      + '<textarea name="attr2"></textarea></form>',
    form_02_html = '<form><input type="checkbox" name="attr1"/>'
      + '<input type="checkbox" name="attr2"/></form>',
    $form_01 = global.$( form_01_html ),
    $form_02 = global.$( form_02_html ),
    solve_str, solve_bool
    ;

  test_obj.expect( 6 );

  __utilb._fillForm_( $form_01, {
    attr1 : 'my input', attr2 : 'Textarea'
  });

  solve_str = $form_01.find( '[name="attr1"]' ).val();
  test_obj.ok( solve_str === 'my input', '0. ' + solve_str );

  solve_str = $form_01.find( '[name="attr2"]' ).val();
  test_obj.ok( solve_str === 'Textarea', '1. ' + solve_str );

  solve_bool = $form_02.find( '[name="attr1"]' ).prop( 'checked' );
  test_obj.ok( solve_bool === __false, '2. ' + solve_bool );

  solve_bool = $form_02.find( '[name="attr2"]' ).prop( 'checked' );
  test_obj.ok( solve_bool === __false, '3. ' + solve_bool );

  __utilb._fillForm_( $form_02, { attr1 : true, attr2 : true });

  solve_bool = $form_02.find( '[name="attr1"]' ).get( __0 ).checked;
  test_obj.ok( solve_bool === __true, '4. ' + solve_bool );

  solve_bool = $form_02.find( '[name="attr2"]' ).get( __0 ).checked;
  test_obj.ok( solve_bool === __true, '5. ' + solve_bool );

  test_obj.done();
}
// ======== END NODEUNIT TEST FUNCTIONS ===========

// Use mockTestObj for debugging tests using nodejs instead
// of nodeunit, which obscures error messages. Use like so:
// 1. Add the test you would like to run:
// 2. Run node <this_file>
// 3. Inspect the output
// setStructData( mockTestObj );

module.exports = {
  // Util
  _setLogLevel_     : setLogLevel,
  _castJQ_          : castJQ,
  _castStr_         : castStr,
  _clearMap_        : clearMap,
  _cloneData_       : cloneData,
  _encodeHtml_      : encodeHtml,
  _getBasename_     : getBasename,     // Includes getDirname
  _getStructData_   : getStructData,
  _getListAttrIdx_  : getListAttrIdx,  // Include getListAttrMap
  _getListDiff_     : getListDiff,
  _getListValCount_ : getListValCount,
  _getNowMs_        : getNowMs,
  _getNumSign_      : getNumSign,
  _getTzCode_       : getTzCode,
  _getTzOffsetMs_   : getTzOffsetMs,
  _getVarType_      : getVarType,
  _makeArgList_     : makeArgList,
  _makeClockStr_    : makeClockStr,
  _makeCommaNumStr_ : makeCommaNumStr,
  _makeDateStr_     : makeDateStr,
  _makeEllipsisStr_ : makeEllipsisStr,
  _makeErrorObj_    : makeErrorObj,
  _makeGuidStr_     : makeGuidStr,
  _makeMapUtilObj_  : makeMapUtilObj,
  _makeOptionHtml_  : makeOptionHtml,
  _makePadNumStr_   : makePadNumStr,
  _makePctStr_      : makePctStr,
  _makeRadioHtml_   : makeRadioHtml,
  _makeScrubStr_    : makeScrubStr,
  _makeSeenMap_     : makeSeenMap,
  _makeSeriesMap_   : makeSeriesMap,
  _makeStrFromMap_  : makeStrFromMap,
  _makeTmpltStr_    : makeTmpltStr,
  _makeUcFirstStr_  : makeUcFirstStr,
  _mergeMaps_       : mergeMaps,
  _pollFunction_    : pollFunction,
  _pushUniqListVal_ : pushUniqListVal,
  _rmListVal_       : rmListVal,
  _setStructData_   : setStructData,

  // UtilB
  _decodeHtml_      : decodeHtml,
  _fillForm_        : fillForm
};
