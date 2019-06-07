(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*!
 * URI.js - Mutating URLs
 * IPv6 Support
 *
 * Version: 1.16.1
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

},{}],2:[function(require,module,exports){
/*!
 * URI.js - Mutating URLs
 * Second Level Domain (SLD) Support
 *
 * Version: 1.16.1
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

},{}],3:[function(require,module,exports){
/*!
 * URI.js - Mutating URLs
 *
 * Version: 1.16.1
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
    var _urlSupplied = arguments.length >= 1;
    var _baseSupplied = arguments.length >= 2;

    // Allow instantiation without the 'new' keyword
    if (!(this instanceof URI)) {
      if (_urlSupplied) {
        if (_baseSupplied) {
          return new URI(url, base);
        }

        return new URI(url);
      }

      return new URI();
    }

    if (url === undefined) {
      if (_urlSupplied) {
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

  URI.version = '1.16.1';

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

    if (getType(value) === 'RegExp') {
      lookup = null;
    } else if (isArray(value)) {
      for (i = 0, length = value.length; i < length; i++) {
        lookup[value[i]] = true;
      }
    } else {
      lookup[value] = true;
    }

    for (i = 0, length = data.length; i < length; i++) {
      /*jshint laxbreak: true */
      var _match = lookup && lookup[data[i]] !== undefined
        || !lookup && value.test(data[i]);
      /*jshint laxbreak: false */
      if (_match) {
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
    // Copy chrome, IE, opera backslash-handling behavior.
    // Back slashes before the query string get converted to forward slashes
    // See: https://github.com/joyent/node/blob/386fd24f49b0e9d1a8a076592a404168faeecc34/lib/url.js#L115-L124
    // See: https://code.google.com/p/chromium/issues/detail?id=25916
    // https://github.com/medialize/URI.js/pull/233
    string = string.replace(/\\/g, '/');

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
        if (typeof items[name] === 'string' || items[name] === null) {
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
    } else if (getType(name) === 'RegExp') {
      for (key in data) {
        if (name.test(key)) {
          data[key] = undefined;
        }
      }
    } else if (typeof name === 'object') {
      for (key in name) {
        if (hasOwn.call(name, key)) {
          URI.removeQuery(data, key, name[key]);
        }
      }
    } else if (typeof name === 'string') {
      if (value !== undefined) {
        if (getType(value) === 'RegExp') {
          if (!isArray(data[name]) && value.test(data[name])) {
            data[name] = undefined;
          } else {
            data[name] = filterArrayValues(data[name], value);
          }
        } else if (data[name] === value) {
          data[name] = undefined;
        } else if (isArray(data[name])) {
          data[name] = filterArrayValues(data[name], value);
        }
      } else {
        data[name] = undefined;
      }
    } else {
      throw new TypeError('URI.removeQuery() accepts an object, string, RegExp as the first parameter');
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
      var res = URI.parseHost(v, x);
      if (res !== '/') {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
      }

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
      var res = URI.parseHost(v, this._parts);
      if (res !== '/') {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
      }

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
      var res = URI.parseAuthority(v, this._parts);
      if (res !== '/') {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
      }

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
        v[i] = URI.encode(v[i]);
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

    // handle relative files (as opposed to directories)
    if (_path.slice(-3) === '/..' || _path.slice(-2) === '/.') {
      _path += '/';
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
    common = URI.commonPath(relativePath, basePath);

    // If the paths have nothing in common, return a relative URL with the absolute path.
    if (!common) {
      return relative.build();
    }

    var parents = baseParts.path
      .substring(common.length)
      .replace(/[^\/]*$/, '')
      .replace(/.*?\//g, '../');

    relativeParts.path = (parents + relativeParts.path.substring(common.length)) || './';

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

},{"./IPv6":1,"./SecondLevelDomains":2,"./punycode":4}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilterBarActor = void 0;

var SearchClient = _interopRequireWildcard(require("../clients/SearchClient"));

var URLHelper = _interopRequireWildcard(require("../helpers/URLHelper"));

var _FilterVerificator = require("../helpers/FilterVerificator");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function updateTable(tableStore) {
  return function (tableStateObject) {
    tableStore.setRows(tableStateObject.results);
    tableStore.setCurrentPage(tableStateObject.current_page);
    tableStore.setTotalPages(tableStateObject.total_pages);
    tableStore.setTableCaption(tableStateObject.table_caption);
    tableStore.clearSelectedRows();
    tableStore.emitChange();
  };
}

var FilterBarActor =
/*#__PURE__*/
function () {
  function FilterBarActor(filterBarStore, tableStore) {
    _classCallCheck(this, FilterBarActor);

    this.filterBarStore = filterBarStore;
    this.tableStore = tableStore;
  }

  _createClass(FilterBarActor, [{
    key: "enableFilter",
    value: function enableFilter(filterUid, value) {
      this.filterBarStore.enableFilter(filterUid, value);
    }
  }, {
    key: "disableFilter",
    value: function disableFilter(filterUid) {
      this.filterBarStore.disableFilter(filterUid);
    }
  }, {
    key: "disableAllFilters",
    value: function disableAllFilters() {
      this.filterBarStore.disableAllFilters();
      this.filterBarStore.disableAllQuickFilters();
    }
  }, {
    key: "disableAllFiltersAndApply",
    value: function disableAllFiltersAndApply() {
      this.disableAllFilters();
      this.applyFilters();
    }
  }, {
    key: "updateFilter",
    value: function updateFilter(filterUid, propKey, propValue) {
      this.filterBarStore.updateFilter(filterUid, propKey, propValue);
    }
  }, {
    key: "applyFilters",
    value: function applyFilters() {
      var url = URLHelper.updateUrlSearch(this.filterBarStore.getSearchUrl(), "q", this.filterBarStore.getQuery()).toString();
      this.tableStore.setUrl(url);
      this.tableStore.setCurrentPage(1);
      url = this.tableStore.getUrl();
      SearchClient.search(url, updateTable(this.tableStore));

      if (this.filterBarStore.persistent) {
        URLHelper.updateApplicationUrlState(url);
      }
    }
  }, {
    key: "applyQuickFilter",
    value: function applyQuickFilter(filterName, value, quickFilterName, blockName) {
      var filter = this.filterBarStore.getFilter(filterName);

      if (filter.type === 'multi_select') {
        value = value.split(",").map(function (string) {
          return string.trim();
        });
      }

      this.filterBarStore.enableQuickFilter(quickFilterName, blockName);
      this.enableFilter(filterName, value);
      this.applyFilters();
    }
  }, {
    key: "disableBlockFilters",
    value: function disableBlockFilters(blockName) {
      var self = this;
      var filterBarStore = this.filterBarStore;
      var buttons = filterBarStore.quickFilters[blockName];
      Object.keys(buttons).map(function (buttonName) {
        var filters = filterBarStore.quickFilters[blockName][buttonName].filters;

        if (_typeof(filters) == "object") {
          Object.keys(filters).map(function (filterName) {
            self.disableFilter(filters[filterName].filter);
          });
        }
      });
    }
  }, {
    key: "exportResults",
    value: function exportResults() {
      if (this.exportPageLimitExceeded()) {
        alert(this.filterBarStore.getExportPageLimitExceededMessage());
      } else if (this.filterBarStore.persistent) {
        URLHelper.redirectUrl(this.exportUrl());
      }
    }
  }, {
    key: "exportPageLimitExceeded",
    value: function exportPageLimitExceeded() {
      return this.filterBarStore.getExportPageLimit() !== NaN && this.tableStore.getTotalPages() > this.filterBarStore.getExportPageLimit();
    }
  }, {
    key: "exportUrl",
    value: function exportUrl() {
      return URLHelper.updateUrlSearch(this.filterBarStore.getExportResultsUrl(), "q", this.filterBarStore.getQuery()).toString();
    }
  }, {
    key: "loadSavedSearch",
    value: function loadSavedSearch(searchId) {
      this.disableAllFilters();
      var savedSearch = this.filterBarStore.getSavedSearch(searchId);
      var filters = JSON.parse(savedSearch.configuration);

      if (this.verifySavedFilters(filters)) {
        for (var filter in filters) {
          this.enableFilter(filter, filters[filter]);
        }

        this.applyFilters();
      } else {
        this.deleteSavedSearch(searchId, 'One of the filters in this saved search cannot be applied anymore. Remove saved search?');
      }
    }
  }, {
    key: "verifySavedFilters",
    value: function verifySavedFilters(filters) {
      var filtersArr = Object.keys(filters).map(function (name) {
        return {
          uid: name
        };
      });
      return new _FilterVerificator.FilterVerificator(this.filterBarStore.getFilters(), filtersArr).verify();
    }
  }, {
    key: "saveFilters",
    value: function saveFilters(name) {
      var savedSearchPacket = {
        saved_search: {
          filters: {},
          search_title: name
        }
      };
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.filterBarStore.enabledFilters()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              filterUid = _step$value[0],
              filter = _step$value[1];

          savedSearchPacket.saved_search.filters[filterUid] = filter.value;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (Object.keys(savedSearchPacket.saved_search.filters).length === 0) {
        return false;
      }

      SearchClient.saveSearch(this.filterBarStore.getSavedSearchesUrl(), savedSearchPacket, this.reloadSavedSearches.bind(this));
      this.applyFilters();
      return true;
    }
  }, {
    key: "deleteSavedSearch",
    value: function deleteSavedSearch(searchId, confirmationMessage) {
      var savedSearch = this.filterBarStore.getSavedSearch(searchId);

      if (!savedSearch.url) {
        return;
      }

      if (confirmationMessage === undefined) {
        confirmationMessage = 'Are you sure remove saved search "' + savedSearch.name + '"?';
      }

      var confirmation = confirm(confirmationMessage);

      if (confirmation) {
        SearchClient.deleteSearch(savedSearch.url, this.reloadSavedSearches.bind(this));
      }
    }
  }, {
    key: "reloadSavedSearches",
    value: function reloadSavedSearches() {
      SearchClient.getSavedSearches(this.filterBarStore.getSavedSearchesUrl(), this.filterBarStore.setSavedSearches.bind(this.filterBarStore));
    }
  }]);

  return FilterBarActor;
}();

exports.FilterBarActor = FilterBarActor;

},{"../clients/SearchClient":8,"../helpers/FilterVerificator":48,"../helpers/URLHelper":50}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TableActor = void 0;

var SearchClient = _interopRequireWildcard(require("../clients/SearchClient"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TableActor =
/*#__PURE__*/
function () {
  function TableActor(filterBarStore, tableStore) {
    _classCallCheck(this, TableActor);

    this.filterBarStore = filterBarStore;
    this.tableStore = tableStore;
  }

  _createClass(TableActor, [{
    key: "fetchData",
    value: function fetchData(page) {
      if (page !== undefined) {
        this.tableStore.setCurrentPage(page);
      }

      var url = this.tableStore.getUrl();
      SearchClient.search(url, this.tableStore.updateTable.bind(this.tableStore));

      if (this.filterBarStore.persistent) {
        history.pushState({}, "", window.location.origin + url);
        localStorage[window.location.pathname.replace(/\//g, "")] = url.removeSearch("page").search();
      }
    }
  }]);

  return TableActor;
}();

exports.TableActor = TableActor;

},{"../clients/SearchClient":8}],7:[function(require,module,exports){
"use strict";

var _FilterableTable = require("./components/FilterableTable.react");

var _FilterVerificator = require("./helpers/FilterVerificator");

var uri = require("URIjs");

function walk(node) {
  var nodeObject = {};

  if (node.nodeName === "DIV" || node.nodeName === "DL") {
    $.each($(node).children(), function (index, childNode) {
      nodeObject[$.camelCase(childNode.getAttribute("class"))] = walk(childNode);
    });
  } else if (node.nodeName === "DT") {
    nodeObject = node.getAttribute("data-value");

    if (nodeObject === null) {
      nodeObject = {
        from: node.getAttribute("data-value-from"),
        to: node.getAttribute("data-value-to")
      };
    }
  } else {
    throw "Malformed html configuration";
  }

  return nodeObject;
}

function setupConfiguration(configuration) {
  var url = uri(window.location),
      searchObject = url.search(true),
      storageKey = window.location.pathname.replace(/\//g, "");

  if (Object.keys(searchObject).length === 0 && localStorage[storageKey] !== undefined) {
    history.pushState({}, "", localStorage[storageKey]);
    url = uri(window.location).removeSearch("page");
  }

  var verifiedFilters = new _FilterVerificator.FilterVerificator(configuration.filterBarConfiguration.filters).verify();

  if (!verifiedFilters || !url.hasSearch("q")) {
    url.setSearch("q", "");
  }

  if (!url.hasSearch("page")) {
    url.addSearch("page", 1);
  }

  configuration.tableConfiguration.dataUrl = url.pathname() + url.search();
  configuration.tableConfiguration.page = Number(url.query(true).page);

  if (url.query(true).q !== "") {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = JSON.parse(url.query(true).q)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var filter = _step.value;
        var configFilter = configuration.filterBarConfiguration.filters[filter.uid];

        if (configFilter) {
          configFilter.enabled = true;
          configFilter.value = filter.value;

          if (filter.operator) {
            configFilter.operator = filter.operator;
          }
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  if (configuration.batchActionsConfiguration === undefined) {
    configuration.batchActionsConfiguration = {
      actions: []
    };
    configuration.tableConfiguration.selectable = undefined;
  } else {
    configuration.tableConfiguration.selectable = configuration.batchActionsConfiguration.selectable;
  }

  return configuration;
}

document.addEventListener("DOMContentLoaded", function () {
  var configuration = {},
      filterableTableNode = document.getElementsByClassName("react-filterable-table")[0];
  configuration = walk(filterableTableNode);
  configuration = setupConfiguration(configuration);
  React.render(React.createElement(_FilterableTable.FilterableTable, {
    filterBarConfiguration: configuration.filterBarConfiguration,
    tableConfiguration: configuration.tableConfiguration,
    batchActionsConfiguration: configuration.batchActionsConfiguration
  }), filterableTableNode);
});

},{"./components/FilterableTable.react":33,"./helpers/FilterVerificator":48,"URIjs":3}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.search = search;
exports.saveSearch = saveSearch;
exports.getSavedSearches = getSavedSearches;
exports.deleteSearch = deleteSearch;

function search(url, _success) {
  $.ajax({
    url: url,
    type: "GET",
    cache: false,
    dataType: "json",
    success: function success(data) {
      _success(data);
    }
  });
}

function saveSearch(url, payload, _success2) {
  $.ajax({
    url: url,
    type: "POST",
    data: payload,
    dataType: "json",
    success: function success() {
      _success2();
    }
  });
}

function getSavedSearches(url, _success3) {
  $.ajax({
    url: url,
    type: "GET",
    cache: false,
    dataType: "json",
    success: function success(data) {
      _success3(data);
    }
  });
}

function deleteSearch(url, _success4) {
  $.ajax({
    url: url,
    type: "DELETE",
    cache: false,
    dataType: "json",
    success: function success() {
      _success4();
    }
  });
}

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ApplyFiltersButton = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ApplyFiltersButton =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ApplyFiltersButton, _React$Component);

  function ApplyFiltersButton(props) {
    _classCallCheck(this, ApplyFiltersButton);

    return _possibleConstructorReturn(this, _getPrototypeOf(ApplyFiltersButton).call(this, props));
  }

  _createClass(ApplyFiltersButton, [{
    key: "onClick",
    value: function onClick() {
      this.context.filterBarActor.applyFilters();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("button", {
        className: "btn btn-primary",
        onClick: this.onClick.bind(this)
      }, React.createElement("i", {
        className: "icon icon-tick"
      }), "Apply");
    }
  }]);

  return ApplyFiltersButton;
}(React.Component);

exports.ApplyFiltersButton = ApplyFiltersButton;
ApplyFiltersButton.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired
};

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BatchActionsList = void 0;

var _BatchActionsListItem = require("./BatchActionsListItem.react");

var URLHelper = _interopRequireWildcard(require("../../../helpers/URLHelper"));

var ModalHelper = _interopRequireWildcard(require("../../../helpers/ModalHelper"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var BatchActionsList =
/*#__PURE__*/
function (_React$Component) {
  _inherits(BatchActionsList, _React$Component);

  function BatchActionsList(props) {
    _classCallCheck(this, BatchActionsList);

    return _possibleConstructorReturn(this, _getPrototypeOf(BatchActionsList).call(this, props));
  }

  _createClass(BatchActionsList, [{
    key: "updateBatchFormFields",
    value: function updateBatchFormFields(event) {
      event.preventDefault();

      if (this.context.tableStore.getSelectedRows().length > 0) {
        $.ajax({
          url: event.target.href,
          type: "POST",
          data: {
            'batch_ids': this.context.tableStore.getSelectedRows()
          },
          dataType: "html",
          success: function (data) {
            ModalHelper.displayModalForData(data);
          }.bind(this)
        });
      } else {
        alert('No rows selected. Please select rows before running bulk actions.');
      }
    }
  }, {
    key: "updateBatchFormFieldsSelectAll",
    value: function updateBatchFormFieldsSelectAll(event) {
      event.preventDefault();

      if (this.context.tableStore.getSelectedRows().length > 0) {
        this.updateBatchFormFields(event);
      } else {
        $.ajax({
          url: URLHelper.updateUrlSearch(event.target.href, "q", this.context.filterBarStore.getQuery()).toString(),
          type: "POST",
          success: function (data) {
            ModalHelper.displayModalForData(data);
          }.bind(this)
        });
      }
    }
  }, {
    key: "batchActionsListItems",
    value: function batchActionsListItems(batchActions) {
      return Object.keys(batchActions).map(function (batchActionName, index) {
        return React.createElement(_BatchActionsListItem.BatchActionsListItem, {
          key: index,
          label: batchActions[batchActionName].label,
          url: batchActions[batchActionName].url,
          onClickAction: batchActions[batchActionName].allowSelectAll ? this.updateBatchFormFieldsSelectAll.bind(this) : this.updateBatchFormFields.bind(this)
        });
      }, this);
    }
  }, {
    key: "render",
    value: function render() {
      var buttonClass = "btn btn-default dropdown-toggle";
      var batchActions = this.context.batchActionsStore.getActions();

      if (batchActions.length === 0) {
        buttonClass += " disabled";
      }

      var batchActionItems = this.batchActionsListItems(batchActions);
      return React.createElement("div", {
        className: "btn-group"
      }, React.createElement("button", {
        "aria-expanded": "false",
        "aria-haspopup": "true",
        className: buttonClass,
        "data-toggle": "dropdown",
        type: "button"
      }, "Bulk Actions", React.createElement("i", {
        className: "icon icon-chevron-down"
      })), React.createElement("ul", {
        className: "dropdown-menu",
        role: "menu"
      }, batchActionItems));
    }
  }]);

  return BatchActionsList;
}(React.Component);

exports.BatchActionsList = BatchActionsList;
BatchActionsList.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired,
  tableStore: React.PropTypes.object.isRequired,
  batchActionsStore: React.PropTypes.object.isRequired
};

},{"../../../helpers/ModalHelper":49,"../../../helpers/URLHelper":50,"./BatchActionsListItem.react":11}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BatchActionsListItem = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var BatchActionsListItem =
/*#__PURE__*/
function (_React$Component) {
  _inherits(BatchActionsListItem, _React$Component);

  function BatchActionsListItem(props) {
    _classCallCheck(this, BatchActionsListItem);

    return _possibleConstructorReturn(this, _getPrototypeOf(BatchActionsListItem).call(this, props));
  }

  _createClass(BatchActionsListItem, [{
    key: "render",
    value: function render() {
      return React.createElement("li", null, React.createElement("a", {
        className: "dynamic-text-filter",
        href: this.props.url,
        onClick: this.props.onClickAction
      }, this.props.label));
    }
  }]);

  return BatchActionsListItem;
}(React.Component);

exports.BatchActionsListItem = BatchActionsListItem;
BatchActionsListItem.propTypes = {
  label: React.PropTypes.string.isRequired,
  url: React.PropTypes.string.isRequired
};

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClearFiltersButton = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ClearFiltersButton =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ClearFiltersButton, _React$Component);

  function ClearFiltersButton(props) {
    _classCallCheck(this, ClearFiltersButton);

    return _possibleConstructorReturn(this, _getPrototypeOf(ClearFiltersButton).call(this, props));
  }

  _createClass(ClearFiltersButton, [{
    key: "onClick",
    value: function onClick() {
      this.context.filterBarActor.disableAllFiltersAndApply();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("button", {
        className: "btn btn-warning",
        onClick: this.onClick.bind(this)
      }, React.createElement("i", {
        className: "icon icon-delete"
      }), "Clear");
    }
  }]);

  return ClearFiltersButton;
}(React.Component);

exports.ClearFiltersButton = ClearFiltersButton;
ClearFiltersButton.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired
};

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConfigurationButton = void 0;

var ModalHelper = _interopRequireWildcard(require("../../helpers/ModalHelper"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ConfigurationButton =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ConfigurationButton, _React$Component);

  function ConfigurationButton(props) {
    _classCallCheck(this, ConfigurationButton);

    return _possibleConstructorReturn(this, _getPrototypeOf(ConfigurationButton).call(this, props));
  }

  _createClass(ConfigurationButton, [{
    key: "onClick",
    value: function onClick() {
      $.ajax({
        url: this.context.filterBarStore.getConfigurationUrl(),
        type: "GET",
        dataType: "html",
        success: function (data) {
          ModalHelper.displayModalForData(data);
        }.bind(this)
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("button", {
        className: "btn btn-default",
        onClick: this.onClick.bind(this)
      }, React.createElement("i", {
        className: "icon icon-edit-outline"
      }), "Columns");
    }
  }]);

  return ConfigurationButton;
}(React.Component);

exports.ConfigurationButton = ConfigurationButton;
ConfigurationButton.contextTypes = {
  filterBarStore: React.PropTypes.object.isRequired
};

},{"../../helpers/ModalHelper":49}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExportResultsButton = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ExportResultsButton =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ExportResultsButton, _React$Component);

  function ExportResultsButton(props) {
    _classCallCheck(this, ExportResultsButton);

    return _possibleConstructorReturn(this, _getPrototypeOf(ExportResultsButton).call(this, props));
  }

  _createClass(ExportResultsButton, [{
    key: "onClick",
    value: function onClick() {
      this.context.filterBarActor.exportResults();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("button", {
        className: "btn btn-default",
        onClick: this.onClick.bind(this)
      }, React.createElement("i", {
        className: "icon icon-download"
      }), "Export CSV");
    }
  }]);

  return ExportResultsButton;
}(React.Component);

exports.ExportResultsButton = ExportResultsButton;
ExportResultsButton.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired
};

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilterBar = void 0;

var _FilterList = require("./FilterList/FilterList.react");

var _FilterDisplay = require("./FilterDisplay/FilterDisplay.react");

var _ApplyFiltersButton = require("./ApplyFiltersButton.react");

var _ConfigurationButton = require("./ConfigurationButton.react");

var _ExportResultsButton = require("./ExportResultsButton.react");

var _ClearFiltersButton = require("./ClearFiltersButton.react");

var _SaveFiltersButton = require("./SaveFiltersButton.react");

var _SavedSearchesList = require("./SavedSearchesList/SavedSearchesList.react");

var _BatchActionsList = require("./BatchActionsList/BatchActionsList.react");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var FilterBar =
/*#__PURE__*/
function (_React$Component) {
  _inherits(FilterBar, _React$Component);

  function FilterBar(props) {
    _classCallCheck(this, FilterBar);

    return _possibleConstructorReturn(this, _getPrototypeOf(FilterBar).call(this, props));
  }

  _createClass(FilterBar, [{
    key: "render",
    value: function render() {
      return React.createElement("div", null, React.createElement("div", null, React.createElement("div", {
        className: "btn-group margin-bottom-sm"
      }, React.createElement(_FilterList.FilterList, {
        disabledFilters: this.context.filterBarStore.getDisabled()
      }), React.createElement(_ApplyFiltersButton.ApplyFiltersButton, {
        filterBarActor: this.context.filterBarActor
      }), React.createElement(_ClearFiltersButton.ClearFiltersButton, {
        filterBarActor: this.context.filterBarActor
      }), React.createElement(_SaveFiltersButton.SaveFiltersButton, {
        filterBarActor: this.context.filterBarActor
      }), React.createElement(_SavedSearchesList.SavedSearchesList, {
        filterBarActor: this.context.filterBarActor,
        filterBarStore: this.context.filterBarStore
      }), this.context.filterBarStore.isConfigurable() && React.createElement(_ConfigurationButton.ConfigurationButton, {
        filterBarStore: this.context.filterBarStore
      }), this.context.filterBarStore.isExportable() && React.createElement(_ExportResultsButton.ExportResultsButton, {
        filterBarActor: this.context.filterBarActor
      }), React.createElement(_BatchActionsList.BatchActionsList, null)), React.createElement(_FilterDisplay.FilterDisplay, {
        filterBarActor: this.context.filterBarActor,
        filterBarStore: this.context.filterBarStore
      })));
    }
  }]);

  return FilterBar;
}(React.Component);

exports.FilterBar = FilterBar;
FilterBar.contextTypes = {
  filterBarActor: React.PropTypes.object,
  filterBarStore: React.PropTypes.object,
  tableStore: React.PropTypes.object,
  batchActionsStore: React.PropTypes.object
};

},{"./ApplyFiltersButton.react":9,"./BatchActionsList/BatchActionsList.react":10,"./ClearFiltersButton.react":12,"./ConfigurationButton.react":13,"./ExportResultsButton.react":14,"./FilterDisplay/FilterDisplay.react":16,"./FilterList/FilterList.react":28,"./SaveFiltersButton.react":30,"./SavedSearchesList/SavedSearchesList.react":31}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilterDisplay = void 0;

var _FilterInput = require("./FilterInput.react");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var FilterDisplay =
/*#__PURE__*/
function (_React$Component) {
  _inherits(FilterDisplay, _React$Component);

  function FilterDisplay(props) {
    var _this;

    _classCallCheck(this, FilterDisplay);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FilterDisplay).call(this, props));
    _this.state = {
      filters: props.enabledFilters
    };
    return _this;
  }

  _createClass(FilterDisplay, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var self = this;
      var quickFilters = this.context.filterBarStore.quickFilters;
      Object.keys(this.getStateFromStores().filters).map(function (filterUid) {
        Object.keys(quickFilters).map(function (blockName) {
          Object.keys(quickFilters[blockName]).map(function (filterName) {
            var quickFilter = quickFilters[blockName][filterName];

            if (quickFilter.filters && quickFilter.filters[filterUid]) {
              if (self.getStateFromStores().filters[filterUid].type == 'multi_select') {
                if (self.getStateFromStores().filters[filterUid].value.join(",") === quickFilter.filters[filterUid].value) quickFilter.active = true;
              } else {
                if (self.getStateFromStores().filters[filterUid].value === quickFilter.filters[filterUid].value) {
                  quickFilter.active = true;
                }
              }
            }
          });
        });
      });
      this.context.filterBarStore.addChangeListener(this.onChange.bind(this));
    }
  }, {
    key: "onChange",
    value: function onChange() {
      this.setState(this.getStateFromStores());
    }
  }, {
    key: "getStateFromStores",
    value: function getStateFromStores() {
      return {
        filters: this.context.filterBarStore.getEnabled()
      };
    }
  }, {
    key: "render",
    value: function render() {
      var filters = Object.keys(this.state.filters).map(function (filterUid) {
        var filter = this.state.filters[filterUid];
        return React.createElement(_FilterInput.FilterInput, {
          filterUid: filterUid,
          key: filterUid,
          label: filter.label,
          type: filter.type,
          value: filter.value,
          operator: filter.operator
        });
      }, this);

      if (filters.length === 0) {
        filters = React.createElement("div", null, "No Filters Enabled!");
      }

      return React.createElement("div", {
        className: "navbar filterbar"
      }, React.createElement("div", {
        className: "panel panel-default"
      }, filters));
    }
  }]);

  return FilterDisplay;
}(React.Component);

