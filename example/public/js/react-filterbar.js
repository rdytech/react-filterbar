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

},{"URIjs":3}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvVVJJanMvc3JjL0lQdjYuanMiLCJub2RlX21vZHVsZXMvVVJJanMvc3JjL1NlY29uZExldmVsRG9tYWlucy5qcyIsIm5vZGVfbW9kdWxlcy9VUklqcy9zcmMvVVJJLmpzIiwibm9kZV9tb2R1bGVzL1VSSWpzL3NyYy9wdW55Y29kZS5qcyIsInNyYy9hY3RvcnMvRmlsdGVyQmFyQWN0b3IuanMiLCJzcmMvYWN0b3JzL1RhYmxlQWN0b3IuanMiLCJzcmMvYXBwLmpzIiwic3JjL2NsaWVudHMvU2VhcmNoQ2xpZW50LmpzIiwic3JjL2NvbXBvbmVudHMvRmlsdGVyQmFyL0FwcGx5RmlsdGVyc0J1dHRvbi5yZWFjdC5qcyIsInNyYy9jb21wb25lbnRzL0ZpbHRlckJhci9CYXRjaEFjdGlvbnNMaXN0L0JhdGNoQWN0aW9uc0xpc3QucmVhY3QuanMiLCJzcmMvY29tcG9uZW50cy9GaWx0ZXJCYXIvQmF0Y2hBY3Rpb25zTGlzdC9CYXRjaEFjdGlvbnNMaXN0SXRlbS5yZWFjdC5qcyIsInNyYy9jb21wb25lbnRzL0ZpbHRlckJhci9DbGVhckZpbHRlcnNCdXR0b24ucmVhY3QuanMiLCJzcmMvY29tcG9uZW50cy9GaWx0ZXJCYXIvQ29uZmlndXJhdGlvbkJ1dHRvbi5yZWFjdC5qcyIsInNyYy9jb21wb25lbnRzL0ZpbHRlckJhci9FeHBvcnRSZXN1bHRzQnV0dG9uLnJlYWN0LmpzIiwic3JjL2NvbXBvbmVudHMvRmlsdGVyQmFyL0ZpbHRlckJhci5yZWFjdC5qcyIsInNyYy9jb21wb25lbnRzL0ZpbHRlckJhci9GaWx0ZXJEaXNwbGF5L0ZpbHRlckRpc3BsYXkucmVhY3QuanMiLCJzcmMvY29tcG9uZW50cy9GaWx0ZXJCYXIvRmlsdGVyRGlzcGxheS9GaWx0ZXJJbnB1dC5yZWFjdC5qcyIsInNyYy9jb21wb25lbnRzL0ZpbHRlckJhci9GaWx0ZXJEaXNwbGF5L0ZpbHRlcklucHV0RmFjdG9yeS5yZWFjdC5qcyIsInNyYy9jb21wb25lbnRzL0ZpbHRlckJhci9GaWx0ZXJEaXNwbGF5L0lucHV0cy9EYXRlSW5wdXQucmVhY3QuanMiLCJzcmMvY29tcG9uZW50cy9GaWx0ZXJCYXIvRmlsdGVyRGlzcGxheS9JbnB1dHMvRGF0ZVRpbWVJbnB1dC5yZWFjdC5qcyIsInNyYy9jb21wb25lbnRzL0ZpbHRlckJhci9GaWx0ZXJEaXNwbGF5L0lucHV0cy9MYXp5TXVsdGlTZWxlY3RJbnB1dC5yZWFjdC5qcyIsInNyYy9jb21wb25lbnRzL0ZpbHRlckJhci9GaWx0ZXJEaXNwbGF5L0lucHV0cy9MYXp5U2VsZWN0SW5wdXQucmVhY3QuanMiLCJzcmMvY29tcG9uZW50cy9GaWx0ZXJCYXIvRmlsdGVyRGlzcGxheS9JbnB1dHMvTXVsdGlTZWxlY3RJbnB1dC5yZWFjdC5qcyIsInNyYy9jb21wb25lbnRzL0ZpbHRlckJhci9GaWx0ZXJEaXNwbGF5L0lucHV0cy9SYW5nZUlucHV0LnJlYWN0LmpzIiwic3JjL2NvbXBvbmVudHMvRmlsdGVyQmFyL0ZpbHRlckRpc3BsYXkvSW5wdXRzL1NlbGVjdElucHV0LnJlYWN0LmpzIiwic3JjL2NvbXBvbmVudHMvRmlsdGVyQmFyL0ZpbHRlckRpc3BsYXkvSW5wdXRzL1NpbmdsZURhdGVUaW1lSW5wdXQucmVhY3QuanMiLCJzcmMvY29tcG9uZW50cy9GaWx0ZXJCYXIvRmlsdGVyRGlzcGxheS9JbnB1dHMvVGV4dElucHV0LnJlYWN0LmpzIiwic3JjL2NvbXBvbmVudHMvRmlsdGVyQmFyL0ZpbHRlckxpc3QvRmlsdGVyTGlzdC5yZWFjdC5qcyIsInNyYy9jb21wb25lbnRzL0ZpbHRlckJhci9GaWx0ZXJMaXN0L0ZpbHRlckxpc3RPcHRpb24ucmVhY3QuanMiLCJzcmMvY29tcG9uZW50cy9GaWx0ZXJCYXIvU2F2ZUZpbHRlcnNCdXR0b24ucmVhY3QuanMiLCJzcmMvY29tcG9uZW50cy9GaWx0ZXJCYXIvU2F2ZWRTZWFyY2hlc0xpc3QvU2F2ZWRTZWFyY2hlc0xpc3QucmVhY3QuanMiLCJzcmMvY29tcG9uZW50cy9GaWx0ZXJCYXIvU2F2ZWRTZWFyY2hlc0xpc3QvU2F2ZWRTZWFyY2hlc0xpc3RJdGVtLnJlYWN0LmpzIiwic3JjL2NvbXBvbmVudHMvRmlsdGVyYWJsZVRhYmxlLnJlYWN0LmpzIiwic3JjL2NvbXBvbmVudHMvUXVpY2tGaWx0ZXJzL1F1aWNrRmlsdGVycy5yZWFjdC5qcyIsInNyYy9jb21wb25lbnRzL1F1aWNrRmlsdGVycy9RdWlja0ZpbHRlcnNCbG9jay9RdWlja0ZpbHRlcnNCbG9jay5yZWFjdC5qcyIsInNyYy9jb21wb25lbnRzL1F1aWNrRmlsdGVycy9RdWlja0ZpbHRlcnNCbG9jay9RdWlja0ZpbHRlcnNCdXR0b24ucmVhY3QuanMiLCJzcmMvY29tcG9uZW50cy9UYWJsZS9Cb2R5LnJlYWN0LmpzIiwic3JjL2NvbXBvbmVudHMvVGFibGUvQm9keUNlbGwucmVhY3QuanMiLCJzcmMvY29tcG9uZW50cy9UYWJsZS9Cb2R5Um93LnJlYWN0LmpzIiwic3JjL2NvbXBvbmVudHMvVGFibGUvQm9keVNlbGVjdGFibGUucmVhY3QuanMiLCJzcmMvY29tcG9uZW50cy9UYWJsZS9IZWFkaW5nQ2VsbC5yZWFjdC5qcyIsInNyYy9jb21wb25lbnRzL1RhYmxlL0hlYWRpbmdSb3cucmVhY3QuanMiLCJzcmMvY29tcG9uZW50cy9UYWJsZS9IZWFkaW5nU2VsZWN0YWJsZS5yZWFjdC5qcyIsInNyYy9jb21wb25lbnRzL1RhYmxlL1BhZ2luYXRpb24ucmVhY3QuanMiLCJzcmMvY29tcG9uZW50cy9UYWJsZS9UYWJsZS5yZWFjdC5qcyIsInNyYy9jb21wb25lbnRzL1RhYmxlL1RhYmxlQ2FwdGlvbi5yZWFjdC5qcyIsInNyYy9ldmVudHMvVGFibGVFdmVudC5qcyIsInNyYy9oZWxwZXJzL0ZpbHRlclZlcmlmaWNhdG9yLmpzIiwic3JjL2hlbHBlcnMvTW9kYWxIZWxwZXIuanMiLCJzcmMvaGVscGVycy9VUkxIZWxwZXIuanMiLCJzcmMvc3RvcmVzL0JhdGNoQWN0aW9uc1N0b3JlLmpzIiwic3JjL3N0b3Jlcy9GaWx0ZXJCYXJTdG9yZS5qcyIsInNyYy9zdG9yZXMvVGFibGVTdG9yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdGxFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QyxPQUE5QjtBQUNBLFdBQUssY0FBTCxDQUFvQixnQkFBZ0IsQ0FBQyxZQUFyQztBQUNBLFdBQUssYUFBTCxDQUFtQixnQkFBZ0IsQ0FBQyxXQUFwQztBQUNBLFdBQUssZUFBTCxDQUFxQixnQkFBZ0IsQ0FBQyxhQUF0QztBQUNBLFdBQUssVUFBTDtBQUNEOzs7aUNBRVk7QUFDWCxXQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsS0FBSyxZQUE1QjtBQUNEOzs7c0NBRWlCLFEsRUFBVTtBQUMxQixXQUFLLFlBQUwsQ0FBa0IsRUFBbEIsQ0FBcUIsS0FBSyxZQUExQixFQUF3QyxRQUF4QztBQUNEOzs7eUNBRW9CLFEsRUFBVTtBQUM3QixXQUFLLFlBQUwsQ0FBa0IsY0FBbEIsQ0FBaUMsS0FBSyxZQUF0QyxFQUFvRCxRQUFwRDtBQUNEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyohXG4gKiBVUkkuanMgLSBNdXRhdGluZyBVUkxzXG4gKiBJUHY2IFN1cHBvcnRcbiAqXG4gKiBWZXJzaW9uOiAxLjE2LjFcbiAqXG4gKiBBdXRob3I6IFJvZG5leSBSZWhtXG4gKiBXZWI6IGh0dHA6Ly9tZWRpYWxpemUuZ2l0aHViLmlvL1VSSS5qcy9cbiAqXG4gKiBMaWNlbnNlZCB1bmRlclxuICogICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKiAgIEdQTCB2MyBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvR1BMLTMuMFxuICpcbiAqL1xuXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICAvLyBodHRwczovL2dpdGh1Yi5jb20vdW1kanMvdW1kL2Jsb2IvbWFzdGVyL3JldHVybkV4cG9ydHMuanNcbiAgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIC8vIE5vZGVcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgZGVmaW5lKGZhY3RvcnkpO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXG4gICAgcm9vdC5JUHY2ID0gZmFjdG9yeShyb290KTtcbiAgfVxufSh0aGlzLCBmdW5jdGlvbiAocm9vdCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLypcbiAgdmFyIF9pbiA9IFwiZmU4MDowMDAwOjAwMDA6MDAwMDowMjA0OjYxZmY6ZmU5ZDpmMTU2XCI7XG4gIHZhciBfb3V0ID0gSVB2Ni5iZXN0KF9pbik7XG4gIHZhciBfZXhwZWN0ZWQgPSBcImZlODA6OjIwNDo2MWZmOmZlOWQ6ZjE1NlwiO1xuXG4gIGNvbnNvbGUubG9nKF9pbiwgX291dCwgX2V4cGVjdGVkLCBfb3V0ID09PSBfZXhwZWN0ZWQpO1xuICAqL1xuXG4gIC8vIHNhdmUgY3VycmVudCBJUHY2IHZhcmlhYmxlLCBpZiBhbnlcbiAgdmFyIF9JUHY2ID0gcm9vdCAmJiByb290LklQdjY7XG5cbiAgZnVuY3Rpb24gYmVzdFByZXNlbnRhdGlvbihhZGRyZXNzKSB7XG4gICAgLy8gYmFzZWQgb246XG4gICAgLy8gSmF2YXNjcmlwdCB0byB0ZXN0IGFuIElQdjYgYWRkcmVzcyBmb3IgcHJvcGVyIGZvcm1hdCwgYW5kIHRvXG4gICAgLy8gcHJlc2VudCB0aGUgXCJiZXN0IHRleHQgcmVwcmVzZW50YXRpb25cIiBhY2NvcmRpbmcgdG8gSUVURiBEcmFmdCBSRkMgYXRcbiAgICAvLyBodHRwOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9kcmFmdC1pZXRmLTZtYW4tdGV4dC1hZGRyLXJlcHJlc2VudGF0aW9uLTA0XG4gICAgLy8gOCBGZWIgMjAxMCBSaWNoIEJyb3duLCBEYXJ0d2FyZSwgTExDXG4gICAgLy8gUGxlYXNlIGZlZWwgZnJlZSB0byB1c2UgdGhpcyBjb2RlIGFzIGxvbmcgYXMgeW91IHByb3ZpZGUgYSBsaW5rIHRvXG4gICAgLy8gaHR0cDovL3d3dy5pbnRlcm1hcHBlci5jb21cbiAgICAvLyBodHRwOi8vaW50ZXJtYXBwZXIuY29tL3N1cHBvcnQvdG9vbHMvSVBWNi1WYWxpZGF0b3IuYXNweFxuICAgIC8vIGh0dHA6Ly9kb3dubG9hZC5kYXJ0d2FyZS5jb20vdGhpcmRwYXJ0eS9pcHY2dmFsaWRhdG9yLmpzXG5cbiAgICB2YXIgX2FkZHJlc3MgPSBhZGRyZXNzLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFyIHNlZ21lbnRzID0gX2FkZHJlc3Muc3BsaXQoJzonKTtcbiAgICB2YXIgbGVuZ3RoID0gc2VnbWVudHMubGVuZ3RoO1xuICAgIHZhciB0b3RhbCA9IDg7XG5cbiAgICAvLyB0cmltIGNvbG9ucyAoOjogb3IgOjphOmI6Y+KApiBvciDigKZhOmI6Yzo6KVxuICAgIGlmIChzZWdtZW50c1swXSA9PT0gJycgJiYgc2VnbWVudHNbMV0gPT09ICcnICYmIHNlZ21lbnRzWzJdID09PSAnJykge1xuICAgICAgLy8gbXVzdCBoYXZlIGJlZW4gOjpcbiAgICAgIC8vIHJlbW92ZSBmaXJzdCB0d28gaXRlbXNcbiAgICAgIHNlZ21lbnRzLnNoaWZ0KCk7XG4gICAgICBzZWdtZW50cy5zaGlmdCgpO1xuICAgIH0gZWxzZSBpZiAoc2VnbWVudHNbMF0gPT09ICcnICYmIHNlZ21lbnRzWzFdID09PSAnJykge1xuICAgICAgLy8gbXVzdCBoYXZlIGJlZW4gOjp4eHh4XG4gICAgICAvLyByZW1vdmUgdGhlIGZpcnN0IGl0ZW1cbiAgICAgIHNlZ21lbnRzLnNoaWZ0KCk7XG4gICAgfSBlbHNlIGlmIChzZWdtZW50c1tsZW5ndGggLSAxXSA9PT0gJycgJiYgc2VnbWVudHNbbGVuZ3RoIC0gMl0gPT09ICcnKSB7XG4gICAgICAvLyBtdXN0IGhhdmUgYmVlbiB4eHh4OjpcbiAgICAgIHNlZ21lbnRzLnBvcCgpO1xuICAgIH1cblxuICAgIGxlbmd0aCA9IHNlZ21lbnRzLmxlbmd0aDtcblxuICAgIC8vIGFkanVzdCB0b3RhbCBzZWdtZW50cyBmb3IgSVB2NCB0cmFpbGVyXG4gICAgaWYgKHNlZ21lbnRzW2xlbmd0aCAtIDFdLmluZGV4T2YoJy4nKSAhPT0gLTEpIHtcbiAgICAgIC8vIGZvdW5kIGEgXCIuXCIgd2hpY2ggbWVhbnMgSVB2NFxuICAgICAgdG90YWwgPSA3O1xuICAgIH1cblxuICAgIC8vIGZpbGwgZW1wdHkgc2VnbWVudHMgdGhlbSB3aXRoIFwiMDAwMFwiXG4gICAgdmFyIHBvcztcbiAgICBmb3IgKHBvcyA9IDA7IHBvcyA8IGxlbmd0aDsgcG9zKyspIHtcbiAgICAgIGlmIChzZWdtZW50c1twb3NdID09PSAnJykge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zIDwgdG90YWwpIHtcbiAgICAgIHNlZ21lbnRzLnNwbGljZShwb3MsIDEsICcwMDAwJyk7XG4gICAgICB3aGlsZSAoc2VnbWVudHMubGVuZ3RoIDwgdG90YWwpIHtcbiAgICAgICAgc2VnbWVudHMuc3BsaWNlKHBvcywgMCwgJzAwMDAnKTtcbiAgICAgIH1cblxuICAgICAgbGVuZ3RoID0gc2VnbWVudHMubGVuZ3RoO1xuICAgIH1cblxuICAgIC8vIHN0cmlwIGxlYWRpbmcgemVyb3NcbiAgICB2YXIgX3NlZ21lbnRzO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG90YWw7IGkrKykge1xuICAgICAgX3NlZ21lbnRzID0gc2VnbWVudHNbaV0uc3BsaXQoJycpO1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCAzIDsgaisrKSB7XG4gICAgICAgIGlmIChfc2VnbWVudHNbMF0gPT09ICcwJyAmJiBfc2VnbWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgIF9zZWdtZW50cy5zcGxpY2UoMCwxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzZWdtZW50c1tpXSA9IF9zZWdtZW50cy5qb2luKCcnKTtcbiAgICB9XG5cbiAgICAvLyBmaW5kIGxvbmdlc3Qgc2VxdWVuY2Ugb2YgemVyb2VzIGFuZCBjb2FsZXNjZSB0aGVtIGludG8gb25lIHNlZ21lbnRcbiAgICB2YXIgYmVzdCA9IC0xO1xuICAgIHZhciBfYmVzdCA9IDA7XG4gICAgdmFyIF9jdXJyZW50ID0gMDtcbiAgICB2YXIgY3VycmVudCA9IC0xO1xuICAgIHZhciBpbnplcm9lcyA9IGZhbHNlO1xuICAgIC8vIGk7IGFscmVhZHkgZGVjbGFyZWRcblxuICAgIGZvciAoaSA9IDA7IGkgPCB0b3RhbDsgaSsrKSB7XG4gICAgICBpZiAoaW56ZXJvZXMpIHtcbiAgICAgICAgaWYgKHNlZ21lbnRzW2ldID09PSAnMCcpIHtcbiAgICAgICAgICBfY3VycmVudCArPSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGluemVyb2VzID0gZmFsc2U7XG4gICAgICAgICAgaWYgKF9jdXJyZW50ID4gX2Jlc3QpIHtcbiAgICAgICAgICAgIGJlc3QgPSBjdXJyZW50O1xuICAgICAgICAgICAgX2Jlc3QgPSBfY3VycmVudDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChzZWdtZW50c1tpXSA9PT0gJzAnKSB7XG4gICAgICAgICAgaW56ZXJvZXMgPSB0cnVlO1xuICAgICAgICAgIGN1cnJlbnQgPSBpO1xuICAgICAgICAgIF9jdXJyZW50ID0gMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChfY3VycmVudCA+IF9iZXN0KSB7XG4gICAgICBiZXN0ID0gY3VycmVudDtcbiAgICAgIF9iZXN0ID0gX2N1cnJlbnQ7XG4gICAgfVxuXG4gICAgaWYgKF9iZXN0ID4gMSkge1xuICAgICAgc2VnbWVudHMuc3BsaWNlKGJlc3QsIF9iZXN0LCAnJyk7XG4gICAgfVxuXG4gICAgbGVuZ3RoID0gc2VnbWVudHMubGVuZ3RoO1xuXG4gICAgLy8gYXNzZW1ibGUgcmVtYWluaW5nIHNlZ21lbnRzXG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgIGlmIChzZWdtZW50c1swXSA9PT0gJycpICB7XG4gICAgICByZXN1bHQgPSAnOic7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHQgKz0gc2VnbWVudHNbaV07XG4gICAgICBpZiAoaSA9PT0gbGVuZ3RoIC0gMSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgcmVzdWx0ICs9ICc6JztcbiAgICB9XG5cbiAgICBpZiAoc2VnbWVudHNbbGVuZ3RoIC0gMV0gPT09ICcnKSB7XG4gICAgICByZXN1bHQgKz0gJzonO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBub0NvbmZsaWN0KCkge1xuICAgIC8qanNoaW50IHZhbGlkdGhpczogdHJ1ZSAqL1xuICAgIGlmIChyb290LklQdjYgPT09IHRoaXMpIHtcbiAgICAgIHJvb3QuSVB2NiA9IF9JUHY2O1xuICAgIH1cbiAgXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGJlc3Q6IGJlc3RQcmVzZW50YXRpb24sXG4gICAgbm9Db25mbGljdDogbm9Db25mbGljdFxuICB9O1xufSkpO1xuIiwiLyohXG4gKiBVUkkuanMgLSBNdXRhdGluZyBVUkxzXG4gKiBTZWNvbmQgTGV2ZWwgRG9tYWluIChTTEQpIFN1cHBvcnRcbiAqXG4gKiBWZXJzaW9uOiAxLjE2LjFcbiAqXG4gKiBBdXRob3I6IFJvZG5leSBSZWhtXG4gKiBXZWI6IGh0dHA6Ly9tZWRpYWxpemUuZ2l0aHViLmlvL1VSSS5qcy9cbiAqXG4gKiBMaWNlbnNlZCB1bmRlclxuICogICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKiAgIEdQTCB2MyBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvR1BMLTMuMFxuICpcbiAqL1xuXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICAvLyBodHRwczovL2dpdGh1Yi5jb20vdW1kanMvdW1kL2Jsb2IvbWFzdGVyL3JldHVybkV4cG9ydHMuanNcbiAgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIC8vIE5vZGVcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgZGVmaW5lKGZhY3RvcnkpO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXG4gICAgcm9vdC5TZWNvbmRMZXZlbERvbWFpbnMgPSBmYWN0b3J5KHJvb3QpO1xuICB9XG59KHRoaXMsIGZ1bmN0aW9uIChyb290KSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBzYXZlIGN1cnJlbnQgU2Vjb25kTGV2ZWxEb21haW5zIHZhcmlhYmxlLCBpZiBhbnlcbiAgdmFyIF9TZWNvbmRMZXZlbERvbWFpbnMgPSByb290ICYmIHJvb3QuU2Vjb25kTGV2ZWxEb21haW5zO1xuXG4gIHZhciBTTEQgPSB7XG4gICAgLy8gbGlzdCBvZiBrbm93biBTZWNvbmQgTGV2ZWwgRG9tYWluc1xuICAgIC8vIGNvbnZlcnRlZCBsaXN0IG9mIFNMRHMgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZ2F2aW5nbWlsbGVyL3NlY29uZC1sZXZlbC1kb21haW5zXG4gICAgLy8gLS0tLVxuICAgIC8vIHB1YmxpY3N1ZmZpeC5vcmcgaXMgbW9yZSBjdXJyZW50IGFuZCBhY3R1YWxseSB1c2VkIGJ5IGEgY291cGxlIG9mIGJyb3dzZXJzIGludGVybmFsbHkuXG4gICAgLy8gZG93bnNpZGUgaXMgaXQgYWxzbyBjb250YWlucyBkb21haW5zIGxpa2UgXCJkeW5kbnMub3JnXCIgLSB3aGljaCBpcyBmaW5lIGZvciB0aGUgc2VjdXJpdHlcbiAgICAvLyBpc3N1ZXMgYnJvd3NlciBoYXZlIHRvIGRlYWwgd2l0aCAoU09QIGZvciBjb29raWVzLCBldGMpIC0gYnV0IGlzIHdheSBvdmVyYm9hcmQgZm9yIFVSSS5qc1xuICAgIC8vIC0tLS1cbiAgICBsaXN0OiB7XG4gICAgICAnYWMnOicgY29tIGdvdiBtaWwgbmV0IG9yZyAnLFxuICAgICAgJ2FlJzonIGFjIGNvIGdvdiBtaWwgbmFtZSBuZXQgb3JnIHBybyBzY2ggJyxcbiAgICAgICdhZic6JyBjb20gZWR1IGdvdiBuZXQgb3JnICcsXG4gICAgICAnYWwnOicgY29tIGVkdSBnb3YgbWlsIG5ldCBvcmcgJyxcbiAgICAgICdhbyc6JyBjbyBlZCBndiBpdCBvZyBwYiAnLFxuICAgICAgJ2FyJzonIGNvbSBlZHUgZ29iIGdvdiBpbnQgbWlsIG5ldCBvcmcgdHVyICcsXG4gICAgICAnYXQnOicgYWMgY28gZ3Ygb3IgJyxcbiAgICAgICdhdSc6JyBhc24gY29tIGNzaXJvIGVkdSBnb3YgaWQgbmV0IG9yZyAnLFxuICAgICAgJ2JhJzonIGNvIGNvbSBlZHUgZ292IG1pbCBuZXQgb3JnIHJzIHVuYmkgdW5tbyB1bnNhIHVudHogdW56ZSAnLFxuICAgICAgJ2JiJzonIGJpeiBjbyBjb20gZWR1IGdvdiBpbmZvIG5ldCBvcmcgc3RvcmUgdHYgJyxcbiAgICAgICdiaCc6JyBiaXogY2MgY29tIGVkdSBnb3YgaW5mbyBuZXQgb3JnICcsXG4gICAgICAnYm4nOicgY29tIGVkdSBnb3YgbmV0IG9yZyAnLFxuICAgICAgJ2JvJzonIGNvbSBlZHUgZ29iIGdvdiBpbnQgbWlsIG5ldCBvcmcgdHYgJyxcbiAgICAgICdicic6JyBhZG0gYWR2IGFnciBhbSBhcnEgYXJ0IGF0byBiIGJpbyBibG9nIGJtZCBjaW0gY25nIGNudCBjb20gY29vcCBlY24gZWR1IGVuZyBlc3AgZXRjIGV0aSBmYXIgZmxvZyBmbSBmbmQgZm90IGZzdCBnMTIgZ2dmIGdvdiBpbWIgaW5kIGluZiBqb3IganVzIGxlbCBtYXQgbWVkIG1pbCBtdXMgbmV0IG5vbSBub3QgbnRyIG9kbyBvcmcgcHBnIHBybyBwc2MgcHNpIHFzbCByZWMgc2xnIHNydiB0bXAgdHJkIHR1ciB0diB2ZXQgdmxvZyB3aWtpIHpsZyAnLFxuICAgICAgJ2JzJzonIGNvbSBlZHUgZ292IG5ldCBvcmcgJyxcbiAgICAgICdieic6JyBkdSBldCBvbSBvdiByZyAnLFxuICAgICAgJ2NhJzonIGFiIGJjIG1iIG5iIG5mIG5sIG5zIG50IG51IG9uIHBlIHFjIHNrIHlrICcsXG4gICAgICAnY2snOicgYml6IGNvIGVkdSBnZW4gZ292IGluZm8gbmV0IG9yZyAnLFxuICAgICAgJ2NuJzonIGFjIGFoIGJqIGNvbSBjcSBlZHUgZmogZ2QgZ292IGdzIGd4IGd6IGhhIGhiIGhlIGhpIGhsIGhuIGpsIGpzIGp4IGxuIG1pbCBuZXQgbm0gbnggb3JnIHFoIHNjIHNkIHNoIHNuIHN4IHRqIHR3IHhqIHh6IHluIHpqICcsXG4gICAgICAnY28nOicgY29tIGVkdSBnb3YgbWlsIG5ldCBub20gb3JnICcsXG4gICAgICAnY3InOicgYWMgYyBjbyBlZCBmaSBnbyBvciBzYSAnLFxuICAgICAgJ2N5JzonIGFjIGJpeiBjb20gZWtsb2dlcyBnb3YgbHRkIG5hbWUgbmV0IG9yZyBwYXJsaWFtZW50IHByZXNzIHBybyB0bSAnLFxuICAgICAgJ2RvJzonIGFydCBjb20gZWR1IGdvYiBnb3YgbWlsIG5ldCBvcmcgc2xkIHdlYiAnLFxuICAgICAgJ2R6JzonIGFydCBhc3NvIGNvbSBlZHUgZ292IG5ldCBvcmcgcG9sICcsXG4gICAgICAnZWMnOicgY29tIGVkdSBmaW4gZ292IGluZm8gbWVkIG1pbCBuZXQgb3JnIHBybyAnLFxuICAgICAgJ2VnJzonIGNvbSBlZHUgZXVuIGdvdiBtaWwgbmFtZSBuZXQgb3JnIHNjaSAnLFxuICAgICAgJ2VyJzonIGNvbSBlZHUgZ292IGluZCBtaWwgbmV0IG9yZyByb2NoZXN0IHcgJyxcbiAgICAgICdlcyc6JyBjb20gZWR1IGdvYiBub20gb3JnICcsXG4gICAgICAnZXQnOicgYml6IGNvbSBlZHUgZ292IGluZm8gbmFtZSBuZXQgb3JnICcsXG4gICAgICAnZmonOicgYWMgYml6IGNvbSBpbmZvIG1pbCBuYW1lIG5ldCBvcmcgcHJvICcsXG4gICAgICAnZmsnOicgYWMgY28gZ292IG5ldCBub20gb3JnICcsXG4gICAgICAnZnInOicgYXNzbyBjb20gZiBnb3V2IG5vbSBwcmQgcHJlc3NlIHRtICcsXG4gICAgICAnZ2cnOicgY28gbmV0IG9yZyAnLFxuICAgICAgJ2doJzonIGNvbSBlZHUgZ292IG1pbCBvcmcgJyxcbiAgICAgICdnbic6JyBhYyBjb20gZ292IG5ldCBvcmcgJyxcbiAgICAgICdncic6JyBjb20gZWR1IGdvdiBtaWwgbmV0IG9yZyAnLFxuICAgICAgJ2d0JzonIGNvbSBlZHUgZ29iIGluZCBtaWwgbmV0IG9yZyAnLFxuICAgICAgJ2d1JzonIGNvbSBlZHUgZ292IG5ldCBvcmcgJyxcbiAgICAgICdoayc6JyBjb20gZWR1IGdvdiBpZHYgbmV0IG9yZyAnLFxuICAgICAgJ2h1JzonIDIwMDAgYWdyYXIgYm9sdCBjYXNpbm8gY2l0eSBjbyBlcm90aWNhIGVyb3Rpa2EgZmlsbSBmb3J1bSBnYW1lcyBob3RlbCBpbmZvIGluZ2F0bGFuIGpvZ2FzeiBrb255dmVsbyBsYWthcyBtZWRpYSBuZXdzIG9yZyBwcml2IHJla2xhbSBzZXggc2hvcCBzcG9ydCBzdWxpIHN6ZXggdG0gdG96c2RlIHV0YXphcyB2aWRlbyAnLFxuICAgICAgJ2lkJzonIGFjIGNvIGdvIG1pbCBuZXQgb3Igc2NoIHdlYiAnLFxuICAgICAgJ2lsJzonIGFjIGNvIGdvdiBpZGYgazEyIG11bmkgbmV0IG9yZyAnLFxuICAgICAgJ2luJzonIGFjIGNvIGVkdSBlcm5ldCBmaXJtIGdlbiBnb3YgaSBpbmQgbWlsIG5ldCBuaWMgb3JnIHJlcyAnLFxuICAgICAgJ2lxJzonIGNvbSBlZHUgZ292IGkgbWlsIG5ldCBvcmcgJyxcbiAgICAgICdpcic6JyBhYyBjbyBkbnNzZWMgZ292IGkgaWQgbmV0IG9yZyBzY2ggJyxcbiAgICAgICdpdCc6JyBlZHUgZ292ICcsXG4gICAgICAnamUnOicgY28gbmV0IG9yZyAnLFxuICAgICAgJ2pvJzonIGNvbSBlZHUgZ292IG1pbCBuYW1lIG5ldCBvcmcgc2NoICcsXG4gICAgICAnanAnOicgYWMgYWQgY28gZWQgZ28gZ3IgbGcgbmUgb3IgJyxcbiAgICAgICdrZSc6JyBhYyBjbyBnbyBpbmZvIG1lIG1vYmkgbmUgb3Igc2MgJyxcbiAgICAgICdraCc6JyBjb20gZWR1IGdvdiBtaWwgbmV0IG9yZyBwZXIgJyxcbiAgICAgICdraSc6JyBiaXogY29tIGRlIGVkdSBnb3YgaW5mbyBtb2IgbmV0IG9yZyB0ZWwgJyxcbiAgICAgICdrbSc6JyBhc3NvIGNvbSBjb29wIGVkdSBnb3V2IGsgbWVkZWNpbiBtaWwgbm9tIG5vdGFpcmVzIHBoYXJtYWNpZW5zIHByZXNzZSB0bSB2ZXRlcmluYWlyZSAnLFxuICAgICAgJ2tuJzonIGVkdSBnb3YgbmV0IG9yZyAnLFxuICAgICAgJ2tyJzonIGFjIGJ1c2FuIGNodW5nYnVrIGNodW5nbmFtIGNvIGRhZWd1IGRhZWplb24gZXMgZ2FuZ3dvbiBnbyBnd2FuZ2p1IGd5ZW9uZ2J1ayBneWVvbmdnaSBneWVvbmduYW0gaHMgaW5jaGVvbiBqZWp1IGplb25idWsgamVvbm5hbSBrIGtnIG1pbCBtcyBuZSBvciBwZSByZSBzYyBzZW91bCB1bHNhbiAnLFxuICAgICAgJ2t3JzonIGNvbSBlZHUgZ292IG5ldCBvcmcgJyxcbiAgICAgICdreSc6JyBjb20gZWR1IGdvdiBuZXQgb3JnICcsXG4gICAgICAna3onOicgY29tIGVkdSBnb3YgbWlsIG5ldCBvcmcgJyxcbiAgICAgICdsYic6JyBjb20gZWR1IGdvdiBuZXQgb3JnICcsXG4gICAgICAnbGsnOicgYXNzbiBjb20gZWR1IGdvdiBncnAgaG90ZWwgaW50IGx0ZCBuZXQgbmdvIG9yZyBzY2ggc29jIHdlYiAnLFxuICAgICAgJ2xyJzonIGNvbSBlZHUgZ292IG5ldCBvcmcgJyxcbiAgICAgICdsdic6JyBhc24gY29tIGNvbmYgZWR1IGdvdiBpZCBtaWwgbmV0IG9yZyAnLFxuICAgICAgJ2x5JzonIGNvbSBlZHUgZ292IGlkIG1lZCBuZXQgb3JnIHBsYyBzY2ggJyxcbiAgICAgICdtYSc6JyBhYyBjbyBnb3YgbSBuZXQgb3JnIHByZXNzICcsXG4gICAgICAnbWMnOicgYXNzbyB0bSAnLFxuICAgICAgJ21lJzonIGFjIGNvIGVkdSBnb3YgaXRzIG5ldCBvcmcgcHJpdiAnLFxuICAgICAgJ21nJzonIGNvbSBlZHUgZ292IG1pbCBub20gb3JnIHByZCB0bSAnLFxuICAgICAgJ21rJzonIGNvbSBlZHUgZ292IGluZiBuYW1lIG5ldCBvcmcgcHJvICcsXG4gICAgICAnbWwnOicgY29tIGVkdSBnb3YgbmV0IG9yZyBwcmVzc2UgJyxcbiAgICAgICdtbic6JyBlZHUgZ292IG9yZyAnLFxuICAgICAgJ21vJzonIGNvbSBlZHUgZ292IG5ldCBvcmcgJyxcbiAgICAgICdtdCc6JyBjb20gZWR1IGdvdiBuZXQgb3JnICcsXG4gICAgICAnbXYnOicgYWVybyBiaXogY29tIGNvb3AgZWR1IGdvdiBpbmZvIGludCBtaWwgbXVzZXVtIG5hbWUgbmV0IG9yZyBwcm8gJyxcbiAgICAgICdtdyc6JyBhYyBjbyBjb20gY29vcCBlZHUgZ292IGludCBtdXNldW0gbmV0IG9yZyAnLFxuICAgICAgJ214JzonIGNvbSBlZHUgZ29iIG5ldCBvcmcgJyxcbiAgICAgICdteSc6JyBjb20gZWR1IGdvdiBtaWwgbmFtZSBuZXQgb3JnIHNjaCAnLFxuICAgICAgJ25mJzonIGFydHMgY29tIGZpcm0gaW5mbyBuZXQgb3RoZXIgcGVyIHJlYyBzdG9yZSB3ZWIgJyxcbiAgICAgICduZyc6JyBiaXogY29tIGVkdSBnb3YgbWlsIG1vYmkgbmFtZSBuZXQgb3JnIHNjaCAnLFxuICAgICAgJ25pJzonIGFjIGNvIGNvbSBlZHUgZ29iIG1pbCBuZXQgbm9tIG9yZyAnLFxuICAgICAgJ25wJzonIGNvbSBlZHUgZ292IG1pbCBuZXQgb3JnICcsXG4gICAgICAnbnInOicgYml6IGNvbSBlZHUgZ292IGluZm8gbmV0IG9yZyAnLFxuICAgICAgJ29tJzonIGFjIGJpeiBjbyBjb20gZWR1IGdvdiBtZWQgbWlsIG11c2V1bSBuZXQgb3JnIHBybyBzY2ggJyxcbiAgICAgICdwZSc6JyBjb20gZWR1IGdvYiBtaWwgbmV0IG5vbSBvcmcgc2xkICcsXG4gICAgICAncGgnOicgY29tIGVkdSBnb3YgaSBtaWwgbmV0IG5nbyBvcmcgJyxcbiAgICAgICdwayc6JyBiaXogY29tIGVkdSBmYW0gZ29iIGdvayBnb24gZ29wIGdvcyBnb3YgbmV0IG9yZyB3ZWIgJyxcbiAgICAgICdwbCc6JyBhcnQgYmlhbHlzdG9rIGJpeiBjb20gZWR1IGdkYSBnZGFuc2sgZ29yem93IGdvdiBpbmZvIGthdG93aWNlIGtyYWtvdyBsb2R6IGx1YmxpbiBtaWwgbmV0IG5nbyBvbHN6dHluIG9yZyBwb3puYW4gcHdyIHJhZG9tIHNsdXBzayBzemN6ZWNpbiB0b3J1biB3YXJzemF3YSB3YXcgd3JvYyB3cm9jbGF3IHpnb3JhICcsXG4gICAgICAncHInOicgYWMgYml6IGNvbSBlZHUgZXN0IGdvdiBpbmZvIGlzbGEgbmFtZSBuZXQgb3JnIHBybyBwcm9mICcsXG4gICAgICAncHMnOicgY29tIGVkdSBnb3YgbmV0IG9yZyBwbG8gc2VjICcsXG4gICAgICAncHcnOicgYmVsYXUgY28gZWQgZ28gbmUgb3IgJyxcbiAgICAgICdybyc6JyBhcnRzIGNvbSBmaXJtIGluZm8gbm9tIG50IG9yZyByZWMgc3RvcmUgdG0gd3d3ICcsXG4gICAgICAncnMnOicgYWMgY28gZWR1IGdvdiBpbiBvcmcgJyxcbiAgICAgICdzYic6JyBjb20gZWR1IGdvdiBuZXQgb3JnICcsXG4gICAgICAnc2MnOicgY29tIGVkdSBnb3YgbmV0IG9yZyAnLFxuICAgICAgJ3NoJzonIGNvIGNvbSBlZHUgZ292IG5ldCBub20gb3JnICcsXG4gICAgICAnc2wnOicgY29tIGVkdSBnb3YgbmV0IG9yZyAnLFxuICAgICAgJ3N0JzonIGNvIGNvbSBjb25zdWxhZG8gZWR1IGVtYmFpeGFkYSBnb3YgbWlsIG5ldCBvcmcgcHJpbmNpcGUgc2FvdG9tZSBzdG9yZSAnLFxuICAgICAgJ3N2JzonIGNvbSBlZHUgZ29iIG9yZyByZWQgJyxcbiAgICAgICdzeic6JyBhYyBjbyBvcmcgJyxcbiAgICAgICd0cic6JyBhdiBiYnMgYmVsIGJpeiBjb20gZHIgZWR1IGdlbiBnb3YgaW5mbyBrMTIgbmFtZSBuZXQgb3JnIHBvbCB0ZWwgdHNrIHR2IHdlYiAnLFxuICAgICAgJ3R0JzonIGFlcm8gYml6IGNhdCBjbyBjb20gY29vcCBlZHUgZ292IGluZm8gaW50IGpvYnMgbWlsIG1vYmkgbXVzZXVtIG5hbWUgbmV0IG9yZyBwcm8gdGVsIHRyYXZlbCAnLFxuICAgICAgJ3R3JzonIGNsdWIgY29tIGViaXogZWR1IGdhbWUgZ292IGlkdiBtaWwgbmV0IG9yZyAnLFxuICAgICAgJ211JzonIGFjIGNvIGNvbSBnb3YgbmV0IG9yIG9yZyAnLFxuICAgICAgJ216JzonIGFjIGNvIGVkdSBnb3Ygb3JnICcsXG4gICAgICAnbmEnOicgY28gY29tICcsXG4gICAgICAnbnonOicgYWMgY28gY3JpIGdlZWsgZ2VuIGdvdnQgaGVhbHRoIGl3aSBtYW9yaSBtaWwgbmV0IG9yZyBwYXJsaWFtZW50IHNjaG9vbCAnLFxuICAgICAgJ3BhJzonIGFibyBhYyBjb20gZWR1IGdvYiBpbmcgbWVkIG5ldCBub20gb3JnIHNsZCAnLFxuICAgICAgJ3B0JzonIGNvbSBlZHUgZ292IGludCBuZXQgbm9tZSBvcmcgcHVibCAnLFxuICAgICAgJ3B5JzonIGNvbSBlZHUgZ292IG1pbCBuZXQgb3JnICcsXG4gICAgICAncWEnOicgY29tIGVkdSBnb3YgbWlsIG5ldCBvcmcgJyxcbiAgICAgICdyZSc6JyBhc3NvIGNvbSBub20gJyxcbiAgICAgICdydSc6JyBhYyBhZHlnZXlhIGFsdGFpIGFtdXIgYXJraGFuZ2Vsc2sgYXN0cmFraGFuIGJhc2hraXJpYSBiZWxnb3JvZCBiaXIgYnJ5YW5zayBidXJ5YXRpYSBjYmcgY2hlbCBjaGVseWFiaW5zayBjaGl0YSBjaHVrb3RrYSBjaHV2YXNoaWEgY29tIGRhZ2VzdGFuIGUtYnVyZyBlZHUgZ292IGdyb3pueSBpbnQgaXJrdXRzayBpdmFub3ZvIGl6aGV2c2sgamFyIGpvc2hrYXItb2xhIGthbG15a2lhIGthbHVnYSBrYW1jaGF0a2Ega2FyZWxpYSBrYXphbiBrY2hyIGtlbWVyb3ZvIGtoYWJhcm92c2sga2hha2Fzc2lhIGtodiBraXJvdiBrb2VuaWcga29taSBrb3N0cm9tYSBrcmFub3lhcnNrIGt1YmFuIGt1cmdhbiBrdXJzayBsaXBldHNrIG1hZ2FkYW4gbWFyaSBtYXJpLWVsIG1hcmluZSBtaWwgbW9yZG92aWEgbW9zcmVnIG1zayBtdXJtYW5zayBuYWxjaGlrIG5ldCBubm92IG5vdiBub3Zvc2liaXJzayBuc2sgb21zayBvcmVuYnVyZyBvcmcgb3J5b2wgcGVuemEgcGVybSBwcCBwc2tvdiBwdHogcm5kIHJ5YXphbiBzYWtoYWxpbiBzYW1hcmEgc2FyYXRvdiBzaW1iaXJzayBzbW9sZW5zayBzcGIgc3RhdnJvcG9sIHN0diBzdXJndXQgdGFtYm92IHRhdGFyc3RhbiB0b20gdG9tc2sgdHNhcml0c3luIHRzayB0dWxhIHR1dmEgdHZlciB0eXVtZW4gdWRtIHVkbXVydGlhIHVsYW4tdWRlIHZsYWRpa2F2a2F6IHZsYWRpbWlyIHZsYWRpdm9zdG9rIHZvbGdvZ3JhZCB2b2xvZ2RhIHZvcm9uZXpoIHZybiB2eWF0a2EgeWFrdXRpYSB5YW1hbCB5ZWthdGVyaW5idXJnIHl1emhuby1zYWtoYWxpbnNrICcsXG4gICAgICAncncnOicgYWMgY28gY29tIGVkdSBnb3V2IGdvdiBpbnQgbWlsIG5ldCAnLFxuICAgICAgJ3NhJzonIGNvbSBlZHUgZ292IG1lZCBuZXQgb3JnIHB1YiBzY2ggJyxcbiAgICAgICdzZCc6JyBjb20gZWR1IGdvdiBpbmZvIG1lZCBuZXQgb3JnIHR2ICcsXG4gICAgICAnc2UnOicgYSBhYyBiIGJkIGMgZCBlIGYgZyBoIGkgayBsIG0gbiBvIG9yZyBwIHBhcnRpIHBwIHByZXNzIHIgcyB0IHRtIHUgdyB4IHkgeiAnLFxuICAgICAgJ3NnJzonIGNvbSBlZHUgZ292IGlkbiBuZXQgb3JnIHBlciAnLFxuICAgICAgJ3NuJzonIGFydCBjb20gZWR1IGdvdXYgb3JnIHBlcnNvIHVuaXYgJyxcbiAgICAgICdzeSc6JyBjb20gZWR1IGdvdiBtaWwgbmV0IG5ld3Mgb3JnICcsXG4gICAgICAndGgnOicgYWMgY28gZ28gaW4gbWkgbmV0IG9yICcsXG4gICAgICAndGonOicgYWMgYml6IGNvIGNvbSBlZHUgZ28gZ292IGluZm8gaW50IG1pbCBuYW1lIG5ldCBuaWMgb3JnIHRlc3Qgd2ViICcsXG4gICAgICAndG4nOicgYWdyaW5ldCBjb20gZGVmZW5zZSBlZHVuZXQgZW5zIGZpbiBnb3YgaW5kIGluZm8gaW50bCBtaW5jb20gbmF0IG5ldCBvcmcgcGVyc28gcm5ydCBybnMgcm51IHRvdXJpc20gJyxcbiAgICAgICd0eic6JyBhYyBjbyBnbyBuZSBvciAnLFxuICAgICAgJ3VhJzonIGJpeiBjaGVya2Fzc3kgY2hlcm5pZ292IGNoZXJub3Z0c3kgY2sgY24gY28gY29tIGNyaW1lYSBjdiBkbiBkbmVwcm9wZXRyb3ZzayBkb25ldHNrIGRwIGVkdSBnb3YgaWYgaW4gaXZhbm8tZnJhbmtpdnNrIGtoIGtoYXJrb3Yga2hlcnNvbiBraG1lbG5pdHNraXkga2lldiBraXJvdm9ncmFkIGttIGtyIGtzIGt2IGxnIGx1Z2Fuc2sgbHV0c2sgbHZpdiBtZSBtayBuZXQgbmlrb2xhZXYgb2Qgb2Rlc3NhIG9yZyBwbCBwb2x0YXZhIHBwIHJvdm5vIHJ2IHNlYmFzdG9wb2wgc3VteSB0ZSB0ZXJub3BpbCB1emhnb3JvZCB2aW5uaWNhIHZuIHphcG9yaXpoemhlIHpoaXRvbWlyIHpwIHp0ICcsXG4gICAgICAndWcnOicgYWMgY28gZ28gbmUgb3Igb3JnIHNjICcsXG4gICAgICAndWsnOicgYWMgYmwgYnJpdGlzaC1saWJyYXJ5IGNvIGN5bSBnb3YgZ292dCBpY25ldCBqZXQgbGVhIGx0ZCBtZSBtaWwgbW9kIG5hdGlvbmFsLWxpYnJhcnktc2NvdGxhbmQgbmVsIG5ldCBuaHMgbmljIG5scyBvcmcgb3JnbiBwYXJsaWFtZW50IHBsYyBwb2xpY2Ugc2NoIHNjb3Qgc29jICcsXG4gICAgICAndXMnOicgZG5pIGZlZCBpc2Ega2lkcyBuc24gJyxcbiAgICAgICd1eSc6JyBjb20gZWR1IGd1YiBtaWwgbmV0IG9yZyAnLFxuICAgICAgJ3ZlJzonIGNvIGNvbSBlZHUgZ29iIGluZm8gbWlsIG5ldCBvcmcgd2ViICcsXG4gICAgICAndmknOicgY28gY29tIGsxMiBuZXQgb3JnICcsXG4gICAgICAndm4nOicgYWMgYml6IGNvbSBlZHUgZ292IGhlYWx0aCBpbmZvIGludCBuYW1lIG5ldCBvcmcgcHJvICcsXG4gICAgICAneWUnOicgY28gY29tIGdvdiBsdGQgbWUgbmV0IG9yZyBwbGMgJyxcbiAgICAgICd5dSc6JyBhYyBjbyBlZHUgZ292IG9yZyAnLFxuICAgICAgJ3phJzonIGFjIGFncmljIGFsdCBib3Vyc2UgY2l0eSBjbyBjeWJlcm5ldCBkYiBlZHUgZ292IGdyb25kYXIgaWFjY2VzcyBpbXQgaW5jYSBsYW5kZXNpZ24gbGF3IG1pbCBuZXQgbmdvIG5pcyBub20gb2xpdmV0dGkgb3JnIHBpeCBzY2hvb2wgdG0gd2ViICcsXG4gICAgICAnem0nOicgYWMgY28gY29tIGVkdSBnb3YgbmV0IG9yZyBzY2ggJ1xuICAgIH0sXG4gICAgLy8gZ29yaGlsbCAyMDEzLTEwLTI1OiBVc2luZyBpbmRleE9mKCkgaW5zdGVhZCBSZWdleHAoKS4gU2lnbmlmaWNhbnQgYm9vc3RcbiAgICAvLyBpbiBib3RoIHBlcmZvcm1hbmNlIGFuZCBtZW1vcnkgZm9vdHByaW50LiBObyBpbml0aWFsaXphdGlvbiByZXF1aXJlZC5cbiAgICAvLyBodHRwOi8vanNwZXJmLmNvbS91cmktanMtc2xkLXJlZ2V4LXZzLWJpbmFyeS1zZWFyY2gvNFxuICAgIC8vIEZvbGxvd2luZyBtZXRob2RzIHVzZSBsYXN0SW5kZXhPZigpIHJhdGhlciB0aGFuIGFycmF5LnNwbGl0KCkgaW4gb3JkZXJcbiAgICAvLyB0byBhdm9pZCBhbnkgbWVtb3J5IGFsbG9jYXRpb25zLlxuICAgIGhhczogZnVuY3Rpb24oZG9tYWluKSB7XG4gICAgICB2YXIgdGxkT2Zmc2V0ID0gZG9tYWluLmxhc3RJbmRleE9mKCcuJyk7XG4gICAgICBpZiAodGxkT2Zmc2V0IDw9IDAgfHwgdGxkT2Zmc2V0ID49IChkb21haW4ubGVuZ3RoLTEpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHZhciBzbGRPZmZzZXQgPSBkb21haW4ubGFzdEluZGV4T2YoJy4nLCB0bGRPZmZzZXQtMSk7XG4gICAgICBpZiAoc2xkT2Zmc2V0IDw9IDAgfHwgc2xkT2Zmc2V0ID49ICh0bGRPZmZzZXQtMSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgdmFyIHNsZExpc3QgPSBTTEQubGlzdFtkb21haW4uc2xpY2UodGxkT2Zmc2V0KzEpXTtcbiAgICAgIGlmICghc2xkTGlzdCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2xkTGlzdC5pbmRleE9mKCcgJyArIGRvbWFpbi5zbGljZShzbGRPZmZzZXQrMSwgdGxkT2Zmc2V0KSArICcgJykgPj0gMDtcbiAgICB9LFxuICAgIGlzOiBmdW5jdGlvbihkb21haW4pIHtcbiAgICAgIHZhciB0bGRPZmZzZXQgPSBkb21haW4ubGFzdEluZGV4T2YoJy4nKTtcbiAgICAgIGlmICh0bGRPZmZzZXQgPD0gMCB8fCB0bGRPZmZzZXQgPj0gKGRvbWFpbi5sZW5ndGgtMSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgdmFyIHNsZE9mZnNldCA9IGRvbWFpbi5sYXN0SW5kZXhPZignLicsIHRsZE9mZnNldC0xKTtcbiAgICAgIGlmIChzbGRPZmZzZXQgPj0gMCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICB2YXIgc2xkTGlzdCA9IFNMRC5saXN0W2RvbWFpbi5zbGljZSh0bGRPZmZzZXQrMSldO1xuICAgICAgaWYgKCFzbGRMaXN0KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzbGRMaXN0LmluZGV4T2YoJyAnICsgZG9tYWluLnNsaWNlKDAsIHRsZE9mZnNldCkgKyAnICcpID49IDA7XG4gICAgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKGRvbWFpbikge1xuICAgICAgdmFyIHRsZE9mZnNldCA9IGRvbWFpbi5sYXN0SW5kZXhPZignLicpO1xuICAgICAgaWYgKHRsZE9mZnNldCA8PSAwIHx8IHRsZE9mZnNldCA+PSAoZG9tYWluLmxlbmd0aC0xKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHZhciBzbGRPZmZzZXQgPSBkb21haW4ubGFzdEluZGV4T2YoJy4nLCB0bGRPZmZzZXQtMSk7XG4gICAgICBpZiAoc2xkT2Zmc2V0IDw9IDAgfHwgc2xkT2Zmc2V0ID49ICh0bGRPZmZzZXQtMSkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICB2YXIgc2xkTGlzdCA9IFNMRC5saXN0W2RvbWFpbi5zbGljZSh0bGRPZmZzZXQrMSldO1xuICAgICAgaWYgKCFzbGRMaXN0KSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgaWYgKHNsZExpc3QuaW5kZXhPZignICcgKyBkb21haW4uc2xpY2Uoc2xkT2Zmc2V0KzEsIHRsZE9mZnNldCkgKyAnICcpIDwgMCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkb21haW4uc2xpY2Uoc2xkT2Zmc2V0KzEpO1xuICAgIH0sXG4gICAgbm9Db25mbGljdDogZnVuY3Rpb24oKXtcbiAgICAgIGlmIChyb290LlNlY29uZExldmVsRG9tYWlucyA9PT0gdGhpcykge1xuICAgICAgICByb290LlNlY29uZExldmVsRG9tYWlucyA9IF9TZWNvbmRMZXZlbERvbWFpbnM7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIFNMRDtcbn0pKTtcbiIsIi8qIVxuICogVVJJLmpzIC0gTXV0YXRpbmcgVVJMc1xuICpcbiAqIFZlcnNpb246IDEuMTYuMVxuICpcbiAqIEF1dGhvcjogUm9kbmV5IFJlaG1cbiAqIFdlYjogaHR0cDovL21lZGlhbGl6ZS5naXRodWIuaW8vVVJJLmpzL1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyXG4gKiAgIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqICAgR1BMIHYzIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9HUEwtMy4wXG4gKlxuICovXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICAvLyBodHRwczovL2dpdGh1Yi5jb20vdW1kanMvdW1kL2Jsb2IvbWFzdGVyL3JldHVybkV4cG9ydHMuanNcbiAgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIC8vIE5vZGVcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZSgnLi9wdW55Y29kZScpLCByZXF1aXJlKCcuL0lQdjYnKSwgcmVxdWlyZSgnLi9TZWNvbmRMZXZlbERvbWFpbnMnKSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgIGRlZmluZShbJy4vcHVueWNvZGUnLCAnLi9JUHY2JywgJy4vU2Vjb25kTGV2ZWxEb21haW5zJ10sIGZhY3RvcnkpO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXG4gICAgcm9vdC5VUkkgPSBmYWN0b3J5KHJvb3QucHVueWNvZGUsIHJvb3QuSVB2Niwgcm9vdC5TZWNvbmRMZXZlbERvbWFpbnMsIHJvb3QpO1xuICB9XG59KHRoaXMsIGZ1bmN0aW9uIChwdW55Y29kZSwgSVB2NiwgU0xELCByb290KSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgLypnbG9iYWwgbG9jYXRpb24sIGVzY2FwZSwgdW5lc2NhcGUgKi9cbiAgLy8gRklYTUU6IHYyLjAuMCByZW5hbWNlIG5vbi1jYW1lbENhc2UgcHJvcGVydGllcyB0byB1cHBlcmNhc2VcbiAgLypqc2hpbnQgY2FtZWxjYXNlOiBmYWxzZSAqL1xuXG4gIC8vIHNhdmUgY3VycmVudCBVUkkgdmFyaWFibGUsIGlmIGFueVxuICB2YXIgX1VSSSA9IHJvb3QgJiYgcm9vdC5VUkk7XG5cbiAgZnVuY3Rpb24gVVJJKHVybCwgYmFzZSkge1xuICAgIHZhciBfdXJsU3VwcGxpZWQgPSBhcmd1bWVudHMubGVuZ3RoID49IDE7XG4gICAgdmFyIF9iYXNlU3VwcGxpZWQgPSBhcmd1bWVudHMubGVuZ3RoID49IDI7XG5cbiAgICAvLyBBbGxvdyBpbnN0YW50aWF0aW9uIHdpdGhvdXQgdGhlICduZXcnIGtleXdvcmRcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgVVJJKSkge1xuICAgICAgaWYgKF91cmxTdXBwbGllZCkge1xuICAgICAgICBpZiAoX2Jhc2VTdXBwbGllZCkge1xuICAgICAgICAgIHJldHVybiBuZXcgVVJJKHVybCwgYmFzZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFVSSSh1cmwpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFVSSSgpO1xuICAgIH1cblxuICAgIGlmICh1cmwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKF91cmxTdXBwbGllZCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd1bmRlZmluZWQgaXMgbm90IGEgdmFsaWQgYXJndW1lbnQgZm9yIFVSSScpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGxvY2F0aW9uICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICB1cmwgPSBsb2NhdGlvbi5ocmVmICsgJyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1cmwgPSAnJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmhyZWYodXJsKTtcblxuICAgIC8vIHJlc29sdmUgdG8gYmFzZSBhY2NvcmRpbmcgdG8gaHR0cDovL2R2Y3MudzMub3JnL2hnL3VybC9yYXctZmlsZS90aXAvT3ZlcnZpZXcuaHRtbCNjb25zdHJ1Y3RvclxuICAgIGlmIChiYXNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmFic29sdXRlVG8oYmFzZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBVUkkudmVyc2lvbiA9ICcxLjE2LjEnO1xuXG4gIHZhciBwID0gVVJJLnByb3RvdHlwZTtcbiAgdmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbiAgZnVuY3Rpb24gZXNjYXBlUmVnRXgoc3RyaW5nKSB7XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21lZGlhbGl6ZS9VUkkuanMvY29tbWl0Lzg1YWMyMTc4M2MxMWY4Y2NhYjA2MTA2ZGJhOTczNWEzMWE4NjkyNGQjY29tbWl0Y29tbWVudC04MjE5NjNcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoLyhbLiorP149IToke30oKXxbXFxdXFwvXFxcXF0pL2csICdcXFxcJDEnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFR5cGUodmFsdWUpIHtcbiAgICAvLyBJRTggZG9lc24ndCByZXR1cm4gW09iamVjdCBVbmRlZmluZWRdIGJ1dCBbT2JqZWN0IE9iamVjdF0gZm9yIHVuZGVmaW5lZCB2YWx1ZVxuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gJ1VuZGVmaW5lZCc7XG4gICAgfVxuXG4gICAgcmV0dXJuIFN0cmluZyhPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpKS5zbGljZSg4LCAtMSk7XG4gIH1cblxuICBmdW5jdGlvbiBpc0FycmF5KG9iaikge1xuICAgIHJldHVybiBnZXRUeXBlKG9iaikgPT09ICdBcnJheSc7XG4gIH1cblxuICBmdW5jdGlvbiBmaWx0ZXJBcnJheVZhbHVlcyhkYXRhLCB2YWx1ZSkge1xuICAgIHZhciBsb29rdXAgPSB7fTtcbiAgICB2YXIgaSwgbGVuZ3RoO1xuXG4gICAgaWYgKGdldFR5cGUodmFsdWUpID09PSAnUmVnRXhwJykge1xuICAgICAgbG9va3VwID0gbnVsbDtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSB2YWx1ZS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBsb29rdXBbdmFsdWVbaV1dID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbG9va3VwW3ZhbHVlXSA9IHRydWU7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMCwgbGVuZ3RoID0gZGF0YS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgLypqc2hpbnQgbGF4YnJlYWs6IHRydWUgKi9cbiAgICAgIHZhciBfbWF0Y2ggPSBsb29rdXAgJiYgbG9va3VwW2RhdGFbaV1dICE9PSB1bmRlZmluZWRcbiAgICAgICAgfHwgIWxvb2t1cCAmJiB2YWx1ZS50ZXN0KGRhdGFbaV0pO1xuICAgICAgLypqc2hpbnQgbGF4YnJlYWs6IGZhbHNlICovXG4gICAgICBpZiAoX21hdGNoKSB7XG4gICAgICAgIGRhdGEuc3BsaWNlKGksIDEpO1xuICAgICAgICBsZW5ndGgtLTtcbiAgICAgICAgaS0tO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgZnVuY3Rpb24gYXJyYXlDb250YWlucyhsaXN0LCB2YWx1ZSkge1xuICAgIHZhciBpLCBsZW5ndGg7XG5cbiAgICAvLyB2YWx1ZSBtYXkgYmUgc3RyaW5nLCBudW1iZXIsIGFycmF5LCByZWdleHBcbiAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIC8vIE5vdGU6IHRoaXMgY2FuIGJlIG9wdGltaXplZCB0byBPKG4pIChpbnN0ZWFkIG9mIGN1cnJlbnQgTyhtICogbikpXG4gICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSB2YWx1ZS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoIWFycmF5Q29udGFpbnMobGlzdCwgdmFsdWVbaV0pKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHZhciBfdHlwZSA9IGdldFR5cGUodmFsdWUpO1xuICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IGxpc3QubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChfdHlwZSA9PT0gJ1JlZ0V4cCcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBsaXN0W2ldID09PSAnc3RyaW5nJyAmJiBsaXN0W2ldLm1hdGNoKHZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGxpc3RbaV0gPT09IHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFycmF5c0VxdWFsKG9uZSwgdHdvKSB7XG4gICAgaWYgKCFpc0FycmF5KG9uZSkgfHwgIWlzQXJyYXkodHdvKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIGFycmF5cyBjYW4ndCBiZSBlcXVhbCBpZiB0aGV5IGhhdmUgZGlmZmVyZW50IGFtb3VudCBvZiBjb250ZW50XG4gICAgaWYgKG9uZS5sZW5ndGggIT09IHR3by5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBvbmUuc29ydCgpO1xuICAgIHR3by5zb3J0KCk7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IG9uZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmIChvbmVbaV0gIT09IHR3b1tpXSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBVUkkuX3BhcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHByb3RvY29sOiBudWxsLFxuICAgICAgdXNlcm5hbWU6IG51bGwsXG4gICAgICBwYXNzd29yZDogbnVsbCxcbiAgICAgIGhvc3RuYW1lOiBudWxsLFxuICAgICAgdXJuOiBudWxsLFxuICAgICAgcG9ydDogbnVsbCxcbiAgICAgIHBhdGg6IG51bGwsXG4gICAgICBxdWVyeTogbnVsbCxcbiAgICAgIGZyYWdtZW50OiBudWxsLFxuICAgICAgLy8gc3RhdGVcbiAgICAgIGR1cGxpY2F0ZVF1ZXJ5UGFyYW1ldGVyczogVVJJLmR1cGxpY2F0ZVF1ZXJ5UGFyYW1ldGVycyxcbiAgICAgIGVzY2FwZVF1ZXJ5U3BhY2U6IFVSSS5lc2NhcGVRdWVyeVNwYWNlXG4gICAgfTtcbiAgfTtcbiAgLy8gc3RhdGU6IGFsbG93IGR1cGxpY2F0ZSBxdWVyeSBwYXJhbWV0ZXJzIChhPTEmYT0xKVxuICBVUkkuZHVwbGljYXRlUXVlcnlQYXJhbWV0ZXJzID0gZmFsc2U7XG4gIC8vIHN0YXRlOiByZXBsYWNlcyArIHdpdGggJTIwIChzcGFjZSBpbiBxdWVyeSBzdHJpbmdzKVxuICBVUkkuZXNjYXBlUXVlcnlTcGFjZSA9IHRydWU7XG4gIC8vIHN0YXRpYyBwcm9wZXJ0aWVzXG4gIFVSSS5wcm90b2NvbF9leHByZXNzaW9uID0gL15bYS16XVthLXowLTkuKy1dKiQvaTtcbiAgVVJJLmlkbl9leHByZXNzaW9uID0gL1teYS16MC05XFwuLV0vaTtcbiAgVVJJLnB1bnljb2RlX2V4cHJlc3Npb24gPSAvKHhuLS0pL2k7XG4gIC8vIHdlbGwsIDMzMy40NDQuNTU1LjY2NiBtYXRjaGVzLCBidXQgaXQgc3VyZSBhaW4ndCBubyBJUHY0IC0gZG8gd2UgY2FyZT9cbiAgVVJJLmlwNF9leHByZXNzaW9uID0gL15cXGR7MSwzfVxcLlxcZHsxLDN9XFwuXFxkezEsM31cXC5cXGR7MSwzfSQvO1xuICAvLyBjcmVkaXRzIHRvIFJpY2ggQnJvd25cbiAgLy8gc291cmNlOiBodHRwOi8vZm9ydW1zLmludGVybWFwcGVyLmNvbS92aWV3dG9waWMucGhwP3A9MTA5NiMxMDk2XG4gIC8vIHNwZWNpZmljYXRpb246IGh0dHA6Ly93d3cuaWV0Zi5vcmcvcmZjL3JmYzQyOTEudHh0XG4gIFVSSS5pcDZfZXhwcmVzc2lvbiA9IC9eXFxzKigoKFswLTlBLUZhLWZdezEsNH06KXs3fShbMC05QS1GYS1mXXsxLDR9fDopKXwoKFswLTlBLUZhLWZdezEsNH06KXs2fSg6WzAtOUEtRmEtZl17MSw0fXwoKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKShcXC4oMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSl8OikpfCgoWzAtOUEtRmEtZl17MSw0fTopezV9KCgoOlswLTlBLUZhLWZdezEsNH0pezEsMn0pfDooKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKShcXC4oMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSl8OikpfCgoWzAtOUEtRmEtZl17MSw0fTopezR9KCgoOlswLTlBLUZhLWZdezEsNH0pezEsM30pfCgoOlswLTlBLUZhLWZdezEsNH0pPzooKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKShcXC4oMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSkpfDopKXwoKFswLTlBLUZhLWZdezEsNH06KXszfSgoKDpbMC05QS1GYS1mXXsxLDR9KXsxLDR9KXwoKDpbMC05QS1GYS1mXXsxLDR9KXswLDJ9OigoMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKFxcLigyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkpezN9KSl8OikpfCgoWzAtOUEtRmEtZl17MSw0fTopezJ9KCgoOlswLTlBLUZhLWZdezEsNH0pezEsNX0pfCgoOlswLTlBLUZhLWZdezEsNH0pezAsM306KCgyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkoXFwuKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKSl7M30pKXw6KSl8KChbMC05QS1GYS1mXXsxLDR9Oil7MX0oKCg6WzAtOUEtRmEtZl17MSw0fSl7MSw2fSl8KCg6WzAtOUEtRmEtZl17MSw0fSl7MCw0fTooKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKShcXC4oMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSkpfDopKXwoOigoKDpbMC05QS1GYS1mXXsxLDR9KXsxLDd9KXwoKDpbMC05QS1GYS1mXXsxLDR9KXswLDV9OigoMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKFxcLigyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkpezN9KSl8OikpKSglLispP1xccyokLztcbiAgLy8gZXhwcmVzc2lvbiB1c2VkIGlzIFwiZ3J1YmVyIHJldmlzZWRcIiAoQGdydWJlciB2MikgZGV0ZXJtaW5lZCB0byBiZSB0aGVcbiAgLy8gYmVzdCBzb2x1dGlvbiBpbiBhIHJlZ2V4LWdvbGYgd2UgZGlkIGEgY291cGxlIG9mIGFnZXMgYWdvIGF0XG4gIC8vICogaHR0cDovL21hdGhpYXNieW5lbnMuYmUvZGVtby91cmwtcmVnZXhcbiAgLy8gKiBodHRwOi8vcm9kbmV5cmVobS5kZS90L3VybC1yZWdleC5odG1sXG4gIFVSSS5maW5kX3VyaV9leHByZXNzaW9uID0gL1xcYigoPzpbYS16XVtcXHctXSs6KD86XFwvezEsM318W2EtejAtOSVdKXx3d3dcXGR7MCwzfVsuXXxbYS16MC05LlxcLV0rWy5dW2Etel17Miw0fVxcLykoPzpbXlxccygpPD5dK3xcXCgoW15cXHMoKTw+XSt8KFxcKFteXFxzKCk8Pl0rXFwpKSkqXFwpKSsoPzpcXCgoW15cXHMoKTw+XSt8KFxcKFteXFxzKCk8Pl0rXFwpKSkqXFwpfFteXFxzYCEoKVxcW1xcXXt9OzonXCIuLDw+P8KrwrvigJzigJ3igJjigJldKSkvaWc7XG4gIFVSSS5maW5kVXJpID0ge1xuICAgIC8vIHZhbGlkIFwic2NoZW1lOi8vXCIgb3IgXCJ3d3cuXCJcbiAgICBzdGFydDogL1xcYig/OihbYS16XVthLXowLTkuKy1dKjpcXC9cXC8pfHd3d1xcLikvZ2ksXG4gICAgLy8gZXZlcnl0aGluZyB1cCB0byB0aGUgbmV4dCB3aGl0ZXNwYWNlXG4gICAgZW5kOiAvW1xcc1xcclxcbl18JC8sXG4gICAgLy8gdHJpbSB0cmFpbGluZyBwdW5jdHVhdGlvbiBjYXB0dXJlZCBieSBlbmQgUmVnRXhwXG4gICAgdHJpbTogL1tgISgpXFxbXFxde307OidcIi4sPD4/wqvCu+KAnOKAneKAnuKAmOKAmV0rJC9cbiAgfTtcbiAgLy8gaHR0cDovL3d3dy5pYW5hLm9yZy9hc3NpZ25tZW50cy91cmktc2NoZW1lcy5odG1sXG4gIC8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGlzdF9vZl9UQ1BfYW5kX1VEUF9wb3J0X251bWJlcnMjV2VsbC1rbm93bl9wb3J0c1xuICBVUkkuZGVmYXVsdFBvcnRzID0ge1xuICAgIGh0dHA6ICc4MCcsXG4gICAgaHR0cHM6ICc0NDMnLFxuICAgIGZ0cDogJzIxJyxcbiAgICBnb3BoZXI6ICc3MCcsXG4gICAgd3M6ICc4MCcsXG4gICAgd3NzOiAnNDQzJ1xuICB9O1xuICAvLyBhbGxvd2VkIGhvc3RuYW1lIGNoYXJhY3RlcnMgYWNjb3JkaW5nIHRvIFJGQyAzOTg2XG4gIC8vIEFMUEhBIERJR0lUIFwiLVwiIFwiLlwiIFwiX1wiIFwiflwiIFwiIVwiIFwiJFwiIFwiJlwiIFwiJ1wiIFwiKFwiIFwiKVwiIFwiKlwiIFwiK1wiIFwiLFwiIFwiO1wiIFwiPVwiICVlbmNvZGVkXG4gIC8vIEkndmUgbmV2ZXIgc2VlbiBhIChub24tSUROKSBob3N0bmFtZSBvdGhlciB0aGFuOiBBTFBIQSBESUdJVCAuIC1cbiAgVVJJLmludmFsaWRfaG9zdG5hbWVfY2hhcmFjdGVycyA9IC9bXmEtekEtWjAtOVxcLi1dLztcbiAgLy8gbWFwIERPTSBFbGVtZW50cyB0byB0aGVpciBVUkkgYXR0cmlidXRlXG4gIFVSSS5kb21BdHRyaWJ1dGVzID0ge1xuICAgICdhJzogJ2hyZWYnLFxuICAgICdibG9ja3F1b3RlJzogJ2NpdGUnLFxuICAgICdsaW5rJzogJ2hyZWYnLFxuICAgICdiYXNlJzogJ2hyZWYnLFxuICAgICdzY3JpcHQnOiAnc3JjJyxcbiAgICAnZm9ybSc6ICdhY3Rpb24nLFxuICAgICdpbWcnOiAnc3JjJyxcbiAgICAnYXJlYSc6ICdocmVmJyxcbiAgICAnaWZyYW1lJzogJ3NyYycsXG4gICAgJ2VtYmVkJzogJ3NyYycsXG4gICAgJ3NvdXJjZSc6ICdzcmMnLFxuICAgICd0cmFjayc6ICdzcmMnLFxuICAgICdpbnB1dCc6ICdzcmMnLCAvLyBidXQgb25seSBpZiB0eXBlPVwiaW1hZ2VcIlxuICAgICdhdWRpbyc6ICdzcmMnLFxuICAgICd2aWRlbyc6ICdzcmMnXG4gIH07XG4gIFVSSS5nZXREb21BdHRyaWJ1dGUgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgaWYgKCFub2RlIHx8ICFub2RlLm5vZGVOYW1lKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHZhciBub2RlTmFtZSA9IG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAvLyA8aW5wdXQ+IHNob3VsZCBvbmx5IGV4cG9zZSBzcmMgZm9yIHR5cGU9XCJpbWFnZVwiXG4gICAgaWYgKG5vZGVOYW1lID09PSAnaW5wdXQnICYmIG5vZGUudHlwZSAhPT0gJ2ltYWdlJykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gVVJJLmRvbUF0dHJpYnV0ZXNbbm9kZU5hbWVdO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGVzY2FwZUZvckR1bWJGaXJlZm94MzYodmFsdWUpIHtcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbWVkaWFsaXplL1VSSS5qcy9pc3N1ZXMvOTFcbiAgICByZXR1cm4gZXNjYXBlKHZhbHVlKTtcbiAgfVxuXG4gIC8vIGVuY29kaW5nIC8gZGVjb2RpbmcgYWNjb3JkaW5nIHRvIFJGQzM5ODZcbiAgZnVuY3Rpb24gc3RyaWN0RW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZykge1xuICAgIC8vIHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL2VuY29kZVVSSUNvbXBvbmVudFxuICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5nKVxuICAgICAgLnJlcGxhY2UoL1shJygpKl0vZywgZXNjYXBlRm9yRHVtYkZpcmVmb3gzNilcbiAgICAgIC5yZXBsYWNlKC9cXCovZywgJyUyQScpO1xuICB9XG4gIFVSSS5lbmNvZGUgPSBzdHJpY3RFbmNvZGVVUklDb21wb25lbnQ7XG4gIFVSSS5kZWNvZGUgPSBkZWNvZGVVUklDb21wb25lbnQ7XG4gIFVSSS5pc284ODU5ID0gZnVuY3Rpb24oKSB7XG4gICAgVVJJLmVuY29kZSA9IGVzY2FwZTtcbiAgICBVUkkuZGVjb2RlID0gdW5lc2NhcGU7XG4gIH07XG4gIFVSSS51bmljb2RlID0gZnVuY3Rpb24oKSB7XG4gICAgVVJJLmVuY29kZSA9IHN0cmljdEVuY29kZVVSSUNvbXBvbmVudDtcbiAgICBVUkkuZGVjb2RlID0gZGVjb2RlVVJJQ29tcG9uZW50O1xuICB9O1xuICBVUkkuY2hhcmFjdGVycyA9IHtcbiAgICBwYXRobmFtZToge1xuICAgICAgZW5jb2RlOiB7XG4gICAgICAgIC8vIFJGQzM5ODYgMi4xOiBGb3IgY29uc2lzdGVuY3ksIFVSSSBwcm9kdWNlcnMgYW5kIG5vcm1hbGl6ZXJzIHNob3VsZFxuICAgICAgICAvLyB1c2UgdXBwZXJjYXNlIGhleGFkZWNpbWFsIGRpZ2l0cyBmb3IgYWxsIHBlcmNlbnQtZW5jb2RpbmdzLlxuICAgICAgICBleHByZXNzaW9uOiAvJSgyNHwyNnwyQnwyQ3wzQnwzRHwzQXw0MCkvaWcsXG4gICAgICAgIG1hcDoge1xuICAgICAgICAgIC8vIC0uX34hJygpKlxuICAgICAgICAgICclMjQnOiAnJCcsXG4gICAgICAgICAgJyUyNic6ICcmJyxcbiAgICAgICAgICAnJTJCJzogJysnLFxuICAgICAgICAgICclMkMnOiAnLCcsXG4gICAgICAgICAgJyUzQic6ICc7JyxcbiAgICAgICAgICAnJTNEJzogJz0nLFxuICAgICAgICAgICclM0EnOiAnOicsXG4gICAgICAgICAgJyU0MCc6ICdAJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZGVjb2RlOiB7XG4gICAgICAgIGV4cHJlc3Npb246IC9bXFwvXFw/I10vZyxcbiAgICAgICAgbWFwOiB7XG4gICAgICAgICAgJy8nOiAnJTJGJyxcbiAgICAgICAgICAnPyc6ICclM0YnLFxuICAgICAgICAgICcjJzogJyUyMydcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgcmVzZXJ2ZWQ6IHtcbiAgICAgIGVuY29kZToge1xuICAgICAgICAvLyBSRkMzOTg2IDIuMTogRm9yIGNvbnNpc3RlbmN5LCBVUkkgcHJvZHVjZXJzIGFuZCBub3JtYWxpemVycyBzaG91bGRcbiAgICAgICAgLy8gdXNlIHVwcGVyY2FzZSBoZXhhZGVjaW1hbCBkaWdpdHMgZm9yIGFsbCBwZXJjZW50LWVuY29kaW5ncy5cbiAgICAgICAgZXhwcmVzc2lvbjogLyUoMjF8MjN8MjR8MjZ8Mjd8Mjh8Mjl8MkF8MkJ8MkN8MkZ8M0F8M0J8M0R8M0Z8NDB8NUJ8NUQpL2lnLFxuICAgICAgICBtYXA6IHtcbiAgICAgICAgICAvLyBnZW4tZGVsaW1zXG4gICAgICAgICAgJyUzQSc6ICc6JyxcbiAgICAgICAgICAnJTJGJzogJy8nLFxuICAgICAgICAgICclM0YnOiAnPycsXG4gICAgICAgICAgJyUyMyc6ICcjJyxcbiAgICAgICAgICAnJTVCJzogJ1snLFxuICAgICAgICAgICclNUQnOiAnXScsXG4gICAgICAgICAgJyU0MCc6ICdAJyxcbiAgICAgICAgICAvLyBzdWItZGVsaW1zXG4gICAgICAgICAgJyUyMSc6ICchJyxcbiAgICAgICAgICAnJTI0JzogJyQnLFxuICAgICAgICAgICclMjYnOiAnJicsXG4gICAgICAgICAgJyUyNyc6ICdcXCcnLFxuICAgICAgICAgICclMjgnOiAnKCcsXG4gICAgICAgICAgJyUyOSc6ICcpJyxcbiAgICAgICAgICAnJTJBJzogJyonLFxuICAgICAgICAgICclMkInOiAnKycsXG4gICAgICAgICAgJyUyQyc6ICcsJyxcbiAgICAgICAgICAnJTNCJzogJzsnLFxuICAgICAgICAgICclM0QnOiAnPSdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgdXJucGF0aDoge1xuICAgICAgLy8gVGhlIGNoYXJhY3RlcnMgdW5kZXIgYGVuY29kZWAgYXJlIHRoZSBjaGFyYWN0ZXJzIGNhbGxlZCBvdXQgYnkgUkZDIDIxNDEgYXMgYmVpbmcgYWNjZXB0YWJsZVxuICAgICAgLy8gZm9yIHVzYWdlIGluIGEgVVJOLiBSRkMyMTQxIGFsc28gY2FsbHMgb3V0IFwiLVwiLCBcIi5cIiwgYW5kIFwiX1wiIGFzIGFjY2VwdGFibGUgY2hhcmFjdGVycywgYnV0XG4gICAgICAvLyB0aGVzZSBhcmVuJ3QgZW5jb2RlZCBieSBlbmNvZGVVUklDb21wb25lbnQsIHNvIHdlIGRvbid0IGhhdmUgdG8gY2FsbCB0aGVtIG91dCBoZXJlLiBBbHNvXG4gICAgICAvLyBub3RlIHRoYXQgdGhlIGNvbG9uIGNoYXJhY3RlciBpcyBub3QgZmVhdHVyZWQgaW4gdGhlIGVuY29kaW5nIG1hcDsgdGhpcyBpcyBiZWNhdXNlIFVSSS5qc1xuICAgICAgLy8gZ2l2ZXMgdGhlIGNvbG9ucyBpbiBVUk5zIHNlbWFudGljIG1lYW5pbmcgYXMgdGhlIGRlbGltaXRlcnMgb2YgcGF0aCBzZWdlbWVudHMsIGFuZCBzbyBpdFxuICAgICAgLy8gc2hvdWxkIG5vdCBhcHBlYXIgdW5lbmNvZGVkIGluIGEgc2VnbWVudCBpdHNlbGYuXG4gICAgICAvLyBTZWUgYWxzbyB0aGUgbm90ZSBhYm92ZSBhYm91dCBSRkMzOTg2IGFuZCBjYXBpdGFsYWxpemVkIGhleCBkaWdpdHMuXG4gICAgICBlbmNvZGU6IHtcbiAgICAgICAgZXhwcmVzc2lvbjogLyUoMjF8MjR8Mjd8Mjh8Mjl8MkF8MkJ8MkN8M0J8M0R8NDApL2lnLFxuICAgICAgICBtYXA6IHtcbiAgICAgICAgICAnJTIxJzogJyEnLFxuICAgICAgICAgICclMjQnOiAnJCcsXG4gICAgICAgICAgJyUyNyc6ICdcXCcnLFxuICAgICAgICAgICclMjgnOiAnKCcsXG4gICAgICAgICAgJyUyOSc6ICcpJyxcbiAgICAgICAgICAnJTJBJzogJyonLFxuICAgICAgICAgICclMkInOiAnKycsXG4gICAgICAgICAgJyUyQyc6ICcsJyxcbiAgICAgICAgICAnJTNCJzogJzsnLFxuICAgICAgICAgICclM0QnOiAnPScsXG4gICAgICAgICAgJyU0MCc6ICdAJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gVGhlc2UgY2hhcmFjdGVycyBhcmUgdGhlIGNoYXJhY3RlcnMgY2FsbGVkIG91dCBieSBSRkMyMTQxIGFzIFwicmVzZXJ2ZWRcIiBjaGFyYWN0ZXJzIHRoYXRcbiAgICAgIC8vIHNob3VsZCBuZXZlciBhcHBlYXIgaW4gYSBVUk4sIHBsdXMgdGhlIGNvbG9uIGNoYXJhY3RlciAoc2VlIG5vdGUgYWJvdmUpLlxuICAgICAgZGVjb2RlOiB7XG4gICAgICAgIGV4cHJlc3Npb246IC9bXFwvXFw/IzpdL2csXG4gICAgICAgIG1hcDoge1xuICAgICAgICAgICcvJzogJyUyRicsXG4gICAgICAgICAgJz8nOiAnJTNGJyxcbiAgICAgICAgICAnIyc6ICclMjMnLFxuICAgICAgICAgICc6JzogJyUzQSdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgVVJJLmVuY29kZVF1ZXJ5ID0gZnVuY3Rpb24oc3RyaW5nLCBlc2NhcGVRdWVyeVNwYWNlKSB7XG4gICAgdmFyIGVzY2FwZWQgPSBVUkkuZW5jb2RlKHN0cmluZyArICcnKTtcbiAgICBpZiAoZXNjYXBlUXVlcnlTcGFjZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBlc2NhcGVRdWVyeVNwYWNlID0gVVJJLmVzY2FwZVF1ZXJ5U3BhY2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVzY2FwZVF1ZXJ5U3BhY2UgPyBlc2NhcGVkLnJlcGxhY2UoLyUyMC9nLCAnKycpIDogZXNjYXBlZDtcbiAgfTtcbiAgVVJJLmRlY29kZVF1ZXJ5ID0gZnVuY3Rpb24oc3RyaW5nLCBlc2NhcGVRdWVyeVNwYWNlKSB7XG4gICAgc3RyaW5nICs9ICcnO1xuICAgIGlmIChlc2NhcGVRdWVyeVNwYWNlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVzY2FwZVF1ZXJ5U3BhY2UgPSBVUkkuZXNjYXBlUXVlcnlTcGFjZTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIFVSSS5kZWNvZGUoZXNjYXBlUXVlcnlTcGFjZSA/IHN0cmluZy5yZXBsYWNlKC9cXCsvZywgJyUyMCcpIDogc3RyaW5nKTtcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIC8vIHdlJ3JlIG5vdCBnb2luZyB0byBtZXNzIHdpdGggd2VpcmQgZW5jb2RpbmdzLFxuICAgICAgLy8gZ2l2ZSB1cCBhbmQgcmV0dXJuIHRoZSB1bmRlY29kZWQgb3JpZ2luYWwgc3RyaW5nXG4gICAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL21lZGlhbGl6ZS9VUkkuanMvaXNzdWVzLzg3XG4gICAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL21lZGlhbGl6ZS9VUkkuanMvaXNzdWVzLzkyXG4gICAgICByZXR1cm4gc3RyaW5nO1xuICAgIH1cbiAgfTtcbiAgLy8gZ2VuZXJhdGUgZW5jb2RlL2RlY29kZSBwYXRoIGZ1bmN0aW9uc1xuICB2YXIgX3BhcnRzID0geydlbmNvZGUnOidlbmNvZGUnLCAnZGVjb2RlJzonZGVjb2RlJ307XG4gIHZhciBfcGFydDtcbiAgdmFyIGdlbmVyYXRlQWNjZXNzb3IgPSBmdW5jdGlvbihfZ3JvdXAsIF9wYXJ0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIFVSSVtfcGFydF0oc3RyaW5nICsgJycpLnJlcGxhY2UoVVJJLmNoYXJhY3RlcnNbX2dyb3VwXVtfcGFydF0uZXhwcmVzc2lvbiwgZnVuY3Rpb24oYykge1xuICAgICAgICAgIHJldHVybiBVUkkuY2hhcmFjdGVyc1tfZ3JvdXBdW19wYXJ0XS5tYXBbY107XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyB3ZSdyZSBub3QgZ29pbmcgdG8gbWVzcyB3aXRoIHdlaXJkIGVuY29kaW5ncyxcbiAgICAgICAgLy8gZ2l2ZSB1cCBhbmQgcmV0dXJuIHRoZSB1bmRlY29kZWQgb3JpZ2luYWwgc3RyaW5nXG4gICAgICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vbWVkaWFsaXplL1VSSS5qcy9pc3N1ZXMvODdcbiAgICAgICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tZWRpYWxpemUvVVJJLmpzL2lzc3Vlcy85MlxuICAgICAgICByZXR1cm4gc3RyaW5nO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgZm9yIChfcGFydCBpbiBfcGFydHMpIHtcbiAgICBVUklbX3BhcnQgKyAnUGF0aFNlZ21lbnQnXSA9IGdlbmVyYXRlQWNjZXNzb3IoJ3BhdGhuYW1lJywgX3BhcnRzW19wYXJ0XSk7XG4gICAgVVJJW19wYXJ0ICsgJ1VyblBhdGhTZWdtZW50J10gPSBnZW5lcmF0ZUFjY2Vzc29yKCd1cm5wYXRoJywgX3BhcnRzW19wYXJ0XSk7XG4gIH1cblxuICB2YXIgZ2VuZXJhdGVTZWdtZW50ZWRQYXRoRnVuY3Rpb24gPSBmdW5jdGlvbihfc2VwLCBfY29kaW5nRnVuY05hbWUsIF9pbm5lckNvZGluZ0Z1bmNOYW1lKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgLy8gV2h5IHBhc3MgaW4gbmFtZXMgb2YgZnVuY3Rpb25zLCByYXRoZXIgdGhhbiB0aGUgZnVuY3Rpb24gb2JqZWN0cyB0aGVtc2VsdmVzPyBUaGVcbiAgICAgIC8vIGRlZmluaXRpb25zIG9mIHNvbWUgZnVuY3Rpb25zIChidXQgaW4gcGFydGljdWxhciwgVVJJLmRlY29kZSkgd2lsbCBvY2Nhc2lvbmFsbHkgY2hhbmdlIGR1ZVxuICAgICAgLy8gdG8gVVJJLmpzIGhhdmluZyBJU084ODU5IGFuZCBVbmljb2RlIG1vZGVzLiBQYXNzaW5nIGluIHRoZSBuYW1lIGFuZCBnZXR0aW5nIGl0IHdpbGwgZW5zdXJlXG4gICAgICAvLyB0aGF0IHRoZSBmdW5jdGlvbnMgd2UgdXNlIGhlcmUgYXJlIFwiZnJlc2hcIi5cbiAgICAgIHZhciBhY3R1YWxDb2RpbmdGdW5jO1xuICAgICAgaWYgKCFfaW5uZXJDb2RpbmdGdW5jTmFtZSkge1xuICAgICAgICBhY3R1YWxDb2RpbmdGdW5jID0gVVJJW19jb2RpbmdGdW5jTmFtZV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhY3R1YWxDb2RpbmdGdW5jID0gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICAgICAgcmV0dXJuIFVSSVtfY29kaW5nRnVuY05hbWVdKFVSSVtfaW5uZXJDb2RpbmdGdW5jTmFtZV0oc3RyaW5nKSk7XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHZhciBzZWdtZW50cyA9IChzdHJpbmcgKyAnJykuc3BsaXQoX3NlcCk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBzZWdtZW50cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBzZWdtZW50c1tpXSA9IGFjdHVhbENvZGluZ0Z1bmMoc2VnbWVudHNbaV0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2VnbWVudHMuam9pbihfc2VwKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFRoaXMgdGFrZXMgcGxhY2Ugb3V0c2lkZSB0aGUgYWJvdmUgbG9vcCBiZWNhdXNlIHdlIGRvbid0IHdhbnQsIGUuZy4sIGVuY29kZVVyblBhdGggZnVuY3Rpb25zLlxuICBVUkkuZGVjb2RlUGF0aCA9IGdlbmVyYXRlU2VnbWVudGVkUGF0aEZ1bmN0aW9uKCcvJywgJ2RlY29kZVBhdGhTZWdtZW50Jyk7XG4gIFVSSS5kZWNvZGVVcm5QYXRoID0gZ2VuZXJhdGVTZWdtZW50ZWRQYXRoRnVuY3Rpb24oJzonLCAnZGVjb2RlVXJuUGF0aFNlZ21lbnQnKTtcbiAgVVJJLnJlY29kZVBhdGggPSBnZW5lcmF0ZVNlZ21lbnRlZFBhdGhGdW5jdGlvbignLycsICdlbmNvZGVQYXRoU2VnbWVudCcsICdkZWNvZGUnKTtcbiAgVVJJLnJlY29kZVVyblBhdGggPSBnZW5lcmF0ZVNlZ21lbnRlZFBhdGhGdW5jdGlvbignOicsICdlbmNvZGVVcm5QYXRoU2VnbWVudCcsICdkZWNvZGUnKTtcblxuICBVUkkuZW5jb2RlUmVzZXJ2ZWQgPSBnZW5lcmF0ZUFjY2Vzc29yKCdyZXNlcnZlZCcsICdlbmNvZGUnKTtcblxuICBVUkkucGFyc2UgPSBmdW5jdGlvbihzdHJpbmcsIHBhcnRzKSB7XG4gICAgdmFyIHBvcztcbiAgICBpZiAoIXBhcnRzKSB7XG4gICAgICBwYXJ0cyA9IHt9O1xuICAgIH1cbiAgICAvLyBbcHJvdG9jb2xcIjovL1wiW3VzZXJuYW1lW1wiOlwicGFzc3dvcmRdXCJAXCJdaG9zdG5hbWVbXCI6XCJwb3J0XVwiL1wiP11bcGF0aF1bXCI/XCJxdWVyeXN0cmluZ11bXCIjXCJmcmFnbWVudF1cblxuICAgIC8vIGV4dHJhY3QgZnJhZ21lbnRcbiAgICBwb3MgPSBzdHJpbmcuaW5kZXhPZignIycpO1xuICAgIGlmIChwb3MgPiAtMSkge1xuICAgICAgLy8gZXNjYXBpbmc/XG4gICAgICBwYXJ0cy5mcmFnbWVudCA9IHN0cmluZy5zdWJzdHJpbmcocG9zICsgMSkgfHwgbnVsbDtcbiAgICAgIHN0cmluZyA9IHN0cmluZy5zdWJzdHJpbmcoMCwgcG9zKTtcbiAgICB9XG5cbiAgICAvLyBleHRyYWN0IHF1ZXJ5XG4gICAgcG9zID0gc3RyaW5nLmluZGV4T2YoJz8nKTtcbiAgICBpZiAocG9zID4gLTEpIHtcbiAgICAgIC8vIGVzY2FwaW5nP1xuICAgICAgcGFydHMucXVlcnkgPSBzdHJpbmcuc3Vic3RyaW5nKHBvcyArIDEpIHx8IG51bGw7XG4gICAgICBzdHJpbmcgPSBzdHJpbmcuc3Vic3RyaW5nKDAsIHBvcyk7XG4gICAgfVxuXG4gICAgLy8gZXh0cmFjdCBwcm90b2NvbFxuICAgIGlmIChzdHJpbmcuc3Vic3RyaW5nKDAsIDIpID09PSAnLy8nKSB7XG4gICAgICAvLyByZWxhdGl2ZS1zY2hlbWVcbiAgICAgIHBhcnRzLnByb3RvY29sID0gbnVsbDtcbiAgICAgIHN0cmluZyA9IHN0cmluZy5zdWJzdHJpbmcoMik7XG4gICAgICAvLyBleHRyYWN0IFwidXNlcjpwYXNzQGhvc3Q6cG9ydFwiXG4gICAgICBzdHJpbmcgPSBVUkkucGFyc2VBdXRob3JpdHkoc3RyaW5nLCBwYXJ0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvcyA9IHN0cmluZy5pbmRleE9mKCc6Jyk7XG4gICAgICBpZiAocG9zID4gLTEpIHtcbiAgICAgICAgcGFydHMucHJvdG9jb2wgPSBzdHJpbmcuc3Vic3RyaW5nKDAsIHBvcykgfHwgbnVsbDtcbiAgICAgICAgaWYgKHBhcnRzLnByb3RvY29sICYmICFwYXJ0cy5wcm90b2NvbC5tYXRjaChVUkkucHJvdG9jb2xfZXhwcmVzc2lvbikpIHtcbiAgICAgICAgICAvLyA6IG1heSBiZSB3aXRoaW4gdGhlIHBhdGhcbiAgICAgICAgICBwYXJ0cy5wcm90b2NvbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIGlmIChzdHJpbmcuc3Vic3RyaW5nKHBvcyArIDEsIHBvcyArIDMpID09PSAnLy8nKSB7XG4gICAgICAgICAgc3RyaW5nID0gc3RyaW5nLnN1YnN0cmluZyhwb3MgKyAzKTtcblxuICAgICAgICAgIC8vIGV4dHJhY3QgXCJ1c2VyOnBhc3NAaG9zdDpwb3J0XCJcbiAgICAgICAgICBzdHJpbmcgPSBVUkkucGFyc2VBdXRob3JpdHkoc3RyaW5nLCBwYXJ0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RyaW5nID0gc3RyaW5nLnN1YnN0cmluZyhwb3MgKyAxKTtcbiAgICAgICAgICBwYXJ0cy51cm4gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gd2hhdCdzIGxlZnQgbXVzdCBiZSB0aGUgcGF0aFxuICAgIHBhcnRzLnBhdGggPSBzdHJpbmc7XG5cbiAgICAvLyBhbmQgd2UncmUgZG9uZVxuICAgIHJldHVybiBwYXJ0cztcbiAgfTtcbiAgVVJJLnBhcnNlSG9zdCA9IGZ1bmN0aW9uKHN0cmluZywgcGFydHMpIHtcbiAgICAvLyBDb3B5IGNocm9tZSwgSUUsIG9wZXJhIGJhY2tzbGFzaC1oYW5kbGluZyBiZWhhdmlvci5cbiAgICAvLyBCYWNrIHNsYXNoZXMgYmVmb3JlIHRoZSBxdWVyeSBzdHJpbmcgZ2V0IGNvbnZlcnRlZCB0byBmb3J3YXJkIHNsYXNoZXNcbiAgICAvLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9qb3llbnQvbm9kZS9ibG9iLzM4NmZkMjRmNDliMGU5ZDFhOGEwNzY1OTJhNDA0MTY4ZmFlZWNjMzQvbGliL3VybC5qcyNMMTE1LUwxMjRcbiAgICAvLyBTZWU6IGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD0yNTkxNlxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tZWRpYWxpemUvVVJJLmpzL3B1bGwvMjMzXG4gICAgc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UoL1xcXFwvZywgJy8nKTtcblxuICAgIC8vIGV4dHJhY3QgaG9zdDpwb3J0XG4gICAgdmFyIHBvcyA9IHN0cmluZy5pbmRleE9mKCcvJyk7XG4gICAgdmFyIGJyYWNrZXRQb3M7XG4gICAgdmFyIHQ7XG5cbiAgICBpZiAocG9zID09PSAtMSkge1xuICAgICAgcG9zID0gc3RyaW5nLmxlbmd0aDtcbiAgICB9XG5cbiAgICBpZiAoc3RyaW5nLmNoYXJBdCgwKSA9PT0gJ1snKSB7XG4gICAgICAvLyBJUHY2IGhvc3QgLSBodHRwOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9kcmFmdC1pZXRmLTZtYW4tdGV4dC1hZGRyLXJlcHJlc2VudGF0aW9uLTA0I3NlY3Rpb24tNlxuICAgICAgLy8gSSBjbGFpbSBtb3N0IGNsaWVudCBzb2Z0d2FyZSBicmVha3Mgb24gSVB2NiBhbnl3YXlzLiBUbyBzaW1wbGlmeSB0aGluZ3MsIFVSSSBvbmx5IGFjY2VwdHNcbiAgICAgIC8vIElQdjYrcG9ydCBpbiB0aGUgZm9ybWF0IFsyMDAxOmRiODo6MV06ODAgKGZvciB0aGUgdGltZSBiZWluZylcbiAgICAgIGJyYWNrZXRQb3MgPSBzdHJpbmcuaW5kZXhPZignXScpO1xuICAgICAgcGFydHMuaG9zdG5hbWUgPSBzdHJpbmcuc3Vic3RyaW5nKDEsIGJyYWNrZXRQb3MpIHx8IG51bGw7XG4gICAgICBwYXJ0cy5wb3J0ID0gc3RyaW5nLnN1YnN0cmluZyhicmFja2V0UG9zICsgMiwgcG9zKSB8fCBudWxsO1xuICAgICAgaWYgKHBhcnRzLnBvcnQgPT09ICcvJykge1xuICAgICAgICBwYXJ0cy5wb3J0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGZpcnN0Q29sb24gPSBzdHJpbmcuaW5kZXhPZignOicpO1xuICAgICAgdmFyIGZpcnN0U2xhc2ggPSBzdHJpbmcuaW5kZXhPZignLycpO1xuICAgICAgdmFyIG5leHRDb2xvbiA9IHN0cmluZy5pbmRleE9mKCc6JywgZmlyc3RDb2xvbiArIDEpO1xuICAgICAgaWYgKG5leHRDb2xvbiAhPT0gLTEgJiYgKGZpcnN0U2xhc2ggPT09IC0xIHx8IG5leHRDb2xvbiA8IGZpcnN0U2xhc2gpKSB7XG4gICAgICAgIC8vIElQdjYgaG9zdCBjb250YWlucyBtdWx0aXBsZSBjb2xvbnMgLSBidXQgbm8gcG9ydFxuICAgICAgICAvLyB0aGlzIG5vdGF0aW9uIGlzIGFjdHVhbGx5IG5vdCBhbGxvd2VkIGJ5IFJGQyAzOTg2LCBidXQgd2UncmUgYSBsaWJlcmFsIHBhcnNlclxuICAgICAgICBwYXJ0cy5ob3N0bmFtZSA9IHN0cmluZy5zdWJzdHJpbmcoMCwgcG9zKSB8fCBudWxsO1xuICAgICAgICBwYXJ0cy5wb3J0ID0gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHQgPSBzdHJpbmcuc3Vic3RyaW5nKDAsIHBvcykuc3BsaXQoJzonKTtcbiAgICAgICAgcGFydHMuaG9zdG5hbWUgPSB0WzBdIHx8IG51bGw7XG4gICAgICAgIHBhcnRzLnBvcnQgPSB0WzFdIHx8IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBhcnRzLmhvc3RuYW1lICYmIHN0cmluZy5zdWJzdHJpbmcocG9zKS5jaGFyQXQoMCkgIT09ICcvJykge1xuICAgICAgcG9zKys7XG4gICAgICBzdHJpbmcgPSAnLycgKyBzdHJpbmc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0cmluZy5zdWJzdHJpbmcocG9zKSB8fCAnLyc7XG4gIH07XG4gIFVSSS5wYXJzZUF1dGhvcml0eSA9IGZ1bmN0aW9uKHN0cmluZywgcGFydHMpIHtcbiAgICBzdHJpbmcgPSBVUkkucGFyc2VVc2VyaW5mbyhzdHJpbmcsIHBhcnRzKTtcbiAgICByZXR1cm4gVVJJLnBhcnNlSG9zdChzdHJpbmcsIHBhcnRzKTtcbiAgfTtcbiAgVVJJLnBhcnNlVXNlcmluZm8gPSBmdW5jdGlvbihzdHJpbmcsIHBhcnRzKSB7XG4gICAgLy8gZXh0cmFjdCB1c2VybmFtZTpwYXNzd29yZFxuICAgIHZhciBmaXJzdFNsYXNoID0gc3RyaW5nLmluZGV4T2YoJy8nKTtcbiAgICB2YXIgcG9zID0gc3RyaW5nLmxhc3RJbmRleE9mKCdAJywgZmlyc3RTbGFzaCA+IC0xID8gZmlyc3RTbGFzaCA6IHN0cmluZy5sZW5ndGggLSAxKTtcbiAgICB2YXIgdDtcblxuICAgIC8vIGF1dGhvcml0eUAgbXVzdCBjb21lIGJlZm9yZSAvcGF0aFxuICAgIGlmIChwb3MgPiAtMSAmJiAoZmlyc3RTbGFzaCA9PT0gLTEgfHwgcG9zIDwgZmlyc3RTbGFzaCkpIHtcbiAgICAgIHQgPSBzdHJpbmcuc3Vic3RyaW5nKDAsIHBvcykuc3BsaXQoJzonKTtcbiAgICAgIHBhcnRzLnVzZXJuYW1lID0gdFswXSA/IFVSSS5kZWNvZGUodFswXSkgOiBudWxsO1xuICAgICAgdC5zaGlmdCgpO1xuICAgICAgcGFydHMucGFzc3dvcmQgPSB0WzBdID8gVVJJLmRlY29kZSh0LmpvaW4oJzonKSkgOiBudWxsO1xuICAgICAgc3RyaW5nID0gc3RyaW5nLnN1YnN0cmluZyhwb3MgKyAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFydHMudXNlcm5hbWUgPSBudWxsO1xuICAgICAgcGFydHMucGFzc3dvcmQgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBzdHJpbmc7XG4gIH07XG4gIFVSSS5wYXJzZVF1ZXJ5ID0gZnVuY3Rpb24oc3RyaW5nLCBlc2NhcGVRdWVyeVNwYWNlKSB7XG4gICAgaWYgKCFzdHJpbmcpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICAvLyB0aHJvdyBvdXQgdGhlIGZ1bmt5IGJ1c2luZXNzIC0gXCI/XCJbbmFtZVwiPVwidmFsdWVcIiZcIl0rXG4gICAgc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UoLyYrL2csICcmJykucmVwbGFjZSgvXlxcPyomKnwmKyQvZywgJycpO1xuXG4gICAgaWYgKCFzdHJpbmcpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICB2YXIgaXRlbXMgPSB7fTtcbiAgICB2YXIgc3BsaXRzID0gc3RyaW5nLnNwbGl0KCcmJyk7XG4gICAgdmFyIGxlbmd0aCA9IHNwbGl0cy5sZW5ndGg7XG4gICAgdmFyIHYsIG5hbWUsIHZhbHVlO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdiA9IHNwbGl0c1tpXS5zcGxpdCgnPScpO1xuICAgICAgbmFtZSA9IFVSSS5kZWNvZGVRdWVyeSh2LnNoaWZ0KCksIGVzY2FwZVF1ZXJ5U3BhY2UpO1xuICAgICAgLy8gbm8gXCI9XCIgaXMgbnVsbCBhY2NvcmRpbmcgdG8gaHR0cDovL2R2Y3MudzMub3JnL2hnL3VybC9yYXctZmlsZS90aXAvT3ZlcnZpZXcuaHRtbCNjb2xsZWN0LXVybC1wYXJhbWV0ZXJzXG4gICAgICB2YWx1ZSA9IHYubGVuZ3RoID8gVVJJLmRlY29kZVF1ZXJ5KHYuam9pbignPScpLCBlc2NhcGVRdWVyeVNwYWNlKSA6IG51bGw7XG5cbiAgICAgIGlmIChoYXNPd24uY2FsbChpdGVtcywgbmFtZSkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtc1tuYW1lXSA9PT0gJ3N0cmluZycgfHwgaXRlbXNbbmFtZV0gPT09IG51bGwpIHtcbiAgICAgICAgICBpdGVtc1tuYW1lXSA9IFtpdGVtc1tuYW1lXV07XG4gICAgICAgIH1cblxuICAgICAgICBpdGVtc1tuYW1lXS5wdXNoKHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGl0ZW1zW25hbWVdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZW1zO1xuICB9O1xuXG4gIFVSSS5idWlsZCA9IGZ1bmN0aW9uKHBhcnRzKSB7XG4gICAgdmFyIHQgPSAnJztcblxuICAgIGlmIChwYXJ0cy5wcm90b2NvbCkge1xuICAgICAgdCArPSBwYXJ0cy5wcm90b2NvbCArICc6JztcbiAgICB9XG5cbiAgICBpZiAoIXBhcnRzLnVybiAmJiAodCB8fCBwYXJ0cy5ob3N0bmFtZSkpIHtcbiAgICAgIHQgKz0gJy8vJztcbiAgICB9XG5cbiAgICB0ICs9IChVUkkuYnVpbGRBdXRob3JpdHkocGFydHMpIHx8ICcnKTtcblxuICAgIGlmICh0eXBlb2YgcGFydHMucGF0aCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmIChwYXJ0cy5wYXRoLmNoYXJBdCgwKSAhPT0gJy8nICYmIHR5cGVvZiBwYXJ0cy5ob3N0bmFtZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdCArPSAnLyc7XG4gICAgICB9XG5cbiAgICAgIHQgKz0gcGFydHMucGF0aDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHBhcnRzLnF1ZXJ5ID09PSAnc3RyaW5nJyAmJiBwYXJ0cy5xdWVyeSkge1xuICAgICAgdCArPSAnPycgKyBwYXJ0cy5xdWVyeTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHBhcnRzLmZyYWdtZW50ID09PSAnc3RyaW5nJyAmJiBwYXJ0cy5mcmFnbWVudCkge1xuICAgICAgdCArPSAnIycgKyBwYXJ0cy5mcmFnbWVudDtcbiAgICB9XG4gICAgcmV0dXJuIHQ7XG4gIH07XG4gIFVSSS5idWlsZEhvc3QgPSBmdW5jdGlvbihwYXJ0cykge1xuICAgIHZhciB0ID0gJyc7XG5cbiAgICBpZiAoIXBhcnRzLmhvc3RuYW1lKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfSBlbHNlIGlmIChVUkkuaXA2X2V4cHJlc3Npb24udGVzdChwYXJ0cy5ob3N0bmFtZSkpIHtcbiAgICAgIHQgKz0gJ1snICsgcGFydHMuaG9zdG5hbWUgKyAnXSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHQgKz0gcGFydHMuaG9zdG5hbWU7XG4gICAgfVxuXG4gICAgaWYgKHBhcnRzLnBvcnQpIHtcbiAgICAgIHQgKz0gJzonICsgcGFydHMucG9ydDtcbiAgICB9XG5cbiAgICByZXR1cm4gdDtcbiAgfTtcbiAgVVJJLmJ1aWxkQXV0aG9yaXR5ID0gZnVuY3Rpb24ocGFydHMpIHtcbiAgICByZXR1cm4gVVJJLmJ1aWxkVXNlcmluZm8ocGFydHMpICsgVVJJLmJ1aWxkSG9zdChwYXJ0cyk7XG4gIH07XG4gIFVSSS5idWlsZFVzZXJpbmZvID0gZnVuY3Rpb24ocGFydHMpIHtcbiAgICB2YXIgdCA9ICcnO1xuXG4gICAgaWYgKHBhcnRzLnVzZXJuYW1lKSB7XG4gICAgICB0ICs9IFVSSS5lbmNvZGUocGFydHMudXNlcm5hbWUpO1xuXG4gICAgICBpZiAocGFydHMucGFzc3dvcmQpIHtcbiAgICAgICAgdCArPSAnOicgKyBVUkkuZW5jb2RlKHBhcnRzLnBhc3N3b3JkKTtcbiAgICAgIH1cblxuICAgICAgdCArPSAnQCc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHQ7XG4gIH07XG4gIFVSSS5idWlsZFF1ZXJ5ID0gZnVuY3Rpb24oZGF0YSwgZHVwbGljYXRlUXVlcnlQYXJhbWV0ZXJzLCBlc2NhcGVRdWVyeVNwYWNlKSB7XG4gICAgLy8gYWNjb3JkaW5nIHRvIGh0dHA6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM5ODYgb3IgaHR0cDovL2xhYnMuYXBhY2hlLm9yZy93ZWJhcmNoL3VyaS9yZmMvcmZjMzk4Ni5odG1sXG4gICAgLy8gYmVpbmcgwrstLl9+ISQmJygpKissOz06QC8/wqsgJUhFWCBhbmQgYWxudW0gYXJlIGFsbG93ZWRcbiAgICAvLyB0aGUgUkZDIGV4cGxpY2l0bHkgc3RhdGVzID8vZm9vIGJlaW5nIGEgdmFsaWQgdXNlIGNhc2UsIG5vIG1lbnRpb24gb2YgcGFyYW1ldGVyIHN5bnRheCFcbiAgICAvLyBVUkkuanMgdHJlYXRzIHRoZSBxdWVyeSBzdHJpbmcgYXMgYmVpbmcgYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXG4gICAgLy8gc2VlIGh0dHA6Ly93d3cudzMub3JnL1RSL1JFQy1odG1sNDAvaW50ZXJhY3QvZm9ybXMuaHRtbCNmb3JtLWNvbnRlbnQtdHlwZVxuXG4gICAgdmFyIHQgPSAnJztcbiAgICB2YXIgdW5pcXVlLCBrZXksIGksIGxlbmd0aDtcbiAgICBmb3IgKGtleSBpbiBkYXRhKSB7XG4gICAgICBpZiAoaGFzT3duLmNhbGwoZGF0YSwga2V5KSAmJiBrZXkpIHtcbiAgICAgICAgaWYgKGlzQXJyYXkoZGF0YVtrZXldKSkge1xuICAgICAgICAgIHVuaXF1ZSA9IHt9O1xuICAgICAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IGRhdGFba2V5XS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGRhdGFba2V5XVtpXSAhPT0gdW5kZWZpbmVkICYmIHVuaXF1ZVtkYXRhW2tleV1baV0gKyAnJ10gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICB0ICs9ICcmJyArIFVSSS5idWlsZFF1ZXJ5UGFyYW1ldGVyKGtleSwgZGF0YVtrZXldW2ldLCBlc2NhcGVRdWVyeVNwYWNlKTtcbiAgICAgICAgICAgICAgaWYgKGR1cGxpY2F0ZVF1ZXJ5UGFyYW1ldGVycyAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHVuaXF1ZVtkYXRhW2tleV1baV0gKyAnJ10gPSB0cnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGRhdGFba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdCArPSAnJicgKyBVUkkuYnVpbGRRdWVyeVBhcmFtZXRlcihrZXksIGRhdGFba2V5XSwgZXNjYXBlUXVlcnlTcGFjZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdC5zdWJzdHJpbmcoMSk7XG4gIH07XG4gIFVSSS5idWlsZFF1ZXJ5UGFyYW1ldGVyID0gZnVuY3Rpb24obmFtZSwgdmFsdWUsIGVzY2FwZVF1ZXJ5U3BhY2UpIHtcbiAgICAvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9SRUMtaHRtbDQwL2ludGVyYWN0L2Zvcm1zLmh0bWwjZm9ybS1jb250ZW50LXR5cGUgLS0gYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXG4gICAgLy8gZG9uJ3QgYXBwZW5kIFwiPVwiIGZvciBudWxsIHZhbHVlcywgYWNjb3JkaW5nIHRvIGh0dHA6Ly9kdmNzLnczLm9yZy9oZy91cmwvcmF3LWZpbGUvdGlwL092ZXJ2aWV3Lmh0bWwjdXJsLXBhcmFtZXRlci1zZXJpYWxpemF0aW9uXG4gICAgcmV0dXJuIFVSSS5lbmNvZGVRdWVyeShuYW1lLCBlc2NhcGVRdWVyeVNwYWNlKSArICh2YWx1ZSAhPT0gbnVsbCA/ICc9JyArIFVSSS5lbmNvZGVRdWVyeSh2YWx1ZSwgZXNjYXBlUXVlcnlTcGFjZSkgOiAnJyk7XG4gIH07XG5cbiAgVVJJLmFkZFF1ZXJ5ID0gZnVuY3Rpb24oZGF0YSwgbmFtZSwgdmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIG5hbWUgPT09ICdvYmplY3QnKSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gbmFtZSkge1xuICAgICAgICBpZiAoaGFzT3duLmNhbGwobmFtZSwga2V5KSkge1xuICAgICAgICAgIFVSSS5hZGRRdWVyeShkYXRhLCBrZXksIG5hbWVba2V5XSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBuYW1lID09PSAnc3RyaW5nJykge1xuICAgICAgaWYgKGRhdGFbbmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBkYXRhW25hbWVdID0gdmFsdWU7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGRhdGFbbmFtZV0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGRhdGFbbmFtZV0gPSBbZGF0YVtuYW1lXV07XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUgPSBbdmFsdWVdO1xuICAgICAgfVxuXG4gICAgICBkYXRhW25hbWVdID0gKGRhdGFbbmFtZV0gfHwgW10pLmNvbmNhdCh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1VSSS5hZGRRdWVyeSgpIGFjY2VwdHMgYW4gb2JqZWN0LCBzdHJpbmcgYXMgdGhlIG5hbWUgcGFyYW1ldGVyJyk7XG4gICAgfVxuICB9O1xuICBVUkkucmVtb3ZlUXVlcnkgPSBmdW5jdGlvbihkYXRhLCBuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBpLCBsZW5ndGgsIGtleTtcblxuICAgIGlmIChpc0FycmF5KG5hbWUpKSB7XG4gICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBuYW1lLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGRhdGFbbmFtZVtpXV0gPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChnZXRUeXBlKG5hbWUpID09PSAnUmVnRXhwJykge1xuICAgICAgZm9yIChrZXkgaW4gZGF0YSkge1xuICAgICAgICBpZiAobmFtZS50ZXN0KGtleSkpIHtcbiAgICAgICAgICBkYXRhW2tleV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBuYW1lID09PSAnb2JqZWN0Jykge1xuICAgICAgZm9yIChrZXkgaW4gbmFtZSkge1xuICAgICAgICBpZiAoaGFzT3duLmNhbGwobmFtZSwga2V5KSkge1xuICAgICAgICAgIFVSSS5yZW1vdmVRdWVyeShkYXRhLCBrZXksIG5hbWVba2V5XSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBuYW1lID09PSAnc3RyaW5nJykge1xuICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGdldFR5cGUodmFsdWUpID09PSAnUmVnRXhwJykge1xuICAgICAgICAgIGlmICghaXNBcnJheShkYXRhW25hbWVdKSAmJiB2YWx1ZS50ZXN0KGRhdGFbbmFtZV0pKSB7XG4gICAgICAgICAgICBkYXRhW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYXRhW25hbWVdID0gZmlsdGVyQXJyYXlWYWx1ZXMoZGF0YVtuYW1lXSwgdmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChkYXRhW25hbWVdID09PSB2YWx1ZSkge1xuICAgICAgICAgIGRhdGFbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShkYXRhW25hbWVdKSkge1xuICAgICAgICAgIGRhdGFbbmFtZV0gPSBmaWx0ZXJBcnJheVZhbHVlcyhkYXRhW25hbWVdLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRhdGFbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1VSSS5yZW1vdmVRdWVyeSgpIGFjY2VwdHMgYW4gb2JqZWN0LCBzdHJpbmcsIFJlZ0V4cCBhcyB0aGUgZmlyc3QgcGFyYW1ldGVyJyk7XG4gICAgfVxuICB9O1xuICBVUkkuaGFzUXVlcnkgPSBmdW5jdGlvbihkYXRhLCBuYW1lLCB2YWx1ZSwgd2l0aGluQXJyYXkpIHtcbiAgICBpZiAodHlwZW9mIG5hbWUgPT09ICdvYmplY3QnKSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gbmFtZSkge1xuICAgICAgICBpZiAoaGFzT3duLmNhbGwobmFtZSwga2V5KSkge1xuICAgICAgICAgIGlmICghVVJJLmhhc1F1ZXJ5KGRhdGEsIGtleSwgbmFtZVtrZXldKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVVJJLmhhc1F1ZXJ5KCkgYWNjZXB0cyBhbiBvYmplY3QsIHN0cmluZyBhcyB0aGUgbmFtZSBwYXJhbWV0ZXInKTtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGdldFR5cGUodmFsdWUpKSB7XG4gICAgICBjYXNlICdVbmRlZmluZWQnOlxuICAgICAgICAvLyB0cnVlIGlmIGV4aXN0cyAoYnV0IG1heSBiZSBlbXB0eSlcbiAgICAgICAgcmV0dXJuIG5hbWUgaW4gZGF0YTsgLy8gZGF0YVtuYW1lXSAhPT0gdW5kZWZpbmVkO1xuXG4gICAgICBjYXNlICdCb29sZWFuJzpcbiAgICAgICAgLy8gdHJ1ZSBpZiBleGlzdHMgYW5kIG5vbi1lbXB0eVxuICAgICAgICB2YXIgX2Jvb2x5ID0gQm9vbGVhbihpc0FycmF5KGRhdGFbbmFtZV0pID8gZGF0YVtuYW1lXS5sZW5ndGggOiBkYXRhW25hbWVdKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSBfYm9vbHk7XG5cbiAgICAgIGNhc2UgJ0Z1bmN0aW9uJzpcbiAgICAgICAgLy8gYWxsb3cgY29tcGxleCBjb21wYXJpc29uXG4gICAgICAgIHJldHVybiAhIXZhbHVlKGRhdGFbbmFtZV0sIG5hbWUsIGRhdGEpO1xuXG4gICAgICBjYXNlICdBcnJheSc6XG4gICAgICAgIGlmICghaXNBcnJheShkYXRhW25hbWVdKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBvcCA9IHdpdGhpbkFycmF5ID8gYXJyYXlDb250YWlucyA6IGFycmF5c0VxdWFsO1xuICAgICAgICByZXR1cm4gb3AoZGF0YVtuYW1lXSwgdmFsdWUpO1xuXG4gICAgICBjYXNlICdSZWdFeHAnOlxuICAgICAgICBpZiAoIWlzQXJyYXkoZGF0YVtuYW1lXSkpIHtcbiAgICAgICAgICByZXR1cm4gQm9vbGVhbihkYXRhW25hbWVdICYmIGRhdGFbbmFtZV0ubWF0Y2godmFsdWUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghd2l0aGluQXJyYXkpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXJyYXlDb250YWlucyhkYXRhW25hbWVdLCB2YWx1ZSk7XG5cbiAgICAgIGNhc2UgJ051bWJlcic6XG4gICAgICAgIHZhbHVlID0gU3RyaW5nKHZhbHVlKTtcbiAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgY2FzZSAnU3RyaW5nJzpcbiAgICAgICAgaWYgKCFpc0FycmF5KGRhdGFbbmFtZV0pKSB7XG4gICAgICAgICAgcmV0dXJuIGRhdGFbbmFtZV0gPT09IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF3aXRoaW5BcnJheSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhcnJheUNvbnRhaW5zKGRhdGFbbmFtZV0sIHZhbHVlKTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVVJJLmhhc1F1ZXJ5KCkgYWNjZXB0cyB1bmRlZmluZWQsIGJvb2xlYW4sIHN0cmluZywgbnVtYmVyLCBSZWdFeHAsIEZ1bmN0aW9uIGFzIHRoZSB2YWx1ZSBwYXJhbWV0ZXInKTtcbiAgICB9XG4gIH07XG5cblxuICBVUkkuY29tbW9uUGF0aCA9IGZ1bmN0aW9uKG9uZSwgdHdvKSB7XG4gICAgdmFyIGxlbmd0aCA9IE1hdGgubWluKG9uZS5sZW5ndGgsIHR3by5sZW5ndGgpO1xuICAgIHZhciBwb3M7XG5cbiAgICAvLyBmaW5kIGZpcnN0IG5vbi1tYXRjaGluZyBjaGFyYWN0ZXJcbiAgICBmb3IgKHBvcyA9IDA7IHBvcyA8IGxlbmd0aDsgcG9zKyspIHtcbiAgICAgIGlmIChvbmUuY2hhckF0KHBvcykgIT09IHR3by5jaGFyQXQocG9zKSkge1xuICAgICAgICBwb3MtLTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvcyA8IDEpIHtcbiAgICAgIHJldHVybiBvbmUuY2hhckF0KDApID09PSB0d28uY2hhckF0KDApICYmIG9uZS5jaGFyQXQoMCkgPT09ICcvJyA/ICcvJyA6ICcnO1xuICAgIH1cblxuICAgIC8vIHJldmVydCB0byBsYXN0IC9cbiAgICBpZiAob25lLmNoYXJBdChwb3MpICE9PSAnLycgfHwgdHdvLmNoYXJBdChwb3MpICE9PSAnLycpIHtcbiAgICAgIHBvcyA9IG9uZS5zdWJzdHJpbmcoMCwgcG9zKS5sYXN0SW5kZXhPZignLycpO1xuICAgIH1cblxuICAgIHJldHVybiBvbmUuc3Vic3RyaW5nKDAsIHBvcyArIDEpO1xuICB9O1xuXG4gIFVSSS53aXRoaW5TdHJpbmcgPSBmdW5jdGlvbihzdHJpbmcsIGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyB8fCAob3B0aW9ucyA9IHt9KTtcbiAgICB2YXIgX3N0YXJ0ID0gb3B0aW9ucy5zdGFydCB8fCBVUkkuZmluZFVyaS5zdGFydDtcbiAgICB2YXIgX2VuZCA9IG9wdGlvbnMuZW5kIHx8IFVSSS5maW5kVXJpLmVuZDtcbiAgICB2YXIgX3RyaW0gPSBvcHRpb25zLnRyaW0gfHwgVVJJLmZpbmRVcmkudHJpbTtcbiAgICB2YXIgX2F0dHJpYnV0ZU9wZW4gPSAvW2EtejAtOS1dPVtcIiddPyQvaTtcblxuICAgIF9zdGFydC5sYXN0SW5kZXggPSAwO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICB2YXIgbWF0Y2ggPSBfc3RhcnQuZXhlYyhzdHJpbmcpO1xuICAgICAgaWYgKCFtYXRjaCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgdmFyIHN0YXJ0ID0gbWF0Y2guaW5kZXg7XG4gICAgICBpZiAob3B0aW9ucy5pZ25vcmVIdG1sKSB7XG4gICAgICAgIC8vIGF0dHJpYnV0KGU9W1wiJ10/JClcbiAgICAgICAgdmFyIGF0dHJpYnV0ZU9wZW4gPSBzdHJpbmcuc2xpY2UoTWF0aC5tYXgoc3RhcnQgLSAzLCAwKSwgc3RhcnQpO1xuICAgICAgICBpZiAoYXR0cmlidXRlT3BlbiAmJiBfYXR0cmlidXRlT3Blbi50ZXN0KGF0dHJpYnV0ZU9wZW4pKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIGVuZCA9IHN0YXJ0ICsgc3RyaW5nLnNsaWNlKHN0YXJ0KS5zZWFyY2goX2VuZCk7XG4gICAgICB2YXIgc2xpY2UgPSBzdHJpbmcuc2xpY2Uoc3RhcnQsIGVuZCkucmVwbGFjZShfdHJpbSwgJycpO1xuICAgICAgaWYgKG9wdGlvbnMuaWdub3JlICYmIG9wdGlvbnMuaWdub3JlLnRlc3Qoc2xpY2UpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBlbmQgPSBzdGFydCArIHNsaWNlLmxlbmd0aDtcbiAgICAgIHZhciByZXN1bHQgPSBjYWxsYmFjayhzbGljZSwgc3RhcnQsIGVuZCwgc3RyaW5nKTtcbiAgICAgIHN0cmluZyA9IHN0cmluZy5zbGljZSgwLCBzdGFydCkgKyByZXN1bHQgKyBzdHJpbmcuc2xpY2UoZW5kKTtcbiAgICAgIF9zdGFydC5sYXN0SW5kZXggPSBzdGFydCArIHJlc3VsdC5sZW5ndGg7XG4gICAgfVxuXG4gICAgX3N0YXJ0Lmxhc3RJbmRleCA9IDA7XG4gICAgcmV0dXJuIHN0cmluZztcbiAgfTtcblxuICBVUkkuZW5zdXJlVmFsaWRIb3N0bmFtZSA9IGZ1bmN0aW9uKHYpIHtcbiAgICAvLyBUaGVvcmV0aWNhbGx5IFVSSXMgYWxsb3cgcGVyY2VudC1lbmNvZGluZyBpbiBIb3N0bmFtZXMgKGFjY29yZGluZyB0byBSRkMgMzk4NilcbiAgICAvLyB0aGV5IGFyZSBub3QgcGFydCBvZiBETlMgYW5kIHRoZXJlZm9yZSBpZ25vcmVkIGJ5IFVSSS5qc1xuXG4gICAgaWYgKHYubWF0Y2goVVJJLmludmFsaWRfaG9zdG5hbWVfY2hhcmFjdGVycykpIHtcbiAgICAgIC8vIHRlc3QgcHVueWNvZGVcbiAgICAgIGlmICghcHVueWNvZGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSG9zdG5hbWUgXCInICsgdiArICdcIiBjb250YWlucyBjaGFyYWN0ZXJzIG90aGVyIHRoYW4gW0EtWjAtOS4tXSBhbmQgUHVueWNvZGUuanMgaXMgbm90IGF2YWlsYWJsZScpO1xuICAgICAgfVxuXG4gICAgICBpZiAocHVueWNvZGUudG9BU0NJSSh2KS5tYXRjaChVUkkuaW52YWxpZF9ob3N0bmFtZV9jaGFyYWN0ZXJzKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdIb3N0bmFtZSBcIicgKyB2ICsgJ1wiIGNvbnRhaW5zIGNoYXJhY3RlcnMgb3RoZXIgdGhhbiBbQS1aMC05Li1dJyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8vIG5vQ29uZmxpY3RcbiAgVVJJLm5vQ29uZmxpY3QgPSBmdW5jdGlvbihyZW1vdmVBbGwpIHtcbiAgICBpZiAocmVtb3ZlQWxsKSB7XG4gICAgICB2YXIgdW5jb25mbGljdGVkID0ge1xuICAgICAgICBVUkk6IHRoaXMubm9Db25mbGljdCgpXG4gICAgICB9O1xuXG4gICAgICBpZiAocm9vdC5VUklUZW1wbGF0ZSAmJiB0eXBlb2Ygcm9vdC5VUklUZW1wbGF0ZS5ub0NvbmZsaWN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHVuY29uZmxpY3RlZC5VUklUZW1wbGF0ZSA9IHJvb3QuVVJJVGVtcGxhdGUubm9Db25mbGljdCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAocm9vdC5JUHY2ICYmIHR5cGVvZiByb290LklQdjYubm9Db25mbGljdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB1bmNvbmZsaWN0ZWQuSVB2NiA9IHJvb3QuSVB2Ni5ub0NvbmZsaWN0KCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyb290LlNlY29uZExldmVsRG9tYWlucyAmJiB0eXBlb2Ygcm9vdC5TZWNvbmRMZXZlbERvbWFpbnMubm9Db25mbGljdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB1bmNvbmZsaWN0ZWQuU2Vjb25kTGV2ZWxEb21haW5zID0gcm9vdC5TZWNvbmRMZXZlbERvbWFpbnMubm9Db25mbGljdCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdW5jb25mbGljdGVkO1xuICAgIH0gZWxzZSBpZiAocm9vdC5VUkkgPT09IHRoaXMpIHtcbiAgICAgIHJvb3QuVVJJID0gX1VSSTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBwLmJ1aWxkID0gZnVuY3Rpb24oZGVmZXJCdWlsZCkge1xuICAgIGlmIChkZWZlckJ1aWxkID09PSB0cnVlKSB7XG4gICAgICB0aGlzLl9kZWZlcnJlZF9idWlsZCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChkZWZlckJ1aWxkID09PSB1bmRlZmluZWQgfHwgdGhpcy5fZGVmZXJyZWRfYnVpbGQpIHtcbiAgICAgIHRoaXMuX3N0cmluZyA9IFVSSS5idWlsZCh0aGlzLl9wYXJ0cyk7XG4gICAgICB0aGlzLl9kZWZlcnJlZF9idWlsZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHAuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFVSSSh0aGlzKTtcbiAgfTtcblxuICBwLnZhbHVlT2YgPSBwLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuYnVpbGQoZmFsc2UpLl9zdHJpbmc7XG4gIH07XG5cblxuICBmdW5jdGlvbiBnZW5lcmF0ZVNpbXBsZUFjY2Vzc29yKF9wYXJ0KXtcbiAgICByZXR1cm4gZnVuY3Rpb24odiwgYnVpbGQpIHtcbiAgICAgIGlmICh2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcnRzW19wYXJ0XSB8fCAnJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3BhcnRzW19wYXJ0XSA9IHYgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVQcmVmaXhBY2Nlc3NvcihfcGFydCwgX2tleSl7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XG4gICAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJ0c1tfcGFydF0gfHwgJyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodiAhPT0gbnVsbCkge1xuICAgICAgICAgIHYgPSB2ICsgJyc7XG4gICAgICAgICAgaWYgKHYuY2hhckF0KDApID09PSBfa2V5KSB7XG4gICAgICAgICAgICB2ID0gdi5zdWJzdHJpbmcoMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fcGFydHNbX3BhcnRdID0gdjtcbiAgICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcC5wcm90b2NvbCA9IGdlbmVyYXRlU2ltcGxlQWNjZXNzb3IoJ3Byb3RvY29sJyk7XG4gIHAudXNlcm5hbWUgPSBnZW5lcmF0ZVNpbXBsZUFjY2Vzc29yKCd1c2VybmFtZScpO1xuICBwLnBhc3N3b3JkID0gZ2VuZXJhdGVTaW1wbGVBY2Nlc3NvcigncGFzc3dvcmQnKTtcbiAgcC5ob3N0bmFtZSA9IGdlbmVyYXRlU2ltcGxlQWNjZXNzb3IoJ2hvc3RuYW1lJyk7XG4gIHAucG9ydCA9IGdlbmVyYXRlU2ltcGxlQWNjZXNzb3IoJ3BvcnQnKTtcbiAgcC5xdWVyeSA9IGdlbmVyYXRlUHJlZml4QWNjZXNzb3IoJ3F1ZXJ5JywgJz8nKTtcbiAgcC5mcmFnbWVudCA9IGdlbmVyYXRlUHJlZml4QWNjZXNzb3IoJ2ZyYWdtZW50JywgJyMnKTtcblxuICBwLnNlYXJjaCA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XG4gICAgdmFyIHQgPSB0aGlzLnF1ZXJ5KHYsIGJ1aWxkKTtcbiAgICByZXR1cm4gdHlwZW9mIHQgPT09ICdzdHJpbmcnICYmIHQubGVuZ3RoID8gKCc/JyArIHQpIDogdDtcbiAgfTtcbiAgcC5oYXNoID0gZnVuY3Rpb24odiwgYnVpbGQpIHtcbiAgICB2YXIgdCA9IHRoaXMuZnJhZ21lbnQodiwgYnVpbGQpO1xuICAgIHJldHVybiB0eXBlb2YgdCA9PT0gJ3N0cmluZycgJiYgdC5sZW5ndGggPyAoJyMnICsgdCkgOiB0O1xuICB9O1xuXG4gIHAucGF0aG5hbWUgPSBmdW5jdGlvbih2LCBidWlsZCkge1xuICAgIGlmICh2ID09PSB1bmRlZmluZWQgfHwgdiA9PT0gdHJ1ZSkge1xuICAgICAgdmFyIHJlcyA9IHRoaXMuX3BhcnRzLnBhdGggfHwgKHRoaXMuX3BhcnRzLmhvc3RuYW1lID8gJy8nIDogJycpO1xuICAgICAgcmV0dXJuIHYgPyAodGhpcy5fcGFydHMudXJuID8gVVJJLmRlY29kZVVyblBhdGggOiBVUkkuZGVjb2RlUGF0aCkocmVzKSA6IHJlcztcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuX3BhcnRzLnVybikge1xuICAgICAgICB0aGlzLl9wYXJ0cy5wYXRoID0gdiA/IFVSSS5yZWNvZGVVcm5QYXRoKHYpIDogJyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9wYXJ0cy5wYXRoID0gdiA/IFVSSS5yZWNvZGVQYXRoKHYpIDogJy8nO1xuICAgICAgfVxuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9O1xuICBwLnBhdGggPSBwLnBhdGhuYW1lO1xuICBwLmhyZWYgPSBmdW5jdGlvbihocmVmLCBidWlsZCkge1xuICAgIHZhciBrZXk7XG5cbiAgICBpZiAoaHJlZiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuICAgIH1cblxuICAgIHRoaXMuX3N0cmluZyA9ICcnO1xuICAgIHRoaXMuX3BhcnRzID0gVVJJLl9wYXJ0cygpO1xuXG4gICAgdmFyIF9VUkkgPSBocmVmIGluc3RhbmNlb2YgVVJJO1xuICAgIHZhciBfb2JqZWN0ID0gdHlwZW9mIGhyZWYgPT09ICdvYmplY3QnICYmIChocmVmLmhvc3RuYW1lIHx8IGhyZWYucGF0aCB8fCBocmVmLnBhdGhuYW1lKTtcbiAgICBpZiAoaHJlZi5ub2RlTmFtZSkge1xuICAgICAgdmFyIGF0dHJpYnV0ZSA9IFVSSS5nZXREb21BdHRyaWJ1dGUoaHJlZik7XG4gICAgICBocmVmID0gaHJlZlthdHRyaWJ1dGVdIHx8ICcnO1xuICAgICAgX29iamVjdCA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIHdpbmRvdy5sb2NhdGlvbiBpcyByZXBvcnRlZCB0byBiZSBhbiBvYmplY3QsIGJ1dCBpdCdzIG5vdCB0aGUgc29ydFxuICAgIC8vIG9mIG9iamVjdCB3ZSdyZSBsb29raW5nIGZvcjpcbiAgICAvLyAqIGxvY2F0aW9uLnByb3RvY29sIGVuZHMgd2l0aCBhIGNvbG9uXG4gICAgLy8gKiBsb2NhdGlvbi5xdWVyeSAhPSBvYmplY3Quc2VhcmNoXG4gICAgLy8gKiBsb2NhdGlvbi5oYXNoICE9IG9iamVjdC5mcmFnbWVudFxuICAgIC8vIHNpbXBseSBzZXJpYWxpemluZyB0aGUgdW5rbm93biBvYmplY3Qgc2hvdWxkIGRvIHRoZSB0cmlja1xuICAgIC8vIChmb3IgbG9jYXRpb24sIG5vdCBmb3IgZXZlcnl0aGluZy4uLilcbiAgICBpZiAoIV9VUkkgJiYgX29iamVjdCAmJiBocmVmLnBhdGhuYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGhyZWYgPSBocmVmLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBocmVmID09PSAnc3RyaW5nJyB8fCBocmVmIGluc3RhbmNlb2YgU3RyaW5nKSB7XG4gICAgICB0aGlzLl9wYXJ0cyA9IFVSSS5wYXJzZShTdHJpbmcoaHJlZiksIHRoaXMuX3BhcnRzKTtcbiAgICB9IGVsc2UgaWYgKF9VUkkgfHwgX29iamVjdCkge1xuICAgICAgdmFyIHNyYyA9IF9VUkkgPyBocmVmLl9wYXJ0cyA6IGhyZWY7XG4gICAgICBmb3IgKGtleSBpbiBzcmMpIHtcbiAgICAgICAgaWYgKGhhc093bi5jYWxsKHRoaXMuX3BhcnRzLCBrZXkpKSB7XG4gICAgICAgICAgdGhpcy5fcGFydHNba2V5XSA9IHNyY1trZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ludmFsaWQgaW5wdXQnKTtcbiAgICB9XG5cbiAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLy8gaWRlbnRpZmljYXRpb24gYWNjZXNzb3JzXG4gIHAuaXMgPSBmdW5jdGlvbih3aGF0KSB7XG4gICAgdmFyIGlwID0gZmFsc2U7XG4gICAgdmFyIGlwNCA9IGZhbHNlO1xuICAgIHZhciBpcDYgPSBmYWxzZTtcbiAgICB2YXIgbmFtZSA9IGZhbHNlO1xuICAgIHZhciBzbGQgPSBmYWxzZTtcbiAgICB2YXIgaWRuID0gZmFsc2U7XG4gICAgdmFyIHB1bnljb2RlID0gZmFsc2U7XG4gICAgdmFyIHJlbGF0aXZlID0gIXRoaXMuX3BhcnRzLnVybjtcblxuICAgIGlmICh0aGlzLl9wYXJ0cy5ob3N0bmFtZSkge1xuICAgICAgcmVsYXRpdmUgPSBmYWxzZTtcbiAgICAgIGlwNCA9IFVSSS5pcDRfZXhwcmVzc2lvbi50ZXN0KHRoaXMuX3BhcnRzLmhvc3RuYW1lKTtcbiAgICAgIGlwNiA9IFVSSS5pcDZfZXhwcmVzc2lvbi50ZXN0KHRoaXMuX3BhcnRzLmhvc3RuYW1lKTtcbiAgICAgIGlwID0gaXA0IHx8IGlwNjtcbiAgICAgIG5hbWUgPSAhaXA7XG4gICAgICBzbGQgPSBuYW1lICYmIFNMRCAmJiBTTEQuaGFzKHRoaXMuX3BhcnRzLmhvc3RuYW1lKTtcbiAgICAgIGlkbiA9IG5hbWUgJiYgVVJJLmlkbl9leHByZXNzaW9uLnRlc3QodGhpcy5fcGFydHMuaG9zdG5hbWUpO1xuICAgICAgcHVueWNvZGUgPSBuYW1lICYmIFVSSS5wdW55Y29kZV9leHByZXNzaW9uLnRlc3QodGhpcy5fcGFydHMuaG9zdG5hbWUpO1xuICAgIH1cblxuICAgIHN3aXRjaCAod2hhdC50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICBjYXNlICdyZWxhdGl2ZSc6XG4gICAgICAgIHJldHVybiByZWxhdGl2ZTtcblxuICAgICAgY2FzZSAnYWJzb2x1dGUnOlxuICAgICAgICByZXR1cm4gIXJlbGF0aXZlO1xuXG4gICAgICAvLyBob3N0bmFtZSBpZGVudGlmaWNhdGlvblxuICAgICAgY2FzZSAnZG9tYWluJzpcbiAgICAgIGNhc2UgJ25hbWUnOlxuICAgICAgICByZXR1cm4gbmFtZTtcblxuICAgICAgY2FzZSAnc2xkJzpcbiAgICAgICAgcmV0dXJuIHNsZDtcblxuICAgICAgY2FzZSAnaXAnOlxuICAgICAgICByZXR1cm4gaXA7XG5cbiAgICAgIGNhc2UgJ2lwNCc6XG4gICAgICBjYXNlICdpcHY0JzpcbiAgICAgIGNhc2UgJ2luZXQ0JzpcbiAgICAgICAgcmV0dXJuIGlwNDtcblxuICAgICAgY2FzZSAnaXA2JzpcbiAgICAgIGNhc2UgJ2lwdjYnOlxuICAgICAgY2FzZSAnaW5ldDYnOlxuICAgICAgICByZXR1cm4gaXA2O1xuXG4gICAgICBjYXNlICdpZG4nOlxuICAgICAgICByZXR1cm4gaWRuO1xuXG4gICAgICBjYXNlICd1cmwnOlxuICAgICAgICByZXR1cm4gIXRoaXMuX3BhcnRzLnVybjtcblxuICAgICAgY2FzZSAndXJuJzpcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fcGFydHMudXJuO1xuXG4gICAgICBjYXNlICdwdW55Y29kZSc6XG4gICAgICAgIHJldHVybiBwdW55Y29kZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcblxuICAvLyBjb21wb25lbnQgc3BlY2lmaWMgaW5wdXQgdmFsaWRhdGlvblxuICB2YXIgX3Byb3RvY29sID0gcC5wcm90b2NvbDtcbiAgdmFyIF9wb3J0ID0gcC5wb3J0O1xuICB2YXIgX2hvc3RuYW1lID0gcC5ob3N0bmFtZTtcblxuICBwLnByb3RvY29sID0gZnVuY3Rpb24odiwgYnVpbGQpIHtcbiAgICBpZiAodiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAodikge1xuICAgICAgICAvLyBhY2NlcHQgdHJhaWxpbmcgOi8vXG4gICAgICAgIHYgPSB2LnJlcGxhY2UoLzooXFwvXFwvKT8kLywgJycpO1xuXG4gICAgICAgIGlmICghdi5tYXRjaChVUkkucHJvdG9jb2xfZXhwcmVzc2lvbikpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm90b2NvbCBcIicgKyB2ICsgJ1wiIGNvbnRhaW5zIGNoYXJhY3RlcnMgb3RoZXIgdGhhbiBbQS1aMC05ListXSBvciBkb2VzblxcJ3Qgc3RhcnQgd2l0aCBbQS1aXScpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBfcHJvdG9jb2wuY2FsbCh0aGlzLCB2LCBidWlsZCk7XG4gIH07XG4gIHAuc2NoZW1lID0gcC5wcm90b2NvbDtcbiAgcC5wb3J0ID0gZnVuY3Rpb24odiwgYnVpbGQpIHtcbiAgICBpZiAodGhpcy5fcGFydHMudXJuKSB7XG4gICAgICByZXR1cm4gdiA9PT0gdW5kZWZpbmVkID8gJycgOiB0aGlzO1xuICAgIH1cblxuICAgIGlmICh2ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh2ID09PSAwKSB7XG4gICAgICAgIHYgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAodikge1xuICAgICAgICB2ICs9ICcnO1xuICAgICAgICBpZiAodi5jaGFyQXQoMCkgPT09ICc6Jykge1xuICAgICAgICAgIHYgPSB2LnN1YnN0cmluZygxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2Lm1hdGNoKC9bXjAtOV0vKSkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1BvcnQgXCInICsgdiArICdcIiBjb250YWlucyBjaGFyYWN0ZXJzIG90aGVyIHRoYW4gWzAtOV0nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gX3BvcnQuY2FsbCh0aGlzLCB2LCBidWlsZCk7XG4gIH07XG4gIHAuaG9zdG5hbWUgPSBmdW5jdGlvbih2LCBidWlsZCkge1xuICAgIGlmICh0aGlzLl9wYXJ0cy51cm4pIHtcbiAgICAgIHJldHVybiB2ID09PSB1bmRlZmluZWQgPyAnJyA6IHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHYgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIHggPSB7fTtcbiAgICAgIHZhciByZXMgPSBVUkkucGFyc2VIb3N0KHYsIHgpO1xuICAgICAgaWYgKHJlcyAhPT0gJy8nKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0hvc3RuYW1lIFwiJyArIHYgKyAnXCIgY29udGFpbnMgY2hhcmFjdGVycyBvdGhlciB0aGFuIFtBLVowLTkuLV0nKTtcbiAgICAgIH1cblxuICAgICAgdiA9IHguaG9zdG5hbWU7XG4gICAgfVxuICAgIHJldHVybiBfaG9zdG5hbWUuY2FsbCh0aGlzLCB2LCBidWlsZCk7XG4gIH07XG5cbiAgLy8gY29tcG91bmQgYWNjZXNzb3JzXG4gIHAuaG9zdCA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XG4gICAgaWYgKHRoaXMuX3BhcnRzLnVybikge1xuICAgICAgcmV0dXJuIHYgPT09IHVuZGVmaW5lZCA/ICcnIDogdGhpcztcbiAgICB9XG5cbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcGFydHMuaG9zdG5hbWUgPyBVUkkuYnVpbGRIb3N0KHRoaXMuX3BhcnRzKSA6ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcmVzID0gVVJJLnBhcnNlSG9zdCh2LCB0aGlzLl9wYXJ0cyk7XG4gICAgICBpZiAocmVzICE9PSAnLycpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSG9zdG5hbWUgXCInICsgdiArICdcIiBjb250YWlucyBjaGFyYWN0ZXJzIG90aGVyIHRoYW4gW0EtWjAtOS4tXScpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH07XG4gIHAuYXV0aG9yaXR5ID0gZnVuY3Rpb24odiwgYnVpbGQpIHtcbiAgICBpZiAodGhpcy5fcGFydHMudXJuKSB7XG4gICAgICByZXR1cm4gdiA9PT0gdW5kZWZpbmVkID8gJycgOiB0aGlzO1xuICAgIH1cblxuICAgIGlmICh2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9wYXJ0cy5ob3N0bmFtZSA/IFVSSS5idWlsZEF1dGhvcml0eSh0aGlzLl9wYXJ0cykgOiAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHJlcyA9IFVSSS5wYXJzZUF1dGhvcml0eSh2LCB0aGlzLl9wYXJ0cyk7XG4gICAgICBpZiAocmVzICE9PSAnLycpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSG9zdG5hbWUgXCInICsgdiArICdcIiBjb250YWlucyBjaGFyYWN0ZXJzIG90aGVyIHRoYW4gW0EtWjAtOS4tXScpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH07XG4gIHAudXNlcmluZm8gPSBmdW5jdGlvbih2LCBidWlsZCkge1xuICAgIGlmICh0aGlzLl9wYXJ0cy51cm4pIHtcbiAgICAgIHJldHVybiB2ID09PSB1bmRlZmluZWQgPyAnJyA6IHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHYgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKCF0aGlzLl9wYXJ0cy51c2VybmFtZSkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG5cbiAgICAgIHZhciB0ID0gVVJJLmJ1aWxkVXNlcmluZm8odGhpcy5fcGFydHMpO1xuICAgICAgcmV0dXJuIHQuc3Vic3RyaW5nKDAsIHQubGVuZ3RoIC0xKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHZbdi5sZW5ndGgtMV0gIT09ICdAJykge1xuICAgICAgICB2ICs9ICdAJztcbiAgICAgIH1cblxuICAgICAgVVJJLnBhcnNlVXNlcmluZm8odiwgdGhpcy5fcGFydHMpO1xuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9O1xuICBwLnJlc291cmNlID0gZnVuY3Rpb24odiwgYnVpbGQpIHtcbiAgICB2YXIgcGFydHM7XG5cbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXRoKCkgKyB0aGlzLnNlYXJjaCgpICsgdGhpcy5oYXNoKCk7XG4gICAgfVxuXG4gICAgcGFydHMgPSBVUkkucGFyc2Uodik7XG4gICAgdGhpcy5fcGFydHMucGF0aCA9IHBhcnRzLnBhdGg7XG4gICAgdGhpcy5fcGFydHMucXVlcnkgPSBwYXJ0cy5xdWVyeTtcbiAgICB0aGlzLl9wYXJ0cy5mcmFnbWVudCA9IHBhcnRzLmZyYWdtZW50O1xuICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvLyBmcmFjdGlvbiBhY2Nlc3NvcnNcbiAgcC5zdWJkb21haW4gPSBmdW5jdGlvbih2LCBidWlsZCkge1xuICAgIGlmICh0aGlzLl9wYXJ0cy51cm4pIHtcbiAgICAgIHJldHVybiB2ID09PSB1bmRlZmluZWQgPyAnJyA6IHRoaXM7XG4gICAgfVxuXG4gICAgLy8gY29udmVuaWVuY2UsIHJldHVybiBcInd3d1wiIGZyb20gXCJ3d3cuZXhhbXBsZS5vcmdcIlxuICAgIGlmICh2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICghdGhpcy5fcGFydHMuaG9zdG5hbWUgfHwgdGhpcy5pcygnSVAnKSkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG5cbiAgICAgIC8vIGdyYWIgZG9tYWluIGFuZCBhZGQgYW5vdGhlciBzZWdtZW50XG4gICAgICB2YXIgZW5kID0gdGhpcy5fcGFydHMuaG9zdG5hbWUubGVuZ3RoIC0gdGhpcy5kb21haW4oKS5sZW5ndGggLSAxO1xuICAgICAgcmV0dXJuIHRoaXMuX3BhcnRzLmhvc3RuYW1lLnN1YnN0cmluZygwLCBlbmQpIHx8ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZSA9IHRoaXMuX3BhcnRzLmhvc3RuYW1lLmxlbmd0aCAtIHRoaXMuZG9tYWluKCkubGVuZ3RoO1xuICAgICAgdmFyIHN1YiA9IHRoaXMuX3BhcnRzLmhvc3RuYW1lLnN1YnN0cmluZygwLCBlKTtcbiAgICAgIHZhciByZXBsYWNlID0gbmV3IFJlZ0V4cCgnXicgKyBlc2NhcGVSZWdFeChzdWIpKTtcblxuICAgICAgaWYgKHYgJiYgdi5jaGFyQXQodi5sZW5ndGggLSAxKSAhPT0gJy4nKSB7XG4gICAgICAgIHYgKz0gJy4nO1xuICAgICAgfVxuXG4gICAgICBpZiAodikge1xuICAgICAgICBVUkkuZW5zdXJlVmFsaWRIb3N0bmFtZSh2KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fcGFydHMuaG9zdG5hbWUgPSB0aGlzLl9wYXJ0cy5ob3N0bmFtZS5yZXBsYWNlKHJlcGxhY2UsIHYpO1xuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9O1xuICBwLmRvbWFpbiA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XG4gICAgaWYgKHRoaXMuX3BhcnRzLnVybikge1xuICAgICAgcmV0dXJuIHYgPT09IHVuZGVmaW5lZCA/ICcnIDogdGhpcztcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykge1xuICAgICAgYnVpbGQgPSB2O1xuICAgICAgdiA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvLyBjb252ZW5pZW5jZSwgcmV0dXJuIFwiZXhhbXBsZS5vcmdcIiBmcm9tIFwid3d3LmV4YW1wbGUub3JnXCJcbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoIXRoaXMuX3BhcnRzLmhvc3RuYW1lIHx8IHRoaXMuaXMoJ0lQJykpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuXG4gICAgICAvLyBpZiBob3N0bmFtZSBjb25zaXN0cyBvZiAxIG9yIDIgc2VnbWVudHMsIGl0IG11c3QgYmUgdGhlIGRvbWFpblxuICAgICAgdmFyIHQgPSB0aGlzLl9wYXJ0cy5ob3N0bmFtZS5tYXRjaCgvXFwuL2cpO1xuICAgICAgaWYgKHQgJiYgdC5sZW5ndGggPCAyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJ0cy5ob3N0bmFtZTtcbiAgICAgIH1cblxuICAgICAgLy8gZ3JhYiB0bGQgYW5kIGFkZCBhbm90aGVyIHNlZ21lbnRcbiAgICAgIHZhciBlbmQgPSB0aGlzLl9wYXJ0cy5ob3N0bmFtZS5sZW5ndGggLSB0aGlzLnRsZChidWlsZCkubGVuZ3RoIC0gMTtcbiAgICAgIGVuZCA9IHRoaXMuX3BhcnRzLmhvc3RuYW1lLmxhc3RJbmRleE9mKCcuJywgZW5kIC0xKSArIDE7XG4gICAgICByZXR1cm4gdGhpcy5fcGFydHMuaG9zdG5hbWUuc3Vic3RyaW5nKGVuZCkgfHwgJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghdikge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjYW5ub3Qgc2V0IGRvbWFpbiBlbXB0eScpO1xuICAgICAgfVxuXG4gICAgICBVUkkuZW5zdXJlVmFsaWRIb3N0bmFtZSh2KTtcblxuICAgICAgaWYgKCF0aGlzLl9wYXJ0cy5ob3N0bmFtZSB8fCB0aGlzLmlzKCdJUCcpKSB7XG4gICAgICAgIHRoaXMuX3BhcnRzLmhvc3RuYW1lID0gdjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciByZXBsYWNlID0gbmV3IFJlZ0V4cChlc2NhcGVSZWdFeCh0aGlzLmRvbWFpbigpKSArICckJyk7XG4gICAgICAgIHRoaXMuX3BhcnRzLmhvc3RuYW1lID0gdGhpcy5fcGFydHMuaG9zdG5hbWUucmVwbGFjZShyZXBsYWNlLCB2KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9O1xuICBwLnRsZCA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XG4gICAgaWYgKHRoaXMuX3BhcnRzLnVybikge1xuICAgICAgcmV0dXJuIHYgPT09IHVuZGVmaW5lZCA/ICcnIDogdGhpcztcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykge1xuICAgICAgYnVpbGQgPSB2O1xuICAgICAgdiA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvLyByZXR1cm4gXCJvcmdcIiBmcm9tIFwid3d3LmV4YW1wbGUub3JnXCJcbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoIXRoaXMuX3BhcnRzLmhvc3RuYW1lIHx8IHRoaXMuaXMoJ0lQJykpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuXG4gICAgICB2YXIgcG9zID0gdGhpcy5fcGFydHMuaG9zdG5hbWUubGFzdEluZGV4T2YoJy4nKTtcbiAgICAgIHZhciB0bGQgPSB0aGlzLl9wYXJ0cy5ob3N0bmFtZS5zdWJzdHJpbmcocG9zICsgMSk7XG5cbiAgICAgIGlmIChidWlsZCAhPT0gdHJ1ZSAmJiBTTEQgJiYgU0xELmxpc3RbdGxkLnRvTG93ZXJDYXNlKCldKSB7XG4gICAgICAgIHJldHVybiBTTEQuZ2V0KHRoaXMuX3BhcnRzLmhvc3RuYW1lKSB8fCB0bGQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0bGQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciByZXBsYWNlO1xuXG4gICAgICBpZiAoIXYpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY2Fubm90IHNldCBUTEQgZW1wdHknKTtcbiAgICAgIH0gZWxzZSBpZiAodi5tYXRjaCgvW15hLXpBLVowLTktXS8pKSB7XG4gICAgICAgIGlmIChTTEQgJiYgU0xELmlzKHYpKSB7XG4gICAgICAgICAgcmVwbGFjZSA9IG5ldyBSZWdFeHAoZXNjYXBlUmVnRXgodGhpcy50bGQoKSkgKyAnJCcpO1xuICAgICAgICAgIHRoaXMuX3BhcnRzLmhvc3RuYW1lID0gdGhpcy5fcGFydHMuaG9zdG5hbWUucmVwbGFjZShyZXBsYWNlLCB2KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUTEQgXCInICsgdiArICdcIiBjb250YWlucyBjaGFyYWN0ZXJzIG90aGVyIHRoYW4gW0EtWjAtOV0nKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghdGhpcy5fcGFydHMuaG9zdG5hbWUgfHwgdGhpcy5pcygnSVAnKSkge1xuICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ2Nhbm5vdCBzZXQgVExEIG9uIG5vbi1kb21haW4gaG9zdCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVwbGFjZSA9IG5ldyBSZWdFeHAoZXNjYXBlUmVnRXgodGhpcy50bGQoKSkgKyAnJCcpO1xuICAgICAgICB0aGlzLl9wYXJ0cy5ob3N0bmFtZSA9IHRoaXMuX3BhcnRzLmhvc3RuYW1lLnJlcGxhY2UocmVwbGFjZSwgdik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfTtcbiAgcC5kaXJlY3RvcnkgPSBmdW5jdGlvbih2LCBidWlsZCkge1xuICAgIGlmICh0aGlzLl9wYXJ0cy51cm4pIHtcbiAgICAgIHJldHVybiB2ID09PSB1bmRlZmluZWQgPyAnJyA6IHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHYgPT09IHVuZGVmaW5lZCB8fCB2ID09PSB0cnVlKSB7XG4gICAgICBpZiAoIXRoaXMuX3BhcnRzLnBhdGggJiYgIXRoaXMuX3BhcnRzLmhvc3RuYW1lKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX3BhcnRzLnBhdGggPT09ICcvJykge1xuICAgICAgICByZXR1cm4gJy8nO1xuICAgICAgfVxuXG4gICAgICB2YXIgZW5kID0gdGhpcy5fcGFydHMucGF0aC5sZW5ndGggLSB0aGlzLmZpbGVuYW1lKCkubGVuZ3RoIC0gMTtcbiAgICAgIHZhciByZXMgPSB0aGlzLl9wYXJ0cy5wYXRoLnN1YnN0cmluZygwLCBlbmQpIHx8ICh0aGlzLl9wYXJ0cy5ob3N0bmFtZSA/ICcvJyA6ICcnKTtcblxuICAgICAgcmV0dXJuIHYgPyBVUkkuZGVjb2RlUGF0aChyZXMpIDogcmVzO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBlID0gdGhpcy5fcGFydHMucGF0aC5sZW5ndGggLSB0aGlzLmZpbGVuYW1lKCkubGVuZ3RoO1xuICAgICAgdmFyIGRpcmVjdG9yeSA9IHRoaXMuX3BhcnRzLnBhdGguc3Vic3RyaW5nKDAsIGUpO1xuICAgICAgdmFyIHJlcGxhY2UgPSBuZXcgUmVnRXhwKCdeJyArIGVzY2FwZVJlZ0V4KGRpcmVjdG9yeSkpO1xuXG4gICAgICAvLyBmdWxseSBxdWFsaWZpZXIgZGlyZWN0b3JpZXMgYmVnaW4gd2l0aCBhIHNsYXNoXG4gICAgICBpZiAoIXRoaXMuaXMoJ3JlbGF0aXZlJykpIHtcbiAgICAgICAgaWYgKCF2KSB7XG4gICAgICAgICAgdiA9ICcvJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2LmNoYXJBdCgwKSAhPT0gJy8nKSB7XG4gICAgICAgICAgdiA9ICcvJyArIHY7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gZGlyZWN0b3JpZXMgYWx3YXlzIGVuZCB3aXRoIGEgc2xhc2hcbiAgICAgIGlmICh2ICYmIHYuY2hhckF0KHYubGVuZ3RoIC0gMSkgIT09ICcvJykge1xuICAgICAgICB2ICs9ICcvJztcbiAgICAgIH1cblxuICAgICAgdiA9IFVSSS5yZWNvZGVQYXRoKHYpO1xuICAgICAgdGhpcy5fcGFydHMucGF0aCA9IHRoaXMuX3BhcnRzLnBhdGgucmVwbGFjZShyZXBsYWNlLCB2KTtcbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfTtcbiAgcC5maWxlbmFtZSA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XG4gICAgaWYgKHRoaXMuX3BhcnRzLnVybikge1xuICAgICAgcmV0dXJuIHYgPT09IHVuZGVmaW5lZCA/ICcnIDogdGhpcztcbiAgICB9XG5cbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkIHx8IHYgPT09IHRydWUpIHtcbiAgICAgIGlmICghdGhpcy5fcGFydHMucGF0aCB8fCB0aGlzLl9wYXJ0cy5wYXRoID09PSAnLycpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuXG4gICAgICB2YXIgcG9zID0gdGhpcy5fcGFydHMucGF0aC5sYXN0SW5kZXhPZignLycpO1xuICAgICAgdmFyIHJlcyA9IHRoaXMuX3BhcnRzLnBhdGguc3Vic3RyaW5nKHBvcysxKTtcblxuICAgICAgcmV0dXJuIHYgPyBVUkkuZGVjb2RlUGF0aFNlZ21lbnQocmVzKSA6IHJlcztcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIG11dGF0ZWREaXJlY3RvcnkgPSBmYWxzZTtcblxuICAgICAgaWYgKHYuY2hhckF0KDApID09PSAnLycpIHtcbiAgICAgICAgdiA9IHYuc3Vic3RyaW5nKDEpO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5tYXRjaCgvXFwuP1xcLy8pKSB7XG4gICAgICAgIG11dGF0ZWREaXJlY3RvcnkgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVwbGFjZSA9IG5ldyBSZWdFeHAoZXNjYXBlUmVnRXgodGhpcy5maWxlbmFtZSgpKSArICckJyk7XG4gICAgICB2ID0gVVJJLnJlY29kZVBhdGgodik7XG4gICAgICB0aGlzLl9wYXJ0cy5wYXRoID0gdGhpcy5fcGFydHMucGF0aC5yZXBsYWNlKHJlcGxhY2UsIHYpO1xuXG4gICAgICBpZiAobXV0YXRlZERpcmVjdG9yeSkge1xuICAgICAgICB0aGlzLm5vcm1hbGl6ZVBhdGgoYnVpbGQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH07XG4gIHAuc3VmZml4ID0gZnVuY3Rpb24odiwgYnVpbGQpIHtcbiAgICBpZiAodGhpcy5fcGFydHMudXJuKSB7XG4gICAgICByZXR1cm4gdiA9PT0gdW5kZWZpbmVkID8gJycgOiB0aGlzO1xuICAgIH1cblxuICAgIGlmICh2ID09PSB1bmRlZmluZWQgfHwgdiA9PT0gdHJ1ZSkge1xuICAgICAgaWYgKCF0aGlzLl9wYXJ0cy5wYXRoIHx8IHRoaXMuX3BhcnRzLnBhdGggPT09ICcvJykge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG5cbiAgICAgIHZhciBmaWxlbmFtZSA9IHRoaXMuZmlsZW5hbWUoKTtcbiAgICAgIHZhciBwb3MgPSBmaWxlbmFtZS5sYXN0SW5kZXhPZignLicpO1xuICAgICAgdmFyIHMsIHJlcztcblxuICAgICAgaWYgKHBvcyA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuXG4gICAgICAvLyBzdWZmaXggbWF5IG9ubHkgY29udGFpbiBhbG51bSBjaGFyYWN0ZXJzICh5dXAsIEkgbWFkZSB0aGlzIHVwLilcbiAgICAgIHMgPSBmaWxlbmFtZS5zdWJzdHJpbmcocG9zKzEpO1xuICAgICAgcmVzID0gKC9eW2EtejAtOSVdKyQvaSkudGVzdChzKSA/IHMgOiAnJztcbiAgICAgIHJldHVybiB2ID8gVVJJLmRlY29kZVBhdGhTZWdtZW50KHJlcykgOiByZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh2LmNoYXJBdCgwKSA9PT0gJy4nKSB7XG4gICAgICAgIHYgPSB2LnN1YnN0cmluZygxKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHN1ZmZpeCA9IHRoaXMuc3VmZml4KCk7XG4gICAgICB2YXIgcmVwbGFjZTtcblxuICAgICAgaWYgKCFzdWZmaXgpIHtcbiAgICAgICAgaWYgKCF2KSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9wYXJ0cy5wYXRoICs9ICcuJyArIFVSSS5yZWNvZGVQYXRoKHYpO1xuICAgICAgfSBlbHNlIGlmICghdikge1xuICAgICAgICByZXBsYWNlID0gbmV3IFJlZ0V4cChlc2NhcGVSZWdFeCgnLicgKyBzdWZmaXgpICsgJyQnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcGxhY2UgPSBuZXcgUmVnRXhwKGVzY2FwZVJlZ0V4KHN1ZmZpeCkgKyAnJCcpO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVwbGFjZSkge1xuICAgICAgICB2ID0gVVJJLnJlY29kZVBhdGgodik7XG4gICAgICAgIHRoaXMuX3BhcnRzLnBhdGggPSB0aGlzLl9wYXJ0cy5wYXRoLnJlcGxhY2UocmVwbGFjZSwgdik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfTtcbiAgcC5zZWdtZW50ID0gZnVuY3Rpb24oc2VnbWVudCwgdiwgYnVpbGQpIHtcbiAgICB2YXIgc2VwYXJhdG9yID0gdGhpcy5fcGFydHMudXJuID8gJzonIDogJy8nO1xuICAgIHZhciBwYXRoID0gdGhpcy5wYXRoKCk7XG4gICAgdmFyIGFic29sdXRlID0gcGF0aC5zdWJzdHJpbmcoMCwgMSkgPT09ICcvJztcbiAgICB2YXIgc2VnbWVudHMgPSBwYXRoLnNwbGl0KHNlcGFyYXRvcik7XG5cbiAgICBpZiAoc2VnbWVudCAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBzZWdtZW50ICE9PSAnbnVtYmVyJykge1xuICAgICAgYnVpbGQgPSB2O1xuICAgICAgdiA9IHNlZ21lbnQ7XG4gICAgICBzZWdtZW50ID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmIChzZWdtZW50ICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHNlZ21lbnQgIT09ICdudW1iZXInKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBzZWdtZW50IFwiJyArIHNlZ21lbnQgKyAnXCIsIG11c3QgYmUgMC1iYXNlZCBpbnRlZ2VyJyk7XG4gICAgfVxuXG4gICAgaWYgKGFic29sdXRlKSB7XG4gICAgICBzZWdtZW50cy5zaGlmdCgpO1xuICAgIH1cblxuICAgIGlmIChzZWdtZW50IDwgMCkge1xuICAgICAgLy8gYWxsb3cgbmVnYXRpdmUgaW5kZXhlcyB0byBhZGRyZXNzIGZyb20gdGhlIGVuZFxuICAgICAgc2VnbWVudCA9IE1hdGgubWF4KHNlZ21lbnRzLmxlbmd0aCArIHNlZ21lbnQsIDApO1xuICAgIH1cblxuICAgIGlmICh2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8qanNoaW50IGxheGJyZWFrOiB0cnVlICovXG4gICAgICByZXR1cm4gc2VnbWVudCA9PT0gdW5kZWZpbmVkXG4gICAgICAgID8gc2VnbWVudHNcbiAgICAgICAgOiBzZWdtZW50c1tzZWdtZW50XTtcbiAgICAgIC8qanNoaW50IGxheGJyZWFrOiBmYWxzZSAqL1xuICAgIH0gZWxzZSBpZiAoc2VnbWVudCA9PT0gbnVsbCB8fCBzZWdtZW50c1tzZWdtZW50XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoaXNBcnJheSh2KSkge1xuICAgICAgICBzZWdtZW50cyA9IFtdO1xuICAgICAgICAvLyBjb2xsYXBzZSBlbXB0eSBlbGVtZW50cyB3aXRoaW4gYXJyYXlcbiAgICAgICAgZm9yICh2YXIgaT0wLCBsPXYubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgaWYgKCF2W2ldLmxlbmd0aCAmJiAoIXNlZ21lbnRzLmxlbmd0aCB8fCAhc2VnbWVudHNbc2VnbWVudHMubGVuZ3RoIC0xXS5sZW5ndGgpKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc2VnbWVudHMubGVuZ3RoICYmICFzZWdtZW50c1tzZWdtZW50cy5sZW5ndGggLTFdLmxlbmd0aCkge1xuICAgICAgICAgICAgc2VnbWVudHMucG9wKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc2VnbWVudHMucHVzaCh2W2ldKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh2IHx8IHR5cGVvZiB2ID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZiAoc2VnbWVudHNbc2VnbWVudHMubGVuZ3RoIC0xXSA9PT0gJycpIHtcbiAgICAgICAgICAvLyBlbXB0eSB0cmFpbGluZyBlbGVtZW50cyBoYXZlIHRvIGJlIG92ZXJ3cml0dGVuXG4gICAgICAgICAgLy8gdG8gcHJldmVudCByZXN1bHRzIHN1Y2ggYXMgL2Zvby8vYmFyXG4gICAgICAgICAgc2VnbWVudHNbc2VnbWVudHMubGVuZ3RoIC0xXSA9IHY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VnbWVudHMucHVzaCh2KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodikge1xuICAgICAgICBzZWdtZW50c1tzZWdtZW50XSA9IHY7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWdtZW50cy5zcGxpY2Uoc2VnbWVudCwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGFic29sdXRlKSB7XG4gICAgICBzZWdtZW50cy51bnNoaWZ0KCcnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wYXRoKHNlZ21lbnRzLmpvaW4oc2VwYXJhdG9yKSwgYnVpbGQpO1xuICB9O1xuICBwLnNlZ21lbnRDb2RlZCA9IGZ1bmN0aW9uKHNlZ21lbnQsIHYsIGJ1aWxkKSB7XG4gICAgdmFyIHNlZ21lbnRzLCBpLCBsO1xuXG4gICAgaWYgKHR5cGVvZiBzZWdtZW50ICE9PSAnbnVtYmVyJykge1xuICAgICAgYnVpbGQgPSB2O1xuICAgICAgdiA9IHNlZ21lbnQ7XG4gICAgICBzZWdtZW50ID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmICh2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHNlZ21lbnRzID0gdGhpcy5zZWdtZW50KHNlZ21lbnQsIHYsIGJ1aWxkKTtcbiAgICAgIGlmICghaXNBcnJheShzZWdtZW50cykpIHtcbiAgICAgICAgc2VnbWVudHMgPSBzZWdtZW50cyAhPT0gdW5kZWZpbmVkID8gVVJJLmRlY29kZShzZWdtZW50cykgOiB1bmRlZmluZWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSAwLCBsID0gc2VnbWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgc2VnbWVudHNbaV0gPSBVUkkuZGVjb2RlKHNlZ21lbnRzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2VnbWVudHM7XG4gICAgfVxuXG4gICAgaWYgKCFpc0FycmF5KHYpKSB7XG4gICAgICB2ID0gKHR5cGVvZiB2ID09PSAnc3RyaW5nJyB8fCB2IGluc3RhbmNlb2YgU3RyaW5nKSA/IFVSSS5lbmNvZGUodikgOiB2O1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGkgPSAwLCBsID0gdi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdltpXSA9IFVSSS5lbmNvZGUodltpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc2VnbWVudChzZWdtZW50LCB2LCBidWlsZCk7XG4gIH07XG5cbiAgLy8gbXV0YXRpbmcgcXVlcnkgc3RyaW5nXG4gIHZhciBxID0gcC5xdWVyeTtcbiAgcC5xdWVyeSA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XG4gICAgaWYgKHYgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBVUkkucGFyc2VRdWVyeSh0aGlzLl9wYXJ0cy5xdWVyeSwgdGhpcy5fcGFydHMuZXNjYXBlUXVlcnlTcGFjZSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdmFyIGRhdGEgPSBVUkkucGFyc2VRdWVyeSh0aGlzLl9wYXJ0cy5xdWVyeSwgdGhpcy5fcGFydHMuZXNjYXBlUXVlcnlTcGFjZSk7XG4gICAgICB2YXIgcmVzdWx0ID0gdi5jYWxsKHRoaXMsIGRhdGEpO1xuICAgICAgdGhpcy5fcGFydHMucXVlcnkgPSBVUkkuYnVpbGRRdWVyeShyZXN1bHQgfHwgZGF0YSwgdGhpcy5fcGFydHMuZHVwbGljYXRlUXVlcnlQYXJhbWV0ZXJzLCB0aGlzLl9wYXJ0cy5lc2NhcGVRdWVyeVNwYWNlKTtcbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gZWxzZSBpZiAodiAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiB2ICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fcGFydHMucXVlcnkgPSBVUkkuYnVpbGRRdWVyeSh2LCB0aGlzLl9wYXJ0cy5kdXBsaWNhdGVRdWVyeVBhcmFtZXRlcnMsIHRoaXMuX3BhcnRzLmVzY2FwZVF1ZXJ5U3BhY2UpO1xuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBxLmNhbGwodGhpcywgdiwgYnVpbGQpO1xuICAgIH1cbiAgfTtcbiAgcC5zZXRRdWVyeSA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBidWlsZCkge1xuICAgIHZhciBkYXRhID0gVVJJLnBhcnNlUXVlcnkodGhpcy5fcGFydHMucXVlcnksIHRoaXMuX3BhcnRzLmVzY2FwZVF1ZXJ5U3BhY2UpO1xuXG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSAnc3RyaW5nJyB8fCBuYW1lIGluc3RhbmNlb2YgU3RyaW5nKSB7XG4gICAgICBkYXRhW25hbWVdID0gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDogbnVsbDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBuYW1lID09PSAnb2JqZWN0Jykge1xuICAgICAgZm9yICh2YXIga2V5IGluIG5hbWUpIHtcbiAgICAgICAgaWYgKGhhc093bi5jYWxsKG5hbWUsIGtleSkpIHtcbiAgICAgICAgICBkYXRhW2tleV0gPSBuYW1lW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVVJJLmFkZFF1ZXJ5KCkgYWNjZXB0cyBhbiBvYmplY3QsIHN0cmluZyBhcyB0aGUgbmFtZSBwYXJhbWV0ZXInKTtcbiAgICB9XG5cbiAgICB0aGlzLl9wYXJ0cy5xdWVyeSA9IFVSSS5idWlsZFF1ZXJ5KGRhdGEsIHRoaXMuX3BhcnRzLmR1cGxpY2F0ZVF1ZXJ5UGFyYW1ldGVycywgdGhpcy5fcGFydHMuZXNjYXBlUXVlcnlTcGFjZSk7XG4gICAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgYnVpbGQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHAuYWRkUXVlcnkgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgYnVpbGQpIHtcbiAgICB2YXIgZGF0YSA9IFVSSS5wYXJzZVF1ZXJ5KHRoaXMuX3BhcnRzLnF1ZXJ5LCB0aGlzLl9wYXJ0cy5lc2NhcGVRdWVyeVNwYWNlKTtcbiAgICBVUkkuYWRkUXVlcnkoZGF0YSwgbmFtZSwgdmFsdWUgPT09IHVuZGVmaW5lZCA/IG51bGwgOiB2YWx1ZSk7XG4gICAgdGhpcy5fcGFydHMucXVlcnkgPSBVUkkuYnVpbGRRdWVyeShkYXRhLCB0aGlzLl9wYXJ0cy5kdXBsaWNhdGVRdWVyeVBhcmFtZXRlcnMsIHRoaXMuX3BhcnRzLmVzY2FwZVF1ZXJ5U3BhY2UpO1xuICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIGJ1aWxkID0gdmFsdWU7XG4gICAgfVxuXG4gICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBwLnJlbW92ZVF1ZXJ5ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUsIGJ1aWxkKSB7XG4gICAgdmFyIGRhdGEgPSBVUkkucGFyc2VRdWVyeSh0aGlzLl9wYXJ0cy5xdWVyeSwgdGhpcy5fcGFydHMuZXNjYXBlUXVlcnlTcGFjZSk7XG4gICAgVVJJLnJlbW92ZVF1ZXJ5KGRhdGEsIG5hbWUsIHZhbHVlKTtcbiAgICB0aGlzLl9wYXJ0cy5xdWVyeSA9IFVSSS5idWlsZFF1ZXJ5KGRhdGEsIHRoaXMuX3BhcnRzLmR1cGxpY2F0ZVF1ZXJ5UGFyYW1ldGVycywgdGhpcy5fcGFydHMuZXNjYXBlUXVlcnlTcGFjZSk7XG4gICAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgYnVpbGQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHAuaGFzUXVlcnkgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgd2l0aGluQXJyYXkpIHtcbiAgICB2YXIgZGF0YSA9IFVSSS5wYXJzZVF1ZXJ5KHRoaXMuX3BhcnRzLnF1ZXJ5LCB0aGlzLl9wYXJ0cy5lc2NhcGVRdWVyeVNwYWNlKTtcbiAgICByZXR1cm4gVVJJLmhhc1F1ZXJ5KGRhdGEsIG5hbWUsIHZhbHVlLCB3aXRoaW5BcnJheSk7XG4gIH07XG4gIHAuc2V0U2VhcmNoID0gcC5zZXRRdWVyeTtcbiAgcC5hZGRTZWFyY2ggPSBwLmFkZFF1ZXJ5O1xuICBwLnJlbW92ZVNlYXJjaCA9IHAucmVtb3ZlUXVlcnk7XG4gIHAuaGFzU2VhcmNoID0gcC5oYXNRdWVyeTtcblxuICAvLyBzYW5pdGl6aW5nIFVSTHNcbiAgcC5ub3JtYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5fcGFydHMudXJuKSB7XG4gICAgICByZXR1cm4gdGhpc1xuICAgICAgICAubm9ybWFsaXplUHJvdG9jb2woZmFsc2UpXG4gICAgICAgIC5ub3JtYWxpemVQYXRoKGZhbHNlKVxuICAgICAgICAubm9ybWFsaXplUXVlcnkoZmFsc2UpXG4gICAgICAgIC5ub3JtYWxpemVGcmFnbWVudChmYWxzZSlcbiAgICAgICAgLmJ1aWxkKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgICAgIC5ub3JtYWxpemVQcm90b2NvbChmYWxzZSlcbiAgICAgIC5ub3JtYWxpemVIb3N0bmFtZShmYWxzZSlcbiAgICAgIC5ub3JtYWxpemVQb3J0KGZhbHNlKVxuICAgICAgLm5vcm1hbGl6ZVBhdGgoZmFsc2UpXG4gICAgICAubm9ybWFsaXplUXVlcnkoZmFsc2UpXG4gICAgICAubm9ybWFsaXplRnJhZ21lbnQoZmFsc2UpXG4gICAgICAuYnVpbGQoKTtcbiAgfTtcbiAgcC5ub3JtYWxpemVQcm90b2NvbCA9IGZ1bmN0aW9uKGJ1aWxkKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLl9wYXJ0cy5wcm90b2NvbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX3BhcnRzLnByb3RvY29sID0gdGhpcy5fcGFydHMucHJvdG9jb2wudG9Mb3dlckNhc2UoKTtcbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgcC5ub3JtYWxpemVIb3N0bmFtZSA9IGZ1bmN0aW9uKGJ1aWxkKSB7XG4gICAgaWYgKHRoaXMuX3BhcnRzLmhvc3RuYW1lKSB7XG4gICAgICBpZiAodGhpcy5pcygnSUROJykgJiYgcHVueWNvZGUpIHtcbiAgICAgICAgdGhpcy5fcGFydHMuaG9zdG5hbWUgPSBwdW55Y29kZS50b0FTQ0lJKHRoaXMuX3BhcnRzLmhvc3RuYW1lKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pcygnSVB2NicpICYmIElQdjYpIHtcbiAgICAgICAgdGhpcy5fcGFydHMuaG9zdG5hbWUgPSBJUHY2LmJlc3QodGhpcy5fcGFydHMuaG9zdG5hbWUpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9wYXJ0cy5ob3N0bmFtZSA9IHRoaXMuX3BhcnRzLmhvc3RuYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHAubm9ybWFsaXplUG9ydCA9IGZ1bmN0aW9uKGJ1aWxkKSB7XG4gICAgLy8gcmVtb3ZlIHBvcnQgb2YgaXQncyB0aGUgcHJvdG9jb2wncyBkZWZhdWx0XG4gICAgaWYgKHR5cGVvZiB0aGlzLl9wYXJ0cy5wcm90b2NvbCA9PT0gJ3N0cmluZycgJiYgdGhpcy5fcGFydHMucG9ydCA9PT0gVVJJLmRlZmF1bHRQb3J0c1t0aGlzLl9wYXJ0cy5wcm90b2NvbF0pIHtcbiAgICAgIHRoaXMuX3BhcnRzLnBvcnQgPSBudWxsO1xuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBwLm5vcm1hbGl6ZVBhdGggPSBmdW5jdGlvbihidWlsZCkge1xuICAgIHZhciBfcGF0aCA9IHRoaXMuX3BhcnRzLnBhdGg7XG4gICAgaWYgKCFfcGF0aCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3BhcnRzLnVybikge1xuICAgICAgdGhpcy5fcGFydHMucGF0aCA9IFVSSS5yZWNvZGVVcm5QYXRoKHRoaXMuX3BhcnRzLnBhdGgpO1xuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3BhcnRzLnBhdGggPT09ICcvJykge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdmFyIF93YXNfcmVsYXRpdmU7XG4gICAgdmFyIF9sZWFkaW5nUGFyZW50cyA9ICcnO1xuICAgIHZhciBfcGFyZW50LCBfcG9zO1xuXG4gICAgLy8gaGFuZGxlIHJlbGF0aXZlIHBhdGhzXG4gICAgaWYgKF9wYXRoLmNoYXJBdCgwKSAhPT0gJy8nKSB7XG4gICAgICBfd2FzX3JlbGF0aXZlID0gdHJ1ZTtcbiAgICAgIF9wYXRoID0gJy8nICsgX3BhdGg7XG4gICAgfVxuXG4gICAgLy8gaGFuZGxlIHJlbGF0aXZlIGZpbGVzIChhcyBvcHBvc2VkIHRvIGRpcmVjdG9yaWVzKVxuICAgIGlmIChfcGF0aC5zbGljZSgtMykgPT09ICcvLi4nIHx8IF9wYXRoLnNsaWNlKC0yKSA9PT0gJy8uJykge1xuICAgICAgX3BhdGggKz0gJy8nO1xuICAgIH1cblxuICAgIC8vIHJlc29sdmUgc2ltcGxlc1xuICAgIF9wYXRoID0gX3BhdGhcbiAgICAgIC5yZXBsYWNlKC8oXFwvKFxcLlxcLykrKXwoXFwvXFwuJCkvZywgJy8nKVxuICAgICAgLnJlcGxhY2UoL1xcL3syLH0vZywgJy8nKTtcblxuICAgIC8vIHJlbWVtYmVyIGxlYWRpbmcgcGFyZW50c1xuICAgIGlmIChfd2FzX3JlbGF0aXZlKSB7XG4gICAgICBfbGVhZGluZ1BhcmVudHMgPSBfcGF0aC5zdWJzdHJpbmcoMSkubWF0Y2goL14oXFwuXFwuXFwvKSsvKSB8fCAnJztcbiAgICAgIGlmIChfbGVhZGluZ1BhcmVudHMpIHtcbiAgICAgICAgX2xlYWRpbmdQYXJlbnRzID0gX2xlYWRpbmdQYXJlbnRzWzBdO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJlc29sdmUgcGFyZW50c1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBfcGFyZW50ID0gX3BhdGguaW5kZXhPZignLy4uJyk7XG4gICAgICBpZiAoX3BhcmVudCA9PT0gLTEpIHtcbiAgICAgICAgLy8gbm8gbW9yZSAuLi8gdG8gcmVzb2x2ZVxuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSBpZiAoX3BhcmVudCA9PT0gMCkge1xuICAgICAgICAvLyB0b3AgbGV2ZWwgY2Fubm90IGJlIHJlbGF0aXZlLCBza2lwIGl0XG4gICAgICAgIF9wYXRoID0gX3BhdGguc3Vic3RyaW5nKDMpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgX3BvcyA9IF9wYXRoLnN1YnN0cmluZygwLCBfcGFyZW50KS5sYXN0SW5kZXhPZignLycpO1xuICAgICAgaWYgKF9wb3MgPT09IC0xKSB7XG4gICAgICAgIF9wb3MgPSBfcGFyZW50O1xuICAgICAgfVxuICAgICAgX3BhdGggPSBfcGF0aC5zdWJzdHJpbmcoMCwgX3BvcykgKyBfcGF0aC5zdWJzdHJpbmcoX3BhcmVudCArIDMpO1xuICAgIH1cblxuICAgIC8vIHJldmVydCB0byByZWxhdGl2ZVxuICAgIGlmIChfd2FzX3JlbGF0aXZlICYmIHRoaXMuaXMoJ3JlbGF0aXZlJykpIHtcbiAgICAgIF9wYXRoID0gX2xlYWRpbmdQYXJlbnRzICsgX3BhdGguc3Vic3RyaW5nKDEpO1xuICAgIH1cblxuICAgIF9wYXRoID0gVVJJLnJlY29kZVBhdGgoX3BhdGgpO1xuICAgIHRoaXMuX3BhcnRzLnBhdGggPSBfcGF0aDtcbiAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHAubm9ybWFsaXplUGF0aG5hbWUgPSBwLm5vcm1hbGl6ZVBhdGg7XG4gIHAubm9ybWFsaXplUXVlcnkgPSBmdW5jdGlvbihidWlsZCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5fcGFydHMucXVlcnkgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAoIXRoaXMuX3BhcnRzLnF1ZXJ5Lmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9wYXJ0cy5xdWVyeSA9IG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnF1ZXJ5KFVSSS5wYXJzZVF1ZXJ5KHRoaXMuX3BhcnRzLnF1ZXJ5LCB0aGlzLl9wYXJ0cy5lc2NhcGVRdWVyeVNwYWNlKSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgcC5ub3JtYWxpemVGcmFnbWVudCA9IGZ1bmN0aW9uKGJ1aWxkKSB7XG4gICAgaWYgKCF0aGlzLl9wYXJ0cy5mcmFnbWVudCkge1xuICAgICAgdGhpcy5fcGFydHMuZnJhZ21lbnQgPSBudWxsO1xuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBwLm5vcm1hbGl6ZVNlYXJjaCA9IHAubm9ybWFsaXplUXVlcnk7XG4gIHAubm9ybWFsaXplSGFzaCA9IHAubm9ybWFsaXplRnJhZ21lbnQ7XG5cbiAgcC5pc284ODU5ID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gZXhwZWN0IHVuaWNvZGUgaW5wdXQsIGlzbzg4NTkgb3V0cHV0XG4gICAgdmFyIGUgPSBVUkkuZW5jb2RlO1xuICAgIHZhciBkID0gVVJJLmRlY29kZTtcblxuICAgIFVSSS5lbmNvZGUgPSBlc2NhcGU7XG4gICAgVVJJLmRlY29kZSA9IGRlY29kZVVSSUNvbXBvbmVudDtcbiAgICB0cnkge1xuICAgICAgdGhpcy5ub3JtYWxpemUoKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgVVJJLmVuY29kZSA9IGU7XG4gICAgICBVUkkuZGVjb2RlID0gZDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgcC51bmljb2RlID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gZXhwZWN0IGlzbzg4NTkgaW5wdXQsIHVuaWNvZGUgb3V0cHV0XG4gICAgdmFyIGUgPSBVUkkuZW5jb2RlO1xuICAgIHZhciBkID0gVVJJLmRlY29kZTtcblxuICAgIFVSSS5lbmNvZGUgPSBzdHJpY3RFbmNvZGVVUklDb21wb25lbnQ7XG4gICAgVVJJLmRlY29kZSA9IHVuZXNjYXBlO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLm5vcm1hbGl6ZSgpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBVUkkuZW5jb2RlID0gZTtcbiAgICAgIFVSSS5kZWNvZGUgPSBkO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBwLnJlYWRhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHVyaSA9IHRoaXMuY2xvbmUoKTtcbiAgICAvLyByZW1vdmluZyB1c2VybmFtZSwgcGFzc3dvcmQsIGJlY2F1c2UgdGhleSBzaG91bGRuJ3QgYmUgZGlzcGxheWVkIGFjY29yZGluZyB0byBSRkMgMzk4NlxuICAgIHVyaS51c2VybmFtZSgnJykucGFzc3dvcmQoJycpLm5vcm1hbGl6ZSgpO1xuICAgIHZhciB0ID0gJyc7XG4gICAgaWYgKHVyaS5fcGFydHMucHJvdG9jb2wpIHtcbiAgICAgIHQgKz0gdXJpLl9wYXJ0cy5wcm90b2NvbCArICc6Ly8nO1xuICAgIH1cblxuICAgIGlmICh1cmkuX3BhcnRzLmhvc3RuYW1lKSB7XG4gICAgICBpZiAodXJpLmlzKCdwdW55Y29kZScpICYmIHB1bnljb2RlKSB7XG4gICAgICAgIHQgKz0gcHVueWNvZGUudG9Vbmljb2RlKHVyaS5fcGFydHMuaG9zdG5hbWUpO1xuICAgICAgICBpZiAodXJpLl9wYXJ0cy5wb3J0KSB7XG4gICAgICAgICAgdCArPSAnOicgKyB1cmkuX3BhcnRzLnBvcnQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHQgKz0gdXJpLmhvc3QoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodXJpLl9wYXJ0cy5ob3N0bmFtZSAmJiB1cmkuX3BhcnRzLnBhdGggJiYgdXJpLl9wYXJ0cy5wYXRoLmNoYXJBdCgwKSAhPT0gJy8nKSB7XG4gICAgICB0ICs9ICcvJztcbiAgICB9XG5cbiAgICB0ICs9IHVyaS5wYXRoKHRydWUpO1xuICAgIGlmICh1cmkuX3BhcnRzLnF1ZXJ5KSB7XG4gICAgICB2YXIgcSA9ICcnO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIHFwID0gdXJpLl9wYXJ0cy5xdWVyeS5zcGxpdCgnJicpLCBsID0gcXAubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZhciBrdiA9IChxcFtpXSB8fCAnJykuc3BsaXQoJz0nKTtcbiAgICAgICAgcSArPSAnJicgKyBVUkkuZGVjb2RlUXVlcnkoa3ZbMF0sIHRoaXMuX3BhcnRzLmVzY2FwZVF1ZXJ5U3BhY2UpXG4gICAgICAgICAgLnJlcGxhY2UoLyYvZywgJyUyNicpO1xuXG4gICAgICAgIGlmIChrdlsxXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcSArPSAnPScgKyBVUkkuZGVjb2RlUXVlcnkoa3ZbMV0sIHRoaXMuX3BhcnRzLmVzY2FwZVF1ZXJ5U3BhY2UpXG4gICAgICAgICAgICAucmVwbGFjZSgvJi9nLCAnJTI2Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHQgKz0gJz8nICsgcS5zdWJzdHJpbmcoMSk7XG4gICAgfVxuXG4gICAgdCArPSBVUkkuZGVjb2RlUXVlcnkodXJpLmhhc2goKSwgdHJ1ZSk7XG4gICAgcmV0dXJuIHQ7XG4gIH07XG5cbiAgLy8gcmVzb2x2aW5nIHJlbGF0aXZlIGFuZCBhYnNvbHV0ZSBVUkxzXG4gIHAuYWJzb2x1dGVUbyA9IGZ1bmN0aW9uKGJhc2UpIHtcbiAgICB2YXIgcmVzb2x2ZWQgPSB0aGlzLmNsb25lKCk7XG4gICAgdmFyIHByb3BlcnRpZXMgPSBbJ3Byb3RvY29sJywgJ3VzZXJuYW1lJywgJ3Bhc3N3b3JkJywgJ2hvc3RuYW1lJywgJ3BvcnQnXTtcbiAgICB2YXIgYmFzZWRpciwgaSwgcDtcblxuICAgIGlmICh0aGlzLl9wYXJ0cy51cm4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVVJOcyBkbyBub3QgaGF2ZSBhbnkgZ2VuZXJhbGx5IGRlZmluZWQgaGllcmFyY2hpY2FsIGNvbXBvbmVudHMnKTtcbiAgICB9XG5cbiAgICBpZiAoIShiYXNlIGluc3RhbmNlb2YgVVJJKSkge1xuICAgICAgYmFzZSA9IG5ldyBVUkkoYmFzZSk7XG4gICAgfVxuXG4gICAgaWYgKCFyZXNvbHZlZC5fcGFydHMucHJvdG9jb2wpIHtcbiAgICAgIHJlc29sdmVkLl9wYXJ0cy5wcm90b2NvbCA9IGJhc2UuX3BhcnRzLnByb3RvY29sO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wYXJ0cy5ob3N0bmFtZSkge1xuICAgICAgcmV0dXJuIHJlc29sdmVkO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IChwID0gcHJvcGVydGllc1tpXSk7IGkrKykge1xuICAgICAgcmVzb2x2ZWQuX3BhcnRzW3BdID0gYmFzZS5fcGFydHNbcF07XG4gICAgfVxuXG4gICAgaWYgKCFyZXNvbHZlZC5fcGFydHMucGF0aCkge1xuICAgICAgcmVzb2x2ZWQuX3BhcnRzLnBhdGggPSBiYXNlLl9wYXJ0cy5wYXRoO1xuICAgICAgaWYgKCFyZXNvbHZlZC5fcGFydHMucXVlcnkpIHtcbiAgICAgICAgcmVzb2x2ZWQuX3BhcnRzLnF1ZXJ5ID0gYmFzZS5fcGFydHMucXVlcnk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChyZXNvbHZlZC5fcGFydHMucGF0aC5zdWJzdHJpbmcoLTIpID09PSAnLi4nKSB7XG4gICAgICByZXNvbHZlZC5fcGFydHMucGF0aCArPSAnLyc7XG4gICAgfVxuXG4gICAgaWYgKHJlc29sdmVkLnBhdGgoKS5jaGFyQXQoMCkgIT09ICcvJykge1xuICAgICAgYmFzZWRpciA9IGJhc2UuZGlyZWN0b3J5KCk7XG4gICAgICBiYXNlZGlyID0gYmFzZWRpciA/IGJhc2VkaXIgOiBiYXNlLnBhdGgoKS5pbmRleE9mKCcvJykgPT09IDAgPyAnLycgOiAnJztcbiAgICAgIHJlc29sdmVkLl9wYXJ0cy5wYXRoID0gKGJhc2VkaXIgPyAoYmFzZWRpciArICcvJykgOiAnJykgKyByZXNvbHZlZC5fcGFydHMucGF0aDtcbiAgICAgIHJlc29sdmVkLm5vcm1hbGl6ZVBhdGgoKTtcbiAgICB9XG5cbiAgICByZXNvbHZlZC5idWlsZCgpO1xuICAgIHJldHVybiByZXNvbHZlZDtcbiAgfTtcbiAgcC5yZWxhdGl2ZVRvID0gZnVuY3Rpb24oYmFzZSkge1xuICAgIHZhciByZWxhdGl2ZSA9IHRoaXMuY2xvbmUoKS5ub3JtYWxpemUoKTtcbiAgICB2YXIgcmVsYXRpdmVQYXJ0cywgYmFzZVBhcnRzLCBjb21tb24sIHJlbGF0aXZlUGF0aCwgYmFzZVBhdGg7XG5cbiAgICBpZiAocmVsYXRpdmUuX3BhcnRzLnVybikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVUk5zIGRvIG5vdCBoYXZlIGFueSBnZW5lcmFsbHkgZGVmaW5lZCBoaWVyYXJjaGljYWwgY29tcG9uZW50cycpO1xuICAgIH1cblxuICAgIGJhc2UgPSBuZXcgVVJJKGJhc2UpLm5vcm1hbGl6ZSgpO1xuICAgIHJlbGF0aXZlUGFydHMgPSByZWxhdGl2ZS5fcGFydHM7XG4gICAgYmFzZVBhcnRzID0gYmFzZS5fcGFydHM7XG4gICAgcmVsYXRpdmVQYXRoID0gcmVsYXRpdmUucGF0aCgpO1xuICAgIGJhc2VQYXRoID0gYmFzZS5wYXRoKCk7XG5cbiAgICBpZiAocmVsYXRpdmVQYXRoLmNoYXJBdCgwKSAhPT0gJy8nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VSSSBpcyBhbHJlYWR5IHJlbGF0aXZlJyk7XG4gICAgfVxuXG4gICAgaWYgKGJhc2VQYXRoLmNoYXJBdCgwKSAhPT0gJy8nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjYWxjdWxhdGUgYSBVUkkgcmVsYXRpdmUgdG8gYW5vdGhlciByZWxhdGl2ZSBVUkknKTtcbiAgICB9XG5cbiAgICBpZiAocmVsYXRpdmVQYXJ0cy5wcm90b2NvbCA9PT0gYmFzZVBhcnRzLnByb3RvY29sKSB7XG4gICAgICByZWxhdGl2ZVBhcnRzLnByb3RvY29sID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAocmVsYXRpdmVQYXJ0cy51c2VybmFtZSAhPT0gYmFzZVBhcnRzLnVzZXJuYW1lIHx8IHJlbGF0aXZlUGFydHMucGFzc3dvcmQgIT09IGJhc2VQYXJ0cy5wYXNzd29yZCkge1xuICAgICAgcmV0dXJuIHJlbGF0aXZlLmJ1aWxkKCk7XG4gICAgfVxuXG4gICAgaWYgKHJlbGF0aXZlUGFydHMucHJvdG9jb2wgIT09IG51bGwgfHwgcmVsYXRpdmVQYXJ0cy51c2VybmFtZSAhPT0gbnVsbCB8fCByZWxhdGl2ZVBhcnRzLnBhc3N3b3JkICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gcmVsYXRpdmUuYnVpbGQoKTtcbiAgICB9XG5cbiAgICBpZiAocmVsYXRpdmVQYXJ0cy5ob3N0bmFtZSA9PT0gYmFzZVBhcnRzLmhvc3RuYW1lICYmIHJlbGF0aXZlUGFydHMucG9ydCA9PT0gYmFzZVBhcnRzLnBvcnQpIHtcbiAgICAgIHJlbGF0aXZlUGFydHMuaG9zdG5hbWUgPSBudWxsO1xuICAgICAgcmVsYXRpdmVQYXJ0cy5wb3J0ID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJlbGF0aXZlLmJ1aWxkKCk7XG4gICAgfVxuXG4gICAgaWYgKHJlbGF0aXZlUGF0aCA9PT0gYmFzZVBhdGgpIHtcbiAgICAgIHJlbGF0aXZlUGFydHMucGF0aCA9ICcnO1xuICAgICAgcmV0dXJuIHJlbGF0aXZlLmJ1aWxkKCk7XG4gICAgfVxuXG4gICAgLy8gZGV0ZXJtaW5lIGNvbW1vbiBzdWIgcGF0aFxuICAgIGNvbW1vbiA9IFVSSS5jb21tb25QYXRoKHJlbGF0aXZlUGF0aCwgYmFzZVBhdGgpO1xuXG4gICAgLy8gSWYgdGhlIHBhdGhzIGhhdmUgbm90aGluZyBpbiBjb21tb24sIHJldHVybiBhIHJlbGF0aXZlIFVSTCB3aXRoIHRoZSBhYnNvbHV0ZSBwYXRoLlxuICAgIGlmICghY29tbW9uKSB7XG4gICAgICByZXR1cm4gcmVsYXRpdmUuYnVpbGQoKTtcbiAgICB9XG5cbiAgICB2YXIgcGFyZW50cyA9IGJhc2VQYXJ0cy5wYXRoXG4gICAgICAuc3Vic3RyaW5nKGNvbW1vbi5sZW5ndGgpXG4gICAgICAucmVwbGFjZSgvW15cXC9dKiQvLCAnJylcbiAgICAgIC5yZXBsYWNlKC8uKj9cXC8vZywgJy4uLycpO1xuXG4gICAgcmVsYXRpdmVQYXJ0cy5wYXRoID0gKHBhcmVudHMgKyByZWxhdGl2ZVBhcnRzLnBhdGguc3Vic3RyaW5nKGNvbW1vbi5sZW5ndGgpKSB8fCAnLi8nO1xuXG4gICAgcmV0dXJuIHJlbGF0aXZlLmJ1aWxkKCk7XG4gIH07XG5cbiAgLy8gY29tcGFyaW5nIFVSSXNcbiAgcC5lcXVhbHMgPSBmdW5jdGlvbih1cmkpIHtcbiAgICB2YXIgb25lID0gdGhpcy5jbG9uZSgpO1xuICAgIHZhciB0d28gPSBuZXcgVVJJKHVyaSk7XG4gICAgdmFyIG9uZV9tYXAgPSB7fTtcbiAgICB2YXIgdHdvX21hcCA9IHt9O1xuICAgIHZhciBjaGVja2VkID0ge307XG4gICAgdmFyIG9uZV9xdWVyeSwgdHdvX3F1ZXJ5LCBrZXk7XG5cbiAgICBvbmUubm9ybWFsaXplKCk7XG4gICAgdHdvLm5vcm1hbGl6ZSgpO1xuXG4gICAgLy8gZXhhY3QgbWF0Y2hcbiAgICBpZiAob25lLnRvU3RyaW5nKCkgPT09IHR3by50b1N0cmluZygpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBleHRyYWN0IHF1ZXJ5IHN0cmluZ1xuICAgIG9uZV9xdWVyeSA9IG9uZS5xdWVyeSgpO1xuICAgIHR3b19xdWVyeSA9IHR3by5xdWVyeSgpO1xuICAgIG9uZS5xdWVyeSgnJyk7XG4gICAgdHdvLnF1ZXJ5KCcnKTtcblxuICAgIC8vIGRlZmluaXRlbHkgbm90IGVxdWFsIGlmIG5vdCBldmVuIG5vbi1xdWVyeSBwYXJ0cyBtYXRjaFxuICAgIGlmIChvbmUudG9TdHJpbmcoKSAhPT0gdHdvLnRvU3RyaW5nKCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBxdWVyeSBwYXJhbWV0ZXJzIGhhdmUgdGhlIHNhbWUgbGVuZ3RoLCBldmVuIGlmIHRoZXkncmUgcGVybXV0ZWRcbiAgICBpZiAob25lX3F1ZXJ5Lmxlbmd0aCAhPT0gdHdvX3F1ZXJ5Lmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG9uZV9tYXAgPSBVUkkucGFyc2VRdWVyeShvbmVfcXVlcnksIHRoaXMuX3BhcnRzLmVzY2FwZVF1ZXJ5U3BhY2UpO1xuICAgIHR3b19tYXAgPSBVUkkucGFyc2VRdWVyeSh0d29fcXVlcnksIHRoaXMuX3BhcnRzLmVzY2FwZVF1ZXJ5U3BhY2UpO1xuXG4gICAgZm9yIChrZXkgaW4gb25lX21hcCkge1xuICAgICAgaWYgKGhhc093bi5jYWxsKG9uZV9tYXAsIGtleSkpIHtcbiAgICAgICAgaWYgKCFpc0FycmF5KG9uZV9tYXBba2V5XSkpIHtcbiAgICAgICAgICBpZiAob25lX21hcFtrZXldICE9PSB0d29fbWFwW2tleV0pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIWFycmF5c0VxdWFsKG9uZV9tYXBba2V5XSwgdHdvX21hcFtrZXldKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNoZWNrZWRba2V5XSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChrZXkgaW4gdHdvX21hcCkge1xuICAgICAgaWYgKGhhc093bi5jYWxsKHR3b19tYXAsIGtleSkpIHtcbiAgICAgICAgaWYgKCFjaGVja2VkW2tleV0pIHtcbiAgICAgICAgICAvLyB0d28gY29udGFpbnMgYSBwYXJhbWV0ZXIgbm90IHByZXNlbnQgaW4gb25lXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy8gc3RhdGVcbiAgcC5kdXBsaWNhdGVRdWVyeVBhcmFtZXRlcnMgPSBmdW5jdGlvbih2KSB7XG4gICAgdGhpcy5fcGFydHMuZHVwbGljYXRlUXVlcnlQYXJhbWV0ZXJzID0gISF2O1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHAuZXNjYXBlUXVlcnlTcGFjZSA9IGZ1bmN0aW9uKHYpIHtcbiAgICB0aGlzLl9wYXJ0cy5lc2NhcGVRdWVyeVNwYWNlID0gISF2O1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHJldHVybiBVUkk7XG59KSk7XG4iLCIvKiEgaHR0cDovL210aHMuYmUvcHVueWNvZGUgdjEuMi4zIGJ5IEBtYXRoaWFzICovXG47KGZ1bmN0aW9uKHJvb3QpIHtcblxuXHQvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGVzICovXG5cdHZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHM7XG5cdHZhciBmcmVlTW9kdWxlID0gdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiZcblx0XHRtb2R1bGUuZXhwb3J0cyA9PSBmcmVlRXhwb3J0cyAmJiBtb2R1bGU7XG5cdHZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWw7XG5cdGlmIChmcmVlR2xvYmFsLmdsb2JhbCA9PT0gZnJlZUdsb2JhbCB8fCBmcmVlR2xvYmFsLndpbmRvdyA9PT0gZnJlZUdsb2JhbCkge1xuXHRcdHJvb3QgPSBmcmVlR2xvYmFsO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBgcHVueWNvZGVgIG9iamVjdC5cblx0ICogQG5hbWUgcHVueWNvZGVcblx0ICogQHR5cGUgT2JqZWN0XG5cdCAqL1xuXHR2YXIgcHVueWNvZGUsXG5cblx0LyoqIEhpZ2hlc3QgcG9zaXRpdmUgc2lnbmVkIDMyLWJpdCBmbG9hdCB2YWx1ZSAqL1xuXHRtYXhJbnQgPSAyMTQ3NDgzNjQ3LCAvLyBha2EuIDB4N0ZGRkZGRkYgb3IgMl4zMS0xXG5cblx0LyoqIEJvb3RzdHJpbmcgcGFyYW1ldGVycyAqL1xuXHRiYXNlID0gMzYsXG5cdHRNaW4gPSAxLFxuXHR0TWF4ID0gMjYsXG5cdHNrZXcgPSAzOCxcblx0ZGFtcCA9IDcwMCxcblx0aW5pdGlhbEJpYXMgPSA3Mixcblx0aW5pdGlhbE4gPSAxMjgsIC8vIDB4ODBcblx0ZGVsaW1pdGVyID0gJy0nLCAvLyAnXFx4MkQnXG5cblx0LyoqIFJlZ3VsYXIgZXhwcmVzc2lvbnMgKi9cblx0cmVnZXhQdW55Y29kZSA9IC9eeG4tLS8sXG5cdHJlZ2V4Tm9uQVNDSUkgPSAvW14gLX5dLywgLy8gdW5wcmludGFibGUgQVNDSUkgY2hhcnMgKyBub24tQVNDSUkgY2hhcnNcblx0cmVnZXhTZXBhcmF0b3JzID0gL1xceDJFfFxcdTMwMDJ8XFx1RkYwRXxcXHVGRjYxL2csIC8vIFJGQyAzNDkwIHNlcGFyYXRvcnNcblxuXHQvKiogRXJyb3IgbWVzc2FnZXMgKi9cblx0ZXJyb3JzID0ge1xuXHRcdCdvdmVyZmxvdyc6ICdPdmVyZmxvdzogaW5wdXQgbmVlZHMgd2lkZXIgaW50ZWdlcnMgdG8gcHJvY2VzcycsXG5cdFx0J25vdC1iYXNpYyc6ICdJbGxlZ2FsIGlucHV0ID49IDB4ODAgKG5vdCBhIGJhc2ljIGNvZGUgcG9pbnQpJyxcblx0XHQnaW52YWxpZC1pbnB1dCc6ICdJbnZhbGlkIGlucHV0J1xuXHR9LFxuXG5cdC8qKiBDb252ZW5pZW5jZSBzaG9ydGN1dHMgKi9cblx0YmFzZU1pbnVzVE1pbiA9IGJhc2UgLSB0TWluLFxuXHRmbG9vciA9IE1hdGguZmxvb3IsXG5cdHN0cmluZ0Zyb21DaGFyQ29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGUsXG5cblx0LyoqIFRlbXBvcmFyeSB2YXJpYWJsZSAqL1xuXHRrZXk7XG5cblx0LyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblx0LyoqXG5cdCAqIEEgZ2VuZXJpYyBlcnJvciB1dGlsaXR5IGZ1bmN0aW9uLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBUaGUgZXJyb3IgdHlwZS5cblx0ICogQHJldHVybnMge0Vycm9yfSBUaHJvd3MgYSBgUmFuZ2VFcnJvcmAgd2l0aCB0aGUgYXBwbGljYWJsZSBlcnJvciBtZXNzYWdlLlxuXHQgKi9cblx0ZnVuY3Rpb24gZXJyb3IodHlwZSkge1xuXHRcdHRocm93IFJhbmdlRXJyb3IoZXJyb3JzW3R5cGVdKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBIGdlbmVyaWMgYEFycmF5I21hcGAgdXRpbGl0eSBmdW5jdGlvbi5cblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIHRoYXQgZ2V0cyBjYWxsZWQgZm9yIGV2ZXJ5IGFycmF5XG5cdCAqIGl0ZW0uXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gQSBuZXcgYXJyYXkgb2YgdmFsdWVzIHJldHVybmVkIGJ5IHRoZSBjYWxsYmFjayBmdW5jdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIG1hcChhcnJheSwgZm4pIHtcblx0XHR2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXHRcdHdoaWxlIChsZW5ndGgtLSkge1xuXHRcdFx0YXJyYXlbbGVuZ3RoXSA9IGZuKGFycmF5W2xlbmd0aF0pO1xuXHRcdH1cblx0XHRyZXR1cm4gYXJyYXk7XG5cdH1cblxuXHQvKipcblx0ICogQSBzaW1wbGUgYEFycmF5I21hcGAtbGlrZSB3cmFwcGVyIHRvIHdvcmsgd2l0aCBkb21haW4gbmFtZSBzdHJpbmdzLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gZG9tYWluIFRoZSBkb21haW4gbmFtZS5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIHRoYXQgZ2V0cyBjYWxsZWQgZm9yIGV2ZXJ5XG5cdCAqIGNoYXJhY3Rlci5cblx0ICogQHJldHVybnMge0FycmF5fSBBIG5ldyBzdHJpbmcgb2YgY2hhcmFjdGVycyByZXR1cm5lZCBieSB0aGUgY2FsbGJhY2tcblx0ICogZnVuY3Rpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBtYXBEb21haW4oc3RyaW5nLCBmbikge1xuXHRcdHJldHVybiBtYXAoc3RyaW5nLnNwbGl0KHJlZ2V4U2VwYXJhdG9ycyksIGZuKS5qb2luKCcuJyk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhbiBhcnJheSBjb250YWluaW5nIHRoZSBudW1lcmljIGNvZGUgcG9pbnRzIG9mIGVhY2ggVW5pY29kZVxuXHQgKiBjaGFyYWN0ZXIgaW4gdGhlIHN0cmluZy4gV2hpbGUgSmF2YVNjcmlwdCB1c2VzIFVDUy0yIGludGVybmFsbHksXG5cdCAqIHRoaXMgZnVuY3Rpb24gd2lsbCBjb252ZXJ0IGEgcGFpciBvZiBzdXJyb2dhdGUgaGFsdmVzIChlYWNoIG9mIHdoaWNoXG5cdCAqIFVDUy0yIGV4cG9zZXMgYXMgc2VwYXJhdGUgY2hhcmFjdGVycykgaW50byBhIHNpbmdsZSBjb2RlIHBvaW50LFxuXHQgKiBtYXRjaGluZyBVVEYtMTYuXG5cdCAqIEBzZWUgYHB1bnljb2RlLnVjczIuZW5jb2RlYFxuXHQgKiBAc2VlIDxodHRwOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWVuY29kaW5nPlxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGUudWNzMlxuXHQgKiBAbmFtZSBkZWNvZGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZyBUaGUgVW5pY29kZSBpbnB1dCBzdHJpbmcgKFVDUy0yKS5cblx0ICogQHJldHVybnMge0FycmF5fSBUaGUgbmV3IGFycmF5IG9mIGNvZGUgcG9pbnRzLlxuXHQgKi9cblx0ZnVuY3Rpb24gdWNzMmRlY29kZShzdHJpbmcpIHtcblx0XHR2YXIgb3V0cHV0ID0gW10sXG5cdFx0ICAgIGNvdW50ZXIgPSAwLFxuXHRcdCAgICBsZW5ndGggPSBzdHJpbmcubGVuZ3RoLFxuXHRcdCAgICB2YWx1ZSxcblx0XHQgICAgZXh0cmE7XG5cdFx0d2hpbGUgKGNvdW50ZXIgPCBsZW5ndGgpIHtcblx0XHRcdHZhbHVlID0gc3RyaW5nLmNoYXJDb2RlQXQoY291bnRlcisrKTtcblx0XHRcdGlmICh2YWx1ZSA+PSAweEQ4MDAgJiYgdmFsdWUgPD0gMHhEQkZGICYmIGNvdW50ZXIgPCBsZW5ndGgpIHtcblx0XHRcdFx0Ly8gaGlnaCBzdXJyb2dhdGUsIGFuZCB0aGVyZSBpcyBhIG5leHQgY2hhcmFjdGVyXG5cdFx0XHRcdGV4dHJhID0gc3RyaW5nLmNoYXJDb2RlQXQoY291bnRlcisrKTtcblx0XHRcdFx0aWYgKChleHRyYSAmIDB4RkMwMCkgPT0gMHhEQzAwKSB7IC8vIGxvdyBzdXJyb2dhdGVcblx0XHRcdFx0XHRvdXRwdXQucHVzaCgoKHZhbHVlICYgMHgzRkYpIDw8IDEwKSArIChleHRyYSAmIDB4M0ZGKSArIDB4MTAwMDApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIHVubWF0Y2hlZCBzdXJyb2dhdGU7IG9ubHkgYXBwZW5kIHRoaXMgY29kZSB1bml0LCBpbiBjYXNlIHRoZSBuZXh0XG5cdFx0XHRcdFx0Ly8gY29kZSB1bml0IGlzIHRoZSBoaWdoIHN1cnJvZ2F0ZSBvZiBhIHN1cnJvZ2F0ZSBwYWlyXG5cdFx0XHRcdFx0b3V0cHV0LnB1c2godmFsdWUpO1xuXHRcdFx0XHRcdGNvdW50ZXItLTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0b3V0cHV0LnB1c2godmFsdWUpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gb3V0cHV0O1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBzdHJpbmcgYmFzZWQgb24gYW4gYXJyYXkgb2YgbnVtZXJpYyBjb2RlIHBvaW50cy5cblx0ICogQHNlZSBgcHVueWNvZGUudWNzMi5kZWNvZGVgXG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZS51Y3MyXG5cdCAqIEBuYW1lIGVuY29kZVxuXHQgKiBAcGFyYW0ge0FycmF5fSBjb2RlUG9pbnRzIFRoZSBhcnJheSBvZiBudW1lcmljIGNvZGUgcG9pbnRzLlxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgbmV3IFVuaWNvZGUgc3RyaW5nIChVQ1MtMikuXG5cdCAqL1xuXHRmdW5jdGlvbiB1Y3MyZW5jb2RlKGFycmF5KSB7XG5cdFx0cmV0dXJuIG1hcChhcnJheSwgZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHZhciBvdXRwdXQgPSAnJztcblx0XHRcdGlmICh2YWx1ZSA+IDB4RkZGRikge1xuXHRcdFx0XHR2YWx1ZSAtPSAweDEwMDAwO1xuXHRcdFx0XHRvdXRwdXQgKz0gc3RyaW5nRnJvbUNoYXJDb2RlKHZhbHVlID4+PiAxMCAmIDB4M0ZGIHwgMHhEODAwKTtcblx0XHRcdFx0dmFsdWUgPSAweERDMDAgfCB2YWx1ZSAmIDB4M0ZGO1xuXHRcdFx0fVxuXHRcdFx0b3V0cHV0ICs9IHN0cmluZ0Zyb21DaGFyQ29kZSh2YWx1ZSk7XG5cdFx0XHRyZXR1cm4gb3V0cHV0O1xuXHRcdH0pLmpvaW4oJycpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgYmFzaWMgY29kZSBwb2ludCBpbnRvIGEgZGlnaXQvaW50ZWdlci5cblx0ICogQHNlZSBgZGlnaXRUb0Jhc2ljKClgXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBjb2RlUG9pbnQgVGhlIGJhc2ljIG51bWVyaWMgY29kZSBwb2ludCB2YWx1ZS5cblx0ICogQHJldHVybnMge051bWJlcn0gVGhlIG51bWVyaWMgdmFsdWUgb2YgYSBiYXNpYyBjb2RlIHBvaW50IChmb3IgdXNlIGluXG5cdCAqIHJlcHJlc2VudGluZyBpbnRlZ2VycykgaW4gdGhlIHJhbmdlIGAwYCB0byBgYmFzZSAtIDFgLCBvciBgYmFzZWAgaWZcblx0ICogdGhlIGNvZGUgcG9pbnQgZG9lcyBub3QgcmVwcmVzZW50IGEgdmFsdWUuXG5cdCAqL1xuXHRmdW5jdGlvbiBiYXNpY1RvRGlnaXQoY29kZVBvaW50KSB7XG5cdFx0aWYgKGNvZGVQb2ludCAtIDQ4IDwgMTApIHtcblx0XHRcdHJldHVybiBjb2RlUG9pbnQgLSAyMjtcblx0XHR9XG5cdFx0aWYgKGNvZGVQb2ludCAtIDY1IDwgMjYpIHtcblx0XHRcdHJldHVybiBjb2RlUG9pbnQgLSA2NTtcblx0XHR9XG5cdFx0aWYgKGNvZGVQb2ludCAtIDk3IDwgMjYpIHtcblx0XHRcdHJldHVybiBjb2RlUG9pbnQgLSA5Nztcblx0XHR9XG5cdFx0cmV0dXJuIGJhc2U7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBkaWdpdC9pbnRlZ2VyIGludG8gYSBiYXNpYyBjb2RlIHBvaW50LlxuXHQgKiBAc2VlIGBiYXNpY1RvRGlnaXQoKWBcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtOdW1iZXJ9IGRpZ2l0IFRoZSBudW1lcmljIHZhbHVlIG9mIGEgYmFzaWMgY29kZSBwb2ludC5cblx0ICogQHJldHVybnMge051bWJlcn0gVGhlIGJhc2ljIGNvZGUgcG9pbnQgd2hvc2UgdmFsdWUgKHdoZW4gdXNlZCBmb3Jcblx0ICogcmVwcmVzZW50aW5nIGludGVnZXJzKSBpcyBgZGlnaXRgLCB3aGljaCBuZWVkcyB0byBiZSBpbiB0aGUgcmFuZ2Vcblx0ICogYDBgIHRvIGBiYXNlIC0gMWAuIElmIGBmbGFnYCBpcyBub24temVybywgdGhlIHVwcGVyY2FzZSBmb3JtIGlzXG5cdCAqIHVzZWQ7IGVsc2UsIHRoZSBsb3dlcmNhc2UgZm9ybSBpcyB1c2VkLiBUaGUgYmVoYXZpb3IgaXMgdW5kZWZpbmVkXG5cdCAqIGlmIGBmbGFnYCBpcyBub24temVybyBhbmQgYGRpZ2l0YCBoYXMgbm8gdXBwZXJjYXNlIGZvcm0uXG5cdCAqL1xuXHRmdW5jdGlvbiBkaWdpdFRvQmFzaWMoZGlnaXQsIGZsYWcpIHtcblx0XHQvLyAgMC4uMjUgbWFwIHRvIEFTQ0lJIGEuLnogb3IgQS4uWlxuXHRcdC8vIDI2Li4zNSBtYXAgdG8gQVNDSUkgMC4uOVxuXHRcdHJldHVybiBkaWdpdCArIDIyICsgNzUgKiAoZGlnaXQgPCAyNikgLSAoKGZsYWcgIT0gMCkgPDwgNSk7XG5cdH1cblxuXHQvKipcblx0ICogQmlhcyBhZGFwdGF0aW9uIGZ1bmN0aW9uIGFzIHBlciBzZWN0aW9uIDMuNCBvZiBSRkMgMzQ5Mi5cblx0ICogaHR0cDovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzQ5MiNzZWN0aW9uLTMuNFxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0ZnVuY3Rpb24gYWRhcHQoZGVsdGEsIG51bVBvaW50cywgZmlyc3RUaW1lKSB7XG5cdFx0dmFyIGsgPSAwO1xuXHRcdGRlbHRhID0gZmlyc3RUaW1lID8gZmxvb3IoZGVsdGEgLyBkYW1wKSA6IGRlbHRhID4+IDE7XG5cdFx0ZGVsdGEgKz0gZmxvb3IoZGVsdGEgLyBudW1Qb2ludHMpO1xuXHRcdGZvciAoLyogbm8gaW5pdGlhbGl6YXRpb24gKi87IGRlbHRhID4gYmFzZU1pbnVzVE1pbiAqIHRNYXggPj4gMTsgayArPSBiYXNlKSB7XG5cdFx0XHRkZWx0YSA9IGZsb29yKGRlbHRhIC8gYmFzZU1pbnVzVE1pbik7XG5cdFx0fVxuXHRcdHJldHVybiBmbG9vcihrICsgKGJhc2VNaW51c1RNaW4gKyAxKSAqIGRlbHRhIC8gKGRlbHRhICsgc2tldykpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgUHVueWNvZGUgc3RyaW5nIG9mIEFTQ0lJLW9ubHkgc3ltYm9scyB0byBhIHN0cmluZyBvZiBVbmljb2RlXG5cdCAqIHN5bWJvbHMuXG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIFB1bnljb2RlIHN0cmluZyBvZiBBU0NJSS1vbmx5IHN5bWJvbHMuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSByZXN1bHRpbmcgc3RyaW5nIG9mIFVuaWNvZGUgc3ltYm9scy5cblx0ICovXG5cdGZ1bmN0aW9uIGRlY29kZShpbnB1dCkge1xuXHRcdC8vIERvbid0IHVzZSBVQ1MtMlxuXHRcdHZhciBvdXRwdXQgPSBbXSxcblx0XHQgICAgaW5wdXRMZW5ndGggPSBpbnB1dC5sZW5ndGgsXG5cdFx0ICAgIG91dCxcblx0XHQgICAgaSA9IDAsXG5cdFx0ICAgIG4gPSBpbml0aWFsTixcblx0XHQgICAgYmlhcyA9IGluaXRpYWxCaWFzLFxuXHRcdCAgICBiYXNpYyxcblx0XHQgICAgaixcblx0XHQgICAgaW5kZXgsXG5cdFx0ICAgIG9sZGksXG5cdFx0ICAgIHcsXG5cdFx0ICAgIGssXG5cdFx0ICAgIGRpZ2l0LFxuXHRcdCAgICB0LFxuXHRcdCAgICBsZW5ndGgsXG5cdFx0ICAgIC8qKiBDYWNoZWQgY2FsY3VsYXRpb24gcmVzdWx0cyAqL1xuXHRcdCAgICBiYXNlTWludXNUO1xuXG5cdFx0Ly8gSGFuZGxlIHRoZSBiYXNpYyBjb2RlIHBvaW50czogbGV0IGBiYXNpY2AgYmUgdGhlIG51bWJlciBvZiBpbnB1dCBjb2RlXG5cdFx0Ly8gcG9pbnRzIGJlZm9yZSB0aGUgbGFzdCBkZWxpbWl0ZXIsIG9yIGAwYCBpZiB0aGVyZSBpcyBub25lLCB0aGVuIGNvcHlcblx0XHQvLyB0aGUgZmlyc3QgYmFzaWMgY29kZSBwb2ludHMgdG8gdGhlIG91dHB1dC5cblxuXHRcdGJhc2ljID0gaW5wdXQubGFzdEluZGV4T2YoZGVsaW1pdGVyKTtcblx0XHRpZiAoYmFzaWMgPCAwKSB7XG5cdFx0XHRiYXNpYyA9IDA7XG5cdFx0fVxuXG5cdFx0Zm9yIChqID0gMDsgaiA8IGJhc2ljOyArK2opIHtcblx0XHRcdC8vIGlmIGl0J3Mgbm90IGEgYmFzaWMgY29kZSBwb2ludFxuXHRcdFx0aWYgKGlucHV0LmNoYXJDb2RlQXQoaikgPj0gMHg4MCkge1xuXHRcdFx0XHRlcnJvcignbm90LWJhc2ljJyk7XG5cdFx0XHR9XG5cdFx0XHRvdXRwdXQucHVzaChpbnB1dC5jaGFyQ29kZUF0KGopKTtcblx0XHR9XG5cblx0XHQvLyBNYWluIGRlY29kaW5nIGxvb3A6IHN0YXJ0IGp1c3QgYWZ0ZXIgdGhlIGxhc3QgZGVsaW1pdGVyIGlmIGFueSBiYXNpYyBjb2RlXG5cdFx0Ly8gcG9pbnRzIHdlcmUgY29waWVkOyBzdGFydCBhdCB0aGUgYmVnaW5uaW5nIG90aGVyd2lzZS5cblxuXHRcdGZvciAoaW5kZXggPSBiYXNpYyA+IDAgPyBiYXNpYyArIDEgOiAwOyBpbmRleCA8IGlucHV0TGVuZ3RoOyAvKiBubyBmaW5hbCBleHByZXNzaW9uICovKSB7XG5cblx0XHRcdC8vIGBpbmRleGAgaXMgdGhlIGluZGV4IG9mIHRoZSBuZXh0IGNoYXJhY3RlciB0byBiZSBjb25zdW1lZC5cblx0XHRcdC8vIERlY29kZSBhIGdlbmVyYWxpemVkIHZhcmlhYmxlLWxlbmd0aCBpbnRlZ2VyIGludG8gYGRlbHRhYCxcblx0XHRcdC8vIHdoaWNoIGdldHMgYWRkZWQgdG8gYGlgLiBUaGUgb3ZlcmZsb3cgY2hlY2tpbmcgaXMgZWFzaWVyXG5cdFx0XHQvLyBpZiB3ZSBpbmNyZWFzZSBgaWAgYXMgd2UgZ28sIHRoZW4gc3VidHJhY3Qgb2ZmIGl0cyBzdGFydGluZ1xuXHRcdFx0Ly8gdmFsdWUgYXQgdGhlIGVuZCB0byBvYnRhaW4gYGRlbHRhYC5cblx0XHRcdGZvciAob2xkaSA9IGksIHcgPSAxLCBrID0gYmFzZTsgLyogbm8gY29uZGl0aW9uICovOyBrICs9IGJhc2UpIHtcblxuXHRcdFx0XHRpZiAoaW5kZXggPj0gaW5wdXRMZW5ndGgpIHtcblx0XHRcdFx0XHRlcnJvcignaW52YWxpZC1pbnB1dCcpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZGlnaXQgPSBiYXNpY1RvRGlnaXQoaW5wdXQuY2hhckNvZGVBdChpbmRleCsrKSk7XG5cblx0XHRcdFx0aWYgKGRpZ2l0ID49IGJhc2UgfHwgZGlnaXQgPiBmbG9vcigobWF4SW50IC0gaSkgLyB3KSkge1xuXHRcdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aSArPSBkaWdpdCAqIHc7XG5cdFx0XHRcdHQgPSBrIDw9IGJpYXMgPyB0TWluIDogKGsgPj0gYmlhcyArIHRNYXggPyB0TWF4IDogayAtIGJpYXMpO1xuXG5cdFx0XHRcdGlmIChkaWdpdCA8IHQpIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGJhc2VNaW51c1QgPSBiYXNlIC0gdDtcblx0XHRcdFx0aWYgKHcgPiBmbG9vcihtYXhJbnQgLyBiYXNlTWludXNUKSkge1xuXHRcdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dyAqPSBiYXNlTWludXNUO1xuXG5cdFx0XHR9XG5cblx0XHRcdG91dCA9IG91dHB1dC5sZW5ndGggKyAxO1xuXHRcdFx0YmlhcyA9IGFkYXB0KGkgLSBvbGRpLCBvdXQsIG9sZGkgPT0gMCk7XG5cblx0XHRcdC8vIGBpYCB3YXMgc3VwcG9zZWQgdG8gd3JhcCBhcm91bmQgZnJvbSBgb3V0YCB0byBgMGAsXG5cdFx0XHQvLyBpbmNyZW1lbnRpbmcgYG5gIGVhY2ggdGltZSwgc28gd2UnbGwgZml4IHRoYXQgbm93OlxuXHRcdFx0aWYgKGZsb29yKGkgLyBvdXQpID4gbWF4SW50IC0gbikge1xuXHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdH1cblxuXHRcdFx0biArPSBmbG9vcihpIC8gb3V0KTtcblx0XHRcdGkgJT0gb3V0O1xuXG5cdFx0XHQvLyBJbnNlcnQgYG5gIGF0IHBvc2l0aW9uIGBpYCBvZiB0aGUgb3V0cHV0XG5cdFx0XHRvdXRwdXQuc3BsaWNlKGkrKywgMCwgbik7XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gdWNzMmVuY29kZShvdXRwdXQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgc3RyaW5nIG9mIFVuaWNvZGUgc3ltYm9scyB0byBhIFB1bnljb2RlIHN0cmluZyBvZiBBU0NJSS1vbmx5XG5cdCAqIHN5bWJvbHMuXG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIHN0cmluZyBvZiBVbmljb2RlIHN5bWJvbHMuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSByZXN1bHRpbmcgUHVueWNvZGUgc3RyaW5nIG9mIEFTQ0lJLW9ubHkgc3ltYm9scy5cblx0ICovXG5cdGZ1bmN0aW9uIGVuY29kZShpbnB1dCkge1xuXHRcdHZhciBuLFxuXHRcdCAgICBkZWx0YSxcblx0XHQgICAgaGFuZGxlZENQQ291bnQsXG5cdFx0ICAgIGJhc2ljTGVuZ3RoLFxuXHRcdCAgICBiaWFzLFxuXHRcdCAgICBqLFxuXHRcdCAgICBtLFxuXHRcdCAgICBxLFxuXHRcdCAgICBrLFxuXHRcdCAgICB0LFxuXHRcdCAgICBjdXJyZW50VmFsdWUsXG5cdFx0ICAgIG91dHB1dCA9IFtdLFxuXHRcdCAgICAvKiogYGlucHV0TGVuZ3RoYCB3aWxsIGhvbGQgdGhlIG51bWJlciBvZiBjb2RlIHBvaW50cyBpbiBgaW5wdXRgLiAqL1xuXHRcdCAgICBpbnB1dExlbmd0aCxcblx0XHQgICAgLyoqIENhY2hlZCBjYWxjdWxhdGlvbiByZXN1bHRzICovXG5cdFx0ICAgIGhhbmRsZWRDUENvdW50UGx1c09uZSxcblx0XHQgICAgYmFzZU1pbnVzVCxcblx0XHQgICAgcU1pbnVzVDtcblxuXHRcdC8vIENvbnZlcnQgdGhlIGlucHV0IGluIFVDUy0yIHRvIFVuaWNvZGVcblx0XHRpbnB1dCA9IHVjczJkZWNvZGUoaW5wdXQpO1xuXG5cdFx0Ly8gQ2FjaGUgdGhlIGxlbmd0aFxuXHRcdGlucHV0TGVuZ3RoID0gaW5wdXQubGVuZ3RoO1xuXG5cdFx0Ly8gSW5pdGlhbGl6ZSB0aGUgc3RhdGVcblx0XHRuID0gaW5pdGlhbE47XG5cdFx0ZGVsdGEgPSAwO1xuXHRcdGJpYXMgPSBpbml0aWFsQmlhcztcblxuXHRcdC8vIEhhbmRsZSB0aGUgYmFzaWMgY29kZSBwb2ludHNcblx0XHRmb3IgKGogPSAwOyBqIDwgaW5wdXRMZW5ndGg7ICsraikge1xuXHRcdFx0Y3VycmVudFZhbHVlID0gaW5wdXRbal07XG5cdFx0XHRpZiAoY3VycmVudFZhbHVlIDwgMHg4MCkge1xuXHRcdFx0XHRvdXRwdXQucHVzaChzdHJpbmdGcm9tQ2hhckNvZGUoY3VycmVudFZhbHVlKSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aGFuZGxlZENQQ291bnQgPSBiYXNpY0xlbmd0aCA9IG91dHB1dC5sZW5ndGg7XG5cblx0XHQvLyBgaGFuZGxlZENQQ291bnRgIGlzIHRoZSBudW1iZXIgb2YgY29kZSBwb2ludHMgdGhhdCBoYXZlIGJlZW4gaGFuZGxlZDtcblx0XHQvLyBgYmFzaWNMZW5ndGhgIGlzIHRoZSBudW1iZXIgb2YgYmFzaWMgY29kZSBwb2ludHMuXG5cblx0XHQvLyBGaW5pc2ggdGhlIGJhc2ljIHN0cmluZyAtIGlmIGl0IGlzIG5vdCBlbXB0eSAtIHdpdGggYSBkZWxpbWl0ZXJcblx0XHRpZiAoYmFzaWNMZW5ndGgpIHtcblx0XHRcdG91dHB1dC5wdXNoKGRlbGltaXRlcik7XG5cdFx0fVxuXG5cdFx0Ly8gTWFpbiBlbmNvZGluZyBsb29wOlxuXHRcdHdoaWxlIChoYW5kbGVkQ1BDb3VudCA8IGlucHV0TGVuZ3RoKSB7XG5cblx0XHRcdC8vIEFsbCBub24tYmFzaWMgY29kZSBwb2ludHMgPCBuIGhhdmUgYmVlbiBoYW5kbGVkIGFscmVhZHkuIEZpbmQgdGhlIG5leHRcblx0XHRcdC8vIGxhcmdlciBvbmU6XG5cdFx0XHRmb3IgKG0gPSBtYXhJbnQsIGogPSAwOyBqIDwgaW5wdXRMZW5ndGg7ICsraikge1xuXHRcdFx0XHRjdXJyZW50VmFsdWUgPSBpbnB1dFtqXTtcblx0XHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA+PSBuICYmIGN1cnJlbnRWYWx1ZSA8IG0pIHtcblx0XHRcdFx0XHRtID0gY3VycmVudFZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIEluY3JlYXNlIGBkZWx0YWAgZW5vdWdoIHRvIGFkdmFuY2UgdGhlIGRlY29kZXIncyA8bixpPiBzdGF0ZSB0byA8bSwwPixcblx0XHRcdC8vIGJ1dCBndWFyZCBhZ2FpbnN0IG92ZXJmbG93XG5cdFx0XHRoYW5kbGVkQ1BDb3VudFBsdXNPbmUgPSBoYW5kbGVkQ1BDb3VudCArIDE7XG5cdFx0XHRpZiAobSAtIG4gPiBmbG9vcigobWF4SW50IC0gZGVsdGEpIC8gaGFuZGxlZENQQ291bnRQbHVzT25lKSkge1xuXHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdH1cblxuXHRcdFx0ZGVsdGEgKz0gKG0gLSBuKSAqIGhhbmRsZWRDUENvdW50UGx1c09uZTtcblx0XHRcdG4gPSBtO1xuXG5cdFx0XHRmb3IgKGogPSAwOyBqIDwgaW5wdXRMZW5ndGg7ICsraikge1xuXHRcdFx0XHRjdXJyZW50VmFsdWUgPSBpbnB1dFtqXTtcblxuXHRcdFx0XHRpZiAoY3VycmVudFZhbHVlIDwgbiAmJiArK2RlbHRhID4gbWF4SW50KSB7XG5cdFx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoY3VycmVudFZhbHVlID09IG4pIHtcblx0XHRcdFx0XHQvLyBSZXByZXNlbnQgZGVsdGEgYXMgYSBnZW5lcmFsaXplZCB2YXJpYWJsZS1sZW5ndGggaW50ZWdlclxuXHRcdFx0XHRcdGZvciAocSA9IGRlbHRhLCBrID0gYmFzZTsgLyogbm8gY29uZGl0aW9uICovOyBrICs9IGJhc2UpIHtcblx0XHRcdFx0XHRcdHQgPSBrIDw9IGJpYXMgPyB0TWluIDogKGsgPj0gYmlhcyArIHRNYXggPyB0TWF4IDogayAtIGJpYXMpO1xuXHRcdFx0XHRcdFx0aWYgKHEgPCB0KSB7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cU1pbnVzVCA9IHEgLSB0O1xuXHRcdFx0XHRcdFx0YmFzZU1pbnVzVCA9IGJhc2UgLSB0O1xuXHRcdFx0XHRcdFx0b3V0cHV0LnB1c2goXG5cdFx0XHRcdFx0XHRcdHN0cmluZ0Zyb21DaGFyQ29kZShkaWdpdFRvQmFzaWModCArIHFNaW51c1QgJSBiYXNlTWludXNULCAwKSlcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRxID0gZmxvb3IocU1pbnVzVCAvIGJhc2VNaW51c1QpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdG91dHB1dC5wdXNoKHN0cmluZ0Zyb21DaGFyQ29kZShkaWdpdFRvQmFzaWMocSwgMCkpKTtcblx0XHRcdFx0XHRiaWFzID0gYWRhcHQoZGVsdGEsIGhhbmRsZWRDUENvdW50UGx1c09uZSwgaGFuZGxlZENQQ291bnQgPT0gYmFzaWNMZW5ndGgpO1xuXHRcdFx0XHRcdGRlbHRhID0gMDtcblx0XHRcdFx0XHQrK2hhbmRsZWRDUENvdW50O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdCsrZGVsdGE7XG5cdFx0XHQrK247XG5cblx0XHR9XG5cdFx0cmV0dXJuIG91dHB1dC5qb2luKCcnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIFB1bnljb2RlIHN0cmluZyByZXByZXNlbnRpbmcgYSBkb21haW4gbmFtZSB0byBVbmljb2RlLiBPbmx5IHRoZVxuXHQgKiBQdW55Y29kZWQgcGFydHMgb2YgdGhlIGRvbWFpbiBuYW1lIHdpbGwgYmUgY29udmVydGVkLCBpLmUuIGl0IGRvZXNuJ3Rcblx0ICogbWF0dGVyIGlmIHlvdSBjYWxsIGl0IG9uIGEgc3RyaW5nIHRoYXQgaGFzIGFscmVhZHkgYmVlbiBjb252ZXJ0ZWQgdG9cblx0ICogVW5pY29kZS5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBkb21haW4gVGhlIFB1bnljb2RlIGRvbWFpbiBuYW1lIHRvIGNvbnZlcnQgdG8gVW5pY29kZS5cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIFVuaWNvZGUgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdpdmVuIFB1bnljb2RlXG5cdCAqIHN0cmluZy5cblx0ICovXG5cdGZ1bmN0aW9uIHRvVW5pY29kZShkb21haW4pIHtcblx0XHRyZXR1cm4gbWFwRG9tYWluKGRvbWFpbiwgZnVuY3Rpb24oc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gcmVnZXhQdW55Y29kZS50ZXN0KHN0cmluZylcblx0XHRcdFx0PyBkZWNvZGUoc3RyaW5nLnNsaWNlKDQpLnRvTG93ZXJDYXNlKCkpXG5cdFx0XHRcdDogc3RyaW5nO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgVW5pY29kZSBzdHJpbmcgcmVwcmVzZW50aW5nIGEgZG9tYWluIG5hbWUgdG8gUHVueWNvZGUuIE9ubHkgdGhlXG5cdCAqIG5vbi1BU0NJSSBwYXJ0cyBvZiB0aGUgZG9tYWluIG5hbWUgd2lsbCBiZSBjb252ZXJ0ZWQsIGkuZS4gaXQgZG9lc24ndFxuXHQgKiBtYXR0ZXIgaWYgeW91IGNhbGwgaXQgd2l0aCBhIGRvbWFpbiB0aGF0J3MgYWxyZWFkeSBpbiBBU0NJSS5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBkb21haW4gVGhlIGRvbWFpbiBuYW1lIHRvIGNvbnZlcnQsIGFzIGEgVW5pY29kZSBzdHJpbmcuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBQdW55Y29kZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2l2ZW4gZG9tYWluIG5hbWUuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b0FTQ0lJKGRvbWFpbikge1xuXHRcdHJldHVybiBtYXBEb21haW4oZG9tYWluLCBmdW5jdGlvbihzdHJpbmcpIHtcblx0XHRcdHJldHVybiByZWdleE5vbkFTQ0lJLnRlc3Qoc3RyaW5nKVxuXHRcdFx0XHQ/ICd4bi0tJyArIGVuY29kZShzdHJpbmcpXG5cdFx0XHRcdDogc3RyaW5nO1xuXHRcdH0pO1xuXHR9XG5cblx0LyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblx0LyoqIERlZmluZSB0aGUgcHVibGljIEFQSSAqL1xuXHRwdW55Y29kZSA9IHtcblx0XHQvKipcblx0XHQgKiBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGN1cnJlbnQgUHVueWNvZGUuanMgdmVyc2lvbiBudW1iZXIuXG5cdFx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdFx0ICogQHR5cGUgU3RyaW5nXG5cdFx0ICovXG5cdFx0J3ZlcnNpb24nOiAnMS4yLjMnLFxuXHRcdC8qKlxuXHRcdCAqIEFuIG9iamVjdCBvZiBtZXRob2RzIHRvIGNvbnZlcnQgZnJvbSBKYXZhU2NyaXB0J3MgaW50ZXJuYWwgY2hhcmFjdGVyXG5cdFx0ICogcmVwcmVzZW50YXRpb24gKFVDUy0yKSB0byBVbmljb2RlIGNvZGUgcG9pbnRzLCBhbmQgYmFjay5cblx0XHQgKiBAc2VlIDxodHRwOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWVuY29kaW5nPlxuXHRcdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHRcdCAqIEB0eXBlIE9iamVjdFxuXHRcdCAqL1xuXHRcdCd1Y3MyJzoge1xuXHRcdFx0J2RlY29kZSc6IHVjczJkZWNvZGUsXG5cdFx0XHQnZW5jb2RlJzogdWNzMmVuY29kZVxuXHRcdH0sXG5cdFx0J2RlY29kZSc6IGRlY29kZSxcblx0XHQnZW5jb2RlJzogZW5jb2RlLFxuXHRcdCd0b0FTQ0lJJzogdG9BU0NJSSxcblx0XHQndG9Vbmljb2RlJzogdG9Vbmljb2RlXG5cdH07XG5cblx0LyoqIEV4cG9zZSBgcHVueWNvZGVgICovXG5cdC8vIFNvbWUgQU1EIGJ1aWxkIG9wdGltaXplcnMsIGxpa2Ugci5qcywgY2hlY2sgZm9yIHNwZWNpZmljIGNvbmRpdGlvbiBwYXR0ZXJuc1xuXHQvLyBsaWtlIHRoZSBmb2xsb3dpbmc6XG5cdGlmIChcblx0XHR0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiZcblx0XHR0eXBlb2YgZGVmaW5lLmFtZCA9PSAnb2JqZWN0JyAmJlxuXHRcdGRlZmluZS5hbWRcblx0KSB7XG5cdFx0ZGVmaW5lKGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHB1bnljb2RlO1xuXHRcdH0pO1xuXHR9XHRlbHNlIGlmIChmcmVlRXhwb3J0cyAmJiAhZnJlZUV4cG9ydHMubm9kZVR5cGUpIHtcblx0XHRpZiAoZnJlZU1vZHVsZSkgeyAvLyBpbiBOb2RlLmpzIG9yIFJpbmdvSlMgdjAuOC4wK1xuXHRcdFx0ZnJlZU1vZHVsZS5leHBvcnRzID0gcHVueWNvZGU7XG5cdFx0fSBlbHNlIHsgLy8gaW4gTmFyd2hhbCBvciBSaW5nb0pTIHYwLjcuMC1cblx0XHRcdGZvciAoa2V5IGluIHB1bnljb2RlKSB7XG5cdFx0XHRcdHB1bnljb2RlLmhhc093blByb3BlcnR5KGtleSkgJiYgKGZyZWVFeHBvcnRzW2tleV0gPSBwdW55Y29kZVtrZXldKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7IC8vIGluIFJoaW5vIG9yIGEgd2ViIGJyb3dzZXJcblx0XHRyb290LnB1bnljb2RlID0gcHVueWNvZGU7XG5cdH1cblxufSh0aGlzKSk7XG4iLCJpbXBvcnQgKiBhcyBTZWFyY2hDbGllbnQgZnJvbSBcIi4uL2NsaWVudHMvU2VhcmNoQ2xpZW50XCI7XG5pbXBvcnQgKiBhcyBVUkxIZWxwZXIgZnJvbSBcIi4uL2hlbHBlcnMvVVJMSGVscGVyXCI7XG5pbXBvcnQge0ZpbHRlclZlcmlmaWNhdG9yfSBmcm9tIFwiLi4vaGVscGVycy9GaWx0ZXJWZXJpZmljYXRvclwiO1xuXG5mdW5jdGlvbiB1cGRhdGVUYWJsZSh0YWJsZVN0b3JlKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodGFibGVTdGF0ZU9iamVjdCkge1xuICAgIHRhYmxlU3RvcmUuc2V0Um93cyh0YWJsZVN0YXRlT2JqZWN0LnJlc3VsdHMpO1xuICAgIHRhYmxlU3RvcmUuc2V0Q3VycmVudFBhZ2UodGFibGVTdGF0ZU9iamVjdC5jdXJyZW50X3BhZ2UpO1xuICAgIHRhYmxlU3RvcmUuc2V0VG90YWxQYWdlcyh0YWJsZVN0YXRlT2JqZWN0LnRvdGFsX3BhZ2VzKTtcbiAgICB0YWJsZVN0b3JlLnNldFRhYmxlQ2FwdGlvbih0YWJsZVN0YXRlT2JqZWN0LnRhYmxlX2NhcHRpb24pO1xuICAgIHRhYmxlU3RvcmUuY2xlYXJTZWxlY3RlZFJvd3MoKTtcbiAgICB0YWJsZVN0b3JlLmVtaXRDaGFuZ2UoKTtcbiAgfTtcbn1cblxuZXhwb3J0IGNsYXNzIEZpbHRlckJhckFjdG9yIHtcbiAgY29uc3RydWN0b3IoZmlsdGVyQmFyU3RvcmUsIHRhYmxlU3RvcmUpIHtcbiAgICB0aGlzLmZpbHRlckJhclN0b3JlID0gZmlsdGVyQmFyU3RvcmU7XG4gICAgdGhpcy50YWJsZVN0b3JlID0gdGFibGVTdG9yZTtcbiAgfVxuXG4gIGVuYWJsZUZpbHRlcihmaWx0ZXJVaWQsIHZhbHVlKSB7XG4gICAgdGhpcy5maWx0ZXJCYXJTdG9yZS5lbmFibGVGaWx0ZXIoZmlsdGVyVWlkLCB2YWx1ZSk7XG4gIH1cblxuICBkaXNhYmxlRmlsdGVyKGZpbHRlclVpZCkge1xuICAgIHRoaXMuZmlsdGVyQmFyU3RvcmUuZGlzYWJsZUZpbHRlcihmaWx0ZXJVaWQpO1xuICB9XG5cbiAgZGlzYWJsZUFsbEZpbHRlcnMoKSB7XG4gICAgdGhpcy5maWx0ZXJCYXJTdG9yZS5kaXNhYmxlQWxsRmlsdGVycygpO1xuICAgIHRoaXMuZmlsdGVyQmFyU3RvcmUuZGlzYWJsZUFsbFF1aWNrRmlsdGVycygpO1xuICB9XG5cbiAgZGlzYWJsZUFsbEZpbHRlcnNBbmRBcHBseSgpIHtcbiAgICB0aGlzLmRpc2FibGVBbGxGaWx0ZXJzKCk7XG4gICAgdGhpcy5hcHBseUZpbHRlcnMoKTtcbiAgfVxuXG4gIHVwZGF0ZUZpbHRlcihmaWx0ZXJVaWQsIHByb3BLZXksIHByb3BWYWx1ZSkge1xuICAgIHRoaXMuZmlsdGVyQmFyU3RvcmUudXBkYXRlRmlsdGVyKGZpbHRlclVpZCwgcHJvcEtleSwgcHJvcFZhbHVlKTtcbiAgfVxuXG4gIGFwcGx5RmlsdGVycygpIHtcbiAgICB2YXIgdXJsID0gVVJMSGVscGVyLnVwZGF0ZVVybFNlYXJjaChcbiAgICAgICAgdGhpcy5maWx0ZXJCYXJTdG9yZS5nZXRTZWFyY2hVcmwoKSwgXCJxXCIsIHRoaXMuZmlsdGVyQmFyU3RvcmUuZ2V0UXVlcnkoKVxuICAgICkudG9TdHJpbmcoKTtcblxuICAgIHRoaXMudGFibGVTdG9yZS5zZXRVcmwodXJsKTtcbiAgICB0aGlzLnRhYmxlU3RvcmUuc2V0Q3VycmVudFBhZ2UoMSk7XG5cbiAgICB1cmwgPSB0aGlzLnRhYmxlU3RvcmUuZ2V0VXJsKCk7XG5cbiAgICBTZWFyY2hDbGllbnQuc2VhcmNoKHVybCwgdXBkYXRlVGFibGUodGhpcy50YWJsZVN0b3JlKSk7XG5cbiAgICBpZiAodGhpcy5maWx0ZXJCYXJTdG9yZS5wZXJzaXN0ZW50KSB7XG4gICAgICBVUkxIZWxwZXIudXBkYXRlQXBwbGljYXRpb25VcmxTdGF0ZSh1cmwpO1xuICAgIH1cbiAgfVxuXG4gIGFwcGx5UXVpY2tGaWx0ZXIoZmlsdGVyTmFtZSwgdmFsdWUsIHF1aWNrRmlsdGVyTmFtZSwgYmxvY2tOYW1lKSB7XG4gICAgbGV0IGZpbHRlciA9IHRoaXMuZmlsdGVyQmFyU3RvcmUuZ2V0RmlsdGVyKGZpbHRlck5hbWUpXG4gICAgaWYgKGZpbHRlci50eXBlID09PSAnbXVsdGlfc2VsZWN0Jykge1xuICAgICAgdmFsdWUgPSB2YWx1ZS5zcGxpdChcIixcIikubWFwKGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZy50cmltKCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5maWx0ZXJCYXJTdG9yZS5lbmFibGVRdWlja0ZpbHRlcihxdWlja0ZpbHRlck5hbWUsIGJsb2NrTmFtZSk7XG4gICAgdGhpcy5lbmFibGVGaWx0ZXIoZmlsdGVyTmFtZSwgdmFsdWUpO1xuICAgIHRoaXMuYXBwbHlGaWx0ZXJzKCk7XG4gIH1cblxuICBkaXNhYmxlQmxvY2tGaWx0ZXJzKGJsb2NrTmFtZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZmlsdGVyQmFyU3RvcmUgPSB0aGlzLmZpbHRlckJhclN0b3JlO1xuICAgIHZhciBidXR0b25zID0gZmlsdGVyQmFyU3RvcmUucXVpY2tGaWx0ZXJzW2Jsb2NrTmFtZV07XG4gICAgT2JqZWN0LmtleXMoYnV0dG9ucykubWFwKGZ1bmN0aW9uKGJ1dHRvbk5hbWUpIHtcbiAgICAgIHZhciBmaWx0ZXJzID0gZmlsdGVyQmFyU3RvcmUucXVpY2tGaWx0ZXJzW2Jsb2NrTmFtZV1bYnV0dG9uTmFtZV0uZmlsdGVycztcbiAgICAgIGlmICh0eXBlb2YgZmlsdGVycyA9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKGZpbHRlcnMpLm1hcChmdW5jdGlvbihmaWx0ZXJOYW1lKSB7XG4gICAgICAgICAgc2VsZi5kaXNhYmxlRmlsdGVyKGZpbHRlcnNbZmlsdGVyTmFtZV0uZmlsdGVyKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGV4cG9ydFJlc3VsdHMoKSB7XG4gICAgaWYgKHRoaXMuZXhwb3J0UGFnZUxpbWl0RXhjZWVkZWQoKSkge1xuICAgICAgYWxlcnQodGhpcy5maWx0ZXJCYXJTdG9yZS5nZXRFeHBvcnRQYWdlTGltaXRFeGNlZWRlZE1lc3NhZ2UoKSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmZpbHRlckJhclN0b3JlLnBlcnNpc3RlbnQpIHtcbiAgICAgIFVSTEhlbHBlci5yZWRpcmVjdFVybCh0aGlzLmV4cG9ydFVybCgpKTtcbiAgICB9XG4gIH1cblxuICBleHBvcnRQYWdlTGltaXRFeGNlZWRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5maWx0ZXJCYXJTdG9yZS5nZXRFeHBvcnRQYWdlTGltaXQoKSAhPT0gTmFOICYmIHRoaXMudGFibGVTdG9yZS5nZXRUb3RhbFBhZ2VzKCkgPiB0aGlzLmZpbHRlckJhclN0b3JlLmdldEV4cG9ydFBhZ2VMaW1pdCgpO1xuICB9XG5cbiAgZXhwb3J0VXJsKCkge1xuICAgIHJldHVybiBVUkxIZWxwZXIudXBkYXRlVXJsU2VhcmNoKHRoaXMuZmlsdGVyQmFyU3RvcmUuZ2V0RXhwb3J0UmVzdWx0c1VybCgpLCBcInFcIiwgdGhpcy5maWx0ZXJCYXJTdG9yZS5nZXRRdWVyeSgpKS50b1N0cmluZygpO1xuICB9XG5cbiAgbG9hZFNhdmVkU2VhcmNoKHNlYXJjaElkKSB7XG4gICAgdGhpcy5kaXNhYmxlQWxsRmlsdGVycygpO1xuXG4gICAgdmFyIHNhdmVkU2VhcmNoID0gdGhpcy5maWx0ZXJCYXJTdG9yZS5nZXRTYXZlZFNlYXJjaChzZWFyY2hJZCk7XG4gICAgdmFyIGZpbHRlcnMgPSBKU09OLnBhcnNlKHNhdmVkU2VhcmNoLmNvbmZpZ3VyYXRpb24pO1xuXG4gICAgaWYgKHRoaXMudmVyaWZ5U2F2ZWRGaWx0ZXJzKGZpbHRlcnMpKSB7XG4gICAgICBmb3IgKHZhciBmaWx0ZXIgaW4gZmlsdGVycykge1xuICAgICAgICB0aGlzLmVuYWJsZUZpbHRlcihmaWx0ZXIsIGZpbHRlcnNbZmlsdGVyXSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYXBwbHlGaWx0ZXJzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGVsZXRlU2F2ZWRTZWFyY2goc2VhcmNoSWQsICdPbmUgb2YgdGhlIGZpbHRlcnMgaW4gdGhpcyBzYXZlZCBzZWFyY2ggY2Fubm90IGJlIGFwcGxpZWQgYW55bW9yZS4gUmVtb3ZlIHNhdmVkIHNlYXJjaD8nKTtcbiAgICB9XG4gIH1cblxuICB2ZXJpZnlTYXZlZEZpbHRlcnMoZmlsdGVycykge1xuICAgIHZhciBmaWx0ZXJzQXJyID0gT2JqZWN0LmtleXMoZmlsdGVycylcbiAgICAgICAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHVpZDogbmFtZSB9XG4gICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgcmV0dXJuIG5ldyBGaWx0ZXJWZXJpZmljYXRvcih0aGlzLmZpbHRlckJhclN0b3JlLmdldEZpbHRlcnMoKSwgZmlsdGVyc0FycikudmVyaWZ5KCk7XG4gIH1cblxuICBzYXZlRmlsdGVycyhuYW1lKSB7XG4gICAgdmFyIHNhdmVkU2VhcmNoUGFja2V0ID0ge1xuICAgICAgc2F2ZWRfc2VhcmNoOiB7XG4gICAgICAgIGZpbHRlcnM6IHt9LFxuICAgICAgICBzZWFyY2hfdGl0bGU6IG5hbWVcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZm9yICh2YXIgW2ZpbHRlclVpZCwgZmlsdGVyXSBvZiB0aGlzLmZpbHRlckJhclN0b3JlLmVuYWJsZWRGaWx0ZXJzKCkpIHtcbiAgICAgIHNhdmVkU2VhcmNoUGFja2V0LnNhdmVkX3NlYXJjaC5maWx0ZXJzW2ZpbHRlclVpZF0gPSBmaWx0ZXIudmFsdWU7XG4gICAgfVxuICAgIGlmKE9iamVjdC5rZXlzKHNhdmVkU2VhcmNoUGFja2V0LnNhdmVkX3NlYXJjaC5maWx0ZXJzKS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBTZWFyY2hDbGllbnQuc2F2ZVNlYXJjaChcbiAgICAgIHRoaXMuZmlsdGVyQmFyU3RvcmUuZ2V0U2F2ZWRTZWFyY2hlc1VybCgpLFxuICAgICAgc2F2ZWRTZWFyY2hQYWNrZXQsXG4gICAgICB0aGlzLnJlbG9hZFNhdmVkU2VhcmNoZXMuYmluZCh0aGlzKVxuICAgICk7XG5cbiAgICB0aGlzLmFwcGx5RmlsdGVycygpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZGVsZXRlU2F2ZWRTZWFyY2goc2VhcmNoSWQsIGNvbmZpcm1hdGlvbk1lc3NhZ2UpIHtcbiAgICB2YXIgc2F2ZWRTZWFyY2ggPSB0aGlzLmZpbHRlckJhclN0b3JlLmdldFNhdmVkU2VhcmNoKHNlYXJjaElkKTtcblxuICAgIGlmICghc2F2ZWRTZWFyY2gudXJsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYoY29uZmlybWF0aW9uTWVzc2FnZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25maXJtYXRpb25NZXNzYWdlID0gJ0FyZSB5b3Ugc3VyZSByZW1vdmUgc2F2ZWQgc2VhcmNoIFwiJyArIHNhdmVkU2VhcmNoLm5hbWUgKyAnXCI/JztcbiAgICB9XG5cbiAgICB2YXIgY29uZmlybWF0aW9uID0gY29uZmlybShjb25maXJtYXRpb25NZXNzYWdlKTtcblxuICAgIGlmIChjb25maXJtYXRpb24pIHtcbiAgICAgIFNlYXJjaENsaWVudC5kZWxldGVTZWFyY2goXG4gICAgICAgIHNhdmVkU2VhcmNoLnVybCxcbiAgICAgICAgdGhpcy5yZWxvYWRTYXZlZFNlYXJjaGVzLmJpbmQodGhpcylcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcmVsb2FkU2F2ZWRTZWFyY2hlcygpIHtcbiAgICBTZWFyY2hDbGllbnQuZ2V0U2F2ZWRTZWFyY2hlcyhcbiAgICAgIHRoaXMuZmlsdGVyQmFyU3RvcmUuZ2V0U2F2ZWRTZWFyY2hlc1VybCgpLFxuICAgICAgdGhpcy5maWx0ZXJCYXJTdG9yZS5zZXRTYXZlZFNlYXJjaGVzLmJpbmQodGhpcy5maWx0ZXJCYXJTdG9yZSlcbiAgICApO1xuICB9XG59XG4iLCJpbXBvcnQgKiBhcyBTZWFyY2hDbGllbnQgZnJvbSBcIi4uL2NsaWVudHMvU2VhcmNoQ2xpZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBUYWJsZUFjdG9yIHtcbiAgY29uc3RydWN0b3IoZmlsdGVyQmFyU3RvcmUsIHRhYmxlU3RvcmUpIHtcbiAgICB0aGlzLmZpbHRlckJhclN0b3JlID0gZmlsdGVyQmFyU3RvcmU7XG4gICAgdGhpcy50YWJsZVN0b3JlID0gdGFibGVTdG9yZTtcbiAgfVxuXG4gIGZldGNoRGF0YShwYWdlKSB7XG4gICAgaWYgKHBhZ2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy50YWJsZVN0b3JlLnNldEN1cnJlbnRQYWdlKHBhZ2UpO1xuICAgIH1cblxuICAgIHZhciB1cmwgPSB0aGlzLnRhYmxlU3RvcmUuZ2V0VXJsKCk7XG4gICAgU2VhcmNoQ2xpZW50LnNlYXJjaCh1cmwsIHRoaXMudGFibGVTdG9yZS51cGRhdGVUYWJsZS5iaW5kKHRoaXMudGFibGVTdG9yZSkpO1xuXG4gICAgaWYgKHRoaXMuZmlsdGVyQmFyU3RvcmUucGVyc2lzdGVudCkge1xuICAgICAgaGlzdG9yeS5wdXNoU3RhdGUoe30sIFwiXCIsIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyB1cmwpO1xuICAgICAgbG9jYWxTdG9yYWdlW3dpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC8vZywgXCJcIildID0gdXJsLnJlbW92ZVNlYXJjaChcInBhZ2VcIikuc2VhcmNoKCk7XG4gICAgfVxuICB9XG59XG4iLCJ2YXIgdXJpID0gcmVxdWlyZShcIlVSSWpzXCIpO1xuXG5pbXBvcnQge0ZpbHRlcmFibGVUYWJsZX0gZnJvbSBcIi4vY29tcG9uZW50cy9GaWx0ZXJhYmxlVGFibGUucmVhY3RcIjtcbmltcG9ydCB7RmlsdGVyVmVyaWZpY2F0b3J9IGZyb20gXCIuL2hlbHBlcnMvRmlsdGVyVmVyaWZpY2F0b3JcIjtcblxuZnVuY3Rpb24gd2Fsayhub2RlKSB7XG4gIHZhciBub2RlT2JqZWN0ID0ge307XG5cbiAgaWYgKG5vZGUubm9kZU5hbWUgPT09IFwiRElWXCIgfHwgbm9kZS5ub2RlTmFtZSA9PT0gXCJETFwiKSB7XG4gICAgJC5lYWNoKCQobm9kZSkuY2hpbGRyZW4oKSwgZnVuY3Rpb24oaW5kZXgsIGNoaWxkTm9kZSkge1xuICAgICAgbm9kZU9iamVjdFskLmNhbWVsQ2FzZShjaGlsZE5vZGUuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikpXSA9IHdhbGsoY2hpbGROb2RlKTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmKG5vZGUubm9kZU5hbWUgPT09IFwiRFRcIikge1xuICAgIG5vZGVPYmplY3QgPSBub2RlLmdldEF0dHJpYnV0ZShcImRhdGEtdmFsdWVcIik7XG4gICAgaWYobm9kZU9iamVjdCA9PT0gbnVsbCkge1xuICAgICAgbm9kZU9iamVjdCA9IHsgZnJvbTogbm9kZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXZhbHVlLWZyb21cIiksIHRvOiBub2RlLmdldEF0dHJpYnV0ZShcImRhdGEtdmFsdWUtdG9cIikgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBcIk1hbGZvcm1lZCBodG1sIGNvbmZpZ3VyYXRpb25cIjtcbiAgfVxuXG4gIHJldHVybiBub2RlT2JqZWN0O1xufVxuXG5mdW5jdGlvbiBzZXR1cENvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbikge1xuICB2YXIgdXJsID0gdXJpKHdpbmRvdy5sb2NhdGlvbiksXG4gICAgICBzZWFyY2hPYmplY3QgPSB1cmwuc2VhcmNoKHRydWUpLFxuICAgICAgc3RvcmFnZUtleSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC8vZywgXCJcIik7XG5cbiAgaWYgKE9iamVjdC5rZXlzKHNlYXJjaE9iamVjdCkubGVuZ3RoID09PSAwICYmIGxvY2FsU3RvcmFnZVtzdG9yYWdlS2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaGlzdG9yeS5wdXNoU3RhdGUoe30sIFwiXCIsIGxvY2FsU3RvcmFnZVtzdG9yYWdlS2V5XSk7XG4gICAgdXJsID0gdXJpKHdpbmRvdy5sb2NhdGlvbikucmVtb3ZlU2VhcmNoKFwicGFnZVwiKTtcbiAgfVxuXG4gIHZhciB2ZXJpZmllZEZpbHRlcnMgPSBuZXcgRmlsdGVyVmVyaWZpY2F0b3IoY29uZmlndXJhdGlvbi5maWx0ZXJCYXJDb25maWd1cmF0aW9uLmZpbHRlcnMpLnZlcmlmeSgpO1xuXG4gIGlmICghdmVyaWZpZWRGaWx0ZXJzIHx8ICF1cmwuaGFzU2VhcmNoKFwicVwiKSkge1xuICAgIHVybC5zZXRTZWFyY2goXCJxXCIsIFwiXCIpO1xuICB9XG5cbiAgaWYgKCF1cmwuaGFzU2VhcmNoKFwicGFnZVwiKSkge1xuICAgIHVybC5hZGRTZWFyY2goXCJwYWdlXCIsIDEpO1xuICB9XG5cbiAgY29uZmlndXJhdGlvbi50YWJsZUNvbmZpZ3VyYXRpb24uZGF0YVVybCA9IHVybC5wYXRobmFtZSgpICsgdXJsLnNlYXJjaCgpO1xuICBjb25maWd1cmF0aW9uLnRhYmxlQ29uZmlndXJhdGlvbi5wYWdlID0gTnVtYmVyKHVybC5xdWVyeSh0cnVlKS5wYWdlKTtcblxuICBpZiAodXJsLnF1ZXJ5KHRydWUpLnEgIT09IFwiXCIpIHtcbiAgICBmb3IgKHZhciBmaWx0ZXIgb2YgSlNPTi5wYXJzZSh1cmwucXVlcnkodHJ1ZSkucSkpIHtcbiAgICAgIHZhciBjb25maWdGaWx0ZXIgPSBjb25maWd1cmF0aW9uLmZpbHRlckJhckNvbmZpZ3VyYXRpb24uZmlsdGVyc1tmaWx0ZXIudWlkXTtcblxuICAgICAgaWYgKGNvbmZpZ0ZpbHRlcikge1xuICAgICAgICBjb25maWdGaWx0ZXIuZW5hYmxlZCA9IHRydWU7XG4gICAgICAgIGNvbmZpZ0ZpbHRlci52YWx1ZSA9IGZpbHRlci52YWx1ZTtcblxuICAgICAgICBpZiAoZmlsdGVyLm9wZXJhdG9yKSB7XG4gICAgICAgICAgY29uZmlnRmlsdGVyLm9wZXJhdG9yID0gZmlsdGVyLm9wZXJhdG9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKGNvbmZpZ3VyYXRpb24uYmF0Y2hBY3Rpb25zQ29uZmlndXJhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgY29uZmlndXJhdGlvbi5iYXRjaEFjdGlvbnNDb25maWd1cmF0aW9uID0geyBhY3Rpb25zOiBbXSB9O1xuICAgIGNvbmZpZ3VyYXRpb24udGFibGVDb25maWd1cmF0aW9uLnNlbGVjdGFibGUgPSB1bmRlZmluZWQ7XG4gIH1cbiAgZWxzZSB7XG4gICAgY29uZmlndXJhdGlvbi50YWJsZUNvbmZpZ3VyYXRpb24uc2VsZWN0YWJsZSA9IGNvbmZpZ3VyYXRpb24uYmF0Y2hBY3Rpb25zQ29uZmlndXJhdGlvbi5zZWxlY3RhYmxlO1xuICB9XG5cbiAgcmV0dXJuIGNvbmZpZ3VyYXRpb247XG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKCl7XG4gIHZhciBjb25maWd1cmF0aW9uID0ge30sXG4gICAgICBmaWx0ZXJhYmxlVGFibGVOb2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInJlYWN0LWZpbHRlcmFibGUtdGFibGVcIilbMF07XG5cbiAgY29uZmlndXJhdGlvbiA9IHdhbGsoZmlsdGVyYWJsZVRhYmxlTm9kZSk7XG4gIGNvbmZpZ3VyYXRpb24gPSBzZXR1cENvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbik7XG5cbiAgUmVhY3QucmVuZGVyKFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBGaWx0ZXJhYmxlVGFibGUsXG4gICAgICB7XG4gICAgICAgIGZpbHRlckJhckNvbmZpZ3VyYXRpb246IGNvbmZpZ3VyYXRpb24uZmlsdGVyQmFyQ29uZmlndXJhdGlvbixcbiAgICAgICAgdGFibGVDb25maWd1cmF0aW9uOiBjb25maWd1cmF0aW9uLnRhYmxlQ29uZmlndXJhdGlvbixcbiAgICAgICAgYmF0Y2hBY3Rpb25zQ29uZmlndXJhdGlvbjogY29uZmlndXJhdGlvbi5iYXRjaEFjdGlvbnNDb25maWd1cmF0aW9uXG4gICAgICB9XG4gICAgKSxcbiAgICBmaWx0ZXJhYmxlVGFibGVOb2RlXG4gICk7XG59KTtcbiIsImV4cG9ydCBmdW5jdGlvbiBzZWFyY2godXJsLCBzdWNjZXNzKSB7XG4gICQuYWpheCh7XG4gICAgdXJsOiB1cmwsXG4gICAgdHlwZTogXCJHRVRcIixcbiAgICBjYWNoZTogZmFsc2UsXG4gICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHN1Y2Nlc3MoZGF0YSk7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVTZWFyY2godXJsLCBwYXlsb2FkLCBzdWNjZXNzKSB7XG4gICQuYWpheCh7XG4gICAgdXJsOiB1cmwsXG4gICAgdHlwZTogXCJQT1NUXCIsXG4gICAgZGF0YTogcGF5bG9hZCxcbiAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgc3VjY2VzczogZnVuY3Rpb24oKSB7XG4gICAgICBzdWNjZXNzKCk7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNhdmVkU2VhcmNoZXModXJsLCBzdWNjZXNzKSB7XG4gICQuYWpheCh7XG4gICAgdXJsOiB1cmwsXG4gICAgdHlwZTogXCJHRVRcIixcbiAgICBjYWNoZTogZmFsc2UsXG4gICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHN1Y2Nlc3MoZGF0YSk7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZVNlYXJjaCh1cmwsIHN1Y2Nlc3MpIHtcbiAgJC5hamF4KHtcbiAgICB1cmw6IHVybCxcbiAgICB0eXBlOiBcIkRFTEVURVwiLFxuICAgIGNhY2hlOiBmYWxzZSxcbiAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgc3VjY2VzczogZnVuY3Rpb24oKSB7XG4gICAgICBzdWNjZXNzKCk7XG4gICAgfVxuICB9KTtcbn1cbiIsImV4cG9ydCBjbGFzcyBBcHBseUZpbHRlcnNCdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgfVxuXG4gIG9uQ2xpY2soKSB7XG4gICAgdGhpcy5jb250ZXh0LmZpbHRlckJhckFjdG9yLmFwcGx5RmlsdGVycygpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiIG9uQ2xpY2s9e3RoaXMub25DbGljay5iaW5kKHRoaXMpfT5cbiAgICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uLXRpY2tcIiAvPlxuICAgICAgICBBcHBseVxuICAgICAgPC9idXR0b24+XG4gICAgKTtcbiAgfVxufVxuXG5BcHBseUZpbHRlcnNCdXR0b24uY29udGV4dFR5cGVzID0ge1xuICBmaWx0ZXJCYXJBY3RvcjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuIiwiaW1wb3J0IHtCYXRjaEFjdGlvbnNMaXN0SXRlbX0gZnJvbSBcIi4vQmF0Y2hBY3Rpb25zTGlzdEl0ZW0ucmVhY3RcIjtcbmltcG9ydCAqIGFzIFVSTEhlbHBlciBmcm9tIFwiLi4vLi4vLi4vaGVscGVycy9VUkxIZWxwZXJcIjtcbmltcG9ydCAqIGFzIE1vZGFsSGVscGVyIGZyb20gXCIuLi8uLi8uLi9oZWxwZXJzL01vZGFsSGVscGVyXCI7XG5cbmV4cG9ydCBjbGFzcyBCYXRjaEFjdGlvbnNMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gIH1cblxuICB1cGRhdGVCYXRjaEZvcm1GaWVsZHMoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmICh0aGlzLmNvbnRleHQudGFibGVTdG9yZS5nZXRTZWxlY3RlZFJvd3MoKS5sZW5ndGggPiAwKSB7XG4gICAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IGV2ZW50LnRhcmdldC5ocmVmLFxuICAgICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgICAgZGF0YTogeyAnYmF0Y2hfaWRzJzogdGhpcy5jb250ZXh0LnRhYmxlU3RvcmUuZ2V0U2VsZWN0ZWRSb3dzKCkgfSxcbiAgICAgICAgZGF0YVR5cGU6IFwiaHRtbFwiLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgTW9kYWxIZWxwZXIuZGlzcGxheU1vZGFsRm9yRGF0YShkYXRhKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBhbGVydCgnTm8gcm93cyBzZWxlY3RlZC4gUGxlYXNlIHNlbGVjdCByb3dzIGJlZm9yZSBydW5uaW5nIGJ1bGsgYWN0aW9ucy4nKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVCYXRjaEZvcm1GaWVsZHNTZWxlY3RBbGwoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmICh0aGlzLmNvbnRleHQudGFibGVTdG9yZS5nZXRTZWxlY3RlZFJvd3MoKS5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnVwZGF0ZUJhdGNoRm9ybUZpZWxkcyhldmVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQuYWpheCh7XG4gICAgICAgIHVybDogVVJMSGVscGVyLnVwZGF0ZVVybFNlYXJjaChcbiAgICAgICAgICBldmVudC50YXJnZXQuaHJlZiwgXCJxXCIsIHRoaXMuY29udGV4dC5maWx0ZXJCYXJTdG9yZS5nZXRRdWVyeSgpXG4gICAgICAgICkudG9TdHJpbmcoKSxcbiAgICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICBNb2RhbEhlbHBlci5kaXNwbGF5TW9kYWxGb3JEYXRhKGRhdGEpO1xuICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGJhdGNoQWN0aW9uc0xpc3RJdGVtcyhiYXRjaEFjdGlvbnMpIHtcbiAgICByZXR1cm4oXG4gICAgICBPYmplY3Qua2V5cyhiYXRjaEFjdGlvbnMpLm1hcChmdW5jdGlvbihiYXRjaEFjdGlvbk5hbWUsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPEJhdGNoQWN0aW9uc0xpc3RJdGVtXG4gICAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgICAgbGFiZWw9e2JhdGNoQWN0aW9uc1tiYXRjaEFjdGlvbk5hbWVdLmxhYmVsfVxuICAgICAgICAgICAgdXJsPXtiYXRjaEFjdGlvbnNbYmF0Y2hBY3Rpb25OYW1lXS51cmx9XG4gICAgICAgICAgICBvbkNsaWNrQWN0aW9uPXtiYXRjaEFjdGlvbnNbYmF0Y2hBY3Rpb25OYW1lXS5hbGxvd1NlbGVjdEFsbCA/IHRoaXMudXBkYXRlQmF0Y2hGb3JtRmllbGRzU2VsZWN0QWxsLmJpbmQodGhpcykgOiB0aGlzLnVwZGF0ZUJhdGNoRm9ybUZpZWxkcy5iaW5kKHRoaXMpfVxuICAgICAgICAgIC8+XG4gICAgICAgICk7XG4gICAgICB9LCB0aGlzKVxuICAgICk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IGJ1dHRvbkNsYXNzID0gXCJidG4gYnRuLWRlZmF1bHQgZHJvcGRvd24tdG9nZ2xlXCI7XG4gICAgbGV0IGJhdGNoQWN0aW9ucyA9IHRoaXMuY29udGV4dC5iYXRjaEFjdGlvbnNTdG9yZS5nZXRBY3Rpb25zKCk7XG5cbiAgICBpZiAoYmF0Y2hBY3Rpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgYnV0dG9uQ2xhc3MgKz0gXCIgZGlzYWJsZWRcIjtcbiAgICB9XG5cbiAgICBsZXQgYmF0Y2hBY3Rpb25JdGVtcyA9IHRoaXMuYmF0Y2hBY3Rpb25zTGlzdEl0ZW1zKGJhdGNoQWN0aW9ucyk7XG5cbiAgICByZXR1cm4oXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cFwiPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgYXJpYS1leHBhbmRlZD1cImZhbHNlXCJcbiAgICAgICAgICBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiXG4gICAgICAgICAgY2xhc3NOYW1lPXtidXR0b25DbGFzc31cbiAgICAgICAgICBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJcbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgPlxuICAgICAgICAgIEJ1bGsgQWN0aW9uc1xuICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImljb24gaWNvbi1jaGV2cm9uLWRvd25cIiAvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPHVsIGNsYXNzTmFtZT1cImRyb3Bkb3duLW1lbnVcIiByb2xlPVwibWVudVwiPlxuICAgICAgICAgIHtiYXRjaEFjdGlvbkl0ZW1zfVxuICAgICAgICA8L3VsPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5CYXRjaEFjdGlvbnNMaXN0LmNvbnRleHRUeXBlcyA9IHtcbiAgZmlsdGVyQmFyQWN0b3I6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgZmlsdGVyQmFyU3RvcmU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgdGFibGVTdG9yZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBiYXRjaEFjdGlvbnNTdG9yZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuIiwiZXhwb3J0IGNsYXNzIEJhdGNoQWN0aW9uc0xpc3RJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4oXG4gICAgICA8bGk+XG4gICAgICAgIDxhXG4gICAgICAgICAgY2xhc3NOYW1lPVwiZHluYW1pYy10ZXh0LWZpbHRlclwiXG4gICAgICAgICAgaHJlZj17dGhpcy5wcm9wcy51cmx9XG4gICAgICAgICAgb25DbGljaz17dGhpcy5wcm9wcy5vbkNsaWNrQWN0aW9ufVxuICAgICAgICA+XG4gICAgICAgICAge3RoaXMucHJvcHMubGFiZWx9XG4gICAgICAgIDwvYT5cbiAgICAgIDwvbGk+XG4gICAgKTtcbiAgfVxufVxuXG5CYXRjaEFjdGlvbnNMaXN0SXRlbS5wcm9wVHlwZXMgPSB7XG4gIGxhYmVsOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHVybDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkXG59O1xuIiwiZXhwb3J0IGNsYXNzIENsZWFyRmlsdGVyc0J1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG5cbiAgb25DbGljaygpIHtcbiAgICB0aGlzLmNvbnRleHQuZmlsdGVyQmFyQWN0b3IuZGlzYWJsZUFsbEZpbHRlcnNBbmRBcHBseSgpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4td2FybmluZ1wiIG9uQ2xpY2s9e3RoaXMub25DbGljay5iaW5kKHRoaXMpfT5cbiAgICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uLWRlbGV0ZVwiIC8+XG4gICAgICAgIENsZWFyXG4gICAgICA8L2J1dHRvbj5cbiAgICApO1xuICB9XG59XG5cbkNsZWFyRmlsdGVyc0J1dHRvbi5jb250ZXh0VHlwZXMgPSB7XG4gIGZpbHRlckJhckFjdG9yOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG4iLCJpbXBvcnQgKiBhcyBNb2RhbEhlbHBlciBmcm9tIFwiLi4vLi4vaGVscGVycy9Nb2RhbEhlbHBlclwiO1xuXG5leHBvcnQgY2xhc3MgQ29uZmlndXJhdGlvbkJ1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG5cbiAgb25DbGljaygpIHtcbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiB0aGlzLmNvbnRleHQuZmlsdGVyQmFyU3RvcmUuZ2V0Q29uZmlndXJhdGlvblVybCgpLFxuICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgIGRhdGFUeXBlOiBcImh0bWxcIixcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgTW9kYWxIZWxwZXIuZGlzcGxheU1vZGFsRm9yRGF0YShkYXRhKTtcbiAgICAgIH0uYmluZCh0aGlzKVxuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIG9uQ2xpY2s9e3RoaXMub25DbGljay5iaW5kKHRoaXMpfT5cbiAgICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uLWVkaXQtb3V0bGluZVwiIC8+XG4gICAgICAgIENvbHVtbnNcbiAgICAgIDwvYnV0dG9uPlxuICAgICk7XG4gIH1cbn1cblxuQ29uZmlndXJhdGlvbkJ1dHRvbi5jb250ZXh0VHlwZXMgPSB7XG4gIGZpbHRlckJhclN0b3JlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG4iLCJleHBvcnQgY2xhc3MgRXhwb3J0UmVzdWx0c0J1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG5cbiAgb25DbGljaygpIHtcbiAgICB0aGlzLmNvbnRleHQuZmlsdGVyQmFyQWN0b3IuZXhwb3J0UmVzdWx0cygpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIG9uQ2xpY2s9e3RoaXMub25DbGljay5iaW5kKHRoaXMpfT5cbiAgICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uLWRvd25sb2FkXCIgLz5cbiAgICAgICAgRXhwb3J0IENTVlxuICAgICAgPC9idXR0b24+XG4gICAgKTtcbiAgfVxufVxuXG5FeHBvcnRSZXN1bHRzQnV0dG9uLmNvbnRleHRUeXBlcyA9IHtcbiAgZmlsdGVyQmFyQWN0b3I6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcbiIsImltcG9ydCB7RmlsdGVyTGlzdH0gZnJvbSBcIi4vRmlsdGVyTGlzdC9GaWx0ZXJMaXN0LnJlYWN0XCI7XG5pbXBvcnQge0ZpbHRlckRpc3BsYXl9IGZyb20gXCIuL0ZpbHRlckRpc3BsYXkvRmlsdGVyRGlzcGxheS5yZWFjdFwiO1xuaW1wb3J0IHtBcHBseUZpbHRlcnNCdXR0b259IGZyb20gXCIuL0FwcGx5RmlsdGVyc0J1dHRvbi5yZWFjdFwiO1xuaW1wb3J0IHtDb25maWd1cmF0aW9uQnV0dG9ufSBmcm9tIFwiLi9Db25maWd1cmF0aW9uQnV0dG9uLnJlYWN0XCI7XG5pbXBvcnQge0V4cG9ydFJlc3VsdHNCdXR0b259IGZyb20gXCIuL0V4cG9ydFJlc3VsdHNCdXR0b24ucmVhY3RcIjtcbmltcG9ydCB7Q2xlYXJGaWx0ZXJzQnV0dG9ufSBmcm9tIFwiLi9DbGVhckZpbHRlcnNCdXR0b24ucmVhY3RcIjtcbmltcG9ydCB7U2F2ZUZpbHRlcnNCdXR0b259IGZyb20gXCIuL1NhdmVGaWx0ZXJzQnV0dG9uLnJlYWN0XCI7XG5pbXBvcnQge1NhdmVkU2VhcmNoZXNMaXN0fSBmcm9tIFwiLi9TYXZlZFNlYXJjaGVzTGlzdC9TYXZlZFNlYXJjaGVzTGlzdC5yZWFjdFwiO1xuaW1wb3J0IHtCYXRjaEFjdGlvbnNMaXN0fSBmcm9tIFwiLi9CYXRjaEFjdGlvbnNMaXN0L0JhdGNoQWN0aW9uc0xpc3QucmVhY3RcIjtcblxuZXhwb3J0IGNsYXNzIEZpbHRlckJhciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIG1hcmdpbi1ib3R0b20tc21cIj5cbiAgICAgICAgICAgIDxGaWx0ZXJMaXN0XG4gICAgICAgICAgICAgIGRpc2FibGVkRmlsdGVycz17dGhpcy5jb250ZXh0LmZpbHRlckJhclN0b3JlLmdldERpc2FibGVkKCl9XG4gICAgICAgICAgICAvPlxuXG4gICAgICAgICAgICA8QXBwbHlGaWx0ZXJzQnV0dG9uXG4gICAgICAgICAgICAgIGZpbHRlckJhckFjdG9yPXt0aGlzLmNvbnRleHQuZmlsdGVyQmFyQWN0b3J9XG4gICAgICAgICAgICAvPlxuXG4gICAgICAgICAgICA8Q2xlYXJGaWx0ZXJzQnV0dG9uXG4gICAgICAgICAgICAgIGZpbHRlckJhckFjdG9yPXt0aGlzLmNvbnRleHQuZmlsdGVyQmFyQWN0b3J9XG4gICAgICAgICAgICAvPlxuXG4gICAgICAgICAgICA8U2F2ZUZpbHRlcnNCdXR0b25cbiAgICAgICAgICAgICAgZmlsdGVyQmFyQWN0b3I9e3RoaXMuY29udGV4dC5maWx0ZXJCYXJBY3Rvcn1cbiAgICAgICAgICAgIC8+XG5cbiAgICAgICAgICAgIDxTYXZlZFNlYXJjaGVzTGlzdFxuICAgICAgICAgICAgICBmaWx0ZXJCYXJBY3Rvcj17dGhpcy5jb250ZXh0LmZpbHRlckJhckFjdG9yfVxuICAgICAgICAgICAgICBmaWx0ZXJCYXJTdG9yZT17dGhpcy5jb250ZXh0LmZpbHRlckJhclN0b3JlfVxuICAgICAgICAgICAgLz5cblxuICAgICAgICAgICAge3RoaXMuY29udGV4dC5maWx0ZXJCYXJTdG9yZS5pc0NvbmZpZ3VyYWJsZSgpICYmXG4gICAgICAgICAgICAgIDxDb25maWd1cmF0aW9uQnV0dG9uXG4gICAgICAgICAgICAgICAgZmlsdGVyQmFyU3RvcmU9e3RoaXMuY29udGV4dC5maWx0ZXJCYXJTdG9yZX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAge3RoaXMuY29udGV4dC5maWx0ZXJCYXJTdG9yZS5pc0V4cG9ydGFibGUoKSAmJlxuICAgICAgICAgICAgICA8RXhwb3J0UmVzdWx0c0J1dHRvblxuICAgICAgICAgICAgICAgIGZpbHRlckJhckFjdG9yPXt0aGlzLmNvbnRleHQuZmlsdGVyQmFyQWN0b3J9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIDxCYXRjaEFjdGlvbnNMaXN0IC8+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8RmlsdGVyRGlzcGxheVxuICAgICAgICAgICAgZmlsdGVyQmFyQWN0b3I9e3RoaXMuY29udGV4dC5maWx0ZXJCYXJBY3Rvcn1cbiAgICAgICAgICAgIGZpbHRlckJhclN0b3JlPXt0aGlzLmNvbnRleHQuZmlsdGVyQmFyU3RvcmV9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbkZpbHRlckJhci5jb250ZXh0VHlwZXMgPSB7XG4gIGZpbHRlckJhckFjdG9yOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICBmaWx0ZXJCYXJTdG9yZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgdGFibGVTdG9yZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgYmF0Y2hBY3Rpb25zU3RvcmU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3Rcbn07XG4iLCJpbXBvcnQge0ZpbHRlcklucHV0fSBmcm9tIFwiLi9GaWx0ZXJJbnB1dC5yZWFjdFwiO1xuXG5leHBvcnQgY2xhc3MgRmlsdGVyRGlzcGxheSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHsgZmlsdGVyczogcHJvcHMuZW5hYmxlZEZpbHRlcnMgfTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHF1aWNrRmlsdGVycyA9IHRoaXMuY29udGV4dC5maWx0ZXJCYXJTdG9yZS5xdWlja0ZpbHRlcnM7XG4gICAgT2JqZWN0LmtleXModGhpcy5nZXRTdGF0ZUZyb21TdG9yZXMoKS5maWx0ZXJzKS5tYXAoZnVuY3Rpb24oZmlsdGVyVWlkKSB7XG4gICAgICBPYmplY3Qua2V5cyhxdWlja0ZpbHRlcnMpLm1hcChmdW5jdGlvbihibG9ja05hbWUpIHtcbiAgICAgICAgT2JqZWN0LmtleXMocXVpY2tGaWx0ZXJzW2Jsb2NrTmFtZV0pLm1hcChmdW5jdGlvbihmaWx0ZXJOYW1lKSB7XG4gICAgICAgICAgdmFyIHF1aWNrRmlsdGVyID0gcXVpY2tGaWx0ZXJzW2Jsb2NrTmFtZV1bZmlsdGVyTmFtZV07XG4gICAgICAgICAgaWYgKHF1aWNrRmlsdGVyLmZpbHRlcnMgJiYgcXVpY2tGaWx0ZXIuZmlsdGVyc1tmaWx0ZXJVaWRdKSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5nZXRTdGF0ZUZyb21TdG9yZXMoKS5maWx0ZXJzW2ZpbHRlclVpZF0udHlwZSA9PSAnbXVsdGlfc2VsZWN0Jykge1xuICAgICAgICAgICAgICBpZiAoc2VsZi5nZXRTdGF0ZUZyb21TdG9yZXMoKS5maWx0ZXJzW2ZpbHRlclVpZF0udmFsdWUuam9pbihcIixcIikgPT09IHF1aWNrRmlsdGVyLmZpbHRlcnNbZmlsdGVyVWlkXS52YWx1ZSlcbiAgICAgICAgICAgICAgICBxdWlja0ZpbHRlci5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKHNlbGYuZ2V0U3RhdGVGcm9tU3RvcmVzKCkuZmlsdGVyc1tmaWx0ZXJVaWRdLnZhbHVlID09PSAgcXVpY2tGaWx0ZXIuZmlsdGVyc1tmaWx0ZXJVaWRdLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcXVpY2tGaWx0ZXIuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICB0aGlzLmNvbnRleHQuZmlsdGVyQmFyU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5vbkNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIG9uQ2hhbmdlKCkge1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5nZXRTdGF0ZUZyb21TdG9yZXMoKSk7XG4gIH1cblxuICBnZXRTdGF0ZUZyb21TdG9yZXMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbHRlcnM6IHRoaXMuY29udGV4dC5maWx0ZXJCYXJTdG9yZS5nZXRFbmFibGVkKClcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHZhciBmaWx0ZXJzID0gT2JqZWN0LmtleXModGhpcy5zdGF0ZS5maWx0ZXJzKS5tYXAoZnVuY3Rpb24oZmlsdGVyVWlkKSB7XG4gICAgICB2YXIgZmlsdGVyID0gdGhpcy5zdGF0ZS5maWx0ZXJzW2ZpbHRlclVpZF07XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxGaWx0ZXJJbnB1dFxuICAgICAgICAgIGZpbHRlclVpZD17ZmlsdGVyVWlkfVxuICAgICAgICAgIGtleT17ZmlsdGVyVWlkfVxuICAgICAgICAgIGxhYmVsPXtmaWx0ZXIubGFiZWx9XG4gICAgICAgICAgdHlwZT17ZmlsdGVyLnR5cGV9XG4gICAgICAgICAgdmFsdWU9e2ZpbHRlci52YWx1ZX1cbiAgICAgICAgICBvcGVyYXRvcj17ZmlsdGVyLm9wZXJhdG9yfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIGlmIChmaWx0ZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZmlsdGVycyA9ICg8ZGl2Pk5vIEZpbHRlcnMgRW5hYmxlZCE8L2Rpdj4pO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhciBmaWx0ZXJiYXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+XG4gICAgICAgICAge2ZpbHRlcnN9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5GaWx0ZXJEaXNwbGF5LnByb3BUeXBlcyA9IHtcbiAgZW5hYmxlZEZpbHRlcnM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcblxuRmlsdGVyRGlzcGxheS5kZWZhdWx0UHJvcHMgPSB7XG4gIGVuYWJsZWRGaWx0ZXJzOiB7fVxufTtcblxuRmlsdGVyRGlzcGxheS5jb250ZXh0VHlwZXMgPSB7XG4gZmlsdGVyQmFyU3RvcmU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiBmaWx0ZXJCYXJBY3RvcjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuIiwiaW1wb3J0IHtGaWx0ZXJJbnB1dEZhY3Rvcnl9IGZyb20gXCIuL0ZpbHRlcklucHV0RmFjdG9yeS5yZWFjdFwiO1xuXG5leHBvcnQgY2xhc3MgRmlsdGVySW5wdXQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgfVxuXG4gIG9uQ2xpY2soKSB7XG4gICAgdGhpcy5jb250ZXh0LmZpbHRlckJhckFjdG9yLmRpc2FibGVGaWx0ZXIodGhpcy5wcm9wcy5maWx0ZXJVaWQpO1xuICB9XG5cbiAgb2JqZWN0UHJvcGVydGllcygpIHtcbiAgICB2YXIga2V5ID0gRGF0ZS5ub3coKTtcbiAgICByZXR1cm4oXG4gICAgICB7XG4gICAgICAgIGZpbHRlclVpZDogdGhpcy5wcm9wcy5maWx0ZXJVaWQsXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICB2YWx1ZTogdGhpcy5wcm9wcy52YWx1ZSxcbiAgICAgICAgdHlwZTogdGhpcy5wcm9wcy50eXBlLFxuICAgICAgICBvcGVyYXRvcjogdGhpcy5wcm9wcy5vcGVyYXRvclxuICAgICAgfVxuICAgICk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdmFyIHByb3BPYmplY3QgPSB0aGlzLm9iamVjdFByb3BlcnRpZXMoKTtcbiAgICB2YXIgaW5wdXRzID0gbmV3IEZpbHRlcklucHV0RmFjdG9yeShwcm9wT2JqZWN0KTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctMyBjb2wtbWQtNCBjb2wtc20tNiBjb2wteHMtMTIgZmlsdGVyXCI+XG4gICAgICAgIDx1bCBjbGFzc05hbWU9e3RoaXMuZmlsdGVyS2V5fT5cbiAgICAgICAgICA8bGk+XG4gICAgICAgICAgICA8aVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLWNpcmNsZS1wcmltYXJ5IGJ0bi14cyBpY29uIGljb24tY2xvc2UgcmVtb3ZlLWZpbHRlclwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMub25DbGljay5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAge3RoaXMucHJvcHMubGFiZWx9XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgICAge2lucHV0c31cbiAgICAgICAgPC91bD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuRmlsdGVySW5wdXQucHJvcFR5cGVzID0ge1xuICBmaWx0ZXJVaWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgbGFiZWw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgdHlwZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICB2YWx1ZTogUmVhY3QuUHJvcFR5cGVzLm5vZGUuaXNSZXF1aXJlZFxufTtcblxuRmlsdGVySW5wdXQuY29udGV4dFR5cGVzID0ge1xuICBmaWx0ZXJCYXJBY3RvcjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBmaWx0ZXJCYXJTdG9yZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuIiwiaW1wb3J0IHtUZXh0SW5wdXR9IGZyb20gXCIuL0lucHV0cy9UZXh0SW5wdXQucmVhY3RcIjtcbmltcG9ydCB7RGF0ZUlucHV0fSBmcm9tIFwiLi9JbnB1dHMvRGF0ZUlucHV0LnJlYWN0XCI7XG5pbXBvcnQge0RhdGVUaW1lSW5wdXR9IGZyb20gXCIuL0lucHV0cy9EYXRlVGltZUlucHV0LnJlYWN0XCI7XG5pbXBvcnQge1NpbmdsZURhdGVUaW1lSW5wdXR9IGZyb20gXCIuL0lucHV0cy9TaW5nbGVEYXRlVGltZUlucHV0LnJlYWN0XCI7XG5pbXBvcnQge1NlbGVjdElucHV0fSBmcm9tIFwiLi9JbnB1dHMvU2VsZWN0SW5wdXQucmVhY3RcIjtcbmltcG9ydCB7TGF6eVNlbGVjdElucHV0fSBmcm9tIFwiLi9JbnB1dHMvTGF6eVNlbGVjdElucHV0LnJlYWN0XCI7XG5pbXBvcnQge1JhbmdlSW5wdXR9IGZyb20gXCIuL0lucHV0cy9SYW5nZUlucHV0LnJlYWN0XCI7XG5pbXBvcnQge011bHRpU2VsZWN0SW5wdXR9IGZyb20gXCIuL0lucHV0cy9NdWx0aVNlbGVjdElucHV0LnJlYWN0XCI7XG5pbXBvcnQge0xhenlNdWx0aVNlbGVjdElucHV0fSBmcm9tIFwiLi9JbnB1dHMvTGF6eU11bHRpU2VsZWN0SW5wdXQucmVhY3RcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIEZpbHRlcklucHV0RmFjdG9yeShwcm9wT2JqZWN0KSB7XG4gIC8vIEphbmt5IHdheSB0byBlbnN1cmUgdW5pcXVlbmVzcyBvZiB0aGUgaW5wdXQsIHNvIHRoYXQgaXQgcmUtcmVuZGVycyB0aGVcbiAgLy8gdmFsdWUgaW4gdGhlIGlucHV0IHJhdGhlciB0aGFuIGp1c3QgZGlmZmluZyBiYXNlZCBvbiBpbnB1dCB0eXBlLlxuXG4gIHZhciBpbnB1dHMgPSB7XG4gICAgdGV4dDogUmVhY3QuY3JlYXRlRWxlbWVudChUZXh0SW5wdXQsIHByb3BPYmplY3QpLFxuICAgIGlkOiBSZWFjdC5jcmVhdGVFbGVtZW50KFRleHRJbnB1dCwgcHJvcE9iamVjdCksXG4gICAgZGF0ZTogUmVhY3QuY3JlYXRlRWxlbWVudChEYXRlSW5wdXQsIHByb3BPYmplY3QpLFxuICAgIGRhdGVfdGltZTogUmVhY3QuY3JlYXRlRWxlbWVudChEYXRlVGltZUlucHV0LCBwcm9wT2JqZWN0KSxcbiAgICBzaW5nbGVfZGF0ZXRpbWU6IFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2luZ2xlRGF0ZVRpbWVJbnB1dCwgcHJvcE9iamVjdCksXG4gICAgc2VsZWN0OiBSZWFjdC5jcmVhdGVFbGVtZW50KFNlbGVjdElucHV0LCBwcm9wT2JqZWN0KSxcbiAgICBsYXp5X3NlbGVjdDogUmVhY3QuY3JlYXRlRWxlbWVudChMYXp5U2VsZWN0SW5wdXQsIHByb3BPYmplY3QpLFxuICAgIHJhbmdlOiBSZWFjdC5jcmVhdGVFbGVtZW50KFJhbmdlSW5wdXQsIHByb3BPYmplY3QpLFxuICAgIG11bHRpX3NlbGVjdDogUmVhY3QuY3JlYXRlRWxlbWVudChNdWx0aVNlbGVjdElucHV0LCBwcm9wT2JqZWN0KSxcbiAgICBsYXp5X211bHRpX3NlbGVjdDogUmVhY3QuY3JlYXRlRWxlbWVudChMYXp5TXVsdGlTZWxlY3RJbnB1dCwgcHJvcE9iamVjdClcbiAgfTtcblxuICBpZiAoaW5wdXRzLmhhc093blByb3BlcnR5KHByb3BPYmplY3QudHlwZSkpIHtcbiAgICByZXR1cm4gaW5wdXRzW3Byb3BPYmplY3QudHlwZV07XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBEYXRlSW5wdXQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7IHZhbHVlOiB0aGlzLnByb3BzLnZhbHVlIHx8IHsgZnJvbTogbnVsbCwgdG86IG51bGwgfSB9O1xuICB9XG5cbiAgb25DaGFuZ2UoZXZlbnQpIHtcbiAgICB2YXIgbmV3VmFsdWUgPSB0aGlzLnN0YXRlLnZhbHVlO1xuXG4gICAgaWYoZXZlbnQudHlwZSA9PT0gXCJkcFwiKSB7XG4gICAgICBuZXdWYWx1ZVtldmVudC50YXJnZXQucXVlcnlTZWxlY3RvcihcImlucHV0XCIpLmdldEF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIpXSA9IGV2ZW50LnRhcmdldC5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIikudmFsdWU7XG4gICAgfSBlbHNlIGlmIChldmVudC50eXBlID09PSBcImlucHV0XCIpIHtcbiAgICAgIG5ld1ZhbHVlW2V2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiKV0gPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7dmFsdWU6IG5ld1ZhbHVlfSk7XG4gIH1cblxuICBvbkJsdXIoKSB7XG4gICAgdGhpcy5jb250ZXh0LmZpbHRlckJhckFjdG9yLnVwZGF0ZUZpbHRlcih0aGlzLnByb3BzLmZpbHRlclVpZCwgXCJ2YWx1ZVwiLCB0aGlzLnN0YXRlLnZhbHVlKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHZhciBkYXRlUGlja2VyRnJvbSA9ICQoUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmRhdGVSYW5nZUZyb20pKTtcbiAgICBpZiAoZGF0ZVBpY2tlckZyb20uZGF0ZXRpbWVwaWNrZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZGF0ZVBpY2tlckZyb20uZGF0ZXRpbWVwaWNrZXIoeyBsb2NhbGU6ICdlbi1hdScsIGZvcm1hdDogJ0wnIH0pO1xuICAgICAgZGF0ZVBpY2tlckZyb20uZGF0ZXRpbWVwaWNrZXIoKS5vbihcImRwLmNoYW5nZVwiLCB0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIHZhciBkYXRlUGlja2VyVG8gPSAkKFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5kYXRlUmFuZ2VUbykpO1xuICAgIGlmIChkYXRlUGlja2VyVG8uZGF0ZXRpbWVwaWNrZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZGF0ZVBpY2tlclRvLmRhdGV0aW1lcGlja2VyKHsgbG9jYWxlOiAnZW4tYXUnLCBmb3JtYXQ6ICdMJyB9KTtcbiAgICAgIGRhdGVQaWNrZXJUby5kYXRldGltZXBpY2tlcigpLm9uKFwiZHAuY2hhbmdlXCIsIHRoaXMub25DaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8bGk+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAgZGF0ZXBpY2tlciBkYXRlUmFuZ2VGcm9tXCIgcmVmPVwiZGF0ZVJhbmdlRnJvbVwiPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgYXJpYS1yZXF1aXJlZD1cInRydWVcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgIGRhdGEtZGF0ZS1mb3JtYXQ9XCJERC9NTS9ZWVlZXCJcbiAgICAgICAgICAgIG9uQmx1cj17dGhpcy5vbkJsdXIuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcyl9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cImZyb21cIlxuICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUudmFsdWUuZnJvbX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImlucHV0LWdyb3VwLWFkZG9uXCI+XG4gICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIiBjbGFzc05hbWU9XCJpY29uLWNhbGVuZGFyIGljb25cIiAvPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3Itb25seSBpY29uIGljb24tY2FsZW5kYXJcIj5cbiAgICAgICAgICAgICAgQ2FsZW5kYXJcbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWdyb3VwIGRhdGVwaWNrZXIgZGF0ZVJhbmdlVG9cIiByZWY9XCJkYXRlUmFuZ2VUb1wiPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgYXJpYS1yZXF1aXJlZD1cInRydWVcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgIGRhdGEtZGF0ZS1mb3JtYXQ9XCJERC9NTS9ZWVlZXCJcbiAgICAgICAgICAgIG9uQmx1cj17dGhpcy5vbkJsdXIuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcyl9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cInRvXCJcbiAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlLnRvfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAtYWRkb25cIj5cbiAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIGNsYXNzTmFtZT1cImljb24tY2FsZW5kYXIgaWNvblwiIC8+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzci1vbmx5IGljb24gaWNvbi1jYWxlbmRhclwiPlxuICAgICAgICAgICAgICBDYWxlbmRhclxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2xpPlxuICAgICk7XG4gIH1cbn1cblxuRGF0ZUlucHV0LnByb3BUeXBlcyA9IHtcbiAgZmlsdGVyVWlkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMubm9kZS5pc1JlcXVpcmVkXG59O1xuXG5EYXRlSW5wdXQuY29udGV4dFR5cGVzID0ge1xuICBmaWx0ZXJCYXJBY3RvcjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBmaWx0ZXJCYXJTdG9yZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuIiwiZXhwb3J0IGNsYXNzIERhdGVUaW1lSW5wdXQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7IHZhbHVlOiB0aGlzLnByb3BzLnZhbHVlIHx8IHsgZnJvbTogbnVsbCwgdG86IG51bGwgfSB9O1xuICB9XG5cbiAgb25DaGFuZ2UoZXZlbnQpIHtcbiAgICB2YXIgbmV3VmFsdWUgPSB0aGlzLnN0YXRlLnZhbHVlO1xuXG4gICAgaWYoZXZlbnQudHlwZSA9PT0gXCJkcFwiKSB7XG4gICAgICBuZXdWYWx1ZVtldmVudC50YXJnZXQucXVlcnlTZWxlY3RvcihcImlucHV0XCIpLmdldEF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIpXSA9IGV2ZW50LnRhcmdldC5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIikudmFsdWU7XG4gICAgfSBlbHNlIGlmIChldmVudC50eXBlID09PSBcImlucHV0XCIpIHtcbiAgICAgIG5ld1ZhbHVlW2V2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiKV0gPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7dmFsdWU6IG5ld1ZhbHVlfSk7XG4gIH1cblxuICBvbkJsdXIoKSB7XG4gICAgdGhpcy5jb250ZXh0LmZpbHRlckJhckFjdG9yLnVwZGF0ZUZpbHRlcih0aGlzLnByb3BzLmZpbHRlclVpZCwgXCJ2YWx1ZVwiLCB0aGlzLnN0YXRlLnZhbHVlKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHZhciBkYXRlVGltZVBpY2tlckZyb20gPSAkKFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5kYXRlVGltZVJhbmdlRnJvbSkpO1xuICAgIGlmIChkYXRlVGltZVBpY2tlckZyb20uZGF0ZXRpbWVwaWNrZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZGF0ZVRpbWVQaWNrZXJGcm9tLmRhdGV0aW1lcGlja2VyKHsgbG9jYWxlOiAnZW4tYXUnLCBmb3JtYXQ6ICdMTEwnLCBzaWRlQnlTaWRlOiBmYWxzZSB9KTtcbiAgICAgIGRhdGVUaW1lUGlja2VyRnJvbS5kYXRldGltZXBpY2tlcigpLm9uKFwiZHAuY2hhbmdlXCIsIHRoaXMub25DaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgdmFyIGRhdGVUaW1lUGlja2VyVG8gPSAkKFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5kYXRlVGltZVJhbmdlVG8pKTtcbiAgICBpZiAoZGF0ZVRpbWVQaWNrZXJUby5kYXRldGltZXBpY2tlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBkYXRlVGltZVBpY2tlclRvLmRhdGV0aW1lcGlja2VyKHsgbG9jYWxlOiAnZW4tYXUnLCBmb3JtYXQ6ICdMTEwnLCBzaWRlQnlTaWRlOiBmYWxzZSB9KTtcbiAgICAgIGRhdGVUaW1lUGlja2VyVG8uZGF0ZXRpbWVwaWNrZXIoKS5vbihcImRwLmNoYW5nZVwiLCB0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcykpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGxpPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWdyb3VwIGRhdGVwaWNrZXIgZGF0ZVRpbWVSYW5nZUZyb21cIiByZWY9XCJkYXRlVGltZVJhbmdlRnJvbVwiPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgYXJpYS1yZXF1aXJlZD1cInRydWVcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgIGRhdGEtZGF0ZS1mb3JtYXQ9XCJERC9NTS9ZWVlZIEhIOm1tXCJcbiAgICAgICAgICAgIG9uQmx1cj17dGhpcy5vbkJsdXIuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcyl9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cImZyb21cIlxuICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUudmFsdWUuZnJvbX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImlucHV0LWdyb3VwLWFkZG9uXCI+XG4gICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIiBjbGFzc05hbWU9XCJpY29uLWNhbGVuZGFyIGljb25cIiAvPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3Itb25seSBpY29uIGljb24tY2FsZW5kYXJcIj5cbiAgICAgICAgICAgICAgQ2FsZW5kYXJcbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWdyb3VwIGRhdGVwaWNrZXIgZGF0ZVRpbWVSYW5nZVRvXCIgcmVmPVwiZGF0ZVRpbWVSYW5nZVRvXCI+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICBhcmlhLXJlcXVpcmVkPVwidHJ1ZVwiXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgZGF0YS1kYXRlLWZvcm1hdD1cIkREL01NL1lZWVkgSEg6bW1cIlxuICAgICAgICAgICAgb25CbHVyPXt0aGlzLm9uQmx1ci5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMub25DaGFuZ2UuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwidG9cIlxuICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUudmFsdWUudG99XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpbnB1dC1ncm91cC1hZGRvblwiPlxuICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCIgY2xhc3NOYW1lPVwiaWNvbi1jYWxlbmRhciBpY29uXCIgLz5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInNyLW9ubHkgaWNvbiBpY29uLWNhbGVuZGFyXCI+XG4gICAgICAgICAgICAgIENhbGVuZGFyXG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvbGk+XG4gICAgKTtcbiAgfVxufVxuXG5EYXRlVGltZUlucHV0LnByb3BUeXBlcyA9IHtcbiAgZmlsdGVyVWlkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMubm9kZS5pc1JlcXVpcmVkXG59O1xuXG5EYXRlVGltZUlucHV0LmNvbnRleHRUeXBlcyA9IHtcbiAgZmlsdGVyQmFyQWN0b3I6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgZmlsdGVyQmFyU3RvcmU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcbiIsImV4cG9ydCBjbGFzcyBMYXp5TXVsdGlTZWxlY3RJbnB1dCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuICAgIHRoaXMuc3RhdGUgPSAge1xuICAgICAgdmFsdWU6IHRoaXMucHJvcHMudmFsdWUgPT09ICcnID8gdGhpcy5nZXREZWZhdWx0VmFsdWUoKSA6IHRoaXMucHJvcHMudmFsdWUsXG4gICAgICBvcHRpb25zOiBbXVxuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGxldCBmaWx0ZXIgPSB0aGlzLmdldEZpbHRlckZyb21GaWx0ZXJCYXJTdG9yZSgpO1xuICAgIHRoaXMuc2V0U3RhdGUoeyBvcHRpb25zOiBbXSB9KTtcbiAgICBmaWx0ZXIudmFsdWUgPSB0aGlzLnN0YXRlLnZhbHVlO1xuICB9XG5cbiAgZ2V0RmlsdGVyRnJvbUZpbHRlckJhclN0b3JlKCkge1xuICAgIHJldHVybih0aGlzLmNvbnRleHQuZmlsdGVyQmFyU3RvcmUuZ2V0RmlsdGVyKHRoaXMucHJvcHMuZmlsdGVyVWlkKSk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgbGV0IG11bHRpU2VsZWN0SW5wdXQgPSAkKFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5yZWFjdExhenlNdWx0aVNlbGVjdCkpO1xuICAgIGxldCBmaWx0ZXIgPSB0aGlzLmdldEZpbHRlckZyb21GaWx0ZXJCYXJTdG9yZSgpO1xuICAgIG11bHRpU2VsZWN0SW5wdXQuc2VsZWN0Mih7XG4gICAgICBtaW5pbXVtSW5wdXRMZW5ndGg6IGZpbHRlci5taW5pbXVtSW5wdXRMZW5ndGggfHwgMyxcbiAgICAgIG11bHRpcGxlOiB0cnVlLFxuICAgICAgYWpheDoge1xuICAgICAgICB1cmw6IGZpbHRlci51cmwsXG4gICAgICAgIHF1aWV0TWlsbGlzOiAyNTAsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIGRhdGE6IGZ1bmN0aW9uICh0ZXJtLCBwYWdlKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHE6IHRlcm1cbiAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICByZXN1bHRzOiBmdW5jdGlvbiAoZGF0YSwgcGFyYW1zKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3VsdHM6ICQubWFwKGRhdGEsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdGV4dDogaXRlbS5sYWJlbCxcbiAgICAgICAgICAgICAgICBpZDogaXRlbS52YWx1ZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBpbml0U2VsZWN0aW9uOiBmdW5jdGlvbihlbGVtZW50LCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgZGF0YSA9IFtdO1xuICAgICAgICBlbGVtZW50LmF0dHIoJ3ZhbHVlJykuc3BsaXQoJywnKS5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgZGF0YS5wdXNoKHtpZDogdmFsdWUsIHRleHQ6IHZhbHVlIH0pXG4gICAgICAgIH0pO1xuICAgICAgICBjYWxsYmFjayhkYXRhKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBtdWx0aVNlbGVjdElucHV0Lm9uKCdjaGFuZ2UnLCB0aGlzLm9uU2VsZWN0LmJpbmQodGhpcykpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgaWYgKHRoaXMuc2VydmVyUmVxdWVzdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnNlcnZlclJlcXVlc3QuYWJvcnQoKTtcbiAgICB9XG4gIH1cblxuICBnZXREZWZhdWx0VmFsdWUoKSB7XG4gICAgbGV0IGZpbHRlciA9IHRoaXMuZ2V0RmlsdGVyRnJvbUZpbHRlckJhclN0b3JlKCk7XG4gICAgcmV0dXJuKFtmaWx0ZXIuZGVmYXVsdF0pO1xuICB9XG5cbiAgb25TZWxlY3QoZXZlbnQpIHtcbiAgICBsZXQgZmlsdGVyID0gdGhpcy5nZXRGaWx0ZXJGcm9tRmlsdGVyQmFyU3RvcmUoKTtcbiAgICBpZihldmVudC50YXJnZXQudmFsdWUgPT09ICcnKSB7XG4gICAgICBmaWx0ZXIudmFsdWUgPSBbXTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmlsdGVyLnZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlLnNwbGl0KFwiLFwiKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxsaT5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS52YWx1ZX1cbiAgICAgICAgICByZWY9XCJyZWFjdExhenlNdWx0aVNlbGVjdFwiXG4gICAgICAgID5cbiAgICAgICAgPC9pbnB1dD5cbiAgICAgIDwvbGk+XG4gICAgKTtcbiAgfVxufVxuXG5MYXp5TXVsdGlTZWxlY3RJbnB1dC5wcm9wVHlwZXMgPSB7XG4gIGZpbHRlclVpZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICB2YWx1ZTogUmVhY3QuUHJvcFR5cGVzLm5vZGUuaXNSZXF1aXJlZFxufTtcblxuTGF6eU11bHRpU2VsZWN0SW5wdXQuY29udGV4dFR5cGVzID0ge1xuICBmaWx0ZXJCYXJBY3RvcjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBmaWx0ZXJCYXJTdG9yZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuIiwiZXhwb3J0IGNsYXNzIExhenlTZWxlY3RJbnB1dCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuICAgIHRoaXMuc3RhdGUgPSB7dmFsdWU6IHByb3BzLnZhbHVlLCBvcHRpb25zOiBbXX07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB2YXIgZmlsdGVyID0gdGhpcy5jb250ZXh0LmZpbHRlckJhclN0b3JlLmdldEZpbHRlcih0aGlzLnByb3BzLmZpbHRlclVpZCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IG9wdGlvbnM6IFtdIH0pO1xuICAgIGZpbHRlci52YWx1ZSA9IHRoaXMuc3RhdGUudmFsdWU7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgbGV0IHNlbGVjdElucHV0ID0gJChSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMucmVhY3RMYXp5U2VsZWN0KSk7XG4gICAgbGV0IGZpbHRlciA9IHRoaXMuY29udGV4dC5maWx0ZXJCYXJTdG9yZS5nZXRGaWx0ZXIodGhpcy5wcm9wcy5maWx0ZXJVaWQpO1xuICAgIHNlbGVjdElucHV0LnNlbGVjdDIoe1xuICAgICAgbWluaW11bUlucHV0TGVuZ3RoOiBmaWx0ZXIubWluaW11bUlucHV0TGVuZ3RoIHx8IDMsXG4gICAgICBhamF4OiB7XG4gICAgICAgIHVybDogZmlsdGVyLnVybCxcbiAgICAgICAgcXVpZXRNaWxsaXM6IDI1MCxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgZGF0YTogZnVuY3Rpb24gKHRlcm0sIHBhZ2UpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcTogdGVybVxuICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgIHJlc3VsdHM6IGZ1bmN0aW9uIChkYXRhLCBwYXJhbXMpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdWx0czogJC5tYXAoZGF0YSwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBpdGVtLmxhYmVsLFxuICAgICAgICAgICAgICAgIGlkOiBpdGVtLnZhbHVlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGluaXRTZWxlY3Rpb246IGZ1bmN0aW9uKGVsZW1lbnQsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGVsZW1lbnQuYXR0cigndmFsdWUnKTtcbiAgICAgICAgY2FsbGJhY2soe2lkOiB2YWx1ZSwgdGV4dDogdmFsdWUgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgc2VsZWN0SW5wdXQub24oJ2NoYW5nZScsIHRoaXMub25TZWxlY3QuYmluZCh0aGlzKSk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBpZiAodGhpcy5zZXJ2ZXJSZXF1ZXN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc2VydmVyUmVxdWVzdC5hYm9ydCgpO1xuICAgIH1cbiAgfVxuXG4gIG9uU2VsZWN0KGV2ZW50KSB7XG4gICAgbGV0IGZpbHRlciA9IHRoaXMuY29udGV4dC5maWx0ZXJCYXJTdG9yZS5nZXRGaWx0ZXIodGhpcy5wcm9wcy5maWx0ZXJVaWQpO1xuICAgIGZpbHRlci52YWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGxpPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfVxuICAgICAgICAgIHJlZj1cInJlYWN0TGF6eVNlbGVjdFwiXG4gICAgICAgID5cbiAgICAgICAgPC9pbnB1dD5cbiAgICAgIDwvbGk+XG4gICAgKTtcbiAgfVxufVxuXG5MYXp5U2VsZWN0SW5wdXQucHJvcFR5cGVzID0ge1xuICBmaWx0ZXJVaWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgdmFsdWU6IFJlYWN0LlByb3BUeXBlcy5ub2RlLmlzUmVxdWlyZWRcbn07XG5cbkxhenlTZWxlY3RJbnB1dC5jb250ZXh0VHlwZXMgPSB7XG4gIGZpbHRlckJhckFjdG9yOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGZpbHRlckJhclN0b3JlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG4iLCJleHBvcnQgY2xhc3MgTXVsdGlTZWxlY3RJbnB1dCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuICAgIHRoaXMuc3RhdGUgPSAge1xuICAgICAgdmFsdWU6IHRoaXMucHJvcHMudmFsdWUgPT09ICcnID8gdGhpcy5nZXREZWZhdWx0VmFsdWUoKSA6IHRoaXMucHJvcHMudmFsdWUsXG4gICAgICBvcHRpb25zOiBbXSxcbiAgICAgIG9wZXJhdG9yOiB0aGlzLnByb3BzLm9wZXJhdG9yLFxuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGxldCBmaWx0ZXIgPSB0aGlzLmdldEZpbHRlckZyb21GaWx0ZXJCYXJTdG9yZSgpO1xuICAgIHRoaXMuc2VydmVyUmVxdWVzdCA9ICQuZ2V0KGZpbHRlci51cmwsIGRhdGEgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IG9wdGlvbnM6IGRhdGEgfSk7XG4gICAgICBmaWx0ZXIudmFsdWUgPSB0aGlzLnN0YXRlLnZhbHVlO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0RmlsdGVyRnJvbUZpbHRlckJhclN0b3JlKCkge1xuICAgIHJldHVybih0aGlzLmNvbnRleHQuZmlsdGVyQmFyU3RvcmUuZ2V0RmlsdGVyKHRoaXMucHJvcHMuZmlsdGVyVWlkKSk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgbGV0IG11bHRpU2VsZWN0SW5wdXQgPSAkKFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5yZWFjdE11bHRpU2VsZWN0KSk7XG4gICAgbXVsdGlTZWxlY3RJbnB1dC5zZWxlY3QyKCk7XG4gICAgbXVsdGlTZWxlY3RJbnB1dC5vbignY2hhbmdlJywgdGhpcy5vblNlbGVjdC5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuc2VydmVyUmVxdWVzdC5hYm9ydCgpO1xuICB9XG5cbiAgZ2V0RGVmYXVsdFZhbHVlKCkge1xuICAgIGxldCBmaWx0ZXIgPSB0aGlzLmdldEZpbHRlckZyb21GaWx0ZXJCYXJTdG9yZSgpO1xuICAgIHJldHVybihbZmlsdGVyLmRlZmF1bHRdKTtcbiAgfVxuXG4gIG9uU2VsZWN0KGV2ZW50KSB7XG4gICAgdGhpcy5nZXRGaWx0ZXJGcm9tRmlsdGVyQmFyU3RvcmUoKS52YWx1ZSA9IHRoaXMuZ2V0U2VsZWN0ZWRWYWx1ZXMoKVxuICB9XG5cbiAgZ2V0U2VsZWN0ZWRWYWx1ZXMoKSB7XG4gICAgbGV0IHNlbGVjdGVkVmFsdWVzID0gW11cbiAgICBsZXQgdGFyZ2V0T3B0aW9ucyA9IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5yZWFjdE11bHRpU2VsZWN0KS5vcHRpb25zXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhcmdldE9wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0YXJnZXRPcHRpb25zW2ldLnNlbGVjdGVkKSB7XG4gICAgICAgIHNlbGVjdGVkVmFsdWVzLnB1c2godGFyZ2V0T3B0aW9uc1tpXS52YWx1ZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc2VsZWN0ZWRWYWx1ZXNcbiAgfVxuXG4gIHVwZGF0ZU9wZXJhdG9yKGUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgb3BlcmF0b3I6IGUudGFyZ2V0LnZhbHVlLCB2YWx1ZTogdGhpcy5nZXRTZWxlY3RlZFZhbHVlcygpIH0pXG4gICAgdGhpcy5nZXRGaWx0ZXJGcm9tRmlsdGVyQmFyU3RvcmUoKS5vcGVyYXRvciA9IGUudGFyZ2V0LnZhbHVlXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IG9wdGlvbkxpc3QgPSB0aGlzLnN0YXRlLm9wdGlvbnM7XG4gICAgbGV0IG9wdGlvbnMgPSBvcHRpb25MaXN0Lm1hcChmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxvcHRpb24ga2V5PXtvcHRpb24udmFsdWV9IHZhbHVlPXtvcHRpb24udmFsdWV9PlxuICAgICAgICAgIHtvcHRpb24ubGFiZWx9XG4gICAgICAgIDwvb3B0aW9uPlxuICAgICAgKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8bGk+XG4gICAgICAgIDxzZWxlY3RcbiAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgIG11bHRpcGxlPVwibXVsdGlwbGVcIlxuICAgICAgICAgIHNlbGVjdGVkPXt0aGlzLnN0YXRlLnZhbHVlfVxuICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfVxuICAgICAgICAgIHJlZj1cInJlYWN0TXVsdGlTZWxlY3RcIlxuICAgICAgICA+XG4gICAgICAgICAge29wdGlvbnN9XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgICB7dGhpcy5wcm9wcy5vcGVyYXRvciAmJiAoXG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJyYWRpby1pbmxpbmVcIj5cbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgdHlwZT1cInJhZGlvXCJcbiAgICAgICAgICAgICAgICBuYW1lPVwib3BlcmF0b3JcIlxuICAgICAgICAgICAgICAgIHZhbHVlPVwiYW55XCJcbiAgICAgICAgICAgICAgICBjaGVja2VkPXt0aGlzLnN0YXRlLm9wZXJhdG9yID09IFwiYW55XCJ9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMudXBkYXRlT3BlcmF0b3IuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgQU5ZIHNlbGVjdGVkXG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInJhZGlvLWlubGluZVwiPlxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICB0eXBlPVwicmFkaW9cIlxuICAgICAgICAgICAgICAgIG5hbWU9XCJvcGVyYXRvclwiXG4gICAgICAgICAgICAgICAgdmFsdWU9XCJhbGxcIlxuICAgICAgICAgICAgICAgIGNoZWNrZWQ9e3RoaXMuc3RhdGUub3BlcmF0b3IgPT0gXCJhbGxcIn1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy51cGRhdGVPcGVyYXRvci5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICBBTEwgc2VsZWN0ZWRcbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICA8L2xpPlxuICAgICk7XG4gIH1cbn1cblxuTXVsdGlTZWxlY3RJbnB1dC5wcm9wVHlwZXMgPSB7XG4gIGZpbHRlclVpZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICB2YWx1ZTogUmVhY3QuUHJvcFR5cGVzLm5vZGUuaXNSZXF1aXJlZFxufTtcblxuTXVsdGlTZWxlY3RJbnB1dC5jb250ZXh0VHlwZXMgPSB7XG4gIGZpbHRlckJhckFjdG9yOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGZpbHRlckJhclN0b3JlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG4iLCJleHBvcnQgY2xhc3MgUmFuZ2VJbnB1dCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHsgdmFsdWU6IHRoaXMucHJvcHMudmFsdWUgfHwgeyBmcm9tOiBudWxsLCB0bzogbnVsbCB9IH07XG4gIH1cblxuICBvbkNoYW5nZShldmVudCkge1xuICAgIHZhciBuZXdWYWx1ZSA9IHRoaXMuc3RhdGUudmFsdWU7XG5cbiAgICBpZiAoZXZlbnQudHlwZSA9PT0gXCJpbnB1dFwiKSB7XG4gICAgICBuZXdWYWx1ZVtldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIildID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe3ZhbHVlOiBuZXdWYWx1ZX0pO1xuICB9XG5cbiAgb25CbHVyKCkge1xuICAgIHRoaXMuY29udGV4dC5maWx0ZXJCYXJBY3Rvci51cGRhdGVGaWx0ZXIodGhpcy5wcm9wcy5maWx0ZXJVaWQsIFwidmFsdWVcIiwgdGhpcy5zdGF0ZS52YWx1ZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxsaT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgICAgb25CbHVyPXt0aGlzLm9uQmx1ci5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5vbkNoYW5nZS5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImZyb21cIlxuICAgICAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS52YWx1ZS5mcm9tfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgICAgb25CbHVyPXt0aGlzLm9uQmx1ci5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5vbkNoYW5nZS5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cInRvXCJcbiAgICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUudmFsdWUudG99XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvbGk+XG4gICAgKTtcbiAgfVxufVxuXG5SYW5nZUlucHV0LnByb3BUeXBlcyA9IHtcbiAgZmlsdGVyVWlkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMubm9kZS5pc1JlcXVpcmVkXG59O1xuXG5SYW5nZUlucHV0LmNvbnRleHRUeXBlcyA9IHtcbiAgZmlsdGVyQmFyQWN0b3I6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgZmlsdGVyQmFyU3RvcmU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcbiIsImV4cG9ydCBjbGFzcyBTZWxlY3RJbnB1dCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHt2YWx1ZTogcHJvcHMudmFsdWUsIG9wdGlvbnM6IFtdfTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHZhciBmaWx0ZXIgPSB0aGlzLmNvbnRleHQuZmlsdGVyQmFyU3RvcmUuZ2V0RmlsdGVyKHRoaXMucHJvcHMuZmlsdGVyVWlkKTtcblxuICAgIHRoaXMuc2VydmVyUmVxdWVzdCA9ICQuZ2V0KGZpbHRlci51cmwsIGRhdGEgPT4ge1xuICAgICAgdmFyIGZpcnN0T3B0aW9uID0gKGRhdGFbJ29wdGlvbnMnXSB8fCBkYXRhKVswXSB8fCB7fSxcbiAgICAgICAgICBkZWZhdWx0VmFsdWUgPSB0aGlzLnN0cmluZ1ZhbHVlT2YodGhpcy5zdGF0ZS52YWx1ZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0cmluZ1ZhbHVlT2YoZmlsdGVyLmRlZmF1bHQpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHJpbmdWYWx1ZU9mKGZpcnN0T3B0aW9uLnZhbHVlKTtcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7b3B0aW9uczogZGF0YX0pO1xuXG4gICAgICBpZiAoZGVmYXVsdFZhbHVlKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe3ZhbHVlOiBkZWZhdWx0VmFsdWV9KTtcbiAgICAgICAgZmlsdGVyLnZhbHVlID0gZGVmYXVsdFZhbHVlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5zZXJ2ZXJSZXF1ZXN0LmFib3J0KCk7XG4gIH1cblxuICBzdHJpbmdWYWx1ZU9mKHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgb25TZWxlY3QoZXZlbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHt2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlfSk7XG4gICAgdGhpcy5jb250ZXh0LmZpbHRlckJhckFjdG9yLnVwZGF0ZUZpbHRlcih0aGlzLnByb3BzLmZpbHRlclVpZCwgXCJ2YWx1ZVwiLCBldmVudC50YXJnZXQudmFsdWUpO1xuICB9XG5cbiAgZGlzcGxheU9wdGlvbihvcHRpb24pIHtcbiAgICByZXR1cm4gKFxuICAgICAgPG9wdGlvbiBrZXk9e29wdGlvbi52YWx1ZX0gdmFsdWU9e29wdGlvbi52YWx1ZX0+XG4gICAgICAgIHtvcHRpb24ubGFiZWx9XG4gICAgICA8L29wdGlvbj5cbiAgICApO1xuICB9XG5cbiAgZGlzcGxheU9wdEdyb3VwKGdyb3VwKSB7XG4gICAgbGV0IG9wdEdyb3VwT3B0aW9ucyA9IGdyb3VwLm9wdGlvbnMubWFwKG9wdGlvbiA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNwbGF5T3B0aW9uKG9wdGlvbik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPG9wdGdyb3VwIGxhYmVsPXtncm91cC5ncm91cH0+XG4gICAgICAgIHtvcHRHcm91cE9wdGlvbnN9XG4gICAgICA8L29wdGdyb3VwPlxuICAgICk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qgb3B0aW9uTGlzdCA9IHRoaXMuc3RhdGUub3B0aW9ucyB8fCBbXTtcblxuICAgIGxldCBvcHRpb25zID0gb3B0aW9uTGlzdC5tYXAob3B0aW9uID0+IHtcbiAgICAgIHJldHVybiBvcHRpb24uZ3JvdXAgPyB0aGlzLmRpc3BsYXlPcHRHcm91cChvcHRpb24pIDogdGhpcy5kaXNwbGF5T3B0aW9uKG9wdGlvbik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGxpPlxuICAgICAgICA8c2VsZWN0XG4gICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5vblNlbGVjdC5iaW5kKHRoaXMpfVxuICAgICAgICAgIHNlbGVjdGVkPXt0aGlzLnN0YXRlLnZhbHVlfVxuICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfVxuICAgICAgICA+XG4gICAgICAgICAge29wdGlvbnN9XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgPC9saT5cbiAgICApO1xuICB9XG59XG5cblNlbGVjdElucHV0LnByb3BUeXBlcyA9IHtcbiAgZmlsdGVyVWlkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMubm9kZS5pc1JlcXVpcmVkXG59O1xuXG5TZWxlY3RJbnB1dC5jb250ZXh0VHlwZXMgPSB7XG4gIGZpbHRlckJhckFjdG9yOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGZpbHRlckJhclN0b3JlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG4iLCJleHBvcnQgY2xhc3MgU2luZ2xlRGF0ZVRpbWVJbnB1dCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdmFyIG5ld1ZhbHVlID0gdGhpcy5wcm9wcy52YWx1ZSB8fCB7fTtcblxuICAgIGlmICh0aGlzLnByb3BzLnZhbHVlID09PSAnJykge1xuICAgICAgbmV3VmFsdWVbdGhpcy5wcm9wcy5vcGVyYXRvcl0gPSBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuc3RhdGUgPSB7IHZhbHVlOiBuZXdWYWx1ZSB9O1xuICB9XG5cbiAgb25DaGFuZ2UoZXZlbnQpIHtcbiAgICB2YXIgbmV3VmFsdWUgPSB0aGlzLnN0YXRlLnZhbHVlO1xuXG4gICAgaWYoZXZlbnQudHlwZSA9PT0gXCJkcFwiKSB7XG4gICAgICBuZXdWYWx1ZVt0aGlzLnByb3BzLm9wZXJhdG9yXSA9IGV2ZW50LnRhcmdldC5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIikudmFsdWU7XG4gICAgfSBlbHNlIGlmIChldmVudC50eXBlID09PSBcImlucHV0XCIpIHtcbiAgICAgIG5ld1ZhbHVlW3RoaXMucHJvcHMub3BlcmF0b3JdID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoeyB2YWx1ZTogbmV3VmFsdWUgfSk7XG4gIH1cblxuICBvbkJsdXIoKSB7XG4gICAgdGhpcy5jb250ZXh0LmZpbHRlckJhckFjdG9yLnVwZGF0ZUZpbHRlcih0aGlzLnByb3BzLmZpbHRlclVpZCwgXCJ2YWx1ZVwiLCB0aGlzLnN0YXRlLnZhbHVlKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHZhciBkYXRlVGltZVBpY2tlciA9ICQoUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLnNpbmdsZURhdGVUaW1lVmFsdWUpKTtcbiAgICBkYXRlVGltZVBpY2tlci5kYXRldGltZXBpY2tlcih7IGxvY2FsZTogJ2VuLWF1JyB9KTtcbiAgICBkYXRlVGltZVBpY2tlci5kYXRldGltZXBpY2tlcigpLm9uKFwiZHAuY2hhbmdlXCIsIHRoaXMub25DaGFuZ2UuYmluZCh0aGlzKSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxsaT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1ncm91cCBkYXRlcGlja2VyIHNpbmdsZURhdGVUaW1lVmFsdWVcIiByZWY9XCJzaW5nbGVEYXRlVGltZVZhbHVlXCI+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICBhcmlhLXJlcXVpcmVkPVwidHJ1ZVwiXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgZGF0YS1kYXRlLWZvcm1hdD1cIkREL01NL1lZWVkgaGg6bW0gQVwiXG4gICAgICAgICAgICBvbkJsdXI9e3RoaXMub25CbHVyLmJpbmQodGhpcyl9XG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5vbkNoYW5nZS5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUudmFsdWVbdGhpcy5wcm9wcy5vcGVyYXRvcl19XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpbnB1dC1ncm91cC1hZGRvblwiPlxuICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCIgY2xhc3NOYW1lPVwiaWNvbi1jYWxlbmRhciBpY29uXCIgLz5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInNyLW9ubHkgaWNvbiBpY29uLWNhbGVuZGFyXCI+XG4gICAgICAgICAgICAgIENhbGVuZGFyXG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvbGk+XG4gICAgKTtcbiAgfVxufVxuXG5TaW5nbGVEYXRlVGltZUlucHV0LnByb3BUeXBlcyA9IHtcbiAgZmlsdGVyVWlkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMubm9kZS5pc1JlcXVpcmVkXG59O1xuXG5TaW5nbGVEYXRlVGltZUlucHV0LmNvbnRleHRUeXBlcyA9IHtcbiAgZmlsdGVyQmFyQWN0b3I6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgZmlsdGVyQmFyU3RvcmU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcbiIsImV4cG9ydCBjbGFzcyBUZXh0SW5wdXQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7IHZhbHVlOiB0aGlzLnByb3BzLnZhbHVlIH07XG4gIH1cblxuICBDb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldFN0YXRlRnJvbVN0b3JlcygpKTtcbiAgfVxuXG4gIGdldFN0YXRlRnJvbVN0b3JlcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsdWU6IHRoaXMuY29udGV4dC5maWx0ZXJCYXJTdG9yZS5nZXRGaWx0ZXIodGhpcy5wcm9wcy5maWx0ZXJVaWQpLnZhbHVlXG4gICAgfTtcbiAgfVxuXG4gIG9uQ2hhbmdlKGV2ZW50KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7dmFsdWU6IGV2ZW50LnRhcmdldC52YWx1ZX0pO1xuICB9XG5cbiAgLy8gQ2F0Y2ggaW5wdXQgbG9zaW5nIGZvY3VzIHJhdGhlciB0aGFuIG9uIGNoYW5naW5nLCBzbyB0aGF0IHdlIGRvbid0IHRyaWdnZXJcbiAgLy8gYSBET00gcmVsb2FkIHVudGlsIHRoZSBjb21wb25lbnQgaGFzIGZpbmlzaGVkIGJlaW5nIGVkaXRlZC4gVGhpcyB0aWVzIGluXG4gIC8vIHRvIHRoZSBmYWN0IHRoYXQgdGhleSB1bmlxdWUga2V5IGlzIHRoZSB0aW1lc3RhbXAsIHNvIHdlIHdvdWxkIG90aGVyd2lzZVxuICAvLyBsb3NlIGZvY3VzIG9uIGV2ZXJ5IGtleXN0cm9rZS5cbiAgb25CbHVyKCkge1xuICAgIHRoaXMuY29udGV4dC5maWx0ZXJCYXJBY3Rvci51cGRhdGVGaWx0ZXIodGhpcy5wcm9wcy5maWx0ZXJVaWQsIFwidmFsdWVcIiwgdGhpcy5zdGF0ZS52YWx1ZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxsaT5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICBvbkJsdXI9e3RoaXMub25CbHVyLmJpbmQodGhpcyl9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMub25DaGFuZ2UuYmluZCh0aGlzKX1cbiAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUudmFsdWV9XG4gICAgICAgIC8+XG4gICAgICA8L2xpPlxuICAgICk7XG4gIH1cbn1cblxuVGV4dElucHV0LnByb3BUeXBlcyA9IHtcbiAgZmlsdGVyVWlkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMubm9kZS5pc1JlcXVpcmVkXG59O1xuXG5UZXh0SW5wdXQuY29udGV4dFR5cGVzID0ge1xuICBmaWx0ZXJCYXJBY3RvcjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBmaWx0ZXJCYXJTdG9yZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuIiwiaW1wb3J0IHtGaWx0ZXJMaXN0T3B0aW9ufSBmcm9tIFwiLi9GaWx0ZXJMaXN0T3B0aW9uLnJlYWN0XCI7XG5cbmV4cG9ydCBjbGFzcyBGaWx0ZXJMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZmlsdGVyczogcHJvcHMuZGlzYWJsZWRGaWx0ZXJzLFxuICAgICAgc2VhcmNoVGVybTogJydcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5jb250ZXh0LmZpbHRlckJhclN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMub25DaGFuZ2UuYmluZCh0aGlzKSk7XG4gIH1cblxuICBvbkNoYW5nZSgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0U3RhdGVGcm9tU3RvcmVzKCkpO1xuICB9XG5cbiAgZ2V0U3RhdGVGcm9tU3RvcmVzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBmaWx0ZXJzOiB0aGlzLmNvbnRleHQuZmlsdGVyQmFyU3RvcmUuZ2V0RGlzYWJsZWQoKVxuICAgIH07XG4gIH1cblxuICBvblNlYXJjaFRlcm1DaGFuZ2UoZXZlbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgc2VhcmNoVGVybTogZXZlbnQudGFyZ2V0LnZhbHVlLnRvTG93ZXJDYXNlKCkgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdmFyIG9wdGlvbktleSA9IFwiXCI7XG4gICAgdmFyIGZpbHRlcnMgPSB0aGlzLnN0YXRlLmZpbHRlcnM7XG4gICAgdmFyIHRlcm0gPSB0aGlzLnN0YXRlLnNlYXJjaFRlcm07XG4gICAgdmFyIHVpZHMgPSBPYmplY3Qua2V5cyhmaWx0ZXJzKS5maWx0ZXIoZnVuY3Rpb24odWlkKSB7XG4gICAgICByZXR1cm4gZmlsdGVyc1t1aWRdLmxhYmVsLnRvTG93ZXJDYXNlKCkuc2VhcmNoKHRlcm0pICE9PSAtMTtcbiAgICB9KTtcbiAgICB2YXIgZmlsdGVyT3B0aW9ucyA9IHVpZHMubWFwKGZ1bmN0aW9uKGZpbHRlclVpZCkge1xuICAgICAgb3B0aW9uS2V5ID0gXCJvcHRpb24tXCIgKyBmaWx0ZXJVaWQ7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RmlsdGVyTGlzdE9wdGlvblxuICAgICAgICAgIGZpbHRlclVpZD17ZmlsdGVyVWlkfVxuICAgICAgICAgIGtleT17b3B0aW9uS2V5fVxuICAgICAgICAgIGxhYmVsPXtmaWx0ZXJzW2ZpbHRlclVpZF0ubGFiZWx9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0sIHRoaXMpO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cFwiPlxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgdHlwZT1cImJ1dHRvblwiPlxuICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImljb24gaWNvbi1hZGRcIiAvPlxuICAgICAgICAgIEFkZCBGaWx0ZXJcbiAgICAgICAgICA8aSBjbGFzc05hbWU9XCJpY29uIGljb24tY2hldnJvbi1kb3duXCIgLz5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZHJvcGRvd24tbWVudVwiIHJvbGU9XCJtZW51XCI+XG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2VhcmNoXCJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLm9uU2VhcmNoVGVybUNoYW5nZS5iaW5kKHRoaXMpfSAvPlxuICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJmaWx0ZXItb3B0aW9uc1wiPlxuICAgICAgICAgICAge2ZpbHRlck9wdGlvbnN9XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbkZpbHRlckxpc3QuY29udGV4dFR5cGVzID0ge1xuICBmaWx0ZXJCYXJBY3RvcjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgZmlsdGVyQmFyU3RvcmU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3Rcbn07XG5cbkZpbHRlckxpc3QucHJvcFR5cGVzID0ge1xuICBkaXNhYmxlZEZpbHRlcnM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcbiIsImV4cG9ydCBjbGFzcyBGaWx0ZXJMaXN0T3B0aW9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gIH1cblxuICBvbkNsaWNrKCkge1xuICAgIHRoaXMuY29udGV4dC5maWx0ZXJCYXJBY3Rvci5lbmFibGVGaWx0ZXIodGhpcy5wcm9wcy5maWx0ZXJVaWQpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8bGk+XG4gICAgICAgIDxhIG9uQ2xpY2s9e3RoaXMub25DbGljay5iaW5kKHRoaXMpfSBzdHlsZT17IHtjdXJzb3I6IFwicG9pbnRlclwifSB9PlxuICAgICAgICAgIHt0aGlzLnByb3BzLmxhYmVsfVxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPlxuICAgICk7XG4gIH1cbn1cblxuRmlsdGVyTGlzdE9wdGlvbi5wcm9wVHlwZXMgPSB7XG4gIGZpbHRlclVpZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBsYWJlbDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkXG59O1xuXG5GaWx0ZXJMaXN0T3B0aW9uLmNvbnRleHRUeXBlcyA9IHtcbiAgZmlsdGVyQmFyQWN0b3I6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcbiIsImV4cG9ydCBjbGFzcyBTYXZlRmlsdGVyc0J1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7Y29uZmlndXJhdGlvbk5hbWU6IFwiXCJ9O1xuICB9XG5cbiAgb25DbGljaygpIHtcbiAgICBpZih0aGlzLnN0YXRlLmNvbmZpZ3VyYXRpb25OYW1lLnRyaW0oKSA9PT0gJycpIHtcbiAgICAgICQuYm9vdHN0cmFwR3Jvd2woXCJTZWFyY2ggdGl0bGUgY2FuJ3QgYmUgYmxhbmtcIiwgeyB0eXBlOiBcImRhbmdlclwiIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZih0aGlzLmNvbnRleHQuZmlsdGVyQmFyQWN0b3Iuc2F2ZUZpbHRlcnModGhpcy5zdGF0ZS5jb25maWd1cmF0aW9uTmFtZS50cmltKCkpKSB7XG4gICAgICAkLmJvb3RzdHJhcEdyb3dsKFwiU2VhcmNoIHNhdmVkIHN1Y2Vzc2Z1bGx5XCIsIHsgdHlwZTogXCJzdWNjZXNzXCIgfSk7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICAkLmJvb3RzdHJhcEdyb3dsKFwiTm8gZmlsdGVycyBlbmFibGVkLCBwbGVhc2UgYWRkIGZpbHRlclwiLCB7IHR5cGU6IFwiZGFuZ2VyXCIgfSk7XG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoe2NvbmZpZ3VyYXRpb25OYW1lOiAnJ30pO1xuICB9XG5cbiAgb25DaGFuZ2UoZXZlbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtjb25maWd1cmF0aW9uTmFtZTogZXZlbnQudGFyZ2V0LnZhbHVlfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwXCI+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgZHJvcGRvd24tdG9nZ2xlXCJcbiAgICAgICAgICBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJcbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgPlxuICAgICAgICAgIFNhdmUgU2VhcmNoXG4gICAgICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uLWNoZXZyb24tZG93blwiIC8+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8dWwgY2xhc3NOYW1lPVwiZHJvcGRvd24tbWVudVwiIHJvbGU9XCJtZW51XCI+XG4gICAgICAgICAgPGxpPlxuICAgICAgICAgICAgPGZvcm0gc3R5bGU9e3ttYXJnaW46IGAwIDE2cHhgfX0+XG4gICAgICAgICAgICAgIDxsYWJlbD5TZWFyY2ggVGl0bGU8L2xhYmVsPlxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLmNvbmZpZ3VyYXRpb25OYW1lfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCJcbiAgICAgICAgICAgICAgICBzdHlsZT17e21hcmdpblRvcDogYDVweGB9fVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMub25DbGljay5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgU2F2ZVxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICA8L3VsPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5TYXZlRmlsdGVyc0J1dHRvbi5jb250ZXh0VHlwZXMgPSB7XG4gIGZpbHRlckJhckFjdG9yOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG4iLCJpbXBvcnQge1NhdmVkU2VhcmNoZXNMaXN0SXRlbX0gZnJvbSBcIi4vU2F2ZWRTZWFyY2hlc0xpc3RJdGVtLnJlYWN0XCI7XG5cbmV4cG9ydCBjbGFzcyBTYXZlZFNlYXJjaGVzTGlzdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHt9O1xuICB9XG5cbiAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5nZXRTdGF0ZUZyb21TdG9yZXMoKSk7XG4gICAgdGhpcy5jb250ZXh0LmZpbHRlckJhclN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMub25DaGFuZ2UuYmluZCh0aGlzKSk7XG4gIH1cblxuICBnZXRTdGF0ZUZyb21TdG9yZXMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNhdmVkU2VhcmNoZXM6IHRoaXMuY29udGV4dC5maWx0ZXJCYXJTdG9yZS5nZXRTYXZlZFNlYXJjaGVzKClcbiAgICB9O1xuICB9XG5cbiAgb25DaGFuZ2UoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldFN0YXRlRnJvbVN0b3JlcygpKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICB2YXIgYnV0dG9uQ2xhc3MgPSBcImJ0biBidG4tZGVmYXVsdCBkcm9wZG93bi10b2dnbGVcIjtcblxuICAgIGlmICh0aGlzLnN0YXRlLnNhdmVkU2VhcmNoZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBidXR0b25DbGFzcyArPSBcIiBkaXNhYmxlZFwiO1xuICAgIH1cblxuICAgIHZhciBzYXZlZFNlYXJjaGVzID0gdGhpcy5zdGF0ZS5zYXZlZFNlYXJjaGVzLm1hcChmdW5jdGlvbihzYXZlZFNlYXJjaCwgaW5kZXgpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxTYXZlZFNlYXJjaGVzTGlzdEl0ZW1cbiAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgIG5hbWU9e3NhdmVkU2VhcmNoLm5hbWV9XG4gICAgICAgICAgc2VhcmNoSWQ9e2luZGV4fVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwXCI+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgYXJpYS1leHBhbmRlZD1cImZhbHNlXCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17YnV0dG9uQ2xhc3N9XG4gICAgICAgICAgICBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImljb24gaWNvbi1zYXZlXCIgLz5cbiAgICAgICAgICAgIFNhdmVkIFNlYXJjaGVzXG4gICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJpY29uIGljb24tY2hldnJvbi1kb3duXCIgLz5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwiZHJvcGRvd24tbWVudVwiIHJvbGU9XCJtZW51XCI+XG4gICAgICAgICAgICB7c2F2ZWRTZWFyY2hlc31cbiAgICAgICAgICA8L3VsPlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cblNhdmVkU2VhcmNoZXNMaXN0LmNvbnRleHRUeXBlcyA9IHtcbiAgZmlsdGVyQmFyQWN0b3I6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgZmlsdGVyQmFyU3RvcmU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcbiIsImV4cG9ydCBjbGFzcyBTYXZlZFNlYXJjaGVzTGlzdEl0ZW0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgfVxuXG4gIG9uQ2xpY2soKSB7XG4gICAgdGhpcy5jb250ZXh0LmZpbHRlckJhckFjdG9yLmxvYWRTYXZlZFNlYXJjaCh0aGlzLnByb3BzLnNlYXJjaElkKTtcbiAgfVxuXG4gIG9uQ2xpY2tEZWxldGUoKSB7XG4gICAgdGhpcy5jb250ZXh0LmZpbHRlckJhckFjdG9yLmRlbGV0ZVNhdmVkU2VhcmNoKHRoaXMucHJvcHMuc2VhcmNoSWQpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHZhciBsaVN0eWxlcyA9IHtcbiAgICAgICAgICBkaXNwbGF5OiBcImlubGluZS1mbGV4ICFpbXBvcnRhbnRcIixcbiAgICAgICAgICB3aWR0aDogXCIxMDAlXCIsXG4gICAgICAgICAgbWFyZ2luQm90dG9tOiBcIjVweFwiXG4gICAgICAgIH07XG4gICAgcmV0dXJuIChcbiAgICAgIDxsaSBzdHlsZT17bGlTdHlsZXN9PlxuICAgICAgICA8YSBjbGFzc05hbWU9XCJkeW5hbWljLXRleHQtZmlsdGVyXCIgb25DbGljaz17dGhpcy5vbkNsaWNrLmJpbmQodGhpcyl9IHN0eWxlPXsge2N1cnNvcjogXCJwb2ludGVyXCIsIG1hcmdpblJpZ2h0OiBcIjM5cHhcIn0gfT5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5uYW1lfVxuICAgICAgICA8L2E+XG4gICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tY2lyY2xlLWRhbmdlciBidG4tc21cIiB0aXRsZT1cIkRlbGV0ZVwiIHN0eWxlPXsgeyBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLCByaWdodDogXCI0cHhcIn0gfSBvbkNsaWNrPXt0aGlzLm9uQ2xpY2tEZWxldGUuYmluZCh0aGlzKX0+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLWRlbGV0ZVwiPjwvc3Bhbj5cbiAgICAgICAgPC9hPlxuICAgICAgPC9saT5cbiAgICApO1xuICB9XG59XG5cblNhdmVkU2VhcmNoZXNMaXN0SXRlbS5wcm9wVHlwZXMgPSB7XG4gIG5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgc2VhcmNoSWQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZFxufTtcblxuU2F2ZWRTZWFyY2hlc0xpc3RJdGVtLmNvbnRleHRUeXBlcyA9IHtcbiAgZmlsdGVyQmFyQWN0b3I6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcbiIsImltcG9ydCB7RmlsdGVyQmFyQWN0b3J9IGZyb20gXCIuLi9hY3RvcnMvRmlsdGVyQmFyQWN0b3JcIjtcbmltcG9ydCB7VGFibGVBY3Rvcn0gZnJvbSBcIi4uL2FjdG9ycy9UYWJsZUFjdG9yXCI7XG5cbmltcG9ydCB7RmlsdGVyQmFyU3RvcmV9IGZyb20gXCIuLi9zdG9yZXMvRmlsdGVyQmFyU3RvcmVcIjtcbmltcG9ydCB7VGFibGVTdG9yZX0gZnJvbSBcIi4uL3N0b3Jlcy9UYWJsZVN0b3JlXCI7XG5pbXBvcnQge0JhdGNoQWN0aW9uc1N0b3JlfSBmcm9tIFwiLi4vc3RvcmVzL0JhdGNoQWN0aW9uc1N0b3JlXCI7XG5cbmltcG9ydCB7RmlsdGVyQmFyfSBmcm9tIFwiLi9GaWx0ZXJCYXIvRmlsdGVyQmFyLnJlYWN0XCI7XG5pbXBvcnQge1RhYmxlfSBmcm9tIFwiLi9UYWJsZS9UYWJsZS5yZWFjdFwiO1xuXG5leHBvcnQgY2xhc3MgRmlsdGVyYWJsZVRhYmxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLmZpbHRlckJhclN0b3JlID0gbmV3IEZpbHRlckJhclN0b3JlKHByb3BzLmZpbHRlckJhckNvbmZpZ3VyYXRpb24pO1xuICAgIHRoaXMudGFibGVTdG9yZSA9IG5ldyBUYWJsZVN0b3JlKHByb3BzLnRhYmxlQ29uZmlndXJhdGlvbik7XG4gICAgdGhpcy5iYXRjaEFjdGlvbnNTdG9yZSA9IG5ldyBCYXRjaEFjdGlvbnNTdG9yZShwcm9wcy5iYXRjaEFjdGlvbnNDb25maWd1cmF0aW9uKTtcblxuICAgIHRoaXMuZmlsdGVyQmFyQWN0b3IgPSBuZXcgRmlsdGVyQmFyQWN0b3IodGhpcy5maWx0ZXJCYXJTdG9yZSwgdGhpcy50YWJsZVN0b3JlKTtcbiAgICB0aGlzLnRhYmxlQWN0b3IgPSBuZXcgVGFibGVBY3Rvcih0aGlzLmZpbHRlckJhclN0b3JlLCB0aGlzLnRhYmxlU3RvcmUpO1xuICB9XG5cbiAgZ2V0Q2hpbGRDb250ZXh0KCkge1xuICAgIHJldHVybiB7XG4gICAgICBmaWx0ZXJCYXJTdG9yZTogdGhpcy5maWx0ZXJCYXJTdG9yZSxcbiAgICAgIGZpbHRlckJhckFjdG9yOiB0aGlzLmZpbHRlckJhckFjdG9yLFxuICAgICAgdGFibGVTdG9yZTogdGhpcy50YWJsZVN0b3JlLFxuICAgICAgYmF0Y2hBY3Rpb25zU3RvcmU6IHRoaXMuYmF0Y2hBY3Rpb25zU3RvcmUsXG4gICAgICB0YWJsZUFjdG9yOiB0aGlzLnRhYmxlQWN0b3JcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8RmlsdGVyQmFyIC8+XG4gICAgICAgIDxUYWJsZSAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5GaWx0ZXJhYmxlVGFibGUuY2hpbGRDb250ZXh0VHlwZXMgPSB7XG4gIGZpbHRlckJhclN0b3JlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICBmaWx0ZXJCYXJBY3RvcjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgdGFibGVTdG9yZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgYmF0Y2hBY3Rpb25zU3RvcmU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIHRhYmxlQWN0b3I6IFJlYWN0LlByb3BUeXBlcy5vYmplY3Rcbn07XG4iLCJpbXBvcnQge1F1aWNrRmlsdGVyc0Jsb2NrfSBmcm9tIFwiLi9RdWlja0ZpbHRlcnNCbG9jay9RdWlja0ZpbHRlcnNCbG9jay5yZWFjdFwiO1xuXG5leHBvcnQgY2xhc3MgUXVpY2tGaWx0ZXJzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdmFyIHF1aWNrRmlsdGVycyA9IHRoaXMuY29udGV4dC5maWx0ZXJCYXJTdG9yZS5xdWlja0ZpbHRlcnM7XG4gICAgaWYgKHF1aWNrRmlsdGVycyAhPT0gdW5kZWZpbmVkKVxuICAgIHtcbiAgICAgIHZhciBmaWx0ZXJCbG9ja3MgPSBPYmplY3Qua2V5cyhxdWlja0ZpbHRlcnMpLm1hcChmdW5jdGlvbihmaWx0ZXIpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8UXVpY2tGaWx0ZXJzQmxvY2sgZmlsdGVycz17cXVpY2tGaWx0ZXJzW2ZpbHRlcl19IG5hbWU9e2ZpbHRlcn0gbGFiZWw9e3F1aWNrRmlsdGVyc1tmaWx0ZXJdLmxhYmVsfS8+XG4gICAgICAgICk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGZpbHRlckJsb2NrcyA9ICcnO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInF1aWNrLWZpbHRlcnNcIj5cbiAgICAgICAge2ZpbHRlckJsb2Nrc31cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuUXVpY2tGaWx0ZXJzLmNvbnRleHRUeXBlcyA9IHtcbiAgZmlsdGVyQmFyU3RvcmU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG59O1xuIiwiaW1wb3J0IHtRdWlja0ZpbHRlcnNCdXR0b259IGZyb20gXCIuL1F1aWNrRmlsdGVyc0J1dHRvbi5yZWFjdFwiO1xuXG5leHBvcnQgY2xhc3MgUXVpY2tGaWx0ZXJzQmxvY2sgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbmFtZTogdGhpcy5wcm9wcy5uYW1lLFxuICAgICAgbGFiZWw6IHRoaXMucHJvcHMubGFiZWwsXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICB2YXIgZmlsdGVycyA9IHRoaXMucHJvcHMuZmlsdGVycztcbiAgICB2YXIgYnV0dG9ucyA9IE9iamVjdC5rZXlzKGZpbHRlcnMpLm1hcChmdW5jdGlvbihmaWx0ZXIpIHtcbiAgICAgIGlmIChmaWx0ZXIgIT0gXCJsYWJlbFwiKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPFF1aWNrRmlsdGVyc0J1dHRvbiBmaWx0ZXJzPXtmaWx0ZXJzW2ZpbHRlcl19IG5hbWU9e2ZpbHRlcn0gYmxvY2tOYW1lPXt0aGlzLnN0YXRlLm5hbWV9Lz5cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAge3RoaXMucHJvcHMubGFiZWx9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIHF1aWNrLWZpbHRlcnMtYmxvY2tcIj5cbiAgICAgICAgICB7YnV0dG9uc31cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgUXVpY2tGaWx0ZXJzQnV0dG9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIG5hbWU6IHRoaXMucHJvcHMubmFtZSxcbiAgICAgIGRpc2FibGVkOiB0aGlzLnByb3BzLmZpbHRlcnMuZGlzYWJsZWQsXG4gICAgICBsYWJlbDogdGhpcy5wcm9wcy5maWx0ZXJzLmxhYmVsLFxuICAgICAgdG9vbHRpcDogdGhpcy5wcm9wcy5maWx0ZXJzLnRvb2x0aXAsXG4gICAgICBmaWx0ZXJzOiB0aGlzLnByb3BzLmZpbHRlcnMuZmlsdGVycyxcbiAgICAgIGJsb2NrTmFtZTogdGhpcy5wcm9wcy5ibG9ja05hbWUsXG4gICAgICBxdWlja0ZpbHRlckJ1dHRvbjogdGhpcy5wcm9wcy5maWx0ZXJzXG4gICAgfTtcbiAgfVxuXG4gIG9uQ2xpY2soZSkge1xuICAgIGlmKHRoaXMuc3RhdGUuZGlzYWJsZWQpIHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29udGV4dC5maWx0ZXJCYXJBY3Rvci5kaXNhYmxlQmxvY2tGaWx0ZXJzKHRoaXMuc3RhdGUuYmxvY2tOYW1lKVxuICAgICAgT2JqZWN0LmtleXModGhpcy5zdGF0ZS5maWx0ZXJzKS5tYXAoZnVuY3Rpb24oZmlsdGVyKSB7XG4gICAgICAgIGxldCBjbG9uZWRGaWx0ZXIgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMuc3RhdGUuZmlsdGVyc1tmaWx0ZXJdKSk7IC8vIGF2b2lkIHZhbHVlIHRvIGJlIG92ZXJ3cml0dGVuIHdoZW4gZmlsdGVyIGNoYW5nZXNcbiAgICAgICAgbGV0IHZhbHVlID0gY2xvbmVkRmlsdGVyLnZhbHVlO1xuICAgICAgICBsZXQgZmlsdGVyTmFtZSA9IGNsb25lZEZpbHRlci5maWx0ZXI7XG4gICAgICAgIHRoaXMuY29udGV4dC5maWx0ZXJCYXJBY3Rvci5hcHBseVF1aWNrRmlsdGVyKGZpbHRlck5hbWUsIHZhbHVlLCB0aGlzLnN0YXRlLm5hbWUsIHRoaXMuc3RhdGUuYmxvY2tOYW1lKTtcbiAgICAgIH0sIHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuY29udGV4dC5maWx0ZXJCYXJTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcykpO1xuICB9XG5cbiAgb25DaGFuZ2UoZSkge1xuICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgfVxuXG4gIGJ1dHRvbkNsYXNzZXMoKSB7XG4gICAgbGV0IGtsYXNzZXMgPSAnYnRuIHF1aWNrLWZpbHRlcnMtYnV0dG9uJztcbiAgICBpZih0aGlzLnN0YXRlLnF1aWNrRmlsdGVyQnV0dG9uLmFjdGl2ZSA9PT0gdHJ1ZSlcbiAgICAgIGtsYXNzZXMgKz0gJyBidG4tcHJpbWFyeSBkaXNhYmxlZCc7XG4gICAgZWxzZVxuICAgICAga2xhc3NlcyArPSAnIGJ0bi1kZWZhdWx0JztcblxuICAgIGlmKHRoaXMuc3RhdGUuZGlzYWJsZWQpXG4gICAgICBrbGFzc2VzICs9ICcgYnRuLWRhbmdlcic7XG5cbiAgICByZXR1cm4ga2xhc3NlcztcbiAgfVxuXG4gIGJ1dHRvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9e3RoaXMuYnV0dG9uQ2xhc3NlcygpfSB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17dGhpcy5vbkNsaWNrLmJpbmQodGhpcyl9PlxuICAgICAgICB7dGhpcy5zdGF0ZS5sYWJlbH1cbiAgICAgIDwvYnV0dG9uPlxuICAgICk7XG4gIH1cblxuICB0b29sdGlwKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8UmVhY3RCb290c3RyYXAuVG9vbHRpcCBpZD1cInF1aWNrLWZpbHRlcnMtdG9vbHRpcFwiPnt0aGlzLnN0YXRlLnRvb2x0aXB9PC9SZWFjdEJvb3RzdHJhcC5Ub29sdGlwPlxuICAgICk7XG4gIH1cblxuICBkaXNhYmxlZFRvb2x0aXAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxSZWFjdEJvb3RzdHJhcC5Ub29sdGlwIGlkPVwicXVpY2stZmlsdGVycy10b29sdGlwXCI+e3RoaXMuc3RhdGUuZGlzYWJsZWR9PC9SZWFjdEJvb3RzdHJhcC5Ub29sdGlwPlxuICAgICk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYodGhpcy5zdGF0ZS5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFJlYWN0Qm9vdHN0cmFwLk92ZXJsYXlUcmlnZ2VyIHBsYWNlbWVudD1cInRvcFwiIG92ZXJsYXk9e3RoaXMuZGlzYWJsZWRUb29sdGlwKCl9PlxuICAgICAgICAgIHt0aGlzLmJ1dHRvbigpfVxuICAgICAgICA8L1JlYWN0Qm9vdHN0cmFwLk92ZXJsYXlUcmlnZ2VyPlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFJlYWN0Qm9vdHN0cmFwLk92ZXJsYXlUcmlnZ2VyIHBsYWNlbWVudD1cInRvcFwiIG92ZXJsYXk9e3RoaXMudG9vbHRpcCgpfT5cbiAgICAgICAgICB7dGhpcy5idXR0b24oKX1cbiAgICAgICAgPC9SZWFjdEJvb3RzdHJhcC5PdmVybGF5VHJpZ2dlcj5cbiAgICAgICk7XG4gICAgfVxuICB9XG59XG5cblF1aWNrRmlsdGVyc0J1dHRvbi5jb250ZXh0VHlwZXMgPSB7XG4gIGZpbHRlckJhckFjdG9yOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGZpbHRlckJhclN0b3JlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XG59O1xuIiwiaW1wb3J0IHtCb2R5Um93fSBmcm9tIFwiLi9Cb2R5Um93LnJlYWN0XCI7XG5cbmV4cG9ydCBjbGFzcyBCb2R5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdmFyIHJvd3MgPSB0aGlzLnByb3BzLnJvd3MubWFwKGZ1bmN0aW9uKGNlbGxzLCBpbmRleCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEJvZHlSb3dcbiAgICAgICAgICBjZWxscz17Y2VsbHN9XG4gICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICBkaXNwbGF5VGFibGUgPSB7dGhpcy5wcm9wcy5kaXNwbGF5VGFibGV9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0sIHRoaXMpO1xuICAgIHJldHVybiAoXG4gICAgICA8dGJvZHk+XG4gICAgICAgIHtyb3dzfVxuICAgICAgPC90Ym9keT5cbiAgICApO1xuICB9XG59XG5cbkJvZHkucHJvcFR5cGVzID0ge1xuICByb3dzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZFxufTtcblxuQm9keS5jb250ZXh0VHlwZXMgPSB7XG4gIHRhYmxlU3RvcmU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgdGFibGVBY3RvcjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuIiwiZXhwb3J0IGNsYXNzIEJvZHlDZWxsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdmFyIGNvbnRlbnQgPSB0aGlzLnByb3BzLnZhbHVlO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDx0ZCBzdHlsZT17dGhpcy5wcm9wcy5zdHlsZX0gZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3tfX2h0bWw6IGNvbnRlbnR9fSAvPlxuICAgICk7XG4gIH1cbn1cblxuQm9keUNlbGwucHJvcFR5cGVzID0ge1xuICB2YWx1ZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkXG59O1xuIiwiaW1wb3J0IHtCb2R5Q2VsbH0gZnJvbSBcIi4vQm9keUNlbGwucmVhY3RcIjtcbmltcG9ydCB7Qm9keVNlbGVjdGFibGV9IGZyb20gXCIuL0JvZHlTZWxlY3RhYmxlLnJlYWN0XCI7XG5cbmV4cG9ydCBjbGFzcyBCb2R5Um93IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gIH1cblxuICBkaXNwbGF5U2VsZWN0YWJsZUNvbHVtbigpIHtcbiAgICBpZiAodGhpcy5jb250ZXh0LnRhYmxlU3RvcmUuZ2V0U2VsZWN0YWJsZUNvbHVtbigpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBzZWxlY3RWYWx1ZSA9IHRoaXMucHJvcHMuY2VsbHNbdGhpcy5jb250ZXh0LnRhYmxlU3RvcmUuZ2V0U2VsZWN0YWJsZUNvbHVtbigpXS50b1N0cmluZygpO1xuICAgICAgdmFyIHNlbGVjdGFibGVTdHlsZXM7XG4gICAgICBpZih0aGlzLnByb3BzLmRpc3BsYXlUYWJsZSA9PT0gJ3Njcm9sbCcpIHtcbiAgICAgICAgc2VsZWN0YWJsZVN0eWxlcyA9IHtcbiAgICAgICAgICBwb3NpdGlvbjogYHJlbGF0aXZlYCxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybihcbiAgICAgICAgPEJvZHlTZWxlY3RhYmxlXG4gICAgICAgICAgdmFsdWU9e3NlbGVjdFZhbHVlfVxuICAgICAgICAgIGtleT17c2VsZWN0VmFsdWV9XG4gICAgICAgICAgc3R5bGU9e3NlbGVjdGFibGVTdHlsZXN9XG4gICAgICAgIC8+XG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgZGlzcGxheVZhbHVlRm9yKHZhbHVlKSB7XG4gICAgcmV0dXJuIFN0cmluZyh2YWx1ZSA9PT0gbnVsbCA/IFwiXCIgOiB2YWx1ZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdmFyIGNvbHVtbnMgPSB0aGlzLmNvbnRleHQudGFibGVTdG9yZS5nZXRDb2x1bW5zKCk7XG4gICAgdmFyIGNlbGxLZXlzID0gT2JqZWN0LmtleXMoY29sdW1ucyk7XG4gICAgdmFyIGNlbGxzID0gT2JqZWN0LmtleXMoY29sdW1ucykubWFwKGZ1bmN0aW9uKGNvbHVtbklkLCBpbmRleCkge1xuICAgICAgdmFyIGNlbGxTdHlsZXM7XG4gICAgICBpZih0aGlzLnByb3BzLmRpc3BsYXlUYWJsZSA9PT0gJ2ZpeCcgJiYgaW5kZXggPT0gKGNlbGxLZXlzLmxlbmd0aCAtMSkpIHtcbiAgICAgICAgY2VsbFN0eWxlcyA9IHtcbiAgICAgICAgICBwb3NpdGlvbjogYHJlbGF0aXZlYCxcbiAgICAgICAgICB6SW5kZXg6IDEsXG4gICAgICAgICAgd2hpdGVTcGFjZTogYG5vd3JhcGBcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYodGhpcy5wcm9wcy5kaXNwbGF5VGFibGUgPT09ICdzY3JvbGwnICYmIGluZGV4IDwgKGNlbGxLZXlzLmxlbmd0aCAtMSkpIHtcbiAgICAgICAgY2VsbFN0eWxlcyA9IHtcbiAgICAgICAgICBwb3NpdGlvbjogYHJlbGF0aXZlYCxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYodGhpcy5wcm9wcy5kaXNwbGF5VGFibGUgPT09ICdzY3JvbGwnICYmIGluZGV4ID09IChjZWxsS2V5cy5sZW5ndGggLTEpKSB7XG4gICAgICAgIGNlbGxTdHlsZXMgPSB7XG4gICAgICAgICAgd2hpdGVTcGFjZTogYG5vd3JhcGBcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEJvZHlDZWxsXG4gICAgICAgICAga2V5PXtjb2x1bW5JZH1cbiAgICAgICAgICB0eXBlPXtjb2x1bW5zW2NvbHVtbklkXS50eXBlfVxuICAgICAgICAgIHZhbHVlPXt0aGlzLmRpc3BsYXlWYWx1ZUZvcih0aGlzLnByb3BzLmNlbGxzW2NvbHVtbklkXSl9XG4gICAgICAgICAgc3R5bGU9e2NlbGxTdHlsZXN9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgdmFyIGRpc3BsYXlTZWxlY3RhYmxlQ29sdW1uID0gdGhpcy5kaXNwbGF5U2VsZWN0YWJsZUNvbHVtbigpO1xuICAgIHJldHVybiAoXG4gICAgICA8dHI+XG4gICAgICAgIHtkaXNwbGF5U2VsZWN0YWJsZUNvbHVtbn1cbiAgICAgICAge2NlbGxzfVxuICAgICAgPC90cj5cbiAgICApO1xuICB9XG59XG5cbkJvZHlSb3cucHJvcFR5cGVzID0ge1xuICBjZWxsczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuXG5Cb2R5Um93LmNvbnRleHRUeXBlcyA9IHtcbiAgdGFibGVTdG9yZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICB0YWJsZUFjdG9yOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG4iLCJleHBvcnQgY2xhc3MgQm9keVNlbGVjdGFibGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaXNDaGVja2VkOiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0Q2hlY2tlZFN0YXRlKCkpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcygpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0Q2hlY2tlZFN0YXRlKCkpO1xuICB9XG5cbiAgYWRkVG9PclJlbW92ZUZyb21TZWxlY3Rpb24oZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQudGFyZ2V0LmNoZWNrZWQpIHtcbiAgICAgIHRoaXMuY29udGV4dC50YWJsZVN0b3JlLnB1c2hWYWx1ZVRvU2VsZWN0ZWRSb3dzKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5jb250ZXh0LnRhYmxlU3RvcmUucmVtb3ZlRnJvbVNlbGVjdGVkUm93cyhldmVudC50YXJnZXQudmFsdWUpO1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0Q2hlY2tlZFN0YXRlKCkpO1xuICAgIHRoaXMuY29udGV4dC50YWJsZVN0b3JlLmVtaXRDaGFuZ2UoKTtcbiAgfVxuXG4gIGdldENoZWNrZWRTdGF0ZSgpIHtcbiAgICByZXR1cm4oXG4gICAgICB7XG4gICAgICAgIGlzQ2hlY2tlZDogdGhpcy5jb250ZXh0LnRhYmxlU3RvcmUudmFsdWVJblNlbGVjdGVkUm93cyh0aGlzLnByb3BzLnZhbHVlKVxuICAgICAgfVxuICAgICk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDx0ZCBzdHlsZT17dGhpcy5wcm9wcy5zdHlsZX0+XG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIHR5cGU9J2NoZWNrYm94J1xuICAgICAgICAgIHZhbHVlPXt0aGlzLnByb3BzLnZhbHVlfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmFkZFRvT3JSZW1vdmVGcm9tU2VsZWN0aW9uLmJpbmQodGhpcyl9XG4gICAgICAgICAgY2hlY2tlZD17dGhpcy5zdGF0ZS5pc0NoZWNrZWR9XG4gICAgICAgIC8+XG4gICAgICA8L3RkPlxuICAgICk7XG4gIH1cbn1cblxuQm9keVNlbGVjdGFibGUucHJvcFR5cGVzID0ge1xuICB2YWx1ZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkXG59O1xuXG5Cb2R5U2VsZWN0YWJsZS5jb250ZXh0VHlwZXMgPSB7XG4gIHRhYmxlU3RvcmU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgdGFibGVBY3RvcjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuIiwiZXhwb3J0IGNsYXNzIEhlYWRpbmdDZWxsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gIH1cblxuICBxdWVyeU5hbWUoKSB7XG4gICAgcmV0dXJuIFwib3JkZXJbXCIgKyB0aGlzLnByb3BzLnNvcnRhYmxlICsgXCJdXCI7XG4gIH1cblxuICBjdXJyZW50U29ydE9yZGVyKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQudGFibGVTdG9yZS5nZXRVcmwoKS5xdWVyeSh0cnVlKVt0aGlzLnF1ZXJ5TmFtZSgpXTtcbiAgfVxuXG4gIG5leHRTb3J0T3JkZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFNvcnRPcmRlcigpID09PSBcImFzY1wiID8gXCJkZXNjXCIgOiBcImFzY1wiO1xuICB9XG5cbiAgc29ydFRhYmxlKCkge1xuICAgIGlmICh0aGlzLnByb3BzLnNvcnRhYmxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuY29udGV4dC50YWJsZVN0b3JlLnNldFVybChcbiAgICAgICAgdGhpcy5jb250ZXh0LnRhYmxlU3RvcmUuZ2V0VXJsKCkucmVtb3ZlUXVlcnkoXG4gICAgICAgICAgL15vcmRlclxcWy4qXFxdL1xuICAgICAgICApLnNldFF1ZXJ5KFxuICAgICAgICAgIHRoaXMucXVlcnlOYW1lKCksXG4gICAgICAgICAgdGhpcy5uZXh0U29ydE9yZGVyKClcbiAgICAgICAgKVxuICAgICAgKTtcblxuICAgICAgdGhpcy5jb250ZXh0LnRhYmxlQWN0b3IuZmV0Y2hEYXRhKDEpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICB2YXIgY29udGVudCA9IHRoaXMucHJvcHMudmFsdWU7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5zb3J0YWJsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgc3R5bGUgPSB7Y3Vyc29yOiBcInBvaW50ZXJcIn1cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDx0aCBjbGFzc05hbWU9e1tcInNvcnRhYmxlXCIsIHRoaXMuY3VycmVudFNvcnRPcmRlcigpXS5qb2luKFwiIFwiKX0gb25DbGljaz17dGhpcy5zb3J0VGFibGUuYmluZCh0aGlzKX0gc3R5bGU9e09iamVjdC5hc3NpZ24oc3R5bGUsIHRoaXMucHJvcHMuc3R5bGUpfT5cbiAgICAgICAgICB7Y29udGVudH1cbiAgICAgICAgPC90aD5cbiAgICAgICk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHRoIHN0eWxlPXt0aGlzLnByb3BzLnN0eWxlfT5cbiAgICAgICAgICB7Y29udGVudH1cbiAgICAgICAgPC90aD5cbiAgICAgICk7XG4gICAgfVxuICB9XG59XG5cbkhlYWRpbmdDZWxsLnByb3BUeXBlcyA9IHtcbiAgdmFsdWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZFxufTtcblxuSGVhZGluZ0NlbGwuY29udGV4dFR5cGVzID0ge1xuICB0YWJsZVN0b3JlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIHRhYmxlQWN0b3I6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufVxuIiwiaW1wb3J0IHtIZWFkaW5nQ2VsbH0gZnJvbSBcIi4vSGVhZGluZ0NlbGwucmVhY3RcIjtcbmltcG9ydCB7SGVhZGluZ1NlbGVjdGFibGV9IGZyb20gXCIuL0hlYWRpbmdTZWxlY3RhYmxlLnJlYWN0XCI7XG5cbmV4cG9ydCBjbGFzcyBIZWFkaW5nUm93IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gIH1cblxuICBkaXNwbGF5U2VsZWN0YWJsZUNvbHVtbigpIHtcbiAgICB2YXIgc2VsZWN0YWJsZUNvbHVtbiA9IHRoaXMuY29udGV4dC50YWJsZVN0b3JlLmdldFNlbGVjdGFibGVDb2x1bW4oKTtcbiAgICBpZiAoc2VsZWN0YWJsZUNvbHVtbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgc2VsZWN0YWJsZUtleSA9ICdzZWxlY3RfYWxsXycgKyB0aGlzLmNvbnRleHQudGFibGVTdG9yZS5nZXRDdXJyZW50UGFnZSgpO1xuICAgICAgdmFyIHNlbGVjdGFibGVTdHlsZXM7XG4gICAgICBpZih0aGlzLnByb3BzLmRpc3BsYXlUYWJsZSA9PT0gJ3Njcm9sbCcpIHtcbiAgICAgICAgc2VsZWN0YWJsZVN0eWxlcyA9IHtcbiAgICAgICAgICBwb3NpdGlvbjogYHJlbGF0aXZlYCxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybihcbiAgICAgICAgPEhlYWRpbmdTZWxlY3RhYmxlXG4gICAgICAgICAgaW5kZXg9e3RoaXMucHJvcHMua2V5fVxuICAgICAgICAgIGtleT17c2VsZWN0YWJsZUtleX1cbiAgICAgICAgICBzdHlsZT17c2VsZWN0YWJsZVN0eWxlc31cbiAgICAgICAgLz5cbiAgICAgIClcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdmFyIGNlbGxLZXlzID0gT2JqZWN0LmtleXModGhpcy5wcm9wcy5jZWxscyk7XG5cbiAgICB2YXIgY2VsbHMgPSBjZWxsS2V5cy5tYXAoZnVuY3Rpb24oY2VsbElkLCBpbmRleCkge1xuICAgICAgdmFyIGNlbGxTdHlsZXM7XG4gICAgICBpZih0aGlzLnByb3BzLmRpc3BsYXlUYWJsZSA9PT0gJ2ZpeCcgJiYgaW5kZXggPT0gKGNlbGxLZXlzLmxlbmd0aCAtMSkpIHtcbiAgICAgICAgY2VsbFN0eWxlcyA9IHtcbiAgICAgICAgICBwb3NpdGlvbjogYHJlbGF0aXZlYCxcbiAgICAgICAgICB6SW5kZXg6IDEsXG4gICAgICAgICAgd2hpdGVTcGFjZTogYG5vd3JhcGBcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYodGhpcy5wcm9wcy5kaXNwbGF5VGFibGUgPT09ICdzY3JvbGwnICYmIGluZGV4IDwgKGNlbGxLZXlzLmxlbmd0aCAtMSkpIHtcbiAgICAgICAgY2VsbFN0eWxlcyA9IHtcbiAgICAgICAgICBwb3NpdGlvbjogYHJlbGF0aXZlYCxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYodGhpcy5wcm9wcy5kaXNwbGF5VGFibGUgPT09ICdzY3JvbGwnICYmIGluZGV4ID09IChjZWxsS2V5cy5sZW5ndGggLTEpKSB7XG4gICAgICAgIGNlbGxTdHlsZXMgPSB7XG4gICAgICAgICAgd2hpdGVTcGFjZTogYG5vd3JhcGBcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEhlYWRpbmdDZWxsXG4gICAgICAgICAga2V5PXtjZWxsSWR9XG4gICAgICAgICAgdHlwZT17dGhpcy5wcm9wcy5jZWxsc1tjZWxsSWRdLnR5cGV9XG4gICAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMuY2VsbHNbY2VsbElkXS5oZWFkaW5nfVxuICAgICAgICAgIHNvcnRhYmxlPXt0aGlzLnByb3BzLmNlbGxzW2NlbGxJZF0uc29ydGFibGV9XG4gICAgICAgICAgc3R5bGU9e2NlbGxTdHlsZXN9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgdmFyIGRpc3BsYXlTZWxlY3RhYmxlQ29sdW1uID0gdGhpcy5kaXNwbGF5U2VsZWN0YWJsZUNvbHVtbigpO1xuICAgIHJldHVybiAoXG4gICAgICA8dGhlYWQ+XG4gICAgICAgIDx0cj5cbiAgICAgICAgICB7ZGlzcGxheVNlbGVjdGFibGVDb2x1bW59XG4gICAgICAgICAge2NlbGxzfVxuICAgICAgICA8L3RyPlxuICAgICAgPC90aGVhZD5cbiAgICApO1xuICB9XG59XG5cbkhlYWRpbmdSb3cucHJvcFR5cGVzID0ge1xuICBjZWxsczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuXG5IZWFkaW5nUm93LmNvbnRleHRUeXBlcyA9IHtcbiAgdGFibGVTdG9yZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICB0YWJsZUFjdG9yOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG4iLCJleHBvcnQgY2xhc3MgSGVhZGluZ1NlbGVjdGFibGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaXNDaGVja2VkOiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0Q2hlY2tlZFN0YXRlKCkpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcygpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0Q2hlY2tlZFN0YXRlKCkpO1xuICB9XG5cbiAgYWRkUmVtb3ZlQWxsRnJvbVNlbGVjdGlvbihldmVudCkge1xuICAgIGlmIChldmVudC50YXJnZXQuY2hlY2tlZCkge1xuICAgICAgdGhpcy5jb250ZXh0LnRhYmxlU3RvcmUucHVzaEFsbFZhbHVlc1RvU2VsZWN0ZWRSb3dzKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5jb250ZXh0LnRhYmxlU3RvcmUucmVtb3ZlQWxsVmFsdWVzRnJvbVNlbGVjdGVkUm93cygpO1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0Q2hlY2tlZFN0YXRlKCkpO1xuICAgIHRoaXMuY29udGV4dC50YWJsZVN0b3JlLmVtaXRDaGFuZ2UoKTtcbiAgfVxuXG4gIGdldENoZWNrZWRTdGF0ZSgpIHtcbiAgICByZXR1cm4oXG4gICAgICB7XG4gICAgICAgIGlzQ2hlY2tlZDogdGhpcy5jb250ZXh0LnRhYmxlU3RvcmUuYWxsU2VsZWN0YWJsZVZhbHVlc0luU2VsZWN0ZWRSb3dzKClcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8dGggc3R5bGU9e3RoaXMucHJvcHMuc3R5bGV9PlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICB0eXBlPSdjaGVja2JveCdcbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5hZGRSZW1vdmVBbGxGcm9tU2VsZWN0aW9uLmJpbmQodGhpcyl9XG4gICAgICAgICAgY2hlY2tlZD17dGhpcy5zdGF0ZS5pc0NoZWNrZWR9XG4gICAgICAgIC8+XG4gICAgICA8L3RoPlxuICAgICk7XG4gIH1cbn1cblxuSGVhZGluZ1NlbGVjdGFibGUuY29udGV4dFR5cGVzID0ge1xuICB0YWJsZVN0b3JlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIHRhYmxlQWN0b3I6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcbiIsImV4cG9ydCBjbGFzcyBQYWdpbmF0aW9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5NQVhfUEFHRV9MSU5LUyA9IDExO1xuICB9XG5cbiAgZ29Ub0ZpcnN0UGFnZSgpIHtcbiAgICB0aGlzLmNvbnRleHQudGFibGVBY3Rvci5mZXRjaERhdGEoMSk7XG4gIH1cblxuICBnb1RvTGFzdFBhZ2UoKSB7XG4gICAgdGhpcy5jb250ZXh0LnRhYmxlQWN0b3IuZmV0Y2hEYXRhKHRoaXMucHJvcHMudG90YWxQYWdlcyk7XG4gIH1cblxuICBnb1RvUGFnZShldmVudCkge1xuICAgIHRoaXMuY29udGV4dC50YWJsZUFjdG9yLmZldGNoRGF0YShldmVudC50YXJnZXQuaW5uZXJIVE1MKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICB2YXIgcGFnZUxpbmtzID0gW107XG5cbiAgICBwYWdlTGlua3MucHVzaChcbiAgICAgIDxsaSBrZXk9XCJmaXJzdFwiPlxuICAgICAgICA8YSBvbkNsaWNrPXt0aGlzLmdvVG9GaXJzdFBhZ2UuYmluZCh0aGlzKX0gc3R5bGU9eyB7Y3Vyc29yOiBcInBvaW50ZXJcIn0gfT5GaXJzdDwvYT5cbiAgICAgIDwvbGk+XG4gICAgKTtcblxuICAgIHZhciBsb3dlc3RQYWdlTGluayA9IDEsXG4gICAgICAgIGhpZ2hlc3RQYWdlTGluayA9IDE7XG5cbiAgICBpZiAodGhpcy5wcm9wcy50b3RhbFBhZ2VzIDwgdGhpcy5NQVhfUEFHRV9MSU5LUykge1xuICAgICAgbG93ZXN0UGFnZUxpbmsgPSAxO1xuICAgICAgaGlnaGVzdFBhZ2VMaW5rID0gdGhpcy5wcm9wcy50b3RhbFBhZ2VzO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5jdXJyZW50UGFnZSA8PSBNYXRoLmZsb29yKHRoaXMuTUFYX1BBR0VfTElOS1MgLyAyKSkge1xuICAgICAgbG93ZXN0UGFnZUxpbmsgPSAxO1xuICAgICAgaGlnaGVzdFBhZ2VMaW5rID0gdGhpcy5NQVhfUEFHRV9MSU5LUztcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMuY3VycmVudFBhZ2UgPj0gdGhpcy5wcm9wcy50b3RhbFBhZ2VzIC0gTWF0aC5mbG9vcih0aGlzLk1BWF9QQUdFX0xJTktTIC8gMikpIHtcbiAgICAgIGxvd2VzdFBhZ2VMaW5rID0gdGhpcy5wcm9wcy50b3RhbFBhZ2VzIC0gdGhpcy5NQVhfUEFHRV9MSU5LUztcbiAgICAgIGhpZ2hlc3RQYWdlTGluayA9IHRoaXMucHJvcHMudG90YWxQYWdlcztcbiAgICB9IGVsc2Uge1xuICAgICAgbG93ZXN0UGFnZUxpbmsgPSB0aGlzLnByb3BzLmN1cnJlbnRQYWdlIC0gTWF0aC5mbG9vcih0aGlzLk1BWF9QQUdFX0xJTktTIC8gMik7XG4gICAgICBoaWdoZXN0UGFnZUxpbmsgPSBsb3dlc3RQYWdlTGluayArIHRoaXMuTUFYX1BBR0VfTElOS1M7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgcGFnZSA9IGxvd2VzdFBhZ2VMaW5rLCBjbGFzc2VzID0gXCJcIjsgcGFnZSA8PSBoaWdoZXN0UGFnZUxpbms7IHBhZ2UrKywgY2xhc3NlcyA9IFwiXCIpIHtcbiAgICAgIGlmIChwYWdlID09PSB0aGlzLnByb3BzLmN1cnJlbnRQYWdlKSB7XG4gICAgICAgIGNsYXNzZXMgPSBcImFjdGl2ZVwiO1xuICAgICAgfVxuICAgICAgcGFnZUxpbmtzLnB1c2goXG4gICAgICAgIDxsaSBjbGFzc05hbWU9e2NsYXNzZXN9IGtleT17cGFnZX0+XG4gICAgICAgICAgPGEgb25DbGljaz17dGhpcy5nb1RvUGFnZS5iaW5kKHRoaXMpfSBzdHlsZT17IHtjdXJzb3I6IFwicG9pbnRlclwifSB9ID57cGFnZX08L2E+XG4gICAgICAgIDwvbGk+XG4gICAgICApO1xuICAgIH1cblxuICAgIHBhZ2VMaW5rcy5wdXNoKFxuICAgICAgPGxpIGtleT1cImxhc3RcIj5cbiAgICAgICAgPGEgb25DbGljaz17dGhpcy5nb1RvTGFzdFBhZ2UuYmluZCh0aGlzKX0gc3R5bGU9eyB7Y3Vyc29yOiBcInBvaW50ZXJcIn0gfT5MYXN0PC9hPlxuICAgICAgPC9saT5cbiAgICApO1xuXG5cbiAgICByZXR1cm4gKFxuICAgICAgPG5hdj5cbiAgICAgICAgPHVsIGNsYXNzTmFtZT1cInBhZ2luYXRpb25cIj5cbiAgICAgICAgICB7cGFnZUxpbmtzfVxuICAgICAgICA8L3VsPlxuICAgICAgPC9uYXY+XG4gICAgKTtcbiAgfVxufVxuXG5QYWdpbmF0aW9uLnByb3BUeXBlcyA9IHtcbiAgY3VycmVudFBhZ2U6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgdG90YWxQYWdlczogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkXG59O1xuXG5QYWdpbmF0aW9uLmNvbnRleHRUeXBlcyA9IHtcbiAgdGFibGVBY3RvcjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICB0YWJsZVN0b3JlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG4iLCJpbXBvcnQge0JvZHl9IGZyb20gXCIuL0JvZHkucmVhY3RcIjtcbmltcG9ydCB7VGFibGVDYXB0aW9ufSBmcm9tIFwiLi9UYWJsZUNhcHRpb24ucmVhY3RcIjtcbmltcG9ydCB7SGVhZGluZ1Jvd30gZnJvbSBcIi4vSGVhZGluZ1Jvdy5yZWFjdFwiO1xuaW1wb3J0IHtQYWdpbmF0aW9ufSBmcm9tIFwiLi9QYWdpbmF0aW9uLnJlYWN0XCI7XG5pbXBvcnQgKiBhcyBUYWJsZUV2ZW50IGZyb20gXCIuLi8uLi9ldmVudHMvVGFibGVFdmVudFwiO1xuXG5leHBvcnQgY2xhc3MgVGFibGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgY3VycmVudFBhZ2U6IDEsXG4gICAgICB0b3RhbFBhZ2VzOiAxXG4gICAgfTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICB0aGlzLmNvbnRleHQudGFibGVBY3Rvci5mZXRjaERhdGEoKTtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0U3RhdGVGcm9tU3RvcmVzKCkpO1xuICAgIHRoaXMuY29udGV4dC50YWJsZVN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMub25DaGFuZ2UuYmluZCh0aGlzKSk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgVGFibGVFdmVudC50YWJsZVVwZGF0ZWQoKTtcbiAgfVxuXG4gIG9uQ2hhbmdlKCkge1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5nZXRTdGF0ZUZyb21TdG9yZXMoKSk7XG4gIH1cblxuICBnZXRTdGF0ZUZyb21TdG9yZXMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbHVtbkhlYWRpbmdzOiB0aGlzLmNvbnRleHQudGFibGVTdG9yZS5nZXRDb2x1bW5zKCksXG4gICAgICByb3dzOiB0aGlzLmNvbnRleHQudGFibGVTdG9yZS5nZXRSb3dzKCksXG4gICAgICBjdXJyZW50UGFnZTogdGhpcy5jb250ZXh0LnRhYmxlU3RvcmUuZ2V0Q3VycmVudFBhZ2UoKSxcbiAgICAgIHRvdGFsUGFnZXM6IHRoaXMuY29udGV4dC50YWJsZVN0b3JlLmdldFRvdGFsUGFnZXMoKSxcbiAgICAgIHRhYmxlQ2FwdGlvbjogdGhpcy5jb250ZXh0LnRhYmxlU3RvcmUuZ2V0VGFibGVDYXB0aW9uKCksXG4gICAgICBmaXhSaWdodENvbHVtbjogdGhpcy5jb250ZXh0LnRhYmxlU3RvcmUuZ2V0Rml4UmlnaHRDb2x1bW4oKVxuICAgIH07XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdmFyIGhlYWRpbmdzID0gdGhpcy5zdGF0ZS5jb2x1bW5IZWFkaW5ncztcbiAgICB2YXIgdGFibGVDYXB0aW9uID0gdGhpcy5zdGF0ZS50YWJsZUNhcHRpb247XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5maXhSaWdodENvbHVtbiA9PT0gJ3RydWUnKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsIHBhbmVsLXJlc3BvbnNpdmVcIj5cbiAgICAgICAgICA8VGFibGVDYXB0aW9uIHZhbHVlPXt0YWJsZUNhcHRpb259IG91dHB1dERpdj17dHJ1ZX0gLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRhYmxlLXJlc3BvbnNpdmVcIiBzdHlsZT17e3Bvc2l0aW9uOiBgcmVsYXRpdmVgfX0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246IGBhYnNvbHV0ZWAsIHJpZ2h0OiAwLCBtaW5XaWR0aDogYDEwMCVgfX0+XG4gICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ0YWJsZSB0YWJsZS1ob3ZlciB0YWJsZS1zdHJpcGVkXCI+XG4gICAgICAgICAgICAgICAgPEhlYWRpbmdSb3cgY2VsbHM9e2hlYWRpbmdzfSBkaXNwbGF5VGFibGU9eydmaXgnfSAvPlxuICAgICAgICAgICAgICAgIDxCb2R5IHJvd3M9e3RoaXMuc3RhdGUucm93c30gZGlzcGxheVRhYmxlPXsnZml4J30gLz5cbiAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e292ZXJmbG93WDogYGF1dG9gfX0+XG4gICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ0YWJsZSB0YWJsZS1ob3ZlciB0YWJsZS1zdHJpcGVkXCI+XG4gICAgICAgICAgICAgICAgPEhlYWRpbmdSb3cgY2VsbHM9e2hlYWRpbmdzfSBkaXNwbGF5VGFibGU9eydzY3JvbGwnfSAvPlxuICAgICAgICAgICAgICAgIDxCb2R5IHJvd3M9e3RoaXMuc3RhdGUucm93c30gZGlzcGxheVRhYmxlPXsnc2Nyb2xsJ30gLz5cbiAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxQYWdpbmF0aW9uIGN1cnJlbnRQYWdlPXt0aGlzLnN0YXRlLmN1cnJlbnRQYWdlfSB0b3RhbFBhZ2VzPXt0aGlzLnN0YXRlLnRvdGFsUGFnZXN9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsIHBhbmVsLXJlc3BvbnNpdmVcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRhYmxlLXJlc3BvbnNpdmVcIj5cbiAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ0YWJsZSB0YWJsZS1ob3ZlciB0YWJsZS1zdHJpcGVkXCI+XG4gICAgICAgICAgICAgIDxUYWJsZUNhcHRpb24gdmFsdWU9e3RhYmxlQ2FwdGlvbn0gLz5cbiAgICAgICAgICAgICAgPEhlYWRpbmdSb3cgY2VsbHM9e2hlYWRpbmdzfSAvPlxuICAgICAgICAgICAgICA8Qm9keSByb3dzPXt0aGlzLnN0YXRlLnJvd3N9IC8+XG4gICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgPFBhZ2luYXRpb24gY3VycmVudFBhZ2U9e3RoaXMuc3RhdGUuY3VycmVudFBhZ2V9IHRvdGFsUGFnZXM9e3RoaXMuc3RhdGUudG90YWxQYWdlc30gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuXG5UYWJsZS5jb250ZXh0VHlwZXMgPSB7XG4gIHRhYmxlQWN0b3I6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgdGFibGVTdG9yZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuXG4iLCJpbXBvcnQge1F1aWNrRmlsdGVyc30gZnJvbSBcIi4uL1F1aWNrRmlsdGVycy9RdWlja0ZpbHRlcnMucmVhY3RcIjtcblxuZXhwb3J0IGNsYXNzIFRhYmxlQ2FwdGlvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHZhciBjb250ZW50ID0gdGhpcy5wcm9wcy52YWx1ZTtcbiAgICBpZih0aGlzLnByb3BzLm91dHB1dERpdikge1xuICAgICAgaWYoY29udGVudCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjbGVhcmZpeCcgc3R5bGU9e3ttYXJnaW5Cb3R0b206IGA1cHhgfX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncHVsbC1sZWZ0Jz5cbiAgICAgICAgICAgICAgICB7Y29udGVudH1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdwdWxsLXJpZ2h0Jz5cbiAgICAgICAgICAgICAgICA8UXVpY2tGaWx0ZXJzIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPGRpdj48L2Rpdj5cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpZiAoY29udGVudCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxjYXB0aW9uPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3B1bGwtbGVmdCc+XG4gICAgICAgICAgICAgIHtjb250ZW50fVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncHVsbC1yaWdodCc+XG4gICAgICAgICAgICAgIDxRdWlja0ZpbHRlcnMgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvY2FwdGlvbj5cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxjYXB0aW9uIGhpZGRlbiAvPlxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHRhYmxlVXBkYXRlZCgpIHtcbiAgdmFyIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gIGV2ZW50LmluaXRFdmVudCgncmVhY3QtZmlsdGVyYmFyOnRhYmxlLXVwZGF0ZWQnLCB0cnVlLCB0cnVlKTtcbiAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG59IiwidmFyIHVyaSA9IHJlcXVpcmUoXCJVUklqc1wiKTtcblxuZXhwb3J0IGNsYXNzIEZpbHRlclZlcmlmaWNhdG9yIHtcbiAgY29uc3RydWN0b3IoY29uZmlndXJhdGlvbkZpbHRlcnMsIGZpbHRlcnNUb0FwcGx5ID0gbnVsbCkge1xuICAgIHRoaXMuY29uZmlndXJhdGlvbkZpbHRlcnMgPSBjb25maWd1cmF0aW9uRmlsdGVycztcbiAgICB0aGlzLmZpbHRlcnNUb0FwcGx5ID0gZmlsdGVyc1RvQXBwbHkgfHwgdGhpcy51cmxGaWx0ZXJzKCk7XG4gIH1cblxuICB2ZXJpZnkoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuZmlsdGVyc1RvQXBwbHkpXG4gICAgICAgICAgICAuZXZlcnkoZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy52YWxpZGF0ZUZpbHRlcih0aGlzLmZpbHRlcnNUb0FwcGx5W2ldKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG4gIH1cblxuICB2YWxpZGF0ZUZpbHRlcihhcHBsaWVkRmlsdGVyKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuY29uZmlndXJhdGlvbkZpbHRlcnMpXG4gICAgICAgICAgICAuc29tZShmdW5jdGlvbihmaWx0ZXJVaWQpIHtcbiAgICAgICAgICAgICAgdmFyIGNvbmZGaWx0ZXIgPSB0aGlzLmNvbmZpZ3VyYXRpb25GaWx0ZXJzW2ZpbHRlclVpZF07XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgdGhpcy52YWxpZGF0ZUZpbHRlclByb3BlcnRpZXMoYXBwbGllZEZpbHRlci5maWVsZCwgY29uZkZpbHRlci5maWVsZCkgJiZcbiAgICAgICAgICAgICAgICB0aGlzLnZhbGlkYXRlRmlsdGVyUHJvcGVydGllcyhhcHBsaWVkRmlsdGVyLnR5cGUsIGNvbmZGaWx0ZXIudHlwZSkgJiZcbiAgICAgICAgICAgICAgICB0aGlzLnZhbGlkYXRlRmlsdGVyUHJvcGVydGllcyhhcHBsaWVkRmlsdGVyLnVpZCwgZmlsdGVyVWlkKVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIHZhbGlkYXRlRmlsdGVyUHJvcGVydGllcyhhcHBsaWVkRmlsdGVyUHJvcGVydHksIGNvbmZGaWx0ZXJQcm9wZXJ0eSkge1xuICAgIHJldHVybiAodHlwZW9mIGFwcGxpZWRGaWx0ZXJQcm9wZXJ0eSA9PSAndW5kZWZpbmVkJyB8fFxuICAgICAgICAgICAgICAgICAgIGFwcGxpZWRGaWx0ZXJQcm9wZXJ0eSA9PSBjb25mRmlsdGVyUHJvcGVydHkpO1xuICB9XG5cbiAgdXJsRmlsdGVycygpIHtcbiAgICB2YXIgdXJsRmlsdGVyc0pzb24gPSB1cmkod2luZG93LmxvY2F0aW9uKS5xdWVyeSh0cnVlKS5xO1xuICAgIHJldHVybiB1cmxGaWx0ZXJzSnNvbiAmJiBKU09OLnBhcnNlKHVybEZpbHRlcnNKc29uKSB8fCB7fTtcbiAgfVxufVxuXG5cbiIsImV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5TW9kYWxGb3JEYXRhKGRhdGEpIHtcbiAgbGV0IG1vZGFsQ29udGFpbmVyID0gJChcIiNtb2RhbFwiKTtcbiAgbGV0IG1vZGFsID0gJChcIi5tb2RhbFwiLCBtb2RhbENvbnRhaW5lcik7XG5cbiAgbW9kYWxDb250YWluZXIub24oXCJhamF4OnN1Y2Nlc3NcIiwgXCIubW9kYWwtY29udGVudCBmb3JtXCIsIGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIHhocikge1xuICAgIG1vZGFsLm1vZGFsKFwiaGlkZVwiKTtcbiAgfSk7XG5cbiAgbW9kYWwuaHRtbChkYXRhKTtcbiAgbW9kYWwubW9kYWwoKTtcbn1cbiIsInZhciB1cmkgPSByZXF1aXJlKFwiVVJJanNcIik7XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVBcHBsaWNhdGlvblVybFN0YXRlKHVybCkge1xuICBoaXN0b3J5LnB1c2hTdGF0ZSh7fSwgXCJcIiwgd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIHVybCk7XG4gIGxvY2FsU3RvcmFnZVt3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFwvL2csIFwiXCIpXSA9IHVybC5zZWFyY2goKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVVybFNlYXJjaCh1cmwsIGZpZWxkLCB2YWx1ZSkge1xuICByZXR1cm4gdXJpKHVybCkucmVtb3ZlU2VhcmNoKGZpZWxkKS5hZGRTZWFyY2goZmllbGQsIHZhbHVlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZGlyZWN0VXJsKHVybCkge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdXJsO1xufVxuIiwiZXhwb3J0IGNsYXNzIEJhdGNoQWN0aW9uc1N0b3JlIHtcbiAgY29uc3RydWN0b3IoY29uZmlndXJhdGlvbikge1xuICAgIHRoaXMuYWN0aW9ucyA9IGNvbmZpZ3VyYXRpb24uYWN0aW9ucztcbiAgfVxuXG4gIGdldEFjdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aW9ucztcbiAgfVxufVxuIiwiaW1wb3J0IHtnZXRTYXZlZFNlYXJjaGVzfSBmcm9tIFwiLi4vY2xpZW50cy9TZWFyY2hDbGllbnRcIjtcblxuZXhwb3J0IGNsYXNzIEZpbHRlckJhclN0b3JlIHtcbiAgY29uc3RydWN0b3IoY29uZmlndXJhdGlvbikge1xuICAgIHRoaXMuQ0hBTkdFX0VWRU5UID0gXCJjaGFuZ2VcIjtcbiAgICB0aGlzLmV2ZW50RW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIHRoaXMuaWQgPSBjb25maWd1cmF0aW9uLmlkO1xuICAgIHRoaXMucGVyc2lzdGVudCA9IGNvbmZpZ3VyYXRpb24ucGVyc2lzdGVudDtcbiAgICB0aGlzLnVybCA9IGNvbmZpZ3VyYXRpb24uc2VhcmNoVXJsO1xuICAgIHRoaXMuc2VhcmNoVXJsID0gY29uZmlndXJhdGlvbi5zZWFyY2hVcmw7XG4gICAgdGhpcy5zYXZlZFNlYXJjaGVzVXJsID0gY29uZmlndXJhdGlvbi5zYXZlZFNlYXJjaGVzVXJsO1xuICAgIHRoaXMuY29uZmlndXJhdGlvblVybCA9IGNvbmZpZ3VyYXRpb24uY29uZmlndXJhdGlvblVybDtcbiAgICB0aGlzLmV4cG9ydFJlc3VsdHNVcmwgPSBjb25maWd1cmF0aW9uLmV4cG9ydFJlc3VsdHNVcmw7XG4gICAgdGhpcy5leHBvcnRQYWdlTGltaXQgPSBjb25maWd1cmF0aW9uLmV4cG9ydFBhZ2VMaW1pdDtcbiAgICB0aGlzLmV4cG9ydFBhZ2VMaW1pdEV4Y2VlZGVkTWVzc2FnZSA9IGNvbmZpZ3VyYXRpb24uZXhwb3J0UGFnZUxpbWl0RXhjZWVkZWRNZXNzYWdlO1xuICAgIHRoaXMuZmlsdGVycyA9IGNvbmZpZ3VyYXRpb24uZmlsdGVycztcbiAgICB0aGlzLnF1aWNrRmlsdGVycyA9IGNvbmZpZ3VyYXRpb24ucXVpY2tGaWx0ZXJzIHx8IHt9O1xuXG4gICAgaWYgKHRoaXMuc2F2ZWRTZWFyY2hlc1VybCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBnZXRTYXZlZFNlYXJjaGVzKHRoaXMuc2F2ZWRTZWFyY2hlc1VybCwgdGhpcy5zZXRTYXZlZFNlYXJjaGVzLmJpbmQodGhpcykpO1xuICAgIH1cbiAgfVxuXG4gICplbmFibGVkRmlsdGVycygpIHtcbiAgICBmb3IgKHZhciBmaWx0ZXJVaWQgaW4gdGhpcy5maWx0ZXJzKSB7XG4gICAgICBpZiAodGhpcy5maWx0ZXJzLmhhc093blByb3BlcnR5KGZpbHRlclVpZCkgJiYgdGhpcy5maWx0ZXJzW2ZpbHRlclVpZF0uZW5hYmxlZCkge1xuICAgICAgICB5aWVsZCBbIGZpbHRlclVpZCwgdGhpcy5maWx0ZXJzW2ZpbHRlclVpZF0gXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAqZGlzYWJsZWRGaWx0ZXJzKCkge1xuICAgIGZvciAodmFyIGZpbHRlclVpZCBpbiB0aGlzLmZpbHRlcnMpIHtcbiAgICAgIGlmICh0aGlzLmZpbHRlcnMuaGFzT3duUHJvcGVydHkoZmlsdGVyVWlkKSAmJiAhdGhpcy5maWx0ZXJzW2ZpbHRlclVpZF0uZW5hYmxlZCkge1xuICAgICAgICB5aWVsZCBbIGZpbHRlclVpZCwgdGhpcy5maWx0ZXJzW2ZpbHRlclVpZF0gXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAqc2VsZWN0RmlsdGVycygpIHtcbiAgICBmb3IgKHZhciBmaWx0ZXJVaWQgaW4gdGhpcy5maWx0ZXJzKSB7XG4gICAgICBpZiAodGhpcy5maWx0ZXJzLmhhc093blByb3BlcnR5KGZpbHRlclVpZCkgJiYgdGhpcy5maWx0ZXJzW2ZpbHRlclVpZF0udXJsICE9PSBudWxsKSB7XG4gICAgICAgIHlpZWxkIHRoaXMuZmlsdGVyc1tmaWx0ZXJVaWRdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gICpxdWlja0ZpbHRlcnNHZW5lcmF0b3IocXVpY2tGaWx0ZXJzKSB7XG4gICAgZm9yIChsZXQgcXVpY2tGaWx0ZXIgb2YgcXVpY2tGaWx0ZXJzKSB7XG4gICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBxdWlja0ZpbHRlci5maWx0ZXJzKSB7XG4gICAgICAgIGlmIChxdWlja0ZpbHRlci5maWx0ZXJzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuICAgICAgICAgIHlpZWxkIFtxdWlja0ZpbHRlciwgcHJvcGVydHldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0SWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaWQ7XG4gIH1cblxuICBnZXRTZWFyY2hVcmwoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VhcmNoVXJsO1xuICB9XG5cbiAgZ2V0U2F2ZWRTZWFyY2hlc1VybCgpIHtcbiAgICByZXR1cm4gdGhpcy5zYXZlZFNlYXJjaGVzVXJsO1xuICB9XG5cbiAgZ2V0Q29uZmlndXJhdGlvblVybCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb25maWd1cmF0aW9uVXJsO1xuICB9XG5cbiAgZ2V0RXhwb3J0UmVzdWx0c1VybCgpIHtcbiAgICByZXR1cm4gdGhpcy5leHBvcnRSZXN1bHRzVXJsO1xuICB9XG5cbiAgZ2V0RXhwb3J0UGFnZUxpbWl0KCkge1xuICAgIHJldHVybiBOdW1iZXIodGhpcy5leHBvcnRQYWdlTGltaXQpO1xuICB9XG5cbiAgZ2V0RXhwb3J0UGFnZUxpbWl0RXhjZWVkZWRNZXNzYWdlKCkge1xuICAgIHJldHVybiB0aGlzLmV4cG9ydFBhZ2VMaW1pdEV4Y2VlZGVkTWVzc2FnZSB8fCBcIkNhbm5vdCBFeHBvcnQgQ1NWLiBFeHBvcnRpbmcgaXMgbGltaXRlZCB0byBcIiArIHRoaXMuZ2V0RXhwb3J0UGFnZUxpbWl0KCkgKyBcIiBwYWdlKHMpIGF0IGEgdGltZS5cIjtcbiAgfVxuXG4gIGdldFNhdmVkU2VhcmNoZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2F2ZWRTZWFyY2hlcyB8fCBbXTtcbiAgfVxuXG4gIGdldFNhdmVkU2VhcmNoKHNlYXJjaElkKSB7XG4gICAgcmV0dXJuIHRoaXMuc2F2ZWRTZWFyY2hlc1tzZWFyY2hJZF07XG4gIH1cblxuICBnZXRGaWx0ZXIoZmlsdGVyVWlkKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyc1tmaWx0ZXJVaWRdO1xuICB9XG5cbiAgZ2V0RmlsdGVycygpIHtcbiAgICByZXR1cm4gdGhpcy5maWx0ZXJzO1xuICB9XG5cbiAgZ2V0RGlzYWJsZWQoKSB7XG4gICAgdmFyIGRpc2FibGVkRmlsdGVycyA9IHt9O1xuICAgIGZvciAodmFyIGZpbHRlclVpZCBpbiB0aGlzLmZpbHRlcnMpIHtcbiAgICAgIGlmICh0aGlzLmZpbHRlcnNbZmlsdGVyVWlkXS5lbmFibGVkICE9PSB0cnVlKSB7XG4gICAgICAgIGRpc2FibGVkRmlsdGVyc1tmaWx0ZXJVaWRdID0gdGhpcy5maWx0ZXJzW2ZpbHRlclVpZF07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkaXNhYmxlZEZpbHRlcnM7XG4gIH1cblxuICBnZXRFbmFibGVkKCkge1xuICAgIHZhciBlbmFibGVkRmlsdGVycyA9IHt9O1xuICAgIGZvciAodmFyIGZpbHRlclVpZCBpbiB0aGlzLmZpbHRlcnMpIHtcbiAgICAgIGlmICh0aGlzLmZpbHRlcnNbZmlsdGVyVWlkXS5lbmFibGVkID09PSB0cnVlKSB7XG4gICAgICAgIGVuYWJsZWRGaWx0ZXJzW2ZpbHRlclVpZF0gPSB0aGlzLmZpbHRlcnNbZmlsdGVyVWlkXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVuYWJsZWRGaWx0ZXJzO1xuICB9XG5cbiAgZ2V0UXVlcnkoKSB7XG4gICAgdmFyIGVuYWJsZWRGaWx0ZXJzID0gT2JqZWN0LmtleXModGhpcy5nZXRFbmFibGVkKCkpLm1hcChmdW5jdGlvbihmaWx0ZXJVaWQpIHtcbiAgICAgIHZhciBmaWx0ZXIgPSB0aGlzLmdldEZpbHRlcihmaWx0ZXJVaWQpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdWlkOiBmaWx0ZXJVaWQsXG4gICAgICAgIHR5cGU6IGZpbHRlci50eXBlLFxuICAgICAgICBmaWVsZDogZmlsdGVyLmZpZWxkLFxuICAgICAgICB2YWx1ZTogZmlsdGVyLnZhbHVlLFxuICAgICAgICBvcGVyYXRvcjogZmlsdGVyLm9wZXJhdG9yLFxuICAgICAgfTtcbiAgICB9LCB0aGlzKTtcbiAgICByZXR1cm4gZW5hYmxlZEZpbHRlcnMubGVuZ3RoID4gMCA/IEpTT04uc3RyaW5naWZ5KGVuYWJsZWRGaWx0ZXJzKSA6IFwiXCI7XG4gIH1cblxuICBpc0NvbmZpZ3VyYWJsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRDb25maWd1cmF0aW9uVXJsKCkgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlzRXhwb3J0YWJsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRFeHBvcnRSZXN1bHRzVXJsKCkgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHNldFNhdmVkU2VhcmNoZXMoc2F2ZWRTZWFyY2hlcykge1xuICAgIHRoaXMuc2F2ZWRTZWFyY2hlcyA9IHNhdmVkU2VhcmNoZXM7XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICBkaXNhYmxlQWxsRmlsdGVycygpIHtcbiAgICB2YXIgZW5hYmxlZEZpbHRlcnMgPSB0aGlzLmdldEVuYWJsZWQoKTtcblxuICAgIGZvciAodmFyIGZpbHRlclVpZCBpbiBlbmFibGVkRmlsdGVycykge1xuICAgICAgdGhpcy5kaXNhYmxlRmlsdGVyKGZpbHRlclVpZCk7XG4gICAgfVxuICAgIHRoaXMuZW1pdENoYW5nZSgpO1xuICB9XG5cbiAgZGlzYWJsZUZpbHRlcihmaWx0ZXJVaWQpIHtcbiAgICB0aGlzLmZpbHRlcnNbZmlsdGVyVWlkXS5lbmFibGVkID0gZmFsc2U7XG4gICAgdGhpcy5maWx0ZXJzW2ZpbHRlclVpZF0udmFsdWUgPSBcIlwiO1xuICAgIHRoaXMuZGVhY3RpdmF0ZVF1aWNrRmlsdGVyc0Jhc2VkT25SZW1vdmVkRmlsdGVyKGZpbHRlclVpZCwgdGhpcy5hY3RpdmVRdWlja0ZpbHRlcnMoKSk7XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICBlbmFibGVGaWx0ZXIoZmlsdGVyVWlkLCB2YWx1ZSkge1xuICAgIHRoaXMuZmlsdGVyc1tmaWx0ZXJVaWRdLmVuYWJsZWQgPSB0cnVlO1xuICAgIHRoaXMuZmlsdGVyc1tmaWx0ZXJVaWRdLnZhbHVlID0gdmFsdWUgfHwgdGhpcy5maWx0ZXJzW2ZpbHRlclVpZF0udmFsdWUgfHwgXCJcIjtcbiAgICB0aGlzLmVtaXRDaGFuZ2UoKTtcbiAgfVxuXG4gIGVuYWJsZVF1aWNrRmlsdGVyKHF1aWNrRmlsdGVyTmFtZSwgYmxvY2tOYW1lKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE9iamVjdC5rZXlzKHRoaXMucXVpY2tGaWx0ZXJzW2Jsb2NrTmFtZV0pLm1hcChmdW5jdGlvbihmaWx0ZXJOYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIHNlbGYucXVpY2tGaWx0ZXJzW2Jsb2NrTmFtZV1bZmlsdGVyTmFtZV0gPT0gXCJvYmplY3RcIikge1xuICAgICAgICBzZWxmLnF1aWNrRmlsdGVyc1tibG9ja05hbWVdW2ZpbHRlck5hbWVdLmFjdGl2ZSA9IGZhbHNlXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLnF1aWNrRmlsdGVyc1tibG9ja05hbWVdW3F1aWNrRmlsdGVyTmFtZV0uYWN0aXZlID0gdHJ1ZVxuICB9XG5cbiAgZGlzYWJsZUFsbFF1aWNrRmlsdGVycygpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgT2JqZWN0LmtleXMoc2VsZi5xdWlja0ZpbHRlcnMpLm1hcChmdW5jdGlvbihibG9ja05hbWUpIHtcbiAgICAgIE9iamVjdC5rZXlzKHNlbGYucXVpY2tGaWx0ZXJzW2Jsb2NrTmFtZV0pLm1hcChmdW5jdGlvbihmaWx0ZXJOYW1lKSB7XG4gICAgICAgIHNlbGYucXVpY2tGaWx0ZXJzW2Jsb2NrTmFtZV1bZmlsdGVyTmFtZV0uYWN0aXZlID0gZmFsc2VcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHVwZGF0ZUZpbHRlcihmaWx0ZXJVaWQsIHByb3BLZXksIHByb3BWYWx1ZSkge1xuICAgIHRoaXMuZmlsdGVyc1tmaWx0ZXJVaWRdW3Byb3BLZXldID0gcHJvcFZhbHVlO1xuICAgIGlmKHByb3BLZXkgPT09ICd2YWx1ZScpXG4gICAgICB0aGlzLmRlYWN0aXZhdGVRdWlja0ZpbHRlcnNCYXNlZE9uRmlsdGVyVmFsdWUoZmlsdGVyVWlkLCBwcm9wVmFsdWUsIHRoaXMuYWN0aXZlUXVpY2tGaWx0ZXJzKCkpO1xuICAgIHRoaXMuZW1pdENoYW5nZSgpO1xuICB9XG5cbiAgZGVhY3RpdmF0ZVF1aWNrRmlsdGVyc0Jhc2VkT25SZW1vdmVkRmlsdGVyKGZpbHRlck5hbWUsIHF1aWNrRmlsdGVycykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBmb3IgKHZhciBvdXRjb21lIG9mIHNlbGYucXVpY2tGaWx0ZXJzR2VuZXJhdG9yKHF1aWNrRmlsdGVycykpIHtcbiAgICAgIGxldCBxdWlja0ZpbHRlciA9IG91dGNvbWVbMF0sXG4gICAgICAgICAgcXVpY2tGaWx0ZXJOYW1lID0gb3V0Y29tZVsxXTtcbiAgICAgIGlmKHF1aWNrRmlsdGVyLmZpbHRlcnNbcXVpY2tGaWx0ZXJOYW1lXS5maWx0ZXIgPT09IGZpbHRlck5hbWUpXG4gICAgICAgIHNlbGYuaW5hY3RpdmF0ZVF1aWNrRmlsdGVyKHF1aWNrRmlsdGVyKTtcbiAgICB9XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICBkZWFjdGl2YXRlUXVpY2tGaWx0ZXJzQmFzZWRPbkZpbHRlclZhbHVlKGZpbHRlck5hbWUsIGZpbHRlclZhbHVlLCBxdWlja0ZpbHRlcnMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgZm9yICh2YXIgb3V0Y29tZSBvZiBzZWxmLnF1aWNrRmlsdGVyc0dlbmVyYXRvcihxdWlja0ZpbHRlcnMpKSB7XG4gICAgICBsZXQgcXVpY2tGaWx0ZXIgPSBvdXRjb21lWzBdLFxuICAgICAgICAgIHF1aWNrRmlsdGVyTmFtZSA9IG91dGNvbWVbMV07XG4gICAgICBzZWxmLmluYWN0aXZhdGVRdWlja0ZpbHRlcklmVmFsdWVDaGFuZ2VkKHF1aWNrRmlsdGVyLmZpbHRlcnNbcXVpY2tGaWx0ZXJOYW1lXSwgZmlsdGVyTmFtZSwgZmlsdGVyVmFsdWUsIHF1aWNrRmlsdGVyKTtcbiAgICB9XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICBpbmFjdGl2YXRlUXVpY2tGaWx0ZXJJZlZhbHVlQ2hhbmdlZChxdWlja0ZpbHRlckZpbHRlciwgZmlsdGVyTmFtZSwgZmlsdGVyVmFsdWUsIHF1aWNrRmlsdGVyKSB7XG4gICAgaWYgKHF1aWNrRmlsdGVyRmlsdGVyLmZpbHRlciA9PT0gZmlsdGVyTmFtZSkge1xuICAgICAgaWYgKHR5cGVvZiBxdWlja0ZpbHRlckZpbHRlci52YWx1ZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICBpZiAodGhpcy5yYW5nZUZpbHRlclZhbHVlc0NoYW5nZWQocXVpY2tGaWx0ZXJGaWx0ZXIudmFsdWUsIGZpbHRlclZhbHVlKSlcbiAgICAgICAgICB0aGlzLmluYWN0aXZhdGVRdWlja0ZpbHRlcihxdWlja0ZpbHRlcik7XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlclZhbHVlICE9PSBxdWlja0ZpbHRlckZpbHRlci52YWx1ZSkge1xuICAgICAgICB0aGlzLmluYWN0aXZhdGVRdWlja0ZpbHRlcihxdWlja0ZpbHRlcik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmFuZ2VGaWx0ZXJWYWx1ZXNDaGFuZ2VkKHZhbHVlMSwgdmFsdWUyKSB7XG4gICAgcmV0dXJuIHZhbHVlMS5mcm9tICE9PSB2YWx1ZTIuZnJvbSB8fCB2YWx1ZTEudG8gIT09IHZhbHVlMi50bztcbiAgfVxuXG4gIGluYWN0aXZhdGVRdWlja0ZpbHRlcihxdWlja0ZpbHRlcikge1xuICAgIHF1aWNrRmlsdGVyLmFjdGl2ZSA9IGZhbHNlO1xuICB9XG5cbiAgYWN0aXZlUXVpY2tGaWx0ZXJzKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgYWN0aXZlID0gW107XG4gICAgT2JqZWN0LmtleXMoc2VsZi5xdWlja0ZpbHRlcnMpLm1hcChmdW5jdGlvbihibG9ja05hbWUpIHtcbiAgICAgIE9iamVjdC5rZXlzKHNlbGYucXVpY2tGaWx0ZXJzW2Jsb2NrTmFtZV0pLm1hcChmdW5jdGlvbihmaWx0ZXJOYW1lKSB7XG4gICAgICAgIHZhciBxdWlja0ZpbHRlciA9IHNlbGYucXVpY2tGaWx0ZXJzW2Jsb2NrTmFtZV1bZmlsdGVyTmFtZV07XG4gICAgICAgIGlmKHF1aWNrRmlsdGVyLmFjdGl2ZSlcbiAgICAgICAgICBhY3RpdmUucHVzaChxdWlja0ZpbHRlcilcbiAgICAgIH0pXG4gICAgfSlcbiAgICByZXR1cm4gYWN0aXZlO1xuICB9XG5cbiAgZW1pdENoYW5nZSgpIHtcbiAgICB0aGlzLmV2ZW50RW1pdHRlci5lbWl0KHRoaXMuQ0hBTkdFX0VWRU5UKTtcbiAgfVxuXG4gIGFkZENoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5ldmVudEVtaXR0ZXIub24odGhpcy5DSEFOR0VfRVZFTlQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5ldmVudEVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIodGhpcy5DSEFOR0VfRVZFTlQsIGNhbGxiYWNrKTtcbiAgfVxufVxuIiwidmFyIHVyaSA9IHJlcXVpcmUoXCJVUklqc1wiKTtcblxuZnVuY3Rpb24gY2hhbmdlUGFnZSh1cmwsIHBhZ2UpIHtcbiAgcmV0dXJuIHVyaSh1cmwpLnJlbW92ZVNlYXJjaChcInBhZ2VcIikuYWRkU2VhcmNoKFwicGFnZVwiLCBwYWdlKTtcbn1cblxuZXhwb3J0IGNsYXNzIFRhYmxlU3RvcmUge1xuICBjb25zdHJ1Y3Rvcihjb25maWd1cmF0aW9uKSB7XG4gICAgdGhpcy5DSEFOR0VfRVZFTlQgPSBcImNoYW5nZVwiO1xuICAgIHRoaXMuZXZlbnRFbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgdGhpcy5yb3dzID0gW107XG4gICAgdGhpcy5jdXJyZW50UGFnZSA9IGNvbmZpZ3VyYXRpb24ucGFnZSB8fCAxO1xuICAgIHRoaXMudG90YWxQYWdlcyA9IDE7XG4gICAgdGhpcy5jb2x1bW5zID0gY29uZmlndXJhdGlvbi5jb2x1bW5zO1xuICAgIHRoaXMudXJsID0gY29uZmlndXJhdGlvbi5kYXRhVXJsO1xuICAgIHRoaXMuc2VsZWN0YWJsZSA9IGNvbmZpZ3VyYXRpb24uc2VsZWN0YWJsZTtcbiAgICB0aGlzLnNlbGVjdGVkUm93cyA9IFtdO1xuICAgIHRoaXMuZml4UmlnaHRDb2x1bW4gPSBjb25maWd1cmF0aW9uLmZpeFJpZ2h0Q29sdW1uO1xuICB9XG5cbiAgc2V0VXJsKHVybCkge1xuICAgIHRoaXMudXJsID0gdXJsO1xuICB9XG5cbiAgZ2V0VXJsKCkge1xuICAgIHJldHVybiBjaGFuZ2VQYWdlKHRoaXMudXJsLCB0aGlzLmN1cnJlbnRQYWdlKTtcbiAgfVxuXG4gIGdldENvbHVtbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29sdW1ucztcbiAgfVxuXG4gIHNldFJvd3Mocm93cykge1xuICAgIHRoaXMucm93cyA9IHJvd3M7XG4gIH1cblxuICBnZXRSb3dzKCkge1xuICAgIHJldHVybiB0aGlzLnJvd3M7XG4gIH1cblxuICBnZXRTZWxlY3RhYmxlVmFsdWVzRnJvbVJvd3MoKSB7XG4gICAgcmV0dXJuIHRoaXMucm93cy5tYXAoZnVuY3Rpb24ocm93KSB7XG4gICAgICByZXR1cm4gcm93W3RoaXMuc2VsZWN0YWJsZV0udG9TdHJpbmcoKVxuICAgIH0sIHRoaXMpO1xuICB9XG5cbiAgZ2V0Q3VycmVudFBhZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFBhZ2U7XG4gIH1cblxuICBnZXRUb3RhbFBhZ2VzKCkge1xuICAgIHJldHVybiB0aGlzLnRvdGFsUGFnZXM7XG4gIH1cblxuICBnZXRUYWJsZUNhcHRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudGFibGVDYXB0aW9uO1xuICB9XG5cbiAgZ2V0U2VsZWN0YWJsZUNvbHVtbigpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3RhYmxlO1xuICB9XG5cbiAgZ2V0U2VsZWN0ZWRSb3dzKCkge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGVkUm93cztcbiAgfVxuXG4gIGdldEZpeFJpZ2h0Q29sdW1uKCkge1xuICAgIHJldHVybiB0aGlzLmZpeFJpZ2h0Q29sdW1uO1xuICB9XG5cbiAgY2xlYXJTZWxlY3RlZFJvd3MoKSB7XG4gICAgdGhpcy5zZWxlY3RlZFJvd3MgPSBbXTtcbiAgfVxuXG4gIHB1c2hBbGxWYWx1ZXNUb1NlbGVjdGVkUm93cygpIHtcbiAgICB0aGlzLnJvd3MuZm9yRWFjaChmdW5jdGlvbihyb3cpIHtcbiAgICAgIHRoaXMucHVzaFZhbHVlVG9TZWxlY3RlZFJvd3Mocm93W3RoaXMuc2VsZWN0YWJsZV0udG9TdHJpbmcoKSk7XG4gICAgfSwgdGhpcyk7XG4gIH1cblxuICByZW1vdmVBbGxWYWx1ZXNGcm9tU2VsZWN0ZWRSb3dzKCkge1xuICAgIHRoaXMucm93cy5mb3JFYWNoKGZ1bmN0aW9uKHJvdykge1xuICAgICAgdGhpcy5yZW1vdmVGcm9tU2VsZWN0ZWRSb3dzKHJvd1t0aGlzLnNlbGVjdGFibGVdLnRvU3RyaW5nKCkpO1xuICAgIH0sIHRoaXMpO1xuICB9XG5cbiAgcHVzaFZhbHVlVG9TZWxlY3RlZFJvd3ModmFsdWUpIHtcbiAgICB2YXIgaW5kZXhPZlZhbHVlID0gdGhpcy5zZWxlY3RlZFJvd3MuaW5kZXhPZih2YWx1ZSk7XG4gICAgaWYgKGluZGV4T2ZWYWx1ZSA9PSAtMSkge1xuICAgICAgdGhpcy5zZWxlY3RlZFJvd3MucHVzaCh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlRnJvbVNlbGVjdGVkUm93cyh2YWx1ZSkge1xuICAgIHZhciBpbmRleE9mVmFsdWUgPSB0aGlzLnNlbGVjdGVkUm93cy5pbmRleE9mKHZhbHVlKTtcbiAgICBpZiAoaW5kZXhPZlZhbHVlID4gLTEpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRSb3dzLnNwbGljZShpbmRleE9mVmFsdWUsIDEpO1xuICAgIH1cbiAgfVxuXG4gIHZhbHVlSW5TZWxlY3RlZFJvd3ModmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3RlZFJvd3MuaW5kZXhPZih2YWx1ZSkgPiAtMTtcbiAgfVxuXG4gIGFsbFNlbGVjdGFibGVWYWx1ZXNJblNlbGVjdGVkUm93cygpIHtcbiAgICBpZiAodGhpcy5nZXRTZWxlY3RhYmxlVmFsdWVzRnJvbVJvd3MoKS5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRTZWxlY3RhYmxlVmFsdWVzRnJvbVJvd3MoKS5ldmVyeSh0aGlzLmlzSW5TZWxlY3RlZFJvd3MsIHRoaXMpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBpc0luU2VsZWN0ZWRSb3dzKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3RlZFJvd3MuaW5jbHVkZXMoZWxlbWVudCk7XG4gIH1cblxuICBzZXRTZWxlY3RlZFJvd3Moc2VsZWN0ZWRSb3dzKSB7XG4gICAgdGhpcy5zZWxlY3RlZFJvd3MgPSBzZWxlY3RlZFJvd3M7XG4gIH1cblxuICBzZXRUb3RhbFBhZ2VzKHRvdGFsUGFnZXMpIHtcbiAgICB0aGlzLnRvdGFsUGFnZXMgPSB0b3RhbFBhZ2VzO1xuICB9XG5cbiAgc2V0Q3VycmVudFBhZ2UocGFnZSkge1xuICAgIHRoaXMuY3VycmVudFBhZ2UgPSBwYWdlO1xuICB9XG5cbiAgc2V0VGFibGVDYXB0aW9uKHRhYmxlQ2FwdGlvbikge1xuICAgIHRoaXMudGFibGVDYXB0aW9uID0gdGFibGVDYXB0aW9uO1xuICB9XG5cbiAgdXBkYXRlVGFibGUodGFibGVTdGF0ZU9iamVjdCkge1xuICAgIHRoaXMuc2V0Um93cyh0YWJsZVN0YXRlT2JqZWN0LnJlc3VsdHMpO1xuICAgIHRoaXMuc2V0Q3VycmVudFBhZ2UodGFibGVTdGF0ZU9iamVjdC5jdXJyZW50X3BhZ2UpO1xuICAgIHRoaXMuc2V0VG90YWxQYWdlcyh0YWJsZVN0YXRlT2JqZWN0LnRvdGFsX3BhZ2VzKTtcbiAgICB0aGlzLnNldFRhYmxlQ2FwdGlvbih0YWJsZVN0YXRlT2JqZWN0LnRhYmxlX2NhcHRpb24pO1xuICAgIHRoaXMuZW1pdENoYW5nZSgpO1xuICB9XG5cbiAgZW1pdENoYW5nZSgpIHtcbiAgICB0aGlzLmV2ZW50RW1pdHRlci5lbWl0KHRoaXMuQ0hBTkdFX0VWRU5UKTtcbiAgfVxuXG4gIGFkZENoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5ldmVudEVtaXR0ZXIub24odGhpcy5DSEFOR0VfRVZFTlQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5ldmVudEVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIodGhpcy5DSEFOR0VfRVZFTlQsIGNhbGxiYWNrKTtcbiAgfVxufVxuIl19
