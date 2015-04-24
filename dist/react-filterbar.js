(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var FilterableTable = require("./components/FilterableTable.react").FilterableTable;

var ConfigurationFactory = require("./factories/ConfigurationFactory").ConfigurationFactory;

document.addEventListener("DOMContentLoaded", function () {
  var configuration,
      filterableTables = document.getElementsByClassName("react-filterable-table"),
      filterableTableNode,
      htmlConfiguration,
      urlConfiguration;

  for (var i = 0; i < filterableTables.length; i++) {
    filterableTableNode = filterableTables[i];
    htmlConfiguration = new ConfigurationFactory("html", filterableTableNode);
    if (htmlConfiguration.filterBarConfiguration.persistent) {
      urlConfiguration = new ConfigurationFactory("url");
    } else {
      urlConfiguration = {};
    }

    configuration = $.extend(true, {}, htmlConfiguration, urlConfiguration);

    React.render(React.createElement(FilterableTable, {
      filterbar: configuration.filterBarConfiguration,
      table: configuration.tableConfiguration
    }), filterableTableNode);
  }
});

},{"./components/FilterableTable.react":23,"./factories/ConfigurationFactory":26}],2:[function(require,module,exports){
/*!
 * URI.js - Mutating URLs
 * IPv6 Support
 *
 * Version: 1.15.0
 *
 * Author: Rodney Rehm
 * Web: http://medialize.github.io/URI.js/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *   GPL v3 http://opensource.org/licenses/GPL-3.0
 *
 */

(function (root, factory) {
  'use strict';
  // https://github.com/umdjs/umd/blob/master/returnExports.js
  if (typeof exports === 'object') {
    // Node
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  } else {
    // Browser globals (root is window)
    root.IPv6 = factory(root);
  }
}(this, function (root) {
  'use strict';

  /*
  var _in = "fe80:0000:0000:0000:0204:61ff:fe9d:f156";
  var _out = IPv6.best(_in);
  var _expected = "fe80::204:61ff:fe9d:f156";

  console.log(_in, _out, _expected, _out === _expected);
  */

  // save current IPv6 variable, if any
  var _IPv6 = root && root.IPv6;

  function bestPresentation(address) {
    // based on:
    // Javascript to test an IPv6 address for proper format, and to
    // present the "best text representation" according to IETF Draft RFC at
    // http://tools.ietf.org/html/draft-ietf-6man-text-addr-representation-04
    // 8 Feb 2010 Rich Brown, Dartware, LLC
    // Please feel free to use this code as long as you provide a link to
    // http://www.intermapper.com
    // http://intermapper.com/support/tools/IPV6-Validator.aspx
    // http://download.dartware.com/thirdparty/ipv6validator.js

    var _address = address.toLowerCase();
    var segments = _address.split(':');
    var length = segments.length;
    var total = 8;

    // trim colons (:: or ::a:b:c… or …a:b:c::)
    if (segments[0] === '' && segments[1] === '' && segments[2] === '') {
      // must have been ::
      // remove first two items
      segments.shift();
      segments.shift();
    } else if (segments[0] === '' && segments[1] === '') {
      // must have been ::xxxx
      // remove the first item
      segments.shift();
    } else if (segments[length - 1] === '' && segments[length - 2] === '') {
      // must have been xxxx::
      segments.pop();
    }

    length = segments.length;

    // adjust total segments for IPv4 trailer
    if (segments[length - 1].indexOf('.') !== -1) {
      // found a "." which means IPv4
      total = 7;
    }

    // fill empty segments them with "0000"
    var pos;
    for (pos = 0; pos < length; pos++) {
      if (segments[pos] === '') {
        break;
      }
    }

    if (pos < total) {
      segments.splice(pos, 1, '0000');
      while (segments.length < total) {
        segments.splice(pos, 0, '0000');
      }

      length = segments.length;
    }

    // strip leading zeros
    var _segments;
    for (var i = 0; i < total; i++) {
      _segments = segments[i].split('');
      for (var j = 0; j < 3 ; j++) {
        if (_segments[0] === '0' && _segments.length > 1) {
          _segments.splice(0,1);
        } else {
          break;
        }
      }

      segments[i] = _segments.join('');
    }

    // find longest sequence of zeroes and coalesce them into one segment
    var best = -1;
    var _best = 0;
    var _current = 0;
    var current = -1;
    var inzeroes = false;
    // i; already declared

    for (i = 0; i < total; i++) {
      if (inzeroes) {
        if (segments[i] === '0') {
          _current += 1;
        } else {
          inzeroes = false;
          if (_current > _best) {
            best = current;
            _best = _current;
          }
        }
      } else {
        if (segments[i] === '0') {
          inzeroes = true;
          current = i;
          _current = 1;
        }
      }
    }

    if (_current > _best) {
      best = current;
      _best = _current;
    }

    if (_best > 1) {
      segments.splice(best, _best, '');
    }

    length = segments.length;

    // assemble remaining segments
    var result = '';
    if (segments[0] === '')  {
      result = ':';
    }

    for (i = 0; i < length; i++) {
      result += segments[i];
      if (i === length - 1) {
        break;
      }

      result += ':';
    }

    if (segments[length - 1] === '') {
      result += ':';
    }

    return result;
  }

  function noConflict() {
    /*jshint validthis: true */
    if (root.IPv6 === this) {
      root.IPv6 = _IPv6;
    }
  
    return this;
  }

  return {
    best: bestPresentation,
    noConflict: noConflict
  };
}));

},{}],3:[function(require,module,exports){
/*!
 * URI.js - Mutating URLs
 * Second Level Domain (SLD) Support
 *
 * Version: 1.15.0
 *
 * Author: Rodney Rehm
 * Web: http://medialize.github.io/URI.js/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *   GPL v3 http://opensource.org/licenses/GPL-3.0
 *
 */

(function (root, factory) {
  'use strict';
  // https://github.com/umdjs/umd/blob/master/returnExports.js
  if (typeof exports === 'object') {
    // Node
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  } else {
    // Browser globals (root is window)
    root.SecondLevelDomains = factory(root);
  }
}(this, function (root) {
  'use strict';

  // save current SecondLevelDomains variable, if any
  var _SecondLevelDomains = root && root.SecondLevelDomains;

  var SLD = {
    // list of known Second Level Domains
    // converted list of SLDs from https://github.com/gavingmiller/second-level-domains
    // ----
    // publicsuffix.org is more current and actually used by a couple of browsers internally.
    // downside is it also contains domains like "dyndns.org" - which is fine for the security
    // issues browser have to deal with (SOP for cookies, etc) - but is way overboard for URI.js
    // ----
    list: {
      'ac':' com gov mil net org ',
      'ae':' ac co gov mil name net org pro sch ',
      'af':' com edu gov net org ',
      'al':' com edu gov mil net org ',
      'ao':' co ed gv it og pb ',
      'ar':' com edu gob gov int mil net org tur ',
      'at':' ac co gv or ',
      'au':' asn com csiro edu gov id net org ',
      'ba':' co com edu gov mil net org rs unbi unmo unsa untz unze ',
      'bb':' biz co com edu gov info net org store tv ',
      'bh':' biz cc com edu gov info net org ',
      'bn':' com edu gov net org ',
      'bo':' com edu gob gov int mil net org tv ',
      'br':' adm adv agr am arq art ato b bio blog bmd cim cng cnt com coop ecn edu eng esp etc eti far flog fm fnd fot fst g12 ggf gov imb ind inf jor jus lel mat med mil mus net nom not ntr odo org ppg pro psc psi qsl rec slg srv tmp trd tur tv vet vlog wiki zlg ',
      'bs':' com edu gov net org ',
      'bz':' du et om ov rg ',
      'ca':' ab bc mb nb nf nl ns nt nu on pe qc sk yk ',
      'ck':' biz co edu gen gov info net org ',
      'cn':' ac ah bj com cq edu fj gd gov gs gx gz ha hb he hi hl hn jl js jx ln mil net nm nx org qh sc sd sh sn sx tj tw xj xz yn zj ',
      'co':' com edu gov mil net nom org ',
      'cr':' ac c co ed fi go or sa ',
      'cy':' ac biz com ekloges gov ltd name net org parliament press pro tm ',
      'do':' art com edu gob gov mil net org sld web ',
      'dz':' art asso com edu gov net org pol ',
      'ec':' com edu fin gov info med mil net org pro ',
      'eg':' com edu eun gov mil name net org sci ',
      'er':' com edu gov ind mil net org rochest w ',
      'es':' com edu gob nom org ',
      'et':' biz com edu gov info name net org ',
      'fj':' ac biz com info mil name net org pro ',
      'fk':' ac co gov net nom org ',
      'fr':' asso com f gouv nom prd presse tm ',
      'gg':' co net org ',
      'gh':' com edu gov mil org ',
      'gn':' ac com gov net org ',
      'gr':' com edu gov mil net org ',
      'gt':' com edu gob ind mil net org ',
      'gu':' com edu gov net org ',
      'hk':' com edu gov idv net org ',
      'hu':' 2000 agrar bolt casino city co erotica erotika film forum games hotel info ingatlan jogasz konyvelo lakas media news org priv reklam sex shop sport suli szex tm tozsde utazas video ',
      'id':' ac co go mil net or sch web ',
      'il':' ac co gov idf k12 muni net org ',
      'in':' ac co edu ernet firm gen gov i ind mil net nic org res ',
      'iq':' com edu gov i mil net org ',
      'ir':' ac co dnssec gov i id net org sch ',
      'it':' edu gov ',
      'je':' co net org ',
      'jo':' com edu gov mil name net org sch ',
      'jp':' ac ad co ed go gr lg ne or ',
      'ke':' ac co go info me mobi ne or sc ',
      'kh':' com edu gov mil net org per ',
      'ki':' biz com de edu gov info mob net org tel ',
      'km':' asso com coop edu gouv k medecin mil nom notaires pharmaciens presse tm veterinaire ',
      'kn':' edu gov net org ',
      'kr':' ac busan chungbuk chungnam co daegu daejeon es gangwon go gwangju gyeongbuk gyeonggi gyeongnam hs incheon jeju jeonbuk jeonnam k kg mil ms ne or pe re sc seoul ulsan ',
      'kw':' com edu gov net org ',
      'ky':' com edu gov net org ',
      'kz':' com edu gov mil net org ',
      'lb':' com edu gov net org ',
      'lk':' assn com edu gov grp hotel int ltd net ngo org sch soc web ',
      'lr':' com edu gov net org ',
      'lv':' asn com conf edu gov id mil net org ',
      'ly':' com edu gov id med net org plc sch ',
      'ma':' ac co gov m net org press ',
      'mc':' asso tm ',
      'me':' ac co edu gov its net org priv ',
      'mg':' com edu gov mil nom org prd tm ',
      'mk':' com edu gov inf name net org pro ',
      'ml':' com edu gov net org presse ',
      'mn':' edu gov org ',
      'mo':' com edu gov net org ',
      'mt':' com edu gov net org ',
      'mv':' aero biz com coop edu gov info int mil museum name net org pro ',
      'mw':' ac co com coop edu gov int museum net org ',
      'mx':' com edu gob net org ',
      'my':' com edu gov mil name net org sch ',
      'nf':' arts com firm info net other per rec store web ',
      'ng':' biz com edu gov mil mobi name net org sch ',
      'ni':' ac co com edu gob mil net nom org ',
      'np':' com edu gov mil net org ',
      'nr':' biz com edu gov info net org ',
      'om':' ac biz co com edu gov med mil museum net org pro sch ',
      'pe':' com edu gob mil net nom org sld ',
      'ph':' com edu gov i mil net ngo org ',
      'pk':' biz com edu fam gob gok gon gop gos gov net org web ',
      'pl':' art bialystok biz com edu gda gdansk gorzow gov info katowice krakow lodz lublin mil net ngo olsztyn org poznan pwr radom slupsk szczecin torun warszawa waw wroc wroclaw zgora ',
      'pr':' ac biz com edu est gov info isla name net org pro prof ',
      'ps':' com edu gov net org plo sec ',
      'pw':' belau co ed go ne or ',
      'ro':' arts com firm info nom nt org rec store tm www ',
      'rs':' ac co edu gov in org ',
      'sb':' com edu gov net org ',
      'sc':' com edu gov net org ',
      'sh':' co com edu gov net nom org ',
      'sl':' com edu gov net org ',
      'st':' co com consulado edu embaixada gov mil net org principe saotome store ',
      'sv':' com edu gob org red ',
      'sz':' ac co org ',
      'tr':' av bbs bel biz com dr edu gen gov info k12 name net org pol tel tsk tv web ',
      'tt':' aero biz cat co com coop edu gov info int jobs mil mobi museum name net org pro tel travel ',
      'tw':' club com ebiz edu game gov idv mil net org ',
      'mu':' ac co com gov net or org ',
      'mz':' ac co edu gov org ',
      'na':' co com ',
      'nz':' ac co cri geek gen govt health iwi maori mil net org parliament school ',
      'pa':' abo ac com edu gob ing med net nom org sld ',
      'pt':' com edu gov int net nome org publ ',
      'py':' com edu gov mil net org ',
      'qa':' com edu gov mil net org ',
      're':' asso com nom ',
      'ru':' ac adygeya altai amur arkhangelsk astrakhan bashkiria belgorod bir bryansk buryatia cbg chel chelyabinsk chita chukotka chuvashia com dagestan e-burg edu gov grozny int irkutsk ivanovo izhevsk jar joshkar-ola kalmykia kaluga kamchatka karelia kazan kchr kemerovo khabarovsk khakassia khv kirov koenig komi kostroma kranoyarsk kuban kurgan kursk lipetsk magadan mari mari-el marine mil mordovia mosreg msk murmansk nalchik net nnov nov novosibirsk nsk omsk orenburg org oryol penza perm pp pskov ptz rnd ryazan sakhalin samara saratov simbirsk smolensk spb stavropol stv surgut tambov tatarstan tom tomsk tsaritsyn tsk tula tuva tver tyumen udm udmurtia ulan-ude vladikavkaz vladimir vladivostok volgograd vologda voronezh vrn vyatka yakutia yamal yekaterinburg yuzhno-sakhalinsk ',
      'rw':' ac co com edu gouv gov int mil net ',
      'sa':' com edu gov med net org pub sch ',
      'sd':' com edu gov info med net org tv ',
      'se':' a ac b bd c d e f g h i k l m n o org p parti pp press r s t tm u w x y z ',
      'sg':' com edu gov idn net org per ',
      'sn':' art com edu gouv org perso univ ',
      'sy':' com edu gov mil net news org ',
      'th':' ac co go in mi net or ',
      'tj':' ac biz co com edu go gov info int mil name net nic org test web ',
      'tn':' agrinet com defense edunet ens fin gov ind info intl mincom nat net org perso rnrt rns rnu tourism ',
      'tz':' ac co go ne or ',
      'ua':' biz cherkassy chernigov chernovtsy ck cn co com crimea cv dn dnepropetrovsk donetsk dp edu gov if in ivano-frankivsk kh kharkov kherson khmelnitskiy kiev kirovograd km kr ks kv lg lugansk lutsk lviv me mk net nikolaev od odessa org pl poltava pp rovno rv sebastopol sumy te ternopil uzhgorod vinnica vn zaporizhzhe zhitomir zp zt ',
      'ug':' ac co go ne or org sc ',
      'uk':' ac bl british-library co cym gov govt icnet jet lea ltd me mil mod national-library-scotland nel net nhs nic nls org orgn parliament plc police sch scot soc ',
      'us':' dni fed isa kids nsn ',
      'uy':' com edu gub mil net org ',
      've':' co com edu gob info mil net org web ',
      'vi':' co com k12 net org ',
      'vn':' ac biz com edu gov health info int name net org pro ',
      'ye':' co com gov ltd me net org plc ',
      'yu':' ac co edu gov org ',
      'za':' ac agric alt bourse city co cybernet db edu gov grondar iaccess imt inca landesign law mil net ngo nis nom olivetti org pix school tm web ',
      'zm':' ac co com edu gov net org sch '
    },
    // gorhill 2013-10-25: Using indexOf() instead Regexp(). Significant boost
    // in both performance and memory footprint. No initialization required.
    // http://jsperf.com/uri-js-sld-regex-vs-binary-search/4
    // Following methods use lastIndexOf() rather than array.split() in order
    // to avoid any memory allocations.
    has: function(domain) {
      var tldOffset = domain.lastIndexOf('.');
      if (tldOffset <= 0 || tldOffset >= (domain.length-1)) {
        return false;
      }
      var sldOffset = domain.lastIndexOf('.', tldOffset-1);
      if (sldOffset <= 0 || sldOffset >= (tldOffset-1)) {
        return false;
      }
      var sldList = SLD.list[domain.slice(tldOffset+1)];
      if (!sldList) {
        return false;
      }
      return sldList.indexOf(' ' + domain.slice(sldOffset+1, tldOffset) + ' ') >= 0;
    },
    is: function(domain) {
      var tldOffset = domain.lastIndexOf('.');
      if (tldOffset <= 0 || tldOffset >= (domain.length-1)) {
        return false;
      }
      var sldOffset = domain.lastIndexOf('.', tldOffset-1);
      if (sldOffset >= 0) {
        return false;
      }
      var sldList = SLD.list[domain.slice(tldOffset+1)];
      if (!sldList) {
        return false;
      }
      return sldList.indexOf(' ' + domain.slice(0, tldOffset) + ' ') >= 0;
    },
    get: function(domain) {
      var tldOffset = domain.lastIndexOf('.');
      if (tldOffset <= 0 || tldOffset >= (domain.length-1)) {
        return null;
      }
      var sldOffset = domain.lastIndexOf('.', tldOffset-1);
      if (sldOffset <= 0 || sldOffset >= (tldOffset-1)) {
        return null;
      }
      var sldList = SLD.list[domain.slice(tldOffset+1)];
      if (!sldList) {
        return null;
      }
      if (sldList.indexOf(' ' + domain.slice(sldOffset+1, tldOffset) + ' ') < 0) {
        return null;
      }
      return domain.slice(sldOffset+1);
    },
    noConflict: function(){
      if (root.SecondLevelDomains === this) {
        root.SecondLevelDomains = _SecondLevelDomains;
      }
      return this;
    }
  };

  return SLD;
}));

},{}],4:[function(require,module,exports){
/*!
 * URI.js - Mutating URLs
 *
 * Version: 1.15.0
 *
 * Author: Rodney Rehm
 * Web: http://medialize.github.io/URI.js/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *   GPL v3 http://opensource.org/licenses/GPL-3.0
 *
 */
(function (root, factory) {
  'use strict';
  // https://github.com/umdjs/umd/blob/master/returnExports.js
  if (typeof exports === 'object') {
    // Node
    module.exports = factory(require('./punycode'), require('./IPv6'), require('./SecondLevelDomains'));
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['./punycode', './IPv6', './SecondLevelDomains'], factory);
  } else {
    // Browser globals (root is window)
    root.URI = factory(root.punycode, root.IPv6, root.SecondLevelDomains, root);
  }
}(this, function (punycode, IPv6, SLD, root) {
  'use strict';
  /*global location, escape, unescape */
  // FIXME: v2.0.0 renamce non-camelCase properties to uppercase
  /*jshint camelcase: false */

  // save current URI variable, if any
  var _URI = root && root.URI;

  function URI(url, base) {
    // Allow instantiation without the 'new' keyword
    if (!(this instanceof URI)) {
      return new URI(url, base);
    }

    if (url === undefined) {
      if (arguments.length) {
        throw new TypeError('undefined is not a valid argument for URI');
      }

      if (typeof location !== 'undefined') {
        url = location.href + '';
      } else {
        url = '';
      }
    }

    this.href(url);

    // resolve to base according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#constructor
    if (base !== undefined) {
      return this.absoluteTo(base);
    }

    return this;
  }

  URI.version = '1.15.0';

  var p = URI.prototype;
  var hasOwn = Object.prototype.hasOwnProperty;

  function escapeRegEx(string) {
    // https://github.com/medialize/URI.js/commit/85ac21783c11f8ccab06106dba9735a31a86924d#commitcomment-821963
    return string.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
  }

  function getType(value) {
    // IE8 doesn't return [Object Undefined] but [Object Object] for undefined value
    if (value === undefined) {
      return 'Undefined';
    }

    return String(Object.prototype.toString.call(value)).slice(8, -1);
  }

  function isArray(obj) {
    return getType(obj) === 'Array';
  }

  function filterArrayValues(data, value) {
    var lookup = {};
    var i, length;

    if (isArray(value)) {
      for (i = 0, length = value.length; i < length; i++) {
        lookup[value[i]] = true;
      }
    } else {
      lookup[value] = true;
    }

    for (i = 0, length = data.length; i < length; i++) {
      if (lookup[data[i]] !== undefined) {
        data.splice(i, 1);
        length--;
        i--;
      }
    }

    return data;
  }

  function arrayContains(list, value) {
    var i, length;

    // value may be string, number, array, regexp
    if (isArray(value)) {
      // Note: this can be optimized to O(n) (instead of current O(m * n))
      for (i = 0, length = value.length; i < length; i++) {
        if (!arrayContains(list, value[i])) {
          return false;
        }
      }

      return true;
    }

    var _type = getType(value);
    for (i = 0, length = list.length; i < length; i++) {
      if (_type === 'RegExp') {
        if (typeof list[i] === 'string' && list[i].match(value)) {
          return true;
        }
      } else if (list[i] === value) {
        return true;
      }
    }

    return false;
  }

  function arraysEqual(one, two) {
    if (!isArray(one) || !isArray(two)) {
      return false;
    }

    // arrays can't be equal if they have different amount of content
    if (one.length !== two.length) {
      return false;
    }

    one.sort();
    two.sort();

    for (var i = 0, l = one.length; i < l; i++) {
      if (one[i] !== two[i]) {
        return false;
      }
    }

    return true;
  }

  URI._parts = function() {
    return {
      protocol: null,
      username: null,
      password: null,
      hostname: null,
      urn: null,
      port: null,
      path: null,
      query: null,
      fragment: null,
      // state
      duplicateQueryParameters: URI.duplicateQueryParameters,
      escapeQuerySpace: URI.escapeQuerySpace
    };
  };
  // state: allow duplicate query parameters (a=1&a=1)
  URI.duplicateQueryParameters = false;
  // state: replaces + with %20 (space in query strings)
  URI.escapeQuerySpace = true;
  // static properties
  URI.protocol_expression = /^[a-z][a-z0-9.+-]*$/i;
  URI.idn_expression = /[^a-z0-9\.-]/i;
  URI.punycode_expression = /(xn--)/i;
  // well, 333.444.555.666 matches, but it sure ain't no IPv4 - do we care?
  URI.ip4_expression = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  // credits to Rich Brown
  // source: http://forums.intermapper.com/viewtopic.php?p=1096#1096
  // specification: http://www.ietf.org/rfc/rfc4291.txt
  URI.ip6_expression = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
  // expression used is "gruber revised" (@gruber v2) determined to be the
  // best solution in a regex-golf we did a couple of ages ago at
  // * http://mathiasbynens.be/demo/url-regex
  // * http://rodneyrehm.de/t/url-regex.html
  URI.find_uri_expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
  URI.findUri = {
    // valid "scheme://" or "www."
    start: /\b(?:([a-z][a-z0-9.+-]*:\/\/)|www\.)/gi,
    // everything up to the next whitespace
    end: /[\s\r\n]|$/,
    // trim trailing punctuation captured by end RegExp
    trim: /[`!()\[\]{};:'".,<>?«»“”„‘’]+$/
  };
  // http://www.iana.org/assignments/uri-schemes.html
  // http://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers#Well-known_ports
  URI.defaultPorts = {
    http: '80',
    https: '443',
    ftp: '21',
    gopher: '70',
    ws: '80',
    wss: '443'
  };
  // allowed hostname characters according to RFC 3986
  // ALPHA DIGIT "-" "." "_" "~" "!" "$" "&" "'" "(" ")" "*" "+" "," ";" "=" %encoded
  // I've never seen a (non-IDN) hostname other than: ALPHA DIGIT . -
  URI.invalid_hostname_characters = /[^a-zA-Z0-9\.-]/;
  // map DOM Elements to their URI attribute
  URI.domAttributes = {
    'a': 'href',
    'blockquote': 'cite',
    'link': 'href',
    'base': 'href',
    'script': 'src',
    'form': 'action',
    'img': 'src',
    'area': 'href',
    'iframe': 'src',
    'embed': 'src',
    'source': 'src',
    'track': 'src',
    'input': 'src', // but only if type="image"
    'audio': 'src',
    'video': 'src'
  };
  URI.getDomAttribute = function(node) {
    if (!node || !node.nodeName) {
      return undefined;
    }

    var nodeName = node.nodeName.toLowerCase();
    // <input> should only expose src for type="image"
    if (nodeName === 'input' && node.type !== 'image') {
      return undefined;
    }

    return URI.domAttributes[nodeName];
  };

  function escapeForDumbFirefox36(value) {
    // https://github.com/medialize/URI.js/issues/91
    return escape(value);
  }

  // encoding / decoding according to RFC3986
  function strictEncodeURIComponent(string) {
    // see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/encodeURIComponent
    return encodeURIComponent(string)
      .replace(/[!'()*]/g, escapeForDumbFirefox36)
      .replace(/\*/g, '%2A');
  }
  URI.encode = strictEncodeURIComponent;
  URI.decode = decodeURIComponent;
  URI.iso8859 = function() {
    URI.encode = escape;
    URI.decode = unescape;
  };
  URI.unicode = function() {
    URI.encode = strictEncodeURIComponent;
    URI.decode = decodeURIComponent;
  };
  URI.characters = {
    pathname: {
      encode: {
        // RFC3986 2.1: For consistency, URI producers and normalizers should
        // use uppercase hexadecimal digits for all percent-encodings.
        expression: /%(24|26|2B|2C|3B|3D|3A|40)/ig,
        map: {
          // -._~!'()*
          '%24': '$',
          '%26': '&',
          '%2B': '+',
          '%2C': ',',
          '%3B': ';',
          '%3D': '=',
          '%3A': ':',
          '%40': '@'
        }
      },
      decode: {
        expression: /[\/\?#]/g,
        map: {
          '/': '%2F',
          '?': '%3F',
          '#': '%23'
        }
      }
    },
    reserved: {
      encode: {
        // RFC3986 2.1: For consistency, URI producers and normalizers should
        // use uppercase hexadecimal digits for all percent-encodings.
        expression: /%(21|23|24|26|27|28|29|2A|2B|2C|2F|3A|3B|3D|3F|40|5B|5D)/ig,
        map: {
          // gen-delims
          '%3A': ':',
          '%2F': '/',
          '%3F': '?',
          '%23': '#',
          '%5B': '[',
          '%5D': ']',
          '%40': '@',
          // sub-delims
          '%21': '!',
          '%24': '$',
          '%26': '&',
          '%27': '\'',
          '%28': '(',
          '%29': ')',
          '%2A': '*',
          '%2B': '+',
          '%2C': ',',
          '%3B': ';',
          '%3D': '='
        }
      }
    },
    urnpath: {
      // The characters under `encode` are the characters called out by RFC 2141 as being acceptable
      // for usage in a URN. RFC2141 also calls out "-", ".", and "_" as acceptable characters, but
      // these aren't encoded by encodeURIComponent, so we don't have to call them out here. Also
      // note that the colon character is not featured in the encoding map; this is because URI.js
      // gives the colons in URNs semantic meaning as the delimiters of path segements, and so it
      // should not appear unencoded in a segment itself.
      // See also the note above about RFC3986 and capitalalized hex digits.
      encode: {
        expression: /%(21|24|27|28|29|2A|2B|2C|3B|3D|40)/ig,
        map: {
          '%21': '!',
          '%24': '$',
          '%27': '\'',
          '%28': '(',
          '%29': ')',
          '%2A': '*',
          '%2B': '+',
          '%2C': ',',
          '%3B': ';',
          '%3D': '=',
          '%40': '@'
        }
      },
      // These characters are the characters called out by RFC2141 as "reserved" characters that
      // should never appear in a URN, plus the colon character (see note above).
      decode: {
        expression: /[\/\?#:]/g,
        map: {
          '/': '%2F',
          '?': '%3F',
          '#': '%23',
          ':': '%3A'
        }
      }
    }
  };
  URI.encodeQuery = function(string, escapeQuerySpace) {
    var escaped = URI.encode(string + '');
    if (escapeQuerySpace === undefined) {
      escapeQuerySpace = URI.escapeQuerySpace;
    }

    return escapeQuerySpace ? escaped.replace(/%20/g, '+') : escaped;
  };
  URI.decodeQuery = function(string, escapeQuerySpace) {
    string += '';
    if (escapeQuerySpace === undefined) {
      escapeQuerySpace = URI.escapeQuerySpace;
    }

    try {
      return URI.decode(escapeQuerySpace ? string.replace(/\+/g, '%20') : string);
    } catch(e) {
      // we're not going to mess with weird encodings,
      // give up and return the undecoded original string
      // see https://github.com/medialize/URI.js/issues/87
      // see https://github.com/medialize/URI.js/issues/92
      return string;
    }
  };
  // generate encode/decode path functions
  var _parts = {'encode':'encode', 'decode':'decode'};
  var _part;
  var generateAccessor = function(_group, _part) {
    return function(string) {
      try {
        return URI[_part](string + '').replace(URI.characters[_group][_part].expression, function(c) {
          return URI.characters[_group][_part].map[c];
        });
      } catch (e) {
        // we're not going to mess with weird encodings,
        // give up and return the undecoded original string
        // see https://github.com/medialize/URI.js/issues/87
        // see https://github.com/medialize/URI.js/issues/92
        return string;
      }
    };
  };

  for (_part in _parts) {
    URI[_part + 'PathSegment'] = generateAccessor('pathname', _parts[_part]);
    URI[_part + 'UrnPathSegment'] = generateAccessor('urnpath', _parts[_part]);
  }

  var generateSegmentedPathFunction = function(_sep, _codingFuncName, _innerCodingFuncName) {
    return function(string) {
      // Why pass in names of functions, rather than the function objects themselves? The
      // definitions of some functions (but in particular, URI.decode) will occasionally change due
      // to URI.js having ISO8859 and Unicode modes. Passing in the name and getting it will ensure
      // that the functions we use here are "fresh".
      var actualCodingFunc;
      if (!_innerCodingFuncName) {
        actualCodingFunc = URI[_codingFuncName];
      } else {
        actualCodingFunc = function(string) {
          return URI[_codingFuncName](URI[_innerCodingFuncName](string));
        };
      }

      var segments = (string + '').split(_sep);

      for (var i = 0, length = segments.length; i < length; i++) {
        segments[i] = actualCodingFunc(segments[i]);
      }

      return segments.join(_sep);
    };
  };

  // This takes place outside the above loop because we don't want, e.g., encodeUrnPath functions.
  URI.decodePath = generateSegmentedPathFunction('/', 'decodePathSegment');
  URI.decodeUrnPath = generateSegmentedPathFunction(':', 'decodeUrnPathSegment');
  URI.recodePath = generateSegmentedPathFunction('/', 'encodePathSegment', 'decode');
  URI.recodeUrnPath = generateSegmentedPathFunction(':', 'encodeUrnPathSegment', 'decode');

  URI.encodeReserved = generateAccessor('reserved', 'encode');

  URI.parse = function(string, parts) {
    var pos;
    if (!parts) {
      parts = {};
    }
    // [protocol"://"[username[":"password]"@"]hostname[":"port]"/"?][path]["?"querystring]["#"fragment]

    // extract fragment
    pos = string.indexOf('#');
    if (pos > -1) {
      // escaping?
      parts.fragment = string.substring(pos + 1) || null;
      string = string.substring(0, pos);
    }

    // extract query
    pos = string.indexOf('?');
    if (pos > -1) {
      // escaping?
      parts.query = string.substring(pos + 1) || null;
      string = string.substring(0, pos);
    }

    // extract protocol
    if (string.substring(0, 2) === '//') {
      // relative-scheme
      parts.protocol = null;
      string = string.substring(2);
      // extract "user:pass@host:port"
      string = URI.parseAuthority(string, parts);
    } else {
      pos = string.indexOf(':');
      if (pos > -1) {
        parts.protocol = string.substring(0, pos) || null;
        if (parts.protocol && !parts.protocol.match(URI.protocol_expression)) {
          // : may be within the path
          parts.protocol = undefined;
        } else if (string.substring(pos + 1, pos + 3) === '//') {
          string = string.substring(pos + 3);

          // extract "user:pass@host:port"
          string = URI.parseAuthority(string, parts);
        } else {
          string = string.substring(pos + 1);
          parts.urn = true;
        }
      }
    }

    // what's left must be the path
    parts.path = string;

    // and we're done
    return parts;
  };
  URI.parseHost = function(string, parts) {
    // extract host:port
    var pos = string.indexOf('/');
    var bracketPos;
    var t;

    if (pos === -1) {
      pos = string.length;
    }

    if (string.charAt(0) === '[') {
      // IPv6 host - http://tools.ietf.org/html/draft-ietf-6man-text-addr-representation-04#section-6
      // I claim most client software breaks on IPv6 anyways. To simplify things, URI only accepts
      // IPv6+port in the format [2001:db8::1]:80 (for the time being)
      bracketPos = string.indexOf(']');
      parts.hostname = string.substring(1, bracketPos) || null;
      parts.port = string.substring(bracketPos + 2, pos) || null;
      if (parts.port === '/') {
        parts.port = null;
      }
    } else {
      var firstColon = string.indexOf(':');
      var firstSlash = string.indexOf('/');
      var nextColon = string.indexOf(':', firstColon + 1);
      if (nextColon !== -1 && (firstSlash === -1 || nextColon < firstSlash)) {
        // IPv6 host contains multiple colons - but no port
        // this notation is actually not allowed by RFC 3986, but we're a liberal parser
        parts.hostname = string.substring(0, pos) || null;
        parts.port = null;
      } else {
        t = string.substring(0, pos).split(':');
        parts.hostname = t[0] || null;
        parts.port = t[1] || null;
      }
    }

    if (parts.hostname && string.substring(pos).charAt(0) !== '/') {
      pos++;
      string = '/' + string;
    }

    return string.substring(pos) || '/';
  };
  URI.parseAuthority = function(string, parts) {
    string = URI.parseUserinfo(string, parts);
    return URI.parseHost(string, parts);
  };
  URI.parseUserinfo = function(string, parts) {
    // extract username:password
    var firstSlash = string.indexOf('/');
    var pos = string.lastIndexOf('@', firstSlash > -1 ? firstSlash : string.length - 1);
    var t;

    // authority@ must come before /path
    if (pos > -1 && (firstSlash === -1 || pos < firstSlash)) {
      t = string.substring(0, pos).split(':');
      parts.username = t[0] ? URI.decode(t[0]) : null;
      t.shift();
      parts.password = t[0] ? URI.decode(t.join(':')) : null;
      string = string.substring(pos + 1);
    } else {
      parts.username = null;
      parts.password = null;
    }

    return string;
  };
  URI.parseQuery = function(string, escapeQuerySpace) {
    if (!string) {
      return {};
    }

    // throw out the funky business - "?"[name"="value"&"]+
    string = string.replace(/&+/g, '&').replace(/^\?*&*|&+$/g, '');

    if (!string) {
      return {};
    }

    var items = {};
    var splits = string.split('&');
    var length = splits.length;
    var v, name, value;

    for (var i = 0; i < length; i++) {
      v = splits[i].split('=');
      name = URI.decodeQuery(v.shift(), escapeQuerySpace);
      // no "=" is null according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#collect-url-parameters
      value = v.length ? URI.decodeQuery(v.join('='), escapeQuerySpace) : null;

      if (hasOwn.call(items, name)) {
        if (typeof items[name] === 'string') {
          items[name] = [items[name]];
        }

        items[name].push(value);
      } else {
        items[name] = value;
      }
    }

    return items;
  };

  URI.build = function(parts) {
    var t = '';

    if (parts.protocol) {
      t += parts.protocol + ':';
    }

    if (!parts.urn && (t || parts.hostname)) {
      t += '//';
    }

    t += (URI.buildAuthority(parts) || '');

    if (typeof parts.path === 'string') {
      if (parts.path.charAt(0) !== '/' && typeof parts.hostname === 'string') {
        t += '/';
      }

      t += parts.path;
    }

    if (typeof parts.query === 'string' && parts.query) {
      t += '?' + parts.query;
    }

    if (typeof parts.fragment === 'string' && parts.fragment) {
      t += '#' + parts.fragment;
    }
    return t;
  };
  URI.buildHost = function(parts) {
    var t = '';

    if (!parts.hostname) {
      return '';
    } else if (URI.ip6_expression.test(parts.hostname)) {
      t += '[' + parts.hostname + ']';
    } else {
      t += parts.hostname;
    }

    if (parts.port) {
      t += ':' + parts.port;
    }

    return t;
  };
  URI.buildAuthority = function(parts) {
    return URI.buildUserinfo(parts) + URI.buildHost(parts);
  };
  URI.buildUserinfo = function(parts) {
    var t = '';

    if (parts.username) {
      t += URI.encode(parts.username);

      if (parts.password) {
        t += ':' + URI.encode(parts.password);
      }

      t += '@';
    }

    return t;
  };
  URI.buildQuery = function(data, duplicateQueryParameters, escapeQuerySpace) {
    // according to http://tools.ietf.org/html/rfc3986 or http://labs.apache.org/webarch/uri/rfc/rfc3986.html
    // being »-._~!$&'()*+,;=:@/?« %HEX and alnum are allowed
    // the RFC explicitly states ?/foo being a valid use case, no mention of parameter syntax!
    // URI.js treats the query string as being application/x-www-form-urlencoded
    // see http://www.w3.org/TR/REC-html40/interact/forms.html#form-content-type

    var t = '';
    var unique, key, i, length;
    for (key in data) {
      if (hasOwn.call(data, key) && key) {
        if (isArray(data[key])) {
          unique = {};
          for (i = 0, length = data[key].length; i < length; i++) {
            if (data[key][i] !== undefined && unique[data[key][i] + ''] === undefined) {
              t += '&' + URI.buildQueryParameter(key, data[key][i], escapeQuerySpace);
              if (duplicateQueryParameters !== true) {
                unique[data[key][i] + ''] = true;
              }
            }
          }
        } else if (data[key] !== undefined) {
          t += '&' + URI.buildQueryParameter(key, data[key], escapeQuerySpace);
        }
      }
    }

    return t.substring(1);
  };
  URI.buildQueryParameter = function(name, value, escapeQuerySpace) {
    // http://www.w3.org/TR/REC-html40/interact/forms.html#form-content-type -- application/x-www-form-urlencoded
    // don't append "=" for null values, according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#url-parameter-serialization
    return URI.encodeQuery(name, escapeQuerySpace) + (value !== null ? '=' + URI.encodeQuery(value, escapeQuerySpace) : '');
  };

  URI.addQuery = function(data, name, value) {
    if (typeof name === 'object') {
      for (var key in name) {
        if (hasOwn.call(name, key)) {
          URI.addQuery(data, key, name[key]);
        }
      }
    } else if (typeof name === 'string') {
      if (data[name] === undefined) {
        data[name] = value;
        return;
      } else if (typeof data[name] === 'string') {
        data[name] = [data[name]];
      }

      if (!isArray(value)) {
        value = [value];
      }

      data[name] = (data[name] || []).concat(value);
    } else {
      throw new TypeError('URI.addQuery() accepts an object, string as the name parameter');
    }
  };
  URI.removeQuery = function(data, name, value) {
    var i, length, key;

    if (isArray(name)) {
      for (i = 0, length = name.length; i < length; i++) {
        data[name[i]] = undefined;
      }
    } else if (typeof name === 'object') {
      for (key in name) {
        if (hasOwn.call(name, key)) {
          URI.removeQuery(data, key, name[key]);
        }
      }
    } else if (typeof name === 'string') {
      if (value !== undefined) {
        if (data[name] === value) {
          data[name] = undefined;
        } else if (isArray(data[name])) {
          data[name] = filterArrayValues(data[name], value);
        }
      } else {
        data[name] = undefined;
      }
    } else {
      throw new TypeError('URI.removeQuery() accepts an object, string as the first parameter');
    }
  };
  URI.hasQuery = function(data, name, value, withinArray) {
    if (typeof name === 'object') {
      for (var key in name) {
        if (hasOwn.call(name, key)) {
          if (!URI.hasQuery(data, key, name[key])) {
            return false;
          }
        }
      }

      return true;
    } else if (typeof name !== 'string') {
      throw new TypeError('URI.hasQuery() accepts an object, string as the name parameter');
    }

    switch (getType(value)) {
      case 'Undefined':
        // true if exists (but may be empty)
        return name in data; // data[name] !== undefined;

      case 'Boolean':
        // true if exists and non-empty
        var _booly = Boolean(isArray(data[name]) ? data[name].length : data[name]);
        return value === _booly;

      case 'Function':
        // allow complex comparison
        return !!value(data[name], name, data);

      case 'Array':
        if (!isArray(data[name])) {
          return false;
        }

        var op = withinArray ? arrayContains : arraysEqual;
        return op(data[name], value);

      case 'RegExp':
        if (!isArray(data[name])) {
          return Boolean(data[name] && data[name].match(value));
        }

        if (!withinArray) {
          return false;
        }

        return arrayContains(data[name], value);

      case 'Number':
        value = String(value);
        /* falls through */
      case 'String':
        if (!isArray(data[name])) {
          return data[name] === value;
        }

        if (!withinArray) {
          return false;
        }

        return arrayContains(data[name], value);

      default:
        throw new TypeError('URI.hasQuery() accepts undefined, boolean, string, number, RegExp, Function as the value parameter');
    }
  };


  URI.commonPath = function(one, two) {
    var length = Math.min(one.length, two.length);
    var pos;

    // find first non-matching character
    for (pos = 0; pos < length; pos++) {
      if (one.charAt(pos) !== two.charAt(pos)) {
        pos--;
        break;
      }
    }

    if (pos < 1) {
      return one.charAt(0) === two.charAt(0) && one.charAt(0) === '/' ? '/' : '';
    }

    // revert to last /
    if (one.charAt(pos) !== '/' || two.charAt(pos) !== '/') {
      pos = one.substring(0, pos).lastIndexOf('/');
    }

    return one.substring(0, pos + 1);
  };

  URI.withinString = function(string, callback, options) {
    options || (options = {});
    var _start = options.start || URI.findUri.start;
    var _end = options.end || URI.findUri.end;
    var _trim = options.trim || URI.findUri.trim;
    var _attributeOpen = /[a-z0-9-]=["']?$/i;

    _start.lastIndex = 0;
    while (true) {
      var match = _start.exec(string);
      if (!match) {
        break;
      }

      var start = match.index;
      if (options.ignoreHtml) {
        // attribut(e=["']?$)
        var attributeOpen = string.slice(Math.max(start - 3, 0), start);
        if (attributeOpen && _attributeOpen.test(attributeOpen)) {
          continue;
        }
      }

      var end = start + string.slice(start).search(_end);
      var slice = string.slice(start, end).replace(_trim, '');
      if (options.ignore && options.ignore.test(slice)) {
        continue;
      }

      end = start + slice.length;
      var result = callback(slice, start, end, string);
      string = string.slice(0, start) + result + string.slice(end);
      _start.lastIndex = start + result.length;
    }

    _start.lastIndex = 0;
    return string;
  };

  URI.ensureValidHostname = function(v) {
    // Theoretically URIs allow percent-encoding in Hostnames (according to RFC 3986)
    // they are not part of DNS and therefore ignored by URI.js

    if (v.match(URI.invalid_hostname_characters)) {
      // test punycode
      if (!punycode) {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-] and Punycode.js is not available');
      }

      if (punycode.toASCII(v).match(URI.invalid_hostname_characters)) {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
      }
    }
  };

  // noConflict
  URI.noConflict = function(removeAll) {
    if (removeAll) {
      var unconflicted = {
        URI: this.noConflict()
      };

      if (root.URITemplate && typeof root.URITemplate.noConflict === 'function') {
        unconflicted.URITemplate = root.URITemplate.noConflict();
      }

      if (root.IPv6 && typeof root.IPv6.noConflict === 'function') {
        unconflicted.IPv6 = root.IPv6.noConflict();
      }

      if (root.SecondLevelDomains && typeof root.SecondLevelDomains.noConflict === 'function') {
        unconflicted.SecondLevelDomains = root.SecondLevelDomains.noConflict();
      }

      return unconflicted;
    } else if (root.URI === this) {
      root.URI = _URI;
    }

    return this;
  };

  p.build = function(deferBuild) {
    if (deferBuild === true) {
      this._deferred_build = true;
    } else if (deferBuild === undefined || this._deferred_build) {
      this._string = URI.build(this._parts);
      this._deferred_build = false;
    }

    return this;
  };

  p.clone = function() {
    return new URI(this);
  };

  p.valueOf = p.toString = function() {
    return this.build(false)._string;
  };


  function generateSimpleAccessor(_part){
    return function(v, build) {
      if (v === undefined) {
        return this._parts[_part] || '';
      } else {
        this._parts[_part] = v || null;
        this.build(!build);
        return this;
      }
    };
  }

  function generatePrefixAccessor(_part, _key){
    return function(v, build) {
      if (v === undefined) {
        return this._parts[_part] || '';
      } else {
        if (v !== null) {
          v = v + '';
          if (v.charAt(0) === _key) {
            v = v.substring(1);
          }
        }

        this._parts[_part] = v;
        this.build(!build);
        return this;
      }
    };
  }

  p.protocol = generateSimpleAccessor('protocol');
  p.username = generateSimpleAccessor('username');
  p.password = generateSimpleAccessor('password');
  p.hostname = generateSimpleAccessor('hostname');
  p.port = generateSimpleAccessor('port');
  p.query = generatePrefixAccessor('query', '?');
  p.fragment = generatePrefixAccessor('fragment', '#');

  p.search = function(v, build) {
    var t = this.query(v, build);
    return typeof t === 'string' && t.length ? ('?' + t) : t;
  };
  p.hash = function(v, build) {
    var t = this.fragment(v, build);
    return typeof t === 'string' && t.length ? ('#' + t) : t;
  };

  p.pathname = function(v, build) {
    if (v === undefined || v === true) {
      var res = this._parts.path || (this._parts.hostname ? '/' : '');
      return v ? (this._parts.urn ? URI.decodeUrnPath : URI.decodePath)(res) : res;
    } else {
      if (this._parts.urn) {
        this._parts.path = v ? URI.recodeUrnPath(v) : '';
      } else {
        this._parts.path = v ? URI.recodePath(v) : '/';
      }
      this.build(!build);
      return this;
    }
  };
  p.path = p.pathname;
  p.href = function(href, build) {
    var key;

    if (href === undefined) {
      return this.toString();
    }

    this._string = '';
    this._parts = URI._parts();

    var _URI = href instanceof URI;
    var _object = typeof href === 'object' && (href.hostname || href.path || href.pathname);
    if (href.nodeName) {
      var attribute = URI.getDomAttribute(href);
      href = href[attribute] || '';
      _object = false;
    }

    // window.location is reported to be an object, but it's not the sort
    // of object we're looking for:
    // * location.protocol ends with a colon
    // * location.query != object.search
    // * location.hash != object.fragment
    // simply serializing the unknown object should do the trick
    // (for location, not for everything...)
    if (!_URI && _object && href.pathname !== undefined) {
      href = href.toString();
    }

    if (typeof href === 'string' || href instanceof String) {
      this._parts = URI.parse(String(href), this._parts);
    } else if (_URI || _object) {
      var src = _URI ? href._parts : href;
      for (key in src) {
        if (hasOwn.call(this._parts, key)) {
          this._parts[key] = src[key];
        }
      }
    } else {
      throw new TypeError('invalid input');
    }

    this.build(!build);
    return this;
  };

  // identification accessors
  p.is = function(what) {
    var ip = false;
    var ip4 = false;
    var ip6 = false;
    var name = false;
    var sld = false;
    var idn = false;
    var punycode = false;
    var relative = !this._parts.urn;

    if (this._parts.hostname) {
      relative = false;
      ip4 = URI.ip4_expression.test(this._parts.hostname);
      ip6 = URI.ip6_expression.test(this._parts.hostname);
      ip = ip4 || ip6;
      name = !ip;
      sld = name && SLD && SLD.has(this._parts.hostname);
      idn = name && URI.idn_expression.test(this._parts.hostname);
      punycode = name && URI.punycode_expression.test(this._parts.hostname);
    }

    switch (what.toLowerCase()) {
      case 'relative':
        return relative;

      case 'absolute':
        return !relative;

      // hostname identification
      case 'domain':
      case 'name':
        return name;

      case 'sld':
        return sld;

      case 'ip':
        return ip;

      case 'ip4':
      case 'ipv4':
      case 'inet4':
        return ip4;

      case 'ip6':
      case 'ipv6':
      case 'inet6':
        return ip6;

      case 'idn':
        return idn;

      case 'url':
        return !this._parts.urn;

      case 'urn':
        return !!this._parts.urn;

      case 'punycode':
        return punycode;
    }

    return null;
  };

  // component specific input validation
  var _protocol = p.protocol;
  var _port = p.port;
  var _hostname = p.hostname;

  p.protocol = function(v, build) {
    if (v !== undefined) {
      if (v) {
        // accept trailing ://
        v = v.replace(/:(\/\/)?$/, '');

        if (!v.match(URI.protocol_expression)) {
          throw new TypeError('Protocol "' + v + '" contains characters other than [A-Z0-9.+-] or doesn\'t start with [A-Z]');
        }
      }
    }
    return _protocol.call(this, v, build);
  };
  p.scheme = p.protocol;
  p.port = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v !== undefined) {
      if (v === 0) {
        v = null;
      }

      if (v) {
        v += '';
        if (v.charAt(0) === ':') {
          v = v.substring(1);
        }

        if (v.match(/[^0-9]/)) {
          throw new TypeError('Port "' + v + '" contains characters other than [0-9]');
        }
      }
    }
    return _port.call(this, v, build);
  };
  p.hostname = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v !== undefined) {
      var x = {};
      URI.parseHost(v, x);
      v = x.hostname;
    }
    return _hostname.call(this, v, build);
  };

  // compound accessors
  p.host = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined) {
      return this._parts.hostname ? URI.buildHost(this._parts) : '';
    } else {
      URI.parseHost(v, this._parts);
      this.build(!build);
      return this;
    }
  };
  p.authority = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined) {
      return this._parts.hostname ? URI.buildAuthority(this._parts) : '';
    } else {
      URI.parseAuthority(v, this._parts);
      this.build(!build);
      return this;
    }
  };
  p.userinfo = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined) {
      if (!this._parts.username) {
        return '';
      }

      var t = URI.buildUserinfo(this._parts);
      return t.substring(0, t.length -1);
    } else {
      if (v[v.length-1] !== '@') {
        v += '@';
      }

      URI.parseUserinfo(v, this._parts);
      this.build(!build);
      return this;
    }
  };
  p.resource = function(v, build) {
    var parts;

    if (v === undefined) {
      return this.path() + this.search() + this.hash();
    }

    parts = URI.parse(v);
    this._parts.path = parts.path;
    this._parts.query = parts.query;
    this._parts.fragment = parts.fragment;
    this.build(!build);
    return this;
  };

  // fraction accessors
  p.subdomain = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    // convenience, return "www" from "www.example.org"
    if (v === undefined) {
      if (!this._parts.hostname || this.is('IP')) {
        return '';
      }

      // grab domain and add another segment
      var end = this._parts.hostname.length - this.domain().length - 1;
      return this._parts.hostname.substring(0, end) || '';
    } else {
      var e = this._parts.hostname.length - this.domain().length;
      var sub = this._parts.hostname.substring(0, e);
      var replace = new RegExp('^' + escapeRegEx(sub));

      if (v && v.charAt(v.length - 1) !== '.') {
        v += '.';
      }

      if (v) {
        URI.ensureValidHostname(v);
      }

      this._parts.hostname = this._parts.hostname.replace(replace, v);
      this.build(!build);
      return this;
    }
  };
  p.domain = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (typeof v === 'boolean') {
      build = v;
      v = undefined;
    }

    // convenience, return "example.org" from "www.example.org"
    if (v === undefined) {
      if (!this._parts.hostname || this.is('IP')) {
        return '';
      }

      // if hostname consists of 1 or 2 segments, it must be the domain
      var t = this._parts.hostname.match(/\./g);
      if (t && t.length < 2) {
        return this._parts.hostname;
      }

      // grab tld and add another segment
      var end = this._parts.hostname.length - this.tld(build).length - 1;
      end = this._parts.hostname.lastIndexOf('.', end -1) + 1;
      return this._parts.hostname.substring(end) || '';
    } else {
      if (!v) {
        throw new TypeError('cannot set domain empty');
      }

      URI.ensureValidHostname(v);

      if (!this._parts.hostname || this.is('IP')) {
        this._parts.hostname = v;
      } else {
        var replace = new RegExp(escapeRegEx(this.domain()) + '$');
        this._parts.hostname = this._parts.hostname.replace(replace, v);
      }

      this.build(!build);
      return this;
    }
  };
  p.tld = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (typeof v === 'boolean') {
      build = v;
      v = undefined;
    }

    // return "org" from "www.example.org"
    if (v === undefined) {
      if (!this._parts.hostname || this.is('IP')) {
        return '';
      }

      var pos = this._parts.hostname.lastIndexOf('.');
      var tld = this._parts.hostname.substring(pos + 1);

      if (build !== true && SLD && SLD.list[tld.toLowerCase()]) {
        return SLD.get(this._parts.hostname) || tld;
      }

      return tld;
    } else {
      var replace;

      if (!v) {
        throw new TypeError('cannot set TLD empty');
      } else if (v.match(/[^a-zA-Z0-9-]/)) {
        if (SLD && SLD.is(v)) {
          replace = new RegExp(escapeRegEx(this.tld()) + '$');
          this._parts.hostname = this._parts.hostname.replace(replace, v);
        } else {
          throw new TypeError('TLD "' + v + '" contains characters other than [A-Z0-9]');
        }
      } else if (!this._parts.hostname || this.is('IP')) {
        throw new ReferenceError('cannot set TLD on non-domain host');
      } else {
        replace = new RegExp(escapeRegEx(this.tld()) + '$');
        this._parts.hostname = this._parts.hostname.replace(replace, v);
      }

      this.build(!build);
      return this;
    }
  };
  p.directory = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
      if (!this._parts.path && !this._parts.hostname) {
        return '';
      }

      if (this._parts.path === '/') {
        return '/';
      }

      var end = this._parts.path.length - this.filename().length - 1;
      var res = this._parts.path.substring(0, end) || (this._parts.hostname ? '/' : '');

      return v ? URI.decodePath(res) : res;

    } else {
      var e = this._parts.path.length - this.filename().length;
      var directory = this._parts.path.substring(0, e);
      var replace = new RegExp('^' + escapeRegEx(directory));

      // fully qualifier directories begin with a slash
      if (!this.is('relative')) {
        if (!v) {
          v = '/';
        }

        if (v.charAt(0) !== '/') {
          v = '/' + v;
        }
      }

      // directories always end with a slash
      if (v && v.charAt(v.length - 1) !== '/') {
        v += '/';
      }

      v = URI.recodePath(v);
      this._parts.path = this._parts.path.replace(replace, v);
      this.build(!build);
      return this;
    }
  };
  p.filename = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
      if (!this._parts.path || this._parts.path === '/') {
        return '';
      }

      var pos = this._parts.path.lastIndexOf('/');
      var res = this._parts.path.substring(pos+1);

      return v ? URI.decodePathSegment(res) : res;
    } else {
      var mutatedDirectory = false;

      if (v.charAt(0) === '/') {
        v = v.substring(1);
      }

      if (v.match(/\.?\//)) {
        mutatedDirectory = true;
      }

      var replace = new RegExp(escapeRegEx(this.filename()) + '$');
      v = URI.recodePath(v);
      this._parts.path = this._parts.path.replace(replace, v);

      if (mutatedDirectory) {
        this.normalizePath(build);
      } else {
        this.build(!build);
      }

      return this;
    }
  };
  p.suffix = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
      if (!this._parts.path || this._parts.path === '/') {
        return '';
      }

      var filename = this.filename();
      var pos = filename.lastIndexOf('.');
      var s, res;

      if (pos === -1) {
        return '';
      }

      // suffix may only contain alnum characters (yup, I made this up.)
      s = filename.substring(pos+1);
      res = (/^[a-z0-9%]+$/i).test(s) ? s : '';
      return v ? URI.decodePathSegment(res) : res;
    } else {
      if (v.charAt(0) === '.') {
        v = v.substring(1);
      }

      var suffix = this.suffix();
      var replace;

      if (!suffix) {
        if (!v) {
          return this;
        }

        this._parts.path += '.' + URI.recodePath(v);
      } else if (!v) {
        replace = new RegExp(escapeRegEx('.' + suffix) + '$');
      } else {
        replace = new RegExp(escapeRegEx(suffix) + '$');
      }

      if (replace) {
        v = URI.recodePath(v);
        this._parts.path = this._parts.path.replace(replace, v);
      }

      this.build(!build);
      return this;
    }
  };
  p.segment = function(segment, v, build) {
    var separator = this._parts.urn ? ':' : '/';
    var path = this.path();
    var absolute = path.substring(0, 1) === '/';
    var segments = path.split(separator);

    if (segment !== undefined && typeof segment !== 'number') {
      build = v;
      v = segment;
      segment = undefined;
    }

    if (segment !== undefined && typeof segment !== 'number') {
      throw new Error('Bad segment "' + segment + '", must be 0-based integer');
    }

    if (absolute) {
      segments.shift();
    }

    if (segment < 0) {
      // allow negative indexes to address from the end
      segment = Math.max(segments.length + segment, 0);
    }

    if (v === undefined) {
      /*jshint laxbreak: true */
      return segment === undefined
        ? segments
        : segments[segment];
      /*jshint laxbreak: false */
    } else if (segment === null || segments[segment] === undefined) {
      if (isArray(v)) {
        segments = [];
        // collapse empty elements within array
        for (var i=0, l=v.length; i < l; i++) {
          if (!v[i].length && (!segments.length || !segments[segments.length -1].length)) {
            continue;
          }

          if (segments.length && !segments[segments.length -1].length) {
            segments.pop();
          }

          segments.push(v[i]);
        }
      } else if (v || typeof v === 'string') {
        if (segments[segments.length -1] === '') {
          // empty trailing elements have to be overwritten
          // to prevent results such as /foo//bar
          segments[segments.length -1] = v;
        } else {
          segments.push(v);
        }
      }
    } else {
      if (v) {
        segments[segment] = v;
      } else {
        segments.splice(segment, 1);
      }
    }

    if (absolute) {
      segments.unshift('');
    }

    return this.path(segments.join(separator), build);
  };
  p.segmentCoded = function(segment, v, build) {
    var segments, i, l;

    if (typeof segment !== 'number') {
      build = v;
      v = segment;
      segment = undefined;
    }

    if (v === undefined) {
      segments = this.segment(segment, v, build);
      if (!isArray(segments)) {
        segments = segments !== undefined ? URI.decode(segments) : undefined;
      } else {
        for (i = 0, l = segments.length; i < l; i++) {
          segments[i] = URI.decode(segments[i]);
        }
      }

      return segments;
    }

    if (!isArray(v)) {
      v = (typeof v === 'string' || v instanceof String) ? URI.encode(v) : v;
    } else {
      for (i = 0, l = v.length; i < l; i++) {
        v[i] = URI.decode(v[i]);
      }
    }

    return this.segment(segment, v, build);
  };

  // mutating query string
  var q = p.query;
  p.query = function(v, build) {
    if (v === true) {
      return URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    } else if (typeof v === 'function') {
      var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
      var result = v.call(this, data);
      this._parts.query = URI.buildQuery(result || data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
      this.build(!build);
      return this;
    } else if (v !== undefined && typeof v !== 'string') {
      this._parts.query = URI.buildQuery(v, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
      this.build(!build);
      return this;
    } else {
      return q.call(this, v, build);
    }
  };
  p.setQuery = function(name, value, build) {
    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);

    if (typeof name === 'string' || name instanceof String) {
      data[name] = value !== undefined ? value : null;
    } else if (typeof name === 'object') {
      for (var key in name) {
        if (hasOwn.call(name, key)) {
          data[key] = name[key];
        }
      }
    } else {
      throw new TypeError('URI.addQuery() accepts an object, string as the name parameter');
    }

    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
    if (typeof name !== 'string') {
      build = value;
    }

    this.build(!build);
    return this;
  };
  p.addQuery = function(name, value, build) {
    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    URI.addQuery(data, name, value === undefined ? null : value);
    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
    if (typeof name !== 'string') {
      build = value;
    }

    this.build(!build);
    return this;
  };
  p.removeQuery = function(name, value, build) {
    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    URI.removeQuery(data, name, value);
    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
    if (typeof name !== 'string') {
      build = value;
    }

    this.build(!build);
    return this;
  };
  p.hasQuery = function(name, value, withinArray) {
    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    return URI.hasQuery(data, name, value, withinArray);
  };
  p.setSearch = p.setQuery;
  p.addSearch = p.addQuery;
  p.removeSearch = p.removeQuery;
  p.hasSearch = p.hasQuery;

  // sanitizing URLs
  p.normalize = function() {
    if (this._parts.urn) {
      return this
        .normalizeProtocol(false)
        .normalizePath(false)
        .normalizeQuery(false)
        .normalizeFragment(false)
        .build();
    }

    return this
      .normalizeProtocol(false)
      .normalizeHostname(false)
      .normalizePort(false)
      .normalizePath(false)
      .normalizeQuery(false)
      .normalizeFragment(false)
      .build();
  };
  p.normalizeProtocol = function(build) {
    if (typeof this._parts.protocol === 'string') {
      this._parts.protocol = this._parts.protocol.toLowerCase();
      this.build(!build);
    }

    return this;
  };
  p.normalizeHostname = function(build) {
    if (this._parts.hostname) {
      if (this.is('IDN') && punycode) {
        this._parts.hostname = punycode.toASCII(this._parts.hostname);
      } else if (this.is('IPv6') && IPv6) {
        this._parts.hostname = IPv6.best(this._parts.hostname);
      }

      this._parts.hostname = this._parts.hostname.toLowerCase();
      this.build(!build);
    }

    return this;
  };
  p.normalizePort = function(build) {
    // remove port of it's the protocol's default
    if (typeof this._parts.protocol === 'string' && this._parts.port === URI.defaultPorts[this._parts.protocol]) {
      this._parts.port = null;
      this.build(!build);
    }

    return this;
  };
  p.normalizePath = function(build) {
    var _path = this._parts.path;
    if (!_path) {
      return this;
    }

    if (this._parts.urn) {
      this._parts.path = URI.recodeUrnPath(this._parts.path);
      this.build(!build);
      return this;
    }

    if (this._parts.path === '/') {
      return this;
    }

    var _was_relative;
    var _leadingParents = '';
    var _parent, _pos;

    // handle relative paths
    if (_path.charAt(0) !== '/') {
      _was_relative = true;
      _path = '/' + _path;
    }

    // resolve simples
    _path = _path
      .replace(/(\/(\.\/)+)|(\/\.$)/g, '/')
      .replace(/\/{2,}/g, '/');

    // remember leading parents
    if (_was_relative) {
      _leadingParents = _path.substring(1).match(/^(\.\.\/)+/) || '';
      if (_leadingParents) {
        _leadingParents = _leadingParents[0];
      }
    }

    // resolve parents
    while (true) {
      _parent = _path.indexOf('/..');
      if (_parent === -1) {
        // no more ../ to resolve
        break;
      } else if (_parent === 0) {
        // top level cannot be relative, skip it
        _path = _path.substring(3);
        continue;
      }

      _pos = _path.substring(0, _parent).lastIndexOf('/');
      if (_pos === -1) {
        _pos = _parent;
      }
      _path = _path.substring(0, _pos) + _path.substring(_parent + 3);
    }

    // revert to relative
    if (_was_relative && this.is('relative')) {
      _path = _leadingParents + _path.substring(1);
    }

    _path = URI.recodePath(_path);
    this._parts.path = _path;
    this.build(!build);
    return this;
  };
  p.normalizePathname = p.normalizePath;
  p.normalizeQuery = function(build) {
    if (typeof this._parts.query === 'string') {
      if (!this._parts.query.length) {
        this._parts.query = null;
      } else {
        this.query(URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace));
      }

      this.build(!build);
    }

    return this;
  };
  p.normalizeFragment = function(build) {
    if (!this._parts.fragment) {
      this._parts.fragment = null;
      this.build(!build);
    }

    return this;
  };
  p.normalizeSearch = p.normalizeQuery;
  p.normalizeHash = p.normalizeFragment;

  p.iso8859 = function() {
    // expect unicode input, iso8859 output
    var e = URI.encode;
    var d = URI.decode;

    URI.encode = escape;
    URI.decode = decodeURIComponent;
    try {
      this.normalize();
    } finally {
      URI.encode = e;
      URI.decode = d;
    }
    return this;
  };

  p.unicode = function() {
    // expect iso8859 input, unicode output
    var e = URI.encode;
    var d = URI.decode;

    URI.encode = strictEncodeURIComponent;
    URI.decode = unescape;
    try {
      this.normalize();
    } finally {
      URI.encode = e;
      URI.decode = d;
    }
    return this;
  };

  p.readable = function() {
    var uri = this.clone();
    // removing username, password, because they shouldn't be displayed according to RFC 3986
    uri.username('').password('').normalize();
    var t = '';
    if (uri._parts.protocol) {
      t += uri._parts.protocol + '://';
    }

    if (uri._parts.hostname) {
      if (uri.is('punycode') && punycode) {
        t += punycode.toUnicode(uri._parts.hostname);
        if (uri._parts.port) {
          t += ':' + uri._parts.port;
        }
      } else {
        t += uri.host();
      }
    }

    if (uri._parts.hostname && uri._parts.path && uri._parts.path.charAt(0) !== '/') {
      t += '/';
    }

    t += uri.path(true);
    if (uri._parts.query) {
      var q = '';
      for (var i = 0, qp = uri._parts.query.split('&'), l = qp.length; i < l; i++) {
        var kv = (qp[i] || '').split('=');
        q += '&' + URI.decodeQuery(kv[0], this._parts.escapeQuerySpace)
          .replace(/&/g, '%26');

        if (kv[1] !== undefined) {
          q += '=' + URI.decodeQuery(kv[1], this._parts.escapeQuerySpace)
            .replace(/&/g, '%26');
        }
      }
      t += '?' + q.substring(1);
    }

    t += URI.decodeQuery(uri.hash(), true);
    return t;
  };

  // resolving relative and absolute URLs
  p.absoluteTo = function(base) {
    var resolved = this.clone();
    var properties = ['protocol', 'username', 'password', 'hostname', 'port'];
    var basedir, i, p;

    if (this._parts.urn) {
      throw new Error('URNs do not have any generally defined hierarchical components');
    }

    if (!(base instanceof URI)) {
      base = new URI(base);
    }

    if (!resolved._parts.protocol) {
      resolved._parts.protocol = base._parts.protocol;
    }

    if (this._parts.hostname) {
      return resolved;
    }

    for (i = 0; (p = properties[i]); i++) {
      resolved._parts[p] = base._parts[p];
    }

    if (!resolved._parts.path) {
      resolved._parts.path = base._parts.path;
      if (!resolved._parts.query) {
        resolved._parts.query = base._parts.query;
      }
    } else if (resolved._parts.path.substring(-2) === '..') {
      resolved._parts.path += '/';
    }

    if (resolved.path().charAt(0) !== '/') {
      basedir = base.directory();
      basedir = basedir ? basedir : base.path().indexOf('/') === 0 ? '/' : '';
      resolved._parts.path = (basedir ? (basedir + '/') : '') + resolved._parts.path;
      resolved.normalizePath();
    }

    resolved.build();
    return resolved;
  };
  p.relativeTo = function(base) {
    var relative = this.clone().normalize();
    var relativeParts, baseParts, common, relativePath, basePath;

    if (relative._parts.urn) {
      throw new Error('URNs do not have any generally defined hierarchical components');
    }

    base = new URI(base).normalize();
    relativeParts = relative._parts;
    baseParts = base._parts;
    relativePath = relative.path();
    basePath = base.path();

    if (relativePath.charAt(0) !== '/') {
      throw new Error('URI is already relative');
    }

    if (basePath.charAt(0) !== '/') {
      throw new Error('Cannot calculate a URI relative to another relative URI');
    }

    if (relativeParts.protocol === baseParts.protocol) {
      relativeParts.protocol = null;
    }

    if (relativeParts.username !== baseParts.username || relativeParts.password !== baseParts.password) {
      return relative.build();
    }

    if (relativeParts.protocol !== null || relativeParts.username !== null || relativeParts.password !== null) {
      return relative.build();
    }

    if (relativeParts.hostname === baseParts.hostname && relativeParts.port === baseParts.port) {
      relativeParts.hostname = null;
      relativeParts.port = null;
    } else {
      return relative.build();
    }

    if (relativePath === basePath) {
      relativeParts.path = '';
      return relative.build();
    }

    // determine common sub path
    common = URI.commonPath(relative.path(), base.path());

    // If the paths have nothing in common, return a relative URL with the absolute path.
    if (!common) {
      return relative.build();
    }

    var parents = baseParts.path
      .substring(common.length)
      .replace(/[^\/]*$/, '')
      .replace(/.*?\//g, '../');

    relativeParts.path = parents + relativeParts.path.substring(common.length);

    return relative.build();
  };

  // comparing URIs
  p.equals = function(uri) {
    var one = this.clone();
    var two = new URI(uri);
    var one_map = {};
    var two_map = {};
    var checked = {};
    var one_query, two_query, key;

    one.normalize();
    two.normalize();

    // exact match
    if (one.toString() === two.toString()) {
      return true;
    }

    // extract query string
    one_query = one.query();
    two_query = two.query();
    one.query('');
    two.query('');

    // definitely not equal if not even non-query parts match
    if (one.toString() !== two.toString()) {
      return false;
    }

    // query parameters have the same length, even if they're permuted
    if (one_query.length !== two_query.length) {
      return false;
    }

    one_map = URI.parseQuery(one_query, this._parts.escapeQuerySpace);
    two_map = URI.parseQuery(two_query, this._parts.escapeQuerySpace);

    for (key in one_map) {
      if (hasOwn.call(one_map, key)) {
        if (!isArray(one_map[key])) {
          if (one_map[key] !== two_map[key]) {
            return false;
          }
        } else if (!arraysEqual(one_map[key], two_map[key])) {
          return false;
        }

        checked[key] = true;
      }
    }

    for (key in two_map) {
      if (hasOwn.call(two_map, key)) {
        if (!checked[key]) {
          // two contains a parameter not present in one
          return false;
        }
      }
    }

    return true;
  };

  // state
  p.duplicateQueryParameters = function(v) {
    this._parts.duplicateQueryParameters = !!v;
    return this;
  };

  p.escapeQuerySpace = function(v) {
    this._parts.escapeQuerySpace = !!v;
    return this;
  };

  return URI;
}));

},{"./IPv6":2,"./SecondLevelDomains":3,"./punycode":5}],5:[function(require,module,exports){
(function (global){
/*! http://mths.be/punycode v1.2.3 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports;
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^ -~]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /\x2E|\u3002|\uFF0E|\uFF61/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		while (length--) {
			array[length] = fn(array[length]);
		}
		return array;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings.
	 * @private
	 * @param {String} domain The domain name.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		return map(string.split(regexSeparators), fn).join('.');
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <http://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * http://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    length,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols to a Punycode string of ASCII-only
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name to Unicode. Only the
	 * Punycoded parts of the domain name will be converted, i.e. it doesn't
	 * matter if you call it on a string that has already been converted to
	 * Unicode.
	 * @memberOf punycode
	 * @param {String} domain The Punycode domain name to convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(domain) {
		return mapDomain(domain, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name to Punycode. Only the
	 * non-ASCII parts of the domain name will be converted, i.e. it doesn't
	 * matter if you call it with a domain that's already in ASCII.
	 * @memberOf punycode
	 * @param {String} domain The domain name to convert, as a Unicode string.
	 * @returns {String} The Punycode representation of the given domain name.
	 */
	function toASCII(domain) {
		return mapDomain(domain, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.2.3',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <http://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define(function() {
			return punycode;
		});
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else { // in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],6:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var SharedUtils = _interopRequireWildcard(require("../utils/SharedUtils"));

var SearchClient = _interopRequireWildcard(require("../clients/SearchClient"));

var FilterBarActor = exports.FilterBarActor = (function () {
  function FilterBarActor(filterBarStore, tableStore) {
    _classCallCheck(this, FilterBarActor);

    this.filterBarStore = filterBarStore;
    this.tableStore = tableStore;
  }

  _createClass(FilterBarActor, {
    getSavedSearches: {
      value: function getSavedSearches() {
        return this.filterBarStore.getSavedSearches() || [];
      }
    },
    getFilter: {
      value: function getFilter(filterUid) {
        return this.filterBarStore.getFilter(filterUid);
      }
    },
    enableFilter: {
      value: function enableFilter(filterUid, value) {
        this.filterBarStore.enableFilter(filterUid, value);
      }
    },
    disableFilter: {
      value: function disableFilter(filterUid) {
        this.filterBarStore.disableFilter(filterUid);
      }
    },
    disableAllFilters: {
      value: function disableAllFilters() {
        this.filterBarStore.disableAllFilters();
        this.applyFilters();
      }
    },
    updateFilter: {
      value: function updateFilter(filterUid, propKey, propValue) {
        this.filterBarStore.updateFilter(filterUid, propKey, propValue);
      }
    },
    getEnabled: {
      value: function getEnabled() {
        return this.filterBarStore.getEnabled();
      }
    },
    getDisabled: {
      value: function getDisabled() {
        return this.filterBarStore.getDisabled();
      }
    },
    applyFilters: {
      value: function applyFilters() {
        var url = this.filterBarStore.getSearchUrl();
        var query = this.filterBarStore.getQuery();
        var page = this.tableStore.getCurrentPage();

        SearchClient.search(url, query, page, this.tableStore.updateTable.bind(this.tableStore));

        if (this.filterBarStore.persistent) {
          SharedUtils.updateUrl("q", query);
        }
      }
    },
    loadSavedSearch: {
      value: function loadSavedSearch(searchId) {
        this.disableAllFilters();

        var tim = setTimeout((function () {
          var savedSearch = this.filterBarStore.getSavedSearch(searchId);
          var filters = JSON.parse(savedSearch.configuration);

          for (var filter in filters) {
            this.enableFilter(filter, filters[filter]);
          }

          this.applyFilters();
        }).bind(this), 1000);
      }
    },
    saveFilters: {
      value: function saveFilters(name) {
        var enabledFilters = this.filterBarStore.getEnabled(),
            savedFiltersPacket = {};
        savedFiltersPacket.search_title = name;
        savedFiltersPacket.filters = {};
        for (var filterUid in enabledFilters) {
          savedFiltersPacket.filters[filterUid] = enabledFilters[filterUid].value;
        }
        SharedUtils.ajaxPost(this.filterBarStore.getSaveSearchUrl(), "json", savedFiltersPacket);
        this.applyFilters();
      }
    },
    getOptionsFromServer: {
      value: function getOptionsFromServer(filterUid) {
        var filter = this.getFilter(filterUid);

        var url = filter.url;

        SharedUtils.ajaxGet(url, "json", (function (response) {
          this.updateFilter(filterUid, "options", response);
        }).bind(this));
      }
    }
  });

  return FilterBarActor;
})();

},{"../clients/SearchClient":9,"../utils/SharedUtils":31}],7:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var SharedUtils = _interopRequireWildcard(require("../utils/SharedUtils"));

var TableActor = exports.TableActor = (function () {
  function TableActor(filterBarStore, tableStore) {
    _classCallCheck(this, TableActor);

    this.filterBarStore = filterBarStore;
    this.tableStore = tableStore;
  }

  _createClass(TableActor, {
    getColumnHeadings: {
      value: function getColumnHeadings() {
        return this.tableStore.getColumnHeadings();
      }
    },
    getRows: {
      value: function getRows() {
        return this.tableStore.getRows();
      }
    },
    getCurrentPage: {
      value: function getCurrentPage() {
        return this.tableStore.getCurrentPage();
      }
    },
    getTotalPages: {
      value: function getTotalPages() {
        return this.tableStore.getTotalPages();
      }
    },
    fetchPagedData: {
      value: function fetchPagedData(page) {
        var id = this.tableStore.getId();
        var currentUrl = this.tableStore.getUrl();
        var newUrl = currentUrl + "page=" + page + "&";

        if (this.filterBarStore.persistent) {
          SharedUtils.updateUrl("page", page);
        }

        this.tableStore.setCurrentPage(page);
        this.tableStore.fetchData();
      }
    }
  });

  return TableActor;
})();

},{"../utils/SharedUtils":31}],8:[function(require,module,exports){
"use strict";

exports.updateFilterOptions = updateFilterOptions;
Object.defineProperty(exports, "__esModule", {
  value: true
});

function updateFilterOptions(filter) {
  var url = filter.url;

  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    success: function success(data) {
      filter.options = data;
    },
    error: (function (_error) {
      var _errorWrapper = function error(_x, _x2, _x3) {
        return _error.apply(this, arguments);
      };

      _errorWrapper.toString = function () {
        return _error.toString();
      };

      return _errorWrapper;
    })(function (xhr, status, error) {
      alert("Something went wrong, please contact support");
      console.error(xhr);
      console.error(status);
      console.status(error);
    })
  });
}

},{}],9:[function(require,module,exports){
"use strict";

exports.search = search;
exports.saveSearch = saveSearch;
exports.getSavedSearches = getSavedSearches;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var URI = require("URIjs");
window.URI = URI;

function search(url, query, page, success) {
  var url = URI(url).addSearch("q", query).addSearch("page", page);

  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    success: (function (_success) {
      var _successWrapper = function success(_x) {
        return _success.apply(this, arguments);
      };

      _successWrapper.toString = function () {
        return _success.toString();
      };

      return _successWrapper;
    })(function (data) {
      success(data);
    }),
    error: (function (_error) {
      var _errorWrapper = function error(_x, _x2, _x3) {
        return _error.apply(this, arguments);
      };

      _errorWrapper.toString = function () {
        return _error.toString();
      };

      return _errorWrapper;
    })(function (xhr, status, error) {
      alert("Something went wrong, please contact support");
      console.error(xhr);
      console.error(status);
      console.status(error);
    })
  });
}

function saveSearch() {
  var response = "";

  return response;
}

function getSavedSearches(url, success) {
  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    success: (function (_success) {
      var _successWrapper = function success(_x) {
        return _success.apply(this, arguments);
      };

      _successWrapper.toString = function () {
        return _success.toString();
      };

      return _successWrapper;
    })(function (data) {
      success(data);
    }),
    error: (function (_error) {
      var _errorWrapper = function error(_x, _x2, _x3) {
        return _error.apply(this, arguments);
      };

      _errorWrapper.toString = function () {
        return _error.toString();
      };

      return _errorWrapper;
    })(function (xhr, status, error) {
      alert("Something went wrong, please contact support");
      console.error(xhr);
      console.error(status);
      console.status(error);
    })
  });
}

},{"URIjs":4}],10:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ApplyFiltersButton = exports.ApplyFiltersButton = (function (_React$Component) {
  function ApplyFiltersButton(props) {
    _classCallCheck(this, ApplyFiltersButton);

    _get(Object.getPrototypeOf(ApplyFiltersButton.prototype), "constructor", this).call(this, props);
  }

  _inherits(ApplyFiltersButton, _React$Component);

  _createClass(ApplyFiltersButton, {
    _onClick: {
      value: function _onClick() {
        this.props.filterBarActor.applyFilters();
      }
    },
    render: {
      value: function render() {
        return React.createElement(
          "button",
          { className: "btn btn-primary", onClick: this._onClick.bind(this) },
          React.createElement("i", { className: "icon icon-tick" }),
          "Apply"
        );
      }
    }
  });

  return ApplyFiltersButton;
})(React.Component);

},{}],11:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ClearFiltersButton = exports.ClearFiltersButton = (function (_React$Component) {
  function ClearFiltersButton(props) {
    _classCallCheck(this, ClearFiltersButton);

    _get(Object.getPrototypeOf(ClearFiltersButton.prototype), "constructor", this).call(this, props);
  }

  _inherits(ClearFiltersButton, _React$Component);

  _createClass(ClearFiltersButton, {
    _onClick: {
      value: function _onClick() {
        this.props.filterBarActor.disableAllFilters();
      }
    },
    render: {
      value: function render() {
        return React.createElement(
          "button",
          { className: "btn btn-warning", onClick: this._onClick.bind(this) },
          React.createElement("i", { className: "icon icon-delete" }),
          "Clear"
        );
      }
    }
  });

  return ClearFiltersButton;
})(React.Component);

},{}],12:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var FilterList = require("./FilterList/FilterList.react").FilterList;

var FilterDisplay = require("./FilterDisplay/FilterDisplay.react").FilterDisplay;

var ApplyFiltersButton = require("./ApplyFiltersButton.react").ApplyFiltersButton;

var ClearFiltersButton = require("./ClearFiltersButton.react").ClearFiltersButton;

var SaveFiltersButton = require("./SaveFiltersButton.react").SaveFiltersButton;

var SavedSearchesList = require("./SavedSearchesList/SavedSearchesList.react").SavedSearchesList;

var FilterBar = exports.FilterBar = (function (_React$Component) {
  function FilterBar(props) {
    _classCallCheck(this, FilterBar);

    _get(Object.getPrototypeOf(FilterBar.prototype), "constructor", this).call(this, props);

    this.filterBarActor = props.filterBarActor;
    this.filterBarStore = props.filterBarStore;
  }

  _inherits(FilterBar, _React$Component);

  _createClass(FilterBar, {
    render: {
      value: function render() {
        return React.createElement(
          "div",
          null,
          React.createElement(
            "div",
            null,
            React.createElement(
              "div",
              { className: "btn-group margin-bottom-sm" },
              React.createElement(FilterList, {
                filterBarActor: this.filterBarActor,
                filterBarStore: this.filterBarStore
              }),
              React.createElement(
                "button",
                { type: "button", className: "btn btn-default disabled" },
                React.createElement("i", { className: "icon icon-download" }),
                "Export CSV"
              ),
              React.createElement(ApplyFiltersButton, {
                filterBarActor: this.filterBarActor
              }),
              React.createElement(ClearFiltersButton, {
                filterBarActor: this.filterBarActor
              }),
              React.createElement(SaveFiltersButton, {
                filterBarActor: this.filterBarActor
              }),
              React.createElement(SavedSearchesList, {
                filterBarActor: this.filterBarActor,
                filterBarStore: this.filterBarStore
              })
            ),
            React.createElement(FilterDisplay, {
              filterBarActor: this.filterBarActor,
              filterBarStore: this.filterBarStore
            })
          )
        );
      }
    }
  });

  return FilterBar;
})(React.Component);

},{"./ApplyFiltersButton.react":10,"./ClearFiltersButton.react":11,"./FilterDisplay/FilterDisplay.react":13,"./FilterList/FilterList.react":18,"./SaveFiltersButton.react":20,"./SavedSearchesList/SavedSearchesList.react":21}],13:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var FilterInput = require("./FilterInput.react").FilterInput;

var FilterDisplay = exports.FilterDisplay = (function (_React$Component) {
  function FilterDisplay(props) {
    _classCallCheck(this, FilterDisplay);

    _get(Object.getPrototypeOf(FilterDisplay.prototype), "constructor", this).call(this, props);
    this.filterBarActor = props.filterBarActor;
    this.filterBarStore = props.filterBarStore;
    this.state = this.getStateFromStores();

    this.filterBarStore.addChangeListener(this._onChange.bind(this));
  }

  _inherits(FilterDisplay, _React$Component);

  _createClass(FilterDisplay, {
    _onChange: {
      value: function _onChange() {
        this.setState(this.getStateFromStores());
      }
    },
    getStateFromStores: {
      value: function getStateFromStores() {
        return {
          filters: this.filterBarActor.getEnabled()
        };
      }
    },
    render: {
      value: function render() {
        var filters = Object.keys(this.state.filters).map(function (filterUid) {
          return React.createElement(FilterInput, {
            key: filterUid,
            filterUid: filterUid,
            filter: this.state.filters[filterUid],
            filterBarActor: this.filterBarActor
          });
        }, this);

        if (filters.length === 0) {
          filters = React.createElement(
            "div",
            null,
            "No Filters Enabled!"
          );
        }

        return React.createElement(
          "div",
          { className: "navbar filterbar" },
          React.createElement(
            "div",
            { className: "panel panel-default" },
            filters
          )
        );
      }
    }
  });

  return FilterDisplay;
})(React.Component);

},{"./FilterInput.react":14}],14:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var TextInput = require("./Inputs/TextInput.react").TextInput;

var DateInput = require("./Inputs/DateInput.react").DateInput;

var SelectInput = require("./Inputs/SelectInput.react").SelectInput;

var FilterInput = exports.FilterInput = (function (_React$Component) {
  function FilterInput(props) {
    _classCallCheck(this, FilterInput);

    _get(Object.getPrototypeOf(FilterInput.prototype), "constructor", this).call(this, props);

    this.filterBarActor = props.filterBarActor;
    this.filterUid = props.filterUid;
  }

  _inherits(FilterInput, _React$Component);

  _createClass(FilterInput, {
    _onClick: {
      value: function _onClick() {
        this.filterBarActor.disableFilter(this.filterUid);
      }
    },
    inputFactory: {
      value: function inputFactory() {
        var type = this.props.filter.type;
        if (type == "text" || type == "id") {
          return React.createElement(TextInput, {
            filterBarActor: this.filterBarActor,
            filterUid: this.filterUid
          });
        } else if (type == "date") {
          return React.createElement(DateInput, {
            filterBarActor: this.filterBarActor,
            filterUid: this.props.filterUid
          });
        } else if (type == "select") {
          return React.createElement(SelectInput, {
            filterBarActor: this.filterBarActor,
            filterUid: this.props.filterUid
          });
        } else if (type == "age_select") {
          return React.createElement(AgeSelectInput, {
            filterBarActor: this.filterBarActor,
            filterUid: this.props.filterUid
          });
        } else {
          console.error("Not implemented yet!");
        }
      }
    },
    render: {
      value: function render() {
        var inputs = this.inputFactory();
        return React.createElement(
          "div",
          { className: "col-lg-3 col-md-4 col-sm-6 col-xs-12 filter" },
          React.createElement(
            "ul",
            { className: this.filterKey },
            React.createElement(
              "li",
              null,
              React.createElement("i", { onClick: this._onClick.bind(this), className: "btn btn-circle-primary btn-xs icon icon-close remove-filter" }),
              React.createElement(
                "label",
                null,
                this.props.filter.label
              )
            ),
            inputs
          )
        );
      }
    }
  });

  return FilterInput;
})(React.Component);

},{"./Inputs/DateInput.react":15,"./Inputs/SelectInput.react":16,"./Inputs/TextInput.react":17}],15:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var DateInput = exports.DateInput = (function (_React$Component) {
  function DateInput(props) {
    _classCallCheck(this, DateInput);

    _get(Object.getPrototypeOf(DateInput.prototype), "constructor", this).call(this, props);

    this.state = { value: this.props.filterBarActor.getFilter(this.props.filterUid).value || { from: null, to: null } };
  }

  _inherits(DateInput, _React$Component);

  _createClass(DateInput, {
    _onChange: {
      value: function _onChange(event) {
        var newValue = this.state.value;

        if (event.type === "dp") {
          newValue[event.target.querySelector("input").getAttribute("placeholder")] = event.target.querySelector("input").value;
        } else if (event.type === "input") {
          newValue[event.target.getAttribute("placeholder")] = event.target.value;
        }

        this.setState({ value: newValue });
        this.props.filterBarActor.updateFilter(this.props.filterUid, "value", newValue);
      }
    },
    componentDidMount: {
      value: function componentDidMount() {
        var datePickerFrom = $(React.findDOMNode(this.refs.dateRangeFrom));
        datePickerFrom.datetimepicker({ format: "DD-MM-YYYY" });
        datePickerFrom.datetimepicker().on("dp.change", this._onChange.bind(this));

        var datePickerTo = $(React.findDOMNode(this.refs.dateRangeTo));
        datePickerTo.datetimepicker({ format: "DD-MM-YYYY" });
        datePickerTo.datetimepicker().on("dp.change", this._onChange.bind(this));
      }
    },
    render: {
      value: function render() {
        return React.createElement(
          "li",
          null,
          React.createElement(
            "div",
            { className: "input-group datepicker dateRangeFrom", ref: "dateRangeFrom" },
            React.createElement("input", {
              className: "form-control",
              type: "text",
              "data-date-format": "DD/MM/YYYY",
              "aria-required": "true",
              placeholder: "from",
              onChange: this._onChange.bind(this),
              value: this.state.value.from
            }),
            React.createElement(
              "span",
              { className: "input-group-addon" },
              React.createElement("span", { className: "icon-calendar icon", "aria-hidden": "true" }),
              React.createElement(
                "span",
                { className: "sr-only icon icon-calendar" },
                "Calendar"
              )
            )
          ),
          React.createElement(
            "div",
            { className: "input-group datepicker dateRangeTo", ref: "dateRangeTo" },
            React.createElement("input", {
              className: "form-control",
              type: "text",
              "data-date-format": "DD/MM/YYYY",
              "aria-required": "true",
              placeholder: "to",
              onChange: this._onChange.bind(this),
              value: this.state.value.to
            }),
            React.createElement(
              "span",
              { className: "input-group-addon" },
              React.createElement("span", { className: "icon-calendar icon", "aria-hidden": "true" }),
              React.createElement(
                "span",
                { className: "sr-only icon icon-calendar" },
                "Calendar"
              )
            )
          )
        );
      }
    }
  });

  return DateInput;
})(React.Component);

},{}],16:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var SelectInput = exports.SelectInput = (function (_React$Component) {
  function SelectInput(props) {
    _classCallCheck(this, SelectInput);

    _get(Object.getPrototypeOf(SelectInput.prototype), "constructor", this).call(this, props);
    var filter = props.filterBarActor.getFilter(props.filterUid);

    this.state = { value: filter.value || filter.options[0].value };
    this.props.filterBarActor.updateFilter(this.props.filterUid, "value", this.state.value);
  }

  _inherits(SelectInput, _React$Component);

  _createClass(SelectInput, {
    _onChange: {
      value: function _onChange(event) {
        this.setState({ value: event.target.value });
        this.props.filterBarActor.updateFilter(this.props.filterUid, "value", event.target.value);
      }
    },
    render: {
      value: function render() {
        var options = this.props.filterBarActor.getFilter(this.props.filterUid).options || [];

        options = options.map(function (option) {
          return React.createElement(
            "option",
            { value: option.value },
            option.label
          );
        }, this);

        return React.createElement(
          "li",
          null,
          React.createElement(
            "select",
            {
              className: "form-control",
              selected: this.state.value,
              onChange: this._onChange.bind(this)
            },
            options
          )
        );
      }
    }
  });

  return SelectInput;
})(React.Component);

},{}],17:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var TextInput = exports.TextInput = (function (_React$Component) {
  function TextInput(props) {
    _classCallCheck(this, TextInput);

    _get(Object.getPrototypeOf(TextInput.prototype), "constructor", this).call(this, props);
    this.filterBarActor = props.filterBarActor;
    this.filterUid = props.filterUid;

    this.state = { value: this.filterBarActor.getFilter(this.filterUid).value };
  }

  _inherits(TextInput, _React$Component);

  _createClass(TextInput, {
    _onChange: {
      value: function _onChange(event) {
        this.setState({ value: event.target.value });
        this.filterBarActor.updateFilter(this.filterUid, "value", event.target.value);
      }
    },
    render: {
      value: function render() {
        return React.createElement(
          "li",
          null,
          React.createElement("input", {
            className: "form-control",
            type: "text",
            value: this.state.value,
            onChange: this._onChange.bind(this)
          })
        );
      }
    }
  });

  return TextInput;
})(React.Component);

},{}],18:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var FilterListOption = require("./FilterListOption.react").FilterListOption;

var FilterList = exports.FilterList = (function (_React$Component) {
  function FilterList(props) {
    _classCallCheck(this, FilterList);

    _get(Object.getPrototypeOf(FilterList.prototype), "constructor", this).call(this, props);
    this.filterBarActor = props.filterBarActor;
    this.filterBarStore = props.filterBarStore;

    this.filterBarStore.addChangeListener(this._onChange.bind(this));
    this.state = this.getStateFromStores();
  }

  _inherits(FilterList, _React$Component);

  _createClass(FilterList, {
    _onChange: {
      value: function _onChange() {
        this.setState(this.getStateFromStores());
      }
    },
    getStateFromStores: {
      value: function getStateFromStores() {
        return {
          filters: this.filterBarActor.getDisabled()
        };
      }
    },
    render: {
      value: function render() {
        var filter = {};
        var optionKey = "";
        var filterOptions = Object.keys(this.state.filters).map(function (filterUid) {
          optionKey = "option-" + filterUid;
          return React.createElement(FilterListOption, {
            key: optionKey,
            filterUid: filterUid,
            filterBarActor: this.filterBarActor
          });
        }, this);
        return React.createElement(
          "div",
          { className: "btn-group" },
          React.createElement(
            "button",
            { className: "btn btn-default dropdown-toggle", "data-toggle": "dropdown", type: "button" },
            React.createElement("i", { className: "icon icon-add" }),
            "Add Filter",
            React.createElement("i", { className: "icon icon-chevron-down" })
          ),
          React.createElement(
            "ul",
            { className: "dropdown-menu", role: "menu" },
            filterOptions
          )
        );
      }
    }
  });

  return FilterList;
})(React.Component);

},{"./FilterListOption.react":19}],19:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var FilterListOption = exports.FilterListOption = (function (_React$Component) {
  function FilterListOption(props) {
    _classCallCheck(this, FilterListOption);

    _get(Object.getPrototypeOf(FilterListOption.prototype), "constructor", this).call(this, props);
    this.filterBarActor = props.filterBarActor;
    this.filterUid = props.filterUid;
  }

  _inherits(FilterListOption, _React$Component);

  _createClass(FilterListOption, {
    _onClick: {
      value: function _onClick() {
        this.filterBarActor.enableFilter(this.filterUid);
      }
    },
    render: {
      value: function render() {
        return React.createElement(
          "li",
          null,
          React.createElement(
            "a",
            { onClick: this._onClick.bind(this) },
            this.filterBarActor.getFilter(this.filterUid).label
          )
        );
      }
    }
  });

  return FilterListOption;
})(React.Component);

},{}],20:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var SaveFiltersButton = exports.SaveFiltersButton = (function (_React$Component) {
  function SaveFiltersButton(props) {
    _classCallCheck(this, SaveFiltersButton);

    _get(Object.getPrototypeOf(SaveFiltersButton.prototype), "constructor", this).call(this, props);
    this.state = { configurationName: "" };
  }

  _inherits(SaveFiltersButton, _React$Component);

  _createClass(SaveFiltersButton, {
    _onClick: {
      value: function _onClick() {
        this.props.filterBarActor.saveFilters(this.state.configurationName);
      }
    },
    _onChange: {
      value: function _onChange(event) {
        this.setState({ configurationName: event.target.value });
      }
    },
    render: {
      value: function render() {
        return React.createElement(
          ReactBootstrap.DropdownButton,
          { title: "Save Search", type: "button", bsStyle: "default", className: "btn btn-default margin-bottom-sm" },
          React.createElement(
            ReactBootstrap.MenuItem,
            { eventKey: "1" },
            React.createElement(
              "div",
              { className: "form-group" },
              React.createElement(
                "label",
                null,
                "Search Title"
              ),
              React.createElement("input", { className: "form-control", value: this.state.configurationName, type: "text", onChange: this._onChange.bind(this) })
            ),
            React.createElement(
              "button",
              { className: "btn btn-primary", type: "button", onClick: this._onClick.bind(this) },
              "Save"
            )
          )
        );
      }
    }
  });

  return SaveFiltersButton;
})(React.Component);

},{}],21:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var SavedSearchesListItem = require("./SavedSearchesListItem.react").SavedSearchesListItem;

var SavedSearchesList = exports.SavedSearchesList = (function (_React$Component) {
  function SavedSearchesList(props) {
    _classCallCheck(this, SavedSearchesList);

    _get(Object.getPrototypeOf(SavedSearchesList.prototype), "constructor", this).call(this, props);

    this.state = this.getStateFromStores();
    this.props.filterBarStore.addChangeListener(this._onChange.bind(this));
  }

  _inherits(SavedSearchesList, _React$Component);

  _createClass(SavedSearchesList, {
    getStateFromStores: {
      value: function getStateFromStores() {
        return {
          savedSearches: this.props.filterBarStore.getSavedSearches()
        };
      }
    },
    _onChange: {
      value: function _onChange() {
        this.setState(this.getStateFromStores());
      }
    },
    render: {
      value: function render() {
        var buttonClass = "btn btn-default dropdown-toggle";

        if (this.state.savedSearches.length === 0) {
          buttonClass += " disabled";
        }

        var savedSearches = this.state.savedSearches.map(function (savedSearch, index) {
          return React.createElement(SavedSearchesListItem, {
            key: index,
            searchId: index,
            name: savedSearch.name,
            filterBarActor: this.props.filterBarActor
          });
        }, this);

        return React.createElement(
          "div",
          { className: "btn-group margin-bottom-sm" },
          React.createElement(
            "div",
            { className: "btn-group" },
            React.createElement(
              "button",
              { className: buttonClass, "data-toggle": "dropdown", type: "button", "aria-expanded": "false" },
              React.createElement("i", { className: "icon icon-save" }),
              "Saved Searches",
              React.createElement("i", { className: "icon icon-chevron-down" })
            ),
            React.createElement(
              "ul",
              { className: "dropdown-menu", role: "menu" },
              savedSearches
            )
          ),
          React.createElement(
            "button",
            { type: "button", className: "btn btn-danger" },
            React.createElement("i", { className: "icon icon-delete" })
          )
        );
      }
    }
  });

  return SavedSearchesList;
})(React.Component);

},{"./SavedSearchesListItem.react":22}],22:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var SavedSearchesListItem = exports.SavedSearchesListItem = (function (_React$Component) {
  function SavedSearchesListItem(props) {
    _classCallCheck(this, SavedSearchesListItem);

    _get(Object.getPrototypeOf(SavedSearchesListItem.prototype), "constructor", this).call(this, props);
  }

  _inherits(SavedSearchesListItem, _React$Component);

  _createClass(SavedSearchesListItem, {
    _onClick: {
      value: function _onClick() {
        this.props.filterBarActor.loadSavedSearch(this.props.searchId);
      }
    },
    render: {
      value: function render() {
        return React.createElement(
          "li",
          null,
          React.createElement(
            "a",
            { className: "dynamic-text-filter", onClick: this._onClick.bind(this) },
            this.props.name
          )
        );
      }
    }
  });

  return SavedSearchesListItem;
})(React.Component);

},{}],23:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var SavedSearchStore = require("../stores/SavedSearchStore").SavedSearchStore;

var FilterBarActor = require("../actors/FilterBarActor").FilterBarActor;

var TableActor = require("../actors/TableActor").TableActor;

var FilterBarStore = require("../stores/FilterBarStore").FilterBarStore;

var TableStore = require("../stores/TableStore").TableStore;

var FilterBar = require("./FilterBar/FilterBar.react").FilterBar;

var Table = require("./Table/Table.react").Table;

var FilterableTable = exports.FilterableTable = (function (_React$Component) {
  function FilterableTable(props) {
    _classCallCheck(this, FilterableTable);

    _get(Object.getPrototypeOf(FilterableTable.prototype), "constructor", this).call(this, props);
    this.id = props.filterableTableId;

    this.filterBarStore = new FilterBarStore(props.filterbar);
    this.tableStore = new TableStore(props.table);

    this.tableActor = new TableActor(this.filterBarStore, this.tableStore);
    this.filterBarActor = new FilterBarActor(this.filterBarStore, this.tableStore);

    this.savedSearchStore = new SavedSearchStore();
  }

  _inherits(FilterableTable, _React$Component);

  _createClass(FilterableTable, {
    render: {
      value: function render() {
        return React.createElement(
          "div",
          { key: this.id },
          React.createElement(FilterBar, {
            filterBarActor: this.filterBarActor,
            filterBarStore: this.filterBarStore
          }),
          React.createElement(Table, {
            tableActor: this.tableActor,
            tableStore: this.tableStore
          })
        );
      }
    }
  });

  return FilterableTable;
})(React.Component);

},{"../actors/FilterBarActor":6,"../actors/TableActor":7,"../stores/FilterBarStore":27,"../stores/SavedSearchStore":28,"../stores/TableStore":29,"./FilterBar/FilterBar.react":12,"./Table/Table.react":24}],24:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var TableHeadingCell = require("./TableHeadingCell.react").TableHeadingCell;

var Table = exports.Table = (function (_React$Component) {
  function Table(props) {
    _classCallCheck(this, Table);

    _get(Object.getPrototypeOf(Table.prototype), "constructor", this).call(this, props);

    this.tableActor = props.tableActor;
    this.tableStore = props.tableStore;

    this.state = this.getStateFromStores();
    this.tableStore.addChangeListener(this._onChange.bind(this));
  }

  _inherits(Table, _React$Component);

  _createClass(Table, {
    _onChange: {
      value: function _onChange() {
        this.setState(this.getStateFromStores());
      }
    },
    _onClick: {
      value: function _onClick(event) {
        this.tableActor.fetchPagedData(event.target.innerHTML);
      }
    },
    getStateFromStores: {
      value: function getStateFromStores() {
        return {
          columnHeadings: this.tableActor.getColumnHeadings(),
          rows: this.tableStore.getRows(),
          currentPage: this.tableActor.getCurrentPage(),
          totalPages: this.tableActor.getTotalPages()
        };
      }
    },
    render: {
      value: function render() {
        var columns = Object.keys(this.state.columnHeadings).map(function (columnId) {
          return React.createElement(TableHeadingCell, { key: columnId, heading: this.state.columnHeadings[columnId].heading });
        }, this);

        if (this.state.totalPages > 1) {
          var pages = Array.apply(null, Array(this.state.totalPages)).map(function (_, i) {
            return i + 1;
          });

          var pagination = pages.map(function (pageNumber) {
            var classes = "";
            if (pageNumber === this.state.currentPage) {
              classes = "active";
            }
            return React.createElement(
              "li",
              { key: pageNumber, className: classes },
              React.createElement(
                "a",
                { onClick: this._onClick.bind(this) },
                pageNumber
              )
            );
          }, this);
        }

        var rows = this.state.rows.map(function (row) {
          var columns = Object.keys(row).map(function (columnId) {
            return React.createElement(
              "td",
              null,
              row[columnId]
            );
          }, this);

          return React.createElement(
            "tr",
            null,
            columns
          );
        }, this);

        return React.createElement(
          "div",
          { className: "panel panel-responsive" },
          React.createElement(
            "div",
            { className: "table-responsive" },
            React.createElement(
              "table",
              { className: "table table-hover table-striped" },
              React.createElement(
                "thead",
                null,
                React.createElement(
                  "tr",
                  null,
                  columns
                )
              ),
              React.createElement(
                "tbody",
                null,
                rows
              )
            ),
            React.createElement(
              "nav",
              null,
              React.createElement(
                "ul",
                { className: "pagination" },
                pagination
              )
            )
          )
        );
      }
    }
  });

  return Table;
})(React.Component);

},{"./TableHeadingCell.react":25}],25:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var TableHeadingCell = exports.TableHeadingCell = (function (_React$Component) {
  function TableHeadingCell(props) {
    _classCallCheck(this, TableHeadingCell);

    _get(Object.getPrototypeOf(TableHeadingCell.prototype), "constructor", this).call(this, props);
    this.heading = props.heading;
  }

  _inherits(TableHeadingCell, _React$Component);

  _createClass(TableHeadingCell, {
    render: {
      value: function render() {
        return React.createElement(
          "th",
          null,
          this.heading
        );
      }
    }
  });

  return TableHeadingCell;
})(React.Component);

},{}],26:[function(require,module,exports){
"use strict";

exports.ConfigurationFactory = ConfigurationFactory;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var uri = require("URIjs");

function ConfigurationFactory(sourceType, rawConfiguration) {
  var configuration = {
    filterBarConfiguration: {},
    tableConfiguration: {}
  };

  if (sourceType === "html") {
    var rawFilterBarConfiguration = rawConfiguration.querySelector("dl.filterBarConfiguration"),
        rawFilter,
        rawFilters,
        parsedFilters = {},
        rawTableConfiguration = rawConfiguration.querySelector("dl.tableConfiguration"),
        rawColumn,
        rawColumns,
        parsedColumns = {};

    rawFilters = rawFilterBarConfiguration.querySelector("dl.filters").querySelectorAll("dt.filter");

    for (var filterIndex = 0; filterIndex < rawFilters.length; filterIndex++) {
      rawFilter = rawFilters[filterIndex];
      parsedFilters[rawFilter.getAttribute("data-uid")] = {
        label: rawFilter.getAttribute("data-label"),
        type: rawFilter.getAttribute("data-type"),
        field: rawFilter.getAttribute("data-field"),
        url: rawFilter.getAttribute("data-url"),
        value: "",
        enabled: false
      };
    }

    configuration.filterBarConfiguration.persistent = rawFilterBarConfiguration.querySelector("dt.persistent").getAttribute("data-persistent");
    configuration.filterBarConfiguration.searchUrl = rawFilterBarConfiguration.querySelector("dt.search-url").getAttribute("data-url");
    configuration.filterBarConfiguration.saveSearchUrl = rawFilterBarConfiguration.querySelector("dt.save-search-url").getAttribute("data-url");
    configuration.filterBarConfiguration.savedSearchUrl = rawFilterBarConfiguration.querySelector("dt.saved-search-url").getAttribute("data-url");
    configuration.filterBarConfiguration.exportResultsUrl = rawFilterBarConfiguration.querySelector("dt.export-results-url").getAttribute("data-url");
    configuration.filterBarConfiguration.filters = parsedFilters;

    rawColumns = rawTableConfiguration.querySelector("dl.columns").querySelectorAll("dt.column");

    for (var tableIndex = 0; tableIndex < rawColumns.length; tableIndex++) {
      rawColumn = rawColumns[tableIndex];
      parsedColumns[rawColumn.getAttribute("data-field")] = {
        heading: rawColumn.getAttribute("data-heading"),
        type: rawColumn.getAttribute("data-type")
      };
    }

    configuration.tableConfiguration.dataUrl = rawTableConfiguration.querySelector("dt.data-url").getAttribute("data-url");
    configuration.tableConfiguration.columns = parsedColumns;
  } else if (sourceType === "url") {
    var url = uri(window.location.href),
        query = url.query(true);

    if (!url.query()) {
      if (localStorage[window.location.pathname.replace(/\//g, "")]) {
        history.pushState({}, "", localStorage[window.location.pathname.replace(/\//g, "")]);
      }
    } else {
      if (!url.hasQuery("q")) {
        url.addQuery("q", "");
      }

      if (!url.hasQuery("page")) {
        url.addQuery("page", 1);
      }
    }

    configuration.tableConfiguration.dataUrl = url.pathname() + url.search();
    configuration.tableConfiguration.page = url.query(true).page;

    configuration.filterBarConfiguration.filters = {};

    if (url.query(true).q !== "") {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = JSON.parse(url.query(true).q)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var filter = _step.value;

          configuration.filterBarConfiguration.filters[filter.uid] = {};
          configuration.filterBarConfiguration.filters[filter.uid].enabled = true;
          configuration.filterBarConfiguration.filters[filter.uid].value = filter.value;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"]) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }
  return configuration;
}

},{"URIjs":4}],27:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var SharedUtils = _interopRequireWildcard(require("../utils/SharedUtils"));

var FilterClient = _interopRequireWildcard(require("../clients/FilterClient"));

var FilterBarStore = exports.FilterBarStore = (function () {
  function FilterBarStore(configuration) {
    _classCallCheck(this, FilterBarStore);

    this.CHANGE_EVENT = "change";
    this.eventEmitter = new EventEmitter();

    this.id = configuration.id;
    this.persistent = configuration.persistent;
    this.url = configuration.searchUrl;
    this.searchUrl = configuration.searchUrl;
    this.saveSearchUrl = configuration.saveSearchUrl;
    this.savedSearchUrl = configuration.savedSearchUrl;
    this.exportResultsUrl = configuration.exportResultsUrl;
    this.filters = configuration.filters;

    var filter, filterUid;

    for (var i = 0; i < Object.keys(this.filters).length; i++) {
      filterUid = Object.keys(this.filters)[i];
      filter = this.filters[filterUid];

      if (filter.url) {
        FilterClient.updateFilterOptions(filter);
      }
    }

    this.receieveSavedSearches();
  }

  _createClass(FilterBarStore, {
    getId: {
      value: function getId() {
        return this.id;
      }
    },
    getSearchUrl: {
      value: function getSearchUrl() {
        return this.searchUrl;
      }
    },
    getSaveSearchUrl: {
      value: function getSaveSearchUrl() {
        return this.saveSearchUrl;
      }
    },
    getSavedSearches: {
      value: function getSavedSearches() {
        return this.savedSearches || [];
      }
    },
    getSavedSearch: {
      value: function getSavedSearch(searchId) {
        return this.savedSearches[searchId];
      }
    },
    getFilter: {
      value: function getFilter(filterUid) {
        return this.filters[filterUid];
      }
    },
    getDisabled: {
      value: function getDisabled() {
        var disabledFilters = {};
        for (var filterUid in this.filters) {
          if (this.filters[filterUid].enabled === false) {
            disabledFilters[filterUid] = this.filters[filterUid];
          }
        }
        return disabledFilters;
      }
    },
    getEnabled: {
      value: function getEnabled() {
        var enabledFilters = {};
        for (var filterUid in this.filters) {
          if (this.filters[filterUid].enabled === true) {
            enabledFilters[filterUid] = this.filters[filterUid];
          }
        }
        return enabledFilters;
      }
    },
    getQuery: {
      value: function getQuery() {
        var enabledFilters = Object.keys(this.getEnabled()).map(function (filterUid) {
          var filter = this.getFilter(filterUid);
          return {
            uid: filterUid,
            type: filter.type,
            field: filter.field,
            value: filter.value
          };
        }, this);
        return enabledFilters.length > 0 ? JSON.stringify(enabledFilters) : "";
      }
    },
    receieveSavedSearches: {

      /* Mutation Methods */

      value: function receieveSavedSearches() {
        SharedUtils.ajaxGet(this.savedSearchUrl, "json", (function (response) {
          this.savedSearches = response;
          this.emitChange();
        }).bind(this));
      }
    },
    disableAllFilters: {
      value: function disableAllFilters() {
        var enabledFilters = this.getEnabled();

        for (var filterUid in enabledFilters) {
          this.disableFilter(filterUid);
        }
        this.emitChange();
      }
    },
    disableFilter: {
      value: function disableFilter(filterUid) {
        this.filters[filterUid].enabled = false;
        this.filters[filterUid].value = "";
        this.emitChange();
      }
    },
    enableFilter: {
      value: function enableFilter(filterUid, value) {
        this.filters[filterUid].enabled = true;
        this.filters[filterUid].value = value || "";
        this.emitChange();
      }
    },
    updateFilter: {
      value: function updateFilter(filterUid, propKey, propValue) {
        this.filters[filterUid][propKey] = propValue;
        this.emitChange();
      }
    },
    emitChange: {
      value: function emitChange() {
        this.eventEmitter.emit(this.CHANGE_EVENT);
      }
    },
    addChangeListener: {
      value: function addChangeListener(callback) {
        this.eventEmitter.on(this.CHANGE_EVENT, callback);
      }
    },
    removeChangeListener: {
      value: function removeChangeListener(callback) {
        this.eventEmitter.removeListener(this.CHANGE_EVENT, callback);
      }
    }
  });

  return FilterBarStore;
})();

},{"../clients/FilterClient":8,"../utils/SharedUtils":31}],28:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var SearchClient = _interopRequireWildcard(require("../clients/SearchClient"));

var SavedSearchStore = exports.SavedSearchStore = (function () {
  function SavedSearchStore() {
    _classCallCheck(this, SavedSearchStore);

    this.CHANGE_EVENT = "change";
    this.eventEmitter = new EventEmitter();

    this.setSavedSearchUrl("/jobseekers/saved_searches");

    SearchClient.getSavedSearches(this.getSavedSearchUrl(), this.setSavedSearches.bind(this));
  }

  _createClass(SavedSearchStore, {
    getSavedSearchUrl: {
      value: function getSavedSearchUrl() {
        return this.savedSearchUrl;
      }
    },
    setSavedSearchUrl: {
      value: function setSavedSearchUrl(savedSearchUrl) {
        this.savedSearchUrl = savedSearchUrl;
      }
    },
    getSavedSearches: {
      value: function getSavedSearches() {
        return this.savedSearches;
      }
    },
    setSavedSearches: {
      value: function setSavedSearches(savedSearches) {
        this.savedSearches = savedSearches;
      }
    },
    emitChange: {
      value: function emitChange() {
        this.eventEmitter.emit(this.CHANGE_EVENT);
      }
    },
    addChangeListener: {
      value: function addChangeListener(callback) {
        this.eventEmitter.on(this.CHANGE_EVENT, callback);
      }
    },
    removeChangeListener: {
      value: function removeChangeListener(callback) {
        this.eventEmitter.removeListener(this.CHANGE_EVENT, callback);
      }
    }
  });

  return SavedSearchStore;
})();

},{"../clients/SearchClient":9}],29:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var SearchUtils = _interopRequireWildcard(require("../utils/SearchUtils"));

var TableStore = exports.TableStore = (function () {
  function TableStore(configuration) {
    _classCallCheck(this, TableStore);

    this.CHANGE_EVENT = "change";
    this.eventEmitter = new EventEmitter();

    this.id = configuration.id;
    this.rows = [];
    this.currentPage = configuration.page || 1;
    this.totalPages = 1;

    this.columnHeadings = configuration.columns;
    this.url = configuration.dataUrl;
    this.fetchData();
  }

  _createClass(TableStore, {
    getId: {
      value: function getId() {
        return this.id;
      }
    },
    setUrl: {
      value: function setUrl(url) {
        this.url = url;
      }
    },
    getUrl: {
      value: function getUrl() {
        return this.url;
      }
    },
    fetchData: {
      value: function fetchData() {
        SearchUtils.search(this.url + ("&page=" + this.currentPage), this.setData.bind(this));
      }
    },
    setData: {
      value: function setData(response) {
        this.rows = response.results;
        this.currentPage = response.current_page;
        this.totalPages = response.total_pages;
        this.emitChange();
      }
    },
    getColumnHeadings: {
      value: function getColumnHeadings() {
        return this.columnHeadings;
      }
    },
    setRows: {
      value: function setRows(rows) {
        this.rows = rows;
        this.emitChange();
      }
    },
    getRows: {
      value: function getRows() {
        return this.rows;
      }
    },
    getCurrentPage: {
      value: function getCurrentPage() {
        return this.currentPage;
      }
    },
    getTotalPages: {
      value: function getTotalPages() {
        return this.totalPages;
      }
    },
    setTotalPages: {
      value: function setTotalPages(totalPages) {
        this.totalPages = totalPages;
      }
    },
    setCurrentPage: {
      value: function setCurrentPage(page) {
        this.currentPage = page;
      }
    },
    updateTable: {
      value: function updateTable(tableStateObject) {
        this.setRows(tableStateObject.results);
        this.setCurrentPage(tableStateObject.current_page);
        this.setTotalPages(tableStateObject.total_pages);
      }
    },
    emitChange: {
      value: function emitChange() {
        this.eventEmitter.emit(this.CHANGE_EVENT);
      }
    },
    addChangeListener: {
      value: function addChangeListener(callback) {
        this.eventEmitter.on(this.CHANGE_EVENT, callback);
      }
    },
    removeChangeListener: {
      value: function removeChangeListener(callback) {
        this.eventEmitter.removeListener(this.CHANGE_EVENT, callback);
      }
    }
  });

  return TableStore;
})();

},{"../utils/SearchUtils":30}],30:[function(require,module,exports){
"use strict";

exports.search = search;
Object.defineProperty(exports, "__esModule", {
  value: true
});

var ajaxGet = require("./SharedUtils").ajaxGet;

function search(url, success) {
  ajaxGet(url, "json", success);
}

},{"./SharedUtils":31}],31:[function(require,module,exports){
"use strict";

exports.serialize = serialize;
exports.ajaxGet = ajaxGet;
exports.ajaxPost = ajaxPost;
exports.parseFilterBarConfiguration = parseFilterBarConfiguration;
exports.parseTableConfiguration = parseTableConfiguration;
exports.parseUrlSearchString = parseUrlSearchString;
exports.createUrlSearchString = createUrlSearchString;
exports.updateUrl = updateUrl;
Object.defineProperty(exports, "__esModule", {
  value: true
});

function serialize(obj, prefix) {
  var str = [];
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      var k = prefix ? prefix + "[" + p + "]" : p,
          v = obj[p];
      str.push(typeof v === "object" ? this.serialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
  }
  return str.join("&");
}

function ajaxGet(url, type, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = type;
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.onload = function () {
    var status = xhr.status;
    var response = xhr.response;
    if (status === 200) {
      return success(response);
    } else {
      return error(response);
    }
  };
  xhr.send();
}

function ajaxPost(url, type, data, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.responseType = type;
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.setRequestHeader("X_CSRF_TOKEN", document.querySelector("meta[name=csrf-token]").getAttribute("content"));
  xhr.onload = function () {
    var response = xhr.response;
  };
  xhr.send(JSON.stringify(data));
}

function parseFilterBarConfiguration(filterBarConfiguration, id) {
  var parsedFilterBarConfiguration = {},
      rawFilter,
      rawFilters,
      parsedFilters = {};

  rawFilters = filterBarConfiguration.querySelector("dl.filters").querySelectorAll("dt.filter");

  for (var i = 0; i < rawFilters.length; i++) {
    rawFilter = rawFilters[i];
    parsedFilters[rawFilter.getAttribute("data-uid")] = {
      label: rawFilter.getAttribute("data-label"),
      type: rawFilter.getAttribute("data-type"),
      field: rawFilter.getAttribute("data-field"),
      url: rawFilter.getAttribute("data-url"),
      value: "",
      enabled: false
    };
  }

  parsedFilterBarConfiguration.id = id;
  parsedFilterBarConfiguration.persistent = filterBarConfiguration.querySelector("dt.persistent").getAttribute("data-persistent");
  parsedFilterBarConfiguration.searchUrl = filterBarConfiguration.querySelector("dt.search-url").getAttribute("data-url");
  parsedFilterBarConfiguration.saveSearchUrl = filterBarConfiguration.querySelector("dt.save-search-url").getAttribute("data-url");
  parsedFilterBarConfiguration.savedSearchUrl = filterBarConfiguration.querySelector("dt.saved-search-url").getAttribute("data-url");
  parsedFilterBarConfiguration.exportResultsUrl = filterBarConfiguration.querySelector("dt.export-results-url").getAttribute("data-url");
  parsedFilterBarConfiguration.filters = parsedFilters;

  return parsedFilterBarConfiguration;
}

function parseTableConfiguration(tableConfiguration, id) {
  var parsedTableConfiguration = {},
      rawColumns,
      rawColumn,
      parsedColumns = {};

  rawColumns = tableConfiguration.querySelector("dl.columns").querySelectorAll("dt.column");

  for (var i = 0; i < rawColumns.length; i++) {
    rawColumn = rawColumns[i];
    parsedColumns[rawColumn.getAttribute("data-field")] = {
      heading: rawColumn.getAttribute("data-heading"),
      type: rawColumn.getAttribute("data-type")
    };
  }

  parsedTableConfiguration.id = id;
  parsedTableConfiguration.dataUrl = tableConfiguration.querySelector("dt.data-url").getAttribute("data-url");
  parsedTableConfiguration.columns = parsedColumns;

  return parsedTableConfiguration;
}

function parseUrlSearchString() {
  // taken from https://github.com/sindresorhus/query-string/blob/master/query-string.js

  var str = window.location.search;

  if (typeof str !== "string") {
    return {};
  }

  str = str.trim().replace(/^(\?|#)/, "");

  if (!str) {
    return {};
  }

  return str.trim().split("&").reduce(function (ret, param) {
    var parts = param.replace(/\+/g, " ").split("=");
    var key = parts[0];
    var val = parts[1];

    key = decodeURIComponent(key);
    // missing `=` should be `null`:
    // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    val = val === undefined ? null : decodeURIComponent(val);

    if (!ret.hasOwnProperty(key)) {
      ret[key] = val;
    } else if (Array.isArray(ret[key])) {
      ret[key].push(val);
    } else {
      ret[key] = [ret[key], val];
    }

    return ret;
  }, {});
}

function createUrlSearchString(obj) {
  // taken from https://github.com/sindresorhus/query-string/blob/master/query-string.js
  return obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];

    if (Array.isArray(val)) {
      return val.map(function (val2) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(val2);
      }).join("&");
    }

    return encodeURIComponent(key) + "=" + encodeURIComponent(val);
  }).join("&") : "";
}

function updateUrl(propKey, propValue) {
  var searchObject = parseUrlSearchString();

  searchObject[propKey] = propValue;

  var newSearchString = "?" + createUrlSearchString(searchObject);

  history.pushState({}, "", window.location.origin + window.location.pathname + newSearchString);
  localStorage[window.location.pathname.replace(/\//g, "")] = newSearchString;
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvamFjb2JiMS9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2FwcC5qcyIsIm5vZGVfbW9kdWxlcy9VUklqcy9zcmMvSVB2Ni5qcyIsIm5vZGVfbW9kdWxlcy9VUklqcy9zcmMvU2Vjb25kTGV2ZWxEb21haW5zLmpzIiwibm9kZV9tb2R1bGVzL1VSSWpzL3NyYy9VUkkuanMiLCJub2RlX21vZHVsZXMvVVJJanMvc3JjL3B1bnljb2RlLmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9hY3RvcnMvRmlsdGVyQmFyQWN0b3IuanMiLCIvVXNlcnMvamFjb2JiMS9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2FjdG9ycy9UYWJsZUFjdG9yLmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9jbGllbnRzL0ZpbHRlckNsaWVudC5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvY2xpZW50cy9TZWFyY2hDbGllbnQuanMiLCIvVXNlcnMvamFjb2JiMS9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvRmlsdGVyQmFyL0FwcGx5RmlsdGVyc0J1dHRvbi5yZWFjdC5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvY29tcG9uZW50cy9GaWx0ZXJCYXIvQ2xlYXJGaWx0ZXJzQnV0dG9uLnJlYWN0LmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL0ZpbHRlckJhci9GaWx0ZXJCYXIucmVhY3QuanMiLCIvVXNlcnMvamFjb2JiMS9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvRmlsdGVyQmFyL0ZpbHRlckRpc3BsYXkvRmlsdGVyRGlzcGxheS5yZWFjdC5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvY29tcG9uZW50cy9GaWx0ZXJCYXIvRmlsdGVyRGlzcGxheS9GaWx0ZXJJbnB1dC5yZWFjdC5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvY29tcG9uZW50cy9GaWx0ZXJCYXIvRmlsdGVyRGlzcGxheS9JbnB1dHMvRGF0ZUlucHV0LnJlYWN0LmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL0ZpbHRlckJhci9GaWx0ZXJEaXNwbGF5L0lucHV0cy9TZWxlY3RJbnB1dC5yZWFjdC5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvY29tcG9uZW50cy9GaWx0ZXJCYXIvRmlsdGVyRGlzcGxheS9JbnB1dHMvVGV4dElucHV0LnJlYWN0LmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL0ZpbHRlckJhci9GaWx0ZXJMaXN0L0ZpbHRlckxpc3QucmVhY3QuanMiLCIvVXNlcnMvamFjb2JiMS9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvRmlsdGVyQmFyL0ZpbHRlckxpc3QvRmlsdGVyTGlzdE9wdGlvbi5yZWFjdC5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvY29tcG9uZW50cy9GaWx0ZXJCYXIvU2F2ZUZpbHRlcnNCdXR0b24ucmVhY3QuanMiLCIvVXNlcnMvamFjb2JiMS9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvRmlsdGVyQmFyL1NhdmVkU2VhcmNoZXNMaXN0L1NhdmVkU2VhcmNoZXNMaXN0LnJlYWN0LmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL0ZpbHRlckJhci9TYXZlZFNlYXJjaGVzTGlzdC9TYXZlZFNlYXJjaGVzTGlzdEl0ZW0ucmVhY3QuanMiLCIvVXNlcnMvamFjb2JiMS9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvRmlsdGVyYWJsZVRhYmxlLnJlYWN0LmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL1RhYmxlL1RhYmxlLnJlYWN0LmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL1RhYmxlL1RhYmxlSGVhZGluZ0NlbGwucmVhY3QuanMiLCIvVXNlcnMvamFjb2JiMS9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2ZhY3Rvcmllcy9Db25maWd1cmF0aW9uRmFjdG9yeS5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvc3RvcmVzL0ZpbHRlckJhclN0b3JlLmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9zdG9yZXMvU2F2ZWRTZWFyY2hTdG9yZS5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvc3RvcmVzL1RhYmxlU3RvcmUuanMiLCIvVXNlcnMvamFjb2JiMS9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL3V0aWxzL1NlYXJjaFV0aWxzLmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy91dGlscy9TaGFyZWRVdGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0lDQVEsZUFBZSxXQUFPLG9DQUFvQyxFQUExRCxlQUFlOztJQUVmLG9CQUFvQixXQUFPLGtDQUFrQyxFQUE3RCxvQkFBb0I7O0FBRTVCLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxZQUFVO0FBQ3RELE1BQUksYUFBYTtNQUNiLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyx3QkFBd0IsQ0FBQztNQUM1RSxtQkFBbUI7TUFDbkIsaUJBQWlCO01BQ2pCLGdCQUFnQixDQUFDOztBQUVyQixPQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2hELHVCQUFtQixHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFDLHFCQUFpQixHQUFHLElBQUksb0JBQW9CLENBQUMsTUFBTSxFQUFFLG1CQUFtQixDQUFDLENBQUM7QUFDMUUsUUFBSSxpQkFBaUIsQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLEVBQUU7QUFDdkQsc0JBQWdCLEdBQUcsSUFBSSxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNwRCxNQUFNO0FBQ0wsc0JBQWdCLEdBQUcsRUFBRSxDQUFDO0tBQ3ZCOztBQUVELGlCQUFhLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLGlCQUFpQixFQUFFLGdCQUFnQixDQUFDLENBQUM7O0FBRXhFLFNBQUssQ0FBQyxNQUFNLENBQ1YsS0FBSyxDQUFDLGFBQWEsQ0FDakIsZUFBZSxFQUNmO0FBQ0UsZUFBUyxFQUFFLGFBQWEsQ0FBQyxzQkFBc0I7QUFDL0MsV0FBSyxFQUFFLGFBQWEsQ0FBQyxrQkFBa0I7S0FDeEMsQ0FDRixFQUNELG1CQUFtQixDQUNwQixDQUFDO0dBQ0g7Q0FDRixDQUFDLENBQUM7OztBQ2pDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDamlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUM7O0FBRW5CLFFBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUN0QixhQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLEVBQUU7QUFDN0IsZUFBTyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDakUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNkOztBQUVELFdBQU8sa0JBQWtCLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQ2hFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0NBQ25COztBQUVNLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUU7QUFDNUMsTUFBSSxZQUFZLEdBQUcsb0JBQW9CLEVBQUUsQ0FBQzs7QUFFMUMsY0FBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQzs7QUFFbEMsTUFBSSxlQUFlLEdBQUcsR0FBRyxHQUFHLHFCQUFxQixDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUVoRSxTQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsZUFBZSxDQUFDLENBQUM7QUFDL0YsY0FBWSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUM7Q0FDN0UiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtGaWx0ZXJhYmxlVGFibGV9IGZyb20gJy4vY29tcG9uZW50cy9GaWx0ZXJhYmxlVGFibGUucmVhY3QnO1xuXG5pbXBvcnQge0NvbmZpZ3VyYXRpb25GYWN0b3J5fSBmcm9tICcuL2ZhY3Rvcmllcy9Db25maWd1cmF0aW9uRmFjdG9yeSc7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpe1xuICB2YXIgY29uZmlndXJhdGlvbixcbiAgICAgIGZpbHRlcmFibGVUYWJsZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdyZWFjdC1maWx0ZXJhYmxlLXRhYmxlJyksXG4gICAgICBmaWx0ZXJhYmxlVGFibGVOb2RlLFxuICAgICAgaHRtbENvbmZpZ3VyYXRpb24sXG4gICAgICB1cmxDb25maWd1cmF0aW9uO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZmlsdGVyYWJsZVRhYmxlcy5sZW5ndGg7IGkrKykge1xuICAgIGZpbHRlcmFibGVUYWJsZU5vZGUgPSBmaWx0ZXJhYmxlVGFibGVzW2ldO1xuICAgIGh0bWxDb25maWd1cmF0aW9uID0gbmV3IENvbmZpZ3VyYXRpb25GYWN0b3J5KCdodG1sJywgZmlsdGVyYWJsZVRhYmxlTm9kZSk7XG4gICAgaWYgKGh0bWxDb25maWd1cmF0aW9uLmZpbHRlckJhckNvbmZpZ3VyYXRpb24ucGVyc2lzdGVudCkge1xuICAgICAgdXJsQ29uZmlndXJhdGlvbiA9IG5ldyBDb25maWd1cmF0aW9uRmFjdG9yeSgndXJsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVybENvbmZpZ3VyYXRpb24gPSB7fTtcbiAgICB9XG5cbiAgICBjb25maWd1cmF0aW9uID0gJC5leHRlbmQodHJ1ZSwge30sIGh0bWxDb25maWd1cmF0aW9uLCB1cmxDb25maWd1cmF0aW9uKTtcblxuICAgIFJlYWN0LnJlbmRlcihcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIEZpbHRlcmFibGVUYWJsZSxcbiAgICAgICAge1xuICAgICAgICAgIGZpbHRlcmJhcjogY29uZmlndXJhdGlvbi5maWx0ZXJCYXJDb25maWd1cmF0aW9uLFxuICAgICAgICAgIHRhYmxlOiBjb25maWd1cmF0aW9uLnRhYmxlQ29uZmlndXJhdGlvblxuICAgICAgICB9XG4gICAgICApLFxuICAgICAgZmlsdGVyYWJsZVRhYmxlTm9kZVxuICAgICk7XG4gIH1cbn0pO1xuIiwiLyohXG4gKiBVUkkuanMgLSBNdXRhdGluZyBVUkxzXG4gKiBJUHY2IFN1cHBvcnRcbiAqXG4gKiBWZXJzaW9uOiAxLjE1LjBcbiAqXG4gKiBBdXRob3I6IFJvZG5leSBSZWhtXG4gKiBXZWI6IGh0dHA6Ly9tZWRpYWxpemUuZ2l0aHViLmlvL1VSSS5qcy9cbiAqXG4gKiBMaWNlbnNlZCB1bmRlclxuICogICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKiAgIEdQTCB2MyBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvR1BMLTMuMFxuICpcbiAqL1xuXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICAvLyBodHRwczovL2dpdGh1Yi5jb20vdW1kanMvdW1kL2Jsb2IvbWFzdGVyL3JldHVybkV4cG9ydHMuanNcbiAgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIC8vIE5vZGVcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgZGVmaW5lKGZhY3RvcnkpO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXG4gICAgcm9vdC5JUHY2ID0gZmFjdG9yeShyb290KTtcbiAgfVxufSh0aGlzLCBmdW5jdGlvbiAocm9vdCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLypcbiAgdmFyIF9pbiA9IFwiZmU4MDowMDAwOjAwMDA6MDAwMDowMjA0OjYxZmY6ZmU5ZDpmMTU2XCI7XG4gIHZhciBfb3V0ID0gSVB2Ni5iZXN0KF9pbik7XG4gIHZhciBfZXhwZWN0ZWQgPSBcImZlODA6OjIwNDo2MWZmOmZlOWQ6ZjE1NlwiO1xuXG4gIGNvbnNvbGUubG9nKF9pbiwgX291dCwgX2V4cGVjdGVkLCBfb3V0ID09PSBfZXhwZWN0ZWQpO1xuICAqL1xuXG4gIC8vIHNhdmUgY3VycmVudCBJUHY2IHZhcmlhYmxlLCBpZiBhbnlcbiAgdmFyIF9JUHY2ID0gcm9vdCAmJiByb290LklQdjY7XG5cbiAgZnVuY3Rpb24gYmVzdFByZXNlbnRhdGlvbihhZGRyZXNzKSB7XG4gICAgLy8gYmFzZWQgb246XG4gICAgLy8gSmF2YXNjcmlwdCB0byB0ZXN0IGFuIElQdjYgYWRkcmVzcyBmb3IgcHJvcGVyIGZvcm1hdCwgYW5kIHRvXG4gICAgLy8gcHJlc2VudCB0aGUgXCJiZXN0IHRleHQgcmVwcmVzZW50YXRpb25cIiBhY2NvcmRpbmcgdG8gSUVURiBEcmFmdCBSRkMgYXRcbiAgICAvLyBodHRwOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9kcmFmdC1pZXRmLTZtYW4tdGV4dC1hZGRyLXJlcHJlc2VudGF0aW9uLTA0XG4gICAgLy8gOCBGZWIgMjAxMCBSaWNoIEJyb3duLCBEYXJ0d2FyZSwgTExDXG4gICAgLy8gUGxlYXNlIGZlZWwgZnJlZSB0byB1c2UgdGhpcyBjb2RlIGFzIGxvbmcgYXMgeW91IHByb3ZpZGUgYSBsaW5rIHRvXG4gICAgLy8gaHR0cDovL3d3dy5pbnRlcm1hcHBlci5jb21cbiAgICAvLyBodHRwOi8vaW50ZXJtYXBwZXIuY29tL3N1cHBvcnQvdG9vbHMvSVBWNi1WYWxpZGF0b3IuYXNweFxuICAgIC8vIGh0dHA6Ly9kb3dubG9hZC5kYXJ0d2FyZS5jb20vdGhpcmRwYXJ0eS9pcHY2dmFsaWRhdG9yLmpzXG5cbiAgICB2YXIgX2FkZHJlc3MgPSBhZGRyZXNzLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFyIHNlZ21lbnRzID0gX2FkZHJlc3Muc3BsaXQoJzonKTtcbiAgICB2YXIgbGVuZ3RoID0gc2VnbWVudHMubGVuZ3RoO1xuICAgIHZhciB0b3RhbCA9IDg7XG5cbiAgICAvLyB0cmltIGNvbG9ucyAoOjogb3IgOjphOmI6Y+KApiBvciDigKZhOmI6Yzo6KVxuICAgIGlmIChzZWdtZW50c1swXSA9PT0gJycgJiYgc2VnbWVudHNbMV0gPT09ICcnICYmIHNlZ21lbnRzWzJdID09PSAnJykge1xuICAgICAgLy8gbXVzdCBoYXZlIGJlZW4gOjpcbiAgICAgIC8vIHJlbW92ZSBmaXJzdCB0d28gaXRlbXNcbiAgICAgIHNlZ21lbnRzLnNoaWZ0KCk7XG4gICAgICBzZWdtZW50cy5zaGlmdCgpO1xuICAgIH0gZWxzZSBpZiAoc2VnbWVudHNbMF0gPT09ICcnICYmIHNlZ21lbnRzWzFdID09PSAnJykge1xuICAgICAgLy8gbXVzdCBoYXZlIGJlZW4gOjp4eHh4XG4gICAgICAvLyByZW1vdmUgdGhlIGZpcnN0IGl0ZW1cbiAgICAgIHNlZ21lbnRzLnNoaWZ0KCk7XG4gICAgfSBlbHNlIGlmIChzZWdtZW50c1tsZW5ndGggLSAxXSA9PT0gJycgJiYgc2VnbWVudHNbbGVuZ3RoIC0gMl0gPT09ICcnKSB7XG4gICAgICAvLyBtdXN0IGhhdmUgYmVlbiB4eHh4OjpcbiAgICAgIHNlZ21lbnRzLnBvcCgpO1xuICAgIH1cblxuICAgIGxlbmd0aCA9IHNlZ21lbnRzLmxlbmd0aDtcblxuICAgIC8vIGFkanVzdCB0b3RhbCBzZWdtZW50cyBmb3IgSVB2NCB0cmFpbGVyXG4gICAgaWYgKHNlZ21lbnRzW2xlbmd0aCAtIDFdLmluZGV4T2YoJy4nKSAhPT0gLTEpIHtcbiAgICAgIC8vIGZvdW5kIGEgXCIuXCIgd2hpY2ggbWVhbnMgSVB2NFxuICAgICAgdG90YWwgPSA3O1xuICAgIH1cblxuICAgIC8vIGZpbGwgZW1wdHkgc2VnbWVudHMgdGhlbSB3aXRoIFwiMDAwMFwiXG4gICAgdmFyIHBvcztcbiAgICBmb3IgKHBvcyA9IDA7IHBvcyA8IGxlbmd0aDsgcG9zKyspIHtcbiAgICAgIGlmIChzZWdtZW50c1twb3NdID09PSAnJykge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zIDwgdG90YWwpIHtcbiAgICAgIHNlZ21lbnRzLnNwbGljZShwb3MsIDEsICcwMDAwJyk7XG4gICAgICB3aGlsZSAoc2VnbWVudHMubGVuZ3RoIDwgdG90YWwpIHtcbiAgICAgICAgc2VnbWVudHMuc3BsaWNlKHBvcywgMCwgJzAwMDAnKTtcbiAgICAgIH1cblxuICAgICAgbGVuZ3RoID0gc2VnbWVudHMubGVuZ3RoO1xuICAgIH1cblxuICAgIC8vIHN0cmlwIGxlYWRpbmcgemVyb3NcbiAgICB2YXIgX3NlZ21lbnRzO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG90YWw7IGkrKykge1xuICAgICAgX3NlZ21lbnRzID0gc2VnbWVudHNbaV0uc3BsaXQoJycpO1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCAzIDsgaisrKSB7XG4gICAgICAgIGlmIChfc2VnbWVudHNbMF0gPT09ICcwJyAmJiBfc2VnbWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgIF9zZWdtZW50cy5zcGxpY2UoMCwxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzZWdtZW50c1tpXSA9IF9zZWdtZW50cy5qb2luKCcnKTtcbiAgICB9XG5cbiAgICAvLyBmaW5kIGxvbmdlc3Qgc2VxdWVuY2Ugb2YgemVyb2VzIGFuZCBjb2FsZXNjZSB0aGVtIGludG8gb25lIHNlZ21lbnRcbiAgICB2YXIgYmVzdCA9IC0xO1xuICAgIHZhciBfYmVzdCA9IDA7XG4gICAgdmFyIF9jdXJyZW50ID0gMDtcbiAgICB2YXIgY3VycmVudCA9IC0xO1xuICAgIHZhciBpbnplcm9lcyA9IGZhbHNlO1xuICAgIC8vIGk7IGFscmVhZHkgZGVjbGFyZWRcblxuICAgIGZvciAoaSA9IDA7IGkgPCB0b3RhbDsgaSsrKSB7XG4gICAgICBpZiAoaW56ZXJvZXMpIHtcbiAgICAgICAgaWYgKHNlZ21lbnRzW2ldID09PSAnMCcpIHtcbiAgICAgICAgICBfY3VycmVudCArPSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGluemVyb2VzID0gZmFsc2U7XG4gICAgICAgICAgaWYgKF9jdXJyZW50ID4gX2Jlc3QpIHtcbiAgICAgICAgICAgIGJlc3QgPSBjdXJyZW50O1xuICAgICAgICAgICAgX2Jlc3QgPSBfY3VycmVudDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChzZWdtZW50c1tpXSA9PT0gJzAnKSB7XG4gICAgICAgICAgaW56ZXJvZXMgPSB0cnVlO1xuICAgICAgICAgIGN1cnJlbnQgPSBpO1xuICAgICAgICAgIF9jdXJyZW50ID0gMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChfY3VycmVudCA+IF9iZXN0KSB7XG4gICAgICBiZXN0ID0gY3VycmVudDtcbiAgICAgIF9iZXN0ID0gX2N1cnJlbnQ7XG4gICAgfVxuXG4gICAgaWYgKF9iZXN0ID4gMSkge1xuICAgICAgc2VnbWVudHMuc3BsaWNlKGJlc3QsIF9iZXN0LCAnJyk7XG4gICAgfVxuXG4gICAgbGVuZ3RoID0gc2VnbWVudHMubGVuZ3RoO1xuXG4gICAgLy8gYXNzZW1ibGUgcmVtYWluaW5nIHNlZ21lbnRzXG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgIGlmIChzZWdtZW50c1swXSA9PT0gJycpICB7XG4gICAgICByZXN1bHQgPSAnOic7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHQgKz0gc2VnbWVudHNbaV07XG4gICAgICBpZiAoaSA9PT0gbGVuZ3RoIC0gMSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgcmVzdWx0ICs9ICc6JztcbiAgICB9XG5cbiAgICBpZiAoc2VnbWVudHNbbGVuZ3RoIC0gMV0gPT09ICcnKSB7XG4gICAgICByZXN1bHQgKz0gJzonO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBub0NvbmZsaWN0KCkge1xuICAgIC8qanNoaW50IHZhbGlkdGhpczogdHJ1ZSAqL1xuICAgIGlmIChyb290LklQdjYgPT09IHRoaXMpIHtcbiAgICAgIHJvb3QuSVB2NiA9IF9JUHY2O1xuICAgIH1cbiAgXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGJlc3Q6IGJlc3RQcmVzZW50YXRpb24sXG4gICAgbm9Db25mbGljdDogbm9Db25mbGljdFxuICB9O1xufSkpO1xuIiwiLyohXG4gKiBVUkkuanMgLSBNdXRhdGluZyBVUkxzXG4gKiBTZWNvbmQgTGV2ZWwgRG9tYWluIChTTEQpIFN1cHBvcnRcbiAqXG4gKiBWZXJzaW9uOiAxLjE1LjBcbiAqXG4gKiBBdXRob3I6IFJvZG5leSBSZWhtXG4gKiBXZWI6IGh0dHA6Ly9tZWRpYWxpemUuZ2l0aHViLmlvL1VSSS5qcy9cbiAqXG4gKiBMaWNlbnNlZCB1bmRlclxuICogICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKiAgIEdQTCB2MyBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvR1BMLTMuMFxuICpcbiAqL1xuXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICAvLyBodHRwczovL2dpdGh1Yi5jb20vdW1kanMvdW1kL2Jsb2IvbWFzdGVyL3JldHVybkV4cG9ydHMuanNcbiAgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIC8vIE5vZGVcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgZGVmaW5lKGZhY3RvcnkpO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXG4gICAgcm9vdC5TZWNvbmRMZXZlbERvbWFpbnMgPSBmYWN0b3J5KHJvb3QpO1xuICB9XG59KHRoaXMsIGZ1bmN0aW9uIChyb290KSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBzYXZlIGN1cnJlbnQgU2Vjb25kTGV2ZWxEb21haW5zIHZhcmlhYmxlLCBpZiBhbnlcbiAgdmFyIF9TZWNvbmRMZXZlbERvbWFpbnMgPSByb290ICYmIHJvb3QuU2Vjb25kTGV2ZWxEb21haW5zO1xuXG4gIHZhciBTTEQgPSB7XG4gICAgLy8gbGlzdCBvZiBrbm93biBTZWNvbmQgTGV2ZWwgRG9tYWluc1xuICAgIC8vIGNvbnZlcnRlZCBsaXN0IG9mIFNMRHMgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZ2F2aW5nbWlsbGVyL3NlY29uZC1sZXZlbC1kb21haW5zXG4gICAgLy8gLS0tLVxuICAgIC8vIHB1YmxpY3N1ZmZpeC5vcmcgaXMgbW9yZSBjdXJyZW50IGFuZCBhY3R1YWxseSB1c2VkIGJ5IGEgY291cGxlIG9mIGJyb3dzZXJzIGludGVybmFsbHkuXG4gICAgLy8gZG93bnNpZGUgaXMgaXQgYWxzbyBjb250YWlucyBkb21haW5zIGxpa2UgXCJkeW5kbnMub3JnXCIgLSB3aGljaCBpcyBmaW5lIGZvciB0aGUgc2VjdXJpdHlcbiAgICAvLyBpc3N1ZXMgYnJvd3NlciBoYXZlIHRvIGRlYWwgd2l0aCAoU09QIGZvciBjb29raWVzLCBldGMpIC0gYnV0IGlzIHdheSBvdmVyYm9hcmQgZm9yIFVSSS5qc1xuICAgIC8vIC0tLS1cbiAgICBsaXN0OiB7XG4gICAgICAnYWMnOicgY29tIGdvdiBtaWwgbmV0IG9yZyAnLFxuICAgICAgJ2FlJzonIGFjIGNvIGdvdiBtaWwgbmFtZSBuZXQgb3JnIHBybyBzY2ggJyxcbiAgICAgICdhZic6JyBjb20gZWR1IGdvdiBuZXQgb3JnICcsXG4gICAgICAnYWwnOicgY29tIGVkdSBnb3YgbWlsIG5ldCBvcmcgJyxcbiAgICAgICdhbyc6JyBjbyBlZCBndiBpdCBvZyBwYiAnLFxuICAgICAgJ2FyJzonIGNvbSBlZHUgZ29iIGdvdiBpbnQgbWlsIG5ldCBvcmcgdHVyICcsXG4gICAgICAnYXQnOicgYWMgY28gZ3Ygb3IgJyxcbiAgICAgICdhdSc6JyBhc24gY29tIGNzaXJvIGVkdSBnb3YgaWQgbmV0IG9yZyAnLFxuICAgICAgJ2JhJzonIGNvIGNvbSBlZHUgZ292IG1pbCBuZXQgb3JnIHJzIHVuYmkgdW5tbyB1bnNhIHVudHogdW56ZSAnLFxuICAgICAgJ2JiJzonIGJpeiBjbyBjb20gZWR1IGdvdiBpbmZvIG5ldCBvcmcgc3RvcmUgdHYgJyxcbiAgICAgICdiaCc6JyBiaXogY2MgY29tIGVkdSBnb3YgaW5mbyBuZXQgb3JnICcsXG4gICAgICAnYm4nOicgY29tIGVkdSBnb3YgbmV0IG9yZyAnLFxuICAgICAgJ2JvJzonIGNvbSBlZHUgZ29iIGdvdiBpbnQgbWlsIG5ldCBvcmcgdHYgJyxcbiAgICAgICdicic6JyBhZG0gYWR2IGFnciBhbSBhcnEgYXJ0IGF0byBiIGJpbyBibG9nIGJtZCBjaW0gY25nIGNudCBjb20gY29vcCBlY24gZWR1IGVuZyBlc3AgZXRjIGV0aSBmYXIgZmxvZyBmbSBmbmQgZm90IGZzdCBnMTIgZ2dmIGdvdiBpbWIgaW5kIGluZiBqb3IganVzIGxlbCBtYXQgbWVkIG1pbCBtdXMgbmV0IG5vbSBub3QgbnRyIG9kbyBvcmcgcHBnIHBybyBwc2MgcHNpIHFzbCByZWMgc2xnIHNydiB0bXAgdHJkIHR1ciB0diB2ZXQgdmxvZyB3aWtpIHpsZyAnLFxuICAgICAgJ2JzJzonIGNvbSBlZHUgZ292IG5ldCBvcmcgJyxcbiAgICAgICdieic6JyBkdSBldCBvbSBvdiByZyAnLFxuICAgICAgJ2NhJzonIGFiIGJjIG1iIG5iIG5mIG5sIG5zIG50IG51IG9uIHBlIHFjIHNrIHlrICcsXG4gICAgICAnY2snOicgYml6IGNvIGVkdSBnZW4gZ292IGluZm8gbmV0IG9yZyAnLFxuICAgICAgJ2NuJzonIGFjIGFoIGJqIGNvbSBjcSBlZHUgZmogZ2QgZ292IGdzIGd4IGd6IGhhIGhiIGhlIGhpIGhsIGhuIGpsIGpzIGp4IGxuIG1pbCBuZXQgbm0gbnggb3JnIHFoIHNjIHNkIHNoIHNuIHN4IHRqIHR3IHhqIHh6IHluIHpqICcsXG4gICAgICAnY28nOicgY29tIGVkdSBnb3YgbWlsIG5ldCBub20gb3JnICcsXG4gICAgICAnY3InOicgYWMgYyBjbyBlZCBmaSBnbyBvciBzYSAnLFxuICAgICAgJ2N5JzonIGFjIGJpeiBjb20gZWtsb2dlcyBnb3YgbHRkIG5hbWUgbmV0IG9yZyBwYXJsaWFtZW50IHByZXNzIHBybyB0bSAnLFxuICAgICAgJ2RvJzonIGFydCBjb20gZWR1IGdvYiBnb3YgbWlsIG5ldCBvcmcgc2xkIHdlYiAnLFxuICAgICAgJ2R6JzonIGFydCBhc3NvIGNvbSBlZHUgZ292IG5ldCBvcmcgcG9sICcsXG4gICAgICAnZWMnOicgY29tIGVkdSBmaW4gZ292IGluZm8gbWVkIG1pbCBuZXQgb3JnIHBybyAnLFxuICAgICAgJ2VnJzonIGNvbSBlZHUgZXVuIGdvdiBtaWwgbmFtZSBuZXQgb3JnIHNjaSAnLFxuICAgICAgJ2VyJzonIGNvbSBlZHUgZ292IGluZCBtaWwgbmV0IG9yZyByb2NoZXN0IHcgJyxcbiAgICAgICdlcyc6JyBjb20gZWR1IGdvYiBub20gb3JnICcsXG4gICAgICAnZXQnOicgYml6IGNvbSBlZHUgZ292IGluZm8gbmFtZSBuZXQgb3JnICcsXG4gICAgICAnZmonOicgYWMgYml6IGNvbSBpbmZvIG1pbCBuYW1lIG5ldCBvcmcgcHJvICcsXG4gICAgICAnZmsnOicgYWMgY28gZ292IG5ldCBub20gb3JnICcsXG4gICAgICAnZnInOicgYXNzbyBjb20gZiBnb3V2IG5vbSBwcmQgcHJlc3NlIHRtICcsXG4gICAgICAnZ2cnOicgY28gbmV0IG9yZyAnLFxuICAgICAgJ2doJzonIGNvbSBlZHUgZ292IG1pbCBvcmcgJyxcbiAgICAgICdnbic6JyBhYyBjb20gZ292IG5ldCBvcmcgJyxcbiAgICAgICdncic6JyBjb20gZWR1IGdvdiBtaWwgbmV0IG9yZyAnLFxuICAgICAgJ2d0JzonIGNvbSBlZHUgZ29iIGluZCBtaWwgbmV0IG9yZyAnLFxuICAgICAgJ2d1JzonIGNvbSBlZHUgZ292IG5ldCBvcmcgJyxcbiAgICAgICdoayc6JyBjb20gZWR1IGdvdiBpZHYgbmV0IG9yZyAnLFxuICAgICAgJ2h1JzonIDIwMDAgYWdyYXIgYm9sdCBjYXNpbm8gY2l0eSBjbyBlcm90aWNhIGVyb3Rpa2EgZmlsbSBmb3J1bSBnYW1lcyBob3RlbCBpbmZvIGluZ2F0bGFuIGpvZ2FzeiBrb255dmVsbyBsYWthcyBtZWRpYSBuZXdzIG9yZyBwcml2IHJla2xhbSBzZXggc2hvcCBzcG9ydCBzdWxpIHN6ZXggdG0gdG96c2RlIHV0YXphcyB2aWRlbyAnLFxuICAgICAgJ2lkJzonIGFjIGNvIGdvIG1pbCBuZXQgb3Igc2NoIHdlYiAnLFxuICAgICAgJ2lsJzonIGFjIGNvIGdvdiBpZGYgazEyIG11bmkgbmV0IG9yZyAnLFxuICAgICAgJ2luJzonIGFjIGNvIGVkdSBlcm5ldCBmaXJtIGdlbiBnb3YgaSBpbmQgbWlsIG5ldCBuaWMgb3JnIHJlcyAnLFxuICAgICAgJ2lxJzonIGNvbSBlZHUgZ292IGkgbWlsIG5ldCBvcmcgJyxcbiAgICAgICdpcic6JyBhYyBjbyBkbnNzZWMgZ292IGkgaWQgbmV0IG9yZyBzY2ggJyxcbiAgICAgICdpdCc6JyBlZHUgZ292ICcsXG4gICAgICAnamUnOicgY28gbmV0IG9yZyAnLFxuICAgICAgJ2pvJzonIGNvbSBlZHUgZ292IG1pbCBuYW1lIG5ldCBvcmcgc2NoICcsXG4gICAgICAnanAnOicgYWMgYWQgY28gZWQgZ28gZ3IgbGcgbmUgb3IgJyxcbiAgICAgICdrZSc6JyBhYyBjbyBnbyBpbmZvIG1lIG1vYmkgbmUgb3Igc2MgJyxcbiAgICAgICdraCc6JyBjb20gZWR1IGdvdiBtaWwgbmV0IG9yZyBwZXIgJyxcbiAgICAgICdraSc6JyBiaXogY29tIGRlIGVkdSBnb3YgaW5mbyBtb2IgbmV0IG9yZyB0ZWwgJyxcbiAgICAgICdrbSc6JyBhc3NvIGNvbSBjb29wIGVkdSBnb3V2IGsgbWVkZWNpbiBtaWwgbm9tIG5vdGFpcmVzIHBoYXJtYWNpZW5zIHByZXNzZSB0bSB2ZXRlcmluYWlyZSAnLFxuICAgICAgJ2tuJzonIGVkdSBnb3YgbmV0IG9yZyAnLFxuICAgICAgJ2tyJzonIGFjIGJ1c2FuIGNodW5nYnVrIGNodW5nbmFtIGNvIGRhZWd1IGRhZWplb24gZXMgZ2FuZ3dvbiBnbyBnd2FuZ2p1IGd5ZW9uZ2J1ayBneWVvbmdnaSBneWVvbmduYW0gaHMgaW5jaGVvbiBqZWp1IGplb25idWsgamVvbm5hbSBrIGtnIG1pbCBtcyBuZSBvciBwZSByZSBzYyBzZW91bCB1bHNhbiAnLFxuICAgICAgJ2t3JzonIGNvbSBlZHUgZ292IG5ldCBvcmcgJyxcbiAgICAgICdreSc6JyBjb20gZWR1IGdvdiBuZXQgb3JnICcsXG4gICAgICAna3onOicgY29tIGVkdSBnb3YgbWlsIG5ldCBvcmcgJyxcbiAgICAgICdsYic6JyBjb20gZWR1IGdvdiBuZXQgb3JnICcsXG4gICAgICAnbGsnOicgYXNzbiBjb20gZWR1IGdvdiBncnAgaG90ZWwgaW50IGx0ZCBuZXQgbmdvIG9yZyBzY2ggc29jIHdlYiAnLFxuICAgICAgJ2xyJzonIGNvbSBlZHUgZ292IG5ldCBvcmcgJyxcbiAgICAgICdsdic6JyBhc24gY29tIGNvbmYgZWR1IGdvdiBpZCBtaWwgbmV0IG9yZyAnLFxuICAgICAgJ2x5JzonIGNvbSBlZHUgZ292IGlkIG1lZCBuZXQgb3JnIHBsYyBzY2ggJyxcbiAgICAgICdtYSc6JyBhYyBjbyBnb3YgbSBuZXQgb3JnIHByZXNzICcsXG4gICAgICAnbWMnOicgYXNzbyB0bSAnLFxuICAgICAgJ21lJzonIGFjIGNvIGVkdSBnb3YgaXRzIG5ldCBvcmcgcHJpdiAnLFxuICAgICAgJ21nJzonIGNvbSBlZHUgZ292IG1pbCBub20gb3JnIHByZCB0bSAnLFxuICAgICAgJ21rJzonIGNvbSBlZHUgZ292IGluZiBuYW1lIG5ldCBvcmcgcHJvICcsXG4gICAgICAnbWwnOicgY29tIGVkdSBnb3YgbmV0IG9yZyBwcmVzc2UgJyxcbiAgICAgICdtbic6JyBlZHUgZ292IG9yZyAnLFxuICAgICAgJ21vJzonIGNvbSBlZHUgZ292IG5ldCBvcmcgJyxcbiAgICAgICdtdCc6JyBjb20gZWR1IGdvdiBuZXQgb3JnICcsXG4gICAgICAnbXYnOicgYWVybyBiaXogY29tIGNvb3AgZWR1IGdvdiBpbmZvIGludCBtaWwgbXVzZXVtIG5hbWUgbmV0IG9yZyBwcm8gJyxcbiAgICAgICdtdyc6JyBhYyBjbyBjb20gY29vcCBlZHUgZ292IGludCBtdXNldW0gbmV0IG9yZyAnLFxuICAgICAgJ214JzonIGNvbSBlZHUgZ29iIG5ldCBvcmcgJyxcbiAgICAgICdteSc6JyBjb20gZWR1IGdvdiBtaWwgbmFtZSBuZXQgb3JnIHNjaCAnLFxuICAgICAgJ25mJzonIGFydHMgY29tIGZpcm0gaW5mbyBuZXQgb3RoZXIgcGVyIHJlYyBzdG9yZSB3ZWIgJyxcbiAgICAgICduZyc6JyBiaXogY29tIGVkdSBnb3YgbWlsIG1vYmkgbmFtZSBuZXQgb3JnIHNjaCAnLFxuICAgICAgJ25pJzonIGFjIGNvIGNvbSBlZHUgZ29iIG1pbCBuZXQgbm9tIG9yZyAnLFxuICAgICAgJ25wJzonIGNvbSBlZHUgZ292IG1pbCBuZXQgb3JnICcsXG4gICAgICAnbnInOicgYml6IGNvbSBlZHUgZ292IGluZm8gbmV0IG9yZyAnLFxuICAgICAgJ29tJzonIGFjIGJpeiBjbyBjb20gZWR1IGdvdiBtZWQgbWlsIG11c2V1bSBuZXQgb3JnIHBybyBzY2ggJyxcbiAgICAgICdwZSc6JyBjb20gZWR1IGdvYiBtaWwgbmV0IG5vbSBvcmcgc2xkICcsXG4gICAgICAncGgnOicgY29tIGVkdSBnb3YgaSBtaWwgbmV0IG5nbyBvcmcgJyxcbiAgICAgICdwayc6JyBiaXogY29tIGVkdSBmYW0gZ29iIGdvayBnb24gZ29wIGdvcyBnb3YgbmV0IG9yZyB3ZWIgJyxcbiAgICAgICdwbCc6JyBhcnQgYmlhbHlzdG9rIGJpeiBjb20gZWR1IGdkYSBnZGFuc2sgZ29yem93IGdvdiBpbmZvIGthdG93aWNlIGtyYWtvdyBsb2R6IGx1YmxpbiBtaWwgbmV0IG5nbyBvbHN6dHluIG9yZyBwb3puYW4gcHdyIHJhZG9tIHNsdXBzayBzemN6ZWNpbiB0b3J1biB3YXJzemF3YSB3YXcgd3JvYyB3cm9jbGF3IHpnb3JhICcsXG4gICAgICAncHInOicgYWMgYml6IGNvbSBlZHUgZXN0IGdvdiBpbmZvIGlzbGEgbmFtZSBuZXQgb3JnIHBybyBwcm9mICcsXG4gICAgICAncHMnOicgY29tIGVkdSBnb3YgbmV0IG9yZyBwbG8gc2VjICcsXG4gICAgICAncHcnOicgYmVsYXUgY28gZWQgZ28gbmUgb3IgJyxcbiAgICAgICdybyc6JyBhcnRzIGNvbSBmaXJtIGluZm8gbm9tIG50IG9yZyByZWMgc3RvcmUgdG0gd3d3ICcsXG4gICAgICAncnMnOicgYWMgY28gZWR1IGdvdiBpbiBvcmcgJyxcbiAgICAgICdzYic6JyBjb20gZWR1IGdvdiBuZXQgb3JnICcsXG4gICAgICAnc2MnOicgY29tIGVkdSBnb3YgbmV0IG9yZyAnLFxuICAgICAgJ3NoJzonIGNvIGNvbSBlZHUgZ292IG5ldCBub20gb3JnICcsXG4gICAgICAnc2wnOicgY29tIGVkdSBnb3YgbmV0IG9yZyAnLFxuICAgICAgJ3N0JzonIGNvIGNvbSBjb25zdWxhZG8gZWR1IGVtYmFpeGFkYSBnb3YgbWlsIG5ldCBvcmcgcHJpbmNpcGUgc2FvdG9tZSBzdG9yZSAnLFxuICAgICAgJ3N2JzonIGNvbSBlZHUgZ29iIG9yZyByZWQgJyxcbiAgICAgICdzeic6JyBhYyBjbyBvcmcgJyxcbiAgICAgICd0cic6JyBhdiBiYnMgYmVsIGJpeiBjb20gZHIgZWR1IGdlbiBnb3YgaW5mbyBrMTIgbmFtZSBuZXQgb3JnIHBvbCB0ZWwgdHNrIHR2IHdlYiAnLFxuICAgICAgJ3R0JzonIGFlcm8gYml6IGNhdCBjbyBjb20gY29vcCBlZHUgZ292IGluZm8gaW50IGpvYnMgbWlsIG1vYmkgbXVzZXVtIG5hbWUgbmV0IG9yZyBwcm8gdGVsIHRyYXZlbCAnLFxuICAgICAgJ3R3JzonIGNsdWIgY29tIGViaXogZWR1IGdhbWUgZ292IGlkdiBtaWwgbmV0IG9yZyAnLFxuICAgICAgJ211JzonIGFjIGNvIGNvbSBnb3YgbmV0IG9yIG9yZyAnLFxuICAgICAgJ216JzonIGFjIGNvIGVkdSBnb3Ygb3JnICcsXG4gICAgICAnbmEnOicgY28gY29tICcsXG4gICAgICAnbnonOicgYWMgY28gY3JpIGdlZWsgZ2VuIGdvdnQgaGVhbHRoIGl3aSBtYW9yaSBtaWwgbmV0IG9yZyBwYXJsaWFtZW50IHNjaG9vbCAnLFxuICAgICAgJ3BhJzonIGFibyBhYyBjb20gZWR1IGdvYiBpbmcgbWVkIG5ldCBub20gb3JnIHNsZCAnLFxuICAgICAgJ3B0JzonIGNvbSBlZHUgZ292IGludCBuZXQgbm9tZSBvcmcgcHVibCAnLFxuICAgICAgJ3B5JzonIGNvbSBlZHUgZ292IG1pbCBuZXQgb3JnICcsXG4gICAgICAncWEnOicgY29tIGVkdSBnb3YgbWlsIG5ldCBvcmcgJyxcbiAgICAgICdyZSc6JyBhc3NvIGNvbSBub20gJyxcbiAgICAgICdydSc6JyBhYyBhZHlnZXlhIGFsdGFpIGFtdXIgYXJraGFuZ2Vsc2sgYXN0cmFraGFuIGJhc2hraXJpYSBiZWxnb3JvZCBiaXIgYnJ5YW5zayBidXJ5YXRpYSBjYmcgY2hlbCBjaGVseWFiaW5zayBjaGl0YSBjaHVrb3RrYSBjaHV2YXNoaWEgY29tIGRhZ2VzdGFuIGUtYnVyZyBlZHUgZ292IGdyb3pueSBpbnQgaXJrdXRzayBpdmFub3ZvIGl6aGV2c2sgamFyIGpvc2hrYXItb2xhIGthbG15a2lhIGthbHVnYSBrYW1jaGF0a2Ega2FyZWxpYSBrYXphbiBrY2hyIGtlbWVyb3ZvIGtoYWJhcm92c2sga2hha2Fzc2lhIGtodiBraXJvdiBrb2VuaWcga29taSBrb3N0cm9tYSBrcmFub3lhcnNrIGt1YmFuIGt1cmdhbiBrdXJzayBsaXBldHNrIG1hZ2FkYW4gbWFyaSBtYXJpLWVsIG1hcmluZSBtaWwgbW9yZG92aWEgbW9zcmVnIG1zayBtdXJtYW5zayBuYWxjaGlrIG5ldCBubm92IG5vdiBub3Zvc2liaXJzayBuc2sgb21zayBvcmVuYnVyZyBvcmcgb3J5b2wgcGVuemEgcGVybSBwcCBwc2tvdiBwdHogcm5kIHJ5YXphbiBzYWtoYWxpbiBzYW1hcmEgc2FyYXRvdiBzaW1iaXJzayBzbW9sZW5zayBzcGIgc3RhdnJvcG9sIHN0diBzdXJndXQgdGFtYm92IHRhdGFyc3RhbiB0b20gdG9tc2sgdHNhcml0c3luIHRzayB0dWxhIHR1dmEgdHZlciB0eXVtZW4gdWRtIHVkbXVydGlhIHVsYW4tdWRlIHZsYWRpa2F2a2F6IHZsYWRpbWlyIHZsYWRpdm9zdG9rIHZvbGdvZ3JhZCB2b2xvZ2RhIHZvcm9uZXpoIHZybiB2eWF0a2EgeWFrdXRpYSB5YW1hbCB5ZWthdGVyaW5idXJnIHl1emhuby1zYWtoYWxpbnNrICcsXG4gICAgICAncncnOicgYWMgY28gY29tIGVkdSBnb3V2IGdvdiBpbnQgbWlsIG5ldCAnLFxuICAgICAgJ3NhJzonIGNvbSBlZHUgZ292IG1lZCBuZXQgb3JnIHB1YiBzY2ggJyxcbiAgICAgICdzZCc6JyBjb20gZWR1IGdvdiBpbmZvIG1lZCBuZXQgb3JnIHR2ICcsXG4gICAgICAnc2UnOicgYSBhYyBiIGJkIGMgZCBlIGYgZyBoIGkgayBsIG0gbiBvIG9yZyBwIHBhcnRpIHBwIHByZXNzIHIgcyB0IHRtIHUgdyB4IHkgeiAnLFxuICAgICAgJ3NnJzonIGNvbSBlZHUgZ292IGlkbiBuZXQgb3JnIHBlciAnLFxuICAgICAgJ3NuJzonIGFydCBjb20gZWR1IGdvdXYgb3JnIHBlcnNvIHVuaXYgJyxcbiAgICAgICdzeSc6JyBjb20gZWR1IGdvdiBtaWwgbmV0IG5ld3Mgb3JnICcsXG4gICAgICAndGgnOicgYWMgY28gZ28gaW4gbWkgbmV0IG9yICcsXG4gICAgICAndGonOicgYWMgYml6IGNvIGNvbSBlZHUgZ28gZ292IGluZm8gaW50IG1pbCBuYW1lIG5ldCBuaWMgb3JnIHRlc3Qgd2ViICcsXG4gICAgICAndG4nOicgYWdyaW5ldCBjb20gZGVmZW5zZSBlZHVuZXQgZW5zIGZpbiBnb3YgaW5kIGluZm8gaW50bCBtaW5jb20gbmF0IG5ldCBvcmcgcGVyc28gcm5ydCBybnMgcm51IHRvdXJpc20gJyxcbiAgICAgICd0eic6JyBhYyBjbyBnbyBuZSBvciAnLFxuICAgICAgJ3VhJzonIGJpeiBjaGVya2Fzc3kgY2hlcm5pZ292IGNoZXJub3Z0c3kgY2sgY24gY28gY29tIGNyaW1lYSBjdiBkbiBkbmVwcm9wZXRyb3ZzayBkb25ldHNrIGRwIGVkdSBnb3YgaWYgaW4gaXZhbm8tZnJhbmtpdnNrIGtoIGtoYXJrb3Yga2hlcnNvbiBraG1lbG5pdHNraXkga2lldiBraXJvdm9ncmFkIGttIGtyIGtzIGt2IGxnIGx1Z2Fuc2sgbHV0c2sgbHZpdiBtZSBtayBuZXQgbmlrb2xhZXYgb2Qgb2Rlc3NhIG9yZyBwbCBwb2x0YXZhIHBwIHJvdm5vIHJ2IHNlYmFzdG9wb2wgc3VteSB0ZSB0ZXJub3BpbCB1emhnb3JvZCB2aW5uaWNhIHZuIHphcG9yaXpoemhlIHpoaXRvbWlyIHpwIHp0ICcsXG4gICAgICAndWcnOicgYWMgY28gZ28gbmUgb3Igb3JnIHNjICcsXG4gICAgICAndWsnOicgYWMgYmwgYnJpdGlzaC1saWJyYXJ5IGNvIGN5bSBnb3YgZ292dCBpY25ldCBqZXQgbGVhIGx0ZCBtZSBtaWwgbW9kIG5hdGlvbmFsLWxpYnJhcnktc2NvdGxhbmQgbmVsIG5ldCBuaHMgbmljIG5scyBvcmcgb3JnbiBwYXJsaWFtZW50IHBsYyBwb2xpY2Ugc2NoIHNjb3Qgc29jICcsXG4gICAgICAndXMnOicgZG5pIGZlZCBpc2Ega2lkcyBuc24gJyxcbiAgICAgICd1eSc6JyBjb20gZWR1IGd1YiBtaWwgbmV0IG9yZyAnLFxuICAgICAgJ3ZlJzonIGNvIGNvbSBlZHUgZ29iIGluZm8gbWlsIG5ldCBvcmcgd2ViICcsXG4gICAgICAndmknOicgY28gY29tIGsxMiBuZXQgb3JnICcsXG4gICAgICAndm4nOicgYWMgYml6IGNvbSBlZHUgZ292IGhlYWx0aCBpbmZvIGludCBuYW1lIG5ldCBvcmcgcHJvICcsXG4gICAgICAneWUnOicgY28gY29tIGdvdiBsdGQgbWUgbmV0IG9yZyBwbGMgJyxcbiAgICAgICd5dSc6JyBhYyBjbyBlZHUgZ292IG9yZyAnLFxuICAgICAgJ3phJzonIGFjIGFncmljIGFsdCBib3Vyc2UgY2l0eSBjbyBjeWJlcm5ldCBkYiBlZHUgZ292IGdyb25kYXIgaWFjY2VzcyBpbXQgaW5jYSBsYW5kZXNpZ24gbGF3IG1pbCBuZXQgbmdvIG5pcyBub20gb2xpdmV0dGkgb3JnIHBpeCBzY2hvb2wgdG0gd2ViICcsXG4gICAgICAnem0nOicgYWMgY28gY29tIGVkdSBnb3YgbmV0IG9yZyBzY2ggJ1xuICAgIH0sXG4gICAgLy8gZ29yaGlsbCAyMDEzLTEwLTI1OiBVc2luZyBpbmRleE9mKCkgaW5zdGVhZCBSZWdleHAoKS4gU2lnbmlmaWNhbnQgYm9vc3RcbiAgICAvLyBpbiBib3RoIHBlcmZvcm1hbmNlIGFuZCBtZW1vcnkgZm9vdHByaW50LiBObyBpbml0aWFsaXphdGlvbiByZXF1aXJlZC5cbiAgICAvLyBodHRwOi8vanNwZXJmLmNvbS91cmktanMtc2xkLXJlZ2V4LXZzLWJpbmFyeS1zZWFyY2gvNFxuICAgIC8vIEZvbGxvd2luZyBtZXRob2RzIHVzZSBsYXN0SW5kZXhPZigpIHJhdGhlciB0aGFuIGFycmF5LnNwbGl0KCkgaW4gb3JkZXJcbiAgICAvLyB0byBhdm9pZCBhbnkgbWVtb3J5IGFsbG9jYXRpb25zLlxuICAgIGhhczogZnVuY3Rpb24oZG9tYWluKSB7XG4gICAgICB2YXIgdGxkT2Zmc2V0ID0gZG9tYWluLmxhc3RJbmRleE9mKCcuJyk7XG4gICAgICBpZiAodGxkT2Zmc2V0IDw9IDAgfHwgdGxkT2Zmc2V0ID49IChkb21haW4ubGVuZ3RoLTEpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHZhciBzbGRPZmZzZXQgPSBkb21haW4ubGFzdEluZGV4T2YoJy4nLCB0bGRPZmZzZXQtMSk7XG4gICAgICBpZiAoc2xkT2Zmc2V0IDw9IDAgfHwgc2xkT2Zmc2V0ID49ICh0bGRPZmZzZXQtMSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgdmFyIHNsZExpc3QgPSBTTEQubGlzdFtkb21haW4uc2xpY2UodGxkT2Zmc2V0KzEpXTtcbiAgICAgIGlmICghc2xkTGlzdCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2xkTGlzdC5pbmRleE9mKCcgJyArIGRvbWFpbi5zbGljZShzbGRPZmZzZXQrMSwgdGxkT2Zmc2V0KSArICcgJykgPj0gMDtcbiAgICB9LFxuICAgIGlzOiBmdW5jdGlvbihkb21haW4pIHtcbiAgICAgIHZhciB0bGRPZmZzZXQgPSBkb21haW4ubGFzdEluZGV4T2YoJy4nKTtcbiAgICAgIGlmICh0bGRPZmZzZXQgPD0gMCB8fCB0bGRPZmZzZXQgPj0gKGRvbWFpbi5sZW5ndGgtMSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgdmFyIHNsZE9mZnNldCA9IGRvbWFpbi5sYXN0SW5kZXhPZignLicsIHRsZE9mZnNldC0xKTtcbiAgICAgIGlmIChzbGRPZmZzZXQgPj0gMCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICB2YXIgc2xkTGlzdCA9IFNMRC5saXN0W2RvbWFpbi5zbGljZSh0bGRPZmZzZXQrMSldO1xuICAgICAgaWYgKCFzbGRMaXN0KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzbGRMaXN0LmluZGV4T2YoJyAnICsgZG9tYWluLnNsaWNlKDAsIHRsZE9mZnNldCkgKyAnICcpID49IDA7XG4gICAgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKGRvbWFpbikge1xuICAgICAgdmFyIHRsZE9mZnNldCA9IGRvbWFpbi5sYXN0SW5kZXhPZignLicpO1xuICAgICAgaWYgKHRsZE9mZnNldCA8PSAwIHx8IHRsZE9mZnNldCA+PSAoZG9tYWluLmxlbmd0aC0xKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHZhciBzbGRPZmZzZXQgPSBkb21haW4ubGFzdEluZGV4T2YoJy4nLCB0bGRPZmZzZXQtMSk7XG4gICAgICBpZiAoc2xkT2Zmc2V0IDw9IDAgfHwgc2xkT2Zmc2V0ID49ICh0bGRPZmZzZXQtMSkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICB2YXIgc2xkTGlzdCA9IFNMRC5saXN0W2RvbWFpbi5zbGljZSh0bGRPZmZzZXQrMSldO1xuICAgICAgaWYgKCFzbGRMaXN0KSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgaWYgKHNsZExpc3QuaW5kZXhPZignICcgKyBkb21haW4uc2xpY2Uoc2xkT2Zmc2V0KzEsIHRsZE9mZnNldCkgKyAnICcpIDwgMCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkb21haW4uc2xpY2Uoc2xkT2Zmc2V0KzEpO1xuICAgIH0sXG4gICAgbm9Db25mbGljdDogZnVuY3Rpb24oKXtcbiAgICAgIGlmIChyb290LlNlY29uZExldmVsRG9tYWlucyA9PT0gdGhpcykge1xuICAgICAgICByb290LlNlY29uZExldmVsRG9tYWlucyA9IF9TZWNvbmRMZXZlbERvbWFpbnM7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIFNMRDtcbn0pKTtcbiIsIi8qIVxuICogVVJJLmpzIC0gTXV0YXRpbmcgVVJMc1xuICpcbiAqIFZlcnNpb246IDEuMTUuMFxuICpcbiAqIEF1dGhvcjogUm9kbmV5IFJlaG1cbiAqIFdlYjogaHR0cDovL21lZGlhbGl6ZS5naXRodWIuaW8vVVJJLmpzL1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyXG4gKiAgIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqICAgR1BMIHYzIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9HUEwtMy4wXG4gKlxuICovXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICAvLyBodHRwczovL2dpdGh1Yi5jb20vdW1kanMvdW1kL2Jsb2IvbWFzdGVyL3JldHVybkV4cG9ydHMuanNcbiAgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIC8vIE5vZGVcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZSgnLi9wdW55Y29kZScpLCByZXF1aXJlKCcuL0lQdjYnKSwgcmVxdWlyZSgnLi9TZWNvbmRMZXZlbERvbWFpbnMnKSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgIGRlZmluZShbJy4vcHVueWNvZGUnLCAnLi9JUHY2JywgJy4vU2Vjb25kTGV2ZWxEb21haW5zJ10sIGZhY3RvcnkpO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXG4gICAgcm9vdC5VUkkgPSBmYWN0b3J5KHJvb3QucHVueWNvZGUsIHJvb3QuSVB2Niwgcm9vdC5TZWNvbmRMZXZlbERvbWFpbnMsIHJvb3QpO1xuICB9XG59KHRoaXMsIGZ1bmN0aW9uIChwdW55Y29kZSwgSVB2NiwgU0xELCByb290KSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgLypnbG9iYWwgbG9jYXRpb24sIGVzY2FwZSwgdW5lc2NhcGUgKi9cbiAgLy8gRklYTUU6IHYyLjAuMCByZW5hbWNlIG5vbi1jYW1lbENhc2UgcHJvcGVydGllcyB0byB1cHBlcmNhc2VcbiAgLypqc2hpbnQgY2FtZWxjYXNlOiBmYWxzZSAqL1xuXG4gIC8vIHNhdmUgY3VycmVudCBVUkkgdmFyaWFibGUsIGlmIGFueVxuICB2YXIgX1VSSSA9IHJvb3QgJiYgcm9vdC5VUkk7XG5cbiAgZnVuY3Rpb24gVVJJKHVybCwgYmFzZSkge1xuICAgIC8vIEFsbG93IGluc3RhbnRpYXRpb24gd2l0aG91dCB0aGUgJ25ldycga2V5d29yZFxuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBVUkkpKSB7XG4gICAgICByZXR1cm4gbmV3IFVSSSh1cmwsIGJhc2UpO1xuICAgIH1cblxuICAgIGlmICh1cmwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndW5kZWZpbmVkIGlzIG5vdCBhIHZhbGlkIGFyZ3VtZW50IGZvciBVUkknKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBsb2NhdGlvbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdXJsID0gbG9jYXRpb24uaHJlZiArICcnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXJsID0gJyc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5ocmVmKHVybCk7XG5cbiAgICAvLyByZXNvbHZlIHRvIGJhc2UgYWNjb3JkaW5nIHRvIGh0dHA6Ly9kdmNzLnczLm9yZy9oZy91cmwvcmF3LWZpbGUvdGlwL092ZXJ2aWV3Lmh0bWwjY29uc3RydWN0b3JcbiAgICBpZiAoYmFzZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5hYnNvbHV0ZVRvKGJhc2UpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgVVJJLnZlcnNpb24gPSAnMS4xNS4wJztcblxuICB2YXIgcCA9IFVSSS5wcm90b3R5cGU7XG4gIHZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG4gIGZ1bmN0aW9uIGVzY2FwZVJlZ0V4KHN0cmluZykge1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tZWRpYWxpemUvVVJJLmpzL2NvbW1pdC84NWFjMjE3ODNjMTFmOGNjYWIwNjEwNmRiYTk3MzVhMzFhODY5MjRkI2NvbW1pdGNvbW1lbnQtODIxOTYzXG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC8oWy4qKz9ePSE6JHt9KCl8W1xcXVxcL1xcXFxdKS9nLCAnXFxcXCQxJyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRUeXBlKHZhbHVlKSB7XG4gICAgLy8gSUU4IGRvZXNuJ3QgcmV0dXJuIFtPYmplY3QgVW5kZWZpbmVkXSBidXQgW09iamVjdCBPYmplY3RdIGZvciB1bmRlZmluZWQgdmFsdWVcbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuICdVbmRlZmluZWQnO1xuICAgIH1cblxuICAgIHJldHVybiBTdHJpbmcoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSkuc2xpY2UoOCwgLTEpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNBcnJheShvYmopIHtcbiAgICByZXR1cm4gZ2V0VHlwZShvYmopID09PSAnQXJyYXknO1xuICB9XG5cbiAgZnVuY3Rpb24gZmlsdGVyQXJyYXlWYWx1ZXMoZGF0YSwgdmFsdWUpIHtcbiAgICB2YXIgbG9va3VwID0ge307XG4gICAgdmFyIGksIGxlbmd0aDtcblxuICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0gdmFsdWUubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbG9va3VwW3ZhbHVlW2ldXSA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvb2t1cFt2YWx1ZV0gPSB0cnVlO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IGRhdGEubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChsb29rdXBbZGF0YVtpXV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBkYXRhLnNwbGljZShpLCAxKTtcbiAgICAgICAgbGVuZ3RoLS07XG4gICAgICAgIGktLTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFycmF5Q29udGFpbnMobGlzdCwgdmFsdWUpIHtcbiAgICB2YXIgaSwgbGVuZ3RoO1xuXG4gICAgLy8gdmFsdWUgbWF5IGJlIHN0cmluZywgbnVtYmVyLCBhcnJheSwgcmVnZXhwXG4gICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAvLyBOb3RlOiB0aGlzIGNhbiBiZSBvcHRpbWl6ZWQgdG8gTyhuKSAoaW5zdGVhZCBvZiBjdXJyZW50IE8obSAqIG4pKVxuICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0gdmFsdWUubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKCFhcnJheUNvbnRhaW5zKGxpc3QsIHZhbHVlW2ldKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICB2YXIgX3R5cGUgPSBnZXRUeXBlKHZhbHVlKTtcbiAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBsaXN0Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoX3R5cGUgPT09ICdSZWdFeHAnKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbGlzdFtpXSA9PT0gJ3N0cmluZycgJiYgbGlzdFtpXS5tYXRjaCh2YWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChsaXN0W2ldID09PSB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBhcnJheXNFcXVhbChvbmUsIHR3bykge1xuICAgIGlmICghaXNBcnJheShvbmUpIHx8ICFpc0FycmF5KHR3bykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBhcnJheXMgY2FuJ3QgYmUgZXF1YWwgaWYgdGhleSBoYXZlIGRpZmZlcmVudCBhbW91bnQgb2YgY29udGVudFxuICAgIGlmIChvbmUubGVuZ3RoICE9PSB0d28ubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgb25lLnNvcnQoKTtcbiAgICB0d28uc29ydCgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBvbmUubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAob25lW2ldICE9PSB0d29baV0pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgVVJJLl9wYXJ0cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBwcm90b2NvbDogbnVsbCxcbiAgICAgIHVzZXJuYW1lOiBudWxsLFxuICAgICAgcGFzc3dvcmQ6IG51bGwsXG4gICAgICBob3N0bmFtZTogbnVsbCxcbiAgICAgIHVybjogbnVsbCxcbiAgICAgIHBvcnQ6IG51bGwsXG4gICAgICBwYXRoOiBudWxsLFxuICAgICAgcXVlcnk6IG51bGwsXG4gICAgICBmcmFnbWVudDogbnVsbCxcbiAgICAgIC8vIHN0YXRlXG4gICAgICBkdXBsaWNhdGVRdWVyeVBhcmFtZXRlcnM6IFVSSS5kdXBsaWNhdGVRdWVyeVBhcmFtZXRlcnMsXG4gICAgICBlc2NhcGVRdWVyeVNwYWNlOiBVUkkuZXNjYXBlUXVlcnlTcGFjZVxuICAgIH07XG4gIH07XG4gIC8vIHN0YXRlOiBhbGxvdyBkdXBsaWNhdGUgcXVlcnkgcGFyYW1ldGVycyAoYT0xJmE9MSlcbiAgVVJJLmR1cGxpY2F0ZVF1ZXJ5UGFyYW1ldGVycyA9IGZhbHNlO1xuICAvLyBzdGF0ZTogcmVwbGFjZXMgKyB3aXRoICUyMCAoc3BhY2UgaW4gcXVlcnkgc3RyaW5ncylcbiAgVVJJLmVzY2FwZVF1ZXJ5U3BhY2UgPSB0cnVlO1xuICAvLyBzdGF0aWMgcHJvcGVydGllc1xuICBVUkkucHJvdG9jb2xfZXhwcmVzc2lvbiA9IC9eW2Etel1bYS16MC05ListXSokL2k7XG4gIFVSSS5pZG5fZXhwcmVzc2lvbiA9IC9bXmEtejAtOVxcLi1dL2k7XG4gIFVSSS5wdW55Y29kZV9leHByZXNzaW9uID0gLyh4bi0tKS9pO1xuICAvLyB3ZWxsLCAzMzMuNDQ0LjU1NS42NjYgbWF0Y2hlcywgYnV0IGl0IHN1cmUgYWluJ3Qgbm8gSVB2NCAtIGRvIHdlIGNhcmU/XG4gIFVSSS5pcDRfZXhwcmVzc2lvbiA9IC9eXFxkezEsM31cXC5cXGR7MSwzfVxcLlxcZHsxLDN9XFwuXFxkezEsM30kLztcbiAgLy8gY3JlZGl0cyB0byBSaWNoIEJyb3duXG4gIC8vIHNvdXJjZTogaHR0cDovL2ZvcnVtcy5pbnRlcm1hcHBlci5jb20vdmlld3RvcGljLnBocD9wPTEwOTYjMTA5NlxuICAvLyBzcGVjaWZpY2F0aW9uOiBodHRwOi8vd3d3LmlldGYub3JnL3JmYy9yZmM0MjkxLnR4dFxuICBVUkkuaXA2X2V4cHJlc3Npb24gPSAvXlxccyooKChbMC05QS1GYS1mXXsxLDR9Oil7N30oWzAtOUEtRmEtZl17MSw0fXw6KSl8KChbMC05QS1GYS1mXXsxLDR9Oil7Nn0oOlswLTlBLUZhLWZdezEsNH18KCgyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkoXFwuKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKSl7M30pfDopKXwoKFswLTlBLUZhLWZdezEsNH06KXs1fSgoKDpbMC05QS1GYS1mXXsxLDR9KXsxLDJ9KXw6KCgyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkoXFwuKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKSl7M30pfDopKXwoKFswLTlBLUZhLWZdezEsNH06KXs0fSgoKDpbMC05QS1GYS1mXXsxLDR9KXsxLDN9KXwoKDpbMC05QS1GYS1mXXsxLDR9KT86KCgyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkoXFwuKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKSl7M30pKXw6KSl8KChbMC05QS1GYS1mXXsxLDR9Oil7M30oKCg6WzAtOUEtRmEtZl17MSw0fSl7MSw0fSl8KCg6WzAtOUEtRmEtZl17MSw0fSl7MCwyfTooKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKShcXC4oMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSkpfDopKXwoKFswLTlBLUZhLWZdezEsNH06KXsyfSgoKDpbMC05QS1GYS1mXXsxLDR9KXsxLDV9KXwoKDpbMC05QS1GYS1mXXsxLDR9KXswLDN9OigoMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKFxcLigyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkpezN9KSl8OikpfCgoWzAtOUEtRmEtZl17MSw0fTopezF9KCgoOlswLTlBLUZhLWZdezEsNH0pezEsNn0pfCgoOlswLTlBLUZhLWZdezEsNH0pezAsNH06KCgyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkoXFwuKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKSl7M30pKXw6KSl8KDooKCg6WzAtOUEtRmEtZl17MSw0fSl7MSw3fSl8KCg6WzAtOUEtRmEtZl17MSw0fSl7MCw1fTooKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKShcXC4oMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSkpfDopKSkoJS4rKT9cXHMqJC87XG4gIC8vIGV4cHJlc3Npb24gdXNlZCBpcyBcImdydWJlciByZXZpc2VkXCIgKEBncnViZXIgdjIpIGRldGVybWluZWQgdG8gYmUgdGhlXG4gIC8vIGJlc3Qgc29sdXRpb24gaW4gYSByZWdleC1nb2xmIHdlIGRpZCBhIGNvdXBsZSBvZiBhZ2VzIGFnbyBhdFxuICAvLyAqIGh0dHA6Ly9tYXRoaWFzYnluZW5zLmJlL2RlbW8vdXJsLXJlZ2V4XG4gIC8vICogaHR0cDovL3JvZG5leXJlaG0uZGUvdC91cmwtcmVnZXguaHRtbFxuICBVUkkuZmluZF91cmlfZXhwcmVzc2lvbiA9IC9cXGIoKD86W2Etel1bXFx3LV0rOig/OlxcL3sxLDN9fFthLXowLTklXSl8d3d3XFxkezAsM31bLl18W2EtejAtOS5cXC1dK1suXVthLXpdezIsNH1cXC8pKD86W15cXHMoKTw+XSt8XFwoKFteXFxzKCk8Pl0rfChcXChbXlxccygpPD5dK1xcKSkpKlxcKSkrKD86XFwoKFteXFxzKCk8Pl0rfChcXChbXlxccygpPD5dK1xcKSkpKlxcKXxbXlxcc2AhKClcXFtcXF17fTs6J1wiLiw8Pj/Cq8K74oCc4oCd4oCY4oCZXSkpL2lnO1xuICBVUkkuZmluZFVyaSA9IHtcbiAgICAvLyB2YWxpZCBcInNjaGVtZTovL1wiIG9yIFwid3d3LlwiXG4gICAgc3RhcnQ6IC9cXGIoPzooW2Etel1bYS16MC05ListXSo6XFwvXFwvKXx3d3dcXC4pL2dpLFxuICAgIC8vIGV2ZXJ5dGhpbmcgdXAgdG8gdGhlIG5leHQgd2hpdGVzcGFjZVxuICAgIGVuZDogL1tcXHNcXHJcXG5dfCQvLFxuICAgIC8vIHRyaW0gdHJhaWxpbmcgcHVuY3R1YXRpb24gY2FwdHVyZWQgYnkgZW5kIFJlZ0V4cFxuICAgIHRyaW06IC9bYCEoKVxcW1xcXXt9OzonXCIuLDw+P8KrwrvigJzigJ3igJ7igJjigJldKyQvXG4gIH07XG4gIC8vIGh0dHA6Ly93d3cuaWFuYS5vcmcvYXNzaWdubWVudHMvdXJpLXNjaGVtZXMuaHRtbFxuICAvLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xpc3Rfb2ZfVENQX2FuZF9VRFBfcG9ydF9udW1iZXJzI1dlbGwta25vd25fcG9ydHNcbiAgVVJJLmRlZmF1bHRQb3J0cyA9IHtcbiAgICBodHRwOiAnODAnLFxuICAgIGh0dHBzOiAnNDQzJyxcbiAgICBmdHA6ICcyMScsXG4gICAgZ29waGVyOiAnNzAnLFxuICAgIHdzOiAnODAnLFxuICAgIHdzczogJzQ0MydcbiAgfTtcbiAgLy8gYWxsb3dlZCBob3N0bmFtZSBjaGFyYWN0ZXJzIGFjY29yZGluZyB0byBSRkMgMzk4NlxuICAvLyBBTFBIQSBESUdJVCBcIi1cIiBcIi5cIiBcIl9cIiBcIn5cIiBcIiFcIiBcIiRcIiBcIiZcIiBcIidcIiBcIihcIiBcIilcIiBcIipcIiBcIitcIiBcIixcIiBcIjtcIiBcIj1cIiAlZW5jb2RlZFxuICAvLyBJJ3ZlIG5ldmVyIHNlZW4gYSAobm9uLUlETikgaG9zdG5hbWUgb3RoZXIgdGhhbjogQUxQSEEgRElHSVQgLiAtXG4gIFVSSS5pbnZhbGlkX2hvc3RuYW1lX2NoYXJhY3RlcnMgPSAvW15hLXpBLVowLTlcXC4tXS87XG4gIC8vIG1hcCBET00gRWxlbWVudHMgdG8gdGhlaXIgVVJJIGF0dHJpYnV0ZVxuICBVUkkuZG9tQXR0cmlidXRlcyA9IHtcbiAgICAnYSc6ICdocmVmJyxcbiAgICAnYmxvY2txdW90ZSc6ICdjaXRlJyxcbiAgICAnbGluayc6ICdocmVmJyxcbiAgICAnYmFzZSc6ICdocmVmJyxcbiAgICAnc2NyaXB0JzogJ3NyYycsXG4gICAgJ2Zvcm0nOiAnYWN0aW9uJyxcbiAgICAnaW1nJzogJ3NyYycsXG4gICAgJ2FyZWEnOiAnaHJlZicsXG4gICAgJ2lmcmFtZSc6ICdzcmMnLFxuICAgICdlbWJlZCc6ICdzcmMnLFxuICAgICdzb3VyY2UnOiAnc3JjJyxcbiAgICAndHJhY2snOiAnc3JjJyxcbiAgICAnaW5wdXQnOiAnc3JjJywgLy8gYnV0IG9ubHkgaWYgdHlwZT1cImltYWdlXCJcbiAgICAnYXVkaW8nOiAnc3JjJyxcbiAgICAndmlkZW8nOiAnc3JjJ1xuICB9O1xuICBVUkkuZ2V0RG9tQXR0cmlidXRlID0gZnVuY3Rpb24obm9kZSkge1xuICAgIGlmICghbm9kZSB8fCAhbm9kZS5ub2RlTmFtZSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB2YXIgbm9kZU5hbWUgPSBub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgLy8gPGlucHV0PiBzaG91bGQgb25seSBleHBvc2Ugc3JjIGZvciB0eXBlPVwiaW1hZ2VcIlxuICAgIGlmIChub2RlTmFtZSA9PT0gJ2lucHV0JyAmJiBub2RlLnR5cGUgIT09ICdpbWFnZScpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIFVSSS5kb21BdHRyaWJ1dGVzW25vZGVOYW1lXTtcbiAgfTtcblxuICBmdW5jdGlvbiBlc2NhcGVGb3JEdW1iRmlyZWZveDM2KHZhbHVlKSB7XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21lZGlhbGl6ZS9VUkkuanMvaXNzdWVzLzkxXG4gICAgcmV0dXJuIGVzY2FwZSh2YWx1ZSk7XG4gIH1cblxuICAvLyBlbmNvZGluZyAvIGRlY29kaW5nIGFjY29yZGluZyB0byBSRkMzOTg2XG4gIGZ1bmN0aW9uIHN0cmljdEVuY29kZVVSSUNvbXBvbmVudChzdHJpbmcpIHtcbiAgICAvLyBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9lbmNvZGVVUklDb21wb25lbnRcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZylcbiAgICAgIC5yZXBsYWNlKC9bIScoKSpdL2csIGVzY2FwZUZvckR1bWJGaXJlZm94MzYpXG4gICAgICAucmVwbGFjZSgvXFwqL2csICclMkEnKTtcbiAgfVxuICBVUkkuZW5jb2RlID0gc3RyaWN0RW5jb2RlVVJJQ29tcG9uZW50O1xuICBVUkkuZGVjb2RlID0gZGVjb2RlVVJJQ29tcG9uZW50O1xuICBVUkkuaXNvODg1OSA9IGZ1bmN0aW9uKCkge1xuICAgIFVSSS5lbmNvZGUgPSBlc2NhcGU7XG4gICAgVVJJLmRlY29kZSA9IHVuZXNjYXBlO1xuICB9O1xuICBVUkkudW5pY29kZSA9IGZ1bmN0aW9uKCkge1xuICAgIFVSSS5lbmNvZGUgPSBzdHJpY3RFbmNvZGVVUklDb21wb25lbnQ7XG4gICAgVVJJLmRlY29kZSA9IGRlY29kZVVSSUNvbXBvbmVudDtcbiAgfTtcbiAgVVJJLmNoYXJhY3RlcnMgPSB7XG4gICAgcGF0aG5hbWU6IHtcbiAgICAgIGVuY29kZToge1xuICAgICAgICAvLyBSRkMzOTg2IDIuMTogRm9yIGNvbnNpc3RlbmN5LCBVUkkgcHJvZHVjZXJzIGFuZCBub3JtYWxpemVycyBzaG91bGRcbiAgICAgICAgLy8gdXNlIHVwcGVyY2FzZSBoZXhhZGVjaW1hbCBkaWdpdHMgZm9yIGFsbCBwZXJjZW50LWVuY29kaW5ncy5cbiAgICAgICAgZXhwcmVzc2lvbjogLyUoMjR8MjZ8MkJ8MkN8M0J8M0R8M0F8NDApL2lnLFxuICAgICAgICBtYXA6IHtcbiAgICAgICAgICAvLyAtLl9+IScoKSpcbiAgICAgICAgICAnJTI0JzogJyQnLFxuICAgICAgICAgICclMjYnOiAnJicsXG4gICAgICAgICAgJyUyQic6ICcrJyxcbiAgICAgICAgICAnJTJDJzogJywnLFxuICAgICAgICAgICclM0InOiAnOycsXG4gICAgICAgICAgJyUzRCc6ICc9JyxcbiAgICAgICAgICAnJTNBJzogJzonLFxuICAgICAgICAgICclNDAnOiAnQCdcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGRlY29kZToge1xuICAgICAgICBleHByZXNzaW9uOiAvW1xcL1xcPyNdL2csXG4gICAgICAgIG1hcDoge1xuICAgICAgICAgICcvJzogJyUyRicsXG4gICAgICAgICAgJz8nOiAnJTNGJyxcbiAgICAgICAgICAnIyc6ICclMjMnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHJlc2VydmVkOiB7XG4gICAgICBlbmNvZGU6IHtcbiAgICAgICAgLy8gUkZDMzk4NiAyLjE6IEZvciBjb25zaXN0ZW5jeSwgVVJJIHByb2R1Y2VycyBhbmQgbm9ybWFsaXplcnMgc2hvdWxkXG4gICAgICAgIC8vIHVzZSB1cHBlcmNhc2UgaGV4YWRlY2ltYWwgZGlnaXRzIGZvciBhbGwgcGVyY2VudC1lbmNvZGluZ3MuXG4gICAgICAgIGV4cHJlc3Npb246IC8lKDIxfDIzfDI0fDI2fDI3fDI4fDI5fDJBfDJCfDJDfDJGfDNBfDNCfDNEfDNGfDQwfDVCfDVEKS9pZyxcbiAgICAgICAgbWFwOiB7XG4gICAgICAgICAgLy8gZ2VuLWRlbGltc1xuICAgICAgICAgICclM0EnOiAnOicsXG4gICAgICAgICAgJyUyRic6ICcvJyxcbiAgICAgICAgICAnJTNGJzogJz8nLFxuICAgICAgICAgICclMjMnOiAnIycsXG4gICAgICAgICAgJyU1Qic6ICdbJyxcbiAgICAgICAgICAnJTVEJzogJ10nLFxuICAgICAgICAgICclNDAnOiAnQCcsXG4gICAgICAgICAgLy8gc3ViLWRlbGltc1xuICAgICAgICAgICclMjEnOiAnIScsXG4gICAgICAgICAgJyUyNCc6ICckJyxcbiAgICAgICAgICAnJTI2JzogJyYnLFxuICAgICAgICAgICclMjcnOiAnXFwnJyxcbiAgICAgICAgICAnJTI4JzogJygnLFxuICAgICAgICAgICclMjknOiAnKScsXG4gICAgICAgICAgJyUyQSc6ICcqJyxcbiAgICAgICAgICAnJTJCJzogJysnLFxuICAgICAgICAgICclMkMnOiAnLCcsXG4gICAgICAgICAgJyUzQic6ICc7JyxcbiAgICAgICAgICAnJTNEJzogJz0nXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHVybnBhdGg6IHtcbiAgICAgIC8vIFRoZSBjaGFyYWN0ZXJzIHVuZGVyIGBlbmNvZGVgIGFyZSB0aGUgY2hhcmFjdGVycyBjYWxsZWQgb3V0IGJ5IFJGQyAyMTQxIGFzIGJlaW5nIGFjY2VwdGFibGVcbiAgICAgIC8vIGZvciB1c2FnZSBpbiBhIFVSTi4gUkZDMjE0MSBhbHNvIGNhbGxzIG91dCBcIi1cIiwgXCIuXCIsIGFuZCBcIl9cIiBhcyBhY2NlcHRhYmxlIGNoYXJhY3RlcnMsIGJ1dFxuICAgICAgLy8gdGhlc2UgYXJlbid0IGVuY29kZWQgYnkgZW5jb2RlVVJJQ29tcG9uZW50LCBzbyB3ZSBkb24ndCBoYXZlIHRvIGNhbGwgdGhlbSBvdXQgaGVyZS4gQWxzb1xuICAgICAgLy8gbm90ZSB0aGF0IHRoZSBjb2xvbiBjaGFyYWN0ZXIgaXMgbm90IGZlYXR1cmVkIGluIHRoZSBlbmNvZGluZyBtYXA7IHRoaXMgaXMgYmVjYXVzZSBVUkkuanNcbiAgICAgIC8vIGdpdmVzIHRoZSBjb2xvbnMgaW4gVVJOcyBzZW1hbnRpYyBtZWFuaW5nIGFzIHRoZSBkZWxpbWl0ZXJzIG9mIHBhdGggc2VnZW1lbnRzLCBhbmQgc28gaXRcbiAgICAgIC8vIHNob3VsZCBub3QgYXBwZWFyIHVuZW5jb2RlZCBpbiBhIHNlZ21lbnQgaXRzZWxmLlxuICAgICAgLy8gU2VlIGFsc28gdGhlIG5vdGUgYWJvdmUgYWJvdXQgUkZDMzk4NiBhbmQgY2FwaXRhbGFsaXplZCBoZXggZGlnaXRzLlxuICAgICAgZW5jb2RlOiB7XG4gICAgICAgIGV4cHJlc3Npb246IC8lKDIxfDI0fDI3fDI4fDI5fDJBfDJCfDJDfDNCfDNEfDQwKS9pZyxcbiAgICAgICAgbWFwOiB7XG4gICAgICAgICAgJyUyMSc6ICchJyxcbiAgICAgICAgICAnJTI0JzogJyQnLFxuICAgICAgICAgICclMjcnOiAnXFwnJyxcbiAgICAgICAgICAnJTI4JzogJygnLFxuICAgICAgICAgICclMjknOiAnKScsXG4gICAgICAgICAgJyUyQSc6ICcqJyxcbiAgICAgICAgICAnJTJCJzogJysnLFxuICAgICAgICAgICclMkMnOiAnLCcsXG4gICAgICAgICAgJyUzQic6ICc7JyxcbiAgICAgICAgICAnJTNEJzogJz0nLFxuICAgICAgICAgICclNDAnOiAnQCdcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIFRoZXNlIGNoYXJhY3RlcnMgYXJlIHRoZSBjaGFyYWN0ZXJzIGNhbGxlZCBvdXQgYnkgUkZDMjE0MSBhcyBcInJlc2VydmVkXCIgY2hhcmFjdGVycyB0aGF0XG4gICAgICAvLyBzaG91bGQgbmV2ZXIgYXBwZWFyIGluIGEgVVJOLCBwbHVzIHRoZSBjb2xvbiBjaGFyYWN0ZXIgKHNlZSBub3RlIGFib3ZlKS5cbiAgICAgIGRlY29kZToge1xuICAgICAgICBleHByZXNzaW9uOiAvW1xcL1xcPyM6XS9nLFxuICAgICAgICBtYXA6IHtcbiAgICAgICAgICAnLyc6ICclMkYnLFxuICAgICAgICAgICc/JzogJyUzRicsXG4gICAgICAgICAgJyMnOiAnJTIzJyxcbiAgICAgICAgICAnOic6ICclM0EnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIFVSSS5lbmNvZGVRdWVyeSA9IGZ1bmN0aW9uKHN0cmluZywgZXNjYXBlUXVlcnlTcGFjZSkge1xuICAgIHZhciBlc2NhcGVkID0gVVJJLmVuY29kZShzdHJpbmcgKyAnJyk7XG4gICAgaWYgKGVzY2FwZVF1ZXJ5U3BhY2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXNjYXBlUXVlcnlTcGFjZSA9IFVSSS5lc2NhcGVRdWVyeVNwYWNlO1xuICAgIH1cblxuICAgIHJldHVybiBlc2NhcGVRdWVyeVNwYWNlID8gZXNjYXBlZC5yZXBsYWNlKC8lMjAvZywgJysnKSA6IGVzY2FwZWQ7XG4gIH07XG4gIFVSSS5kZWNvZGVRdWVyeSA9IGZ1bmN0aW9uKHN0cmluZywgZXNjYXBlUXVlcnlTcGFjZSkge1xuICAgIHN0cmluZyArPSAnJztcbiAgICBpZiAoZXNjYXBlUXVlcnlTcGFjZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBlc2NhcGVRdWVyeVNwYWNlID0gVVJJLmVzY2FwZVF1ZXJ5U3BhY2U7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBVUkkuZGVjb2RlKGVzY2FwZVF1ZXJ5U3BhY2UgPyBzdHJpbmcucmVwbGFjZSgvXFwrL2csICclMjAnKSA6IHN0cmluZyk7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICAvLyB3ZSdyZSBub3QgZ29pbmcgdG8gbWVzcyB3aXRoIHdlaXJkIGVuY29kaW5ncyxcbiAgICAgIC8vIGdpdmUgdXAgYW5kIHJldHVybiB0aGUgdW5kZWNvZGVkIG9yaWdpbmFsIHN0cmluZ1xuICAgICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tZWRpYWxpemUvVVJJLmpzL2lzc3Vlcy84N1xuICAgICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tZWRpYWxpemUvVVJJLmpzL2lzc3Vlcy85MlxuICAgICAgcmV0dXJuIHN0cmluZztcbiAgICB9XG4gIH07XG4gIC8vIGdlbmVyYXRlIGVuY29kZS9kZWNvZGUgcGF0aCBmdW5jdGlvbnNcbiAgdmFyIF9wYXJ0cyA9IHsnZW5jb2RlJzonZW5jb2RlJywgJ2RlY29kZSc6J2RlY29kZSd9O1xuICB2YXIgX3BhcnQ7XG4gIHZhciBnZW5lcmF0ZUFjY2Vzc29yID0gZnVuY3Rpb24oX2dyb3VwLCBfcGFydCkge1xuICAgIHJldHVybiBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBVUklbX3BhcnRdKHN0cmluZyArICcnKS5yZXBsYWNlKFVSSS5jaGFyYWN0ZXJzW19ncm91cF1bX3BhcnRdLmV4cHJlc3Npb24sIGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgICByZXR1cm4gVVJJLmNoYXJhY3RlcnNbX2dyb3VwXVtfcGFydF0ubWFwW2NdO1xuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gd2UncmUgbm90IGdvaW5nIHRvIG1lc3Mgd2l0aCB3ZWlyZCBlbmNvZGluZ3MsXG4gICAgICAgIC8vIGdpdmUgdXAgYW5kIHJldHVybiB0aGUgdW5kZWNvZGVkIG9yaWdpbmFsIHN0cmluZ1xuICAgICAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL21lZGlhbGl6ZS9VUkkuanMvaXNzdWVzLzg3XG4gICAgICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vbWVkaWFsaXplL1VSSS5qcy9pc3N1ZXMvOTJcbiAgICAgICAgcmV0dXJuIHN0cmluZztcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIGZvciAoX3BhcnQgaW4gX3BhcnRzKSB7XG4gICAgVVJJW19wYXJ0ICsgJ1BhdGhTZWdtZW50J10gPSBnZW5lcmF0ZUFjY2Vzc29yKCdwYXRobmFtZScsIF9wYXJ0c1tfcGFydF0pO1xuICAgIFVSSVtfcGFydCArICdVcm5QYXRoU2VnbWVudCddID0gZ2VuZXJhdGVBY2Nlc3NvcigndXJucGF0aCcsIF9wYXJ0c1tfcGFydF0pO1xuICB9XG5cbiAgdmFyIGdlbmVyYXRlU2VnbWVudGVkUGF0aEZ1bmN0aW9uID0gZnVuY3Rpb24oX3NlcCwgX2NvZGluZ0Z1bmNOYW1lLCBfaW5uZXJDb2RpbmdGdW5jTmFtZSkge1xuICAgIHJldHVybiBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgIC8vIFdoeSBwYXNzIGluIG5hbWVzIG9mIGZ1bmN0aW9ucywgcmF0aGVyIHRoYW4gdGhlIGZ1bmN0aW9uIG9iamVjdHMgdGhlbXNlbHZlcz8gVGhlXG4gICAgICAvLyBkZWZpbml0aW9ucyBvZiBzb21lIGZ1bmN0aW9ucyAoYnV0IGluIHBhcnRpY3VsYXIsIFVSSS5kZWNvZGUpIHdpbGwgb2NjYXNpb25hbGx5IGNoYW5nZSBkdWVcbiAgICAgIC8vIHRvIFVSSS5qcyBoYXZpbmcgSVNPODg1OSBhbmQgVW5pY29kZSBtb2Rlcy4gUGFzc2luZyBpbiB0aGUgbmFtZSBhbmQgZ2V0dGluZyBpdCB3aWxsIGVuc3VyZVxuICAgICAgLy8gdGhhdCB0aGUgZnVuY3Rpb25zIHdlIHVzZSBoZXJlIGFyZSBcImZyZXNoXCIuXG4gICAgICB2YXIgYWN0dWFsQ29kaW5nRnVuYztcbiAgICAgIGlmICghX2lubmVyQ29kaW5nRnVuY05hbWUpIHtcbiAgICAgICAgYWN0dWFsQ29kaW5nRnVuYyA9IFVSSVtfY29kaW5nRnVuY05hbWVdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWN0dWFsQ29kaW5nRnVuYyA9IGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgICAgIHJldHVybiBVUklbX2NvZGluZ0Z1bmNOYW1lXShVUklbX2lubmVyQ29kaW5nRnVuY05hbWVdKHN0cmluZykpO1xuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICB2YXIgc2VnbWVudHMgPSAoc3RyaW5nICsgJycpLnNwbGl0KF9zZXApO1xuXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gc2VnbWVudHMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc2VnbWVudHNbaV0gPSBhY3R1YWxDb2RpbmdGdW5jKHNlZ21lbnRzW2ldKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHNlZ21lbnRzLmpvaW4oX3NlcCk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBUaGlzIHRha2VzIHBsYWNlIG91dHNpZGUgdGhlIGFib3ZlIGxvb3AgYmVjYXVzZSB3ZSBkb24ndCB3YW50LCBlLmcuLCBlbmNvZGVVcm5QYXRoIGZ1bmN0aW9ucy5cbiAgVVJJLmRlY29kZVBhdGggPSBnZW5lcmF0ZVNlZ21lbnRlZFBhdGhGdW5jdGlvbignLycsICdkZWNvZGVQYXRoU2VnbWVudCcpO1xuICBVUkkuZGVjb2RlVXJuUGF0aCA9IGdlbmVyYXRlU2VnbWVudGVkUGF0aEZ1bmN0aW9uKCc6JywgJ2RlY29kZVVyblBhdGhTZWdtZW50Jyk7XG4gIFVSSS5yZWNvZGVQYXRoID0gZ2VuZXJhdGVTZWdtZW50ZWRQYXRoRnVuY3Rpb24oJy8nLCAnZW5jb2RlUGF0aFNlZ21lbnQnLCAnZGVjb2RlJyk7XG4gIFVSSS5yZWNvZGVVcm5QYXRoID0gZ2VuZXJhdGVTZWdtZW50ZWRQYXRoRnVuY3Rpb24oJzonLCAnZW5jb2RlVXJuUGF0aFNlZ21lbnQnLCAnZGVjb2RlJyk7XG5cbiAgVVJJLmVuY29kZVJlc2VydmVkID0gZ2VuZXJhdGVBY2Nlc3NvcigncmVzZXJ2ZWQnLCAnZW5jb2RlJyk7XG5cbiAgVVJJLnBhcnNlID0gZnVuY3Rpb24oc3RyaW5nLCBwYXJ0cykge1xuICAgIHZhciBwb3M7XG4gICAgaWYgKCFwYXJ0cykge1xuICAgICAgcGFydHMgPSB7fTtcbiAgICB9XG4gICAgLy8gW3Byb3RvY29sXCI6Ly9cIlt1c2VybmFtZVtcIjpcInBhc3N3b3JkXVwiQFwiXWhvc3RuYW1lW1wiOlwicG9ydF1cIi9cIj9dW3BhdGhdW1wiP1wicXVlcnlzdHJpbmddW1wiI1wiZnJhZ21lbnRdXG5cbiAgICAvLyBleHRyYWN0IGZyYWdtZW50XG4gICAgcG9zID0gc3RyaW5nLmluZGV4T2YoJyMnKTtcbiAgICBpZiAocG9zID4gLTEpIHtcbiAgICAgIC8vIGVzY2FwaW5nP1xuICAgICAgcGFydHMuZnJhZ21lbnQgPSBzdHJpbmcuc3Vic3RyaW5nKHBvcyArIDEpIHx8IG51bGw7XG4gICAgICBzdHJpbmcgPSBzdHJpbmcuc3Vic3RyaW5nKDAsIHBvcyk7XG4gICAgfVxuXG4gICAgLy8gZXh0cmFjdCBxdWVyeVxuICAgIHBvcyA9IHN0cmluZy5pbmRleE9mKCc/Jyk7XG4gICAgaWYgKHBvcyA+IC0xKSB7XG4gICAgICAvLyBlc2NhcGluZz9cbiAgICAgIHBhcnRzLnF1ZXJ5ID0gc3RyaW5nLnN1YnN0cmluZyhwb3MgKyAxKSB8fCBudWxsO1xuICAgICAgc3RyaW5nID0gc3RyaW5nLnN1YnN0cmluZygwLCBwb3MpO1xuICAgIH1cblxuICAgIC8vIGV4dHJhY3QgcHJvdG9jb2xcbiAgICBpZiAoc3RyaW5nLnN1YnN0cmluZygwLCAyKSA9PT0gJy8vJykge1xuICAgICAgLy8gcmVsYXRpdmUtc2NoZW1lXG4gICAgICBwYXJ0cy5wcm90b2NvbCA9IG51bGw7XG4gICAgICBzdHJpbmcgPSBzdHJpbmcuc3Vic3RyaW5nKDIpO1xuICAgICAgLy8gZXh0cmFjdCBcInVzZXI6cGFzc0Bob3N0OnBvcnRcIlxuICAgICAgc3RyaW5nID0gVVJJLnBhcnNlQXV0aG9yaXR5KHN0cmluZywgcGFydHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwb3MgPSBzdHJpbmcuaW5kZXhPZignOicpO1xuICAgICAgaWYgKHBvcyA+IC0xKSB7XG4gICAgICAgIHBhcnRzLnByb3RvY29sID0gc3RyaW5nLnN1YnN0cmluZygwLCBwb3MpIHx8IG51bGw7XG4gICAgICAgIGlmIChwYXJ0cy5wcm90b2NvbCAmJiAhcGFydHMucHJvdG9jb2wubWF0Y2goVVJJLnByb3RvY29sX2V4cHJlc3Npb24pKSB7XG4gICAgICAgICAgLy8gOiBtYXkgYmUgd2l0aGluIHRoZSBwYXRoXG4gICAgICAgICAgcGFydHMucHJvdG9jb2wgPSB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSBpZiAoc3RyaW5nLnN1YnN0cmluZyhwb3MgKyAxLCBwb3MgKyAzKSA9PT0gJy8vJykge1xuICAgICAgICAgIHN0cmluZyA9IHN0cmluZy5zdWJzdHJpbmcocG9zICsgMyk7XG5cbiAgICAgICAgICAvLyBleHRyYWN0IFwidXNlcjpwYXNzQGhvc3Q6cG9ydFwiXG4gICAgICAgICAgc3RyaW5nID0gVVJJLnBhcnNlQXV0aG9yaXR5KHN0cmluZywgcGFydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0cmluZyA9IHN0cmluZy5zdWJzdHJpbmcocG9zICsgMSk7XG4gICAgICAgICAgcGFydHMudXJuID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHdoYXQncyBsZWZ0IG11c3QgYmUgdGhlIHBhdGhcbiAgICBwYXJ0cy5wYXRoID0gc3RyaW5nO1xuXG4gICAgLy8gYW5kIHdlJ3JlIGRvbmVcbiAgICByZXR1cm4gcGFydHM7XG4gIH07XG4gIFVSSS5wYXJzZUhvc3QgPSBmdW5jdGlvbihzdHJpbmcsIHBhcnRzKSB7XG4gICAgLy8gZXh0cmFjdCBob3N0OnBvcnRcbiAgICB2YXIgcG9zID0gc3RyaW5nLmluZGV4T2YoJy8nKTtcbiAgICB2YXIgYnJhY2tldFBvcztcbiAgICB2YXIgdDtcblxuICAgIGlmIChwb3MgPT09IC0xKSB7XG4gICAgICBwb3MgPSBzdHJpbmcubGVuZ3RoO1xuICAgIH1cblxuICAgIGlmIChzdHJpbmcuY2hhckF0KDApID09PSAnWycpIHtcbiAgICAgIC8vIElQdjYgaG9zdCAtIGh0dHA6Ly90b29scy5pZXRmLm9yZy9odG1sL2RyYWZ0LWlldGYtNm1hbi10ZXh0LWFkZHItcmVwcmVzZW50YXRpb24tMDQjc2VjdGlvbi02XG4gICAgICAvLyBJIGNsYWltIG1vc3QgY2xpZW50IHNvZnR3YXJlIGJyZWFrcyBvbiBJUHY2IGFueXdheXMuIFRvIHNpbXBsaWZ5IHRoaW5ncywgVVJJIG9ubHkgYWNjZXB0c1xuICAgICAgLy8gSVB2Nitwb3J0IGluIHRoZSBmb3JtYXQgWzIwMDE6ZGI4OjoxXTo4MCAoZm9yIHRoZSB0aW1lIGJlaW5nKVxuICAgICAgYnJhY2tldFBvcyA9IHN0cmluZy5pbmRleE9mKCddJyk7XG4gICAgICBwYXJ0cy5ob3N0bmFtZSA9IHN0cmluZy5zdWJzdHJpbmcoMSwgYnJhY2tldFBvcykgfHwgbnVsbDtcbiAgICAgIHBhcnRzLnBvcnQgPSBzdHJpbmcuc3Vic3RyaW5nKGJyYWNrZXRQb3MgKyAyLCBwb3MpIHx8IG51bGw7XG4gICAgICBpZiAocGFydHMucG9ydCA9PT0gJy8nKSB7XG4gICAgICAgIHBhcnRzLnBvcnQgPSBudWxsO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZmlyc3RDb2xvbiA9IHN0cmluZy5pbmRleE9mKCc6Jyk7XG4gICAgICB2YXIgZmlyc3RTbGFzaCA9IHN0cmluZy5pbmRleE9mKCcvJyk7XG4gICAgICB2YXIgbmV4dENvbG9uID0gc3RyaW5nLmluZGV4T2YoJzonLCBmaXJzdENvbG9uICsgMSk7XG4gICAgICBpZiAobmV4dENvbG9uICE9PSAtMSAmJiAoZmlyc3RTbGFzaCA9PT0gLTEgfHwgbmV4dENvbG9uIDwgZmlyc3RTbGFzaCkpIHtcbiAgICAgICAgLy8gSVB2NiBob3N0IGNvbnRhaW5zIG11bHRpcGxlIGNvbG9ucyAtIGJ1dCBubyBwb3J0XG4gICAgICAgIC8vIHRoaXMgbm90YXRpb24gaXMgYWN0dWFsbHkgbm90IGFsbG93ZWQgYnkgUkZDIDM5ODYsIGJ1dCB3ZSdyZSBhIGxpYmVyYWwgcGFyc2VyXG4gICAgICAgIHBhcnRzLmhvc3RuYW1lID0gc3RyaW5nLnN1YnN0cmluZygwLCBwb3MpIHx8IG51bGw7XG4gICAgICAgIHBhcnRzLnBvcnQgPSBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdCA9IHN0cmluZy5zdWJzdHJpbmcoMCwgcG9zKS5zcGxpdCgnOicpO1xuICAgICAgICBwYXJ0cy5ob3N0bmFtZSA9IHRbMF0gfHwgbnVsbDtcbiAgICAgICAgcGFydHMucG9ydCA9IHRbMV0gfHwgbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocGFydHMuaG9zdG5hbWUgJiYgc3RyaW5nLnN1YnN0cmluZyhwb3MpLmNoYXJBdCgwKSAhPT0gJy8nKSB7XG4gICAgICBwb3MrKztcbiAgICAgIHN0cmluZyA9ICcvJyArIHN0cmluZztcbiAgICB9XG5cbiAgICByZXR1cm4gc3RyaW5nLnN1YnN0cmluZyhwb3MpIHx8ICcvJztcbiAgfTtcbiAgVVJJLnBhcnNlQXV0aG9yaXR5ID0gZnVuY3Rpb24oc3RyaW5nLCBwYXJ0cykge1xuICAgIHN0cmluZyA9IFVSSS5wYXJzZVVzZXJpbmZvKHN0cmluZywgcGFydHMpO1xuICAgIHJldHVybiBVUkkucGFyc2VIb3N0KHN0cmluZywgcGFydHMpO1xuICB9O1xuICBVUkkucGFyc2VVc2VyaW5mbyA9IGZ1bmN0aW9uKHN0cmluZywgcGFydHMpIHtcbiAgICAvLyBleHRyYWN0IHVzZXJuYW1lOnBhc3N3b3JkXG4gICAgdmFyIGZpcnN0U2xhc2ggPSBzdHJpbmcuaW5kZXhPZignLycpO1xuICAgIHZhciBwb3MgPSBzdHJpbmcubGFzdEluZGV4T2YoJ0AnLCBmaXJzdFNsYXNoID4gLTEgPyBmaXJzdFNsYXNoIDogc3RyaW5nLmxlbmd0aCAtIDEpO1xuICAgIHZhciB0O1xuXG4gICAgLy8gYXV0aG9yaXR5QCBtdXN0IGNvbWUgYmVmb3JlIC9wYXRoXG4gICAgaWYgKHBvcyA+IC0xICYmIChmaXJzdFNsYXNoID09PSAtMSB8fCBwb3MgPCBmaXJzdFNsYXNoKSkge1xuICAgICAgdCA9IHN0cmluZy5zdWJzdHJpbmcoMCwgcG9zKS5zcGxpdCgnOicpO1xuICAgICAgcGFydHMudXNlcm5hbWUgPSB0WzBdID8gVVJJLmRlY29kZSh0WzBdKSA6IG51bGw7XG4gICAgICB0LnNoaWZ0KCk7XG4gICAgICBwYXJ0cy5wYXNzd29yZCA9IHRbMF0gPyBVUkkuZGVjb2RlKHQuam9pbignOicpKSA6IG51bGw7XG4gICAgICBzdHJpbmcgPSBzdHJpbmcuc3Vic3RyaW5nKHBvcyArIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJ0cy51c2VybmFtZSA9IG51bGw7XG4gICAgICBwYXJ0cy5wYXNzd29yZCA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0cmluZztcbiAgfTtcbiAgVVJJLnBhcnNlUXVlcnkgPSBmdW5jdGlvbihzdHJpbmcsIGVzY2FwZVF1ZXJ5U3BhY2UpIHtcbiAgICBpZiAoIXN0cmluZykge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIC8vIHRocm93IG91dCB0aGUgZnVua3kgYnVzaW5lc3MgLSBcIj9cIltuYW1lXCI9XCJ2YWx1ZVwiJlwiXStcbiAgICBzdHJpbmcgPSBzdHJpbmcucmVwbGFjZSgvJisvZywgJyYnKS5yZXBsYWNlKC9eXFw/KiYqfCYrJC9nLCAnJyk7XG5cbiAgICBpZiAoIXN0cmluZykge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIHZhciBpdGVtcyA9IHt9O1xuICAgIHZhciBzcGxpdHMgPSBzdHJpbmcuc3BsaXQoJyYnKTtcbiAgICB2YXIgbGVuZ3RoID0gc3BsaXRzLmxlbmd0aDtcbiAgICB2YXIgdiwgbmFtZSwgdmFsdWU7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2ID0gc3BsaXRzW2ldLnNwbGl0KCc9Jyk7XG4gICAgICBuYW1lID0gVVJJLmRlY29kZVF1ZXJ5KHYuc2hpZnQoKSwgZXNjYXBlUXVlcnlTcGFjZSk7XG4gICAgICAvLyBubyBcIj1cIiBpcyBudWxsIGFjY29yZGluZyB0byBodHRwOi8vZHZjcy53My5vcmcvaGcvdXJsL3Jhdy1maWxlL3RpcC9PdmVydmlldy5odG1sI2NvbGxlY3QtdXJsLXBhcmFtZXRlcnNcbiAgICAgIHZhbHVlID0gdi5sZW5ndGggPyBVUkkuZGVjb2RlUXVlcnkodi5qb2luKCc9JyksIGVzY2FwZVF1ZXJ5U3BhY2UpIDogbnVsbDtcblxuICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZW1zLCBuYW1lKSkge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1zW25hbWVdID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGl0ZW1zW25hbWVdID0gW2l0ZW1zW25hbWVdXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGl0ZW1zW25hbWVdLnB1c2godmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXRlbXNbbmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaXRlbXM7XG4gIH07XG5cbiAgVVJJLmJ1aWxkID0gZnVuY3Rpb24ocGFydHMpIHtcbiAgICB2YXIgdCA9ICcnO1xuXG4gICAgaWYgKHBhcnRzLnByb3RvY29sKSB7XG4gICAgICB0ICs9IHBhcnRzLnByb3RvY29sICsgJzonO1xuICAgIH1cblxuICAgIGlmICghcGFydHMudXJuICYmICh0IHx8IHBhcnRzLmhvc3RuYW1lKSkge1xuICAgICAgdCArPSAnLy8nO1xuICAgIH1cblxuICAgIHQgKz0gKFVSSS5idWlsZEF1dGhvcml0eShwYXJ0cykgfHwgJycpO1xuXG4gICAgaWYgKHR5cGVvZiBwYXJ0cy5wYXRoID09PSAnc3RyaW5nJykge1xuICAgICAgaWYgKHBhcnRzLnBhdGguY2hhckF0KDApICE9PSAnLycgJiYgdHlwZW9mIHBhcnRzLmhvc3RuYW1lID09PSAnc3RyaW5nJykge1xuICAgICAgICB0ICs9ICcvJztcbiAgICAgIH1cblxuICAgICAgdCArPSBwYXJ0cy5wYXRoO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgcGFydHMucXVlcnkgPT09ICdzdHJpbmcnICYmIHBhcnRzLnF1ZXJ5KSB7XG4gICAgICB0ICs9ICc/JyArIHBhcnRzLnF1ZXJ5O1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgcGFydHMuZnJhZ21lbnQgPT09ICdzdHJpbmcnICYmIHBhcnRzLmZyYWdtZW50KSB7XG4gICAgICB0ICs9ICcjJyArIHBhcnRzLmZyYWdtZW50O1xuICAgIH1cbiAgICByZXR1cm4gdDtcbiAgfTtcbiAgVVJJLmJ1aWxkSG9zdCA9IGZ1bmN0aW9uKHBhcnRzKSB7XG4gICAgdmFyIHQgPSAnJztcblxuICAgIGlmICghcGFydHMuaG9zdG5hbWUpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9IGVsc2UgaWYgKFVSSS5pcDZfZXhwcmVzc2lvbi50ZXN0KHBhcnRzLmhvc3RuYW1lKSkge1xuICAgICAgdCArPSAnWycgKyBwYXJ0cy5ob3N0bmFtZSArICddJztcbiAgICB9IGVsc2Uge1xuICAgICAgdCArPSBwYXJ0cy5ob3N0bmFtZTtcbiAgICB9XG5cbiAgICBpZiAocGFydHMucG9ydCkge1xuICAgICAgdCArPSAnOicgKyBwYXJ0cy5wb3J0O1xuICAgIH1cblxuICAgIHJldHVybiB0O1xuICB9O1xuICBVUkkuYnVpbGRBdXRob3JpdHkgPSBmdW5jdGlvbihwYXJ0cykge1xuICAgIHJldHVybiBVUkkuYnVpbGRVc2VyaW5mbyhwYXJ0cykgKyBVUkkuYnVpbGRIb3N0KHBhcnRzKTtcbiAgfTtcbiAgVVJJLmJ1aWxkVXNlcmluZm8gPSBmdW5jdGlvbihwYXJ0cykge1xuICAgIHZhciB0ID0gJyc7XG5cbiAgICBpZiAocGFydHMudXNlcm5hbWUpIHtcbiAgICAgIHQgKz0gVVJJLmVuY29kZShwYXJ0cy51c2VybmFtZSk7XG5cbiAgICAgIGlmIChwYXJ0cy5wYXNzd29yZCkge1xuICAgICAgICB0ICs9ICc6JyArIFVSSS5lbmNvZGUocGFydHMucGFzc3dvcmQpO1xuICAgICAgfVxuXG4gICAgICB0ICs9ICdAJztcbiAgICB9XG5cbiAgICByZXR1cm4gdDtcbiAgfTtcbiAgVVJJLmJ1aWxkUXVlcnkgPSBmdW5jdGlvbihkYXRhLCBkdXBsaWNhdGVRdWVyeVBhcmFtZXRlcnMsIGVzY2FwZVF1ZXJ5U3BhY2UpIHtcbiAgICAvLyBhY2NvcmRpbmcgdG8gaHR0cDovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzk4NiBvciBodHRwOi8vbGFicy5hcGFjaGUub3JnL3dlYmFyY2gvdXJpL3JmYy9yZmMzOTg2Lmh0bWxcbiAgICAvLyBiZWluZyDCuy0uX34hJCYnKCkqKyw7PTpALz/CqyAlSEVYIGFuZCBhbG51bSBhcmUgYWxsb3dlZFxuICAgIC8vIHRoZSBSRkMgZXhwbGljaXRseSBzdGF0ZXMgPy9mb28gYmVpbmcgYSB2YWxpZCB1c2UgY2FzZSwgbm8gbWVudGlvbiBvZiBwYXJhbWV0ZXIgc3ludGF4IVxuICAgIC8vIFVSSS5qcyB0cmVhdHMgdGhlIHF1ZXJ5IHN0cmluZyBhcyBiZWluZyBhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcbiAgICAvLyBzZWUgaHR0cDovL3d3dy53My5vcmcvVFIvUkVDLWh0bWw0MC9pbnRlcmFjdC9mb3Jtcy5odG1sI2Zvcm0tY29udGVudC10eXBlXG5cbiAgICB2YXIgdCA9ICcnO1xuICAgIHZhciB1bmlxdWUsIGtleSwgaSwgbGVuZ3RoO1xuICAgIGZvciAoa2V5IGluIGRhdGEpIHtcbiAgICAgIGlmIChoYXNPd24uY2FsbChkYXRhLCBrZXkpICYmIGtleSkge1xuICAgICAgICBpZiAoaXNBcnJheShkYXRhW2tleV0pKSB7XG4gICAgICAgICAgdW5pcXVlID0ge307XG4gICAgICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0gZGF0YVtrZXldLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZGF0YVtrZXldW2ldICE9PSB1bmRlZmluZWQgJiYgdW5pcXVlW2RhdGFba2V5XVtpXSArICcnXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHQgKz0gJyYnICsgVVJJLmJ1aWxkUXVlcnlQYXJhbWV0ZXIoa2V5LCBkYXRhW2tleV1baV0sIGVzY2FwZVF1ZXJ5U3BhY2UpO1xuICAgICAgICAgICAgICBpZiAoZHVwbGljYXRlUXVlcnlQYXJhbWV0ZXJzICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdW5pcXVlW2RhdGFba2V5XVtpXSArICcnXSA9IHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YVtrZXldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0ICs9ICcmJyArIFVSSS5idWlsZFF1ZXJ5UGFyYW1ldGVyKGtleSwgZGF0YVtrZXldLCBlc2NhcGVRdWVyeVNwYWNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0LnN1YnN0cmluZygxKTtcbiAgfTtcbiAgVVJJLmJ1aWxkUXVlcnlQYXJhbWV0ZXIgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgZXNjYXBlUXVlcnlTcGFjZSkge1xuICAgIC8vIGh0dHA6Ly93d3cudzMub3JnL1RSL1JFQy1odG1sNDAvaW50ZXJhY3QvZm9ybXMuaHRtbCNmb3JtLWNvbnRlbnQtdHlwZSAtLSBhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcbiAgICAvLyBkb24ndCBhcHBlbmQgXCI9XCIgZm9yIG51bGwgdmFsdWVzLCBhY2NvcmRpbmcgdG8gaHR0cDovL2R2Y3MudzMub3JnL2hnL3VybC9yYXctZmlsZS90aXAvT3ZlcnZpZXcuaHRtbCN1cmwtcGFyYW1ldGVyLXNlcmlhbGl6YXRpb25cbiAgICByZXR1cm4gVVJJLmVuY29kZVF1ZXJ5KG5hbWUsIGVzY2FwZVF1ZXJ5U3BhY2UpICsgKHZhbHVlICE9PSBudWxsID8gJz0nICsgVVJJLmVuY29kZVF1ZXJ5KHZhbHVlLCBlc2NhcGVRdWVyeVNwYWNlKSA6ICcnKTtcbiAgfTtcblxuICBVUkkuYWRkUXVlcnkgPSBmdW5jdGlvbihkYXRhLCBuYW1lLCB2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBuYW1lKSB7XG4gICAgICAgIGlmIChoYXNPd24uY2FsbChuYW1lLCBrZXkpKSB7XG4gICAgICAgICAgVVJJLmFkZFF1ZXJ5KGRhdGEsIGtleSwgbmFtZVtrZXldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIG5hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAoZGF0YVtuYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGRhdGFbbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZGF0YVtuYW1lXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgZGF0YVtuYW1lXSA9IFtkYXRhW25hbWVdXTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICB2YWx1ZSA9IFt2YWx1ZV07XG4gICAgICB9XG5cbiAgICAgIGRhdGFbbmFtZV0gPSAoZGF0YVtuYW1lXSB8fCBbXSkuY29uY2F0KHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVVJJLmFkZFF1ZXJ5KCkgYWNjZXB0cyBhbiBvYmplY3QsIHN0cmluZyBhcyB0aGUgbmFtZSBwYXJhbWV0ZXInKTtcbiAgICB9XG4gIH07XG4gIFVSSS5yZW1vdmVRdWVyeSA9IGZ1bmN0aW9uKGRhdGEsIG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIGksIGxlbmd0aCwga2V5O1xuXG4gICAgaWYgKGlzQXJyYXkobmFtZSkpIHtcbiAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IG5hbWUubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZGF0YVtuYW1lW2ldXSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBuYW1lID09PSAnb2JqZWN0Jykge1xuICAgICAgZm9yIChrZXkgaW4gbmFtZSkge1xuICAgICAgICBpZiAoaGFzT3duLmNhbGwobmFtZSwga2V5KSkge1xuICAgICAgICAgIFVSSS5yZW1vdmVRdWVyeShkYXRhLCBrZXksIG5hbWVba2V5XSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBuYW1lID09PSAnc3RyaW5nJykge1xuICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGRhdGFbbmFtZV0gPT09IHZhbHVlKSB7XG4gICAgICAgICAgZGF0YVtuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5KGRhdGFbbmFtZV0pKSB7XG4gICAgICAgICAgZGF0YVtuYW1lXSA9IGZpbHRlckFycmF5VmFsdWVzKGRhdGFbbmFtZV0sIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGF0YVtuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVVJJLnJlbW92ZVF1ZXJ5KCkgYWNjZXB0cyBhbiBvYmplY3QsIHN0cmluZyBhcyB0aGUgZmlyc3QgcGFyYW1ldGVyJyk7XG4gICAgfVxuICB9O1xuICBVUkkuaGFzUXVlcnkgPSBmdW5jdGlvbihkYXRhLCBuYW1lLCB2YWx1ZSwgd2l0aGluQXJyYXkpIHtcbiAgICBpZiAodHlwZW9mIG5hbWUgPT09ICdvYmplY3QnKSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gbmFtZSkge1xuICAgICAgICBpZiAoaGFzT3duLmNhbGwobmFtZSwga2V5KSkge1xuICAgICAgICAgIGlmICghVVJJLmhhc1F1ZXJ5KGRhdGEsIGtleSwgbmFtZVtrZXldKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVVJJLmhhc1F1ZXJ5KCkgYWNjZXB0cyBhbiBvYmplY3QsIHN0cmluZyBhcyB0aGUgbmFtZSBwYXJhbWV0ZXInKTtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGdldFR5cGUodmFsdWUpKSB7XG4gICAgICBjYXNlICdVbmRlZmluZWQnOlxuICAgICAgICAvLyB0cnVlIGlmIGV4aXN0cyAoYnV0IG1heSBiZSBlbXB0eSlcbiAgICAgICAgcmV0dXJuIG5hbWUgaW4gZGF0YTsgLy8gZGF0YVtuYW1lXSAhPT0gdW5kZWZpbmVkO1xuXG4gICAgICBjYXNlICdCb29sZWFuJzpcbiAgICAgICAgLy8gdHJ1ZSBpZiBleGlzdHMgYW5kIG5vbi1lbXB0eVxuICAgICAgICB2YXIgX2Jvb2x5ID0gQm9vbGVhbihpc0FycmF5KGRhdGFbbmFtZV0pID8gZGF0YVtuYW1lXS5sZW5ndGggOiBkYXRhW25hbWVdKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSBfYm9vbHk7XG5cbiAgICAgIGNhc2UgJ0Z1bmN0aW9uJzpcbiAgICAgICAgLy8gYWxsb3cgY29tcGxleCBjb21wYXJpc29uXG4gICAgICAgIHJldHVybiAhIXZhbHVlKGRhdGFbbmFtZV0sIG5hbWUsIGRhdGEpO1xuXG4gICAgICBjYXNlICdBcnJheSc6XG4gICAgICAgIGlmICghaXNBcnJheShkYXRhW25hbWVdKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBvcCA9IHdpdGhpbkFycmF5ID8gYXJyYXlDb250YWlucyA6IGFycmF5c0VxdWFsO1xuICAgICAgICByZXR1cm4gb3AoZGF0YVtuYW1lXSwgdmFsdWUpO1xuXG4gICAgICBjYXNlICdSZWdFeHAnOlxuICAgICAgICBpZiAoIWlzQXJyYXkoZGF0YVtuYW1lXSkpIHtcbiAgICAgICAgICByZXR1cm4gQm9vbGVhbihkYXRhW25hbWVdICYmIGRhdGFbbmFtZV0ubWF0Y2godmFsdWUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghd2l0aGluQXJyYXkpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXJyYXlDb250YWlucyhkYXRhW25hbWVdLCB2YWx1ZSk7XG5cbiAgICAgIGNhc2UgJ051bWJlcic6XG4gICAgICAgIHZhbHVlID0gU3RyaW5nKHZhbHVlKTtcbiAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgY2FzZSAnU3RyaW5nJzpcbiAgICAgICAgaWYgKCFpc0FycmF5KGRhdGFbbmFtZV0pKSB7XG4gICAgICAgICAgcmV0dXJuIGRhdGFbbmFtZV0gPT09IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF3aXRoaW5BcnJheSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhcnJheUNvbnRhaW5zKGRhdGFbbmFtZV0sIHZhbHVlKTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVVJJLmhhc1F1ZXJ5KCkgYWNjZXB0cyB1bmRlZmluZWQsIGJvb2xlYW4sIHN0cmluZywgbnVtYmVyLCBSZWdFeHAsIEZ1bmN0aW9uIGFzIHRoZSB2YWx1ZSBwYXJhbWV0ZXInKTtcbiAgICB9XG4gIH07XG5cblxuICBVUkkuY29tbW9uUGF0aCA9IGZ1bmN0aW9uKG9uZSwgdHdvKSB7XG4gICAgdmFyIGxlbmd0aCA9IE1hdGgubWluKG9uZS5sZW5ndGgsIHR3by5sZW5ndGgpO1xuICAgIHZhciBwb3M7XG5cbiAgICAvLyBmaW5kIGZpcnN0IG5vbi1tYXRjaGluZyBjaGFyYWN0ZXJcbiAgICBmb3IgKHBvcyA9IDA7IHBvcyA8IGxlbmd0aDsgcG9zKyspIHtcbiAgICAgIGlmIChvbmUuY2hhckF0KHBvcykgIT09IHR3by5jaGFyQXQocG9zKSkge1xuICAgICAgICBwb3MtLTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvcyA8IDEpIHtcbiAgICAgIHJldHVybiBvbmUuY2hhckF0KDApID09PSB0d28uY2hhckF0KDApICYmIG9uZS5jaGFyQXQoMCkgPT09ICcvJyA/ICcvJyA6ICcnO1xuICAgIH1cblxuICAgIC8vIHJldmVydCB0byBsYXN0IC9cbiAgICBpZiAob25lLmNoYXJBdChwb3MpICE9PSAnLycgfHwgdHdvLmNoYXJBdChwb3MpICE9PSAnLycpIHtcbiAgICAgIHBvcyA9IG9uZS5zdWJzdHJpbmcoMCwgcG9zKS5sYXN0SW5kZXhPZignLycpO1xuICAgIH1cblxuICAgIHJldHVybiBvbmUuc3Vic3RyaW5nKDAsIHBvcyArIDEpO1xuICB9O1xuXG4gIFVSSS53aXRoaW5TdHJpbmcgPSBmdW5jdGlvbihzdHJpbmcsIGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyB8fCAob3B0aW9ucyA9IHt9KTtcbiAgICB2YXIgX3N0YXJ0ID0gb3B0aW9ucy5zdGFydCB8fCBVUkkuZmluZFVyaS5zdGFydDtcbiAgICB2YXIgX2VuZCA9IG9wdGlvbnMuZW5kIHx8IFVSSS5maW5kVXJpLmVuZDtcbiAgICB2YXIgX3RyaW0gPSBvcHRpb25zLnRyaW0gfHwgVVJJLmZpbmRVcmkudHJpbTtcbiAgICB2YXIgX2F0dHJpYnV0ZU9wZW4gPSAvW2EtejAtOS1dPVtcIiddPyQvaTtcblxuICAgIF9zdGFydC5sYXN0SW5kZXggPSAwO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICB2YXIgbWF0Y2ggPSBfc3RhcnQuZXhlYyhzdHJpbmcpO1xuICAgICAgaWYgKCFtYXRjaCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgdmFyIHN0YXJ0ID0gbWF0Y2guaW5kZXg7XG4gICAgICBpZiAob3B0aW9ucy5pZ25vcmVIdG1sKSB7XG4gICAgICAgIC8vIGF0dHJpYnV0KGU9W1wiJ10/JClcbiAgICAgICAgdmFyIGF0dHJpYnV0ZU9wZW4gPSBzdHJpbmcuc2xpY2UoTWF0aC5tYXgoc3RhcnQgLSAzLCAwKSwgc3RhcnQpO1xuICAgICAgICBpZiAoYXR0cmlidXRlT3BlbiAmJiBfYXR0cmlidXRlT3Blbi50ZXN0KGF0dHJpYnV0ZU9wZW4pKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIGVuZCA9IHN0YXJ0ICsgc3RyaW5nLnNsaWNlKHN0YXJ0KS5zZWFyY2goX2VuZCk7XG4gICAgICB2YXIgc2xpY2UgPSBzdHJpbmcuc2xpY2Uoc3RhcnQsIGVuZCkucmVwbGFjZShfdHJpbSwgJycpO1xuICAgICAgaWYgKG9wdGlvbnMuaWdub3JlICYmIG9wdGlvbnMuaWdub3JlLnRlc3Qoc2xpY2UpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBlbmQgPSBzdGFydCArIHNsaWNlLmxlbmd0aDtcbiAgICAgIHZhciByZXN1bHQgPSBjYWxsYmFjayhzbGljZSwgc3RhcnQsIGVuZCwgc3RyaW5nKTtcbiAgICAgIHN0cmluZyA9IHN0cmluZy5zbGljZSgwLCBzdGFydCkgKyByZXN1bHQgKyBzdHJpbmcuc2xpY2UoZW5kKTtcbiAgICAgIF9zdGFydC5sYXN0SW5kZXggPSBzdGFydCArIHJlc3VsdC5sZW5ndGg7XG4gICAgfVxuXG4gICAgX3N0YXJ0Lmxhc3RJbmRleCA9IDA7XG4gICAgcmV0dXJuIHN0cmluZztcbiAgfTtcblxuICBVUkkuZW5zdXJlVmFsaWRIb3N0bmFtZSA9IGZ1bmN0aW9uKHYpIHtcbiAgICAvLyBUaGVvcmV0aWNhbGx5IFVSSXMgYWxsb3cgcGVyY2VudC1lbmNvZGluZyBpbiBIb3N0bmFtZXMgKGFjY29yZGluZyB0byBSRkMgMzk4NilcbiAgICAvLyB0aGV5IGFyZSBub3QgcGFydCBvZiBETlMgYW5kIHRoZXJlZm9yZSBpZ25vcmVkIGJ5IFVSSS5qc1xuXG4gICAgaWYgKHYubWF0Y2goVVJJLmludmFsaWRfaG9zdG5hbWVfY2hhcmFjdGVycykpIHtcbiAgICAgIC8vIHRlc3QgcHVueWNvZGVcbiAgICAgIGlmICghcHVueWNvZGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSG9zdG5hbWUgXCInICsgdiArICdcIiBjb250YWlucyBjaGFyYWN0ZXJzIG90aGVyIHRoYW4gW0EtWjAtOS4tXSBhbmQgUHVueWNvZGUuanMgaXMgbm90IGF2YWlsYWJsZScpO1xuICAgICAgfVxuXG4gICAgICBpZiAocHVueWNvZGUudG9BU0NJSSh2KS5tYXRjaChVUkkuaW52YWxpZF9ob3N0bmFtZV9jaGFyYWN0ZXJzKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdIb3N0bmFtZSBcIicgKyB2ICsgJ1wiIGNvbnRhaW5zIGNoYXJhY3RlcnMgb3RoZXIgdGhhbiBbQS1aMC05Li1dJyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8vIG5vQ29uZmxpY3RcbiAgVVJJLm5vQ29uZmxpY3QgPSBmdW5jdGlvbihyZW1vdmVBbGwpIHtcbiAgICBpZiAocmVtb3ZlQWxsKSB7XG4gICAgICB2YXIgdW5jb25mbGljdGVkID0ge1xuICAgICAgICBVUkk6IHRoaXMubm9Db25mbGljdCgpXG4gICAgICB9O1xuXG4gICAgICBpZiAocm9vdC5VUklUZW1wbGF0ZSAmJiB0eXBlb2Ygcm9vdC5VUklUZW1wbGF0ZS5ub0NvbmZsaWN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHVuY29uZmxpY3RlZC5VUklUZW1wbGF0ZSA9IHJvb3QuVVJJVGVtcGxhdGUubm9Db25mbGljdCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAocm9vdC5JUHY2ICYmIHR5cGVvZiByb290LklQdjYubm9Db25mbGljdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB1bmNvbmZsaWN0ZWQuSVB2NiA9IHJvb3QuSVB2Ni5ub0NvbmZsaWN0KCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyb290LlNlY29uZExldmVsRG9tYWlucyAmJiB0eXBlb2Ygcm9vdC5TZWNvbmRMZXZlbERvbWFpbnMubm9Db25mbGljdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB1bmNvbmZsaWN0ZWQuU2Vjb25kTGV2ZWxEb21haW5zID0gcm9vdC5TZWNvbmRMZXZlbERvbWFpbnMubm9Db25mbGljdCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdW5jb25mbGljdGVkO1xuICAgIH0gZWxzZSBpZiAocm9vdC5VUkkgPT09IHRoaXMpIHtcbiAgICAgIHJvb3QuVVJJID0gX1VSSTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBwLmJ1aWxkID0gZnVuY3Rpb24oZGVmZXJCdWlsZCkge1xuICAgIGlmIChkZWZlckJ1aWxkID09PSB0cnVlKSB7XG4gICAgICB0aGlzLl9kZWZlcnJlZF9idWlsZCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChkZWZlckJ1aWxkID09PSB1bmRlZmluZWQgfHwgdGhpcy5fZGVmZXJyZWRfYnVpbGQpIHtcbiAgICAgIHRoaXMuX3N0cmluZyA9IFVSSS5idWlsZCh0aGlzLl9wYXJ0cyk7XG4gICAgICB0aGlzLl9kZWZlcnJlZF9idWlsZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHAuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFVSSSh0aGlzKTtcbiAgfTtcblxuICBwLnZhbHVlT2YgPSBwLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuYnVpbGQoZmFsc2UpLl9zdHJpbmc7XG4gIH07XG5cblxuICBmdW5jdGlvbiBnZW5lcmF0ZVNpbXBsZUFjY2Vzc29yKF9wYXJ0KXtcbiAgICByZXR1cm4gZnVuY3Rpb24odiwgYnVpbGQpIHtcbiAgICAgIGlmICh2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcnRzW19wYXJ0XSB8fCAnJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3BhcnRzW19wYXJ0XSA9IHYgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVQcmVmaXhBY2Nlc3NvcihfcGFydCwgX2tleSl7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XG4gICAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJ0c1tfcGFydF0gfHwgJyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodiAhPT0gbnVsbCkge1xuICAgICAgICAgIHYgPSB2ICsgJyc7XG4gICAgICAgICAgaWYgKHYuY2hhckF0KDApID09PSBfa2V5KSB7XG4gICAgICAgICAgICB2ID0gdi5zdWJzdHJpbmcoMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fcGFydHNbX3BhcnRdID0gdjtcbiAgICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcC5wcm90b2NvbCA9IGdlbmVyYXRlU2ltcGxlQWNjZXNzb3IoJ3Byb3RvY29sJyk7XG4gIHAudXNlcm5hbWUgPSBnZW5lcmF0ZVNpbXBsZUFjY2Vzc29yKCd1c2VybmFtZScpO1xuICBwLnBhc3N3b3JkID0gZ2VuZXJhdGVTaW1wbGVBY2Nlc3NvcigncGFzc3dvcmQnKTtcbiAgcC5ob3N0bmFtZSA9IGdlbmVyYXRlU2ltcGxlQWNjZXNzb3IoJ2hvc3RuYW1lJyk7XG4gIHAucG9ydCA9IGdlbmVyYXRlU2ltcGxlQWNjZXNzb3IoJ3BvcnQnKTtcbiAgcC5xdWVyeSA9IGdlbmVyYXRlUHJlZml4QWNjZXNzb3IoJ3F1ZXJ5JywgJz8nKTtcbiAgcC5mcmFnbWVudCA9IGdlbmVyYXRlUHJlZml4QWNjZXNzb3IoJ2ZyYWdtZW50JywgJyMnKTtcblxuICBwLnNlYXJjaCA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XG4gICAgdmFyIHQgPSB0aGlzLnF1ZXJ5KHYsIGJ1aWxkKTtcbiAgICByZXR1cm4gdHlwZW9mIHQgPT09ICdzdHJpbmcnICYmIHQubGVuZ3RoID8gKCc/JyArIHQpIDogdDtcbiAgfTtcbiAgcC5oYXNoID0gZnVuY3Rpb24odiwgYnVpbGQpIHtcbiAgICB2YXIgdCA9IHRoaXMuZnJhZ21lbnQodiwgYnVpbGQpO1xuICAgIHJldHVybiB0eXBlb2YgdCA9PT0gJ3N0cmluZycgJiYgdC5sZW5ndGggPyAoJyMnICsgdCkgOiB0O1xuICB9O1xuXG4gIHAucGF0aG5hbWUgPSBmdW5jdGlvbih2LCBidWlsZCkge1xuICAgIGlmICh2ID09PSB1bmRlZmluZWQgfHwgdiA9PT0gdHJ1ZSkge1xuICAgICAgdmFyIHJlcyA9IHRoaXMuX3BhcnRzLnBhdGggfHwgKHRoaXMuX3BhcnRzLmhvc3RuYW1lID8gJy8nIDogJycpO1xuICAgICAgcmV0dXJuIHYgPyAodGhpcy5fcGFydHMudXJuID8gVVJJLmRlY29kZVVyblBhdGggOiBVUkkuZGVjb2RlUGF0aCkocmVzKSA6IHJlcztcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuX3BhcnRzLnVybikge1xuICAgICAgICB0aGlzLl9wYXJ0cy5wYXRoID0gdiA/IFVSSS5yZWNvZGVVcm5QYXRoKHYpIDogJyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9wYXJ0cy5wYXRoID0gdiA/IFVSSS5yZWNvZGVQYXRoKHYpIDogJy8nO1xuICAgICAgfVxuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9O1xuICBwLnBhdGggPSBwLnBhdGhuYW1lO1xuICBwLmhyZWYgPSBmdW5jdGlvbihocmVmLCBidWlsZCkge1xuICAgIHZhciBrZXk7XG5cbiAgICBpZiAoaHJlZiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuICAgIH1cblxuICAgIHRoaXMuX3N0cmluZyA9ICcnO1xuICAgIHRoaXMuX3BhcnRzID0gVVJJLl9wYXJ0cygpO1xuXG4gICAgdmFyIF9VUkkgPSBocmVmIGluc3RhbmNlb2YgVVJJO1xuICAgIHZhciBfb2JqZWN0ID0gdHlwZW9mIGhyZWYgPT09ICdvYmplY3QnICYmIChocmVmLmhvc3RuYW1lIHx8IGhyZWYucGF0aCB8fCBocmVmLnBhdGhuYW1lKTtcbiAgICBpZiAoaHJlZi5ub2RlTmFtZSkge1xuICAgICAgdmFyIGF0dHJpYnV0ZSA9IFVSSS5nZXREb21BdHRyaWJ1dGUoaHJlZik7XG4gICAgICBocmVmID0gaHJlZlthdHRyaWJ1dGVdIHx8ICcnO1xuICAgICAgX29iamVjdCA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIHdpbmRvdy5sb2NhdGlvbiBpcyByZXBvcnRlZCB0byBiZSBhbiBvYmplY3QsIGJ1dCBpdCdzIG5vdCB0aGUgc29ydFxuICAgIC8vIG9mIG9iamVjdCB3ZSdyZSBsb29raW5nIGZvcjpcbiAgICAvLyAqIGxvY2F0aW9uLnByb3RvY29sIGVuZHMgd2l0aCBhIGNvbG9uXG4gICAgLy8gKiBsb2NhdGlvbi5xdWVyeSAhPSBvYmplY3Quc2VhcmNoXG4gICAgLy8gKiBsb2NhdGlvbi5oYXNoICE9IG9iamVjdC5mcmFnbWVudFxuICAgIC8vIHNpbXBseSBzZXJpYWxpemluZyB0aGUgdW5rbm93biBvYmplY3Qgc2hvdWxkIGRvIHRoZSB0cmlja1xuICAgIC8vIChmb3IgbG9jYXRpb24sIG5vdCBmb3IgZXZlcnl0aGluZy4uLilcbiAgICBpZiAoIV9VUkkgJiYgX29iamVjdCAmJiBocmVmLnBhdGhuYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGhyZWYgPSBocmVmLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBocmVmID09PSAnc3RyaW5nJyB8fCBocmVmIGluc3RhbmNlb2YgU3RyaW5nKSB7XG4gICAgICB0aGlzLl9wYXJ0cyA9IFVSSS5wYXJzZShTdHJpbmcoaHJlZiksIHRoaXMuX3BhcnRzKTtcbiAgICB9IGVsc2UgaWYgKF9VUkkgfHwgX29iamVjdCkge1xuICAgICAgdmFyIHNyYyA9IF9VUkkgPyBocmVmLl9wYXJ0cyA6IGhyZWY7XG4gICAgICBmb3IgKGtleSBpbiBzcmMpIHtcbiAgICAgICAgaWYgKGhhc093bi5jYWxsKHRoaXMuX3BhcnRzLCBrZXkpKSB7XG4gICAgICAgICAgdGhpcy5fcGFydHNba2V5XSA9IHNyY1trZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ludmFsaWQgaW5wdXQnKTtcbiAgICB9XG5cbiAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLy8gaWRlbnRpZmljYXRpb24gYWNjZXNzb3JzXG4gIHAuaXMgPSBmdW5jdGlvbih3aGF0KSB7XG4gICAgdmFyIGlwID0gZmFsc2U7XG4gICAgdmFyIGlwNCA9IGZhbHNlO1xuICAgIHZhciBpcDYgPSBmYWxzZTtcbiAgICB2YXIgbmFtZSA9IGZhbHNlO1xuICAgIHZhciBzbGQgPSBmYWxzZTtcbiAgICB2YXIgaWRuID0gZmFsc2U7XG4gICAgdmFyIHB1bnljb2RlID0gZmFsc2U7XG4gICAgdmFyIHJlbGF0aXZlID0gIXRoaXMuX3BhcnRzLnVybjtcblxuICAgIGlmICh0aGlzLl9wYXJ0cy5ob3N0bmFtZSkge1xuICAgICAgcmVsYXRpdmUgPSBmYWxzZTtcbiAgICAgIGlwNCA9IFVSSS5pcDRfZXhwcmVzc2lvbi50ZXN0KHRoaXMuX3BhcnRzLmhvc3RuYW1lKTtcbiAgICAgIGlwNiA9IFVSSS5pcDZfZXhwcmVzc2lvbi50ZXN0KHRoaXMuX3BhcnRzLmhvc3RuYW1lKTtcbiAgICAgIGlwID0gaXA0IHx8IGlwNjtcbiAgICAgIG5hbWUgPSAhaXA7XG4gICAgICBzbGQgPSBuYW1lICYmIFNMRCAmJiBTTEQuaGFzKHRoaXMuX3BhcnRzLmhvc3RuYW1lKTtcbiAgICAgIGlkbiA9IG5hbWUgJiYgVVJJLmlkbl9leHByZXNzaW9uLnRlc3QodGhpcy5fcGFydHMuaG9zdG5hbWUpO1xuICAgICAgcHVueWNvZGUgPSBuYW1lICYmIFVSSS5wdW55Y29kZV9leHByZXNzaW9uLnRlc3QodGhpcy5fcGFydHMuaG9zdG5hbWUpO1xuICAgIH1cblxuICAgIHN3aXRjaCAod2hhdC50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICBjYXNlICdyZWxhdGl2ZSc6XG4gICAgICAgIHJldHVybiByZWxhdGl2ZTtcblxuICAgICAgY2FzZSAnYWJzb2x1dGUnOlxuICAgICAgICByZXR1cm4gIXJlbGF0aXZlO1xuXG4gICAgICAvLyBob3N0bmFtZSBpZGVudGlmaWNhdGlvblxuICAgICAgY2FzZSAnZG9tYWluJzpcbiAgICAgIGNhc2UgJ25hbWUnOlxuICAgICAgICByZXR1cm4gbmFtZTtcblxuICAgICAgY2FzZSAnc2xkJzpcbiAgICAgICAgcmV0dXJuIHNsZDtcblxuICAgICAgY2FzZSAnaXAnOlxuICAgICAgICByZXR1cm4gaXA7XG5cbiAgICAgIGNhc2UgJ2lwNCc6XG4gICAgICBjYXNlICdpcHY0JzpcbiAgICAgIGNhc2UgJ2luZXQ0JzpcbiAgICAgICAgcmV0dXJuIGlwNDtcblxuICAgICAgY2FzZSAnaXA2JzpcbiAgICAgIGNhc2UgJ2lwdjYnOlxuICAgICAgY2FzZSAnaW5ldDYnOlxuICAgICAgICByZXR1cm4gaXA2O1xuXG4gICAgICBjYXNlICdpZG4nOlxuICAgICAgICByZXR1cm4gaWRuO1xuXG4gICAgICBjYXNlICd1cmwnOlxuICAgICAgICByZXR1cm4gIXRoaXMuX3BhcnRzLnVybjtcblxuICAgICAgY2FzZSAndXJuJzpcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fcGFydHMudXJuO1xuXG4gICAgICBjYXNlICdwdW55Y29kZSc6XG4gICAgICAgIHJldHVybiBwdW55Y29kZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcblxuICAvLyBjb21wb25lbnQgc3BlY2lmaWMgaW5wdXQgdmFsaWRhdGlvblxuICB2YXIgX3Byb3RvY29sID0gcC5wcm90b2NvbDtcbiAgdmFyIF9wb3J0ID0gcC5wb3J0O1xuICB2YXIgX2hvc3RuYW1lID0gcC5ob3N0bmFtZTtcblxuICBwLnByb3RvY29sID0gZnVuY3Rpb24odiwgYnVpbGQpIHtcbiAgICBpZiAodiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAodikge1xuICAgICAgICAvLyBhY2NlcHQgdHJhaWxpbmcgOi8vXG4gICAgICAgIHYgPSB2LnJlcGxhY2UoLzooXFwvXFwvKT8kLywgJycpO1xuXG4gICAgICAgIGlmICghdi5tYXRjaChVUkkucHJvdG9jb2xfZXhwcmVzc2lvbikpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm90b2NvbCBcIicgKyB2ICsgJ1wiIGNvbnRhaW5zIGNoYXJhY3RlcnMgb3RoZXIgdGhhbiBbQS1aMC05ListXSBvciBkb2VzblxcJ3Qgc3RhcnQgd2l0aCBbQS1aXScpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBfcHJvdG9jb2wuY2FsbCh0aGlzLCB2LCBidWlsZCk7XG4gIH07XG4gIHAuc2NoZW1lID0gcC5wcm90b2NvbDtcbiAgcC5wb3J0ID0gZnVuY3Rpb24odiwgYnVpbGQpIHtcbiAgICBpZiAodGhpcy5fcGFydHMudXJuKSB7XG4gICAgICByZXR1cm4gdiA9PT0gdW5kZWZpbmVkID8gJycgOiB0aGlzO1xuICAgIH1cblxuICAgIGlmICh2ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh2ID09PSAwKSB7XG4gICAgICAgIHYgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAodikge1xuICAgICAgICB2ICs9ICcnO1xuICAgICAgICBpZiAodi5jaGFyQXQoMCkgPT09ICc6Jykge1xuICAgICAgICAgIHYgPSB2LnN1YnN0cmluZygxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2Lm1hdGNoKC9bXjAtOV0vKSkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1BvcnQgXCInICsgdiArICdcIiBjb250YWlucyBjaGFyYWN0ZXJzIG90aGVyIHRoYW4gWzAtOV0nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gX3BvcnQuY2FsbCh0aGlzLCB2LCBidWlsZCk7XG4gIH07XG4gIHAuaG9zdG5hbWUgPSBmdW5jdGlvbih2LCBidWlsZCkge1xuICAgIGlmICh0aGlzLl9wYXJ0cy51cm4pIHtcbiAgICAgIHJldHVybiB2ID09PSB1bmRlZmluZWQgPyAnJyA6IHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHYgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIHggPSB7fTtcbiAgICAgIFVSSS5wYXJzZUhvc3QodiwgeCk7XG4gICAgICB2ID0geC5ob3N0bmFtZTtcbiAgICB9XG4gICAgcmV0dXJuIF9ob3N0bmFtZS5jYWxsKHRoaXMsIHYsIGJ1aWxkKTtcbiAgfTtcblxuICAvLyBjb21wb3VuZCBhY2Nlc3NvcnNcbiAgcC5ob3N0ID0gZnVuY3Rpb24odiwgYnVpbGQpIHtcbiAgICBpZiAodGhpcy5fcGFydHMudXJuKSB7XG4gICAgICByZXR1cm4gdiA9PT0gdW5kZWZpbmVkID8gJycgOiB0aGlzO1xuICAgIH1cblxuICAgIGlmICh2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9wYXJ0cy5ob3N0bmFtZSA/IFVSSS5idWlsZEhvc3QodGhpcy5fcGFydHMpIDogJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIFVSSS5wYXJzZUhvc3QodiwgdGhpcy5fcGFydHMpO1xuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9O1xuICBwLmF1dGhvcml0eSA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XG4gICAgaWYgKHRoaXMuX3BhcnRzLnVybikge1xuICAgICAgcmV0dXJuIHYgPT09IHVuZGVmaW5lZCA/ICcnIDogdGhpcztcbiAgICB9XG5cbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcGFydHMuaG9zdG5hbWUgPyBVUkkuYnVpbGRBdXRob3JpdHkodGhpcy5fcGFydHMpIDogJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIFVSSS5wYXJzZUF1dGhvcml0eSh2LCB0aGlzLl9wYXJ0cyk7XG4gICAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH07XG4gIHAudXNlcmluZm8gPSBmdW5jdGlvbih2LCBidWlsZCkge1xuICAgIGlmICh0aGlzLl9wYXJ0cy51cm4pIHtcbiAgICAgIHJldHVybiB2ID09PSB1bmRlZmluZWQgPyAnJyA6IHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHYgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKCF0aGlzLl9wYXJ0cy51c2VybmFtZSkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG5cbiAgICAgIHZhciB0ID0gVVJJLmJ1aWxkVXNlcmluZm8odGhpcy5fcGFydHMpO1xuICAgICAgcmV0dXJuIHQuc3Vic3RyaW5nKDAsIHQubGVuZ3RoIC0xKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHZbdi5sZW5ndGgtMV0gIT09ICdAJykge1xuICAgICAgICB2ICs9ICdAJztcbiAgICAgIH1cblxuICAgICAgVVJJLnBhcnNlVXNlcmluZm8odiwgdGhpcy5fcGFydHMpO1xuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9O1xuICBwLnJlc291cmNlID0gZnVuY3Rpb24odiwgYnVpbGQpIHtcbiAgICB2YXIgcGFydHM7XG5cbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXRoKCkgKyB0aGlzLnNlYXJjaCgpICsgdGhpcy5oYXNoKCk7XG4gICAgfVxuXG4gICAgcGFydHMgPSBVUkkucGFyc2Uodik7XG4gICAgdGhpcy5fcGFydHMucGF0aCA9IHBhcnRzLnBhdGg7XG4gICAgdGhpcy5fcGFydHMucXVlcnkgPSBwYXJ0cy5xdWVyeTtcbiAgICB0aGlzLl9wYXJ0cy5mcmFnbWVudCA9IHBhcnRzLmZyYWdtZW50O1xuICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvLyBmcmFjdGlvbiBhY2Nlc3NvcnNcbiAgcC5zdWJkb21haW4gPSBmdW5jdGlvbih2LCBidWlsZCkge1xuICAgIGlmICh0aGlzLl9wYXJ0cy51cm4pIHtcbiAgICAgIHJldHVybiB2ID09PSB1bmRlZmluZWQgPyAnJyA6IHRoaXM7XG4gICAgfVxuXG4gICAgLy8gY29udmVuaWVuY2UsIHJldHVybiBcInd3d1wiIGZyb20gXCJ3d3cuZXhhbXBsZS5vcmdcIlxuICAgIGlmICh2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICghdGhpcy5fcGFydHMuaG9zdG5hbWUgfHwgdGhpcy5pcygnSVAnKSkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG5cbiAgICAgIC8vIGdyYWIgZG9tYWluIGFuZCBhZGQgYW5vdGhlciBzZWdtZW50XG4gICAgICB2YXIgZW5kID0gdGhpcy5fcGFydHMuaG9zdG5hbWUubGVuZ3RoIC0gdGhpcy5kb21haW4oKS5sZW5ndGggLSAxO1xuICAgICAgcmV0dXJuIHRoaXMuX3BhcnRzLmhvc3RuYW1lLnN1YnN0cmluZygwLCBlbmQpIHx8ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZSA9IHRoaXMuX3BhcnRzLmhvc3RuYW1lLmxlbmd0aCAtIHRoaXMuZG9tYWluKCkubGVuZ3RoO1xuICAgICAgdmFyIHN1YiA9IHRoaXMuX3BhcnRzLmhvc3RuYW1lLnN1YnN0cmluZygwLCBlKTtcbiAgICAgIHZhciByZXBsYWNlID0gbmV3IFJlZ0V4cCgnXicgKyBlc2NhcGVSZWdFeChzdWIpKTtcblxuICAgICAgaWYgKHYgJiYgdi5jaGFyQXQodi5sZW5ndGggLSAxKSAhPT0gJy4nKSB7XG4gICAgICAgIHYgKz0gJy4nO1xuICAgICAgfVxuXG4gICAgICBpZiAodikge1xuICAgICAgICBVUkkuZW5zdXJlVmFsaWRIb3N0bmFtZSh2KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fcGFydHMuaG9zdG5hbWUgPSB0aGlzLl9wYXJ0cy5ob3N0bmFtZS5yZXBsYWNlKHJlcGxhY2UsIHYpO1xuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9O1xuICBwLmRvbWFpbiA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XG4gICAgaWYgKHRoaXMuX3BhcnRzLnVybikge1xuICAgICAgcmV0dXJuIHYgPT09IHVuZGVmaW5lZCA/ICcnIDogdGhpcztcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykge1xuICAgICAgYnVpbGQgPSB2O1xuICAgICAgdiA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvLyBjb252ZW5pZW5jZSwgcmV0dXJuIFwiZXhhbXBsZS5vcmdcIiBmcm9tIFwid3d3LmV4YW1wbGUub3JnXCJcbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoIXRoaXMuX3BhcnRzLmhvc3RuYW1lIHx8IHRoaXMuaXMoJ0lQJykpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuXG4gICAgICAvLyBpZiBob3N0bmFtZSBjb25zaXN0cyBvZiAxIG9yIDIgc2VnbWVudHMsIGl0IG11c3QgYmUgdGhlIGRvbWFpblxuICAgICAgdmFyIHQgPSB0aGlzLl9wYXJ0cy5ob3N0bmFtZS5tYXRjaCgvXFwuL2cpO1xuICAgICAgaWYgKHQgJiYgdC5sZW5ndGggPCAyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJ0cy5ob3N0bmFtZTtcbiAgICAgIH1cblxuICAgICAgLy8gZ3JhYiB0bGQgYW5kIGFkZCBhbm90aGVyIHNlZ21lbnRcbiAgICAgIHZhciBlbmQgPSB0aGlzLl9wYXJ0cy5ob3N0bmFtZS5sZW5ndGggLSB0aGlzLnRsZChidWlsZCkubGVuZ3RoIC0gMTtcbiAgICAgIGVuZCA9IHRoaXMuX3BhcnRzLmhvc3RuYW1lLmxhc3RJbmRleE9mKCcuJywgZW5kIC0xKSArIDE7XG4gICAgICByZXR1cm4gdGhpcy5fcGFydHMuaG9zdG5hbWUuc3Vic3RyaW5nKGVuZCkgfHwgJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghdikge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjYW5ub3Qgc2V0IGRvbWFpbiBlbXB0eScpO1xuICAgICAgfVxuXG4gICAgICBVUkkuZW5zdXJlVmFsaWRIb3N0bmFtZSh2KTtcblxuICAgICAgaWYgKCF0aGlzLl9wYXJ0cy5ob3N0bmFtZSB8fCB0aGlzLmlzKCdJUCcpKSB7XG4gICAgICAgIHRoaXMuX3BhcnRzLmhvc3RuYW1lID0gdjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciByZXBsYWNlID0gbmV3IFJlZ0V4cChlc2NhcGVSZWdFeCh0aGlzLmRvbWFpbigpKSArICckJyk7XG4gICAgICAgIHRoaXMuX3BhcnRzLmhvc3RuYW1lID0gdGhpcy5fcGFydHMuaG9zdG5hbWUucmVwbGFjZShyZXBsYWNlLCB2KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9O1xuICBwLnRsZCA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XG4gICAgaWYgKHRoaXMuX3BhcnRzLnVybikge1xuICAgICAgcmV0dXJuIHYgPT09IHVuZGVmaW5lZCA/ICcnIDogdGhpcztcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykge1xuICAgICAgYnVpbGQgPSB2O1xuICAgICAgdiA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvLyByZXR1cm4gXCJvcmdcIiBmcm9tIFwid3d3LmV4YW1wbGUub3JnXCJcbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoIXRoaXMuX3BhcnRzLmhvc3RuYW1lIHx8IHRoaXMuaXMoJ0lQJykpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuXG4gICAgICB2YXIgcG9zID0gdGhpcy5fcGFydHMuaG9zdG5hbWUubGFzdEluZGV4T2YoJy4nKTtcbiAgICAgIHZhciB0bGQgPSB0aGlzLl9wYXJ0cy5ob3N0bmFtZS5zdWJzdHJpbmcocG9zICsgMSk7XG5cbiAgICAgIGlmIChidWlsZCAhPT0gdHJ1ZSAmJiBTTEQgJiYgU0xELmxpc3RbdGxkLnRvTG93ZXJDYXNlKCldKSB7XG4gICAgICAgIHJldHVybiBTTEQuZ2V0KHRoaXMuX3BhcnRzLmhvc3RuYW1lKSB8fCB0bGQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0bGQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciByZXBsYWNlO1xuXG4gICAgICBpZiAoIXYpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY2Fubm90IHNldCBUTEQgZW1wdHknKTtcbiAgICAgIH0gZWxzZSBpZiAodi5tYXRjaCgvW15hLXpBLVowLTktXS8pKSB7XG4gICAgICAgIGlmIChTTEQgJiYgU0xELmlzKHYpKSB7XG4gICAgICAgICAgcmVwbGFjZSA9IG5ldyBSZWdFeHAoZXNjYXBlUmVnRXgodGhpcy50bGQoKSkgKyAnJCcpO1xuICAgICAgICAgIHRoaXMuX3BhcnRzLmhvc3RuYW1lID0gdGhpcy5fcGFydHMuaG9zdG5hbWUucmVwbGFjZShyZXBsYWNlLCB2KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUTEQgXCInICsgdiArICdcIiBjb250YWlucyBjaGFyYWN0ZXJzIG90aGVyIHRoYW4gW0EtWjAtOV0nKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghdGhpcy5fcGFydHMuaG9zdG5hbWUgfHwgdGhpcy5pcygnSVAnKSkge1xuICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ2Nhbm5vdCBzZXQgVExEIG9uIG5vbi1kb21haW4gaG9zdCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVwbGFjZSA9IG5ldyBSZWdFeHAoZXNjYXBlUmVnRXgodGhpcy50bGQoKSkgKyAnJCcpO1xuICAgICAgICB0aGlzLl9wYXJ0cy5ob3N0bmFtZSA9IHRoaXMuX3BhcnRzLmhvc3RuYW1lLnJlcGxhY2UocmVwbGFjZSwgdik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfTtcbiAgcC5kaXJlY3RvcnkgPSBmdW5jdGlvbih2LCBidWlsZCkge1xuICAgIGlmICh0aGlzLl9wYXJ0cy51cm4pIHtcbiAgICAgIHJldHVybiB2ID09PSB1bmRlZmluZWQgPyAnJyA6IHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHYgPT09IHVuZGVmaW5lZCB8fCB2ID09PSB0cnVlKSB7XG4gICAgICBpZiAoIXRoaXMuX3BhcnRzLnBhdGggJiYgIXRoaXMuX3BhcnRzLmhvc3RuYW1lKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX3BhcnRzLnBhdGggPT09ICcvJykge1xuICAgICAgICByZXR1cm4gJy8nO1xuICAgICAgfVxuXG4gICAgICB2YXIgZW5kID0gdGhpcy5fcGFydHMucGF0aC5sZW5ndGggLSB0aGlzLmZpbGVuYW1lKCkubGVuZ3RoIC0gMTtcbiAgICAgIHZhciByZXMgPSB0aGlzLl9wYXJ0cy5wYXRoLnN1YnN0cmluZygwLCBlbmQpIHx8ICh0aGlzLl9wYXJ0cy5ob3N0bmFtZSA/ICcvJyA6ICcnKTtcblxuICAgICAgcmV0dXJuIHYgPyBVUkkuZGVjb2RlUGF0aChyZXMpIDogcmVzO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBlID0gdGhpcy5fcGFydHMucGF0aC5sZW5ndGggLSB0aGlzLmZpbGVuYW1lKCkubGVuZ3RoO1xuICAgICAgdmFyIGRpcmVjdG9yeSA9IHRoaXMuX3BhcnRzLnBhdGguc3Vic3RyaW5nKDAsIGUpO1xuICAgICAgdmFyIHJlcGxhY2UgPSBuZXcgUmVnRXhwKCdeJyArIGVzY2FwZVJlZ0V4KGRpcmVjdG9yeSkpO1xuXG4gICAgICAvLyBmdWxseSBxdWFsaWZpZXIgZGlyZWN0b3JpZXMgYmVnaW4gd2l0aCBhIHNsYXNoXG4gICAgICBpZiAoIXRoaXMuaXMoJ3JlbGF0aXZlJykpIHtcbiAgICAgICAgaWYgKCF2KSB7XG4gICAgICAgICAgdiA9ICcvJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2LmNoYXJBdCgwKSAhPT0gJy8nKSB7XG4gICAgICAgICAgdiA9ICcvJyArIHY7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gZGlyZWN0b3JpZXMgYWx3YXlzIGVuZCB3aXRoIGEgc2xhc2hcbiAgICAgIGlmICh2ICYmIHYuY2hhckF0KHYubGVuZ3RoIC0gMSkgIT09ICcvJykge1xuICAgICAgICB2ICs9ICcvJztcbiAgICAgIH1cblxuICAgICAgdiA9IFVSSS5yZWNvZGVQYXRoKHYpO1xuICAgICAgdGhpcy5fcGFydHMucGF0aCA9IHRoaXMuX3BhcnRzLnBhdGgucmVwbGFjZShyZXBsYWNlLCB2KTtcbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfTtcbiAgcC5maWxlbmFtZSA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XG4gICAgaWYgKHRoaXMuX3BhcnRzLnVybikge1xuICAgICAgcmV0dXJuIHYgPT09IHVuZGVmaW5lZCA/ICcnIDogdGhpcztcbiAgICB9XG5cbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkIHx8IHYgPT09IHRydWUpIHtcbiAgICAgIGlmICghdGhpcy5fcGFydHMucGF0aCB8fCB0aGlzLl9wYXJ0cy5wYXRoID09PSAnLycpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuXG4gICAgICB2YXIgcG9zID0gdGhpcy5fcGFydHMucGF0aC5sYXN0SW5kZXhPZignLycpO1xuICAgICAgdmFyIHJlcyA9IHRoaXMuX3BhcnRzLnBhdGguc3Vic3RyaW5nKHBvcysxKTtcblxuICAgICAgcmV0dXJuIHYgPyBVUkkuZGVjb2RlUGF0aFNlZ21lbnQocmVzKSA6IHJlcztcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIG11dGF0ZWREaXJlY3RvcnkgPSBmYWxzZTtcblxuICAgICAgaWYgKHYuY2hhckF0KDApID09PSAnLycpIHtcbiAgICAgICAgdiA9IHYuc3Vic3RyaW5nKDEpO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5tYXRjaCgvXFwuP1xcLy8pKSB7XG4gICAgICAgIG11dGF0ZWREaXJlY3RvcnkgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVwbGFjZSA9IG5ldyBSZWdFeHAoZXNjYXBlUmVnRXgodGhpcy5maWxlbmFtZSgpKSArICckJyk7XG4gICAgICB2ID0gVVJJLnJlY29kZVBhdGgodik7XG4gICAgICB0aGlzLl9wYXJ0cy5wYXRoID0gdGhpcy5fcGFydHMucGF0aC5yZXBsYWNlKHJlcGxhY2UsIHYpO1xuXG4gICAgICBpZiAobXV0YXRlZERpcmVjdG9yeSkge1xuICAgICAgICB0aGlzLm5vcm1hbGl6ZVBhdGgoYnVpbGQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH07XG4gIHAuc3VmZml4ID0gZnVuY3Rpb24odiwgYnVpbGQpIHtcbiAgICBpZiAodGhpcy5fcGFydHMudXJuKSB7XG4gICAgICByZXR1cm4gdiA9PT0gdW5kZWZpbmVkID8gJycgOiB0aGlzO1xuICAgIH1cblxuICAgIGlmICh2ID09PSB1bmRlZmluZWQgfHwgdiA9PT0gdHJ1ZSkge1xuICAgICAgaWYgKCF0aGlzLl9wYXJ0cy5wYXRoIHx8IHRoaXMuX3BhcnRzLnBhdGggPT09ICcvJykge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG5cbiAgICAgIHZhciBmaWxlbmFtZSA9IHRoaXMuZmlsZW5hbWUoKTtcbiAgICAgIHZhciBwb3MgPSBmaWxlbmFtZS5sYXN0SW5kZXhPZignLicpO1xuICAgICAgdmFyIHMsIHJlcztcblxuICAgICAgaWYgKHBvcyA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuXG4gICAgICAvLyBzdWZmaXggbWF5IG9ubHkgY29udGFpbiBhbG51bSBjaGFyYWN0ZXJzICh5dXAsIEkgbWFkZSB0aGlzIHVwLilcbiAgICAgIHMgPSBmaWxlbmFtZS5zdWJzdHJpbmcocG9zKzEpO1xuICAgICAgcmVzID0gKC9eW2EtejAtOSVdKyQvaSkudGVzdChzKSA/IHMgOiAnJztcbiAgICAgIHJldHVybiB2ID8gVVJJLmRlY29kZVBhdGhTZWdtZW50KHJlcykgOiByZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh2LmNoYXJBdCgwKSA9PT0gJy4nKSB7XG4gICAgICAgIHYgPSB2LnN1YnN0cmluZygxKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHN1ZmZpeCA9IHRoaXMuc3VmZml4KCk7XG4gICAgICB2YXIgcmVwbGFjZTtcblxuICAgICAgaWYgKCFzdWZmaXgpIHtcbiAgICAgICAgaWYgKCF2KSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9wYXJ0cy5wYXRoICs9ICcuJyArIFVSSS5yZWNvZGVQYXRoKHYpO1xuICAgICAgfSBlbHNlIGlmICghdikge1xuICAgICAgICByZXBsYWNlID0gbmV3IFJlZ0V4cChlc2NhcGVSZWdFeCgnLicgKyBzdWZmaXgpICsgJyQnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcGxhY2UgPSBuZXcgUmVnRXhwKGVzY2FwZVJlZ0V4KHN1ZmZpeCkgKyAnJCcpO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVwbGFjZSkge1xuICAgICAgICB2ID0gVVJJLnJlY29kZVBhdGgodik7XG4gICAgICAgIHRoaXMuX3BhcnRzLnBhdGggPSB0aGlzLl9wYXJ0cy5wYXRoLnJlcGxhY2UocmVwbGFjZSwgdik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfTtcbiAgcC5zZWdtZW50ID0gZnVuY3Rpb24oc2VnbWVudCwgdiwgYnVpbGQpIHtcbiAgICB2YXIgc2VwYXJhdG9yID0gdGhpcy5fcGFydHMudXJuID8gJzonIDogJy8nO1xuICAgIHZhciBwYXRoID0gdGhpcy5wYXRoKCk7XG4gICAgdmFyIGFic29sdXRlID0gcGF0aC5zdWJzdHJpbmcoMCwgMSkgPT09ICcvJztcbiAgICB2YXIgc2VnbWVudHMgPSBwYXRoLnNwbGl0KHNlcGFyYXRvcik7XG5cbiAgICBpZiAoc2VnbWVudCAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBzZWdtZW50ICE9PSAnbnVtYmVyJykge1xuICAgICAgYnVpbGQgPSB2O1xuICAgICAgdiA9IHNlZ21lbnQ7XG4gICAgICBzZWdtZW50ID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmIChzZWdtZW50ICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHNlZ21lbnQgIT09ICdudW1iZXInKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBzZWdtZW50IFwiJyArIHNlZ21lbnQgKyAnXCIsIG11c3QgYmUgMC1iYXNlZCBpbnRlZ2VyJyk7XG4gICAgfVxuXG4gICAgaWYgKGFic29sdXRlKSB7XG4gICAgICBzZWdtZW50cy5zaGlmdCgpO1xuICAgIH1cblxuICAgIGlmIChzZWdtZW50IDwgMCkge1xuICAgICAgLy8gYWxsb3cgbmVnYXRpdmUgaW5kZXhlcyB0byBhZGRyZXNzIGZyb20gdGhlIGVuZFxuICAgICAgc2VnbWVudCA9IE1hdGgubWF4KHNlZ21lbnRzLmxlbmd0aCArIHNlZ21lbnQsIDApO1xuICAgIH1cblxuICAgIGlmICh2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8qanNoaW50IGxheGJyZWFrOiB0cnVlICovXG4gICAgICByZXR1cm4gc2VnbWVudCA9PT0gdW5kZWZpbmVkXG4gICAgICAgID8gc2VnbWVudHNcbiAgICAgICAgOiBzZWdtZW50c1tzZWdtZW50XTtcbiAgICAgIC8qanNoaW50IGxheGJyZWFrOiBmYWxzZSAqL1xuICAgIH0gZWxzZSBpZiAoc2VnbWVudCA9PT0gbnVsbCB8fCBzZWdtZW50c1tzZWdtZW50XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoaXNBcnJheSh2KSkge1xuICAgICAgICBzZWdtZW50cyA9IFtdO1xuICAgICAgICAvLyBjb2xsYXBzZSBlbXB0eSBlbGVtZW50cyB3aXRoaW4gYXJyYXlcbiAgICAgICAgZm9yICh2YXIgaT0wLCBsPXYubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgaWYgKCF2W2ldLmxlbmd0aCAmJiAoIXNlZ21lbnRzLmxlbmd0aCB8fCAhc2VnbWVudHNbc2VnbWVudHMubGVuZ3RoIC0xXS5sZW5ndGgpKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc2VnbWVudHMubGVuZ3RoICYmICFzZWdtZW50c1tzZWdtZW50cy5sZW5ndGggLTFdLmxlbmd0aCkge1xuICAgICAgICAgICAgc2VnbWVudHMucG9wKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc2VnbWVudHMucHVzaCh2W2ldKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh2IHx8IHR5cGVvZiB2ID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZiAoc2VnbWVudHNbc2VnbWVudHMubGVuZ3RoIC0xXSA9PT0gJycpIHtcbiAgICAgICAgICAvLyBlbXB0eSB0cmFpbGluZyBlbGVtZW50cyBoYXZlIHRvIGJlIG92ZXJ3cml0dGVuXG4gICAgICAgICAgLy8gdG8gcHJldmVudCByZXN1bHRzIHN1Y2ggYXMgL2Zvby8vYmFyXG4gICAgICAgICAgc2VnbWVudHNbc2VnbWVudHMubGVuZ3RoIC0xXSA9IHY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VnbWVudHMucHVzaCh2KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodikge1xuICAgICAgICBzZWdtZW50c1tzZWdtZW50XSA9IHY7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWdtZW50cy5zcGxpY2Uoc2VnbWVudCwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGFic29sdXRlKSB7XG4gICAgICBzZWdtZW50cy51bnNoaWZ0KCcnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wYXRoKHNlZ21lbnRzLmpvaW4oc2VwYXJhdG9yKSwgYnVpbGQpO1xuICB9O1xuICBwLnNlZ21lbnRDb2RlZCA9IGZ1bmN0aW9uKHNlZ21lbnQsIHYsIGJ1aWxkKSB7XG4gICAgdmFyIHNlZ21lbnRzLCBpLCBsO1xuXG4gICAgaWYgKHR5cGVvZiBzZWdtZW50ICE9PSAnbnVtYmVyJykge1xuICAgICAgYnVpbGQgPSB2O1xuICAgICAgdiA9IHNlZ21lbnQ7XG4gICAgICBzZWdtZW50ID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmICh2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHNlZ21lbnRzID0gdGhpcy5zZWdtZW50KHNlZ21lbnQsIHYsIGJ1aWxkKTtcbiAgICAgIGlmICghaXNBcnJheShzZWdtZW50cykpIHtcbiAgICAgICAgc2VnbWVudHMgPSBzZWdtZW50cyAhPT0gdW5kZWZpbmVkID8gVVJJLmRlY29kZShzZWdtZW50cykgOiB1bmRlZmluZWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSAwLCBsID0gc2VnbWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgc2VnbWVudHNbaV0gPSBVUkkuZGVjb2RlKHNlZ21lbnRzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2VnbWVudHM7XG4gICAgfVxuXG4gICAgaWYgKCFpc0FycmF5KHYpKSB7XG4gICAgICB2ID0gKHR5cGVvZiB2ID09PSAnc3RyaW5nJyB8fCB2IGluc3RhbmNlb2YgU3RyaW5nKSA/IFVSSS5lbmNvZGUodikgOiB2O1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGkgPSAwLCBsID0gdi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdltpXSA9IFVSSS5kZWNvZGUodltpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc2VnbWVudChzZWdtZW50LCB2LCBidWlsZCk7XG4gIH07XG5cbiAgLy8gbXV0YXRpbmcgcXVlcnkgc3RyaW5nXG4gIHZhciBxID0gcC5xdWVyeTtcbiAgcC5xdWVyeSA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XG4gICAgaWYgKHYgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBVUkkucGFyc2VRdWVyeSh0aGlzLl9wYXJ0cy5xdWVyeSwgdGhpcy5fcGFydHMuZXNjYXBlUXVlcnlTcGFjZSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdmFyIGRhdGEgPSBVUkkucGFyc2VRdWVyeSh0aGlzLl9wYXJ0cy5xdWVyeSwgdGhpcy5fcGFydHMuZXNjYXBlUXVlcnlTcGFjZSk7XG4gICAgICB2YXIgcmVzdWx0ID0gdi5jYWxsKHRoaXMsIGRhdGEpO1xuICAgICAgdGhpcy5fcGFydHMucXVlcnkgPSBVUkkuYnVpbGRRdWVyeShyZXN1bHQgfHwgZGF0YSwgdGhpcy5fcGFydHMuZHVwbGljYXRlUXVlcnlQYXJhbWV0ZXJzLCB0aGlzLl9wYXJ0cy5lc2NhcGVRdWVyeVNwYWNlKTtcbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gZWxzZSBpZiAodiAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiB2ICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fcGFydHMucXVlcnkgPSBVUkkuYnVpbGRRdWVyeSh2LCB0aGlzLl9wYXJ0cy5kdXBsaWNhdGVRdWVyeVBhcmFtZXRlcnMsIHRoaXMuX3BhcnRzLmVzY2FwZVF1ZXJ5U3BhY2UpO1xuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBxLmNhbGwodGhpcywgdiwgYnVpbGQpO1xuICAgIH1cbiAgfTtcbiAgcC5zZXRRdWVyeSA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBidWlsZCkge1xuICAgIHZhciBkYXRhID0gVVJJLnBhcnNlUXVlcnkodGhpcy5fcGFydHMucXVlcnksIHRoaXMuX3BhcnRzLmVzY2FwZVF1ZXJ5U3BhY2UpO1xuXG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSAnc3RyaW5nJyB8fCBuYW1lIGluc3RhbmNlb2YgU3RyaW5nKSB7XG4gICAgICBkYXRhW25hbWVdID0gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDogbnVsbDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBuYW1lID09PSAnb2JqZWN0Jykge1xuICAgICAgZm9yICh2YXIga2V5IGluIG5hbWUpIHtcbiAgICAgICAgaWYgKGhhc093bi5jYWxsKG5hbWUsIGtleSkpIHtcbiAgICAgICAgICBkYXRhW2tleV0gPSBuYW1lW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVVJJLmFkZFF1ZXJ5KCkgYWNjZXB0cyBhbiBvYmplY3QsIHN0cmluZyBhcyB0aGUgbmFtZSBwYXJhbWV0ZXInKTtcbiAgICB9XG5cbiAgICB0aGlzLl9wYXJ0cy5xdWVyeSA9IFVSSS5idWlsZFF1ZXJ5KGRhdGEsIHRoaXMuX3BhcnRzLmR1cGxpY2F0ZVF1ZXJ5UGFyYW1ldGVycywgdGhpcy5fcGFydHMuZXNjYXBlUXVlcnlTcGFjZSk7XG4gICAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgYnVpbGQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHAuYWRkUXVlcnkgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgYnVpbGQpIHtcbiAgICB2YXIgZGF0YSA9IFVSSS5wYXJzZVF1ZXJ5KHRoaXMuX3BhcnRzLnF1ZXJ5LCB0aGlzLl9wYXJ0cy5lc2NhcGVRdWVyeVNwYWNlKTtcbiAgICBVUkkuYWRkUXVlcnkoZGF0YSwgbmFtZSwgdmFsdWUgPT09IHVuZGVmaW5lZCA/IG51bGwgOiB2YWx1ZSk7XG4gICAgdGhpcy5fcGFydHMucXVlcnkgPSBVUkkuYnVpbGRRdWVyeShkYXRhLCB0aGlzLl9wYXJ0cy5kdXBsaWNhdGVRdWVyeVBhcmFtZXRlcnMsIHRoaXMuX3BhcnRzLmVzY2FwZVF1ZXJ5U3BhY2UpO1xuICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIGJ1aWxkID0gdmFsdWU7XG4gICAgfVxuXG4gICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBwLnJlbW92ZVF1ZXJ5ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUsIGJ1aWxkKSB7XG4gICAgdmFyIGRhdGEgPSBVUkkucGFyc2VRdWVyeSh0aGlzLl9wYXJ0cy5xdWVyeSwgdGhpcy5fcGFydHMuZXNjYXBlUXVlcnlTcGFjZSk7XG4gICAgVVJJLnJlbW92ZVF1ZXJ5KGRhdGEsIG5hbWUsIHZhbHVlKTtcbiAgICB0aGlzLl9wYXJ0cy5xdWVyeSA9IFVSSS5idWlsZFF1ZXJ5KGRhdGEsIHRoaXMuX3BhcnRzLmR1cGxpY2F0ZVF1ZXJ5UGFyYW1ldGVycywgdGhpcy5fcGFydHMuZXNjYXBlUXVlcnlTcGFjZSk7XG4gICAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgYnVpbGQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHAuaGFzUXVlcnkgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgd2l0aGluQXJyYXkpIHtcbiAgICB2YXIgZGF0YSA9IFVSSS5wYXJzZVF1ZXJ5KHRoaXMuX3BhcnRzLnF1ZXJ5LCB0aGlzLl9wYXJ0cy5lc2NhcGVRdWVyeVNwYWNlKTtcbiAgICByZXR1cm4gVVJJLmhhc1F1ZXJ5KGRhdGEsIG5hbWUsIHZhbHVlLCB3aXRoaW5BcnJheSk7XG4gIH07XG4gIHAuc2V0U2VhcmNoID0gcC5zZXRRdWVyeTtcbiAgcC5hZGRTZWFyY2ggPSBwLmFkZFF1ZXJ5O1xuICBwLnJlbW92ZVNlYXJjaCA9IHAucmVtb3ZlUXVlcnk7XG4gIHAuaGFzU2VhcmNoID0gcC5oYXNRdWVyeTtcblxuICAvLyBzYW5pdGl6aW5nIFVSTHNcbiAgcC5ub3JtYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5fcGFydHMudXJuKSB7XG4gICAgICByZXR1cm4gdGhpc1xuICAgICAgICAubm9ybWFsaXplUHJvdG9jb2woZmFsc2UpXG4gICAgICAgIC5ub3JtYWxpemVQYXRoKGZhbHNlKVxuICAgICAgICAubm9ybWFsaXplUXVlcnkoZmFsc2UpXG4gICAgICAgIC5ub3JtYWxpemVGcmFnbWVudChmYWxzZSlcbiAgICAgICAgLmJ1aWxkKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgICAgIC5ub3JtYWxpemVQcm90b2NvbChmYWxzZSlcbiAgICAgIC5ub3JtYWxpemVIb3N0bmFtZShmYWxzZSlcbiAgICAgIC5ub3JtYWxpemVQb3J0KGZhbHNlKVxuICAgICAgLm5vcm1hbGl6ZVBhdGgoZmFsc2UpXG4gICAgICAubm9ybWFsaXplUXVlcnkoZmFsc2UpXG4gICAgICAubm9ybWFsaXplRnJhZ21lbnQoZmFsc2UpXG4gICAgICAuYnVpbGQoKTtcbiAgfTtcbiAgcC5ub3JtYWxpemVQcm90b2NvbCA9IGZ1bmN0aW9uKGJ1aWxkKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLl9wYXJ0cy5wcm90b2NvbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX3BhcnRzLnByb3RvY29sID0gdGhpcy5fcGFydHMucHJvdG9jb2wudG9Mb3dlckNhc2UoKTtcbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgcC5ub3JtYWxpemVIb3N0bmFtZSA9IGZ1bmN0aW9uKGJ1aWxkKSB7XG4gICAgaWYgKHRoaXMuX3BhcnRzLmhvc3RuYW1lKSB7XG4gICAgICBpZiAodGhpcy5pcygnSUROJykgJiYgcHVueWNvZGUpIHtcbiAgICAgICAgdGhpcy5fcGFydHMuaG9zdG5hbWUgPSBwdW55Y29kZS50b0FTQ0lJKHRoaXMuX3BhcnRzLmhvc3RuYW1lKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pcygnSVB2NicpICYmIElQdjYpIHtcbiAgICAgICAgdGhpcy5fcGFydHMuaG9zdG5hbWUgPSBJUHY2LmJlc3QodGhpcy5fcGFydHMuaG9zdG5hbWUpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9wYXJ0cy5ob3N0bmFtZSA9IHRoaXMuX3BhcnRzLmhvc3RuYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHAubm9ybWFsaXplUG9ydCA9IGZ1bmN0aW9uKGJ1aWxkKSB7XG4gICAgLy8gcmVtb3ZlIHBvcnQgb2YgaXQncyB0aGUgcHJvdG9jb2wncyBkZWZhdWx0XG4gICAgaWYgKHR5cGVvZiB0aGlzLl9wYXJ0cy5wcm90b2NvbCA9PT0gJ3N0cmluZycgJiYgdGhpcy5fcGFydHMucG9ydCA9PT0gVVJJLmRlZmF1bHRQb3J0c1t0aGlzLl9wYXJ0cy5wcm90b2NvbF0pIHtcbiAgICAgIHRoaXMuX3BhcnRzLnBvcnQgPSBudWxsO1xuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBwLm5vcm1hbGl6ZVBhdGggPSBmdW5jdGlvbihidWlsZCkge1xuICAgIHZhciBfcGF0aCA9IHRoaXMuX3BhcnRzLnBhdGg7XG4gICAgaWYgKCFfcGF0aCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3BhcnRzLnVybikge1xuICAgICAgdGhpcy5fcGFydHMucGF0aCA9IFVSSS5yZWNvZGVVcm5QYXRoKHRoaXMuX3BhcnRzLnBhdGgpO1xuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3BhcnRzLnBhdGggPT09ICcvJykge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdmFyIF93YXNfcmVsYXRpdmU7XG4gICAgdmFyIF9sZWFkaW5nUGFyZW50cyA9ICcnO1xuICAgIHZhciBfcGFyZW50LCBfcG9zO1xuXG4gICAgLy8gaGFuZGxlIHJlbGF0aXZlIHBhdGhzXG4gICAgaWYgKF9wYXRoLmNoYXJBdCgwKSAhPT0gJy8nKSB7XG4gICAgICBfd2FzX3JlbGF0aXZlID0gdHJ1ZTtcbiAgICAgIF9wYXRoID0gJy8nICsgX3BhdGg7XG4gICAgfVxuXG4gICAgLy8gcmVzb2x2ZSBzaW1wbGVzXG4gICAgX3BhdGggPSBfcGF0aFxuICAgICAgLnJlcGxhY2UoLyhcXC8oXFwuXFwvKSspfChcXC9cXC4kKS9nLCAnLycpXG4gICAgICAucmVwbGFjZSgvXFwvezIsfS9nLCAnLycpO1xuXG4gICAgLy8gcmVtZW1iZXIgbGVhZGluZyBwYXJlbnRzXG4gICAgaWYgKF93YXNfcmVsYXRpdmUpIHtcbiAgICAgIF9sZWFkaW5nUGFyZW50cyA9IF9wYXRoLnN1YnN0cmluZygxKS5tYXRjaCgvXihcXC5cXC5cXC8pKy8pIHx8ICcnO1xuICAgICAgaWYgKF9sZWFkaW5nUGFyZW50cykge1xuICAgICAgICBfbGVhZGluZ1BhcmVudHMgPSBfbGVhZGluZ1BhcmVudHNbMF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gcmVzb2x2ZSBwYXJlbnRzXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIF9wYXJlbnQgPSBfcGF0aC5pbmRleE9mKCcvLi4nKTtcbiAgICAgIGlmIChfcGFyZW50ID09PSAtMSkge1xuICAgICAgICAvLyBubyBtb3JlIC4uLyB0byByZXNvbHZlXG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIGlmIChfcGFyZW50ID09PSAwKSB7XG4gICAgICAgIC8vIHRvcCBsZXZlbCBjYW5ub3QgYmUgcmVsYXRpdmUsIHNraXAgaXRcbiAgICAgICAgX3BhdGggPSBfcGF0aC5zdWJzdHJpbmcoMyk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBfcG9zID0gX3BhdGguc3Vic3RyaW5nKDAsIF9wYXJlbnQpLmxhc3RJbmRleE9mKCcvJyk7XG4gICAgICBpZiAoX3BvcyA9PT0gLTEpIHtcbiAgICAgICAgX3BvcyA9IF9wYXJlbnQ7XG4gICAgICB9XG4gICAgICBfcGF0aCA9IF9wYXRoLnN1YnN0cmluZygwLCBfcG9zKSArIF9wYXRoLnN1YnN0cmluZyhfcGFyZW50ICsgMyk7XG4gICAgfVxuXG4gICAgLy8gcmV2ZXJ0IHRvIHJlbGF0aXZlXG4gICAgaWYgKF93YXNfcmVsYXRpdmUgJiYgdGhpcy5pcygncmVsYXRpdmUnKSkge1xuICAgICAgX3BhdGggPSBfbGVhZGluZ1BhcmVudHMgKyBfcGF0aC5zdWJzdHJpbmcoMSk7XG4gICAgfVxuXG4gICAgX3BhdGggPSBVUkkucmVjb2RlUGF0aChfcGF0aCk7XG4gICAgdGhpcy5fcGFydHMucGF0aCA9IF9wYXRoO1xuICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgcC5ub3JtYWxpemVQYXRobmFtZSA9IHAubm9ybWFsaXplUGF0aDtcbiAgcC5ub3JtYWxpemVRdWVyeSA9IGZ1bmN0aW9uKGJ1aWxkKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLl9wYXJ0cy5xdWVyeSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmICghdGhpcy5fcGFydHMucXVlcnkubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX3BhcnRzLnF1ZXJ5ID0gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucXVlcnkoVVJJLnBhcnNlUXVlcnkodGhpcy5fcGFydHMucXVlcnksIHRoaXMuX3BhcnRzLmVzY2FwZVF1ZXJ5U3BhY2UpKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBwLm5vcm1hbGl6ZUZyYWdtZW50ID0gZnVuY3Rpb24oYnVpbGQpIHtcbiAgICBpZiAoIXRoaXMuX3BhcnRzLmZyYWdtZW50KSB7XG4gICAgICB0aGlzLl9wYXJ0cy5mcmFnbWVudCA9IG51bGw7XG4gICAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHAubm9ybWFsaXplU2VhcmNoID0gcC5ub3JtYWxpemVRdWVyeTtcbiAgcC5ub3JtYWxpemVIYXNoID0gcC5ub3JtYWxpemVGcmFnbWVudDtcblxuICBwLmlzbzg4NTkgPSBmdW5jdGlvbigpIHtcbiAgICAvLyBleHBlY3QgdW5pY29kZSBpbnB1dCwgaXNvODg1OSBvdXRwdXRcbiAgICB2YXIgZSA9IFVSSS5lbmNvZGU7XG4gICAgdmFyIGQgPSBVUkkuZGVjb2RlO1xuXG4gICAgVVJJLmVuY29kZSA9IGVzY2FwZTtcbiAgICBVUkkuZGVjb2RlID0gZGVjb2RlVVJJQ29tcG9uZW50O1xuICAgIHRyeSB7XG4gICAgICB0aGlzLm5vcm1hbGl6ZSgpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBVUkkuZW5jb2RlID0gZTtcbiAgICAgIFVSSS5kZWNvZGUgPSBkO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBwLnVuaWNvZGUgPSBmdW5jdGlvbigpIHtcbiAgICAvLyBleHBlY3QgaXNvODg1OSBpbnB1dCwgdW5pY29kZSBvdXRwdXRcbiAgICB2YXIgZSA9IFVSSS5lbmNvZGU7XG4gICAgdmFyIGQgPSBVUkkuZGVjb2RlO1xuXG4gICAgVVJJLmVuY29kZSA9IHN0cmljdEVuY29kZVVSSUNvbXBvbmVudDtcbiAgICBVUkkuZGVjb2RlID0gdW5lc2NhcGU7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMubm9ybWFsaXplKCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIFVSSS5lbmNvZGUgPSBlO1xuICAgICAgVVJJLmRlY29kZSA9IGQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHAucmVhZGFibGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdXJpID0gdGhpcy5jbG9uZSgpO1xuICAgIC8vIHJlbW92aW5nIHVzZXJuYW1lLCBwYXNzd29yZCwgYmVjYXVzZSB0aGV5IHNob3VsZG4ndCBiZSBkaXNwbGF5ZWQgYWNjb3JkaW5nIHRvIFJGQyAzOTg2XG4gICAgdXJpLnVzZXJuYW1lKCcnKS5wYXNzd29yZCgnJykubm9ybWFsaXplKCk7XG4gICAgdmFyIHQgPSAnJztcbiAgICBpZiAodXJpLl9wYXJ0cy5wcm90b2NvbCkge1xuICAgICAgdCArPSB1cmkuX3BhcnRzLnByb3RvY29sICsgJzovLyc7XG4gICAgfVxuXG4gICAgaWYgKHVyaS5fcGFydHMuaG9zdG5hbWUpIHtcbiAgICAgIGlmICh1cmkuaXMoJ3B1bnljb2RlJykgJiYgcHVueWNvZGUpIHtcbiAgICAgICAgdCArPSBwdW55Y29kZS50b1VuaWNvZGUodXJpLl9wYXJ0cy5ob3N0bmFtZSk7XG4gICAgICAgIGlmICh1cmkuX3BhcnRzLnBvcnQpIHtcbiAgICAgICAgICB0ICs9ICc6JyArIHVyaS5fcGFydHMucG9ydDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdCArPSB1cmkuaG9zdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh1cmkuX3BhcnRzLmhvc3RuYW1lICYmIHVyaS5fcGFydHMucGF0aCAmJiB1cmkuX3BhcnRzLnBhdGguY2hhckF0KDApICE9PSAnLycpIHtcbiAgICAgIHQgKz0gJy8nO1xuICAgIH1cblxuICAgIHQgKz0gdXJpLnBhdGgodHJ1ZSk7XG4gICAgaWYgKHVyaS5fcGFydHMucXVlcnkpIHtcbiAgICAgIHZhciBxID0gJyc7XG4gICAgICBmb3IgKHZhciBpID0gMCwgcXAgPSB1cmkuX3BhcnRzLnF1ZXJ5LnNwbGl0KCcmJyksIGwgPSBxcC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdmFyIGt2ID0gKHFwW2ldIHx8ICcnKS5zcGxpdCgnPScpO1xuICAgICAgICBxICs9ICcmJyArIFVSSS5kZWNvZGVRdWVyeShrdlswXSwgdGhpcy5fcGFydHMuZXNjYXBlUXVlcnlTcGFjZSlcbiAgICAgICAgICAucmVwbGFjZSgvJi9nLCAnJTI2Jyk7XG5cbiAgICAgICAgaWYgKGt2WzFdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBxICs9ICc9JyArIFVSSS5kZWNvZGVRdWVyeShrdlsxXSwgdGhpcy5fcGFydHMuZXNjYXBlUXVlcnlTcGFjZSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC8mL2csICclMjYnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdCArPSAnPycgKyBxLnN1YnN0cmluZygxKTtcbiAgICB9XG5cbiAgICB0ICs9IFVSSS5kZWNvZGVRdWVyeSh1cmkuaGFzaCgpLCB0cnVlKTtcbiAgICByZXR1cm4gdDtcbiAgfTtcblxuICAvLyByZXNvbHZpbmcgcmVsYXRpdmUgYW5kIGFic29sdXRlIFVSTHNcbiAgcC5hYnNvbHV0ZVRvID0gZnVuY3Rpb24oYmFzZSkge1xuICAgIHZhciByZXNvbHZlZCA9IHRoaXMuY2xvbmUoKTtcbiAgICB2YXIgcHJvcGVydGllcyA9IFsncHJvdG9jb2wnLCAndXNlcm5hbWUnLCAncGFzc3dvcmQnLCAnaG9zdG5hbWUnLCAncG9ydCddO1xuICAgIHZhciBiYXNlZGlyLCBpLCBwO1xuXG4gICAgaWYgKHRoaXMuX3BhcnRzLnVybikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVUk5zIGRvIG5vdCBoYXZlIGFueSBnZW5lcmFsbHkgZGVmaW5lZCBoaWVyYXJjaGljYWwgY29tcG9uZW50cycpO1xuICAgIH1cblxuICAgIGlmICghKGJhc2UgaW5zdGFuY2VvZiBVUkkpKSB7XG4gICAgICBiYXNlID0gbmV3IFVSSShiYXNlKTtcbiAgICB9XG5cbiAgICBpZiAoIXJlc29sdmVkLl9wYXJ0cy5wcm90b2NvbCkge1xuICAgICAgcmVzb2x2ZWQuX3BhcnRzLnByb3RvY29sID0gYmFzZS5fcGFydHMucHJvdG9jb2w7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3BhcnRzLmhvc3RuYW1lKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZWQ7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgKHAgPSBwcm9wZXJ0aWVzW2ldKTsgaSsrKSB7XG4gICAgICByZXNvbHZlZC5fcGFydHNbcF0gPSBiYXNlLl9wYXJ0c1twXTtcbiAgICB9XG5cbiAgICBpZiAoIXJlc29sdmVkLl9wYXJ0cy5wYXRoKSB7XG4gICAgICByZXNvbHZlZC5fcGFydHMucGF0aCA9IGJhc2UuX3BhcnRzLnBhdGg7XG4gICAgICBpZiAoIXJlc29sdmVkLl9wYXJ0cy5xdWVyeSkge1xuICAgICAgICByZXNvbHZlZC5fcGFydHMucXVlcnkgPSBiYXNlLl9wYXJ0cy5xdWVyeTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHJlc29sdmVkLl9wYXJ0cy5wYXRoLnN1YnN0cmluZygtMikgPT09ICcuLicpIHtcbiAgICAgIHJlc29sdmVkLl9wYXJ0cy5wYXRoICs9ICcvJztcbiAgICB9XG5cbiAgICBpZiAocmVzb2x2ZWQucGF0aCgpLmNoYXJBdCgwKSAhPT0gJy8nKSB7XG4gICAgICBiYXNlZGlyID0gYmFzZS5kaXJlY3RvcnkoKTtcbiAgICAgIGJhc2VkaXIgPSBiYXNlZGlyID8gYmFzZWRpciA6IGJhc2UucGF0aCgpLmluZGV4T2YoJy8nKSA9PT0gMCA/ICcvJyA6ICcnO1xuICAgICAgcmVzb2x2ZWQuX3BhcnRzLnBhdGggPSAoYmFzZWRpciA/IChiYXNlZGlyICsgJy8nKSA6ICcnKSArIHJlc29sdmVkLl9wYXJ0cy5wYXRoO1xuICAgICAgcmVzb2x2ZWQubm9ybWFsaXplUGF0aCgpO1xuICAgIH1cblxuICAgIHJlc29sdmVkLmJ1aWxkKCk7XG4gICAgcmV0dXJuIHJlc29sdmVkO1xuICB9O1xuICBwLnJlbGF0aXZlVG8gPSBmdW5jdGlvbihiYXNlKSB7XG4gICAgdmFyIHJlbGF0aXZlID0gdGhpcy5jbG9uZSgpLm5vcm1hbGl6ZSgpO1xuICAgIHZhciByZWxhdGl2ZVBhcnRzLCBiYXNlUGFydHMsIGNvbW1vbiwgcmVsYXRpdmVQYXRoLCBiYXNlUGF0aDtcblxuICAgIGlmIChyZWxhdGl2ZS5fcGFydHMudXJuKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VSTnMgZG8gbm90IGhhdmUgYW55IGdlbmVyYWxseSBkZWZpbmVkIGhpZXJhcmNoaWNhbCBjb21wb25lbnRzJyk7XG4gICAgfVxuXG4gICAgYmFzZSA9IG5ldyBVUkkoYmFzZSkubm9ybWFsaXplKCk7XG4gICAgcmVsYXRpdmVQYXJ0cyA9IHJlbGF0aXZlLl9wYXJ0cztcbiAgICBiYXNlUGFydHMgPSBiYXNlLl9wYXJ0cztcbiAgICByZWxhdGl2ZVBhdGggPSByZWxhdGl2ZS5wYXRoKCk7XG4gICAgYmFzZVBhdGggPSBiYXNlLnBhdGgoKTtcblxuICAgIGlmIChyZWxhdGl2ZVBhdGguY2hhckF0KDApICE9PSAnLycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVVJJIGlzIGFscmVhZHkgcmVsYXRpdmUnKTtcbiAgICB9XG5cbiAgICBpZiAoYmFzZVBhdGguY2hhckF0KDApICE9PSAnLycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNhbGN1bGF0ZSBhIFVSSSByZWxhdGl2ZSB0byBhbm90aGVyIHJlbGF0aXZlIFVSSScpO1xuICAgIH1cblxuICAgIGlmIChyZWxhdGl2ZVBhcnRzLnByb3RvY29sID09PSBiYXNlUGFydHMucHJvdG9jb2wpIHtcbiAgICAgIHJlbGF0aXZlUGFydHMucHJvdG9jb2wgPSBudWxsO1xuICAgIH1cblxuICAgIGlmIChyZWxhdGl2ZVBhcnRzLnVzZXJuYW1lICE9PSBiYXNlUGFydHMudXNlcm5hbWUgfHwgcmVsYXRpdmVQYXJ0cy5wYXNzd29yZCAhPT0gYmFzZVBhcnRzLnBhc3N3b3JkKSB7XG4gICAgICByZXR1cm4gcmVsYXRpdmUuYnVpbGQoKTtcbiAgICB9XG5cbiAgICBpZiAocmVsYXRpdmVQYXJ0cy5wcm90b2NvbCAhPT0gbnVsbCB8fCByZWxhdGl2ZVBhcnRzLnVzZXJuYW1lICE9PSBudWxsIHx8IHJlbGF0aXZlUGFydHMucGFzc3dvcmQgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiByZWxhdGl2ZS5idWlsZCgpO1xuICAgIH1cblxuICAgIGlmIChyZWxhdGl2ZVBhcnRzLmhvc3RuYW1lID09PSBiYXNlUGFydHMuaG9zdG5hbWUgJiYgcmVsYXRpdmVQYXJ0cy5wb3J0ID09PSBiYXNlUGFydHMucG9ydCkge1xuICAgICAgcmVsYXRpdmVQYXJ0cy5ob3N0bmFtZSA9IG51bGw7XG4gICAgICByZWxhdGl2ZVBhcnRzLnBvcnQgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVsYXRpdmUuYnVpbGQoKTtcbiAgICB9XG5cbiAgICBpZiAocmVsYXRpdmVQYXRoID09PSBiYXNlUGF0aCkge1xuICAgICAgcmVsYXRpdmVQYXJ0cy5wYXRoID0gJyc7XG4gICAgICByZXR1cm4gcmVsYXRpdmUuYnVpbGQoKTtcbiAgICB9XG5cbiAgICAvLyBkZXRlcm1pbmUgY29tbW9uIHN1YiBwYXRoXG4gICAgY29tbW9uID0gVVJJLmNvbW1vblBhdGgocmVsYXRpdmUucGF0aCgpLCBiYXNlLnBhdGgoKSk7XG5cbiAgICAvLyBJZiB0aGUgcGF0aHMgaGF2ZSBub3RoaW5nIGluIGNvbW1vbiwgcmV0dXJuIGEgcmVsYXRpdmUgVVJMIHdpdGggdGhlIGFic29sdXRlIHBhdGguXG4gICAgaWYgKCFjb21tb24pIHtcbiAgICAgIHJldHVybiByZWxhdGl2ZS5idWlsZCgpO1xuICAgIH1cblxuICAgIHZhciBwYXJlbnRzID0gYmFzZVBhcnRzLnBhdGhcbiAgICAgIC5zdWJzdHJpbmcoY29tbW9uLmxlbmd0aClcbiAgICAgIC5yZXBsYWNlKC9bXlxcL10qJC8sICcnKVxuICAgICAgLnJlcGxhY2UoLy4qP1xcLy9nLCAnLi4vJyk7XG5cbiAgICByZWxhdGl2ZVBhcnRzLnBhdGggPSBwYXJlbnRzICsgcmVsYXRpdmVQYXJ0cy5wYXRoLnN1YnN0cmluZyhjb21tb24ubGVuZ3RoKTtcblxuICAgIHJldHVybiByZWxhdGl2ZS5idWlsZCgpO1xuICB9O1xuXG4gIC8vIGNvbXBhcmluZyBVUklzXG4gIHAuZXF1YWxzID0gZnVuY3Rpb24odXJpKSB7XG4gICAgdmFyIG9uZSA9IHRoaXMuY2xvbmUoKTtcbiAgICB2YXIgdHdvID0gbmV3IFVSSSh1cmkpO1xuICAgIHZhciBvbmVfbWFwID0ge307XG4gICAgdmFyIHR3b19tYXAgPSB7fTtcbiAgICB2YXIgY2hlY2tlZCA9IHt9O1xuICAgIHZhciBvbmVfcXVlcnksIHR3b19xdWVyeSwga2V5O1xuXG4gICAgb25lLm5vcm1hbGl6ZSgpO1xuICAgIHR3by5ub3JtYWxpemUoKTtcblxuICAgIC8vIGV4YWN0IG1hdGNoXG4gICAgaWYgKG9uZS50b1N0cmluZygpID09PSB0d28udG9TdHJpbmcoKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gZXh0cmFjdCBxdWVyeSBzdHJpbmdcbiAgICBvbmVfcXVlcnkgPSBvbmUucXVlcnkoKTtcbiAgICB0d29fcXVlcnkgPSB0d28ucXVlcnkoKTtcbiAgICBvbmUucXVlcnkoJycpO1xuICAgIHR3by5xdWVyeSgnJyk7XG5cbiAgICAvLyBkZWZpbml0ZWx5IG5vdCBlcXVhbCBpZiBub3QgZXZlbiBub24tcXVlcnkgcGFydHMgbWF0Y2hcbiAgICBpZiAob25lLnRvU3RyaW5nKCkgIT09IHR3by50b1N0cmluZygpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gcXVlcnkgcGFyYW1ldGVycyBoYXZlIHRoZSBzYW1lIGxlbmd0aCwgZXZlbiBpZiB0aGV5J3JlIHBlcm11dGVkXG4gICAgaWYgKG9uZV9xdWVyeS5sZW5ndGggIT09IHR3b19xdWVyeS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBvbmVfbWFwID0gVVJJLnBhcnNlUXVlcnkob25lX3F1ZXJ5LCB0aGlzLl9wYXJ0cy5lc2NhcGVRdWVyeVNwYWNlKTtcbiAgICB0d29fbWFwID0gVVJJLnBhcnNlUXVlcnkodHdvX3F1ZXJ5LCB0aGlzLl9wYXJ0cy5lc2NhcGVRdWVyeVNwYWNlKTtcblxuICAgIGZvciAoa2V5IGluIG9uZV9tYXApIHtcbiAgICAgIGlmIChoYXNPd24uY2FsbChvbmVfbWFwLCBrZXkpKSB7XG4gICAgICAgIGlmICghaXNBcnJheShvbmVfbWFwW2tleV0pKSB7XG4gICAgICAgICAgaWYgKG9uZV9tYXBba2V5XSAhPT0gdHdvX21hcFtrZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCFhcnJheXNFcXVhbChvbmVfbWFwW2tleV0sIHR3b19tYXBba2V5XSkpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjaGVja2VkW2tleV0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoa2V5IGluIHR3b19tYXApIHtcbiAgICAgIGlmIChoYXNPd24uY2FsbCh0d29fbWFwLCBrZXkpKSB7XG4gICAgICAgIGlmICghY2hlY2tlZFtrZXldKSB7XG4gICAgICAgICAgLy8gdHdvIGNvbnRhaW5zIGEgcGFyYW1ldGVyIG5vdCBwcmVzZW50IGluIG9uZVxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8vIHN0YXRlXG4gIHAuZHVwbGljYXRlUXVlcnlQYXJhbWV0ZXJzID0gZnVuY3Rpb24odikge1xuICAgIHRoaXMuX3BhcnRzLmR1cGxpY2F0ZVF1ZXJ5UGFyYW1ldGVycyA9ICEhdjtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBwLmVzY2FwZVF1ZXJ5U3BhY2UgPSBmdW5jdGlvbih2KSB7XG4gICAgdGhpcy5fcGFydHMuZXNjYXBlUXVlcnlTcGFjZSA9ICEhdjtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICByZXR1cm4gVVJJO1xufSkpO1xuIiwiLyohIGh0dHA6Ly9tdGhzLmJlL3B1bnljb2RlIHYxLjIuMyBieSBAbWF0aGlhcyAqL1xuOyhmdW5jdGlvbihyb290KSB7XG5cblx0LyoqIERldGVjdCBmcmVlIHZhcmlhYmxlcyAqL1xuXHR2YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzO1xuXHR2YXIgZnJlZU1vZHVsZSA9IHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmXG5cdFx0bW9kdWxlLmV4cG9ydHMgPT0gZnJlZUV4cG9ydHMgJiYgbW9kdWxlO1xuXHR2YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsO1xuXHRpZiAoZnJlZUdsb2JhbC5nbG9iYWwgPT09IGZyZWVHbG9iYWwgfHwgZnJlZUdsb2JhbC53aW5kb3cgPT09IGZyZWVHbG9iYWwpIHtcblx0XHRyb290ID0gZnJlZUdsb2JhbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYHB1bnljb2RlYCBvYmplY3QuXG5cdCAqIEBuYW1lIHB1bnljb2RlXG5cdCAqIEB0eXBlIE9iamVjdFxuXHQgKi9cblx0dmFyIHB1bnljb2RlLFxuXG5cdC8qKiBIaWdoZXN0IHBvc2l0aXZlIHNpZ25lZCAzMi1iaXQgZmxvYXQgdmFsdWUgKi9cblx0bWF4SW50ID0gMjE0NzQ4MzY0NywgLy8gYWthLiAweDdGRkZGRkZGIG9yIDJeMzEtMVxuXG5cdC8qKiBCb290c3RyaW5nIHBhcmFtZXRlcnMgKi9cblx0YmFzZSA9IDM2LFxuXHR0TWluID0gMSxcblx0dE1heCA9IDI2LFxuXHRza2V3ID0gMzgsXG5cdGRhbXAgPSA3MDAsXG5cdGluaXRpYWxCaWFzID0gNzIsXG5cdGluaXRpYWxOID0gMTI4LCAvLyAweDgwXG5cdGRlbGltaXRlciA9ICctJywgLy8gJ1xceDJEJ1xuXG5cdC8qKiBSZWd1bGFyIGV4cHJlc3Npb25zICovXG5cdHJlZ2V4UHVueWNvZGUgPSAvXnhuLS0vLFxuXHRyZWdleE5vbkFTQ0lJID0gL1teIC1+XS8sIC8vIHVucHJpbnRhYmxlIEFTQ0lJIGNoYXJzICsgbm9uLUFTQ0lJIGNoYXJzXG5cdHJlZ2V4U2VwYXJhdG9ycyA9IC9cXHgyRXxcXHUzMDAyfFxcdUZGMEV8XFx1RkY2MS9nLCAvLyBSRkMgMzQ5MCBzZXBhcmF0b3JzXG5cblx0LyoqIEVycm9yIG1lc3NhZ2VzICovXG5cdGVycm9ycyA9IHtcblx0XHQnb3ZlcmZsb3cnOiAnT3ZlcmZsb3c6IGlucHV0IG5lZWRzIHdpZGVyIGludGVnZXJzIHRvIHByb2Nlc3MnLFxuXHRcdCdub3QtYmFzaWMnOiAnSWxsZWdhbCBpbnB1dCA+PSAweDgwIChub3QgYSBiYXNpYyBjb2RlIHBvaW50KScsXG5cdFx0J2ludmFsaWQtaW5wdXQnOiAnSW52YWxpZCBpbnB1dCdcblx0fSxcblxuXHQvKiogQ29udmVuaWVuY2Ugc2hvcnRjdXRzICovXG5cdGJhc2VNaW51c1RNaW4gPSBiYXNlIC0gdE1pbixcblx0Zmxvb3IgPSBNYXRoLmZsb29yLFxuXHRzdHJpbmdGcm9tQ2hhckNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlLFxuXG5cdC8qKiBUZW1wb3JhcnkgdmFyaWFibGUgKi9cblx0a2V5O1xuXG5cdC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cdC8qKlxuXHQgKiBBIGdlbmVyaWMgZXJyb3IgdXRpbGl0eSBmdW5jdGlvbi5cblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgVGhlIGVycm9yIHR5cGUuXG5cdCAqIEByZXR1cm5zIHtFcnJvcn0gVGhyb3dzIGEgYFJhbmdlRXJyb3JgIHdpdGggdGhlIGFwcGxpY2FibGUgZXJyb3IgbWVzc2FnZS5cblx0ICovXG5cdGZ1bmN0aW9uIGVycm9yKHR5cGUpIHtcblx0XHR0aHJvdyBSYW5nZUVycm9yKGVycm9yc1t0eXBlXSk7XG5cdH1cblxuXHQvKipcblx0ICogQSBnZW5lcmljIGBBcnJheSNtYXBgIHV0aWxpdHkgZnVuY3Rpb24uXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiB0aGF0IGdldHMgY2FsbGVkIGZvciBldmVyeSBhcnJheVxuXHQgKiBpdGVtLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IEEgbmV3IGFycmF5IG9mIHZhbHVlcyByZXR1cm5lZCBieSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBtYXAoYXJyYXksIGZuKSB7XG5cdFx0dmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblx0XHR3aGlsZSAobGVuZ3RoLS0pIHtcblx0XHRcdGFycmF5W2xlbmd0aF0gPSBmbihhcnJheVtsZW5ndGhdKTtcblx0XHR9XG5cdFx0cmV0dXJuIGFycmF5O1xuXHR9XG5cblx0LyoqXG5cdCAqIEEgc2ltcGxlIGBBcnJheSNtYXBgLWxpa2Ugd3JhcHBlciB0byB3b3JrIHdpdGggZG9tYWluIG5hbWUgc3RyaW5ncy5cblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGRvbWFpbiBUaGUgZG9tYWluIG5hbWUuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiB0aGF0IGdldHMgY2FsbGVkIGZvciBldmVyeVxuXHQgKiBjaGFyYWN0ZXIuXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gQSBuZXcgc3RyaW5nIG9mIGNoYXJhY3RlcnMgcmV0dXJuZWQgYnkgdGhlIGNhbGxiYWNrXG5cdCAqIGZ1bmN0aW9uLlxuXHQgKi9cblx0ZnVuY3Rpb24gbWFwRG9tYWluKHN0cmluZywgZm4pIHtcblx0XHRyZXR1cm4gbWFwKHN0cmluZy5zcGxpdChyZWdleFNlcGFyYXRvcnMpLCBmbikuam9pbignLicpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYW4gYXJyYXkgY29udGFpbmluZyB0aGUgbnVtZXJpYyBjb2RlIHBvaW50cyBvZiBlYWNoIFVuaWNvZGVcblx0ICogY2hhcmFjdGVyIGluIHRoZSBzdHJpbmcuIFdoaWxlIEphdmFTY3JpcHQgdXNlcyBVQ1MtMiBpbnRlcm5hbGx5LFxuXHQgKiB0aGlzIGZ1bmN0aW9uIHdpbGwgY29udmVydCBhIHBhaXIgb2Ygc3Vycm9nYXRlIGhhbHZlcyAoZWFjaCBvZiB3aGljaFxuXHQgKiBVQ1MtMiBleHBvc2VzIGFzIHNlcGFyYXRlIGNoYXJhY3RlcnMpIGludG8gYSBzaW5nbGUgY29kZSBwb2ludCxcblx0ICogbWF0Y2hpbmcgVVRGLTE2LlxuXHQgKiBAc2VlIGBwdW55Y29kZS51Y3MyLmVuY29kZWBcblx0ICogQHNlZSA8aHR0cDovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZz5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlLnVjczJcblx0ICogQG5hbWUgZGVjb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmcgVGhlIFVuaWNvZGUgaW5wdXQgc3RyaW5nIChVQ1MtMikuXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gVGhlIG5ldyBhcnJheSBvZiBjb2RlIHBvaW50cy5cblx0ICovXG5cdGZ1bmN0aW9uIHVjczJkZWNvZGUoc3RyaW5nKSB7XG5cdFx0dmFyIG91dHB1dCA9IFtdLFxuXHRcdCAgICBjb3VudGVyID0gMCxcblx0XHQgICAgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aCxcblx0XHQgICAgdmFsdWUsXG5cdFx0ICAgIGV4dHJhO1xuXHRcdHdoaWxlIChjb3VudGVyIDwgbGVuZ3RoKSB7XG5cdFx0XHR2YWx1ZSA9IHN0cmluZy5jaGFyQ29kZUF0KGNvdW50ZXIrKyk7XG5cdFx0XHRpZiAodmFsdWUgPj0gMHhEODAwICYmIHZhbHVlIDw9IDB4REJGRiAmJiBjb3VudGVyIDwgbGVuZ3RoKSB7XG5cdFx0XHRcdC8vIGhpZ2ggc3Vycm9nYXRlLCBhbmQgdGhlcmUgaXMgYSBuZXh0IGNoYXJhY3RlclxuXHRcdFx0XHRleHRyYSA9IHN0cmluZy5jaGFyQ29kZUF0KGNvdW50ZXIrKyk7XG5cdFx0XHRcdGlmICgoZXh0cmEgJiAweEZDMDApID09IDB4REMwMCkgeyAvLyBsb3cgc3Vycm9nYXRlXG5cdFx0XHRcdFx0b3V0cHV0LnB1c2goKCh2YWx1ZSAmIDB4M0ZGKSA8PCAxMCkgKyAoZXh0cmEgJiAweDNGRikgKyAweDEwMDAwKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyB1bm1hdGNoZWQgc3Vycm9nYXRlOyBvbmx5IGFwcGVuZCB0aGlzIGNvZGUgdW5pdCwgaW4gY2FzZSB0aGUgbmV4dFxuXHRcdFx0XHRcdC8vIGNvZGUgdW5pdCBpcyB0aGUgaGlnaCBzdXJyb2dhdGUgb2YgYSBzdXJyb2dhdGUgcGFpclxuXHRcdFx0XHRcdG91dHB1dC5wdXNoKHZhbHVlKTtcblx0XHRcdFx0XHRjb3VudGVyLS07XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG91dHB1dC5wdXNoKHZhbHVlKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG91dHB1dDtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgc3RyaW5nIGJhc2VkIG9uIGFuIGFycmF5IG9mIG51bWVyaWMgY29kZSBwb2ludHMuXG5cdCAqIEBzZWUgYHB1bnljb2RlLnVjczIuZGVjb2RlYFxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGUudWNzMlxuXHQgKiBAbmFtZSBlbmNvZGVcblx0ICogQHBhcmFtIHtBcnJheX0gY29kZVBvaW50cyBUaGUgYXJyYXkgb2YgbnVtZXJpYyBjb2RlIHBvaW50cy5cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIG5ldyBVbmljb2RlIHN0cmluZyAoVUNTLTIpLlxuXHQgKi9cblx0ZnVuY3Rpb24gdWNzMmVuY29kZShhcnJheSkge1xuXHRcdHJldHVybiBtYXAoYXJyYXksIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHR2YXIgb3V0cHV0ID0gJyc7XG5cdFx0XHRpZiAodmFsdWUgPiAweEZGRkYpIHtcblx0XHRcdFx0dmFsdWUgLT0gMHgxMDAwMDtcblx0XHRcdFx0b3V0cHV0ICs9IHN0cmluZ0Zyb21DaGFyQ29kZSh2YWx1ZSA+Pj4gMTAgJiAweDNGRiB8IDB4RDgwMCk7XG5cdFx0XHRcdHZhbHVlID0gMHhEQzAwIHwgdmFsdWUgJiAweDNGRjtcblx0XHRcdH1cblx0XHRcdG91dHB1dCArPSBzdHJpbmdGcm9tQ2hhckNvZGUodmFsdWUpO1xuXHRcdFx0cmV0dXJuIG91dHB1dDtcblx0XHR9KS5qb2luKCcnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIGJhc2ljIGNvZGUgcG9pbnQgaW50byBhIGRpZ2l0L2ludGVnZXIuXG5cdCAqIEBzZWUgYGRpZ2l0VG9CYXNpYygpYFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge051bWJlcn0gY29kZVBvaW50IFRoZSBiYXNpYyBudW1lcmljIGNvZGUgcG9pbnQgdmFsdWUuXG5cdCAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBudW1lcmljIHZhbHVlIG9mIGEgYmFzaWMgY29kZSBwb2ludCAoZm9yIHVzZSBpblxuXHQgKiByZXByZXNlbnRpbmcgaW50ZWdlcnMpIGluIHRoZSByYW5nZSBgMGAgdG8gYGJhc2UgLSAxYCwgb3IgYGJhc2VgIGlmXG5cdCAqIHRoZSBjb2RlIHBvaW50IGRvZXMgbm90IHJlcHJlc2VudCBhIHZhbHVlLlxuXHQgKi9cblx0ZnVuY3Rpb24gYmFzaWNUb0RpZ2l0KGNvZGVQb2ludCkge1xuXHRcdGlmIChjb2RlUG9pbnQgLSA0OCA8IDEwKSB7XG5cdFx0XHRyZXR1cm4gY29kZVBvaW50IC0gMjI7XG5cdFx0fVxuXHRcdGlmIChjb2RlUG9pbnQgLSA2NSA8IDI2KSB7XG5cdFx0XHRyZXR1cm4gY29kZVBvaW50IC0gNjU7XG5cdFx0fVxuXHRcdGlmIChjb2RlUG9pbnQgLSA5NyA8IDI2KSB7XG5cdFx0XHRyZXR1cm4gY29kZVBvaW50IC0gOTc7XG5cdFx0fVxuXHRcdHJldHVybiBiYXNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgZGlnaXQvaW50ZWdlciBpbnRvIGEgYmFzaWMgY29kZSBwb2ludC5cblx0ICogQHNlZSBgYmFzaWNUb0RpZ2l0KClgXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBkaWdpdCBUaGUgbnVtZXJpYyB2YWx1ZSBvZiBhIGJhc2ljIGNvZGUgcG9pbnQuXG5cdCAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBiYXNpYyBjb2RlIHBvaW50IHdob3NlIHZhbHVlICh3aGVuIHVzZWQgZm9yXG5cdCAqIHJlcHJlc2VudGluZyBpbnRlZ2VycykgaXMgYGRpZ2l0YCwgd2hpY2ggbmVlZHMgdG8gYmUgaW4gdGhlIHJhbmdlXG5cdCAqIGAwYCB0byBgYmFzZSAtIDFgLiBJZiBgZmxhZ2AgaXMgbm9uLXplcm8sIHRoZSB1cHBlcmNhc2UgZm9ybSBpc1xuXHQgKiB1c2VkOyBlbHNlLCB0aGUgbG93ZXJjYXNlIGZvcm0gaXMgdXNlZC4gVGhlIGJlaGF2aW9yIGlzIHVuZGVmaW5lZFxuXHQgKiBpZiBgZmxhZ2AgaXMgbm9uLXplcm8gYW5kIGBkaWdpdGAgaGFzIG5vIHVwcGVyY2FzZSBmb3JtLlxuXHQgKi9cblx0ZnVuY3Rpb24gZGlnaXRUb0Jhc2ljKGRpZ2l0LCBmbGFnKSB7XG5cdFx0Ly8gIDAuLjI1IG1hcCB0byBBU0NJSSBhLi56IG9yIEEuLlpcblx0XHQvLyAyNi4uMzUgbWFwIHRvIEFTQ0lJIDAuLjlcblx0XHRyZXR1cm4gZGlnaXQgKyAyMiArIDc1ICogKGRpZ2l0IDwgMjYpIC0gKChmbGFnICE9IDApIDw8IDUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEJpYXMgYWRhcHRhdGlvbiBmdW5jdGlvbiBhcyBwZXIgc2VjdGlvbiAzLjQgb2YgUkZDIDM0OTIuXG5cdCAqIGh0dHA6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM0OTIjc2VjdGlvbi0zLjRcblx0ICogQHByaXZhdGVcblx0ICovXG5cdGZ1bmN0aW9uIGFkYXB0KGRlbHRhLCBudW1Qb2ludHMsIGZpcnN0VGltZSkge1xuXHRcdHZhciBrID0gMDtcblx0XHRkZWx0YSA9IGZpcnN0VGltZSA/IGZsb29yKGRlbHRhIC8gZGFtcCkgOiBkZWx0YSA+PiAxO1xuXHRcdGRlbHRhICs9IGZsb29yKGRlbHRhIC8gbnVtUG9pbnRzKTtcblx0XHRmb3IgKC8qIG5vIGluaXRpYWxpemF0aW9uICovOyBkZWx0YSA+IGJhc2VNaW51c1RNaW4gKiB0TWF4ID4+IDE7IGsgKz0gYmFzZSkge1xuXHRcdFx0ZGVsdGEgPSBmbG9vcihkZWx0YSAvIGJhc2VNaW51c1RNaW4pO1xuXHRcdH1cblx0XHRyZXR1cm4gZmxvb3IoayArIChiYXNlTWludXNUTWluICsgMSkgKiBkZWx0YSAvIChkZWx0YSArIHNrZXcpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIFB1bnljb2RlIHN0cmluZyBvZiBBU0NJSS1vbmx5IHN5bWJvbHMgdG8gYSBzdHJpbmcgb2YgVW5pY29kZVxuXHQgKiBzeW1ib2xzLlxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBQdW55Y29kZSBzdHJpbmcgb2YgQVNDSUktb25seSBzeW1ib2xzLlxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgcmVzdWx0aW5nIHN0cmluZyBvZiBVbmljb2RlIHN5bWJvbHMuXG5cdCAqL1xuXHRmdW5jdGlvbiBkZWNvZGUoaW5wdXQpIHtcblx0XHQvLyBEb24ndCB1c2UgVUNTLTJcblx0XHR2YXIgb3V0cHV0ID0gW10sXG5cdFx0ICAgIGlucHV0TGVuZ3RoID0gaW5wdXQubGVuZ3RoLFxuXHRcdCAgICBvdXQsXG5cdFx0ICAgIGkgPSAwLFxuXHRcdCAgICBuID0gaW5pdGlhbE4sXG5cdFx0ICAgIGJpYXMgPSBpbml0aWFsQmlhcyxcblx0XHQgICAgYmFzaWMsXG5cdFx0ICAgIGosXG5cdFx0ICAgIGluZGV4LFxuXHRcdCAgICBvbGRpLFxuXHRcdCAgICB3LFxuXHRcdCAgICBrLFxuXHRcdCAgICBkaWdpdCxcblx0XHQgICAgdCxcblx0XHQgICAgbGVuZ3RoLFxuXHRcdCAgICAvKiogQ2FjaGVkIGNhbGN1bGF0aW9uIHJlc3VsdHMgKi9cblx0XHQgICAgYmFzZU1pbnVzVDtcblxuXHRcdC8vIEhhbmRsZSB0aGUgYmFzaWMgY29kZSBwb2ludHM6IGxldCBgYmFzaWNgIGJlIHRoZSBudW1iZXIgb2YgaW5wdXQgY29kZVxuXHRcdC8vIHBvaW50cyBiZWZvcmUgdGhlIGxhc3QgZGVsaW1pdGVyLCBvciBgMGAgaWYgdGhlcmUgaXMgbm9uZSwgdGhlbiBjb3B5XG5cdFx0Ly8gdGhlIGZpcnN0IGJhc2ljIGNvZGUgcG9pbnRzIHRvIHRoZSBvdXRwdXQuXG5cblx0XHRiYXNpYyA9IGlucHV0Lmxhc3RJbmRleE9mKGRlbGltaXRlcik7XG5cdFx0aWYgKGJhc2ljIDwgMCkge1xuXHRcdFx0YmFzaWMgPSAwO1xuXHRcdH1cblxuXHRcdGZvciAoaiA9IDA7IGogPCBiYXNpYzsgKytqKSB7XG5cdFx0XHQvLyBpZiBpdCdzIG5vdCBhIGJhc2ljIGNvZGUgcG9pbnRcblx0XHRcdGlmIChpbnB1dC5jaGFyQ29kZUF0KGopID49IDB4ODApIHtcblx0XHRcdFx0ZXJyb3IoJ25vdC1iYXNpYycpO1xuXHRcdFx0fVxuXHRcdFx0b3V0cHV0LnB1c2goaW5wdXQuY2hhckNvZGVBdChqKSk7XG5cdFx0fVxuXG5cdFx0Ly8gTWFpbiBkZWNvZGluZyBsb29wOiBzdGFydCBqdXN0IGFmdGVyIHRoZSBsYXN0IGRlbGltaXRlciBpZiBhbnkgYmFzaWMgY29kZVxuXHRcdC8vIHBvaW50cyB3ZXJlIGNvcGllZDsgc3RhcnQgYXQgdGhlIGJlZ2lubmluZyBvdGhlcndpc2UuXG5cblx0XHRmb3IgKGluZGV4ID0gYmFzaWMgPiAwID8gYmFzaWMgKyAxIDogMDsgaW5kZXggPCBpbnB1dExlbmd0aDsgLyogbm8gZmluYWwgZXhwcmVzc2lvbiAqLykge1xuXG5cdFx0XHQvLyBgaW5kZXhgIGlzIHRoZSBpbmRleCBvZiB0aGUgbmV4dCBjaGFyYWN0ZXIgdG8gYmUgY29uc3VtZWQuXG5cdFx0XHQvLyBEZWNvZGUgYSBnZW5lcmFsaXplZCB2YXJpYWJsZS1sZW5ndGggaW50ZWdlciBpbnRvIGBkZWx0YWAsXG5cdFx0XHQvLyB3aGljaCBnZXRzIGFkZGVkIHRvIGBpYC4gVGhlIG92ZXJmbG93IGNoZWNraW5nIGlzIGVhc2llclxuXHRcdFx0Ly8gaWYgd2UgaW5jcmVhc2UgYGlgIGFzIHdlIGdvLCB0aGVuIHN1YnRyYWN0IG9mZiBpdHMgc3RhcnRpbmdcblx0XHRcdC8vIHZhbHVlIGF0IHRoZSBlbmQgdG8gb2J0YWluIGBkZWx0YWAuXG5cdFx0XHRmb3IgKG9sZGkgPSBpLCB3ID0gMSwgayA9IGJhc2U7IC8qIG5vIGNvbmRpdGlvbiAqLzsgayArPSBiYXNlKSB7XG5cblx0XHRcdFx0aWYgKGluZGV4ID49IGlucHV0TGVuZ3RoKSB7XG5cdFx0XHRcdFx0ZXJyb3IoJ2ludmFsaWQtaW5wdXQnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGRpZ2l0ID0gYmFzaWNUb0RpZ2l0KGlucHV0LmNoYXJDb2RlQXQoaW5kZXgrKykpO1xuXG5cdFx0XHRcdGlmIChkaWdpdCA+PSBiYXNlIHx8IGRpZ2l0ID4gZmxvb3IoKG1heEludCAtIGkpIC8gdykpIHtcblx0XHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGkgKz0gZGlnaXQgKiB3O1xuXHRcdFx0XHR0ID0gayA8PSBiaWFzID8gdE1pbiA6IChrID49IGJpYXMgKyB0TWF4ID8gdE1heCA6IGsgLSBiaWFzKTtcblxuXHRcdFx0XHRpZiAoZGlnaXQgPCB0KSB7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRiYXNlTWludXNUID0gYmFzZSAtIHQ7XG5cdFx0XHRcdGlmICh3ID4gZmxvb3IobWF4SW50IC8gYmFzZU1pbnVzVCkpIHtcblx0XHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHcgKj0gYmFzZU1pbnVzVDtcblxuXHRcdFx0fVxuXG5cdFx0XHRvdXQgPSBvdXRwdXQubGVuZ3RoICsgMTtcblx0XHRcdGJpYXMgPSBhZGFwdChpIC0gb2xkaSwgb3V0LCBvbGRpID09IDApO1xuXG5cdFx0XHQvLyBgaWAgd2FzIHN1cHBvc2VkIHRvIHdyYXAgYXJvdW5kIGZyb20gYG91dGAgdG8gYDBgLFxuXHRcdFx0Ly8gaW5jcmVtZW50aW5nIGBuYCBlYWNoIHRpbWUsIHNvIHdlJ2xsIGZpeCB0aGF0IG5vdzpcblx0XHRcdGlmIChmbG9vcihpIC8gb3V0KSA+IG1heEludCAtIG4pIHtcblx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHR9XG5cblx0XHRcdG4gKz0gZmxvb3IoaSAvIG91dCk7XG5cdFx0XHRpICU9IG91dDtcblxuXHRcdFx0Ly8gSW5zZXJ0IGBuYCBhdCBwb3NpdGlvbiBgaWAgb2YgdGhlIG91dHB1dFxuXHRcdFx0b3V0cHV0LnNwbGljZShpKyssIDAsIG4pO1xuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHVjczJlbmNvZGUob3V0cHV0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIHN0cmluZyBvZiBVbmljb2RlIHN5bWJvbHMgdG8gYSBQdW55Y29kZSBzdHJpbmcgb2YgQVNDSUktb25seVxuXHQgKiBzeW1ib2xzLlxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBzdHJpbmcgb2YgVW5pY29kZSBzeW1ib2xzLlxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgcmVzdWx0aW5nIFB1bnljb2RlIHN0cmluZyBvZiBBU0NJSS1vbmx5IHN5bWJvbHMuXG5cdCAqL1xuXHRmdW5jdGlvbiBlbmNvZGUoaW5wdXQpIHtcblx0XHR2YXIgbixcblx0XHQgICAgZGVsdGEsXG5cdFx0ICAgIGhhbmRsZWRDUENvdW50LFxuXHRcdCAgICBiYXNpY0xlbmd0aCxcblx0XHQgICAgYmlhcyxcblx0XHQgICAgaixcblx0XHQgICAgbSxcblx0XHQgICAgcSxcblx0XHQgICAgayxcblx0XHQgICAgdCxcblx0XHQgICAgY3VycmVudFZhbHVlLFxuXHRcdCAgICBvdXRwdXQgPSBbXSxcblx0XHQgICAgLyoqIGBpbnB1dExlbmd0aGAgd2lsbCBob2xkIHRoZSBudW1iZXIgb2YgY29kZSBwb2ludHMgaW4gYGlucHV0YC4gKi9cblx0XHQgICAgaW5wdXRMZW5ndGgsXG5cdFx0ICAgIC8qKiBDYWNoZWQgY2FsY3VsYXRpb24gcmVzdWx0cyAqL1xuXHRcdCAgICBoYW5kbGVkQ1BDb3VudFBsdXNPbmUsXG5cdFx0ICAgIGJhc2VNaW51c1QsXG5cdFx0ICAgIHFNaW51c1Q7XG5cblx0XHQvLyBDb252ZXJ0IHRoZSBpbnB1dCBpbiBVQ1MtMiB0byBVbmljb2RlXG5cdFx0aW5wdXQgPSB1Y3MyZGVjb2RlKGlucHV0KTtcblxuXHRcdC8vIENhY2hlIHRoZSBsZW5ndGhcblx0XHRpbnB1dExlbmd0aCA9IGlucHV0Lmxlbmd0aDtcblxuXHRcdC8vIEluaXRpYWxpemUgdGhlIHN0YXRlXG5cdFx0biA9IGluaXRpYWxOO1xuXHRcdGRlbHRhID0gMDtcblx0XHRiaWFzID0gaW5pdGlhbEJpYXM7XG5cblx0XHQvLyBIYW5kbGUgdGhlIGJhc2ljIGNvZGUgcG9pbnRzXG5cdFx0Zm9yIChqID0gMDsgaiA8IGlucHV0TGVuZ3RoOyArK2opIHtcblx0XHRcdGN1cnJlbnRWYWx1ZSA9IGlucHV0W2pdO1xuXHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA8IDB4ODApIHtcblx0XHRcdFx0b3V0cHV0LnB1c2goc3RyaW5nRnJvbUNoYXJDb2RlKGN1cnJlbnRWYWx1ZSkpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGhhbmRsZWRDUENvdW50ID0gYmFzaWNMZW5ndGggPSBvdXRwdXQubGVuZ3RoO1xuXG5cdFx0Ly8gYGhhbmRsZWRDUENvdW50YCBpcyB0aGUgbnVtYmVyIG9mIGNvZGUgcG9pbnRzIHRoYXQgaGF2ZSBiZWVuIGhhbmRsZWQ7XG5cdFx0Ly8gYGJhc2ljTGVuZ3RoYCBpcyB0aGUgbnVtYmVyIG9mIGJhc2ljIGNvZGUgcG9pbnRzLlxuXG5cdFx0Ly8gRmluaXNoIHRoZSBiYXNpYyBzdHJpbmcgLSBpZiBpdCBpcyBub3QgZW1wdHkgLSB3aXRoIGEgZGVsaW1pdGVyXG5cdFx0aWYgKGJhc2ljTGVuZ3RoKSB7XG5cdFx0XHRvdXRwdXQucHVzaChkZWxpbWl0ZXIpO1xuXHRcdH1cblxuXHRcdC8vIE1haW4gZW5jb2RpbmcgbG9vcDpcblx0XHR3aGlsZSAoaGFuZGxlZENQQ291bnQgPCBpbnB1dExlbmd0aCkge1xuXG5cdFx0XHQvLyBBbGwgbm9uLWJhc2ljIGNvZGUgcG9pbnRzIDwgbiBoYXZlIGJlZW4gaGFuZGxlZCBhbHJlYWR5LiBGaW5kIHRoZSBuZXh0XG5cdFx0XHQvLyBsYXJnZXIgb25lOlxuXHRcdFx0Zm9yIChtID0gbWF4SW50LCBqID0gMDsgaiA8IGlucHV0TGVuZ3RoOyArK2opIHtcblx0XHRcdFx0Y3VycmVudFZhbHVlID0gaW5wdXRbal07XG5cdFx0XHRcdGlmIChjdXJyZW50VmFsdWUgPj0gbiAmJiBjdXJyZW50VmFsdWUgPCBtKSB7XG5cdFx0XHRcdFx0bSA9IGN1cnJlbnRWYWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBJbmNyZWFzZSBgZGVsdGFgIGVub3VnaCB0byBhZHZhbmNlIHRoZSBkZWNvZGVyJ3MgPG4saT4gc3RhdGUgdG8gPG0sMD4sXG5cdFx0XHQvLyBidXQgZ3VhcmQgYWdhaW5zdCBvdmVyZmxvd1xuXHRcdFx0aGFuZGxlZENQQ291bnRQbHVzT25lID0gaGFuZGxlZENQQ291bnQgKyAxO1xuXHRcdFx0aWYgKG0gLSBuID4gZmxvb3IoKG1heEludCAtIGRlbHRhKSAvIGhhbmRsZWRDUENvdW50UGx1c09uZSkpIHtcblx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHR9XG5cblx0XHRcdGRlbHRhICs9IChtIC0gbikgKiBoYW5kbGVkQ1BDb3VudFBsdXNPbmU7XG5cdFx0XHRuID0gbTtcblxuXHRcdFx0Zm9yIChqID0gMDsgaiA8IGlucHV0TGVuZ3RoOyArK2opIHtcblx0XHRcdFx0Y3VycmVudFZhbHVlID0gaW5wdXRbal07XG5cblx0XHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA8IG4gJiYgKytkZWx0YSA+IG1heEludCkge1xuXHRcdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA9PSBuKSB7XG5cdFx0XHRcdFx0Ly8gUmVwcmVzZW50IGRlbHRhIGFzIGEgZ2VuZXJhbGl6ZWQgdmFyaWFibGUtbGVuZ3RoIGludGVnZXJcblx0XHRcdFx0XHRmb3IgKHEgPSBkZWx0YSwgayA9IGJhc2U7IC8qIG5vIGNvbmRpdGlvbiAqLzsgayArPSBiYXNlKSB7XG5cdFx0XHRcdFx0XHR0ID0gayA8PSBiaWFzID8gdE1pbiA6IChrID49IGJpYXMgKyB0TWF4ID8gdE1heCA6IGsgLSBiaWFzKTtcblx0XHRcdFx0XHRcdGlmIChxIDwgdCkge1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHFNaW51c1QgPSBxIC0gdDtcblx0XHRcdFx0XHRcdGJhc2VNaW51c1QgPSBiYXNlIC0gdDtcblx0XHRcdFx0XHRcdG91dHB1dC5wdXNoKFxuXHRcdFx0XHRcdFx0XHRzdHJpbmdGcm9tQ2hhckNvZGUoZGlnaXRUb0Jhc2ljKHQgKyBxTWludXNUICUgYmFzZU1pbnVzVCwgMCkpXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0cSA9IGZsb29yKHFNaW51c1QgLyBiYXNlTWludXNUKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRvdXRwdXQucHVzaChzdHJpbmdGcm9tQ2hhckNvZGUoZGlnaXRUb0Jhc2ljKHEsIDApKSk7XG5cdFx0XHRcdFx0YmlhcyA9IGFkYXB0KGRlbHRhLCBoYW5kbGVkQ1BDb3VudFBsdXNPbmUsIGhhbmRsZWRDUENvdW50ID09IGJhc2ljTGVuZ3RoKTtcblx0XHRcdFx0XHRkZWx0YSA9IDA7XG5cdFx0XHRcdFx0KytoYW5kbGVkQ1BDb3VudDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQrK2RlbHRhO1xuXHRcdFx0KytuO1xuXG5cdFx0fVxuXHRcdHJldHVybiBvdXRwdXQuam9pbignJyk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBQdW55Y29kZSBzdHJpbmcgcmVwcmVzZW50aW5nIGEgZG9tYWluIG5hbWUgdG8gVW5pY29kZS4gT25seSB0aGVcblx0ICogUHVueWNvZGVkIHBhcnRzIG9mIHRoZSBkb21haW4gbmFtZSB3aWxsIGJlIGNvbnZlcnRlZCwgaS5lLiBpdCBkb2Vzbid0XG5cdCAqIG1hdHRlciBpZiB5b3UgY2FsbCBpdCBvbiBhIHN0cmluZyB0aGF0IGhhcyBhbHJlYWR5IGJlZW4gY29udmVydGVkIHRvXG5cdCAqIFVuaWNvZGUuXG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gZG9tYWluIFRoZSBQdW55Y29kZSBkb21haW4gbmFtZSB0byBjb252ZXJ0IHRvIFVuaWNvZGUuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBVbmljb2RlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnaXZlbiBQdW55Y29kZVxuXHQgKiBzdHJpbmcuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b1VuaWNvZGUoZG9tYWluKSB7XG5cdFx0cmV0dXJuIG1hcERvbWFpbihkb21haW4sIGZ1bmN0aW9uKHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHJlZ2V4UHVueWNvZGUudGVzdChzdHJpbmcpXG5cdFx0XHRcdD8gZGVjb2RlKHN0cmluZy5zbGljZSg0KS50b0xvd2VyQ2FzZSgpKVxuXHRcdFx0XHQ6IHN0cmluZztcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIFVuaWNvZGUgc3RyaW5nIHJlcHJlc2VudGluZyBhIGRvbWFpbiBuYW1lIHRvIFB1bnljb2RlLiBPbmx5IHRoZVxuXHQgKiBub24tQVNDSUkgcGFydHMgb2YgdGhlIGRvbWFpbiBuYW1lIHdpbGwgYmUgY29udmVydGVkLCBpLmUuIGl0IGRvZXNuJ3Rcblx0ICogbWF0dGVyIGlmIHlvdSBjYWxsIGl0IHdpdGggYSBkb21haW4gdGhhdCdzIGFscmVhZHkgaW4gQVNDSUkuXG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gZG9tYWluIFRoZSBkb21haW4gbmFtZSB0byBjb252ZXJ0LCBhcyBhIFVuaWNvZGUgc3RyaW5nLlxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgUHVueWNvZGUgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdpdmVuIGRvbWFpbiBuYW1lLlxuXHQgKi9cblx0ZnVuY3Rpb24gdG9BU0NJSShkb21haW4pIHtcblx0XHRyZXR1cm4gbWFwRG9tYWluKGRvbWFpbiwgZnVuY3Rpb24oc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gcmVnZXhOb25BU0NJSS50ZXN0KHN0cmluZylcblx0XHRcdFx0PyAneG4tLScgKyBlbmNvZGUoc3RyaW5nKVxuXHRcdFx0XHQ6IHN0cmluZztcblx0XHR9KTtcblx0fVxuXG5cdC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cdC8qKiBEZWZpbmUgdGhlIHB1YmxpYyBBUEkgKi9cblx0cHVueWNvZGUgPSB7XG5cdFx0LyoqXG5cdFx0ICogQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBjdXJyZW50IFB1bnljb2RlLmpzIHZlcnNpb24gbnVtYmVyLlxuXHRcdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHRcdCAqIEB0eXBlIFN0cmluZ1xuXHRcdCAqL1xuXHRcdCd2ZXJzaW9uJzogJzEuMi4zJyxcblx0XHQvKipcblx0XHQgKiBBbiBvYmplY3Qgb2YgbWV0aG9kcyB0byBjb252ZXJ0IGZyb20gSmF2YVNjcmlwdCdzIGludGVybmFsIGNoYXJhY3RlclxuXHRcdCAqIHJlcHJlc2VudGF0aW9uIChVQ1MtMikgdG8gVW5pY29kZSBjb2RlIHBvaW50cywgYW5kIGJhY2suXG5cdFx0ICogQHNlZSA8aHR0cDovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZz5cblx0XHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0XHQgKiBAdHlwZSBPYmplY3Rcblx0XHQgKi9cblx0XHQndWNzMic6IHtcblx0XHRcdCdkZWNvZGUnOiB1Y3MyZGVjb2RlLFxuXHRcdFx0J2VuY29kZSc6IHVjczJlbmNvZGVcblx0XHR9LFxuXHRcdCdkZWNvZGUnOiBkZWNvZGUsXG5cdFx0J2VuY29kZSc6IGVuY29kZSxcblx0XHQndG9BU0NJSSc6IHRvQVNDSUksXG5cdFx0J3RvVW5pY29kZSc6IHRvVW5pY29kZVxuXHR9O1xuXG5cdC8qKiBFeHBvc2UgYHB1bnljb2RlYCAqL1xuXHQvLyBTb21lIEFNRCBidWlsZCBvcHRpbWl6ZXJzLCBsaWtlIHIuanMsIGNoZWNrIGZvciBzcGVjaWZpYyBjb25kaXRpb24gcGF0dGVybnNcblx0Ly8gbGlrZSB0aGUgZm9sbG93aW5nOlxuXHRpZiAoXG5cdFx0dHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmXG5cdFx0dHlwZW9mIGRlZmluZS5hbWQgPT0gJ29iamVjdCcgJiZcblx0XHRkZWZpbmUuYW1kXG5cdCkge1xuXHRcdGRlZmluZShmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBwdW55Y29kZTtcblx0XHR9KTtcblx0fVx0ZWxzZSBpZiAoZnJlZUV4cG9ydHMgJiYgIWZyZWVFeHBvcnRzLm5vZGVUeXBlKSB7XG5cdFx0aWYgKGZyZWVNb2R1bGUpIHsgLy8gaW4gTm9kZS5qcyBvciBSaW5nb0pTIHYwLjguMCtcblx0XHRcdGZyZWVNb2R1bGUuZXhwb3J0cyA9IHB1bnljb2RlO1xuXHRcdH0gZWxzZSB7IC8vIGluIE5hcndoYWwgb3IgUmluZ29KUyB2MC43LjAtXG5cdFx0XHRmb3IgKGtleSBpbiBwdW55Y29kZSkge1xuXHRcdFx0XHRwdW55Y29kZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIChmcmVlRXhwb3J0c1trZXldID0gcHVueWNvZGVba2V5XSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2UgeyAvLyBpbiBSaGlubyBvciBhIHdlYiBicm93c2VyXG5cdFx0cm9vdC5wdW55Y29kZSA9IHB1bnljb2RlO1xuXHR9XG5cbn0odGhpcykpO1xuIiwiaW1wb3J0ICogYXMgU2hhcmVkVXRpbHMgZnJvbSAnLi4vdXRpbHMvU2hhcmVkVXRpbHMnO1xuXG5pbXBvcnQgKiBhcyBTZWFyY2hDbGllbnQgZnJvbSAnLi4vY2xpZW50cy9TZWFyY2hDbGllbnQnO1xuXG5leHBvcnQgY2xhc3MgRmlsdGVyQmFyQWN0b3Ige1xuICBjb25zdHJ1Y3RvcihmaWx0ZXJCYXJTdG9yZSwgdGFibGVTdG9yZSkge1xuICAgIHRoaXMuZmlsdGVyQmFyU3RvcmUgPSBmaWx0ZXJCYXJTdG9yZTtcbiAgICB0aGlzLnRhYmxlU3RvcmUgPSB0YWJsZVN0b3JlO1xuICB9XG5cbiAgZ2V0U2F2ZWRTZWFyY2hlcygpIHtcbiAgICByZXR1cm4gdGhpcy5maWx0ZXJCYXJTdG9yZS5nZXRTYXZlZFNlYXJjaGVzKCkgfHwgW107XG4gIH1cblxuICBnZXRGaWx0ZXIoZmlsdGVyVWlkKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyQmFyU3RvcmUuZ2V0RmlsdGVyKGZpbHRlclVpZCk7XG4gIH1cblxuICBlbmFibGVGaWx0ZXIoZmlsdGVyVWlkLCB2YWx1ZSkge1xuICAgIHRoaXMuZmlsdGVyQmFyU3RvcmUuZW5hYmxlRmlsdGVyKGZpbHRlclVpZCwgdmFsdWUpO1xuICB9XG5cbiAgZGlzYWJsZUZpbHRlcihmaWx0ZXJVaWQpIHtcbiAgICB0aGlzLmZpbHRlckJhclN0b3JlLmRpc2FibGVGaWx0ZXIoZmlsdGVyVWlkKTtcbiAgfVxuXG4gIGRpc2FibGVBbGxGaWx0ZXJzKCkge1xuICAgIHRoaXMuZmlsdGVyQmFyU3RvcmUuZGlzYWJsZUFsbEZpbHRlcnMoKTtcbiAgICB0aGlzLmFwcGx5RmlsdGVycygpO1xuICB9XG5cbiAgdXBkYXRlRmlsdGVyKGZpbHRlclVpZCwgcHJvcEtleSwgcHJvcFZhbHVlKSB7XG4gICAgdGhpcy5maWx0ZXJCYXJTdG9yZS51cGRhdGVGaWx0ZXIoZmlsdGVyVWlkLCBwcm9wS2V5LCBwcm9wVmFsdWUpO1xuICB9XG5cbiAgZ2V0RW5hYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5maWx0ZXJCYXJTdG9yZS5nZXRFbmFibGVkKCk7XG4gIH1cblxuICBnZXREaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5maWx0ZXJCYXJTdG9yZS5nZXREaXNhYmxlZCgpO1xuICB9XG5cbiAgYXBwbHlGaWx0ZXJzKCkge1xuICAgIHZhciB1cmwgPSB0aGlzLmZpbHRlckJhclN0b3JlLmdldFNlYXJjaFVybCgpO1xuICAgIHZhciBxdWVyeSA9IHRoaXMuZmlsdGVyQmFyU3RvcmUuZ2V0UXVlcnkoKTtcbiAgICB2YXIgcGFnZSA9IHRoaXMudGFibGVTdG9yZS5nZXRDdXJyZW50UGFnZSgpO1xuXG4gICAgU2VhcmNoQ2xpZW50LnNlYXJjaCh1cmwsIHF1ZXJ5LCBwYWdlLCB0aGlzLnRhYmxlU3RvcmUudXBkYXRlVGFibGUuYmluZCh0aGlzLnRhYmxlU3RvcmUpKTtcblxuICAgIGlmICh0aGlzLmZpbHRlckJhclN0b3JlLnBlcnNpc3RlbnQpIHtcbiAgICAgIFNoYXJlZFV0aWxzLnVwZGF0ZVVybCgncScsIHF1ZXJ5KTtcbiAgICB9XG4gIH1cblxuICBsb2FkU2F2ZWRTZWFyY2goc2VhcmNoSWQpIHtcbiAgICB0aGlzLmRpc2FibGVBbGxGaWx0ZXJzKCk7XG5cbiAgICB2YXIgdGltID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzYXZlZFNlYXJjaCA9IHRoaXMuZmlsdGVyQmFyU3RvcmUuZ2V0U2F2ZWRTZWFyY2goc2VhcmNoSWQpO1xuICAgICAgdmFyIGZpbHRlcnMgPSBKU09OLnBhcnNlKHNhdmVkU2VhcmNoLmNvbmZpZ3VyYXRpb24pO1xuXG4gICAgICBmb3IgKHZhciBmaWx0ZXIgaW4gZmlsdGVycykge1xuICAgICAgICB0aGlzLmVuYWJsZUZpbHRlcihmaWx0ZXIsIGZpbHRlcnNbZmlsdGVyXSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYXBwbHlGaWx0ZXJzKCk7XG4gICAgfS5iaW5kKHRoaXMpLCAxMDAwKTtcbiAgfVxuXG4gIHNhdmVGaWx0ZXJzKG5hbWUpIHtcbiAgICB2YXIgZW5hYmxlZEZpbHRlcnMgPSB0aGlzLmZpbHRlckJhclN0b3JlLmdldEVuYWJsZWQoKSxcbiAgICAgICAgc2F2ZWRGaWx0ZXJzUGFja2V0ID0ge307XG4gICAgc2F2ZWRGaWx0ZXJzUGFja2V0LnNlYXJjaF90aXRsZSA9IG5hbWU7XG4gICAgc2F2ZWRGaWx0ZXJzUGFja2V0LmZpbHRlcnMgPSB7fTtcbiAgICBmb3IgKHZhciBmaWx0ZXJVaWQgaW4gZW5hYmxlZEZpbHRlcnMpIHtcbiAgICAgIHNhdmVkRmlsdGVyc1BhY2tldC5maWx0ZXJzW2ZpbHRlclVpZF0gPSBlbmFibGVkRmlsdGVyc1tmaWx0ZXJVaWRdLnZhbHVlO1xuICAgIH1cbiAgICBTaGFyZWRVdGlscy5hamF4UG9zdCh0aGlzLmZpbHRlckJhclN0b3JlLmdldFNhdmVTZWFyY2hVcmwoKSwgJ2pzb24nLCBzYXZlZEZpbHRlcnNQYWNrZXQpO1xuICAgIHRoaXMuYXBwbHlGaWx0ZXJzKCk7XG4gIH1cblxuICBnZXRPcHRpb25zRnJvbVNlcnZlcihmaWx0ZXJVaWQpIHtcbiAgICB2YXIgZmlsdGVyID0gdGhpcy5nZXRGaWx0ZXIoZmlsdGVyVWlkKTtcblxuICAgIHZhciB1cmwgPSBmaWx0ZXIudXJsO1xuXG4gICAgU2hhcmVkVXRpbHMuYWpheEdldCh1cmwsICdqc29uJywgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgIHRoaXMudXBkYXRlRmlsdGVyKGZpbHRlclVpZCwgJ29wdGlvbnMnLCByZXNwb25zZSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfVxufVxuXG4iLCJpbXBvcnQgKiBhcyBTaGFyZWRVdGlscyBmcm9tICcuLi91dGlscy9TaGFyZWRVdGlscyc7XG5cbmV4cG9ydCBjbGFzcyBUYWJsZUFjdG9yIHtcbiAgY29uc3RydWN0b3IoZmlsdGVyQmFyU3RvcmUsIHRhYmxlU3RvcmUpIHtcbiAgICB0aGlzLmZpbHRlckJhclN0b3JlID0gZmlsdGVyQmFyU3RvcmU7XG4gICAgdGhpcy50YWJsZVN0b3JlID0gdGFibGVTdG9yZTtcbiAgfVxuXG4gIGdldENvbHVtbkhlYWRpbmdzKCkge1xuICAgIHJldHVybiB0aGlzLnRhYmxlU3RvcmUuZ2V0Q29sdW1uSGVhZGluZ3MoKTtcbiAgfVxuXG4gIGdldFJvd3MoKSB7XG4gICAgcmV0dXJuIHRoaXMudGFibGVTdG9yZS5nZXRSb3dzKCk7XG4gIH1cblxuICBnZXRDdXJyZW50UGFnZSgpIHtcbiAgICByZXR1cm4gdGhpcy50YWJsZVN0b3JlLmdldEN1cnJlbnRQYWdlKCk7XG4gIH1cblxuICBnZXRUb3RhbFBhZ2VzKCkge1xuICAgIHJldHVybiB0aGlzLnRhYmxlU3RvcmUuZ2V0VG90YWxQYWdlcygpO1xuICB9XG5cbiAgZmV0Y2hQYWdlZERhdGEocGFnZSkge1xuICAgIHZhciBpZCA9IHRoaXMudGFibGVTdG9yZS5nZXRJZCgpO1xuICAgIHZhciBjdXJyZW50VXJsID0gdGhpcy50YWJsZVN0b3JlLmdldFVybCgpO1xuICAgIHZhciBuZXdVcmwgPSBjdXJyZW50VXJsICsgJ3BhZ2U9JyArIHBhZ2UgKyAnJic7XG5cbiAgICBpZiAodGhpcy5maWx0ZXJCYXJTdG9yZS5wZXJzaXN0ZW50KSB7XG4gICAgICBTaGFyZWRVdGlscy51cGRhdGVVcmwoJ3BhZ2UnLCBwYWdlKTtcbiAgICB9XG5cbiAgICB0aGlzLnRhYmxlU3RvcmUuc2V0Q3VycmVudFBhZ2UocGFnZSk7XG4gICAgdGhpcy50YWJsZVN0b3JlLmZldGNoRGF0YSgpO1xuICB9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gdXBkYXRlRmlsdGVyT3B0aW9ucyhmaWx0ZXIpIHtcbiAgdmFyIHVybCA9IGZpbHRlci51cmw7XG5cbiAgJC5hamF4KHtcbiAgICB1cmw6IHVybCxcbiAgICB0eXBlOiBcIkdFVFwiLFxuICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBmaWx0ZXIub3B0aW9ucyA9IGRhdGE7XG4gICAgfSxcbiAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBzdGF0dXMsIGVycm9yKSB7XG4gICAgICBhbGVydChcIlNvbWV0aGluZyB3ZW50IHdyb25nLCBwbGVhc2UgY29udGFjdCBzdXBwb3J0XCIpO1xuICAgICAgY29uc29sZS5lcnJvcih4aHIpO1xuICAgICAgY29uc29sZS5lcnJvcihzdGF0dXMpO1xuICAgICAgY29uc29sZS5zdGF0dXMoZXJyb3IpO1xuICAgIH1cbiAgfSk7XG59XG4iLCJ2YXIgVVJJID0gcmVxdWlyZSgnVVJJanMnKTtcbndpbmRvdy5VUkkgPSBVUkk7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZWFyY2godXJsLCBxdWVyeSwgcGFnZSwgc3VjY2Vzcykge1xuICB2YXIgdXJsID0gVVJJKHVybClcbiAgICAuYWRkU2VhcmNoKCdxJywgcXVlcnkpXG4gICAgLmFkZFNlYXJjaCgncGFnZScsIHBhZ2UpO1xuXG5cbiAgJC5hamF4KHtcbiAgICB1cmw6IHVybCxcbiAgICB0eXBlOiBcIkdFVFwiLFxuICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBzdWNjZXNzKGRhdGEpO1xuICAgIH0sXG4gICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgc3RhdHVzLCBlcnJvcikge1xuICAgICAgYWxlcnQoXCJTb21ldGhpbmcgd2VudCB3cm9uZywgcGxlYXNlIGNvbnRhY3Qgc3VwcG9ydFwiKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoeGhyKTtcbiAgICAgIGNvbnNvbGUuZXJyb3Ioc3RhdHVzKTtcbiAgICAgIGNvbnNvbGUuc3RhdHVzKGVycm9yKTtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZVNlYXJjaCgpIHtcbiAgdmFyIHJlc3BvbnNlID0gJyc7XG5cbiAgcmV0dXJuIHJlc3BvbnNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2F2ZWRTZWFyY2hlcyh1cmwsIHN1Y2Nlc3MpIHtcbiAgJC5hamF4KHtcbiAgICB1cmw6IHVybCxcbiAgICB0eXBlOiBcIkdFVFwiLFxuICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBzdWNjZXNzKGRhdGEpO1xuICAgIH0sXG4gICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgc3RhdHVzLCBlcnJvcikge1xuICAgICAgYWxlcnQoXCJTb21ldGhpbmcgd2VudCB3cm9uZywgcGxlYXNlIGNvbnRhY3Qgc3VwcG9ydFwiKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoeGhyKTtcbiAgICAgIGNvbnNvbGUuZXJyb3Ioc3RhdHVzKTtcbiAgICAgIGNvbnNvbGUuc3RhdHVzKGVycm9yKTtcbiAgICB9XG4gIH0pO1xufVxuIiwiZXhwb3J0IGNsYXNzIEFwcGx5RmlsdGVyc0J1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG5cbiAgX29uQ2xpY2soKSB7XG4gICAgdGhpcy5wcm9wcy5maWx0ZXJCYXJBY3Rvci5hcHBseUZpbHRlcnMoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiBvbkNsaWNrPXt0aGlzLl9vbkNsaWNrLmJpbmQodGhpcyl9PlxuICAgICAgICA8aSBjbGFzc05hbWU9XCJpY29uIGljb24tdGlja1wiIC8+XG4gICAgICAgIEFwcGx5XG4gICAgICA8L2J1dHRvbj5cbiAgICApO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgQ2xlYXJGaWx0ZXJzQnV0dG9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gIH1cblxuICBfb25DbGljaygpIHtcbiAgICB0aGlzLnByb3BzLmZpbHRlckJhckFjdG9yLmRpc2FibGVBbGxGaWx0ZXJzKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi13YXJuaW5nXCIgb25DbGljaz17dGhpcy5fb25DbGljay5iaW5kKHRoaXMpfT5cbiAgICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uLWRlbGV0ZVwiIC8+XG4gICAgICAgIENsZWFyXG4gICAgICA8L2J1dHRvbj5cbiAgICApO1xuICB9XG59XG4iLCJpbXBvcnQge0ZpbHRlckxpc3R9IGZyb20gJy4vRmlsdGVyTGlzdC9GaWx0ZXJMaXN0LnJlYWN0JztcbmltcG9ydCB7RmlsdGVyRGlzcGxheX0gZnJvbSAnLi9GaWx0ZXJEaXNwbGF5L0ZpbHRlckRpc3BsYXkucmVhY3QnO1xuaW1wb3J0IHtBcHBseUZpbHRlcnNCdXR0b259IGZyb20gJy4vQXBwbHlGaWx0ZXJzQnV0dG9uLnJlYWN0JztcbmltcG9ydCB7Q2xlYXJGaWx0ZXJzQnV0dG9ufSBmcm9tICcuL0NsZWFyRmlsdGVyc0J1dHRvbi5yZWFjdCc7XG5pbXBvcnQge1NhdmVGaWx0ZXJzQnV0dG9ufSBmcm9tICcuL1NhdmVGaWx0ZXJzQnV0dG9uLnJlYWN0JztcbmltcG9ydCB7U2F2ZWRTZWFyY2hlc0xpc3R9IGZyb20gJy4vU2F2ZWRTZWFyY2hlc0xpc3QvU2F2ZWRTZWFyY2hlc0xpc3QucmVhY3QnO1xuXG5leHBvcnQgY2xhc3MgRmlsdGVyQmFyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLmZpbHRlckJhckFjdG9yID0gcHJvcHMuZmlsdGVyQmFyQWN0b3I7XG4gICAgdGhpcy5maWx0ZXJCYXJTdG9yZSA9IHByb3BzLmZpbHRlckJhclN0b3JlO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIG1hcmdpbi1ib3R0b20tc21cIj5cbiAgICAgICAgICAgIDxGaWx0ZXJMaXN0XG4gICAgICAgICAgICAgIGZpbHRlckJhckFjdG9yPXt0aGlzLmZpbHRlckJhckFjdG9yfVxuICAgICAgICAgICAgICBmaWx0ZXJCYXJTdG9yZT17dGhpcy5maWx0ZXJCYXJTdG9yZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgZGlzYWJsZWRcIj48aSBjbGFzc05hbWU9XCJpY29uIGljb24tZG93bmxvYWRcIj48L2k+RXhwb3J0IENTVjwvYnV0dG9uPlxuICAgICAgICAgICAgPEFwcGx5RmlsdGVyc0J1dHRvblxuICAgICAgICAgICAgICBmaWx0ZXJCYXJBY3Rvcj17dGhpcy5maWx0ZXJCYXJBY3Rvcn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8Q2xlYXJGaWx0ZXJzQnV0dG9uXG4gICAgICAgICAgICAgIGZpbHRlckJhckFjdG9yPXt0aGlzLmZpbHRlckJhckFjdG9yfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxTYXZlRmlsdGVyc0J1dHRvblxuICAgICAgICAgICAgICBmaWx0ZXJCYXJBY3Rvcj17dGhpcy5maWx0ZXJCYXJBY3Rvcn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8U2F2ZWRTZWFyY2hlc0xpc3RcbiAgICAgICAgICAgICAgZmlsdGVyQmFyQWN0b3I9e3RoaXMuZmlsdGVyQmFyQWN0b3J9XG4gICAgICAgICAgICAgIGZpbHRlckJhclN0b3JlPXt0aGlzLmZpbHRlckJhclN0b3JlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8RmlsdGVyRGlzcGxheVxuICAgICAgICAgICAgZmlsdGVyQmFyQWN0b3I9e3RoaXMuZmlsdGVyQmFyQWN0b3J9XG4gICAgICAgICAgICBmaWx0ZXJCYXJTdG9yZT17dGhpcy5maWx0ZXJCYXJTdG9yZX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiIsImltcG9ydCB7RmlsdGVySW5wdXR9IGZyb20gJy4vRmlsdGVySW5wdXQucmVhY3QnO1xuXG5leHBvcnQgY2xhc3MgRmlsdGVyRGlzcGxheSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuZmlsdGVyQmFyQWN0b3IgPSBwcm9wcy5maWx0ZXJCYXJBY3RvcjtcbiAgICB0aGlzLmZpbHRlckJhclN0b3JlID0gcHJvcHMuZmlsdGVyQmFyU3RvcmU7XG4gICAgdGhpcy5zdGF0ZSA9IHRoaXMuZ2V0U3RhdGVGcm9tU3RvcmVzKCk7XG5cbiAgICB0aGlzLmZpbHRlckJhclN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlLmJpbmQodGhpcykpO1xuICB9XG5cbiAgX29uQ2hhbmdlKCkge1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5nZXRTdGF0ZUZyb21TdG9yZXMoKSk7XG4gIH1cblxuICBnZXRTdGF0ZUZyb21TdG9yZXMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbHRlcnM6IHRoaXMuZmlsdGVyQmFyQWN0b3IuZ2V0RW5hYmxlZCgpXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHZhciBmaWx0ZXJzID0gT2JqZWN0LmtleXModGhpcy5zdGF0ZS5maWx0ZXJzKS5tYXAoZnVuY3Rpb24oZmlsdGVyVWlkKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RmlsdGVySW5wdXRcbiAgICAgICAgICBrZXk9e2ZpbHRlclVpZH1cbiAgICAgICAgICBmaWx0ZXJVaWQ9e2ZpbHRlclVpZH1cbiAgICAgICAgICBmaWx0ZXI9e3RoaXMuc3RhdGUuZmlsdGVyc1tmaWx0ZXJVaWRdfVxuICAgICAgICAgIGZpbHRlckJhckFjdG9yPXt0aGlzLmZpbHRlckJhckFjdG9yfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9LHRoaXMpO1xuXG4gICAgaWYgKGZpbHRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICBmaWx0ZXJzID0gKDxkaXY+Tm8gRmlsdGVycyBFbmFibGVkITwvZGl2Pik7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSduYXZiYXIgZmlsdGVyYmFyJz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3BhbmVsIHBhbmVsLWRlZmF1bHQnPlxuICAgICAgICAgIHtmaWx0ZXJzfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiIsImltcG9ydCB7VGV4dElucHV0fSBmcm9tICcuL0lucHV0cy9UZXh0SW5wdXQucmVhY3QnO1xuaW1wb3J0IHtEYXRlSW5wdXR9IGZyb20gJy4vSW5wdXRzL0RhdGVJbnB1dC5yZWFjdCc7XG5pbXBvcnQge1NlbGVjdElucHV0fSBmcm9tICcuL0lucHV0cy9TZWxlY3RJbnB1dC5yZWFjdCc7XG5cbmV4cG9ydCBjbGFzcyBGaWx0ZXJJbnB1dCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5maWx0ZXJCYXJBY3RvciA9IHByb3BzLmZpbHRlckJhckFjdG9yO1xuICAgIHRoaXMuZmlsdGVyVWlkID0gcHJvcHMuZmlsdGVyVWlkO1xuICB9XG5cbiAgX29uQ2xpY2soKSB7XG4gICAgdGhpcy5maWx0ZXJCYXJBY3Rvci5kaXNhYmxlRmlsdGVyKHRoaXMuZmlsdGVyVWlkKTtcbiAgfVxuXG4gIGlucHV0RmFjdG9yeSgpIHtcbiAgICB2YXIgdHlwZSA9IHRoaXMucHJvcHMuZmlsdGVyLnR5cGU7XG4gICAgaWYgKHR5cGUgPT0gJ3RleHQnIHx8IHR5cGUgPT0gJ2lkJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFRleHRJbnB1dFxuICAgICAgICAgIGZpbHRlckJhckFjdG9yPXt0aGlzLmZpbHRlckJhckFjdG9yfVxuICAgICAgICAgIGZpbHRlclVpZD17dGhpcy5maWx0ZXJVaWR9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnZGF0ZScpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEYXRlSW5wdXRcbiAgICAgICAgICBmaWx0ZXJCYXJBY3Rvcj17dGhpcy5maWx0ZXJCYXJBY3Rvcn1cbiAgICAgICAgICBmaWx0ZXJVaWQ9e3RoaXMucHJvcHMuZmlsdGVyVWlkfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ3NlbGVjdCcpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxTZWxlY3RJbnB1dFxuICAgICAgICAgIGZpbHRlckJhckFjdG9yPXt0aGlzLmZpbHRlckJhckFjdG9yfVxuICAgICAgICAgIGZpbHRlclVpZD17dGhpcy5wcm9wcy5maWx0ZXJVaWR9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnYWdlX3NlbGVjdCcpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxBZ2VTZWxlY3RJbnB1dFxuICAgICAgICAgIGZpbHRlckJhckFjdG9yPXt0aGlzLmZpbHRlckJhckFjdG9yfVxuICAgICAgICAgIGZpbHRlclVpZD17dGhpcy5wcm9wcy5maWx0ZXJVaWR9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldCFcIik7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHZhciBpbnB1dHMgPSB0aGlzLmlucHV0RmFjdG9yeSgpO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy0zIGNvbC1tZC00IGNvbC1zbS02IGNvbC14cy0xMiBmaWx0ZXJcIj5cbiAgICAgICAgPHVsIGNsYXNzTmFtZT17dGhpcy5maWx0ZXJLZXl9PlxuICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgIDxpIG9uQ2xpY2s9e3RoaXMuX29uQ2xpY2suYmluZCh0aGlzKX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1jaXJjbGUtcHJpbWFyeSBidG4teHMgaWNvbiBpY29uLWNsb3NlIHJlbW92ZS1maWx0ZXJcIiAvPlxuICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5maWx0ZXIubGFiZWx9XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgICAge2lucHV0c31cbiAgICAgICAgPC91bD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBEYXRlSW5wdXQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7IHZhbHVlOiB0aGlzLnByb3BzLmZpbHRlckJhckFjdG9yLmdldEZpbHRlcih0aGlzLnByb3BzLmZpbHRlclVpZCkudmFsdWUgfHwgeyBmcm9tOiBudWxsLCB0bzogbnVsbCB9IH07XG4gIH1cblxuICBfb25DaGFuZ2UoZXZlbnQpIHtcbiAgICB2YXIgbmV3VmFsdWUgPSB0aGlzLnN0YXRlLnZhbHVlO1xuXG4gICAgaWYoZXZlbnQudHlwZSA9PT0gJ2RwJykge1xuICAgICAgbmV3VmFsdWVbZXZlbnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykuZ2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicpXSA9IGV2ZW50LnRhcmdldC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLnZhbHVlO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQudHlwZSA9PT0gJ2lucHV0Jykge1xuICAgICAgbmV3VmFsdWVbZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInKV0gPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7dmFsdWU6IG5ld1ZhbHVlfSk7XG4gICAgdGhpcy5wcm9wcy5maWx0ZXJCYXJBY3Rvci51cGRhdGVGaWx0ZXIodGhpcy5wcm9wcy5maWx0ZXJVaWQsICd2YWx1ZScsIG5ld1ZhbHVlKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHZhciBkYXRlUGlja2VyRnJvbSA9ICQoUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmRhdGVSYW5nZUZyb20pKTtcbiAgICBkYXRlUGlja2VyRnJvbS5kYXRldGltZXBpY2tlcih7Zm9ybWF0OiAnREQtTU0tWVlZWSd9KTtcbiAgICBkYXRlUGlja2VyRnJvbS5kYXRldGltZXBpY2tlcigpLm9uKCdkcC5jaGFuZ2UnLHRoaXMuX29uQ2hhbmdlLmJpbmQodGhpcykpO1xuXG4gICAgdmFyIGRhdGVQaWNrZXJUbyA9ICQoUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmRhdGVSYW5nZVRvKSk7XG4gICAgZGF0ZVBpY2tlclRvLmRhdGV0aW1lcGlja2VyKHtmb3JtYXQ6ICdERC1NTS1ZWVlZJ30pO1xuICAgIGRhdGVQaWNrZXJUby5kYXRldGltZXBpY2tlcigpLm9uKCdkcC5jaGFuZ2UnLHRoaXMuX29uQ2hhbmdlLmJpbmQodGhpcykpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8bGk+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAgZGF0ZXBpY2tlciBkYXRlUmFuZ2VGcm9tXCIgcmVmPVwiZGF0ZVJhbmdlRnJvbVwiPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgIGRhdGEtZGF0ZS1mb3JtYXQ9XCJERC9NTS9ZWVlZXCJcbiAgICAgICAgICAgIGFyaWEtcmVxdWlyZWQ9XCJ0cnVlXCJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiZnJvbVwiXG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5fb25DaGFuZ2UuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlLmZyb219XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpbnB1dC1ncm91cC1hZGRvblwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbi1jYWxlbmRhciBpY29uXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzci1vbmx5IGljb24gaWNvbi1jYWxlbmRhclwiPlxuICAgICAgICAgICAgICBDYWxlbmRhclxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAgZGF0ZXBpY2tlciBkYXRlUmFuZ2VUb1wiIHJlZj1cImRhdGVSYW5nZVRvXCI+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgZGF0YS1kYXRlLWZvcm1hdD1cIkREL01NL1lZWVlcIlxuICAgICAgICAgICAgYXJpYS1yZXF1aXJlZD1cInRydWVcIlxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJ0b1wiXG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5fb25DaGFuZ2UuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlLnRvfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAtYWRkb25cIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24tY2FsZW5kYXIgaWNvblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3Itb25seSBpY29uIGljb24tY2FsZW5kYXJcIj5cbiAgICAgICAgICAgICAgQ2FsZW5kYXJcbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9saT5cbiAgICApO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgU2VsZWN0SW5wdXQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHZhciBmaWx0ZXIgPSBwcm9wcy5maWx0ZXJCYXJBY3Rvci5nZXRGaWx0ZXIocHJvcHMuZmlsdGVyVWlkKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7IHZhbHVlOiAoZmlsdGVyLnZhbHVlIHx8IGZpbHRlci5vcHRpb25zWzBdLnZhbHVlKSB9O1xuICAgIHRoaXMucHJvcHMuZmlsdGVyQmFyQWN0b3IudXBkYXRlRmlsdGVyKHRoaXMucHJvcHMuZmlsdGVyVWlkLCAndmFsdWUnLCB0aGlzLnN0YXRlLnZhbHVlKTtcbiAgfVxuXG4gIF9vbkNoYW5nZShldmVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe3ZhbHVlOiBldmVudC50YXJnZXQudmFsdWV9KTtcbiAgICB0aGlzLnByb3BzLmZpbHRlckJhckFjdG9yLnVwZGF0ZUZpbHRlcih0aGlzLnByb3BzLmZpbHRlclVpZCwgJ3ZhbHVlJywgZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMucHJvcHMuZmlsdGVyQmFyQWN0b3IuZ2V0RmlsdGVyKHRoaXMucHJvcHMuZmlsdGVyVWlkKS5vcHRpb25zIHx8IFtdO1xuXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMubWFwKGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPG9wdGlvbiB2YWx1ZT17b3B0aW9uLnZhbHVlfT57b3B0aW9uLmxhYmVsfTwvb3B0aW9uPlxuICAgICAgKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8bGk+XG4gICAgICAgIDxzZWxlY3RcbiAgICAgICAgICBjbGFzc05hbWU9J2Zvcm0tY29udHJvbCdcbiAgICAgICAgICBzZWxlY3RlZD17dGhpcy5zdGF0ZS52YWx1ZX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5fb25DaGFuZ2UuYmluZCh0aGlzKX1cbiAgICAgICAgPlxuICAgICAgICAgIHtvcHRpb25zfVxuICAgICAgICA8L3NlbGVjdD5cbiAgICAgIDwvbGk+XG4gICAgKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFRleHRJbnB1dCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuZmlsdGVyQmFyQWN0b3IgPSBwcm9wcy5maWx0ZXJCYXJBY3RvcjtcbiAgICB0aGlzLmZpbHRlclVpZCA9IHByb3BzLmZpbHRlclVpZDtcblxuICAgIHRoaXMuc3RhdGUgPSB7dmFsdWU6IHRoaXMuZmlsdGVyQmFyQWN0b3IuZ2V0RmlsdGVyKHRoaXMuZmlsdGVyVWlkKS52YWx1ZX07XG4gIH1cblxuICBfb25DaGFuZ2UoZXZlbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHt2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlfSk7XG4gICAgdGhpcy5maWx0ZXJCYXJBY3Rvci51cGRhdGVGaWx0ZXIodGhpcy5maWx0ZXJVaWQsICd2YWx1ZScsIGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxsaT5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUudmFsdWV9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuX29uQ2hhbmdlLmJpbmQodGhpcyl9XG4gICAgICAgIC8+XG4gICAgICA8L2xpPlxuICAgICk7XG4gIH1cbn1cbiIsImltcG9ydCB7RmlsdGVyTGlzdE9wdGlvbn0gZnJvbSAnLi9GaWx0ZXJMaXN0T3B0aW9uLnJlYWN0JztcblxuZXhwb3J0IGNsYXNzIEZpbHRlckxpc3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmZpbHRlckJhckFjdG9yID0gcHJvcHMuZmlsdGVyQmFyQWN0b3I7XG4gICAgdGhpcy5maWx0ZXJCYXJTdG9yZSA9IHByb3BzLmZpbHRlckJhclN0b3JlO1xuXG4gICAgdGhpcy5maWx0ZXJCYXJTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLnN0YXRlID0gdGhpcy5nZXRTdGF0ZUZyb21TdG9yZXMoKTtcbiAgfVxuXG4gIF9vbkNoYW5nZSgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0U3RhdGVGcm9tU3RvcmVzKCkpO1xuICB9XG5cbiAgZ2V0U3RhdGVGcm9tU3RvcmVzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBmaWx0ZXJzOiB0aGlzLmZpbHRlckJhckFjdG9yLmdldERpc2FibGVkKClcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdmFyIGZpbHRlciA9IHt9O1xuICAgIHZhciBvcHRpb25LZXkgPSBcIlwiO1xuICAgIHZhciBmaWx0ZXJPcHRpb25zID0gT2JqZWN0LmtleXModGhpcy5zdGF0ZS5maWx0ZXJzKS5tYXAoZnVuY3Rpb24oZmlsdGVyVWlkKSB7XG4gICAgICBvcHRpb25LZXkgPSBcIm9wdGlvbi1cIitmaWx0ZXJVaWQ7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RmlsdGVyTGlzdE9wdGlvblxuICAgICAgICAgIGtleT17b3B0aW9uS2V5fVxuICAgICAgICAgIGZpbHRlclVpZD17ZmlsdGVyVWlkfVxuICAgICAgICAgIGZpbHRlckJhckFjdG9yPXt0aGlzLmZpbHRlckJhckFjdG9yfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9LHRoaXMpO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cFwiPlxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgdHlwZT1cImJ1dHRvblwiPlxuICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImljb24gaWNvbi1hZGRcIiAvPlxuICAgICAgICAgIEFkZCBGaWx0ZXJcbiAgICAgICAgICA8aSBjbGFzc05hbWU9XCJpY29uIGljb24tY2hldnJvbi1kb3duXCIgLz5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDx1bCBjbGFzc05hbWU9XCJkcm9wZG93bi1tZW51XCIgcm9sZT1cIm1lbnVcIj5cbiAgICAgICAgICB7ZmlsdGVyT3B0aW9uc31cbiAgICAgICAgPC91bD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBGaWx0ZXJMaXN0T3B0aW9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5maWx0ZXJCYXJBY3RvciA9IHByb3BzLmZpbHRlckJhckFjdG9yO1xuICAgIHRoaXMuZmlsdGVyVWlkID0gcHJvcHMuZmlsdGVyVWlkO1xuICB9XG5cbiAgX29uQ2xpY2soKSB7XG4gICAgdGhpcy5maWx0ZXJCYXJBY3Rvci5lbmFibGVGaWx0ZXIodGhpcy5maWx0ZXJVaWQpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8bGk+XG4gICAgICAgIDxhIG9uQ2xpY2s9e3RoaXMuX29uQ2xpY2suYmluZCh0aGlzKX0+XG4gICAgICAgICAge3RoaXMuZmlsdGVyQmFyQWN0b3IuZ2V0RmlsdGVyKHRoaXMuZmlsdGVyVWlkKS5sYWJlbH1cbiAgICAgICAgPC9hPlxuICAgICAgPC9saT5cbiAgICApO1xuICB9XG59IiwiZXhwb3J0IGNsYXNzIFNhdmVGaWx0ZXJzQnV0dG9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtjb25maWd1cmF0aW9uTmFtZTogJyd9O1xuICB9XG5cbiAgX29uQ2xpY2soKSB7XG4gICAgdGhpcy5wcm9wcy5maWx0ZXJCYXJBY3Rvci5zYXZlRmlsdGVycyh0aGlzLnN0YXRlLmNvbmZpZ3VyYXRpb25OYW1lKTtcbiAgfVxuXG4gIF9vbkNoYW5nZShldmVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2NvbmZpZ3VyYXRpb25OYW1lOiBldmVudC50YXJnZXQudmFsdWV9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFJlYWN0Qm9vdHN0cmFwLkRyb3Bkb3duQnV0dG9uIHRpdGxlPVwiU2F2ZSBTZWFyY2hcIiB0eXBlPVwiYnV0dG9uXCIgYnNTdHlsZT1cImRlZmF1bHRcIiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgbWFyZ2luLWJvdHRvbS1zbVwiPlxuICAgICAgICA8UmVhY3RCb290c3RyYXAuTWVudUl0ZW0gZXZlbnRLZXk9XCIxXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgICAgICA8bGFiZWw+U2VhcmNoIFRpdGxlPC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiB2YWx1ZT17dGhpcy5zdGF0ZS5jb25maWd1cmF0aW9uTmFtZX0gdHlwZT1cInRleHRcIiBvbkNoYW5nZT17dGhpcy5fb25DaGFuZ2UuYmluZCh0aGlzKX0gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXt0aGlzLl9vbkNsaWNrLmJpbmQodGhpcyl9PlNhdmU8L2J1dHRvbj5cbiAgICAgICAgPC9SZWFjdEJvb3RzdHJhcC5NZW51SXRlbT5cbiAgICAgIDwvUmVhY3RCb290c3RyYXAuRHJvcGRvd25CdXR0b24+XG4gICAgKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtTYXZlZFNlYXJjaGVzTGlzdEl0ZW19IGZyb20gJy4vU2F2ZWRTZWFyY2hlc0xpc3RJdGVtLnJlYWN0JztcblxuZXhwb3J0IGNsYXNzIFNhdmVkU2VhcmNoZXNMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0gdGhpcy5nZXRTdGF0ZUZyb21TdG9yZXMoKTtcbiAgICB0aGlzLnByb3BzLmZpbHRlckJhclN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlLmJpbmQodGhpcykpO1xuICB9XG5cbiAgZ2V0U3RhdGVGcm9tU3RvcmVzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzYXZlZFNlYXJjaGVzOiB0aGlzLnByb3BzLmZpbHRlckJhclN0b3JlLmdldFNhdmVkU2VhcmNoZXMoKVxuICAgIH07XG4gIH1cblxuICBfb25DaGFuZ2UoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldFN0YXRlRnJvbVN0b3JlcygpKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICB2YXIgYnV0dG9uQ2xhc3MgPSAnYnRuIGJ0bi1kZWZhdWx0IGRyb3Bkb3duLXRvZ2dsZSc7XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5zYXZlZFNlYXJjaGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgYnV0dG9uQ2xhc3MgKz0gJyBkaXNhYmxlZCc7XG4gICAgfVxuXG4gICAgdmFyIHNhdmVkU2VhcmNoZXMgPSB0aGlzLnN0YXRlLnNhdmVkU2VhcmNoZXMubWFwKGZ1bmN0aW9uKHNhdmVkU2VhcmNoLCBpbmRleCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFNhdmVkU2VhcmNoZXNMaXN0SXRlbVxuICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgc2VhcmNoSWQ9e2luZGV4fVxuICAgICAgICAgIG5hbWU9e3NhdmVkU2VhcmNoLm5hbWV9XG4gICAgICAgICAgZmlsdGVyQmFyQWN0b3I9e3RoaXMucHJvcHMuZmlsdGVyQmFyQWN0b3J9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIG1hcmdpbi1ib3R0b20tc21cIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXBcIj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT17YnV0dG9uQ2xhc3N9IGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+XG4gICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJpY29uIGljb24tc2F2ZVwiIC8+XG4gICAgICAgICAgICBTYXZlZCBTZWFyY2hlc1xuICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uLWNoZXZyb24tZG93blwiIC8+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImRyb3Bkb3duLW1lbnVcIiByb2xlPVwibWVudVwiPlxuICAgICAgICAgICAge3NhdmVkU2VhcmNoZXN9XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGFuZ2VyXCI+XG4gICAgICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uLWRlbGV0ZVwiIC8+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFNhdmVkU2VhcmNoZXNMaXN0SXRlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG5cbiAgX29uQ2xpY2soKSB7XG4gICAgdGhpcy5wcm9wcy5maWx0ZXJCYXJBY3Rvci5sb2FkU2F2ZWRTZWFyY2godGhpcy5wcm9wcy5zZWFyY2hJZCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuKFxuICAgICAgPGxpPlxuICAgICAgICA8YSBjbGFzc05hbWU9XCJkeW5hbWljLXRleHQtZmlsdGVyXCIgb25DbGljaz17dGhpcy5fb25DbGljay5iaW5kKHRoaXMpfT5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5uYW1lfVxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPlxuICAgICk7XG4gIH1cbn1cbiIsImltcG9ydCB7U2F2ZWRTZWFyY2hTdG9yZX0gZnJvbSAnLi4vc3RvcmVzL1NhdmVkU2VhcmNoU3RvcmUnO1xuXG5pbXBvcnQge0ZpbHRlckJhckFjdG9yfSBmcm9tICcuLi9hY3RvcnMvRmlsdGVyQmFyQWN0b3InO1xuaW1wb3J0IHtUYWJsZUFjdG9yfSBmcm9tICcuLi9hY3RvcnMvVGFibGVBY3Rvcic7XG5cbmltcG9ydCB7RmlsdGVyQmFyU3RvcmV9IGZyb20gJy4uL3N0b3Jlcy9GaWx0ZXJCYXJTdG9yZSc7XG5pbXBvcnQge1RhYmxlU3RvcmV9IGZyb20gJy4uL3N0b3Jlcy9UYWJsZVN0b3JlJztcblxuaW1wb3J0IHtGaWx0ZXJCYXJ9IGZyb20gJy4vRmlsdGVyQmFyL0ZpbHRlckJhci5yZWFjdCc7XG5pbXBvcnQge1RhYmxlfSAgZnJvbSAnLi9UYWJsZS9UYWJsZS5yZWFjdCc7XG5cbmV4cG9ydCBjbGFzcyBGaWx0ZXJhYmxlVGFibGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmlkID0gcHJvcHMuZmlsdGVyYWJsZVRhYmxlSWQ7XG5cbiAgICB0aGlzLmZpbHRlckJhclN0b3JlID0gbmV3IEZpbHRlckJhclN0b3JlKHByb3BzLmZpbHRlcmJhcik7XG4gICAgdGhpcy50YWJsZVN0b3JlID0gbmV3IFRhYmxlU3RvcmUocHJvcHMudGFibGUpO1xuXG4gICAgdGhpcy50YWJsZUFjdG9yID0gbmV3IFRhYmxlQWN0b3IodGhpcy5maWx0ZXJCYXJTdG9yZSwgdGhpcy50YWJsZVN0b3JlKTtcbiAgICB0aGlzLmZpbHRlckJhckFjdG9yID0gbmV3IEZpbHRlckJhckFjdG9yKHRoaXMuZmlsdGVyQmFyU3RvcmUsIHRoaXMudGFibGVTdG9yZSk7XG5cbiAgICB0aGlzLnNhdmVkU2VhcmNoU3RvcmUgPSBuZXcgU2F2ZWRTZWFyY2hTdG9yZSgpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGtleT17dGhpcy5pZH0+XG4gICAgICAgIDxGaWx0ZXJCYXJcbiAgICAgICAgICBmaWx0ZXJCYXJBY3Rvcj17dGhpcy5maWx0ZXJCYXJBY3Rvcn1cbiAgICAgICAgICBmaWx0ZXJCYXJTdG9yZT17dGhpcy5maWx0ZXJCYXJTdG9yZX1cbiAgICAgICAgLz5cbiAgICAgICAgPFRhYmxlXG4gICAgICAgICAgdGFibGVBY3Rvcj17dGhpcy50YWJsZUFjdG9yfVxuICAgICAgICAgIHRhYmxlU3RvcmU9e3RoaXMudGFibGVTdG9yZX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiIsImltcG9ydCB7VGFibGVIZWFkaW5nQ2VsbH0gZnJvbSAnLi9UYWJsZUhlYWRpbmdDZWxsLnJlYWN0JztcblxuZXhwb3J0IGNsYXNzIFRhYmxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnRhYmxlQWN0b3IgPSBwcm9wcy50YWJsZUFjdG9yO1xuICAgIHRoaXMudGFibGVTdG9yZSA9IHByb3BzLnRhYmxlU3RvcmU7XG5cbiAgICB0aGlzLnN0YXRlID0gdGhpcy5nZXRTdGF0ZUZyb21TdG9yZXMoKTtcbiAgICB0aGlzLnRhYmxlU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UuYmluZCh0aGlzKSk7XG4gIH1cblxuICBfb25DaGFuZ2UoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldFN0YXRlRnJvbVN0b3JlcygpKTtcbiAgfVxuXG4gIF9vbkNsaWNrKGV2ZW50KSB7XG4gICAgdGhpcy50YWJsZUFjdG9yLmZldGNoUGFnZWREYXRhKGV2ZW50LnRhcmdldC5pbm5lckhUTUwpO1xuICB9XG5cbiAgZ2V0U3RhdGVGcm9tU3RvcmVzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb2x1bW5IZWFkaW5nczogdGhpcy50YWJsZUFjdG9yLmdldENvbHVtbkhlYWRpbmdzKCksXG4gICAgICByb3dzOiB0aGlzLnRhYmxlU3RvcmUuZ2V0Um93cygpLFxuICAgICAgY3VycmVudFBhZ2U6IHRoaXMudGFibGVBY3Rvci5nZXRDdXJyZW50UGFnZSgpLFxuICAgICAgdG90YWxQYWdlczogdGhpcy50YWJsZUFjdG9yLmdldFRvdGFsUGFnZXMoKVxuICAgIH07XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdmFyIGNvbHVtbnMgPSBPYmplY3Qua2V5cyh0aGlzLnN0YXRlLmNvbHVtbkhlYWRpbmdzKS5tYXAoZnVuY3Rpb24oY29sdW1uSWQpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxUYWJsZUhlYWRpbmdDZWxsIGtleT17Y29sdW1uSWR9IGhlYWRpbmc9e3RoaXMuc3RhdGUuY29sdW1uSGVhZGluZ3NbY29sdW1uSWRdLmhlYWRpbmd9IC8+XG4gICAgICApO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgaWYgKHRoaXMuc3RhdGUudG90YWxQYWdlcyA+IDEpIHtcbiAgICAgIHZhciBwYWdlcyA9IEFycmF5LmFwcGx5KFxuICAgICAgICBudWxsLFxuICAgICAgICBBcnJheSh0aGlzLnN0YXRlLnRvdGFsUGFnZXMpXG4gICAgICApLm1hcChcbiAgICAgICAgZnVuY3Rpb24oXywgaSkge1xuICAgICAgICAgIHJldHVybiBpICsgMTtcbiAgICAgICAgfVxuICAgICAgKTtcblxuICAgICAgdmFyIHBhZ2luYXRpb24gPSBwYWdlcy5tYXAoZnVuY3Rpb24ocGFnZU51bWJlcikge1xuICAgICAgICB2YXIgY2xhc3NlcyA9ICcnO1xuICAgICAgICBpZiAocGFnZU51bWJlciA9PT0gdGhpcy5zdGF0ZS5jdXJyZW50UGFnZSkge1xuICAgICAgICAgIGNsYXNzZXMgPSAnYWN0aXZlJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxsaSBrZXk9e3BhZ2VOdW1iZXJ9IGNsYXNzTmFtZT17Y2xhc3Nlc30+XG4gICAgICAgICAgICA8YSBvbkNsaWNrPXt0aGlzLl9vbkNsaWNrLmJpbmQodGhpcyl9PntwYWdlTnVtYmVyfTwvYT5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICApO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuXG4gICAgdmFyIHJvd3MgPSB0aGlzLnN0YXRlLnJvd3MubWFwKGZ1bmN0aW9uKHJvdykge1xuICAgICAgdmFyIGNvbHVtbnMgPSBPYmplY3Qua2V5cyhyb3cpLm1hcChcbiAgICAgICAgZnVuY3Rpb24oY29sdW1uSWQpIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICB7cm93W2NvbHVtbklkXX1cbiAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDx0cj5cbiAgICAgICAgICB7Y29sdW1uc31cbiAgICAgICAgPC90cj5cbiAgICAgICk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9J3BhbmVsIHBhbmVsLXJlc3BvbnNpdmUnPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ndGFibGUtcmVzcG9uc2l2ZSc+XG4gICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT0ndGFibGUgdGFibGUtaG92ZXIgdGFibGUtc3RyaXBlZCc+XG4gICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICB7Y29sdW1uc31cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgIHtyb3dzfVxuICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgIDxuYXY+XG4gICAgICAgICAgICA8dWwgY2xhc3NOYW1lPSdwYWdpbmF0aW9uJz5cbiAgICAgICAgICAgICAge3BhZ2luYXRpb259XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgIDwvbmF2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBUYWJsZUhlYWRpbmdDZWxsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5oZWFkaW5nID0gcHJvcHMuaGVhZGluZztcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHRoPlxuICAgICAgICB7dGhpcy5oZWFkaW5nfVxuICAgICAgPC90aD5cbiAgICApO1xuICB9XG59XG4iLCJ2YXIgdXJpID0gcmVxdWlyZSgnVVJJanMnKTtcblxuZXhwb3J0IGZ1bmN0aW9uIENvbmZpZ3VyYXRpb25GYWN0b3J5KHNvdXJjZVR5cGUsIHJhd0NvbmZpZ3VyYXRpb24pIHtcbiAgdmFyIGNvbmZpZ3VyYXRpb24gPSB7XG4gICAgZmlsdGVyQmFyQ29uZmlndXJhdGlvbjoge30sXG4gICAgdGFibGVDb25maWd1cmF0aW9uOiB7fVxuICB9O1xuXG4gIGlmIChzb3VyY2VUeXBlID09PSAnaHRtbCcpIHtcbiAgICB2YXIgcmF3RmlsdGVyQmFyQ29uZmlndXJhdGlvbiA9IHJhd0NvbmZpZ3VyYXRpb24ucXVlcnlTZWxlY3RvcignZGwuZmlsdGVyQmFyQ29uZmlndXJhdGlvbicpLFxuICAgICAgICByYXdGaWx0ZXIsXG4gICAgICAgIHJhd0ZpbHRlcnMsXG4gICAgICAgIHBhcnNlZEZpbHRlcnMgPSB7fSxcbiAgICAgICAgcmF3VGFibGVDb25maWd1cmF0aW9uID0gcmF3Q29uZmlndXJhdGlvbi5xdWVyeVNlbGVjdG9yKCdkbC50YWJsZUNvbmZpZ3VyYXRpb24nKSxcbiAgICAgICAgcmF3Q29sdW1uLFxuICAgICAgICByYXdDb2x1bW5zLFxuICAgICAgICBwYXJzZWRDb2x1bW5zID0ge307XG5cbiAgICByYXdGaWx0ZXJzID0gcmF3RmlsdGVyQmFyQ29uZmlndXJhdGlvbi5xdWVyeVNlbGVjdG9yKFwiZGwuZmlsdGVyc1wiKS5xdWVyeVNlbGVjdG9yQWxsKFwiZHQuZmlsdGVyXCIpO1xuXG4gICAgZm9yICh2YXIgZmlsdGVySW5kZXggPSAwOyBmaWx0ZXJJbmRleCA8IHJhd0ZpbHRlcnMubGVuZ3RoOyBmaWx0ZXJJbmRleCsrKSB7XG4gICAgICByYXdGaWx0ZXIgPSByYXdGaWx0ZXJzW2ZpbHRlckluZGV4XTtcbiAgICAgIHBhcnNlZEZpbHRlcnNbcmF3RmlsdGVyLmdldEF0dHJpYnV0ZShcImRhdGEtdWlkXCIpXSA9IHtcbiAgICAgICAgbGFiZWw6IHJhd0ZpbHRlci5nZXRBdHRyaWJ1dGUoXCJkYXRhLWxhYmVsXCIpLFxuICAgICAgICB0eXBlOiByYXdGaWx0ZXIuZ2V0QXR0cmlidXRlKFwiZGF0YS10eXBlXCIpLFxuICAgICAgICBmaWVsZDogcmF3RmlsdGVyLmdldEF0dHJpYnV0ZShcImRhdGEtZmllbGRcIiksXG4gICAgICAgIHVybDogcmF3RmlsdGVyLmdldEF0dHJpYnV0ZShcImRhdGEtdXJsXCIpLFxuICAgICAgICB2YWx1ZTogXCJcIixcbiAgICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICAgIH07XG4gICAgfVxuXG4gICAgY29uZmlndXJhdGlvbi5maWx0ZXJCYXJDb25maWd1cmF0aW9uLnBlcnNpc3RlbnQgPSByYXdGaWx0ZXJCYXJDb25maWd1cmF0aW9uLnF1ZXJ5U2VsZWN0b3IoXCJkdC5wZXJzaXN0ZW50XCIpLmdldEF0dHJpYnV0ZShcImRhdGEtcGVyc2lzdGVudFwiKTtcbiAgICBjb25maWd1cmF0aW9uLmZpbHRlckJhckNvbmZpZ3VyYXRpb24uc2VhcmNoVXJsID0gcmF3RmlsdGVyQmFyQ29uZmlndXJhdGlvbi5xdWVyeVNlbGVjdG9yKFwiZHQuc2VhcmNoLXVybFwiKS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXVybFwiKTtcbiAgICBjb25maWd1cmF0aW9uLmZpbHRlckJhckNvbmZpZ3VyYXRpb24uc2F2ZVNlYXJjaFVybCA9IHJhd0ZpbHRlckJhckNvbmZpZ3VyYXRpb24ucXVlcnlTZWxlY3RvcihcImR0LnNhdmUtc2VhcmNoLXVybFwiKS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXVybFwiKTtcbiAgICBjb25maWd1cmF0aW9uLmZpbHRlckJhckNvbmZpZ3VyYXRpb24uc2F2ZWRTZWFyY2hVcmwgPSByYXdGaWx0ZXJCYXJDb25maWd1cmF0aW9uLnF1ZXJ5U2VsZWN0b3IoXCJkdC5zYXZlZC1zZWFyY2gtdXJsXCIpLmdldEF0dHJpYnV0ZShcImRhdGEtdXJsXCIpO1xuICAgIGNvbmZpZ3VyYXRpb24uZmlsdGVyQmFyQ29uZmlndXJhdGlvbi5leHBvcnRSZXN1bHRzVXJsID0gcmF3RmlsdGVyQmFyQ29uZmlndXJhdGlvbi5xdWVyeVNlbGVjdG9yKFwiZHQuZXhwb3J0LXJlc3VsdHMtdXJsXCIpLmdldEF0dHJpYnV0ZShcImRhdGEtdXJsXCIpO1xuICAgIGNvbmZpZ3VyYXRpb24uZmlsdGVyQmFyQ29uZmlndXJhdGlvbi5maWx0ZXJzID0gcGFyc2VkRmlsdGVycztcblxuICAgIHJhd0NvbHVtbnMgPSByYXdUYWJsZUNvbmZpZ3VyYXRpb24ucXVlcnlTZWxlY3RvcihcImRsLmNvbHVtbnNcIikucXVlcnlTZWxlY3RvckFsbChcImR0LmNvbHVtblwiKTtcblxuICAgIGZvciAodmFyIHRhYmxlSW5kZXggPSAwOyB0YWJsZUluZGV4IDwgcmF3Q29sdW1ucy5sZW5ndGg7IHRhYmxlSW5kZXgrKykge1xuICAgICAgcmF3Q29sdW1uID0gcmF3Q29sdW1uc1t0YWJsZUluZGV4XTtcbiAgICAgIHBhcnNlZENvbHVtbnNbcmF3Q29sdW1uLmdldEF0dHJpYnV0ZShcImRhdGEtZmllbGRcIildID0ge1xuICAgICAgICBoZWFkaW5nOiByYXdDb2x1bW4uZ2V0QXR0cmlidXRlKFwiZGF0YS1oZWFkaW5nXCIpLFxuICAgICAgICB0eXBlOiByYXdDb2x1bW4uZ2V0QXR0cmlidXRlKFwiZGF0YS10eXBlXCIpXG4gICAgICB9O1xuICAgIH1cblxuICAgIGNvbmZpZ3VyYXRpb24udGFibGVDb25maWd1cmF0aW9uLmRhdGFVcmwgPSByYXdUYWJsZUNvbmZpZ3VyYXRpb24ucXVlcnlTZWxlY3RvcihcImR0LmRhdGEtdXJsXCIpLmdldEF0dHJpYnV0ZShcImRhdGEtdXJsXCIpO1xuICAgIGNvbmZpZ3VyYXRpb24udGFibGVDb25maWd1cmF0aW9uLmNvbHVtbnMgPSBwYXJzZWRDb2x1bW5zO1xuXG4gIH0gZWxzZSBpZiAoc291cmNlVHlwZSA9PT0gJ3VybCcpIHtcbiAgICB2YXIgdXJsID0gdXJpKHdpbmRvdy5sb2NhdGlvbi5ocmVmKSxcbiAgICAgICAgcXVlcnkgPSB1cmwucXVlcnkodHJ1ZSk7XG5cbiAgICBpZiAoIXVybC5xdWVyeSgpKSB7XG4gICAgICBpZiAobG9jYWxTdG9yYWdlW3dpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC8vZywgJycpXSkge1xuICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSh7fSwgXCJcIiwgbG9jYWxTdG9yYWdlW3dpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC8vZywgJycpXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghdXJsLmhhc1F1ZXJ5KCdxJykpIHtcbiAgICAgICAgdXJsLmFkZFF1ZXJ5KCdxJywgJycpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXVybC5oYXNRdWVyeSgncGFnZScpKSB7XG4gICAgICAgIHVybC5hZGRRdWVyeSgncGFnZScsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbmZpZ3VyYXRpb24udGFibGVDb25maWd1cmF0aW9uLmRhdGFVcmwgPSB1cmwucGF0aG5hbWUoKSArIHVybC5zZWFyY2goKTtcbiAgICBjb25maWd1cmF0aW9uLnRhYmxlQ29uZmlndXJhdGlvbi5wYWdlID0gdXJsLnF1ZXJ5KHRydWUpLnBhZ2U7XG5cbiAgICBjb25maWd1cmF0aW9uLmZpbHRlckJhckNvbmZpZ3VyYXRpb24uZmlsdGVycyA9IHt9O1xuXG4gICAgaWYgKHVybC5xdWVyeSh0cnVlKS5xICE9PSAnJykge1xuICAgICAgZm9yICh2YXIgZmlsdGVyIG9mIEpTT04ucGFyc2UodXJsLnF1ZXJ5KHRydWUpLnEpKSB7XG4gICAgICAgIGNvbmZpZ3VyYXRpb24uZmlsdGVyQmFyQ29uZmlndXJhdGlvbi5maWx0ZXJzW2ZpbHRlci51aWRdID0ge307XG4gICAgICAgIGNvbmZpZ3VyYXRpb24uZmlsdGVyQmFyQ29uZmlndXJhdGlvbi5maWx0ZXJzW2ZpbHRlci51aWRdLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgICBjb25maWd1cmF0aW9uLmZpbHRlckJhckNvbmZpZ3VyYXRpb24uZmlsdGVyc1tmaWx0ZXIudWlkXS52YWx1ZSA9IGZpbHRlci52YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvbmZpZ3VyYXRpb247XG59XG5cbiIsImltcG9ydCAqIGFzIFNoYXJlZFV0aWxzIGZyb20gJy4uL3V0aWxzL1NoYXJlZFV0aWxzJztcblxuaW1wb3J0ICogYXMgRmlsdGVyQ2xpZW50IGZyb20gJy4uL2NsaWVudHMvRmlsdGVyQ2xpZW50JztcblxuZXhwb3J0IGNsYXNzIEZpbHRlckJhclN0b3JlIHtcbiAgY29uc3RydWN0b3IoY29uZmlndXJhdGlvbikge1xuICAgIHRoaXMuQ0hBTkdFX0VWRU5UID0gJ2NoYW5nZSc7XG4gICAgdGhpcy5ldmVudEVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICB0aGlzLmlkID0gY29uZmlndXJhdGlvbi5pZDtcbiAgICB0aGlzLnBlcnNpc3RlbnQgPSBjb25maWd1cmF0aW9uLnBlcnNpc3RlbnQ7XG4gICAgdGhpcy51cmwgPSBjb25maWd1cmF0aW9uLnNlYXJjaFVybDtcbiAgICB0aGlzLnNlYXJjaFVybCA9IGNvbmZpZ3VyYXRpb24uc2VhcmNoVXJsO1xuICAgIHRoaXMuc2F2ZVNlYXJjaFVybCA9IGNvbmZpZ3VyYXRpb24uc2F2ZVNlYXJjaFVybDtcbiAgICB0aGlzLnNhdmVkU2VhcmNoVXJsID0gY29uZmlndXJhdGlvbi5zYXZlZFNlYXJjaFVybDtcbiAgICB0aGlzLmV4cG9ydFJlc3VsdHNVcmwgPSBjb25maWd1cmF0aW9uLmV4cG9ydFJlc3VsdHNVcmw7XG4gICAgdGhpcy5maWx0ZXJzID0gY29uZmlndXJhdGlvbi5maWx0ZXJzO1xuXG4gICAgdmFyIGZpbHRlciwgZmlsdGVyVWlkO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBPYmplY3Qua2V5cyh0aGlzLmZpbHRlcnMpLmxlbmd0aDsgaSsrKSB7XG4gICAgICBmaWx0ZXJVaWQgPSBPYmplY3Qua2V5cyh0aGlzLmZpbHRlcnMpW2ldO1xuICAgICAgZmlsdGVyID0gdGhpcy5maWx0ZXJzW2ZpbHRlclVpZF07XG5cbiAgICAgIGlmIChmaWx0ZXIudXJsKSB7XG4gICAgICAgIEZpbHRlckNsaWVudC51cGRhdGVGaWx0ZXJPcHRpb25zKGZpbHRlcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5yZWNlaWV2ZVNhdmVkU2VhcmNoZXMoKTtcbiAgfVxuXG4gIGdldElkKCkge1xuICAgIHJldHVybiB0aGlzLmlkO1xuICB9XG5cbiAgZ2V0U2VhcmNoVXJsKCkge1xuICAgIHJldHVybiB0aGlzLnNlYXJjaFVybDtcbiAgfVxuXG4gIGdldFNhdmVTZWFyY2hVcmwoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2F2ZVNlYXJjaFVybDtcbiAgfVxuXG4gIGdldFNhdmVkU2VhcmNoZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2F2ZWRTZWFyY2hlcyB8fCBbXTtcbiAgfVxuXG4gIGdldFNhdmVkU2VhcmNoKHNlYXJjaElkKSB7XG4gICAgcmV0dXJuIHRoaXMuc2F2ZWRTZWFyY2hlc1tzZWFyY2hJZF07XG4gIH1cblxuICBnZXRGaWx0ZXIoZmlsdGVyVWlkKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyc1tmaWx0ZXJVaWRdO1xuICB9XG5cbiAgZ2V0RGlzYWJsZWQoKSB7XG4gICAgdmFyIGRpc2FibGVkRmlsdGVycyA9IHt9O1xuICAgIGZvciAodmFyIGZpbHRlclVpZCBpbiB0aGlzLmZpbHRlcnMpIHtcbiAgICAgIGlmICh0aGlzLmZpbHRlcnNbZmlsdGVyVWlkXS5lbmFibGVkID09PSBmYWxzZSkge1xuICAgICAgICBkaXNhYmxlZEZpbHRlcnNbZmlsdGVyVWlkXSA9IHRoaXMuZmlsdGVyc1tmaWx0ZXJVaWRdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGlzYWJsZWRGaWx0ZXJzO1xuICB9XG5cbiAgZ2V0RW5hYmxlZCgpIHtcbiAgICB2YXIgZW5hYmxlZEZpbHRlcnMgPSB7fTtcbiAgICBmb3IgKHZhciBmaWx0ZXJVaWQgaW4gdGhpcy5maWx0ZXJzKSB7XG4gICAgICBpZiAodGhpcy5maWx0ZXJzW2ZpbHRlclVpZF0uZW5hYmxlZCA9PT0gdHJ1ZSkge1xuICAgICAgICBlbmFibGVkRmlsdGVyc1tmaWx0ZXJVaWRdID0gdGhpcy5maWx0ZXJzW2ZpbHRlclVpZF07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlbmFibGVkRmlsdGVycztcbiAgfVxuXG4gIGdldFF1ZXJ5KCkge1xuICAgIHZhciBlbmFibGVkRmlsdGVycyA9IE9iamVjdC5rZXlzKHRoaXMuZ2V0RW5hYmxlZCgpKS5tYXAoZnVuY3Rpb24oZmlsdGVyVWlkKSB7XG4gICAgICB2YXIgZmlsdGVyID0gdGhpcy5nZXRGaWx0ZXIoZmlsdGVyVWlkKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHVpZDogZmlsdGVyVWlkLFxuICAgICAgICB0eXBlOiBmaWx0ZXIudHlwZSxcbiAgICAgICAgZmllbGQ6IGZpbHRlci5maWVsZCxcbiAgICAgICAgdmFsdWU6IGZpbHRlci52YWx1ZVxuICAgICAgfTtcbiAgICB9LCB0aGlzKTtcbiAgICByZXR1cm4gZW5hYmxlZEZpbHRlcnMubGVuZ3RoID4gMCA/IEpTT04uc3RyaW5naWZ5KGVuYWJsZWRGaWx0ZXJzKSA6ICcnO1xuICB9XG5cbiAgLyogTXV0YXRpb24gTWV0aG9kcyAqL1xuICByZWNlaWV2ZVNhdmVkU2VhcmNoZXMoKSB7XG4gICAgU2hhcmVkVXRpbHMuYWpheEdldChcbiAgICAgIHRoaXMuc2F2ZWRTZWFyY2hVcmwsXG4gICAgICAnanNvbicsXG4gICAgICBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICB0aGlzLnNhdmVkU2VhcmNoZXMgPSByZXNwb25zZTtcbiAgICAgICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gICAgICB9LmJpbmQodGhpcylcbiAgICApO1xuICB9XG5cbiAgZGlzYWJsZUFsbEZpbHRlcnMoKSB7XG4gICAgdmFyIGVuYWJsZWRGaWx0ZXJzID0gdGhpcy5nZXRFbmFibGVkKCk7XG5cbiAgICBmb3IgKHZhciBmaWx0ZXJVaWQgaW4gZW5hYmxlZEZpbHRlcnMpIHtcbiAgICAgIHRoaXMuZGlzYWJsZUZpbHRlcihmaWx0ZXJVaWQpO1xuICAgIH1cbiAgICB0aGlzLmVtaXRDaGFuZ2UoKTtcbiAgfVxuXG4gIGRpc2FibGVGaWx0ZXIoZmlsdGVyVWlkKSB7XG4gICAgdGhpcy5maWx0ZXJzW2ZpbHRlclVpZF0uZW5hYmxlZCA9IGZhbHNlO1xuICAgIHRoaXMuZmlsdGVyc1tmaWx0ZXJVaWRdLnZhbHVlID0gJyc7XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICBlbmFibGVGaWx0ZXIoZmlsdGVyVWlkLCB2YWx1ZSkge1xuICAgIHRoaXMuZmlsdGVyc1tmaWx0ZXJVaWRdLmVuYWJsZWQgPSB0cnVlO1xuICAgIHRoaXMuZmlsdGVyc1tmaWx0ZXJVaWRdLnZhbHVlID0gdmFsdWUgfHwgJyc7XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICB1cGRhdGVGaWx0ZXIoZmlsdGVyVWlkLCBwcm9wS2V5LCBwcm9wVmFsdWUpIHtcbiAgICB0aGlzLmZpbHRlcnNbZmlsdGVyVWlkXVtwcm9wS2V5XSA9IHByb3BWYWx1ZTtcbiAgICB0aGlzLmVtaXRDaGFuZ2UoKTtcbiAgfVxuXG4gIGVtaXRDaGFuZ2UoKSB7XG4gICAgdGhpcy5ldmVudEVtaXR0ZXIuZW1pdCh0aGlzLkNIQU5HRV9FVkVOVCk7XG4gIH1cblxuICBhZGRDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMuZXZlbnRFbWl0dGVyLm9uKHRoaXMuQ0hBTkdFX0VWRU5ULCBjYWxsYmFjayk7XG4gIH1cblxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMuZXZlbnRFbWl0dGVyLnJlbW92ZUxpc3RlbmVyKHRoaXMuQ0hBTkdFX0VWRU5ULCBjYWxsYmFjayk7XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIFNlYXJjaENsaWVudCBmcm9tICcuLi9jbGllbnRzL1NlYXJjaENsaWVudCc7XG5cbmV4cG9ydCBjbGFzcyBTYXZlZFNlYXJjaFN0b3JlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5DSEFOR0VfRVZFTlQgPSAnY2hhbmdlJztcbiAgICB0aGlzLmV2ZW50RW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIHRoaXMuc2V0U2F2ZWRTZWFyY2hVcmwoJy9qb2JzZWVrZXJzL3NhdmVkX3NlYXJjaGVzJyk7XG5cbiAgICBTZWFyY2hDbGllbnQuZ2V0U2F2ZWRTZWFyY2hlcyh0aGlzLmdldFNhdmVkU2VhcmNoVXJsKCksIHRoaXMuc2V0U2F2ZWRTZWFyY2hlcy5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIGdldFNhdmVkU2VhcmNoVXJsKCkge1xuICAgIHJldHVybiB0aGlzLnNhdmVkU2VhcmNoVXJsO1xuICB9XG5cbiAgc2V0U2F2ZWRTZWFyY2hVcmwoc2F2ZWRTZWFyY2hVcmwpIHtcbiAgICB0aGlzLnNhdmVkU2VhcmNoVXJsID0gc2F2ZWRTZWFyY2hVcmw7XG4gIH1cblxuICBnZXRTYXZlZFNlYXJjaGVzKCkge1xuICAgIHJldHVybiB0aGlzLnNhdmVkU2VhcmNoZXM7XG4gIH1cblxuICBzZXRTYXZlZFNlYXJjaGVzKHNhdmVkU2VhcmNoZXMpIHtcbiAgICB0aGlzLnNhdmVkU2VhcmNoZXMgPSBzYXZlZFNlYXJjaGVzO1xuICB9XG5cbiAgZW1pdENoYW5nZSgpIHtcbiAgICB0aGlzLmV2ZW50RW1pdHRlci5lbWl0KHRoaXMuQ0hBTkdFX0VWRU5UKTtcbiAgfVxuXG4gIGFkZENoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5ldmVudEVtaXR0ZXIub24odGhpcy5DSEFOR0VfRVZFTlQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5ldmVudEVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIodGhpcy5DSEFOR0VfRVZFTlQsIGNhbGxiYWNrKTtcbiAgfVxufVxuXG4iLCJpbXBvcnQgKiBhcyBTZWFyY2hVdGlscyBmcm9tICcuLi91dGlscy9TZWFyY2hVdGlscyc7XG5cbmV4cG9ydCBjbGFzcyBUYWJsZVN0b3JlIHtcbiAgY29uc3RydWN0b3IoY29uZmlndXJhdGlvbikge1xuICAgIHRoaXMuQ0hBTkdFX0VWRU5UID0gJ2NoYW5nZSc7XG4gICAgdGhpcy5ldmVudEVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICB0aGlzLmlkID0gY29uZmlndXJhdGlvbi5pZDtcbiAgICB0aGlzLnJvd3MgPSBbXTtcbiAgICB0aGlzLmN1cnJlbnRQYWdlID0gY29uZmlndXJhdGlvbi5wYWdlIHx8IDE7XG4gICAgdGhpcy50b3RhbFBhZ2VzID0gMTtcblxuICAgIHRoaXMuY29sdW1uSGVhZGluZ3MgPSBjb25maWd1cmF0aW9uLmNvbHVtbnM7XG4gICAgdGhpcy51cmwgPSBjb25maWd1cmF0aW9uLmRhdGFVcmw7XG4gICAgdGhpcy5mZXRjaERhdGEoKTtcbiAgfVxuXG4gIGdldElkKCkge1xuICAgIHJldHVybiB0aGlzLmlkO1xuICB9XG5cbiAgc2V0VXJsKHVybCkge1xuICAgIHRoaXMudXJsID0gdXJsO1xuICB9XG5cbiAgZ2V0VXJsKCkge1xuICAgIHJldHVybiB0aGlzLnVybDtcbiAgfVxuXG4gIGZldGNoRGF0YSgpIHtcbiAgICBTZWFyY2hVdGlscy5zZWFyY2goXG4gICAgICB0aGlzLnVybCArIGAmcGFnZT0ke3RoaXMuY3VycmVudFBhZ2V9YCxcbiAgICAgIHRoaXMuc2V0RGF0YS5iaW5kKHRoaXMpXG4gICAgKTtcbiAgfVxuXG4gIHNldERhdGEocmVzcG9uc2UpIHtcbiAgICB0aGlzLnJvd3MgPSByZXNwb25zZS5yZXN1bHRzO1xuICAgIHRoaXMuY3VycmVudFBhZ2UgPSByZXNwb25zZS5jdXJyZW50X3BhZ2U7XG4gICAgdGhpcy50b3RhbFBhZ2VzID0gcmVzcG9uc2UudG90YWxfcGFnZXM7XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICBnZXRDb2x1bW5IZWFkaW5ncygpIHtcbiAgICByZXR1cm4gdGhpcy5jb2x1bW5IZWFkaW5ncztcbiAgfVxuXG4gIHNldFJvd3Mocm93cykge1xuICAgIHRoaXMucm93cyA9IHJvd3M7XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICBnZXRSb3dzKCkge1xuICAgIHJldHVybiB0aGlzLnJvd3M7XG4gIH1cblxuICBnZXRDdXJyZW50UGFnZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50UGFnZTtcbiAgfVxuXG4gIGdldFRvdGFsUGFnZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMudG90YWxQYWdlcztcbiAgfVxuXG4gIHNldFRvdGFsUGFnZXModG90YWxQYWdlcykge1xuICAgIHRoaXMudG90YWxQYWdlcyA9IHRvdGFsUGFnZXM7XG4gIH1cblxuICBzZXRDdXJyZW50UGFnZShwYWdlKSB7XG4gICAgdGhpcy5jdXJyZW50UGFnZSA9IHBhZ2U7XG4gIH1cblxuICB1cGRhdGVUYWJsZSh0YWJsZVN0YXRlT2JqZWN0KSB7XG4gICAgdGhpcy5zZXRSb3dzKHRhYmxlU3RhdGVPYmplY3QucmVzdWx0cyk7XG4gICAgdGhpcy5zZXRDdXJyZW50UGFnZSh0YWJsZVN0YXRlT2JqZWN0LmN1cnJlbnRfcGFnZSk7XG4gICAgdGhpcy5zZXRUb3RhbFBhZ2VzKHRhYmxlU3RhdGVPYmplY3QudG90YWxfcGFnZXMpO1xuICB9XG5cbiAgZW1pdENoYW5nZSgpIHtcbiAgICB0aGlzLmV2ZW50RW1pdHRlci5lbWl0KHRoaXMuQ0hBTkdFX0VWRU5UKTtcbiAgfVxuXG4gIGFkZENoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5ldmVudEVtaXR0ZXIub24odGhpcy5DSEFOR0VfRVZFTlQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5ldmVudEVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIodGhpcy5DSEFOR0VfRVZFTlQsIGNhbGxiYWNrKTtcbiAgfVxufVxuIiwiaW1wb3J0IHthamF4R2V0fSBmcm9tICcuL1NoYXJlZFV0aWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHNlYXJjaCh1cmwsIHN1Y2Nlc3MpIHtcbiAgYWpheEdldCh1cmwsICdqc29uJywgc3VjY2Vzcyk7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplKG9iaiwgcHJlZml4KSB7XG4gIHZhciBzdHIgPSBbXTtcbiAgZm9yICh2YXIgcCBpbiBvYmopIHtcbiAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHApKSB7XG4gICAgICB2YXIgayA9IHByZWZpeCA/IHByZWZpeCArIFwiW1wiICsgcCArIFwiXVwiIDogcCwgdiA9IG9ialtwXTtcbiAgICAgIHN0ci5wdXNoKHR5cGVvZiB2ID09PSBcIm9iamVjdFwiID9cbiAgICAgICAgdGhpcy5zZXJpYWxpemUodiwgaykgOlxuICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoaykgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudCh2KSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdHIuam9pbihcIiZcIik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhamF4R2V0KHVybCwgdHlwZSwgc3VjY2VzcywgZXJyb3IpIHtcbiAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICB4aHIub3BlbihcIkdFVFwiLCB1cmwsIHRydWUpO1xuICB4aHIucmVzcG9uc2VUeXBlID0gdHlwZTtcbiAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkFjY2VwdFwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiWC1SZXF1ZXN0ZWQtV2l0aFwiLCBcIlhNTEh0dHBSZXF1ZXN0XCIpO1xuICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0YXR1cyA9IHhoci5zdGF0dXM7XG4gICAgdmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlO1xuICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xuICAgICAgcmV0dXJuIHN1Y2Nlc3MocmVzcG9uc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZXJyb3IocmVzcG9uc2UpO1xuICAgIH1cbiAgfTtcbiAgeGhyLnNlbmQoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFqYXhQb3N0KHVybCwgdHlwZSwgZGF0YSwgc3VjY2VzcywgZXJyb3IpIHtcbiAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICB4aHIub3BlbihcIlBPU1RcIiwgdXJsLCB0cnVlKTtcbiAgeGhyLnJlc3BvbnNlVHlwZSA9IHR5cGU7XG4gIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHRcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIlgtUmVxdWVzdGVkLVdpdGhcIiwgXCJYTUxIdHRwUmVxdWVzdFwiKTtcbiAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJYX0NTUkZfVE9LRU5cIiwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1ldGFbbmFtZT1jc3JmLXRva2VuXVwiKS5nZXRBdHRyaWJ1dGUoXCJjb250ZW50XCIpKTtcbiAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZXNwb25zZSA9IHhoci5yZXNwb25zZTtcbiAgfTtcbiAgeGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VGaWx0ZXJCYXJDb25maWd1cmF0aW9uKGZpbHRlckJhckNvbmZpZ3VyYXRpb24sIGlkKSB7XG4gIHZhciBwYXJzZWRGaWx0ZXJCYXJDb25maWd1cmF0aW9uID0ge30sXG4gICAgICByYXdGaWx0ZXIsXG4gICAgICByYXdGaWx0ZXJzLFxuICAgICAgcGFyc2VkRmlsdGVycyA9IHt9O1xuXG4gIHJhd0ZpbHRlcnMgPSBmaWx0ZXJCYXJDb25maWd1cmF0aW9uLnF1ZXJ5U2VsZWN0b3IoXCJkbC5maWx0ZXJzXCIpLnF1ZXJ5U2VsZWN0b3JBbGwoXCJkdC5maWx0ZXJcIik7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCByYXdGaWx0ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgcmF3RmlsdGVyID0gcmF3RmlsdGVyc1tpXTtcbiAgICBwYXJzZWRGaWx0ZXJzW3Jhd0ZpbHRlci5nZXRBdHRyaWJ1dGUoXCJkYXRhLXVpZFwiKV0gPSB7XG4gICAgICBsYWJlbDogcmF3RmlsdGVyLmdldEF0dHJpYnV0ZShcImRhdGEtbGFiZWxcIiksXG4gICAgICB0eXBlOiByYXdGaWx0ZXIuZ2V0QXR0cmlidXRlKFwiZGF0YS10eXBlXCIpLFxuICAgICAgZmllbGQ6IHJhd0ZpbHRlci5nZXRBdHRyaWJ1dGUoXCJkYXRhLWZpZWxkXCIpLFxuICAgICAgdXJsOiByYXdGaWx0ZXIuZ2V0QXR0cmlidXRlKFwiZGF0YS11cmxcIiksXG4gICAgICB2YWx1ZTogXCJcIixcbiAgICAgIGVuYWJsZWQ6IGZhbHNlXG4gICAgfTtcbiAgfVxuXG4gIHBhcnNlZEZpbHRlckJhckNvbmZpZ3VyYXRpb24uaWQgPSBpZDtcbiAgcGFyc2VkRmlsdGVyQmFyQ29uZmlndXJhdGlvbi5wZXJzaXN0ZW50ID0gZmlsdGVyQmFyQ29uZmlndXJhdGlvbi5xdWVyeVNlbGVjdG9yKFwiZHQucGVyc2lzdGVudFwiKS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBlcnNpc3RlbnRcIik7XG4gIHBhcnNlZEZpbHRlckJhckNvbmZpZ3VyYXRpb24uc2VhcmNoVXJsID0gZmlsdGVyQmFyQ29uZmlndXJhdGlvbi5xdWVyeVNlbGVjdG9yKFwiZHQuc2VhcmNoLXVybFwiKS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXVybFwiKTtcbiAgcGFyc2VkRmlsdGVyQmFyQ29uZmlndXJhdGlvbi5zYXZlU2VhcmNoVXJsID0gZmlsdGVyQmFyQ29uZmlndXJhdGlvbi5xdWVyeVNlbGVjdG9yKFwiZHQuc2F2ZS1zZWFyY2gtdXJsXCIpLmdldEF0dHJpYnV0ZShcImRhdGEtdXJsXCIpO1xuICBwYXJzZWRGaWx0ZXJCYXJDb25maWd1cmF0aW9uLnNhdmVkU2VhcmNoVXJsID0gZmlsdGVyQmFyQ29uZmlndXJhdGlvbi5xdWVyeVNlbGVjdG9yKFwiZHQuc2F2ZWQtc2VhcmNoLXVybFwiKS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXVybFwiKTtcbiAgcGFyc2VkRmlsdGVyQmFyQ29uZmlndXJhdGlvbi5leHBvcnRSZXN1bHRzVXJsID0gZmlsdGVyQmFyQ29uZmlndXJhdGlvbi5xdWVyeVNlbGVjdG9yKFwiZHQuZXhwb3J0LXJlc3VsdHMtdXJsXCIpLmdldEF0dHJpYnV0ZShcImRhdGEtdXJsXCIpO1xuICBwYXJzZWRGaWx0ZXJCYXJDb25maWd1cmF0aW9uLmZpbHRlcnMgPSBwYXJzZWRGaWx0ZXJzO1xuXG4gIHJldHVybiBwYXJzZWRGaWx0ZXJCYXJDb25maWd1cmF0aW9uO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VUYWJsZUNvbmZpZ3VyYXRpb24odGFibGVDb25maWd1cmF0aW9uLCBpZCkge1xuICB2YXIgcGFyc2VkVGFibGVDb25maWd1cmF0aW9uID0ge30sXG4gICAgICByYXdDb2x1bW5zLFxuICAgICAgcmF3Q29sdW1uLFxuICAgICAgcGFyc2VkQ29sdW1ucyA9IHt9O1xuXG4gIHJhd0NvbHVtbnMgPSB0YWJsZUNvbmZpZ3VyYXRpb24ucXVlcnlTZWxlY3RvcihcImRsLmNvbHVtbnNcIikucXVlcnlTZWxlY3RvckFsbChcImR0LmNvbHVtblwiKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHJhd0NvbHVtbnMubGVuZ3RoOyBpKyspIHtcbiAgICByYXdDb2x1bW4gPSByYXdDb2x1bW5zW2ldO1xuICAgIHBhcnNlZENvbHVtbnNbcmF3Q29sdW1uLmdldEF0dHJpYnV0ZShcImRhdGEtZmllbGRcIildID0ge1xuICAgICAgaGVhZGluZzogcmF3Q29sdW1uLmdldEF0dHJpYnV0ZShcImRhdGEtaGVhZGluZ1wiKSxcbiAgICAgIHR5cGU6IHJhd0NvbHVtbi5nZXRBdHRyaWJ1dGUoXCJkYXRhLXR5cGVcIilcbiAgICB9O1xuICB9XG5cbiAgcGFyc2VkVGFibGVDb25maWd1cmF0aW9uLmlkID0gaWQ7XG4gIHBhcnNlZFRhYmxlQ29uZmlndXJhdGlvbi5kYXRhVXJsID0gdGFibGVDb25maWd1cmF0aW9uLnF1ZXJ5U2VsZWN0b3IoXCJkdC5kYXRhLXVybFwiKS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXVybFwiKTtcbiAgcGFyc2VkVGFibGVDb25maWd1cmF0aW9uLmNvbHVtbnMgPSBwYXJzZWRDb2x1bW5zO1xuXG4gIHJldHVybiBwYXJzZWRUYWJsZUNvbmZpZ3VyYXRpb247XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVVybFNlYXJjaFN0cmluZygpIHtcbiAgLy8gdGFrZW4gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL3F1ZXJ5LXN0cmluZy9ibG9iL21hc3Rlci9xdWVyeS1zdHJpbmcuanNcblxuICB2YXIgc3RyID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcblxuICBpZiAodHlwZW9mIHN0ciAhPT0gXCJzdHJpbmdcIikge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIHN0ciA9IHN0ci50cmltKCkucmVwbGFjZSgvXihcXD98IykvLCBcIlwiKTtcblxuICBpZiAoIXN0cikge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIHJldHVybiBzdHIudHJpbSgpLnNwbGl0KFwiJlwiKS5yZWR1Y2UoZnVuY3Rpb24gKHJldCwgcGFyYW0pIHtcbiAgICB2YXIgcGFydHMgPSBwYXJhbS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpLnNwbGl0KFwiPVwiKTtcbiAgICB2YXIga2V5ID0gcGFydHNbMF07XG4gICAgdmFyIHZhbCA9IHBhcnRzWzFdO1xuXG4gICAga2V5ID0gZGVjb2RlVVJJQ29tcG9uZW50KGtleSk7XG4gICAgLy8gbWlzc2luZyBgPWAgc2hvdWxkIGJlIGBudWxsYDpcbiAgICAvLyBodHRwOi8vdzMub3JnL1RSLzIwMTIvV0QtdXJsLTIwMTIwNTI0LyNjb2xsZWN0LXVybC1wYXJhbWV0ZXJzXG4gICAgdmFsID0gdmFsID09PSB1bmRlZmluZWQgPyBudWxsIDogZGVjb2RlVVJJQ29tcG9uZW50KHZhbCk7XG5cbiAgICBpZiAoIXJldC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICByZXRba2V5XSA9IHZhbDtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocmV0W2tleV0pKSB7XG4gICAgICByZXRba2V5XS5wdXNoKHZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldFtrZXldID0gW3JldFtrZXldLCB2YWxdO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH0sIHt9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVVybFNlYXJjaFN0cmluZyhvYmopIHtcbiAgLy8gdGFrZW4gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL3F1ZXJ5LXN0cmluZy9ibG9iL21hc3Rlci9xdWVyeS1zdHJpbmcuanNcbiAgcmV0dXJuIG9iaiA/IE9iamVjdC5rZXlzKG9iaikubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgdmFsID0gb2JqW2tleV07XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgICByZXR1cm4gdmFsLm1hcChmdW5jdGlvbiAodmFsMikge1xuICAgICAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudCh2YWwyKTtcbiAgICAgIH0pLmpvaW4oXCImXCIpO1xuICAgIH1cblxuICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoa2V5KSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbCk7XG4gIH0pLmpvaW4oXCImXCIpIDogXCJcIjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVVybChwcm9wS2V5LCBwcm9wVmFsdWUpIHtcbiAgdmFyIHNlYXJjaE9iamVjdCA9IHBhcnNlVXJsU2VhcmNoU3RyaW5nKCk7XG5cbiAgc2VhcmNoT2JqZWN0W3Byb3BLZXldID0gcHJvcFZhbHVlO1xuXG4gIHZhciBuZXdTZWFyY2hTdHJpbmcgPSBcIj9cIiArIGNyZWF0ZVVybFNlYXJjaFN0cmluZyhzZWFyY2hPYmplY3QpO1xuXG4gIGhpc3RvcnkucHVzaFN0YXRlKHt9LCBcIlwiLCB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgbmV3U2VhcmNoU3RyaW5nKTtcbiAgbG9jYWxTdG9yYWdlW3dpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC8vZywgXCJcIildID0gbmV3U2VhcmNoU3RyaW5nO1xufVxuIl19