exports.FilterDisplay = FilterDisplay;
FilterDisplay.propTypes = {
  enabledFilters: React.PropTypes.object.isRequired
};
FilterDisplay.defaultProps = {
  enabledFilters: {}
};
FilterDisplay.contextTypes = {
  filterBarStore: React.PropTypes.object.isRequired,
  filterBarActor: React.PropTypes.object.isRequired
};

},{"./FilterInput.react":17}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilterInput = void 0;

var _FilterInputFactory = require("./FilterInputFactory.react");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var FilterInput =
/*#__PURE__*/
function (_React$Component) {
  _inherits(FilterInput, _React$Component);

  function FilterInput(props) {
    _classCallCheck(this, FilterInput);

    return _possibleConstructorReturn(this, _getPrototypeOf(FilterInput).call(this, props));
  }

  _createClass(FilterInput, [{
    key: "onClick",
    value: function onClick() {
      this.context.filterBarActor.disableFilter(this.props.filterUid);
    }
  }, {
    key: "objectProperties",
    value: function objectProperties() {
      var key = Date.now();
      return {
        filterUid: this.props.filterUid,
        key: key,
        value: this.props.value,
        type: this.props.type,
        operator: this.props.operator
      };
    }
  }, {
    key: "render",
    value: function render() {
      var propObject = this.objectProperties();
      var inputs = new _FilterInputFactory.FilterInputFactory(propObject);
      return React.createElement("div", {
        className: "col-lg-3 col-md-4 col-sm-6 col-xs-12 filter"
      }, React.createElement("ul", {
        className: this.filterKey
      }, React.createElement("li", null, React.createElement("i", {
        className: "btn btn-circle-primary btn-xs icon icon-close remove-filter",
        onClick: this.onClick.bind(this)
      }), React.createElement("label", null, this.props.label)), inputs));
    }
  }]);

  return FilterInput;
}(React.Component);

exports.FilterInput = FilterInput;
FilterInput.propTypes = {
  filterUid: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  value: React.PropTypes.node.isRequired
};
FilterInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};

},{"./FilterInputFactory.react":18}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilterInputFactory = FilterInputFactory;

var _TextInput = require("./Inputs/TextInput.react");

var _DateInput = require("./Inputs/DateInput.react");

var _DateTimeInput = require("./Inputs/DateTimeInput.react");

var _SingleDateTimeInput = require("./Inputs/SingleDateTimeInput.react");

var _SelectInput = require("./Inputs/SelectInput.react");

var _LazySelectInput = require("./Inputs/LazySelectInput.react");

var _RangeInput = require("./Inputs/RangeInput.react");

var _MultiSelectInput = require("./Inputs/MultiSelectInput.react");

var _LazyMultiSelectInput = require("./Inputs/LazyMultiSelectInput.react");

function FilterInputFactory(propObject) {
  // Janky way to ensure uniqueness of the input, so that it re-renders the
  // value in the input rather than just diffing based on input type.
  var inputs = {
    text: React.createElement(_TextInput.TextInput, propObject),
    id: React.createElement(_TextInput.TextInput, propObject),
    date: React.createElement(_DateInput.DateInput, propObject),
    date_time: React.createElement(_DateTimeInput.DateTimeInput, propObject),
    single_datetime: React.createElement(_SingleDateTimeInput.SingleDateTimeInput, propObject),
    select: React.createElement(_SelectInput.SelectInput, propObject),
    lazy_select: React.createElement(_LazySelectInput.LazySelectInput, propObject),
    range: React.createElement(_RangeInput.RangeInput, propObject),
    multi_select: React.createElement(_MultiSelectInput.MultiSelectInput, propObject),
    lazy_multi_select: React.createElement(_LazyMultiSelectInput.LazyMultiSelectInput, propObject)
  };

  if (inputs.hasOwnProperty(propObject.type)) {
    return inputs[propObject.type];
  }
}

},{"./Inputs/DateInput.react":19,"./Inputs/DateTimeInput.react":20,"./Inputs/LazyMultiSelectInput.react":21,"./Inputs/LazySelectInput.react":22,"./Inputs/MultiSelectInput.react":23,"./Inputs/RangeInput.react":24,"./Inputs/SelectInput.react":25,"./Inputs/SingleDateTimeInput.react":26,"./Inputs/TextInput.react":27}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateInput = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DateInput =
/*#__PURE__*/
function (_React$Component) {
  _inherits(DateInput, _React$Component);

  function DateInput(props) {
    var _this;

    _classCallCheck(this, DateInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DateInput).call(this, props));
    _this.state = {
      value: _this.props.value || {
        from: null,
        to: null
      }
    };
    return _this;
  }

  _createClass(DateInput, [{
    key: "onChange",
    value: function onChange(event) {
      var newValue = this.state.value;

      if (event.type === "dp") {
        newValue[event.target.querySelector("input").getAttribute("placeholder")] = event.target.querySelector("input").value;
      } else if (event.type === "input") {
        newValue[event.target.getAttribute("placeholder")] = event.target.value;
      }

      this.setState({
        value: newValue
      });
    }
  }, {
    key: "onBlur",
    value: function onBlur() {
      this.context.filterBarActor.updateFilter(this.props.filterUid, "value", this.state.value);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var datePickerFrom = $(React.findDOMNode(this.refs.dateRangeFrom));

      if (datePickerFrom.datetimepicker !== undefined) {
        datePickerFrom.datetimepicker({
          locale: 'en-au',
          format: 'L'
        });
        datePickerFrom.datetimepicker().on("dp.change", this.onChange.bind(this));
      }

      var datePickerTo = $(React.findDOMNode(this.refs.dateRangeTo));

      if (datePickerTo.datetimepicker !== undefined) {
        datePickerTo.datetimepicker({
          locale: 'en-au',
          format: 'L'
        });
        datePickerTo.datetimepicker().on("dp.change", this.onChange.bind(this));
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("li", null, React.createElement("div", {
        className: "input-group datepicker dateRangeFrom",
        ref: "dateRangeFrom"
      }, React.createElement("input", {
        "aria-required": "true",
        className: "form-control",
        "data-date-format": "DD/MM/YYYY",
        onBlur: this.onBlur.bind(this),
        onChange: this.onChange.bind(this),
        placeholder: "from",
        type: "text",
        value: this.state.value.from
      }), React.createElement("span", {
        className: "input-group-addon"
      }, React.createElement("span", {
        "aria-hidden": "true",
        className: "icon-calendar icon"
      }), React.createElement("span", {
        className: "sr-only icon icon-calendar"
      }, "Calendar"))), React.createElement("div", {
        className: "input-group datepicker dateRangeTo",
        ref: "dateRangeTo"
      }, React.createElement("input", {
        "aria-required": "true",
        className: "form-control",
        "data-date-format": "DD/MM/YYYY",
        onBlur: this.onBlur.bind(this),
        onChange: this.onChange.bind(this),
        placeholder: "to",
        type: "text",
        value: this.state.value.to
      }), React.createElement("span", {
        className: "input-group-addon"
      }, React.createElement("span", {
        "aria-hidden": "true",
        className: "icon-calendar icon"
      }), React.createElement("span", {
        className: "sr-only icon icon-calendar"
      }, "Calendar"))));
    }
  }]);

  return DateInput;
}(React.Component);

exports.DateInput = DateInput;
DateInput.propTypes = {
  filterUid: React.PropTypes.string.isRequired,
  value: React.PropTypes.node.isRequired
};
DateInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};

},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateTimeInput = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DateTimeInput =
/*#__PURE__*/
function (_React$Component) {
  _inherits(DateTimeInput, _React$Component);

  function DateTimeInput(props) {
    var _this;

    _classCallCheck(this, DateTimeInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DateTimeInput).call(this, props));
    _this.state = {
      value: _this.props.value || {
        from: null,
        to: null
      }
    };
    return _this;
  }

  _createClass(DateTimeInput, [{
    key: "onChange",
    value: function onChange(event) {
      var newValue = this.state.value;

      if (event.type === "dp") {
        newValue[event.target.querySelector("input").getAttribute("placeholder")] = event.target.querySelector("input").value;
      } else if (event.type === "input") {
        newValue[event.target.getAttribute("placeholder")] = event.target.value;
      }

      this.setState({
        value: newValue
      });
    }
  }, {
    key: "onBlur",
    value: function onBlur() {
      this.context.filterBarActor.updateFilter(this.props.filterUid, "value", this.state.value);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var dateTimePickerFrom = $(React.findDOMNode(this.refs.dateTimeRangeFrom));

      if (dateTimePickerFrom.datetimepicker !== undefined) {
        dateTimePickerFrom.datetimepicker({
          locale: 'en-au',
          format: 'LLL',
          sideBySide: false
        });
        dateTimePickerFrom.datetimepicker().on("dp.change", this.onChange.bind(this));
      }

      var dateTimePickerTo = $(React.findDOMNode(this.refs.dateTimeRangeTo));

      if (dateTimePickerTo.datetimepicker !== undefined) {
        dateTimePickerTo.datetimepicker({
          locale: 'en-au',
          format: 'LLL',
          sideBySide: false
        });
        dateTimePickerTo.datetimepicker().on("dp.change", this.onChange.bind(this));
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("li", null, React.createElement("div", {
        className: "input-group datepicker dateTimeRangeFrom",
        ref: "dateTimeRangeFrom"
      }, React.createElement("input", {
        "aria-required": "true",
        className: "form-control",
        "data-date-format": "DD/MM/YYYY HH:mm",
        onBlur: this.onBlur.bind(this),
        onChange: this.onChange.bind(this),
        placeholder: "from",
        type: "text",
        value: this.state.value.from
      }), React.createElement("span", {
        className: "input-group-addon"
      }, React.createElement("span", {
        "aria-hidden": "true",
        className: "icon-calendar icon"
      }), React.createElement("span", {
        className: "sr-only icon icon-calendar"
      }, "Calendar"))), React.createElement("div", {
        className: "input-group datepicker dateTimeRangeTo",
        ref: "dateTimeRangeTo"
      }, React.createElement("input", {
        "aria-required": "true",
        className: "form-control",
        "data-date-format": "DD/MM/YYYY HH:mm",
        onBlur: this.onBlur.bind(this),
        onChange: this.onChange.bind(this),
        placeholder: "to",
        type: "text",
        value: this.state.value.to
      }), React.createElement("span", {
        className: "input-group-addon"
      }, React.createElement("span", {
        "aria-hidden": "true",
        className: "icon-calendar icon"
      }), React.createElement("span", {
        className: "sr-only icon icon-calendar"
      }, "Calendar"))));
    }
  }]);

  return DateTimeInput;
}(React.Component);

exports.DateTimeInput = DateTimeInput;
DateTimeInput.propTypes = {
  filterUid: React.PropTypes.string.isRequired,
  value: React.PropTypes.node.isRequired
};
DateTimeInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};

},{}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LazyMultiSelectInput = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var LazyMultiSelectInput =
/*#__PURE__*/
function (_React$Component) {
  _inherits(LazyMultiSelectInput, _React$Component);

  function LazyMultiSelectInput(props, context) {
    var _this;

    _classCallCheck(this, LazyMultiSelectInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LazyMultiSelectInput).call(this, props, context));
    _this.state = {
      value: _this.props.value === '' ? _this.getDefaultValue() : _this.props.value,
      options: []
    };
    return _this;
  }

  _createClass(LazyMultiSelectInput, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var filter = this.getFilterFromFilterBarStore();
      this.setState({
        options: []
      });
      filter.value = this.state.value;
    }
  }, {
    key: "getFilterFromFilterBarStore",
    value: function getFilterFromFilterBarStore() {
      return this.context.filterBarStore.getFilter(this.props.filterUid);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var multiSelectInput = $(React.findDOMNode(this.refs.reactLazyMultiSelect));
      var filter = this.getFilterFromFilterBarStore();
      multiSelectInput.select2({
        minimumInputLength: filter.minimumInputLength || 3,
        multiple: true,
        ajax: {
          url: filter.url,
          quietMillis: 250,
          dataType: 'json',
          data: function data(term, page) {
            return {
              q: term
            };
          },
          results: function results(data, params) {
            return {
              results: $.map(data, function (item) {
                return {
                  text: item.label,
                  id: item.value
                };
              })
            };
          }
        },
        initSelection: function initSelection(element, callback) {
          var data = [];
          element.attr('value').split(',').forEach(function (value) {
            data.push({
              id: value,
              text: value
            });
          });
          callback(data);
        }
      });
      multiSelectInput.on('change', this.onSelect.bind(this));
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.serverRequest !== undefined) {
        this.serverRequest.abort();
      }
    }
  }, {
    key: "getDefaultValue",
    value: function getDefaultValue() {
      var filter = this.getFilterFromFilterBarStore();
      return [filter["default"]];
    }
  }, {
    key: "onSelect",
    value: function onSelect(event) {
      var filter = this.getFilterFromFilterBarStore();

      if (event.target.value === '') {
        filter.value = [];
      } else {
        filter.value = event.target.value.split(",");
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("li", null, React.createElement("input", {
        className: "form-control",
        value: this.state.value,
        ref: "reactLazyMultiSelect"
      }));
    }
  }]);

  return LazyMultiSelectInput;
}(React.Component);

exports.LazyMultiSelectInput = LazyMultiSelectInput;
LazyMultiSelectInput.propTypes = {
  filterUid: React.PropTypes.string.isRequired,
  value: React.PropTypes.node.isRequired
};
LazyMultiSelectInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};

},{}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LazySelectInput = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var LazySelectInput =
/*#__PURE__*/
function (_React$Component) {
  _inherits(LazySelectInput, _React$Component);

  function LazySelectInput(props, context) {
    var _this;

    _classCallCheck(this, LazySelectInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LazySelectInput).call(this, props, context));
    _this.state = {
      value: props.value,
      options: []
    };
    return _this;
  }

  _createClass(LazySelectInput, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var filter = this.context.filterBarStore.getFilter(this.props.filterUid);
      this.setState({
        options: []
      });
      filter.value = this.state.value;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var selectInput = $(React.findDOMNode(this.refs.reactLazySelect));
      var filter = this.context.filterBarStore.getFilter(this.props.filterUid);
      selectInput.select2({
        minimumInputLength: filter.minimumInputLength || 3,
        ajax: {
          url: filter.url,
          quietMillis: 250,
          dataType: 'json',
          data: function data(term, page) {
            return {
              q: term
            };
          },
          results: function results(data, params) {
            return {
              results: $.map(data, function (item) {
                return {
                  text: item.label,
                  id: item.value
                };
              })
            };
          }
        },
        initSelection: function initSelection(element, callback) {
          var value = element.attr('value');
          callback({
            id: value,
            text: value
          });
        }
      });
      selectInput.on('change', this.onSelect.bind(this));
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.serverRequest !== undefined) {
        this.serverRequest.abort();
      }
    }
  }, {
    key: "onSelect",
    value: function onSelect(event) {
      var filter = this.context.filterBarStore.getFilter(this.props.filterUid);
      filter.value = event.target.value;
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("li", null, React.createElement("input", {
        className: "form-control",
        value: this.state.value,
        ref: "reactLazySelect"
      }));
    }
  }]);

  return LazySelectInput;
}(React.Component);

exports.LazySelectInput = LazySelectInput;
LazySelectInput.propTypes = {
  filterUid: React.PropTypes.string.isRequired,
  value: React.PropTypes.node.isRequired
};
LazySelectInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};

},{}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MultiSelectInput = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var MultiSelectInput =
/*#__PURE__*/
function (_React$Component) {
  _inherits(MultiSelectInput, _React$Component);

  function MultiSelectInput(props, context) {
    var _this;

    _classCallCheck(this, MultiSelectInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MultiSelectInput).call(this, props, context));
    _this.state = {
      value: _this.props.value === '' ? _this.getDefaultValue() : _this.props.value,
      options: [],
      operator: _this.props.operator
    };
    return _this;
  }

  _createClass(MultiSelectInput, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var filter = this.getFilterFromFilterBarStore();
      this.serverRequest = $.get(filter.url, function (data) {
        _this2.setState({
          options: data
        });

        filter.value = _this2.state.value;
      });
    }
  }, {
    key: "getFilterFromFilterBarStore",
    value: function getFilterFromFilterBarStore() {
      return this.context.filterBarStore.getFilter(this.props.filterUid);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var multiSelectInput = $(React.findDOMNode(this.refs.reactMultiSelect));
      multiSelectInput.select2();
      multiSelectInput.on('change', this.onSelect.bind(this));
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.serverRequest.abort();
    }
  }, {
    key: "getDefaultValue",
    value: function getDefaultValue() {
      var filter = this.getFilterFromFilterBarStore();
      return [filter["default"]];
    }
  }, {
    key: "onSelect",
    value: function onSelect(event) {
      this.getFilterFromFilterBarStore().value = this.getSelectedValues();
    }
  }, {
    key: "getSelectedValues",
    value: function getSelectedValues() {
      var selectedValues = [];
      var targetOptions = React.findDOMNode(this.refs.reactMultiSelect).options;

      for (var i = 0; i < targetOptions.length; i++) {
        if (targetOptions[i].selected) {
          selectedValues.push(targetOptions[i].value);
        }
      }

      return selectedValues;
    }
  }, {
    key: "updateOperator",
    value: function updateOperator(e) {
      this.setState({
        operator: e.target.value,
        value: this.getSelectedValues()
      });
      this.getFilterFromFilterBarStore().operator = e.target.value;
    }
  }, {
    key: "render",
    value: function render() {
      var optionList = this.state.options;
      var options = optionList.map(function (option) {
        return React.createElement("option", {
          key: option.value,
          value: option.value
        }, option.label);
      }, this);
      return React.createElement("li", null, React.createElement("select", {
        className: "form-control",
        multiple: "multiple",
        selected: this.state.value,
        value: this.state.value,
        ref: "reactMultiSelect"
      }, options), this.props.operator && React.createElement("div", null, React.createElement("label", {
        className: "radio-inline"
      }, React.createElement("input", {
        type: "radio",
        name: "operator",
        value: "any",
        checked: this.state.operator == "any",
        onChange: this.updateOperator.bind(this)
      }), "ANY selected"), React.createElement("label", {
        className: "radio-inline"
      }, React.createElement("input", {
        type: "radio",
        name: "operator",
        value: "all",
        checked: this.state.operator == "all",
        onChange: this.updateOperator.bind(this)
      }), "ALL selected")));
    }
  }]);

  return MultiSelectInput;
}(React.Component);

exports.MultiSelectInput = MultiSelectInput;
MultiSelectInput.propTypes = {
  filterUid: React.PropTypes.string.isRequired,
  value: React.PropTypes.node.isRequired
};
MultiSelectInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};

},{}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RangeInput = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var RangeInput =
/*#__PURE__*/
function (_React$Component) {
  _inherits(RangeInput, _React$Component);

  function RangeInput(props) {
    var _this;

    _classCallCheck(this, RangeInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RangeInput).call(this, props));
    _this.state = {
      value: _this.props.value || {
        from: null,
        to: null
      }
    };
    return _this;
  }

  _createClass(RangeInput, [{
    key: "onChange",
    value: function onChange(event) {
      var newValue = this.state.value;

      if (event.type === "input") {
        newValue[event.target.getAttribute("placeholder")] = event.target.value;
      }

      this.setState({
        value: newValue
      });
    }
  }, {
    key: "onBlur",
    value: function onBlur() {
      this.context.filterBarActor.updateFilter(this.props.filterUid, "value", this.state.value);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("li", null, React.createElement("div", {
        className: "row"
      }, React.createElement("div", {
        className: "col-xs-6"
      }, React.createElement("input", {
        className: "form-control",
        onBlur: this.onBlur.bind(this),
        onChange: this.onChange.bind(this),
        placeholder: "from",
        value: this.state.value.from
      })), React.createElement("div", {
        className: "col-xs-6"
      }, React.createElement("input", {
        className: "form-control",
        onBlur: this.onBlur.bind(this),
        onChange: this.onChange.bind(this),
        placeholder: "to",
        value: this.state.value.to
      }))));
    }
  }]);

  return RangeInput;
}(React.Component);

exports.RangeInput = RangeInput;
RangeInput.propTypes = {
  filterUid: React.PropTypes.string.isRequired,
  value: React.PropTypes.node.isRequired
};
RangeInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};

},{}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectInput = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var SelectInput =
/*#__PURE__*/
function (_React$Component) {
  _inherits(SelectInput, _React$Component);

  function SelectInput(props, context) {
    var _this;

    _classCallCheck(this, SelectInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SelectInput).call(this, props, context));
    _this.state = {
      value: props.value,
      options: []
    };
    return _this;
  }

  _createClass(SelectInput, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var filter = this.context.filterBarStore.getFilter(this.props.filterUid);
      this.serverRequest = $.get(filter.url, function (data) {
        var firstOption = (data['options'] || data)[0] || {},
            defaultValue = _this2.stringValueOf(_this2.state.value) || _this2.stringValueOf(filter["default"]) || _this2.stringValueOf(firstOption.value);

        _this2.setState({
          options: data
        });

        if (defaultValue) {
          _this2.setState({
            value: defaultValue
          });

          filter.value = defaultValue;
        }
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.serverRequest.abort();
    }
  }, {
    key: "stringValueOf",
    value: function stringValueOf(value) {
      if (typeof value !== 'undefined' && value !== null) {
        return String(value);
      }

      return null;
    }
  }, {
    key: "onSelect",
    value: function onSelect(event) {
      this.setState({
        value: event.target.value
      });
      this.context.filterBarActor.updateFilter(this.props.filterUid, "value", event.target.value);
    }
  }, {
    key: "displayOption",
    value: function displayOption(option) {
      return React.createElement("option", {
        key: option.value,
        value: option.value
      }, option.label);
    }
  }, {
    key: "displayOptGroup",
    value: function displayOptGroup(group) {
      var _this3 = this;

      var optGroupOptions = group.options.map(function (option) {
        return _this3.displayOption(option);
      });
      return React.createElement("optgroup", {
        label: group.group
      }, optGroupOptions);
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var optionList = this.state.options || [];
      var options = optionList.map(function (option) {
        return option.group ? _this4.displayOptGroup(option) : _this4.displayOption(option);
      });
      return React.createElement("li", null, React.createElement("select", {
        className: "form-control",
        onChange: this.onSelect.bind(this),
        selected: this.state.value,
        value: this.state.value
      }, options));
    }
  }]);

  return SelectInput;
}(React.Component);

exports.SelectInput = SelectInput;
SelectInput.propTypes = {
  filterUid: React.PropTypes.string.isRequired,
  value: React.PropTypes.node.isRequired
};
SelectInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};

},{}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SingleDateTimeInput = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var SingleDateTimeInput =
/*#__PURE__*/
function (_React$Component) {
  _inherits(SingleDateTimeInput, _React$Component);

  function SingleDateTimeInput(props) {
    var _this;

    _classCallCheck(this, SingleDateTimeInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SingleDateTimeInput).call(this, props));
    var newValue = _this.props.value || {};

    if (_this.props.value === '') {
      newValue[_this.props.operator] = null;
    }

    _this.state = {
      value: newValue
    };
    return _this;
  }

  _createClass(SingleDateTimeInput, [{
    key: "onChange",
    value: function onChange(event) {
      var newValue = this.state.value;

      if (event.type === "dp") {
        newValue[this.props.operator] = event.target.querySelector("input").value;
      } else if (event.type === "input") {
        newValue[this.props.operator] = event.target.value;
      }

      this.setState({
        value: newValue
      });
    }
  }, {
    key: "onBlur",
    value: function onBlur() {
      this.context.filterBarActor.updateFilter(this.props.filterUid, "value", this.state.value);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var dateTimePicker = $(React.findDOMNode(this.refs.singleDateTimeValue));
      dateTimePicker.datetimepicker({
        locale: 'en-au'
      });
      dateTimePicker.datetimepicker().on("dp.change", this.onChange.bind(this));
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("li", null, React.createElement("div", {
        className: "input-group datepicker singleDateTimeValue",
        ref: "singleDateTimeValue"
      }, React.createElement("input", {
        "aria-required": "true",
        className: "form-control",
        "data-date-format": "DD/MM/YYYY hh:mm A",
        onBlur: this.onBlur.bind(this),
        onChange: this.onChange.bind(this),
        type: "text",
        value: this.state.value[this.props.operator]
      }), React.createElement("span", {
        className: "input-group-addon"
      }, React.createElement("span", {
        "aria-hidden": "true",
        className: "icon-calendar icon"
      }), React.createElement("span", {
        className: "sr-only icon icon-calendar"
      }, "Calendar"))));
    }
  }]);

  return SingleDateTimeInput;
}(React.Component);

exports.SingleDateTimeInput = SingleDateTimeInput;
SingleDateTimeInput.propTypes = {
  filterUid: React.PropTypes.string.isRequired,
  value: React.PropTypes.node.isRequired
};
SingleDateTimeInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};

},{}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextInput = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var TextInput =
/*#__PURE__*/
function (_React$Component) {
  _inherits(TextInput, _React$Component);

  function TextInput(props) {
    var _this;

    _classCallCheck(this, TextInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TextInput).call(this, props));
    _this.state = {
      value: _this.props.value
    };
    return _this;
  }

  _createClass(TextInput, [{
    key: "ComponentWillMount",
    value: function ComponentWillMount() {
      this.setState(this.getStateFromStores());
    }
  }, {
    key: "getStateFromStores",
    value: function getStateFromStores() {
      return {
        value: this.context.filterBarStore.getFilter(this.props.filterUid).value
      };
    }
  }, {
    key: "onChange",
    value: function onChange(event) {
      this.setState({
        value: event.target.value
      });
    } // Catch input losing focus rather than on changing, so that we don't trigger
    // a DOM reload until the component has finished being edited. This ties in
    // to the fact that they unique key is the timestamp, so we would otherwise
    // lose focus on every keystroke.

  }, {
    key: "onBlur",
    value: function onBlur() {
      this.context.filterBarActor.updateFilter(this.props.filterUid, "value", this.state.value);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("li", null, React.createElement("input", {
        className: "form-control",
        onBlur: this.onBlur.bind(this),
        onChange: this.onChange.bind(this),
        type: "text",
        value: this.state.value
      }));
    }
  }]);

  return TextInput;
}(React.Component);

exports.TextInput = TextInput;
TextInput.propTypes = {
  filterUid: React.PropTypes.string.isRequired,
  value: React.PropTypes.node.isRequired
};
TextInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};

},{}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilterList = void 0;

var _FilterListOption = require("./FilterListOption.react");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var FilterList =
/*#__PURE__*/
function (_React$Component) {
  _inherits(FilterList, _React$Component);

  function FilterList(props) {
    var _this;

    _classCallCheck(this, FilterList);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FilterList).call(this, props));
    _this.state = {
      filters: props.disabledFilters,
      searchTerm: ''
    };
    return _this;
  }

  _createClass(FilterList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.context.filterBarStore.addChangeListener(this.onChange.bind(this));
    }
  }, {
    key: "onChange",
    value: function onChange() {
      this.setState(this.getStateFromStores());
    }
  }, {
    key: "getStateFromStores",
    value: function getStateFromStores() {
      return {
        filters: this.context.filterBarStore.getDisabled()
      };
    }
  }, {
    key: "onSearchTermChange",
    value: function onSearchTermChange(event) {
      this.setState({
        searchTerm: event.target.value.toLowerCase()
      });
    }
  }, {
    key: "render",
    value: function render() {
      var optionKey = "";
      var filters = this.state.filters;
      var term = this.state.searchTerm;
      var uids = Object.keys(filters).filter(function (uid) {
        return filters[uid].label.toLowerCase().search(term) !== -1;
      });
      var filterOptions = uids.map(function (filterUid) {
        optionKey = "option-" + filterUid;
        return React.createElement(_FilterListOption.FilterListOption, {
          filterUid: filterUid,
          key: optionKey,
          label: filters[filterUid].label
        });
      }, this);
      return React.createElement("div", {
        className: "btn-group"
      }, React.createElement("button", {
        className: "btn btn-default dropdown-toggle",
        "data-toggle": "dropdown",
        type: "button"
      }, React.createElement("i", {
        className: "icon icon-add"
      }), "Add Filter", React.createElement("i", {
        className: "icon icon-chevron-down"
      })), React.createElement("div", {
        className: "dropdown-menu",
        role: "menu"
      }, React.createElement("input", {
        type: "text",
        placeholder: "Search",
        onChange: this.onSearchTermChange.bind(this)
      }), React.createElement("ul", {
        className: "filter-options"
      }, filterOptions)));
    }
  }]);

  return FilterList;
}(React.Component);

exports.FilterList = FilterList;
FilterList.contextTypes = {
  filterBarActor: React.PropTypes.object,
  filterBarStore: React.PropTypes.object
};
FilterList.propTypes = {
  disabledFilters: React.PropTypes.object.isRequired
};

},{"./FilterListOption.react":29}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilterListOption = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var FilterListOption =
/*#__PURE__*/
function (_React$Component) {
  _inherits(FilterListOption, _React$Component);

  function FilterListOption(props) {
    _classCallCheck(this, FilterListOption);

    return _possibleConstructorReturn(this, _getPrototypeOf(FilterListOption).call(this, props));
  }

  _createClass(FilterListOption, [{
    key: "onClick",
    value: function onClick() {
      this.context.filterBarActor.enableFilter(this.props.filterUid);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("li", null, React.createElement("a", {
        onClick: this.onClick.bind(this),
        style: {
          cursor: "pointer"
        }
      }, this.props.label));
    }
  }]);

  return FilterListOption;
}(React.Component);

exports.FilterListOption = FilterListOption;
FilterListOption.propTypes = {
  filterUid: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired
};
FilterListOption.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired
};

},{}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SaveFiltersButton = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var SaveFiltersButton =
/*#__PURE__*/
function (_React$Component) {
  _inherits(SaveFiltersButton, _React$Component);

  function SaveFiltersButton(props) {
    var _this;

    _classCallCheck(this, SaveFiltersButton);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SaveFiltersButton).call(this, props));
    _this.state = {
      configurationName: ""
    };
    return _this;
  }

  _createClass(SaveFiltersButton, [{
    key: "onClick",
    value: function onClick() {
      if (this.state.configurationName.trim() === '') {
        $.bootstrapGrowl("Search title can't be blank", {
          type: "danger"
        });
        return;
      }

      if (this.context.filterBarActor.saveFilters(this.state.configurationName.trim())) {
        $.bootstrapGrowl("Search saved sucessfully", {
          type: "success"
        });
      } else {
        $.bootstrapGrowl("No filters enabled, please add filter", {
          type: "danger"
        });
      }

      this.setState({
        configurationName: ''
      });
    }
  }, {
    key: "onChange",
    value: function onChange(event) {
      this.setState({
        configurationName: event.target.value
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: "btn-group"
      }, React.createElement("button", {
        className: "btn btn-default dropdown-toggle",
        "data-toggle": "dropdown",
        type: "button"
      }, "Save Search", React.createElement("i", {
        className: "icon icon-chevron-down"
      })), React.createElement("ul", {
        className: "dropdown-menu",
        role: "menu"
      }, React.createElement("li", null, React.createElement("form", {
        style: {
          margin: "0 16px"
        }
      }, React.createElement("label", null, "Search Title"), React.createElement("input", {
        className: "form-control",
        onChange: this.onChange.bind(this),
        type: "text",
        value: this.state.configurationName
      }), React.createElement("button", {
        className: "btn btn-primary",
        style: {
          marginTop: "5px"
        },
        onClick: this.onClick.bind(this),
        type: "button"
      }, "Save")))));
    }
  }]);

  return SaveFiltersButton;
}(React.Component);

exports.SaveFiltersButton = SaveFiltersButton;
SaveFiltersButton.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired
};

},{}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedSearchesList = void 0;

var _SavedSearchesListItem = require("./SavedSearchesListItem.react");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var SavedSearchesList =
/*#__PURE__*/
function (_React$Component) {
  _inherits(SavedSearchesList, _React$Component);

  function SavedSearchesList(props) {
    var _this;

    _classCallCheck(this, SavedSearchesList);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SavedSearchesList).call(this, props));
    _this.state = {};
    return _this;
  }

  _createClass(SavedSearchesList, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      this.setState(this.getStateFromStores());
      this.context.filterBarStore.addChangeListener(this.onChange.bind(this));
    }
  }, {
    key: "getStateFromStores",
    value: function getStateFromStores() {
      return {
        savedSearches: this.context.filterBarStore.getSavedSearches()
      };
    }
  }, {
    key: "onChange",
    value: function onChange() {
      this.setState(this.getStateFromStores());
    }
  }, {
    key: "render",
    value: function render() {
      var buttonClass = "btn btn-default dropdown-toggle";

      if (this.state.savedSearches.length === 0) {
        buttonClass += " disabled";
      }

      var savedSearches = this.state.savedSearches.map(function (savedSearch, index) {
        return React.createElement(_SavedSearchesListItem.SavedSearchesListItem, {
          key: index,
          name: savedSearch.name,
          searchId: index
        });
      }, this);
      return React.createElement("div", {
        className: "btn-group"
      }, React.createElement("button", {
        "aria-expanded": "false",
        className: buttonClass,
        "data-toggle": "dropdown",
        type: "button"
      }, React.createElement("i", {
        className: "icon icon-save"
      }), "Saved Searches", React.createElement("i", {
        className: "icon icon-chevron-down"
      })), React.createElement("ul", {
        className: "dropdown-menu",
        role: "menu"
      }, savedSearches));
    }
  }]);

  return SavedSearchesList;
}(React.Component);

exports.SavedSearchesList = SavedSearchesList;
SavedSearchesList.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};

},{"./SavedSearchesListItem.react":32}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedSearchesListItem = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var SavedSearchesListItem =
/*#__PURE__*/
function (_React$Component) {
  _inherits(SavedSearchesListItem, _React$Component);

  function SavedSearchesListItem(props) {
    _classCallCheck(this, SavedSearchesListItem);

    return _possibleConstructorReturn(this, _getPrototypeOf(SavedSearchesListItem).call(this, props));
  }

  _createClass(SavedSearchesListItem, [{
    key: "onClick",
    value: function onClick() {
      this.context.filterBarActor.loadSavedSearch(this.props.searchId);
    }
  }, {
    key: "onClickDelete",
    value: function onClickDelete() {
      this.context.filterBarActor.deleteSavedSearch(this.props.searchId);
    }
  }, {
    key: "render",
    value: function render() {
      var liStyles = {
        display: "inline-flex !important",
        width: "100%",
        marginBottom: "5px"
      };
      return React.createElement("li", {
        style: liStyles
      }, React.createElement("a", {
        className: "dynamic-text-filter",
        onClick: this.onClick.bind(this),
        style: {
          cursor: "pointer",
          marginRight: "39px"
        }
      }, this.props.name), React.createElement("a", {
        className: "btn btn-circle-danger btn-sm",
        title: "Delete",
        style: {
          position: "absolute",
          right: "4px"
        },
        onClick: this.onClickDelete.bind(this)
      }, React.createElement("span", {
        className: "icon icon-delete"
      })));
    }
  }]);

  return SavedSearchesListItem;
}(React.Component);

exports.SavedSearchesListItem = SavedSearchesListItem;
SavedSearchesListItem.propTypes = {
  name: React.PropTypes.string.isRequired,
  searchId: React.PropTypes.number.isRequired
};
SavedSearchesListItem.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired
};

},{}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilterableTable = void 0;

var _FilterBarActor = require("../actors/FilterBarActor");

var _TableActor = require("../actors/TableActor");

var _FilterBarStore = require("../stores/FilterBarStore");

var _TableStore = require("../stores/TableStore");

var _BatchActionsStore = require("../stores/BatchActionsStore");

var _FilterBar = require("./FilterBar/FilterBar.react");

var _Table = require("./Table/Table.react");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var FilterableTable =
/*#__PURE__*/
function (_React$Component) {
  _inherits(FilterableTable, _React$Component);

  function FilterableTable(props) {
    var _this;

    _classCallCheck(this, FilterableTable);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FilterableTable).call(this, props));
    _this.filterBarStore = new _FilterBarStore.FilterBarStore(props.filterBarConfiguration);
    _this.tableStore = new _TableStore.TableStore(props.tableConfiguration);
    _this.batchActionsStore = new _BatchActionsStore.BatchActionsStore(props.batchActionsConfiguration);
    _this.filterBarActor = new _FilterBarActor.FilterBarActor(_this.filterBarStore, _this.tableStore);
    _this.tableActor = new _TableActor.TableActor(_this.filterBarStore, _this.tableStore);
    return _this;
  }

  _createClass(FilterableTable, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        filterBarStore: this.filterBarStore,
        filterBarActor: this.filterBarActor,
        tableStore: this.tableStore,
        batchActionsStore: this.batchActionsStore,
        tableActor: this.tableActor
      };
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("div", null, React.createElement(_FilterBar.FilterBar, null), React.createElement(_Table.Table, null));
    }
  }]);

  return FilterableTable;
}(React.Component);

exports.FilterableTable = FilterableTable;
FilterableTable.childContextTypes = {
  filterBarStore: React.PropTypes.object,
  filterBarActor: React.PropTypes.object,
  tableStore: React.PropTypes.object,
  batchActionsStore: React.PropTypes.object,
  tableActor: React.PropTypes.object
};

},{"../actors/FilterBarActor":5,"../actors/TableActor":6,"../stores/BatchActionsStore":51,"../stores/FilterBarStore":52,"../stores/TableStore":53,"./FilterBar/FilterBar.react":15,"./Table/Table.react":45}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QuickFilters = void 0;

var _QuickFiltersBlock = require("./QuickFiltersBlock/QuickFiltersBlock.react");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var QuickFilters =
/*#__PURE__*/
function (_React$Component) {
  _inherits(QuickFilters, _React$Component);

  function QuickFilters(props) {
    _classCallCheck(this, QuickFilters);

    return _possibleConstructorReturn(this, _getPrototypeOf(QuickFilters).call(this, props));
  }

  _createClass(QuickFilters, [{
    key: "render",
    value: function render() {
      var quickFilters = this.context.filterBarStore.quickFilters;

      if (quickFilters !== undefined) {
        var filterBlocks = Object.keys(quickFilters).map(function (filter) {
          return React.createElement(_QuickFiltersBlock.QuickFiltersBlock, {
            filters: quickFilters[filter],
            name: filter,
            label: quickFilters[filter].label
          });
        }, this);
      } else {
        var filterBlocks = '';
      }

      return React.createElement("div", {
        className: "quick-filters"
      }, filterBlocks);
    }
  }]);

  return QuickFilters;
}(React.Component);

exports.QuickFilters = QuickFilters;
QuickFilters.contextTypes = {
  filterBarStore: React.PropTypes.object
};

},{"./QuickFiltersBlock/QuickFiltersBlock.react":35}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QuickFiltersBlock = void 0;

var _QuickFiltersButton = require("./QuickFiltersButton.react");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var QuickFiltersBlock =
/*#__PURE__*/
function (_React$Component) {
  _inherits(QuickFiltersBlock, _React$Component);

  function QuickFiltersBlock(props) {
    var _this;

    _classCallCheck(this, QuickFiltersBlock);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(QuickFiltersBlock).call(this, props));
    _this.state = {
      name: _this.props.name,
      label: _this.props.label
    };
    return _this;
  }

  _createClass(QuickFiltersBlock, [{
    key: "render",
    value: function render() {
      var filters = this.props.filters;
      var buttons = Object.keys(filters).map(function (filter) {
        if (filter != "label") {
          return React.createElement(_QuickFiltersButton.QuickFiltersButton, {
            filters: filters[filter],
            name: filter,
            blockName: this.state.name
          });
        }
      }, this);
      return React.createElement("div", null, this.props.label, React.createElement("div", {
        className: "btn-group quick-filters-block"
      }, buttons));
    }
  }]);

  return QuickFiltersBlock;
}(React.Component);

exports.QuickFiltersBlock = QuickFiltersBlock;

},{"./QuickFiltersButton.react":36}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QuickFiltersButton = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var QuickFiltersButton =
/*#__PURE__*/
function (_React$Component) {
  _inherits(QuickFiltersButton, _React$Component);

  function QuickFiltersButton(props) {
    var _this;

    _classCallCheck(this, QuickFiltersButton);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(QuickFiltersButton).call(this, props));
    _this.state = {
      name: _this.props.name,
      disabled: _this.props.filters.disabled,
      label: _this.props.filters.label,
      tooltip: _this.props.filters.tooltip,
      filters: _this.props.filters.filters,
      blockName: _this.props.blockName,
      quickFilterButton: _this.props.filters
    };
    return _this;
  }

  _createClass(QuickFiltersButton, [{
    key: "onClick",
    value: function onClick(e) {
      if (this.state.disabled) {
        e.stopPropagation();
      } else {
        this.context.filterBarActor.disableBlockFilters(this.state.blockName);
        Object.keys(this.state.filters).map(function (filter) {
          var clonedFilter = JSON.parse(JSON.stringify(this.state.filters[filter])); // avoid value to be overwritten when filter changes

          var value = clonedFilter.value;
          var filterName = clonedFilter.filter;
          this.context.filterBarActor.applyQuickFilter(filterName, value, this.state.name, this.state.blockName);
        }, this);
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.context.filterBarStore.addChangeListener(this.onChange.bind(this));
    }
  }, {
    key: "onChange",
    value: function onChange(e) {
      this.forceUpdate();
    }
  }, {
    key: "buttonClasses",
    value: function buttonClasses() {
      var klasses = 'btn quick-filters-button';
      if (this.state.quickFilterButton.active === true) klasses += ' btn-primary disabled';else klasses += ' btn-default';
      if (this.state.disabled) klasses += ' btn-danger';
      return klasses;
    }
  }, {
    key: "button",
    value: function button() {
      return React.createElement("button", {
        className: this.buttonClasses(),
        type: "button",
        onClick: this.onClick.bind(this)
      }, this.state.label);
    }
  }, {
    key: "tooltip",
    value: function tooltip() {
      return React.createElement(ReactBootstrap.Tooltip, {
        id: "quick-filters-tooltip"
      }, this.state.tooltip);
    }
  }, {
    key: "disabledTooltip",
    value: function disabledTooltip() {
      return React.createElement(ReactBootstrap.Tooltip, {
        id: "quick-filters-tooltip"
      }, this.state.disabled);
    }
  }, {
    key: "render",
    value: function render() {
      if (this.state.disabled) {
        return React.createElement(ReactBootstrap.OverlayTrigger, {
          placement: "top",
          overlay: this.disabledTooltip()
        }, this.button());
      } else {
        return React.createElement(ReactBootstrap.OverlayTrigger, {
          placement: "top",
          overlay: this.tooltip()
        }, this.button());
      }
    }
  }]);

  return QuickFiltersButton;
}(React.Component);

exports.QuickFiltersButton = QuickFiltersButton;
QuickFiltersButton.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object
};

},{}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Body = void 0;

var _BodyRow = require("./BodyRow.react");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Body =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Body, _React$Component);

  function Body(props) {
    _classCallCheck(this, Body);

    return _possibleConstructorReturn(this, _getPrototypeOf(Body).call(this, props));
  }

  _createClass(Body, [{
    key: "render",
    value: function render() {
      var rows = this.props.rows.map(function (cells, index) {
        return React.createElement(_BodyRow.BodyRow, {
          cells: cells,
          key: index,
          displayTable: this.props.displayTable
        });
      }, this);
      return React.createElement("tbody", null, rows);
    }
  }]);

  return Body;
}(React.Component);

exports.Body = Body;
Body.propTypes = {
  rows: React.PropTypes.array.isRequired
};
Body.contextTypes = {
  tableStore: React.PropTypes.object.isRequired,
  tableActor: React.PropTypes.object.isRequired
};

},{"./BodyRow.react":39}],38:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BodyCell = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var BodyCell =
/*#__PURE__*/
function (_React$Component) {
  _inherits(BodyCell, _React$Component);

  function BodyCell(props) {
    _classCallCheck(this, BodyCell);

    return _possibleConstructorReturn(this, _getPrototypeOf(BodyCell).call(this, props));
  }

  _createClass(BodyCell, [{
    key: "render",
    value: function render() {
      var content = this.props.value;
      return React.createElement("td", {
        style: this.props.style,
        dangerouslySetInnerHTML: {
          __html: content
        }
      });
    }
  }]);

  return BodyCell;
}(React.Component);

exports.BodyCell = BodyCell;
BodyCell.propTypes = {
  value: React.PropTypes.string.isRequired
};

},{}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BodyRow = void 0;

var _BodyCell = require("./BodyCell.react");

var _BodySelectable = require("./BodySelectable.react");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var BodyRow =
/*#__PURE__*/
function (_React$Component) {
  _inherits(BodyRow, _React$Component);

  function BodyRow(props) {
    _classCallCheck(this, BodyRow);

    return _possibleConstructorReturn(this, _getPrototypeOf(BodyRow).call(this, props));
  }

  _createClass(BodyRow, [{
    key: "displaySelectableColumn",
    value: function displaySelectableColumn() {
      if (this.context.tableStore.getSelectableColumn() !== undefined) {
        var selectValue = this.props.cells[this.context.tableStore.getSelectableColumn()].toString();
        var selectableStyles;

        if (this.props.displayTable === 'scroll') {
          selectableStyles = {
            position: "relative"
          };
        }

        return React.createElement(_BodySelectable.BodySelectable, {
          value: selectValue,
          key: selectValue,
          style: selectableStyles
        });
      }
    }
  }, {
    key: "displayValueFor",
    value: function displayValueFor(value) {
      return String(value === null ? "" : value);
    }
  }, {
    key: "render",
    value: function render() {
      var columns = this.context.tableStore.getColumns();
      var cellKeys = Object.keys(columns);
      var cells = Object.keys(columns).map(function (columnId, index) {
        var cellStyles;

        if (this.props.displayTable === 'fix' && index == cellKeys.length - 1) {
          cellStyles = {
            position: "relative",
            zIndex: 1,
            whiteSpace: "nowrap"
          };
        } else if (this.props.displayTable === 'scroll' && index < cellKeys.length - 1) {
          cellStyles = {
            position: "relative"
          };
        } else if (this.props.displayTable === 'scroll' && index == cellKeys.length - 1) {
          cellStyles = {
            whiteSpace: "nowrap"
          };
        }

        return React.createElement(_BodyCell.BodyCell, {
          key: columnId,
          type: columns[columnId].type,
          value: this.displayValueFor(this.props.cells[columnId]),
          style: cellStyles
        });
      }, this);
      var displaySelectableColumn = this.displaySelectableColumn();
      return React.createElement("tr", null, displaySelectableColumn, cells);
    }
  }]);

  return BodyRow;
}(React.Component);

exports.BodyRow = BodyRow;
BodyRow.propTypes = {
  cells: React.PropTypes.object.isRequired
};
BodyRow.contextTypes = {
  tableStore: React.PropTypes.object.isRequired,
  tableActor: React.PropTypes.object.isRequired
};

},{"./BodyCell.react":38,"./BodySelectable.react":40}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BodySelectable = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var BodySelectable =
/*#__PURE__*/
function (_React$Component) {
  _inherits(BodySelectable, _React$Component);

  function BodySelectable(props) {
    var _this;

    _classCallCheck(this, BodySelectable);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BodySelectable).call(this, props));
    _this.state = {
      isChecked: false
    };
    return _this;
  }

  _createClass(BodySelectable, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      this.setState(this.getCheckedState());
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps() {
      this.setState(this.getCheckedState());
    }
  }, {
    key: "addToOrRemoveFromSelection",
    value: function addToOrRemoveFromSelection(event) {
      if (event.target.checked) {
        this.context.tableStore.pushValueToSelectedRows(event.target.value);
      } else {
        this.context.tableStore.removeFromSelectedRows(event.target.value);
      }

      this.setState(this.getCheckedState());
      this.context.tableStore.emitChange();
    }
  }, {
    key: "getCheckedState",
    value: function getCheckedState() {
      return {
        isChecked: this.context.tableStore.valueInSelectedRows(this.props.value)
      };
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("td", {
        style: this.props.style
      }, React.createElement("input", {
        type: "checkbox",
        value: this.props.value,
        onChange: this.addToOrRemoveFromSelection.bind(this),
        checked: this.state.isChecked
      }));
    }
  }]);

  return BodySelectable;
}(React.Component);

exports.BodySelectable = BodySelectable;
BodySelectable.propTypes = {
  value: React.PropTypes.string.isRequired
};
BodySelectable.contextTypes = {
  tableStore: React.PropTypes.object.isRequired,
  tableActor: React.PropTypes.object.isRequired
};

},{}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeadingCell = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var HeadingCell =
/*#__PURE__*/
function (_React$Component) {
  _inherits(HeadingCell, _React$Component);

  function HeadingCell(props) {
    _classCallCheck(this, HeadingCell);

    return _possibleConstructorReturn(this, _getPrototypeOf(HeadingCell).call(this, props));
  }

  _createClass(HeadingCell, [{
    key: "queryName",
    value: function queryName() {
      return "order[" + this.props.sortable + "]";
    }
  }, {
    key: "currentSortOrder",
    value: function currentSortOrder() {
      return this.context.tableStore.getUrl().query(true)[this.queryName()];
    }
  }, {
    key: "nextSortOrder",
    value: function nextSortOrder() {
      return this.currentSortOrder() === "asc" ? "desc" : "asc";
    }
  }, {
    key: "sortTable",
    value: function sortTable() {
      if (this.props.sortable !== undefined) {
        this.context.tableStore.setUrl(this.context.tableStore.getUrl().removeQuery(/^order\[.*\]/).setQuery(this.queryName(), this.nextSortOrder()));
        this.context.tableActor.fetchData(1);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var content = this.props.value;

      if (this.props.sortable !== undefined) {
        var style = {
          cursor: "pointer"
        };
        return React.createElement("th", {
          className: ["sortable", this.currentSortOrder()].join(" "),
          onClick: this.sortTable.bind(this),
          style: Object.assign(style, this.props.style)
        }, content);
      } else {
        return React.createElement("th", {
          style: this.props.style
        }, content);
      }
    }
  }]);

  return HeadingCell;
}(React.Component);

exports.HeadingCell = HeadingCell;
HeadingCell.propTypes = {
  value: React.PropTypes.string.isRequired
};
HeadingCell.contextTypes = {
  tableStore: React.PropTypes.object.isRequired,
  tableActor: React.PropTypes.object.isRequired
};

},{}],42:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeadingRow = void 0;

var _HeadingCell = require("./HeadingCell.react");

var _HeadingSelectable = require("./HeadingSelectable.react");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var HeadingRow =
/*#__PURE__*/
function (_React$Component) {
  _inherits(HeadingRow, _React$Component);

  function HeadingRow(props) {
    _classCallCheck(this, HeadingRow);

    return _possibleConstructorReturn(this, _getPrototypeOf(HeadingRow).call(this, props));
  }

  _createClass(HeadingRow, [{
    key: "displaySelectableColumn",
    value: function displaySelectableColumn() {
      var selectableColumn = this.context.tableStore.getSelectableColumn();

      if (selectableColumn !== undefined) {
        var selectableKey = 'select_all_' + this.context.tableStore.getCurrentPage();
        var selectableStyles;

        if (this.props.displayTable === 'scroll') {
          selectableStyles = {
            position: "relative"
          };
        }

        return React.createElement(_HeadingSelectable.HeadingSelectable, {
          index: this.props.key,
          key: selectableKey,
          style: selectableStyles
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var cellKeys = Object.keys(this.props.cells);
      var cells = cellKeys.map(function (cellId, index) {
        var cellStyles;

        if (this.props.displayTable === 'fix' && index == cellKeys.length - 1) {
          cellStyles = {
            position: "relative",
            zIndex: 1,
            whiteSpace: "nowrap"
          };
        } else if (this.props.displayTable === 'scroll' && index < cellKeys.length - 1) {
          cellStyles = {
            position: "relative"
          };
        } else if (this.props.displayTable === 'scroll' && index == cellKeys.length - 1) {
          cellStyles = {
            whiteSpace: "nowrap"
          };
        }

        return React.createElement(_HeadingCell.HeadingCell, {
          key: cellId,
          type: this.props.cells[cellId].type,
          value: this.props.cells[cellId].heading,
          sortable: this.props.cells[cellId].sortable,
          style: cellStyles
        });
      }, this);
      var displaySelectableColumn = this.displaySelectableColumn();
      return React.createElement("thead", null, React.createElement("tr", null, displaySelectableColumn, cells));
    }
  }]);

  return HeadingRow;
}(React.Component);

exports.HeadingRow = HeadingRow;
HeadingRow.propTypes = {
  cells: React.PropTypes.object.isRequired
};
HeadingRow.contextTypes = {
  tableStore: React.PropTypes.object.isRequired,
  tableActor: React.PropTypes.object.isRequired
};

},{"./HeadingCell.react":41,"./HeadingSelectable.react":43}],43:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeadingSelectable = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var HeadingSelectable =
/*#__PURE__*/
function (_React$Component) {
  _inherits(HeadingSelectable, _React$Component);

  function HeadingSelectable(props) {
    var _this;

    _classCallCheck(this, HeadingSelectable);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HeadingSelectable).call(this, props));
    _this.state = {
      isChecked: false
    };
    return _this;
  }

  _createClass(HeadingSelectable, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      this.setState(this.getCheckedState());
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps() {
      this.setState(this.getCheckedState());
    }
  }, {
    key: "addRemoveAllFromSelection",
    value: function addRemoveAllFromSelection(event) {
      if (event.target.checked) {
        this.context.tableStore.pushAllValuesToSelectedRows();
      } else {
        this.context.tableStore.removeAllValuesFromSelectedRows();
      }

      this.setState(this.getCheckedState());
      this.context.tableStore.emitChange();
    }
  }, {
    key: "getCheckedState",
    value: function getCheckedState() {
      return {
        isChecked: this.context.tableStore.allSelectableValuesInSelectedRows()
      };
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("th", {
        style: this.props.style
      }, React.createElement("input", {
        type: "checkbox",
        onChange: this.addRemoveAllFromSelection.bind(this),
        checked: this.state.isChecked
      }));
    }
  }]);

  return HeadingSelectable;
}(React.Component);

exports.HeadingSelectable = HeadingSelectable;
HeadingSelectable.contextTypes = {
  tableStore: React.PropTypes.object.isRequired,
  tableActor: React.PropTypes.object.isRequired
};

},{}],44:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pagination = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Pagination =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Pagination, _React$Component);

  function Pagination(props) {
    var _this;

    _classCallCheck(this, Pagination);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Pagination).call(this, props));
    _this.MAX_PAGE_LINKS = 11;
    return _this;
  }

  _createClass(Pagination, [{
    key: "goToFirstPage",
    value: function goToFirstPage() {
      this.context.tableActor.fetchData(1);
    }
  }, {
    key: "goToLastPage",
    value: function goToLastPage() {
      this.context.tableActor.fetchData(this.props.totalPages);
    }
  }, {
    key: "goToPage",
    value: function goToPage(event) {
      this.context.tableActor.fetchData(event.target.innerHTML);
    }
  }, {
    key: "render",
    value: function render() {
      var pageLinks = [];
      pageLinks.push(React.createElement("li", {
        key: "first"
      }, React.createElement("a", {
        onClick: this.goToFirstPage.bind(this),
        style: {
          cursor: "pointer"
        }
      }, "First")));
      var lowestPageLink = 1,
          highestPageLink = 1;

      if (this.props.totalPages < this.MAX_PAGE_LINKS) {
        lowestPageLink = 1;
        highestPageLink = this.props.totalPages;
      } else if (this.props.currentPage <= Math.floor(this.MAX_PAGE_LINKS / 2)) {
        lowestPageLink = 1;
        highestPageLink = this.MAX_PAGE_LINKS;
      } else if (this.props.currentPage >= this.props.totalPages - Math.floor(this.MAX_PAGE_LINKS / 2)) {
        lowestPageLink = this.props.totalPages - this.MAX_PAGE_LINKS;
        highestPageLink = this.props.totalPages;
      } else {
        lowestPageLink = this.props.currentPage - Math.floor(this.MAX_PAGE_LINKS / 2);
        highestPageLink = lowestPageLink + this.MAX_PAGE_LINKS;
      }

      for (var page = lowestPageLink, classes = ""; page <= highestPageLink; page++, classes = "") {
        if (page === this.props.currentPage) {
          classes = "active";
        }

        pageLinks.push(React.createElement("li", {
          className: classes,
          key: page
        }, React.createElement("a", {
          onClick: this.goToPage.bind(this),
          style: {
            cursor: "pointer"
          }
        }, page)));
      }

      pageLinks.push(React.createElement("li", {
        key: "last"
      }, React.createElement("a", {
        onClick: this.goToLastPage.bind(this),
        style: {
          cursor: "pointer"
        }
      }, "Last")));
      return React.createElement("nav", null, React.createElement("ul", {
        className: "pagination"
      }, pageLinks));
    }
  }]);

  return Pagination;
}(React.Component);

exports.Pagination = Pagination;
Pagination.propTypes = {
  currentPage: React.PropTypes.number.isRequired,
  totalPages: React.PropTypes.number.isRequired
};
Pagination.contextTypes = {
  tableActor: React.PropTypes.object.isRequired,
  tableStore: React.PropTypes.object.isRequired
};

},{}],45:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Table = void 0;

var _Body = require("./Body.react");

var _TableCaption = require("./TableCaption.react");

var _HeadingRow = require("./HeadingRow.react");

var _Pagination = require("./Pagination.react");

var TableEvent = _interopRequireWildcard(require("../../events/TableEvent"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Table =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Table, _React$Component);

  function Table(props) {
    var _this;

    _classCallCheck(this, Table);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Table).call(this, props));
    _this.state = {
      currentPage: 1,
      totalPages: 1
    };
    return _this;
  }

  _createClass(Table, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      this.context.tableActor.fetchData();
      this.setState(this.getStateFromStores());
      this.context.tableStore.addChangeListener(this.onChange.bind(this));
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      TableEvent.tableUpdated();
    }
  }, {
    key: "onChange",
    value: function onChange() {
      this.setState(this.getStateFromStores());
    }
  }, {
    key: "getStateFromStores",
    value: function getStateFromStores() {
      return {
        columnHeadings: this.context.tableStore.getColumns(),
        rows: this.context.tableStore.getRows(),
        currentPage: this.context.tableStore.getCurrentPage(),
        totalPages: this.context.tableStore.getTotalPages(),
        tableCaption: this.context.tableStore.getTableCaption(),
        fixRightColumn: this.context.tableStore.getFixRightColumn()
      };
    }
  }, {
    key: "render",
    value: function render() {
      var headings = this.state.columnHeadings;
      var tableCaption = this.state.tableCaption;

      if (this.state.fixRightColumn === 'true') {
        return React.createElement("div", {
          className: "panel panel-responsive"
        }, React.createElement(_TableCaption.TableCaption, {
          value: tableCaption,
          outputDiv: true
        }), React.createElement("div", {
          className: "table-responsive",
          style: {
            position: "relative"
          }
        }, React.createElement("div", {
          style: {
            position: "absolute",
            right: 0,
            minWidth: "100%"
          }
        }, React.createElement("table", {
          className: "table table-hover table-striped"
        }, React.createElement(_HeadingRow.HeadingRow, {
          cells: headings,
          displayTable: 'fix'
        }), React.createElement(_Body.Body, {
          rows: this.state.rows,
          displayTable: 'fix'
        }))), React.createElement("div", {
          style: {
            overflowX: "auto"
          }
        }, React.createElement("table", {
          className: "table table-hover table-striped"
        }, React.createElement(_HeadingRow.HeadingRow, {
          cells: headings,
          displayTable: 'scroll'
        }), React.createElement(_Body.Body, {
          rows: this.state.rows,
          displayTable: 'scroll'
        })))), React.createElement(_Pagination.Pagination, {
          currentPage: this.state.currentPage,
          totalPages: this.state.totalPages
        }));
      } else {
        return React.createElement("div", {
          className: "panel panel-responsive"
        }, React.createElement("div", {
          className: "table-responsive"
        }, React.createElement("table", {
          className: "table table-hover table-striped"
        }, React.createElement(_TableCaption.TableCaption, {
          value: tableCaption
        }), React.createElement(_HeadingRow.HeadingRow, {
          cells: headings
        }), React.createElement(_Body.Body, {
          rows: this.state.rows
        })), React.createElement(_Pagination.Pagination, {
          currentPage: this.state.currentPage,
          totalPages: this.state.totalPages
        })));
      }
    }
  }]);

  return Table;
}(React.Component);

exports.Table = Table;
Table.contextTypes = {
  tableActor: React.PropTypes.object.isRequired,
  tableStore: React.PropTypes.object.isRequired
};

},{"../../events/TableEvent":47,"./Body.react":37,"./HeadingRow.react":42,"./Pagination.react":44,"./TableCaption.react":46}],46:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TableCaption = void 0;

var _QuickFilters = require("../QuickFilters/QuickFilters.react");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var TableCaption =
/*#__PURE__*/
function (_React$Component) {
  _inherits(TableCaption, _React$Component);

  function TableCaption(props) {
    _classCallCheck(this, TableCaption);

    return _possibleConstructorReturn(this, _getPrototypeOf(TableCaption).call(this, props));
  }

  _createClass(TableCaption, [{
    key: "render",
    value: function render() {
      var content = this.props.value;

      if (this.props.outputDiv) {
        if (content) {
          return React.createElement("div", {
            className: "clearfix",
            style: {
              marginBottom: "5px"
            }
          }, React.createElement("div", {
            className: "pull-left"
          }, content), React.createElement("div", {
            className: "pull-right"
          }, React.createElement(_QuickFilters.QuickFilters, null)));
        } else {
          return React.createElement("div", null);
        }
      } else {
        if (content) {
          return React.createElement("caption", null, React.createElement("div", {
            className: "pull-left"
          }, content), React.createElement("div", {
            className: "pull-right"
          }, React.createElement(_QuickFilters.QuickFilters, null)));
        } else {
          return React.createElement("caption", {
            hidden: true
          });
        }
      }
    }
  }]);

  return TableCaption;
}(React.Component);

exports.TableCaption = TableCaption;

},{"../QuickFilters/QuickFilters.react":34}],47:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tableUpdated = tableUpdated;

function tableUpdated() {
  var event = document.createEvent('Event');
  event.initEvent('react-filterbar:table-updated', true, true);
  document.dispatchEvent(event);
}

},{}],48:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilterVerificator = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var uri = require("URIjs");

var FilterVerificator =
/*#__PURE__*/
function () {
  function FilterVerificator(configurationFilters) {
    var filtersToApply = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, FilterVerificator);

    this.configurationFilters = configurationFilters;
    this.filtersToApply = filtersToApply || this.urlFilters();
  }

  _createClass(FilterVerificator, [{
    key: "verify",
    value: function verify() {
      return Object.keys(this.filtersToApply).every(function (i) {
        return this.validateFilter(this.filtersToApply[i]);
      }.bind(this));
    }
  }, {
    key: "validateFilter",
    value: function validateFilter(appliedFilter) {
      return Object.keys(this.configurationFilters).some(function (filterUid) {
        var confFilter = this.configurationFilters[filterUid];
        return this.validateFilterProperties(appliedFilter.field, confFilter.field) && this.validateFilterProperties(appliedFilter.type, confFilter.type) && this.validateFilterProperties(appliedFilter.uid, filterUid);
      }.bind(this));
    }
  }, {
    key: "validateFilterProperties",
    value: function validateFilterProperties(appliedFilterProperty, confFilterProperty) {
      return typeof appliedFilterProperty == 'undefined' || appliedFilterProperty == confFilterProperty;
    }
  }, {
    key: "urlFilters",
    value: function urlFilters() {
      var urlFiltersJson = uri(window.location).query(true).q;
      return urlFiltersJson && JSON.parse(urlFiltersJson) || {};
    }
  }]);

  return FilterVerificator;
}();

exports.FilterVerificator = FilterVerificator;

},{"URIjs":3}],49:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.displayModalForData = displayModalForData;

function displayModalForData(data) {
  var modalContainer = $("#modal");
  var modal = $(".modal", modalContainer);
  modalContainer.on("ajax:success", ".modal-content form", function (data, status, xhr) {
    modal.modal("hide");
  });
  modal.html(data);
  modal.modal();
}

},{}],50:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateApplicationUrlState = updateApplicationUrlState;
exports.updateUrlSearch = updateUrlSearch;
exports.redirectUrl = redirectUrl;

var uri = require("URIjs");

function updateApplicationUrlState(url) {
  history.pushState({}, "", window.location.origin + url);
  localStorage[window.location.pathname.replace(/\//g, "")] = url.search();
}

function updateUrlSearch(url, field, value) {
  return uri(url).removeSearch(field).addSearch(field, value);
}

function redirectUrl(url) {
  window.location.href = url;
}

},{"URIjs":3}],51:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BatchActionsStore = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BatchActionsStore =
/*#__PURE__*/
function () {
  function BatchActionsStore(configuration) {
    _classCallCheck(this, BatchActionsStore);

    this.actions = configuration.actions;
  }

  _createClass(BatchActionsStore, [{
    key: "getActions",
    value: function getActions() {
      return this.actions;
    }
  }]);

  return BatchActionsStore;
}();

exports.BatchActionsStore = BatchActionsStore;

},{}],52:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilterBarStore = void 0;

var _SearchClient = require("../clients/SearchClient");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FilterBarStore =
/*#__PURE__*/
function () {
  function FilterBarStore(configuration) {
    _classCallCheck(this, FilterBarStore);

    this.CHANGE_EVENT = "change";
    this.eventEmitter = new EventEmitter();
    this.id = configuration.id;
    this.persistent = configuration.persistent;
    this.url = configuration.searchUrl;
    this.searchUrl = configuration.searchUrl;
    this.savedSearchesUrl = configuration.savedSearchesUrl;
    this.configurationUrl = configuration.configurationUrl;
    this.exportResultsUrl = configuration.exportResultsUrl;
    this.exportPageLimit = configuration.exportPageLimit;
    this.exportPageLimitExceededMessage = configuration.exportPageLimitExceededMessage;
    this.filters = configuration.filters;
    this.quickFilters = configuration.quickFilters || {};

    if (this.savedSearchesUrl !== undefined) {
      (0, _SearchClient.getSavedSearches)(this.savedSearchesUrl, this.setSavedSearches.bind(this));
    }
  }

  _createClass(FilterBarStore, [{
    key: "enabledFilters",
    value:
    /*#__PURE__*/
    regeneratorRuntime.mark(function enabledFilters() {
      var filterUid;
      return regeneratorRuntime.wrap(function enabledFilters$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.t0 = regeneratorRuntime.keys(this.filters);

            case 1:
              if ((_context.t1 = _context.t0()).done) {
                _context.next = 8;
                break;
              }

              filterUid = _context.t1.value;

              if (!(this.filters.hasOwnProperty(filterUid) && this.filters[filterUid].enabled)) {
                _context.next = 6;
                break;
              }

              _context.next = 6;
              return [filterUid, this.filters[filterUid]];

            case 6:
              _context.next = 1;
              break;

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, enabledFilters, this);
    })
  }, {
    key: "disabledFilters",
    value:
    /*#__PURE__*/
    regeneratorRuntime.mark(function disabledFilters() {
      var filterUid;
      return regeneratorRuntime.wrap(function disabledFilters$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.t0 = regeneratorRuntime.keys(this.filters);

            case 1:
              if ((_context2.t1 = _context2.t0()).done) {
                _context2.next = 8;
                break;
              }

              filterUid = _context2.t1.value;

              if (!(this.filters.hasOwnProperty(filterUid) && !this.filters[filterUid].enabled)) {
                _context2.next = 6;
                break;
              }

              _context2.next = 6;
              return [filterUid, this.filters[filterUid]];

            case 6:
              _context2.next = 1;
              break;

            case 8:
            case "end":
              return _context2.stop();
          }
        }
      }, disabledFilters, this);
    })
  }, {
    key: "selectFilters",
    value:
    /*#__PURE__*/
    regeneratorRuntime.mark(function selectFilters() {
      var filterUid;
      return regeneratorRuntime.wrap(function selectFilters$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.t0 = regeneratorRuntime.keys(this.filters);

            case 1:
              if ((_context3.t1 = _context3.t0()).done) {
                _context3.next = 8;
                break;
              }

              filterUid = _context3.t1.value;

              if (!(this.filters.hasOwnProperty(filterUid) && this.filters[filterUid].url !== null)) {
                _context3.next = 6;
                break;
              }

              _context3.next = 6;
              return this.filters[filterUid];

            case 6:
              _context3.next = 1;
              break;

            case 8:
            case "end":
              return _context3.stop();
          }
        }
      }, selectFilters, this);
    })
  }, {
    key: "quickFiltersGenerator",
    value:
    /*#__PURE__*/
    regeneratorRuntime.mark(function quickFiltersGenerator(quickFilters) {
      var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, quickFilter, property;

      return regeneratorRuntime.wrap(function quickFiltersGenerator$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context4.prev = 3;
              _iterator = quickFilters[Symbol.iterator]();

            case 5:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context4.next = 18;
                break;
              }

              quickFilter = _step.value;
              _context4.t0 = regeneratorRuntime.keys(quickFilter.filters);

            case 8:
              if ((_context4.t1 = _context4.t0()).done) {
                _context4.next = 15;
                break;
              }

              property = _context4.t1.value;

              if (!quickFilter.filters.hasOwnProperty(property)) {
                _context4.next = 13;
                break;
              }

              _context4.next = 13;
              return [quickFilter, property];

            case 13:
              _context4.next = 8;
              break;

            case 15:
              _iteratorNormalCompletion = true;
              _context4.next = 5;
              break;

            case 18:
              _context4.next = 24;
              break;

            case 20:
              _context4.prev = 20;
              _context4.t2 = _context4["catch"](3);
              _didIteratorError = true;
              _iteratorError = _context4.t2;

            case 24:
              _context4.prev = 24;
              _context4.prev = 25;

              if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                _iterator["return"]();
              }

            case 27:
              _context4.prev = 27;

              if (!_didIteratorError) {
                _context4.next = 30;
                break;
              }

              throw _iteratorError;

            case 30:
              return _context4.finish(27);

            case 31:
              return _context4.finish(24);

            case 32:
            case "end":
              return _context4.stop();
          }
        }
      }, quickFiltersGenerator, null, [[3, 20, 24, 32], [25,, 27, 31]]);
    })
  }, {
    key: "getId",
    value: function getId() {
      return this.id;
    }
  }, {
    key: "getSearchUrl",
    value: function getSearchUrl() {
      return this.searchUrl;
    }
  }, {
    key: "getSavedSearchesUrl",
    value: function getSavedSearchesUrl() {
      return this.savedSearchesUrl;
    }
  }, {
    key: "getConfigurationUrl",
    value: function getConfigurationUrl() {
      return this.configurationUrl;
    }
  }, {
    key: "getExportResultsUrl",
    value: function getExportResultsUrl() {
      return this.exportResultsUrl;
    }
  }, {
    key: "getExportPageLimit",
    value: function getExportPageLimit() {
      return Number(this.exportPageLimit);
    }
  }, {
    key: "getExportPageLimitExceededMessage",
    value: function getExportPageLimitExceededMessage() {
      return this.exportPageLimitExceededMessage || "Cannot Export CSV. Exporting is limited to " + this.getExportPageLimit() + " page(s) at a time.";
    }
  }, {
    key: "getSavedSearches",
    value: function getSavedSearches() {
      return this.savedSearches || [];
    }
  }, {
    key: "getSavedSearch",
    value: function getSavedSearch(searchId) {
      return this.savedSearches[searchId];
    }
  }, {
    key: "getFilter",
    value: function getFilter(filterUid) {
      return this.filters[filterUid];
    }
  }, {
    key: "getFilters",
    value: function getFilters() {
      return this.filters;
    }
  }, {
    key: "getDisabled",
    value: function getDisabled() {
      var disabledFilters = {};

      for (var filterUid in this.filters) {
        if (this.filters[filterUid].enabled !== true) {
          disabledFilters[filterUid] = this.filters[filterUid];
        }
      }

      return disabledFilters;
    }
  }, {
    key: "getEnabled",
    value: function getEnabled() {
      var enabledFilters = {};

      for (var filterUid in this.filters) {
        if (this.filters[filterUid].enabled === true) {
          enabledFilters[filterUid] = this.filters[filterUid];
        }
      }

      return enabledFilters;
    }
  }, {
    key: "getQuery",
    value: function getQuery() {
      var enabledFilters = Object.keys(this.getEnabled()).map(function (filterUid) {
        var filter = this.getFilter(filterUid);
        return {
          uid: filterUid,
          type: filter.type,
          field: filter.field,
          value: filter.value,
          operator: filter.operator
        };
      }, this);
      return enabledFilters.length > 0 ? JSON.stringify(enabledFilters) : "";
    }
  }, {
    key: "isConfigurable",
    value: function isConfigurable() {
      return this.getConfigurationUrl() !== undefined;
    }
  }, {
    key: "isExportable",
    value: function isExportable() {
      return this.getExportResultsUrl() !== undefined;
    }
  }, {
    key: "setSavedSearches",
    value: function setSavedSearches(savedSearches) {
      this.savedSearches = savedSearches;
      this.emitChange();
    }
  }, {
    key: "disableAllFilters",
    value: function disableAllFilters() {
      var enabledFilters = this.getEnabled();

      for (var filterUid in enabledFilters) {
        this.disableFilter(filterUid);
      }

      this.emitChange();
    }
  }, {
    key: "disableFilter",
    value: function disableFilter(filterUid) {
      this.filters[filterUid].enabled = false;
      this.filters[filterUid].value = "";
      this.deactivateQuickFiltersBasedOnRemovedFilter(filterUid, this.activeQuickFilters());
      this.emitChange();
    }
  }, {
    key: "enableFilter",
    value: function enableFilter(filterUid, value) {
      this.filters[filterUid].enabled = true;
      this.filters[filterUid].value = value || this.filters[filterUid].value || "";
      this.emitChange();
    }
  }, {
    key: "enableQuickFilter",
    value: function enableQuickFilter(quickFilterName, blockName) {
      var self = this;
      Object.keys(this.quickFilters[blockName]).map(function (filterName) {
        if (_typeof(self.quickFilters[blockName][filterName]) == "object") {
          self.quickFilters[blockName][filterName].active = false;
        }
      });
      this.quickFilters[blockName][quickFilterName].active = true;
    }
  }, {
    key: "disableAllQuickFilters",
    value: function disableAllQuickFilters() {
      var self = this;
      Object.keys(self.quickFilters).map(function (blockName) {
        Object.keys(self.quickFilters[blockName]).map(function (filterName) {
          self.quickFilters[blockName][filterName].active = false;
        });
      });
    }
  }, {
    key: "updateFilter",
    value: function updateFilter(filterUid, propKey, propValue) {
      this.filters[filterUid][propKey] = propValue;
      if (propKey === 'value') this.deactivateQuickFiltersBasedOnFilterValue(filterUid, propValue, this.activeQuickFilters());
      this.emitChange();
    }
  }, {
    key: "deactivateQuickFiltersBasedOnRemovedFilter",
    value: function deactivateQuickFiltersBasedOnRemovedFilter(filterName, quickFilters) {
      var self = this;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = self.quickFiltersGenerator(quickFilters)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var outcome = _step2.value;
          var quickFilter = outcome[0],
              quickFilterName = outcome[1];
          if (quickFilter.filters[quickFilterName].filter === filterName) self.inactivateQuickFilter(quickFilter);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      this.emitChange();
    }
  }, {
    key: "deactivateQuickFiltersBasedOnFilterValue",
    value: function deactivateQuickFiltersBasedOnFilterValue(filterName, filterValue, quickFilters) {
      var self = this;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = self.quickFiltersGenerator(quickFilters)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var outcome = _step3.value;
          var quickFilter = outcome[0],
              quickFilterName = outcome[1];
          self.inactivateQuickFilterIfValueChanged(quickFilter.filters[quickFilterName], filterName, filterValue, quickFilter);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      this.emitChange();
    }
  }, {
    key: "inactivateQuickFilterIfValueChanged",
    value: function inactivateQuickFilterIfValueChanged(quickFilterFilter, filterName, filterValue, quickFilter) {
      if (quickFilterFilter.filter === filterName) {
        if (_typeof(quickFilterFilter.value) === "object") {
          if (this.rangeFilterValuesChanged(quickFilterFilter.value, filterValue)) this.inactivateQuickFilter(quickFilter);
        } else if (filterValue !== quickFilterFilter.value) {
          this.inactivateQuickFilter(quickFilter);
        }
      }
    }
  }, {
    key: "rangeFilterValuesChanged",
    value: function rangeFilterValuesChanged(value1, value2) {
      return value1.from !== value2.from || value1.to !== value2.to;
    }
  }, {
    key: "inactivateQuickFilter",
    value: function inactivateQuickFilter(quickFilter) {
      quickFilter.active = false;
    }
  }, {
    key: "activeQuickFilters",
    value: function activeQuickFilters() {
      var self = this;
      var active = [];
      Object.keys(self.quickFilters).map(function (blockName) {
        Object.keys(self.quickFilters[blockName]).map(function (filterName) {
          var quickFilter = self.quickFilters[blockName][filterName];
          if (quickFilter.active) active.push(quickFilter);
        });
      });
      return active;
    }
  }, {
    key: "emitChange",
    value: function emitChange() {
      this.eventEmitter.emit(this.CHANGE_EVENT);
    }
  }, {
    key: "addChangeListener",
    value: function addChangeListener(callback) {
      this.eventEmitter.on(this.CHANGE_EVENT, callback);
    }
  }, {
    key: "removeChangeListener",
    value: function removeChangeListener(callback) {
      this.eventEmitter.removeListener(this.CHANGE_EVENT, callback);
    }
  }]);

  return FilterBarStore;
}();

exports.FilterBarStore = FilterBarStore;

},{"../clients/SearchClient":8}],53:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TableStore = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var uri = require("URIjs");

function changePage(url, page) {
  return uri(url).removeSearch("page").addSearch("page", page);
}

var TableStore =
/*#__PURE__*/
function () {
  function TableStore(configuration) {
    _classCallCheck(this, TableStore);

    this.CHANGE_EVENT = "change";
    this.eventEmitter = new EventEmitter();
    this.rows = [];
    this.currentPage = configuration.page || 1;
    this.totalPages = 1;
    this.columns = configuration.columns;
    this.url = configuration.dataUrl;
    this.selectable = configuration.selectable;
    this.selectedRows = [];
    this.fixRightColumn = configuration.fixRightColumn;
  }

  _createClass(TableStore, [{
    key: "setUrl",
    value: function setUrl(url) {
      this.url = url;
    }
  }, {
    key: "getUrl",
    value: function getUrl() {
      return changePage(this.url, this.currentPage);
    }
  }, {
    key: "getColumns",
    value: function getColumns() {
      return this.columns;
    }
  }, {
    key: "setRows",
    value: function setRows(rows) {
      this.rows = rows;
    }
  }, {
    key: "getRows",
    value: function getRows() {
      return this.rows;
    }
  }, {
    key: "getSelectableValuesFromRows",
    value: function getSelectableValuesFromRows() {
      return this.rows.map(function (row) {
        return row[this.selectable].toString();
      }, this);
    }
  }, {
    key: "getCurrentPage",
    value: function getCurrentPage() {
      return this.currentPage;
    }
  }, {
    key: "getTotalPages",
    value: function getTotalPages() {
      return this.totalPages;
    }
  }, {
    key: "getTableCaption",
    value: function getTableCaption() {
      return this.tableCaption;
    }
  }, {
    key: "getSelectableColumn",
    value: function getSelectableColumn() {
      return this.selectable;
    }
  }, {
    key: "getSelectedRows",
    value: function getSelectedRows() {
      return this.selectedRows;
    }
  }, {
    key: "getFixRightColumn",
    value: function getFixRightColumn() {
      return this.fixRightColumn;
    }
  }, {
    key: "clearSelectedRows",
    value: function clearSelectedRows() {
      this.selectedRows = [];
    }
  }, {
    key: "pushAllValuesToSelectedRows",
    value: function pushAllValuesToSelectedRows() {
      this.rows.forEach(function (row) {
        this.pushValueToSelectedRows(row[this.selectable].toString());
      }, this);
    }
  }, {
    key: "removeAllValuesFromSelectedRows",
    value: function removeAllValuesFromSelectedRows() {
      this.rows.forEach(function (row) {
        this.removeFromSelectedRows(row[this.selectable].toString());
      }, this);
    }
  }, {
    key: "pushValueToSelectedRows",
    value: function pushValueToSelectedRows(value) {
      var indexOfValue = this.selectedRows.indexOf(value);

      if (indexOfValue == -1) {
        this.selectedRows.push(value);
      }
    }
  }, {
    key: "removeFromSelectedRows",
    value: function removeFromSelectedRows(value) {
      var indexOfValue = this.selectedRows.indexOf(value);

      if (indexOfValue > -1) {
        this.selectedRows.splice(indexOfValue, 1);
      }
    }
  }, {
    key: "valueInSelectedRows",
    value: function valueInSelectedRows(value) {
      return this.selectedRows.indexOf(value) > -1;
    }
  }, {
    key: "allSelectableValuesInSelectedRows",
    value: function allSelectableValuesInSelectedRows() {
      if (this.getSelectableValuesFromRows().length > 0) {
        return this.getSelectableValuesFromRows().every(this.isInSelectedRows, this);
      } else {
        return false;
      }
    }
  }, {
    key: "isInSelectedRows",
    value: function isInSelectedRows(element) {
      return this.selectedRows.includes(element);
    }
  }, {
    key: "setSelectedRows",
    value: function setSelectedRows(selectedRows) {
      this.selectedRows = selectedRows;
    }
  }, {
    key: "setTotalPages",
    value: function setTotalPages(totalPages) {
      this.totalPages = totalPages;
    }
  }, {
    key: "setCurrentPage",
    value: function setCurrentPage(page) {
      this.currentPage = page;
    }
  }, {
    key: "setTableCaption",
    value: function setTableCaption(tableCaption) {
      this.tableCaption = tableCaption;
    }
  }, {
    key: "updateTable",
    value: function updateTable(tableStateObject) {
      this.setRows(tableStateObject.results);
      this.setCurrentPage(tableStateObject.current_page);
      this.setTotalPages(tableStateObject.total_pages);
      this.setTableCaption(tableStateObject.table_caption);
      this.emitChange();
    }
  }, {
    key: "emitChange",
    value: function emitChange() {
      this.eventEmitter.emit(this.CHANGE_EVENT);
    }
  }, {
    key: "addChangeListener",
    value: function addChangeListener(callback) {
      this.eventEmitter.on(this.CHANGE_EVENT, callback);
    }
  }, {
    key: "removeChangeListener",
    value: function removeChangeListener(callback) {
      this.eventEmitter.removeListener(this.CHANGE_EVENT, callback);
    }
  }]);

  return TableStore;
}();

exports.TableStore = TableStore;

},{"URIjs":3}]},{},[7]);
